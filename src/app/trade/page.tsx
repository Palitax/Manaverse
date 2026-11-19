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
import { ArrowLeftRight, Inbox, CheckCircle2, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketPageHeader, MarketEmptyState } from "@/components/market/page-shell";
import { toast } from "@/components/ui/toast";
import { isVerifiedCollector, MODE_THEME } from "@/lib/design-system";

export default function TradePage() {
  const { listings, tradeOffers, currentUser, openAuthModal, respondToTradeOffer } = useStore();
  const violet = MODE_THEME.trade;
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
        const matchesSeller = card.user.username.toLowerCase().includes(q) || (card.cardNumber ? card.cardNumber.toLowerCase().includes(q) : false);
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

      if (onlyVerified && !isVerifiedCollector(card.user)) {
        return false;
      }

      return true;
    });
  }, [tradeListings, searchQuery, selectedLanguage, selectedCondition, onlyVerified]);

  // Offers targeting the current user's listings
  const myReceivedOffers = currentUser
    ? tradeOffers.filter((o) => o.listing.userId === currentUser.id)
    : [];
  const pendingReceivedCount = myReceivedOffers.filter((o) => o.status === "pending").length;

  const handleRespond = async (offerId: string, status: "accepted" | "declined", partner: string) => {
    const ok = await respondToTradeOffer(offerId, status);
    if (!ok) {
      toast.error("Antwort konnte nicht gespeichert werden", "Bitte versuche es gleich noch einmal.");
      return;
    }
    if (status === "accepted") {
      toast.success(`Tausch mit ${partner} angenommen`, "Kontaktiert euch jetzt per Discord, um den Versand abzustimmen.");
    } else {
      toast.info(`Angebot von ${partner} abgelehnt`);
    }
  };

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
        document.getElementById("trade-create-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleTradeClick = (card: CardListing) => {
    setSelectedTradeCard(card);
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      <MarketPageHeader
        theme={violet}
        title="Karten tauschen"
        description="Tausche 1:1 oder mit fairem Wertausgleich – die Tausch-Waage zeigt dir sofort, ob ein Angebot ausgeglichen ist."
      />

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

      {/* In-Page Inserat-Erstellung */}
      {studioOpen && (
        <div id="trade-create-section" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardForgeStudio
            initialType="trade"
            mode="inline"
            onSuccess={() => setStudioOpen(false)}
            onCancel={() => setStudioOpen(false)}
          />
        </div>
      )}

      {/* Tabs: Browse vs My Offers */}
      <div role="tablist" className="inline-flex items-center gap-1 p-1 bg-surface-1/95 backdrop-blur-md rounded-xl border border-hairline mb-6 text-xs font-semibold">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "browse"}
          onClick={() => setActiveTab("browse")}
          className={cn(
            "px-4 rounded-lg transition-colors min-h-[40px] flex items-center gap-2",
            activeTab === "browse" ? "bg-white/[0.08] text-ink" : "text-ink-subtle hover:text-ink"
          )}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Alle Tauschkarten</span>
          <span className="text-[10px] text-ink-subtle tabular-nums">{filteredTrades.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "offers"}
          onClick={() => setActiveTab("offers")}
          className={cn(
            "px-4 rounded-lg transition-colors flex items-center gap-2 min-h-[40px]",
            activeTab === "offers" ? "bg-white/[0.08] text-ink" : "text-ink-subtle hover:text-ink"
          )}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Eingehende Angebote</span>
          {pendingReceivedCount > 0 ? (
            <span className={cn("min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center", violet.solid)}>
              {pendingReceivedCount}
            </span>
          ) : (
            <span className="text-[10px] text-ink-subtle tabular-nums">{myReceivedOffers.length}</span>
          )}
        </button>
      </div>

      {/* TAB 1: BROWSE TRADES */}
      {activeTab === "browse" && (
        <>
          {filteredTrades.length === 0 ? (
            <MarketEmptyState
              theme={violet}
              title={tradeListings.length === 0 ? "Noch keine Tauschkarten" : "Keine passenden Tauschkarten"}
              description={
                tradeListings.length === 0
                  ? "Biete deine erste Karte zum Tausch an und starte den ersten Trade der Community."
                  : "Für deine Filter gibt es gerade keine Tauschkarten. Passe die Suche an oder setze die Filter zurück."
              }
              primaryLabel="Tauschkarte einstellen"
              onPrimary={handleOpenCreate}
              secondaryLabel={tradeListings.length > 0 ? "Filter zurücksetzen" : undefined}
              onSecondary={resetFilters}
            />
          ) : viewMode === "deck" ? (
            <MobileSwipeDeck cards={filteredTrades} onTradeClick={handleTradeClick} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredTrades.map((card) => (
                <CollectorSlabCard key={card.id} card={card} onTradeClick={handleTradeClick} />
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: RECEIVED OFFERS */}
      {activeTab === "offers" && (
        <div className="space-y-4">
          {!currentUser ? (
            <MarketEmptyState
              theme={violet}
              icon={Inbox}
              title="Melde dich an"
              description="Eingehende Tauschangebote für deine Karten siehst du, sobald du angemeldet bist."
              primaryLabel="Jetzt anmelden"
              onPrimary={() => openAuthModal("login")}
            />
          ) : myReceivedOffers.length === 0 ? (
            <MarketEmptyState
              theme={violet}
              icon={Inbox}
              title="Noch keine Gegenangebote"
              description="Sobald ein Sammler über die Tausch-Waage ein Angebot für deine Karten einreicht, erscheint es hier."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReceivedOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl bg-surface-1/95 backdrop-blur-md border border-hairline space-y-4"
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-hairline">
                    <div className="flex items-center gap-3 min-w-0">
                      <HoloAvatarFrame
                        avatarUrl={offer.fromUser.avatarUrl}
                        username={offer.fromUser.username}
                        role={offer.fromUser.role}
                        verified={offer.fromUser.verified}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink truncate">
                          {offer.fromUser.username}
                        </p>
                        <p className="text-[11px] text-ink-subtle truncate">
                          für <span className={cn("font-semibold", violet.text)}>{offer.listing.name}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-ink bg-white/[0.04] px-2.5 py-1 rounded-lg border border-hairline tabular-nums flex-shrink-0">
                      ~{offer.estimatedValue} €
                    </span>
                  </div>

                  <div className="text-xs bg-surface-2 p-3 rounded-xl border border-hairline space-y-1">
                    <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-[0.14em] block">
                      Angeboten
                    </span>
                    <p className="text-ink-muted">{offer.offeredCardsDescription}</p>
                    {offer.message && (
                      <p className="text-ink-subtle italic pt-1.5 mt-1.5 border-t border-hairline">
                        „{offer.message}“
                      </p>
                    )}
                  </div>

                  {offer.status === "pending" ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRespond(offer.id, "accepted", offer.fromUser.username)}
                        className={cn("flex-1 py-2.5 rounded-xl font-black text-xs transition-colors min-h-[44px] cursor-pointer flex items-center justify-center gap-1.5", violet.solid)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Annehmen
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRespond(offer.id, "declined", offer.fromUser.username)}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-hairline text-ink-muted hover:text-ink text-xs font-semibold transition-colors min-h-[44px] cursor-pointer flex items-center gap-1.5"
                      >
                        <XIcon className="w-4 h-4" />
                        Ablehnen
                      </button>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold",
                        offer.status === "accepted"
                          ? "bg-emerald-500/[0.06] border-emerald-500/30 text-emerald-300"
                          : "bg-white/[0.03] border-hairline text-ink-subtle"
                      )}
                    >
                      {offer.status === "accepted" ? <CheckCircle2 className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                      {offer.status === "accepted" ? "Angenommen" : "Abgelehnt"}
                    </div>
                  )}
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
