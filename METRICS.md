# METRICS.md — Metrics & Instrumentation
## AI Spend Audit Tool · credex.rocks

---

## North Star Metric

**Qualified leads captured per week**

Defined as: email addresses submitted by users whose audit showed ≥ $200/month
in identified savings.

### Why this, not something else

| Candidate metric | Why rejected |
|---|---|
| DAU / MAU | People use this tool once a quarter. Daily active users is meaningless for a tool with low repeat usage by design. |
| Audits completed | Volume without quality. A thousand audits from zero-savings teams helps nobody — not users, not Credex's sales pipeline. |
| Page views | Top-of-funnel vanity. Tells you about traffic sources, not whether the tool is working. |
| Revenue | Lags by 2–4 weeks (audit → consultation → purchase cycle). Too slow to act on in week 1. |
| Email capture rate | Rate without volume. A 40% capture rate on 10 audits is worse than 20% on 200. |

Qualified leads per week directly measures whether the audit tool is doing its one
job: surfacing real overspend to real buyers and getting them into Credex's pipeline.
It is a product metric and a business metric at the same time.

At the current stage, "qualified" is defined as savings ≥ $200/mo — a threshold
low enough to be actionable for the user and high enough to be worth Credex's
sales time. Recalibrate at week 8 based on actual consultation conversion data.

---

## 3 Input Metrics That Drive the North Star

### Input 1 — Audits completed per week
*The volume driver.*

```
Target (week 4):     150+ audits/week
Current baseline:    0 (pre-launch)
Owner:               Distribution (GTM channels)
Leading indicator:   Audit started rate from landing page (target ≥ 25%)
```

If audits completed is low, the distribution channels aren't working.
Fix: switch channel mix (see GTM.md), not the product.

### Input 2 — Savings-positive audit rate
*The quality driver. What % of completed audits find ≥ $200/mo in savings.*

```
Target:              40%+ of completed audits
Hypothesis:          Teams that search for "AI tool cost" already suspect overspend
Leading indicator:   Avg savings per audit (track weekly)
```

If this drops below 30%, one of two things is wrong:
(a) the wrong audience is finding the tool (zero-spend users, students, individuals), or
(b) the audit engine's pricing data is stale and no longer finding real savings.
Both require different fixes — hence tracking separately.

### Input 3 — Email capture rate of savings-positive audits
*The conversion driver. Of users who see real savings, what % give their email.*

```
Target:              28%+
Current benchmark:   22–25% (from GTM.md estimate)
Owner:               Product (results page design)
Leading indicator:   Scroll depth past the savings hero section
```

If capture rate is below 20%, the value proposition on the results page is unclear,
the email ask comes too early, or the savings number doesn't feel credible.
Fix: move the lead form lower, make the per-tool reasoning more specific, or add
a "how we calculated this" expandable section.

---

## What to Instrument First

In priority order — instrument these before launch, not after:

**1. Funnel events (Posthog or Vercel Analytics — both free)**
```
audit_started         { source: 'hn' | 'reddit' | 'direct' | 'share' }
audit_completed       { total_savings, tools_count, use_case }
results_page_viewed   { slug, savings_tier: 'high' | 'mid' | 'low' | 'optimal' }
lead_form_opened      { savings_amount }
lead_captured         { savings_amount, has_company, has_role }
share_link_copied     { slug }
share_link_opened     { slug, is_new_visitor: bool }
```

**2. Savings distribution histogram**
How many audits land in each bucket: <$100, $100–300, $300–500, $500–1000, $1000+.
This tells you whether the audit engine is calibrated correctly and which segment
dominates your user base.

**3. Drop-off step in the form**
Which step of the multi-step form do users abandon? If step 2 (add tools) has >50%
drop-off, the form is too long or confusing. Instrument each "next" button click.

**4. Share link virality coefficient**
For every audit that generates a shared URL, how many unique visitors does that URL
receive? Target: ≥ 0.3 (meaning 30% of audits generate at least one second-degree
visitor). Below 0.1 means the results page isn't compelling enough to share.

**5. Time-to-complete**
Median time from `audit_started` to `audit_completed`. Target: under 4 minutes.
Above 6 minutes means the form has friction that's killing completion rate.

---

## What Number Triggers a Pivot Decision

### Pivot trigger 1 — Audit completion rate < 35% at week 3
If fewer than 35% of users who start the form complete it by week 3, the form
is broken — too long, too confusing, or asking for information users don't have
readily available (e.g. exact monthly spend per seat). Pivot: simplify to a
slider-based estimate form instead of exact spend inputs.

### Pivot trigger 2 — Email capture rate < 12% sustained over 2 weeks
If fewer than 12% of completed-audit users give their email, the results page
is not showing enough value. The audit engine may be producing too many
"you're spending well" results, or the savings numbers feel untrustworthy.
Pivot: add a "how we calculated this" transparency section, or lower the
"you're spending well" threshold to surface more partial optimisations.

### Pivot trigger 3 — Zero shareable URL opens after week 2
If not a single shared URL receives a visit from someone other than the creator
within 2 weeks, the viral loop is broken. The results page is not interesting
enough to forward. Pivot: redesign the shareable page to look more like an
infographic and less like a form result — something a CFO would actually open.

### Pivot trigger 4 — Consultation booking rate < 5% of qualified leads
If Credex's sales team is not converting leads to consultations at ≥ 5%, the
leads are either low quality (wrong persona) or the handoff from tool to
consultation is too cold. Pivot: add an in-tool "book a 15-minute call" CTA
that pre-fills the user's audit data into the calendar invite so Credex arrives
prepared. Reduces friction at the highest-value conversion point.

---

## Metrics Anti-patterns to Avoid at This Stage

- **Do not track NPS yet.** Users who complete one audit have insufficient experience
  to give meaningful scores. Instrument at week 8 minimum.

- **Do not optimise for total page views.** A blog post about AI pricing that ranks
  on Google drives views from people who will never buy anything from Credex.
  Segment traffic by source and weight qualified-lead conversion, not raw volume.

- **Do not report "signups."** Email captures are not signups. They are the beginning
  of a lead funnel. Track the whole funnel. A high email capture rate with zero
  consultation bookings means the wrong people are submitting their email.

---

*Review this document at week 4 and update targets based on actuals.
Targets above are hypotheses, not commitments.*
