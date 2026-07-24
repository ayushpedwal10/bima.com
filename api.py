"""
Flask REST API — Dynamic Premium Engine
Exposes the Python calculation engine to the React frontend.

Endpoints:
  POST /api/quote    — calculate premiums + rank all 10 policies for a profile
  GET  /api/health   — liveness check
  GET  /api/policies — return all policy metadata

Run:
  pip install flask flask-cors
  python api.py

The React frontend (via Vite proxy) calls /api/quote automatically.
Falls back to the built-in JS engine if this server is not running.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from engine.premium_calculator import calculate_premium
from engine.recommender import recommend_policies, get_segment, load_policies

app = Flask(__name__)
# Keep the browser API surface intentionally small. Configure the deployed
# frontend URL in Render as FRONTEND_URL (for example, https://app.vercel.app).
cors_origins = [
    "http://localhost:5173",
    "http://localhost:4173",
]
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    cors_origins.append(frontend_url)
CORS(app, origins=cors_origins)


# ── Helpers ──────────────────────────────────────────────────────────────────

def _map_frontend_profile(body: dict) -> dict:
    """
    Translate React wizard profile keys → Python engine profile keys.
    The JS and Python engines use slightly different field names.
    """
    return {
        "age":                  body.get("age", 28),
        "gender":               body.get("gender", "Male"),
        "city":                 body.get("city", "Other"),
        "annual_income":        body.get("income", 500000),
        "family_members":       body.get("members", 1),
        "monthly_budget":       body.get("budget", 2000),
        "bmi":                  body.get("bmi", 22.0),
        "smoker":               body.get("smoker", False),
        "is_student":           body.get("isStudent", False),
        "pre_existing_disease": body.get("ped", False),
        "chronic_condition":    body.get("chronic", False),
        "has_children":         body.get("hasChildren", False),
        "needs": {
            "maternity":       body.get("needMaternity", False),
            "pre_existing":    body.get("ped", False),
            "critical_illness":body.get("needCritical", False),
            "international":   body.get("needIntl", False),
            "mental_health":   body.get("needMental", False),
        },
        "priority":             body.get("priority", "claims"),
    }


def _format_factor(f: dict) -> dict:
    """Normalise Python factor dict to the shape the React app expects."""
    return {
        "icon":    f.get("icon", "📋"),
        "name":    f.get("name", ""),
        "pct":     f.get("pct", 0),
        "impact":  int(f.get("impact", 0)),
        "why":     f.get("explanation", ""),
        "dir":     "up" if f.get("direction") == "increase"
                   else "down" if f.get("direction") == "decrease"
                   else "neutral",
    }


def _format_premium_result(r: dict) -> dict:
    """Format a Python premium result into the React premiumMap shape."""
    annual  = int(r["final_annual_premium"])
    monthly = int(r["final_monthly_premium"])
    gst     = round(annual * 0.18)
    return {
        "policyId":     r["policy_id"],
        "base":         int(r["base_premium"]),
        "annual":       annual,
        "monthly":      monthly,
        "gst":          gst,
        "totalWithGST": annual + gst,
        "mult":         round(r["total_multiplier"], 3),
        "factors":      [_format_factor(f) for f in r.get("factors", [])],
        "isRealRate":   True,   # Python engine uses real rate tables
        "source":       "python_api",
    }


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return jsonify({ "status": "ok", "engine": "python", "version": "1.0.0" })


@app.get("/api/policies")
def get_policies():
    """Return all policy metadata (useful for any future admin UI)."""
    try:
        policies = load_policies()
        return jsonify({ "policies": policies, "count": len(policies) })
    except Exception as e:
        return jsonify({ "error": str(e) }), 500


@app.post("/api/quote")
def quote():
    """
    Calculate premiums and rank all 10 policies for the given user profile.

    Request body (JSON) — matches React wizard `data` shape:
    {
      "age": 28, "gender": "Male", "city": "Mumbai",
      "income": 500000, "members": 1, "budget": 2000,
      "bmi": 22, "smoker": false, "ped": false, "chronic": false,
      "isStudent": false, "hasChildren": false,
      "needMaternity": false, "needCritical": false,
      "needIntl": false, "needMental": false,
      "priority": "claims"
    }

    Response:
    {
      "source": "python_api",
      "profile": { ...mapped profile... },
      "segment": "young_professional",
      "premiumMap": { "P001": {...}, "P002": {...}, ... },
      "ranked": [
        { "policyId": "P001", "score": 82, "reasons": [...], "warnings": [...] },
        ...
      ]
    }
    """
    body = request.get_json(silent=True) or {}

    try:
        profile = _map_frontend_profile(body)

        # Detect segment
        segment = get_segment(
            profile["age"],
            profile["family_members"],
            profile["has_children"],
            profile["is_student"],
        )
        profile["segment"] = segment

        # Load policies and calculate premiums
        policies         = load_policies()
        premium_results  = [calculate_premium(p, profile) for p in policies]

        # Rank
        ranked_raw = recommend_policies(profile, premium_results)

        # Format premiumMap
        premium_map = {
            r["policy_id"]: _format_premium_result(r)
            for r in premium_results
        }

        # Format ranked list (just ids + scores + reasons — React already has policy metadata)
        ranked = [
            {
                "policyId": r["policy"]["id"],
                "score":    r["score"],
                "reasons":  r["reasons"],
                "warnings": r["penalties"],
            }
            for r in ranked_raw
        ]

        return jsonify({
            "source":     "python_api",
            "segment":    segment,
            "premiumMap": premium_map,
            "ranked":     ranked,
        })

    except Exception as e:
        # Return error — React will fall back to JS engine
        return jsonify({ "error": str(e) }), 500


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    print(f"✅  bima.com Premium API running on port {port}")
    print("     POST /api/quote  — premium calculation")
    print("     GET  /api/health — liveness check")
    app.run(host="0.0.0.0", port=port, debug=False)
