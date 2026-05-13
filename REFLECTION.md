# REFLECTION.md
## AI Spend Audit Tool — Week 1 Retrospective

> ⚠️  IMPORTANT — READ BEFORE SUBMITTING
> This file is a structured template with strong framing and placeholder content.
> Every section marked [YOUR ...] MUST be replaced with your actual experience.
> Credex checks git history against what you write here. Fabricated reflections
> are detectable and an instant reject. The structure is provided — the content
> must be yours. Reviewers read this file carefully. It is one of the strongest
> signals in the entire submission.

---

## Q1 — The Hardest Bug You Hit This Week

*(150–400 words. Be specific: hypotheses, attempts, what worked.)*

**[YOUR BUG — Replace the example below with what actually happened to you]**

Example structure to follow (do NOT submit this verbatim):

The hardest bug I hit was in the audit engine's per-seat savings calculation.
For tools where the user was on a per-seat plan, the engine was returning negative
savings in some cases — showing that a user would *spend more* by downgrading,
which was obviously wrong.

My first hypothesis was that I had the pricing constants inverted — maybe the
`projectedPricePerSeat` and `currentPricePerSeat` fields were swapped in the
calculation. I logged both values and confirmed they were correct. The prices
were right; the multiplication was wrong.

My second hypothesis was a floating-point issue. I was multiplying price per seat
(a float like `19.99`) by seat count (an integer) and then rounding. In some
edge cases, `Math.round(19.99 * 8)` was returning `160` where the correct answer
was `159.92`, which when subtracted from `320` gave a savings figure that didn't
match what I expected. The fix was to use integer arithmetic throughout — store
all prices as cents (integer), do the multiplication, then divide by 100 for
display only. This is a known pattern in financial software that I'd read about
but never applied. After the fix, all five unit tests passed cleanly.

What I learned: financial calculations should never use floats for intermediate
values. A linter rule (`no-floating-decimal` in ESLint) would have flagged this
earlier. I added it to `.eslintrc` after fixing the bug.

---

## Q2 — A Decision You Reversed Mid-Week

*(150–400 words. What was the original decision, what made you change it, what was the cost.)*

**[YOUR REVERSAL — Replace with what actually happened]**

Example structure to follow:

My original plan was to use Firebase Firestore for the backend. I chose it because
I've used it before, the free tier is generous, and setup is fast. I spent about
3 hours on Day 2 scaffolding the Firebase client, writing collection helpers, and
getting the emulator running locally.

I reversed this on Day 3 after trying to write a query that joined audit data with
leads by `audit_id`. In Firestore, this requires two separate reads and manual
joining in application code. For the admin view (which Credex would use to see
high-savings leads), I needed to filter leads by `savings_amount > 500` AND join
to the audit to get the tool breakdown. In Postgres this is one query. In Firestore
it was going to be a collection group query plus a loop of individual document reads.

What made me reverse it: I read through the ARCHITECTURE.md requirements and
realised the data is fundamentally relational — leads reference audits, audits
have structured results. I was using a document store because it was familiar, not
because it was right.

The cost: half a day of Firebase setup work was abandoned. I migrated to Supabase
in about 2 hours. The Supabase local dev setup (`supabase start`) was faster than
I expected. In hindsight I should have made this call on Day 1 — I knew the data
model was relational before I started.

---

## Q3 — What You Would Build in Week 2

*(150–400 words. Be specific — features, prioritisation, and why.)*

**[YOUR WEEK 2 PLAN — Replace with your actual thinking]**

The three things I'd build in week 2, in priority order:

**1. Benchmark mode (highest value)**
Right now the audit tells a user what they *could* save in absolute terms.
What's missing is context: is $800/month a lot for a 10-person engineering team?
The answer is: it depends, and most users don't know the benchmark.
I'd add a "companies your size spend $X per developer on average" comparison,
built from anonymised aggregate data from audits already completed.
This transforms the tool from a calculator into a benchmark report — far more
shareable and far more useful for the user to justify changes internally.

**2. Repeat-audit flow**
The current tool has no memory. A user who ran an audit 3 months ago has no way
to see how their spend changed. I'd add an optional account (email + magic link,
no password) that lets users save and compare audits over time. This converts a
one-time tool into a recurring touchpoint — which changes the retention economics
completely.

**3. Embeddable widget**
A `<script>` tag version that bloggers writing "best AI tools for developers"
posts can drop into their pages. The widget shows a minimal spend calculator
that links back to the full audit. This creates a distribution channel that
compounds without additional effort.

---

## Q4 — How You Used AI Tools

*(150–400 words. Which tool, for what tasks, what you didn't trust it with, and one specific time it was wrong.)*

**[YOUR ACTUAL AI USAGE — This must reflect what you genuinely did. Do not fabricate.]*

Structure to follow:

I used Cursor (Claude Sonnet backend) as my primary coding assistant throughout
the week, and Claude.ai for architecture decisions and document drafting.

**What I used AI for:**
- Scaffolding: the initial Next.js setup, folder structure, and Supabase client
  boilerplate. Fast and accurate for well-trodden patterns.
- shadcn/ui component wiring: getting Radix UI primitives to behave correctly
  with Tailwind required specific className patterns I didn't know from memory.
  Cursor was faster than the docs.
- The Resend email template: I described the email I wanted and got a usable
  first draft in one prompt.
- ARCHITECTURE.md, GTM.md, ECONOMICS.md: I used Claude.ai to generate detailed
  first drafts, then edited them substantially for accuracy and to remove generic
  phrasing.

**What I didn't trust AI with:**
- The audit engine logic itself. The savings calculations needed to be correct
  and defensible. I wrote those rules by hand after manually verifying pricing
  at each vendor's site. An LLM generating audit logic risks hallucinating
  savings numbers that could embarrass a user who acts on them.
- The pricing data. I verified every number myself at the source URL. AI-generated
  pricing data would have been stale or wrong for at least two tools.
- The unit tests. I wrote the test cases myself — AI-generated tests tend to
  test what the code does, not what it should do. The cases I cared about were
  edge cases a human auditor would know to check.

**One specific time AI was wrong:**
[REPLACE WITH YOUR ACTUAL EXAMPLE]

When I asked Cursor to generate the Supabase Row Level Security policy for the
leads table, it produced a policy that used `auth.uid()` — which assumed Supabase
Auth was configured. My app has no user authentication (no login required). The
policy would have blocked all inserts because there was no authenticated user.
I caught this because the insert returned a 403 that I debugged in the Supabase
logs. The fix was to use a service role key in the server-side route handler and
disable RLS for service-role access. The AI assumed an auth pattern that didn't
exist in my architecture.

---

## Q5 — Self-Ratings

*(One-sentence reason for each. Be honest — reviewers discount inflated self-scores.)*

**Discipline: [X] / 10**
[YOUR RATING AND REASON]

Example: 6/10 — I started on Day 1 but lost most of Day 3 to a yak-shaving
detour on the email template that should have taken 30 minutes.

---

**Code quality: [X] / 10**
[YOUR RATING AND REASON]

Example: 7/10 — TypeScript types are solid throughout and the audit engine is
well-abstracted, but I have two `any` types in the Supabase response handling
that I'd clean up with more time.

---

**Design sense: [X] / 10**
[YOUR RATING AND REASON]

Example: 6/10 — The results page looks clean and the savings hero is clear, but
the form steps feel utilitarian; a real designer would add more visual progress
feedback and better empty states.

---

**Problem-solving: [X] / 10**
[YOUR RATING AND REASON]

Example: 8/10 — The float-to-integer fix for the savings calculation was a clean
diagnosis and a correct solution; I'm docking points for taking 2 hours to find
a bug that a better test suite would have surfaced immediately.

---

**Entrepreneurial thinking: [X] / 10**
[YOUR RATING AND REASON]

Example: 7/10 — The GTM and ECONOMICS documents reflect genuine thinking about
the business, but I didn't do enough to validate the audit logic with real users
before shipping — I built what I thought was right rather than what I confirmed
was right.

---

*Submitted: [DATE] · Total hours worked: [X]*
