import React from "react";
import { cn } from "@/lib/utils";
import type { ModeTheme } from "@/lib/design-system";

/**
 * Einheitliche Seiten-Bausteine für alle Marktplatz-Bereiche
 * (Kaufen, Verkaufen, Tauschen, Gesucht, Profil).
 */

export function MarketPageHeader({
  theme,
  title,
  description,
  aside,
}: {
  theme: ModeTheme;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  const Icon = theme.icon;
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div className="space-y-2 max-w-2xl">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]",
            theme.textSoft
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", theme.dot)} />
          <Icon className="w-3.5 h-3.5" />
          {theme.label}
        </span>
        <h1 className="text-[28px] leading-[1.1] sm:text-4xl font-black text-ink tracking-[-0.02em]">
          {title}
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      {aside}
    </header>
  );
}

export function MarketEmptyState({
  theme,
  icon: Icon,
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  secondaryHref,
}: {
  theme: ModeTheme;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryHref?: string;
}) {
  const ResolvedIcon = Icon || theme.icon;
  return (
    <div className="my-12 max-w-md mx-auto p-8 rounded-3xl bg-surface-1/95 backdrop-blur-md border border-hairline text-center space-y-4">
      <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto", theme.soft)}>
        <ResolvedIcon className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-black text-ink tracking-tight">{title}</h3>
        <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
      </div>
      {(primaryLabel || secondaryLabel) && (
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
          {primaryLabel && onPrimary && (
            <button
              type="button"
              onClick={onPrimary}
              className={cn(
                "px-5 py-2.5 rounded-xl font-black text-xs transition-colors min-h-[44px] cursor-pointer",
                theme.solid
              )}
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-hairline text-ink-muted hover:text-ink text-xs font-semibold transition-colors min-h-[44px] inline-flex items-center justify-center"
            >
              {secondaryLabel}
            </a>
          )}
          {secondaryLabel && onSecondary && !secondaryHref && (
            <button
              type="button"
              onClick={onSecondary}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-hairline text-ink-muted hover:text-ink text-xs font-semibold transition-colors min-h-[44px] cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
