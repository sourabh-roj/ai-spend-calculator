"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ApiModel, PlanName, SpendFormData, ToolInput, ToolName } from "@/types/spend-form";

const FORM_STORAGE_KEY = "budgetbhai-form-v2";
const RESULTS_STORAGE_KEY = "budgetbhai-results-v1";

const TOOLS: ToolName[] = [
  "cursor",
  "copilot",
  "claude",
  "chatgpt",
  "gemini",
  "github_copilot",
  "v0_dev",
  "anthropic_api",
  "openai_api",
  "gemini_api",
  "v0_api",
];

const PLAN_OPTIONS: PlanName[] = [
  "free",
  "hobby",
  "starter",
  "pro",
  "team",
  "enterprise",
  "plus",
  "standard",
  "premium",
];

const API_TOOLS: ToolName[] = ["anthropic_api", "openai_api", "gemini_api", "v0_api"];

const API_MODELS_BY_TOOL: Record<
  "anthropic_api" | "openai_api" | "gemini_api" | "v0_api",
  ApiModel[]
> = {
  anthropic_api: ["claude_opus_4_7"],
  openai_api: ["gpt_5_5", "gpt_5_4", "gpt_5_4_mini"],
  gemini_api: ["gemini_3_1_pro_preview", "gemini_3_1_flash_lite"],
  v0_api: ["v0_mini", "v0_pro", "v0_max", "v0_max_fast"],
};

function createToolRow(): ToolInput {
  return {
    id: crypto.randomUUID(),
    tool: "cursor",
    plan: "pro",
    seats: 1,
    monthlySpend: 20,
    apiModel: undefined,
  };
}

function isApiTool(tool: ToolName): tool is "anthropic_api" | "openai_api" | "gemini_api" | "v0_api" {
  return API_TOOLS.includes(tool);
}

export function SpendForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SpendFormData>({
    teamSize: 5,
    useCase: "coding",
    tools: [createToolRow()],
    website: "",
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FORM_STORAGE_KEY);
      if (!raw) return;
      setForm(JSON.parse(raw) as SpendFormData);
    } catch {
      // ignore corrupt drafts
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const progress = step === 1 ? 50 : 100;

  const totalMonthly = useMemo(
    () => form.tools.reduce((sum, row) => sum + (Number(row.monthlySpend) || 0), 0),
    [form.tools]
  );

  function updateTool(id: string, patch: Partial<ToolInput>) {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }

  function onToolChange(id: string, nextTool: ToolName) {
    if (isApiTool(nextTool)) {
      const firstModel = API_MODELS_BY_TOOL[nextTool][0];
      updateTool(id, { tool: nextTool, apiModel: firstModel, plan: "pro" });
    } else {
      updateTool(id, { tool: nextTool, apiModel: undefined });
    }
  }

  async function getResults() {
    if (form.website && form.website.trim().length > 0) {
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        slug?: string;
        result?: unknown;
      };

      if (!data.ok || !data.slug || data.slug === "blocked" || !data.result) {
        console.error("Audit response invalid:", data);
        return;
      }

      const raw = window.localStorage.getItem(RESULTS_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      map[data.slug] = data.result;
      window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(map));

      window.localStorage.removeItem(FORM_STORAGE_KEY);

      const ref = searchParams.get("ref");
      const suffix = ref ? `?ref=${encodeURIComponent(ref)}` : "";
      router.push(`/results/${data.slug}${suffix}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-ui p-4 md:p-6 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Step {step} of 2</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded bg-neutral-100">
          <div className="h-2 rounded bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Team size</label>
            <input
              className="input-ui"
              type="number"
              min={1}
              value={form.teamSize}
              onChange={(e) => setForm((p) => ({ ...p, teamSize: Number(e.target.value) || 1 }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Use case</label>
            <select
              className="input-ui"
              value={form.useCase}
              onChange={(e) => setForm((p) => ({ ...p, useCase: e.target.value as SpendFormData["useCase"] }))}
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="data">Data</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <input
            type="text"
            name="bb_hp"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={form.website ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
          />

          <div className="md:col-span-2">
            <button type="button" className="btn-black h-11 px-5" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {form.tools.length === 0 && (
            <p className="rounded-md border border-dashed p-4 text-sm text-neutral-500">
              No tools added yet. Click “Add Tool” to begin.
            </p>
          )}

          {form.tools.map((tool) => (
            <div key={tool.id} className="grid gap-2 rounded-lg border border-neutral-200 p-3 md:grid-cols-12">
              <select
                className="input-ui md:col-span-3"
                value={tool.tool}
                onChange={(e) => onToolChange(tool.id, e.target.value as ToolName)}
              >
                {TOOLS.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              {isApiTool(tool.tool) ? (
                <select
                  className="input-ui md:col-span-3"
                  value={tool.apiModel ?? API_MODELS_BY_TOOL[tool.tool][0]}
                  onChange={(e) => updateTool(tool.id, { apiModel: e.target.value as ApiModel })}
                >
                  {API_MODELS_BY_TOOL[tool.tool].map((model) => (
                    <option key={model} value={model}>
                      {model.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="input-ui md:col-span-3"
                  value={tool.plan}
                  onChange={(e) =>
                    updateTool(tool.id, { plan: e.target.value as PlanName, apiModel: undefined })
                  }
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}

              <input
                className="input-ui md:col-span-2"
                type="number"
                min={0}
                value={tool.seats}
                onChange={(e) => updateTool(tool.id, { seats: Number(e.target.value) || 0 })}
              />

              <input
                className="input-ui md:col-span-3"
                type="number"
                min={0}
                step="0.01"
                value={tool.monthlySpend}
                onChange={(e) => updateTool(tool.id, { monthlySpend: Number(e.target.value) || 0 })}
              />

              <button
                type="button"
                className="h-11 rounded-md border border-neutral-300 px-3 text-sm hover:bg-neutral-50 md:col-span-1"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    tools: prev.tools.filter((x) => x.id !== tool.id),
                  }))
                }
              >
                Delete
              </button>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="h-11 rounded-md border border-neutral-300 px-4 text-sm hover:bg-neutral-50"
              onClick={() => setForm((p) => ({ ...p, tools: [...p.tools, createToolRow()] }))}
            >
              + Add Tool
            </button>

            <button
              type="button"
              className="h-11 rounded-md border border-neutral-300 px-4 text-sm hover:bg-neutral-50"
              onClick={() => setStep(1)}
            >
              Back
            </button>

            <button type="button" className="btn-black h-11 px-5" disabled={loading} onClick={() => void getResults()}>
              {loading ? "Processing..." : "Get Results"}
            </button>
          </div>

          <p className="text-xs text-neutral-500">Current entered monthly spend: ${totalMonthly.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}