import { useState, useMemo } from "react"

// Average hospitalisation costs by city tier (2024, private hospital)
const CITY_COSTS = {
  "Mumbai":    { tier: "Metro",  mult: 1.40 },
  "New Delhi": { tier: "Metro",  mult: 1.40 },
  "Bangalore": { tier: "Metro",  mult: 1.35 },
  "Chennai":   { tier: "Metro",  mult: 1.30 },
  "Hyderabad": { tier: "Metro",  mult: 1.30 },
  "Kolkata":   { tier: "Metro",  mult: 1.20 },
  "Pune":      { tier: "Tier 2", mult: 1.10 },
  "Ahmedabad": { tier: "Tier 2", mult: 1.05 },
  "Other":     { tier: "Tier 3", mult: 1.00 },
}

// Benchmark costs at Tier-3
const BASE_COSTS = {
  bypass:      350000,
  cancer:      600000,
  delivery:     60000,
  fracture:     70000,
  appendix:     80000,
  angioplasty: 250000,
}

function fmt(n) {
  if (n >= 100000) return `Rs.${(n/100000).toFixed(1)}L`
  return `Rs.${n.toLocaleString()}`
}

function GapBar({ covered, needed }) {
  const pct = Math.min((covered / needed) * 100, 100)
  const color = pct >= 100 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444"
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-500">Employer cover</span>
        <span className="font-bold" style={{ color }}>{Math.round(pct)}% of what you need</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{fmt(covered)}</span>
        <span>Need {fmt(needed)}</span>
      </div>
    </div>
  )
}

function RiskItem({ icon, text, severity }) {
  const colors = {
    high:   "bg-red-50 border-red-200 text-red-800",
    medium: "bg-amber-50 border-amber-200 text-amber-800",
    low:    "bg-emerald-50 border-emerald-200 text-emerald-800",
  }
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-xs leading-relaxed ${colors[severity]}`}>
      <span className="text-base flex-shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

export default function EmployerCoverChecker({ profile, ranked, premiumMap }) {
  const [empCover,    setEmpCover]    = useState(500000)   // Rs.5L default
  const [empPremium,  setEmpPremium]  = useState(0)        // employer pays
  const [hasDependents, setHasDependents] = useState(profile?.members > 1)
  const [hasParents,  setHasParents]  = useState(false)
  const [city,        setCity]        = useState(profile?.city || "Other")

  const cityInfo = CITY_COSTS[city] || CITY_COSTS["Other"]
  const age      = profile?.age || 30
  const members  = profile?.members || 1

  // Recommended minimum for this profile
  const recommended = useMemo(() => {
    let base = 1000000 // Rs.10L base
    if (age >= 45 && age < 60) base = 1500000
    if (age >= 60) base = 2000000
    if (members >= 3 || hasDependents) base = Math.max(base, 1500000)
    if (members >= 5) base = Math.max(base, 2000000)
    base = Math.round(base * cityInfo.mult)
    if (hasParents) base += 500000
    return base
  }, [age, members, hasDependents, hasParents, cityInfo])

  const gap         = Math.max(recommended - empCover, 0)
  const surplus     = Math.max(empCover - recommended, 0)
  const isAdequate  = empCover >= recommended
  const gapPct      = recommended > 0 ? Math.round((empCover / recommended) * 100) : 0

  // Cost of top benchmark procedure in their city
  const bypassCost = Math.round(BASE_COSTS.bypass * cityInfo.mult)
  const cancerCost = Math.round(BASE_COSTS.cancer * cityInfo.mult)

  // Estimated top-up premium from ranked plans
  const topPlan = ranked?.[0]?.policy
  const topPr   = topPlan && premiumMap?.[topPlan.id]

  // Risks of relying on employer cover only
  const risks = [
    {
      icon: "💼",
      text: "If you leave your job, employer cover stops immediately — and you could have a gap before new cover kicks in.",
      severity: "high"
    },
    {
      icon: "⏳",
      text: "Employer group policies reset every year. Any claim history or PED doesn't carry over. No continuity benefits.",
      severity: "high"
    },
    {
      icon: "��",
      text: empCover < bypassCost
        ? `Your ${fmt(empCover)} cover is less than a bypass surgery (${fmt(bypassCost)}) in ${city}. A single critical illness could exceed it.`
        : `Your cover is more than a bypass surgery (${fmt(bypassCost)}) in ${city}. But cancer treatment can cost ${fmt(cancerCost)}.`,
      severity: empCover < bypassCost ? "high" : "medium"
    },
    {
      icon: "👨‍👩‍👧",
      text: hasDependents
        ? "Group policies cover family members at a shared sum insured. If a family member has a major illness, the shared pool depletes fast."
        : "You're currently single. Adding a family later without prior personal insurance can mean starting fresh with new waiting periods.",
      severity: "medium"
    },
    {
      icon: "📈",
      text: "Medical inflation runs at 7.5%/yr. A Rs.5L employer plan today will only cover Rs.2.5L worth of treatment in 10 years.",
      severity: "medium"
    },
    {
      icon: "🔄",
      text: "Personal insurance has portability rights — you can switch insurers. Employer group cover cannot be ported when you leave.",
      severity: "low"
    },
  ]

  const verdict = isAdequate
    ? { label: "Adequate for now", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "✅" }
    : gapPct >= 70
      ? { label: "Partially covered", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: "⚠️" }
      : { label: "Significantly underinsured", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "🚨" }

  const CITIES = Object.keys(CITY_COSTS)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h3 className="text-xl font-black text-slate-900">Is Your Employer Cover Enough?</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Most employer group plans cover Rs.3–5 lakh. Find out if that's actually sufficient — and what gap to fill with personal insurance.
        </p>
      </div>

      {/* Why this matters */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div className="text-sm text-blue-800 leading-relaxed">
          <strong>The problem with only relying on employer health cover:</strong> it stops the day you resign, switch jobs, or get laid off — often exactly when you're most stressed and need it most. Buying a personal plan while healthy is always cheaper than buying one after a diagnosis.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Inputs ── */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Employer Plan Details</p>

            {/* Employer cover */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Employer Sum Insured</label>
                <span className="text-sm font-black text-blue-600">{fmt(empCover)}</span>
              </div>
              <input type="range" min={100000} max={3000000} step={100000} value={empCover}
                onChange={e => setEmpCover(+e.target.value)}
                className="w-full h-2 accent-blue-600 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>Rs.1L</span><span>Rs.10L</span><span>Rs.30L</span>
              </div>
            </div>

            {/* Employer pays premium */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Premium paid by employer</label>
                <span className="text-sm font-black text-blue-600">
                  {empPremium === 0 ? "Fully paid by employer" : `Rs.${empPremium.toLocaleString()}/yr from your salary`}
                </span>
              </div>
              <input type="range" min={0} max={30000} step={500} value={empPremium}
                onChange={e => setEmpPremium(+e.target.value)}
                className="w-full h-2 accent-blue-600 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>Fully free</span><span>Rs.30K/yr</span>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Your City</label>
              <div className="relative">
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="w-full h-10 appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 pr-8 text-sm font-medium text-slate-800
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              <p className="text-xs text-slate-400 mt-1">{cityInfo.tier} — costs {Math.round((cityInfo.mult-1)*100)}% above baseline</p>
            </div>

            {/* Dependents */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block mb-2">Coverage Situation</label>
              {[
                { val: hasDependents,  set: setHasDependents,  label: "👨‍👩‍👧 Spouse / children covered under employer plan" },
                { val: hasParents,     set: setHasParents,     label: "👴 Parents need coverage (not under employer plan)" },
              ].map(({ val, set, label }) => (
                <label key={label}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    val ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <span className="text-sm flex-1 font-medium text-slate-700">{label}</span>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    val ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                  }`}>
                    {val && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>}
                  </div>
                  <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="sr-only" />
                </label>
              ))}
            </div>
          </div>

          {/* Benchmark costs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              What {fmt(empCover)} covers in {city}
            </p>
            <div className="space-y-2.5">
              {Object.entries(BASE_COSTS).map(([key, base]) => {
                const cost    = Math.round(base * cityInfo.mult)
                const covers  = empCover >= cost
                const times   = Math.floor(empCover / cost)
                return (
                  <div key={key} className={`flex items-center justify-between p-2.5 rounded-lg ${
                    covers ? "bg-emerald-50" : "bg-red-50"
                  }`}>
                    <span className="text-xs font-semibold text-slate-700 capitalize">
                      {key === "bypass" ? "Bypass Surgery" :
                       key === "cancer" ? "Cancer (1 yr)" :
                       key === "delivery" ? "Normal Delivery" :
                       key === "fracture" ? "Fracture Surgery" :
                       key === "appendix" ? "Appendectomy" : "Angioplasty"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">{fmt(cost)}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        covers
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-red-200 text-red-800"
                      }`}>
                        {covers ? (times > 1 ? `${times}× covered` : "Covered") : "Not enough"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Analysis ── */}
        <div className="space-y-4">

          {/* Verdict */}
          <div className={`${verdict.bg} border-2 ${verdict.border} rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{verdict.icon}</span>
              <div>
                <p className={`text-lg font-black ${verdict.color}`}>{verdict.label}</p>
                <p className="text-xs text-slate-500">for your profile in {city}</p>
              </div>
            </div>
            <GapBar covered={empCover} needed={recommended} />
            {gap > 0 && (
              <div className="mt-4 bg-white border border-red-200 rounded-xl p-3">
                <p className="text-sm font-bold text-red-700 mb-1">
                  You have a {fmt(gap)} coverage gap
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A personal top-up plan of {fmt(gap)} would fully protect you.
                  The cheapest way is a <strong>super top-up policy</strong> that only activates once your employer cover is exhausted.
                </p>
              </div>
            )}
            {isAdequate && (
              <div className="mt-4 bg-white border border-emerald-200 rounded-xl p-3">
                <p className="text-sm font-bold text-emerald-700 mb-1">Cover looks adequate on paper</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  But read the risks below — employer cover has critical limitations that numbers alone don't show.
                </p>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">What You Should Do</p>
            <div className="space-y-3">
              {[
                {
                  num: "1",
                  title: gap > 0 ? `Buy a personal plan for at least ${fmt(gap)}` : "Keep your employer cover, add personal backup",
                  desc: gap > 0
                    ? `Your employer covers ${fmt(empCover)}. A personal policy of ${fmt(gap)} fills the gap — and unlike employer cover, it stays with you even when you change jobs.`
                    : "Your employer cover is adequate now, but buying personal insurance while healthy locks in lower premiums for life.",
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  num: "2",
                  title: "Consider a super top-up policy",
                  desc: `Super top-up plans activate only after your ${fmt(empCover)} employer limit is crossed. They cost 60–70% less than regular policies for the same additional cover.`,
                  color: "bg-purple-50 border-purple-200",
                },
                ...(hasParents ? [{
                  num: "3",
                  title: "Separate cover for parents",
                  desc: "Parents are typically not covered under employer plans. A senior citizen plan (Star Senior Red Carpet, etc.) covers them with PED from Day 1.",
                  color: "bg-amber-50 border-amber-200",
                }] : []),
              ].map(item => (
                <div key={item.num} className={`flex items-start gap-3 p-3.5 rounded-xl border ${item.color}`}>
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 flex-shrink-0">
                    {item.num}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top recommended plan for gap */}
          {topPlan && topPr && gap > 0 && (
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-3">Best plan to fill your gap</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-lg leading-tight">{topPlan.name}</p>
                  <p className="text-blue-200 text-xs">{topPlan.provider}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    {fmt(topPlan.coverage)} cover · {topPlan.csr}% claims paid · {topPlan.copay === 0 ? "Zero copay" : `${topPlan.copay}% copay`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-black">Rs.{topPr.monthly.toLocaleString()}</p>
                  <p className="text-blue-200 text-xs">/month</p>
                  {empPremium === 0 && (
                    <p className="text-blue-100 text-xs mt-1">Your employer pays nothing extra</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Risks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Risks of relying on employer cover only
            </p>
            <div className="space-y-2">
              {risks.map((r, i) => <RiskItem key={i} {...r} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          Figures are based on average private hospital costs in India (2024) and standard IRDAI recommended coverage norms.
          Your employer policy document may have sub-limits, co-pays, or exclusions not reflected here. Always read your policy terms.
        </p>
      </div>
    </div>
  )
}
