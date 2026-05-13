import { NextResponse } from "next/server";
import { getPersonalizedSummary } from "@/lib/anthropic-summary";
import type { AuditResult } from "@/lib/audit-engine";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { report: AuditResult };
    const summary = await getPersonalizedSummary(body.report);
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ summary: "" }, { status: 200 });
  }
}