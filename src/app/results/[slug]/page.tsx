import { Suspense } from "react";
import { ResultsClient } from "./results-client";

function ResultsFallback() {
  return (
    <main className="container-shell py-10">
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
        Loading results…
      </div>
    </main>
  );
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ResultsFallback />}>
      <ResultsClient slug={slug} />
    </Suspense>
  );
}