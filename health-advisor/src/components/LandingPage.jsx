import { useState } from "react"
import {
  ShieldCheck, ArrowRight, Sparkles, Building2, CheckCircle2,
  AlertTriangle, Calculator, FileText, Activity, Check, X,
  Bot, Clock, HelpCircle, ChevronRight, TrendingUp, Users, Heart
} from "lucide-react"

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
      title: "Saathi AI Copilot",
      icon: <Bot className="w-4 h-4" />,
      tag: "Conversational",
      headline: "Ask any question about policy fine print in plain English",
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
      beema: "100% algorithmic scoring using IRDAI Claim Settlement Ratio, network size, and health risk",
      commercial: "Sponsored placements, distributor commissions, and lead generation value"
    },
    {
      metric: "Room-Rent Sub-Limits",
      beema: "Explicitly warns against 1% room caps that trigger proportionate bill deductions",
      commercial: "Often hidden in 40-page PDF policy wording documents"
    },
    {
      metric: "User Data Privacy",
      beema: "100% anonymous advisory; zero phone number or email required",
      commercial: "Mandatory phone number upfront, followed by persistent sales calls"
    },
    {
      metric: "Claim Trap Warnings",
      beema: "Insurer-specific breakdown of top claim rejection reasons and settlement times",
      commercial: "Omitted; sole focus is pushing policy checkout"
    }
  ]

  const activeFeature = FEATURE_TABS[activeTab]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900">
      
      {/* ─── Hero Section ─── */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Regulatory badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IRDAI Audited Data</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Unbiased & Commission-Free</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6">
              Health insurance that actually pays your claim.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Compare 10 major Indian health plans with transparent actuarial pricing, uncover hidden room-rent traps and waiting periods, and get personalized advice from Saathi AI Copilot.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Find My Best Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenCopilot}
                className="w-full sm:w-auto px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Ask Saathi Copilot</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-5">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Takes ~2 minutes</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> No phone number needed</span>
              <span>•</span>
              <span>100% Free</span>
            </div>
          </div>

          {/* ─── Interactive Live Plan Intelligence Preview Widget ─── */}
          <div className="mt-14 max-w-4xl mx-auto bg-slate-50/90 border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Live Tariff Explorer</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Instant Market Rate & Feature Snapshot</h3>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Age:</span>
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 font-semibold">
                  {[25, 32, 45, 58].map(a => (
                    <button
                      key={a}
                      onClick={() => setPreviewAge(a)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        previewAge === a ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {a}y
                    </button>
                  ))}
                </div>

                <select
                  value={previewCity}
                  onChange={e => setPreviewCity(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
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
              <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Top Plan Match</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">
                  {previewAge < 50 ? "Optima Secure" : "Care Senior"}
                </p>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                  {previewAge < 50 ? "HDFC ERGO" : "Care Health"}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Claim Settlement</p>
                <p className="text-base sm:text-lg font-bold text-emerald-700 mt-1">99.01%</p>
                <p className="text-[11px] text-slate-500 mt-0.5">IRDAI 2-Year Ratio</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Room Rent Limit</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">No Sub-Limit</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">0% Proportionate Risk</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Est. Monthly</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  ₹{previewAge < 30 ? "1,178" : previewAge < 40 ? "1,450" : previewAge < 50 ? "1,980" : "3,250"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">₹15 Lakh Cover</p>
              </div>
            </div>

            {/* Smart notice */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  At age <strong>{previewAge}</strong> in <strong>{previewCity}</strong>, this plan includes 2x cover restoration and cashless access at 13,000+ hospitals.
                </span>
              </div>
              <button
                onClick={onStart}
                className="hidden sm:inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 ml-4 flex-shrink-0"
              >
                <span>Calculate Your Exact Quote</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Institutional Trust Metrics ─── */}
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

      {/* ─── Interactive Feature Suite (Tabbed View) ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The BeemaSaathi Toolkit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
              Everything you need to make an informed choice
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Explore our specialized advisory engines built specifically around IRDAI guidelines.
            </p>
          </div>

          {/* Segmented Switcher */}
          <div className="flex gap-2 max-w-2xl mx-auto mb-8 bg-slate-200/80 p-1 rounded-2xl overflow-x-auto scrollbar-none">
            {FEATURE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xs max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  {activeFeature.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                  {activeFeature.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeFeature.desc}
                </p>

                <div className="space-y-2 pt-2">
                  {activeFeature.bulletPoints.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Output Card */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sample Copilot Output</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 font-medium text-slate-800">
                  <p className="text-slate-500 text-[11px] mb-1">User Query:</p>
                  <p className="font-semibold text-slate-900">"{activeFeature.previewSnippet.q}"</p>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-950 leading-relaxed">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Copilot Answer:</p>
                  <p>{activeFeature.previewSnippet.a}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── Comparison Table: BeemaSaathi vs Commercial Portals ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Impartiality Difference</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
              Why BeemaSaathi is radically different
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Commercial aggregator sites make money from distributor commissions. BeemaSaathi is built on pure academic research to eliminate sales bias.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                  <th className="py-4 px-4 sm:px-6">Advisory Dimension</th>
                  <th className="py-4 px-4 sm:px-6 text-blue-700 bg-blue-50/50">BeemaSaathi</th>
                  <th className="py-4 px-4 sm:px-6 text-slate-500">Commercial Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {COMPARISONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{row.metric}</td>
                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 bg-blue-50/20">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{row.beema}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-500">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
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
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Protect your family with verified policy intelligence.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Get personalized plan recommendations, full premium loading transparency, and actionable claim insights in under 3 minutes.
          </p>

          <div className="pt-4">
            <button
              onClick={onStart}
              className="px-9 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-2 group"
            >
              <span>Start Free Advisor Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>BeemaSaathi — MIT School of Computing, CSE Department</span>
          </div>
          <p className="text-center sm:text-right">
            Independent educational advisory tool. Policy wordings and tariffs verified against IRDAI publications.
          </p>
        </div>
      </footer>

    </div>
  )
}
