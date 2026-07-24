import { useState } from "react"

const ALL_PLANS = [
  { id: "P001", name: "HDFC Optima Secure",          provider: "HDFC ERGO",         pedWait: 36, color: "#2563eb" },
  { id: "P002", name: "Niva ReAssure 2.0 Platinum+", provider: "Niva Bupa",          pedWait: 36, color: "#16a34a" },
  { id: "P003", name: "Star Super Star",             provider: "Star Health",         pedWait: 48, color: "#dc2626" },
  { id: "P004", name: "Care Supreme",                provider: "Care Health",         pedWait: 48, color: "#ea580c" },
  { id: "P005", name: "Aditya Birla Activ One MAX",  provider: "Aditya Birla Health", pedWait: 0,  color: "#9333ea" },
  { id: "P006", name: "ICICI Health Companion",      provider: "ICICI Lombard",       pedWait: 48, color: "#0d9488" },
  { id: "P007", name: "Star Senior Red Carpet",      provider: "Star Health",         pedWait: 0,  color: "#e11d48" },
  { id: "P008", name: "Bajaj Platinum",              provider: "Bajaj Allianz",       pedWait: 48, color: "#d97706" },
  { id: "P009", name: "Tata MediCare Premier",       provider: "Tata AIG",            pedWait: 36, color: "#0284c7" },
  { id: "P010", name: "Reliance Health Gain",        provider: "Reliance General",    pedWait: 36, color: "#be123c" },
]

// What gets carried over when porting
const PORTABILITY_BENEFITS = [
  {
    icon: "⏳",
    title: "Waiting Period Credit",
    desc: "Years already served on your current plan carry over. If you've had your plan for 2 years and the new plan has a 3-year PED wait, you only wait 1 more year.",
    important: true,
  },
  {
    icon: "🎁",
    title: "No Claim Bonus (NCB)",
    desc: "Your accumulated NCB (bonus sum insured earned by not claiming) transfers to the new insurer.",
    important: true,
  },
  {
    icon: "🏦",
    title: "Moratorium Credit",
    desc: "If your policy is older than 8 years (moratorium period), no insurer can reject a claim for non-disclosure of PED — this credit also transfers.",
    important: true,
  },
  {
    icon: "📋",
    title: "Continuity of Coverage",
    desc: "Your policy is treated as continuous — no fresh initial 30-day waiting period when you port.",
    important: false,
  },
  {
    icon: "💰",
    title: "Better Premium or Features",
    desc: "You can switch to a plan with lower premium, higher coverage, or better features — especially if your health has improved.",
    important: false,
  },
]

const PORTING_STEPS = [
  {
    step: 1,
    icon: "📅",
    title: "Apply 45 days before renewal",
    desc: "IRDAI mandates you apply for portability at least 45 days before your current policy's renewal date. Missing this window means you must wait another year.",
    warning: "Most people miss this deadline — set a calendar reminder today.",
    color: "#ef4444",
  },
  {
    step: 2,
    icon: "📝",
    title: "Fill the portability form",
    desc: "Contact the new insurer and fill their portability application form. They will request your policy details and claims history directly from your current insurer.",
    warning: null,
    color: "#f59e0b",
  },
  {
    step: 3,
    icon: "🏥",
    title: "Medical underwriting",
    desc: "The new insurer reviews your health history and decides whether to accept, modify, or reject the port. They may ask for a fresh medical test.",
    warning: "If you have active claims or serious pre-existing diseases, some insurers may decline.",
    color: "#f59e0b",
  },
  {
    step: 4,
    icon: "✅",
    title: "New policy issued",
    desc: "If accepted, the new insurer issues a policy with your continuity benefits intact. Your waiting period credit, NCB, and moratorium status all carry over.",
    warning: null,
    color: "#10b981",
  },
  {
    step: 5,
    icon: "🚫",
    title: "Cancel old policy",
    desc: "Only cancel your old policy after the new one is active. Never let there be a gap — even a 1-day gap can break your continuity benefits.",
    warning: "Do NOT cancel your old policy first. Activate new policy → then cancel old.",
    color: "#ef4444",
  },
]

function WaitingPeriodVisual({ yearsCompleted, newPlanWait, planId }) {
  const plan = ALL_PLANS.find(p => p.id === planId)
  const remaining = Math.max(newPlanWait - yearsCompleted, 0)
  const pct = newPlanWait > 0 ? Math.min((yearsCompleted / newPlanWait) * 100, 100) : 100

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-slate-800">PED Waiting Period After Porting</p>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${plan?.color}20`, color: plan?.color }}>
          {plan?.name}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Already served: <strong className="text-slate-800">{yearsCompleted} yr{yearsCompleted !== 1 ? "s" : ""}</strong></span>
            <span>New plan requires: <strong className="text-slate-800">{newPlanWait} yr{newPlanWait !== 1 ? "s" : ""}</strong></span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 bg-blue-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      {remaining === 0 ? (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <span>✅</span> PED fully covered from Day 1 after porting — you've already served the waiting period!
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span>⏳</span> You still need to wait <strong>{remaining} more year{remaining !== 1 ? "s" : ""}</strong> for PED coverage after porting.
        </div>
      )}
    </div>
  )
}

export default function PortabilityGuide({ ranked, profile }) {
  const [currentYears, setCurrentYears] = useState(2)
  const [targetPlan,   setTargetPlan]   = useState(ranked?.[0]?.policy?.id || "P001")
  const [hasClaimed,   setHasClaimed]   = useState(false)
  const [currentPlan,  setCurrentPlan]  = useState("other")

  const target = ALL_PLANS.find(p => p.id === targetPlan)
  const moratSatisfied = currentYears >= 8
  const readyToPort = currentYears >= 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-black text-slate-900">Health Insurance Portability Guide</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Switch to a better plan without losing your waiting period credit, NCB, or continuity benefits.
        </p>
      </div>

      {/* What is portability — plain English */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="font-bold text-blue-900 mb-1">What is portability? (Plain English)</p>
            <p className="text-sm text-blue-800 leading-relaxed">
              Portability means switching your health insurance from one company to another at renewal time,
              <strong> without losing the years you've already served</strong> on waiting periods.
              IRDAI mandates all insurers to accept portability requests — they cannot refuse without reason.
            </p>
          </div>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-800">
            <strong>Example:</strong> You've had Star Health for 3 years and want to switch to HDFC Optima Secure
            (which has a 3-year PED wait). Because you've already served 3 years, your PED is covered
            from Day 1 at HDFC. You don't restart the clock.
          </p>
        </div>
      </div>

      {/* What carries over */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">What Carries Over When You Port</p>
        <div className="space-y-3">
          {PORTABILITY_BENEFITS.map(b => (
            <div key={b.title} className={`flex items-start gap-3 p-3 rounded-xl ${
              b.important ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-200"
            }`}>
              <span className="text-xl flex-shrink-0">{b.icon}</span>
              <div>
                <p className={`text-sm font-bold ${b.important ? "text-emerald-800" : "text-slate-800"}`}>{b.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{b.desc}</p>
              </div>
              {b.important && <span className="ml-auto flex-shrink-0 text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">KEY</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Personal waiting period calculator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Portability Waiting Period Calculator</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">Years on current plan</label>
              <span className="text-sm font-black text-blue-600">{currentYears} yr{currentYears !== 1 ? "s" : ""}</span>
            </div>
            <input type="range" min={0} max={10} step={1} value={currentYears}
              onChange={e => setCurrentYears(+e.target.value)}
              className="w-full h-2 accent-blue-600 cursor-pointer" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>New policy</span><span>10 yrs</span></div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Target plan to port into</label>
            <div className="relative">
              <select value={targetPlan} onChange={e => setTargetPlan(e.target.value)}
                className="w-full h-10 appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 pr-8 text-sm font-medium text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                {ALL_PLANS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.pedWait === 0 ? "No PED wait" : `${p.pedWait/12}yr PED wait`})</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>

        {target && (
          <WaitingPeriodVisual
            yearsCompleted={currentYears}
            newPlanWait={target.pedWait / 12}
            planId={targetPlan}
          />
        )}

        {/* Moratorium */}
        <div className={`mt-4 flex items-start gap-3 p-4 rounded-xl border ${
          moratSatisfied
            ? "bg-purple-50 border-purple-200"
            : "bg-slate-50 border-slate-200"
        }`}>
          <span className="text-xl flex-shrink-0">🏦</span>
          <div>
            <p className={`text-sm font-bold ${moratSatisfied ? "text-purple-800" : "text-slate-700"}`}>
              Moratorium Period: {moratSatisfied ? "✅ Complete" : `${8 - currentYears} more years`}
            </p>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              After 8 continuous years of any health insurance, no insurer can reject claims for
              non-disclosure of pre-existing diseases. This protection <strong>transfers when you port</strong>.
              {moratSatisfied && " You've already earned this protection!"}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-step process */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">Step-by-Step Porting Process</p>
        <div className="space-y-4">
          {PORTING_STEPS.map((s, i) => (
            <div key={s.step} className="flex gap-4">
              {/* step indicator */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm"
                  style={{ background: s.color }}>
                  {s.step}
                </div>
                {i < PORTING_STEPS.length - 1 && (
                  <div className="w-0.5 h-8 bg-slate-200 mt-1" />
                )}
              </div>
              {/* content */}
              <div className="pb-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <p className="font-bold text-slate-900">{s.title}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                {s.warning && (
                  <div className="mt-2 flex items-start gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <span className="flex-shrink-0">⚠</span>
                    <span>{s.warning}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* When NOT to port */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="font-bold text-amber-900 mb-3 flex items-center gap-2"><span className="text-xl">⚠️</span> When porting may NOT be a good idea</p>
        <div className="space-y-2">
          {[
            { cond: "Active claim in progress", reason: "Port only after the claim is fully settled. Mid-claim porting can cause disputes." },
            { cond: "Less than 1 year on current plan", reason: "Most insurers won't accept a port request from a policy less than 1 year old." },
            { cond: "Serious recent diagnosis", reason: "A new serious illness may make you uninsurable or attract heavy loading in the new plan." },
            { cond: "New plan has a longer PED wait", reason: "If you port to a plan with a longer PED waiting period than you've served, you'll need to wait additional years." },
          ].map(w => (
            <div key={w.cond} className="flex items-start gap-3">
              <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">✗</span>
              <div>
                <span className="text-sm font-bold text-slate-800">{w.cond} — </span>
                <span className="text-sm text-slate-600">{w.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IRDAI note */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <span className="text-lg flex-shrink-0">🏛️</span>
        <p className="text-xs text-emerald-800 leading-relaxed">
          <strong>IRDAI Circular on Portability (2013 &amp; updated 2019):</strong> All health insurers are mandated to accept
          portability requests. A new insurer cannot deny portability without documentary justification.
          They must respond within 15 days of receiving the application.
        </p>
      </div>
    </div>
  )
}
