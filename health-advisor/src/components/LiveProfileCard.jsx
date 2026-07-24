// LiveProfileCard — shows in the wizard sidebar, builds up as user fills each step
export default function LiveProfileCard({ data, step }) {
  const hasAny = data.age || data.city || data.members

  const SEG = data.isStudent ? { label: "Student", icon: "🎓" }
    : data.age >= 60        ? { label: "Senior", icon: "👴" }
    : data.members >= 3 || data.hasChildren ? { label: "Family", icon: "👨‍👩‍👧" }
    : data.members === 2    ? { label: "Couple", icon: "💑" }
    :                         { label: "Young Professional", icon: "💼" }

  const riskFlags = [
    data.smoker  && { label: "Smoker",  color: "bg-red-100 text-red-700",    icon: "🚬" },
    data.ped     && { label: "PED",     color: "bg-orange-100 text-orange-700", icon: "💊" },
    data.chronic && { label: "Chronic", color: "bg-amber-100 text-amber-700",  icon: "🏥" },
  ].filter(Boolean)

  const needs = [
    data.needMaternity && "🤱 Maternity",
    data.needCritical  && "❤️‍🩹 Critical",
    data.needMental    && "🧠 Mental",
    data.needIntl      && "✈️ Intl",
    data.needOPD       && "🩺 OPD",
  ].filter(Boolean)

  const PRIORITY_MAP = {
    claims:   { label: "Claims first", icon: "🛡️", color: "text-blue-700" },
    price:    { label: "Lowest price", icon: "💰", color: "text-emerald-700" },
    coverage: { label: "Max coverage", icon: "📋", color: "text-purple-700" },
  }
  const priority = PRIORITY_MAP[data.priority]

  return (
    <div className="mt-auto pt-4 border-t border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Profile So Far</p>

      <div className="bg-slate-50 rounded-xl p-3 space-y-2.5">
        {/* Life stage */}
        <div className="flex items-center gap-2">
          <span className="text-base w-6 text-center flex-shrink-0">{SEG.icon}</span>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 leading-none">Life stage</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{SEG.label}</p>
          </div>
        </div>

        {/* Age + city */}
        {(data.age || data.city) && (
          <div className="flex items-center gap-2">
            <span className="text-base w-6 text-center flex-shrink-0">📍</span>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">Profile</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {data.age} yrs · {data.city} · {data.members} member{data.members > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Budget */}
        {data.budget > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-base w-6 text-center flex-shrink-0">💰</span>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">Budget</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">₹{data.budget.toLocaleString()}/mo</p>
            </div>
          </div>
        )}

        {/* BMI (step 2+) */}
        {step >= 1 && (
          <div className="flex items-center gap-2">
            <span className="text-base w-6 text-center flex-shrink-0">⚖️</span>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">BMI</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {data.bmi} · {data.bmi < 18.5 ? "Underweight" : data.bmi < 25 ? "Normal ✓" : data.bmi < 30 ? "Overweight" : "Obese"}
              </p>
            </div>
          </div>
        )}

        {/* Risk flags */}
        {riskFlags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {riskFlags.map(f => (
              <span key={f.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.color}`}>
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        )}

        {/* Coverage needs (step 3) */}
        {needs.length > 0 && (
          <div className="pt-0.5">
            <p className="text-[10px] text-slate-400 mb-1">Needs</p>
            <div className="flex flex-wrap gap-1">
              {needs.map(n => (
                <span key={n} className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Priority (step 3) */}
        {step >= 2 && (
          <div className="flex items-center gap-2">
            <span className="text-base w-6 text-center flex-shrink-0">{priority.icon}</span>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">Priority</p>
              <p className={`text-xs font-bold mt-0.5 ${priority.color}`}>{priority.label}</p>
            </div>
          </div>
        )}

        {/* Completion hint */}
        {step < 2 && (
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
            {step === 0 ? "Complete step 2 & 3 to see full profile" : "Complete step 3 to see full profile"}
          </p>
        )}
      </div>
    </div>
  )
}
