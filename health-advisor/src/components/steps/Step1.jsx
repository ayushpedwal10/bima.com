import Tooltip from "../Tooltip"
import {
  GraduationCap, Briefcase, Heart, Users, UserCheck,
  MapPin, Wallet, Info, Sparkles, Check
} from "lucide-react"

const SEGMENTS = [
  {
    id: "student",
    label: "Student",
    icon: <GraduationCap className="w-5 h-5 text-violet-600" />,
    desc: "Age 18–25, entry budget",
    sub: "First health policy"
  },
  {
    id: "young_professional",
    label: "Young Professional",
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    desc: "Single & working",
    sub: "Optimal age bracket"
  },
  {
    id: "couple",
    label: "Couple",
    icon: <Heart className="w-5 h-5 text-rose-600" />,
    desc: "Married, no children",
    sub: "Joint floater cover"
  },
  {
    id: "family",
    label: "Family Floater",
    icon: <Users className="w-5 h-5 text-emerald-600" />,
    desc: "Parents + children",
    sub: "Comprehensive family shield"
  },
  {
    id: "senior",
    label: "Senior Citizen",
    icon: <UserCheck className="w-5 h-5 text-amber-600" />,
    desc: "Age 55+",
    sub: "Day-1 PED & zero copay priority"
  },
]

const CITIES = [
  "New Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Other"
]

const INCOME_OPTIONS = [
  { label: "Under ₹3L", value: 250000 },
  { label: "₹3L – 6L", value: 450000 },
  { label: "₹6L – 12L", value: 900000 },
  { label: "₹12L – 25L", value: 1850000 },
  { label: "₹25L+", value: 3000000 },
]

const BUDGET_STEPS = [500, 750, 1000, 1500, 2000, 3000, 5000, 8000, 12000, 20000]

export default function Step1({ data, update, mode }) {
  const activeSegment = data.isStudent ? "student"
    : data.age >= 60 ? "senior"
    : (data.members >= 3 || data.hasChildren) ? "family"
    : data.members === 2 ? "couple"
    : "young_professional"

  function selectSegment(id) {
    if (id === "student") {
      update({ isStudent: true, members: 1, hasChildren: false, age: Math.min(data.age, 24) })
    } else if (id === "senior") {
      update({ isStudent: false, age: Math.max(data.age, 60) })
    } else if (id === "couple") {
      update({ isStudent: false, members: 2, hasChildren: false })
    } else if (id === "family") {
      update({ isStudent: false, members: Math.max(data.members, 3), hasChildren: true })
    } else {
      update({ isStudent: false, members: 1, hasChildren: false })
    }
  }

  const budgetIdx = BUDGET_STEPS.reduce((best, val, idx) =>
    Math.abs(val - data.budget) < Math.abs(BUDGET_STEPS[best] - data.budget) ? idx : best, 0
  )

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-10">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <span>Step 1 of 3</span>
          <span className="text-blue-300">•</span>
          <span>Life Stage & Demographics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Who are you buying coverage for?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select your life stage to align policy eligibility, waiting periods, and family floater structures.
        </p>
      </div>

      {/* ── Life Stage Selector Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SEGMENTS.map(s => {
          const isSelected = activeSegment === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => selectSegment(s.id)}
              className={`p-4 rounded-2xl border-2 text-left hover-lift transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center mb-3 shadow-2xs">
                  {s.icon}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{s.label}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{s.desc}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400">{s.sub}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Demographics & Financial Input Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Demographic & Coverage Parameters</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">IRDAI Tier-1 / Tier-2 City Tariffs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Age Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Age of Eldest Member
              </label>
              <Tooltip term="Age" />
            </div>
            <div className="relative">
              <input
                type="number"
                min={18}
                max={99}
                value={data.age}
                onChange={e => update({ age: parseInt(e.target.value) || 18 })}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                years
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Premiums jump at age 36, 45, and 55</p>
          </div>

          {/* Members Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Family Members Covered
              </label>
              <Tooltip term="Family Floater" />
            </div>
            <div className="flex items-center gap-1.5 h-11 bg-slate-50 border border-slate-200 rounded-xl px-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ members: n, hasChildren: n >= 3 })}
                  className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${
                    data.members === n
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {n === 5 ? "5+" : n}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {data.members === 1 ? "Individual plan" : `Floater cover across ${data.members} lives`}
            </p>
          </div>

          {/* City Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current City
              </label>
              <Tooltip term="Metro City" />
            </div>
            <select
              value={data.city}
              onChange={e => update({ city: e.target.value })}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Metros carry ~10% higher hospital tariff index</p>
          </div>
        </div>

        {/* Income Segmented Selector */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Annual Household Income
            </label>
            <span className="text-[11px] text-slate-400">Used to calculate adequate Sum Insured</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {INCOME_OPTIONS.map(opt => {
              const isSelected = data.income === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ income: opt.value })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Monthly Budget Slider */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Monthly Budget
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">We will score plans based on this ceiling</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-blue-600 tabular-nums">
                ₹{data.budget.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-semibold"> /month</span>
              <p className="text-[10px] text-slate-400">≈ ₹{(data.budget * 12).toLocaleString()}/year</p>
            </div>
          </div>

          <div className="relative pt-2 pb-1">
            <input
              type="range"
              min={0}
              max={BUDGET_STEPS.length - 1}
              step={1}
              value={budgetIdx}
              onChange={e => update({ budget: BUDGET_STEPS[parseInt(e.target.value)] })}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
              <span>₹500/mo</span>
              <span>₹2,000/mo</span>
              <span>₹5,000/mo</span>
              <span>₹12,000/mo</span>
              <span>₹20,000/mo</span>
            </div>
          </div>
        </div>

        {/* Optional Agent CRM Notes */}
        {mode === "agent" && (
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Advisor CRM Client Notes
            </label>
            <input
              type="text"
              placeholder="e.g., Client exploring family floater before November renewal..."
              value={data.agentNotes || ""}
              onChange={e => update({ agentNotes: e.target.value })}
              className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

    </div>
  )
}
