"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { MobileSwipeDeck } from "@/components/market/mobile-swipe-deck";
import { CreateListingModal } from "@/components/forms/create-listing-modal";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Tag, Sparkles, Plus, ArrowRight, ShieldCheck, Crown } from "lucide-react";
import Link from "next/link";

export default function BuyPage() {
  const { listings, currentUser, openAuthModal } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "deck">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Counts across all categories
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

  // All active sell listings
  const sellListings = useMemo(
    () => listings.filter((l) => l.type === "sell" && l.status === "active"),
    [listings]
  );

  // Filtered
  const filteredListings = useMemo(() => {
    return sellListings.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set ? card.set.toLowerCase().includes(q) : false;
        const matchesSeller = card.user.username.toLowerCase().includes(q);
        if (!matchesName && !matchesSet && !matchesSeller) return false;
      }

      if (selectedLanguage !== "ALL" && card.language !== selectedLanguage) {
        return false;
      }

      if (selectedCondition !== "ALL" && card.condition !== selectedCondition) {
        return false;
      }

      if (onlyVerified && !card.user.verified) {
        return false;
      }

      return true;
    });
  }, [sellListings, searchQuery, selectedLanguage, selectedCondition, onlyVerified]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("ALL");
    setSelectedCondition("ALL");
    setOnlyVerified(false);
  };

  const handleOpenCreate = () => {
    if (!currentUser) {
      openAuthModal("register");
      return;
    }
    setCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Sammler-Vault • Sofortkauf & Inserate
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Karten kaufen & verkaufen
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Entdecke verifizierte Einzelkarten im Collector-Slab-Format oder verkaufe ganze Sammlungen.
          </p>
        </div>

        {/* Bulk Trade-In Link */}
        <Link
          href="/sell/bulk"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 font-bold text-xs transition-all shadow-md shadow-amber-500/10 min-h-[44px]"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Sammlung verkaufen (Bulk-Ankauf)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mode Hub & Navigation */}
      <MarketHubNavigation
        activeMode="sell"
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={resetFilters}
      />

      {/* Content */}
      {filteredListings.length === 0 ? (
        <div className="my-12 max-w-md mx-auto p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <BorderBeam size={200} duration={8} colorFrom="#10b981" colorTo="#38bdf8" />
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Keine passenden Verkaufskarten</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Es wurden keine Inserate für deine aktuellen Filtereinstellungen gefunden. Sei der Erste und stelle eine Karte ein!
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all min-h-[44px]"
            >
              + Neue Karte verkaufen
            </button>
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all min-h-[44px]"
            >
              Filter zurücksetzen
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Swipe Deck View (if toggled on mobile) */}
          {viewMode === "deck" ? (
            <MobileSwipeDeck cards={filteredListings} />
          ) : (
            /* Luxury Slab Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredListings.map((card) => (
                <CollectorSlabCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Listing Modal */}
      <CreateListingModal
        initialType="sell"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
