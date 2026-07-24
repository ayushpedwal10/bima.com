import { CLAIM_DATA } from "../data/claimRejectionData"
import InsurerLogo from "./InsurerLogo"

function getTrust(csr) {
  if (csr >= 98) return { label: "Excellent", color: "text-emerald-700 bg-emerald-50 border-emerald-200", bar: "bg-emerald-500" }
  if (csr >= 95) return { label: "Very Good", color: "text-green-700 bg-green-50 border-green-200",   bar: "bg-green-500" }
  if (csr >= 90) return { label: "Good",      color: "text-blue-700 bg-blue-50 border-blue-200",     bar: "bg-blue-500" }
  if (csr >= 85) return { label: "Average",   color: "text-amber-700 bg-amber-50 border-amber-200", bar: "bg-amber-500" }
  return              { label: "Below Avg",   color: "text-red-700 bg-red-50 border-red-200",       bar: "bg-red-500" }
}

function calcRisk(profile) {
  let s = 20
  if (profile.age > 45) s += 20
  if (profile.age > 60) s += 15
  if (profile.smoker)   s += 15
  if (profile.ped)      s += 20
  if (profile.chronic)  s += 10
  if (profile.bmi >= 30) s += 10
  if (profile.members >= 3) s += 5
  return Math.min(s, 95)
}

export default function ClaimInsights({ ranked, profile }) {
  const risk = calcRisk(profile)
  const riskLabel = risk <= 30 ? "Low" : risk <= 60 ? "Moderate" : "High"
  const riskColor = risk <= 30 ? "text-emerald-600" : risk <= 60 ? "text-amber-600" : "text-red-600"
  const riskBg    = risk <= 30 ? "bg-emerald-50 border-emerald-200" : risk <= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"

  const riskFactors = [
    profile.age > 45 && "Age above 45",
    profile.smoker   && "Smoker",
    profile.ped      && "Pre-existing disease",
    profile.chronic  && "Chronic condition",
    profile.bmi >= 30 && "High BMI",
    profile.members >= 3 && "Large family",
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900">Will Your Claim Actually Get Paid?</h3>
        <p className="text-sm text-slate-500 mt-1">Real rejection reasons from IRDAI records and insurer policy wordings — not marketing copy.</p>
      </div>

      {/* Personal risk */}
      <div className={`rounded-2xl p-5 border-2 ${riskBg}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your Claim Risk Profile</div>
            <div className={`text-2xl font-black ${riskColor}`}>{riskLabel} Risk</div>
          </div>
          <div className="text-4xl">{risk <= 30 ? "🟢" : risk <= 60 ? "🟡" : "🔴"}</div>
        </div>
        <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full ${risk <= 30 ? "bg-emerald-500" : risk <= 60 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${risk}%` }} />
        </div>
        {riskFactors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {riskFactors.map((f, i) => (
              <span key={i} className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* Plain language explainer */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="font-semibold text-blue-800 mb-3 text-sm">💡 What does "Claims Paid %" actually mean?</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { pct: "99%", label: "Excellent", desc: "99 out of 100 claims paid", color: "bg-emerald-50 border-emerald-200" },
            { pct: "91%", label: "Average",   desc: "9 out of 100 claims rejected", color: "bg-amber-50 border-amber-200" },
            { pct: "85%", label: "Below Avg", desc: "15 out of 100 claims rejected", color: "bg-red-50 border-red-200" },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl border p-3 ${item.color}`}>
              <div className="text-xl font-black text-slate-900">{item.pct}</div>
              <div className="text-xs font-semibold text-slate-600">{item.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-3">
          Source: <strong>IRDAI Handbook of Indian Insurance Statistics</strong> — 2-year average FY 2023-24 &amp; FY 2024-25.
        </p>
      </div>

      {/* Per-policy deep dive */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Insurer-by-Insurer Breakdown</h4>
        {ranked.slice(0, 5).map(r => {
          const p = r.policy
          const d = CLAIM_DATA[p.id]
          if (!d) return null
          const trust = getTrust(p.csr)

          return (
            <div key={p.id} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <InsurerLogo provider={p.provider} size="md" />
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.provider}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Avg settlement</div>
                    <div className="text-sm font-bold text-slate-700">{d.avgSettlementDays} days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Ombudsman complaints</div>
                    <div className="text-sm font-bold text-slate-700">{d.ombudsmanComplaints} / 10k policies</div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${trust.color}`}>{trust.label}</span>
                </div>
              </div>

              {/* CSR bar */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Claims Paid Rate (IRDAI verified)</span>
                  <span className="font-black text-slate-900">{p.csr}%</span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${trust.bar}`} style={{ width: `${p.csr}%` }} />
                </div>
              </div>

              {/* Rejection reasons */}
              <div className="p-5 grid grid-cols-2 gap-5">
                <div>
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">
                    Top Rejection Reasons
                  </div>
                  <div className="space-y-3">
                    {d.topRejectionReasons.map((item, i) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-red-800 leading-snug">{item.reason}</span>
                          <span className="text-xs font-black text-red-600 flex-shrink-0">{item.pct}%</span>
                        </div>
                        <p className="text-xs text-red-700 leading-relaxed">💡 {item.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    Waiting Periods
                  </div>
                  <div className="space-y-2 mb-5">
                    {d.waitingPeriods.map((w, i) => (
                      <div key={i} className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${
                        w.duration.includes("0 days") ? "bg-emerald-50 border-emerald-200" :
                        w.duration.includes("Not covered") ? "bg-slate-50 border-slate-200" :
                        w.duration.includes("48") ? "bg-red-50 border-red-100" :
                        "bg-amber-50 border-amber-100"
                      }`}>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">{w.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{w.desc}</div>
                        </div>
                        <span className={`text-xs font-black flex-shrink-0 ${
                          w.duration.includes("0 days") ? "text-emerald-700" :
                          w.duration.includes("Not covered") ? "text-slate-500" :
                          w.duration.includes("48") ? "text-red-700" : "text-amber-700"
                        }`}>{w.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
