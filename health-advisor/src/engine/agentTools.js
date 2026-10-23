import { POLICIES } from "../data/policies"
import { HOSPITALS, searchHospitals, PLAN_META } from "../data/hospitalData"
import { DISEASES, searchDiseases, COVERAGE_META } from "../data/diseaseData"
import { CLAIM_DATA } from "../data/claimRejectionData"
import { calcPremium, getSegment } from "./calculator"
import { recommend } from "./recommender"

/**
 * Gemini-compliant function declarations for the bima.com Autonomous AI Agent
 */
export const AGENT_TOOL_DECLARATIONS = [
  {
    name: "calculate_insurance_quote",
    description: "Calculates live indicative premiums and actuarial match scores for health insurance plans based on user profile and health declarations.",
    parameters: {
      type: "OBJECT",
      properties: {
        age: { type: "INTEGER", description: "Age of eldest family member" },
        city: { type: "STRING", description: "City in India (e.g., Bangalore, Mumbai, New Delhi, Pune)" },
        members: { type: "INTEGER", description: "Total number of members to cover (1 for individual, 2+ for floater)" },
        smoker: { type: "BOOLEAN", description: "True if user consumes tobacco or cigarettes in the last 12 months" },
        ped: { type: "BOOLEAN", description: "True if user has declared pre-existing diseases (Diabetes, BP, etc.)" },
        chronic: { type: "BOOLEAN", description: "True if user has chronic conditions (Asthma, Thyroid, etc.)" },
        budget: { type: "INTEGER", description: "Target monthly budget in INR (optional)" },
        priority: { type: "STRING", enum: ["claims", "price", "coverage"], description: "Primary evaluation criteria" }
      },
      required: ["age", "city"]
    }
  },
  {
    name: "search_cashless_hospitals",
    description: "Queries the empanelled network hospital database across 8 Indian metros to check which insurers offer cashless admission for a specific hospital.",
    parameters: {
      type: "OBJECT",
      properties: {
        hospitalName: { type: "STRING", description: "Hospital name or part of name (e.g., Apollo, Manipal, Fortis, Max, AIIMS)" },
        city: { type: "STRING", description: "City name in India (e.g. Bangalore, Mumbai, New Delhi, Chennai, Hyderabad)" }
      },
      required: ["hospitalName"]
    }
  },
  {
    name: "check_disease_waiting_period",
    description: "Looks up clinical coverage status, waiting periods (Day-1 vs 2-4 years), and restrictions for specific diseases across 10 insurers.",
    parameters: {
      type: "OBJECT",
      properties: {
        diseaseName: { type: "STRING", description: "Name of condition (e.g., Diabetes, Hypertension, Cancer, Cataract, Knee Replacement, Maternity, Asthma)" }
      },
      required: ["diseaseName"]
    }
  },
  {
    name: "get_claim_settlement_intelligence",
    description: "Retrieves official IRDAI audited Claim Settlement Ratios (CSR), average settlement days, and top claim rejection reasons for specific insurers.",
    parameters: {
      type: "OBJECT",
      properties: {
        providerName: { type: "STRING", description: "Insurer name (e.g., HDFC ERGO, Niva Bupa, Star Health, Care Health, Aditya Birla, ICICI Lombard)" }
      },
      required: ["providerName"]
    }
  },
  {
    name: "audit_room_rent_penalty",
    description: "Calculates the financial penalty and proportionate deduction risk if hospital room rent exceeds the policy cap.",
    parameters: {
      type: "OBJECT",
      properties: {
        dailyRoomRate: { type: "INTEGER", description: "Actual hospital daily room rent cost in INR" },
        sumInsuredLakhs: { type: "INTEGER", description: "Policy sum insured in Lakhs (e.g. 5, 10, 15)" },
        planName: { type: "STRING", description: "Name of health insurance plan (optional)" }
      },
      required: ["dailyRoomRate", "sumInsuredLakhs"]
    }
  }
]

/**
 * Executes an agent tool locally with factual application data
 */
export function executeAgentTool(toolName, args, defaultProfile = {}) {
  switch (toolName) {
    case "calculate_insurance_quote": {
      const profile = {
        age: args.age || defaultProfile?.age || 30,
        city: args.city || defaultProfile?.city || "Bangalore",
        members: args.members || defaultProfile?.members || 1,
        smoker: args.smoker ?? defaultProfile?.smoker ?? false,
        ped: args.ped ?? defaultProfile?.ped ?? false,
        chronic: args.chronic ?? defaultProfile?.chronic ?? false,
        hasChildren: (args.members || 1) >= 3,
        budget: args.budget || defaultProfile?.budget || 2000,
        priority: args.priority || defaultProfile?.priority || "claims",
        isStudent: false,
      }
      profile.segment = getSegment(profile)

      const premiums = POLICIES.map(p => ({
        policyId: p.id,
        ...calcPremium(p, profile)
      }))

      const ranked = recommend(POLICIES, profile, premiums)
      const top3 = ranked.slice(0, 3).map(r => {
        const pr = premiums.find(p => p.policyId === r.policy.id)
        return {
          rank: r.rank || 1,
          plan: r.policy.name,
          insurer: r.policy.provider,
          fitScore: r.score,
          monthlyINR: pr.monthly,
          annualINR: pr.annual,
          csrPct: r.policy.csr,
          copayPct: r.policy.copay,
          roomRent: r.policy.roomRent,
          topStrengths: r.reasons?.slice(0, 3) || []
        }
      })

      return {
        evaluatedProfile: { age: profile.age, city: profile.city, members: profile.members, smoker: profile.smoker, ped: profile.ped },
        topRecommendations: top3,
        totalPlansEvaluated: POLICIES.length
      }
    }

    case "search_cashless_hospitals": {
      const q = (args.hospitalName || "").toLowerCase().trim()
      const city = args.city || ""
      const matches = searchHospitals({ query: q, city })

      return {
        matchedCount: matches.length,
        hospitals: matches.slice(0, 5).map(h => ({
          name: h.name,
          city: h.city,
          area: h.area,
          beds: h.beds,
          type: h.type,
          empanelledPlansCount: h.plans.length,
          coveredInsurers: h.plans.map(pId => PLAN_META[pId]?.short).filter(Boolean)
        }))
      }
    }

    case "check_disease_waiting_period": {
      const q = (args.diseaseName || "").toLowerCase().trim()
      const matches = searchDiseases({ query: q })

      if (!matches.length) {
        return { message: `No exact clinical record found for "${args.diseaseName}". Standard IRDAI pre-existing disease waiting period is 24 to 36 months.` }
      }

      const disease = matches[0]
      const coverageBreakdown = Object.entries(disease.coverage).map(([planId, status]) => ({
        plan: PLAN_META[planId]?.short || planId,
        statusLabel: COVERAGE_META[status]?.label || status,
        isDay1: status === "day1",
        isExcluded: status === "excluded"
      }))

      const day1Plans = coverageBreakdown.filter(p => p.isDay1).map(p => p.plan)

      return {
        diseaseName: disease.name,
        category: disease.category,
        description: disease.description,
        notes: disease.notes,
        day1CoveredInsurers: day1Plans.length ? day1Plans : "None (subject to standard waiting period)",
        fullBreakdown: coverageBreakdown
      }
    }

    case "get_claim_settlement_intelligence": {
      const pName = (args.providerName || "").toLowerCase().trim()
      const policyMatch = POLICIES.find(p => p.provider.toLowerCase().includes(pName) || p.name.toLowerCase().includes(pName)) || POLICIES[0]
      const claimInfo = CLAIM_DATA[policyMatch.id] || CLAIM_DATA["P001"]

      return {
        insurer: policyMatch.provider,
        planName: policyMatch.name,
        officialCSRPct: policyMatch.csr,
        irdaStatus: policyMatch.csr >= 95 ? "Tier-1 Top Settle" : "Average Industry Settle",
        avgSettlementTurnaroundDays: claimInfo.avgSettlementDays || 12,
        topRejectionReasons: claimInfo.topRejectionReasons?.slice(0, 3) || []
      }
    }

    case "audit_room_rent_penalty": {
      const rate = args.dailyRoomRate || 8000
      const siLakhs = args.sumInsuredLakhs || 5
      const standard1PctLimit = siLakhs * 1000 // 1% of Sum Insured

      const hasPenalty = rate > standard1PctLimit
      const proportionateFactor = hasPenalty ? Math.round(((rate - standard1PctLimit) / rate) * 100) : 0

      return {
        dailyRoomCostINR: rate,
        planSumInsuredLakhs: siLakhs,
        standard1PctCapINR: standard1PctLimit,
        penaltyApplies: hasPenalty,
        proportionateDeductionPct: proportionateFactor,
        warningExplanation: hasPenalty
          ? `If you choose a room at ₹${rate.toLocaleString()}/day on a plan with 1% cap, you exceed the ₹${standard1PctLimit.toLocaleString()}/day limit. The insurer will deduct ~${proportionateFactor}% from your ENTIRE hospital bill (doctors, ICU, medicines). Look for plans with 'No Room Rent Cap' (like HDFC Optima Secure or Care Supreme).`
          : `Room cost ₹${rate.toLocaleString()}/day is within the ₹${standard1PctLimit.toLocaleString()}/day limit. No proportionate deduction penalty will apply.`
      }
    }

    default:
      return { error: `Unknown agent tool: ${toolName}` }
  }
}
