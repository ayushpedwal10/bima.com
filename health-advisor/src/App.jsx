import { useState, useEffect } from "react"
import Wizard from "./components/Wizard"
import Results from "./components/Results"
import LandingPage from "./components/LandingPage"
import LoadingScreen from "./components/LoadingScreen"
import { getQuote, checkAPIHealth } from "./api/quoteClient"

export default function App() {
  const [screen,    setScreen]    = useState("landing") // "landing" | "wizard" | "results" | "error"
  const [results,   setResults]   = useState(null)
  const [mode,      setMode]      = useState("customer")
  const [loading,   setLoading]   = useState(false)
  const [apiOnline, setApiOnline] = useState(null)
  const [errorMsg,  setErrorMsg]  = useState("")

  useEffect(() => {
    checkAPIHealth().then(online => setApiOnline(online))
  }, [])

  async function handleSubmit(profile) {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 0))
    try {
      const [quote] = await Promise.all([
        getQuote(profile),
        new Promise(resolve => setTimeout(resolve, 1800))
      ])
      setResults(quote)
      setScreen("results")
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong while calculating your plans.")
      setScreen("error")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResults(null)
    setScreen("landing")
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 60 }}>
          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-600/30">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-bold text-slate-900 text-lg tracking-tight">bima</span>
                <span className="font-bold text-blue-600 text-lg">.com</span>
              </div>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold px-2.5 py-1 rounded-full ml-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              IRDAI Verified
            </div>
            {apiOnline !== null && (
              <div className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ml-1 ${
                apiOnline ? "bg-violet-50 text-violet-700 border border-violet-200/80" : "bg-slate-100 text-slate-400 border border-slate-200/80"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? "bg-violet-500 animate-pulse" : "bg-slate-300"}`}/>
                {apiOnline ? "Python Engine" : "JS Engine"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {screen === "landing" && (
              <button onClick={() => setScreen("wizard")}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20">
                Get Started →
              </button>
            )}
            <div className="hidden sm:flex items-center gap-4 mr-2">
              <span className="text-xs text-slate-400 font-medium">10 plans</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"/>
              <span className="text-xs text-slate-400 font-medium">43,661 data points</span>
            </div>
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-1">
              {["customer","agent"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === m ? "bg-white text-blue-600 shadow-sm shadow-slate-200" : "text-slate-500 hover:text-slate-700"
                  }`}>
                  {m === "customer" ? "Customer" : "Agent"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Loading overlay ── */}
      {loading && <LoadingScreen apiOnline={apiOnline} />}

      {/* ── Screens ── */}
      {screen === "landing"  && <LandingPage onStart={() => setScreen("wizard")} />}
      {screen === "wizard"   && <Wizard onSubmit={handleSubmit} mode={mode} />}
      {screen === "results"  && results && <Results results={results} onReset={handleReset} mode={mode} />}
      {screen === "error"    && (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-5">😕</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 text-sm mb-2 leading-relaxed">{errorMsg}</p>
            <p className="text-slate-400 text-xs mb-6">
              This is usually a temporary issue. Your inputs are not lost — try again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => { setScreen("wizard"); setErrorMsg("") }}
                className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
                Try Again
              </button>
              <button onClick={handleReset}
                className="px-6 py-3 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-white transition-all">
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
