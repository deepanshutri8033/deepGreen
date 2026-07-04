# DeepGreen — Frontend

AI-powered satellite auditing and corporate carbon credit verification platform (frontend demo).

**USP:** *We don't just read reports—we verify them against ground truth, automatically, without any manual satellite analyst.*

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** — page transitions, alert pulses, workflow animations
- **shadcn/ui-style components** — Button, Card, Badge, Slider, Tabs, Progress
- **Lucide React** — icons

## Getting Started

```bash
cd deepgreen
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page.

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the audit dashboard.

## Demo Workflow

1. **Landing page** — hero, features, architecture, workflow timeline
2. **Dashboard** — upload a PDF (any PDF works for demo)
3. Watch the **audit pipeline** animate through RAG parsing → satellite fetch → NDVI analysis
4. Use the **timeline slider** (2024–2026) to see canopy density decline
5. **Red alert panel** appears when anomaly is detected (−12% canopy vs. claims)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Main audit dashboard
│   └── globals.css           # DeepGreen dark emerald theme
├── components/
│   ├── ui/                   # shadcn-style primitives
│   └── deepgreen/            # Feature components
└── lib/
    ├── mock-data.ts          # Demo claims, NDVI data, compliance laws
    └── utils.ts
```

## Backend Integration (Future)

This is a **frontend-only** demo with mock data. Connect these UI events to your backend:

| UI Event | Backend Endpoint (suggested) |
|----------|------------------------------|
| PDF upload | `POST /api/reports/upload` |
| RAG findings | `GET /api/reports/{id}/claims` |
| Satellite tiles | `GET /api/satellite/ndvi?lat=&lng=&year=` |
| Alert dispatch | `POST /api/compliance/alert` |

## License

MIT
