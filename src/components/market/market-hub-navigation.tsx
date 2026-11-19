"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListingType } from "@/types";
import {
  Search,
  SlidersHorizontal,
  Plus,
  RotateCcw,
  X,
  ChevronDown,
  Languages,
  Gauge,
  Layers,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MODE_THEME, type ModeKey } from "@/lib/design-system";
import { VerifiedSeal } from "@/components/ui/verified-seal";

interface MarketHubNavigationProps {
  activeMode: ListingType | "all" | "own_sell";
  counts: {
    sell: number;
    trade: number;
    looking_for: number;
    all: number;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectedCondition: string;
  onConditionChange: (cond: string) => void;
  onlyVerified: boolean;
  onVerifiedChange: (v: boolean) => void;
  onOpenCreate: () => void;
  viewMode?: "grid" | "deck";
  onViewModeChange?: (mode: "grid" | "deck") => void;
  onResetFilters: () => void;
}

const LANGUAGE_OPTIONS = [
  { value: "ALL", label: "Alle Sprachen" },
  { value: "DE", label: "Deutsch (DE)" },
  { value: "EN", label: "Englisch (EN)" },
  { value: "JP", label: "Japanisch (JP)" },
  { value: "CN", label: "Chinesisch (CN)" },
  { value: "KR", label: "Koreanisch (KR)" },
];

const CONDITION_OPTIONS = [
  { value: "ALL", label: "Alle Zustände" },
  { value: "Graded", label: "Graded" },
  { value: "NM", label: "Near Mint" },
  { value: "EX", label: "Excellent" },
  { value: "GD", label: "Good" },
  { value: "LP", label: "Light Played" },
  { value: "PL", label: "Played" },
  { value: "PO", label: "Poor" },
];

function modeKeyFor(activeMode: MarketHubNavigationProps["activeMode"]): ModeKey {
  if (activeMode === "own_sell") return "sell";
  if (activeMode === "trade") return "trade";
  if (activeMode === "looking_for") return "want";
  return "buy";
}

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: {
  icon: typeof Languages;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  className?: string;
}) {
  const isActive = value !== "ALL";
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Icon
        className={cn(
          "w-3.5 h-3.5 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
          isActive ? "text-ink" : "text-ink-subtle"
        )}
      />
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none pl-9 pr-8 py-2 rounded-xl text-xs font-semibold min-h-[44px] cursor-pointer transition-colors border outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          isActive
            ? "bg-white/[0.08] border-hairline-strong text-ink"
            : "bg-surface-2 border-hairline text-ink-muted hover:text-ink hover:border-hairline-strong"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface-2 text-ink">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-ink-subtle pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}

export function MarketHubNavigation({
  activeMode,
  counts,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedCondition,
  onConditionChange,
  onlyVerified,
  onVerifiedChange,
  onOpenCreate,
  viewMode = "grid",
  onViewModeChange,
  onResetFilters,
}: MarketHubNavigationProps) {
  const pathname = usePathname();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const activeTheme = MODE_THEME[modeKeyFor(activeMode)];

  const activeFilterCount =
    (searchQuery.trim() !== "" ? 1 : 0) +
    (selectedLanguage !== "ALL" ? 1 : 0) +
    (selectedCondition !== "ALL" ? 1 : 0) +
    (onlyVerified ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const modeConfigs: Array<{ id: string; href: string; theme: (typeof MODE_THEME)[ModeKey]; count?: number }> = [
    { id: "own_sell", href: "/sell", theme: MODE_THEME.sell },
    { id: "sell", href: "/buy", theme: MODE_THEME.buy, count: counts.sell },
    { id: "trade", href: "/trade", theme: MODE_THEME.trade, count: counts.trade },
    { id: "looking_for", href: "/looking-for", theme: MODE_THEME.want, count: counts.looking_for },
  ];

  const createLabel =
    activeMode === "trade" ? "Tausch anbieten" : activeMode === "looking_for" ? "Gesuch aufgeben" : "Karte anbieten";

  const verifiedToggle = (fullWidth = false) => (
    <button
      type="button"
      onClick={() => onVerifiedChange(!onlyVerified)}
      aria-pressed={onlyVerified}
      className={cn(
        "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer whitespace-nowrap",
        fullWidth && "w-full",
        onlyVerified
          ? "bg-white/[0.08] border-hairline-strong text-ink"
          : "bg-surface-2 border-hairline text-ink-muted hover:text-ink hover:border-hairline-strong"
      )}
    >
      <VerifiedSeal level={onlyVerified ? 1 : 0} size={16} />
      <span>{fullWidth ? "Nur verifizierte Sammler (ab 3 Deals)" : "Verifizierte Sammler"}</span>
    </button>
  );

  return (
    <div className="space-y-3 mb-8">
      {/* ==================================================================== */}
      {/* 1. MODE HUB (Verkaufen · Kaufen · Tauschen · Gesucht)                 */}
      {/* ==================================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-1.5 rounded-2xl bg-surface-1/95 backdrop-blur-md border border-hairline">
        <nav aria-label="Marktplatz-Bereiche" className="grid grid-cols-4 lg:flex lg:items-center gap-1">
          {modeConfigs.map((m) => {
            const isActive = pathname === m.href || activeMode === m.id;
            const Icon = m.theme.icon;
            return (
              <Link
                key={m.id}
                href={m.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-colors min-h-[48px] sm:min-h-[44px] whitespace-nowrap",
                  isActive ? m.theme.solid : "text-ink-subtle hover:text-ink hover:bg-white/[0.04]"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{m.theme.label}</span>
                {m.count !== undefined && (
                  <span
                    className={cn(
                      "hidden sm:inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums",
                      isActive ? "bg-black/20" : "bg-white/[0.06] text-ink-muted"
                    )}
                  >
                    {m.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 justify-end">
          {onViewModeChange && (
            <div className="flex md:hidden items-center bg-surface-2 border border-hairline p-1 rounded-xl" role="group" aria-label="Ansicht">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "px-3 rounded-lg text-xs font-semibold transition-colors min-h-[40px] flex items-center gap-1.5",
                  viewMode === "grid" ? "bg-white/[0.1] text-ink" : "text-ink-subtle"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Liste
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("deck")}
                aria-pressed={viewMode === "deck"}
                className={cn(
                  "px-3 rounded-lg text-xs font-semibold transition-colors min-h-[40px] flex items-center gap-1.5",
                  viewMode === "deck" ? "bg-white/[0.1] text-ink" : "text-ink-subtle"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                Stapel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenCreate}
            className={cn(
              "flex-1 md:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-colors active:scale-[0.98] flex items-center justify-center gap-2 min-h-[44px] cursor-pointer whitespace-nowrap",
              activeTheme.solid,
              activeTheme.shadow
            )}
          >
            <Plus className="w-4 h-4" />
            <span>{createLabel}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. SUCHE & FILTER                                                    */}
      {/* ==================================================================== */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-surface-1/95 backdrop-blur-md border border-hairline space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Karte, Set, Nummer oder Sammler suchen …"
              className="w-full bg-surface-2 border border-hairline focus:border-hairline-strong rounded-xl pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none min-h-[44px] transition-colors [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Suche leeren"
                onClick={() => onSearchChange("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-ink-subtle hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Filter */}
          <div className="hidden md:flex items-center gap-2">
            <FilterSelect
              icon={Languages}
              ariaLabel="Sprache filtern"
              value={selectedLanguage}
              onChange={onLanguageChange}
              options={LANGUAGE_OPTIONS}
            />
            <FilterSelect
              icon={Gauge}
              ariaLabel="Zustand filtern"
              value={selectedCondition}
              onChange={onConditionChange}
              options={CONDITION_OPTIONS}
            />
            {verifiedToggle()}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="min-w-[44px] min-h-[44px] rounded-xl text-ink-subtle hover:text-ink bg-surface-2 border border-hairline hover:border-hairline-strong flex items-center justify-center cursor-pointer transition-colors"
                title="Filter zurücksetzen"
                aria-label="Filter zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              aria-expanded={mobileFilterOpen}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold min-h-[44px] transition-colors",
                hasActiveFilters || mobileFilterOpen
                  ? "bg-white/[0.08] border-hairline-strong text-ink"
                  : "bg-surface-2 border-hairline text-ink-muted"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center tabular-nums">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", mobileFilterOpen && "rotate-180")} />
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3.5 py-2.5 rounded-xl bg-surface-2 border border-hairline text-ink-muted text-xs font-semibold min-h-[44px]"
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden pt-2.5 border-t border-hairline space-y-2 panel-rise">
            <div className="grid grid-cols-2 gap-2">
              <FilterSelect
                icon={Languages}
                ariaLabel="Sprache filtern"
                value={selectedLanguage}
                onChange={onLanguageChange}
                options={LANGUAGE_OPTIONS}
                className="w-full"
              />
              <FilterSelect
                icon={Gauge}
                ariaLabel="Zustand filtern"
                value={selectedCondition}
                onChange={onConditionChange}
                options={CONDITION_OPTIONS}
                className="w-full"
              />
            </div>
            {verifiedToggle(true)}
          </div>
        )}
      </div>
    </div>
  );
}
