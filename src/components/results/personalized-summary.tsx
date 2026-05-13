import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPersonalizedSummary } from "@/lib/anthropic-summary";
import type { AuditResult } from "@/lib/audit-engine";

export async function PersonalizedSummary({ report }: { report: AuditResult }) {
  const summary = await getPersonalizedSummary(report);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-neutral-700">{summary}</p>
      </CardContent>
    </Card>
  );
}