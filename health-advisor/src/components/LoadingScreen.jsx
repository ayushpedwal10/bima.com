import { useEffect, useState } from "react"
import { ShieldCheck, CheckCircle2, Bot, Sparkles, Activity } from "lucide-react"

const TIPS = [
  "Plans with 99%+ Claim Settlement Ratios pay out almost every verified, genuine claim.",
  "Pre-Existing Disease (PED) waiting periods range from Day 1 to 48 months across Indian insurers.",
  "Zero-copay policies ensure the insurer covers 100% of approved hospital bills without deduction.",
  "Room rent sub-limits are the #1 reason patients face surprise out-of-pocket deductions at discharge.",
  "Healthcare inflation in India averages ~7.5% per year — your coverage must account for rising procedure costs.",
  "Under Section 80D, premiums paid for senior citizen parents qualify for up to ₹50,000 tax deduction.",
]

const STAGES = [
  "Parsing personal profile & health attributes...",
  "Querying rate tables across 10 major IRDAI insurers...",
  "Computing actuarial loadings (Age, BMI, Tobacco, PED)...",
  "Checking empanelment across 64 cashless hospitals...",
  "Ranking policies by Claim Settlement Ratio and fit...",
  "Synthesizing Saathi AI Copilot insights...",
]

export default function LoadingScreen({ apiOnline }) {
  const [stageIdx, setStageIdx] = useState(0)
  const [tipIdx, setTipIdx] = useState(0)
  const [progress, setProgress] = useState(15)

  useEffect(() => {
    const progTimer = setInterval(() => {
      setProgress(p => (p >= 94 ? p : p + Math.floor(Math.random() * 12 + 6)))
    }, 180)

    const stageTimer = setInterval(() => {
      setStageIdx(i => Math.min(i + 1, STAGES.length - 1))
    }, 380)

    const tipTimer = setInterval(() => {
      setTipIdx(i => (i + 1) % TIPS.length)
    }, 2800)

    return () => {
      clearInterval(progTimer)
      clearInterval(stageTimer)
      clearInterval(tipTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Actuarial Calculation Engine</h3>
              <p className="text-[11px] text-slate-400">
                {apiOnline ? "Executing Python Engine (api.py)" : "Executing In-Browser Engine"}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {Math.min(progress, 100)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Calculation Stages */}
        <div className="mt-5 space-y-2.5 text-xs">
          {STAGES.slice(0, 5).map((stage, idx) => {
            const isCompleted = idx < stageIdx
            const isCurrent = idx === stageIdx

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 transition-all duration-200 ${
                  isCompleted
                    ? "text-slate-700 font-medium"
                    : isCurrent
                    ? "text-blue-700 font-bold"
                    : "text-slate-300"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0" />
                )}
                <span className="truncate">{stage}</span>
              </div>
            )
          })}
        </div>

        {/* Advisory Tip Box */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Advisory Tip</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {TIPS[tipIdx]}
          </p>
        </div>

      </div>
    </div>
  )
}
