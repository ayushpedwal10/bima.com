import { useState, useMemo } from "react"
import { Check, ArrowUpDown, ArrowUp, ArrowDown, Download, RotateCcw } from "lucide-react"

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
  if (!active) return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline-block" />
  return asc
    ? <ArrowUp className="w-3 h-3 text-blue-600 ml-1 inline-block stroke-[2.5]" />
    : <ArrowDown className="w-3 h-3 text-blue-600 ml-1 inline-block stroke-[2.5]" />
}

export default function CompareTable({ ranked, premiumMap, mode, profile, comparisonLabel = "All" }) {
  const [sortKey, setSortKey] = useState("rank")
  const [sortAsc, setSortAsc] = useState(false)

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
    const top = ranked[0]
    const pr = premiumMap[top.policy.id]
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
    a.href = URL.createObjectURL(blob)
    a.download = "beemasaathi_actuarial_summary.json"
    a.click()
  }

  const bool = (v) => v
    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-2xs"><Check className="w-3 h-3 stroke-[3]" /></span>
    : <span className="text-slate-300 text-xs font-bold">—</span>

  const scoreColor = (s) =>
    s >= 65 ? "text-emerald-700 font-extrabold" : s >= 40 ? "text-amber-700 font-bold" : "text-rose-600 font-bold"
  const csrColor = (csr) =>
    csr >= 98 ? "text-emerald-700" : csr >= 95 ? "text-emerald-600" : csr >= 90 ? "text-blue-700" : csr >= 85 ? "text-amber-700" : "text-rose-600"
  const csrLabel = (csr) =>
    csr >= 98 ? "Peak" : csr >= 95 ? "High" : csr >= 90 ? "Good" : csr >= 85 ? "Moderate" : "Low"

  const origRankMap = Object.fromEntries(ranked.map((r, i) => [r.policy.id, i + 1]))

  const HEADERS = [
    { key: "rank",      label: "#",              sortable: true  },
    { key: "policy",    label: "Underwriter Plan", sortable: false },
    { key: "score",     label: "Fit Score",      sortable: true  },
    { key: "monthly",   label: "Monthly",        sortable: true  },
    { key: "annual",    label: "Annual",         sortable: true  },
    { key: "coverage",  label: "Coverage",       sortable: true  },
    { key: "csr",       label: "IRDAI CSR",      sortable: true  },
    { key: "hospitals", label: "Cashless Beds",  sortable: true  },
    { key: "copay",     label: "Co-Pay",         sortable: true  },
    { key: "ncb",       label: "NCB",            sortable: true  },
    { key: "opd",       label: "OPD",            sortable: false },
    { key: "mat",       label: "Maternity",      sortable: false },
    { key: "ped",       label: "Day-1 PED",      sortable: false },
    { key: "mh",        label: "Mental",         sortable: false },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-bold">{ranked.length} {ranked.length === 1 ? "policy" : "policies"}</strong> ({comparisonLabel})
          <span className="text-slate-400"> — click any column header to re-sort matrix</span>
        </p>
        <div className="flex items-center gap-2">
          {sortKey !== "rank" && (
            <button
              type="button"
              onClick={() => { setSortKey("rank"); setSortAsc(false) }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-xl hover:border-blue-300 transition-all font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset sorting</span>
            </button>
          )}
          {mode === "agent" && (
            <button
              type="button"
              onClick={dl}
              className="inline-flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3.5 py-1.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-xs shadow-blue-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Actuarial JSON</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {HEADERS.map(h => (
                <th
                  key={h.key}
                  onClick={h.sortable ? () => handleSort(h.key) : undefined}
                  className={`px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider whitespace-nowrap first:pl-5 transition-colors ${
                    h.sortable ? "cursor-pointer hover:bg-slate-100 select-none" : ""
                  } ${sortKey === h.key ? "text-blue-700 bg-blue-50/80" : "text-slate-500"}`}
                >
                  <div className="flex items-center">
                    <span>{h.label}</span>
                    {h.sortable && <SortIcon active={sortKey === h.key} asc={sortAsc} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((r, i) => {
              const p = r.policy
              const pr = premiumMap[p.id]
              const f = p.features
              const origRank = origRankMap[p.id]
              return (
                <tr
                  key={p.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    origRank === 1 ? "bg-blue-50/30" : ""
                  }`}
                >
                  <td className="px-3 py-3.5 pl-5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black ${origRank === 1 ? "text-blue-700" : "text-slate-600"}`}>
                        #{origRank}
                      </span>
                      {sortKey !== "rank" && i + 1 !== origRank && (
                        <span className="text-[9px] text-slate-400">({i + 1})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="font-bold text-slate-900 whitespace-nowrap">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.provider}</div>
                  </td>
                  <td className={`px-3 py-3.5 tabular-nums ${scoreColor(r.score)}`}>
                    {r.score}/100
                  </td>
                  <td className="px-3 py-3.5 font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    ₹{pr.monthly.toLocaleString()}
                  </td>
                  <td className="px-3 py-3.5 text-slate-500 tabular-nums whitespace-nowrap">
                    ₹{pr.annual.toLocaleString()}
                  </td>
                  <td className="px-3 py-3.5 text-slate-800 font-bold">
                    ₹{(p.coverage / 100000).toFixed(0)}L
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className={`font-black ${csrColor(p.csr)}`}>{p.csr}%</span>
                    <span className="text-[10px] text-slate-400 ml-1">({csrLabel(p.csr)})</span>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600 font-semibold">
                    {(f.hospitals / 1000).toFixed(0)}K+
                  </td>
                  <td className="px-3 py-3.5">
                    {p.copay === 0 ? (
                      <span className="text-emerald-700 font-bold">0%</span>
                    ) : (
                      <span className="text-amber-700 font-bold">{p.copay}%</span>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-slate-600 font-semibold">+{f.ncb}%</td>
                  <td className="px-3 py-3.5 text-center">{bool(f.outpatient)}</td>
                  <td className="px-3 py-3.5 text-center">{bool(f.maternity)}</td>
                  <td className="px-3 py-3.5 text-center">{bool(f.ped)}</td>
                  <td className="px-3 py-3.5 text-center">{bool(f.mental_health)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-400 text-center font-medium">
        Rank # indicates original actuarial fit · Claims Paid % derived from IRDAI Handbook of Insurance Statistics
      </p>
    </div>
  )
}
