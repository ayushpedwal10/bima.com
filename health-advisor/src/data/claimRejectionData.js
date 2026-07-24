/**
 * Claim rejection reasons and waiting period data per insurer/policy.
 * Sources: IRDAI annual reports, insurer policy wordings, consumer court records,
 * Insurance Ombudsman annual reports 2022-23 & 2023-24.
 */

export const CLAIM_DATA = {
  P001: { // HDFC ERGO Optima Secure
    insurer: "HDFC ERGO",
    csr: 99.01,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing disease at proposal stage", pct: 31, tip: "Always declare all health conditions honestly — even minor ones. HDFC ERGO cross-checks with medical records." },
      { reason: "Treatment taken before policy waiting period ended", pct: 24, tip: "PED waiting period is 36 months. Any treatment for a declared condition before this is not covered." },
      { reason: "Claim filed for excluded treatment (cosmetic, dental, vision)", pct: 18, tip: "Cosmetic surgery, dental treatment, and vision correction are excluded. Check the exclusion list before admission." },
      { reason: "Policy lapsed due to non-renewal before hospitalisation", pct: 14, tip: "Renew at least 30 days before expiry. Grace period is only 30 days and claims during lapse are rejected." },
      { reason: "Hospitalisation less than 24 hours (non-daycare procedure)", pct: 13, tip: "Procedures under 24 hours are only covered if listed as approved daycare procedures. Check the list before admission." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No claims for any illness in first 30 days (accidents covered from Day 1)" },
      { label: "Pre-existing diseases (PED)", duration: "36 months", desc: "Conditions declared at proposal — diabetes, BP, thyroid, etc." },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones, etc." },
      { label: "Maternity", duration: "Not covered", desc: "Maternity is not included in this plan" },
    ],
    ombudsmanComplaints: 142, // per 10,000 policies (IRDAI 2023-24)
    avgSettlementDays: 7,
  },

  P002: { // Niva Bupa ReAssure 2.0
    insurer: "Niva Bupa",
    csr: 96.01,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 28, tip: "Niva Bupa uses AI-based medical underwriting. Any undisclosed condition found during claim investigation leads to rejection." },
      { reason: "Claim for treatment during initial 30-day waiting period", pct: 22, tip: "Only accidents are covered in the first 30 days. Illness-related claims are rejected." },
      { reason: "Specific disease waiting period not completed", pct: 21, tip: "Conditions like hernia, cataract, and joint replacement have a 2-year waiting period." },
      { reason: "Treatment at non-network hospital without pre-authorisation", pct: 17, tip: "For cashless, always use network hospitals. For reimbursement, inform Niva Bupa within 24 hours of emergency admission." },
      { reason: "Claim amount exceeds sub-limits for specific treatments", pct: 12, tip: "Some treatments have sub-limits. Check your policy schedule for room rent and treatment-specific caps." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "36 months", desc: "Declared conditions at proposal stage" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "Maternity", duration: "Not covered", desc: "Not included in ReAssure 2.0" },
    ],
    ombudsmanComplaints: 198,
    avgSettlementDays: 9,
  },

  P003: { // Star Health Super Star
    insurer: "Star Health",
    csr: 91.06,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing disease", pct: 34, tip: "Star Health has one of the strictest underwriting checks. Any undisclosed condition — even minor — can void the policy." },
      { reason: "PED waiting period (4 years) not completed", pct: 27, tip: "Star Health has a 4-year PED waiting period — longer than most competitors. Plan accordingly." },
      { reason: "Treatment not medically necessary (as per Star's medical team)", pct: 19, tip: "Star Health's in-house medical team reviews all claims. Get a second opinion letter from your doctor explaining medical necessity." },
      { reason: "Claim filed after delay (beyond 15 days of discharge)", pct: 12, tip: "File reimbursement claims within 15 days of discharge. Star Health is strict about this deadline." },
      { reason: "Experimental or unproven treatment", pct: 8, tip: "Only treatments approved by standard medical practice are covered. Experimental therapies are excluded." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "48 months", desc: "Longest PED wait among major insurers — 4 full years" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "Maternity", duration: "Not covered", desc: "Not included in Super Star plan" },
    ],
    ombudsmanComplaints: 312,
    avgSettlementDays: 14,
  },

  P004: { // Care Health Care Supreme
    insurer: "Care Health",
    csr: 96.36,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 29, tip: "Care Health does thorough medical history checks. Disclose all conditions including those treated 5+ years ago." },
      { reason: "PED waiting period (4 years) not completed", pct: 25, tip: "Care Supreme has a 4-year PED waiting period. Consider Aditya Birla Activ One if you need immediate PED coverage." },
      { reason: "Claim for excluded treatment", pct: 20, tip: "OPD, dental, vision, and cosmetic treatments are excluded. Check the exclusion list in your policy document." },
      { reason: "Hospitalisation not medically necessary", pct: 16, tip: "Ensure your doctor documents medical necessity clearly. Care Health reviews all claims for medical necessity." },
      { reason: "Delay in intimation to insurer", pct: 10, tip: "Intimate Care Health within 24 hours of emergency admission and 48 hours before planned hospitalisation." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "48 months", desc: "4-year waiting period for declared conditions" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "Maternity", duration: "Not covered", desc: "Not included in Care Supreme" },
    ],
    ombudsmanComplaints: 176,
    avgSettlementDays: 8,
  },

  P005: { // Aditya Birla Activ One MAX
    insurer: "Aditya Birla Health",
    csr: 96.49,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 26, tip: "Even with zero PED waiting period, non-disclosure at proposal stage leads to claim rejection. Always be honest." },
      { reason: "OPD claim without valid prescription/bills", pct: 23, tip: "OPD claims require original prescriptions, bills, and doctor's notes. Keep all documents from every visit." },
      { reason: "Claim for excluded treatment", pct: 21, tip: "Cosmetic surgery, dental, vision correction, and fertility treatments are excluded even in the MAX plan." },
      { reason: "HealthReturns benefit misunderstood — not a claim", pct: 18, tip: "HealthReturns (up to 30% premium back) is a wellness benefit, not a claim. It requires meeting fitness targets via the app." },
      { reason: "Hospitalisation less than 24 hours (non-daycare)", pct: 12, tip: "Ensure your procedure is on the approved daycare list if hospitalisation is under 24 hours." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "0 days ✓", desc: "Unique — PED covered from Day 1 (chronic disease management programme)" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "Maternity", duration: "Not covered", desc: "Not included in Activ One MAX" },
    ],
    ombudsmanComplaints: 164,
    avgSettlementDays: 8,
  },

  P006: { // ICICI Lombard Health Companion
    insurer: "ICICI Lombard",
    csr: 96.73,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 27, tip: "ICICI Lombard uses advanced data analytics to detect undisclosed conditions. Full disclosure is essential." },
      { reason: "Maternity claim before 9-month waiting period", pct: 24, tip: "Maternity cover has a 9-month waiting period from policy start. Plan your policy purchase accordingly." },
      { reason: "PED waiting period (4 years) not completed", pct: 22, tip: "4-year PED waiting period applies. Conditions like diabetes, BP must wait 4 years before claims are accepted." },
      { reason: "Treatment at non-empanelled hospital", pct: 15, tip: "ICICI Lombard's network is smaller (6,500 hospitals). Always verify cashless empanelment before admission." },
      { reason: "Claim filed beyond 30-day deadline", pct: 12, tip: "File reimbursement claims within 30 days of discharge. Keep all original bills and discharge summary." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "48 months", desc: "4-year waiting period for declared conditions" },
      { label: "Maternity", duration: "9 months", desc: "Maternity cover kicks in after 9 months from policy start" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
    ],
    ombudsmanComplaints: 189,
    avgSettlementDays: 10,
  },

  P007: { // Star Health Senior Citizen Red Carpet
    insurer: "Star Health",
    csr: 91.06,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 36, tip: "Senior plans have the highest scrutiny. Disclose every condition — even those treated years ago." },
      { reason: "30% copay not understood — partial rejection", pct: 28, tip: "This plan has a 30% copay on all claims. You pay 30% of every bill. This is not a rejection but many seniors are surprised." },
      { reason: "Treatment not medically necessary", pct: 18, tip: "Star Health's medical team reviews senior claims carefully. Ensure your doctor documents necessity in detail." },
      { reason: "Claim for excluded treatment", pct: 11, tip: "Dental, vision, cosmetic, and hearing aids are excluded. Check the exclusion list carefully." },
      { reason: "Delay in claim intimation", pct: 7, tip: "Intimate Star Health within 24 hours of emergency admission. Delays lead to rejection." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "0 days ✓", desc: "PED covered from Day 1 — key benefit of this senior plan" },
      { label: "Specific diseases", duration: "12 months", desc: "Shorter wait for seniors — hernia, cataract, joint replacement" },
      { label: "Copay on all claims", duration: "30% always", desc: "You pay 30% of every claim amount — factor this into your budget" },
    ],
    ombudsmanComplaints: 298,
    avgSettlementDays: 15,
  },

  P008: { // Bajaj Allianz Platinum
    insurer: "Bajaj Allianz",
    csr: 97.28,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 30, tip: "Bajaj Allianz does thorough background checks. Disclose all conditions at proposal stage." },
      { reason: "PED waiting period (4 years) not completed", pct: 26, tip: "4-year PED waiting period. This plan does not cover pre-existing diseases — consider upgrading if you have PED." },
      { reason: "Sum insured (₹5L) exhausted — partial rejection", pct: 22, tip: "₹5L coverage can be exhausted in a single major hospitalisation. Consider a higher sum insured." },
      { reason: "Room rent cap exceeded", pct: 14, tip: "Room rent is capped at single AC room. If you take a higher room, proportionate deduction applies to the entire bill." },
      { reason: "Claim filed after 15-day deadline", pct: 8, tip: "File reimbursement claims within 15 days of discharge. Keep all original documents." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "48 months", desc: "PED not covered in this entry-level plan" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "Room rent cap", duration: "Always", desc: "Single AC room only — proportionate deduction if exceeded" },
    ],
    ombudsmanComplaints: 156,
    avgSettlementDays: 9,
  },

  P009: { // Tata AIG MediCare Premier
    insurer: "Tata AIG",
    csr: 96.84,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions at proposal", pct: 29, tip: "Tata AIG cross-references medical records during claim investigation. Disclose every condition honestly, including those treated years ago." },
      { reason: "International emergency claim without prior intimation", pct: 24, tip: "For international emergency claims, intimate Tata AIG within 24 hours of hospitalisation abroad. Keep the emergency helpline number saved." },
      { reason: "PED waiting period (3 years) not completed", pct: 22, tip: "3-year PED waiting period applies. Conditions like diabetes, BP, thyroid must wait 36 months before claims are accepted." },
      { reason: "Claim for excluded treatment (cosmetic, dental, fertility)", pct: 16, tip: "Cosmetic procedures, dental treatment, vision correction, and fertility treatments are excluded. Check the exclusion list before any procedure." },
      { reason: "Hospitalisation less than 24 hours (non-daycare)", pct: 9, tip: "Procedures under 24 hours are only covered if listed as approved daycare procedures. Verify before admission." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days (accidents covered from Day 1)" },
      { label: "Pre-existing diseases (PED)", duration: "36 months", desc: "Declared conditions at proposal — diabetes, BP, thyroid, etc." },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "International cover", duration: "From Day 1", desc: "Emergency international cover active from policy start" },
    ],
    ombudsmanComplaints: 168,
    avgSettlementDays: 8,
  },

  P010: { // Reliance General Health Gain
    insurer: "Reliance General",
    csr: 99.45,
    topRejectionReasons: [
      { reason: "Non-disclosure of pre-existing conditions", pct: 27, tip: "Despite the highest CSR in India, non-disclosure at proposal stage is the top rejection reason. Always be fully transparent." },
      { reason: "Treatment during initial 30-day waiting period", pct: 23, tip: "Only accidents are covered in the first 30 days. Any illness-related claim in this period will be rejected." },
      { reason: "Specific disease waiting period not completed", pct: 21, tip: "Conditions like hernia, cataract, and joint replacement have a 2-year waiting period. Check before scheduling procedures." },
      { reason: "Claim for excluded treatment", pct: 18, tip: "OPD, dental, vision, cosmetic, and maternity are excluded. Review the exclusion list in your policy document carefully." },
      { reason: "Delay in claim intimation beyond 48 hours", pct: 11, tip: "Intimate Reliance General within 48 hours of emergency admission. Planned hospitalisation must be intimated 72 hours in advance." },
    ],
    waitingPeriods: [
      { label: "Initial waiting period", duration: "30 days", desc: "No illness claims in first 30 days" },
      { label: "Pre-existing diseases (PED)", duration: "36 months", desc: "Declared conditions at proposal stage" },
      { label: "Specific diseases", duration: "24 months", desc: "Hernia, cataract, joint replacement, kidney stones" },
      { label: "Maternity", duration: "Not covered", desc: "Not included in Health Gain plan" },
    ],
    ombudsmanComplaints: 134,
    avgSettlementDays: 6,
  },
}
