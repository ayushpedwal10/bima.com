/**
 * AI Insights Engine v2 — conversational, personalised, second-person narrative
 * Speaks directly to the user. Makes non-obvious connections. No generic summaries.
 */
import { CLAIM_DATA } from "../data/claimRejectionData"

function fmt(n) {
  if (n >= 100000) return `Rs.${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `Rs.${(n / 1000).toFixed(0)}K`
  return `Rs.${n}`
}
function fmtMo(annual) { return `Rs.${Math.round(annual / 12).toLocaleString()}` }
function yrs(months)   { return months === 0 ? "Day 1" : months >= 12 ? `${months/12} yr${months/12>1?"s":""}` : `${months} months` }

export function generateInsights(profile, ranked, premiumMap) {
  const cards = []
  const top   = ranked[0]
  const topPr = premiumMap[top.policy.id]
  const cd    = CLAIM_DATA[top.policy.id]

  const age     = profile.age
  const city    = profile.city || "your city"
  const members = profile.members || 1
  const smoker  = profile.smoker
  const ped     = profile.ped
  const chronic = profile.chronic
  const bmi     = profile.bmi || 22
  const budget  = (profile.budget || 9999) * 12
  const seg     = profile.segment
  const priority= profile.priority

  // ── convenience ──────────────────────────────────────────────
  const top2      = ranked[1]
  const top3      = ranked[2]
  const top2Pr    = top2 && premiumMap[top2.policy.id]
  const allPolicies = ranked.map(r => r.policy)
  const zeroPED   = ranked.filter(r => r.policy.pedWait === 0)
  const unlimRest = ranked.filter(r => r.policy.restore.toLowerCase().includes("unlimited"))
  const metro     = new Set(["Mumbai","New Delhi","Bangalore","Chennai","Hyderabad","Kolkata"])
  const isMetro   = metro.has(city)

  // risk profile string
  const riskFactors = [smoker && "smoking", ped && "a pre-existing condition", chronic && "a chronic condition", bmi >= 30 && "high BMI"].filter(Boolean)
  const riskStr = riskFactors.length === 0 ? "a clean health record" : riskFactors.join(" + ")

  // ── CARD 1: The verdict — direct, specific, confident ────────
  {
    const gap       = top.score - (top2?.score || 0)
    const gapWord   = gap >= 20 ? "significantly ahead" : gap >= 10 ? "clearly better" : "the best fit"
    const whyTop    = top.reasons[0] || `designed for ${seg.replace("_"," ")} profiles`
    const costRelBudget = topPr.annual <= budget
      ? `fits your Rs.${profile.budget?.toLocaleString()}/month budget`
      : `costs Rs.${Math.round((topPr.annual - budget)/12).toLocaleString()}/month over your budget`

    cards.push({
      id: "verdict",
      type: "verdict",
      icon: "🎯",
      label: "Our Verdict",
      headline: `${top.policy.name} is the right plan for you`,
      subline: `${top.policy.provider} · Score ${top.score}/100 · ${fmtMo(topPr.annual)}/month`,
      body: `You're ${age}, in ${city}, with ${riskStr}${members > 1 ? `, covering ${members} people` : ""}. Given that combination, ${top.policy.name} is ${gapWord} — it ${whyTop.toLowerCase()} and ${costRelBudget}. ${top2 ? `The next best option, ${top2.policy.name}, scores ${top2.score} — ${gap} points lower.` : ""}`,
      chips: top.reasons.slice(0,3).map(r => ({ text: r, good: true })),
      score: top.score,
    })
  }

  // ── CARD 2: The one thing that could ruin your claim ─────────
  {
    const worstRisk = cd?.topRejectionReasons?.[0]
    const personal  = ped
      ? `You declared a pre-existing condition. ${top.policy.name} has a ${yrs(top.policy.pedWait)} PED waiting period. If you claim for that condition before ${yrs(top.policy.pedWait)}, it will be rejected — 100% of the time.`
      : smoker
        ? `You're a smoker. ${cd?.topRejectionReasons?.find(r => r.reason.toLowerCase().includes("disclos"))?.reason || "Non-disclosure is the #1 rejection reason"} — make sure your smoking status is declared at proposal.`
        : `With ${top.policy.provider}, the #1 reason claims get rejected is: "${worstRisk?.reason}".`

    cards.push({
      id: "claim_trap",
      type: "warning",
      icon: "⚠️",
      label: "Claim Trap to Avoid",
      headline: `The #1 way your claim gets rejected with ${top.policy.provider}`,
      subline: `${top.policy.csr}% claims paid · Avg settlement ${cd?.avgSettlementDays || "?"} days`,
      body: `${personal} ${worstRisk?.tip || ""}`,
      chips: cd?.topRejectionReasons?.slice(0,2).map(r => ({ text: r.reason, good: false })) || [],
    })
  }

  // ── CARD 3: The money angle — specific to their situation ────
  {
    const costNow  = topPr.annual
    const cost5yr  = Math.round(costNow * Math.pow(1.08, 5))
    const cost10yr = Math.round(costNow * Math.pow(1.08, 10))
    const savedVsWaiting5 = (cost5yr - costNow) * 10  // 10yr savings

    let moneyAngle = ""
    if (age < 30) {
      moneyAngle = `You're ${age}. That's the sweet spot — you're in the cheapest age bracket that exists. ${top.policy.name} costs ${fmtMo(costNow)}/month today. Wait 5 years and the same plan costs ~${fmtMo(cost5yr)}/month. Over 10 years, buying now vs at ${age+5} saves roughly ${fmt(savedVsWaiting5)}.`
    } else if (age < 40) {
      moneyAngle = `At ${age}, you're still in a good premium bracket. ${top.policy.name} is ${fmtMo(costNow)}/month now — that's ${fmt(costNow)}/year. In 10 years at 8% annual increase, it'll be ~${fmtMo(cost10yr)}/month. Locking in today makes sense.`
    } else {
      const loadingEst = smoker && ped ? "50%" : smoker || ped ? "30%" : "standard"
      moneyAngle = `At ${age}${riskFactors.length > 0 ? ` with ${riskStr}` : ""}, your premium includes a ${loadingEst} loading. That's why you're paying ${fmtMo(costNow)}/month instead of the base rate. The quickest way to reduce this: ${smoker ? "quitting smoking saves ~20%" : ped ? "manage your condition actively — some insurers reduce loading on renewal" : "maintain a no-claim record to build NCB"}.`
    }

    // compare with cheapest
    const cheapest = [...ranked].sort((a,b) => premiumMap[a.policy.id].annual - premiumMap[b.policy.id].annual)[0]
    const cheapDiff = topPr.annual - premiumMap[cheapest.policy.id].annual
    const cheapNote = cheapDiff > 1500 && cheapest.policy.id !== top.policy.id
      ? ` The cheapest option (${cheapest.policy.name}) saves ${fmt(cheapDiff)}/year but its claim payment rate is ${cheapest.policy.csr}% — vs ${top.policy.csr}% for your top pick. That ${(top.policy.csr - cheapest.policy.csr).toFixed(1)}% gap means ${Math.round(top.policy.csr - cheapest.policy.csr)} more claims paid per 100.`
      : ""

    cards.push({
      id: "money",
      type: "money",
      icon: "💰",
      label: "The Money Angle",
      headline: `What ${fmtMo(topPr.annual)}/month actually buys you`,
      subline: `${fmt(topPr.annual)}/year · ${fmt(topPr.totalWithGST)}/year with GST`,
      body: moneyAngle + cheapNote,
      chips: [
        { text: `${top.policy.name}: ${fmtMo(topPr.annual)}/mo`, good: true },
        cheapDiff > 0 ? { text: `Cheapest option saves ${fmt(cheapDiff)}/yr but ${(top.policy.csr - cheapest.policy.csr).toFixed(1)}% lower CSR`, good: false } : null,
      ].filter(Boolean),
    })
  }

  // ── CARD 4: PED — only if relevant, very specific ────────────
  if (ped || chronic) {
    const topWait   = top.policy.pedWait
    const bestWait  = zeroPED.length > 0 ? zeroPED[0] : ranked.sort((a,b) => a.policy.pedWait - b.policy.pedWait)[0]
    const waitYrs   = yrs(topWait)
    const outOfPocket = topWait > 0
      ? `During that ${waitYrs}, every rupee of treatment for your pre-existing condition comes from your pocket — insurance won't touch it.`
      : `Your top pick covers your condition from Day 1 — you're in the best possible position.`

    const zeroNote = zeroPED.length > 0 && top.policy.pedWait > 0
      ? ` If immediate cover is non-negotiable, ${zeroPED.map(r=>r.policy.name).join(" and ")} cover PED from Day 1. ${zeroPED[0].policy.name} costs ${fmtMo(premiumMap[zeroPED[0].policy.id].annual)}/month.`
      : ""

    cards.push({
      id: "ped",
      type: topWait > 0 ? "warning" : "good",
      icon: "💊",
      label: "Pre-existing Condition",
      headline: topWait === 0
        ? `Good news — your condition is covered from Day 1`
        : `Your condition has a ${waitYrs} waiting period`,
      subline: `${top.policy.name} · PED wait: ${waitYrs}`,
      body: `You have ${ped ? "a pre-existing disease" : "a chronic condition"}. ${outOfPocket}${zeroNote}`,
      chips: [
        { text: `${top.policy.name}: PED wait ${waitYrs}`, good: topWait === 0 },
        ...zeroPED.slice(0,2).map(r => ({ text: `${r.policy.name}: Day 1 PED cover`, good: true })),
      ],
    })
  }

  // ── CARD 5: The vs comparison — direct head to head ──────────
  if (top2 && top2Pr) {
    const priceDiff  = top2Pr.annual - topPr.annual
    const csrDiff    = top.policy.csr - top2.policy.csr
    const coverDiff  = top.policy.coverage - top2.policy.coverage
    const pedDiff    = top2.policy.pedWait - top.policy.pedWait

    const winner = []
    const loser  = []

    if (priceDiff > 0)   winner.push(`${fmt(Math.abs(priceDiff))}/yr cheaper`)
    else if (priceDiff < 0) loser.push(`${fmt(Math.abs(priceDiff))}/yr more expensive`)
    if (csrDiff > 0.5)   winner.push(`${csrDiff.toFixed(1)}% better claim rate`)
    else if (csrDiff < -0.5) loser.push(`${Math.abs(csrDiff).toFixed(1)}% lower claim rate`)
    if (coverDiff > 0)   winner.push(`${fmt(coverDiff)} more coverage`)
    else if (coverDiff < 0) loser.push(`${fmt(Math.abs(coverDiff))} less coverage`)
    if (pedDiff > 0)     winner.push(`${yrs(Math.abs(pedDiff))} shorter PED wait`)
    else if (pedDiff < 0) loser.push(`${yrs(Math.abs(pedDiff))} longer PED wait`)

    // unique feature comparison
    const topUnique = top.policy.uniqueFeatures[0]
    const top2Unique = top2.policy.uniqueFeatures[0]

    cards.push({
      id: "vs",
      type: "comparison",
      icon: "⚖️",
      label: `vs ${top2.policy.name}`,
      headline: `Why we picked ${top.policy.name} over ${top2.policy.name}`,
      subline: `${top.score} vs ${top2.score} match score`,
      body: `${top.policy.name} wins on: ${winner.join(", ") || "overall fit for your profile"}. ${loser.length > 0 ? `${top2.policy.name} has: ${loser.join(", ")}.` : ""} The deciding factor for your profile: ${priority === "claims" ? `${top.policy.name} has a ${top.policy.csr}% claim rate vs ${top2.policy.csr}% — that's ${Math.round(top.policy.csr - top2.policy.csr)} more claims paid per 100.` : priority === "price" ? `${fmtMo(topPr.annual)}/month fits your budget better.` : `${top.policy.name}'s unique edge: ${topUnique}.`}`,
      chips: [
        { text: `${top.policy.name}: ${topUnique}`, good: true },
        { text: `${top2.policy.name}: ${top2Unique}`, good: false },
      ],
      vsData: {
        left:  { name: top.policy.name,  score: top.score,  monthly: topPr.monthly,   csr: top.policy.csr,  coverage: top.policy.coverage },
        right: { name: top2.policy.name, score: top2.score, monthly: top2Pr.monthly,  csr: top2.policy.csr, coverage: top2.policy.coverage },
      },
    })
  }

  // ── CARD 6: The blind spot — something they didn't ask about ─
  {
    const blindSpots = []

    if (!profile.needMental && !top.policy.features.mental_health) {
      blindSpots.push({
        headline: "You didn't ask for mental health cover — but you probably need it",
        body: `1 in 5 Indians will experience a mental health condition requiring treatment. You didn't select it as a need, and ${top.policy.name} doesn't include it. The plans that do: HDFC Optima, Niva Bupa, Care Supreme, Aditya Birla, Tata AIG. If this matters to you in the future, switching plans mid-life costs more.`,
        chips: [{ text: "Mental health cover not included", good: false }, { text: "HDFC, Niva Bupa, Care Supreme have it", good: true }],
      })
    }

    if (!ped && top.policy.pedWait >= 48) {
      blindSpots.push({
        headline: `You're healthy now — but ${top.policy.name} has a 4-year PED lock-in`,
        body: `You have no pre-existing conditions today. But if you develop diabetes, hypertension, or thyroid issues in the next 4 years — extremely common after ${age > 35 ? age : 35} — those conditions won't be covered until 4 years from now. ${zeroPED.length > 0 ? `${zeroPED[0].policy.name} has zero PED wait, so any future condition is covered immediately.` : "Consider a plan with shorter PED wait as a safeguard."}`,
        chips: [{ text: `${top.policy.name}: 4-yr PED lock`, good: false }],
      })
    }

    if (members >= 2 && !top.policy.restore.toLowerCase().includes("unlimited")) {
      blindSpots.push({
        headline: `With ${members} people on one policy, restore matters more than you think`,
        body: `Your ${members}-member floater shares one pool of ${fmt(top.policy.coverage)}. If one person has a major illness (bypass: Rs.3.5–5L, cancer: Rs.6L+), the entire family's cover for the year could be gone. ${top.policy.name} has limited restore (${top.policy.restore}). ${unlimRest.length > 0 ? `${unlimRest[0].policy.name} has unlimited restore at ${fmtMo(premiumMap[unlimRest[0].policy.id].annual)}/month.` : ""}`,
        chips: [{ text: `${top.policy.name}: ${top.policy.restore}`, good: false }, ...unlimRest.slice(0,1).map(r => ({ text: `${r.policy.name}: Unlimited restore`, good: true }))],
      })
    }

    if (isMetro && top.policy.features.hospitals < 10000) {
      blindSpots.push({
        headline: `${city} hospitals — your top plan has a smaller network than alternatives`,
        body: `You're in ${city}, a metro with hundreds of premium hospitals. ${top.policy.name} covers ${(top.policy.features.hospitals/1000).toFixed(0)}K hospitals cashlessly. Care Supreme covers 19K and Tata AIG covers 12K — both scored highly for your profile. If your preferred hospital isn't in the network, you pay out of pocket and claim reimbursement later.`,
        chips: [{ text: `${top.policy.name}: ${(top.policy.features.hospitals/1000).toFixed(0)}K hospitals`, good: false }, { text: "Care Supreme: 19K hospitals", good: true }],
      })
    }

    if (blindSpots.length > 0) {
      const bs = blindSpots[0]
      cards.push({
        id: "blindspot",
        type: "blindspot",
        icon: "🔍",
        label: "Blind Spot",
        headline: bs.headline,
        subline: "Something you didn't ask about — but should know",
        body: bs.body,
        chips: bs.chips,
      })
    }
  }

  // ── CARD 7: City + Hospital reality check ───────────────────
  if (isMetro) {
    const best4city = [...ranked].sort((a,b) => b.policy.features.hospitals - a.policy.features.hospitals)[0]
    cards.push({
      id: "city",
      type: "local",
      icon: "📍",
      label: city,
      headline: `${city} reality: hospital network is your safety net`,
      subline: `${(top.policy.features.hospitals/1000).toFixed(0)}K cashless hospitals with ${top.policy.name}`,
      body: `In ${city}, treatment costs run 30–40% above the national average. Your top pick covers ${(top.policy.features.hospitals/1000).toFixed(0)}K hospitals cashlessly — meaning zero upfront payment at those hospitals. ${best4city.policy.id !== top.policy.id ? `${best4city.policy.name} covers the most hospitals in ${city} (${(best4city.policy.features.hospitals/1000).toFixed(0)}K), but scored lower overall for your profile.` : `${top.policy.name} already has one of the widest networks available.`} Before you buy, verify that your nearest private hospital is empanelled.`,
      chips: ranked.slice(0,3).map(r => ({ text: `${r.policy.name}: ${(r.policy.features.hospitals/1000).toFixed(0)}K hospitals`, good: r.policy.features.hospitals >= 12000 })),
    })
  }

  // ── CARD 8: The maternity flag ──────────────────────────────
  if (profile.needMaternity) {
    const matPlan = ranked.find(r => r.policy.features.maternity)
    cards.push({
      id: "maternity",
      type: matPlan ? "good" : "warning",
      icon: "🤰",
      label: "Maternity",
      headline: matPlan
        ? `${matPlan.policy.name} covers maternity — but there's a catch`
        : "None of your top plans include maternity",
      subline: matPlan ? "9-month waiting period" : "Only ICICI Lombard has maternity built-in",
      body: matPlan
        ? `You need maternity cover. ${matPlan.policy.name} (ranked #${ranked.findIndex(r=>r.policy.id===matPlan.policy.id)+1}) includes it, but there's a 9-month waiting period. If you're planning a pregnancy, buy this policy at least 9 months before. The newborn is covered from Day 1, and vaccination costs are included too.`
        : `You selected maternity as a need, but your top pick (${top.policy.name}) doesn't include it. The only plan in our list with maternity built-in is ICICI Lombard Health Companion — ranked #${ranked.findIndex(r=>r.policy.id==="P006")+1} for your profile at ${fmtMo(premiumMap["P006"]?.annual||0)}/month. You may need to weigh maternity cover vs your top pick's other advantages.`,
      chips: matPlan
        ? [{ text: "Maternity covered ✓", good: true }, { text: "9-month waiting period required", good: false }]
        : [{ text: "ICICI Lombard: only plan with maternity", good: true }],
    })
  }

  // ── CARD 9: Smoker-specific ──────────────────────────────────
  if (smoker) {
    const savePerYear = Math.round(topPr.annual * 0.20 / 1.20)
    cards.push({
      id: "smoker",
      type: "warning",
      icon: "🚬",
      label: "Smoker Premium",
      headline: `Smoking is adding ~${fmt(savePerYear)}/year to your premium`,
      subline: `20% smoker loading applied to your quote`,
      body: `Your premium includes a 20% loading because you smoke. That's ${fmt(savePerYear)}/year — or ${fmt(savePerYear*10)} over 10 years. Beyond the premium, ${top.policy.provider} will ask you to declare smoking at proposal. If you don't and they find out during a claim, your policy can be voided. The moment you quit and stay smoke-free for 12 months, you can request a loading review at renewal.`,
      chips: [
        { text: `Smoker loading: +${fmt(savePerYear)}/yr`, good: false },
        { text: "Quit + 12 months = loading review possible at renewal", good: true },
      ],
    })
  }

  // ── CARD 10: 3 things to do before buying ───────────────────
  {
    const settle = cd?.avgSettlementDays || 8
    const ombuds = cd?.ombudsmanComplaints || 150
    cards.push({
      id: "action",
      type: "action",
      icon: "✅",
      label: "Before You Buy",
      headline: `3 things to do before buying ${top.policy.name}`,
      subline: `${top.policy.provider} settles claims in ${settle} days on average`,
      body: `1. Declare everything honestly. With ${top.policy.provider}, non-disclosure is the #1 reason claims are rejected. Even conditions treated years ago. 2. Check that your nearest hospital (or a hospital you'd use) is in their ${(top.policy.features.hospitals/1000).toFixed(0)}K+ cashless network — call the hospital's billing desk to confirm. 3. Set a renewal reminder for 45 days before expiry. Missing the renewal window by even one day can break your ${top.policy.pedWait > 0 ? `PED waiting period credit` : "continuity benefits"}.`,
      chips: [
        { text: "Declare all health conditions at proposal", good: true },
        { text: "Verify your hospital is in the cashless network", good: true },
        { text: "Set renewal reminder 45 days before expiry", good: true },
      ],
    })
  }

  return cards
}
