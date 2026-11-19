"use client";

import React, { useState } from "react";
import { CardListing } from "@/types";
import { CollectorSlabCard } from "../cards/collector-slab-card";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSwipeDeckProps {
  cards: CardListing[];
  onTradeClick?: (card: CardListing) => void;
}

export function MobileSwipeDeck({ cards, onTradeClick }: MobileSwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-1 rounded-3xl border border-hairline text-xs space-y-2">
        <p className="font-bold text-ink">Keine Karten gefunden</p>
        <p className="text-[11px] text-ink-subtle">Passe deine Filter an oder stelle selbst eine Karte ein.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex] || cards[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4 md:hidden">
      {/* Deck Progress Bar & Header */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 text-ink-muted font-semibold">
          <Layers className="w-4 h-4 text-ink-subtle" />
          <span>Kartenstapel</span>
        </div>
        <div className="text-[11px] font-mono text-ink-subtle tabular-nums">
          <b className="text-ink">{currentIndex + 1}</b> / {cards.length}
        </div>
      </div>

      {/* Fortschritt */}
      <div className="mx-2 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full bg-white/60 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Main Slab Card Presentation */}
      <div className="relative px-1">
        <CollectorSlabCard
          key={currentCard.id}
          card={currentCard}
          onTradeClick={onTradeClick}
          className="shadow-2xl"
        />
      </div>

      {/* Thumb Controls (Large, Thumb-Friendly Navigation Dock) */}
      <div className="flex items-center justify-between gap-3 pt-2 px-1">
        <button
          type="button"
          onClick={handlePrev}
          className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-ink-muted font-bold text-xs flex items-center justify-center gap-1 border border-hairline min-h-[48px] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Zurück</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-neutral-200 active:scale-95 text-black font-extrabold text-xs flex items-center justify-center gap-1 min-h-[48px] cursor-pointer"
        >
          <span>Nächste</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
