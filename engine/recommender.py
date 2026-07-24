"""
Policy recommendation engine.
Scores each policy based on:
  - Segment match
  - Age eligibility
  - Income fit
  - Feature match to user needs
  - Budget fit
"""
import json
from pathlib import Path

POLICIES_PATH = Path(__file__).parent.parent / "data" / "policies.json"


def load_policies():
    with open(POLICIES_PATH) as f:
        return json.load(f)


def get_segment(age: int, family_members: int, has_children: bool, is_student: bool) -> str:
    if is_student:
        return "student"
    if age >= 55:
        return "senior"
    if family_members >= 3 or has_children:
        return "family"
    if family_members == 2:
        return "couple"
    return "young_professional"


def score_policy(policy: dict, profile: dict, calculated_premium: float) -> dict:
    score = 0
    reasons = []
    penalties = []

    segment = profile.get("segment", "young_professional")
    age = profile.get("age", 30)
    income = profile.get("annual_income", 500000)
    budget = profile.get("monthly_budget", 99999) * 12  # convert to annual

    # Segment match (highest weight)
    if segment in policy["target_segments"]:
        score += 40
        reasons.append(f"Designed for your life stage ({segment.replace('_', ' ').title()})")
    else:
        score += 10

    # Age eligibility
    age_min, age_max = policy["age_range"]
    if age_min <= age <= age_max:
        score += 15
        reasons.append("Age is within eligible range")
    else:
        score -= 20
        penalties.append(f"Age {age} is outside eligible range ({age_min}-{age_max})")

    # Budget fit
    if calculated_premium <= budget:
        budget_ratio = calculated_premium / budget if budget > 0 else 1
        if budget_ratio <= 0.5:
            score += 15
            reasons.append("Well within your budget")
        elif budget_ratio <= 0.8:
            score += 10
            reasons.append("Fits your budget comfortably")
        else:
            score += 5
            reasons.append("Fits within your budget")
    else:
        overage_pct = round((calculated_premium - budget) / budget * 100)
        score -= 15
        penalties.append(f"Exceeds your budget by ~{overage_pct}%")

    # Feature needs matching
    features = policy["features"]
    needs = profile.get("needs", {})

    if needs.get("maternity") and features.get("maternity"):
        score += 10
        reasons.append("Includes maternity coverage you need")
    elif needs.get("maternity") and not features.get("maternity"):
        score -= 15
        penalties.append("Missing maternity coverage")

    if needs.get("pre_existing") and features.get("pre_existing_covered"):
        score += 12
        reasons.append("Covers pre-existing diseases")
    elif needs.get("pre_existing") and not features.get("pre_existing_covered"):
        score -= 20
        penalties.append("Does NOT cover pre-existing diseases — important for you")

    if needs.get("critical_illness") and features.get("critical_illness"):
        score += 8
        reasons.append("Critical illness cover included")
    elif needs.get("critical_illness") and not features.get("critical_illness"):
        score -= 10
        penalties.append("No critical illness cover")

    if needs.get("international") and features.get("international_cover"):
        score += 8
        reasons.append("International coverage included")
    elif needs.get("international") and not features.get("international_cover"):
        score -= 8
        penalties.append("No international coverage")

    if needs.get("dental") and features.get("dental"):
        score += 5
        reasons.append("Dental coverage included")

    if needs.get("mental_health") and features.get("mental_health"):
        score += 5
        reasons.append("Mental health coverage included")

    # Hospital network size
    hospitals = features.get("cashless_hospitals", 0)
    if hospitals >= 1000:
        score += 8
        reasons.append(f"Large cashless hospital network ({hospitals}+)")
    elif hospitals >= 500:
        score += 5
        reasons.append(f"Good cashless hospital network ({hospitals})")
    else:
        score += 2

    # No claim bonus
    ncb = features.get("no_claim_bonus", 0)
    if ncb >= 20:
        score += 5
        reasons.append(f"High no-claim bonus ({ncb}%)")
    elif ncb >= 10:
        score += 3

    # Provider rating
    rating = policy.get("rating", 3.0)
    score += int((rating - 3.0) * 5)

    return {
        "policy": policy,
        "score": max(score, 0),
        "reasons": reasons,
        "penalties": penalties,
        "calculated_annual_premium": calculated_premium
    }


def recommend_policies(profile: dict, premium_results: list) -> list:
    """
    profile: user profile dict
    premium_results: list of premium calculation results (one per policy)
    Returns sorted list of scored policies.
    """
    premium_map = {r["policy_id"]: r["final_annual_premium"] for r in premium_results}
    policies = load_policies()

    scored = []
    for policy in policies:
        calc_premium = premium_map.get(policy["id"], policy["annual_premium_base"])
        result = score_policy(policy, profile, calc_premium)
        scored.append(result)

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored
