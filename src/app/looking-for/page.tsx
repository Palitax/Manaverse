"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CardListing } from "@/types";
import { isVerifiedCollector, MODE_THEME } from "@/lib/design-system";
import { CollectorSlabCard } from "@/components/cards/collector-slab-card";
import { MarketHubNavigation } from "@/components/market/market-hub-navigation";
import { MobileSwipeDeck } from "@/components/market/mobile-swipe-deck";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import { MarketPageHeader, MarketEmptyState } from "@/components/market/page-shell";

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
        const matchesNumber = card.cardNumber ? card.cardNumber.toLowerCase().includes(q) : false;
        const matchesDesc = card.description
          ? card.description.toLowerCase().includes(q)
          : false;
        if (!matchesName && !matchesSet && !matchesSeeker && !matchesDesc && !matchesNumber) return false;
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
        document.getElementById("bounty-create-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
      <MarketPageHeader
        theme={MODE_THEME.want}
        title="Gesuchte Karten"
        description="Schreibe deine Wunschkarten mit Budget aus – oder prüfe, ob du eine Karte hast, die gerade jemand sucht."
      />

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

      {/* In-Page Inserat-Erstellung */}
      {studioOpen && (
        <div id="bounty-create-section" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
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
        <MarketEmptyState
          theme={MODE_THEME.want}
          title={lookingForListings.length === 0 ? "Aktuell keine Gesuche" : "Keine passenden Gesuche"}
          description={
            lookingForListings.length === 0
              ? "Erstelle das erste Gesuch und zeige der Community, welche Karte dir noch fehlt."
              : "Für deine Filter gibt es gerade keine Gesuche. Passe die Suche an oder setze die Filter zurück."
          }
          primaryLabel="Gesuch aufgeben"
          onPrimary={handleOpenCreate}
          secondaryLabel={lookingForListings.length > 0 ? "Filter zurücksetzen" : undefined}
          onSecondary={resetFilters}
        />
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

    </div>
  );
}
