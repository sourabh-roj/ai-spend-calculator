import type { SpendFormData } from "@/types/spend-form";

export type RecommendedAction =
  | "keep"
  | "switch_plan_same_vendor"
  | "switch_vendor_for_use_case"
  | "manual_review";

export interface ToolAuditResult {
  tool: string;
  currentSpend: number;
  recommendedAction: RecommendedAction;
  projectedSpend: number;
  savings: number;
  reason: string;
}

export interface AuditReport {
  slug: string;
  currentMonthlySpend: number;
  projectedMonthlySpend: number;
  totalSavingsMonthly: number;
  teamSize: number;
  primaryUseCase: SpendFormData["step1"]["primaryUseCase"];
  tools: ToolAuditResult[];
}

const codingAlternatives = ["Cursor", "GitHub Copilot", "Windsurf"];
const mixedAlternatives = ["Claude", "ChatGPT", "Gemini"];

export function buildAuditReport(data: SpendFormData, slug: string): AuditReport {
  const tools: ToolAuditResult[] = data.step2.tools.map((row) => {
    const current = row.monthlySpend;

    let projected = current;
    let action: RecommendedAction = "keep";
    let reason = "Current setup appears cost-aligned.";

    // 1) Plan-seat fit heuristic
    if (row.plan === "team" && row.seats <= 1) {
      projected = current * 0.8;
      action = "switch_plan_same_vendor";
      reason = "Team plan with low seats often overpays; consider individual/pro tier.";
    }

    // 2) Same vendor cheaper heuristic
    if (row.plan === "enterprise" && row.seats < 10) {
      const sameVendorProjected = current * 0.75;
      if (sameVendorProjected < projected) {
        projected = sameVendorProjected;
        action = "switch_plan_same_vendor";
        reason = "Enterprise tier may be oversized for seat count.";
      }
    }

    // 3) Cheaper alternative by use case heuristic
    const altProjected = current * 0.85;
    if (altProjected < projected && current > 0) {
      projected = altProjected;
      action = "switch_vendor_for_use_case";
      const altList = data.step1.primaryUseCase === "coding" ? codingAlternatives : mixedAlternatives;
      reason = `Cheaper alternative for ${data.step1.primaryUseCase} use case likely exists (${altList.join(", ")}).`;
    }

    const savings = Math.max(0, current - projected);

    return {
      tool: row.tool,
      currentSpend: round2(current),
      recommendedAction: action,
      projectedSpend: round2(projected),
      savings: round2(savings),
      reason,
    };
  });

  const currentMonthlySpend = round2(tools.reduce((s, t) => s + t.currentSpend, 0));
  const projectedMonthlySpend = round2(tools.reduce((s, t) => s + t.projectedSpend, 0));

  return {
    slug,
    currentMonthlySpend,
    projectedMonthlySpend,
    totalSavingsMonthly: round2(currentMonthlySpend - projectedMonthlySpend),
    teamSize: data.step1.teamSize,
    primaryUseCase: data.step1.primaryUseCase,
    tools,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}