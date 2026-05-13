import { z } from "zod";
import { API_MODEL_NAMES, PLAN_NAMES, TOOL_NAMES } from "@/types/spend-form";

const API_TOOLS = new Set<string>(["anthropic_api", "openai_api", "gemini_api", "v0_api"]);

export const toolInputSchema = z
  .object({
    id: z.string().min(1),
    tool: z.enum(TOOL_NAMES),
    plan: z.enum(PLAN_NAMES),
    seats: z.number().int().min(0),
    monthlySpend: z.number().min(0),
    apiModel: z.enum(API_MODEL_NAMES).optional(),
  })
  .superRefine((val, ctx) => {
    const isApi = API_TOOLS.has(val.tool);

    if (isApi && !val.apiModel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "API model is required for API tools",
        path: ["apiModel"],
      });
    }

    if (!isApi && val.apiModel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "apiModel should only be set for API tools",
        path: ["apiModel"],
      });
    }
  });

export const spendFormSchema = z.object({
  teamSize: z.number().int().min(1, "Team size must be at least 1"),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(toolInputSchema).min(1, "Add at least one tool"),
  website: z.string().optional(),
});

export type SpendFormSchema = z.infer<typeof spendFormSchema>;