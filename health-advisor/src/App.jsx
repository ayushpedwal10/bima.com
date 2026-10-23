import { useState, useEffect } from "react"
import { ShieldCheck, Bot, Sparkles, MessageSquare, AlertCircle } from "lucide-react"
import Wizard from "./components/Wizard"
import Results from "./components/Results"
import LandingPage from "./components/LandingPage"
import LoadingScreen from "./components/LoadingScreen"
import AICopilotDrawer from "./components/AICopilotDrawer"
import { getQuote, checkAPIHealth } from "./api/quoteClient"

export default function App() {
  const [screen, setScreen] = useState("landing") // "landing" | "wizard" | "results" | "error"
  const [results, setResults] = useState(null)
  const [mode, setMode] = useState("customer") // "customer" | "agent"
  const [loading, setLoading] = useState(false)
  const [apiOnline, setApiOnline] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [copilotOpen, setCopilotOpen] = useState(false)

  useEffect(() => {
    checkAPIHealth().then(online => setApiOnline(online))
  }, [])

  async function handleSubmit(profile) {
    setLoading(true)
    try {
      const [quote] = await Promise.all([
        getQuote(profile),
        new Promise(resolve => setTimeout(resolve, 600)) // fast & responsive transition
      ])
      setResults(quote)
      setScreen("results")
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong while evaluating policies.")
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* ─── Institutional Navigation Header ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-950 text-base leading-none tracking-tight">
                  BeemaSaathi
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                  Health Insurance Advisory
                </span>
              </div>
            </button>

            {/* Regulatory Verification Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold px-2.5 py-1 rounded-full ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              IRDAI Verified
            </div>

            {/* Engine Status Pill */}
            {apiOnline !== null && (
              <div className={`hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                apiOnline
                  ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                  : "bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? "bg-blue-600 animate-pulse" : "bg-slate-400"}`} />
                {apiOnline ? "Python Engine" : "Local Engine"}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Ask Copilot Header Button */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Ask</span> Copilot
            </button>

            {screen === "landing" && (
              <button
                onClick={() => setScreen("wizard")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs"
              >
                Start Matching →
              </button>
            )}

            {/* User / Agent Mode Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl p-0.5 text-xs font-semibold">
              <button
                onClick={() => setMode("customer")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mode === "customer"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Consumer
              </button>
              <button
                onClick={() => setMode("agent")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mode === "agent"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Advisor
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* ─── Loading Overlay ─── */}
      {loading && <LoadingScreen apiOnline={apiOnline} />}

      {/* ─── Screen Router ─── */}
      <main className="flex-1">
        {screen === "landing" && (
          <LandingPage
            onStart={() => setScreen("wizard")}
            onOpenCopilot={() => setCopilotOpen(true)}
          />
        )}
        {screen === "wizard" && (
          <Wizard
            onSubmit={handleSubmit}
            mode={mode}
            onOpenCopilot={() => setCopilotOpen(true)}
          />
        )}
        {screen === "results" && results && (
          <Results
            results={results}
            onReset={handleReset}
            mode={mode}
            onOpenCopilot={() => setCopilotOpen(true)}
          />
        )}
        {screen === "error" && (
          <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Calculation Error</h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">{errorMsg}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setScreen("wizard"); setErrorMsg("") }}
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
                >
                  Return to Wizard
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Floating Copilot Launcher Pill ─── */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setCopilotOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 transition-all active:scale-95 border border-slate-700/60"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-none">Saathi Copilot</span>
            <span className="text-[10px] text-slate-300 group-hover:text-blue-100 leading-none mt-1">
              Ask AI Advisor
            </span>
          </div>
        </button>
      </div>

      {/* ─── AI Copilot Slide-over Drawer ─── */}
      <AICopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        results={results}
        currentScreen={screen}
      />

    </div>
  )
}
