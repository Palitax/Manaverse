"use client";

import React, { useState } from "react";
import { CardListing } from "@/types";
import { useStore } from "@/lib/store";
import { X, ArrowLeftRight, Sparkles, Upload } from "lucide-react";
import { PokemonSearchInput } from "./pokemon-search-input";

interface TradeProposalModalProps {
  listing: CardListing;
  isOpen: boolean;
  onClose: () => void;
}

export function TradeProposalModal({
  listing,
  isOpen,
  onClose,
}: TradeProposalModalProps) {
  const { addTradeOffer, currentUser } = useStore();
  const [offeredCardName, setOfferedCardName] = useState("");
  const [estimatedValue, setEstimatedValue] = useState<number>(listing.estimatedTradeValue || 50);
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredCardName) return;

    addTradeOffer(listing.id, {
      offeredCardsDescription: offeredCardName,
      offeredImages: photoUrl ? [photoUrl] : ["https://images.pokemontcg.io/base1/4_hires.png"],
      estimatedValue: Number(estimatedValue),
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 border border-white/15 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">Tauschangebot gesendet!</h3>
            <p className="text-sm text-neutral-400">
              {listing.user.username} wurde benachrichtigt und kann dein Angebot prüfen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-bold uppercase tracking-wider">
              <ArrowLeftRight className="w-4 h-4" /> Gegenangebot vorschlagen
            </div>

            {/* Target card mini banner */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <img
                src={listing.photos[0]}
                alt={listing.name}
                className="w-12 h-16 object-contain rounded bg-black/50 p-1"
              />
              <div className="min-w-0">
                <p className="text-xs text-neutral-400">Tausch für:</p>
                <p className="text-sm font-bold text-white truncate">{listing.name}</p>
                <p className="text-xs text-purple-400">
                  Geschätzter Wert: ~{listing.estimatedTradeValue} €
                </p>
              </div>
            </div>

            {/* What you offer */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Deine angebotene Karte (Name & Set) *
              </label>
              <PokemonSearchInput
                value={offeredCardName}
                onChange={setOfferedCardName}
                onSelectCard={(card) => {
                  setOfferedCardName(`${card.name} (${card.set.name})`);
                  setPhotoUrl(card.images.large);
                }}
                placeholder="z.B. Rayquaza VMAX Alt Art..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Geschätzter Tauschwert (€) *
                </label>
                <input
                  type="number"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
                  required
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Foto-URL der Karte (optional)
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Nachricht an {listing.user.username} (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="z.B. Karte ist Near Mint, frisch gesleevt. Kann noch 20€ Zuzahlung leisten..."
                rows={3}
                className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
            >
              Tauschangebot abschicken
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
