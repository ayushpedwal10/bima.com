import { useState, useMemo } from "react"
import { calcPremium } from "../engine/calculator"
import { POLICIES } from "../data/policies"
import InsurerLogo from "./InsurerLogo"

function BMI_LABEL(bmi) {
  return bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy ✓" : bmi < 30 ? "Overweight" : bmi < 35 ? "Obese" : "Severely Obese"
}
function BMI_COLOR(bmi) {
  return bmi < 18.5 ? "text-yellow-600" : bmi < 25 ? "text-emerald-600" : bmi < 30 ? "text-orange-500" : "text-red-600"
}

const METRO = new Set(["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata"])

function Toggle({ label, sublabel, checked, onChange, savingLabel }) {
  return (
    <label className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
      checked ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
    }`}>
      <div className="min-w-0">
        <div className={`text-sm font-semibold ${checked ? "text-blue-800" : "text-slate-700"}`}>{label}</div>
        {sublabel && <div className="text-xs text-slate-400 mt-0.5">{sublabel}</div>}
        {savingLabel && <div className="text-xs font-bold text-emerald-600 mt-0.5">{savingLabel}</div>}
      </div>
      <div className={`w-10 h-5.5 rounded-full transition-all relative flex-shrink-0 ml-3 ${checked ? "bg-blue-600" : "bg-slate-300"}`}
        style={{ width: 44, height: 24 }}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </div>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
    </label>
  )
}

function PlanRow({ policy, origAnnual, simAnnual, isTop }) {
  const diff     = simAnnual - origAnnual
  const diffPct  = origAnnual > 0 ? Math.round((diff / origAnnual) * 100) : 0
  const improved = diff < 0
  const unchanged= diff === 0

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      isTop ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-white hover:border-slate-200"
    }`}>
      <InsurerLogo provider={policy.provider} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{policy.name}</p>
        <p className="text-[10px] text-slate-400">{policy.provider}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black text-slate-900">₹{Math.round(simAnnual/12).toLocaleString()}<span className="text-slate-400 font-normal text-xs">/mo</span></p>
        {!unchanged && (
          <p className={`text-[10px] font-bold ${improved ? "text-emerald-600" : "text-red-500"}`}>
            {improved ? "▼" : "▲"} ₹{Math.abs(Math.round(diff/12)).toLocaleString()}/mo ({diffPct > 0 ? "+" : ""}{diffPct}%)
          </p>
        )}
        {unchanged && <p className="text-[10px] text-slate-400">no change</p>}
      </div>
    </div>
  )
}

export default function WhatIfSimulator({ profile, ranked, premiumMap }) {
  const topPolicy = ranked[0].policy
  const [view, setView] = useState("top") // "top" | "all"

  const [sim, setSim] = useState({
    age:     profile.age,
    bmi:     profile.bmi,
    smoker:  profile.smoker,
    ped:     profile.ped,
    chronic: profile.chronic,
    city:    profile.city,
    members: profile.members,
  })

  const update = patch => setSim(s => ({ ...s, ...patch }))

  // Compute sim premium for top plan
  const simTop    = useMemo(() => calcPremium(topPolicy, { ...profile, ...sim }), [sim, topPolicy, profile])
  const origTop   = premiumMap[topPolicy.id]
  const topSaving = origTop.annual - simTop.annual

  // Compute for ALL plans
  const allSim = useMemo(() =>
    POLICIES.map(p => ({
      policy:   p,
      origAnnual: calcPremium(p, profile).annual,
      simAnnual:  calcPremium(p, { ...profile, ...sim }).annual,
    })).sort((a, b) => a.simAnnual - b.simAnnual)
  , [sim, profile])

  // per-factor savings on top plan
  const smokerSaving = useMemo(() => {
    const w = calcPremium(topPolicy, { ...profile, ...sim, smoker: false }).annual
    const wo= calcPremium(topPolicy, { ...profile, ...sim, smoker: true  }).annual
    return wo - w
  }, [sim, topPolicy, profile])

  const pedSaving = useMemo(() => {
    const w = calcPremium(topPolicy, { ...profile, ...sim, ped: false }).annual
    const wo= calcPremium(topPolicy, { ...profile, ...sim, ped: true  }).annual
    return wo - w
  }, [sim, topPolicy, profile])

  const bmiSaving = useMemo(() => {
    const healthy = calcPremium(topPolicy, { ...profile, ...sim, bmi: 23 }).annual
    return simTop.annual - healthy
  }, [sim, simTop, topPolicy, profile])

  const citySaving = useMemo(() => {
    if (!METRO.has(sim.city)) return 0
    return simTop.annual - calcPremium(topPolicy, { ...profile, ...sim, city: "Pune" }).annual
  }, [sim, simTop, topPolicy, profile])

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-900">What-If Premium Simulator</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Change any factor and see how premiums shift — across all 10 plans or just your top pick.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Left: Controls ── */}
        <div className="space-y-4">

          {/* Live result for top plan */}
          <div className={`rounded-2xl p-5 border-2 transition-all ${
            topSaving > 0  ? "bg-emerald-50 border-emerald-200" :
            topSaving < 0  ? "bg-red-50 border-red-200"         :
                             "bg-slate-50 border-slate-200"
          }`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {topPolicy.name} — Live Premium
            </p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-slate-400 text-sm line-through">₹{origTop.annual.toLocaleString()}/yr</p>
                <p className={`text-3xl font-black ${
                  topSaving > 0 ? "text-emerald-600" : topSaving < 0 ? "text-red-600" : "text-slate-800"
                }`}>₹{simTop.annual.toLocaleString()}/yr</p>
                <p className="text-xs text-slate-400">₹{simTop.monthly.toLocaleString()}/month</p>
              </div>
              {topSaving !== 0 && (
                <div className={`text-center px-4 py-2.5 rounded-xl ${
                  topSaving > 0 ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                }`}>
                  <p className="text-[10px] font-bold uppercase">{topSaving > 0 ? "You save" : "Extra cost"}</p>
                  <p className="text-xl font-black">₹{Math.abs(topSaving).toLocaleString()}</p>
                  <p className="text-[10px] opacity-80">per year</p>
                </div>
              )}
            </div>
          </div>

          {/* Age slider */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">Age</span>
              <span className="text-sm font-black text-blue-600">{sim.age} yrs</span>
            </div>
            <input type="range" min={18} max={80} step={1} value={sim.age}
              onChange={e => update({ age: +e.target.value })}
              className="w-full h-2 accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>18</span>
              <span className="text-blue-500 font-medium">
                {sim.age < 35 ? "Low risk" : sim.age < 45 ? "Moderate" : sim.age < 55 ? "High" : "Very High"}
              </span>
              <span>80</span>
            </div>
          </div>

          {/* BMI slider */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">BMI</span>
              <span className={`text-sm font-black ${BMI_COLOR(sim.bmi)}`}>{sim.bmi} · {BMI_LABEL(sim.bmi)}</span>
            </div>
            <input type="range" min={15} max={45} step={0.5} value={sim.bmi}
              onChange={e => update({ bmi: +e.target.value })}
              className="w-full h-2 accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>15</span><span>25</span><span>35</span><span>45</span>
            </div>
            {sim.bmi >= 25 && bmiSaving > 0 && (
              <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2 mt-2">
                💡 Reaching BMI 18.5–24.9 saves <strong>₹{bmiSaving.toLocaleString()}/yr</strong>
              </p>
            )}
          </div>

          {/* Members slider */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">Family Members</span>
              <span className="text-sm font-black text-blue-600">
                {sim.members} · {sim.members === 1 ? "Individual" : sim.members === 2 ? "Couple" : sim.members <= 4 ? "Family" : "Large family"}
              </span>
            </div>
            <input type="range" min={1} max={8} step={1} value={sim.members}
              onChange={e => update({ members: +e.target.value })}
              className="w-full h-2 accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5"><span>1</span><span>4</span><span>8</span></div>
          </div>

          {/* Toggles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Risk Factors</p>
            <Toggle label="🚬 Smoker" sublabel="Cigarettes, bidi, tobacco"
              checked={sim.smoker} onChange={v => update({ smoker: v })}
              savingLabel={sim.smoker && smokerSaving > 0 ? `Quitting saves ₹${smokerSaving.toLocaleString()}/yr` : null} />
            <Toggle label="💊 Pre-existing Disease" sublabel="Diabetes, hypertension, thyroid"
              checked={sim.ped} onChange={v => update({ ped: v })}
              savingLabel={sim.ped && pedSaving > 0 ? `Adds ₹${pedSaving.toLocaleString()}/yr` : null} />
            <Toggle label="🏥 Chronic Condition" sublabel="Asthma, PCOD, arthritis"
              checked={sim.chronic} onChange={v => update({ chronic: v })} savingLabel={null} />
            <Toggle label="🏙️ Metro City" sublabel={`Currently: ${sim.city}`}
              checked={METRO.has(sim.city)} onChange={v => update({ city: v ? "Mumbai" : "Pune" })}
              savingLabel={METRO.has(sim.city) && citySaving > 0 ? `Metro adds ₹${citySaving.toLocaleString()}/yr` : null} />
          </div>
        </div>

        {/* ── Right: Plan view ── */}
        <div className="space-y-4">

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {[["top","🏆 Top Plan"],["all","📊 All 10 Plans"]].map(([key,lbl]) => (
              <button key={key} onClick={() => setView(key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  view === key ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}>{lbl}</button>
            ))}
          </div>

          {view === "top" ? (
            /* Top plan deep-dive */
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">What's changing</p>
                <div className="space-y-2">
                  {[
                    { label: "Base rate", orig: origTop.base, sim: simTop.base },
                    { label: "After all loadings", orig: origTop.annual, sim: simTop.annual },
                    { label: "Monthly", orig: origTop.monthly, sim: simTop.monthly },
                    { label: "With 18% GST", orig: origTop.totalWithGST, sim: simTop.totalWithGST },
                  ].map(row => {
                    const diff = row.sim - row.orig
                    return (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-xs text-slate-500">{row.label}</span>
                        <div className="flex items-center gap-2">
                          {diff !== 0 && <span className="text-xs text-slate-400 line-through">₹{row.orig.toLocaleString()}</span>}
                          <span className={`text-sm font-bold ${
                            diff < 0 ? "text-emerald-600" : diff > 0 ? "text-red-600" : "text-slate-800"
                          }`}>₹{row.sim.toLocaleString()}</span>
                          {diff !== 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            diff < 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>{diff > 0 ? "+" : ""}₹{diff.toLocaleString()}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Saving tips based on current profile */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-3">💡 Ways to save on this plan</p>
                <div className="space-y-2">
                  {[
                    sim.smoker  && { tip: "Quit smoking",               save: smokerSaving, icon: "🚬" },
                    sim.bmi>=25 && { tip: "Reach healthy BMI (<25)",    save: bmiSaving,    icon: "⚖️" },
                    METRO.has(sim.city) && { tip: "Move to Tier-2 city", save: citySaving,  icon: "🏙️" },
                    { tip: "Buy now — premium grows ~8%/yr with age",  save: null, icon: "📅" },
                    { tip: "No-claim bonus grows your cover free",     save: null, icon: "🎁" },
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <div>
                        <span className="text-xs text-slate-700">{item.tip}</span>
                        {item.save > 0 && (
                          <span className="ml-1.5 text-xs font-bold text-emerald-600">
                            Save ₹{item.save.toLocaleString()}/yr
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* All 10 plans view */
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500">Sorted by lowest simulated monthly premium</p>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  ▼ cheaper  ▲ costlier vs original
                </span>
              </div>
              {allSim.map(({ policy, origAnnual, simAnnual }) => (
                <PlanRow key={policy.id}
                  policy={policy}
                  origAnnual={origAnnual}
                  simAnnual={simAnnual}
                  isTop={policy.id === topPolicy.id}
                />
              ))}
              <p className="text-xs text-slate-400 text-center pt-1">
                Simulated with your adjusted profile. Excludes GST (18%).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
