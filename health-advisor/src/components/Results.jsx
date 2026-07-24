import { useState } from "react"
import PolicyCard from "./PolicyCard"
import PremiumBreakdown from "./PremiumBreakdown"
import CompareTable from "./CompareTable"
import WhatIfSimulator from "./WhatIfSimulator"
import ClaimInsights from "./ClaimInsights"
import TaxCalculator from "./TaxCalculator"
import PremiumAgeChart from "./PremiumAgeChart"
import UpgradeChecker from "./UpgradeChecker"
import HospitalChecker from "./HospitalChecker"
import DiseaseChecker from "./DiseaseChecker"
import SumInsuredCalculator from "./SumInsuredCalculator"
import PortabilityGuide from "./PortabilityGuide"
import EmployerCoverChecker from "./EmployerCoverChecker"
import AIInsights from "./AIInsights"
import GlossaryModal from "./GlossaryModal"
import { generateQuotePDF } from "../utils/generateQuotePDF"
import InsurerLogo from "./InsurerLogo"
import { MARKET_BENCHMARKS } from "../data/premiumRates"

// ── Nav groups ────────────────────────────────────────────────
const NAV = [
  {
    group: "Your Results",
    items: [
      { id: 0,  icon: "🏆", label: "Top Picks",       desc: "Best plans for you"          },
      { id: 13, icon: "🤖", label: "AI Insights",     desc: "Smart analysis of your plans", badge: "New" },
      { id: 11, icon: "⚖️", label: "Compare All",     desc: "Side-by-side table"          },
    ],
  },
  {
    group: "Research Tools",
    items: [
      { id: 1,  icon: "🏥", label: "Hospital Finder",   desc: "Find cashless hospitals",  badge: "Map" },
      { id: 2,  icon: "��", label: "Disease Coverage",  desc: "What's covered per plan",  badge: "31 diseases" },
    ],
  },
  {
    group: "Your Numbers",
    items: [
      { id: 3,  icon: "🛡️", label: "Cover Check",       desc: "Is your sum insured enough?" },
      { id: 5,  icon: "🎛️", label: "What-If Simulator", desc: "Change age, BMI, members"    },
      { id: 6,  icon: "💰", label: "Premium Breakdown",  desc: "How your price is calculated" },
      { id: 8,  icon: "🧾", label: "Tax Savings",        desc: "Section 80D calculator"      },
      { id: 9,  icon: "📈", label: "Age & Inflation",    desc: "Cost of waiting + inflation"  },
    ],
  },
  {
    group: "Decisions",
    items: [
      { id: 4,  icon: "🔀", label: "Portability Guide",    desc: "Switch without losing benefits" },
      { id: 10, icon: "🔄", label: "Upgrade Check",        desc: "Compare vs your current plan"   },
      { id: 7,  icon: "📊", label: "Claim Insights",       desc: "Will they pay your claim?"       },
      { id: 12, icon: "💼", label: "Employer Cover Check", desc: "Is your work policy enough?"     },
    ],
  },
]

const SEG_LABEL = {
  student: "Student", young_professional: "Young Professional",
  couple: "Couple", family: "Family", senior: "Senior Citizen",
}

const PRIORITY_BADGE = {
  claims:   { label: "Ranked by claim reliability", cls: "bg-blue-100 text-blue-700",       icon: "🛡️" },
  price:    { label: "Ranked by lowest price",       cls: "bg-emerald-100 text-emerald-700", icon: "💰" },
  coverage: { label: "Ranked by coverage",           cls: "bg-purple-100 text-purple-700",   icon: "📋" },
}

export default function Results({ results, onReset, mode }) {
  const [tab,          setTab]          = useState(0)
  const [selPolicy,    setSelPolicy]    = useState(results.ranked[0].policy.id)
  const [pdfLoading,   setPdfLoading]   = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false) // mobile sidebar

  const { ranked, premiumMap, profile } = results
  const best   = ranked[0]
  const bestPr = premiumMap[best.policy.id]
  const pb     = PRIORITY_BADGE[profile.priority] || PRIORITY_BADGE.claims

  async function handleDownloadPDF() {
    setPdfLoading(true)
    try { generateQuotePDF(results) }
    finally { setTimeout(() => setPdfLoading(false), 1000) }
  }

  function goTab(id) { setTab(id); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }) }

  // current nav item meta
  const allItems = NAV.flatMap(g => g.items)
  const current  = allItems.find(i => i.id === tab) || allItems[0]

  return (
    <>
    <div className="bg-slate-100 min-h-screen">

      {/* ── Compact top bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4" style={{ height: 52 }}>

          {/* Left: profile summary */}
          <div className="flex items-center gap-3 min-w-0">
            {/* mobile menu toggle */}
            <button onClick={() => setSidebarOpen(o => !o)}
              className="lg:hidden flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Results for</span>
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold px-2 py-0.5 rounded-full">
                {SEG_LABEL[profile.segment]}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-600 font-medium">{profile.age} yrs · {profile.city}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${pb.cls}`}>
                {pb.icon} {pb.label}
              </span>
            </div>
            {/* mobile: just current tab name */}
            <span className="sm:hidden text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>{current.icon}</span>{current.label}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowGlossary(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all">
              📖 Glossary
            </button>
            <button onClick={onReset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all">
              ← Start Over
            </button>
            <button onClick={handleDownloadPDF} disabled={pdfLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 transition-all shadow-sm shadow-blue-600/20">
              {pdfLoading
                ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              }
              <span className="hidden sm:inline">{pdfLoading ? "Generating…" : "Download PDF"}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex gap-6 items-start">

          {/* ── Sidebar nav ── */}
          <>
            {/* mobile overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
                onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`
              fixed lg:sticky top-[112px] left-0 z-50 lg:z-auto
              w-64 lg:w-56 xl:w-64 flex-shrink-0
              bg-white border border-slate-200 rounded-2xl shadow-xl lg:shadow-sm
              overflow-y-auto transition-transform duration-300 ease-out
              ${sidebarOpen ? "translate-x-4" : "-translate-x-full lg:translate-x-0"}
              lg:max-h-[calc(100vh-130px)]
            `} style={{ maxHeight: "calc(100vh - 130px)" }}>
              <div className="p-3">

                {/* Best match mini card */}
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1">Best Match</p>
                  <div className="flex items-center gap-2">
                    <InsurerLogo provider={best.policy.provider} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-black leading-tight truncate">{best.policy.name}</p>
                      <p className="text-[10px] text-blue-200">₹{bestPr.monthly.toLocaleString()}/mo · Score {best.score}</p>
                    </div>
                  </div>
                </div>

                {/* Nav groups */}
                {NAV.map(group => (
                  <div key={group.group} className="mb-4">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                      {group.group}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map(item => (
                        <button key={item.id} onClick={() => goTab(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                            tab === item.id
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}>
                          <span className="text-base flex-shrink-0">{item.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-bold leading-none truncate ${tab === item.id ? "text-white" : "text-slate-800"}`}>
                              {item.label}
                            </p>
                            <p className={`text-[10px] mt-0.5 leading-none truncate ${tab === item.id ? "text-blue-200" : "text-slate-400"}`}>
                              {item.desc}
                            </p>
                          </div>
                          {item.badge && tab !== item.id && (
                            <span className="flex-shrink-0 text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quick actions */}
                <div className="border-t border-slate-100 pt-3 space-y-1 mt-1">
                  <button onClick={() => setShowGlossary(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
                    <span className="text-base">📖</span>
                    <span className="text-xs font-semibold">Insurance Glossary</span>
                  </button>
                  <button onClick={onReset}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
                    <span className="text-base">↩️</span>
                    <span className="text-xs font-semibold">Start Over</span>
                  </button>
                </div>
              </div>
            </aside>
          </>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Page title breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{current.icon}</span>
              <div>
                <h1 className="text-xl font-black text-slate-900">{current.label}</h1>
                <p className="text-xs text-slate-400">{current.desc}</p>
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
              {tab === 0 && (
                <div className="space-y-4">
                  {/* Mini hero strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl text-white mb-2"
                    style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <InsurerLogo provider={best.policy.provider} size="lg" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">🏆 Best Match</p>
                        <p className="text-lg font-black leading-tight truncate">{best.policy.name}</p>
                        <p className="text-blue-200 text-xs">{best.policy.provider}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-2xl sm:text-3xl font-black">₹{bestPr.monthly.toLocaleString()}</p>
                      <p className="text-blue-200 text-xs">/month · Score {best.score}/100</p>
                    </div>
                  </div>

                  {/* Quick legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { icon: "💰", label: "Monthly cost",    desc: "What you pay/month" },
                      { icon: "🏥", label: "Coverage",        desc: "Max insurer pays"   },
                      { icon: "✂️", label: "Copay",           desc: "% you pay (0 = best)" },
                      { icon: "🛡️", label: "Claims Paid %",   desc: "IRDAI-verified reliability" },
                    ].map(g => (
                      <div key={g.label} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">{g.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{g.label}</p>
                          <p className="text-[10px] text-slate-400 leading-snug">{g.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cards */}
                  {ranked.slice(0, 5).map((r, i) => (
                    <div key={r.policy.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <PolicyCard ranked={r} rank={i} pr={premiumMap[r.policy.id]}
                        onInspect={() => { setSelPolicy(r.policy.id); goTab(6) }} />
                    </div>
                  ))}

                  {/* CTA: explore other tools */}
                  <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-sm font-bold text-slate-700 mb-3">🔍 Explore more tools</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 13, label: "🤖 AI Insights" },
                        { id: 1,  label: "🏥 Hospital Finder" },
                        { id: 2,  label: "🦠 Disease Coverage" },
                        { id: 3,  label: "🛡️ Is my cover enough?" },
                        { id: 7,  label: "📊 Claim Reliability" },
                        { id: 8,  label: "🧾 Tax Savings" },
                        { id: 4,  label: "🔀 Portability Guide" },
                        { id: 12, label: "💼 Employer Cover Check" },
                      ].map(t => (
                        <button key={t.id} onClick={() => goTab(t.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all">
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 1  && <HospitalChecker profile={profile} ranked={ranked} />}
              {tab === 2  && <DiseaseChecker profile={profile} ranked={ranked} />}
              {tab === 3  && <SumInsuredCalculator profile={profile} />}
              {tab === 4  && <PortabilityGuide ranked={ranked} profile={profile} />}
              {tab === 5  && <WhatIfSimulator profile={profile} ranked={ranked} premiumMap={premiumMap} />}
              {tab === 6  && <PremiumBreakdown ranked={ranked} premiumMap={premiumMap} selectedId={selPolicy} onSelect={setSelPolicy} />}
              {tab === 7  && <ClaimInsights ranked={ranked} profile={profile} />}
              {tab === 8  && <TaxCalculator profile={profile} premiumMap={premiumMap} ranked={ranked} />}
              {tab === 9  && <PremiumAgeChart ranked={ranked} profile={profile} premiumMap={premiumMap} />}
              {tab === 10 && <UpgradeChecker ranked={ranked} profile={profile} premiumMap={premiumMap} />}
              {tab === 11 && <CompareTable ranked={ranked} premiumMap={premiumMap} mode={mode} profile={profile} />}
              {tab === 12 && <EmployerCoverChecker profile={profile} ranked={ranked} premiumMap={premiumMap} />}
              {tab === 13 && <AIInsights profile={profile} ranked={ranked} premiumMap={premiumMap} />}
            </div>

            {/* ── IRDAI source note ── */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-2.5">
              <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <p className="text-xs text-emerald-800 flex-1">
                Claims Paid % from <strong>IRDAI Handbook of Indian Insurance Statistics</strong> — FY 2023-24 &amp; 2024-25 average.
              </p>
              <a href="https://irdai.gov.in/web/guest/publications" target="_blank" rel="noopener noreferrer"
                className="text-xs text-emerald-700 font-semibold hover:underline flex-shrink-0">View source ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showGlossary && <GlossaryModal onClose={() => setShowGlossary(false)} />}
    </>
  )
}
