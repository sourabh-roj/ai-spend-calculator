import type { AuditReport } from "@/lib/audit-engine";

function fallbackSummary(report: AuditReport): string {
  const tone =
    report.totalSavingsMonthly > 500
      ? "You have meaningful savings opportunity and should prioritize highest-spend tools first."
      : report.totalSavingsMonthly < 100
        ? "Your spend is already well-optimized; maintain quarterly review."
        : "There are moderate optimization opportunities worth acting on this month.";

  return `BudgetBhai reviewed your ${report.teamSize}-member team's AI stack. Current spend is $${report.currentMonthlySpend.toFixed(
    0
  )}/month with projected savings of about $${report.totalSavingsMonthly.toFixed(
    0
  )}/month. ${tone} Focus on plan-rightsizing where seat counts are low and swap overpriced tools for better-fit alternatives by use case. Implement top 2 savings actions first, then track changes over the next billing cycle to confirm realized savings.`;
}

export async function getPersonalizedSummary(report: AuditReport): Promise<string> {
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return fallbackSummary(report);

    const prompt = `Write ~100 words. Keep concise, practical, and personalized.
Team size: ${report.teamSize}
Use case: ${report.primaryUseCase}
Current monthly spend: ${report.currentMonthlySpend}
Projected monthly spend: ${report.projectedMonthlySpend}
Monthly savings: ${report.totalSavingsMonthly}
Tool audits: ${JSON.stringify(report.tools)}
Plain text only.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 220,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
      cache: "no-store",
    });

    if (!res.ok) return fallbackSummary(report);

    const data = await res.json();
    const text = data?.content?.find((c: { type: string }) => c.type === "text")?.text;
    return typeof text === "string" && text.trim() ? text.trim() : fallbackSummary(report);
  } catch {
    return fallbackSummary(report);
  }
}