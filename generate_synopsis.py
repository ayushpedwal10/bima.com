from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

doc = Document()

# ── Page margins (matching PDF) ──────────────────────────────
for section in doc.sections:
    section.top_margin    = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin   = Cm(3.0)
    section.right_margin  = Cm(2.5)

# ── Helpers ──────────────────────────────────────────────────
def add_para(text="", bold=False, size=12, align=WD_ALIGN_PARAGRAPH.LEFT,
             space_before=0, space_after=6, italic=False, color=None):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    if text:
        run = p.add_run(text)
        run.bold   = bold
        run.italic = italic
        run.font.size = Pt(size)
        if color:
            run.font.color.rgb = color
    return p

def add_heading(text, level=1, size=14, center=True, space_before=12, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(size)
    return p

def add_bullet(text, size=11, indent=True):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(3)
    run = p.add_run(text)
    run.font.size = Pt(size)
    return p

def add_numbered(text, num, size=11):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(3)
    p.paragraph_format.left_indent  = Inches(0.4)
    run = p.add_run(f"{num}.  {text}")
    run.font.size = Pt(size)
    return p

def page_break():
    doc.add_page_break()

def add_table_row(table, cells, bold_first=False, center_all=False, header=False, bg=None):
    row = table.add_row()
    for i, (cell, text) in enumerate(zip(row.cells, cells)):
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center_all else WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(text)
        run.font.size = Pt(11)
        run.bold = header or (bold_first and i == 0)
        if bg:
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            shd = OxmlElement("w:shd")
            shd.set(qn("w:val"),   "clear")
            shd.set(qn("w:color"), "auto")
            shd.set(qn("w:fill"),  bg)
            tcPr.append(shd)
    return row

# ════════════════════════════════════════════════════════════
# COVER PAGE
# ════════════════════════════════════════════════════════════

# Border box — outer table trick
outer = doc.add_table(rows=1, cols=1)
outer.alignment = WD_TABLE_ALIGNMENT.CENTER
outer.style = "Table Grid"
cell = outer.rows[0].cells[0]
cell.width = Inches(6.0)

# Add content inside the border cell
def inner_para(cell, text="", bold=False, size=12,
               align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4):
    p = cell.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    if text:
        run = p.add_run(text)
        run.bold = bold
        run.font.size = Pt(size)
    return p

# Clear default empty para in cell
cell.paragraphs[0].clear()

inner_para(cell, "Synopsis", bold=True, size=28, space_before=18, space_after=8)
inner_para(cell, "On", bold=False, size=14, space_before=0, space_after=10)
inner_para(cell, "BeemaSaathi: AI-Based Health Insurance", bold=True, size=16, space_before=0, space_after=2)
inner_para(cell, "Advisory and Recommendation System", bold=True, size=16, space_before=0, space_after=16)

# Placeholder for logo note
logo_p = cell.add_paragraph()
logo_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
logo_run = logo_p.add_run("[Insert MIT-ADT University Logo Here]")
logo_run.italic = True
logo_run.font.size = Pt(9)
logo_run.font.color.rgb = RGBColor(0x99, 0x99, 0x99)
logo_p.paragraph_format.space_after = Pt(16)

inner_para(cell, "Group ID: TYCC102", bold=True, size=11, space_before=6, space_after=4)
inner_para(cell, "Team Details", bold=True, size=11, space_before=2, space_after=6)

# Team table inside cell
team_table = cell.add_table(rows=1, cols=3)
team_table.style = "Table Grid"
team_table.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr = team_table.rows[0]
for cell_t, txt in zip(hdr.cells, ["Enrolment No.", "Name of Student", "Class"]):
    cell_t.text = txt
    cell_t.paragraphs[0].runs[0].bold = True
    cell_t.paragraphs[0].runs[0].font.size = Pt(10)
    cell_t.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    tc = cell_t._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  "D9D9D9")
    tcPr.append(shd)

team_data = [
    ("ADT23SOCB0284", "Ayush Pedwal",       "CC-2"),
    ("ADT23SOCB1323", "Virendrapratap Karad","CC-2"),
]
for enrol, name, cls in team_data:
    row = team_table.add_row()
    for c, t in zip(row.cells, [enrol, name, cls]):
        c.text = t
        c.paragraphs[0].runs[0].font.size = Pt(10)
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

inner_para(cell, "", space_before=10, space_after=2)
inner_para(cell, "Under the Guidance of", bold=False, size=11, space_before=8, space_after=4)
inner_para(cell, "Dr. Ganesh Pathak", bold=True, size=13, space_before=0, space_after=16)
inner_para(cell, "Department of Computer Science & Engineering", bold=True, size=13, space_before=4, space_after=4)
inner_para(cell, "MIT School of Computing", bold=True, size=16, space_before=4, space_after=4)
inner_para(cell, "Sem-1 | A.Y. 2026-27", bold=True, size=13, space_before=4, space_after=14)

page_break()

# ════════════════════════════════════════════════════════════
# CONTENT
# ════════════════════════════════════════════════════════════

def section_heading(num, title):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after  = Pt(4)
    run = p.add_run(f"{num}. {title}")
    run.bold = True
    run.font.size = Pt(12)

def body(text, size=11, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(space_after)
    run = p.add_run(text)
    run.font.size = Pt(size)
    return p

def sub_heading(text, size=11):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after  = Pt(3)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(size)

# ── 1. Title ──────────────────────────────────────────────────
section_heading("1", "Title of the Project")
body('"BeemaSaathi: AI-Based Health Insurance Advisory and Recommendation System"')

# ── 2. Abstract ───────────────────────────────────────────────
section_heading("2", "Abstract")
body("Health insurance selection in India remains a deeply confusing and opaque process for the majority of the population. With over 28 active insurers, hundreds of plan variants, and complex policy wordings involving terms such as co-payment, waiting periods, sub-limits, and claim settlement ratios, most individuals either avoid purchasing insurance altogether or make uninformed decisions that leave them underinsured. The resulting gap between what people buy and what they actually need contributes to financial catastrophe at the time of medical emergencies.")
body("This project proposes the design and development of BeemaSaathi, a secure, scalable, and AI-powered health insurance advisory platform capable of analysing a user's life stage, health profile, coverage requirements, and financial constraints to generate personalised, ranked plan recommendations with full transparency. The system integrates a rule-based multi-factor scoring engine, an AI Insights generation layer, an interactive What-If premium simulator, a disease and hospital coverage checker, a tax savings calculator, a medical inflation projector, a portability guide, and an employer cover adequacy checker — all built on verified IRDAI-published data.")
body("The platform is implemented using React 19, Vite 8, Tailwind CSS 4, Recharts, and Leaflet for the frontend, with a Python Flask REST API serving as an optional high-accuracy backend engine and a JavaScript fallback engine ensuring uninterrupted service. By combining structured actuarial data, IRDAI-verified claim settlement ratios, and a conversational AI insights engine, BeemaSaathi delivers accurate, fair, and data-driven insurance recommendations while significantly reducing the cognitive burden on end users.")

# ── 3. Introduction ───────────────────────────────────────────
section_heading("3", "Introduction / Background")
body("Health insurance penetration in India stood at approximately 37% of the population as of 2024, with the Insurance Regulatory and Development Authority of India (IRDAI) reporting over 43,661 individual health insurance policies across major insurers. Despite this scale, the average Indian policyholder lacks the analytical tools and domain knowledge to compare plans effectively. Most purchasing decisions are made based on agent recommendations, brand familiarity, or lowest price — none of which guarantee adequate coverage.")
body("The existing digital alternatives — primarily insurance aggregator portals — present plan data in tabular form without contextual guidance. They show what a plan costs but fail to explain what it actually covers for a specific individual, why one plan is better than another for their profile, or what risks they face at the time of a claim.")
body("This project bridges this gap by proposing a secure, explainable, and scalable AI-enabled health insurance advisory system built on published IRDAI rate cards, claim settlement data, and a proprietary 10-plan comparison dataset covering the major health insurance products available in India as of 2024-25.")

# ── 4. Problem Definition ─────────────────────────────────────
section_heading("4", "Problem Definition")
body("Current health insurance advisory processes in India lack a secure, automated, and explainable digital framework capable of personalising plan recommendations based on the user's life stage, health risk profile, city, income, and coverage needs; generating transparent human-readable justifications for recommendations; providing actionable financial insights such as premium loading analysis, medical inflation projection, and tax savings guidance; warning users about common claim rejection traps specific to their recommended insurer; and offering a real-time premium simulator that shows how lifestyle changes affect cost. This results in uninformed purchasing decisions, inadequate coverage, and financial vulnerability at the time of hospitalisation.")

# ── 5. Objectives ─────────────────────────────────────────────
section_heading("5", "Objectives")
objectives = [
    "To design and implement a secure AI-enabled web-based health insurance advisory platform.",
    "To build a multi-factor policy scoring engine using IRDAI-verified data including Claim Settlement Ratio (CSR), hospital network size, waiting periods, and coverage features.",
    "To develop a conversational AI Insights engine that generates personalised, second-person narrative analysis for each user based on their specific profile.",
    "To implement an interactive What-If Premium Simulator showing real-time premium changes across all 10 plans as users modify age, BMI, risk factors, and family size.",
    "To provide a Disease Coverage Checker mapping 31 diseases across 12 categories to their coverage status in each plan.",
    "To integrate a Hospital Network Finder with an interactive map showing cashless empanelment across 64 hospitals in 8 major Indian cities.",
    "To build a Medical Inflation Projector and Sum Insured Adequacy Calculator that quantify the financial risk of being underinsured.",
    "To provide a Section 80D Tax Savings Calculator, Upgrade Checker, Portability Guide, and Employer Cover Checker as supplementary advisory tools.",
    "To deploy the platform on cloud infrastructure with a Python Flask API backend and JavaScript fallback engine ensuring high availability.",
]
for i, obj in enumerate(objectives, 1):
    add_numbered(obj, i)

# ── 6. Scope ──────────────────────────────────────────────────
section_heading("6", "Scope of the Project")
body("The project focuses on the individual health insurance market in India, covering 10 major plans from HDFC ERGO, Niva Bupa, Star Health, Care Health, Aditya Birla Health, ICICI Lombard, Bajaj Allianz, Tata AIG, and Reliance General. The system provides personalised plan recommendations across five life stage segments: Student, Young Professional, Couple, Family, and Senior Citizen — with AI-driven insights grounded in published IRDAI rate cards for the financial year 2024-25.")
body("The platform enhances decision-making accuracy and transparency but does not replace licensed insurance advisory services or constitute regulated financial advice. The architecture is designed to be modular, scalable, and deployable on cloud infrastructure for production use.")

# ── 7. Proposed System ────────────────────────────────────────
section_heading("7", "Proposed System")
body("BeemaSaathi is a comprehensive AI-enabled health insurance advisory platform that integrates personalised profiling, multi-factor scoring, AI-driven insights, and interactive financial tools within a unified digital experience.")

sub_heading("System Workflow")
workflow = [
    "User Profile Collection (3-Step Wizard)",
    "Premium Calculation Engine (Python API / JS Fallback)",
    "Multi-Factor Policy Scoring & Ranking",
    "AI Insights Generation (Personalised Narrative Cards)",
    "Interactive Tools (Hospital Finder, Disease Checker, What-If, Tax, Portability)",
    "PDF Report Export / Get Exact Quote (Insurer Website)",
]
for i, step in enumerate(workflow):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(2)
    p.paragraph_format.left_indent  = Inches(0.3)
    arrow = "" if i == 0 else "→  "
    run = p.add_run(arrow + step)
    run.font.size = Pt(11)

sub_heading("Core Modules")
modules = [
    ("Profile Wizard (3-Step)", "Collects life stage, age, gender, city, income, BMI, risk factors (smoker, PED, chronic), family size, budget, and specific coverage needs. Includes a Live Profile Card that updates in real time as the user progresses."),
    ("Premium Calculation Engine", "Applies IRDAI-regulated loading factors — age bands, BMI, smoker (+20%), PED (+30%), chronic (+15%), metro city (+10%), and family floater multipliers — on published base rate tables for sum insured values of Rs.5L to Rs.25L."),
    ("Multi-Factor Scoring & Ranking Engine", "Scores each of 10 plans on segment fit, age eligibility, budget adherence, CSR performance, coverage needs match, hospital network quality, NCB, and market popularity signals derived from 43,661 real policy records."),
    ("AI Insights Engine", "Generates up to 10 personalised insight cards including: Our Verdict, Claim Trap to Avoid, Money Angle, PED Waiting Period Alert, Head-to-Head Comparison, Blind Spot analysis, City-specific guidance, and a Before You Buy action plan."),
    ("Hospital Network Finder", "Interactive Leaflet map showing 64 hospitals across 8 cities with cashless coverage status per plan, hospital type filters, and plan coverage legend."),
    ("Disease Coverage Checker", "Maps 31 diseases across 12 categories to coverage status in each plan using 8 status codes: Covered, Day 1, 1Y/2Y/3Y/4Y Wait, Partial, Excluded."),
    ("What-If Premium Simulator", "Real-time premium recalculation across all 10 plans as user adjusts age, BMI, family size, smoker status, PED, and city."),
    ("Financial Tools Suite", "Sum Insured Adequacy Calculator, Medical Inflation Projector, Section 80D Tax Calculator, Age vs Premium Chart, Portability Guide, Upgrade Checker, and Employer Cover Checker."),
    ("PDF Report Export", "Generates downloadable quote document including user profile, top recommendation, and all 10 plans ranked."),
    ("Agent Mode", "Role-based mode for insurance agents with customer note-taking and JSON export for CRM integration."),
]
for title, desc in modules:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after  = Pt(2)
    r1 = p.add_run(title + ": ")
    r1.bold = True
    r1.font.size = Pt(11)
    r2 = p.add_run(desc)
    r2.font.size = Pt(11)

sub_heading("Advantages")
advantages = [
    "Personalised AI-driven plan analysis using IRDAI-verified data",
    "Real-time premium simulation across all 10 plans simultaneously",
    "Conversational second-person insights that surface non-obvious risks",
    "Transparent claim trap warnings per insurer based on IRDAI ombudsman data",
    "Scalable, modular, production-ready React + Flask architecture",
    "Fully functional without internet dependency via JS fallback engine",
]
for adv in advantages:
    add_bullet(adv)

# ── 8. System Requirements ────────────────────────────────────
section_heading("8", "System Requirements")
req_table = doc.add_table(rows=1, cols=2)
req_table.style = "Table Grid"
req_table.alignment = WD_TABLE_ALIGNMENT.LEFT
for c, t in zip(req_table.rows[0].cells, ["Layer", "Technology"]):
    c.text = t
    c.paragraphs[0].runs[0].bold = True
    c.paragraphs[0].runs[0].font.size = Pt(10)
    tc = c._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  "D9D9D9")
    tcPr.append(shd)

req_data = [
    ("Frontend Framework",  "React 19, Vite 8"),
    ("Styling",             "Tailwind CSS 4"),
    ("Charts",              "Recharts 3"),
    ("Maps",                "Leaflet 1.9, React-Leaflet"),
    ("PDF Generation",      "jsPDF 4, jsPDF-AutoTable"),
    ("Backend API",         "Python 3.11+, Flask 3, Flask-CORS"),
    ("Deployment — Frontend","Vercel"),
    ("Deployment — Backend", "Render"),
    ("Data Source",         "IRDAI Handbook FY 2023-24 & 2024-25"),
    ("Tools",               "Git, VS Code, Node.js 22, npm"),
]
for layer, tech in req_data:
    row = req_table.add_row()
    row.cells[0].text = layer
    row.cells[1].text = tech
    for c in row.cells:
        c.paragraphs[0].runs[0].font.size = Pt(10)

# ── 9. Methodology ────────────────────────────────────────────
section_heading("9", "Methodology / Implementation Plan")
body("Development Approach: Agile methodology enabling iterative feature development, incremental testing, and continuous deployment.")

sub_heading("Implementation Phases")
phases = [
    ("Phase 1", "Requirement analysis, data collection from IRDAI, insurer rate cards, claim data"),
    ("Phase 2", "System architecture design, component hierarchy, data schema definition"),
    ("Phase 3", "Premium calculation engine, scoring algorithm, JS recommender"),
    ("Phase 4", "3-step wizard UI, profile collection, live profile card"),
    ("Phase 5", "Results dashboard, Policy Cards, Compare Table, What-If Simulator"),
    ("Phase 6", "Hospital Finder with Leaflet map, Disease Coverage Checker"),
    ("Phase 7", "AI Insights Engine, financial tools suite (Tax, Inflation, Portability, Employer)"),
    ("Phase 8", "Python Flask API, CORS configuration, JS fallback integration"),
    ("Phase 9", "PDF export, loading screen, landing page, glossary, tooltips"),
    ("Phase 10","Cloud deployment (Vercel + Render), testing, performance optimisation"),
]
phase_table = doc.add_table(rows=1, cols=2)
phase_table.style = "Table Grid"
for c, t in zip(phase_table.rows[0].cells, ["Phase", "Activities"]):
    c.text = t
    c.paragraphs[0].runs[0].bold = True
    c.paragraphs[0].runs[0].font.size = Pt(10)
    tc = c._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), "D9D9D9")
    tcPr.append(shd)
for phase, act in phases:
    r = phase_table.add_row()
    r.cells[0].text = phase
    r.cells[1].text = act
    for c in r.cells:
        c.paragraphs[0].runs[0].font.size = Pt(10)

sub_heading("Techniques Used")
techs = [
    "Rule-based multi-factor scoring with weighted priority modes",
    "Actuarial loading calculations per IRDAI guidelines",
    "Conversational AI narrative generation (rule-based NLG)",
    "Interactive data visualisation (Recharts, Leaflet)",
    "Responsive progressive disclosure UX pattern",
    "REST API with graceful JS fallback for high availability",
]
for t in techs:
    add_bullet(t)

# ── 10. Expected Outcome ──────────────────────────────────────
section_heading("10", "Expected Outcome")
body("The project is expected to deliver a fully functional, secure, and scalable AI-enabled health insurance advisory platform capable of comparing 10 major Indian health insurance plans across 20+ dimensions, generating personalised IRDAI-verified premium quotes with full loading transparency, and producing conversational AI insights that surface non-obvious risks and savings specific to each user.")
body("The solution will significantly reduce the information asymmetry between insurers and consumers, minimise uninformed purchasing decisions, and promote data-driven financial protection across India.")

# ── 11. Applications ──────────────────────────────────────────
section_heading("11", "Applications / Use Cases")
uses = [
    "Individual consumers seeking their first health insurance plan without prior knowledge",
    "Young professionals comparing employer cover against personal plan requirements",
    "Families evaluating floater plans against individual coverage for each member",
    "Senior citizens needing Day-1 PED coverage and understanding copay implications",
    "Insurance agents using Agent Mode for data-backed customer advisory with JSON export",
    "Financial advisors explaining 80D tax deductions and premium loading to clients",
    "HR departments assessing adequacy of employee group health cover",
]
for u in uses:
    add_bullet(u)

# ── 12. Future Enhancements ───────────────────────────────────
section_heading("12", "Future Enhancements / Future Scope")
body("The system can be further enhanced through the following developments:")
future = [
    "Live pricing API integration via IRDAI-licensed Insurance Web Aggregator (IWA) partnerships for real-time premium quotes",
    "Multilingual support — Hindi, Marathi, Tamil, Telugu for regional accessibility",
    "Claims tracking module — post-purchase claim filing checklist and status tracking",
    "LMS and HR system integration for bulk employee health insurance advisory",
    "Longitudinal recommendation — annual policy review with adjusted recommendations as user's health profile changes",
    "Mobile application — React Native port for Android and iOS",
    "Rider and add-on configurator — pricing critical illness rider, personal accident rider, and OPD rider on top of base plans",
    "Expanded plan database — addition of 20+ more insurers including Acko, SBI General, and New India Assurance",
]
for f in future:
    add_bullet(f)

# ── 13. References ────────────────────────────────────────────
section_heading("13", "References")
references = [
    "Insurance Regulatory and Development Authority of India, Handbook on Indian Insurance Statistics FY 2023-24 & FY 2024-25, IRDAI Publications, 2024. [Online]. Available: https://irdai.gov.in/web/guest/publications",
    "D. Jurafsky and J. H. Martin, Speech and Language Processing, 3rd ed., Pearson, 2023.",
    "T. B. Brown et al., \"Language Models are Few-Shot Learners,\" Advances in Neural Information Processing Systems, vol. 33, pp. 1877–1901, 2020.",
    "HDFC ERGO General Insurance, \"Optima Secure Health Insurance — Rate Card 2024-25,\" Official Product Documentation, 2024.",
    "Niva Bupa Health Insurance, \"ReAssure 2.0 Platinum+ Policy Wording,\" Official Documentation, 2024.",
    "OWASP Foundation, \"OWASP Top 10: API Security Risks,\" 2023. [Online]. Available: https://owasp.org",
    "Vercel Inc., \"Vite + React Deployment on Vercel,\" Official Documentation, 2024.",
    "Meta Open Source, \"React 19 Documentation,\" 2024. [Online]. Available: https://react.dev",
    "Flask Contributors, \"Flask: Web Development, one drop at a time,\" Official Documentation, 2024.",
    "Recharts Contributors, \"Recharts — A Composable Charting Library Built on React,\" 2024.",
]
for i, ref in enumerate(references, 1):
    add_numbered(ref, i)

# ── Save ──────────────────────────────────────────────────────
doc.save("Synopsis_BeemaSaathi.docx")
print("SUCCESS: Synopsis_BeemaSaathi.docx created")
