import { useState } from "react"
import {
  ShieldCheck, ArrowRight, Sparkles, Building2, CheckCircle2,
  AlertTriangle, Calculator, FileText, MapPin, Activity,
  Check, X, Stethoscope, ChevronRight, Lock, Bot
} from "lucide-react"

export default function LandingPage({ onStart, onOpenCopilot }) {
  const [selectedDemo, setSelectedDemo] = useState("optima")

  const STATS = [
    { value: "10", label: "Major IRDAI Insurers", sub: "HDFC ERGO, Care, Niva Bupa & more" },
    { value: "43,661", label: "Rate Records Analyzed", sub: "Grounded in official FY24-25 tariffs" },
    { value: "99.01%", label: "Top Claim Settlement", sub: "Average IRDAI published ratios" },
    { value: "100%", label: "Zero Commission / Unbiased", sub: "No phone number, zero spam calls" },
  ]

  const CAPABILITIES = [
    {
      icon: <Bot className="w-5 h-5 text-blue-600" />,
      title: "Saathi AI Copilot",
      desc: "Conversational advisory assistant that answers queries on waiting periods, room-rent traps, and plan comparisons in plain English."
    },
    {
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      title: "Hospital Network Map",
      desc: "Interactive Leaflet geospatial map across 64 prominent hospitals in 8 Indian metros with real-time cashless empanelment status."
    },
    {
      icon: <Activity className="w-5 h-5 text-violet-600" />,
      title: "31-Disease Coverage Matrix",
      desc: "Cross-checks 31 illnesses across 12 medical categories to identify Day-1 covers, 1–4 year waiting periods, and permanent exclusions."
    },
    {
      icon: <Calculator className="w-5 h-5 text-amber-600" />,
      title: "What-If Premium Simulator",
      desc: "Interactive slider tool showing how premiums change as you age, adjust BMI, add family members, or disclose medical conditions."
    },
    {
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      title: "Section 80D Tax Calculator",
      desc: "Accurately computes direct income tax savings under both Old and New Tax Regimes for self, spouse, and senior citizen parents."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-sky-600" />,
      title: "Medical Inflation Projector",
      desc: "Visualizes the 7.5% annual healthcare inflation rate in India, projecting future procedure costs over 5 to 20-year horizons."
    },
  ]

  const COMPARISONS = [
    {
      feature: "Plan Ranking Basis",
      us: "Algorithmic match based on IRDAI CSR, network, and your health risk",
      them: "Commercial sponsorships, distributor commissions, and lead value",
    },
    {
      feature: "Room-Rent Sub-Limits",
      us: "Explicitly flags 1% room caps and warns of proportionate bill deductions",
      them: "Often buried deep within 40-page policy wording PDF attachments",
    },
    {
      feature: "Consumer Privacy",
      us: "100% anonymous advisory; zero phone number or email required",
      them: "Phone number required upfront, resulting in persistent telemarketing",
    },
    {
      feature: "Claim Trap Warnings",
      us: "Insurer-specific analysis of the #1 claim rejection reasons and turnaround times",
      them: "Absent; solely focused on checkout conversion",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50 text-slate-900">
      
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Regulatory badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>IRDAI Data Verified</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Impartial & Commission-Free</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6">
              Objective health insurance advisory for India.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Navigate complex policy wordings, compare 10 leading health plans with verified actuarial loading waterfalls, and uncover non-obvious claim rejection traps with AI assistance.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Find Your Best Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenCopilot}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Ask Saathi Copilot</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Takes ~2 minutes · No phone number required · Free & open access
            </p>
          </div>

          {/* Interactive Policy Intelligence Showcase */}
          <div className="mt-14 max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Intelligence Snapshot</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">How BeemaSaathi Evaluates Policy Fine Print</h3>
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setSelectedDemo("optima")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedDemo === "optima" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Optima Secure
                </button>
                <button
                  onClick={() => setSelectedDemo("reassure")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedDemo === "reassure" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ReAssure 2.0
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Claim Settlement</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">
                  {selectedDemo === "optima" ? "99.01%" : "96.01%"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">IRDAI 2-Year Average</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Room Rent Limit</p>
                <p className="text-xl font-bold text-slate-900 mt-1">No Cap</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">0% Proportionate Risk</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Restoration</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {selectedDemo === "optima" ? "2x Day 1" : "Unlimited"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Automatic refill</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Hospital Network</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {selectedDemo === "optima" ? "13,000+" : "10,000+"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Cashless facilities</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100/80 flex items-start gap-2.5 text-xs text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Algorithmic Insight: </span>
                <span>
                  {selectedDemo === "optima"
                    ? "HDFC ERGO Optima Secure doubles your base sum insured from Day 1 at zero extra cost. Zero copay applies across all age tiers."
                    : "Niva Bupa ReAssure 2.0 features 'Lock the Clock', freezing premium calculations at your entry age until you make your first claim."}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Institutional Stats Bar ─────────────────────────────── */}
      <section className="bg-white border-b border-slate-200/80 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, idx) => (
            <div key={idx} className="border-l-2 border-blue-600 pl-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-xs font-bold text-slate-700 mt-1">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Core Tool Suite Grid ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              A comprehensive decision-support suite
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Every tool is engineered to address the specific vulnerabilities Indian policyholders face during hospitalization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((c, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-4">
                    {c.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BeemaSaathi vs Commercial Aggregators ──────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Consumer Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
              Why BeemaSaathi is different
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Built on academic research at MIT School of Computing to eliminate sales bias in insurance.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                  <th className="py-3.5 px-4 sm:px-6">Advisory Dimension</th>
                  <th className="py-3.5 px-4 sm:px-6 text-blue-700 bg-blue-50/50">BeemaSaathi</th>
                  <th className="py-3.5 px-4 sm:px-6 text-slate-500">Commercial Aggregators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {COMPARISONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-800">{row.feature}</td>
                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 bg-blue-50/20">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{row.us}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-500">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{row.them}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Ready to find your optimal health cover?
          </h2>
          <p className="text-sm text-slate-600 mt-2 mb-8">
            Get personalized plan recommendations, full premium transparency, and actionable claim insights in under 3 minutes.
          </p>

          <button
            onClick={onStart}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all inline-flex items-center gap-2"
          >
            <span>Start Advisor Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>BeemaSaathi — Department of CSE, MIT School of Computing</span>
          </div>
          <p className="text-center sm:text-right">
            Educational decision-support platform. All data grounded in IRDAI Handbook & official product wordings.
          </p>
        </div>
      </footer>

    </div>
  )
}
