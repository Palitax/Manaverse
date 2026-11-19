"use client";

import React, { useSyncExternalStore } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Leichtgewichtiges Toast-System (ersetzt Browser-alert()).
 * Aufruf überall möglich: toast.success("Gespeichert"), toast.error("…"), toast.info("…")
 */

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

let items: ToastItem[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const EMPTY: ToastItem[] = [];

function emit() {
  listeners.forEach((l) => l());
}

function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

function push(variant: ToastVariant, title: string, description?: string) {
  const id = ++counter;
  items = [...items.slice(-2), { id, title, description, variant }];
  emit();
  setTimeout(() => dismiss(id), variant === "error" ? 6000 : 4200);
  return id;
}

export const toast = {
  success: (title: string, description?: string) => push("success", title, description),
  error: (title: string, description?: string) => push("error", title, description),
  info: (title: string, description?: string) => push("info", title, description),
  dismiss,
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof Info; iconClass: string; bar: string }> = {
  success: { icon: CheckCircle2, iconClass: "text-emerald-400", bar: "bg-emerald-400" },
  error: { icon: AlertCircle, iconClass: "text-rose-400", bar: "bg-rose-400" },
  info: { icon: Info, iconClass: "text-ink-muted", bar: "bg-white/40" },
};

export function Toaster() {
  const list = useSyncExternalStore(subscribe, () => items, () => EMPTY);

  return (
    <div
      aria-live="polite"
      className="fixed z-[120] inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+88px)] md:inset-x-auto md:right-6 md:bottom-6 flex flex-col items-stretch md:items-end gap-2 pointer-events-none"
    >
      {list.map((t) => {
        const style = VARIANT_STYLES[t.variant];
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            role="status"
            className="toast-enter pointer-events-auto relative w-full md:w-[360px] overflow-hidden rounded-2xl bg-surface-2/95 backdrop-blur-xl border border-hairline-strong shadow-[0_18px_50px_rgba(0,0,0,0.7)] pl-4 pr-2 py-3 flex items-start gap-3"
          >
            <span className={cn("absolute left-0 top-0 bottom-0 w-[3px]", style.bar)} />
            <Icon className={cn("w-4.5 h-4.5 mt-0.5 flex-shrink-0", style.iconClass)} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink leading-snug">{t.title}</p>
              {t.description && (
                <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Hinweis schließen"
              className="min-h-[32px] min-w-[32px] rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
