import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import type { SpendFormData } from "@/types/spend-form";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as SpendFormData;

    if (payload.website && payload.website.trim().length > 0) {
      return NextResponse.json({ ok: true, slug: "blocked", result: null }, { status: 200 });
    }

    const slug = crypto.randomUUID();
    const result = runAudit(payload, slug);

    return NextResponse.json({ ok: true, slug, result }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}