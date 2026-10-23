import { Shield, Sparkles } from "lucide-react"

/**
 * Modern institutional Logo component for bima.com
 * Supports sizes: "sm" | "md" | "lg" | "hero"
 * Supports theme: "light" (dark background) | "dark" (light background)
 */
export default function Logo({
  size = "md",
  showBadge = true,
  showTagline = true,
  light = false,
  className = ""
}) {
  const iconSizeClass = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-9 h-9 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
    hero: "w-14 h-14 rounded-2xl sm:w-16 sm:h-16 sm:rounded-3xl",
  }[size] || "w-9 h-9 rounded-xl"

  const svgSize = {
    sm: 16,
    md: 20,
    lg: 24,
    hero: 32,
  }[size] || 20

  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    hero: "text-2xl sm:text-3xl",
  }[size] || "text-base"

  const taglineSize = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
    hero: "text-xs sm:text-sm",
  }[size] || "text-[11px]"

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      
      {/* ─── Premium Glassmorphic Brand Mark / Icon ─── */}
      <div className={`relative flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-600/25 ring-1 ring-white/30 transition-transform duration-300 hover:scale-105 ${iconSizeClass}`}>
        
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-white/0 via-white/20 to-white/40 pointer-events-none" />

        {/* Custom Vector Shield + Pulse Geometry */}
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 text-white drop-shadow-xs"
        >
          {/* Protective Shield Outline */}
          <path
            d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-95"
          />
          {/* Internal Actuarial Pulse Line */}
          <path
            d="M8.5 12H10.5L12 9.5L13.5 14.5L15 12H16"
            stroke="#67e8f9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Spark Dot */}
          <circle cx="12" cy="6" r="1.25" fill="#ffffff" />
        </svg>

        {/* Outer ambient glow */}
        <div className="absolute -inset-1 rounded-[inherit] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 blur-xs -z-10 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* ─── Typography & Wordmark ─── */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${light ? "text-white" : "text-slate-950"} ${textSize}`}>
            bima<span className="text-blue-600">.com</span>
          </span>

          {showBadge && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI</span>
            </span>
          )}
        </div>

        {showTagline && (
          <span className={`font-semibold tracking-tight mt-1 leading-none ${light ? "text-slate-300" : "text-slate-400"} ${taglineSize}`}>
            Health Insurance Advisory
          </span>
        )}
      </div>

    </div>
  )
}
