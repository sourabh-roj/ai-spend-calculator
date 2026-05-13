"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const RESULTS_STORAGE_KEY = "budgetbhai-results-v1";

type RecommendationType = "keep" | "switch_plan" | "switch_vendor";

interface ToolRecommendation {
  tool: string;
  currentSpend: number;
  projectedSpend: number;
  savings: number;
  recommendation: RecommendationType;
  reason: string;
}

interface AuditResult {
  slug: string;
  currentSpend: number;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  summary: string;
  tools: ToolRecommendation[];
  teamSize?: number;
}

function badgeClasses(kind: RecommendationType): string {
  if (kind === "keep") return "border-neutral-200 bg-neutral-50 text-neutral-800";
  if (kind === "switch_plan") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

function badgeLabel(kind: RecommendationType): string {
  if (kind === "keep") return "Keep";
  if (kind === "switch_plan") return "Switch Plan";
  return "Switch Vendor";
}

export function ResultsClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const [result, setResult] = useState<AuditResult | null | undefined>(undefined);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RESULTS_STORAGE_KEY);
      if (!raw) {
        setResult(null);
        return;
      }
      const map = JSON.parse(raw) as Record<string, AuditResult>;
      setResult(map[slug] ?? null);
    } catch {
      setResult(null);
    }
}, [slug]);

  const industryAvgPerDev = 145;

  const spendPerDev = useMemo(() => {
    if (!result) return 0;
    const team = result.teamSize && result.teamSize > 0 ? result.teamSize : 1;
    return result.currentSpend / team;
  }, [result]);

  const referralFromUrl = searchParams.get("ref");
  const referralCode = slug;

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin;
    return `${base}/?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  async function copyReferralCode() {
    await navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1200);
  }

  async function shareToEarn() {
    const url = shareUrl;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "BUDGETBHAI",
          text: "Audit your AI tool spend in minutes.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1200);
    } catch {
      // user cancelled share
    }
  }

  if (result === undefined) {
    return (
      <main className="container-shell py-10">
        <div className="card-ui p-6">
          <p className="text-sm text-neutral-600">Loading results…</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="container-shell py-10">
        <div className="card-ui p-6">
          <h1 className="text-xl font-bold">No saved report</h1>
          <p className="mt-2 text-sm text-neutral-600">
            We could not find a report for this link in this browser. Run a new audit from the homepage.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-shell space-y-6 py-8 md:py-10">
      {referralFromUrl ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          Referral detected: <span className="font-mono font-medium">{referralFromUrl}</span>
        </div>
      ) : null}

      <section className="card-ui p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Savings hero</p>
        <div className="mt-3 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-600">Current monthly spend</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
              ${result.currentSpend.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Annual savings potential</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-emerald-700 md:text-5xl">
              ${result.annualSavings.toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      <section className="card-ui p-6 md:p-8">
        <h2 className="text-lg font-bold">Industry benchmark</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Your estimated spend per developer:{" "}
          <span className="font-semibold">${spendPerDev.toFixed(2)}/dev/month</span>
        </p>
        <p className="mt-1 text-sm text-neutral-700">
          Industry average: <span className="font-semibold">${industryAvgPerDev}/dev/month</span>
        </p>
        <p className="mt-3 text-xs text-neutral-500">
          Benchmark is directional. Actual org spend varies by tooling mix, security requirements, and usage-based APIs.
        </p>
      </section>

      <section className="rounded-xl bg-black p-6 text-white md:p-8">
        <h2 className="text-lg font-bold">Referral rewards</h2>
        <p className="mt-2 text-sm text-neutral-200">
          Share BUDGETBHAI. Your referral code is the same as your results link slug.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="w-full truncate rounded-lg bg-neutral-900 px-3 py-2 text-sm sm:max-w-md">
            {referralCode}
          </code>
          <button type="button" className="btn-black-sm w-full sm:w-auto" onClick={() => void copyReferralCode()}>
            {copiedCode ? "Copied!" : "Copy code"}
          </button>
        </div>

        <p className="mt-3 text-xs text-neutral-300">
          Share link format: <span className="font-mono">{shareUrl || "…"}</span>
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-black w-full sm:w-auto" onClick={() => void shareToEarn()}>
          {shareState === "copied" ? "Copied!" : "Share to Earn Rewards"}
        </button>
      </div>

      <section className="card-ui p-6 md:p-8">
        <h2 className="text-lg font-bold">AI summary</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-700">{result.summary}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Per-tool recommendations</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {result.tools.map((t) => (
            <article key={`${t.tool}-${t.recommendation}`} className="card-ui p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">{t.tool}</h3>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClasses(t.recommendation)}`}>
                  {badgeLabel(t.recommendation)}
                </span>
              </div>

              <p className="mt-3 text-sm text-neutral-700">
                Current: <span className="font-semibold">${t.currentSpend.toFixed(2)}</span>
                <span className="mx-2 text-neutral-400">→</span>
                Projected: <span className="font-semibold">${t.projectedSpend.toFixed(2)}</span>
              </p>

              <p className="mt-2 text-sm font-semibold text-emerald-700">Savings: ${t.savings.toFixed(2)}/mo</p>
              <p className="mt-3 text-sm text-neutral-600">{t.reason}</p>
            </article>
          ))}
        </div>
      </section>

      {result.monthlySavings > 500 ? (
        <section className="card-ui p-6 md:p-8">
          <h2 className="text-lg font-bold">Implementation support</h2>
          <p className="mt-2 text-sm text-neutral-700">
            You are projected to save more than $500/month. If you want help executing vendor changes and renewals, talk
            to our team.
          </p>
          <button type="button" className="btn-black mt-4">
            Book implementation support
          </button>
        </section>
      ) : null}

      {result.monthlySavings < 100 ? (
        <section className="card-ui p-6 md:p-8">
          <h2 className="text-lg font-bold">You are spending well</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Savings potential is currently low. If you want, bookmark this report and re-run monthly as pricing changes.
          </p>
        </section>
      ) : null}
    </main>
  );
}