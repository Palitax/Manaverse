"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CardListing } from "@/types";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { MobileSwipeDeck } from "@/components/market/mobile-swipe-deck";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import { TradeBalanceDrawer } from "@/components/cards/trade-balance-drawer";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  ArrowLeftRight,
  Plus,
  Scale,
  Inbox,
  Sparkles,
  Info,
  CheckCircle2,
  X as XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TradePage() {
  const { listings, tradeOffers, currentUser, openAuthModal } = useStore();
  const [activeTab, setActiveTab] = useState<"browse" | "offers">("browse");
  const [studioOpen, setStudioOpen] = useState(false);
  const [selectedTradeCard, setSelectedTradeCard] = useState<CardListing | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "deck">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Active trade listings
  const tradeListings = useMemo(
    () => listings.filter((l) => l.type === "trade" && l.status === "active"),
    [listings]
  );

  // Filtered
  const filteredTrades = useMemo(() => {
    return tradeListings.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set ? card.set.toLowerCase().includes(q) : false;
        const matchesSeller = card.user.username.toLowerCase().includes(q);
        const matchesWants = card.lookingForWants
          ? card.lookingForWants.toLowerCase().includes(q)
          : false;
        if (!matchesName && !matchesSet && !matchesSeller && !matchesWants) return false;
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
  }, [tradeListings, searchQuery, selectedLanguage, selectedCondition, onlyVerified]);

  // Offers targeting the current user's listings
  const myReceivedOffers = currentUser
    ? tradeOffers.filter((o) => o.listing.userId === currentUser.id)
    : [];

  // Overall counts for navigation hub
  const counts = useMemo(() => {
    const sellCount = listings.filter((l) => l.type === "sell" && l.status === "active").length;
    const tradeCount = tradeListings.length;
    const wantCount = listings.filter((l) => l.type === "looking_for" && l.status === "active").length;
    return {
      sell: sellCount,
      trade: tradeCount,
      looking_for: wantCount,
      all: sellCount + tradeCount + wantCount,
    };
  }, [listings, tradeListings]);

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
        document.getElementById("trade-forge-studio")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleTradeClick = (card: CardListing) => {
    setSelectedTradeCard(card);
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-4 h-4" /> 1:1 Tausch-Arena & Swap Chamber
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Karten tauschen (Trade)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Tausche Pokémon-Karten auf Augenhöhe mit transparenter Tausch-Waage und ETV-Wertermittlung.
          </p>
        </div>

        {/* Explain Tausch-Waage Banner */}
        <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-200">
          <Scale className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span>
            <b>Tauschwert (ETV):</b> Reeller Marktwert für faire Deals ohne Übervorteilung.
          </span>
        </div>
      </div>

      {/* Mode Hub & Navigation */}
      <MarketHubNavigation
        activeMode="trade"
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
        <div id="trade-forge-studio" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardForgeStudio
            initialType="trade"
            mode="inline"
            onSuccess={() => setStudioOpen(false)}
            onCancel={() => setStudioOpen(false)}
          />
        </div>
      )}

      {/* Tabs: Browse vs My Offers */}
      <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10 w-fit mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("browse")}
          className={cn(
            "px-4 py-2 rounded-xl transition-all min-h-[40px] flex items-center gap-2",
            activeTab === "browse"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Alle Tauschangebote ({filteredTrades.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("offers")}
          className={cn(
            "px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 min-h-[40px]",
            activeTab === "offers"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Eingehende Angebote ({myReceivedOffers.length})</span>
        </button>
      </div>

      {/* TAB 1: BROWSE TRADES */}
      {activeTab === "browse" && (
        <>
          {filteredTrades.length === 0 ? (
            <div className="my-12 max-w-md mx-auto p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-4 shadow-2xl relative overflow-hidden">
              <BorderBeam size={200} duration={8} colorFrom="#a855f7" colorTo="#ec4899" />
              <div className="w-16 h-16 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                <ArrowLeftRight className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Keine aktiven Tauschkarten</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Es wurden keine passenden Tauschkarten gefunden. Biete deine eigene Karte an und starte den ersten Tausch der Community!
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all min-h-[44px]"
                >
                  + Tauschkarte einstellen
                </button>
                <button
                  type="button"
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
                <MobileSwipeDeck
                  cards={filteredTrades}
                  onTradeClick={handleTradeClick}
                />
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {filteredTrades.map((card) => (
                    <CollectorSlabCard
                      key={card.id}
                      card={card}
                      onTradeClick={handleTradeClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* TAB 2: RECEIVED OFFERS */}
      {activeTab === "offers" && (
        <div className="space-y-4">
          {myReceivedOffers.length === 0 ? (
            <div className="my-12 text-center glass-panel rounded-3xl border border-white/10 p-8 space-y-3 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/5 text-neutral-500 flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Noch keine Gegenangebote eingegangen</h3>
              <p className="text-xs text-neutral-400">
                Sobald ein Sammler ein Angebot über die Tausch-Waage für deine Karten einreicht, erscheint es hier.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReceivedOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <HoloAvatarFrame
                        avatarUrl={offer.fromUser.avatarUrl}
                        username={offer.fromUser.username}
                        role={offer.fromUser.role}
                        verified={offer.fromUser.verified}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">
                          Angebot von {offer.fromUser.username}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          Für: <b className="text-purple-300">{offer.listing.name}</b>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      Wert: ~{offer.estimatedValue} €
                    </span>
                  </div>

                  <div className="text-xs bg-[#0b0f19] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Angebotene Karten:
                    </span>
                    <p className="text-neutral-200">{offer.offeredCardsDescription}</p>
                    {offer.message && (
                      <p className="text-neutral-400 italic pt-1 border-t border-white/5">
                        "{offer.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`Tausch mit ${offer.fromUser.username} angenommen!`)}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all min-h-[44px]"
                    >
                      Tausch annehmen
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Gegenangebot abgelehnt.")}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold transition-all min-h-[44px]"
                    >
                      Ablehnen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Trade Balance Drawer */}
      <TradeBalanceDrawer
        listing={selectedTradeCard}
        isOpen={Boolean(selectedTradeCard)}
        onClose={() => setSelectedTradeCard(null)}
      />
    </div>
  );
}
