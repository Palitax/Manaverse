"use client";

import React, { useState } from "react";
import { CardListing } from "@/types";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import {
  X,
  ArrowLeftRight,
  Scale,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Send,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MODE_THEME, BTN_SECONDARY, BTN_CLOSE, INPUT_BASE, MODAL_OVERLAY, MODAL_PANEL } from "@/lib/design-system";
import { Portal } from "@/components/ui/portal";
import { toast } from "@/components/ui/toast";

const violet = MODE_THEME.trade;

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
    color: "text-ink-subtle",
    bg: "bg-white/[0.03] border-hairline",
    icon: Scale,
  };

  if (currentOfferValue > 0) {
    if (Math.abs(percentDiff) <= 10) {
      balanceStatus = {
        text: `Ausgeglichener Tausch (±${Math.abs(Math.round(percentDiff))} %)`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/[0.06] border-emerald-500/30",
        icon: CheckCircle2,
      };
    } else if (diff < 0) {
      balanceStatus = {
        text: `Dein Angebot liegt ${Math.abs(Math.round(diff))} € unter dem Tauschwert`,
        color: "text-amber-400",
        bg: "bg-amber-500/[0.06] border-amber-500/30",
        icon: AlertTriangle,
      };
    } else {
      balanceStatus = {
        text: `Großzügiges Angebot (+${Math.round(diff)} € über Tauschwert)`,
        color: "text-violet-300",
        bg: "bg-violet-500/[0.06] border-violet-500/30",
        icon: TrendingUp,
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
      toast.error("Bitte gib an, welche Karte(n) du zum Tausch anbietest.");
      return;
    }

    if (listing.userId === currentUser.id) {
      toast.info("Das ist dein eigenes Tausch-Inserat.");
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
    <Portal>
      <div onClick={onClose} className={cn(MODAL_OVERLAY, "overlay-fade")}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(MODAL_PANEL, "max-w-3xl p-5 sm:p-7 panel-rise")}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", violet.soft)}>
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className={cn("text-[10px] font-bold uppercase tracking-[0.16em] block", violet.textSoft)}>
                  Tausch-Waage
                </span>
                <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                  Fairen Tausch vorschlagen
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
              <h3 className="text-2xl font-black text-ink tracking-tight">Tauschangebot übermittelt</h3>
              <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
                Dein Angebot wurde an <b className="text-ink">{listing.user.username}</b> gesendet und erscheint dort unter „Eingehende Angebote“.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendOffer} className="space-y-6 pt-5 text-xs">
              {/* 1. Gegenüberstellung */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                {/* Zielkarte */}
                <div className={cn("p-4 rounded-2xl bg-surface-2 border space-y-3", violet.border)}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", violet.textSoft)}>
                      Zielkarte
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <HoloAvatarFrame
                        avatarUrl={listing.user.avatarUrl}
                        username={listing.user.username}
                        role={listing.user.role}
                        verified={listing.user.verified}
                        size="sm"
                      />
                      <span className="font-semibold text-ink truncate max-w-[110px]">
                        {listing.user.username}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-28 rounded-xl bg-black border border-hairline overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {listing.photos[0] ? (
                        <img src={listing.photos[0]} alt={listing.name} className="w-full h-full object-contain" />
                      ) : (
                        <ArrowLeftRight className="w-5 h-5 text-ink-subtle" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-ink text-sm line-clamp-2">{listing.name}</h4>
                      <p className="text-[11px] text-ink-subtle">
                        {listing.condition} · {listing.language}
                      </p>
                      <div className="pt-1">
                        <span className="text-[10px] text-ink-subtle block">Tauschwert (ETV)</span>
                        <span className={cn("text-base font-black tabular-nums", violet.text)}>
                          {targetETV > 0 ? `~${targetETV} €` : "VB"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {listing.lookingForWants && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-hairline text-[11px] text-ink-muted">
                      <span className="font-bold block text-ink-subtle text-[10px] uppercase tracking-[0.12em] mb-0.5">Sucht im Tausch</span>
                      {listing.lookingForWants}
                    </div>
                  )}
                </div>

                {/* Swap Icon */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-3 border border-hairline-strong text-ink items-center justify-center z-20 shadow-lg">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>

                {/* Dein Angebot */}
                <div className="p-4 rounded-2xl bg-surface-2 border border-hairline space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                      Dein Gegenangebot
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-28 rounded-xl bg-black border border-hairline overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {offeredImage ? (
                        <img src={offeredImage} alt="Dein Angebot" className="w-full h-full object-contain" />
                      ) : (
                        <Upload className="w-5 h-5 text-ink-subtle" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-bold text-ink text-sm truncate">
                        {offeredDescription || "Wähle deine Karte …"}
                      </p>
                      <div className="pt-1">
                        <span className="text-[10px] text-ink-subtle block">Dein Schätzwert</span>
                        <span className="text-base font-black text-ink tabular-nums">
                          {currentOfferValue > 0 ? `~${currentOfferValue} €` : "– €"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {myCards.length > 0 && (
                    <div>
                      <label className="block text-[10px] text-ink-subtle font-semibold mb-1">
                        Aus deinen Inseraten wählen
                      </label>
                      <select
                        value={selectedMyCardId}
                        onChange={(e) => handleSelectMyCard(e.target.value)}
                        className={cn(INPUT_BASE, "px-3 py-2 text-xs min-h-[44px] cursor-pointer", violet.focus)}
                      >
                        <option value="">Eigene Karte auswählen</option>
                        {myCards.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.condition} · {c.estimatedTradeValue || c.price || 0} €)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Balance */}
              <div className={cn("p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors", balanceStatus.bg)}>
                <div className="flex items-center gap-2 min-w-0">
                  <balanceStatus.icon className={cn("w-5 h-5 flex-shrink-0", balanceStatus.color)} />
                  <span className={cn("font-bold text-xs sm:text-sm", balanceStatus.color)}>
                    {balanceStatus.text}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-ink-subtle block">Differenz</span>
                  <span className={cn("font-black text-xs sm:text-sm tabular-nums", diff >= 0 ? "text-emerald-400" : "text-amber-400")}>
                    {diff > 0 ? `+${diff} €` : `${diff} €`}
                  </span>
                </div>
              </div>

              {/* 3. Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-ink-muted font-semibold mb-1">
                    Beschreibung deines Tauschangebots *
                  </label>
                  <input
                    type="text"
                    required
                    value={offeredDescription}
                    onChange={(e) => setOfferedDescription(e.target.value)}
                    placeholder="z. B. Glurak VMAX Secret Rare (NM, Deutsch) + 20 € Ausgleich"
                    className={cn(INPUT_BASE, "px-3 py-2.5 min-h-[44px]", violet.focus)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-muted font-semibold mb-1">
                      Geschätzter Wert deiner Karte (€) *
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      required
                      min="1"
                      value={offeredValue}
                      onChange={(e) => setOfferedValue(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="z. B. 120"
                      className={cn(INPUT_BASE, "px-3 py-2.5 min-h-[44px] tabular-nums", violet.focus)}
                    />
                  </div>

                  <div>
                    <label className="block text-ink-muted font-semibold mb-1">
                      Foto-URL deiner Karte (optional)
                    </label>
                    <input
                      type="url"
                      value={offeredImage}
                      onChange={(e) => setOfferedImage(e.target.value)}
                      placeholder="https://…"
                      className={cn(INPUT_BASE, "px-3 py-2.5 min-h-[44px]", violet.focus)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink-muted font-semibold mb-1">
                    Nachricht an {listing.user.username} (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={tradeMessage}
                    onChange={(e) => setTradeMessage(e.target.value)}
                    placeholder="Ein paar Worte zu deinem Angebot …"
                    className={cn(INPUT_BASE, "px-3 py-2 resize-none", violet.focus)}
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
                    violet.solid,
                    violet.shadow
                  )}
                >
                  <Send className="w-4 h-4" />
                  <span>Tauschangebot senden</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
}
