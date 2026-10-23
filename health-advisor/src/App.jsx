import { useState, useEffect } from "react"
import { ShieldCheck, Bot, Sparkles, AlertCircle, ArrowRight } from "lucide-react"
import Wizard from "./components/Wizard"
import Results from "./components/Results"
import LandingPage from "./components/LandingPage"
import LoadingScreen from "./components/LoadingScreen"
import AICopilotDrawer from "./components/AICopilotDrawer"
import Logo from "./components/Logo"
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
        new Promise(resolve => setTimeout(resolve, 600)) // smooth actuarial computing transition
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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">

      {/* ─── Ambient Glow Blobs for Glassmorphism Depth ─── */}
      <div className="w-[500px] h-[500px] bg-blue-400/10 ambient-glow -top-32 -left-32 animate-pulseGlow" />
      <div className="w-[500px] h-[500px] bg-indigo-400/10 ambient-glow top-40 -right-32 animate-pulseGlow [animation-delay:3s]" />

      {/* ─── Institutional Glassmorphic Header ─── */}
      <header className="glass-panel sticky top-0 z-40 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Identity / Official Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-left hover:opacity-95 transition-all group"
              aria-label="bima.com home"
            >
              <Logo size="md" />
            </button>

            {/* Regulatory Verification Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 font-bold px-3 py-1 rounded-full ml-1 shadow-2xs backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              IRDAI Data Verified
            </div>

            {/* Engine Status Pill */}
            {apiOnline !== null && (
              <div className={`hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs ${
                apiOnline
                  ? "bg-blue-50/80 text-blue-700 border border-blue-200/80"
                  : "bg-slate-100/80 text-slate-600 border border-slate-200/80"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? "bg-blue-600 animate-ping" : "bg-slate-400"}`} />
                {apiOnline ? "Python Engine" : "Local Actuarial"}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Ask Copilot Header Button */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50/90 hover:bg-blue-100/90 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>Ask Copilot</span>
            </button>

            {screen === "landing" && (
              <button
                onClick={() => setScreen("wizard")}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/30 hover:scale-105 active:scale-95"
              >
                <span>Find My Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Consumer / Advisor Mode Switcher */}
            <div className="flex items-center bg-slate-200/60 backdrop-blur-xs border border-slate-200/80 rounded-xl p-0.5 text-xs font-semibold shadow-inner">
              <button
                onClick={() => setMode("customer")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mode === "customer"
                    ? "bg-white text-blue-700 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Consumer
              </button>
              <button
                onClick={() => setMode("agent")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mode === "agent"
                    ? "bg-white text-blue-700 shadow-2xs font-bold"
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
      <main className="flex-1 relative z-10">
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
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center glass-panel-elevated rounded-3xl p-8 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Calculation Error</h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">{errorMsg}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setScreen("wizard"); setErrorMsg("") }}
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xs"
                >
                  Return to Wizard
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-xs"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Floating Glassmorphic Copilot Launcher Pill (Hidden on Wizard to prevent overlapping the Next button!) ─── */}
      {screen !== "wizard" && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setCopilotOpen(true)}
            className="group flex items-center gap-3 px-4 py-3 bg-slate-950/90 hover:bg-blue-600 backdrop-blur-md text-white rounded-full shadow-2xl shadow-slate-950/30 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs font-black tracking-tight leading-none">bima.com Copilot</span>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-100 leading-none mt-1">
                Ask AI Advisor
              </span>
            </div>
          </button>
        </div>
      )}

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
