import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const BLUE  = [37, 99, 235]   // blue-600
const DARK  = [15, 23, 42]    // slate-900
const GRAY  = [100, 116, 139] // slate-500
const LIGHT = [248, 250, 252] // slate-50
const GREEN = [5, 150, 105]   // emerald-600
const RED   = [220, 38, 38]

function addPageHeader(doc, pageNum, totalPages) {
  // Blue top bar
  doc.setFillColor(...BLUE)
  doc.rect(0, 0, 210, 14, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("bima.com", 14, 9)
  doc.setFont("helvetica", "normal")
  doc.text("Personalised Health Insurance Quote", 70, 9)
  doc.text(`Page ${pageNum} of ${totalPages}`, 196, 9, { align: "right" })
}

function addPageFooter(doc) {
  const y = 287
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(14, y, 196, y)
  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.setFont("helvetica", "normal")
  doc.text("All premiums are indicative and include applicable loadings. GST @ 18% is additional.", 14, y + 4)
  doc.text("Claims Paid % sourced from IRDAI Handbook of Indian Insurance Statistics (FY 2023-24 & FY 2024-25 average).", 14, y + 8)
  doc.text("This is not a policy document. Please read the policy wordings before purchase.", 14, y + 12)
}

export function generateQuotePDF(results) {
  const { ranked, premiumMap, profile } = results
  const top3 = ranked.slice(0, 3)
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })

  // ─── PAGE 1: Cover + Profile + Top 3 Summary ───────────────────────────────
  addPageHeader(doc, 1, 3)

  // Title section
  doc.setFillColor(...LIGHT)
  doc.rect(0, 14, 210, 40, "F")

  doc.setTextColor(...DARK)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("Your Personalised Health Insurance Quote", 14, 30)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...GRAY)
  doc.text(`Generated on ${today}  ·  Based on your profile  ·  IRDAI-verified data`, 14, 38)

  // IRDAI badge
  doc.setFillColor(5, 150, 105)
  doc.roundedRect(14, 43, 52, 7, 2, 2, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("✓  IRDAI Verified Data", 17, 47.5)

  // Profile summary box
  let y = 62
  doc.setFillColor(239, 246, 255)
  doc.setDrawColor(191, 219, 254)
  doc.setLineWidth(0.4)
  doc.roundedRect(14, y, 182, 32, 3, 3, "FD")

  doc.setTextColor(...BLUE)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("YOUR PROFILE", 18, y + 7)

  const profileItems = [
    ["Age", `${profile.age} years`],
    ["City", profile.city],
    ["Members", `${profile.members}`],
    ["Budget", `₹${profile.budget.toLocaleString("en-IN")}/month`],
    ["BMI", `${profile.bmi}`],
    ["Smoker", profile.smoker ? "Yes" : "No"],
    ["Pre-existing Disease", profile.ped ? "Yes" : "No"],
    ["Priority", profile.priority === "claims" ? "Claim Reliability" : profile.priority === "price" ? "Lowest Price" : "Max Coverage"],
  ]

  doc.setFontSize(8)
  profileItems.forEach(([k, v], i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const x = 18 + col * 46
    const py = y + 14 + row * 9
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...GRAY)
    doc.text(k + ":", x, py)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...DARK)
    doc.text(v, x + 22, py)
  })

  // Top 3 plans heading
  y = 102
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...DARK)
  doc.text("Top 3 Recommended Plans", 14, y)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...GRAY)
  doc.text("Ranked by match score based on your profile, budget, and priorities", 14, y + 6)

  y += 14

  const rankLabels = ["#1 Best Match", "#2", "#3"]
  const rankColors = [[255, 215, 0], [192, 192, 192], [205, 127, 50]]

  top3.forEach((r, idx) => {
    const p = r.policy
    const pr = premiumMap[p.id]
    const boxH = 42
    const isFirst = idx === 0

    // Card background
    doc.setFillColor(isFirst ? 239 : 248, isFirst ? 246 : 250, isFirst ? 255 : 252)
    doc.setDrawColor(isFirst ? 191 : 226, isFirst ? 219 : 232, isFirst ? 254 : 240)
    doc.setLineWidth(isFirst ? 0.6 : 0.3)
    doc.roundedRect(14, y, 182, boxH, 3, 3, "FD")

    // Rank badge
    doc.setFillColor(...rankColors[idx])
    doc.roundedRect(18, y + 4, 28, 6, 1.5, 1.5, "F")
    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(50, 50, 50)
    doc.text(rankLabels[idx], 32, y + 8.5, { align: "center" })

    // Policy name
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...DARK)
    doc.text(p.name, 18, y + 18)

    // Provider
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...GRAY)
    doc.text(p.provider, 18, y + 24)

    // Score badge
    if (isFirst) doc.setFillColor(...BLUE)
    else doc.setFillColor(100, 116, 139)
    doc.roundedRect(18, y + 28, 22, 7, 1.5, 1.5, "F")
    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text(`Score: ${r.score}`, 29, y + 33, { align: "center" })

    // Key metrics — right side
    const metrics = [
      { label: "Monthly Premium", val: `₹${pr.monthly.toLocaleString("en-IN")}` },
      { label: "Annual (excl. GST)", val: `₹${pr.annual.toLocaleString("en-IN")}` },
      { label: "Coverage", val: `₹${(p.coverage / 100000).toFixed(0)} Lakh` },
      { label: "Claims Paid %", val: `${p.csr}%` },
      { label: "Hospitals", val: `${(p.features.hospitals / 1000).toFixed(0)}K+` },
      { label: "Copay", val: p.copay === 0 ? "Zero" : `${p.copay}%` },
    ]

    metrics.forEach((m, mi) => {
      const col = mi % 3
      const row = Math.floor(mi / 3)
      const mx = 90 + col * 36
      const my = y + 10 + row * 14
      doc.setFontSize(7)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...GRAY)
      doc.text(m.label, mx, my)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      if (m.label === "Claims Paid %") {
        if (p.csr >= 95) doc.setTextColor(...GREEN)
        else if (p.csr >= 90) doc.setTextColor(...BLUE)
        else doc.setTextColor(...RED)
      } else {
        doc.setTextColor(...DARK)
      }
      doc.text(m.val, mx, my + 5)
    })

    y += boxH + 5
  })

  addPageFooter(doc)

  // ─── PAGE 2: Detailed Plan Comparison Table ─────────────────────────────────
  doc.addPage()
  addPageHeader(doc, 2, 3)

  y = 24
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...DARK)
  doc.text("Detailed Plan Comparison", 14, y)

  y += 8

  const tableHead = [["Feature", ...top3.map(r => r.policy.name)]]
  const bool = v => v ? "✓" : "✗"

  const tableBody = [
    ["Provider",          ...top3.map(r => r.policy.provider)],
    ["Monthly Premium",   ...top3.map(r => `₹${premiumMap[r.policy.id].monthly.toLocaleString("en-IN")}`)],
    ["Annual Premium",    ...top3.map(r => `₹${premiumMap[r.policy.id].annual.toLocaleString("en-IN")}`)],
    ["GST (18%)",         ...top3.map(r => `₹${premiumMap[r.policy.id].gst?.toLocaleString("en-IN") ?? "—"}`)],
    ["Sum Insured",       ...top3.map(r => `₹${(r.policy.coverage / 100000).toFixed(0)} Lakh`)],
    ["Copay",             ...top3.map(r => r.policy.copay === 0 ? "Zero ✓" : `${r.policy.copay}%`)],
    ["Room Rent",         ...top3.map(r => r.policy.roomRent)],
    ["Restore Benefit",   ...top3.map(r => r.policy.restore)],
    ["PED Waiting Period",...top3.map(r => r.policy.pedWait === 0 ? "Day 1 ✓" : `${r.policy.pedWait} months`)],
    ["Network Hospitals", ...top3.map(r => `${(r.policy.features.hospitals / 1000).toFixed(0)}K+`)],
    ["Claims Paid %",     ...top3.map(r => `${r.policy.csr}% (IRDAI)`)],
    ["Match Score",       ...top3.map(r => `${r.score}/100`)],
    ["─── Coverage ───",  "", "", ""],
    ["Hospitalisation",   ...top3.map(r => bool(r.policy.features.hospitalization))],
    ["OPD / Outpatient",  ...top3.map(r => bool(r.policy.features.outpatient))],
    ["Maternity",         ...top3.map(r => bool(r.policy.features.maternity))],
    ["Mental Health",     ...top3.map(r => bool(r.policy.features.mental_health))],
    ["Critical Illness",  ...top3.map(r => bool(r.policy.features.critical))],
    ["Robotic Surgery",   ...top3.map(r => bool(r.policy.features.robotic))],
    ["International",     ...top3.map(r => bool(r.policy.features.international))],
    ["AYUSH",             ...top3.map(r => bool(r.policy.features.ayush))],
    ["No-Claim Bonus",    ...top3.map(r => `${r.policy.features.ncb}%`)],
  ]

  autoTable(doc, {
    startY: y,
    head: tableHead,
    body: tableBody,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 3, textColor: [...DARK] },
    headStyles: { fillColor: [...BLUE], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [...LIGHT], textColor: [...GRAY], cellWidth: 48 },
      1: { cellWidth: 46 },
      2: { cellWidth: 46 },
      3: { cellWidth: 46 },
    },
    didParseCell(data) {
      if (data.section === "body") {
        const val = String(data.cell.raw)
        if (val === "✓") { data.cell.styles.textColor = [...GREEN]; data.cell.styles.fontStyle = "bold" }
        if (val === "✗") { data.cell.styles.textColor = [...RED] }
        if (val.includes("Day 1")) { data.cell.styles.textColor = [...GREEN]; data.cell.styles.fontStyle = "bold" }
        if (data.row.raw[0]?.includes("───")) {
          data.cell.styles.fillColor = [226, 232, 240]
          data.cell.styles.fontStyle = "bold"
          data.cell.styles.textColor = [...GRAY]
        }
      }
    },
  })

  addPageFooter(doc)

  // ─── PAGE 3: Claim Rejection Risks + Why It Suits You ───────────────────────
  doc.addPage()
  addPageHeader(doc, 3, 3)

  y = 24
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...DARK)
  doc.text("Claim Risks & Why Each Plan Suits You", 14, y)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...GRAY)
  doc.text("Based on IRDAI records, insurer policy wordings, and Insurance Ombudsman reports", 14, y + 6)

  y += 14

  top3.forEach((r, idx) => {
    if (y > 240) { doc.addPage(); addPageHeader(doc, 3, 3); y = 24 }

    const p = r.policy
    const pr = premiumMap[p.id]

    // Section header
    doc.setFillColor(...BLUE)
    doc.rect(14, y, 182, 8, "F")
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text(`${idx + 1}. ${p.name}  (${p.provider})  —  ₹${pr.monthly.toLocaleString("en-IN")}/month`, 18, y + 5.5)
    y += 12

    // Reasons it suits you
    if (r.reasons.length > 0) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...GREEN)
      doc.text("Why it suits you:", 18, y)
      y += 5
      r.reasons.slice(0, 3).forEach(reason => {
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...DARK)
        doc.text(`  ✓  ${reason}`, 18, y)
        y += 5
      })
    }

    // Warnings
    if (r.warnings.length > 0) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...RED)
      doc.text("Watch out for:", 18, y)
      y += 5
      r.warnings.slice(0, 2).forEach(w => {
        doc.setFont("helvetica", "normal")
        doc.setTextColor(180, 60, 60)
        doc.text(`  ⚠  ${w}`, 18, y)
        y += 5
      })
    }

    y += 6
  })

  // Final note
  doc.setFillColor(239, 246, 255)
  doc.setDrawColor(191, 219, 254)
  doc.roundedRect(14, y, 182, 22, 3, 3, "FD")
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...BLUE)
  doc.text("Important Note", 18, y + 7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...DARK)
  doc.text("Premiums shown are indicative base rates from insurer published rate cards (2024-25) with applicable loadings.", 18, y + 13)
  doc.text("Final premium may vary. GST @ 18% is additional. Always read the policy document before purchase.", 18, y + 18)

  addPageFooter(doc)

  // Save
  const filename = `bima.com_Quote_${profile.city}_Age${profile.age}_${today.replace(/ /g, "_")}.pdf`
  doc.save(filename)
}
