# DEVLOG.md — Daily Progress Log
## AI Spend Audit Tool · credex.rocks

> Assignment received: May 6, 2026.
> Days 1–4 (May 6–9): Could not work due to end semester university examinations.
> Active development: May 11–13, 2026.
> All entries are honest. Git history reflects the same timeline.

---

## Day 1 — 2026-05-06

**Hours worked:** 0

**What I did:**
- Received the assignment brief and read through it fully to understand the
  scope and requirements.

**What I learned:**
- This is a product build, not a coding exercise — the entrepreneurial files
  (GTM, ECONOMICS, USER_INTERVIEWS) carry as much weight as the code itself.

**Blockers / what I'm stuck on:**
- End semester university examinations begin tomorrow. Cannot start active
  development until exams are complete on May 10.

**Plan for tomorrow:**
- Exams. Will resume development on May 11.

---

## Day 2 — 2026-05-07

**Hours worked:** 0

**What I did:**
- Nothing — end semester examination today.

**What I learned:**
- N/A

**Blockers / what I'm stuck on:**
- End semester examinations in progress.

**Plan for tomorrow:**
- Exams continue.

---

## Day 3 — 2026-05-08

**Hours worked:** 0

**What I did:**
- Nothing — end semester examination today.

**What I learned:**
- N/A

**Blockers / what I'm stuck on:**
- End semester examinations in progress.

**Plan for tomorrow:**
- Exams continue.

---

## Day 4 — 2026-05-09

**Hours worked:** 0

**What I did:**
- Nothing — final end semester examination today.
- After finishing the exam, spent 30 minutes re-reading the assignment brief
  and mentally planning the approach for the remaining 4 days.

**What I learned:**
- Re-reading the brief with fresh eyes made it clearer that the audit engine
  logic must use hardcoded rules — not AI — because savings numbers need to
  be deterministic and defensible to a finance person.

**Blockers / what I'm stuck on:**
- Exams finished. Starting development tomorrow with 4 days remaining.

**Plan for tomorrow:**
- Scaffold Next.js project
- Build multi-step spend input form with localStorage persistence
- Begin audit engine with verified pricing data

---

## Day 5 — 2026-05-11

**Hours worked:** 2

**What I did:**
- Scaffolded the Next.js 14 App Router project using `create-next-app` with
  TypeScript and Tailwind CSS flags
- Installed shadcn/ui and configured the component library
- Set up the initial folder structure for the project
- Pushed the first commit to GitHub: `Initial commit: Next.js boilerplate`
- Decided on the full tech stack: Next.js 14, TypeScript, Tailwind, shadcn/ui,
  Supabase, Anthropic API, Resend

**What I learned:**
- Next.js 14 App Router separates server and client components strictly —
  server components cannot use hooks, client components need `"use client"`
  at the top. This became important when building the results page, which
  needed a server wrapper for OG tags and a client component for interactivity.

**Blockers / what I'm stuck on:**
- Dynamic route folder naming on Windows — the `[slug]` folder with square
  brackets caused confusion in PowerShell. Had to verify the correct way to
  create it before proceeding.

**Plan for tomorrow:**
- Build the audit engine with manually verified pricing data
- Build the results page
- Connect Supabase and add lead capture
- Integrate Anthropic API for personalised summary

---

## Day 6 — 2026-05-12

**Hours worked:** 4

**What I did:**
- Manually verified pricing for all 8 required tools at official vendor pages:
  cursor.sh/pricing, anthropic.com/pricing, openai.com/pricing,
  github.com/features/copilot — noted every price with source URL and date
- Wrote `PRICING_DATA.md` with verified sources
- Built the audit engine in `lib/audit-engine/index.ts` as a pure TypeScript
  function — stateless, no I/O, deterministic input/output
- Built the multi-step spend input form (Steps 1–3) with localStorage
  persistence across page reloads
- Built the results page with:
  - Savings hero (total monthly + annual)
  - Per-tool breakdown cards
  - Credex CTA for >$500/mo savings
  - "You're spending well" section for <$100/mo
- Integrated Anthropic API (`claude-sonnet-4-20250514`) for ~100-word
  personalised summary with template fallback on API failure
- Set up Supabase — created `audits` and `leads` tables, tested inserts
- Added lead capture form with honeypot field
- Connected Resend for transactional confirmation email
- Commits: `docs: add PRICING_DATA.md` · `feat: add audit engine core logic`

**What I learned:**
- Supabase requires the service role key (not the anon key) for server-side
  inserts — the anon key returned a 401 silently until I checked the Supabase
  logs and switched to the correct key in the route handler.
- `NEXT_PUBLIC_` environment variables are bundled into the client — anything
  without that prefix stays server-side only. Important for keeping the
  Anthropic API key out of the browser.

**Blockers / what I'm stuck on:**
- Naming conventions caused bugs — a mismatch between `team_size` (Supabase,
  snake_case) and `teamSize` (TypeScript, camelCase) meant team size was
  always undefined on the results page. Fixed by adding explicit mapping at
  the data fetch layer.
- Used `onboarding@resend.dev` as the from-address since a custom sending
  domain wasn't verified in time. Documented as a known limitation.

**Plan for tomorrow:**
- Write all 11 required markdown documentation files
- Set up GitHub Actions CI workflow
- Deploy to Vercel
- Fix any build or lint errors
- Run Lighthouse
- Submit

---

## Day 7 — 2026-05-13

**Hours worked:** 3

**What I did:**
- Wrote all required documentation files: GTM.md, ECONOMICS.md,
  ARCHITECTURE.md, LANDING_COPY.md, METRICS.md, REFLECTION.md, README.md,
  PROMPTS.md, TESTS.md, PRICING_DATA.md, DEVLOG.md
- Added `.github/workflows/ci.yml` — lint, TypeScript check, Jest tests,
  and Next.js build on every push to main
- Fixed CI failures:
  - ESLint `no-unescaped-entities`: replaced bare apostrophes in JSX with
    `&apos;` across multiple components
  - Coverage upload step failed because `coverage/` folder didn't exist —
    added a conditional existence check before the upload step
  - Added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` to suppress runner warnings
- Fixed Vercel build error: `AuditReport` type was imported from
  `@/lib/audit-engine` but not exported from that module — added the export
- Fixed git push rejection (`fetch first`) — ran
  `git pull origin main --rebase` then pushed cleanly
- Deployed to Vercel — set all five environment variables in the dashboard,
  triggered a redeploy after adding `NEXT_PUBLIC_APP_URL`
- Verified full end-to-end flow on the live URL: form → audit → results →
  lead capture → Supabase insert → Resend email — all working
- Ran Lighthouse on deployed URL and reviewed scores

**What I learned:**
- Vercel does not read `.env.local` — every environment variable needs to be
  added manually in the Vercel dashboard, and a redeploy is required after
  adding them. `NEXT_PUBLIC_APP_URL` being undefined caused the OG image URL
  to render as `undefined/api/og?...` until I caught and fixed it.
- GitHub Actions needs stub environment variable values at build time even
  for server-only vars — Next.js static analysis throws if they are missing
  entirely, even if they are never used client-side.

**Blockers / what I'm stuck on:**
- Deployment was the most time-consuming part of the week — TypeScript build
  errors, CI failures, and git conflicts from editing files both locally and
  directly on GitHub created a slow feedback loop. Each fix required a push
  and a full CI run to verify.
- Some commits on this day have poor messages (`#`, `UI CHANGES`) — a result
  of pushing rapidly under deadline pressure. Noted honestly here.

**Plan for tomorrow:**
- N/A — submitted. With more time would build: PDF export, benchmark mode,
  embeddable widget, and conduct more thorough user interviews.

---

*Total hours worked: ~9 (across Days 5–7)*
*Assignment received: 2026-05-06*
*Submitted: 2026-05-13*
