const BRANDS = {
  "HDFC ERGO":          { initials: "HE", bg: "#004C8F" },
  "Niva Bupa":          { initials: "NB", bg: "#E4002B" },
  "Star Health":        { initials: "SH", bg: "#F7941D" },
  "Care Health":        { initials: "CH", bg: "#00A651" },
  "Aditya Birla Health":{ initials: "AB", bg: "#E31837" },
  "ICICI Lombard":      { initials: "IL", bg: "#F58220" },
  "Bajaj Allianz":      { initials: "BA", bg: "#003087" },
  "Tata AIG":           { initials: "TA", bg: "#1C2B6E" },
  "Reliance General":   { initials: "RG", bg: "#0072BC" },
}

const SIZES = {
  sm: { box: 28, font: 10, radius: 8  },
  md: { box: 36, font: 12, radius: 10 },
  lg: { box: 48, font: 14, radius: 14 },
  xl: { box: 64, font: 18, radius: 18 },
}

export default function InsurerLogo({ provider, size = "md" }) {
  const brand = BRANDS[provider] ?? {
    initials: (provider || "??").slice(0, 2).toUpperCase(),
    bg: "#64748b",
  }
  const s = SIZES[size] || SIZES.md

  return (
    <div
      style={{
        width: s.box, height: s.box,
        borderRadius: s.radius,
        background: brand.bg,
        fontSize: s.font,
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, color: "#fff",
        letterSpacing: "0.03em",
        boxShadow: `0 2px 8px ${brand.bg}40`,
      }}>
      {brand.initials}
    </div>
  )
}
