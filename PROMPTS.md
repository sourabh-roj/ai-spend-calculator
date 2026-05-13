# PROMPTS.md — LLM Prompts
## AI Spend Audit Tool · credex.rocks

---

## Overview

The audit engine uses **hardcoded rules only** — no LLM is involved in
calculating savings numbers or generating recommendations. This is intentional:
deterministic rules are auditable, free to run, and produce numbers a finance
person can verify. Hallucinated savings figures would destroy user trust.

The LLM is used in exactly one place: generating a personalised narrative
summary paragraph on the results page. The summary adds tone and context to
the audit — it does not generate or modify any numbers.

---

## Prompt 1 — Personalised Audit Summary

**Used in:** `app/api/summary/route.ts`
**Model:** `claude-sonnet-4-20250514`
**Max tokens:** 1000
**Expected output length:** ~100 words, one paragraph

### Full Prompt

```
You are a concise financial advisor for startups. Given this AI tool spend
audit for a {teamSize}-person team focused on {useCase}:

{toolSummary}

Total monthly savings identified: ${totalMonthlySavings}

Write a personalized ~100-word summary paragraph that:
(1) acknowledges their current setup without being condescending
(2) highlights the single biggest savings opportunity by name
(3) gives one clear, actionable next step they can take today

Tone: direct, friendly, not salesy. Do not use bullet points.
Write one plain paragraph only. Do not add a subject line or greeting.
Do not mention Credex unless savings exceed $500/month.
```

Where `{toolSummary}` is built as:
```typescript
const toolSummary = audit.tools
  .map(t =>
    `${t.name} (${t.plan}, ${t.seats} seats, $${t.currentSpend}/mo): 
     ${t.recommendedAction}`
  )
  .join("\n");
```

---

## Why This Prompt Was Written This Way

### Decision 1 — "Financial advisor for startups" persona
Setting a specific persona gives the model a consistent tone anchor. Without
it, early drafts were either too casual ("Hey! You're spending too much!")
or too formal ("Upon analysis of your expenditure profile..."). The financial
advisor framing produces direct, credible, peer-level language that an
engineering manager would respect.

### Decision 2 — Numbered instructions (1), (2), (3)
The first version of the prompt was a paragraph of instructions. The model
would sometimes skip the "biggest opportunity by name" requirement and give
a generic summary. Breaking it into numbered steps made compliance consistent
across different audit compositions.

### Decision 3 — "Do not use bullet points. One plain paragraph only."
Without this constraint, the model frequently returned a bulleted list
instead of a paragraph — especially when there were 4+ tools in the audit.
The results page is designed for a paragraph in a pull-quote card; bullets
broke the layout and felt like a report, not a summary.

### Decision 4 — "Do not mention Credex unless savings exceed $500/month"
The tool must feel genuinely helpful first, and commercial second. If the
model mentioned Credex for every audit, low-savings users would feel like
they'd been funnelled into a sales pitch. The $500 threshold matches the
UI logic for showing the Credex CTA card.

### Decision 5 — Passing tool data as plain text, not JSON
Early versions passed `JSON.stringify(audit.tools)` directly. The model
handled it fine but the prompts were harder to read and debug. Plain text
`Tool (Plan, X seats, $Y/mo): Action` is readable in logs and produces
the same output quality.

---

## What Was Tried That Didn't Work

### Attempt 1 — Asking the model to also generate recommendations
Early prompt: *"Based on the tools above, identify savings opportunities
and write a summary."*

**Problem:** The model would invent savings numbers that didn't match the
audit engine's output. A user would see "$340 savings" in the summary but
"$280 savings" in the per-tool cards. This is a trust-destroying inconsistency.

**Fix:** Removed all recommendation generation from the prompt. The model
now only receives the already-computed recommendations and writes a narrative
around them. Numbers come from the engine; words come from the model.

### Attempt 2 — Asking for a "friendly" tone
Early prompt included: *"Write in a friendly, encouraging tone."*

**Problem:** The model produced summaries with excessive affirmations:
*"Great job using Claude Pro! You're already making smart choices..."*
This felt patronising to a technical audience who just wants the facts.

**Fix:** Replaced "friendly" with "direct, friendly" — the word "direct"
anchors the tone and prevents over-encouragement.

### Attempt 3 — Shorter max_tokens (200)
Tried limiting to 200 tokens to force brevity.

**Problem:** The model would cut off mid-sentence for complex audits with
5+ tools, since it needed more tokens to name each tool's recommendation.

**Fix:** Set max_tokens to 1000. The model self-limits to ~100 words when
the prompt instructs it to — the token limit is a safety ceiling, not a
length guide.

---

## Fallback Template

If the Anthropic API returns a non-2xx response or times out after 8 seconds,
the route handler returns this template instead. The user sees a summary
either way — never an error state.

```typescript
function templateSummary(audit: AuditReport): string {
  const topSaving = [...audit.tools]
    .sort((a, b) => b.savings - a.savings)[0];

  return `Your ${audit.teamSize}-person ${audit.useCase} team is spending ` +
    `across ${audit.tools.length} AI tools with $${audit.totalMonthlySavings}` +
    `/month in avoidable costs. The biggest single win is your ` +
    `${topSaving.name} setup — ${topSaving.reason} Start there: the switch ` +
    `is low-risk and the savings are immediate. Acting on all recommendations ` +
    `could return $${(audit.totalMonthlySavings * 12).toLocaleString()} to ` +
    `your budget over the next year.`;
}
```

The fallback uses the same data as the AI prompt — it just fills a template
rather than generating prose. The savings numbers are always from the audit
engine, never from the LLM.

---

## AI Usage Disclosure

Per the assignment requirements, AI tools were used as follows:

- **Cursor (Claude Sonnet backend):** Primary coding assistant for scaffolding,
  component boilerplate, Supabase client setup, and shadcn/ui wiring
- **Claude.ai:** Architecture decisions, documentation drafting (GTM, ECONOMICS,
  ARCHITECTURE, LANDING_COPY, METRICS), and prompt iteration
- **What AI was not trusted with:** Audit engine logic, pricing data verification,
  unit test case design, and REFLECTION.md content — all written manually

The audit engine and all savings calculations were written by hand and verified
against real pricing pages. No LLM output was used for any number that appears
on the results page.
