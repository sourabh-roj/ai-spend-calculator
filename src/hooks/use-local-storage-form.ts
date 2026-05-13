"use client";

import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { SpendFormData } from "@/types/spend-form";

const STORAGE_KEY = "budgetbhai-form-v1";

export function useLocalStorageForm(form: UseFormReturn<SpendFormData>) {
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SpendFormData;
        form.reset(parsed);
      }
    } finally {
      hydrated.current = true;
    }
  }, [form]);

  useEffect(() => {
    const sub = form.watch((value) => {
      if (!hydrated.current) return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [form]);

  return {
    clearPersisted: () => window.localStorage.removeItem(STORAGE_KEY),
  };
}