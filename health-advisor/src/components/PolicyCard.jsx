import { useState } from "react"
import InsurerLogo from "./InsurerLogo"
import { getMarketContext } from "../data/premiumRates"
import Tooltip from "./Tooltip"

const RANK_CONFIG = [
  { label: "#1 Best Match", bg: "bg-gradient-to-r from-amber-400 to-amber-500", text: "text-amber-900", border: "border-amber-200" },
  { label: "#2",            bg: "bg-slate-100",   text: "text-slate-600",  border: "border-slate-200" },
  { label: "#3",            bg: "bg-orange-100",  text: "text-orange-700", border: "border-orange-200" },
  { label: "#4",            bg: "bg-slate-100",   text: "text-slate-500",  border: "border-slate-200" },
  { label: "#5",            bg: "bg-slate-100",   text: "text-slate-500",  border: "border-slate-200" },
]

function Pill({ yes, label }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold border ${
      yes
        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
        : "bg-slate-50 text-slate-300 border-slate-200/80"
    }`}>
      {yes ? "✓" : "✗"} {label}
    </span>
  )
}

function ScoreBar({ score }) {
  const color = score >= 65 ? "bg-emerald-500" : score >= 40 ? "bg-amber-400" : "bg-red-400"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }}/>
      </div>
      <span className={`text-xs font-bold tabular-nums ${
        score >= 65 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-red-500"
      }`}>{score}</span>
    </div>
  )
}

function MarketBenchmarkStrip({ annual, coverageLakhs }) {
  const ctx = getMarketContext(annual, coverageLakhs)
  const premCls = ctx.premiumColor === "green"  ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                : ctx.premiumColor === "orange" ? "bg-amber-50 border-amber-200/80 text-amber-700"
                :                                 "bg-red-50 border-red-200/80 text-red-700"
  const covCls  = ctx.coverageColor === "green"  ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                : ctx.coverageColor === "blue"   ? "bg-blue-50 border-blue-200/80 text-blue-700"
                :                                  "bg-amber-50 border-amber-200/80 text-amber-700"
  return (
    <div className="flex gap-2 mt-4">
      <div className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold ${premCls}`}>
        <span>💸</span><span>{ctx.premiumLabel}</span>
      </div>
      <div className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold ${covCls}`}>
        <span>🏥</span><span>{ctx.coverageLabel}</span>
      </div>
    </div>
  )
}

export default function PolicyCard({ ranked, rank, pr, onInspect, isShortlisted, onToggleShortlist, shortlistFull }) {
  const [open, setOpen] = useState(false)
  const { policy, score, reasons, warnings } = ranked
  const f = policy.features
  const rc = RANK_CONFIG[rank] || RANK_CONFIG[4]

  const csrColor = policy.csr >= 98 ? "text-emerald-600" : policy.csr >= 95 ? "text-emerald-500"
    : policy.csr >= 90 ? "text-blue-600" : policy.csr >= 85 ? "text-amber-600" : "text-red-500"
  const csrBg = policy.csr >= 95 ? "bg-emerald-50 border-emerald-100"
    : policy.csr >= 90 ? "bg-blue-50 border-blue-100"
    : policy.csr >= 85 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"

  return (
    <div className={`bg-white rounded-3xl border transition-all duration-200 hover:shadow-lg ${
      rank === 0 ? "border-blue-200 shadow-md shadow-blue-500/8" : "border-slate-200/80 shadow-sm"
    }`}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-0">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${rc.bg} ${rc.text}`}>
          {rc.label}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleShortlist}
            disabled={shortlistFull && !isShortlisted}
            aria-pressed={isShortlisted}
            title={shortlistFull && !isShortlisted ? "You can compare up to 3 plans" : "Add to shortlist"}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
              isShortlisted
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
            } disabled:cursor-not-allowed disabled:opacity-40`}>
            <span>{isShortlisted ? "★" : "☆"}</span>
            <span>{isShortlisted ? "Saved" : "Shortlist"}</span>
          </button>
          <span className="hidden md:flex text-[10px] text-slate-400 font-semibold items-center gap-1">
            Match Score <Tooltip term="Match Score" />
          </span>
          <ScoreBar score={score} />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 pt-4 pb-5">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <InsurerLogo provider={policy.provider} size="lg" />
            <div className="min-w-0">
              <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">{policy.name}</h3>
              <p className="text-slate-400 text-sm font-medium mt-0.5">{policy.provider}</p>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{policy.bestFor}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-black text-slate-900 tabular-nums">₹{pr.monthly.toLocaleString()}</div>
            <div className="text-slate-400 text-sm flex items-center justify-end gap-1">
              / month <Tooltip term="Premium" align="right" />
            </div>
            <div className="text-slate-300 text-xs mt-0.5">₹{pr.annual.toLocaleString()}/yr</div>
            <div className="mt-1.5 flex items-center justify-end gap-1">
              <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">
                Indicative · {policy.rateUpdated || "2024-25"}
              </span>
            </div>
          </div>
        </div>

        {/* 4 key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Coverage <Tooltip term="Sum Insured" />
            </div>
            <div className="text-xl font-black text-slate-900">₹{(policy.coverage/100000).toFixed(0)}L</div>
          </div>
          <div className={`rounded-xl p-3 text-center border ${
            policy.copay === 0 ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
          }`}>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Copay <Tooltip term="Copay" />
            </div>
            <div className={`text-xl font-black ${policy.copay === 0 ? "text-emerald-600" : "text-amber-600"}`}>
              {policy.copay === 0 ? "Zero" : `${policy.copay}%`}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Hospitals <Tooltip term="Network Hospital" />
            </div>
            <div className="text-xl font-black text-slate-900">{(f.hospitals/1000).toFixed(0)}K+</div>
          </div>
          <div className={`rounded-xl p-3 text-center border ${csrBg}`}>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Claims Paid <Tooltip term="CSR" />
            </div>
            <div className={`text-xl font-black ${csrColor}`}>{policy.csr}%</div>
            <div className="text-[9px] text-slate-400 mt-0.5">IRDAI verified</div>
          </div>
        </div>

        {/* Market context */}
        <MarketBenchmarkStrip annual={pr.annual} coverageLakhs={policy.coverage / 100000} />

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          <Pill yes={f.hospitalization} label="Hospitalisation" />
          <Pill yes={f.outpatient}      label={<span className="flex items-center gap-1">OPD <Tooltip term="OPD" /></span>} />
          <Pill yes={f.maternity}       label="Maternity" />
          <Pill yes={f.ped}             label={<span className="flex items-center gap-1">PED <Tooltip term="PED" /></span>} />
          <Pill yes={f.mental_health}   label="Mental Health" />
          <Pill yes={f.critical}        label={<span className="flex items-center gap-1">Critical Illness <Tooltip term="Critical Illness" /></span>} />
          <Pill yes={f.robotic}         label="Robotic Surgery" />
          <Pill yes={f.international}   label="International" />
          <Pill yes={f.ayush}           label={<span className="flex items-center gap-1">AYUSH <Tooltip term="AYUSH" /></span>} />
        </div>
      </div>

      {/* Expand toggle */}
      <div className="border-t border-slate-100">
        <button onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 sm:px-6 py-3.5 text-sm text-slate-500 hover:bg-slate-50/80 transition-colors font-semibold">
          <span>{open ? "Hide details" : "View pros, cons & why it suits you"}</span>
          <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {open && (
          <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-5 border-t border-slate-100 pt-5">

            {/* Plain-language key numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  No-Claim Bonus <Tooltip term="NCB" />
                </div>
                <div className="text-lg font-black text-slate-800">+{f.ncb}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">free cover boost / yr</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  Restore <Tooltip term="Restore" />
                </div>
                <div className="text-lg font-black text-slate-800 truncate">{policy.restore}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">cover refill</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  Room Rent <Tooltip term="Room Rent Limit" />
                </div>
                <div className="text-lg font-black text-slate-800 truncate">{policy.roomRent}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">per day limit</div>
              </div>
            </div>

            {/* Unique features */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Unique Features</p>
              <div className="flex flex-wrap gap-2">
                {policy.uniqueFeatures.map((u, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros / Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2.5">Pros</p>
                <ul className="space-y-2">
                  {policy.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2.5">Cons</p>
                <ul className="space-y-2">
                  {policy.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Why it suits / warnings */}
            {(reasons.length > 0 || warnings.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reasons.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Why it suits you</p>
                    <ul className="space-y-1.5">
                      {reasons.map((r, i) => (
                        <li key={i} className="text-xs text-emerald-700 flex gap-1.5 leading-relaxed">
                          <span className="flex-shrink-0 mt-0.5">→</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">Watch out for</p>
                    <ul className="space-y-1.5">
                      {warnings.map((w, i) => (
                        <li key={i} className="text-xs text-amber-700 flex gap-1.5 leading-relaxed">
                          <span className="flex-shrink-0 mt-0.5">⚠</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button onClick={onInspect}
              className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20">
              See Full Premium Breakdown →
            </button>

            {policy.quoteUrl && (
              <a
                href={policy.quoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 active:scale-[0.99] transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Get exact quote from {policy.provider} ↗
              </a>
            )}

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Prices shown are indicative from published rate cards ({policy.rateUpdated || "2024-25"}).
              Actual premium depends on your exact health declaration and city. Always verify on the insurer's website.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
