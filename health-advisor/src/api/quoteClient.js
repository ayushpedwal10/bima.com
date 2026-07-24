/**
 * Quote API client — calls Flask backend when available, falls back to
 * the local JS engine if the server is unreachable or returns an error.
 *
 * Response shape matches what App.jsx expects:
 * { ranked, premiumMap, profile, source }
 *
 * source: "python_api" | "js_engine"
 */

import { POLICIES } from "../data/policies"
import { calcPremium, getSegment } from "../engine/calculator"
import { recommend } from "../engine/recommender"

const API_TIMEOUT_MS = 4000   // give Flask 4 seconds before falling back

// In production, point to your Render API URL via env var
// Set VITE_API_URL=https://your-app.onrender.com in Vercel environment variables
const API_BASE = import.meta.env.VITE_API_URL || ""

/**
 * Attempt to fetch a quote from the Flask backend.
 * Returns null if the server is unreachable.
 */
async function fetchFromAPI(profile) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE}/api/quote`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(profile),
      signal:  controller.signal,
    })

    clearTimeout(timer)

    if (!res.ok) return null

    const data = await res.json()
    if (data.error) return null

    return data   // { source, segment, premiumMap, ranked }

  } catch {
    clearTimeout(timer)
    return null   // server not running or timed out
  }
}

/**
 * Merge API response with local POLICIES data.
 * The API only returns scores + premiums; policy metadata stays in the JS bundle.
 */
function mergeWithLocalPolicies(apiData, fullProfile) {
  const policyById = Object.fromEntries(POLICIES.map(p => [p.id, p]))

  // Rebuild ranked array in the same shape as the JS engine produces
  const ranked = apiData.ranked.map(r => ({
    policy:   policyById[r.policyId],
    score:    r.score,
    reasons:  r.reasons,
    warnings: r.warnings,
    annual:   apiData.premiumMap[r.policyId]?.annual ?? 0,
  })).filter(r => r.policy)   // guard against unknown policy IDs

  return {
    ranked,
    premiumMap: apiData.premiumMap,
    profile:    { ...fullProfile, segment: apiData.segment },
    source:     "python_api",
  }
}

/**
 * Local JS engine fallback — identical to the original App.jsx logic.
 */
function calcLocalQuote(profile) {
  const seg         = getSegment(profile)
  const fullProfile = { ...profile, segment: seg }
  const premiums    = POLICIES.map(p => calcPremium(p, fullProfile))
  const ranked      = recommend(POLICIES, fullProfile, premiums)
  const premiumMap  = Object.fromEntries(premiums.map(p => [p.policyId, p]))

  return { ranked, premiumMap, profile: fullProfile, source: "js_engine" }
}

/**
 * Main entry point. Used by App.jsx instead of the inline calculation.
 *
 * @param {object} wizardData  - raw data from the 3-step wizard
 * @returns {Promise<{ranked, premiumMap, profile, source}>}
 */
export async function getQuote(wizardData) {
  // 1. Try the Python API
  const apiData = await fetchFromAPI(wizardData)

  if (apiData) {
    // Need a full profile for components that read profile.segment etc.
    const seg         = getSegment(wizardData)
    const fullProfile = { ...wizardData, segment: apiData.segment || seg }
    return mergeWithLocalPolicies(apiData, fullProfile)
  }

  // 2. Fall back to local JS engine (no network call needed)
  return calcLocalQuote(wizardData)
}

/**
 * Check if the Flask API server is reachable.
 * Used to show an "API connected" indicator in the UI.
 *
 * @returns {Promise<boolean>}
 */
export async function checkAPIHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2000) })
    if (!res.ok) return false
    const data = await res.json()
    return data.status === "ok"
  } catch {
    return false
  }
}
