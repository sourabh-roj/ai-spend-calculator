import type { SpendFormData, ToolInput, ToolName } from "@/types/spend-form";

const ORDER: ToolName[] = [
  "cursor",
  "github_copilot",
  "claude",
  "chatgpt",
  "anthropic_api",
  "openai_api",
  "gemini",
  "v0_api",
  "v0_dev",
];

export const defaultSpendFormValues: SpendFormData = {
  teamSize: 5,
  useCase: "coding",
  tools: ORDER.map(
    (tool, i): ToolInput => ({
      id: `${tool}-${i}`,
      tool,
      plan: "pro",
      seats: 0,
      monthlySpend: 0,
    })
  ),
  website: "",
};