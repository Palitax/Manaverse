"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListingType, CardLanguage, CardCondition } from "@/types";
import {
  Tag,
  ArrowLeftRight,
  Target,
  Search,
  SlidersHorizontal,
  Plus,
  ShieldCheck,
  RotateCcw,
  Layers,
  X,
  ChevronDown,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedLanguage !== "ALL" ||
    selectedCondition !== "ALL" ||
    onlyVerified;

  const modeConfigs = [
    {
      id: "own_sell",
      href: "/sell",
      label: "Verkaufen",
      sublabel: "Deine Vitrine",
      icon: PlusCircle,
      color: "text-emerald-400",
      activeBg: "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25",
      count: undefined,
    },
    {
      id: "sell",
      href: "/buy",
      label: "Kaufen",
      sublabel: "Sofortkauf Vault",
      icon: ShoppingBag,
      color: "text-amber-400",
      activeBg: "bg-amber-400 text-black shadow-lg shadow-amber-400/30",
      count: counts.sell,
    },
    {
      id: "trade",
      href: "/trade",
      label: "Tauschen",
      sublabel: "1:1 Arena",
      icon: ArrowLeftRight,
      color: "text-purple-400",
      activeBg: "bg-purple-600 text-white shadow-lg shadow-purple-600/30",
      count: counts.trade,
    },
    {
      id: "looking_for",
      href: "/looking-for",
      label: "Gesucht",
      sublabel: "Bounty Radar",
      icon: Target,
      color: "text-orange-400",
      activeBg: "bg-orange-500 text-white shadow-lg shadow-orange-500/30",
      count: counts.looking_for,
    },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* ==================================================================== */}
      {/* 1. TOP SEGMENTED MODE HUB (Kaufen, Verkaufen, Tauschen, Gesucht)      */}
      {/* ==================================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 rounded-3xl glass-panel border border-white/10 backdrop-blur-2xl">
        {/* Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/5 overflow-x-auto no-scrollbar">
          {modeConfigs.map((m) => {
            const isActive = pathname === m.href || activeMode === m.id;
            return (
              <Link
                key={m.id}
                href={m.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px]",
                  isActive
                    ? m.activeBg
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                <m.icon className="w-4 h-4 flex-shrink-0" />
                <span>{m.label}</span>
                {m.count !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                      isActive ? "bg-black/25 text-inherit" : "bg-white/10 text-neutral-300"
                    )}
                  >
                    {m.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side controls: Mobile View Mode (Deck vs Grid) + Create Button */}
        <div className="flex items-center gap-2 justify-end">
          {/* Mobile Deck vs Grid Switcher */}
          {onViewModeChange && (
            <div className="flex md:hidden items-center bg-black/40 border border-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onViewModeChange("deck")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px]",
                  viewMode === "deck"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-neutral-400"
                )}
                title="Kartenstapel (Swipe Deck)"
              >
                🎴 Stapel
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px]",
                  viewMode === "grid"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-neutral-400"
                )}
                title="Listenansicht"
              >
                📱 Liste
              </button>
            </div>
          )}

          {/* Primary Create Button */}
          <button
            type="button"
            onClick={onOpenCreate}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 flex items-center gap-2 shadow-lg min-h-[44px] cursor-pointer whitespace-nowrap",
              activeMode === "sell"
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25"
                : activeMode === "trade"
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25"
            )}
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeMode === "sell"
                ? "Karte anbieten"
                : activeMode === "trade"
                ? "Tausch anbieten"
                : "Gesuch aufgeben"}
            </span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. SEARCH & QUICK-FILTER DOCK                                        */}
      {/* ==================================================================== */}
      <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Karte, Pokémon, Set, Nummer oder Sammler suchen..."
              className="w-full bg-[#0d121f] border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Filter Pills */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-[#0d121f] text-neutral-200 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 min-h-[44px] cursor-pointer transition-colors"
              >
                <option value="ALL" className="bg-[#0d121f] text-white">🌍 Alle Sprachen</option>
                <option value="DE" className="bg-[#0d121f] text-white">🇩🇪 Deutsch (DE)</option>
                <option value="EN" className="bg-[#0d121f] text-white">🇬🇧 Englisch (EN)</option>
                <option value="JP" className="bg-[#0d121f] text-white">🇯🇵 Japanisch (JP)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Condition */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedCondition}
                onChange={(e) => onConditionChange(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 bg-[#0d121f] text-neutral-200 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 min-h-[44px] cursor-pointer transition-colors"
              >
                <option value="ALL" className="bg-[#0d121f] text-white">Alle Zustände</option>
                <option value="NM" className="bg-[#0d121f] text-white">Near Mint (Makellos)</option>
                <option value="EX" className="bg-[#0d121f] text-white">Excellent</option>
                <option value="GD" className="bg-[#0d121f] text-white">Good</option>
                <option value="LP" className="bg-[#0d121f] text-white">Light Played</option>
                <option value="PL" className="bg-[#0d121f] text-white">Played</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Verified Seller Switch */}
            <button
              type="button"
              onClick={() => onVerifiedChange(!onlyVerified)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer",
                onlyVerified
                  ? "bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/20"
                  : "bg-[#0d121f] border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
              )}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Verifizierte Sammler</span>
            </button>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-2.5 py-2 rounded-xl text-xs text-neutral-400 hover:text-white bg-white/5 border border-white/10 flex items-center gap-1 min-h-[44px] cursor-pointer"
                title="Filter zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold min-h-[44px]",
                hasActiveFilters
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                  : "bg-[#0d121f] border-white/10 text-neutral-300"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter anpassen {hasActiveFilters && "• Aktiv"}</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-xs font-bold min-h-[44px]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer (Expandable on Mobile) */}
        {mobileFilterOpen && (
          <div className="md:hidden pt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold mb-1">
                  Sprache
                </label>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="w-full appearance-none bg-[#0d121f] text-neutral-200 border border-white/10 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold focus:outline-none min-h-[44px] cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#0d121f] text-white">🌍 Alle Sprachen</option>
                    <option value="DE" className="bg-[#0d121f] text-white">🇩🇪 Deutsch</option>
                    <option value="EN" className="bg-[#0d121f] text-white">🇬🇧 Englisch</option>
                    <option value="JP" className="bg-[#0d121f] text-white">🇯🇵 Japanisch</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold mb-1">
                  Zustand
                </label>
                <div className="relative">
                  <select
                    value={selectedCondition}
                    onChange={(e) => onConditionChange(e.target.value)}
                    className="w-full appearance-none bg-[#0d121f] text-neutral-200 border border-white/10 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold focus:outline-none min-h-[44px] cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#0d121f] text-white">Alle Zustände</option>
                    <option value="NM" className="bg-[#0d121f] text-white">Near Mint</option>
                    <option value="EX" className="bg-[#0d121f] text-white">Excellent</option>
                    <option value="GD" className="bg-[#0d121f] text-white">Good</option>
                    <option value="LP" className="bg-[#0d121f] text-white">Light Played</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onVerifiedChange(!onlyVerified)}
              className={cn(
                "w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]",
                onlyVerified
                  ? "bg-blue-600/30 border-blue-500 text-blue-300"
                  : "bg-[#0d121f] border-white/10 text-neutral-400"
              )}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Nur verifizierte Verkäufer (ab 3 Deals)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
