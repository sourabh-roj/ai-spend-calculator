import { SpendForm } from "@/components/spend-form";

export default function HomePage() {
  return (
    <main className="bb-shell py-10 space-y-8">
      <section className="bb-hero">
        <p className="text-sm text-muted-foreground">BudgetBhai</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Your AI spend wingman</h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Analyze spend, pick better plans, and reduce waste in minutes.
        </p>
      </section>
      <SpendForm />
    </main>
  );
}