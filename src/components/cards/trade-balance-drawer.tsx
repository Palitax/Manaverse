"use client";

import React, { useState } from "react";
import { CardListing } from "@/types";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import {
  X,
  ArrowLeftRight,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Send,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TradeBalanceDrawerProps {
  listing: CardListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TradeBalanceDrawer({
  listing,
  isOpen,
  onClose,
}: TradeBalanceDrawerProps) {
  const { currentUser, listings, addTradeOffer, openAuthModal } = useStore();

  const [selectedMyCardId, setSelectedMyCardId] = useState<string>("");
  const [offeredDescription, setOfferedDescription] = useState("");
  const [offeredValue, setOfferedValue] = useState<number | "">("");
  const [offeredImage, setOfferedImage] = useState("");
  const [tradeMessage, setTradeMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  // Filter current user's own cards that can be offered
  const myCards = currentUser
    ? listings.filter((l) => l.userId === currentUser.id && l.id !== listing.id)
    : [];

  const targetETV = listing.estimatedTradeValue || listing.price || 0;
  const currentOfferValue =
    typeof offeredValue === "number" && offeredValue > 0
      ? offeredValue
      : selectedMyCardId
      ? myCards.find((c) => c.id === selectedMyCardId)?.estimatedTradeValue ||
        myCards.find((c) => c.id === selectedMyCardId)?.price ||
        0
      : 0;

  // Value difference
  const diff = currentOfferValue - targetETV;
  const percentDiff = targetETV > 0 ? (diff / targetETV) * 100 : 0;

  // Balance status
  let balanceStatus: { text: string; color: string; bg: string; icon: any } = {
    text: "Noch kein Gegenangebot gewählt",
    color: "text-neutral-400",
    bg: "bg-white/5 border-white/10",
    icon: Scale,
  };

  if (currentOfferValue > 0) {
    if (Math.abs(percentDiff) <= 10) {
      balanceStatus = {
        text: `⚖️ Perfekt ausgeglichener Trade (±${Math.abs(Math.round(percentDiff))}%)`,
        color: "text-emerald-400",
        bg: "bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
        icon: CheckCircle2,
      };
    } else if (diff < 0) {
      balanceStatus = {
        text: `📉 Dein Angebot liegt ${Math.abs(Math.round(diff))} € unter dem Tauschwert`,
        color: "text-amber-400",
        bg: "bg-amber-950/40 border-amber-500/40",
        icon: AlertTriangle,
      };
    } else {
      balanceStatus = {
        text: `🔥 Großzügiges Angebot (+${Math.round(diff)} € über Tauschwert)`,
        color: "text-purple-400",
        bg: "bg-purple-950/40 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        icon: Sparkles,
      };
    }
  }

  const handleSelectMyCard = (cardId: string) => {
    setSelectedMyCardId(cardId);
    const selectedCard = myCards.find((c) => c.id === cardId);
    if (selectedCard) {
      setOfferedDescription(
        `${selectedCard.name} (${selectedCard.condition} • ${selectedCard.language})`
      );
      setOfferedValue(selectedCard.estimatedTradeValue || selectedCard.price || 0);
      setOfferedImage(selectedCard.photos[0] || "");
    }
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

    if (!offeredDescription.trim()) {
      alert("Bitte gib an, welche Karte(n) du zum Tausch anbietest.");
      return;
    }

    addTradeOffer(listing.id, {
      offeredCardsDescription: offeredDescription,
      offeredImages: offeredImage ? [offeredImage] : [],
      estimatedValue: Number(offeredValue) || 0,
      message: tradeMessage,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Scale className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Interaktive Tausch-Waage
              </h2>
              <p className="text-xs text-neutral-400">
                Vergleiche Werte und schlage einen fairen 1:1 Tausch vor.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Tauschangebot übermittelt!</h3>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              Dein Angebot wurde an <b>{listing.user.username}</b> gesendet. Ihr erhaltet eine Benachrichtigung und könnt den Tausch im Profil abschließen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendOffer} className="space-y-6 pt-5 text-xs">
            {/* 1. Dual Card Comparison Visualizer (Target vs Offer) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {/* Left Side: Target Card (The other collector's card) */}
              <div className="p-4 rounded-2xl bg-[#0c101d] border border-purple-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                    Zielkarte (Gesucht)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <HoloAvatarFrame
                      avatarUrl={listing.user.avatarUrl}
                      username={listing.user.username}
                      role={listing.user.role}
                      verified={listing.user.verified}
                      size="sm"
                    />
                    <span className="font-semibold text-white truncate max-w-[90px]">
                      {listing.user.username}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-20 h-28 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {listing.photos[0] ? (
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-neutral-500">Foto</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm line-clamp-2">{listing.name}</h4>
                    <p className="text-[11px] text-neutral-400">
                      {listing.condition} • {listing.language}
                    </p>
                    <div className="pt-1">
                      <span className="text-[10px] text-neutral-500 block">Tauschwert (ETV)</span>
                      <span className="text-base font-black text-purple-400">
                        {targetETV > 0 ? `~${targetETV} €` : "VB"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seeker Wants */}
                {listing.lookingForWants && (
                  <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200">
                    <span className="font-bold block text-purple-300 mb-0.5">Wants:</span>
                    {listing.lookingForWants}
                  </div>
                )}
              </div>

              {/* Center Swap Icon on Desktop */}
              <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-600 text-white items-center justify-center shadow-lg shadow-purple-600/50 z-20 border border-purple-400">
                <ArrowLeftRight className="w-4 h-4" />
              </div>

              {/* Right Side: Your Offer */}
              <div className="p-4 rounded-2xl bg-[#0c101d] border border-cyan-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Dein Gegenangebot
                  </span>
                  <span className="text-[11px] text-neutral-400 font-semibold">Du als Anbieter</span>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-20 h-28 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {offeredImage ? (
                      <img src={offeredImage} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center p-2 text-neutral-500 text-[10px]">
                        Kein Bild
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-white text-sm truncate">
                      {offeredDescription || "Wähle deine Karte..."}
                    </p>
                    <div className="pt-1">
                      <span className="text-[10px] text-neutral-500 block">Dein Schätzwert</span>
                      <span className="text-base font-black text-cyan-400">
                        {currentOfferValue > 0 ? `~${currentOfferValue} €` : "– €"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Pick from My Collection */}
                {myCards.length > 0 && (
                  <div>
                    <label className="block text-[10px] text-neutral-400 font-semibold mb-1">
                      Aus deinen eingestellten Karten wählen:
                    </label>
                    <select
                      value={selectedMyCardId}
                      onChange={(e) => handleSelectMyCard(e.target.value)}
                      className="w-full bg-[#141b2d] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 min-h-[38px]"
                    >
                      <option value="">-- Eigene Karte auswählen --</option>
                      {myCards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.condition} • {c.estimatedTradeValue || c.price || 0} €)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Trade Balance Bar */}
            <div className={cn("p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all", balanceStatus.bg)}>
              <div className="flex items-center gap-2">
                <balanceStatus.icon className={cn("w-5 h-5 flex-shrink-0", balanceStatus.color)} />
                <span className={cn("font-bold text-xs sm:text-sm", balanceStatus.color)}>
                  {balanceStatus.text}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Differenz</span>
                <span className={cn("font-black text-xs sm:text-sm", diff >= 0 ? "text-emerald-400" : "text-amber-400")}>
                  {diff > 0 ? `+${diff} €` : `${diff} €`}
                </span>
              </div>
            </div>

            {/* 3. Manual Offer Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Beschreibung deines Tauschangebots *
                </label>
                <input
                  type="text"
                  required
                  value={offeredDescription}
                  onChange={(e) => setOfferedDescription(e.target.value)}
                  placeholder="z.B. Glurak VMAX Secret Rare (NM, Deutsch) + 20€ Ausgleich"
                  className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Geschätzter Tauschwert deiner Karte (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={offeredValue}
                    onChange={(e) => setOfferedValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="z.B. 120"
                    className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Foto-URL deiner Tauschkarte (optional)
                  </label>
                  <input
                    type="url"
                    value={offeredImage}
                    onChange={(e) => setOfferedImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Persönliche Nachricht an den Tauschpartner (optional)
                </label>
                <textarea
                  rows={2}
                  value={tradeMessage}
                  onChange={(e) => setTradeMessage(e.target.value)}
                  placeholder="Schreibe ein paar Worte zu deinem Angebot..."
                  className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all min-h-[46px] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Tauschangebot verbindlich einreichen</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-all min-h-[46px]"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
