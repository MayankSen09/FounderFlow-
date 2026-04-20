<div align="center">

# ⚡ FounderFlow

### Your AI Co-Founder for Building, Funding & Scaling Startups

[![Built with React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?style=flat-square&logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**FounderFlow is an AI-powered operations platform that acts as a virtual co-founder** — it remembers your decisions, tracks your mistakes, manages your fundraising, and gives you contextual advice based on everything it knows about your startup.

[Get Started](#-quick-start) · [Features](#-features) · [Architecture](#-architecture) · [Contributing](#-contributing)

</div>

---

## 🧠 What Makes This Different

Most startup tools give you generic advice. FounderFlow **learns you**.

- It knows your burn rate is $47k/mo and you have 8 months of runway
- It remembers you pivoted pricing 3 times and what worked
- It tracks that you have 12 investors in pipeline with 3 in due diligence
- When you ask "what should I focus on this week?" — it gives you an answer that's specific to **your** situation

This isn't a chatbot. It's a co-founder with perfect memory.

---

## ✨ Features

### 🤖 AI Co-Founder Chat
A conversational AI advisor that has full context of your founder journey — profile, journal entries, funding status, past mistakes, and wins. Ask it anything from "review my burn rate" to "help me prepare for an investor pitch."

### 📓 Founder Journal
Log every decision, mistake, win, learning, and pivot. Tag entries, track patterns over time, and let the AI surface insights like _"You've changed your pricing model 3 times — here's what stuck."_

### 💰 Funding Tracker
Manage funding rounds from Pre-Seed through Series B. Track investor pipeline (cold → warm → pitched → due diligence → committed), monitor raise progress, and never miss a follow-up.

### 📊 Founder Command Center
A real-time dashboard showing runway countdown, burn rate, MRR, active fundraising progress, recent wins/mistakes, and AI-generated tips based on your current situation.

### 🧭 Strategy Matrix
Input your metrics and align with proven founder frameworks — Lean Startup, Blitzscaling, Product-Led Growth, or Default Alive.

### 💵 Runway & Burn Calculator
Financial projections with 12-month cash exhaustion modeling. Track net burn, runway, MRR, and campaign ROI.

### 📋 Playbook Generator
AI-powered Playbook generation with startup-specific templates: Technical Founder Hiring, Product-Market Fit Discovery, and Investor Relations.

### 🔄 Growth Funnel Architect
Build and visualize customer acquisition funnels with AI-generated stage strategies, channel recommendations, and optimization tips.

---

## 🏗️ Architecture

```
founderflow/
├── src/                          # React Frontend
│   ├── pages/
│   │   ├── Dashboard.tsx         # Founder Command Center
│   │   ├── AIAdvisor.tsx         # AI Co-Founder Chat
│   │   ├── FounderJournal.tsx    # Decision/Mistake/Win Logger
│   │   ├── FundingTracker.tsx    # Investor Pipeline Manager
│   │   ├── StrategyGenerator.tsx # Founder Frameworks
│   │   ├── ROICalculator.tsx     # Runway & Burn
│   │   ├── AdvancedPlaybookGenerator.tsx # Playbook Generator
│   │   ├── FunnelBuilder.tsx     # Growth Funnel
│   │   └── Settings.tsx          # Profile & Startup Config
│   ├── context/
│   │   ├── FounderContext.tsx    # 🧠 The AI brain — stores profile,
│   │   │                        #    journal, funding, chat history
│   │   ├── AuthContext.tsx       # Authentication
│   │   ├── DataContext.tsx       # App data management
│   │   └── ThemeContext.tsx      # Dark/light mode
│   ├── lib/
│   │   ├── ai.ts                # Gemini API integration
│   │   └── playbookTemplates.ts      # Startup playbook templates
│   └── components/
│       ├── Layout/              # Sidebar, Header, Layout
│       └── FunnelBuilder/       # Funnel visualization components
├── backend/                     # Express + Prisma Backend
│   ├── src/
│   │   ├── app.ts               # Express server
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic (AI, Auth, Email)
│   │   └── middleware/          # Rate limiting, error handling
│   └── prisma/
│       └── schema.prisma        # Database schema
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) v1.3+ (or Node.js 18+)
- [Google Gemini API Key](https://makersuite.google.com/app/apikey)

### Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/founderflow.git
cd founderflow

# Install dependencies
bun install
cd backend && bun install && cd ..

# Configure environment
cp .env.example .env
# Add your VITE_GEMINI_API_KEY to .env

# Run frontend
bun run dev

# Run backend (in a separate terminal)
cd backend
bun run build && bun run start
```

The app will be available at `http://localhost:5173`

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Framer Motion |
| **Styling** | Tailwind CSS with custom Architect design system |
| **AI** | Google Gemini 2.5 Flash via REST API |
| **Backend** | Express.js, Prisma ORM |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Runtime** | Bun |
| **Charts** | Recharts |

---

## 🛡️ Security

- API keys are client-side only (use backend proxy for production)
- Rate limiting on all API endpoints
- Input sanitization and XSS prevention
- Session timeout with encrypted localStorage
- Security headers via Helmet

See [SECURITY.md](SECURITY.md) for full details.

---

## 📄 License

MIT — build whatever you want with it.

---

<div align="center">

**Built for founders who move fast and need an AI that keeps up.**

</div>
