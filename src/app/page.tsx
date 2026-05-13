import { Suspense } from "react";
import { SpendForm } from "@/components/spend-form";
function FormFallback() {
  return (
    <div className="card-ui p-6 text-sm text-neutral-600">
      Loading audit form…
    </div>
  );
}
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="container-shell flex h-14 items-center justify-between">
          <div className="text-sm font-bold tracking-wide">BUDGETBHAI</div>
          <a href="#audit" className="btn-black-sm">
            Audit Now
          </a>
        </div>
      </header>
      <div className="container-shell space-y-12 pb-16 pt-24">
        <section className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Stop Overspending on AI Tools</h1>
          <p className="max-w-2xl text-sm text-neutral-700 md:text-base">
            Audit subscriptions, benchmark spend per developer, and get a clear savings plan without creating an account.
          </p>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-neutral-300 px-3 py-1">Free</span>
            <span className="rounded-full border border-neutral-300 px-3 py-1">No Account Needed</span>
            <span className="rounded-full border border-neutral-300 px-3 py-1">3 Minute Audit</span>
          </div>

          <a href="#audit" className="btn-black inline-flex w-full sm:w-auto">
            Audit Your AI Spend Now
          </a>
        </section>

        <section id="audit" className="space-y-4">
          <h2 className="text-2xl font-bold">Run your audit</h2>
          <Suspense fallback={<FormFallback />}>
            <SpendForm />
          </Suspense>
        </section>
      </div>
      <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} BUDGETBHAI
      </footer>
    </main>
  );
}
