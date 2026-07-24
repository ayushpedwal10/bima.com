import Tooltip from "../Tooltip"

const NEEDS = [
  { key: "needMaternity", icon: "🤱", label: "Maternity",         desc: "Pregnancy & newborn cover",         color: "#db2777" },
  { key: "needCritical",  icon: "❤️‍🩹",label: "Critical Illness",  desc: "Lump-sum payout for cancer, heart attack, stroke",      color: "#dc2626" },
  { key: "needIntl",      icon: "✈️", label: "International",      desc: "Emergency treatment abroad",        color: "#0284c7" },
  { key: "needMental",    icon: "🧠", label: "Mental Health",      desc: "Therapy & psychiatry inpatient care",              color: "#7c3aed" },
  { key: "ped",           icon: "💊", label: "PED Coverage",       desc: "Pre-existing diseases covered from Day 1",  color: "#d97706" },
  { key: "needOPD",       icon: "🩺", label: "OPD / Outpatient",   desc: "Doctor visits & medicines without hospitalisation",         color: "#059669" },
]

const PRIORITIES = [
  {
    key: "claims",
    icon: "🛡️",
    label: "Highest Claim Approval",
    desc: "Insurer pays when you need it most. Prioritises IRDAI-verified CSR (Claim Settlement Ratio) score.",
    borderColor: "#3b82f6", bgColor: "#eff6ff", textColor: "#1d4ed8", dotBg: "#2563eb",
  },
  {
    key: "price",
    icon: "💰",
    label: "Lowest Premium",
    desc: "The most affordable monthly/yearly cost that still covers your core needs.",
    borderColor: "#10b981", bgColor: "#f0fdf4", textColor: "#065f46", dotBg: "#059669",
  },
  {
    key: "coverage",
    icon: "📋",
    label: "Maximum Coverage",
    desc: "OPD, maternity, mental health, the widest hospital network — the most comprehensive plan.",
    borderColor: "#8b5cf6", bgColor: "#f5f3ff", textColor: "#5b21b6", dotBg: "#7c3aed",
  },
]

export default function Step3({ data, update, mode }) {
  const selectedCount = NEEDS.filter(n => data[n.key]).length

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* header */}
      <div>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Step 3 of 3</p>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">What do you need covered?</h2>
        <p className="text-slate-400 mt-1.5">Select your coverage needs, then tell us what matters most.</p>
      </div>

      {/* ── Coverage needs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coverage Needs</p>
          {selectedCount > 0 && (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NEEDS.map(n => {
            const on = !!data[n.key]
            return (
              <div
                key={n.key}
                onClick={() => update({ [n.key]: !on })}
                role="checkbox"
                aria-checked={on}
                tabIndex={0}
                onKeyDown={e => (e.key === " " || e.key === "Enter") && update({ [n.key]: !on })}
                style={on ? { borderColor: n.color, background: `${n.color}10` } : {}}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer select-none transition-all duration-150 ${
                  on ? "shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-2xl leading-none flex-shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    {n.label}
                    {n.key === "ped"         && <Tooltip term="PED" />}
                    {n.key === "needOPD"     && <Tooltip term="OPD" />}
                    {n.key === "needCritical"&& <Tooltip term="Critical Illness" />}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                </div>
                <div className="flex-shrink-0 mt-0.5"
                  style={on
                    ? { width: 20, height: 20, borderRadius: 6, background: n.color, display:"flex", alignItems:"center", justifyContent:"center" }
                    : { width: 20, height: 20, borderRadius: 6, border: "2px solid #cbd5e1", background: "white" }
                  }>
                  {on && (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Priority ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">What Matters Most?</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {PRIORITIES.map(p => {
            const sel = data.priority === p.key
            return (
              <button key={p.key} type="button" onClick={() => update({ priority: p.key })}
                style={sel ? { borderColor: p.borderColor, background: p.bgColor } : {}}
                className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-150 ${
                  sel ? "shadow-md" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}>
                {/* radio */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl leading-none">{p.icon}</span>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={sel
                      ? { background: p.dotBg, borderColor: p.dotBg }
                      : { background: "white", borderColor: "#cbd5e1" }
                    }>
                    {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm leading-snug" style={sel ? { color: p.textColor } : { color: "#1e293b" }}>
                    {p.label}
                    {p.key === "claims" && <Tooltip term="CSR" />}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{p.desc}</p>
                </div>
              </button>            )
          })}
        </div>
      </div>

      {/* profile summary */}
      <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Profile Summary</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          <span>👤 <strong className="text-slate-900">{data.age} yrs</strong></span>
          <span>📍 <strong className="text-slate-900">{data.city}</strong></span>
          <span>👥 <strong className="text-slate-900">{data.members}</strong> member{data.members > 1 ? "s" : ""}</span>
          <span>💰 ₹<strong className="text-slate-900">{data.budget.toLocaleString()}</strong>/mo</span>
          {data.smoker  && <span className="font-semibold text-red-600">🚬 Smoker</span>}
          {data.ped     && <span className="font-semibold text-orange-600">💊 PED</span>}
          {data.chronic && <span className="font-semibold text-orange-500">🏥 Chronic</span>}
        </div>
      </div>

      {mode === "agent" && data.agentNotes && (
        <div className="px-5 py-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-800">
          <strong>Agent Notes:</strong> {data.agentNotes}
        </div>
      )}
    </div>
  )
}
