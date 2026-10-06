"use client";

import React, { useState } from "react";
import { CardListing } from "@/types";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import {
  X,
  Target,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Send,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BountyMatchModalProps {
  listing: CardListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BountyMatchModal({
  listing,
  isOpen,
  onClose,
}: BountyMatchModalProps) {
  const { currentUser, createDeal, openAuthModal } = useStore();

  const [myCondition, setMyCondition] = useState<string>("NM");
  const [askingPrice, setAskingPrice] = useState<number | "">("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

    if (listing.userId === currentUser.id) {
      alert("Das ist dein eigenes Gesuch!");
      return;
    }

    // Create deal proposal from seller to seeker
    createDeal(
      {
        ...listing,
        price: Number(askingPrice) || listing.price || 0,
        description: `Bounty-Match von ${currentUser.username}: Zustand ${myCondition}${message ? ` – "${message}"` : ""}`,
      },
      listing.user as any
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Target className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Kopfgeld-Match: „Ich habe diese Karte!“
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Bounty
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Biete deine Karte direkt dem Suchenden an und schließt den Deal ab.
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
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Bounty-Match übermittelt!</h3>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              Dein Angebot wurde an <b>{listing.user.username}</b> gesendet. Der Suchende wurde benachrichtigt und kann deinen Preis annehmen!
            </p>
          </div>
        ) : (
          <form onSubmit={handleMatchSubmit} className="space-y-5 pt-5 text-xs">
            {/* Wanted Card Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-[#0c101d] border border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-22 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {listing.photos[0] ? (
                    <img src={listing.photos[0]} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Target className="w-6 h-6 text-cyan-400 opacity-50" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                    Gesuchte Karte
                  </span>
                  <h4 className="font-black text-white text-base leading-tight">{listing.name}</h4>
                  <p className="text-[11px] text-neutral-400">
                    {listing.set && `${listing.set} • `}
                    {listing.cardNumber && `#${listing.cardNumber} • `}
                    Gesuchter Zustand: <b className="text-neutral-200">{listing.condition}</b>
                  </p>
                </div>
              </div>

              {/* Seeker Budget */}
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Budget des Suchenden
                </span>
                <span className="text-lg sm:text-xl font-black text-cyan-400">
                  {listing.priceRange || (listing.price ? `${listing.price} €` : "VB")}
                </span>
              </div>
            </div>

            {/* Seeker Contact & Info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5">
                <HoloAvatarFrame
                  avatarUrl={listing.user.avatarUrl}
                  username={listing.user.username}
                  role={listing.user.role}
                  verified={listing.user.verified}
                  size="sm"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    Gesucht von: {listing.user.username}
                    {listing.user.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {listing.user.dealsCount} erfolgreiche Deals
                  </p>
                </div>
              </div>
              {listing.user.discordUsername && (
                <span className="text-[11px] text-indigo-300 font-mono">
                  Discord: @{listing.user.discordUsername}
                </span>
              )}
            </div>

            {/* Seller Match Offer Inputs */}
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Dein Wunschpreis (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="z.B. 85"
                    className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Zustand deiner Karte *
                  </label>
                  <select
                    value={myCondition}
                    onChange={(e) => setMyCondition(e.target.value)}
                    className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="NM">Near Mint (Makellos / Wie neu)</option>
                    <option value="EX">Excellent (Minimale Spielspuren)</option>
                    <option value="GD">Good (Leichte Spielspuren)</option>
                    <option value="LP">Light Played (Sichtbare Abnutzung)</option>
                    <option value="PL">Played (Gebraucht)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Foto-URL deiner Karte (optional, erhöht Zusagechancen)
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Kurze Nachricht an {listing.user.username}
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="z.B. Karte ist frisch im Sleeve & Toploader, Versand per Prio möglich!"
                  className="w-full bg-[#101524] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all min-h-[46px] cursor-pointer"
              >
                <Send className="w-4 h-4 fill-black" />
                <span>Angebot an Suchenden absenden</span>
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
