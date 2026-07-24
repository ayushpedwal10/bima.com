import { useState } from "react"
import { GLOSSARY } from "./Tooltip"

export default function GlossaryModal({ onClose }) {
  const [search, setSearch] = useState("")
  const entries = Object.entries(GLOSSARY).filter(([term]) =>
    term.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Insurance Glossary</h2>
              <p className="text-sm text-slate-400 mt-0.5">Plain-English explanations for every term on this site</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          {/* search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input type="text" placeholder="Search terms…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
        </div>

        {/* list */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="font-semibold">No terms found</p>
            </div>
          ) : entries.map(([term, info]) => (
            <div key={term} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-slate-200 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{info.icon}</span>
                <h3 className="font-black text-slate-900">{term}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">{info.short}</p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Example:</strong> {info.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            {entries.length} of {Object.keys(GLOSSARY).length} terms shown
          </p>
        </div>
      </div>
    </div>
  )
}
