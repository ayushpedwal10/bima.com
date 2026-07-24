/**
 * Tooltip component — shows a "?" badge that reveals a plain-English explanation on hover/click.
 * Usage: <Tooltip term="Premium" /> or <Tooltip term="CSR" />
 */
import { useState, useRef, useEffect } from "react"

export const GLOSSARY = {
  "Premium": {
    short: "The amount you pay every month or year to keep your insurance active.",
    example: "Like a Netflix subscription — you pay ₹1,200/month to keep your health coverage active.",
    icon: "💰",
  },
  "Sum Insured": {
    short: "The maximum amount the insurance company will pay for your treatment in a year.",
    example: "If your Sum Insured is ₹5 lakh, the insurer pays up to ₹5 lakh for hospital bills in that year.",
    icon: "🏥",
  },
  "Copay": {
    short: "The percentage of the hospital bill YOU have to pay, even after insurance.",
    example: "If copay is 20% and your bill is ₹1 lakh, you pay ₹20,000 and insurance pays ₹80,000. Zero copay means the insurer pays 100%.",
    icon: "✂️",
  },
  "Claims Paid %": {
    short: "Out of every 100 people who made a claim, how many actually got paid.",
    example: "99% means if 100 people filed claims, 99 got their money. Higher is better.",
    icon: "🛡️",
  },
  "CSR": {
    short: "Claim Settlement Ratio — same as Claims Paid %. How reliable the insurer is when you need them.",
    example: "IRDAI publishes this number every year for all insurance companies in India.",
    icon: "📊",
  },
  "PED": {
    short: "Pre-Existing Disease — any health condition you already had before buying the insurance.",
    example: "If you have diabetes or high BP before buying the policy, those are your PEDs. Most plans only cover them after a waiting period of 2–4 years.",
    icon: "💊",
  },
  "Waiting Period": {
    short: "A time period after buying the policy during which you cannot make claims for certain conditions.",
    example: "If your plan has a 3-year PED waiting period, you must wait 3 years before claiming for diabetes treatment.",
    icon: "⏳",
  },
  "Cashless": {
    short: "You get treated at the hospital without paying cash — the insurer pays the hospital directly.",
    example: "You go to a network hospital, show your insurance card, and leave without paying the bill. The insurer settles it.",
    icon: "🤝",
  },
  "Network Hospital": {
    short: "Hospitals that have a tie-up with your insurer for cashless treatment.",
    example: "If your plan covers 13,000 network hospitals, you can get cashless treatment at any of those hospitals.",
    icon: "🏨",
  },
  "NCB": {
    short: "No Claim Bonus — your sum insured increases every year you don't make a claim, as a reward.",
    example: "If NCB is 50% and you don't claim for 1 year, your ₹5 lakh coverage becomes ₹7.5 lakh — at no extra cost.",
    icon: "🎁",
  },
  "Room Rent Limit": {
    short: "The maximum daily room rent the insurer will pay at the hospital.",
    example: "If the limit is ₹3,000/day and you pick a room costing ₹6,000/day, you pay the difference out of pocket. 'No limit' means any room is covered.",
    icon: "🛏️",
  },
  "Restore": {
    short: "If you use up your entire sum insured in a year, the insurer refills it so you can claim again.",
    example: "Your ₹5 lakh cover is used up. With restore, it's topped back up to ₹5 lakh automatically — great for families.",
    icon: "��",
  },
  "OPD": {
    short: "Outpatient Department — doctor visits, consultations, and medicines without being admitted to hospital.",
    example: "Visiting a doctor for fever or getting medicines — if your plan covers OPD, those costs are reimbursed too.",
    icon: "🩺",
  },
  "AYUSH": {
    short: "Ayurveda, Yoga, Unani, Siddha, Homeopathy — traditional Indian medicine systems.",
    example: "If covered, your Ayurvedic hospital stay or Homeopathic treatment is included in your insurance.",
    icon: "🌿",
  },
  "Floater": {
    short: "A single insurance plan that covers your entire family under one shared sum insured.",
    example: "A ₹10 lakh family floater covers you, your spouse, and kids. Any family member can use up to ₹10 lakh.",
    icon: "👨‍👩‍👧",
  },
  "Loading": {
    short: "An extra charge added to your premium because of higher health risk (smoking, obesity, pre-existing disease).",
    example: "A smoker may pay 20% more than a non-smoker for the exact same plan.",
    icon: "📈",
  },
  "IRDAI": {
    short: "Insurance Regulatory and Development Authority of India — the government body that regulates all insurers.",
    example: "Like SEBI for the stock market, IRDAI ensures insurance companies follow rules and pay claims fairly.",
    icon: "🏛️",
  },
  "Daycare Procedure": {
    short: "Medical procedures that take less than 24 hours but are still covered by insurance.",
    example: "Cataract surgery, chemotherapy sessions, dialysis — these take a few hours but are covered as hospitalisation.",
    icon: "⏱️",
  },
  "Critical Illness": {
    short: "A separate lump-sum payout if you're diagnosed with a serious disease like cancer or heart attack.",
    example: "If diagnosed with cancer, you receive ₹10 lakh in cash directly — regardless of actual hospital bills.",
    icon: "❤️‍🩹",
  },
  "Match Score": {
    short: "Our score (out of 100) showing how well this plan fits your specific profile and needs.",
    example: "A score of 85 means this plan covers almost everything you asked for, at a price that fits your budget.",
    icon: "🎯",
  },
}

export default function Tooltip({ term, children, align = "center" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const info = GLOSSARY[term]
  if (!info) return children || null

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-1 relative"
      onClick={e => e.stopPropagation()}
    >
      {children && <span>{children}</span>}
      <button
        type="button"
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(o => !o) }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 hover:bg-blue-200 text-slate-500 hover:text-blue-700 text-[10px] font-black transition-all flex-shrink-0 cursor-help"
        aria-label={`What is ${term}?`}
      >?</button>

      {open && (
        <div
          className={`absolute bottom-full mb-2 z-50 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-left pointer-events-none ${
            align === "right" ? "right-0" : align === "left" ? "left-0" : "left-1/2 -translate-x-1/2"
          }`}
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.12))" }}
        >
          {/* arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45" />
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{info.icon}</span>
            <p className="font-black text-slate-900 text-sm">{term}</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">{info.short}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Example:</strong> {info.example}
            </p>
          </div>
        </div>
      )}
    </span>
  )
}
