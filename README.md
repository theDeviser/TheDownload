# The Download

> Everything your spouse was doom-scrolling today, explained like you're a normal person.

A dual-persona SaaS platform that transforms the daily doom-scroll into a curated, jargon-free digest. Built with Next.js, Supabase, and OpenAI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth (Email + Google OAuth) |
| AI | OpenAI API (gpt-4o-mini) |
| Testing | Playwright |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- An OpenAI API key

### Setup

1. **Clone the repository:**

```bash
git clone <repo-url>
cd the-download
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
CRON_SECRET=your-random-secret
```

4. **Run database migrations:**

Apply migrations in order via the Supabase dashboard (SQL Editor) or CLI:

```bash
# MVP schema
supabase db push --file supabase/migrations/001_initial_schema.sql

# SaaS platform schema (includes pgvector)
supabase db push --file supabase/migrations/002_saas_schema.sql
```

5. **Start the dev server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

### Route Groups

The app uses Next.js Route Groups to cleanly separate the two personas:

```
src/app/
├── page.tsx                    # Public marketing landing page
├── layout.tsx                  # Root layout (Navbar + ThemeProvider)
│
├── (admin)/                    # Curator/Admin area (requires auth)
│   ├── layout.tsx              # Collapsible sidebar navigation
│   ├── dashboard/page.tsx      # Command Center — ingestion feed
│   ├── dashboard/logs/page.tsx # System event logs
│   └── brain/page.tsx          # Knowledge Base — RAG + Obsidian export
│
├── (subscriber)/               # Reader/Subscriber area
│   ├── demo/page.tsx           # Original MVP daily feed viewer
│   └── share/[slug]/page.tsx   # Public share page (no auth needed)
│
├── auth/                       # Authentication pages
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts      # OAuth PKCE code exchange
│
├── onboarding/page.tsx         # Partner profiling (topics + tone)
│
└── api/
    ├── cron/generate-daily/    # Vercel Cron endpoint for daily digest
    └── ingest/webhook/         # Content ingestion webhook
```

### Key Directories

- `src/components/` — Reusable components (Navbar, ThemeToggle)
- `src/components/ui/` — Shadcn UI primitives (Button, Avatar, DropdownMenu)
- `src/lib/api/` — Client-side API helpers (auth, digest fetching)
- `src/lib/supabase/` — Supabase client initialization (browser + server)
- `src/lib/obsidian/` — Obsidian markdown export utilities
- `src/lib/ai/` — OpenAI integration for summarization
- `src/lib/rss/` — RSS feed fetching and parsing
- `supabase/migrations/` — SQL migration files

## Database Schema

### pgvector for Embeddings

The SaaS schema uses the `pgvector` extension to store 1536-dimensional embeddings on the `raw_ingestions` table. This powers the Knowledge Base RAG feature, enabling semantic search over saved content.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE raw_ingestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  raw_text TEXT NOT NULL,
  embedding VECTOR(1536),
  is_curated_for_digest BOOLEAN DEFAULT FALSE,
  -- ...
);

CREATE INDEX ON raw_ingestions
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

### Multi-Tenant Architecture

Each admin has a **workspace** with a unique `share_slug`. Content flows:

1. Raw content enters via webhook/RSS → `raw_ingestions`
2. Admin curates items (`is_curated_for_digest = true`)
3. AI translates curated items → `translated_items`
4. Published as a `saas_digests` entry
5. Subscriber views at `/share/{slug}`

## Running Tests

### Install Playwright Browsers

```bash
npx playwright install
```

### Run E2E Tests

```bash
npx playwright test
```

### View Test Report

```bash
npx playwright show-report
```

### Test Files

- `tests/landing-page.spec.ts` — Verifies navbar, hero, CTA buttons, How It Works section
- `tests/auth-flow.spec.ts` — Verifies login/signup forms, auth redirects

## Theming

The app supports light and dark modes via `next-themes`. The editorial design system uses:

- **Dark Mode (default):** Warm charcoal background (#1A1918), cream text (#E8E3D9), gold accent (#D4AF37)
- **Light Mode:** Parchment background (#F9F6F0), espresso text (#2A2825), muted gold (#B8941E)

Toggle between modes using the sun/moon button in the navbar or admin sidebar.

## Deployment

### Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Set environment variables in the Vercel dashboard
4. Deploy

### Cron Job

Configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-daily",
      "schedule": "0 13 * * *"
    }
  ]
}
```

## License

Private — All rights reserved.
