import type { SpendFormData } from "@/types/spend-form";

export type RecommendationType = "keep" | "switch_plan" | "switch_vendor";

export interface ToolRecommendation {
  tool: string;
  currentSpend: number;
  projectedSpend: number;
  savings: number;
  recommendation: RecommendationType;
  reason: string;
}

export interface AuditResult {
  slug: string;
  currentSpend: number;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  summary: string;
  tools: ToolRecommendation[];
}

export function runAudit(payload: SpendFormData, slug: string): AuditResult {
  const tools = payload.tools.map((row): ToolRecommendation => {
    const current = safeMoney(row.monthlySpend);
    let projected = current;
    let recommendation: RecommendationType = "keep";
    let reason = "Current setup appears cost-aligned.";

    // Simple heuristics
    if (row.plan === "enterprise" && row.seats < 10) {
      projected = current * 0.75;
      recommendation = "switch_plan";
      reason = "Enterprise plan may be oversized for current seat count.";
    } else if (row.plan === "team" && row.seats <= 1) {
      projected = current * 0.8;
      recommendation = "switch_plan";
      reason = "Team plan with low seat count may be over-provisioned.";
    } else if (current > 0) {
      projected = current * 0.9;
      recommendation = "switch_vendor";
      reason = "A lower-cost alternative may fit your use case better.";
    }

    const savings = Math.max(0, current - projected);

    return {
      tool: labelTool(row.tool, row.apiModel),
      currentSpend: round2(current),
      projectedSpend: round2(projected),
      savings: round2(savings),
      recommendation,
      reason,
    };
  });

  const currentSpend = round2(tools.reduce((s, t) => s + t.currentSpend, 0));
  const projectedSpend = round2(tools.reduce((s, t) => s + t.projectedSpend, 0));
  const monthlySavings = round2(currentSpend - projectedSpend);
  const annualSavings = round2(monthlySavings * 12);

  const summary = `Your team is currently spending $${currentSpend.toFixed(
    2
  )}/month. BudgetBhai estimates potential savings of $${monthlySavings.toFixed(
    2
  )}/month by optimizing plans and switching overpriced tools where appropriate.`;

  return {
    slug,
    currentSpend,
    projectedSpend,
    monthlySavings,
    annualSavings,
    summary,
    tools,
  };
}

function labelTool(tool: string, apiModel?: string): string {
  const base = tool.replaceAll("_", " ");
  if (apiModel) return `${base} (${apiModel.replaceAll("_", " ")})`;
  return base;
}

function safeMoney(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, v);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}