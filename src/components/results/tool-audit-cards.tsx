import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ToolAuditResult } from "@/lib/audit-engine/types";

const actionLabel: Record<ToolAuditResult["recommendedAction"], string> = {
  keep: "Keep current setup",
  switch_plan_same_vendor: "Switch plan (same vendor)",
  switch_vendor_for_use_case: "Switch vendor (better fit)",
  manual_review: "Manual review recommended",
};

export function ToolAuditCards({ tools }: { tools: ToolAuditResult[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {tools.map((t) => (
        <Card key={t.tool}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t.tool}</span>
              <span className="text-sm text-muted-foreground">{actionLabel[t.recommendedAction]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Spend:</span> ${t.currentSpend.toFixed(2)} → ${t.projectedSpend.toFixed(2)}
            </p>
            <p>
              <span className="text-muted-foreground">Savings:</span>{" "}
              <span className={t.savings > 0 ? "text-green-600 font-medium" : ""}>
                ${t.savings.toFixed(2)}/mo
              </span>
            </p>
            <p className="text-muted-foreground">{t.reason}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}