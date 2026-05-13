import type { SpendFormData, ToolName } from "@/types/spend-form";

const tools: ToolName[] = [
  "cursor",
  "github_copilot",
  "claude",
  "chatgpt",
  "anthropic_api",
  "openai_api",
  "gemini",
  "windsurf",
];

export const defaultSpendFormValues: SpendFormData = {
  step1: {
    teamSize: 5,
    primaryUseCase: "coding",
  },
  step2: {
    tools: tools.map((tool, i) => ({
      id: `${tool}-${i}`,
      tool,
      plan: "pro",
      seats: 0,
      monthlySpend: 0,
    })),
  },
};