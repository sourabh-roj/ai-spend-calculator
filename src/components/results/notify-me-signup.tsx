"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NotifyMeSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // call your /api/notify endpoint
    setDone(true);
  }

  return (
    <section className="rounded-xl border p-6">
      <h3 className="text-xl font-semibold">You&apos;re spending well</h3>
      <p className="mt-1 text-muted-foreground">Potential savings are currently low. Get notified when better plan opportunities appear.</p>

      {done ? (
        <p className="mt-4 text-green-600">Thanks! We&apos;ll notify you.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex gap-2 max-w-md">
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Notify me</Button>
        </form>
      )}
    </section>
  );
}