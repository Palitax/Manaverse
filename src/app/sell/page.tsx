"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/store";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import { Plus, Crown, ArrowRight } from "lucide-react";
import { MODE_THEME } from "@/lib/design-system";
import { MarketPageHeader, MarketEmptyState } from "@/components/market/page-shell";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { CardLanguage } from "@/types";

export default function SellPage() {
  const { currentUser, listings, openAuthModal } = useStore();
  const [studioOpen, setStudioOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "sold">("all");
  const [prefilledCard, setPrefilledCard] = useState<{
    name?: string;
    set?: string;
    number?: string;
    lang?: CardLanguage;
    photo?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("name");
      if (name) {
        setPrefilledCard({
          name: name || undefined,
          set: params.get("set") || undefined,
          number: params.get("number") || undefined,
          lang: (params.get("lang")?.toUpperCase() || undefined) as CardLanguage | undefined,
          photo: params.get("photo") || undefined,
        });
        setStudioOpen(true);
      }
    }
  }, []);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("ALL");
    setSelectedCondition("ALL");
    setOnlyVerified(false);
  };

  // User's own sell listings
  const allMySellListings = useMemo(() => {
    return currentUser
      ? listings.filter(
          (l) =>
            (l.userId === currentUser.id ||
              l.user?.id === currentUser.id ||
              (currentUser.username && l.user?.username?.toLowerCase() === currentUser.username.toLowerCase())) &&
            l.type === "sell"
        )
      : [];
  }, [currentUser, listings]);

  const filteredMySellListings = useMemo(() => {
    return allMySellListings.filter((card) => {
      if (statusFilter !== "all" && card.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set?.toLowerCase().includes(q);
        const matchesNumber = card.cardNumber?.toLowerCase().includes(q);
        if (!matchesName && !matchesSet && !matchesNumber) return false;
      }
      if (selectedLanguage !== "ALL" && card.language !== selectedLanguage) {
        return false;
      }
      if (selectedCondition !== "ALL" && card.condition !== selectedCondition) {
        return false;
      }
      return true;
    });
  }, [allMySellListings, statusFilter, searchQuery, selectedLanguage, selectedCondition]);

  const activeMySellListings = useMemo(() => {
    return allMySellListings.filter((l) => l.status === "active");
  }, [allMySellListings]);

  // Total value of user's active listings
  const totalValue = useMemo(() => {
    return activeMySellListings.reduce((acc, curr) => acc + (curr.price || 0), 0);
  }, [activeMySellListings]);

  // Overall counts for navigation hub
  const counts = useMemo(() => {
    const sellCount = listings.filter((l) => l.type === "sell" && l.status === "active").length;
    const tradeCount = listings.filter((l) => l.type === "trade" && l.status === "active").length;
    const wantCount = listings.filter((l) => l.type === "looking_for" && l.status === "active").length;
    return {
      sell: sellCount,
      trade: tradeCount,
      looking_for: wantCount,
      all: sellCount + tradeCount + wantCount,
    };
  }, [listings]);

  const handleOpenCreate = () => {
    if (!currentUser) {
      openAuthModal("register");
      return;
    }
    setStudioOpen((prev) => !prev);
    if (!studioOpen) {
      setTimeout(() => {
        document.getElementById("sell-create-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const emerald = MODE_THEME.sell;
  const statusTabs: Array<{ id: "all" | "active" | "draft" | "sold"; label: string; count: number }> = [
    { id: "all", label: "Alle", count: allMySellListings.length },
    { id: "active", label: "Aktiv", count: allMySellListings.filter((l) => l.status === "active").length },
    { id: "draft", label: "Entwürfe", count: allMySellListings.filter((l) => l.status === "draft").length },
    { id: "sold", label: "Verkauft", count: allMySellListings.filter((l) => l.status === "sold").length },
  ];

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      <MarketPageHeader
        theme={emerald}
        title="Deine Vitrine"
        description="Verwalte deine Verkaufs-Inserate oder biete Manacards direkt eine ganze Sammlung an."
        aside={
          currentUser && activeMySellListings.length > 0 ? (
            <div className="flex items-stretch rounded-2xl bg-surface-1/95 backdrop-blur-md border border-hairline overflow-hidden self-start md:self-auto">
              <div className="px-4 py-3">
                <span className="text-[10px] text-ink-subtle uppercase tracking-[0.14em] block font-bold">
                  Vitrinenwert
                </span>
                <span className={cn("text-lg font-black tabular-nums", emerald.text)}>
                  {totalValue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="w-px bg-hairline" />
              <div className="px-4 py-3">
                <span className="text-[10px] text-ink-subtle uppercase tracking-[0.14em] block font-bold">
                  Online
                </span>
                <span className="text-lg font-black text-ink tabular-nums">
                  {activeMySellListings.length} {activeMySellListings.length === 1 ? "Karte" : "Karten"}
                </span>
              </div>
            </div>
          ) : undefined
        }
      />

      <MarketHubNavigation
        activeMode="own_sell"
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        selectedCondition={selectedCondition}
        onConditionChange={setSelectedCondition}
        onlyVerified={onlyVerified}
        onVerifiedChange={setOnlyVerified}
        onOpenCreate={handleOpenCreate}
        onResetFilters={resetFilters}
      />

      {/* Sammlungs-Ankauf (Bulk) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-1/95 backdrop-blur-md border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-hairline-strong flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-ink" />
          </div>
          <div>
            <h3 className="font-black text-ink text-sm sm:text-base tracking-tight">
              Ganze Sammlung verkaufen?
            </h3>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Reiche Holos, Binder oder Sets gesammelt ein – Manacards prüft dein Konvolut und macht dir ein faires Angebot.
            </p>
          </div>
        </div>

        <Link
          href="/sell/bulk"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-black text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          <span>Sammlung einreichen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* In-Page Inserat-Erstellung */}
      {studioOpen && (
        <div id="sell-create-section" className="mb-10 panel-rise">
          <CardForgeStudio
            initialType="sell"
            initialName={prefilledCard?.name}
            initialSet={prefilledCard?.set}
            initialNumber={prefilledCard?.number}
            initialLanguage={prefilledCard?.lang}
            initialPhoto={prefilledCard?.photo}
            mode="inline"
            onSuccess={() => {
              setStudioOpen(false);
              setPrefilledCard(null);
            }}
            onCancel={() => {
              setStudioOpen(false);
              setPrefilledCard(null);
            }}
          />
        </div>
      )}

      {/* Content */}
      {!currentUser ? (
        <MarketEmptyState
          theme={emerald}
          title="Melde dich an für deine Vitrine"
          description="Nach der Anmeldung siehst du hier deine Verkaufskarten, Entwürfe und verkauften Inserate."
          primaryLabel="Jetzt anmelden"
          onPrimary={() => openAuthModal("login")}
          secondaryLabel="Zum Marktplatz"
          secondaryHref="/buy"
        />
      ) : allMySellListings.length === 0 ? (
        <MarketEmptyState
          theme={emerald}
          title="Noch keine Karten in deiner Vitrine"
          description="Stelle deine erste Karte im Graded-Slab-Design ein, um Anfragen und Preisvorschläge von Sammlern zu erhalten."
          primaryLabel="Erste Karte einstellen"
          onPrimary={handleOpenCreate}
          secondaryLabel={counts.sell > 0 ? `Marktplatz ansehen (${counts.sell})` : "Zum Marktplatz"}
          secondaryHref="/buy"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div role="tablist" className="inline-flex items-center gap-1 bg-surface-1/95 backdrop-blur-md p-1 rounded-xl border border-hairline overflow-x-auto no-scrollbar self-start">
              {statusTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === t.id}
                  onClick={() => setStatusFilter(t.id)}
                  className={cn(
                    "px-3.5 rounded-lg font-semibold text-xs transition-colors min-h-[40px] flex items-center gap-1.5 whitespace-nowrap",
                    statusFilter === t.id ? "bg-white/[0.08] text-ink" : "text-ink-subtle hover:text-ink"
                  )}
                >
                  {t.label}
                  <span className="text-[10px] text-ink-subtle tabular-nums">{t.count}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenCreate}
              className={cn("font-bold text-xs flex items-center gap-1.5 min-h-[44px] self-start sm:self-auto cursor-pointer", emerald.text)}
            >
              <Plus className="w-4 h-4" /> Weitere Karte hinzufügen
            </button>
          </div>

          {filteredMySellListings.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-subtle bg-surface-1/95 rounded-2xl border border-hairline p-6">
              Keine Karten für diesen Filter gefunden.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredMySellListings.map((card) => (
                <CollectorSlabCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
