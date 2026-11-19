"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { isVerifiedCollector, MODE_THEME } from "@/lib/design-system";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { MobileSwipeDeck } from "@/components/market/mobile-swipe-deck";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import { MarketPageHeader, MarketEmptyState } from "@/components/market/page-shell";

export default function BuyPage() {
  const { listings, currentUser, openAuthModal } = useStore();
  const [studioOpen, setStudioOpen] = useState(false);
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
        const matchesNumber = card.cardNumber ? card.cardNumber.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesSet && !matchesSeller && !matchesNumber) return false;
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
    setStudioOpen((prev) => !prev);
    if (!studioOpen) {
      setTimeout(() => {
        document.getElementById("buy-create-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      <MarketPageHeader
        theme={MODE_THEME.buy}
        title="Karten kaufen"
        description="Einzelkarten und Graded Slabs direkt aus der Community – mit transparenten Zuständen und ohne Käufergebühren."
      />

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

      {/* In-Page Inserat-Erstellung */}
      {studioOpen && (
        <div id="buy-create-section" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardForgeStudio
            initialType="sell"
            mode="inline"
            onSuccess={() => setStudioOpen(false)}
            onCancel={() => setStudioOpen(false)}
          />
        </div>
      )}

      {/* Content */}
      {filteredListings.length === 0 ? (
        <MarketEmptyState
          theme={MODE_THEME.buy}
          title={sellListings.length === 0 ? "Noch keine Karten im Marktplatz" : "Keine passenden Karten"}
          description={
            sellListings.length === 0
              ? "Sobald Sammler Karten zum Sofortkauf einstellen, erscheinen sie hier. Sei der Erste!"
              : "Für deine aktuellen Filter gibt es gerade keine Angebote. Passe die Suche an oder setze die Filter zurück."
          }
          primaryLabel="Karte anbieten"
          onPrimary={handleOpenCreate}
          secondaryLabel={sellListings.length > 0 ? "Filter zurücksetzen" : undefined}
          onSecondary={resetFilters}
        />
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
    </div>
  );
}
