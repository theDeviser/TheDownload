# The Download

**Everything your spouse was doom-scrolling today, explained like you're a normal person.**

A daily curated digest that aggregates complex tech, finance, and crypto news — targeting the niches a user's partner is obsessed with — and translates it into witty, jargon-free, human-readable summaries.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 with custom editorial dark theme
- **Database & Auth**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: OpenAI `gpt-4o-mini` for summary generation
- **Animations**: Motion (Framer Motion)
- **Deployment**: Vercel (with Cron Jobs for daily generation)

## Getting Started

### 1. Clone & Install

```bash
cd the-download
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` via the Supabase SQL Editor
3. Copy `.env.local.example` to `.env.local` and fill in your credentials

### 3. Set Up OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add it to `.env.local` as `OPENAI_API_KEY`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Note:** The app works with mock data out of the box — no Supabase/OpenAI configuration required to see the UI.

## Project Structure

```
src/
├── app/
│   ├── api/cron/generate-daily/  # Daily digest generation endpoint
│   ├── auth/login/               # Login page
│   ├── auth/signup/              # Signup page
│   ├── onboarding/               # Multi-step onboarding flow
│   ├── globals.css               # Theme + custom styles
│   ├── layout.tsx                # Root layout with PWA meta
│   └── page.tsx                  # Main daily feed view
├── components/
│   ├── date-navigator.tsx        # Day-by-day navigation
│   ├── empty-state.tsx           # No digest available state
│   ├── header.tsx                # App header with tagline
│   ├── intro-card.tsx            # Daily greeting card
│   └── story-card.tsx            # Individual story display
├── lib/
│   ├── ai/generate-summary.ts   # OpenAI integration + prompts
│   ├── api/auth.ts               # Client-side auth helpers
│   ├── api/digest.ts             # Client-side data fetching
│   ├── rss/fetcher.ts            # RSS feed fetching + filtering
│   ├── supabase/client.ts        # Browser Supabase client
│   ├── supabase/server.ts        # Server Supabase client
│   ├── supabase/types.ts         # TypeScript types for all tables
│   └── mock-data.ts              # Mock data for development
├── middleware.ts                  # Auth + onboarding redirect logic
supabase/
└── migrations/001_initial_schema.sql  # Full DB schema with RLS
```

## Daily Cron Job

The digest generation runs daily at 7 AM UTC via Vercel Cron. It:

1. Fetches articles from configured RSS feeds
2. Filters by each user's topic preferences
3. Generates spouse-friendly summaries via GPT-4o-mini
4. Stores everything in Supabase for instant retrieval

To trigger manually:

```bash
curl -X POST http://localhost:3000/api/cron/generate-daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```
