import { useEffect, useState } from "react"

const TIPS = [
  { icon: "🛡️", tip: "Plans with 99%+ Claims Paid % pay out almost every genuine claim." },
  { icon: "⏳", tip: "PED waiting period is the #1 thing people forget to check. We check it for you." },
  { icon: "💰", tip: "Buying at 28 vs 35 can save you ₹3,000–₹6,000/year for the same plan." },
  { icon: "🏥", tip: "Cashless hospitals mean you never pay upfront — the insurer settles directly." },
  { icon: "🎁", tip: "No Claim Bonus can grow your ₹5L cover to ₹10L — at no extra cost." },
  { icon: "🔄", tip: "Unlimited restore means if you exhaust your cover, it refills automatically." },
  { icon: "📊", tip: "Medical inflation in India runs at 7.5%/year — your cover needs to grow too." },
  { icon: "✂️", tip: "Zero copay plans are worth the extra premium — no surprises at discharge." },
]

const STAGES = [
  "Reading your profile…",
  "Calculating premiums across 10 plans…",
  "Applying IRDAI loading factors…",
  "Scoring match quality…",
  "Ranking by your priority…",
  "Almost there…",
]

export default function LoadingScreen({ apiOnline }) {
  const [tipIdx,   setTipIdx]   = useState(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [progress, setProgress] = useState(8)
  const [dots,     setDots]     = useState("")

  useEffect(() => {
    // Progress bar
    const prog = setInterval(() => {
      setProgress(p => {
        if (p >= 92) return p
        return p + (p < 40 ? 4 : p < 70 ? 2.5 : 1)
      })
    }, 120)

    // Stage text
    const stage = setInterval(() => {
      setStageIdx(i => Math.min(i + 1, STAGES.length - 1))
    }, 500)

    // Dots animation
    const dot = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".")
    }, 400)

    // Tips rotation
    const tip = setInterval(() => {
      setTipIdx(i => (i + 1) % TIPS.length)
    }, 2800)

    return () => { clearInterval(prog); clearInterval(stage); clearInterval(dot); clearInterval(tip) }
  }, [])

  const t = TIPS[tipIdx]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 px-6 max-w-sm w-full text-center">

        {/* Animated logo mark */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-600/30">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          </div>
          {/* Ping ring */}
          <div className="absolute inset-0 rounded-3xl bg-blue-600/20 animate-ping" style={{ animationDuration: "1.8s" }} />
        </div>

        {/* Stage text */}
        <div>
          <p className="text-lg font-black text-slate-900 tabular-nums">
            {STAGES[stageIdx]}{dots}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {apiOnline ? "Python engine active" : "Comparing 10 plans for you"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 tabular-nums">{Math.round(progress)}% complete</p>
        </div>

        {/* Rotating tip */}
        <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 transition-all duration-500">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Did you know?</p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{t.tip}</p>
            </div>
          </div>
        </div>

        {/* Plan count bubbles */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i < Math.floor(progress / 10) ? "#2563eb" : "#e2e8f0",
                transform: i < Math.floor(progress / 10) ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
          <span className="text-xs text-slate-400 ml-1">{Math.min(Math.floor(progress / 10), 10)}/10 plans</span>
        </div>
      </div>
    </div>
  )
}
