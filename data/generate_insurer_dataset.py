"""
Generate a project-level insurer analytics dataset from policies.json
Adds realistic synthetic fields with logical consistency and scoring.
"""

import json
import random
import math

random.seed(42)

# Load existing policies
with open("policies.json", "r") as f:
    policies = json.load(f)

# Deduplicate insurers (some providers appear in multiple policies)
# We'll aggregate at the insurer/provider level
insurer_map = {}
for p in policies:
    provider = p["provider"]
    if provider not in insurer_map:
        insurer_map[provider] = {
            "insurer_name": provider,
            "icr": None,
            "csr": p["claim_settlement_ratio"],
            "avg_premium_base": p["annual_premium_base"],
            "network_hospitals_raw": p["network_hospitals"],
        }
    else:
        # Average CSR and premium if multiple policies
        existing = insurer_map[provider]
        existing["csr"] = round((existing["csr"] + p["claim_settlement_ratio"]) / 2, 2)
        existing["avg_premium_base"] = round(
            (existing["avg_premium_base"] + p["annual_premium_base"]) / 2
        )
        existing["network_hospitals_raw"] = max(
            existing["network_hospitals_raw"], p["network_hospitals"]
        )

# Assign realistic ICR values (Incurred Claim Ratio) based on CSR
# Higher CSR generally correlates with higher ICR (more claims paid)
ICR_MAP = {
    "HDFC ERGO": 92.4,
    "Niva Bupa": 88.7,
    "Star Health": 85.1,
    "Care Health Insurance": 89.3,
    "Aditya Birla Health": 91.2,
    "ICICI Lombard": 83.6,
    "Bajaj Allianz": 90.5,
}

def normalize(value, min_val, max_val, new_min=0, new_max=100):
    """Normalize a value to a new range."""
    if max_val == min_val:
        return new_min
    return round(new_min + (value - min_val) / (max_val - min_val) * (new_max - new_min), 2)

def get_claim_strength(icr):
    if icr >= 90:
        return "High"
    elif icr >= 80:
        return "Moderate"
    else:
        return "Low"

def generate_insurer_record(insurer_name, csr, icr, avg_premium_base, network_hospitals_raw):
    """Generate a full insurer analytics record with logical consistency."""

    # Premium tier: normalize premium to 0-1 scale for quality adjustments
    # Higher premium → better service
    premium_tier = (avg_premium_base - 5000) / (30000 - 5000)  # 0 to 1

    # claims_registered: 50,000 – 5,00,000
    # Larger insurers (higher network) tend to have more claims
    network_factor = (network_hospitals_raw - 3000) / (20000 - 3000)
    base_claims = 50000 + int((network_factor * 0.6 + random.uniform(0.1, 0.4)) * 450000)
    claims_registered = round(base_claims / 1000) * 1000  # round to nearest 1000

    # claims_settled ≈ CSR × claims_registered
    csr_fraction = csr / 100
    claims_settled = round(csr_fraction * claims_registered)

    # claims_rejected: 5–10% of registered
    rejection_rate = random.uniform(0.05, 0.10)
    # Adjust: higher CSR → lower rejection
    rejection_rate = rejection_rate * (1 - (csr - 80) / 40 * 0.3)
    rejection_rate = max(0.05, min(0.10, rejection_rate))
    claims_rejected = round(rejection_rate * claims_registered)

    # claims_pending: 1–5% of registered
    pending_rate = random.uniform(0.01, 0.05)
    claims_pending = round(pending_rate * claims_registered)

    # Ensure settled + rejected + pending = registered
    # Recalculate settled to maintain consistency
    claims_settled = claims_registered - claims_rejected - claims_pending

    # avg_settlement_time: 5–20 days
    # Higher premium → lower settlement time (better service)
    base_time = 20 - (premium_tier * 10)  # 10–20 days base
    noise = random.uniform(-2, 2)
    avg_settlement_time = round(max(5, min(20, base_time + noise)), 1)

    # avg_claim_amount: ₹50,000 – ₹5,00,000
    # Higher coverage plans → higher avg claim
    avg_claim_amount = round(random.uniform(50000, 500000) / 1000) * 1000

    # avg_premium: ₹5,000 – ₹25,000 yearly
    # Use actual base premium with slight variation
    avg_premium = round(max(5000, min(25000, avg_premium_base * random.uniform(0.95, 1.05))) / 100) * 100

    # network_hospitals: 3,000 – 12,000 (cap at 12,000 per spec)
    network_hospitals = min(12000, max(3000, network_hospitals_raw))

    # claim_strength derived field
    claim_strength = get_claim_strength(icr)

    # Scoring formula: score = (0.5 × icr) + (0.3 × csr) + (0.2 × (100 - avg_settlement_time))
    raw_score = (0.5 * icr) + (0.3 * csr) + (0.2 * (100 - avg_settlement_time))

    return {
        "insurer_name": insurer_name,
        "icr": icr,
        "csr": csr,
        "claims_registered": claims_registered,
        "claims_settled": claims_settled,
        "claims_rejected": claims_rejected,
        "claims_pending": claims_pending,
        "avg_settlement_time": avg_settlement_time,
        "avg_claim_amount": avg_claim_amount,
        "avg_premium": avg_premium,
        "network_hospitals": network_hospitals,
        "claim_strength": claim_strength,
        "_raw_score": raw_score,
    }

# Build records
records = []
for provider, data in insurer_map.items():
    icr = ICR_MAP.get(provider, round(random.uniform(80, 95), 1))
    rec = generate_insurer_record(
        insurer_name=provider,
        csr=data["csr"],
        icr=icr,
        avg_premium_base=data["avg_premium_base"],
        network_hospitals_raw=data["network_hospitals_raw"],
    )
    records.append(rec)

# Normalize scores to 0–100
raw_scores = [r["_raw_score"] for r in records]
min_score = min(raw_scores)
max_score = max(raw_scores)

for rec in records:
    rec["score"] = normalize(rec["_raw_score"], min_score, max_score, 0, 100)
    del rec["_raw_score"]

# Sort by score descending
records.sort(key=lambda x: x["score"], reverse=True)

# Validation checks
print("=== Dataset Validation ===")
for r in records:
    total = r["claims_settled"] + r["claims_rejected"] + r["claims_pending"]
    assert total == r["claims_registered"], f"Claim totals mismatch for {r['insurer_name']}"
    assert 3000 <= r["network_hospitals"] <= 12000, f"Network hospitals out of range for {r['insurer_name']}"
    assert 5000 <= r["avg_premium"] <= 25000, f"Premium out of range for {r['insurer_name']}"
    assert 5 <= r["avg_settlement_time"] <= 20, f"Settlement time out of range for {r['insurer_name']}"
    assert 0 <= r["score"] <= 100, f"Score out of range for {r['insurer_name']}"
    print(f"  ✓ {r['insurer_name']}: score={r['score']}, claim_strength={r['claim_strength']}, settled={r['claims_settled']}/{r['claims_registered']}")

# Save output
output_path = "insurers.json"
with open(output_path, "w") as f:
    json.dump(records, f, indent=2)

print(f"\n✅ Dataset saved to data/{output_path} ({len(records)} insurers)")
