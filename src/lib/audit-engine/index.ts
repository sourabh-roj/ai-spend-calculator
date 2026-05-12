// /lib/audit-engine/index.ts

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";
export type BillingModel = "seat" | "flat" | "usage" | "custom";
export type RecommendedAction =
  | "keep"
  | "switch_plan_same_vendor"
  | "switch_vendor_for_use_case"
  | "manual_review";

export type Vendor =
  | "cursor"
  | "claude"
  | "openai"
  | "github"
  | "gemini"
  | "v0"
  | "anthropic_api"
  | "openai_api"
  | "gemini_api"
  | "v0_api";

export interface ToolInput {
  vendor: Vendor;
  plan: string;
  seats: number;
  /**
   * Current monthly spend for this line item in your reporting currency.
   * For usage-based tools, this can be provided directly, or derived from usage.
   */
  monthlySpend?: number;
  useCase: UseCase;

  /**
   * Optional usage dimensions for API tools (monthly).
   */
  usage?: {
    inputTokensM?: number; // in millions
    outputTokensM?: number; // in millions
    cacheWriteTokensM?: number; // in millions (Claude API)
    cacheReadTokensM?: number; // in millions (Claude API)
  };
}

export interface ToolAuditResult {
  vendor: Vendor;
  plan: string;
  seats: number;
  currentSpend: number;
  recommendedAction: RecommendedAction;
  projectedSpend: number;
  savings: number;
  reason: string;
}

interface PlanDef {
  name: string;
  billing: BillingModel;
  monthlyPerSeat?: number;
  monthlyFlat?: number;
  // Seat window where this plan is the intended target.
  minSeats?: number;
  maxSeats?: number;
  // Whether this plan should be excluded from auto recommendation.
  recommendable?: boolean;
}

interface VendorCatalog {
  vendor: Vendor;
  primaryUseCase: UseCase;
  plans: PlanDef[];
}

const CATALOG: Record<Vendor, VendorCatalog> = {
  cursor: {
    vendor: "cursor",
    primaryUseCase: "coding",
    plans: [
      { name: "hobby", billing: "flat", monthlyFlat: 0, minSeats: 1, maxSeats: 1 },
      { name: "pro", billing: "flat", monthlyFlat: 20, minSeats: 1, maxSeats: 1 },
      { name: "pro+", billing: "flat", monthlyFlat: 60, minSeats: 1, maxSeats: 1 },
      { name: "ultra", billing: "flat", monthlyFlat: 200, minSeats: 1, maxSeats: 1 },
      { name: "teams", billing: "seat", monthlyPerSeat: 40, minSeats: 2 },
      { name: "enterprise", billing: "custom", minSeats: 10, recommendable: false },
    ],
  },
  claude: {
    vendor: "claude",
    primaryUseCase: "mixed",
    plans: [
      { name: "free", billing: "flat", monthlyFlat: 0, minSeats: 1, maxSeats: 1 },
      { name: "pro", billing: "flat", monthlyFlat: 17, minSeats: 1, maxSeats: 1 },
      { name: "max", billing: "flat", monthlyFlat: 100, minSeats: 1, maxSeats: 1 },
      // Using lower bound where ranges were provided.
      { name: "team_standard", billing: "seat", monthlyPerSeat: 20, minSeats: 5, maxSeats: 150 },
      { name: "team_premium", billing: "seat", monthlyPerSeat: 100, minSeats: 5, maxSeats: 150 },
      { name: "enterprise", billing: "seat", monthlyPerSeat: 20, minSeats: 5, recommendable: false },
    ],
  },
  openai: {
    vendor: "openai",
    primaryUseCase: "mixed",
    plans: [
      { name: "free", billing: "flat", monthlyFlat: 0, minSeats: 1, maxSeats: 1 },
      { name: "go", billing: "flat", monthlyFlat: 399, minSeats: 1, maxSeats: 1 },
      { name: "plus", billing: "flat", monthlyFlat: 1999, minSeats: 1, maxSeats: 1 },
      { name: "pro", billing: "flat", monthlyFlat: 10699, minSeats: 1, maxSeats: 1 },
      { name: "chatgpt_codex", billing: "seat", monthlyPerSeat: 1800, minSeats: 2 },
      { name: "codex_payg", billing: "usage", recommendable: false },
    ],
  },
  github: {
    vendor: "github",
    primaryUseCase: "coding",
    plans: [
      { name: "free", billing: "seat", monthlyPerSeat: 0, minSeats: 1 },
      { name: "team", billing: "seat", monthlyPerSeat: 4, minSeats: 1 },
      { name: "enterprise", billing: "seat", monthlyPerSeat: 21, minSeats: 1 },
    ],
  },
  gemini: {
    vendor: "gemini",
    primaryUseCase: "mixed",
    plans: [
      { name: "free", billing: "flat", monthlyFlat: 0, minSeats: 1, maxSeats: 1 },
      { name: "google_ai_plus", billing: "flat", monthlyFlat: 399, minSeats: 1, maxSeats: 1 },
      { name: "google_ai_pro", billing: "flat", monthlyFlat: 1950, minSeats: 1, maxSeats: 1 },
      { name: "google_ai_ultra", billing: "custom", minSeats: 1, recommendable: false },
    ],
  },
  v0: {
    vendor: "v0",
    primaryUseCase: "coding",
    plans: [
      { name: "free", billing: "flat", monthlyFlat: 0, minSeats: 1, maxSeats: 1 },
      { name: "team", billing: "seat", monthlyPerSeat: 30, minSeats: 2 },
      { name: "business", billing: "seat", monthlyPerSeat: 100, minSeats: 2 },
      { name: "enterprise", billing: "custom", minSeats: 10, recommendable: false },
    ],
  },
  anthropic_api: {
    vendor: "anthropic_api",
    primaryUseCase: "mixed",
    plans: [{ name: "api_usage", billing: "usage" }],
  },
  openai_api: {
    vendor: "openai_api",
    primaryUseCase: "mixed",
    plans: [{ name: "api_usage", billing: "usage" }],
  },
  gemini_api: {
    vendor: "gemini_api",
    primaryUseCase: "mixed",
    plans: [{ name: "api_usage", billing: "usage" }],
  },
  v0_api: {
    vendor: "v0_api",
    primaryUseCase: "coding",
    plans: [{ name: "api_usage", billing: "usage" }],
  },
};

// For “cheaper alternative for use case”, we compare cheapest recommendable options.
const USE_CASE_ALTERNATIVE_VENDORS: Record<UseCase, Vendor[]> = {
  coding: ["cursor", "github", "v0", "openai", "claude", "gemini"],
  writing: ["claude", "openai", "gemini"],
  data: ["openai", "claude", "gemini"],
  research: ["openai", "claude", "gemini"],
  mixed: ["claude", "openai", "gemini", "cursor"],
};

// API per-million-token pricing (from your verified list).
const API_PRICING = {
  anthropic_api: {
    inputPerM: 5,
    outputPerM: 25,
    cacheWritePerM: 6.25,
    cacheReadPerM: 0.5,
  },
  openai_api: {
    // defaulting to GPT-5.5 unless plan identifies another model
    gpt_5_5: { inputPerM: 5, outputPerM: 30 },
    gpt_5_4: { inputPerM: 2.5, outputPerM: 15 },
    gpt_5_4_mini: { inputPerM: 0.75, outputPerM: 4.5 },
  },
  gemini_api: {
    gemini_3_1_pro_preview: { inputPerM: 4, outputPerM: 18 },
    gemini_3_1_flash_lite: { inputPerM: 0.25, outputPerM: 1.5 },
    free_tier: { inputPerM: 0, outputPerM: 0 },
  },
  v0_api: {
    mini: { inputPerM: 1, outputPerM: 5 },
    pro: { inputPerM: 3, outputPerM: 15 },
    max: { inputPerM: 5, outputPerM: 25 },
    max_fast: { inputPerM: 30, outputPerM: 150 },
  },
} as const;

function normalizePlan(plan: string): string {
  return plan.trim().toLowerCase().replace(/\s+/g, "_");
}

function spendForPlan(plan: PlanDef, seats: number): number | null {
  if (plan.billing === "custom") return null;
  if (plan.billing === "usage") return null;
  if (plan.billing === "flat") return plan.monthlyFlat ?? null;
  if (plan.billing === "seat") return (plan.monthlyPerSeat ?? 0) * Math.max(seats, 0);
  return null;
}

function planFitsSeats(plan: PlanDef, seats: number): boolean {
  if (plan.minSeats !== undefined && seats < plan.minSeats) return false;
  if (plan.maxSeats !== undefined && seats > plan.maxSeats) return false;
  return true;
}

function currentSpend(tool: ToolInput): number {
  // If user provides a spend value, trust it.
  if (typeof tool.monthlySpend === "number") return tool.monthlySpend;

  // Otherwise derive where possible.
  if (tool.vendor.endsWith("_api")) {
    return estimateApiSpend(tool);
  }

  const vendor = CATALOG[tool.vendor];
  const matched = vendor.plans.find((p) => normalizePlan(p.name) === normalizePlan(tool.plan));
  if (!matched) return 0;
  return spendForPlan(matched, tool.seats) ?? 0;
}

function estimateApiSpend(tool: ToolInput): number {
  const usage = tool.usage ?? {};
  const inM = usage.inputTokensM ?? 0;
  const outM = usage.outputTokensM ?? 0;

  if (tool.vendor === "anthropic_api") {
    const p = API_PRICING.anthropic_api;
    return (
      inM * p.inputPerM +
      outM * p.outputPerM +
      (usage.cacheWriteTokensM ?? 0) * p.cacheWritePerM +
      (usage.cacheReadTokensM ?? 0) * p.cacheReadPerM
    );
  }

  if (tool.vendor === "openai_api") {
    const key =
      normalizePlan(tool.plan) === "gpt_5_4"
        ? "gpt_5_4"
        : normalizePlan(tool.plan) === "gpt_5_4_mini"
          ? "gpt_5_4_mini"
          : "gpt_5_5";
    const p = API_PRICING.openai_api[key];
    return inM * p.inputPerM + outM * p.outputPerM;
  }

  if (tool.vendor === "gemini_api") {
    const key =
      normalizePlan(tool.plan) === "gemini_3_1_flash_lite"
        ? "gemini_3_1_flash_lite"
        : normalizePlan(tool.plan) === "free_tier"
          ? "free_tier"
          : "gemini_3_1_pro_preview";
    const p = API_PRICING.gemini_api[key];
    return inM * p.inputPerM + outM * p.outputPerM;
  }

  if (tool.vendor === "v0_api") {
    const key =
      normalizePlan(tool.plan) === "mini"
        ? "mini"
        : normalizePlan(tool.plan) === "pro"
          ? "pro"
          : normalizePlan(tool.plan) === "max_fast"
            ? "max_fast"
            : "max";
    const p = API_PRICING.v0_api[key];
    return inM * p.inputPerM + outM * p.outputPerM;
  }

  return 0;
}

function cheapestSameVendorPlan(tool: ToolInput): { plan: string; spend: number } | null {
  const vendor = CATALOG[tool.vendor];

  // API tools: keep current pricing model (same vendor cheaper plan requires usage model choice).
  if (tool.vendor.endsWith("_api")) return null;

  const candidates = vendor.plans
    .filter((p) => p.recommendable !== false)
    .filter((p) => planFitsSeats(p, tool.seats))
    .map((p) => ({ plan: p.name, spend: spendForPlan(p, tool.seats) }))
    .filter((x): x is { plan: string; spend: number } => typeof x.spend === "number");

  if (!candidates.length) return null;
  return candidates.reduce((min, cur) => (cur.spend < min.spend ? cur : min));
}

function cheapestAlternativeForUseCase(tool: ToolInput): { vendor: Vendor; plan: string; spend: number } | null {
  // APIs are usage-driven; skip generic cross-vendor recommendation.
  if (tool.vendor.endsWith("_api")) return null;

  const vendors = USE_CASE_ALTERNATIVE_VENDORS[tool.useCase] ?? [];
  const options: { vendor: Vendor; plan: string; spend: number }[] = [];

  for (const v of vendors) {
    if (v.endsWith("_api")) continue;
    const catalog = CATALOG[v];
    const cheapest = catalog.plans
      .filter((p) => p.recommendable !== false)
      .filter((p) => planFitsSeats(p, tool.seats))
      .map((p) => ({ plan: p.name, spend: spendForPlan(p, tool.seats) }))
      .filter((x): x is { plan: string; spend: number } => typeof x.spend === "number")
      .sort((a, b) => a.spend - b.spend)[0];

    if (cheapest) {
      options.push({ vendor: v, plan: cheapest.plan, spend: cheapest.spend });
    }
  }

  if (!options.length) return null;
  return options.sort((a, b) => a.spend - b.spend)[0];
}

export function auditTools(tools: ToolInput[]): ToolAuditResult[] {
  return tools.map((tool) => {
    const curr = currentSpend(tool);
    const sameVendor = cheapestSameVendorPlan(tool);
    const crossVendor = cheapestAlternativeForUseCase(tool);

    const vendorCatalog = CATALOG[tool.vendor];
    const currentPlanDef = vendorCatalog.plans.find(
      (p) => normalizePlan(p.name) === normalizePlan(tool.plan)
    );
    const fitsSeatBand = currentPlanDef ? planFitsSeats(currentPlanDef, tool.seats) : true;

    // Default = keep
    let recommendedAction: RecommendedAction = "keep";
    let projected = curr;
    let reason = "Current setup appears cost-aligned.";

    // Rule 1: plan-seat mismatch
    if (!fitsSeatBand) {
      if (sameVendor && sameVendor.spend <= curr) {
        recommendedAction = "switch_plan_same_vendor";
        projected = sameVendor.spend;
        reason = `Current plan (${tool.plan}) does not match seat count (${tool.seats}). Switch to ${sameVendor.plan}.`;
      } else {
        recommendedAction = "manual_review";
        reason = `Current plan (${tool.plan}) may not fit seat count (${tool.seats}), but no safe automatic same-vendor replacement was found.`;
      }
    }

    // Rule 2: cheaper same-vendor plan
    if (sameVendor && sameVendor.spend < projected) {
      recommendedAction = "switch_plan_same_vendor";
      projected = sameVendor.spend;
      reason = `Cheaper same-vendor plan found: ${sameVendor.plan}.`;
    }

    // Rule 3: cheaper cross-vendor alternative for use case
    if (crossVendor && crossVendor.spend < projected) {
      recommendedAction = "switch_vendor_for_use_case";
      projected = crossVendor.spend;
      reason = `Cheaper ${tool.useCase} alternative found: ${crossVendor.vendor} (${crossVendor.plan}).`;
    }

    const savings = Math.max(0, curr - projected);

    return {
      vendor: tool.vendor,
      plan: tool.plan,
      seats: tool.seats,
      currentSpend: round2(curr),
      recommendedAction,
      projectedSpend: round2(projected),
      savings: round2(savings),
      reason,
    };
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}