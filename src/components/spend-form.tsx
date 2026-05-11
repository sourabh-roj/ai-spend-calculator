"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SpendFormData } from "@/types/spend-form";
import { PLAN_OPTIONS, TOOL_LABELS } from "@/types/spend-form";
import { spendFormSchema } from "@/lib/spend-schema";
import { defaultSpendFormValues } from "@/lib/defaults";
import { useLocalStorageForm } from "@/hooks/use-local-storage-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Step = 1 | 2 | 3;

export function SpendForm() {
  const [step, setStep] = useState<Step>(1);

  const form = useForm<SpendFormData>({
    resolver: zodResolver(spendFormSchema),
    mode: "onBlur",
    defaultValues: defaultSpendFormValues,
  });

  const { clearPersisted } = useLocalStorageForm(form);

  const { fields } = useFieldArray({
    control: form.control,
    name: "step2.tools",
  });

  const totalMonthly = useMemo(() => {
    const values = form.getValues("step2.tools");
    return values.reduce((sum, row) => sum + row.monthlySpend, 0);
  }, [form.watch("step2.tools")]);

  const next = async () => {
    if (step === 1) {
      const ok = await form.trigger(["step1.teamSize", "step1.primaryUseCase"]);
      if (!ok) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      const ok = await form.trigger("step2.tools");
      if (!ok) return;
      setStep(3);
    }
  };

  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const onSubmit = (data: SpendFormData) => {
    console.log("submitted", data);
    // Replace with API call
    clearPersisted();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Spend Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamSize">Team size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    {...form.register("step1.teamSize", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Primary use case</Label>
                  <Select
                    value={form.watch("step1.primaryUseCase")}
                    onValueChange={(v) =>
                      form.setValue("step1.primaryUseCase", v as SpendFormData["step1"]["primaryUseCase"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 text-sm font-medium">
                  <div className="col-span-4">Tool</div>
                  <div className="col-span-3">Plan</div>
                  <div className="col-span-2">Seats</div>
                  <div className="col-span-3">Monthly spend ($)</div>
                </div>
                <Separator />
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">{TOOL_LABELS[field.tool]}</div>
                    <div className="col-span-3">
                      <Select
                        value={form.watch(`step2.tools.${index}.plan`)}
                        onValueChange={(v) =>
                          form.setValue(`step2.tools.${index}.plan`, v as any, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_OPTIONS.map((plan) => (
                            <SelectItem key={plan} value={plan}>
                              {plan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={0}
                        {...form.register(`step2.tools.${index}.seats`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...form.register(`step2.tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Team size: {form.getValues("step1.teamSize")}</p>
                  <p className="text-sm text-muted-foreground">
                    Use case: {form.getValues("step1.primaryUseCase")}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  {form.getValues("step2.tools").map((row) => (
                    <div key={row.id} className="flex justify-between text-sm">
                      <span>
                        {TOOL_LABELS[row.tool]} ({row.plan}) - {row.seats} seats
                      </span>
                      <span>${row.monthlySpend.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="font-semibold">Total monthly: ${totalMonthly.toFixed(2)}</div>
              </div>
            )}

            <div className="flex gap-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prev}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={next}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}