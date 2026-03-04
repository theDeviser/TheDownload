# The Download — Product Requirements Document

## Product Vision

**The Download** is a dual-persona SaaS platform that transforms the daily doom-scroll into a curated, jargon-free digest.

**Tagline:** Everything your spouse was doom-scrolling today, explained like you're a normal person.

### The Two Personas

| Persona | Role | Experience |
|---------|------|------------|
| **Admin (Curator)** | The person who doom-scrolls. A tech-savvy individual who consumes content from X, Substack, RSS, LinkedIn. | Uses The Download as a "Second Brain" — ingests content, queries their knowledge base with RAG, and curates a daily digest for their subscriber. |
| **Subscriber (Reader)** | The spouse, partner, or team member who wants to stay informed without the noise. | Receives a beautiful, translated daily digest via a unique share link. No account required. |

## Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 + Shadcn UI (editorial theme with Playfair Display + Inter)
- **Database & Auth:** Supabase (PostgreSQL + pgvector for embeddings)
- **AI:** OpenAI API (gpt-4o-mini) for summarization and translation
- **Background Jobs:** Vercel Cron for daily digest generation
- **Testing:** Playwright for E2E tests

### Route Architecture

```
app/
├── page.tsx                          # Marketing landing page
├── layout.tsx                        # Root layout (Navbar + ThemeProvider)
├── (admin)/
│   ├── layout.tsx                    # Admin shell with collapsible sidebar
│   ├── dashboard/
│   │   ├── page.tsx                  # Command Center (ingestion feed)
│   │   └── logs/page.tsx             # System event logs
│   └── brain/page.tsx                # Knowledge Base (RAG + Obsidian export)
├── (subscriber)/
│   ├── demo/page.tsx                 # Original MVP daily feed viewer
│   └── share/[slug]/page.tsx         # Public subscriber digest
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts            # OAuth PKCE exchange
├── onboarding/page.tsx               # Partner profiling flow
└── api/
    ├── cron/generate-daily/route.ts  # Daily digest generation
    └── ingest/webhook/route.ts       # Content ingestion webhook
```

### Database Schema

**MVP Tables** (migration 001):
- `profiles` — User profiles with onboarding state
- `user_preferences` — Topic selections and tone preference
- `daily_digests` — Date-indexed digest containers
- `digest_items` — Individual stories within a digest
- `rss_sources` — Configured RSS feed sources

**SaaS Tables** (migration 002):
- `workspaces` — Multi-tenant workspace (admin + share slug)
- `sources` — Connected ingestion platforms per workspace
- `raw_ingestions` — The Second Brain data store with vector embeddings
- `saas_digests` — Published daily drops with target persona
- `translated_items` — AI-translated articles for subscriber consumption

## Features Built

### Phase 1: MVP
- Daily feed viewer with date navigation and animated transitions
- RSS-based content ingestion (TechCrunch, CoinDesk, Hacker News, Bloomberg)
- OpenAI-powered "spouse summary" generation
- Multi-step onboarding flow (topic selection + tone slider)
- Supabase authentication (email/password + Google OAuth)
- PWA readiness (manifest, safe areas, installability)

### Phase 2: SaaS Platform
- Dual-persona architecture (Admin vs Subscriber)
- Admin Command Center with ingestion feed
- Knowledge Base with RAG query interface
- Obsidian integration (download .md or deep-link to Obsidian)
- pgvector-powered vector embeddings for semantic search
- Content ingestion webhook API
- Public share pages for subscribers

### Phase 3: Polish & Ops
- SaaS marketing landing page with hero, how-it-works, features, CTA
- Global auth-aware navbar with Shadcn DropdownMenu profile
- Collapsible admin sidebar with localStorage persistence
- System event logs module
- Light/dark theme toggle (editorial aesthetic in both modes)
- Playwright E2E test suite
- Cursor rules for AI agent conventions

## Roadmap

### Near-Term
- [ ] Wire RAG queries to pgvector (semantic search over ingestions)
- [ ] Live webhook ingestion (save to `raw_ingestions` table)
- [ ] Real-time digest generation from curated ingestions
- [ ] Notion integration (export articles to Notion databases)

### Mid-Term
- [ ] Browser extension for one-click content capture
- [ ] Subscriber email delivery (daily digest via email)
- [ ] Multi-workspace support per admin
- [ ] Analytics dashboard (digest open rates, popular topics)

### Long-Term
- [ ] Billing integration (Stripe) with tiered plans
- [ ] Team workspaces with multiple curators
- [ ] Custom AI personas (adjustable tone per subscriber)
- [ ] Mobile app (React Native or Capacitor)
