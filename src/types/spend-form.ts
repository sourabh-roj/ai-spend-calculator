export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolName =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "gemini"
  | "github_copilot"
  | "v0_dev"
  | "anthropic_api"
  | "openai_api"
  | "gemini_api"
  | "v0_api";

export type PlanName =
  | "free"
  | "hobby"
  | "starter"
  | "pro"
  | "team"
  | "enterprise"
  | "plus"
  | "standard"
  | "premium";

export type ApiModel =
  | "claude_opus_4_7"
  | "gpt_5_5"
  | "gpt_5_4"
  | "gpt_5_4_mini"
  | "gemini_3_1_pro_preview"
  | "gemini_3_1_flash_lite"
  | "v0_mini"
  | "v0_pro"
  | "v0_max"
  | "v0_max_fast";

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
  website?: string; // honeypot
}