export type RecommendedAction =
  | "keep"
  | "switch_plan_same_vendor"
  | "switch_vendor_for_use_case"
  | "manual_review";

export interface ToolAuditResult {
  tool: string;
  currentSpend: number;
  projectedSpend: number;
  savings: number;
  recommendedAction: RecommendedAction;
  reason: string;
}

export interface AuditReport {
  slug: string;
  currentMonthlySpend: number;
  projectedMonthlySpend: number;
  totalSavingsMonthly: number;
  tools: ToolAuditResult[];
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
}