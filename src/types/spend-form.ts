export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export const TOOL_NAMES = [
  "cursor",
  "copilot",
  "claude",
  "chatgpt",
  "gemini",
  "github_copilot",
  "v0_dev",
  "anthropic_api",
  "openai_api",
  "gemini_api",
  "v0_api",
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

export const PLAN_NAMES = [
  "free",
  "hobby",
  "starter",
  "pro",
  "team",
  "enterprise",
  "plus",
  "standard",
  "premium",
] as const;

export type PlanName = (typeof PLAN_NAMES)[number];

export const API_MODEL_NAMES = [
  "claude_opus_4_7",
  "gpt_5_5",
  "gpt_5_4",
  "gpt_5_4_mini",
  "gemini_3_1_pro_preview",
  "gemini_3_1_flash_lite",
  "v0_mini",
  "v0_pro",
  "v0_max",
  "v0_max_fast",
] as const;

export type ApiModel = (typeof API_MODEL_NAMES)[number];

export interface ToolInput {
  id: string;
  tool: ToolName;
  plan: PlanName;
  seats: number;
  monthlySpend: number;
  apiModel?: ApiModel;
}

export interface SpendFormData {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
  website?: string;
}