import { useState } from "react"
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step3 from "./steps/Step3"
import LiveProfileCard from "./LiveProfileCard"
import {
  Check, ArrowRight, ArrowLeft, Lock, ShieldCheck, Sparkles,
  Zap, Bot, HelpCircle
} from "lucide-react"

const STEPS = [
  { label: "Life Stage", sub: "Category & Demographics", desc: "Age, city, family size & budget" },
  { label: "Health Profile", sub: "Actuarial Underwriting", desc: "BMI, tobacco, PED & chronic conditions" },
  { label: "Coverage Needs", sub: "Plan Customization", desc: "Maternity, critical illness & decision criteria" },
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

export default function Wizard({ onSubmit, mode, onOpenCopilot }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState("forward")
  const [animKey, setAnimKey] = useState(0)
  const [data, setData] = useState(DEFAULT)

  const update = patch => setData(d => ({ ...d, ...patch }))
  function goNext() {
    setDir("forward")
    setAnimKey(k => k + 1)
    setStep(s => s + 1)
  }
  function goBack() {
    setDir("backward")
    setAnimKey(k => k + 1)
    setStep(s => s - 1)
  }

  const completedPct = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <div className="flex bg-slate-50" style={{ height: "calc(100vh - 64px)" }}>

      {/* ─── Modern SaaS Wizard Sidebar ─── */}
      <aside className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 flex-col border-r border-slate-200/80 bg-white relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        <div className="relative flex-1 flex flex-col p-6 overflow-y-auto">

          {/* Stepper Navigation */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
              Actuarial Evaluation
            </span>

            <nav className="space-y-2">
              {STEPS.map((s, i) => {
                const done = i < step
                const active = i === step
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 border ${
                      active
                        ? "bg-blue-50/70 border-blue-200/90 shadow-2xs ring-1 ring-blue-500/20"
                        : done
                        ? "bg-slate-50/60 border-slate-200/60"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all ${
                      done
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : active
                        ? "bg-blue-600 text-white shadow-xs shadow-blue-600/30"
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {done ? <Check className="w-4 h-4 stroke-[2.5]" /> : i + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-extrabold leading-tight ${
                        active ? "text-blue-950" : done ? "text-slate-800" : "text-slate-500"
                      }`}>
                        {s.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 font-medium leading-tight truncate ${
                        active ? "text-blue-600" : done ? "text-emerald-700" : "text-slate-400"
                      }`}>
                        {done ? "Completed" : s.sub}
                      </p>
                    </div>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Progress Indicator */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-5">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-500">Evaluation Progress</span>
              <span className="text-blue-700 font-extrabold">{completedPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${completedPct}%` }}
              />
            </div>
          </div>

          {/* Inline AI Copilot Quick Helper */}
          {onOpenCopilot && (
            <div className="mb-4">
              <button
                type="button"
                onClick={onOpenCopilot}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 text-blue-800 transition-all text-left shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold block leading-tight">Need Help Deciding?</span>
                  <span className="text-[10px] text-blue-600/80 block leading-tight mt-0.5">
                    Ask Saathi Copilot for instant advice
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="space-y-2 mb-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Zero data sharing or spam calls</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>Direct IRDAI statutory rate cards</span>
            </div>
          </div>

          {/* Live Passport Card */}
          <LiveProfileCard data={data} step={step} />
        </div>
      </aside>

      {/* ─── Main Wizard Content Stage ─── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Mobile Header Bar */}
        <div className="lg:hidden flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-extrabold text-slate-900 block leading-none">
              {STEPS[step].label}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Step {step + 1} of {STEPS.length} ({completedPct}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCopilot && (
              <button
                type="button"
                onClick={onOpenCopilot}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Help</span>
              </button>
            )}
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${completedPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Scrolling Viewport */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8"
          onKeyDown={e => {
            if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "SELECT") {
              if (step < STEPS.length - 1) goNext()
              else onSubmit(data)
            }
          }}
        >
          <div
            key={animKey}
            className={`min-h-full transition-opacity duration-200 ${
              dir === "forward" ? "animate-fadeIn" : "animate-fadeIn"
            }`}
          >
            {step === 0 && <Step1 data={data} update={update} mode={mode} />}
            {step === 1 && <Step2 data={data} update={update} />}
            {step === 2 && <Step3 data={data} update={update} mode={mode} />}
          </div>
        </div>

        {/* ─── Bottom Navigation Action Bar ─── */}
        {/* Elevated, fixed at bottom of panel, high-contrast, clean button placement */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 shadow-lg z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            
            {/* Back Button */}
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-7 h-2 bg-blue-600 shadow-2xs"
                      : i < step
                      ? "w-2 h-2 bg-emerald-500"
                      : "w-2 h-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* Next / Submit Button */}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-600/30"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSubmit(data)}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-emerald-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate & Find Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}
