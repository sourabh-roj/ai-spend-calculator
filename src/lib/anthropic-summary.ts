import type { AuditResult } from "@/lib/audit-engine";

function fallbackSummary(report: AuditResult): string {
  const monthly = report.currentSpend ?? 0;
  const save = report.monthlySavings ?? 0;
  const annual = report.annualSavings ?? save * 12;

  return `BUDGETBHAI reviewed your stack at about $${monthly.toFixed(
    0
  )}/month in current spend. We estimate roughly $${save.toFixed(
    0
  )}/month in savings opportunity ($${annual.toFixed(
    0
  )}/year). Start with the highest-savings tool recommendations, then re-check next billing cycle to confirm realized savings.`;
}

export async function getPersonalizedSummary(report: AuditResult): Promise<string> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return fallbackSummary(report);

    const prompt = `Write ~100 words. Plain text only. Be specific and practical.
Team size (if known): ${report.teamSize ?? "unknown"}
Current monthly spend: ${report.currentSpend}
Projected monthly spend: ${report.projectedSpend}
Monthly savings: ${report.monthlySavings}
Annual savings: ${report.annualSavings}
Tool recommendations: ${JSON.stringify(report.tools)}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
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

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = data?.content?.find((c) => c.type === "text")?.text;
    return typeof text === "string" && text.trim().length > 0 ? text.trim() : fallbackSummary(report);
  } catch {
    return fallbackSummary(report);
  }
}