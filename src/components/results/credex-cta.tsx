import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CredexCta({ monthlySavings }: { monthlySavings: number }) {
  return (
    <section className="rounded-xl border-2 border-green-500 p-6 bg-green-50/40">
      <h3 className="text-2xl font-semibold">Unlock your savings with Credex</h3>
      <p className="mt-2 text-muted-foreground">
        You could save about ${monthlySavings.toFixed(0)}/month. Credex can help implement these optimizations quickly.
      </p>
      <Button asChild className="mt-4">
        <Link href="/credex">Talk to Credex</Link>
      </Button>
    </section>
  );
}