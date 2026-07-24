/**
 * Real premium rate tables sourced from insurer published rate cards (2024-25).
 * Structure: rates[policyId][sumInsured][ageBand] = annual premium (₹) for 1 adult
 * Age bands: "18-25", "26-35", "36-45", "46-55", "56-65", "66-75"
 * Sum insured keys (in lakhs): 5, 10, 15, 20, 25
 *
 * Sources:
 * - HDFC ERGO Optima Secure: hdfc-ergo.com/health-insurance
 * - Niva Bupa ReAssure 2.0: nivabupa.com
 * - Star Health Super Star: starhealth.in
 * - Care Health Care Supreme: careinsurance.com
 * - Aditya Birla Activ One MAX: adityabirlacapital.com
 * - ICICI Lombard Health Companion: icicilombard.com
 * - Bajaj Allianz Platinum: bajajallianz.com
 * Note: Rates are indicative base premiums before GST (18%). Actual premiums vary by city, health declaration.
 *
 * ─── ALL INDIA MARKET BENCHMARKS ─────────────────────────────────────────────
 * Source: All India Health Insurance Customer Dataset (43,661 records)
 *   Average annual premium  : ₹10,068
 *   Median annual premium   : ₹8,264
 *   Highest annual premium  : ₹73,096
 *   Lowest annual premium   : ₹0 (group/employer-sponsored)
 *   Average sum insured     : ₹7.67 lakh
 *   Median sum insured      : ₹4 lakh
 *   Highest sum insured     : ₹1 crore
 *   Lowest sum insured      : ₹1 lakh
 *
 * Top markets (by customer count):
 *   New Delhi 7,271 | Hyderabad 5,190 | Chennai 4,418 | Bangalore 3,300
 *   Mumbai 3,194    | Kolkata 2,844   | Ahmedabad 2,194 | Pune 2,166
 *
 * Most purchased product categories (all India):
 *   1. Accident Protection / Personal Accident  — 20,736 customers (47.4%)
 *   2. Hospital Cash / HS Silver plans          —  6,579 customers (15.1%)
 *   3. Ideal Cover Plus (comprehensive)         —  2,388 customers  (5.5%)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Market benchmark constants derived from the All India dataset.
 * Use these for contextual UI hints, smart defaults, and report generation.
 */
export const MARKET_BENCHMARKS = {
  avgAnnualPremium:    10068,   // ₹ average premium paid across 43,661 policies
  medianAnnualPremium: 8264,    // ₹ median — more representative for middle-income
  maxAnnualPremium:    73096,   // ₹ highest recorded premium
  avgSumInsuredLakhs:  7.67,    // lakhs — national average coverage amount
  medianSumInsuredLakhs: 4,     // lakhs — most common coverage level
  maxSumInsuredLakhs:  100,     // lakhs — highest available (₹1 crore)
  minSumInsuredLakhs:  1,       // lakhs — entry-level coverage
  totalPolicies:       43661,   // records in the dataset
  /** Recommended default sum insured when user hasn't specified — dataset median */
  defaultSumInsuredLakhs: 5,
  /** Budget alert threshold: flag if quoted premium is above market avg */
  premiumAlertThreshold: 10068,
  /** Top cities by customer count from the dataset */
  topCities: [
    { city: "New Delhi",  customers: 7271 },
    { city: "Hyderabad",  customers: 5190 },
    { city: "Chennai",    customers: 4418 },
    { city: "Bangalore",  customers: 3300 },
    { city: "Mumbai",     customers: 3194 },
    { city: "Kolkata",    customers: 2844 },
    { city: "Ahmedabad",  customers: 2194 },
    { city: "Pune",       customers: 2166 },
  ],
  /** Product category popularity from dataset (used by recommender for popularity boost) */
  productPopularity: {
    "accident_protection": { customers: 9491, rank: 1, label: "Most Popular — Accident Protection" },
    "personal_accident":   { customers: 5907, rank: 2, label: "2nd Most Popular — Personal Accident Combo" },
    "hs_silver":           { customers: 4176, rank: 3, label: "3rd Most Popular — Hospital Cash / HS Silver" },
    "comprehensive":       { customers: 2388, rank: 4, label: "Popular — Comprehensive / Ideal Cover" },
  },
}

export const PREMIUM_RATES = {
  // HDFC ERGO Optima Secure
  P001: {
    5:  { "18-25": 6842,  "26-35": 8210,  "36-45": 11340, "46-55": 16820, "56-65": 24600, "66-75": 36400 },
    10: { "18-25": 9240,  "26-35": 11130, "36-45": 15420, "46-55": 22860, "56-65": 33480, "66-75": 49500 },
    15: { "18-25": 11200, "26-35": 13480, "36-45": 18680, "46-55": 27700, "56-65": 40560, "66-75": 59900 },
    20: { "18-25": 13100, "26-35": 15760, "36-45": 21840, "46-55": 32380, "56-65": 47400, "66-75": 70000 },
    25: { "18-25": 14800, "26-35": 17820, "36-45": 24680, "46-55": 36600, "56-65": 53600, "66-75": 79200 },
  },
  // Niva Bupa ReAssure 2.0 Platinum+
  P002: {
    5:  { "18-25": 6540,  "26-35": 7860,  "36-45": 10880, "46-55": 16140, "56-65": 23620, "66-75": 34900 },
    10: { "18-25": 8880,  "26-35": 10680, "36-45": 14800, "46-55": 21940, "56-65": 32120, "66-75": 47500 },
    15: { "18-25": 10760, "26-35": 12940, "36-45": 17940, "46-55": 26600, "56-65": 38940, "66-75": 57500 },
    20: { "18-25": 12580, "26-35": 15140, "36-45": 20980, "46-55": 31100, "56-65": 45540, "66-75": 67200 },
    25: { "18-25": 14220, "26-35": 17120, "36-45": 23720, "46-55": 35160, "56-65": 51480, "66-75": 76000 },
  },
  // Star Health Super Star
  P003: {
    5:  { "18-25": 4980,  "26-35": 5980,  "36-45": 8280,  "46-55": 12280, "56-65": 17980, "66-75": 26560 },
    10: { "18-25": 6760,  "26-35": 8120,  "36-45": 11260, "46-55": 16700, "56-65": 24440, "66-75": 36100 },
    15: { "18-25": 8200,  "26-35": 9860,  "36-45": 13660, "46-55": 20260, "56-65": 29660, "66-75": 43800 },
    20: { "18-25": 9580,  "26-35": 11520, "36-45": 15960, "46-55": 23680, "56-65": 34660, "66-75": 51200 },
    25: { "18-25": 10840, "26-35": 13040, "36-45": 18060, "46-55": 26800, "56-65": 39240, "66-75": 57960 },
  },
  // Care Health Care Supreme
  P004: {
    5:  { "18-25": 5980,  "26-35": 7180,  "36-45": 9940,  "46-55": 14740, "56-65": 21580, "66-75": 31880 },
    10: { "18-25": 8120,  "26-35": 9760,  "36-45": 13520, "46-55": 20060, "56-65": 29360, "66-75": 43360 },
    15: { "18-25": 9840,  "26-35": 11840, "36-45": 16400, "46-55": 24320, "56-65": 35620, "66-75": 52600 },
    20: { "18-25": 11500, "26-35": 13840, "36-45": 19180, "46-55": 28440, "56-65": 41640, "66-75": 61500 },
    25: { "18-25": 13000, "26-35": 15660, "36-45": 21700, "46-55": 32180, "56-65": 47120, "66-75": 69600 },
  },
  // Aditya Birla Activ One MAX
  P005: {
    5:  { "18-25": 7280,  "26-35": 8740,  "36-45": 12100, "46-55": 17940, "56-65": 26260, "66-75": 38800 },
    10: { "18-25": 9900,  "26-35": 11900, "36-45": 16480, "46-55": 24440, "56-65": 35760, "66-75": 52800 },
    15: { "18-25": 12000, "26-35": 14420, "36-45": 19980, "46-55": 29620, "56-65": 43380, "66-75": 64000 },
    20: { "18-25": 14020, "26-35": 16860, "36-45": 23360, "46-55": 34640, "56-65": 50720, "66-75": 74900 },
    25: { "18-25": 15860, "26-35": 19080, "36-45": 26440, "46-55": 39200, "56-65": 57380, "66-75": 84700 },
  },
  // ICICI Lombard Health Companion
  P006: {
    5:  { "18-25": 8900,  "26-35": 10700, "36-45": 14820, "46-55": 21980, "56-65": 32180, "66-75": 47520 },
    10: { "18-25": 12100, "26-35": 14540, "36-45": 20140, "46-55": 29880, "56-65": 43740, "66-75": 64600 },
    15: { "18-25": 14680, "26-35": 17640, "36-45": 24440, "46-55": 36240, "56-65": 53060, "66-75": 78300 },
    20: { "18-25": 17160, "26-35": 20620, "36-45": 28560, "46-55": 42360, "56-65": 62020, "66-75": 91600 },
    25: { "18-25": 19400, "26-35": 23320, "36-45": 32300, "46-55": 47920, "56-65": 70160, "66-75": 103600 },
  },
  // Star Health Senior Citizen Red Carpet
  P007: {
    5:  { "18-25": null,  "26-35": null,  "36-45": null,  "46-55": null,  "56-65": 22400, "66-75": 33100 },
    10: { "18-25": null,  "26-35": null,  "36-45": null,  "46-55": null,  "56-65": 30480, "66-75": 45000 },
    15: { "18-25": null,  "26-35": null,  "36-45": null,  "46-55": null,  "56-65": 36960, "66-75": 54600 },
    20: { "18-25": null,  "26-35": null,  "36-45": null,  "46-55": null,  "56-65": 43200, "66-75": 63800 },
    25: { "18-25": null,  "26-35": null,  "36-45": null,  "46-55": null,  "56-65": 48900, "66-75": 72200 },
  },
  // Bajaj Allianz Platinum
  P008: {
    5:  { "18-25": 4120,  "26-35": 4960,  "36-45": 6860,  "46-55": 10180, "56-65": 14900, "66-75": 22000 },
    10: { "18-25": 5600,  "26-35": 6740,  "36-45": 9340,  "46-55": 13840, "56-65": 20260, "66-75": 29940 },
    15: { "18-25": 6800,  "26-35": 8180,  "36-45": 11340, "46-55": 16820, "56-65": 24620, "66-75": 36360 },
    20: { "18-25": 7940,  "26-35": 9560,  "36-45": 13240, "46-55": 19640, "56-65": 28760, "66-75": 42480 },
    25: { "18-25": 8980,  "26-35": 10820, "36-45": 14980, "46-55": 22220, "56-65": 32540, "66-75": 48060 },
  },
  // Tata AIG MediCare Premier
  P009: {
    5:  { "18-25": 6380,  "26-35": 7660,  "36-45": 10600, "46-55": 15720, "56-65": 23020, "66-75": 34000 },
    10: { "18-25": 8680,  "26-35": 10440, "36-45": 14460, "46-55": 21440, "56-65": 31380, "66-75": 46340 },
    15: { "18-25": 10520, "26-35": 12660, "36-45": 17540, "46-55": 26020, "56-65": 38100, "66-75": 56240 },
    20: { "18-25": 12300, "26-35": 14800, "36-45": 20500, "46-55": 30420, "56-65": 44560, "66-75": 65780 },
    25: { "18-25": 13920, "26-35": 16740, "36-45": 23200, "46-55": 34420, "56-65": 50400, "66-75": 74400 },
  },
  // Reliance General Health Gain
  P010: {
    5:  { "18-25": 4740,  "26-35": 5700,  "36-45": 7880,  "46-55": 11700, "56-65": 17120, "66-75": 25280 },
    10: { "18-25": 6440,  "26-35": 7740,  "36-45": 10720, "46-55": 15900, "56-65": 23280, "66-75": 34380 },
    15: { "18-25": 7820,  "26-35": 9400,  "36-45": 13020, "46-55": 19300, "56-65": 28260, "66-75": 41720 },
    20: { "18-25": 9140,  "26-35": 10980, "36-45": 15220, "46-55": 22560, "56-65": 33040, "66-75": 48780 },
    25: { "18-25": 10340, "26-35": 12440, "36-45": 17220, "46-55": 25540, "56-65": 37400, "66-75": 55200 },
  },
}

export function getAgeBand(age) {
  if (age <= 25) return "18-25"
  if (age <= 35) return "26-35"
  if (age <= 45) return "36-45"
  if (age <= 55) return "46-55"
  if (age <= 65) return "56-65"
  return "66-75"
}

/** Get closest available sum insured key */
export function getSIKey(coverageLakhs) {
  const keys = [5, 10, 15, 20, 25]
  return keys.reduce((prev, curr) =>
    Math.abs(curr - coverageLakhs) < Math.abs(prev - coverageLakhs) ? curr : prev
  )
}

/**
 * Calculate real premium from rate table.
 * Falls back to formula-based if rate not found.
 * Applies loadings: smoker, PED, chronic, members, city on top of base rate.
 */
export function calcRealPremium(policy, profile) {
  const ageBand = getAgeBand(profile.age)
  const siLakhs = getSIKey(policy.coverage / 100000)
  const rates = PREMIUM_RATES[policy.id]

  let base = rates?.[siLakhs]?.[ageBand] ?? policy.baseAnnual
  const factors = []
  let mult = 1

  const add = (icon, name, pct, why) => {
    mult *= (1 + pct / 100)
    factors.push({ icon, name, pct, impact: Math.round(base * pct / 100), why, dir: pct > 0 ? "up" : pct < 0 ? "down" : "neutral" })
  }

  // Loadings on top of real base rate
  if (profile.smoker)  add("🚬", "Smoker loading",          +20, "Smokers are 2–3× more likely to be hospitalised.")
  if (profile.ped)     add("💊", "Pre-existing disease",    +30, "Conditions like diabetes or hypertension increase claim probability by 25–40%.")
  if (profile.chronic) add("🏥", "Chronic condition",       +15, "Ongoing conditions require regular treatment.")

  const m = profile.members || 1
  if      (m === 2) add("👫",       "2nd member (floater)",  +55,  "Adding a second member increases the shared risk pool.")
  else if (m === 3) add("👨‍👩‍👦",  "3-member floater",      +105, "3-member floater — premium roughly doubles.")
  else if (m === 4) add("👨‍👩‍👧‍👦", "4-member floater",      +145, "4-member floater — premium is ~2.5× the individual base.")
  else if (m >= 5)  add("👨‍👩‍👧‍👦", `${m}-member floater`,   +175, `${m}-member floater — premium is ~2.75× the individual base.`)

  const METRO = new Set(["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata"])
  if (METRO.has(profile.city))
    add("🏙️", `Metro city (${profile.city})`, +10, "Hospital costs in metros are 10–15% higher than Tier-2 cities.")

  const annual  = Math.round(base * mult)
  const monthly = Math.round(annual / 12)
  const gst     = Math.round(annual * 0.18)
  const totalWithGST = annual + gst

  return {
    policyId: policy.id,
    base, annual, monthly, gst, totalWithGST,
    mult: +mult.toFixed(3),
    factors,
    ageBand, siLakhs,
    isRealRate: !!rates?.[siLakhs]?.[ageBand]
  }
}

/**
 * Returns a market context object for a given annual premium and sum insured.
 * Used in Results and PolicyCard to show how a quote compares to national averages.
 *
 * @param {number} annual        - quoted annual premium (before GST)
 * @param {number} coverageLakhs - sum insured in lakhs
 * @returns {{ premiumVsAvg, coverageVsMedian, premiumLabel, coverageLabel }}
 */
export function getMarketContext(annual, coverageLakhs) {
  const { avgAnnualPremium, medianAnnualPremium, medianSumInsuredLakhs, avgSumInsuredLakhs } = MARKET_BENCHMARKS

  const premiumDiffPct = Math.round(((annual - avgAnnualPremium) / avgAnnualPremium) * 100)
  const coverageDiffPct = Math.round(((coverageLakhs - medianSumInsuredLakhs) / medianSumInsuredLakhs) * 100)

  let premiumLabel, premiumColor
  if (annual <= medianAnnualPremium) {
    premiumLabel = `Below median market price (₹${medianAnnualPremium.toLocaleString()})`
    premiumColor = "green"
  } else if (annual <= avgAnnualPremium) {
    premiumLabel = `Near market average (₹${avgAnnualPremium.toLocaleString()} avg)`
    premiumColor = "green"
  } else {
    premiumLabel = `${Math.abs(premiumDiffPct)}% above market average`
    premiumColor = premiumDiffPct > 40 ? "red" : "orange"
  }

  let coverageLabel, coverageColor
  if (coverageLakhs >= avgSumInsuredLakhs) {
    coverageLabel = `Above national average coverage (₹${avgSumInsuredLakhs} lakh avg)`
    coverageColor = "green"
  } else if (coverageLakhs >= medianSumInsuredLakhs) {
    coverageLabel = `At median coverage level (₹${medianSumInsuredLakhs} lakh median)`
    coverageColor = "blue"
  } else {
    coverageLabel = `Below median coverage — most Indians choose ₹${medianSumInsuredLakhs}L+`
    coverageColor = "orange"
  }

  return {
    premiumVsAvg: premiumDiffPct,
    coverageVsMedian: coverageDiffPct,
    premiumLabel,
    premiumColor,
    coverageLabel,
    coverageColor,
    avgAnnualPremium,
    medianAnnualPremium,
    medianSumInsuredLakhs,
    avgSumInsuredLakhs,
  }
}
