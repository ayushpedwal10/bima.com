import Tooltip from "../Tooltip"
import {
  Baby, HeartPulse, Globe, Brain, Pill, Stethoscope,
  ShieldCheck, PiggyBank, Layers, Check, User, MapPin, Users, IndianRupee
} from "lucide-react"

const NEEDS = [
  {
    key: "needMaternity",
    icon: Baby,
    color: "text-rose-600 bg-rose-50 border-rose-200",
    label: "Maternity & Newborn Cover",
    desc: "Inpatient delivery (normal & C-section), newborn incubator care, stem cell storage.",
  },
  {
    key: "needCritical",
    icon: HeartPulse,
    color: "text-red-600 bg-red-50 border-red-200",
    label: "Critical Illness Lump-Sum",
    desc: "Fixed cash payout upon diagnosis of cancer, stroke, myocardial infarction, or kidney failure.",
    tooltip: "Critical Illness"
  },
  {
    key: "needIntl",
    icon: Globe,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    label: "Global / International Care",
    desc: "Emergency cashless hospitalization abroad with international medical air evacuations.",
  },
  {
    key: "needMental",
    icon: Brain,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    label: "Mental Healthcare & Therapy",
    desc: "Inpatient psychiatric admissions & clinical psychology under Mental Healthcare Act 2017.",
  },
  {
    key: "ped",
    icon: Pill,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    label: "Pre-Existing Day-1 Coverage",
    desc: "Reduces or waives standard 24–36 month waiting periods for declared chronic conditions.",
    tooltip: "PED"
  },
  {
    key: "needOPD",
    icon: Stethoscope,
    color: "text-teal-600 bg-teal-50 border-teal-200",
    label: "Outpatient (OPD) & Diagnostics",
    desc: "Doctor consultations, routine pharmacy bills, pathology tests, and specialist opinions.",
    tooltip: "OPD"
  },
]

const PRIORITIES = [
  {
    key: "claims",
    icon: ShieldCheck,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    label: "Highest Claim Approval (CSR)",
    desc: "Prioritizes insurers with top IRDAI-verified Claim Settlement Ratios (>98%) and rapid settlement turnaround.",
    tag: "Recommended for Safety",
    tooltip: "CSR"
  },
  {
    key: "price",
    icon: PiggyBank,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    label: "Lowest Annual Premium",
    desc: "Surfaces the most cost-effective plans that satisfy your mandatory coverage parameters without premium bloat.",
    tag: "Budget Optimized"
  },
  {
    key: "coverage",
    icon: Layers,
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    label: "Maximum Holistic Coverage",
    desc: "Ranks plans with zero co-pay, unlimited restoration, broad OPD, and expansive cashless hospital networks.",
    tag: "Comprehensive Protection"
  },
]

export default function Step3({ data, update, mode }) {
  const selectedCount = NEEDS.filter(n => data[n.key]).length

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-10">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <span>Step 3 of 3</span>
          <span className="text-blue-300">•</span>
          <span>Coverage Customization & Priority</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          What do you need covered?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select targeted health benefits to include, then establish your core actuarial evaluation benchmark.
        </p>
      </div>

      {/* ─── Specialized Coverage Modules ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Specialized Policy Riders & Benefits
            </h3>
            <p className="text-xs text-slate-500">
              Select optional coverage items according to personal healthcare needs.
            </p>
          </div>
          {selectedCount > 0 && (
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {NEEDS.map(n => {
            const isChecked = !!data[n.key]
            const Icon = n.icon
            return (
              <div
                key={n.key}
                onClick={() => update({ [n.key]: !isChecked })}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={e => (e.key === " " || e.key === "Enter") && update({ [n.key]: !isChecked })}
                className={`flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer select-none hover-lift transition-all duration-200 ${
                  isChecked
                    ? "border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-500/10 ring-1 ring-blue-500/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${n.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isChecked ? "bg-blue-600 border-blue-600 text-white shadow-2xs" : "border-slate-300 bg-white"
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1 leading-snug">
                    {n.label}
                    {n.tooltip && <Tooltip term={n.tooltip} />}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {n.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Strategic Evaluation Priority ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Primary Decision Criterion
          </h3>
          <p className="text-xs text-slate-500">
            Tell the actuarial recommendation engine what to prioritize above all else.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {PRIORITIES.map(p => {
            const isSelected = data.priority === p.key
            const Icon = p.icon
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => update({ priority: p.key })}
                className={`flex flex-col justify-between p-5 rounded-2xl border-2 text-left hover-lift transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 shadow-sm shadow-blue-500/10 ring-2 ring-blue-500/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${p.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 mb-1.5">
                    {p.tag}
                  </span>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug flex items-center gap-1">
                    {p.label}
                    {p.tooltip && <Tooltip term={p.tooltip} />}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Profile Summary Banner ─── */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
          Actuarial Input Summary
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg font-semibold">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>{data.age} years</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg font-semibold">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{data.city}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg font-semibold">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{data.members} Member{data.members > 1 ? "s" : ""}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg font-semibold">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹{data.budget.toLocaleString()}/mo Target</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg font-semibold">
            <span className="text-slate-400 font-normal">BMI:</span>
            <span>{data.bmi}</span>
          </div>

          {data.smoker && (
            <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              Tobacco User
            </span>
          )}
          {data.ped && (
            <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              Pre-existing Condition
            </span>
          )}
          {data.chronic && (
            <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-bold">
              Chronic Care
            </span>
          )}
        </div>
      </div>

      {mode === "agent" && data.agentNotes && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
          <strong className="font-bold">Advisor Client File Notes:</strong> {data.agentNotes}
        </div>
      )}

    </div>
  )
}
