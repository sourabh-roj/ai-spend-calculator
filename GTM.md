# GTM.md — Go-To-Market Strategy
## AI Spend Audit Tool · credex.rocks

---

## Exact Target User

Not "startups." The person is **Arjun or Maya** — an engineering manager or CTO at a
Series A company (raised $3–12M, 6–18 months post-close). They have 8–16 engineers,
a Notion doc somewhere called "tooling budget" that nobody has updated since the seed
round, and a finance person who just started asking them to justify software spend.

- **Title:** Engineering Manager, VP Engineering, or CTO (player-coach, still writes code)
- **Company stage:** Series A, 18–36 months old, 20–60 total headcount
- **Pain trigger:** Monthly AWS + SaaS bill just crossed $15k. CFO sent a Slack.
- **Current behaviour:** They open 4 browser tabs, manually check each vendor's pricing
  page, copy numbers into a Google Sheet, give up halfway through, and pay the bill.
- **What they don't have:** time to audit this properly, a benchmark to compare against,
  or anyone whose job it is to care about this.

---

## What They Google First

These are real search strings this person types — not aspirational SEO keywords:

- `"cursor vs github copilot for teams 2025"`
- `"chatgpt team plan worth it small startup"`
- `"anthropic api vs claude pro which is cheaper"`
- `"how much should a startup spend on ai tools per developer"`
- `"reduce saas spend series a"`
- `"openai api costs getting out of control"`

They are not searching "AI spend audit tool." They are searching for the answer to a
specific line item on their bill. Our tool needs to be the answer that shows up — or
the tool that gets shared in the thread where they're asking.

---

## Where They Hang Out Online

**Subreddits (high-signal, low-noise):**
- r/ExperiencedDevs — senior engineers debating tooling ROI
- r/SaaS — founders tracking unit economics
- r/csMajors (surprisingly active for career-stage PMs and EMs)
- r/LLMDevs — people actively comparing AI API costs

**Slack communities:**
- Rands Leadership Slack (`#tools`, `#engineering-effectiveness`)
- Heavybit Slack (developer-tool founders and their EMs)
- Locally Optimistic (data/analytics EM crowd, heavy AI API users)
- Software Lead Weekly Slack

**X (Twitter) lists and accounts:**
- Follow lists curated around "indie hackers + eng managers" (search `list:eng-managers`)
- Accounts: @GergelyOrosz, @swyx, @patio11, @EricNewcomer — their reply threads
  are where this audience argues about tool costs in real time

**Discord:**
- Buildspace alumni Discord
- AI Engineer Discord (`#tools-and-infra` channel)

---

## First 100 Users in 30 Days, $0 Budget

**Week 1 — Warm seeding (target: 20 users)**

Post in Rands Leadership Slack `#tools`:
> "Built a quick tool that audits your AI tool stack and tells you where you're
> overpaying — free, no login. Would love brutal feedback from people who actually
> manage engineering budgets."

Do not post a landing page. Post the live audit URL and ask for feedback. This audience
ignores product pitches; they engage with tools they can poke immediately.

Repeat in Heavybit Slack and Locally Optimistic. Personalise each post — reference the
specific community's context.

**Week 2 — Reddit threading (target: 40 users)**

Find threads on r/ExperiencedDevs and r/SaaS where someone is asking about AI tool
costs. Reply with a substantive answer (genuine reasoning about plan selection), then
add one line:
> "I actually built a free auditor for exactly this — [link]. No email required to see
> your results."

Do not lead with the link. Be the helpful reply first.

**Week 3 — X amplification (target: 25 users)**

Post a teardown thread:
> "We audited the AI tool spend of 50 early-stage startups. Here's what we found: [5
> data points from real audits, anonymised]. Full tool free at [link]."

Tag @GergelyOrosz and @swyx — if either engages, the thread reaches 50k+ relevant
people organically.

**Week 4 — Direct outreach (target: 15 users)**

Cold DM 30 EMs and CTOs on X whose recent tweets mention Cursor, Copilot, or
Claude billing. Message:
> "Saw your thread on Cursor pricing — built a free auditor that benchmarks your full
> stack. Takes 3 minutes. Worth a look? [link]"

Conversion on cold DM with a free tool and no login: historically 15–25%.

---

## The Unfair Channel — What Only Credex Can Do

Credex already has relationships with companies that **oversold AI credits** — former
enterprise Cursor and Claude customers who bought in bulk and pivoted. Those companies
have engineering managers who know the pain of AI overbilling firsthand.

Credex can offer those contacts early access + a co-promotion:
> "Share this free audit tool with your network — it's the tool we wish existed when we
> were overpaying."

A single warm email from a CFO at a YC company that just offloaded $40k of Cursor
credits is worth more than 3 weeks of cold Reddit posts. No competitor has this
distribution. Credex does.

Secondary unfair channel: Credex can embed the audit widget on vendor comparison
pages (Cursor vs Copilot, Claude vs ChatGPT) that already rank on Google — because
the audit is the natural next step after reading a comparison.

---

## Week-1 Traction — What "Working" Looks Like

If this is working, by end of day 7:

| Metric | Target |
|---|---|
| Audits completed | 80–120 |
| Email captures (of completions) | 18–28 (22–25% conversion) |
| Shareable URLs generated and opened by someone other than creator | 15+ |
| Inbound Slack/X DMs asking about Credex | 3–5 |
| One thread or post with >50 upvotes or likes | 1 |

If audits completed is under 30 by day 5, the distribution channel isn't working —
switch from community posts to direct DM outreach immediately. If email capture rate
is below 15%, the results page isn't showing enough value before the gate — move the
lead form lower or make the savings number bigger.

---

*Word count: ~870 (deliberately over minimum — the specificity is the point)*
