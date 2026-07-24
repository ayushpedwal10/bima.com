/**
 * Disease coverage data mapped to each plan.
 * Coverage status: "covered" | "waiting" | "excluded" | "partial"
 */

export const DISEASE_CATEGORIES = {
  chronic: { label: "Chronic & Lifestyle", icon: "🫀", color: "#ef4444", bg: "#fef2f2" },
  cancer:  { label: "Cancer & Tumours",    icon: "🎗️", color: "#8b5cf6", bg: "#f5f3ff" },
  cardiac: { label: "Cardiac & Vascular",  icon: "❤️", color: "#f43f5e", bg: "#fff1f2" },
  neuro:   { label: "Neurological",        icon: "🧠", color: "#6366f1", bg: "#eef2ff" },
  ortho:   { label: "Orthopaedic",         icon: "🦴", color: "#f59e0b", bg: "#fffbeb" },
  respiratory: { label: "Respiratory",     icon: "🫁", color: "#0ea5e9", bg: "#f0f9ff" },
  digestive:   { label: "Digestive",       icon: "🫃", color: "#10b981", bg: "#ecfdf5" },
  mental:      { label: "Mental Health",   icon: "🧘", color: "#14b8a6", bg: "#f0fdfa" },
  maternity:   { label: "Maternity",       icon: "🤰", color: "#ec4899", bg: "#fdf2f8" },
  infectious:  { label: "Infectious",      icon: "🦠", color: "#84cc16", bg: "#f7fee7" },
  eye:         { label: "Eye & Vision",    icon: "👁️", color: "#64748b", bg: "#f8fafc" },
  dental:      { label: "Dental",          icon: "🦷", color: "#94a3b8", bg: "#f8fafc" },
}

// coverage values: "covered" | "waiting_1y" | "waiting_2y" | "waiting_3y" | "waiting_4y" | "excluded" | "partial" | "day1"
export const DISEASES = [
  // ── Chronic & Lifestyle ──────────────────────────────────────
  {
    id: "D001", name: "Type 2 Diabetes", category: "chronic",
    description: "Insulin resistance / high blood sugar management",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "Aditya Birla & Star Senior cover from Day 1 via chronic disease management"
  },
  {
    id: "D002", name: "Hypertension (High BP)", category: "chronic",
    description: "High blood pressure and related complications",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "Part of PED waiting period in most plans"
  },
  {
    id: "D003", name: "Thyroid Disorders", category: "chronic",
    description: "Hypothyroidism, hyperthyroidism and related conditions",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "Classified as PED if diagnosed before policy purchase"
  },
  {
    id: "D004", name: "Obesity / Bariatric", category: "chronic",
    description: "Morbid obesity and bariatric surgery coverage",
    coverage: { P001:"excluded", P002:"excluded", P003:"excluded", P004:"excluded", P005:"partial", P006:"covered", P007:"excluded", P008:"excluded", P009:"excluded", P010:"excluded" },
    notes: "Only ICICI Lombard Health Companion covers bariatric surgery"
  },
  // ── Cancer & Tumours ─────────────────────────────────────────
  {
    id: "D005", name: "Cancer (all types)", category: "cancer",
    description: "Malignant tumours, chemotherapy, radiation, surgery",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered under hospitalisation by all plans; critical illness rider needed for lump-sum payout"
  },
  {
    id: "D006", name: "Benign Tumours", category: "cancer",
    description: "Non-malignant growths requiring surgical removal",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered after initial 30-day waiting period under all plans"
  },
  // ── Cardiac & Vascular ───────────────────────────────────────
  {
    id: "D007", name: "Heart Attack (MI)", category: "cardiac",
    description: "Myocardial infarction, angioplasty, bypass surgery",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "All plans cover emergency cardiac hospitalisation"
  },
  {
    id: "D008", name: "Coronary Artery Disease", category: "cardiac",
    description: "Blocked arteries, stent placement, cardiac procedures",
    coverage: { P001:"waiting_2y", P002:"waiting_2y", P003:"waiting_2y", P004:"waiting_2y", P005:"day1", P006:"waiting_2y", P007:"day1", P008:"waiting_2y", P009:"waiting_2y", P010:"waiting_2y" },
    notes: "2-year specific disease waiting period applies in most plans if pre-existing"
  },
  {
    id: "D009", name: "Stroke", category: "cardiac",
    description: "Ischaemic or haemorrhagic stroke, rehabilitation",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Acute stroke covered under emergency hospitalisation"
  },
  // ── Neurological ─────────────────────────────────────────────
  {
    id: "D010", name: "Mental Health Disorders", category: "mental",
    description: "Depression, anxiety, schizophrenia, inpatient psychiatric care",
    coverage: { P001:"covered", P002:"covered", P003:"excluded", P004:"covered", P005:"covered", P006:"excluded", P007:"excluded", P008:"excluded", P009:"covered", P010:"excluded" },
    notes: "Only HDFC, Niva Bupa, Care Health, Aditya Birla & Tata AIG cover mental health"
  },
  {
    id: "D011", name: "Parkinson's Disease", category: "neuro",
    description: "Parkinson's treatment, medication, and hospitalisation",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered under hospitalisation; declared PED will attract waiting period"
  },
  {
    id: "D012", name: "Epilepsy", category: "neuro",
    description: "Seizure disorders, anti-epileptic treatment",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "If pre-existing, classified under PED waiting period"
  },
  // ── Orthopaedic ──────────────────────────────────────────────
  {
    id: "D013", name: "Joint Replacement (Knee/Hip)", category: "ortho",
    description: "Knee, hip replacement surgery and rehabilitation",
    coverage: { P001:"waiting_2y", P002:"waiting_2y", P003:"waiting_2y", P004:"waiting_2y", P005:"waiting_2y", P006:"waiting_2y", P007:"waiting_1y", P008:"waiting_2y", P009:"waiting_2y", P010:"waiting_2y" },
    notes: "2-year specific disease wait in most plans; Star Senior has 1-year wait"
  },
  {
    id: "D014", name: "Fractures & Injuries", category: "ortho",
    description: "Accidental fractures, ligament tears, sports injuries",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Accidental injuries covered from Day 1 in all plans"
  },
  {
    id: "D015", name: "Arthritis", category: "ortho",
    description: "Rheumatoid arthritis, osteoarthritis, joint degeneration",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "Classified as PED if diagnosed before policy purchase"
  },
  // ── Respiratory ──────────────────────────────────────────────
  {
    id: "D016", name: "Asthma", category: "respiratory",
    description: "Chronic asthma, acute attacks requiring hospitalisation",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "Pre-existing asthma attracts PED waiting period"
  },
  {
    id: "D017", name: "COVID-19 / Pneumonia", category: "respiratory",
    description: "Viral pneumonia, COVID hospitalisation and ICU care",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered under hospitalisation in all plans after 30-day initial wait"
  },
  {
    id: "D018", name: "COPD / Chronic Bronchitis", category: "respiratory",
    description: "Chronic obstructive pulmonary disease, emphysema",
    coverage: { P001:"waiting_3y", P002:"waiting_3y", P003:"waiting_4y", P004:"waiting_4y", P005:"day1", P006:"waiting_4y", P007:"day1", P008:"excluded", P009:"waiting_3y", P010:"waiting_3y" },
    notes: "If pre-existing, classified under PED waiting period"
  },
  // ── Digestive ────────────────────────────────────────────────
  {
    id: "D019", name: "Kidney Stones", category: "digestive",
    description: "Urolithiasis, lithotripsy, surgical removal",
    coverage: { P001:"waiting_2y", P002:"waiting_2y", P003:"waiting_2y", P004:"waiting_2y", P005:"waiting_2y", P006:"waiting_2y", P007:"waiting_1y", P008:"waiting_2y", P009:"waiting_2y", P010:"waiting_2y" },
    notes: "Specific disease waiting period of 2 years in most plans"
  },
  {
    id: "D020", name: "Hernia", category: "digestive",
    description: "Inguinal, umbilical hernia repair surgery",
    coverage: { P001:"waiting_2y", P002:"waiting_2y", P003:"waiting_2y", P004:"waiting_2y", P005:"waiting_2y", P006:"waiting_2y", P007:"waiting_1y", P008:"waiting_2y", P009:"waiting_2y", P010:"waiting_2y" },
    notes: "Listed under specific disease waiting period across all plans"
  },
  {
    id: "D021", name: "Liver Disease / Cirrhosis", category: "digestive",
    description: "Hepatitis, cirrhosis, liver failure hospitalisation",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered under inpatient hospitalisation after 30-day wait"
  },
  {
    id: "D022", name: "Gallstones / Gallbladder", category: "digestive",
    description: "Cholecystitis, gallstone removal, laparoscopic surgery",
    coverage: { P001:"waiting_2y", P002:"waiting_2y", P003:"waiting_2y", P004:"waiting_2y", P005:"waiting_2y", P006:"waiting_2y", P007:"waiting_1y", P008:"waiting_2y", P009:"waiting_2y", P010:"waiting_2y" },
    notes: "2-year specific disease waiting period in most plans"
  },
  // ── Maternity ────────────────────────────────────────────────
  {
    id: "D023", name: "Normal Delivery", category: "maternity",
    description: "Vaginal delivery, post-natal care, newborn cover",
    coverage: { P001:"excluded", P002:"excluded", P003:"excluded", P004:"excluded", P005:"excluded", P006:"covered", P007:"excluded", P008:"excluded", P009:"excluded", P010:"excluded" },
    notes: "Only ICICI Lombard Health Companion covers maternity (9-month wait)"
  },
  {
    id: "D024", name: "C-Section / Complications", category: "maternity",
    description: "Caesarean delivery, ectopic pregnancy, complications",
    coverage: { P001:"excluded", P002:"excluded", P003:"excluded", P004:"excluded", P005:"excluded", P006:"covered", P007:"excluded", P008:"excluded", P009:"excluded", P010:"excluded" },
    notes: "Only ICICI Lombard covers C-section under maternity benefit"
  },
  // ── Infectious ───────────────────────────────────────────────
  {
    id: "D025", name: "Dengue / Malaria", category: "infectious",
    description: "Vector-borne diseases requiring hospitalisation",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "All plans cover dengue/malaria hospitalisation from Day 1"
  },
  {
    id: "D026", name: "Typhoid / Viral Fever", category: "infectious",
    description: "Enteric fever, severe viral infections needing admission",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered after the 30-day initial waiting period"
  },
  {
    id: "D027", name: "HIV/AIDS", category: "infectious",
    description: "HIV treatment, AIDS-related opportunistic infections",
    coverage: { P001:"partial", P002:"partial", P003:"excluded", P004:"partial", P005:"partial", P006:"excluded", P007:"excluded", P008:"excluded", P009:"partial", P010:"excluded" },
    notes: "IRDAI mandates basic HIV hospitalisation coverage; OPD/ART excluded"
  },
  // ── Eye & Vision ─────────────────────────────────────────────
  {
    id: "D028", name: "Cataract Surgery", category: "eye",
    description: "Lens replacement for cataracts, intraocular implant",
    coverage: { P001:"waiting_2y", P002:"waiting_2y", P003:"waiting_2y", P004:"waiting_2y", P005:"waiting_2y", P006:"waiting_2y", P007:"waiting_1y", P008:"waiting_2y", P009:"waiting_2y", P010:"waiting_2y" },
    notes: "Specific disease waiting period of 2 years (1 year for Star Senior)"
  },
  {
    id: "D029", name: "Glaucoma", category: "eye",
    description: "Intraocular pressure treatment, surgical intervention",
    coverage: { P001:"covered", P002:"covered", P003:"covered", P004:"covered", P005:"covered", P006:"covered", P007:"covered", P008:"covered", P009:"covered", P010:"covered" },
    notes: "Covered under inpatient hospitalisation"
  },
  {
    id: "D030", name: "LASIK / Vision Correction", category: "eye",
    description: "Refractive eye surgery, laser correction",
    coverage: { P001:"excluded", P002:"excluded", P003:"excluded", P004:"excluded", P005:"excluded", P006:"excluded", P007:"excluded", P008:"excluded", P009:"excluded", P010:"excluded" },
    notes: "Excluded in all plans — considered elective/cosmetic"
  },
  // ── Dental ───────────────────────────────────────────────────
  {
    id: "D031", name: "Dental Treatment / Surgery", category: "dental",
    description: "Dental procedures, oral surgery, hospitalisation due to dental",
    coverage: { P001:"excluded", P002:"excluded", P003:"excluded", P004:"excluded", P005:"excluded", P006:"excluded", P007:"excluded", P008:"excluded", P009:"excluded", P010:"excluded" },
    notes: "Dental is excluded in all standard plans; dental rider available separately"
  },
]

export const PLAN_META = {
  P001: { short: "HDFC Optima",     abbr: "OPT",  color: "#2563eb" },
  P002: { short: "Niva ReAssure",   abbr: "RAS",  color: "#16a34a" },
  P003: { short: "Star Super",      abbr: "STR",  color: "#dc2626" },
  P004: { short: "Care Supreme",    abbr: "CAR",  color: "#ea580c" },
  P005: { short: "AB Activ One",    abbr: "ACT",  color: "#9333ea" },
  P006: { short: "ICICI Health",    abbr: "ICI",  color: "#0d9488" },
  P007: { short: "Star Senior",     abbr: "SEN",  color: "#e11d48" },
  P008: { short: "Bajaj Platinum",  abbr: "BAJ",  color: "#d97706" },
  P009: { short: "Tata MediCare",   abbr: "TAT",  color: "#0284c7" },
  P010: { short: "Reliance Gain",   abbr: "REL",  color: "#be123c" },
}

export const COVERAGE_META = {
  covered:    { label: "Covered",        short: "✓",   color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", textColor: "#15803d" },
  day1:       { label: "From Day 1",     short: "D1",  color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd", textColor: "#6d28d9" },
  waiting_1y: { label: "1-yr Wait",      short: "1Y",  color: "#d97706", bg: "#fef3c7", border: "#fde68a", textColor: "#b45309" },
  waiting_2y: { label: "2-yr Wait",      short: "2Y",  color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", textColor: "#b45309" },
  waiting_3y: { label: "3-yr Wait",      short: "3Y",  color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", textColor: "#c2410c" },
  waiting_4y: { label: "4-yr Wait",      short: "4Y",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca", textColor: "#b91c1c" },
  partial:    { label: "Partial",        short: "~",   color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", textColor: "#0e7490" },
  excluded:   { label: "Excluded",       short: "✗",   color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", textColor: "#64748b" },
}

export function searchDiseases({ query = "", category = "", planId = "" }) {
  return DISEASES.filter(d => {
    const matchQ = !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
    const matchC = !category || d.category === category
    const matchP = !planId || (d.coverage[planId] !== "excluded")
    return matchQ && matchC && matchP
  })
}
