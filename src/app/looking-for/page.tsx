"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CardListing } from "@/types";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { MobileSwipeDeck } from "@/components/market/mobile-swipe-deck";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Target,
  Plus,
  Sparkles,
  HelpCircle,
  Coins,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function LookingForPage() {
  const { listings, currentUser, openAuthModal } = useStore();
  const [studioOpen, setStudioOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "deck">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Active want listings
  const lookingForListings = useMemo(
    () => listings.filter((l) => l.type === "looking_for" && l.status === "active"),
    [listings]
  );

  // Overall counts for navigation hub
  const counts = useMemo(() => {
    const sellCount = listings.filter((l) => l.type === "sell" && l.status === "active").length;
    const tradeCount = listings.filter((l) => l.type === "trade" && l.status === "active").length;
    const wantCount = lookingForListings.length;
    return {
      sell: sellCount,
      trade: tradeCount,
      looking_for: wantCount,
      all: sellCount + tradeCount + wantCount,
    };
  }, [listings, lookingForListings]);

  // Filtered
  const filteredListings = useMemo(() => {
    return lookingForListings.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set ? card.set.toLowerCase().includes(q) : false;
        const matchesSeeker = card.user.username.toLowerCase().includes(q);
        const matchesDesc = card.description
          ? card.description.toLowerCase().includes(q)
          : false;
        if (!matchesName && !matchesSet && !matchesSeeker && !matchesDesc) return false;
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
  }, [lookingForListings, searchQuery, selectedLanguage, selectedCondition, onlyVerified]);

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
    setStudioOpen((prev) => !prev);
    if (!studioOpen) {
      setTimeout(() => {
        document.getElementById("bounty-forge-studio")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" /> Cyber Kopfgeld-Radar • Wanted Board
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Gesuchte Karten (Bounties)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Hilf Sammlern bei ihrer Suche oder setze selbst ein Kopfgeld mit deinem Wunschbudget aus.
          </p>
        </div>

        {/* Explain Bounty System */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-200">
          <Coins className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span>
            <b>1-Klick Match:</b> Besitzt du die gesuchte Karte? Klicke auf <i>„Habe ich!“</i> und biete deinen Preis an.
          </span>
        </div>
      </div>

      {/* Mode Hub & Navigation */}
      <MarketHubNavigation
        activeMode="looking_for"
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

      {/* In-Page Expandable Karten-Schmiede (No popup) */}
      {studioOpen && (
        <div id="bounty-forge-studio" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardForgeStudio
            initialType="looking_for"
            mode="inline"
            onSuccess={() => setStudioOpen(false)}
            onCancel={() => setStudioOpen(false)}
          />
        </div>
      )}

      {/* Content */}
      {filteredListings.length === 0 ? (
        <div className="my-12 max-w-md mx-auto p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <BorderBeam size={200} duration={8} colorFrom="#06b6d4" colorTo="#3b82f6" />
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Aktuell keine Gesuche</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Keine aktiven Suchanfragen für diese Filtereinstellungen gefunden. Erstelle jetzt ein Gesuch für deine gesuchte Traumkarte!
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all min-h-[44px]"
            >
              + Neues Gesuch starten
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
          {/* Mobile Deck View */}
          {viewMode === "deck" ? (
            <MobileSwipeDeck cards={filteredListings} />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredListings.map((card) => (
                <CollectorSlabCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenCreate}
          title="Neues Gesuch aufgeben"
          className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all border border-cyan-300/40 cursor-pointer min-h-[56px] min-w-[56px]"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
