import { useState, useMemo } from "react"

const COLS = [
  { key: "rank",      sortFn: (a, b)     => b.score - a.score,                                          defDesc: true  },
  { key: "score",     sortFn: (a, b)     => b.score - a.score,                                          defDesc: true  },
  { key: "monthly",   sortFn: (a, b, pm) => pm[a.policy.id].monthly - pm[b.policy.id].monthly,          defDesc: false },
  { key: "annual",    sortFn: (a, b, pm) => pm[a.policy.id].annual  - pm[b.policy.id].annual,           defDesc: false },
  { key: "coverage",  sortFn: (a, b)     => b.policy.coverage  - a.policy.coverage,                     defDesc: true  },
  { key: "csr",       sortFn: (a, b)     => b.policy.csr       - a.policy.csr,                          defDesc: true  },
  { key: "hospitals", sortFn: (a, b)     => b.policy.features.hospitals - a.policy.features.hospitals,  defDesc: true  },
  { key: "copay",     sortFn: (a, b)     => a.policy.copay     - b.policy.copay,                        defDesc: false },
  { key: "ncb",       sortFn: (a, b)     => b.policy.features.ncb - a.policy.features.ncb,              defDesc: true  },
]

function SortIcon({ active, asc }) {
  if (!active) return <span className="ml-0.5 text-slate-300 text-xs">↕</span>
  return <span className="ml-0.5 text-blue-600 text-xs font-black">{asc ? "↑" : "↓"}</span>
}

export default function CompareTable({ ranked, premiumMap, mode, profile }) {
  const [sortKey,  setSortKey]  = useState("rank")
  const [sortAsc,  setSortAsc]  = useState(false)

  function handleSort(key) {
    const col = COLS.find(c => c.key === key)
    if (sortKey === key) {
      setSortAsc(v => !v)
    } else {
      setSortKey(key)
      setSortAsc(!col?.defDesc)
    }
  }

  const sorted = useMemo(() => {
    const col = COLS.find(c => c.key === sortKey)
    if (!col) return ranked
    return [...ranked].sort((a, b) => {
      const v = col.sortFn(a, b, premiumMap)
      return sortAsc ? -v : v
    })
  }, [ranked, sortKey, sortAsc, premiumMap])

  function dl() {
    const top = ranked[0]; const pr = premiumMap[top.policy.id]
    const summary = {
      customer_profile: profile,
      top_recommendation: {
        policy: top.policy.name, provider: top.policy.provider,
        score: top.score, annual_premium: pr.annual, monthly_premium: pr.monthly,
        reasons: top.reasons, warnings: top.warnings,
      },
      all_ranked: ranked.map((r, i) => ({
        rank: i + 1, policy: r.policy.name, provider: r.policy.provider,
        score: r.score, annual_premium: premiumMap[r.policy.id].annual,
      })),
    }
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob); a.download = "customer_summary.json"; a.click()
  }

  const bool = (v) => v
    ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">OK</span>
    : <span className="text-slate-200 text-base">-</span>

  const scoreColor = (s) =>
    s >= 65 ? "text-emerald-600 font-bold" : s >= 40 ? "text-amber-600 font-bold" : "text-red-500 font-bold"
  const csrColor = (csr) =>
    csr >= 98 ? "text-emerald-600" : csr >= 95 ? "text-emerald-500" : csr >= 90 ? "text-blue-600" : csr >= 85 ? "text-amber-600" : "text-red-500"
  const csrLabel = (csr) =>
    csr >= 98 ? "Excellent" : csr >= 95 ? "Very Good" : csr >= 90 ? "Good" : csr >= 85 ? "Average" : "Low"

  const origRankMap = Object.fromEntries(ranked.map((r, i) => [r.policy.id, i + 1]))

  const HEADERS = [
    { key: "rank",      label: "#",           sortable: true  },
    { key: "policy",    label: "Policy",      sortable: false },
    { key: "score",     label: "Score",       sortable: true  },
    { key: "monthly",   label: "Monthly",     sortable: true  },
    { key: "annual",    label: "Annual",      sortable: true  },
    { key: "coverage",  label: "Coverage",    sortable: true  },
    { key: "csr",       label: "Claims Paid", sortable: true  },
    { key: "hospitals", label: "Hospitals",   sortable: true  },
    { key: "copay",     label: "Copay",       sortable: true  },
    { key: "ncb",       label: "NCB",         sortable: true  },
    { key: "opd",       label: "OPD",         sortable: false },
    { key: "mat",       label: "Maternity",   sortable: false },
    { key: "ped",       label: "PED",         sortable: false },
    { key: "mh",        label: "Mental",      sortable: false },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-sm text-slate-500">
          All <strong className="text-slate-700">{ranked.length} policies</strong>
          <span className="text-slate-400"> — click any column header to sort</span>
        </p>
        <div className="flex items-center gap-2">
          {sortKey !== "rank" && (
            <button onClick={() => { setSortKey("rank"); setSortAsc(false) }}
              className="text-xs text-slate-500 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-all">
              Reset sort
            </button>
          )}
          {mode === "agent" && (
            <button onClick={dl}
              className="inline-flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-sm shadow-blue-600/20">
              Export JSON
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {HEADERS.map(h => (
                <th key={h.key}
                  onClick={h.sortable ? () => handleSort(h.key) : undefined}
                  className={`px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap first:pl-5 transition-colors ${
                    h.sortable ? "cursor-pointer hover:bg-slate-100 select-none" : ""
                  } ${sortKey === h.key ? "text-blue-600 bg-blue-50" : "text-slate-400"}`}>
                  {h.label}
                  {h.sortable && <SortIcon active={sortKey === h.key} asc={sortAsc} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((r, i) => {
              const p = r.policy; const pr = premiumMap[p.id]; const f = p.features
              const origRank = origRankMap[p.id]
              return (
                <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${origRank === 1 ? "bg-blue-50/40" : ""}`}>
                  <td className="px-3.5 py-3.5 pl-5">
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${origRank === 1 ? "text-blue-600" : "text-slate-500"}`}>
                        {origRank}
                      </span>
                      {sortKey !== "rank" && i + 1 !== origRank && (
                        <span className="text-[9px] text-slate-300">[{i+1}]</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5">
                    <div className="font-semibold text-slate-800 whitespace-nowrap text-xs">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.provider}</div>
                  </td>
                  <td className={`px-3.5 py-3.5 tabular-nums text-sm ${scoreColor(r.score)}`}>{r.score}</td>
                  <td className="px-3.5 py-3.5 font-semibold text-slate-800 tabular-nums whitespace-nowrap text-xs">
                    Rs.{pr.monthly.toLocaleString()}</td>
                  <td className="px-3.5 py-3.5 text-slate-500 tabular-nums whitespace-nowrap text-xs">
                    Rs.{pr.annual.toLocaleString()}</td>
                  <td className="px-3.5 py-3.5 text-slate-700 font-medium text-xs">
                    Rs.{(p.coverage/100000).toFixed(0)}L</td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap">
                    <span className={`font-bold text-xs ${csrColor(p.csr)}`}>{p.csr}%</span>
                    <span className="text-xs text-slate-400 ml-1">{csrLabel(p.csr)}</span>
                  </td>
                  <td className="px-3.5 py-3.5 text-slate-500 text-xs">{(f.hospitals/1000).toFixed(0)}K+</td>
                  <td className="px-3.5 py-3.5">
                    {p.copay === 0
                      ? <span className="text-emerald-600 font-bold text-xs">Zero</span>
                      : <span className="text-amber-600 font-semibold text-xs">{p.copay}%</span>
                    }
                  </td>
                  <td className="px-3.5 py-3.5 text-slate-500 text-xs">{f.ncb}%</td>
                  <td className="px-3.5 py-3.5 text-center">{bool(f.outpatient)}</td>
                  <td className="px-3.5 py-3.5 text-center">{bool(f.maternity)}</td>
                  <td className="px-3.5 py-3.5 text-center">{bool(f.ped)}</td>
                  <td className="px-3.5 py-3.5 text-center">{bool(f.mental_health)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-2.5 text-center">
        Bold rank = original match rank · [bracket] = current sort position
      </p>
    </div>
  )
}
