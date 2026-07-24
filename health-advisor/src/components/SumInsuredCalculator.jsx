import { useState, useMemo } from "react"
import Tooltip from "./Tooltip"

// Medical inflation rate in India: ~7.5% per year (NHA data)
const MEDICAL_INFLATION = 0.075

// Average hospital costs by city tier (₹ per major hospitalisation, 2024)
const CITY_TIER = {
  "Mumbai":    { tier: 1, label: "Metro",  costMult: 1.40 },
  "New Delhi": { tier: 1, label: "Metro",  costMult: 1.40 },
  "Bangalore": { tier: 1, label: "Metro",  costMult: 1.35 },
  "Chennai":   { tier: 1, label: "Metro",  costMult: 1.30 },
  "Hyderabad": { tier: 1, label: "Metro",  costMult: 1.30 },
  "Kolkata":   { tier: 1, label: "Metro",  costMult: 1.20 },
  "Pune":      { tier: 2, label: "Tier 2", costMult: 1.10 },
  "Ahmedabad": { tier: 2, label: "Tier 2", costMult: 1.05 },
  "Other":     { tier: 3, label: "Tier 3", costMult: 1.00 },
}

// Base costs (₹) for benchmark procedures in a Tier-3 city private hospital
const PROCEDURE_COSTS = {
  bypass:      { label: "Bypass Surgery",       base: 350000, icon: "❤️" },
  cancer:      { label: "Cancer Treatment",      base: 600000, icon: "🎗️" },
  knee:        { label: "Knee Replacement",      base: 180000, icon: "🦴" },
  angioplasty: { label: "Angioplasty",           base: 250000, icon: "🩺" },
  delivery:    { label: "Normal Delivery",       base:  60000, icon: "🤰" },
  appendix:    { label: "Appendectomy",          base:  80000, icon: "🏥" },
  dialysis:    { label: "Kidney Dialysis (yr)", base: 400000, icon: "💊" },
  fracture:    { label: "Fracture Surgery",      base:  70000, icon: "🦴" },
}

// Recommended SI by profile (₹ lakhs)
function getRecommendedSI(age, members, city, hasPED, hasChronic) {
  const cityInfo = CITY_TIER[city] || CITY_TIER["Other"]
  let base = 10 // ₹10L base

  // Age adjustments
  if (age >= 45 && age < 60) base = 15
  if (age >= 60)              base = 20

  // Family size
  if (members === 2) base = Math.max(base, 15)
  if (members >= 3)  base = Math.max(base, 20)
  if (members >= 5)  base = Math.max(base, 25)

  // City multiplier
  base = Math.ceil(base * cityInfo.costMult / 5) * 5

  // Health conditions
  if (hasPED)     base += 5
  if (hasChronic) base += 5

  return Math.min(base, 50) // cap at ₹50L for this tool
}

function inflationAdjust(amount, years, rate) {
  return Math.round(amount * Math.pow(1 + rate, years))
}

function fmt(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n.toLocaleString()}`
}

function GaugeBar({ value, max, color, label, sublabel }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{fmt(value)}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      {sublabel && <p className="text-[10px] text-slate-400 mt-1">{sublabel}</p>}
    </div>
  )
}

function ProcedureCard({ name, baseCost, cityMult, years, selected, onClick }) {
  const todayCost = Math.round(baseCost * cityMult)
  const futureCost = inflationAdjust(todayCost, years, MEDICAL_INFLATION)
  const proc = PROCEDURE_COSTS[name]
  return (
    <button onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
        selected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
      }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{proc.icon}</span>
        <span className={`text-xs font-bold ${selected ? "text-blue-900" : "text-slate-800"}`}>{proc.label}</span>
      </div>
      <div className="text-sm font-black text-slate-900">{fmt(todayCost)}</div>
      <div className="text-[10px] text-slate-400">today · {fmt(futureCost)} in {years}yr</div>
    </button>
  )
}

export default function SumInsuredCalculator({ profile }) {
  const [members,    setMembers]    = useState(profile?.members || 1)
  const [age,        setAge]        = useState(profile?.age || 30)
  const [city,       setCity]       = useState(profile?.city || "Other")
  const [hasPED,     setHasPED]     = useState(profile?.ped || false)
  const [hasChronic, setHasChronic] = useState(profile?.chronic || false)
  const [yearsAhead, setYearsAhead] = useState(10)
  const [current,    setCurrent]    = useState(500000) // ₹5L — typical market median
  const [selProc,    setSelProc]    = useState("bypass")

  const cityInfo = CITY_TIER[city] || CITY_TIER["Other"]

  const recommended = useMemo(
    () => getRecommendedSI(age, members, city, hasPED, hasChronic) * 100000,
    [age, members, city, hasPED, hasChronic]
  )

  const gap = Math.max(recommended - current, 0)
  const surplus = Math.max(current - recommended, 0)

  const verdict = gap > 0
    ? { label: "Cover Gap",       icon: "⚠️", bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700" }
    : { label: "Well Covered",    icon: "✅", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" }

  // Inflation projection
  const recFuture = inflationAdjust(recommended, yearsAhead, MEDICAL_INFLATION)
  const curFuture = inflationAdjust(current,     yearsAhead, MEDICAL_INFLATION)

  // Selected procedure costs
  const proc = PROCEDURE_COSTS[selProc]
  const procToday  = Math.round(proc.base * cityInfo.costMult)
  const procFuture = inflationAdjust(procToday, yearsAhead, MEDICAL_INFLATION)

  const CITIES = Object.keys(CITY_TIER)

  // How many procedure instances can current cover handle?
  const canCoverProc = Math.floor(current / procToday)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-black text-slate-900">Sum Insured Adequacy Calculator</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Find out if your coverage amount is actually enough — based on your city, age, family, and real hospital costs.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Inputs ── */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Profile</p>

            {/* Age */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Your Age</label>
                <span className="text-sm font-black text-blue-600">{age} yrs</span>
              </div>
              <input type="range" min={18} max={75} step={1} value={age}
                onChange={e => setAge(+e.target.value)}
                className="w-full h-2 accent-blue-600 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>18</span><span>75</span></div>
            </div>

            {/* Family members */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Family Members to Cover <Tooltip term="Floater" />
                </label>
                <span className="text-sm font-black text-blue-600">{members}</span>
              </div>
              <input type="range" min={1} max={8} step={1} value={members}
                onChange={e => setMembers(+e.target.value)}
                className="w-full h-2 accent-blue-600 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 (self)</span><span>8</span></div>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">City</label>
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
              <p className="text-xs text-slate-400 mt-1">
                {cityInfo.label} — hospital costs {cityInfo.costMult > 1 ? `${Math.round((cityInfo.costMult - 1) * 100)}% higher than Tier-3` : "at baseline"}
              </p>
            </div>

            {/* Health conditions */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Health Conditions</label>
              <div className="space-y-2">
                {[
                  { key: "ped",     val: hasPED,     set: setHasPED,     icon: "💊", label: "Pre-existing disease (diabetes, BP, etc.)" },
                  { key: "chronic", val: hasChronic,  set: setHasChronic, icon: "🏥", label: "Chronic condition (asthma, thyroid, etc.)" },
                ].map(({ key, val, set, icon, label }) => (
                  <label key={key}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      val ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}>
                    <span className="text-lg">{icon}</span>
                    <span className={`text-sm font-medium flex-1 ${val ? "text-blue-800" : "text-slate-700"}`}>{label}</span>
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

            {/* Current cover */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Your Current / Planned Cover <Tooltip term="Sum Insured" />
                </label>
                <span className="text-sm font-black text-blue-600">{fmt(current)}</span>
              </div>
              <input type="range" min={200000} max={5000000} step={100000} value={current}
                onChange={e => setCurrent(+e.target.value)}
                className="w-full h-2 accent-blue-600 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹2L</span><span>₹50L</span></div>
            </div>
          </div>

          {/* Inflation horizon */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-slate-700">Planning Horizon</p>
              <span className="text-sm font-black text-blue-600">{yearsAhead} years</span>
            </div>
            <input type="range" min={1} max={20} step={1} value={yearsAhead}
              onChange={e => setYearsAhead(+e.target.value)}
              className="w-full h-2 accent-blue-600 cursor-pointer" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 yr</span><span>20 yrs</span></div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
              📈 At India's medical inflation rate of <strong>7.5%/yr</strong>, costs double roughly every <strong>10 years</strong>.
              Your ₹5L cover today will only cover ₹2.5L worth of treatment in 10 years.
            </p>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="space-y-4">

          {/* Verdict card */}
          <div className={`${verdict.bg} border-2 ${verdict.border} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{verdict.icon}</span>
                <div>
                  <p className={`font-black text-lg ${verdict.text}`}>{verdict.label}</p>
                  <p className="text-xs text-slate-500">based on your profile in {city}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Recommended minimum</p>
                <p className="text-2xl font-black text-slate-900">{fmt(recommended)}</p>
              </div>
            </div>

            {/* Visual comparison bars */}
            <div className="space-y-3">
              <GaugeBar
                value={current} max={Math.max(recommended * 1.2, current)}
                color="#2563eb" label="Your current cover"
                sublabel={gap > 0 ? `${fmt(gap)} below recommended` : `${fmt(surplus)} above recommended`}
              />
              <GaugeBar
                value={recommended} max={Math.max(recommended * 1.2, current)}
                color={gap > 0 ? "#ef4444" : "#10b981"} label="Recommended minimum"
              />
            </div>

            {gap > 0 ? (
              <div className="mt-4 bg-white border border-red-200 rounded-xl p-3">
                <p className="text-sm font-bold text-red-700 mb-1">⚠ You are underinsured by {fmt(gap)}</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A single major hospitalisation (bypass surgery, cancer, joint replacement) in {city} can cost
                  <strong> {fmt(Math.round(PROCEDURE_COSTS.bypass.base * cityInfo.costMult))}–{fmt(Math.round(PROCEDURE_COSTS.cancer.base * cityInfo.costMult))}</strong>.
                  Your current cover may not be enough.
                </p>
              </div>
            ) : (
              <div className="mt-4 bg-white border border-emerald-200 rounded-xl p-3">
                <p className="text-sm font-bold text-emerald-700 mb-1">✅ Your cover looks adequate</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have {fmt(surplus)} surplus coverage above the recommended minimum for your profile.
                  Consider reviewing every 3–5 years as costs rise with medical inflation.
                </p>
              </div>
            )}
          </div>

          {/* Inflation projection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Medical Inflation Projection — {yearsAhead} Years from Now
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">Your cover buys today</p>
                <p className="text-xl font-black text-blue-600">{fmt(current)}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">Real value in {yearsAhead} yrs</p>
                <p className="text-xl font-black text-amber-600">{fmt(Math.round(current / Math.pow(1 + MEDICAL_INFLATION, yearsAhead)))}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">Recommended today</p>
                <p className="text-xl font-black text-slate-800">{fmt(recommended)}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">Needed in {yearsAhead} yrs</p>
                <p className="text-xl font-black text-red-600">{fmt(recFuture)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              💡 To keep pace with medical inflation, your cover should grow by <strong>7.5% per year</strong>.
              Choose a plan with high <strong>NCB</strong> (No Claim Bonus) or <strong>Restore</strong> benefit to get more cover without paying extra premium.
            </p>
          </div>

          {/* Procedure cost reality check */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Reality Check — What Does {fmt(current)} Actually Cover in {city}?
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Object.keys(PROCEDURE_COSTS).map(key => (
                <ProcedureCard key={key} name={key}
                  baseCost={PROCEDURE_COSTS[key].base}
                  cityMult={cityInfo.costMult}
                  years={yearsAhead}
                  selected={selProc === key}
                  onClick={() => setSelProc(key)}
                />
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{proc.icon} {proc.label} in {city}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Private hospital, {cityInfo.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900">{fmt(procToday)}</p>
                  <p className="text-xs text-slate-400">today</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">You can cover</p>
                  <p className="text-lg font-black text-blue-700">{canCoverProc}x</p>
                  <p className="text-[10px] text-slate-400">incidents</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Cost in {yearsAhead} yrs</p>
                  <p className="text-lg font-black text-amber-600">{fmt(procFuture)}</p>
                  <p className="text-[10px] text-slate-400">at 7.5% inflation</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Cover adequacy</p>
                  <p className={`text-lg font-black ${current >= procToday ? "text-emerald-600" : "text-red-600"}`}>
                    {current >= procToday ? "✓ Covers it" : "✗ Insufficient"}
                  </p>
                  <p className="text-[10px] text-slate-400">for this procedure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why it matters */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">How We Calculate Your Recommendation</p>
            <div className="space-y-2 text-xs text-slate-600">
              {[
                { icon: "🎂", factor: "Age", detail: age < 45 ? "₹10L base (under 45)" : age < 60 ? "₹15L base (45–60)" : "₹20L base (60+)" },
                { icon: "👨‍👩‍👧", factor: "Family size", detail: members === 1 ? "Individual — no adjustment" : `${members} members — floater needs larger cover` },
                { icon: "🏙️", factor: "City", detail: `${cityInfo.label} — costs ${Math.round((cityInfo.costMult - 1) * 100)}% above baseline` },
                { icon: "💊", factor: "Health", detail: (hasPED || hasChronic) ? `+${hasPED && hasChronic ? "₹10L" : "₹5L"} for pre-existing/chronic conditions` : "No health loading" },
              ].map(f => (
                <div key={f.factor} className="flex items-start gap-2 py-1.5 border-b border-slate-200 last:border-0">
                  <span className="text-base flex-shrink-0">{f.icon}</span>
                  <span className="font-semibold text-slate-700 w-24 flex-shrink-0">{f.factor}</span>
                  <span>{f.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          Recommendations are based on average private hospital costs in India (2024) and a 7.5% annual medical inflation rate.
          Actual costs vary by hospital, treatment complexity, and individual health factors. This is a guide, not a medical or financial advisory.
        </p>
      </div>
    </div>
  )
}
