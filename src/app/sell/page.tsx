"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { CreateListingModal } from "@/components/forms/create-listing-modal";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Tag,
  Plus,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Coins,
} from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const { currentUser, listings, openAuthModal } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // User's own active sell listings
  const mySellListings = useMemo(() => {
    return currentUser
      ? listings.filter((l) => l.userId === currentUser.id && l.type === "sell")
      : [];
  }, [currentUser, listings]);

  // Total value of user's active listings
  const totalValue = useMemo(() => {
    return mySellListings.reduce((acc, curr) => acc + (curr.price || 0), 0);
  }, [mySellListings]);

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
    setCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Deine Sammler-Vitrine
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Deine Verkaufskarten
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Verwalte deine aktiven Einzelkarten-Inserate oder biete ganze Sammlungen an Manacards an.
          </p>
        </div>

        {/* Portfolio Stats Card */}
        {currentUser && mySellListings.length > 0 && (
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
                {mySellListings.length} {mySellListings.length === 1 ? "Karte" : "Karten"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Appraisal Gold Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-yellow-950/25 to-[#0b0f19] border border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
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
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          <span>Sammlung einreichen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {mySellListings.length === 0 ? (
        <div className="my-12 max-w-lg mx-auto p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <BorderBeam size={220} duration={8} colorFrom="#10b981" colorTo="#f59e0b" />

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
              Marktplatz durchstöbern
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-neutral-400">
              Deine aktiven Verkaufskarten ({mySellListings.length})
            </span>
            <button
              onClick={handleOpenCreate}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 min-h-[36px]"
            >
              <Plus className="w-4 h-4" /> Weitere Karte hinzufügen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {mySellListings.map((card) => (
              <CollectorSlabCard key={card.id} card={card} />
            ))}
          </div>
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

      {/* Create Listing Modal */}
      <CreateListingModal
        initialType="sell"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
