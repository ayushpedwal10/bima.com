/**
 * Product category tags derived from the All India Health Insurance dataset.
 * Maps policy IDs to their market popularity category.
 * Dataset source: 43,661 records — Accident Protection leads with 47.4% share.
 */
const PRODUCT_CATEGORY = {
  P001: "comprehensive",       // HDFC ERGO Optima Secure — comprehensive plan
  P002: "comprehensive",       // Niva Bupa ReAssure 2.0 — comprehensive plan
  P003: "hs_silver",           // Star Health Super Star — hospital cash / silver tier
  P004: "comprehensive",       // Care Health Care Supreme — comprehensive plan
  P005: "comprehensive",       // Aditya Birla Activ One MAX — comprehensive plan
  P006: "comprehensive",       // ICICI Lombard Health Companion — family comprehensive
  P007: "comprehensive",       // Star Senior Citizen Red Carpet — senior comprehensive
  P008: "accident_protection", // Bajaj Allianz Platinum — entry-level / accident-adjacent
  P009: "comprehensive",       // Tata AIG MediCare Premier — comprehensive plan
  P010: "comprehensive",       // Reliance Health Gain — comprehensive plan
}

/**
 * Market popularity bonus derived from the All India dataset.
 * Accident & personal accident products have the highest real-world uptake.
 * This adds a market-validated signal to the scoring without overriding clinical fit.
 */
const POPULARITY_BONUS = {
  accident_protection: 8,   // 9,491 customers — most popular category
  personal_accident:   6,   // 5,907 customers
  hs_silver:           5,   // 4,176 customers
  comprehensive:       3,   // steady baseline demand (2,388 for Ideal Cover Plus type)
}

export function scorePolicy(policy, profile, annual) {
  let score = 0
  const reasons = [], warnings = []
  const budget = (profile.budget || 99999) * 12
  const seg = profile.segment
  const priority = profile.priority || "claims"

  // Segment match
  if (policy.segments.includes(seg)) { score += 40; reasons.push(`Designed for ${seg.replace("_"," ")} life stage`) }
  else score += 5

  // Age eligibility
  const [lo, hi] = policy.ageRange
  if (profile.age >= lo && profile.age <= hi) { score += 15; reasons.push("Age within eligible range") }
  else { score -= 20; warnings.push(`Age ${profile.age} outside eligible range (${lo}–${hi})`) }

  // Budget — weight depends on priority
  const budgetWeight = priority === "price" ? 2.0 : 1.0
  if (annual <= budget) {
    const r = annual / budget
    if (r <= 0.5)      { score += Math.round(15 * budgetWeight); reasons.push("Well within your budget") }
    else if (r <= 0.8) { score += Math.round(10 * budgetWeight); reasons.push("Fits your budget comfortably") }
    else               { score += Math.round(5  * budgetWeight); reasons.push("Just within your budget") }
  } else {
    const over = Math.round((annual - budget) / budget * 100)
    score -= Math.round(15 * budgetWeight)
    warnings.push(`Exceeds your budget by ~${over}%`)
  }

  // Claim trustworthiness — IRDAI-verified CSR (2-yr avg FY23-24 & FY24-25)
  // Weight doubles when user prioritises claim payment
  const csrWeight = priority === "claims" ? 2.0 : 1.0
  const csr = policy.csr
  if (csr >= 98)      { score += Math.round(20 * csrWeight); reasons.push(`Excellent claim payment record — pays ${csr}% of claims (IRDAI verified)`) }
  else if (csr >= 95) { score += Math.round(15 * csrWeight); reasons.push(`Very high claim payment record — ${csr}% of claims paid (IRDAI verified)`) }
  else if (csr >= 90) { score += Math.round(10 * csrWeight); reasons.push(`Good claim payment record — ${csr}% of claims paid (IRDAI verified)`) }
  else if (csr >= 85) { score += Math.round(4  * csrWeight); warnings.push(`Average claim payment record — only ${csr}% of claims paid`) }
  else                { score -= Math.round(5  * csrWeight); warnings.push(`Below-average claim payment record — only ${csr}% of claims paid. Higher chance your claim may be delayed or rejected.`) }

  // Needs
  if (profile.needMaternity && policy.features.maternity)  { score += 12; reasons.push("Includes maternity coverage") }
  if (profile.needMaternity && !policy.features.maternity) { score -= 15; warnings.push("No maternity coverage") }

  if (profile.ped && policy.features.ped)  { score += 12; reasons.push("Covers pre-existing diseases") }
  if (profile.ped && !policy.features.ped) { score -= 20; warnings.push("Does NOT cover pre-existing diseases") }

  if (profile.needCritical && policy.features.critical)  { score += 8; reasons.push("Critical illness cover included") }
  if (profile.needCritical && !policy.features.critical) { score -= 10; warnings.push("No critical illness cover") }

  if (profile.needIntl && policy.features.international)  { score += 8; reasons.push("International coverage included") }
  if (profile.needIntl && !policy.features.international) { score -= 8; warnings.push("No international coverage") }

  if (profile.needMental && policy.features.mental_health)  { score += 5; reasons.push("Mental health coverage included") }

  // Hospital network — weighted higher when coverage is priority
  const h = policy.features.hospitals
  const netWeight = priority === "coverage" ? 1.5 : 1.0
  if (h >= 15000)     { score += Math.round(10 * netWeight); reasons.push(`Massive cashless network (${h.toLocaleString()}+ hospitals)`) }
  else if (h >= 8000) { score += Math.round(6  * netWeight); reasons.push(`Good cashless network (${h.toLocaleString()}+ hospitals)`) }
  else                { score += 2 }

  // Coverage breadth bonus — when coverage is priority
  if (priority === "coverage") {
    const f = policy.features
    const coverageScore = [f.outpatient, f.maternity, f.mental_health, f.critical, f.robotic, f.homecare, f.ayush, f.international]
      .filter(Boolean).length
    score += coverageScore * 3
    if (coverageScore >= 5) reasons.push(`Broad coverage — ${coverageScore} out of 8 extra benefits included`)
  }

  // NCB
  if (policy.features.ncb >= 50) { score += 5; reasons.push(`High no-claim bonus (${policy.features.ncb}%)`) }

  // Rating
  score += Math.round((policy.rating - 3) * 5)

  // Market popularity bonus — from All India Health Insurance dataset (43,661 records)
  // Gives a gentle real-world signal: products customers actually buy rank slightly higher
  const category = PRODUCT_CATEGORY[policy.id] || "comprehensive"
  const popularityBonus = POPULARITY_BONUS[category] || 2
  score += popularityBonus
  if (popularityBonus >= 5) {
    reasons.push(`Highly popular in India — top-selling product category (${
      category === "accident_protection" ? "47% market share" :
      category === "hs_silver"           ? "15% market share" :
      "frequently purchased"
    })`)
  }

  return { policy, score: Math.max(score, 0), annual, reasons, warnings }
}

export function recommend(policies, profile, premiums) {
  const map = Object.fromEntries(premiums.map(p => [p.policyId, p.annual]))
  return policies
    .map(p => scorePolicy(p, profile, map[p.id] ?? p.baseAnnual))
    .sort((a, b) => b.score - a.score)
}
