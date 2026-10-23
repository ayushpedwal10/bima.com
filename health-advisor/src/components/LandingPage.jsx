import { useState } from "react"
import {
  ShieldCheck, ArrowRight, Sparkles, Building2, CheckCircle2,
  AlertTriangle, Calculator, FileText, Activity, Check, X,
  Bot, Clock, HelpCircle, ChevronRight, TrendingUp, Users, Heart, Lock, Zap
} from "lucide-react"
import Logo from "./Logo"

export default function LandingPage({ onStart, onOpenCopilot }) {
  const [activeTab, setActiveTab] = useState(0)
  const [previewAge, setPreviewAge] = useState(28)
  const [previewCity, setPreviewCity] = useState("Bangalore")

  const STATS = [
    { value: "10", label: "Major IRDAI Insurers", sub: "HDFC ERGO, Niva Bupa, Care & more" },
    { value: "43,661", label: "Tariff Data Points", sub: "IRDAI FY 2024-25 verified rate cards" },
    { value: "99.01%", label: "Peak Claim Settlement", sub: "Audited 2-year average payout ratio" },
    { value: "0%", label: "Broker Commission", sub: "No phone numbers required, zero spam" },
  ]

  const FEATURE_TABS = [
    {
      id: 0,
      title: "bima Copilot AI",
      icon: <Bot className="w-4 h-4" />,
      tag: "Dual-Engine AI",
      headline: "Ask any question about policy fine print in plain conversational English",
      desc: "Our AI Copilot knows the policy wordings of all 10 major Indian insurers. Ask about pre-existing disease waiting periods, room-rent sub-limits, claim turnaround times, or Section 80D tax savings.",
      bulletPoints: [
        "Uncovers hidden room-rent sub-limit traps (e.g., 1% room caps)",
        "Explains PED waiting periods (Day 1 vs 24–36 months)",
        "Directly compares top recommendations side-by-side"
      ],
      previewSnippet: {
        q: "Why is HDFC Optima Secure better for my parents than Star Health?",
        a: "Optima Secure offers 99.01% CSR with zero room-rent caps and Day-1 2x restore. Star Health is ~20% cheaper but has a lower CSR (91.06%) and 48-month PED wait."
      }
    },
    {
      id: 1,
      title: "Cashless Hospital Map",
      icon: <Building2 className="w-4 h-4" />,
      tag: "Interactive Geospatial",
      headline: "64 top hospitals mapped across 8 Indian metros",
      desc: "Find cashless network hospitals before an emergency strikes. Filters across Apollo, Fortis, Max, Manipal, and government multispecialty hospitals with live empanelment verification.",
      bulletPoints: [
        "Coverage status per policy across Mumbai, Delhi, Bangalore, Hyderabad & more",
        "Clear distinction between cashless empanelment vs reimbursement",
        "Turnaround time metrics for planned vs emergency admission"
      ],
      previewSnippet: {
        q: "Cashless Empanelment Status in Bangalore",
        a: "Manipal Hospital (Old Airport Rd) & Apollo Hospital (Bannerghatta) are empanelled across 9 out of 10 policies with average cashless approval in under 2 hours."
      }
    },
    {
      id: 2,
      title: "31-Disease Matrix",
      icon: <Activity className="w-4 h-4" />,
      tag: "Clinical Coverage",
      headline: "Know what's covered from Day 1 vs 3-year waiting periods",
      desc: "Comprehensive tracking of 31 critical conditions across 12 medical categories — diabetes, cancer, cardiac bypass, knee replacement, asthma, and maternity care.",
      bulletPoints: [
        "Identifies 8 distinct coverage statuses from Day-1 to 48 months wait",
        "Highlights permanent exclusions and cosmetic sub-limits",
        "Advises on Day-1 chronic care riders from Day 1"
      ],
      previewSnippet: {
        q: "Type-2 Diabetes & Hypertension Coverage",
        a: "Care Supreme & Optima Secure require 36 months of active coverage before diabetes claims are payable. Aditya Birla Activ One covers from Day 1 via chronic add-on."
      }
    },
    {
      id: 3,
      title: "What-If & Inflation",
      icon: <Calculator className="w-4 h-4" />,
      tag: "Financial Modeling",
      headline: "Simulate lifestyle changes & 7.5% medical inflation",
      desc: "See how premiums change in real time as you adjust your age, BMI, tobacco status, and family size. Quantifies how 7.5% annual medical inflation erodes your sum insured.",
      bulletPoints: [
        "Real-time actuarial loading breakdown (+20% smoker, +30% PED)",
        "5, 10, 15, and 20-year medical inflation projections",
        "Sum Insured adequacy check against real procedure costs"
      ],
      previewSnippet: {
        q: "Cost of Delaying Insurance by 5 Years",
        a: "Buying at age 28 vs 33 saves approximately ₹48,000 in cumulative premiums and completes your 3-year pre-existing disease waiting period while healthy."
      }
    }
  ]

  const COMPARISONS = [
    {
      metric: "Plan Selection Basis",
      bima: "100% algorithmic scoring using IRDAI Claim Settlement Ratio, network size, and health risk",
      commercial: "Sponsored placements, distributor commissions, and lead generation value"
    },
    {
      metric: "Room-Rent Sub-Limits",
      bima: "Explicitly warns against 1% room caps that trigger proportionate bill deductions",
      commercial: "Often hidden in 40-page PDF policy wording documents"
    },
    {
      metric: "User Data Privacy",
      bima: "100% anonymous advisory; zero phone number or email required",
      commercial: "Mandatory phone number upfront, followed by persistent sales calls"
    },
    {
      metric: "Claim Trap Warnings",
      bima: "Insurer-specific breakdown of top claim rejection reasons and settlement times",
      commercial: "Omitted; sole focus is pushing policy checkout"
    }
  ]

  const activeFeature = FEATURE_TABS[activeTab]

  return (
    <div className="min-h-[calc(100vh-64px)] text-slate-900 relative">
      
      {/* ─── Hero Section with Glassmorphic Aesthetics ─── */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 lg:pt-18 lg:pb-24 border-b border-slate-200/80 overflow-hidden">
        
        {/* Subtle Ambient Glow Mesh behind Hero */}
        <div className="w-[600px] h-[600px] bg-blue-500/10 ambient-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
        <div className="w-[400px] h-[400px] bg-cyan-400/10 ambient-glow bottom-0 right-10" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            
            {/* Top Brand Banner / Logo Display */}
            <div className="mb-6 hover:scale-105 transition-transform duration-300">
              <Logo size="hero" showTagline={false} />
            </div>

            {/* Regulatory badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-bold text-slate-700 mb-6 shadow-xs border border-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IRDAI Audited Data</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Unbiased, Zero Commission</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] mb-6">
              Health insurance that <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">actually pays</span> your claim.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 font-medium">
              Compare 10 major Indian health plans with transparent actuarial pricing, uncover hidden room-rent traps and waiting periods, and consult our AI Copilot with zero sales spam.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span>Find My Best Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenCopilot}
                className="w-full sm:w-auto px-6 py-4 glass-panel hover:bg-white text-slate-800 border border-slate-200/90 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md hover:border-blue-300 active:scale-[0.98]"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Ask bima Copilot</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-6">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Takes ~2 minutes</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-600" /> No phone number needed</span>
              <span>•</span>
              <span>100% Free & Open</span>
            </div>
          </div>

          {/* ─── Interactive Live Plan Intelligence Preview Widget (Glassmorphic) ─── */}
          <div className="mt-14 max-w-4xl mx-auto glass-panel-elevated rounded-3xl p-5 sm:p-7 shadow-xl hover-lift border border-white/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/70">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Tariff Explorer
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                  Instant Market Rate & Feature Snapshot
                </h3>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Age:</span>
                <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 font-bold">
                  {[25, 32, 45, 58].map(a => (
                    <button
                      key={a}
                      onClick={() => setPreviewAge(a)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        previewAge === a ? "bg-white text-blue-700 shadow-2xs font-black" : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {a}y
                    </button>
                  ))}
                </div>

                <select
                  value={previewCity}
                  onChange={e => setPreviewCity(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none shadow-2xs"
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5">
              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Top Plan Match</p>
                <p className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate">
                  {previewAge < 50 ? "Optima Secure" : "Care Senior"}
                </p>
                <p className="text-xs text-blue-600 font-bold mt-0.5">
                  {previewAge < 50 ? "HDFC ERGO" : "Care Health"}
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Claim Settlement</p>
                <p className="text-base sm:text-lg font-black text-emerald-700 mt-1">99.01%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">IRDAI 2-Year Ratio</p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Room Rent Limit</p>
                <p className="text-base sm:text-lg font-black text-slate-900 mt-1">No Sub-Limit</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">0% Proportionate Risk</p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Est. Monthly</p>
                <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  ₹{previewAge < 30 ? "1,178" : previewAge < 40 ? "1,450" : previewAge < 50 ? "1,980" : "3,250"}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">₹15 Lakh Cover</p>
              </div>
            </div>

            {/* Smart notice */}
            <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/70 flex items-center justify-between text-xs text-blue-950 font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  At age <strong>{previewAge}</strong> in <strong>{previewCity}</strong>, this plan includes 2x cover restoration and cashless access at 13,000+ hospitals.
                </span>
              </div>
              <button
                onClick={onStart}
                className="hidden sm:inline-flex items-center gap-1 font-extrabold text-blue-700 hover:text-blue-900 ml-4 flex-shrink-0"
              >
                <span>Calculate Exact Quote</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Institutional Trust Metrics ─── */}
      <section className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, idx) => (
            <div key={idx} className="border-l-2 border-blue-600 pl-4 hover:translate-x-1 transition-transform">
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{s.value}</div>
              <div className="text-xs font-bold text-slate-700 mt-1">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Feature Suite (Tabbed View) ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">The bima.com Toolkit</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Everything you need to make an informed choice
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Specialized actuarial analysis tools designed to demystify complex insurance fine print.
            </p>
          </div>

          {/* Segmented Switcher */}
          <div className="flex gap-2 max-w-2xl mx-auto mb-8 bg-slate-200/60 backdrop-blur-xs p-1 rounded-2xl overflow-x-auto scrollbar-none border border-slate-200/80">
            {FEATURE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Card */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-lg max-w-4xl mx-auto hover-lift border border-white/90">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  {activeFeature.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                  {activeFeature.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {activeFeature.desc}
                </p>

                <div className="space-y-2 pt-2">
                  {activeFeature.bulletPoints.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Output Card */}
              <div className="lg:col-span-5 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 text-xs space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sample Copilot Output</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-medium text-slate-800 shadow-2xs">
                  <p className="text-slate-500 text-[11px] mb-1 font-bold">User Query:</p>
                  <p className="font-bold text-slate-900">"{activeFeature.previewSnippet.q}"</p>
                </div>
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-blue-950 leading-relaxed font-medium">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1">bima Copilot:</p>
                  <p>{activeFeature.previewSnippet.a}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── Comparison Table: bima.com vs Commercial Portals ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white/70 backdrop-blur-md border-t border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">The Impartiality Difference</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Why bima.com is radically different
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Commercial aggregator portals earn distributor commissions. bima.com is built on pure academic research to eliminate sales bias.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/90 shadow-md glass-panel">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-black text-slate-600 uppercase tracking-wide">
                  <th className="py-4 px-4 sm:px-6">Advisory Dimension</th>
                  <th className="py-4 px-4 sm:px-6 text-blue-700 bg-blue-50/60 font-black">bima.com</th>
                  <th className="py-4 px-4 sm:px-6 text-slate-500">Commercial Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {COMPARISONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{row.metric}</td>
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 bg-blue-50/30">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 stroke-[3]" />
                        <span>{row.bima}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-500">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5 stroke-[2]" />
                        <span>{row.commercial}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Final Call To Action ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Protect your family with verified policy intelligence.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Get personalized plan recommendations, full premium loading transparency, and actionable claim insights in under 3 minutes.
          </p>

          <div className="pt-4">
            <button
              onClick={onStart}
              className="px-9 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all inline-flex items-center gap-2 group"
            >
              <span>Start Free bima Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline={false} />
          <p className="text-center sm:text-right font-medium">
            Independent educational advisory tool. Policy wordings and tariffs verified against IRDAI publications.
          </p>
        </div>
      </footer>

    </div>
  )
}
