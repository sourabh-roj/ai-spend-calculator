"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecommendedAction = "keep" | "switch_plan_same_vendor" | "switch_vendor_for_use_case" | "manual_review";

type ToolAuditResult = {
  tool: string;
  currentSpend: number;
  recommendedAction: RecommendedAction;
  projectedSpend: number;
  savings: number;
  reason: string;
};

type AuditReport = {
  slug: string;
  currentMonthlySpend: number;
  projectedMonthlySpend: number;
  totalSavingsMonthly: number;
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
  tools: ToolAuditResult[];
};

function actionLabel(action: RecommendedAction): string {
  if (action === "keep") return "Keep";
  if (action === "switch_plan_same_vendor") return "Switch plan";
  if (action === "switch_vendor_for_use_case") return "Switch vendor";
  return "Manual review";
}

export function ResultsClient({ slug }: { slug: string }) {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [summary, setSummary] = useState<string>("Generating personalized summary...");

  useEffect(() => {
    const raw = window.localStorage.getItem("budgetbhai-reports-v1");
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, AuditReport>;
    setReport(parsed[slug] ?? null);
  }, [slug]);

  useEffect(() => {
    async function loadSummary() {
      if (!report) return;
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ report }),
        });
        if (!res.ok) throw new Error("summary failed");
        const data = (await res.json()) as { summary: string };
        setSummary(data.summary);
      } catch {
        setSummary(
          `BudgetBhai found current spend of $${report.currentMonthlySpend.toFixed(
            0
          )}/month with potential savings of $${report.totalSavingsMonthly.toFixed(
            0
          )}/month. Prioritize the highest-savings plan changes first, then review remaining tools next billing cycle.`
        );
      }
    }
    loadSummary();
  }, [report]);

  const annualSavings = useMemo(() => (report ? report.totalSavingsMonthly * 12 : 0), [report]);

  if (!report) {
    return (
      <main className="bb-shell py-10">
        <Card>
          <CardHeader>
            <CardTitle>Result not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No report found for this link. Submit the form again.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="bb-shell py-10 space-y-8">
      <section className="bb-hero">
        <p className="bb-label">Total monthly spend</p>
        <h1 className="bb-kpi">${report.currentMonthlySpend.toFixed(2)}</h1>
        <p className="bb-label mt-6">Projected annual savings</p>
        <p className="text-3xl md:text-5xl font-semibold text-green-600">${annualSavings.toFixed(2)}</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6">{summary}</CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {report.tools.map((t) => (
          <Card key={t.tool}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t.tool}</span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs">{actionLabel(t.recommendedAction)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                {`$${t.currentSpend.toFixed(2)} → $${t.projectedSpend.toFixed(2)}`}
              </p>
              <p className="font-medium text-green-600">${t.savings.toFixed(2)} / mo savings</p>
              <p className="text-muted-foreground">{t.reason}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {report.totalSavingsMonthly > 500 && (
        <section className="rounded-2xl border-2 border-green-500 bg-green-50 p-6">
          <h3 className="text-xl font-semibold">Credex can unlock these savings fast</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You are leaving more than $500/month on the table. Talk to Credex for implementation.
          </p>
        </section>
      )}

      {report.totalSavingsMonthly < 100 && (
        <section className="rounded-2xl border p-6">
          <h3 className="text-xl font-semibold">You're spending well</h3>
          <p className="mt-1 text-sm text-muted-foreground">Low optimization gap right now. Join notify-me for future pricing shifts.</p>
          <form className="mt-4 flex gap-2 max-w-md">
            <input
              type="email"
              placeholder="you@company.com"
              className="h-10 flex-1 rounded-md border px-3 text-sm"
              required
            />
            <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground">
              Notify me
            </button>
          </form>
        </section>
      )}
    </main>
  );
}