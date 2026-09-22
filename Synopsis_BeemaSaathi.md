# Synopsis

## On

# BeemaSaathi: AI-Based Health Insurance Advisory and Recommendation System

---

**Group ID:** TYCC102 *(update as assigned)*

**Team Details**

| Enrolment No. | Name of Student | Class |
|---|---|---|
| ADT23SOCB0284 | Ayush Pedwal | CC-2 |
| ADT23SOCB1323 | Virendrapratap Karad | CC-2 |

**Under the Guidance of**

**Dr. Ganesh Pathak**

---

**Department of Computer Science & Engineering**

**MIT School of Computing**

**Sem-1 | A.Y. 2026-27**

---

## 1. Title of the Project

**"BeemaSaathi: AI-Based Health Insurance Advisory and Recommendation System"**

---

## 2. Abstract

Health insurance selection in India remains a deeply confusing and opaque process for the majority of the population. With over 28 active insurers, hundreds of plan variants, and complex policy wordings involving terms such as co-payment, waiting periods, sub-limits, and claim settlement ratios, most individuals either avoid purchasing insurance altogether or make uninformed decisions that leave them underinsured. The resulting gap — between what people buy and what they actually need — contributes to financial catastrophe at the time of medical emergencies.

This project proposes the design and development of **BeemaSaathi**, a secure, scalable, and AI-powered health insurance advisory platform capable of analysing a user's life stage, health profile, coverage requirements, and financial constraints to generate personalised, ranked plan recommendations with full transparency. The system integrates a rule-based multi-factor scoring engine, an AI Insights generation layer, an interactive What-If premium simulator, a disease and hospital coverage checker, a tax savings calculator, a medical inflation projector, a portability guide, and an employer cover adequacy checker — all built on verified IRDAI-published data.

The platform is implemented using React 19, Vite 8, Tailwind CSS 4, Recharts, and Leaflet for the frontend, with a Python Flask REST API serving as an optional high-accuracy backend engine and a JavaScript fallback engine ensuring uninterrupted service. The system follows a production-ready architecture with role-based modes (Customer/Agent), PDF report export, and a glossary system for financial literacy.

By combining structured actuarial data, IRDAI-verified claim settlement ratios, and a conversational AI insights engine, BeemaSaathi delivers accurate, fair, and data-driven insurance recommendations while significantly reducing the cognitive burden on end users. The final outcome is a reliable digital advisory platform that promotes responsible insurance adoption and financial protection across India.

---

## 3. Introduction / Background

Health insurance penetration in India stood at approximately 37% of the population as of 2024, with the Insurance Regulatory and Development Authority of India (IRDAI) reporting over 43,661 individual health insurance policies across major insurers. Despite this scale, the average Indian policyholder lacks the analytical tools and domain knowledge to compare plans effectively. Most purchasing decisions are made based on agent recommendations, brand familiarity, or lowest price — none of which guarantee adequate coverage.

The existing digital alternatives — primarily insurance aggregator portals — present plan data in tabular form without contextual guidance. They show what a plan costs but fail to explain what it actually covers for a specific individual, why one plan is better than another for their profile, or what risks they face at the time of a claim.

With the advancement of rule-based AI, natural language generation, and data-driven scoring algorithms, it is now possible to build advisory systems that reason over a user's complete health and financial profile and produce expert-level guidance without human intervention. Such systems, when grounded in verified regulatory data, can dramatically improve the quality of insurance decisions.

This project bridges this gap by proposing a secure, explainable, and scalable AI-enabled health insurance advisory system built on published IRDAI rate cards, claim settlement data, and a proprietary 10-plan comparison dataset covering the major health insurance products available in India as of 2024-25.

---

## 4. Problem Definition

Current health insurance advisory processes in India lack a secure, automated, and explainable digital framework capable of:

- Personalising plan recommendations based on the user's life stage, health risk profile, city, income, and coverage needs
- Generating transparent, human-readable justifications for why one plan is recommended over another
- Providing actionable financial insights such as premium loading analysis, medical inflation projection, tax savings under Section 80D, and portability guidance
- Warning users about common claim rejection traps specific to their recommended insurer
- Offering a real-time premium simulator that shows how lifestyle changes affect cost

This results in uninformed purchasing decisions, inadequate coverage, and financial vulnerability at the time of hospitalisation.

---

## 5. Objectives

1. To design and implement a secure AI-enabled web-based health insurance advisory platform.
2. To build a multi-factor policy scoring engine using IRDAI-verified data including Claim Settlement Ratio (CSR), hospital network size, waiting periods, and coverage features.
3. To develop a conversational AI Insights engine that generates personalised, second-person narrative analysis for each user based on their specific profile.
4. To implement an interactive What-If Premium Simulator showing real-time premium changes across all 10 plans as users modify age, BMI, risk factors, and family size.
5. To provide a Disease Coverage Checker mapping 31 diseases across 12 categories to their coverage status in each plan.
6. To integrate a Hospital Network Finder with an interactive map showing cashless empanelment across 64 hospitals in 8 major Indian cities.
7. To build a Medical Inflation Projector and Sum Insured Adequacy Calculator that quantify the financial risk of being underinsured.
8. To provide a Section 80D Tax Savings Calculator, an Upgrade Checker, a Portability Guide, and an Employer Cover Checker as supplementary advisory tools.
9. To deploy the platform with a Python Flask API backend and a JavaScript fallback engine ensuring high availability.

---

## 6. Scope of the Project

The project focuses on the individual health insurance market in India, covering 10 major plans from HDFC ERGO, Niva Bupa, Star Health, Care Health, Aditya Birla Health, ICICI Lombard, Bajaj Allianz, Tata AIG, and Reliance General. The system provides:

- Personalised plan recommendation across five life stage segments: Student, Young Professional, Couple, Family, and Senior Citizen
- AI-driven insights and scoring grounded in published rate cards for the financial year 2024-25
- Educational tools covering disease coverage, hospital networks, tax savings, portability, and premium simulation

The platform enhances decision-making accuracy and transparency but does not replace licensed insurance advisory services or constitute financial advice. The architecture is designed to be modular, scalable, and deployable on cloud infrastructure (Vercel + Render) for production use.

---

## 7. Proposed System

BeemaSaathi is a comprehensive AI-enabled health insurance advisory platform that integrates personalised profiling, multi-factor scoring, AI-driven insights, and interactive financial tools within a unified digital experience.

### System Workflow

```
User Profile Collection (3-Step Wizard)
        ↓
Premium Calculation Engine (Python API / JS Fallback)
        ↓
Multi-Factor Policy Scoring & Ranking
        ↓
AI Insights Generation (Personalised Narrative Cards)
        ↓
Interactive Tools (Hospital Finder, Disease Checker, What-If, Tax, Portability)
        ↓
PDF Report Export / Get Exact Quote (Insurer Website)
```

### Core Modules

**1. Profile Wizard (3-Step)**
Collects life stage, age, gender, city, income, BMI, risk factors (smoker, PED, chronic), family size, budget, and specific coverage needs (maternity, critical illness, OPD, mental health, international, PED). Includes a Live Profile Card that updates in real time as the user progresses through each step.

**2. Premium Calculation Engine**
Applies IRDAI-regulated loading factors — age bands, BMI categories, smoker loading (+20%), pre-existing disease loading (+30%), chronic condition loading (+15%), metro city surcharge (+10%), and family floater multipliers — on top of published base rate tables for sum insured values between ₹5L and ₹25L.

**3. Multi-Factor Scoring & Ranking Engine**
Scores each of the 10 plans on segment fit, age eligibility, budget adherence, CSR performance, coverage needs match, hospital network quality, NCB, and market popularity signals derived from a dataset of 43,661 real Indian health insurance policies. Rankings are adjusted based on the user's declared priority: highest claim reliability, lowest premium, or maximum coverage.

**4. AI Insights Engine**
Generates up to 10 personalised insight cards including: Our Verdict, Claim Trap to Avoid, The Money Angle, PED Waiting Period Alert, Head-to-Head Comparison (with live comparison table), Blind Spot analysis, City-specific hospital network guidance, Maternity cover assessment, Smoker premium breakdown, and a Before You Buy action plan. All cards speak in second person using the user's exact age, city, risk profile, and financial data.

**5. Hospital Network Finder**
Interactive Leaflet map showing 64 hospitals across 8 cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad) with cashless coverage status per plan, hospital type filters (Government, Private, Super Specialty, Multispeciality), and a plan coverage legend.

**6. Disease Coverage Checker**
Maps 31 diseases across 12 categories (Chronic, Cancer, Cardiac, Neurological, Orthopaedic, Respiratory, Digestive, Mental Health, Maternity, Infectious, Eye, Dental) to their coverage status in each plan using 8 status codes: Covered, Day 1, 1Y/2Y/3Y/4Y Wait, Partial, Excluded.

**7. What-If Premium Simulator**
Real-time premium recalculation across all 10 plans as the user adjusts age, BMI, family members, smoker status, PED, chronic condition, and city. Includes a Top Plan view showing detailed loading waterfall and an All 10 Plans view sorted by simulated monthly cost.

**8. Financial Tools Suite**
- **Sum Insured Adequacy Calculator**: Computes the minimum cover needed based on age, city, family size, and health conditions against benchmark procedure costs (bypass: ₹3.5–5L, cancer: ₹6L)
- **Medical Inflation Projector**: Shows real purchasing power erosion at 7.5%/year over 5–20-year horizons
- **Section 80D Tax Calculator**: Computes exact tax savings under New and Old Regime with deduction limits for self, family, and parents
- **Age vs Premium Chart**: Recharts line graph of premium growth across ages 25–65 for top 3 plans
- **Portability Guide**: Interactive waiting period credit calculator showing what transfers when switching insurers
- **Upgrade Checker**: Side-by-side feature and price comparison between current plan and recommendation
- **Employer Cover Checker**: Gap analysis of employer group cover vs. recommended personal cover

**9. PDF Report Export**
Generates a downloadable quote document including user profile, top recommendation details, all 10 plans ranked, and key metrics using jsPDF and jsPDF-AutoTable.

**10. Agent Mode**
A role-based mode for insurance agents providing customer note-taking, an Agent Notes field in the wizard, and JSON export of the complete customer summary for CRM integration.

---

## 8. System Requirements

| Layer | Technology |
|---|---|
| Frontend Framework | React 19, Vite 8 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 3 |
| Maps | Leaflet 1.9, React-Leaflet |
| PDF Generation | jsPDF 4, jsPDF-AutoTable |
| Backend API | Python 3.11+, Flask 3, Flask-CORS |
| Task Queue | Celery (future) |
| Database | MongoDB (future integration) |
| Deployment — Frontend | Vercel |
| Deployment — Backend | Render |
| Data Source | IRDAI Handbook FY 2023-24 & 2024-25 |
| Tools | Git, VS Code, Node.js 22, npm |

---

## 9. Methodology / Implementation Plan

**Development Approach:** Agile methodology enabling iterative feature development, incremental testing, and continuous deployment.

### Implementation Phases

| Phase | Activities |
|---|---|
| Phase 1 | Requirement analysis, data collection from IRDAI, insurer rate cards, claim data |
| Phase 2 | System architecture design, component hierarchy, data schema definition |
| Phase 3 | Premium calculation engine, scoring algorithm, JS recommender |
| Phase 4 | 3-step wizard UI, profile collection, live profile card |
| Phase 5 | Results dashboard, Policy Cards, Compare Table, What-If Simulator |
| Phase 6 | Hospital Finder with Leaflet map, Disease Coverage Checker |
| Phase 7 | AI Insights Engine, financial tools suite (Tax, Inflation, Portability, Employer) |
| Phase 8 | Python Flask API, CORS configuration, JS fallback integration |
| Phase 9 | PDF export, loading screen, landing page, glossary, tooltips |
| Phase 10 | Cloud deployment (Vercel + Render), testing, performance optimisation |

### Techniques Used

- Rule-based multi-factor scoring with weighted priority modes
- Actuarial loading calculations per IRDAI guidelines
- Conversational AI narrative generation (rule-based NLG)
- Interactive data visualisation (Recharts, Leaflet)
- Responsive progressive disclosure UX pattern
- REST API with graceful JS fallback for high availability

---

## 10. Expected Outcome

The project is expected to deliver a fully functional, secure, and scalable AI-enabled health insurance advisory platform capable of:

- Comparing 10 major Indian health insurance plans across 20+ dimensions
- Generating personalised, IRDAI-verified premium quotes with full loading transparency
- Producing conversational AI insights that surface non-obvious risks and savings specific to each user
- Providing interactive financial tools covering tax savings, medical inflation, hospital empanelment, and portability
- Exporting downloadable PDF quote reports for user reference

The solution will significantly reduce the information asymmetry between insurers and consumers, minimise uninformed purchasing decisions, and promote data-driven financial protection across India.

---

## 11. Applications / Use Cases

1. **Individual consumers** seeking their first health insurance plan without prior knowledge
2. **Young professionals** comparing employer cover against personal plan requirements
3. **Families** evaluating floater plans against individual coverage for each member
4. **Senior citizens** needing Day-1 PED coverage and understanding copay implications
5. **Insurance agents** using Agent Mode for data-backed customer advisory with JSON export
6. **Financial advisors** explaining 80D tax deductions and premium loading to clients
7. **HR departments** assessing adequacy of employee group health cover

---

## 12. Future Enhancements / Future Scope

1. **Live pricing API integration** via IRDAI-licensed Insurance Web Aggregator (IWA) partnerships for real-time premium quotes
2. **Multilingual support** — Hindi, Marathi, Tamil, Telugu for regional accessibility
3. **Claims tracking module** — post-purchase claim filing checklist and status tracking
4. **LMS integration** — API connectivity with college/corporate HR systems for bulk employee advisory
5. **Longitudinal recommendation** — annual policy review reminders with adjusted recommendations as user's health profile changes
6. **Mobile application** — React Native port for Android and iOS
7. **Rider / add-on configurator** — pricing critical illness rider, personal accident rider, OPD rider on top of base plans
8. **Expanded plan database** — addition of 20+ more insurers including Acko, SBI General, New India Assurance

---

## 13. References

1. Insurance Regulatory and Development Authority of India, *Handbook on Indian Insurance Statistics FY 2023-24 & FY 2024-25*, IRDAI Publications, 2024. [Online]. Available: https://irdai.gov.in/web/guest/publications
2. D. Jurafsky and J. H. Martin, *Speech and Language Processing*, 3rd ed., Pearson, 2023.
3. T. B. Brown et al., "Language Models are Few-Shot Learners," *Advances in Neural Information Processing Systems*, vol. 33, pp. 1877–1901, 2020.
4. HDFC ERGO General Insurance, "Optima Secure Health Insurance — Rate Card 2024-25," Official Product Documentation, 2024.
5. Niva Bupa Health Insurance, "ReAssure 2.0 Platinum+ Policy Wording," Official Documentation, 2024.
6. OWASP Foundation, "OWASP Top 10: API Security Risks," 2023. [Online]. Available: https://owasp.org
7. Vercel Inc., "Vite + React Deployment on Vercel," Official Documentation, 2024. [Online]. Available: https://vercel.com/docs
8. Meta Open Source, "React 19 Documentation," 2024. [Online]. Available: https://react.dev
9. Flask Contributors, "Flask: Web Development, one drop at a time," Official Documentation, 2024. [Online]. Available: https://flask.palletsprojects.com
10. Recharts Contributors, "Recharts — A Composable Charting Library Built on React," 2024. [Online]. Available: https://recharts.org

---

*Content rephrased and compiled for academic synopsis submission. All IRDAI data references are from publicly available official publications.*
