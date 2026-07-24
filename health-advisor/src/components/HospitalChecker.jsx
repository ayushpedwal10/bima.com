import { useState, useEffect, useRef, useMemo } from "react"
import { HOSPITALS, HOSPITAL_CITIES, HOSPITAL_TYPES, PLAN_META, searchHospitals } from "../data/hospitalData"

// ─── Leaflet CSS loaded dynamically to avoid SSR issues ──────
let leafletLoaded = false
function ensureLeaflet() {
  if (leafletLoaded) return
  const link = document.createElement("link")
  link.rel  = "stylesheet"
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  document.head.appendChild(link)
  leafletLoaded = true
}

// ─── small plan badge ─────────────────────────────────────────
function PlanBadge({ id, covered }) {
  const m = PLAN_META[id]
  if (!m) return null
  return (
    <span title={m.short}
      style={covered
        ? { background: m.color, color: "#fff", border: `1px solid ${m.color}` }
        : { background: "#f8fafc", color: "#cbd5e1", border: "1px solid #e2e8f0" }
      }
      className="inline-flex items-center justify-center text-[10px] font-black px-2 py-0.5 rounded-md transition-all">
      {m.abbr}
    </span>
  )
}

// ─── type pill ───────────────────────────────────────────────
function TypePill({ type }) {
  const t = HOSPITAL_TYPES[type] || { label: type, color: "#64748b", bg: "#f1f5f9" }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: t.bg, color: t.color }}>
      {t.label}
    </span>
  )
}

// ─── coverage count badge ─────────────────────────────────────
function CoverageBadge({ count, total }) {
  const pct = count / total
  const cls = pct === 1 ? "bg-emerald-100 text-emerald-700" :
              pct >= 0.7 ? "bg-blue-100 text-blue-700" :
              pct >= 0.4 ? "bg-amber-100 text-amber-700" :
                           "bg-red-100 text-red-700"
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {count}/{total} plans
    </span>
  )
}

// ─── Map component ────────────────────────────────────────────
function HospitalMap({ hospitals, selectedId, onSelect }) {
  const mapRef  = useRef(null)
  const mapObj  = useRef(null)
  const markers = useRef({})

  useEffect(() => {
    ensureLeaflet()
    // wait for Leaflet CSS + lib
    const init = async () => {
      const L = await import("leaflet")

      // fix default icon paths broken by Vite
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      if (!mapObj.current && mapRef.current) {
        mapObj.current = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false })
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(mapObj.current)
      }
    }
    init()

    return () => {
      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
      }
    }
  }, [])

  // update markers when hospitals change
  useEffect(() => {
    if (!mapObj.current) return
    const updateMarkers = async () => {
      const L = await import("leaflet")

      // clear old markers
      Object.values(markers.current).forEach(m => m.remove())
      markers.current = {}

      if (hospitals.length === 0) return

      const bounds = []
      hospitals.forEach(h => {
        const isSelected = h.id === selectedId
        const typeInfo   = HOSPITAL_TYPES[h.type] || { color: "#64748b" }

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:${isSelected ? 20 : 14}px;
            height:${isSelected ? 20 : 14}px;
            background:${isSelected ? "#1d4ed8" : typeInfo.color};
            border:${isSelected ? "3px" : "2px"} solid white;
            border-radius:50%;
            box-shadow:0 2px 6px rgba(0,0,0,.3);
            transition:all .15s;
          "></div>`,
          iconSize:   [isSelected ? 20 : 14, isSelected ? 20 : 14],
          iconAnchor: [isSelected ? 10 :  7, isSelected ? 10 :  7],
        })

        const marker = L.marker([h.lat, h.lng], { icon })
          .addTo(mapObj.current)
          .bindPopup(`
            <div style="font-family:system-ui;min-width:180px">
              <strong style="font-size:13px">${h.name}</strong><br/>
              <span style="font-size:11px;color:#64748b">${h.area}, ${h.city}</span><br/>
              <span style="font-size:11px;color:#64748b">${h.beds} beds</span><br/>
              <span style="font-size:11px;font-weight:700;color:${typeInfo.color}">${HOSPITAL_TYPES[h.type]?.label || h.type}</span><br/>
              <span style="font-size:11px;color:#334155">${h.plans.length}/10 plans cover this hospital</span>
            </div>
          `, { maxWidth: 240 })
          .on("click", () => onSelect(h.id))

        markers.current[h.id] = marker
        bounds.push([h.lat, h.lng])
      })

      if (bounds.length > 0) {
        mapObj.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
      }
    }
    updateMarkers()
  }, [hospitals, selectedId])

  return (
    <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: 340 }} />
  )
}

// ─── Hospital row card ────────────────────────────────────────
function HospitalRow({ hospital, isSelected, onClick, highlightPlan }) {
  const ALL_PLANS = ["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"]
  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all duration-150 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm leading-snug ${isSelected ? "text-blue-900" : "text-slate-900"}`}>
            {hospital.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{hospital.area} · {hospital.city} · {hospital.beds} beds</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <TypePill type={hospital.type} />
          <CoverageBadge count={hospital.plans.length} total={10} />
        </div>
      </div>
      {/* plan badges */}
      <div className="flex flex-wrap gap-1">
        {ALL_PLANS.map(pid => (
          <PlanBadge key={pid} id={pid} covered={hospital.plans.includes(pid)} />
        ))}
      </div>
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function HospitalChecker({ profile, ranked }) {
  const [city,       setCity]       = useState(profile?.city || "")
  const [query,      setQuery]      = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [selectedId, setSelectedId] = useState(null)
  const [showMap,    setShowMap]    = useState(true)

  // normalise profile city to match our dataset
  useEffect(() => {
    const profileCity = profile?.city || ""
    const matched = HOSPITAL_CITIES.find(c =>
      c.toLowerCase() === profileCity.toLowerCase() ||
      profileCity.toLowerCase().includes(c.toLowerCase())
    )
    setCity(matched || "")
  }, [profile?.city])

  const results = useMemo(() =>
    searchHospitals({ city, query, planId: planFilter })
      .filter(h => !typeFilter || h.type === typeFilter)
  , [city, query, planFilter, typeFilter])

  const selected = selectedId ? HOSPITALS.find(h => h.id === selectedId) : null
  const ALL_PLANS = ["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"]

  // stats for current city
  const cityTotal   = city ? HOSPITALS.filter(h => h.city === city).length : HOSPITALS.length
  const allCovered  = city
    ? HOSPITALS.filter(h => h.city === city && h.plans.length === 10).length
    : HOSPITALS.filter(h => h.plans.length === 10).length

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-black text-slate-900">Hospital Network Checker</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Search {HOSPITALS.length} hospitals across {HOSPITAL_CITIES.length} cities — see which plans cover each one cashlessly.
          </p>
        </div>
        <button onClick={() => setShowMap(m => !m)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-slate-300 transition-all">
          {showMap ? "🗒️ List only" : "🗺️ Show map"}
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {/* search */}
        <div className="md:col-span-2 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <input
            type="text" placeholder="Search hospital name or area…"
            value={query} onChange={e => { setQuery(e.target.value); setSelectedId(null) }}
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all"
          />
        </div>

        {/* city */}
        <div className="relative">
          <select value={city} onChange={e => { setCity(e.target.value); setSelectedId(null) }}
            className="w-full h-10 appearance-none bg-white border border-slate-200 rounded-xl px-4 pr-8 text-sm font-medium text-slate-800
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all">
            <option value="">All Cities</option>
            {HOSPITAL_CITIES.map(c => <option key={c}>{c}</option>)}
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
              <option key={id} value={id}>{PLAN_META[id]?.short || id}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {/* ── Type filter pills ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setTypeFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            !typeFilter ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
          }`}>All Types</button>
        {Object.entries(HOSPITAL_TYPES).map(([key, val]) => (
          <button key={key} onClick={() => setTypeFilter(typeFilter === key ? "" : key)}
            style={typeFilter === key ? { background: val.color, borderColor: val.color, color: "#fff" } : {}}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              typeFilter === key ? "" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}>
            {val.label}
          </button>
        ))}
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-blue-600">{results.length}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Hospitals found</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-emerald-600">{allCovered}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Covered by all 10 plans</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-black text-slate-700">{cityTotal}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{city || "All cities"} total</p>
        </div>
      </div>

      {/* ── Plan coverage legend ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Plan Coverage Legend</p>
        <div className="flex flex-wrap gap-2">
          {ALL_PLANS.map(id => {
            const m = PLAN_META[id]
            const count = results.filter(h => h.plans.includes(id)).length
            return (
              <button key={id} onClick={() => setPlanFilter(planFilter === id ? "" : id)}
                style={{ borderColor: planFilter === id ? m.color : "transparent", background: planFilter === id ? `${m.color}15` : "#f8fafc" }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 transition-all hover:shadow-sm">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }}/>
                <span className="text-xs font-bold text-slate-700">{m.short}</span>
                <span className="text-xs text-slate-400">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main content: list + map ── */}
      <div className={`${showMap ? "grid grid-cols-1 lg:grid-cols-2 gap-5" : ""}`}>

        {/* Hospital list */}
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl mb-4">🏥</span>
              <p className="font-semibold text-slate-700">No hospitals found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
              <button onClick={() => { setQuery(""); setCity(""); setPlanFilter(""); setTypeFilter("") }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {results.map(h => (
                <HospitalRow
                  key={h.id}
                  hospital={h}
                  isSelected={selectedId === h.id}
                  onClick={() => setSelectedId(selectedId === h.id ? null : h.id)}
                  highlightPlan={planFilter}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        {showMap && (
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 540 }}>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {city || "All Cities"} — {results.length} hospitals
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                  {Object.entries(HOSPITAL_TYPES).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: v.color }}/>
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ height: "calc(100% - 44px)" }}>
                <HospitalMap
                  hospitals={results}
                  selectedId={selectedId}
                  onSelect={id => setSelectedId(selectedId === id ? null : id)}
                />
              </div>
            </div>

            {/* selected hospital detail panel */}
            {selected && (
              <div className="mt-3 bg-white rounded-2xl border border-blue-200 shadow-sm p-4 scale-in">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-black text-slate-900">{selected.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{selected.area}, {selected.city} · {selected.beds} beds</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypePill type={selected.type} />
                    <button onClick={() => setSelectedId(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cashless coverage</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {ALL_PLANS.map(pid => {
                    const m = PLAN_META[pid]
                    const covered = selected.plans.includes(pid)
                    return (
                      <div key={pid}
                        style={covered ? { background: `${m.color}15`, borderColor: `${m.color}40` } : {}}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center ${
                          covered ? "" : "border-slate-100 bg-slate-50"
                        }`}>
                        <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: covered ? m.color : "#e2e8f0" }}/>
                        <span className="text-[9px] font-bold" style={{ color: covered ? m.color : "#94a3b8" }}>{m.abbr}</span>
                        <span className="text-[9px] text-slate-400">{covered ? "✓" : "✗"}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Disclaimer ── */}
      <div className="mt-5 flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          Network coverage is indicative based on published insurer network sizes. Always verify cashless empanelment
          directly with the hospital's billing desk or the insurer's app before admission.
          Hospital empanelment can change — this data was last updated June 2025.
        </p>
      </div>
    </div>
  )
}
