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
import {
  Trophy, Bot, Scale, Building, ShieldAlert, SlidersHorizontal,
  Calculator, Receipt, TrendingUp, GitCompare, FileCheck, Briefcase,
  Download, BookOpen, RotateCcw, Menu, X, ExternalLink, ShieldCheck, Sparkles, Check
} from "lucide-react"

// ── Nav groups ────────────────────────────────────────────────
const NAV = [
  {
    group: "Your Results",
    items: [
      { id: 0,  icon: Trophy, label: "Top Picks",       desc: "Ranked actuarial recommendations" },
      { id: 13, icon: Bot,    label: "AI Insights",     desc: "Smart multi-angle analysis", badge: "AI" },
      { id: 11, icon: Scale,  label: "Compare Matrix",  desc: "Side-by-side policy audit" },
    ],
  },
  {
    group: "Network & Medical",
    items: [
      { id: 1,  icon: Building,    label: "Hospital Finder",  desc: "Cashless geo-map & filters", badge: "Map" },
      { id: 2,  icon: ShieldAlert, label: "Disease Matrix",   desc: "31 conditions coverage table", badge: "31 Diseases" },
    ],
  },
  {
    group: "Actuarial Tools",
    items: [
      { id: 3,  icon: Calculator,        label: "Cover Audit",        desc: "Recommended Sum Insured check" },
      { id: 5,  icon: SlidersHorizontal, label: "What-If Simulator",  desc: "Adjust age, BMI, smokers live" },
      { id: 6,  icon: Receipt,           label: "Rate Breakdown",     desc: "Base premium, loading & GST" },
      { id: 8,  icon: FileCheck,         label: "Tax Savings (80D)",  desc: "Income tax deduction estimator" },
      { id: 9,  icon: TrendingUp,        label: "Age & Inflation",    desc: "Long-term cost of waiting" },
    ],
  },
  {
    group: "Transitions & Audit",
    items: [
      { id: 4,  icon: GitCompare, label: "Portability Guide",    desc: "Switch insurers without waiting" },
      { id: 10, icon: RotateCcw,  label: "Upgrade Check",        desc: "Audit vs your current plan" },
      { id: 7,  icon: ShieldCheck,label: "Claim Insights",       desc: "IRDAI repudiation & CSR stats" },
      { id: 12, icon: Briefcase,  label: "Employer Cover Check", desc: "Corporate vs retail gap analysis" },
    ],
  },
]

const SEG_LABEL = {
  student: "Student", young_professional: "Young Professional",
  couple: "Couple", family: "Family", senior: "Senior Citizen",
}

const PRIORITY_BADGE = {
  claims:   { label: "Prioritized: Claim Settlement Ratio", cls: "bg-blue-50 text-blue-800 border-blue-200" },
  price:    { label: "Prioritized: Lowest Annual Cost",     cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  coverage: { label: "Prioritized: Maximum Coverage",       cls: "bg-purple-50 text-purple-800 border-purple-200" },
}

export default function Results({ results, onReset, mode, onOpenCopilot }) {
  const [tab, setTab] = useState(0)
  const [selPolicy, setSelPolicy] = useState(results.ranked[0].policy.id)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shortlistIds, setShortlistIds] = useState([])
  const [compareShortlist, setCompareShortlist] = useState(false)

  const { ranked, premiumMap, profile } = results
  const best = ranked[0]
  const bestPr = premiumMap[best.policy.id]
  const pb = PRIORITY_BADGE[profile.priority] || PRIORITY_BADGE.claims
  const shortlisted = ranked.filter(item => shortlistIds.includes(item.policy.id))

  function toggleShortlist(policyId) {
    setShortlistIds(current => {
      if (current.includes(policyId)) return current.filter(id => id !== policyId)
      return current.length < 3 ? [...current, policyId] : current
    })
  }

  async function handleDownloadPDF() {
    setPdfLoading(true)
    try {
      generateQuotePDF(results)
    } finally {
      setTimeout(() => setPdfLoading(false), 1000)
    }
  }

  function goTab(id) {
    setTab(id)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const allItems = NAV.flatMap(g => g.items)
  const current = allItems.find(i => i.id === tab) || allItems[0]
  const CurrentIcon = current.icon

  return (
    <>
      <div className="bg-slate-50 min-h-screen pb-16">

        {/* ─── Institutional Action Bar ─── */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-16 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

            {/* Left: Client Profile Tags */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(o => !o)}
                className="lg:hidden w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Toggle navigation drawer"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">Results for:</span>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-0.5 rounded-full">
                  {SEG_LABEL[profile.segment]}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-700 font-bold">
                  {profile.age} yrs · {profile.city} · {profile.members} Member{profile.members > 1 ? "s" : ""}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${pb.cls}`}>
                  {pb.label}
                </span>
              </div>

              {/* Mobile View Title */}
              <div className="sm:hidden flex items-center gap-2 text-xs font-extrabold text-slate-900 truncate">
                <CurrentIcon className="w-4 h-4 text-blue-600" />
                <span className="truncate">{current.label}</span>
              </div>
            </div>

            {/* Right: Quick Tools & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {onOpenCopilot && (
                <button
                  type="button"
                  onClick={onOpenCopilot}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden md:inline">Ask</span> Copilot
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowGlossary(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Glossary</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Adjust Inputs</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-60 transition-all shadow-sm shadow-blue-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{pdfLoading ? "Generating PDF…" : "Download Report"}</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>

          </div>
        </div>

        {/* ─── Main Content Container ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-6 items-start">

            {/* ─── Sidebar Navigation Drawer ─── */}
            <>
              {/* Mobile Backdrop */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              <aside className={`
                fixed lg:sticky top-[128px] left-0 z-50 lg:z-auto
                w-64 lg:w-60 xl:w-64 flex-shrink-0
                bg-white border border-slate-200/90 rounded-2xl shadow-xl lg:shadow-xs
                overflow-y-auto transition-transform duration-200 ease-out
                ${sidebarOpen ? "translate-x-4" : "-translate-x-full lg:translate-x-0"}
                max-h-[calc(100vh-148px)]
              `}>
                <div className="p-3">

                  {/* Best Match Miniature Spotlight */}
                  <div className="mb-4 p-3.5 rounded-xl bg-slate-900 text-white shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Top Recommendation
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Score {best.score}/100</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <InsurerLogo provider={best.policy.provider} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold leading-tight text-white truncate">
                          {best.policy.name}
                        </p>
                        <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                          ₹{bestPr.monthly.toLocaleString()}/mo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Groups */}
                  {NAV.map(group => (
                    <div key={group.group} className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                        {group.group}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map(item => {
                          const Icon = item.icon
                          const isActive = tab === item.id
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (item.id === 11) setCompareShortlist(false)
                                goTab(item.id)
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                                isActive
                                  ? "bg-blue-600 text-white font-bold shadow-xs shadow-blue-600/30"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-medium"
                              }`}
                            >
                              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs leading-tight truncate">
                                  {item.label}
                                </p>
                              </div>
                              {item.badge && !isActive && (
                                <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-200/60">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Quick Utility Links */}
                  <div className="border-t border-slate-100 pt-3 space-y-1 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowGlossary(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-xs font-semibold"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>IRDAI Terminology</span>
                    </button>
                    <button
                      type="button"
                      onClick={onReset}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Start Over / New Quote</span>
                    </button>
                  </div>

                </div>
              </aside>
            </>

            {/* ─── Main Content Area ─── */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Tab Header Breadcrumb Banner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <CurrentIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                      {current.label}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      {current.desc}
                    </p>
                  </div>
                </div>

                {tab === 0 && (
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
                    {ranked.length} IRDAI Registered Plans Analyzed
                  </span>
                )}
              </div>

              {/* Tab 0: Top Picks Hero & Cards */}
              {tab === 0 && (
                <div className="space-y-5">

                  {/* Executive Hero Match Banner */}
                  <div className="rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-md shadow-blue-950/10"
                    style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
                  >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <InsurerLogo provider={best.policy.provider} size="lg" />
                        <div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider mb-2">
                            <Trophy className="w-3 h-3 fill-amber-950" />
                            <span>#1 Actuarial Match</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                            {best.policy.name}
                          </h2>
                          <p className="text-blue-200 text-xs sm:text-sm font-medium mt-0.5">
                            Underwritten by {best.policy.provider}
                          </p>
                          <p className="text-slate-300 text-xs mt-2 max-w-xl leading-relaxed">
                            {best.policy.bestFor}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-700/60 pt-4 md:pt-0">
                        <div>
                          <div className="text-3xl sm:text-4xl font-black tabular-nums">
                            ₹{bestPr.monthly.toLocaleString()}
                          </div>
                          <span className="text-blue-200 text-xs block text-right">
                            / month · ₹{bestPr.annual.toLocaleString()}/yr
                          </span>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {best.policy.csr}% IRDAI CSR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shortlist Comparison Tray */}
                  {shortlisted.length > 0 && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-blue-950">
                            Comparison Shortlist ({shortlisted.length}/3 plans saved)
                          </p>
                          <p className="text-xs text-blue-700/80 mt-0.5">
                            Audit feature nuances side-by-side in the comparison matrix.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => { setCompareShortlist(true); goTab(11) }}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/20"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Compare Shortlisted Plans →</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {shortlisted.map(item => (
                          <button
                            key={item.policy.id}
                            onClick={() => toggleShortlist(item.policy.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:border-red-200 hover:text-red-600 transition-colors shadow-2xs"
                          >
                            <span>{item.policy.name}</span>
                            <X className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Policy Cards List */}
                  {ranked.slice(0, 5).map((r, i) => (
                    <div key={r.policy.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <PolicyCard
                        ranked={r}
                        rank={i}
                        pr={premiumMap[r.policy.id]}
                        onInspect={() => { setSelPolicy(r.policy.id); goTab(6) }}
                        isShortlisted={shortlistIds.includes(r.policy.id)}
                        onToggleShortlist={() => toggleShortlist(r.policy.id)}
                        shortlistFull={shortlistIds.length >= 3}
                      />
                    </div>
                  ))}

                  {/* Explore Toolkit Footer Banner */}
                  <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Deep-Dive Actuarial Intelligence Tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 13, label: "AI Insights Analysis", icon: Bot },
                        { id: 1,  label: "Cashless Hospital Map", icon: Building },
                        { id: 2,  label: "31-Disease Coverage Table", icon: ShieldAlert },
                        { id: 3,  label: "Sum Insured Calculator", icon: Calculator },
                        { id: 5,  label: "Live What-If Simulator", icon: SlidersHorizontal },
                        { id: 7,  label: "IRDAI Claim Reliability", icon: ShieldCheck },
                        { id: 8,  label: "Section 80D Tax Savings", icon: FileCheck },
                        { id: 4,  label: "Policy Portability Guide", icon: GitCompare },
                        { id: 12, label: "Employer Cover Audit", icon: Briefcase },
                      ].map(t => {
                        const Icon = t.icon
                        return (
                          <button
                            key={t.id}
                            onClick={() => goTab(t.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all shadow-2xs"
                          >
                            <Icon className="w-3.5 h-3.5 text-blue-600" />
                            <span>{t.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Other Tool Viewports */}
              {tab !== 0 && (
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
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
                  {tab === 11 && (
                    <CompareTable
                      ranked={compareShortlist && shortlisted.length ? shortlisted : ranked}
                      premiumMap={premiumMap}
                      mode={mode}
                      profile={profile}
                      comparisonLabel={compareShortlist && shortlisted.length ? "Shortlisted" : "All"}
                    />
                  )}
                  {tab === 12 && <EmployerCoverChecker profile={profile} ranked={ranked} premiumMap={premiumMap} />}
                  {tab === 13 && <AIInsights profile={profile} ranked={ranked} premiumMap={premiumMap} onOpenCopilot={onOpenCopilot} />}
                </div>
              )}

              {/* Statutory Regulatory Citation Banner */}
              <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl px-4 py-3 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-900 leading-relaxed flex-1">
                  Claim Settlement Ratios (CSR) and repudiation statistics are derived directly from the <strong>IRDAI Annual Handbook of Indian Insurance Statistics</strong> (FY 2023-24 &amp; FY 2024-25 audit filings).
                </p>
                <a
                  href="https://irdai.gov.in/web/guest/publications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 flex-shrink-0"
                >
                  <span>IRDAI Reports</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>

      {showGlossary && <GlossaryModal onClose={() => setShowGlossary(false)} />}
    </>
  )
}
