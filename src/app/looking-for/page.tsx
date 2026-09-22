"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { CardListing } from "@/types";
import { CardItemView } from "@/components/cards/card-item-view";
import { CreateListingModal } from "@/components/forms/create-listing-modal";
import {
  Search,
  Plus,
  Sparkles,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

export default function LookingForPage() {
  const { listings } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const lookingForListings = listings.filter(
    (l) => l.type === "looking_for" && l.status === "active"
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" /> Gesuche der Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Looking For (Gesuche)
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Suchst du noch Karten für deine Sammlung? Starte ein Gesuch oder hilf anderen Sammlern ihre Wunschkarten zu finden.
          </p>
        </div>

        <div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Neues Gesuch starten
          </button>
        </div>
      </div>

      {/* Grid of Want-lists */}
      {lookingForListings.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Aktuell keine Gesuche aktiv</h3>
          <p className="text-xs text-neutral-400">
            Erstelle das erste Gesuch und teile es direkt auf Discord!
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            + Erstes Gesuch starten
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lookingForListings.map((card) => (
            <CardItemView key={card.id} card={card} />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setCreateModalOpen(true)}
          title="Neues Gesuch aufgeben"
          className="w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-cyan-600/50 hover:scale-110 active:scale-95 transition-all border border-cyan-400/40 cursor-pointer"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Create Listing Modal */}
      <CreateListingModal
        initialType="looking_for"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
