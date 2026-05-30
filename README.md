# AI Business Growth OS

**Live Repo:** https://github.com/SufiyanMansoor/ai-business-growth-os

**Live Demo:** https://sufiyanmansoor.github.io/ai-business-growth-os/

**AI Influencer & Marketing Studio** — A complete AI-powered business growth operating system.

## Overview

AI Business Growth OS acts as your:
- Marketing Agency
- AI Consultant
- Content Creator
- Influencer Manager
- Sales Funnel Builder
- Lead Generation Engine
- Growth Strategist

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Redux Toolkit, Recharts |
| Backend | Node.js, Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| AI | OpenAI API |
| Email | SMTP / Resend |
| Video | FFmpeg (render pipeline ready) |

## Project Structure

```
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/    # UI components, layout, theme switcher
│   │   ├── pages/         # Dashboard + 16 feature modules
│   │   ├── store/         # Redux Toolkit slices
│   │   ├── theme/         # 5-theme engine with CSS variables
│   │   └── lib/           # Firebase, API client
├── backend/           # Express API
│   └── src/
│       ├── routes/        # AI, CRM, campaigns, analytics, reports
│       └── services/      # OpenAI, scraper, Firebase, email
├── firebase/          # Firestore rules, storage rules, schema
└── DEPLOYMENT.md      # Full deployment guide
```

## Features

### Core Modules
- **AI Business Brain** — Business analysis, growth strategy, 7/30-day plans
- **One-Click Campaign** — Full marketing campaign from a single input
- **AI Video Creator** — Scripts, storyboards, multi-platform videos
- **Viral Content Engine** — Hooks, viral scores, posting optimization
- **Influencer Discovery** — Search, vet, collaboration strategies
- **Outreach Automation** — Cold emails, WhatsApp, follow-up sequences
- **Lead Generation** — Industry-specific lead finding with scoring
- **CRM Pipeline** — Drag-and-drop kanban with 7 stages
- **Social Media Manager** — Scheduler, content calendar, multi-platform
- **AI SEO Engine** — Audits, keywords, meta tags, blog ideas
- **Competitor Analysis** — SWOT, content gaps, improvement plans
- **ROI Analytics** — Campaign tracking, influencer ROI, content performance
- **AI Autopilot** — Full automation mode
- **Reporting** — PDF and Excel report generation
- **Client Portal** — Campaign approval, reports, analytics
- **Multi-Language** — English, Urdu, Arabic, Hindi

### Theme Engine
5 one-click themes with glassmorphism, neon CTAs, animated gradients:
1. Dark Mode (default)
2. Light Mode
3. Neon Marketing Mode
4. Corporate Mode
5. Viral Creator Mode

### Auth & Roles
- Email/Password + Google login
- Roles: Admin, Agency, Client, Influencer

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Firebase project
- OpenAI API key (optional — demo fallbacks included)

### Installation

```bash
# Clone and install
cd "AI MARKETING SOFTWARE"
npm install
cd frontend && npm install
cd ../backend && npm install

# Configure environment
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit both .env files with your credentials

# Run development
cd ..
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Enable Storage
5. Copy config to `frontend/.env`
6. Generate service account key for backend
7. Deploy rules: `cd firebase && firebase deploy --only firestore:rules,storage`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/ai/business-brain` | Business analysis |
| POST | `/api/ai/campaign` | Generate campaign |
| POST | `/api/ai/viral-content` | Viral content ideas |
| POST | `/api/ai/video` | Video creation |
| POST | `/api/ai/influencers` | Influencer search |
| POST | `/api/ai/outreach` | Outreach messages |
| POST | `/api/ai/leads` | Lead generation |
| POST | `/api/ai/seo` | SEO audit |
| POST | `/api/ai/competitor` | Competitor analysis |
| POST | `/api/ai/autopilot` | Start autopilot |
| POST | `/api/ai/translate` | Content translation |
| GET/POST | `/api/crm/leads` | CRM leads |
| GET/POST | `/api/campaigns` | Campaigns |
| GET | `/api/analytics/dashboard` | Dashboard stats |
| POST | `/api/reports/generate` | Generate reports |

## License

Proprietary — All rights reserved.
