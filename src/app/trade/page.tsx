"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { CardListing, TradeOffer } from "@/types";
import { CardItemView } from "@/components/cards/card-item-view";
import { CreateListingModal } from "@/components/forms/create-listing-modal";
import { TradeProposalModal } from "@/components/forms/trade-proposal-modal";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import {
  ArrowLeftRight,
  Plus,
  Sparkles,
  Inbox,
  Check,
  X as XIcon,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TradePage() {
  const { listings, tradeOffers, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<"browse" | "offers">("browse");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTradeCard, setSelectedTradeCard] = useState<CardListing | null>(null);

  // Trade listings
  const tradeListings = listings.filter(
    (l) => l.type === "trade" && l.status === "active"
  );

  // Offers targeting the current user's listings
  const myReceivedOffers = tradeOffers.filter(
    (o) => o.listing.userId === currentUser.id
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-4 h-4" /> Community Tauschbörse
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Karten tauschen (Trade)
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Biete Karten für Trades an und erhalte konkrete Gegenangebote von Sammlern.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Tauschkarte einstellen
          </button>
        </div>
      </div>

      {/* Tabs: Browse vs My Offers */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit mb-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab("browse")}
          className={cn(
            "px-5 py-2.5 rounded-xl transition-all",
            activeTab === "browse"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-neutral-400 hover:text-white"
          )}
        >
          Alle Tauschangebote ({tradeListings.length})
        </button>
        <button
          onClick={() => setActiveTab("offers")}
          className={cn(
            "px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5",
            activeTab === "offers"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <Inbox className="w-3.5 h-3.5" />
          Eingehende Angebote ({myReceivedOffers.length})
        </button>
      </div>

      {/* Tab 1: Browse trade listings */}
      {activeTab === "browse" && (
        <>
          {tradeListings.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 p-8 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                <ArrowLeftRight className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Keine Tauschkarten aktiv</h3>
              <p className="text-xs text-neutral-400">
                Sei der Erste und stelle eine Karte ein, die du tauschen möchtest!
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                + Erste Tauschkarte einstellen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tradeListings.map((card) => (
                <CardItemView
                  key={card.id}
                  card={card}
                  onTradeClick={(c) => setSelectedTradeCard(c)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Received trade proposals */}
      {activeTab === "offers" && (
        <div className="space-y-4">
          {myReceivedOffers.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 p-8 space-y-3 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/5 text-neutral-500 flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Noch keine Gegenangebote</h3>
              <p className="text-xs text-neutral-400">
                Sobald andere Community-User ein Gegenangebot für deine Tauschkarten machen, siehst du es hier.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReceivedOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
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
                          Für deine Karte: <span className="text-purple-300 font-semibold">{offer.listing.name}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/20">
                      Wert: ~{offer.estimatedValue} €
                    </span>
                  </div>

                  {/* Offered card details */}
                  <div className="flex items-start gap-3 bg-[#0d121f] p-3 rounded-xl border border-white/5">
                    {offer.offeredImages[0] && (
                      <img
                        src={offer.offeredImages[0]}
                        alt=""
                        className="w-16 h-20 object-contain rounded bg-black/60 p-1"
                      />
                    )}
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-white">{offer.offeredCardsDescription}</p>
                      {offer.message && (
                        <p className="text-neutral-300 italic">"{offer.message}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => alert(`Du hast das Tauschangebot von ${offer.fromUser.username} angenommen! Tauscht nun eure Adressen aus.`)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" /> Annehmen
                    </button>
                    <button
                      onClick={() => alert("Angebot abgelehnt.")}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-bold text-xs transition-colors"
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

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setCreateModalOpen(true)}
          title="Neue Tauschkarte einstellen"
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 hover:scale-110 active:scale-95 transition-all border border-purple-400/40 cursor-pointer"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Create Listing Modal */}
      <CreateListingModal
        initialType="trade"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Trade Proposal Modal */}
      {selectedTradeCard && (
        <TradeProposalModal
          listing={selectedTradeCard}
          isOpen={Boolean(selectedTradeCard)}
          onClose={() => setSelectedTradeCard(null)}
        />
      )}
    </div>
  );
}
