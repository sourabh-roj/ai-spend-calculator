import { NextResponse } from "next/server";
import { getPersonalizedSummary } from "@/lib/anthropic-summary";
import type { AuditReport } from "@/lib/audit-engine";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { report: AuditReport };
    const summary = await getPersonalizedSummary(body.report);
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json(
      { summary: "BudgetBhai could not generate AI summary right now. Showing standard recommendation template." },
      { status: 200 }
    );
  }
}