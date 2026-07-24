import streamlit as st
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from engine.premium_calculator import calculate_premium
from engine.recommender import recommend_policies, get_segment, load_policies

st.set_page_config(
    page_title="HealthInsure Advisor",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="collapsed"
)

st.markdown("""
<style>
/* Compact layout */
.block-container { padding: 1rem 2rem !important; }
div[data-testid="stMetric"] { background: #f8f9fa; border-radius: 8px; padding: 8px 12px; }
div[data-testid="stMetric"] label { font-size: 12px !important; }
div[data-testid="stMetric"] div[data-testid="stMetricValue"] { font-size: 18px !important; }

/* Policy card */
.policy-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    background: white;
}
.rank-badge {
    display: inline-block;
    background: #1f77b4;
    color: white;
    border-radius: 50%;
    width: 28px; height: 28px;
    text-align: center;
    line-height: 28px;
    font-weight: bold;
    font-size: 13px;
    margin-right: 8px;
}
.score-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}
.score-high { background: #d4edda; color: #155724; }
.score-mid  { background: #fff3cd; color: #856404; }
.score-low  { background: #f8d7da; color: #721c24; }

.feat-yes { color: #28a745; font-size: 13px; }
.feat-no  { color: #aaa;    font-size: 13px; }

.factor-increase { color: #dc3545; }
.factor-decrease { color: #28a745; }
.factor-neutral  { color: #495057; }

.segment-tag {
    display: inline-block;
    background: #e3f2fd;
    color: #1565c0;
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}
</style>
""", unsafe_allow_html=True)


# ── Top bar ──────────────────────────────────────────────────────────────────
col_logo, col_title, col_mode = st.columns([1, 5, 2])
with col_logo:
    st.markdown("## 🏥")
with col_title:
    st.markdown("## HealthInsure Advisor")
    st.caption("Find the best real Indian health insurance policy for your needs")
with col_mode:
    mode = st.radio("Mode", ["👤 Customer", "🧑‍💼 Agent"], horizontal=True, label_visibility="collapsed")

st.markdown("---")
is_agent = "Agent" in mode


# ════════════════════════════════════════════════════════════════════════════
# STEP 1 — PROFILE (compact 3-column form)
# ════════════════════════════════════════════════════════════════════════════
with st.expander("📋 **Step 1: Your Profile**", expanded=True):
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        age = st.number_input("Age", 18, 80, 28)
        gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        city = st.selectbox("City", ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad","Other"])
    with c2:
        annual_income = st.number_input("Annual Income (₹)", 0, 99999999, 500000, step=50000)
        family_members = st.number_input("Members to Cover", 1, 8, 1)
        monthly_budget = st.number_input("Monthly Budget (₹)", 0, 99999, 2000, step=200)
    with c3:
        bmi = st.slider("BMI", 15.0, 45.0, 23.0, 0.5)
        smoker = st.checkbox("Smoker 🚬")
        is_student = st.checkbox("Student 🎓")
        has_children = st.checkbox("Have / Planning Children 👶")
    with c4:
        st.markdown("**Health Conditions**")
        pre_existing = st.checkbox("Pre-existing Disease (diabetes, BP…)")
        chronic = st.checkbox("Chronic Condition (asthma, thyroid…)")
        st.markdown("**Coverage Needs**")
        need_maternity = st.checkbox("Maternity Cover")
        need_critical = st.checkbox("Critical Illness")
        need_international = st.checkbox("International Cover")
        need_mental = st.checkbox("Mental Health")

    if is_agent:
        agent_notes = st.text_input("Agent Notes (optional)")
    else:
        agent_notes = ""

segment = get_segment(age, family_members, has_children, is_student)
SEGMENT_LABELS = {
    "student": "🎓 Student",
    "young_professional": "💼 Young Professional",
    "couple": "💑 Couple",
    "family": "👨‍👩‍👧‍👦 Family",
    "senior": "👴 Senior Citizen"
}

profile = {
    "age": age, "gender": gender, "city": city,
    "annual_income": annual_income, "family_members": family_members,
    "monthly_budget": monthly_budget, "bmi": bmi,
    "smoker": smoker, "is_student": is_student,
    "pre_existing_disease": pre_existing, "chronic_condition": chronic,
    "has_children": has_children, "segment": segment,
    "needs": {
        "maternity": need_maternity, "pre_existing": pre_existing,
        "critical_illness": need_critical, "international": need_international,
        "mental_health": need_mental,
    },
    "agent_notes": agent_notes
}

st.markdown(f"<span class='segment-tag'>Detected Life Stage: {SEGMENT_LABELS.get(segment, segment)}</span>", unsafe_allow_html=True)

run = st.button("🔍 Find Best Policies & Calculate Premium", type="primary", use_container_width=True)

# ════════════════════════════════════════════════════════════════════════════
# RESULTS
# ════════════════════════════════════════════════════════════════════════════
if run:
    policies = load_policies()
    premium_results = [calculate_premium(p, profile) for p in policies]
    ranked = recommend_policies(profile, premium_results)
    premium_map = {r["policy_id"]: r for r in premium_results}

    tab1, tab2, tab3 = st.tabs(["🏆 Recommendations", "💰 Premium Factors", "📊 Compare All"])

    # ── TAB 1: Recommendations ───────────────────────────────────────────
    with tab1:
        top5 = ranked[:5]

        # Quick summary row
        best = top5[0]
        best_pr = premium_map[best["policy"]["id"]]
        st.markdown(f"### Best Match: {best['policy']['provider_logo']} {best['policy']['name']} by {best['policy']['provider']}")

        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Match Score", f"{best['score']}/100")
        m2.metric("Annual Premium", f"₹{best_pr['final_annual_premium']:,.0f}")
        m3.metric("Monthly Premium", f"₹{best_pr['final_monthly_premium']:,.0f}")
        m4.metric("Coverage", f"₹{best['policy']['coverage_amount']:,}")
        m5.metric("CSR", f"{best['policy']['claim_settlement_ratio']}%")

        st.markdown("---")

        # Policy cards
        for i, r in enumerate(top5):
            p = r["policy"]
            pr = premium_map[p["id"]]
            score = r["score"]
            badge = "score-high" if score >= 60 else ("score-mid" if score >= 35 else "score-low")

            with st.container():
                hcol1, hcol2 = st.columns([6, 2])
                with hcol1:
                    medals = ["🥇","🥈","🥉","4️⃣","5️⃣"]
                    st.markdown(
                        f"{medals[i]} **{p['provider_logo']} {p['name']}** — {p['provider']} &nbsp;"
                        f"<span class='score-pill {badge}'>Score: {score}</span> &nbsp;"
                        f"⭐ {p['rating']}/5 &nbsp; CSR: {p['claim_settlement_ratio']}%",
                        unsafe_allow_html=True
                    )
                    st.caption(p["best_for"])
                with hcol2:
                    st.markdown(f"**₹{pr['final_annual_premium']:,.0f}**/yr &nbsp; ₹{pr['final_monthly_premium']:,.0f}/mo")

                # 4 metrics in a row
                mc1, mc2, mc3, mc4 = st.columns(4)
                mc1.metric("Coverage", f"₹{p['coverage_amount']:,}")
                mc2.metric("Copay", f"{p['copay_percent']}%")
                mc3.metric("Hospitals", f"{p['features']['cashless_hospitals']:,}+")
                mc4.metric("NCB", f"{p['features']['no_claim_bonus']}%")

                # Features in one compact line
                feats = p["features"]
                feat_list = [
                    ("🏥 Hosp", feats["hospitalization"]),
                    ("🩺 OPD", feats["outpatient"]),
                    ("🤱 Maternity", feats["maternity"]),
                    ("💊 PED", feats["pre_existing_covered"]),
                    ("🧠 Mental", feats["mental_health"]),
                    ("❤️ Critical", feats["critical_illness"]),
                    ("✈️ Intl", feats["international_cover"]),
                    ("🤖 Robotic", feats["robotic_surgery"]),
                    ("🏠 Home Care", feats["home_care"]),
                    ("🌿 AYUSH", feats["ayush"]),
                ]
                feat_html = " &nbsp;|&nbsp; ".join(
                    f"<span class='feat-yes'>✅ {name}</span>" if val
                    else f"<span class='feat-no'>❌ {name}</span>"
                    for name, val in feat_list
                )
                st.markdown(feat_html, unsafe_allow_html=True)

                # Unique features
                if p.get("unique_features"):
                    st.markdown("**✨ Unique:** " + " · ".join(p["unique_features"]))

                # Why / Watch out — inline
                col_why, col_warn = st.columns(2)
                with col_why:
                    if r["reasons"]:
                        with st.expander(f"✅ Why it suits you ({len(r['reasons'])})"):
                            for reason in r["reasons"]:
                                st.markdown(f"- {reason}")
                with col_warn:
                    if r["penalties"]:
                        with st.expander(f"⚠️ Watch out ({len(r['penalties'])})"):
                            for pen in r["penalties"]:
                                st.markdown(f"- {pen}")

                st.markdown("---")

    # ── TAB 2: Premium Factors ───────────────────────────────────────────
    with tab2:
        st.markdown("### How Your Profile Affects Your Premium")
        st.caption("Showing breakdown for your top recommended policy. Every factor is explained.")

        # Policy selector
        policy_names = [f"{premium_map[r['policy']['id']]['provider']} — {r['policy']['name']}" for r in ranked]
        selected_idx = st.selectbox("Select policy to inspect", range(len(policy_names)), format_func=lambda i: policy_names[i])
        sel_pr = premium_map[ranked[selected_idx]["policy"]["id"]]
        factors = sel_pr["factors"]

        # Visual bar chart using native st.bar_chart
        import pandas as pd

        # Summary metrics
        sm1, sm2, sm3 = st.columns(3)
        sm1.metric("Base Premium", f"₹{sel_pr['base_premium']:,.0f}")
        sm2.metric("Your Annual Premium", f"₹{sel_pr['final_annual_premium']:,.0f}")
        sm3.metric("Total Loading", f"{round((sel_pr['total_multiplier']-1)*100, 1)}%",
                   delta=f"₹{sel_pr['final_annual_premium'] - sel_pr['base_premium']:,.0f} added")

        st.markdown("---")

        # Factor table
        st.markdown("#### Factor-by-Factor Breakdown")

        running = sel_pr["base_premium"]
        for f in factors:
            if f["name"] == "Base Premium":
                col_icon, col_name, col_pct, col_impact, col_running, col_explain = st.columns([0.5, 2.5, 1, 1.2, 1.2, 4])
                col_icon.markdown(f["icon"])
                col_name.markdown(f"**{f['name']}**")
                col_pct.markdown("—")
                col_impact.markdown(f"**₹{f['impact']:,.0f}**")
                col_running.markdown(f"₹{running:,.0f}")
                col_explain.caption(f["explanation"])
            else:
                running = round(running * (1 + f["pct"] / 100), 0)
                col_icon, col_name, col_pct, col_impact, col_running, col_explain = st.columns([0.5, 2.5, 1, 1.2, 1.2, 4])
                col_icon.markdown(f["icon"])
                col_name.markdown(f["name"])
                if f["direction"] == "increase":
                    col_pct.markdown(f"<span class='factor-increase'>+{f['pct']}%</span>", unsafe_allow_html=True)
                    col_impact.markdown(f"<span class='factor-increase'>+₹{f['impact']:,.0f}</span>", unsafe_allow_html=True)
                else:
                    col_pct.markdown(f"<span class='factor-decrease'>{f['pct']}%</span>", unsafe_allow_html=True)
                    col_impact.markdown(f"<span class='factor-decrease'>-₹{abs(f['impact']):,.0f}</span>", unsafe_allow_html=True)
                col_running.markdown(f"₹{running:,.0f}")
                col_explain.caption(f["explanation"])

        st.markdown("---")

        # Visual chart
        st.markdown("#### Premium Impact Chart")
        chart_factors = [f for f in factors if f["name"] != "Base Premium" and f["impact"] != 0]
        if chart_factors:
            df = pd.DataFrame({
                "Factor": [f["name"] for f in chart_factors],
                "Impact (₹)": [f["impact"] for f in chart_factors]
            }).set_index("Factor")
            st.bar_chart(df)
        else:
            st.info("No loading factors apply to your profile — you get the base premium!")

        # General education section
        with st.expander("📚 How are health insurance premiums calculated in India?"):
            st.markdown("""
**IRDAI (Insurance Regulatory and Development Authority of India)** sets guidelines on how insurers can load premiums.

| Factor | Typical Loading | Why |
|--------|----------------|-----|
| Age 35–44 | +15% | Rising lifestyle disease risk |
| Age 45–54 | +30% | Hospitalisation probability doubles |
| Age 55–64 | +55% | Chronic conditions become common |
| Age 65+ | +80% | Highest risk bracket |
| Overweight BMI (25–29.9) | +10% | BP, diabetes, joint risk |
| Obese BMI (30–34.9) | +25% | Cardiac, diabetes, sleep apnea |
| Smoker | +20% | 2–3x hospitalisation risk |
| Pre-existing Disease | +25–40% | Higher claim probability |
| Chronic Condition | +15% | Ongoing treatment costs |
| Metro City | +15% | Higher hospital costs |
| Family Floater (2 members) | +55% | Shared risk pool |
| Family Floater (4 members) | +145% | Larger shared risk |

**No-Claim Bonus (NCB):** If you don't make a claim in a year, your sum insured increases by 10–100% (varies by plan) at no extra cost.

**Section 80D Tax Benefit:** Premiums paid are deductible — ₹25,000/yr for self/family, ₹50,000/yr for senior citizen parents.
            """)

    # ── TAB 3: Compare All ───────────────────────────────────────────────
    with tab3:
        st.markdown("### All Policies — Side by Side")

        rows = []
        for r in ranked:
            p = r["policy"]
            pr = premium_map[p["id"]]
            f = p["features"]
            rows.append({
                "Rank": ranked.index(r) + 1,
                "Policy": p["name"],
                "Provider": p["provider"],
                "Score": r["score"],
                "Annual (₹)": int(pr["final_annual_premium"]),
                "Monthly (₹)": int(pr["final_monthly_premium"]),
                "Coverage (₹)": p["coverage_amount"],
                "CSR %": p["claim_settlement_ratio"],
                "Hospitals": p["features"]["cashless_hospitals"],
                "Copay": f"{p['copay_percent']}%",
                "NCB %": f["no_claim_bonus"],
                "OPD": "✅" if f["outpatient"] else "❌",
                "Maternity": "✅" if f["maternity"] else "❌",
                "PED": "✅" if f["pre_existing_covered"] else "❌",
                "Mental": "✅" if f["mental_health"] else "❌",
                "Critical": "✅" if f["critical_illness"] else "❌",
                "Intl": "✅" if f["international_cover"] else "❌",
                "Rating": p["rating"],
            })

        df_all = pd.DataFrame(rows)
        st.dataframe(df_all, use_container_width=True, hide_index=True,
                     column_config={
                         "Score": st.column_config.ProgressColumn("Score", min_value=0, max_value=100),
                         "Annual (₹)": st.column_config.NumberColumn("Annual (₹)", format="₹%d"),
                         "Monthly (₹)": st.column_config.NumberColumn("Monthly (₹)", format="₹%d"),
                         "Coverage (₹)": st.column_config.NumberColumn("Coverage (₹)", format="₹%d"),
                     })

        # Agent export
        if is_agent:
            st.markdown("---")
            st.markdown("#### 📄 Export Customer Summary")
            top = ranked[0]
            top_pr = premium_map[top["policy"]["id"]]
            summary = {
                "customer_profile": {k: v for k, v in profile.items() if k not in ("needs",)},
                "detected_segment": segment,
                "top_recommendation": {
                    "policy": top["policy"]["name"],
                    "provider": top["policy"]["provider"],
                    "match_score": top["score"],
                    "annual_premium": top_pr["final_annual_premium"],
                    "monthly_premium": top_pr["final_monthly_premium"],
                    "reasons": top["reasons"],
                    "watch_out": top["penalties"]
                },
                "all_ranked": [
                    {"rank": i+1, "policy": r["policy"]["name"], "score": r["score"],
                     "annual_premium": premium_map[r["policy"]["id"]]["final_annual_premium"]}
                    for i, r in enumerate(ranked)
                ]
            }
            st.download_button("⬇️ Download Summary (JSON)", data=json.dumps(summary, indent=2),
                               file_name="customer_summary.json", mime="application/json")
