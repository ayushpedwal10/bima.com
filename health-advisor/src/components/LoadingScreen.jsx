import { useEffect, useState, useRef } from "react"

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

// Orbiting ring component
function OrbitRing({ size, duration, delay, color }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ animation: `spin ${duration}s linear infinite ${delay}s` }}>
      <div style={{
        width: size, height: size,
        border: `1px solid ${color}`,
        borderRadius: "50%",
        borderTopColor: "transparent",
        borderRightColor: "transparent",
      }} />
    </div>
  )
}

export default function LoadingScreen({ apiOnline }) {
  const [tipIdx,   setTipIdx]   = useState(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [progress, setProgress] = useState(4)
  const [dots,     setDots]     = useState("")
  const [tipVisible, setTipVisible] = useState(true)
  const canvasRef = useRef(null)

  useEffect(() => {
    const prog = setInterval(() => {
      setProgress(p => p >= 92 ? p : p + (p < 40 ? 4 : p < 70 ? 2.5 : 1))
    }, 120)
    const stage = setInterval(() => {
      setStageIdx(i => Math.min(i + 1, STAGES.length - 1))
    }, 500)
    const dot = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".")
    }, 400)
    const tip = setInterval(() => {
      setTipVisible(false)
      setTimeout(() => { setTipIdx(i => (i + 1) % TIPS.length); setTipVisible(true) }, 300)
    }, 2800)
    return () => { clearInterval(prog); clearInterval(stage); clearInterval(dot); clearInterval(tip) }
  }, [])

  // Particle background on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.2 + 0.05,
    }))
    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37,99,235,${p.a})`; ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  const t = TIPS[tipIdx]
  const plansDone = Math.min(Math.floor(progress / 10), 10)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #eff6ff 0%, #f8fafc 60%, #f1f5f9 100%)" }}>

      {/* Particle bg */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />

      {/* Mesh orbs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-sm w-full text-center">

        {/* Logo with orbiting rings */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <OrbitRing size={80}  duration={3}   delay={0}   color="rgba(37,99,235,0.25)" />
          <OrbitRing size={96}  duration={5}   delay={0.5} color="rgba(37,99,235,0.15)" />
          <OrbitRing size={112} duration={7}   delay={1}   color="rgba(37,99,235,0.08)" />

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-600/40"
            style={{ animation: "hero-float 3s ease-in-out infinite" }}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Stage */}
        <div>
          <p className="text-xl font-black text-slate-900">
            {STAGES[stageIdx]}<span className="text-blue-500">{dots}</span>
          </p>
          <p className="text-sm text-slate-400 mt-1.5">
            {apiOnline ? "Python engine active" : "AI engine running"}
          </p>
        </div>

        {/* Progress bar — segmented */}
        <div className="w-full space-y-2">
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: i < plansDone ? "100%" : i === plansDone ? `${((progress % 10) / 10) * 100}%` : "0%",
                    background: i < plansDone ? "linear-gradient(90deg,#2563eb,#06b6d4)" : "#2563eb",
                    opacity: i < plansDone ? 1 : 0.6,
                  }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>{plansDone}/10 plans analysed</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Rotating tip with fade */}
        <div className={`w-full bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 ${tipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
            <div className="text-left">
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1">Did you know?</p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{t.tip}</p>
            </div>
          </div>
        </div>

        {/* Plan pills */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width: i < plansDone ? 20 : 6,
                height: 6,
                background: i < plansDone ? "#2563eb" : "#e2e8f0",
              }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
