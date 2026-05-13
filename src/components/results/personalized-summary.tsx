import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPersonalizedSummary } from "@/lib/anthropic-summary";
import type { AuditReport } from "@/lib/audit-engine/types";

export async function PersonalizedSummary({ report }: { report: AuditReport }) {
  const summary = await getPersonalizedSummary(report);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-7 text-sm md:text-base">{summary}</p>
      </CardContent>
    </Card>
  );
}