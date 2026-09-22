"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { CardItemView } from "@/components/cards/card-item-view";
import { CreateListingModal } from "@/components/forms/create-listing-modal";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import {
  Plus,
  Crown,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const { currentUser, listings } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // User's own active sell listings
  const mySellListings = listings.filter(
    (l) => l.userId === currentUser.id && l.type === "sell"
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative pb-24">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Verkaufen & Sammlung-Ankauf
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Deine Verkaufskarten
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Verwalte deine Inserate oder biete ganze Sammlungen mit Vorverkaufsrecht an Manacards an.
          </p>
        </div>

        {/* Action Header: Bulk Upload Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/sell/bulk"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 font-bold text-xs transition-all hover:scale-105 shadow-lg shadow-amber-500/10"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Sammlung verkaufen (Bulk Ankauf)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>

      {/* Content: If no listings, show prominent '+' card. Otherwise show grid + floating '+' */}
      {mySellListings.length === 0 ? (
        /* Empty State: Prominent Center '+' */
        <div className="my-16 max-w-xl mx-auto p-10 rounded-3xl glass-panel border border-white/10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <BorderBeam size={220} duration={10} colorFrom="#10b981" colorTo="#6366f1" />

          <div
            onClick={() => setCreateModalOpen(true)}
            className="w-20 h-20 rounded-3xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto cursor-pointer transition-all hover:scale-110 shadow-lg shadow-emerald-500/20 group"
          >
            <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              Noch keine Karten zum Verkauf angeboten
            </h2>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto">
              Klicke auf das Plus, um deine erste Einzelkarte einzustellen, oder wähle den Bulk-Upload für ganze Sammlungen.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30"
            >
              + Einzelkarte einstellen
            </button>
            <Link
              href="/sell/bulk"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 font-bold text-xs border border-white/10 transition-all"
            >
              Sammlung hochladen
            </Link>
          </div>
        </div>
      ) : (
        /* Grid with User's Listings */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-neutral-400">
            <span>
              Aktuell {mySellListings.length}{" "}
              {mySellListings.length === 1 ? "Karte" : "Karten"} online
            </span>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Weitere Karte hinzufügen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mySellListings.map((card) => (
              <CardItemView key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) at bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setCreateModalOpen(true)}
          title="Neue Karte einstellen"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/50 hover:scale-110 active:scale-95 transition-all border border-emerald-400/40 cursor-pointer"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Create Modal */}
      <CreateListingModal
        initialType="sell"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
