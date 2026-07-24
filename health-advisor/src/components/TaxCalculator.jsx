import { useState, useMemo } from "react"

/**
 * Section 80D deduction limits (FY 2024-25)
 * Self + family (below 60):  ₹25,000
 * Self + family (60+):       ₹50,000
 * Parents (below 60):        ₹25,000
 * Parents (60+):             ₹50,000
 * Max total possible:        ₹1,00,000
 */

const TAX_SLABS_NEW = [
  { min: 0,       max: 300000,  rate: 0,  label: "Up to ₹3L" },
  { min: 300001,  max: 700000,  rate: 5,  label: "₹3L – ₹7L" },
  { min: 700001,  max: 1000000, rate: 10, label: "₹7L – ₹10L" },
  { min: 1000001, max: 1200000, rate: 15, label: "₹10L – ₹12L" },
  { min: 1200001, max: 1500000, rate: 20, label: "₹12L – ₹15L" },
  { min: 1500001, max: Infinity, rate: 30, label: "Above ₹15L" },
]

const TAX_SLABS_OLD = [
  { min: 0,       max: 250000,  rate: 0,  label: "Up to ₹2.5L" },
  { min: 250001,  max: 500000,  rate: 5,  label: "₹2.5L – ₹5L" },
  { min: 500001,  max: 1000000, rate: 20, label: "₹5L – ₹10L" },
  { min: 1000001, max: Infinity, rate: 30, label: "Above ₹10L" },
]

function calcTax(income, slabs) {
  let tax = 0
  for (const slab of slabs) {
    if (income <= slab.min) break
    const taxable = Math.min(income, slab.max) - slab.min
    tax += taxable * slab.rate / 100
  }
  return Math.round(tax)
}

function getMarginalRate(income, slabs) {
  for (let i = slabs.length - 1; i >= 0; i--) {
    if (income > slabs[i].min) return slabs[i].rate
  }
  return 0
}

function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function fmtFull(n) {
  return `₹${n.toLocaleString("en-IN")}`
}

function Slider({ label, value, min, max, step = 1000, onChange, format }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-black text-blue-600">{format ? format(value) : fmtFull(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-2 accent-blue-600 cursor-pointer" />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{format ? format(min) : fmtFull(min)}</span>
        <span>{format ? format(max) : fmtFull(max)}</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color = "text-slate-900", bg = "bg-slate-50", border = "border-slate-200" }) {
  return (
    <div className={`${bg} border ${border} rounded-xl p-4`}>
      <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function TaxCalculator({ profile, premiumMap, ranked }) {
  const bestPremium = premiumMap[ranked[0].policy.id]?.annual ?? 0

  // Inputs
  const [regime, setRegime]           = useState("new")
  const [income, setIncome]           = useState(profile.income || 800000)
  const [selfPremium, setSelfPremium] = useState(Math.min(bestPremium, 25000))
  const [selfAge, setSelfAge]         = useState(profile.age >= 60 ? "senior" : "below60")
  const [parentPremium, setParentPremium] = useState(0)
  const [parentAge, setParentAge]     = useState("below60")
  const [preventive, setPreventive]   = useState(5000) // preventive health checkup

  const slabs = regime === "new" ? TAX_SLABS_NEW : TAX_SLABS_OLD

  const calc = useMemo(() => {
    // 80D limits
    const selfLimit    = selfAge   === "senior" ? 50000 : 25000
    const parentLimit  = parentAge === "senior" ? 50000 : 25000

    // Preventive checkup is within the 80D limit (max ₹5,000)
    const preventiveCapped = Math.min(preventive, 5000)

    // Self deduction = premium + preventive, capped at limit
    const selfDeduction   = Math.min(selfPremium + preventiveCapped, selfLimit)
    const parentDeduction = Math.min(parentPremium, parentLimit)
    const totalDeduction  = selfDeduction + parentDeduction

    // Tax without deduction
    const taxBefore = calcTax(income, slabs)

    // Tax with deduction (only applicable in old regime; new regime doesn't allow 80D)
    const taxableAfter = regime === "old" ? Math.max(income - totalDeduction, 0) : income
    const taxAfter     = calcTax(taxableAfter, slabs)

    const saving       = regime === "old" ? Math.max(taxBefore - taxAfter, 0) : 0
    const savingWithGST = regime === "old" ? Math.round(saving) : 0

    // Effective cost of insurance after tax saving
    const effectivePremium = selfPremium - savingWithGST
    const effectiveMonthly = Math.round(effectivePremium / 12)

    const marginalRate = getMarginalRate(income, slabs)

    return {
      selfDeduction, parentDeduction, totalDeduction,
      taxBefore, taxAfter, saving: savingWithGST,
      effectivePremium: Math.max(effectivePremium, 0),
      effectiveMonthly: Math.max(effectiveMonthly, 0),
      marginalRate,
      selfLimit, parentLimit,
    }
  }, [regime, income, selfPremium, selfAge, parentPremium, parentAge, preventive, slabs])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900">Section 80D Tax Savings Calculator</h3>
        <p className="text-sm text-slate-500 mt-1">
          See exactly how much tax you save by buying health insurance — based on your income slab and family situation.
        </p>
      </div>

      {/* Plain language explainer */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
          <span className="text-lg">💡</span> How does this work? (Plain English)
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <div className="text-2xl mb-2">1️⃣</div>
            <div className="text-sm font-bold text-slate-800 mb-1">You pay premium</div>
            <div className="text-xs text-slate-500 leading-relaxed">You buy health insurance and pay, say, <strong>₹15,000/year</strong> as premium.</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <div className="text-2xl mb-2">2️⃣</div>
            <div className="text-sm font-bold text-slate-800 mb-1">Govt reduces your taxable income</div>
            <div className="text-xs text-slate-500 leading-relaxed">Under <strong>Section 80D</strong>, the government deducts that ₹15,000 from your income before calculating tax.</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <div className="text-2xl mb-2">3️⃣</div>
            <div className="text-sm font-bold text-slate-800 mb-1">You pay less tax</div>
            <div className="text-xs text-slate-500 leading-relaxed">If you're in the 20% slab, you save <strong>₹3,000 in tax</strong>. So your ₹15,000 premium actually costs you only ₹12,000.</div>
          </div>
        </div>

        {/* Live example based on user's actual numbers */}
        <div className="bg-white border border-blue-200 rounded-xl p-4">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Your Example (based on your profile)</div>
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-slate-500">Income</span>
              <span className="font-black text-slate-900">{fmtFull(income)}</span>
            </div>
            <span className="text-slate-300 text-lg">→</span>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-slate-500">Minus premium</span>
              <span className="font-black text-emerald-600">− {fmtFull(selfPremium)}</span>
            </div>
            <span className="text-slate-300 text-lg">→</span>
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
              <span className="text-slate-500">Taxable income</span>
              <span className="font-black text-blue-700">{fmtFull(Math.max(income - calc.totalDeduction, 0))}</span>
            </div>
            <span className="text-slate-300 text-lg">→</span>
            <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
              <span className="text-slate-500">Tax saved</span>
              <span className="font-black text-emerald-600">{fmtFull(calc.saving)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
          <span className="flex-shrink-0 font-bold">⚠</span>
          <span><strong>Important:</strong> This deduction only works under the <strong>Old Tax Regime</strong>. If you're on the New Regime (default for most salaried people), you cannot claim 80D. Use the toggle below to check both.</span>
        </div>
      </div>

      {/* Regime toggle */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-sm font-semibold text-slate-700">Tax Regime:</span>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {[["new", "New Regime (Default)"], ["old", "Old Regime"]].map(([val, lbl]) => (
            <button key={val} onClick={() => setRegime(val)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                regime === val ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              {lbl}
            </button>
          ))}
        </div>
        {regime === "new" && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
            ⚠ 80D deduction not available in New Regime — switch to Old Regime to claim it
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-5">
          <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl space-y-5">
            <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">Your Details</div>

            <Slider label="Annual Income" value={income} min={300000} max={5000000} step={50000}
              onChange={setIncome} format={fmt} />

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Your Age Group</label>
              <div className="flex gap-2">
                {[["below60", "Below 60 yrs"], ["senior", "60 yrs or above"]].map(([val, lbl]) => (
                  <button key={val} onClick={() => setSelfAge(val)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      selfAge === val ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <Slider
              label={`Health Insurance Premium (Self${profile.members > 1 ? " + Family" : ""})`}
              value={selfPremium} min={0} max={selfAge === "senior" ? 50000 : 25000} step={500}
              onChange={setSelfPremium} />

            <Slider label="Preventive Health Checkup (max ₹5,000)" value={preventive}
              min={0} max={5000} step={500} onChange={setPreventive} />
          </div>

          <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl space-y-5">
            <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">Parents (Optional)</div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Parents' Age Group</label>
              <div className="flex gap-2">
                {[["below60", "Below 60 yrs"], ["senior", "60 yrs or above"]].map(([val, lbl]) => (
                  <button key={val} onClick={() => setParentAge(val)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      parentAge === val ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <Slider label="Parents' Health Insurance Premium" value={parentPremium}
              min={0} max={parentAge === "senior" ? 50000 : 25000} step={500}
              onChange={setParentPremium} />
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">

          {/* Big saving number */}
          <div className={`rounded-2xl p-6 text-center ${
            regime === "old" && calc.saving > 0
              ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white"
              : "bg-slate-100 border-2 border-slate-200"
          }`}>
            {regime === "old" && calc.saving > 0 ? (
              <>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">You Save on Tax</div>
                <div className="text-6xl font-black mb-1">{fmtFull(calc.saving)}</div>
                <div className="text-emerald-100 text-sm">per year under Section 80D</div>
                <div className="mt-4 bg-white/20 rounded-xl px-4 py-2 text-sm font-semibold">
                  That's {fmtFull(Math.round(calc.saving / 12))} saved every month
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">💡</div>
                <div className="text-base font-bold text-slate-700 mb-1">Switch to Old Regime</div>
                <div className="text-sm text-slate-500">to claim 80D deduction and save {fmtFull(Math.round(calc.totalDeduction * getMarginalRate(income, TAX_SLABS_OLD) / 100))} in taxes</div>
              </>
            )}
          </div>

          {/* Deduction breakdown */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">80D Deduction Breakdown</div>

            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Self + Family premium</div>
                  <div className="text-xs text-slate-400">Limit: {fmtFull(calc.selfLimit)}</div>
                </div>
                <span className="text-sm font-black text-slate-900">{fmtFull(Math.min(selfPremium, calc.selfLimit))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Preventive checkup</div>
                  <div className="text-xs text-slate-400">Within self limit, max ₹5,000</div>
                </div>
                <span className="text-sm font-black text-slate-900">{fmtFull(Math.min(preventive, 5000))}</span>
              </div>
              {parentPremium > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Parents' premium</div>
                    <div className="text-xs text-slate-400">Limit: {fmtFull(calc.parentLimit)}</div>
                  </div>
                  <span className="text-sm font-black text-slate-900">{fmtFull(Math.min(parentPremium, calc.parentLimit))}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 bg-blue-50 rounded-lg px-3">
                <span className="text-sm font-bold text-blue-800">Total 80D Deduction</span>
                <span className="text-base font-black text-blue-700">{fmtFull(calc.totalDeduction)}</span>
              </div>
            </div>
          </div>

          {/* Tax comparison */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Tax Comparison</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard label="Tax Without Insurance" value={fmtFull(calc.taxBefore)}
                sub={`${calc.marginalRate}% marginal rate`} bg="bg-red-50" border="border-red-100" color="text-red-700" />
              <StatCard label="Tax With 80D Deduction" value={fmtFull(calc.taxAfter)}
                sub={regime === "new" ? "Not applicable" : "After deduction"}
                bg={regime === "old" ? "bg-emerald-50" : "bg-slate-50"}
                border={regime === "old" ? "border-emerald-100" : "border-slate-200"}
                color={regime === "old" ? "text-emerald-700" : "text-slate-400"} />
            </div>

            {/* Effective premium */}
            {regime === "old" && calc.saving > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Effective Cost After Tax Saving</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Annual premium</div>
                    <div className="text-lg font-black text-slate-900">{fmtFull(selfPremium)}</div>
                  </div>
                  <div className="text-2xl text-slate-300">−</div>
                  <div>
                    <div className="text-xs text-slate-500">Tax saving</div>
                    <div className="text-lg font-black text-emerald-600">{fmtFull(calc.saving)}</div>
                  </div>
                  <div className="text-2xl text-slate-300">=</div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">You actually pay</div>
                    <div className="text-2xl font-black text-blue-700">{fmtFull(calc.effectivePremium)}</div>
                    <div className="text-xs text-slate-400">{fmtFull(calc.effectiveMonthly)}/month</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 80D limits reference */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="text-xs font-bold text-amber-800 mb-3 uppercase tracking-wider">Section 80D Limits (FY 2024-25)</div>
            <div className="space-y-2 text-xs text-amber-900">
              {[
                ["Self + family (below 60)", "₹25,000"],
                ["Self + family (60 or above)", "₹50,000"],
                ["Parents (below 60)", "₹25,000"],
                ["Parents (60 or above)", "₹50,000"],
                ["Max total deduction possible", "₹1,00,000"],
                ["Preventive health checkup", "₹5,000 (within above limits)"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-700 mt-3 pt-3 border-t border-amber-200">
              ⚠ 80D deduction is only available under the <strong>Old Tax Regime</strong>. Not applicable under the New Regime (default from FY 2023-24).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
