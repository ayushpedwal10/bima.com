import { useState, useMemo } from "react"
import { generateInsights } from "../engine/aiInsights"
import InsurerLogo from "./InsurerLogo"

const TYPE_STYLE = {
  verdict:    { bg: "bg-blue-600",    text: "text-white",         border: "border-blue-700",    badge: "bg-blue-500/60 text-white",        headerBg: "bg-blue-600" },
  warning:    { bg: "bg-white",       text: "text-slate-900",     border: "border-red-200",     badge: "bg-red-100 text-red-700",           headerBg: "bg-red-50"   },
  good:       { bg: "bg-white",       text: "text-slate-900",     border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700",   headerBg: "bg-emerald-50"},
  money:      { bg: "bg-white",       text: "text-slate-900",     border: "border-amber-200",   badge: "bg-amber-100 text-amber-700",       headerBg: "bg-amber-50" },
  comparison: { bg: "bg-white",       text: "text-slate-900",     border: "border-indigo-200",  badge: "bg-indigo-100 text-indigo-700",     headerBg: "bg-indigo-50"},
  blindspot:  { bg: "bg-white",       text: "text-slate-900",     border: "border-purple-200",  badge: "bg-purple-100 text-purple-700",     headerBg: "bg-purple-50"},
  local:      { bg: "bg-white",       text: "text-slate-900",     border: "border-teal-200",    badge: "bg-teal-100 text-teal-700",         headerBg: "bg-teal-50"  },
  action:     { bg: "bg-white",       text: "text-slate-900",     border: "border-emerald-300", badge: "bg-emerald-100 text-emerald-800",   headerBg: "bg-emerald-50"},
}

function VsCard({ vsData }) {
  if (!vsData) return null
  const { left, right } = vsData
  const rows = [
    { label: "Score",     l: `${left.score}/100`,          r: `${right.score}/100`,          lWins: left.score >= right.score },
    { label: "Monthly",   l: `Rs.${left.monthly.toLocaleString()}`,  r: `Rs.${right.monthly.toLocaleString()}`, lWins: left.monthly <= right.monthly },
    { label: "Claims Paid",l: `${left.csr}%`,               r: `${right.csr}%`,               lWins: left.csr >= right.csr },
    { label: "Coverage",  l: `Rs.${(left.coverage/100000).toFixed(0)}L`, r: `Rs.${(right.coverage/100000).toFixed(0)}L`, lWins: left.coverage >= right.coverage },
  ]
  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-indigo-100">
      <div className="grid grid-cols-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest">
        <div className="px-3 py-2 truncate">{left.name.split(" ").slice(0,2).join(" ")}</div>
        <div className="px-3 py-2 text-center opacity-70">vs</div>
        <div className="px-3 py-2 text-right truncate">{right.name.split(" ").slice(0,2).join(" ")}</div>
      </div>
      {rows.map(row => (
        <div key={row.label} className="grid grid-cols-3 border-t border-indigo-100 bg-white text-xs">
          <div className={`px-3 py-2 font-bold ${row.lWins ? "text-emerald-700" : "text-slate-500"}`}>{row.l}</div>
          <div className="px-3 py-2 text-center text-slate-400 text-[10px] self-center">{row.label}</div>
          <div className={`px-3 py-2 text-right font-bold ${!row.lWins ? "text-emerald-700" : "text-slate-500"}`}>{row.r}</div>
        </div>
      ))}
    </div>
  )
}

function InsightCard({ card, rank, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const s = TYPE_STYLE[card.type] || TYPE_STYLE.action
  const isVerdict = card.type === "verdict"

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
      isVerdict ? "border-blue-600 shadow-lg shadow-blue-600/15" : `${s.border} hover:shadow-md`
    }`}>
      {/* Clickable header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full text-left transition-colors ${isVerdict ? "bg-blue-600 hover:bg-blue-700" : `${s.headerBg} hover:brightness-95`}`}
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <span className="text-xl flex-shrink-0 mt-0.5">{card.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${s.badge}`}>
                {card.label}
              </span>
              {isVerdict && card.score && (
                <span className="text-[9px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Score {card.score}/100
                </span>
              )}
            </div>
            <p className={`text-sm font-black leading-snug ${isVerdict ? "text-white" : "text-slate-900"}`}>
              {card.headline}
            </p>
            <p className={`text-[11px] mt-0.5 ${isVerdict ? "text-blue-100" : "text-slate-400"}`}>
              {card.subline}
            </p>
          </div>
          <svg
            className={`w-4 h-4 flex-shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""} ${isVerdict ? "text-blue-200" : "text-slate-400"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className={`px-4 pb-4 pt-3 space-y-3 border-t ${isVerdict ? "border-blue-500 bg-blue-700" : "border-slate-100 bg-white"}`}>
          <p className={`text-sm leading-relaxed ${isVerdict ? "text-blue-50" : "text-slate-600"}`}>
            {card.body}
          </p>

          {/* Chips */}
          {card.chips?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.chips.map((c, i) => (
                <span key={i} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  c.good
                    ? isVerdict ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isVerdict ? "bg-red-400/30 text-red-100"  : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {c.good ? "✓" : "✗"} {c.text}
                </span>
              ))}
            </div>
          )}

          {/* VS table */}
          {card.vsData && <VsCard vsData={card.vsData} />}
        </div>
      )}
    </div>
  )
}

export default function AIInsights({ profile, ranked, premiumMap }) {
  const [filter, setFilter] = useState("all")
  const cards = useMemo(() => generateInsights(profile, ranked, premiumMap), [profile, ranked, premiumMap])

  const warnings = cards.filter(c => c.type === "warning").length

  const FILTERS = [
    { key: "all",        label: "All" },
    { key: "verdict",    label: "Verdict" },
    { key: "warning",    label: "Warnings" },
    { key: "comparison", label: "Comparison" },
    { key: "money",      label: "Money" },
    { key: "blindspot",  label: "Blind Spots" },
    { key: "action",     label: "Actions" },
  ]

  const shown = filter === "all" ? cards : cards.filter(c => c.type === filter)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900">AI Analysis</h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{cards.length} insights</span>
          </div>
          <p className="text-sm text-slate-400 ml-9">
            Personalised analysis based on your exact profile — not generic advice.
          </p>
        </div>
        {warnings > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs font-bold text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>
            {warnings} warning{warnings > 1 ? "s" : ""} for your profile
          </div>
        )}
      </div>

      {/* Filter row */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map(f => {
          const count = f.key === "all" ? cards.length : cards.filter(c => c.type === f.key).length
          if (f.key !== "all" && count === 0) return null
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                filter === f.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}>
              {f.label} <span className={`ml-1 ${filter === f.key ? "text-blue-200" : "text-slate-400"}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {shown.map((card, i) => (
          <InsightCard
            key={card.id}
            card={card}
            rank={i}
            defaultOpen={i === 0 || card.type === "verdict"}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-base flex-shrink-0">ℹ️</span>
        <p className="text-xs text-slate-500 leading-relaxed">
          Analysis is generated from IRDAI-verified data, your profile, and published policy wordings.
          This is educational guidance, not financial advice.
        </p>
      </div>
    </div>
  )
}
