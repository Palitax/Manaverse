"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CardItemView } from "@/components/cards/card-item-view";
import { CardLanguage, CardCondition } from "@/types";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function BuyPage() {
  const { listings } = useStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [selectedSet, setSelectedSet] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);

  // All community sell listings
  const sellListings = useMemo(
    () => listings.filter((l) => l.type === "sell" && l.status === "active"),
    [listings]
  );

  // Extract distinct sets for dropdown
  const availableSets = useMemo(() => {
    const sets = new Set<string>();
    sellListings.forEach((l) => {
      if (l.set) sets.add(l.set);
    });
    return Array.from(sets);
  }, [sellListings]);

  // Apply filters
  const filteredListings = useMemo(() => {
    return sellListings.filter((card) => {
      // Search query (Pokemon name, set, card number, seller username)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set ? card.set.toLowerCase().includes(q) : false;
        const matchesSeller = card.user.username.toLowerCase().includes(q);
        if (!matchesName && !matchesSet && !matchesSeller) return false;
      }

      // Language filter
      if (selectedLanguage !== "ALL" && card.language !== selectedLanguage) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== "ALL" && card.condition !== selectedCondition) {
        return false;
      }

      // Set filter
      if (selectedSet !== "ALL" && card.set !== selectedSet) {
        return false;
      }

      // Verified seller filter
      if (onlyVerified && !card.user.verified) {
        return false;
      }

      return true;
    });
  }, [sellListings, searchQuery, selectedLanguage, selectedCondition, selectedSet, onlyVerified]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("ALL");
    setSelectedCondition("ALL");
    setSelectedSet("ALL");
    setOnlyVerified(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Title & Introduction */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <ShoppingBag className="w-4 h-4" /> Community Marktplatz
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Karten kaufen
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Entdecke Karten aus der Whatnot-Community. Direkt verhandeln oder kaufen.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nach Pokémon-Namen, Set oder Verkäufer suchen..."
            className="w-full bg-[#0d111d] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              Löschen
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 items-center text-xs">
          {/* Language filter */}
          <div>
            <label className="block text-neutral-400 mb-1 font-semibold">Sprache</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Alle Sprachen</option>
              <option value="DE">Deutsch (DE)</option>
              <option value="EN">Englisch (EN)</option>
              <option value="JP">Japanisch (JP)</option>
              <option value="OTHER">Sonstige</option>
            </select>
          </div>

          {/* Condition filter */}
          <div>
            <label className="block text-neutral-400 mb-1 font-semibold">Zustand</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Alle Zustände</option>
              <option value="NM">Near Mint (NM)</option>
              <option value="EX">Excellent (EX)</option>
              <option value="GD">Good (GD)</option>
              <option value="LP">Light Played (LP)</option>
              <option value="PL">Played (PL)</option>
            </select>
          </div>

          {/* Set filter */}
          <div>
            <label className="block text-neutral-400 mb-1 font-semibold">Set</label>
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Alle Sets</option>
              {availableSets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Seller Switch */}
          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="verifiedOnly"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 rounded"
            />
            <label htmlFor="verifiedOnly" className="text-neutral-300 font-medium cursor-pointer flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Nur Verifizierte
            </label>
          </div>

          {/* Reset Filters */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Filter zurücksetzen
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid or Empty State */}
      {filteredListings.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-500">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Keine passenden Karten gefunden</h3>
          <p className="text-xs text-neutral-400">
            Passe deine Suchbegriffe oder Filter an, um mehr Angebote zu sehen.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Alle Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((card) => (
            <CardItemView key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
