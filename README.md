# The Mindful Log

An AI-powered journaling app that applies **Cognitive Behavioral Therapy (CBT)** principles to help users identify negative thought patterns and reflect with self-compassion.

> Built for the Applied Artificial Intelligence program at Miami Dade College — Wolfson Campus / AI Center.

---

## Live Demo

**[View on Netlify →](https://mindful-log.netlify.app/)**

---

## Features

| Feature | Description |
|---------|-------------|
| 📝 **Multi-Journal Support** | Create separate journals for different areas of life |
| 🧠 **AI Sentiment Analysis** | Every entry classified as Positive, Balanced, or High-Distress |
| 🔍 **Cognitive Distortion Detection** | Identifies Should Statements, Catastrophizing, and All-or-Nothing Thinking with phrase-level highlighting |
| 🪞 **Reflective Mirror** | AI generates a personalized, non-directive reflection question per entry |
| 🌿 **Grounding Aid** | Step-by-step 5-4-3-2-1 sensory grounding exercise |
| 🆘 **Crisis Support** | Immediate access to 988, Crisis Text Line, and SAMHSA helpline |
| 📊 **Journey Map** | Mood trend charts and distortion frequency over time |
| 🔐 **Secure Persistence** | Supabase PostgreSQL with Row-Level Security |

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **AI Model:** Llama 3.1 via Groq API (free tier)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Deployment:** Netlify (static frontend + serverless functions)
- **Design:** Doodles-inspired pastel aesthetic — Quicksand + Comfortaa fonts

---

## AI & Ethics

- **AI Disclosure:** Users are informed on every page that AI is analyzing their entries
- **Non-Diagnostic:** The app explicitly does not provide clinical diagnoses
- **Crisis Safety:** High-Distress entries surface hotlines (988, Crisis Text Line, SAMHSA)
- **Privacy:** All data isolated per user via Supabase Row-Level Security
- **Transparency:** AI model (Llama 3.1 via Groq) is named in the UI

---

## Running Locally

### Prerequisites
- Node.js 18+
- Free [Groq API key](https://console.groq.com) — no credit card required
- Optional: Free [Supabase project](https://supabase.com) for persistent DB

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/meninathy/Mindful-Journal.git
cd Mindful-Journal

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Add your GROQ_API_KEY to .env
# Optionally add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY

# 4. Start the app (frontend + AI server)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Free at console.groq.com |
| `VITE_SUPABASE_URL` | Optional | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anon key |

> Without Supabase credentials, the app runs in **local mode** — data is stored in localStorage.

---

## Database Schema (Supabase)

```sql
profiles   -- User profile linked to Supabase Auth
journals   -- Named journal books
entries    -- Journal text + AI results (sentiment, distortions JSONB)
insights   -- AI-generated reflective mirror questions
```

Migration: `supabase/migrations/001_initial_schema.sql`

---

## Project Structure

```
src/
├── components/
│   ├── analysis/      # SentimentBadge, DistortionBadge, MirrorPrompt
│   ├── grounding/     # GroundingAid (5-4-3-2-1), CrisisSupport
│   └── ui/            # Button, Card, Input, AIDisclosureBanner
├── pages/             # AuthPage, DashboardPage, JournalPage, JourneyPage
├── hooks/             # useJournals, useEntries (React Query)
├── lib/               # api.ts (Supabase/local hybrid), supabase.ts, localData.ts
└── types/             # TypeScript interfaces

netlify/functions/
└── analyze-entry.mjs  # Serverless AI analysis via Groq

supabase/
├── functions/         # Edge Function for production Supabase deploy
└── migrations/        # SQL schema with RLS policies
```

---

## Netlify Deployment

1. Push to GitHub — Netlify auto-deploys from `main`
2. Go to **Netlify → Site config → Environment variables** and add:
   - `GROQ_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Trigger a redeploy

---

## Academic Context

Built for the **Applied Artificial Intelligence** course at **Miami Dade College**, demonstrating:
- Real-world NLP (CBT-based cognitive distortion detection)
- Responsible AI practices (disclosure, non-diagnosis, crisis resources)
- Full-stack AI deployment (Groq LLM + Supabase + Netlify serverless)
- Ethical design in mental health technology
