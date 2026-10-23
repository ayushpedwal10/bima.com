import { useState } from "react"
import InsurerLogo from "./InsurerLogo"
import { getMarketContext } from "../data/premiumRates"
import Tooltip from "./Tooltip"
import {
  Star, Bookmark, ChevronDown, Check, X,
  ExternalLink, Shield, Building, Award, ArrowRight, AlertTriangle, Sparkles
} from "lucide-react"

const RANK_CONFIG = [
  { label: "#1 Best Match", bg: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs", isHero: true },
  { label: "#2 Recommended", bg: "bg-slate-100 text-slate-700 border border-slate-200" },
  { label: "#3 Contender", bg: "bg-slate-100 text-slate-700 border border-slate-200" },
  { label: "#4 Alternate", bg: "bg-slate-100 text-slate-600 border border-slate-200" },
  { label: "#5 Alternate", bg: "bg-slate-100 text-slate-600 border border-slate-200" },
]

function Pill({ yes, label }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold border ${
      yes
        ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
        : "bg-slate-50 text-slate-400 border-slate-200/60"
    }`}>
      {yes ? <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> : <X className="w-3 h-3 text-slate-300 stroke-[2]" />}
      <span>{label}</span>
    </span>
  )
}

function ScoreBar({ score }) {
  const color = score >= 65 ? "bg-emerald-600" : score >= 40 ? "bg-amber-500" : "bg-rose-500"
  const textColor = score >= 65 ? "text-emerald-700" : score >= 40 ? "text-amber-700" : "text-rose-700"

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-black tabular-nums ${textColor}`}>
        {score}/100
      </span>
    </div>
  )
}

function MarketBenchmarkStrip({ annual, coverageLakhs }) {
  const ctx = getMarketContext(annual, coverageLakhs)
  const premCls = ctx.premiumColor === "green" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : ctx.premiumColor === "orange" ? "bg-amber-50 border-amber-200 text-amber-800"
    : "bg-rose-50 border-rose-200 text-rose-800"

  const covCls = ctx.coverageColor === "green" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : ctx.coverageColor === "blue" ? "bg-blue-50 border-blue-200 text-blue-800"
    : "bg-amber-50 border-amber-200 text-amber-800"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-semibold ${premCls}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>{ctx.premiumLabel}</span>
      </div>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-semibold ${covCls}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>{ctx.coverageLabel}</span>
      </div>
    </div>
  )
}

export default function PolicyCard({ ranked, rank, pr, onInspect, isShortlisted, onToggleShortlist, shortlistFull }) {
  const [open, setOpen] = useState(false)
  const { policy, score, reasons, warnings } = ranked
  const f = policy.features
  const rc = RANK_CONFIG[rank] || RANK_CONFIG[4]

  const csrColor = policy.csr >= 98 ? "text-emerald-700" : policy.csr >= 95 ? "text-emerald-600"
    : policy.csr >= 90 ? "text-blue-700" : policy.csr >= 85 ? "text-amber-700" : "text-rose-700"

  const csrBg = policy.csr >= 95 ? "bg-emerald-50 border-emerald-200"
    : policy.csr >= 90 ? "bg-blue-50 border-blue-200"
    : policy.csr >= 85 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200"

  return (
    <div className={`bg-white rounded-3xl border transition-all duration-300 hover-lift ${
      rank === 0
        ? "border-blue-300 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20"
        : "border-slate-200/90 shadow-2xs hover:border-slate-300"
    }`}>

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black px-3 py-1 rounded-full ${rc.bg}`}>
            {rc.label}
          </span>
          {rank === 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Highest Recommendation Score
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
            Actuarial Fit
          </span>
          <ScoreBar score={score} />
        </div>
      </div>

      {/* Main Body */}
      <div className="px-5 sm:px-7 pt-4 pb-5">
        
        {/* Insurer Name & Pricing Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <InsurerLogo provider={policy.provider} size="lg" />
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight tracking-tight">
                {policy.name}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-0.5">
                {policy.provider}
              </p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {policy.bestFor}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right flex-shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/80">
            <div className="flex sm:block items-baseline gap-2">
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
                ₹{pr.monthly.toLocaleString()}
              </div>
              <span className="text-slate-500 text-xs font-semibold">/ month</span>
            </div>
            <div className="text-slate-400 text-xs font-medium mt-0.5">
              ₹{pr.annual.toLocaleString()}/year (incl. 18% GST)
            </div>
            <div className="mt-1 flex items-center sm:justify-end gap-1">
              <span className="text-[9px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                IRDAI Tariff {policy.rateUpdated || "2024-25"}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Core Quantitative Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Sum Insured */}
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-200/80">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Sum Insured <Tooltip term="Sum Insured" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-950">
              ₹{(policy.coverage / 100000).toFixed(0)} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Annual Cover</div>
          </div>

          {/* Co-pay */}
          <div className={`rounded-2xl p-3 text-center border ${
            policy.copay === 0 ? "bg-emerald-50/70 border-emerald-200" : "bg-amber-50/70 border-amber-200"
          }`}>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Co-Pay <Tooltip term="Copay" />
            </div>
            <div className={`text-lg sm:text-xl font-black ${policy.copay === 0 ? "text-emerald-700" : "text-amber-700"}`}>
              {policy.copay === 0 ? "0% (Zero)" : `${policy.copay}%`}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              {policy.copay === 0 ? "100% Insurer Paid" : "Out-of-Pocket Share"}
            </div>
          </div>

          {/* Cashless Hospitals */}
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-200/80">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Network <Tooltip term="Network Hospital" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-950">
              {(f.hospitals / 1000).toFixed(0)}K+ Beds
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Cashless Everywhere</div>
          </div>

          {/* IRDAI CSR */}
          <div className={`rounded-2xl p-3 text-center border ${csrBg}`}>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Claim Settlement <Tooltip term="CSR" />
            </div>
            <div className={`text-lg sm:text-xl font-black ${csrColor}`}>
              {policy.csr}%
            </div>
            <div className="text-[9px] text-slate-500 font-medium mt-0.5">IRDAI Verified</div>
          </div>
        </div>

        {/* Shortlist Action Button */}
        <button
          type="button"
          onClick={onToggleShortlist}
          disabled={shortlistFull && !isShortlisted}
          aria-pressed={isShortlisted}
          className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
            isShortlisted
              ? "border-blue-300 bg-blue-50 text-blue-700 shadow-2xs"
              : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? "fill-blue-600 text-blue-600" : ""}`} />
          <span>{isShortlisted ? "Saved to Comparison Shortlist" : shortlistFull ? "Shortlist Full (Max 3 Plans)" : "Add to Comparison Shortlist"}</span>
        </button>

        {/* Market Benchmark Strip */}
        <MarketBenchmarkStrip annual={pr.annual} coverageLakhs={policy.coverage / 100000} />

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          <Pill yes={f.hospitalization} label="Hospitalisation" />
          <Pill yes={f.outpatient} label="OPD & Pharmacy" />
          <Pill yes={f.maternity} label="Maternity & Newborn" />
          <Pill yes={f.ped} label="Pre-Existing Day 1" />
          <Pill yes={f.mental_health} label="Mental Health Inpatient" />
          <Pill yes={f.critical} label="Critical Illness" />
          <Pill yes={f.robotic} label="Robotic Surgery" />
          <Pill yes={f.international} label="International Cover" />
          <Pill yes={f.ayush} label="AYUSH Treatments" />
        </div>

      </div>

      {/* Expand / Collapse Section */}
      <div className="border-t border-slate-100">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-5 sm:px-7 py-3.5 text-xs text-slate-500 hover:bg-slate-50 transition-colors font-bold"
        >
          <span>{open ? "Hide Actuarial Policy Details" : "View Actuarial Fine-Print, Pros & Cons"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="px-5 sm:px-7 pb-6 space-y-5 border-t border-slate-100 pt-5 bg-slate-50/40">

            {/* Plain-Language Key Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 text-center shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  No-Claim Bonus (NCB) <Tooltip term="NCB" />
                </div>
                <div className="text-lg font-black text-slate-900">+{f.ncb}% / yr</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Annual cover increment</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 text-center shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  Sum Insured Restore <Tooltip term="Restore" />
                </div>
                <div className="text-lg font-black text-slate-900 truncate">{policy.restore}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Automatic refill for unrelated events</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 text-center shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  Room Rent Ceiling <Tooltip term="Room Rent Limit" />
                </div>
                <div className="text-lg font-black text-slate-900 truncate">{policy.roomRent}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Daily ICU / Private room limit</div>
              </div>
            </div>

            {/* Unique Plan Features */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Underwriter Unique Features
              </p>
              <div className="flex flex-wrap gap-2">
                {policy.uniqueFeatures.map((u, i) => (
                  <span key={i} className="text-xs bg-white text-blue-800 border border-blue-200 px-3 py-1 rounded-full font-semibold shadow-2xs">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2.5">
                  Plan Strengths
                </p>
                <ul className="space-y-2">
                  {policy.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5] flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-2.5">
                  Plan Limitations / Exclusions
                </p>
                <ul className="space-y-2">
                  {policy.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <X className="w-3.5 h-3.5 text-rose-500 stroke-[2.5] flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actuarial Suitability & Warning Notes */}
            {(reasons.length > 0 || warnings.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reasons.length > 0 && (
                  <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-2xs">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2">
                      Why This Suits Your Profile
                    </p>
                    <ul className="space-y-1.5">
                      {reasons.map((r, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {warnings.length > 0 && (
                  <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2">
                      Important Conditions to Note
                    </p>
                    <ul className="space-y-1.5">
                      {warnings.map((w, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Actuarial Breakdown CTA */}
            <button
              type="button"
              onClick={onInspect}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-blue-600/20"
            >
              Inspect Actuarial Calculation & GST Breakdown →
            </button>

            {/* Official Underwriter Direct Portal Link */}
            {policy.quoteUrl && (
              <a
                href={policy.quoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-2xs"
              >
                <span>Verify & Get Policy Directly on {policy.provider}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Premiums are derived from published underwriter rate cards filed with IRDAI ({policy.rateUpdated || "2024-25"}).
              Final issued premium is subject to tele-medical underwriting or health declarations at insurer portal.
            </p>

          </div>
        )}
      </div>

    </div>
  )
}
