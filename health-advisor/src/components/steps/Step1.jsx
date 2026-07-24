import Tooltip from "../Tooltip"

const SEGMENTS = [
  { id: "student",            label: "Student",           icon: "🎓", desc: "Age 18–25, first plan",      bg: "#f5f3ff", border: "#a78bfa", text: "#6d28d9", check: "#7c3aed" },
  { id: "young_professional", label: "Young Professional",icon: "💼", desc: "Working & single",            bg: "#eff6ff", border: "#60a5fa", text: "#1d4ed8", check: "#2563eb" },
  { id: "couple",             label: "Couple",            icon: "💑", desc: "Married, no children",        bg: "#fdf2f8", border: "#f472b6", text: "#9d174d", check: "#db2777" },
  { id: "family",             label: "Family",            icon: "👨‍👩‍👧",desc: "With children",             bg: "#f0fdf4", border: "#4ade80", text: "#166534", check: "#16a34a" },
  { id: "senior",             label: "Senior Citizen",    icon: "👴", desc: "Age 55+",                    bg: "#fffbeb", border: "#fbbf24", text: "#92400e", check: "#d97706" },
]

const CITIES = ["New Delhi","Hyderabad","Chennai","Bangalore","Mumbai","Kolkata","Ahmedabad","Pune","Other"]

const INCOME_OPTIONS = [
  { label: "Under ₹3 lakh",  value: 250000 },
  { label: "₹3 – 6 lakh",   value: 450000 },
  { label: "₹6 – 12 lakh",  value: 900000 },
  { label: "₹12 – 25 lakh", value: 1850000 },
  { label: "Over ₹25 lakh", value: 3000000 },
]

const BUDGET_STEPS = [500, 750, 1000, 1500, 2000, 3000, 5000, 8000, 12000, 20000]

function Label({ children, hint }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{children}</span>
      {hint && <span className="text-[10px] text-slate-400 font-medium">{hint}</span>}
    </div>
  )
}

function Field({ children }) {
  return <div>{children}</div>
}

function NumberInput({ ...props }) {
  return (
    <input type="number" {...props}
      className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-semibold text-slate-800
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        hover:border-slate-300 transition-all" />
  )
}

function Dropdown({ value, onChange, children }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange}
        className="w-full h-11 appearance-none bg-white border border-slate-200 rounded-xl px-4 pr-10 text-sm font-semibold text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          hover:border-slate-300 transition-all cursor-pointer">
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  )
}

export default function Step1({ data, update, mode }) {
  const active = data.isStudent ? "student"
    : data.age >= 60 ? "senior"
    : (data.members >= 3 || data.hasChildren) ? "family"
    : data.members === 2 ? "couple"
    : "young_professional"

  function selectSegment(id) {
    if (id === "student")            update({ isStudent: true,  members: 1, hasChildren: false, age: Math.min(data.age, 25) })
    else if (id === "senior")        update({ isStudent: false, age: Math.max(data.age, 60) })
    else if (id === "couple")        update({ isStudent: false, members: 2, hasChildren: false })
    else if (id === "family")        update({ isStudent: false, members: Math.max(data.members, 3), hasChildren: true })
    else                             update({ isStudent: false, members: 1, hasChildren: false })
  }

  const budgetIdx  = BUDGET_STEPS.reduce((b, v, i) => Math.abs(v - data.budget) < Math.abs(BUDGET_STEPS[b] - data.budget) ? i : b, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* header */}
      <div>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Step 1 of 3</p>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Who are you buying for?</h2>
        <p className="text-slate-400 mt-1.5">Pick your life stage — we'll tailor every recommendation to fit.</p>
      </div>

      {/* ── Beginner hint ── */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl">
        <span className="text-xl flex-shrink-0">💡</span>
        <div className="text-xs text-indigo-800 leading-relaxed space-y-1">
          <p><strong>First time buying health insurance?</strong> Here's what you're doing in 3 steps:</p>
          <p>1️⃣ Tell us who you are &nbsp;→&nbsp; 2️⃣ Share your health &nbsp;→&nbsp; 3️⃣ Pick what you need — we'll find the best plan for you.</p>
          <p>Throughout, tap the <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-black mx-0.5">?</span> badge next to any term to get a plain-English explanation.</p>
        </div>
      </div>

      {/* ── Life stage tiles ── */}
      <div className="grid grid-cols-5 gap-4">
        {SEGMENTS.map(s => {
          const sel = active === s.id
          return (
            <button key={s.id} type="button" onClick={() => selectSegment(s.id)}
              style={sel ? { background: s.bg, borderColor: s.border } : {}}
              className={`relative flex flex-col items-center text-center gap-3 py-6 px-3 rounded-2xl border-2 transition-all duration-150 ${
                sel
                  ? "shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}>
              {/* checkmark badge */}
              {sel && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: s.check }}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              )}
              <span className="text-4xl leading-none">{s.icon}</span>
              <div>
                <p className="text-sm font-bold leading-tight" style={sel ? { color: s.text } : { color: "#334155" }}>
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Details card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 pt-5 pb-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Details</p>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          <Field>
            <Label hint="18 – 80">Age</Label>
            <NumberInput min={18} max={80} value={data.age} onChange={e => update({ age: +e.target.value })} />
          </Field>

          <Field>
            <Label>Gender</Label>
            <Dropdown value={data.gender} onChange={e => update({ gender: e.target.value })}>
              {["Male","Female","Other"].map(g => <option key={g}>{g}</option>)}
            </Dropdown>
          </Field>

          <Field>
            <Label>City</Label>
            <Dropdown value={data.city} onChange={e => update({ city: e.target.value })}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </Dropdown>
          </Field>

          <Field>
            <Label hint="1 – 8">Members to Cover</Label>
            <NumberInput min={1} max={8} value={data.members} onChange={e => update({ members: +e.target.value })} />
          </Field>

          <div className="col-span-2">
            <Label>Annual Income</Label>
            <Dropdown value={data.income} onChange={e => update({ income: +e.target.value })}>
              {INCOME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Dropdown>
          </div>

          <div className="col-span-2">
            {/* budget slider */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                Monthly Budget <Tooltip term="Premium" />
              </span>
              <span className="text-sm font-black text-blue-600">₹{data.budget.toLocaleString()} / mo</span>
            </div>
            <input type="range" min={0} max={BUDGET_STEPS.length - 1} step={1} value={budgetIdx}
              onChange={e => update({ budget: BUDGET_STEPS[+e.target.value] })}
              className="w-full accent-blue-600 cursor-pointer h-2 rounded-full" />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium select-none">
              <span>₹500</span><span>₹2,000</span><span>₹5,000</span><span>₹12,000+</span>
            </div>
          </div>
        </div>
      </div>

      {mode === "agent" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <Label>Agent Notes</Label>
          <textarea value={data.agentNotes} onChange={e => update({ agentNotes: e.target.value })}
            rows={2} placeholder="Notes about this customer…"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all mt-1.5" />
        </div>
      )}

      {/* dataset note */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-2xl">
        <span className="text-xl">📊</span>
        <p className="text-xs text-slate-600 leading-relaxed">
          Recommendations based on <strong className="text-slate-800">43,661 real Indian health insurance policies</strong>.
          New Delhi (7,271), Hyderabad (5,190), and Chennai (4,418) are the top markets.
        </p>
      </div>
    </div>
  )
}
