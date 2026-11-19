"use client";

import React, { useState } from "react";
import { CardListing } from "@/types";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import { X, Target, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODE_THEME, BTN_SECONDARY, BTN_CLOSE, INPUT_BASE, MODAL_OVERLAY, MODAL_PANEL } from "@/lib/design-system";
import { Portal } from "@/components/ui/portal";
import { toast } from "@/components/ui/toast";
import { VerifiedSeal } from "@/components/ui/verified-seal";
import { getVerificationTier } from "@/components/profile/verification-shield";

const orange = MODE_THEME.want;

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

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

    if (listing.userId === currentUser.id) {
      toast.info("Das ist dein eigenes Gesuch.");
      return;
    }

    // Deal-Vorschlag: Du (Anbieter der Karte) verkaufst an den Suchenden (Käufer)
    await createDeal(
      {
        ...listing,
        userId: currentUser.id,
        user: currentUser,
        price: Number(askingPrice) || listing.price || 0,
        description: `Gesuch-Match von ${currentUser.username}: Zustand ${myCondition}${message ? ` – „${message}“` : ""}`,
      },
      listing.user as any
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const seekerTier = getVerificationTier(listing.user.dealsCount || 0);

  return (
    <Portal>
      <div onClick={onClose} className={cn(MODAL_OVERLAY, "overlay-fade")}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(MODAL_PANEL, "max-w-2xl p-5 sm:p-7 panel-rise")}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", orange.soft)}>
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className={cn("text-[10px] font-bold uppercase tracking-[0.16em] block", orange.textSoft)}>
                  Gesuch erfüllen
                </span>
                <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                  Ich habe diese Karte
                </h2>
              </div>
            </div>
            <button type="button" aria-label="Schließen" onClick={onClose} className={BTN_CLOSE}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-ink tracking-tight">Angebot übermittelt</h3>
              <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
                Dein Angebot wurde an <b className="text-ink">{listing.user.username}</b> gesendet und erscheint bei euch beiden unter „Transaktionen &amp; Deals“.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMatchSubmit} className="space-y-5 pt-5 text-xs">
              {/* Gesuchte Karte */}
              <div className={cn("p-4 rounded-2xl bg-surface-2 border flex items-center justify-between gap-4", orange.border)}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-[88px] rounded-xl bg-black border border-hairline overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {listing.photos[0] ? (
                      <img src={listing.photos[0]} alt={listing.name} className="w-full h-full object-contain" />
                    ) : (
                      <Target className="w-6 h-6 text-ink-subtle" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className={cn("text-[10px] font-bold uppercase tracking-[0.14em] block", orange.textSoft)}>
                      Gesuchte Karte
                    </span>
                    <h4 className="font-black text-ink text-base leading-tight truncate">{listing.name}</h4>
                    <p className="text-[11px] text-ink-subtle">
                      {listing.set && `${listing.set} · `}
                      {listing.cardNumber && `#${listing.cardNumber} · `}
                      Zustand: <b className="text-ink-muted">{listing.condition}</b>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-ink-subtle uppercase tracking-[0.14em] block">Budget</span>
                  <span className={cn("text-lg sm:text-xl font-black tabular-nums", orange.text)}>
                    {listing.priceRange || (listing.price ? `${listing.price} €` : "VB")}
                  </span>
                </div>
              </div>

              {/* Suchender */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-2 border border-hairline">
                <div className="flex items-center gap-2.5 min-w-0">
                  <HoloAvatarFrame
                    avatarUrl={listing.user.avatarUrl}
                    username={listing.user.username}
                    role={listing.user.role}
                    verified={listing.user.verified}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink flex items-center gap-1.5 truncate">
                      {listing.user.username}
                      {seekerTier.level > 0 && <VerifiedSeal level={seekerTier.level} size={14} />}
                    </p>
                    <p className="text-[10px] text-ink-subtle">
                      {listing.user.dealsCount} erfolgreiche Deals
                    </p>
                  </div>
                </div>
                {listing.user.discordUsername && listing.showDiscordName !== false && (
                  <span className="text-[11px] text-[#aab4f5] font-mono truncate">
                    @{listing.user.discordUsername}
                  </span>
                )}
              </div>

              {/* Angebot */}
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-muted font-semibold mb-1">Dein Wunschpreis (€) *</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      required
                      min="1"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="z. B. 85"
                      className={cn(INPUT_BASE, "px-3 py-2.5 min-h-[44px] font-bold tabular-nums", orange.focus)}
                    />
                  </div>

                  <div>
                    <label className="block text-ink-muted font-semibold mb-1">Zustand deiner Karte *</label>
                    <select
                      value={myCondition}
                      onChange={(e) => setMyCondition(e.target.value)}
                      className={cn(INPUT_BASE, "px-3 py-2.5 min-h-[44px] font-semibold cursor-pointer", orange.focus)}
                    >
                      <option value="Graded">Graded</option>
                      <option value="NM">Near Mint</option>
                      <option value="EX">Excellent (minimale Spuren)</option>
                      <option value="GD">Good (leichte Spielspuren)</option>
                      <option value="LP">Light Played (sichtbare Abnutzung)</option>
                      <option value="PL">Played (gebraucht)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-ink-muted font-semibold mb-1">
                    Foto-URL deiner Karte (optional)
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://…"
                    className={cn(INPUT_BASE, "px-3 py-2.5 min-h-[44px]", orange.focus)}
                  />
                </div>

                <div>
                  <label className="block text-ink-muted font-semibold mb-1">
                    Nachricht an {listing.user.username}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="z. B. Karte liegt im Sleeve & Toploader, Versand per Einschreiben möglich."
                    className={cn(INPUT_BASE, "px-3 py-2 resize-none", orange.focus)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={cn("px-5 py-3 rounded-xl text-xs font-semibold min-h-[46px] cursor-pointer", BTN_SECONDARY)}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={cn(
                    "flex-1 py-3 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-colors min-h-[46px] cursor-pointer",
                    orange.solid,
                    orange.shadow
                  )}
                >
                  <Send className="w-4 h-4" />
                  <span>Angebot senden</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
}
