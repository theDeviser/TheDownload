# The Download — Comprehensive Platform Audit Report

**Date:** March 4, 2026
**Auditor:** AI Engineering Agent
**Tools Used:** Chrome DevTools MCP, Code Review Subagent, Playwright Config Review
**Server:** localhost:3000 (Next.js 16.1.6 Turbopack)

---

## Executive Summary

The Download platform is in strong shape. The UI is polished and editorial across dark/light modes and all viewports (desktop, tablet, mobile). Performance is excellent (LCP 312ms, CLS 0). One critical code bug was found (Rules of Hooks violation in Navbar), along with one infrastructure bug (manifest.json blocked by middleware). Several accessibility improvements and future-planning items were identified.

---

## 1. Visual & Layout Audit

### Pages Tested
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Landing Page | `/` | PASS | Hero, How It Works, Features, CTA all render correctly |
| Demo (MVP) | `/demo` | PASS | Date nav, story cards, intro card all working |
| Login | `/auth/login` | PASS | Google OAuth + email/password form |
| Signup | `/auth/signup` | PASS | Name, email, password fields + Google |
| Share Page | `/share/[slug]` | PASS (minor bug) | Renders but slug parsing has text issue |
| Dashboard | `/dashboard` | PASS (auth-gated) | Correctly redirects to login when unauthenticated |
| Brain | `/brain` | PASS (auth-gated) | Auth-gated correctly |
| Logs | `/dashboard/logs` | PASS (auth-gated) | Auth-gated correctly |

### Theme Toggle
- Dark mode: PASS — warm charcoal (#1A1918), cream text, gold accents
- Light mode: PASS — warm parchment (#F9F6F0), espresso text, muted gold
- Toggle persists across page navigation: PASS

### Responsiveness
| Viewport | Status | Notes |
|----------|--------|-------|
| Desktop (1280px) | PASS | max-w-5xl constraint, proper padding |
| Tablet (820x1180) | PASS | Grid adapts, no overflow |
| Mobile iPhone 14 (390x844) | PASS | Single column, readable text, proper touch targets |

---

## 2. Performance Audit

| Metric | Value | Rating |
|--------|-------|--------|
| LCP (Largest Contentful Paint) | 312ms | Excellent (< 2.5s) |
| CLS (Cumulative Layout Shift) | 0.00 | Perfect |
| TTFB (Time to First Byte) | 39ms | Excellent |

### Insights
- No significant render-blocking resources
- Font files (Playfair Display, Inter) load successfully from Google Fonts CDN
- All static assets serve 200 status codes
- Third-party impact is minimal (only Google Fonts)

---

## 3. Console Errors & Network Issues

### CRITICAL: manifest.json Redirect
- **Issue:** `/manifest.json` gets intercepted by Next.js middleware and 307-redirected to `/auth/login`
- **Root Cause:** The middleware matcher pattern excludes `.svg`, `.png`, `.jpg` etc. but NOT `.json`. Since `/manifest.json` doesn't match any public route, it's treated as a protected route.
- **Impact:** PWA installability is broken. Console shows "Manifest: Line: 1, column: 1, Syntax error" on every page load.
- **Fix:** Add `json` to the middleware matcher's file extension exclusion: change `.*\\.(?:svg|png|jpg|jpeg|gif|webp)$` to `.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$`

### Expected: Supabase 404 on daily_digests
- The demo page makes a Supabase API call to `daily_digests` table which returns 404
- This is expected — the table hasn't been migrated to the live database yet
- The app gracefully falls back to mock data

---

## 4. Code Quality Issues

### CRITICAL (1)
1. **Rules of Hooks violation in `src/components/navbar.tsx`** — The component has an early `return null` for admin routes that executes before `useEffect`. This violates React's rules of hooks (hooks must always be called in the same order). When navigating between admin and non-admin routes, this will cause a React error.

### IMPORTANT (8)
1. **`src/components/navbar.tsx`** — Avatar dropdown trigger missing `aria-label` for screen readers
2. **`src/app/page.tsx`** — Landing page content not wrapped in `<main>` landmark
3. **`src/app/(subscriber)/demo/page.tsx`** — `setLoading(false)` may not fire in all async error paths
4. **`src/app/(subscriber)/demo/page.tsx`** — `hasPrev`/`hasNext` derived from mock data only, not Supabase data
5. **`src/app/(admin)/layout.tsx`** — Sidebar collapsed state read from localStorage causes layout flash on hydration
6. **`src/app/(admin)/dashboard/logs/page.tsx`** — Table headers missing `scope="col"` attribute
7. **`src/app/(admin)/brain/page.tsx`** — Export dropdown lacks ARIA attributes and doesn't close on outside click/Escape
8. **`src/middleware.ts`** — Only checks `NEXT_PUBLIC_SUPABASE_URL` env var, not `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### MINOR (5)
1. **Share page slug parsing** — `/share/alex-and-sam` displays as "Alex & And & Sam's Download" (the word "and" is treated as a name)
2. **`src/app/(admin)/brain/page.tsx`** — Submit button has no `aria-label` (icon-only button)
3. **`src/lib/obsidian/export.ts`** — Title escaping only handles double quotes, not backslashes
4. **`src/components/navbar.tsx`** — Profile Settings and Billing links use `href="#"` which scrolls to top
5. **`src/app/(subscriber)/demo/page.tsx`** — Skeleton loader `animationDelay` style not utilized by `animate-pulse`

---

## 5. Interactive Elements Audit

### Working Buttons & Links
| Element | Location | Status |
|---------|----------|--------|
| "Get Started Free" CTA | Landing hero | WORKING — navigates to `/auth/signup` |
| "See a Demo" CTA | Landing hero | WORKING — navigates to `/demo` |
| "Get Started Free" CTA | Landing footer | WORKING — navigates to `/auth/signup` |
| "Sign In / Join" | Navbar | WORKING — navigates to `/auth/login` |
| Theme toggle (Sun/Moon) | Navbar | WORKING — toggles dark/light mode |
| "Demo" footer link | Landing footer | WORKING — navigates to `/demo` |
| "Sign In" footer link | Landing footer | WORKING — navigates to `/auth/login` |
| Date navigator (Previous) | Demo page | WORKING — loads March 3 content |
| Date navigator (Next) | Demo page | WORKING — disabled when at latest date |
| "Sign in" button | Login page | WORKING — submits to Supabase auth |
| "Create account" button | Signup page | WORKING — submits to Supabase auth |
| "Continue with Google" | Login/Signup | WORKING — initiates Google OAuth flow |
| "Sign up" link | Login page | WORKING — navigates to signup |
| "Sign in" link | Signup page | WORKING — navigates to login |
| Story source links | Demo page | WORKING — external links to sources |
| Webhook API POST | `/api/ingest/webhook` | WORKING — returns 200 with valid payload, 400 with invalid |

### Placeholder/Non-Functional Buttons (Planned for Future)
| Element | Location | Current State | Future Plan |
|---------|----------|---------------|-------------|
| "Profile Settings" | Navbar dropdown | Links to `#` | Needs `/settings/profile` page |
| "Billing" | Navbar dropdown | Links to `#` | Needs Stripe integration + `/billing` page |
| "Log Out" | Navbar dropdown | Functional code exists | Works when authenticated |
| "Subscribers" sidebar link | Admin sidebar | Disabled with "Soon" badge | Needs subscriber management page |
| "Settings" sidebar link | Admin sidebar | Disabled with "Soon" badge | Needs admin settings page |
| "Include in Today's Download" | Dashboard items | Toggle UI exists | Needs Supabase wiring to update `is_curated_for_digest` |
| "Send to Notion" | Dashboard items | Button exists | Needs Notion API integration |
| Chat input "Ask your feed..." | Brain page | Clears input on submit | Needs RAG query wiring to pgvector |
| RAG suggestion buttons | Brain page | Sets query text | Needs actual RAG backend |
| "Export to Obsidian" dropdown | Brain page | Download .md works, Open in Obsidian constructs URI | Both functional as client-side utilities |

---

## 6. API Endpoint Audit

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/ingest/webhook` | POST | WORKING | Validates fields, returns 200/400 appropriately |
| `/api/cron/generate-daily` | GET | EXISTS | Protected by CRON_SECRET, not tested live |
| `/auth/callback` | GET | EXISTS | Handles OAuth PKCE exchange |

---

## 7. Accessibility Summary

### Good
- Proper heading hierarchy on all pages (h1 > h2 > h3)
- Theme toggle has descriptive `aria-label` ("Switch to light/dark mode")
- Date navigation buttons have `aria-label` ("Previous day", "Next day")
- Next day button properly disabled when at latest date
- Links have descriptive text content
- Footer has `contentinfo` landmark role

### Needs Improvement
- Landing page missing `<main>` landmark wrapper
- Avatar dropdown trigger needs `aria-label`
- Brain page export dropdown needs ARIA menu attributes
- Logs table headers need `scope="col"`
- Brain page submit button needs `aria-label` (icon-only)

---

## 8. Recommended Fix Priority

### Immediate (Before Next Deploy)
1. Fix Rules of Hooks in `navbar.tsx` — move early return after all hooks
2. Fix middleware matcher to exclude `.json` files (unblocks PWA manifest)

### Soon (Next Sprint)
3. Add `aria-label` to avatar dropdown trigger
4. Wrap landing page content in `<main>` element
5. Add `scope="col"` to logs table headers
6. Fix share page slug parsing to handle "and" connector words
7. Add ARIA attributes + outside-click handler to brain export dropdown

### Backlog (Future Phases)
8. Wire dashboard "curate" toggle to Supabase
9. Implement RAG query backend for Brain page
10. Build subscriber management page
11. Add Notion API integration
12. Implement admin settings page
13. Add Stripe billing integration
14. Wire real webhook ingestion to `raw_ingestions` table

---

## Screenshots Captured

All screenshots saved to `/audit/`:
- `01-landing-desktop.png` — Landing page, desktop, dark mode
- `02-demo-desktop.png` — Demo (MVP) page, desktop, dark mode
- `03-login-desktop.png` — Login page, desktop, dark mode
- `04-signup-desktop.png` — Signup page, desktop, dark mode
- `05b-share-page-fresh.png` — Share page, desktop, dark mode
- `06-landing-mobile.png` — Landing page, iPhone 14, dark mode
- `07-landing-light-mobile.png` — Landing page, iPhone 14, light mode
- `08-demo-mobile-light.png` — Demo page, iPhone 14, light mode
- `09-landing-tablet.png` — Landing page, iPad, light mode
