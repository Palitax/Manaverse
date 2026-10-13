"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/store";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import {
  Tag,
  Plus,
  Crown,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Coins,
  X,
  Flame,
} from "lucide-react";
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

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Deine Karten
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Verwalte deine aktiven Einzelkarten-Inserate oder biete ganze Sammlungen an Manacards an.
          </p>
        </div>

        {/* Portfolio Stats Card */}
        {currentUser && activeMySellListings.length > 0 && (
          <div className="flex items-center gap-4 p-3.5 rounded-2xl glass-panel border border-emerald-500/30">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                Aktiver Vitrinenwert
              </span>
              <span className="text-lg font-black text-emerald-400">
                {totalValue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                Online
              </span>
              <span className="text-lg font-black text-white">
                {activeMySellListings.length} {activeMySellListings.length === 1 ? "Karte" : "Karten"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Hub & Navigation Quick Switch */}
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

      {/* Bulk Appraisal Gold Banner (90% Solid, Premium High-Contrast) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0c101c]/95 bg-gradient-to-r from-[#1c1204]/95 via-[#181106]/90 to-[#0c101c]/95 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/25 text-amber-300 border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-1.5">
              Ganze Pokémon-Sammlung verkaufen? (Bulk Ankauf)
            </h3>
            <p className="text-xs text-neutral-300 mt-0.5">
              Lade mehrere Holos, Binder oder Sets hoch – wir prüfen dein Konvolut und machen dir ein faires Vorverkaufsangebot.
            </p>
          </div>
        </div>

        <Link
          href="/sell/bulk"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer"
        >
          <span>Sammlung einreichen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* In-Page Inserat-Erstellung (Sofortkauf & Einzelkarten) */}
      {studioOpen && (
        <div id="sell-create-section" className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
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
        <div className="my-12 max-w-lg mx-auto p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div
            onClick={() => openAuthModal("login")}
            className="w-18 h-18 rounded-3xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto cursor-pointer transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 group min-h-[64px] min-w-[64px]"
          >
            <Tag className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Melde dich an für deine Vitrine
            </h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Melde dich an, um deine Verkaufskarten zu sehen, deine Inserate zu verwalten und neue Pokémon-Karten einzustellen.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal("login")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/25 min-h-[44px] cursor-pointer"
            >
              Jetzt anmelden
            </button>
            <Link
              href="/buy"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all min-h-[44px] flex items-center justify-center"
            >
              Karten kaufen
            </Link>
          </div>
        </div>
      ) : allMySellListings.length === 0 ? (
        <div className="my-12 max-w-lg mx-auto p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div
            onClick={handleOpenCreate}
            className="w-18 h-18 rounded-3xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto cursor-pointer transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 group min-h-[64px] min-w-[64px]"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Noch keine Karten in deiner Vitrine
            </h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Stelle deine erste Pokémon-Karte im edlen Graded-Slab-Design ein, um Anfragen und Gebote von Sammlern zu erhalten.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/25 min-h-[44px] cursor-pointer"
            >
              + Erste Karte einstellen
            </button>
            <Link
              href="/buy"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all min-h-[44px] flex items-center justify-center"
            >
              Karten kaufen
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold text-xs transition-all min-h-[36px]",
                  statusFilter === "all" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                )}
              >
                Alle ({allMySellListings.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold text-xs transition-all min-h-[36px]",
                  statusFilter === "active" ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40" : "text-neutral-400 hover:text-white"
                )}
              >
                Aktiv ({allMySellListings.filter((l) => l.status === "active").length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold text-xs transition-all min-h-[36px]",
                  statusFilter === "draft" ? "bg-amber-500/30 text-amber-300 border border-amber-500/40" : "text-neutral-400 hover:text-white"
                )}
              >
                Entwürfe ({allMySellListings.filter((l) => l.status === "draft").length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("sold")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold text-xs transition-all min-h-[36px]",
                  statusFilter === "sold" ? "bg-neutral-600/40 text-neutral-300 border border-white/20" : "text-neutral-400 hover:text-white"
                )}
              >
                Verkauft ({allMySellListings.filter((l) => l.status === "sold").length})
              </button>
            </div>

            <button
              onClick={handleOpenCreate}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 min-h-[36px] self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Weitere Karte hinzufügen
            </button>
          </div>

          {filteredMySellListings.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 glass-panel rounded-2xl border border-white/5 p-6">
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

      {/* Floating Action Button for 1-Tap Mobile Creation */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenCreate}
          title="Neue Karte einstellen"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all border border-emerald-300/40 cursor-pointer min-h-[56px] min-w-[56px]"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
