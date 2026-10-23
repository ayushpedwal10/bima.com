import {
  GraduationCap, Briefcase, Heart, Users, UserCheck,
  ShieldCheck, ShieldAlert, Activity, IndianRupee, MapPin, Scale
} from "lucide-react"

export default function LiveProfileCard({ data, step }) {
  const segMeta = data.isStudent ? { label: "Student", icon: GraduationCap }
    : data.age >= 60 ? { label: "Senior Citizen", icon: UserCheck }
    : (data.members >= 3 || data.hasChildren) ? { label: "Family Floater", icon: Users }
    : data.members === 2 ? { label: "Couple Plan", icon: Heart }
    : { label: "Young Professional", icon: Briefcase }

  const SegIcon = segMeta.icon

  const hasHighRisk = data.smoker || data.ped || data.chronic || data.bmi >= 30
  const isPreferred = !data.smoker && !data.ped && !data.chronic && data.bmi >= 18.5 && data.bmi < 25

  const riskTier = isPreferred
    ? { label: "Preferred Low Risk", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
    : hasHighRisk
    ? { label: "Loaded / Underwritten Risk", color: "text-amber-700 bg-amber-50 border-amber-200" }
    : { label: "Standard Actuarial Risk", color: "text-blue-700 bg-blue-50 border-blue-200" }

  const riskFlags = [
    data.smoker && { label: "Smoker (+20%)", color: "bg-rose-50 text-rose-700 border-rose-200" },
    data.ped && { label: "PED (+30%)", color: "bg-amber-50 text-amber-700 border-amber-200" },
    data.chronic && { label: "Chronic (+15%)", color: "bg-orange-50 text-orange-700 border-orange-200" },
  ].filter(Boolean)

  const activeNeeds = [
    data.needMaternity && "Maternity",
    data.needCritical && "Critical Illness",
    data.needIntl && "Global Care",
    data.needMental && "Mental Health",
    data.needOPD && "OPD Care",
  ].filter(Boolean)

  const PRIORITY_LABELS = {
    claims: "Highest Claim Approval (CSR)",
    price: "Lowest Annual Cost",
    coverage: "Comprehensive Coverage",
  }

  return (
    <div className="mt-auto pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Actuarial Risk Passport
        </p>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${riskTier.color}`}>
          {riskTier.label}
        </span>
      </div>

      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2.5 text-xs">
        
        {/* Life stage & Demographic */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-2xs">
            <SegIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 leading-none">Category & Life Stage</p>
            <p className="font-bold text-slate-900 mt-0.5 truncate">{segMeta.label}</p>
          </div>
        </div>

        {/* Core Profile Parameters */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600 shadow-2xs">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 leading-none">Demographics</p>
            <p className="font-semibold text-slate-800 mt-0.5 truncate">
              {data.age} yrs · {data.city} · {data.members} mbr{data.members > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Budget */}
        {data.budget > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-2xs">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">Target Monthly Budget</p>
              <p className="font-bold text-slate-900 mt-0.5">
                ₹{data.budget.toLocaleString()}/month
              </p>
            </div>
          </div>
        )}

        {/* Step 2: BMI & Medical Indicators */}
        {step >= 1 && (
          <div className="pt-1.5 border-t border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">BMI Index:</span>
              <span className="font-bold text-slate-900">
                {data.bmi} ({data.bmi < 18.5 ? "Underweight" : data.bmi < 25 ? "Normal" : data.bmi < 30 ? "Overweight" : "Obese"})
              </span>
            </div>

            {riskFlags.length > 0 ? (
              <div className="flex flex-wrap gap-1 pt-1">
                {riskFlags.map(f => (
                  <span key={f.label} className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${f.color}`}>
                    {f.label}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Zero declared pre-existing diseases</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Coverage Modules & Priority */}
        {step >= 2 && (
          <div className="pt-1.5 border-t border-slate-200/60 space-y-1.5">
            <div className="text-[10px] text-slate-400">
              Evaluation Priority: <strong className="text-blue-700 font-bold">{PRIORITY_LABELS[data.priority]}</strong>
            </div>

            {activeNeeds.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeNeeds.map(n => (
                  <span key={n} className="text-[9px] font-semibold bg-blue-100/70 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                    + {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
