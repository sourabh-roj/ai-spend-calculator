# TESTS.md — Automated Test Suite
## AI Spend Audit Tool · credex.rocks

---

## How to Run All Tests

```bash
npm test
```

For watch mode during development:
```bash
npm test -- --watch
```

For coverage report:
```bash
npm test -- --coverage
```

All tests must pass before pushing to main. The CI workflow runs `npm test`
on every push to the `main` branch.

---

## Test Files

### `__tests__/audit-engine.test.ts`
**What it covers:** Core audit engine logic — the pure function that takes
user tool data and returns savings recommendations. This is the most critical
file in the codebase; wrong numbers here directly mislead users.

**How to run:**
```bash
npm test -- --testPathPattern=audit-engine
```

---

## Test Cases

### Test 1 — Oversized plan for small team
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `flags ChatGPT Team plan as overkill for 2-person team`

```typescript
it("flags ChatGPT Team plan as overkill for 2-person team", () => {
  const input = [{
    name: "ChatGPT",
    plan: "Team",
    seats: 2,
    monthlySpend: 60,
    useCase: "writing"
  }];
  const result = runAudit(input, 2, "writing");
  expect(result.tools[0].savings).toBeGreaterThan(0);
  expect(result.tools[0].recommendedAction).toMatch(/Plus|downgrade/i);
});
```

**Why this test matters:** ChatGPT Team is $30/seat/month. For 2 users,
that is $60/month. ChatGPT Plus at $20/user is $40/month for the same
capability at this team size. The engine must catch this.

---

### Test 2 — Single seat on business plan
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `recommends Cursor Pro over Business for single user`

```typescript
it("recommends Cursor Pro over Business for single user", () => {
  const input = [{
    name: "Cursor",
    plan: "Business",
    seats: 1,
    monthlySpend: 40,
    useCase: "coding"
  }];
  const result = runAudit(input, 1, "coding");
  expect(result.tools[0].savings).toBe(20);
  expect(result.tools[0].projectedSpend).toBe(20);
});
```

**Why this test matters:** Cursor Business is $40/seat/month and adds
admin controls irrelevant to a solo user. Cursor Pro at $20/month covers
all coding features. Savings must be exactly $20.

---

### Test 3 — Already optimal spend returns zero savings
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `returns zero savings for already-optimal tool`

```typescript
it("returns zero savings for already-optimal tool", () => {
  const input = [{
    name: "Gemini",
    plan: "Pro",
    seats: 5,
    monthlySpend: 100,
    useCase: "research"
  }];
  const result = runAudit(input, 5, "research");
  expect(result.tools[0].savings).toBe(0);
  expect(result.totalMonthlySavings).toBe(0);
});
```

**Why this test matters:** The engine must not manufacture savings where
none exist. A finance-literate reviewer should agree with every result.
Returning fake savings destroys trust in the tool.

---

### Test 4 — High savings triggers Credex upsell flag
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `sets credexUpsell flag when total savings exceed $500/mo`

```typescript
it("sets credexUpsell flag when total savings exceed $500/mo", () => {
  const input = [
    { name: "Cursor", plan: "Business", seats: 10, monthlySpend: 400, useCase: "coding" },
    { name: "ChatGPT", plan: "Enterprise", seats: 10, monthlySpend: 420, useCase: "coding" },
  ];
  const result = runAudit(input, 10, "coding");
  expect(result.totalMonthlySavings).toBeGreaterThan(500);
  expect(result.showCredexCTA).toBe(true);
});
```

**Why this test matters:** The Credex CTA is a core business requirement —
it must appear for high-savings audits and drives the lead-generation value
of the tool. Must be triggered by the engine, not hardcoded in the UI.

---

### Test 5 — Redundant overlapping tools flagged
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `flags GitHub Copilot as redundant when Cursor Pro is active`

```typescript
it("flags GitHub Copilot as redundant when Cursor Pro is active", () => {
  const input = [
    { name: "Cursor", plan: "Pro", seats: 5, monthlySpend: 100, useCase: "coding" },
    { name: "GitHub Copilot", plan: "Business", seats: 5, monthlySpend: 95, useCase: "coding" },
  ];
  const result = runAudit(input, 5, "coding");
  const copilot = result.tools.find(t => t.name === "GitHub Copilot");
  expect(copilot?.savings).toBeGreaterThan(0);
  expect(copilot?.recommendedAction).toMatch(/redundant|remove|Cursor/i);
});
```

**Why this test matters:** A team running both Cursor Pro and GitHub Copilot
for the same coding use case is paying twice for the same capability. The
engine must detect this overlap and recommend removing the redundant tool.

---

### Test 6 — Annual savings calculation is correct
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `calculates annual savings as 12x monthly savings`

```typescript
it("calculates annual savings as 12x monthly savings", () => {
  const input = [{
    name: "Cursor",
    plan: "Business",
    seats: 4,
    monthlySpend: 160,
    useCase: "coding"
  }];
  const result = runAudit(input, 4, "coding");
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});
```

**Why this test matters:** The annual savings figure is displayed prominently
in the hero section and is a key sharing hook. It must be exactly 12x the
monthly figure — no rounding errors, no off-by-one.

---

### Test 7 — Integer arithmetic, no floating point errors
**File:** `__tests__/audit-engine.test.ts`
**Test name:** `handles fractional pricing without floating point errors`

```typescript
it("handles fractional pricing without floating point errors", () => {
  const input = [{
    name: "GitHub Copilot",
    plan: "Individual",
    seats: 1,
    monthlySpend: 10,
    useCase: "coding"
  }];
  const result = runAudit(input, 1, "coding");
  // Savings should be a clean integer, not 0.000000001 due to float arithmetic
  expect(Number.isInteger(result.tools[0].savings)).toBe(true);
  expect(Number.isInteger(result.totalMonthlySavings)).toBe(true);
});
```

**Why this test matters:** All prices are stored as integers (cents) and
divided by 100 for display only. This test guards against floating-point
rounding bugs that could produce savings of `$159.99999` instead of `$160`.

---

## CI Integration

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`:

```yaml
- name: Run tests
  run: npm test -- --ci --passWithNoTests
```

The `--ci` flag disables watch mode and treats any test failure as a
non-zero exit code, which fails the workflow and blocks the build job.

---

## Test Coverage

```bash
npm test -- --coverage
```

Key coverage targets:
- `lib/audit-engine/index.ts` — aim for >90% line coverage
- `lib/pricing-data.ts` — all pricing constants referenced in at least one test

---

*All 7 tests listed above must pass with `npm test` before submission.*
*Run `npm test` locally to verify before pushing.*
