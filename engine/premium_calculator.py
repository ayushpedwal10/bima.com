"""
Premium calculation engine — based on real IRDAI loading guidelines.
Each factor returns a label, impact amount, percentage, and explanation.
"""

METRO_CITIES = {"Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata"}


def calculate_premium(policy: dict, profile: dict) -> dict:
    base = policy["annual_premium_base"]
    factors = []
    multiplier = 1.0

    def add_factor(name, pct_change, explanation, icon):
        nonlocal multiplier
        m = 1 + pct_change / 100
        multiplier *= m
        impact = round(base * pct_change / 100, 0)
        factors.append({
            "name": name,
            "pct": pct_change,
            "impact": impact,
            "explanation": explanation,
            "icon": icon,
            "direction": "increase" if pct_change > 0 else ("decrease" if pct_change < 0 else "neutral")
        })

    # Base
    factors.append({
        "name": "Base Premium",
        "pct": 0,
        "impact": base,
        "explanation": f"Standard annual premium for {policy['name']} (₹{policy['coverage_amount']:,} cover, age 30, non-smoker, healthy BMI, Tier-2 city, single person)",
        "icon": "📋",
        "direction": "neutral"
    })

    # Age
    age = profile.get("age", 30)
    if age < 25:
        add_factor("Age Discount (Under 25)", -15,
            "Young adults have fewer health risks. Insurers offer a 15% discount for under-25s.", "🧒")
    elif age < 35:
        pass  # standard, no change
    elif age < 45:
        add_factor("Age Loading (35–44 yrs)", +15,
            "Risk of lifestyle diseases rises after 35. Insurers add 15% loading.", "📅")
    elif age < 55:
        add_factor("Age Loading (45–54 yrs)", +30,
            "Probability of hospitalisation doubles in this bracket. 30% loading applied.", "📅")
    elif age < 65:
        add_factor("Age Loading (55–64 yrs)", +55,
            "Chronic conditions become common. Insurers load 55% for this age group.", "📅")
    else:
        add_factor("Age Loading (65+ yrs)", +80,
            "Senior citizens have the highest hospitalisation risk. 80% loading applied.", "👴")

    # BMI
    bmi = profile.get("bmi", 22.0)
    if bmi < 18.5:
        add_factor("Underweight BMI Loading", +5,
            f"BMI {bmi} is below 18.5 (underweight). Linked to immunity issues and nutritional deficiencies.", "⚖️")
    elif bmi < 25:
        pass  # healthy, no change
    elif bmi < 30:
        add_factor("Overweight BMI Loading", +10,
            f"BMI {bmi} is in the overweight range (25–29.9). Increases risk of BP, diabetes, and joint issues.", "⚖️")
    elif bmi < 35:
        add_factor("Obese BMI Loading", +25,
            f"BMI {bmi} indicates obesity (30–34.9). Significantly raises risk of cardiac events, diabetes, and sleep apnea.", "⚖️")
    else:
        add_factor("Severely Obese BMI Loading", +40,
            f"BMI {bmi} is severely obese (35+). Very high risk of multiple comorbidities.", "⚖️")

    # Smoker
    if profile.get("smoker", False):
        add_factor("Smoker Loading", +20,
            "Smokers are 2–3x more likely to be hospitalised for cardiac, respiratory, and cancer-related conditions. IRDAI allows up to 25% loading.", "🚬")

    # Pre-existing disease
    if profile.get("pre_existing_disease", False):
        add_factor("Pre-existing Disease Loading", +30,
            "Conditions like diabetes, hypertension, or thyroid disorders increase claim probability. Insurers load 25–40% for PED.", "💊")

    # Chronic condition
    if profile.get("chronic_condition", False):
        add_factor("Chronic Condition Loading", +15,
            "Ongoing conditions like asthma, PCOD, or arthritis require regular treatment. 15% loading applied.", "🏥")

    # Family members
    members = profile.get("family_members", 1)
    if members == 2:
        add_factor("Family Floater (2 members)", +55,
            "Adding a second member to a floater plan increases the shared risk pool. Premium rises ~55%.", "👫")
    elif members == 3:
        add_factor("Family Floater (3 members)", +105,
            "3-member floater covers spouse + 1 child. Premium roughly doubles.", "👨‍👩‍👦")
    elif members == 4:
        add_factor("Family Floater (4 members)", +145,
            "4-member floater (couple + 2 kids). Premium is ~2.5x the individual base.", "👨‍👩‍👧‍👦")
    elif members >= 5:
        add_factor(f"Family Floater ({members} members)", +175,
            f"Large family floater with {members} members. Premium is ~2.75x the individual base.", "👨‍👩‍👧‍👦")

    # City tier
    city = profile.get("city", "Other")
    if city in METRO_CITIES:
        add_factor("Metro City Loading", +15,
            f"{city} is a metro city where hospital costs are 15–20% higher than Tier-2 cities. Insurers pass this on as a loading.", "🏙️")

    final_annual = round(base * multiplier, 0)
    final_monthly = round(final_annual / 12, 0)

    return {
        "policy_id": policy["id"],
        "policy_name": policy["name"],
        "provider": policy["provider"],
        "base_premium": base,
        "final_annual_premium": final_annual,
        "final_monthly_premium": final_monthly,
        "factors": factors,
        "total_multiplier": round(multiplier, 3)
    }
