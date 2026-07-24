import { useState } from "react"

const STATS = [
  { value: "10",      label: "Top Plans Compared",     icon: "📋" },
  { value: "43,661",  label: "Real Policy Data Points", icon: "📊" },
  { value: "99.45%",  label: "Highest Claims Paid",     icon: "🛡️" },
  { value: "3 min",   label: "To Your Best Plan",       icon: "⚡" },
]

const TRUST = [
  { icon: "🏛️", text: "IRDAI verified data" },
  { icon: "🔒", text: "No personal data sold" },
  { icon: "🚫", text: "Zero spam calls" },
  { icon: "💯", text: "Completely free" },
]

const FEATURES = [
  { icon: "🏥", title: "Hospital Network Checker",   desc: "Find which plans cover your nearest hospital cashlessly — with an interactive map." },
  { icon: "🦠", title: "Disease Coverage Lookup",    desc: "Check if diabetes, cancer, heart disease or any condition is covered in each plan." },
  { icon: "🛡️", title: "Sum Insured Adequacy",       desc: "Is ₹5 lakh enough? Our calculator tells you the minimum you actually need." },
  { icon: "📈", title: "Medical Inflation Projector", desc: "See how ₹10L today loses value over 10 years — and how to stay protected." },
  { icon: "🔀", title: "Portability Guide",           desc: "Switching insurers? Keep your waiting period credit and NCB." },
  { icon: "🧾", title: "Tax Savings (80D)",           desc: "See exactly how much tax you save by buying health insurance." },
]

export default function LandingPage({ onStart }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12 text-center relative">

        {/* Background blur blobs */}
        <div className="absolute top-8 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-56 h-56 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-6 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
            Free · No login required · IRDAI verified
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight mb-5 fade-up" style={{ animationDelay: "60ms" }}>
            Find the right<br/>
            <span className="gradient-text">health insurance</span><br/>
            in 3 minutes.
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-8 fade-up" style={{ animationDelay: "120ms" }}>
            Not sure which plan to buy? Answer 3 quick questions and we'll compare 10 top plans
            — with real IRDAI data, not marketing copy.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 fade-up" style={{ animationDelay: "180ms" }}>
            <button onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-base font-bold rounded-2xl
                hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/30">
              <span>Find My Best Plan</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <span className="text-sm text-slate-400">Takes about 3 minutes</span>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 fade-up" style={{ animationDelay: "240ms" }}>
            {TRUST.map(t => (
              <span key={t.text} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>{t.icon}</span>{t.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 fade-up" style={{ animationDelay: "300ms" }}>
          {STATS.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="text-center mb-8 fade-up">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Everything included · Free</p>
          <h2 className="text-2xl font-black text-slate-900">More than just a plan picker</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i}
              className={`bg-white border rounded-2xl p-5 cursor-default transition-all duration-200 fade-up ${
                hovered === i ? "border-blue-300 shadow-md -translate-y-0.5" : "border-slate-200 shadow-sm"
              }`}
              style={{ animationDelay: `${i * 50 + 300}ms` }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-black text-slate-900 mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm fade-up">
          <h2 className="text-xl font-black text-slate-900 text-center mb-8">How it works</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {[
              { step: "1", icon: "🙋", title: "Tell us about yourself",     desc: "Life stage, age, city, budget — 1 min" },
              { step: "2", icon: "🏥", title: "Share your health profile",  desc: "BMI, risk factors — 1 min" },
              { step: "3", icon: "✅", title: "Pick what you need",         desc: "Coverage needs, priority — 1 min" },
            ].map((s, i) => (
              <>
                <div key={s.step} className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-2xl mx-auto mb-3">
                    {s.icon}
                  </div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Step {s.step}</div>
                  <div className="text-sm font-bold text-slate-900 mb-1">{s.title}</div>
                  <div className="text-xs text-slate-400">{s.desc}</div>
                </div>
                {i < 2 && (
                  <div key={`arrow-${i}`} className="hidden sm:flex flex-shrink-0 text-slate-300 text-2xl">→</div>
                )}
              </>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={onStart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl
                hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/20">
              Start Now — It's Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
