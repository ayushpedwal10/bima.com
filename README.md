# bima.com — Health Insurance Advisor

> Find health insurance that fits your life, budget, and coverage needs.

**bima.com** is an interactive health-insurance advisor for India. It turns a short profile into transparent premium estimates and ranked policy recommendations, then helps users compare benefits, hospitals, disease coverage, claims, tax savings, and more.

🌐 **Live app:** [bima-com.vercel.app](https://bima-com.vercel.app)

## Why bima.com?

Health insurance decisions are rarely simple. A plan can look affordable but have a long waiting period, limited hospital network, or missing coverage that matters to a family. bima.com puts those trade-offs in one understandable flow.

- Personalised recommendations instead of a generic plan list
- Clear, factor-by-factor premium explanations
- Useful comparison tools before a customer commits
- A local fallback engine so recommendations still work if the API is unavailable

## What it can do

| Capability | Highlights |
| --- | --- |
| Smart policy matching | Scores plans against age, family size, budget, life stage, health needs, and coverage priorities. |
| Premium calculator | Explains how age, BMI, smoking, location, health conditions, and family members affect the premium. |
| Policy comparisons | Compares cover, co-pay, claim settlement ratio, benefits, network size, and premium. |
| Coverage explorers | Check hospitals, diseases, maternity, mental-health cover, critical illness, portability, and upgrades. |
| Financial tools | Sum-insured guidance, tax calculator, premium projections, and what-if simulations. |
| Quote export | Generates downloadable quote PDFs from the browser. |

## Experience flow

```text
Profile wizard
     ↓
Premium calculation + policy scoring
     ↓
Ranked recommendations
     ↓
Compare, simulate, inspect coverage, and export a quote
```

## Tech stack

- **Frontend:** React 19, Vite, JavaScript, CSS, Tailwind utilities
- **Backend:** Python, Flask, Flask-CORS
- **Insurance logic:** Custom JavaScript and Python premium/recommendation engines
- **Visualisation:** Recharts, Leaflet, React Leaflet
- **PDF generation:** jsPDF and jsPDF-AutoTable
- **Deployment:** Vercel — Vite frontend and Flask Python Function in one project
- **Data:** Local JSON and CSV policy, insurer, hospital, claim, and customer datasets

## Architecture

```text
Browser
  │
  ├── React + Vite interface
  │      └── Local JS recommendation fallback
  │
  └── /api/*
         └── Flask API on Vercel
                ├── Premium calculator
                ├── Policy recommender
                └── Policy JSON data
```

The frontend calls `/api/quote` on the same domain. If the API cannot respond, it automatically uses the bundled JavaScript engine, so the recommendation experience remains available.

## Run locally

### Prerequisites

- Node.js 20+
- Python 3.12+

### 1. Start the Flask API

```bash
pip install -r requirements.txt
python api.py
```

The API runs at `http://localhost:5000`.

### 2. Start the React app

```bash
cd health-advisor
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

Vite proxies `/api/*` requests to the Flask server during local development.

### Optional: legacy Streamlit dashboard

```bash
pip install -r requirements-streamlit.txt
streamlit run app.py
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check for the Flask recommendation service. |
| `GET` | `/api/policies` | Returns available policy metadata. |
| `POST` | `/api/quote` | Calculates premiums and returns ranked policy recommendations. |

Example quote request:

```json
{
  "age": 28,
  "gender": "Female",
  "city": "Bangalore",
  "income": 800000,
  "members": 2,
  "budget": 2500,
  "bmi": 22,
  "smoker": false,
  "ped": false,
  "priority": "claims"
}
```

## Deploy on Vercel

This repository is ready for a unified Vercel deployment.

1. Import the repository into Vercel.
2. Keep the root directory at `./`.
3. Use the following commands:

   ```text
   Install: pip install -r requirements.txt && cd health-advisor && npm ci
   Build:   cd health-advisor && npm run build
   Output:  health-advisor/dist
   ```

4. Deploy. Vercel serves the React build and the Flask API from the same domain.

## Project structure

```text
.
├── api.py                    # Flask API and Vercel entry point
├── engine/                   # Python pricing and recommendation logic
├── data/                     # Policy, insurer, and demo customer data
├── health-advisor/           # React/Vite product interface
│   └── src/
│       ├── components/       # Advisor tools and recommendation views
│       ├── engine/           # Client-side fallback logic
│       ├── data/             # Coverage and hospital datasets
│       └── utils/            # PDF quote generator
├── vercel.json               # Build and serverless-function configuration
└── requirements.txt          # Flask runtime dependencies
```

## Important note

bima.com is an educational decision-support tool. Premiums, plan details, coverage conditions, and recommendations should be confirmed against an insurer's current policy wording and official quote before purchase.

---

Built to make health insurance easier to understand. 🏥
