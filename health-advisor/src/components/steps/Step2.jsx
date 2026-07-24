import Tooltip from "../Tooltip"

const BMI_ZONES = [
  { max: 18.5, label: "Underweight",     color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", text: "#92400e", pill: "bg-amber-100 text-amber-800 border-amber-300"   },
  { max: 25,   label: "Normal ✓",        color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", pill: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { max: 30,   label: "Overweight",      color: "#f97316", bg: "#fff7ed", border: "#fed7aa", text: "#9a3412", pill: "bg-orange-100 text-orange-800 border-orange-300"  },
  { max: 35,   label: "Obese",           color: "#ef4444", bg: "#fef2f2", border: "#fecaca", text: "#991b1b", pill: "bg-red-100 text-red-800 border-red-300"         },
  { max: Infinity, label: "Severely Obese", color: "#b91c1c", bg: "#fef2f2", border: "#fca5a5", text: "#7f1d1d", pill: "bg-red-100 text-red-900 border-red-400"     },
]

const RISK_FACTORS = [
  { key: "smoker",      icon: "🚬", label: "Smoker",               sub: "Cigarettes, bidi, tobacco products",      badge: "+20%" },
  { key: "ped",         icon: "💊", label: "Pre-existing Disease",  sub: "Diabetes, hypertension, thyroid, etc.",   badge: "+30%" },
  { key: "chronic",     icon: "🏥", label: "Chronic Condition",     sub: "Asthma, PCOD, arthritis, kidney issues",  badge: "+15%" },
  { key: "hasChildren", icon: "👶", label: "Have Children",         sub: "Affects family floater pricing",          badge: null   },
]

function getZone(bmi) {
  return BMI_ZONES.find(z => bmi < z.max) || BMI_ZONES[BMI_ZONES.length - 1]
}

export default function Step2({ data, update }) {
  const zone = getZone(data.bmi)
  const pct  = ((data.bmi - 15) / (45 - 15)) * 100   // 0–100%

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* header */}
      <div>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Step 2 of 3</p>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Your Health Profile</h2>
        <p className="text-slate-400 mt-1.5">These factors directly affect your <span className="font-semibold text-slate-600">premium <Tooltip term="Premium" /></span> — we'll show the exact rupee impact.</p>
      </div>

      {/* ── BMI card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* top bar with current value */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5"
          style={{ borderBottom: `1px solid ${zone.border}`, background: zone.bg }}>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Body Mass Index (BMI)</p>
            <p className="text-6xl font-black tabular-nums leading-none" style={{ color: zone.color }}>{data.bmi}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block text-sm font-bold px-4 py-2 rounded-full border ${zone.pill}`}>
              {zone.label}
            </span>
            {data.bmi >= 25 && (
              <p className="text-xs text-slate-500 mt-2 max-w-[160px] text-right leading-relaxed">
                Reaching BMI 18.5–24.9 could reduce your loading by <strong>10–25%</strong>
              </p>
            )}
          </div>
        </div>

        {/* slider area */}
        <div className="px-6 pb-6 pt-5">
          {/* colour track + draggable thumb */}
          <div className="relative h-8 mb-1 select-none">
            {/* colour segments — pointer-events-none */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 flex h-4 rounded-full overflow-hidden shadow-inner">
              <div style={{ width: "12%",  background: "#f59e0b" }} />
              <div style={{ width: "25%",  background: "#10b981" }} />
              <div style={{ width: "20%",  background: "#f97316" }} />
              <div style={{ width: "20%",  background: "#ef4444" }} />
              <div style={{ flex: 1,       background: "#b91c1c" }} />
            </div>
            {/* moving thumb — pointer-events-none */}
            <div
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-3 border-white shadow-lg transition-all duration-75"
              style={{
                left: `calc(${pct}% - 12px)`,
                background: zone.color,
                border: "3px solid white",
                boxShadow: `0 0 0 3px ${zone.color}50, 0 2px 8px rgba(0,0,0,.25)`,
              }}
            />
            {/* the actual input — transparent, full size, on top */}
            <input
              type="range" min={15} max={45} step={0.5}
              value={data.bmi}
              onChange={e => update({ bmi: parseFloat(e.target.value) })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* tick labels */}
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-2 px-0.5">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>45</span>
          </div>

          {/* zone name labels */}
          <div className="flex mt-1 text-[10px] font-bold">
            <span style={{ width: "12%",  color: "#d97706" }}>Under</span>
            <span style={{ width: "25%",  color: "#059669" }}>Normal</span>
            <span style={{ width: "20%",  color: "#ea580c" }}>Over</span>
            <span style={{ width: "20%",  color: "#dc2626" }}>Obese</span>
            <span style={{ flex: 1,       color: "#b91c1c", textAlign: "right" }}>Severe</span>
          </div>
        </div>
      </div>

      {/* ── Risk factor toggles ── */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Factors
          <span className="ml-2 normal-case font-normal text-slate-400">— select all that apply</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          {RISK_FACTORS.map(({ key, icon, label, sub, badge }) => {
            const on = !!data[key]
            return (
              <label key={key}
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer select-none transition-all duration-150 ${
                  on
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}>
                <span className="text-3xl leading-none mt-0.5 flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${on ? "text-blue-900" : "text-slate-800"}`}>{label}</p>
                  <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{sub}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {badge && (
                    <span className={`text-sm font-black ${on ? "text-red-500" : "text-slate-300"}`}>{badge}</span>
                  )}
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    on ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-600/40" : "border-slate-300 bg-white"
                  }`}>
                    {on && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </div>
                </div>
                <input type="checkbox" checked={on} onChange={e => update({ [key]: e.target.checked })} className="sr-only" />
              </label>
            )
          })}
        </div>
      </div>

      {/* tip */}
      <div className="flex items-start gap-4 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-2xl leading-none flex-shrink-0">💡</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          IRDAI allows insurers to apply a <strong>loading fee <Tooltip term="Loading" /></strong> for higher-risk profiles.
          A smoker with a pre-existing disease can pay <strong>2–3× more</strong> than a healthy non-smoker for the exact same plan.
        </p>
      </div>
    </div>
  )
}
