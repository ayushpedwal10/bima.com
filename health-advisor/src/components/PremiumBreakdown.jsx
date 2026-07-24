import InsurerLogo from "./InsurerLogo"

export default function PremiumBreakdown({ ranked, premiumMap, selectedId, onSelect }) {
  const pr = premiumMap[selectedId]
  const ranked_ = ranked.find(r => r.policy.id === selectedId)
  const policy  = ranked_?.policy
  const factors = pr?.factors || []

  const loadingTotal = pr ? pr.annual - pr.base : 0
  const loadingPct   = pr ? Math.round((pr.mult - 1) * 100) : 0
  const maxImpact    = Math.max(...factors.filter(f => f.impact > 0).map(f => f.impact), 1)

  let running = pr?.base || 0
  const rows = factors.map(f => {
    if (f.name === "Base Premium") return { ...f, running }
    running = Math.round(running * (1 + f.pct / 100))
    return { ...f, running }
  })

  return (
    <div>
      {/* Policy selector */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select policy to inspect</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ranked.map(r => {
            const p = r.policy; const active = p.id === selectedId
            return (
              <button key={p.id} onClick={() => onSelect(p.id)}
                className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all ${
                  active ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                }`}>
                <InsurerLogo provider={p.provider} size="sm" />
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${active ? "text-blue-700" : "text-slate-700"}`}>{p.name}</div>
                  <div className={`text-xs font-bold mt-0.5 ${active ? "text-blue-600" : "text-slate-500"}`}>
                    ₹{premiumMap[p.id].monthly.toLocaleString()}/mo
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {pr && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">Base Premium</div>
              <div className="text-2xl font-black text-slate-800 tabular-nums">₹{pr.base.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">standard rate for your profile</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">Total Loading</div>
              <div className="text-2xl font-black text-red-600 tabular-nums">+{loadingPct}%</div>
              <div className="text-xs text-red-400 mt-1">+₹{loadingTotal.toLocaleString()} added</div>
            </div>
            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">Your Premium</div>
              <div className="text-2xl font-black text-blue-700 tabular-nums">₹{pr.annual.toLocaleString()}</div>
              <div className="text-xs text-blue-400 mt-1">₹{pr.monthly.toLocaleString()} / month</div>
            </div>
          </div>

          {/* Factor breakdown table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden mb-6 shadow-sm">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-4">Factor</div>
                <div className="col-span-2 text-right">Loading</div>
                <div className="col-span-2 text-right">Impact</div>
                <div className="col-span-4">Waterfall</div>
              </div>
            </div>
            {rows.map((f, i) => (
              <div key={i} className={`px-5 py-4 border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/40"}`}>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{f.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">{f.name}</span>
                    </div>
                    {(f.why || f.explanation) && (
                      <p className="text-xs text-slate-400 mt-0.5 ml-6 leading-relaxed">{f.why || f.explanation}</p>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    {f.name === "Base Premium"
                      ? <span className="text-xs text-slate-300">—</span>
                      : <span className={`text-sm font-bold ${f.dir === "up" ? "text-red-500" : "text-emerald-600"}`}>
                          {f.dir === "up" ? "+" : ""}{f.pct}%
                        </span>
                    }
                  </div>
                  <div className="col-span-2 text-right">
                    {f.name === "Base Premium"
                      ? <span className="text-sm font-bold text-slate-700 tabular-nums">₹{f.impact.toLocaleString()}</span>
                      : <span className={`text-sm font-bold tabular-nums ${f.dir === "up" ? "text-red-500" : "text-emerald-600"}`}>
                          {f.dir === "up" ? "+" : "−"}₹{Math.abs(f.impact).toLocaleString()}
                        </span>
                    }
                  </div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        {f.name === "Base Premium"
                          ? <div className="h-full w-full bg-blue-400 rounded-full"/>
                          : f.impact !== 0 && (
                            <div className={`h-full rounded-full transition-all ${f.dir === "up" ? "bg-red-400" : "bg-emerald-400"}`}
                              style={{ width: `${Math.min(Math.abs(f.impact) / maxImpact * 100, 100)}%` }}/>
                          )
                        }
                      </div>
                      <span className="text-[10px] text-slate-400 w-16 text-right tabular-nums">
                        {f.name === "Base Premium" ? "base" : `→ ₹${f.running.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GST summary */}
          <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 mb-5 flex items-center justify-between">
            <div className="text-sm text-blue-700">
              <strong>Annual premium</strong> ₹{pr.annual.toLocaleString()} + GST @18% = <strong>₹{pr.totalWithGST.toLocaleString()}</strong> total
            </div>
            <div className="text-xs text-blue-500 font-semibold">₹{pr.gst.toLocaleString()} GST</div>
          </div>

          {/* IRDAI loading reference */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
            <p className="font-semibold text-slate-700 text-sm mb-3">📚 IRDAI Loading Reference</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                ["Age 35–44", "+15%"], ["Age 45–54", "+30%"], ["Age 55–64", "+55%"],
                ["Age 65+",   "+80%"], ["Overweight BMI", "+10%"], ["Obese BMI", "+25%"],
                ["Smoker",    "+20%"], ["Pre-existing Disease", "+30%"], ["Chronic Condition", "+15%"],
                ["Metro City","+10%"], ["2-member Floater",    "+55%"], ["4-member Floater", "+145%"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-slate-200/80">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-bold text-red-500">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-3.5 text-xs text-slate-400">
              💡 <strong className="text-slate-600">Section 80D:</strong> Save up to ₹25,000/yr in taxes on premiums paid. ₹50,000 for senior citizen parents.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
