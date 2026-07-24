import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts"
import { PREMIUM_RATES, getSIKey } from "../data/premiumRates"
import InsurerLogo from "./InsurerLogo"

const AGE_POINTS = [25, 30, 35, 40, 45, 50, 55, 60, 65]

const BAND = age => {
  if (age <= 25) return "18-25"
  if (age <= 35) return "26-35"
  if (age <= 45) return "36-45"
  if (age <= 55) return "46-55"
  if (age <= 65) return "56-65"
  return "66-75"
}

const COLORS = ["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6"]

function getBaseRate(policyId, siLakhs, age) {
  const band = BAND(age)
  return PREMIUM_RATES[policyId]?.[siLakhs]?.[band] ?? null
}

function fmt(v) {
  if (!v) return "—"
  if (v >= 100000) return `₹${(v/100000).toFixed(1)}L`
  return `₹${(v/1000).toFixed(1)}K`
}

const CustomTooltip = ({ active, payload, label, currentAge }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 min-w-[200px]">
      <div className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
        Age {label}
        {label === currentAge && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">You are here</span>
        )}
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-slate-600 truncate max-w-[120px]">{p.name}</span>
          </div>
          <span className="font-black text-slate-900">₹{p.value?.toLocaleString("en-IN")}/mo</span>
        </div>
      ))}
    </div>
  )
}

export default function PremiumAgeChart({ ranked, profile, premiumMap }) {
  const top3 = ranked.slice(0, 3)
  const [siLakhs, setSiLakhs] = useState(15)

  // Build chart data — monthly premiums at each age point
  const chartData = AGE_POINTS.map(age => {
    const point = { age }
    top3.forEach(r => {
      const base = getBaseRate(r.policy.id, siLakhs, age)
      if (base !== null) {
        // Apply same loadings as current profile (smoker, PED, etc.)
        let mult = 1
        if (profile.smoker)  mult *= 1.20
        if (profile.ped)     mult *= 1.30
        if (profile.chronic) mult *= 1.15
        const m = profile.members || 1
        if      (m === 2) mult *= 1.55
        else if (m === 3) mult *= 2.05
        else if (m === 4) mult *= 2.45
        else if (m >= 5)  mult *= 2.75
        const METRO = new Set(["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata"])
        if (METRO.has(profile.city)) mult *= 1.10
        point[r.policy.id] = Math.round((base * mult) / 12)
      }
    })
    return point
  })

  // Key insight numbers
  const currentAge = profile.age
  const age50 = 50
  const currentData = chartData.find(d => d.age >= currentAge) ?? chartData[0]
  const age50Data   = chartData.find(d => d.age >= age50) ?? chartData[chartData.length - 1]
  const bestId = top3[0]?.policy.id
  const nowPremium = currentData?.[bestId]
  const thenPremium = age50Data?.[bestId]
  const increase = nowPremium && thenPremium ? Math.round(((thenPremium - nowPremium) / nowPremium) * 100) : null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">How Your Premium Grows With Age</h3>
        <p className="text-sm text-slate-500 mt-1">
          Health insurance gets more expensive every year you wait. See exactly how much more you'll pay if you delay.
        </p>
      </div>

      {/* Wake-up call banner */}
      {increase && increase > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">⏰ Cost of Waiting</div>
              <div className="text-2xl font-black mb-1">
                Buy now at ₹{nowPremium?.toLocaleString("en-IN")}/mo
              </div>
              <div className="text-orange-100 text-sm">
                Wait till age 50 → pay <strong className="text-white">₹{thenPremium?.toLocaleString("en-IN")}/mo</strong> — that's <strong className="text-white">{increase}% more</strong>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-5xl font-black">+{increase}%</div>
              <div className="text-orange-100 text-sm">by age 50</div>
            </div>
          </div>
        </div>
      )}

      {/* Sum insured selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700">Sum Insured:</span>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {[5, 10, 15, 20, 25].map(si => (
            <button key={si} onClick={() => setSiLakhs(si)}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                siLakhs === si ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              ₹{si}L
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">Monthly premium shown (excl. GST, loadings applied)</span>
      </div>

      {/* Chart */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="age"
              tickFormatter={v => `Age ${v}`}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip currentAge={currentAge} />} />
            <Legend
              formatter={(value) => {
                const r = top3.find(r => r.policy.id === value)
                return <span className="text-xs font-semibold text-slate-700">{r?.policy.name}</span>
              }}
            />
            {/* Current age reference line */}
            <ReferenceLine
              x={AGE_POINTS.find(a => a >= currentAge) ?? currentAge}
              stroke="#2563eb"
              strokeDasharray="4 4"
              label={{ value: "You", position: "top", fontSize: 11, fill: "#2563eb", fontWeight: "bold" }}
            />
            {top3.map((r, i) => (
              <Line
                key={r.policy.id}
                type="monotone"
                dataKey={r.policy.id}
                name={r.policy.id}
                stroke={COLORS[i]}
                strokeWidth={i === 0 ? 3 : 2}
                dot={{ r: 4, fill: COLORS[i], strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Age-by-age table */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="text-sm font-bold text-slate-700">Monthly Premium at Each Age — Top 3 Plans</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                {AGE_POINTS.map(age => (
                  <th key={age} className={`px-3 py-3 text-xs font-bold uppercase tracking-wider text-center ${
                    age === (AGE_POINTS.find(a => a >= currentAge) ?? currentAge)
                      ? "text-blue-600 bg-blue-50" : "text-slate-500"
                  }`}>
                    {age === (AGE_POINTS.find(a => a >= currentAge) ?? currentAge) ? `★ ${age}` : age}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top3.map((r, i) => (
                <tr key={r.policy.id} className={`border-b border-slate-100 ${i === 0 ? "bg-blue-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <InsurerLogo provider={r.policy.provider} size="sm" />
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{r.policy.name}</div>
                        <div className="text-xs text-slate-400">{r.policy.provider}</div>
                      </div>
                    </div>
                  </td>
                  {AGE_POINTS.map(age => {
                    const val = chartData.find(d => d.age === age)?.[r.policy.id]
                    const isCurrent = age === (AGE_POINTS.find(a => a >= currentAge) ?? currentAge)
                    return (
                      <td key={age} className={`px-3 py-3 text-center ${isCurrent ? "bg-blue-50 font-black text-blue-700" : "text-slate-700 font-semibold"}`}>
                        {val ? `₹${(val/1000).toFixed(1)}K` : <span className="text-slate-300">—</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <span>ℹ️</span>
        <span>Premiums shown are monthly figures from insurer published rate cards (2024-25), with your profile loadings applied (smoker, PED, members, city). Excludes GST (18%). Actual premiums may vary.</span>
      </div>

      {/* ── Medical Inflation Projector ── */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-lg font-black text-slate-900">Medical Inflation Projector</h4>
          <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">7.5%/yr</span>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Your ₹5L cover today won't stretch as far in 10 years. See exactly how inflation erodes your coverage.
        </p>

        {/* Inflation table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-5">
          <div className="px-5 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-amber-200">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">
              What ₹X cover buys in today's money — at 7.5% medical inflation
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Today</th>
                  {[5, 10, 15, 20].map(yr => (
                    <th key={yr} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      In {yr} yrs
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[500000, 1000000, 1500000, 2000000, 2500000].map(cover => (
                  <tr key={cover} className={cover === 1000000 ? "bg-blue-50/40" : ""}>
                    <td className="px-5 py-3 font-bold text-slate-900">
                      ₹{(cover/100000).toFixed(0)}L
                      {cover === 1000000 && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">Market median</span>}
                    </td>
                    {[5, 10, 15, 20].map(yr => {
                      const realVal = Math.round(cover / Math.pow(1.075, yr))
                      const pct = Math.round((realVal / cover) * 100)
                      const color = pct >= 80 ? "text-emerald-700" : pct >= 60 ? "text-amber-700" : "text-red-700"
                      const bg    = pct >= 80 ? "bg-emerald-50"    : pct >= 60 ? "bg-amber-50"    : "bg-red-50"
                      return (
                        <td key={yr} className="px-4 py-3 text-center">
                          <div className={`inline-flex flex-col items-center px-2 py-1 rounded-lg ${bg}`}>
                            <span className={`text-sm font-black ${color}`}>
                              ₹{(realVal/100000).toFixed(1)}L
                            </span>
                            <span className={`text-[10px] font-bold ${color}`}>{pct}% left</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doubling time cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { icon: "🏥", label: "General hospitalisation", base: 80000,  years: 10 },
            { icon: "❤️", label: "Cardiac bypass surgery",  base: 450000, years: 10 },
            { icon: "🎗️", label: "Cancer treatment (1yr)",  base: 700000, years: 10 },
          ].map(item => {
            const future = Math.round(item.base * Math.pow(1.075, item.years))
            const increase = Math.round(((future - item.base) / item.base) * 100)
            return (
              <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-bold text-slate-700 mb-3">{item.label}</p>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-slate-400">Today</p>
                    <p className="text-lg font-black text-slate-800">₹{(item.base/100000).toFixed(1)}L</p>
                  </div>
                  <div className="text-slate-300 pb-1">→</div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">In {item.years} yrs</p>
                    <p className="text-lg font-black text-red-600">₹{(future/100000).toFixed(1)}L</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    +{increase}% more expensive
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Beat inflation tip */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="font-bold text-sm mb-3">💡 How to beat medical inflation without paying more premium</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🎁", title: "NCB", desc: "No Claim Bonus gives you 50–100% more cover every year you don't claim — completely free." },
              { icon: "🔄", title: "Restore Benefit", desc: "If your cover is exhausted, it automatically refills. Unlimited restore plans are best for families." },
              { icon: "📅", title: "Buy Young", desc: "Every year you delay, premiums rise 6–12%. Lock in today's rate — some plans freeze your premium forever." },
            ].map(t => (
              <div key={t.title} className="bg-white/15 border border-white/20 rounded-xl p-3">
                <span className="text-xl">{t.icon}</span>
                <p className="font-bold text-sm mt-1 mb-1">{t.title}</p>
                <p className="text-xs text-blue-100 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
