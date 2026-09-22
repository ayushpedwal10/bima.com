import { useState, useEffect, useRef, useCallback } from "react"

/* ── Animated counter ─────────────────────────────────────── */
function Counter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const isFloat = String(target).includes(".")
        const end = parseFloat(String(target).replace(/,/g, ""))
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          const cur = isFloat ? (eased * end).toFixed(2) : Math.floor(eased * end)
          setVal(cur)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return <span ref={ref} className="counter-num">{val.toLocaleString()}{suffix}</span>
}

/* ── Tilt card ────────────────────────────────────────────── */
function TiltCard({ children, className = "", intensity = 8 }) {
  const ref = useRef(null)
  const isMobile = window.matchMedia("(max-width:639px)").matches

  const onMove = useCallback((e) => {
    if (isMobile) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = (e.clientX - cx) / (r.width / 2)
    const dy = (e.clientY - cy) / (r.height / 2)
    el.style.setProperty("--rx", `${-dy * intensity}deg`)
    el.style.setProperty("--ry", `${dx * intensity}deg`)
  }, [intensity, isMobile])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
  }, [])

  return (
    <div ref={ref} className={`tilt-card ${className}`}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

/* ── Particle canvas ──────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H

    const N = 40
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.4 + 0.1,
    }))

    let frame
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37,99,235,${p.a})`
        ctx.fill()
      })
      // draw connecting lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(37,99,235,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      frame = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize) }
  }, [])

  return <canvas ref={ref} id="particle-canvas" />
}

/* ── Cursor orb ───────────────────────────────────────────── */
function CursorOrb() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e) => {
      el.style.left = e.clientX + "px"
      el.style.top  = e.clientY + "px"
    }
    window.addEventListener("mousemove", move, { passive: true })
    return () => window.removeEventListener("mousemove", move)
  }, [])
  return <div ref={ref} className="cursor-orb hidden lg:block" />
}

/* ── Scroll reveal hook ───────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-scale")
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible") })
    }, { threshold: 0.15 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ── Data ─────────────────────────────────────────────────── */
const STATS = [
  { raw: 10,    suffix: "",  label: "Plans Compared",    icon: "📋", accent: "#2563eb" },
  { raw: 43661, suffix: "",  label: "Real Policy Records", icon: "📊", accent: "#7c3aed" },
  { raw: 99.45, suffix: "%", label: "Highest Claims Paid", icon: "🛡️", accent: "#059669" },
  { raw: 3,     suffix: " min", label: "To Your Best Plan", icon: "⚡", accent: "#f59e0b" },
]

const FEATURES = [
  { icon: "🤖", title: "AI Plan Analysis",         desc: "Conversational insights that explain exactly why one plan suits you over another — not just numbers." },
  { icon: "🏥", title: "Hospital Network Map",      desc: "Interactive map of 64 hospitals across 8 cities. See cashless coverage per plan before you buy." },
  { icon: "🦠", title: "Disease Coverage Checker",  desc: "31 conditions mapped to every plan. Diabetes, cancer, heart disease — covered or not, with waiting periods." },
  { icon: "🛡️", title: "Sum Insured Calculator",    desc: "Are you underinsured? We calculate the minimum cover you actually need based on your city and profile." },
  { icon: "📈", title: "Medical Inflation Projector",desc: "Your ₹5L cover today buys ₹2.5L of treatment in 10 years. See exactly how inflation erodes your safety net." },
  { icon: "🔀", title: "Portability Guide",          desc: "Switch insurers without losing waiting period credit or NCB. Step-by-step with a personal waiting period calculator." },
]

const TRUST = [
  { icon: "🏛️", text: "IRDAI verified" },
  { icon: "🔒", text: "No data sold" },
  { icon: "🚫", text: "Zero spam" },
  { icon: "💯", text: "Free forever" },
]

/* ── Main ─────────────────────────────────────────────────── */
export default function LandingPage({ onStart }) {
  useReveal()

  return (
    <div className="relative min-h-[calc(100vh-60px)] overflow-hidden bg-[#fafbff]">
      <CursorOrb />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-8 text-center overflow-hidden">

        {/* Mesh background */}
        <div className="mesh-bg" />
        <div className="mesh-orb" />
        <ParticleCanvas />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-blue-200/60 text-blue-700 text-xs font-bold px-5 py-2.5 rounded-full mb-8 shadow-sm fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Free · No login · IRDAI verified · India's most advanced health insurance advisor
          </div>

          {/* Hero headline with 3D float */}
          <div className="hero-3d mb-6">
            <div className="hero-3d-inner">
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.04] tracking-tight fade-up" style={{ animationDelay: "80ms" }}>
                Find the right<br />
                <span className="gradient-text">health insurance</span><br />
                <span className="text-slate-700">in 3 minutes.</span>
              </h1>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-4 fade-up" style={{ animationDelay: "160ms" }}>
            Answer 3 quick questions. We compare 10 top plans with real IRDAI data, AI-powered insights, and zero marketing copy.
          </p>
          <p className="text-sm text-slate-400 mb-10 fade-up" style={{ animationDelay: "200ms" }}>
            AI-driven advisory that was previously only available through expensive agents.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 fade-up" style={{ animationDelay: "240ms" }}>
            <button onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-9 py-4.5 bg-blue-600 text-white text-base font-bold rounded-2xl
                hover:bg-blue-700 active:scale-[0.97] transition-all shadow-lg shadow-blue-600/40 overflow-hidden shine magnetic"
              style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}>
              {/* Animated ring */}
              <span className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:scale-105 transition-transform duration-500" />
              <span className="relative font-black text-lg">Find My Best Plan</span>
              <svg className="relative w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="flex -space-x-1">
                {["#3b82f6","#10b981","#f59e0b","#8b5cf6"].map((c,i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0" style={{ background: c }} />
                ))}
              </div>
              <span>43,661+ policies analysed</span>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 fade-up" style={{ animationDelay: "300ms" }}>
            {TRUST.map(t => (
              <span key={t.text} className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <span>{t.icon}</span>{t.text}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-400 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-slate-400" style={{ animation: "scroll-dot 1.8s ease infinite" }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className="relative py-16 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <TiltCard key={i} intensity={6}
              className={`reveal reveal-d${i+1} bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm glow-border`}>
              <div className="tilt-content">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-3xl font-black mb-1" style={{ color: s.accent }}>
                  <Counter target={s.raw} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-400 font-semibold leading-snug">{s.label}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* subtle bg gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fafbff] via-blue-50/20 to-[#fafbff] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Everything included · Completely free</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              More than a plan picker.<br />
              <span className="gradient-text">Your personal insurance advisor.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <TiltCard key={i} intensity={5}
                className={`reveal reveal-d${(i % 3) + 1} bg-white rounded-2xl p-6 border border-slate-100 shadow-sm glow-border cursor-default`}>
                <div className="tilt-content">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 animated-underline w-fit">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
                <div className="tilt-badge absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-black text-slate-900">How it works</h2>
            <p className="text-slate-400 mt-2">Three steps. Three minutes.</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "01", icon: "🙋", title: "Tell us about you",      desc: "Life stage, age, city, family size, budget" },
                { step: "02", icon: "🏥", title: "Share your health",      desc: "BMI, risk factors, pre-existing conditions" },
                { step: "03", icon: "✅", title: "Pick your priorities",   desc: "Coverage needs + what matters most to you" },
              ].map((s, i) => (
                <div key={i} className={`reveal reveal-d${i+1} text-center`}>
                  <div className="relative inline-flex mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 flex items-center justify-center text-4xl shadow-sm">
                      {s.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12 reveal">
            <button onClick={onStart}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl
                hover:bg-blue-600 active:scale-[0.98] transition-all duration-300 shadow-md">
              Start now — it's free
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM CTA BAND
      ══════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden reveal">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
        <div className="mesh-bg opacity-30" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-4">Stop guessing · Start knowing</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
            The right plan is 3 minutes away.
          </h2>
          <button onClick={onStart}
            className="inline-flex items-center gap-3 px-9 py-4 bg-white text-blue-700 text-sm font-black rounded-2xl
              hover:bg-blue-50 active:scale-[0.98] transition-all shadow-xl">
            Find My Best Plan →
          </button>
          <p className="text-blue-300 text-xs mt-4">Free · No account · No spam · IRDAI data</p>
        </div>
      </section>

      <style>{`
        @keyframes scroll-dot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
