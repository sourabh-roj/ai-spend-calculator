import { z } from "zod";
import { TOOL_NAMES } from "@/types/spend-form";

export const spendFormSchema = z.object({
  step1: z.object({
    teamSize: z.number().int().min(1, "Team size must be at least 1"),
    primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  }),
  step2: z.object({
    tools: z
      .array(
        z.object({
          id: z.string().min(1),
          tool: z.enum(TOOL_NAMES),
          plan: z.enum(["free", "pro", "team", "enterprise", "api_payg", "custom"]),
          seats: z.number().int().min(0),
          monthlySpend: z.number().min(0),
        })
      )
      .length(8),
  }),
});

export type SpendFormSchema = z.infer<typeof spendFormSchema>;