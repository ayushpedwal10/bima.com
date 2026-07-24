import { useState, useMemo } from "react"
import { POLICIES } from "../data/policies"
import { calcRealPremium } from "../data/premiumRates"
import InsurerLogo from "./InsurerLogo"

const ALL_PLANS = POLICIES.map(p => ({ id: p.id, label: `${p.name} — ${p.provider}`, provider: p.provider, name: p.name }))

function fmt(n) { return `₹${n.toLocaleString("en-IN")}` }

function DiffBadge({ val, suffix = "", invert = false }) {
  const better = invert ? val < 0 : val > 0
  const neutral = val === 0
  if (neutral) return <span className="text-xs font-bold text-slate-400">Same</span>
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      better ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
    }`}>
      {val > 0 ? "+" : ""}{val}{suffix}
    </span>
  )
}

function FeatureRow({ label, current, recommended }) {
  const gained = !current && recommended
  const lost   = current && !recommended
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${
      gained ? "bg-emerald-50" : lost ? "bg-red-50" : ""
    }`}>
      <span className="text-xs text-slate-700 font-medium">{label}</span>
      <div className="flex items-center gap-6">
        <span className={`text-xs font-bold w-12 text-center ${current ? "text-emerald-600" : "text-slate-300"}`}>
          {current ? "✓" : "✗"}
        </span>
        <span className={`text-xs font-bold w-12 text-center ${recommended ? "text-emerald-600" : "text-slate-300"}`}>
          {recommended ? "✓" : "✗"}
        </span>
        {gained && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Gained ✓</span>}
        {lost   && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Lost ✗</span>}
        {!gained && !lost && <span className="w-16" />}
      </div>
    </div>
  )
}

export default function UpgradeChecker({ ranked, profile, premiumMap }) {
  const [currentPlanId, setCurrentPlanId] = useState("")
  const [currentPremium, setCurrentPremium] = useState("")

  const currentPolicy = POLICIES.find(p => p.id === currentPlanId)
  const recommendedPolicy = ranked[0]?.policy
  const recommendedPr = premiumMap[recommendedPolicy?.id]

  const analysis = useMemo(() => {
    if (!currentPolicy || !recommendedPolicy || !currentPremium) return null

    const currPr = calcRealPremium(currentPolicy, profile)
    const recPr  = recommendedPr

    const enteredAnnual = +currentPremium * 12
    const recAnnual     = recPr.annual

    const premiumDiff   = recAnnual - enteredAnnual
    const premiumDiffMo = Math.round(premiumDiff / 12)

    const cf = currentPolicy.features
    const rf = recommendedPolicy.features

    const coverageDiff = recommendedPolicy.coverage - currentPolicy.coverage
    const csrDiff      = +(recommendedPolicy.csr - currentPolicy.csr).toFixed(2)
    const hospitalDiff = rf.hospitals - cf.hospitals
    const pedWaitDiff  = recommendedPolicy.pedWait - currentPolicy.pedWait

    const gained = []
    const lost   = []
    const featureKeys = [
      ["hospitalization", "Hospitalisation"],
      ["outpatient",      "OPD / Outpatient"],
      ["maternity",       "Maternity"],
      ["mental_health",   "Mental Health"],
      ["critical",        "Critical Illness"],
      ["robotic",         "Robotic Surgery"],
      ["international",   "International Cover"],
      ["ayush",           "AYUSH"],
      ["homecare",        "Home Care"],
    ]
    featureKeys.forEach(([key, label]) => {
      if (!cf[key] && rf[key]) gained.push(label)
      if (cf[key] && !rf[key]) lost.push(label)
    })

    // Verdict
    const positives = []
    const negatives = []

    if (csrDiff > 1)  positives.push(`${csrDiff}% better claim payment rate — more reliable insurer`)
    if (csrDiff < -1) negatives.push(`${Math.abs(csrDiff)}% lower claim payment rate`)
    if (coverageDiff > 0) positives.push(`₹${(coverageDiff/100000).toFixed(0)}L more coverage`)
    if (coverageDiff < 0) negatives.push(`₹${Math.abs(coverageDiff/100000).toFixed(0)}L less coverage`)
    if (hospitalDiff > 0) positives.push(`${(hospitalDiff/1000).toFixed(0)}K more cashless hospitals`)
    if (hospitalDiff < 0) negatives.push(`${Math.abs(hospitalDiff/1000).toFixed(0)}K fewer cashless hospitals`)
    if (gained.length > 0) positives.push(`Gains: ${gained.join(", ")}`)
    if (lost.length > 0)   negatives.push(`Loses: ${lost.join(", ")}`)
    if (premiumDiff < 0)   positives.push(`Saves ${fmt(Math.abs(premiumDiff))}/year`)
    if (premiumDiff > 0)   negatives.push(`Costs ${fmt(premiumDiff)}/year more`)

    const verdict = positives.length > negatives.length ? "upgrade" :
                    positives.length < negatives.length ? "stay"    : "neutral"

    return {
      currPr, recPr, enteredAnnual, recAnnual,
      premiumDiff, premiumDiffMo,
      coverageDiff, csrDiff, hospitalDiff, pedWaitDiff,
      gained, lost, featureKeys,
      positives, negatives, verdict,
      cf, rf,
    }
  }, [currentPolicy, recommendedPolicy, currentPremium, profile, recommendedPr])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Should You Upgrade Your Current Policy?</h3>
        <p className="text-sm text-slate-500 mt-1">
          Enter your existing plan and what you pay. We'll tell you if you're overpaying, under-covered, or already on a good plan.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
        <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Your Current Policy</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Select Your Current Plan</label>
            <select value={currentPlanId} onChange={e => setCurrentPlanId(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">— Select a plan —</option>
              {ALL_PLANS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Your Current Monthly Premium (₹)</label>
            <input type="number" min={0} step={100} value={currentPremium}
              onChange={e => setCurrentPremium(e.target.value)}
              placeholder="e.g. 1200"
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* No selection state */}
      {!currentPlanId && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm font-medium">Select your current plan above to see the comparison</div>
        </div>
      )}

      {/* Analysis */}
      {analysis && currentPolicy && recommendedPolicy && (
        <>
          {/* Verdict banner */}
          <div className={`rounded-2xl p-6 ${
            analysis.verdict === "upgrade"
              ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
              : analysis.verdict === "stay"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-800 text-white"
                : "bg-gradient-to-r from-slate-600 to-slate-800 text-white"
          }`}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-75 mb-2">bima.com Verdict</div>
            <div className="text-3xl font-black mb-2">
              {analysis.verdict === "upgrade" ? "🔼 Consider Upgrading" :
               analysis.verdict === "stay"    ? "✅ You're on a Good Plan" :
                                                "⚖️ It's a Trade-off"}
            </div>
            <div className="text-sm opacity-90 leading-relaxed">
              {analysis.verdict === "upgrade"
                ? `${recommendedPolicy.name} by ${recommendedPolicy.provider} offers better value for your profile.`
                : analysis.verdict === "stay"
                  ? `Your current ${currentPolicy.name} is competitive. Switching may not be worth it.`
                  : `Both plans have pros and cons. Review the details below before deciding.`}
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <InsurerLogo provider={currentPolicy.provider} size="md" />
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Current Plan</div>
                  <div className="font-black text-slate-900">{currentPolicy.name}</div>
                  <div className="text-xs text-slate-400">{currentPolicy.provider}</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ["Monthly Premium", fmt(+currentPremium)],
                  ["Annual Premium",  fmt(+currentPremium * 12)],
                  ["Coverage",        `₹${(currentPolicy.coverage/100000).toFixed(0)}L`],
                  ["Claims Paid %",   `${currentPolicy.csr}%`],
                  ["Hospitals",       `${(currentPolicy.features.hospitals/1000).toFixed(0)}K+`],
                  ["Copay",           currentPolicy.copay === 0 ? "Zero" : `${currentPolicy.copay}%`],
                  ["PED Wait",        currentPolicy.pedWait === 0 ? "Day 1" : `${currentPolicy.pedWait} months`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1 border-b border-slate-50">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-bold text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <InsurerLogo provider={recommendedPolicy.provider} size="md" />
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">bima.com Recommends</div>
                  <div className="font-black text-slate-900">{recommendedPolicy.name}</div>
                  <div className="text-xs text-slate-400">{recommendedPolicy.provider}</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ["Monthly Premium", fmt(analysis.recPr.monthly), analysis.premiumDiffMo, true],
                  ["Annual Premium",  fmt(analysis.recAnnual), analysis.premiumDiff, true],
                  ["Coverage",        `₹${(recommendedPolicy.coverage/100000).toFixed(0)}L`, Math.round(analysis.coverageDiff/100000), false, "L"],
                  ["Claims Paid %",   `${recommendedPolicy.csr}%`, +analysis.csrDiff.toFixed(1), false, "%"],
                  ["Hospitals",       `${(recommendedPolicy.features.hospitals/1000).toFixed(0)}K+`, Math.round(analysis.hospitalDiff/1000), false, "K"],
                  ["Copay",           recommendedPolicy.copay === 0 ? "Zero" : `${recommendedPolicy.copay}%`],
                  ["PED Wait",        recommendedPolicy.pedWait === 0 ? "Day 1" : `${recommendedPolicy.pedWait} months`],
                ].map(([k, v, diff, invert, suffix]) => (
                  <div key={k} className="flex justify-between items-center text-sm py-1 border-b border-blue-100">
                    <span className="text-slate-500">{k}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{v}</span>
                      {diff !== undefined && diff !== 0 && (
                        <DiffBadge val={diff} suffix={suffix ?? ""} invert={invert} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature diff */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Coverage Features Comparison</div>
            <div className="flex items-center justify-end gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
              <span className="w-12 text-center">Current</span>
              <span className="w-12 text-center text-blue-600">New</span>
              <span className="w-16" />
            </div>
            <div className="space-y-1">
              {analysis.featureKeys.map(([key, label]) => (
                <FeatureRow key={key} label={label}
                  current={!!analysis.cf[key]} recommended={!!analysis.rf[key]} />
              ))}
            </div>
          </div>

          {/* Pros & cons of switching */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3">
                ✓ Reasons to Switch
              </div>
              {analysis.positives.length > 0
                ? <ul className="space-y-2">
                    {analysis.positives.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                        <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">→</span>{p}
                      </li>
                    ))}
                  </ul>
                : <p className="text-xs text-emerald-600">No significant advantages found</p>
              }
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">
                ✗ Reasons to Stay
              </div>
              {analysis.negatives.length > 0
                ? <ul className="space-y-2">
                    {analysis.negatives.map((n, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-800">
                        <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">⚠</span>{n}
                      </li>
                    ))}
                  </ul>
                : <p className="text-xs text-red-600">No significant disadvantages found</p>
              }
            </div>
          </div>

          {/* Important note about portability */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div className="text-xs text-amber-800 leading-relaxed">
              <strong>Policy Portability:</strong> IRDAI allows you to port your health insurance to a new insurer without losing your waiting period credit. If you've completed 2 years with your current insurer, those 2 years count towards the waiting period of the new plan. Always port at renewal time — not mid-term.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
