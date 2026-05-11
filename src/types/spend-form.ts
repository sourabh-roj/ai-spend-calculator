export type PrimaryUseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed";

export type ToolName =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type ToolPlan =
  | "free"
  | "pro"
  | "team"
  | "enterprise"
  | "api_payg"
  | "custom";

export interface TeamStep {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
}

export interface ToolRow {
  id: string;
  tool: ToolName;
  plan: ToolPlan;
  seats: number;
  monthlySpend: number;
}

export interface SpendFormData {
  step1: TeamStep;
  step2: {
    tools: ToolRow[];
  };
}

export const TOOL_LABELS: Record<ToolName, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const TOOL_NAMES: ToolName[] = [
  "cursor",
  "github_copilot",
  "claude",
  "chatgpt",
  "anthropic_api",
  "openai_api",
  "gemini",
  "windsurf",
];

export const PLAN_OPTIONS: ToolPlan[] = [
  "free",
  "pro",
  "team",
  "enterprise",
  "api_payg",
  "custom",
];