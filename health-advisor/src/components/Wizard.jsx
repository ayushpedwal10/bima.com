import { useState } from "react"
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step3 from "./steps/Step3"
import LiveProfileCard from "./LiveProfileCard"

const STEPS = [
  { label: "Life Stage",     sub: "Who are you buying for?" },
  { label: "Health Profile", sub: "Your health & lifestyle"  },
  { label: "Coverage Needs", sub: "What you need covered"    },
]

const DEFAULT = {
  age: 28, gender: "Male", city: "New Delhi",
  income: 450000, members: 1, budget: 2000,
  isStudent: false, hasChildren: false,
  bmi: 22, smoker: false,
  ped: false, chronic: false,
  needMaternity: false, needCritical: false,
  needIntl: false, needMental: false, needOPD: false,
  priority: "claims",
  agentNotes: "",
}

export default function Wizard({ onSubmit, mode }) {
  const [step, setStep]     = useState(0)
  const [dir, setDir]       = useState("forward")
  const [animKey, setAnimKey] = useState(0)
  const [data, setData]     = useState(DEFAULT)

  const update = patch => setData(d => ({ ...d, ...patch }))
  function goNext()  { setDir("forward");  setAnimKey(k => k + 1); setStep(s => s + 1) }
  function goBack()  { setDir("backward"); setAnimKey(k => k + 1); setStep(s => s - 1) }

  const completedPct = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <div className="flex" style={{ height: "calc(100vh - 60px)" }}>

      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex-1 flex flex-col px-6 py-8">

          {/* step list */}
          <nav className="flex-1 space-y-1">
            {STEPS.map((s, i) => {
              const done   = i < step
              const active = i === step
              return (
                <div key={i} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  active ? "bg-blue-50" : ""
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                    done   ? "bg-emerald-500 text-white"
                    : active ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    :          "bg-slate-100 text-slate-400"
                  }`}>
                    {done
                      ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      : i + 1
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-semibold leading-tight ${
                      active ? "text-blue-700" : done ? "text-slate-700" : "text-slate-400"
                    }`}>{s.label}</p>
                    <p className={`text-xs mt-0.5 ${
                      active ? "text-blue-500" : done ? "text-emerald-600" : "text-slate-300"
                    }`}>
                      {done ? "✓ Completed" : active ? s.sub : "Upcoming"}
                    </p>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* progress */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-700">{completedPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completedPct}%` }} />
            </div>
          </div>

          {/* trust */}
          <div className="mt-6 space-y-2">
            {[
              { icon: "🔒", text: "Data private & never sold" },
              { icon: "✅", text: "IRDAI verified rate cards" },
              { icon: "⚡", text: "No spam calls or emails" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Live profile card */}
          <LiveProfileCard data={data} step={step} />
        </div>
      </aside>

      {/* ─── Main panel ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

        {/* mobile header */}
        <div className="lg:hidden flex-shrink-0 bg-white border-b border-slate-100 px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">{STEPS[step].label}</span>
            <span className="text-xs text-slate-400">Step {step + 1} / {STEPS.length}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${completedPct}%` }} />
          </div>
        </div>

        {/* step content */}
        <div className="flex-1 overflow-y-auto"
          onKeyDown={e => {
            if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "SELECT") {
              if (step < STEPS.length - 1) goNext()
              else onSubmit(data)
            }
          }}>
          <div key={animKey}
            className={`min-h-full px-4 sm:px-6 py-6 sm:py-8 lg:px-10 lg:py-10 ${dir === "forward" ? "step-enter-forward" : "step-enter-backward"}`}>
            {step === 0 && <Step1 data={data} update={update} mode={mode} />}
            {step === 1 && <Step2 data={data} update={update} />}
            {step === 2 && <Step3 data={data} update={update} mode={mode} />}
          </div>
        </div>

        {/* bottom nav */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button onClick={goBack} disabled={step === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold
                hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${
                  i === step ? "w-6 h-2 bg-blue-600" :
                  i < step   ? "w-2 h-2 bg-emerald-500" :
                               "w-2 h-2 bg-slate-200"
                }`} />
              ))}
            </div>

            {step < STEPS.length - 1
              ? <button onClick={goNext}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold
                    hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/25">
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              : <button onClick={() => onSubmit(data)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold
                    hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-600/25">
                  Find My Plans
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
