import { useState, useMemo } from "react"
import { DISEASES, DISEASE_CATEGORIES, PLAN_META, COVERAGE_META, searchDiseases } from "../data/diseaseData"

const ALL_PLANS = ["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"]

// ── Coverage badge pill ───────────────────────────────────────
function CoveragePill({ status }) {
  const m = COVERAGE_META[status] || COVERAGE_META.excluded
  return (
    <span
      className="inline-flex items-center justify-center text-[10px] font-black px-2 py-0.5 rounded-md"
      style={{ background: m.bg, color: m.textColor, border: `1px solid ${m.border}` }}
      title={m.label}
    >
      {m.short}
    </span>
  )
}

// ── Plan badge ────────────────────────────────────────────────
function PlanBadge({ id, status }) {
  const m = PLAN_META[id]
  const c = COVERAGE_META[status] || COVERAGE_META.excluded
  const isCovered = status !== "excluded"
  return (
    <div
      className="flex flex-col items-center gap-1 p-2 rounded-xl border text-center min-w-[52px]"
      style={isCovered
        ? { background: `${m.color}12`, borderColor: `${m.color}40` }
        : { background: "#f8fafc", borderColor: "#e2e8f0" }}
    >
      <span className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ background: isCovered ? m.color : "#e2e8f0" }} />
      <span className="text-[9px] font-bold leading-none" style={{ color: isCovered ? m.color : "#94a3b8" }}>
        {m.abbr}
      </span>
      <CoveragePill status={status} />
    </div>
  )
}

// ── Disease row card ──────────────────────────────────────────
function DiseaseRow({ disease, isSelected, onClick, filterPlan }) {
  const cat = DISEASE_CATEGORIES[disease.category]
  const coveredCount = ALL_PLANS.filter(p => disease.coverage[p] !== "excluded").length
  const day1Count    = ALL_PLANS.filter(p => disease.coverage[p] === "day1").length

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all duration-150 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{cat.icon}</span>
            <p className={`font-bold text-sm leading-snug ${isSelected ? "text-blue-900" : "text-slate-900"}`}>
              {disease.name}
            </p>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: cat.bg, color: cat.color }}
            >
              {cat.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 ml-7">{disease.description}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            coveredCount === 10 ? "bg-emerald-100 text-emerald-700" :
            coveredCount >= 7  ? "bg-blue-100 text-blue-700" :
            coveredCount >= 4  ? "bg-amber-100 text-amber-700" :
                                 "bg-red-100 text-red-700"
          }`}>
            {coveredCount}/10 plans
          </span>
          {day1Count > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {day1Count} Day-1
            </span>
          )}
        </div>
      </div>

      {/* plan badges row */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {ALL_PLANS.map(pid => (
          <div key={pid}
            className={`transition-all ${filterPlan && filterPlan !== pid ? "opacity-30" : ""}`}>
            <CoveragePill status={disease.coverage[pid]} />
          </div>
        ))}
      </div>
    </button>
  )
}

// ── Detail panel ──────────────────────────────────────────────
function DiseaseDetail({ disease, onClose }) {
  const cat = DISEASE_CATEGORIES[disease.category]
  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-md p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{cat.icon}</span>
            <h4 className="font-black text-slate-900 text-lg">{disease.name}</h4>
          </div>
          <p className="text-sm text-slate-500">{disease.description}</p>
          {disease.notes && (
            <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mt-2">
              💡 {disease.notes}
            </p>
          )}
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0 ml-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Coverage by Plan</p>
      <div className="grid grid-cols-5 gap-2">
        {ALL_PLANS.map(pid => (
          <PlanBadge key={pid} id={pid} status={disease.coverage[pid]} />
        ))}
      </div>

      {/* legend */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(COVERAGE_META).map(([key, m]) => (
            <span key={key}
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: m.bg, color: m.textColor, border: `1px solid ${m.border}` }}>
              {m.short} {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function DiseaseChecker({ profile, ranked }) {
  const [query,      setQuery]      = useState("")
  const [category,   setCategory]   = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  const results = useMemo(
    () => searchDiseases({ query, category, planId: planFilter }),
    [query, category, planFilter]
  )

  const selected = selectedId ? DISEASES.find(d => d.id === selectedId) : null

  // stats
  const fullyExcluded = DISEASES.filter(d => ALL_PLANS.every(p => d.coverage[p] === "excluded")).length
  const day1Count     = DISEASES.filter(d => ALL_PLANS.some(p => d.coverage[p] === "day1")).length
  const coveredAll    = DISEASES.filter(d => ALL_PLANS.every(p => d.coverage[p] !== "excluded")).length

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5">
        <h3 className="text-xl font-black text-slate-900">Disease Coverage Checker</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Check which of the {DISEASES.length} diseases &amp; conditions are covered across all 10 plans.
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-blue-600">{DISEASES.length}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Total conditions</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-emerald-600">{coveredAll}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Covered by all plans</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-purple-600">{day1Count}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Day-1 in some plans</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-slate-400">{fullyExcluded}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Excluded everywhere</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* search */}
        <div className="sm:col-span-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <input
            type="text" placeholder="Search disease or condition…"
            value={query} onChange={e => { setQuery(e.target.value); setSelectedId(null) }}
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all"
          />
        </div>

        {/* category */}
        <div className="relative">
          <select value={category} onChange={e => { setCategory(e.target.value); setSelectedId(null) }}
            className="w-full h-10 appearance-none bg-white border border-slate-200 rounded-xl px-4 pr-8 text-sm font-medium text-slate-800
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all">
            <option value="">All Categories</option>
            {Object.entries(DISEASE_CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        {/* plan filter */}
        <div className="relative">
          <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setSelectedId(null) }}
            className="w-full h-10 appearance-none bg-white border border-slate-200 rounded-xl px-4 pr-8 text-sm font-medium text-slate-800
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all">
            <option value="">All Plans</option>
            {ALL_PLANS.map(id => (
              <option key={id} value={id}>{PLAN_META[id].short}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setCategory("")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            !category ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
          }`}>All</button>
        {Object.entries(DISEASE_CATEGORIES).map(([key, val]) => (
          <button key={key} onClick={() => setCategory(category === key ? "" : key)}
            style={category === key ? { background: val.color, borderColor: val.color, color: "#fff" } : {}}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              category === key ? "" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}>
            {val.icon} {val.label}
          </button>
        ))}
      </div>

      {/* ── Plan coverage legend ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Filter by Plan — click to highlight</p>
        <div className="flex flex-wrap gap-2">
          {ALL_PLANS.map(id => {
            const m = PLAN_META[id]
            const covCount = results.filter(d => d.coverage[id] !== "excluded").length
            return (
              <button key={id} onClick={() => setPlanFilter(planFilter === id ? "" : id)}
                style={{ borderColor: planFilter === id ? m.color : "transparent", background: planFilter === id ? `${m.color}15` : "#f8fafc" }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 transition-all hover:shadow-sm">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }}/>
                <span className="text-xs font-bold text-slate-700">{m.short}</span>
                <span className="text-xs text-slate-400">{covCount} covered</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">
          Showing <strong className="text-slate-800">{results.length}</strong> condition{results.length !== 1 ? "s" : ""}
          {category && <> in <strong className="text-slate-800">{DISEASE_CATEGORIES[category]?.label}</strong></>}
          {planFilter && <> covered by <strong className="text-slate-800">{PLAN_META[planFilter]?.short}</strong></>}
        </p>
        {(query || category || planFilter) && (
          <button onClick={() => { setQuery(""); setCategory(""); setPlanFilter(""); setSelectedId(null) }}
            className="text-xs text-blue-600 font-semibold hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* ── List + detail ── */}
      <div className={selected ? "grid grid-cols-1 lg:grid-cols-2 gap-5" : ""}>
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="font-semibold text-slate-700">No conditions found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
              <button onClick={() => { setQuery(""); setCategory(""); setPlanFilter("") }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {results.map(d => (
                <DiseaseRow
                  key={d.id}
                  disease={d}
                  isSelected={selectedId === d.id}
                  onClick={() => setSelectedId(selectedId === d.id ? null : d.id)}
                  filterPlan={planFilter}
                />
              ))}
            </div>
          )}
        </div>

        {/* detail panel */}
        {selected && (
          <div className="hidden lg:block">
            <DiseaseDetail disease={selected} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>

      {/* mobile detail */}
      {selected && (
        <div className="lg:hidden mt-4">
          <DiseaseDetail disease={selected} onClose={() => setSelectedId(null)} />
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="mt-5 flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          Coverage details are indicative based on published policy wordings and IRDAI guidelines.
          Actual coverage depends on your specific policy, declared conditions at proposal stage,
          and applicable waiting periods. Always read your policy document carefully before purchase.
        </p>
      </div>
    </div>
  )
}
