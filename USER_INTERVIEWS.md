# USER_INTERVIEWS.md — User Research
## AI Spend Audit Tool · credex.rocks

> Three interviews conducted on May 13, 2026 via WhatsApp.
> Each conversation was 8–12 minutes. Names withheld at participants' request.
> Quotes are direct translations/transcriptions from the conversations.

---

## Interview 1 — Student Developer, Solo Projects

**Participant:** R.K. (initials), Computer Science student, working on side
projects. Uses AI tools independently, not part of a team.
**Duration:** ~10 minutes
**Format:** WhatsApp voice + text

### What They Use
Currently on Cursor free tier. Had ChatGPT Plus but cancelled it last month.
Aware of Cursor Pro pricing (~$20/month) but hasn't upgraded yet.

### Direct Quotes

> "Cursor use kar raha hoon aaj kal mostly. Free version hi hai abhi toh,
> ChatGPT ka plus subscription tha par pichle mahine cancel kar diya."

> "Cursor Pro shayad $20 ka hai. ChatGPT Plus bhi wahi same price range mein
> hai. Student ke liye thoda mehenga padta hai monthly."

> "Zyada explore nahi kiya, par suna hai DeepSeek ya local LLMs saste padte
> hain agar API use karo toh. Par convenience ke liye log Cursor hi prefer
> karte hain."

### Most Surprising Thing They Said
They cancelled ChatGPT Plus not because it wasn't useful — but because they
couldn't justify paying for both Cursor and ChatGPT simultaneously on a
student budget. They were unaware that Claude Pro exists as a middle ground,
or that Anthropic API direct access could be significantly cheaper for their
actual usage volume. The decision to cancel was made without comparing
alternatives — they just dropped the more "optional" feeling one.

### What It Changed About the Design
This confirmed that the tool needs to handle the "student / low budget"
persona explicitly — not just startup teams. The results page now shows a
"you're spending well" path with a notify-me option rather than forcing a
Credex upsell on users who are already being frugal. It also reinforced
keeping the tool completely free with no login required — this user would
have bounced at any friction before seeing value.

---

## Interview 2 — Backend Developer, Early Career

**Participant:** S.M. (initials), backend developer, not yet full-time
employed, working on freelance and personal projects.
**Duration:** ~12 minutes
**Format:** WhatsApp text

### What They Use
Uses both ChatGPT (free) and Cursor (free) simultaneously — ChatGPT for
logic planning and architecture thinking, Cursor for actual implementation.
Has evaluated upgrading both but finds the combined cost prohibitive.
Has experimented with Gemini API via Continue.dev as a cost-saving measure.

### Direct Quotes

> "Both. ChatGPT for logic/planning and Cursor for the actual implementation.
> Using the free tiers for both currently."

> "If I upgrade both, it's like $40. Even just one is ₹1,700/mo. It's a lot
> when you're not earning full-time yet."

> "I tried using the Gemini API key inside VS Code extensions like
> Continue.dev. It's basically free because of the free tier limits, but
> the setup is a bit of a headache compared to Cursor."

### Most Surprising Thing They Said
They had already independently discovered the Gemini API + Continue.dev
workaround — essentially building their own free alternative to Cursor Pro.
The surprising part was that despite the cost savings, they found the setup
friction high enough that they kept returning to Cursor free tier anyway.
This suggests that the real barrier to switching isn't awareness of cheaper
options — it's the perceived effort of switching. The audit tool needs to
make the recommended action feel low-effort, not just financially obvious.

### What It Changed About the Design
Added a "1-sentence reason" field to every tool recommendation card — not
just what to switch to, but why it's low-risk to switch. The card now reads:
current spend → action → savings → reason → effort level. Also influenced
the decision to show the recommendation as "downgrade" or "remove" rather
than "switch to X" — reducing the perceived effort of acting on the audit.

---

## Interview 3 — UI/UX Designer, Paid User

**Participant:** A.V. (initials), UI/UX and creative work, active paid
ChatGPT Plus subscriber.
**Duration:** ~8 minutes
**Format:** WhatsApp text

### What They Use
ChatGPT Plus (paid, $20/month + GST). Tried Cursor but found it less useful
for design-adjacent work. Occasionally uses Claude as a free alternative but
hasn't compared pricing systematically.

### Direct Quotes

> "ChatGPT Plus use karta hoon. Cursor try kiya tha par UI ke liye ChatGPT
> zyada sahi lagta hai — images wagera ke liye."

> "Fixed ₹1,650 plus GST types. Yearly toh 20k cross kar jayega."

> "Claude use karta hoon kabhi kabhi, par sabki pricing almost same hi hai.
> Sasta kuch mila nahi jo itna stable ho."

### Most Surprising Thing They Said
They believed all AI tool pricing is "almost the same" — a perception that
led them to stop looking for alternatives entirely. In reality, for a solo
creative user doing primarily writing and image work, Claude Pro at $20/month
covers most of their ChatGPT Plus use cases at identical pricing, but with
different strengths. The issue wasn't the price — it was the lack of a
clear comparison that would tell them whether switching is worth the
disruption. They were paying correctly but didn't know it.

### What It Changed About the Design
This directly influenced the "you're spending well" result path. Originally
the tool only showed this message when savings were under $100/month. After
this interview, I added a short explanation of *why* the current setup is
optimal — not just "no savings found" but "ChatGPT Plus is correctly priced
for your use case and team size." Users like this participant need
confirmation, not just a null result. It makes the tool feel useful even
when it finds nothing to fix.

---

## Synthesis — What These Three Conversations Changed

**Before interviews:** Assumed the primary user was an engineering manager
at a funded startup making deliberate tooling decisions.

**After interviews:** The actual early user base is likely developers and
designers at a pre-revenue or early stage who are making ad-hoc decisions
about AI tools without any systematic comparison. They don't know what they
don't know — they cancel tools without comparing alternatives, they assume
all pricing is similar, and they avoid switching because setup friction feels
high even when the savings are real.

**Three design changes made directly from these conversations:**
1. Added a "you're spending well" confirmation path with explanation
2. Added effort-level framing to recommendation cards
3. Kept the tool fully anonymous with no login — any friction before the
   result would lose this audience entirely

---

*Interviews conducted: May 13, 2026*
*Format: WhatsApp text and voice messages*
*All participants are peers / personal network contacts*
