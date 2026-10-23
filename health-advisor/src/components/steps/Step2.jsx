import { useState } from "react"
import Tooltip from "../Tooltip"
import {
  Scale, Cigarette, Pill, Activity, Baby,
  ShieldCheck, AlertTriangle, Calculator, SlidersHorizontal, Check
} from "lucide-react"

const BMI_ZONES = [
  { max: 18.5, label: "Underweight", color: "#d97706", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", pill: "bg-amber-100 text-amber-800 border-amber-300" },
  { max: 25.0, label: "Normal Weight", color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", pill: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { max: 30.0, label: "Overweight", color: "#ea580c", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", pill: "bg-orange-100 text-orange-800 border-orange-300" },
  { max: 35.0, label: "Obese (Class I)", color: "#dc2626", bg: "bg-red-50", border: "border-red-200", text: "text-red-800", pill: "bg-red-100 text-red-800 border-red-300" },
  { max: Infinity, label: "Severe Obesity", color: "#991b1b", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-900", pill: "bg-rose-100 text-rose-900 border-rose-300" },
]

const RISK_FACTORS = [
  {
    key: "smoker",
    icon: Cigarette,
    iconColor: "text-rose-600 bg-rose-50 border-rose-200",
    label: "Tobacco / Smoker",
    sub: "Cigarettes, bidi, vaping, or chewable tobacco within the last 12 months.",
    badge: "+20% Tobacco Loading",
    badgeType: "warning"
  },
  {
    key: "ped",
    icon: Pill,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    label: "Pre-existing Disease (PED)",
    sub: "Diagnosed conditions like Diabetes, Hypertension, Thyroid, or High Cholesterol.",
    badge: "+30% Underwriting Loading",
    badgeType: "warning",
    tooltip: "PED"
  },
  {
    key: "chronic",
    icon: Activity,
    iconColor: "text-orange-600 bg-orange-50 border-orange-200",
    label: "Chronic Health Condition",
    sub: "Asthma, chronic kidney disease, arthritis, cardiac history, or autoimmune disorders.",
    badge: "+15% Medical Loading",
    badgeType: "warning"
  },
  {
    key: "hasChildren",
    icon: Baby,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    label: "Dependent Children Covered",
    sub: "Enables maternity benefits, pediatric emergency beds, and floater discount pools.",
    badge: "Floater Pricing",
    badgeType: "neutral"
  },
]

function getZone(bmi) {
  return BMI_ZONES.find(z => bmi < z.max) || BMI_ZONES[BMI_ZONES.length - 1]
}

export default function Step2({ data, update }) {
  const [calcMode, setCalcMode] = useState("slider") // "slider" | "metrics"
  const [heightCm, setHeightCm] = useState(172)
  const [weightKg, setWeightKg] = useState(68)

  const zone = getZone(data.bmi)
  const pct = Math.min(100, Math.max(0, ((data.bmi - 15) / (45 - 15)) * 100))

  function handleMetricsChange(newH, newW) {
    const h = parseFloat(newH) || 170
    const w = parseFloat(newW) || 65
    setHeightCm(h)
    setWeightKg(w)
    const m = h / 100
    const calculatedBmi = Math.round((w / (m * m)) * 10) / 10
    update({ bmi: Math.min(45, Math.max(15, calculatedBmi)) })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-10">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <span>Step 2 of 3</span>
          <span className="text-blue-300">•</span>
          <span>Health & Actuarial Profiling</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Your Health Profile & Medical History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Indian insurers assess premiums using standard actuarial tables. Accurate disclosures ensure guaranteed cashless claim settlements under IRDAI guidelines.
        </p>
      </div>

      {/* ─── BMI Card ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* BMI Header Status */}
        <div className={`p-5 sm:p-6 border-b ${zone.border} ${zone.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Body Mass Index (BMI)
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 tabular-nums">
                {data.bmi}
              </span>
              <span className="text-xs text-slate-500 font-medium">kg/m²</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${zone.pill}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
              {zone.label}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {data.bmi < 18.5 && "May require medical underwriting for malnutrition"}
              {data.bmi >= 18.5 && data.bmi < 25 && "✓ Qualifies for 0% standard actuarial loading"}
              {data.bmi >= 25 && data.bmi < 30 && "Mild loading risk (5–10% on select underwriters)"}
              {data.bmi >= 30 && "High loading tier (+15–30% or mandatory tele-medical test)"}
            </span>
          </div>
        </div>

        {/* BMI Input Controls */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Toggle between Slider & Calculator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Calibration Method
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCalcMode("slider")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  calcMode === "slider" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Quick Slider</span>
              </button>
              <button
                type="button"
                onClick={() => setCalcMode("metrics")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  calcMode === "metrics" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Height & Weight</span>
              </button>
            </div>
          </div>

          {calcMode === "metrics" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="120"
                    max="220"
                    value={heightCm}
                    onChange={e => handleMetricsChange(e.target.value, weightKg)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">cm</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="35"
                    max="180"
                    value={weightKg}
                    onChange={e => handleMetricsChange(heightCm, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">kg</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Interactive Range Track */}
              <div className="relative h-9 select-none flex items-center">
                {/* Segmented Gradient Bar */}
                <div className="absolute inset-x-0 h-3 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: "11.6%", backgroundColor: "#f59e0b" }} title="Underweight (<18.5)" />
                  <div style={{ width: "21.6%", backgroundColor: "#10b981" }} title="Normal (18.5-25)" />
                  <div style={{ width: "16.7%", backgroundColor: "#f97316" }} title="Overweight (25-30)" />
                  <div style={{ width: "16.7%", backgroundColor: "#ef4444" }} title="Obese (30-35)" />
                  <div style={{ flex: 1, backgroundColor: "#b91c1c" }} title="Severely Obese (35+)" />
                </div>

                {/* Moving Thumb Indicator */}
                <div
                  className="pointer-events-none absolute w-6 h-6 rounded-full border-2 border-white shadow-md transition-all duration-75 flex items-center justify-center -translate-x-1/2"
                  style={{
                    left: `${pct}%`,
                    backgroundColor: zone.color,
                    boxShadow: `0 0 0 4px ${zone.color}35, 0 2px 8px rgba(0,0,0,0.25)`,
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                {/* Native Range Input */}
                <input
                  type="range"
                  min="15"
                  max="45"
                  step="0.5"
                  value={data.bmi}
                  onChange={e => update({ bmi: parseFloat(e.target.value) })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Range Tick Labels */}
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5 mt-1">
                <span>15.0</span>
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>35.0</span>
                <span>45.0</span>
              </div>

              {/* Zone Names */}
              <div className="flex text-[10px] font-bold mt-1.5">
                <span className="text-amber-600" style={{ width: "12%" }}>Under</span>
                <span className="text-emerald-600" style={{ width: "22%" }}>Normal (✓)</span>
                <span className="text-orange-600" style={{ width: "17%" }}>Overweight</span>
                <span className="text-red-600" style={{ width: "17%" }}>Obese I</span>
                <span className="text-rose-800 flex-1 text-right">Severe</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Risk Factors Section ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Health & Lifestyle Declarations
            </h3>
            <p className="text-xs text-slate-500">
              Select all risk factors that apply to any covered member.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">IRDAI Underwriting Norms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {RISK_FACTORS.map(({ key, icon: Icon, iconColor, label, sub, badge, tooltip }) => {
            const isChecked = !!data[key]
            return (
              <label
                key={key}
                className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer select-none hover-lift transition-all duration-200 ${
                  isChecked
                    ? "border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-500/10 ring-1 ring-blue-500/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-bold leading-tight ${isChecked ? "text-blue-950" : "text-slate-900"}`}>
                      {label}
                    </span>
                    {tooltip && <Tooltip term={tooltip} />}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {sub}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isChecked
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200/80"
                    }`}>
                      {badge}
                    </span>
                  </div>
                </div>

                {/* Styled Checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isChecked ? "bg-blue-600 border-blue-600 text-white shadow-2xs" : "border-slate-300 bg-white"
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={e => update({ [key]: e.target.checked })}
                    className="sr-only"
                  />
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* ─── IRDAI Statutory Protection Banner ─── */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-start gap-4 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-white block mb-0.5">
            IRDAI Section 45 Non-Repudiation Guarantee
          </span>
          Under Insurance Act Section 45, once a policy has been continuously active for <strong>3 years (Moratorium Period)</strong>, no claim can be rejected on ground of non-disclosure or misstatement, except in documented cases of established fraud. Honest declaration at purchase guarantees hassle-free cashless approval.
        </div>
      </div>

    </div>
  )
}
