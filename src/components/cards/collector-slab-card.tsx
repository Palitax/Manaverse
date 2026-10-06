"use client";

import React, { useState } from "react";
import { CardListing, CardCondition } from "@/types";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import { BorderBeam } from "../magicui/border-beam";
import {
  Tag,
  ArrowLeftRight,
  Target,
  Sparkles,
  ShieldCheck,
  Scale,
  Eye,
  Play,
  CheckCircle2,
  ExternalLink,
  Zap,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TradeBalanceDrawer } from "./trade-balance-drawer";
import { BountyMatchModal } from "./bounty-match-modal";
import { useStore } from "@/lib/store";

interface CollectorSlabCardProps {
  card: CardListing;
  onTradeClick?: (card: CardListing) => void;
  className?: string;
}

export function CollectorSlabCard({
  card,
  onTradeClick,
  className,
}: CollectorSlabCardProps) {
  const { currentUser, createDeal, openAuthModal } = useStore();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [tradeDrawerOpen, setTradeDrawerOpen] = useState(false);
  const [bountyModalOpen, setBountyModalOpen] = useState(false);

  // Condition metadata (German & Stars)
  const conditionMeta: Record<
    CardCondition,
    { label: string; stars: string; badgeColor: string; desc: string }
  > = {
    NM: {
      label: "Near Mint",
      stars: "★★★★★",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      desc: "Makellos, wie frisch aus dem Booster",
    },
    EX: {
      label: "Excellent",
      stars: "★★★★☆",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      desc: "Minimale weiße Pünktchen an den Kanten",
    },
    GD: {
      label: "Good",
      stars: "★★★☆☆",
      badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
      desc: "Leichte sichtbare Spielspuren / Kratzer",
    },
    LP: {
      label: "Light Played",
      stars: "★★☆☆☆",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Deutliche Abnutzung an Kanten oder Ecken",
    },
    PL: {
      label: "Played",
      stars: "★☆☆☆☆",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      desc: "Stark bespielt, kleine Knicke möglich",
    },
    PO: {
      label: "Poor",
      stars: "☆☆☆☆☆",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      desc: "Stark beschädigt / Knicke / Risse",
    },
    Egal: {
      label: "Beliebig",
      stars: "—",
      badgeColor: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
      desc: "Jeder Zustand für die Sammlung akzeptabel",
    },
  };

  const cond = conditionMeta[card.condition] || conditionMeta.Egal;

  // Language flag helper
  const languageFlag =
    card.language === "DE"
      ? "🇩🇪 DE"
      : card.language === "EN"
      ? "🇬🇧 EN"
      : card.language === "JP"
      ? "🇯🇵 JP"
      : `${card.language}`;

  // Mode Theme Accents
  const modeStyles = {
    sell: {
      border: "border-emerald-500/35 hover:border-emerald-400/70",
      glow: "hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.35)]",
      ribbonBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-black",
      ribbonText: "🟢 SOFORTKAUF",
      valueLabel: "Kaufpreis",
      valueColor: "text-emerald-400",
      btnBg: "bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-lg shadow-emerald-500/20",
      btnText: "Kaufen / Bieten",
      icon: Tag,
    },
    trade: {
      border: "border-purple-500/40 hover:border-purple-400/80",
      glow: "hover:shadow-[0_15px_35px_-5px_rgba(168,85,247,0.35)]",
      ribbonBg: "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 text-white",
      ribbonText: "🟣 1:1 TAUSCH",
      valueLabel: "Tauschwert (ETV)",
      valueColor: "text-purple-400",
      btnBg: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold shadow-lg shadow-purple-600/25",
      btnText: "Tausch-Waage ⚖️",
      icon: ArrowLeftRight,
    },
    looking_for: {
      border: "border-cyan-500/40 hover:border-cyan-400/80",
      glow: "hover:shadow-[0_15px_35px_-5px_rgba(6,182,212,0.35)]",
      ribbonBg: "bg-gradient-to-r from-cyan-400 to-blue-600 text-black",
      ribbonText: "🔵 KOPFGELD",
      valueLabel: "Max. Budget",
      valueColor: "text-cyan-400",
      btnBg: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black shadow-lg shadow-cyan-500/25",
      btnText: "Habe ich! 🎯",
      icon: Target,
    },
  };

  const mode = modeStyles[card.type] || modeStyles.sell;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.type === "trade") {
      setTradeDrawerOpen(true);
    } else if (card.type === "looking_for") {
      setBountyModalOpen(true);
    } else {
      setDetailModalOpen(true);
    }
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* LUXURY COLLECTOR SLAB CARD                                          */}
      {/* ==================================================================== */}
      <div
        onClick={() => setDetailModalOpen(true)}
        className={cn(
          "group relative rounded-3xl p-3.5 sm:p-4 acrylic-slab-glass border transition-all duration-300",
          "cursor-pointer flex flex-col justify-between select-none",
          mode.border,
          mode.glow,
          className
        )}
      >
        {/* Holographic light reflection sheen across the entire slab on hover */}
        <div className="absolute inset-0 rounded-3xl holofoil-card-sheen opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 z-10" />

        {/* 1. SLAB HEADER: Graded-Slab Label with Micro Barcode & Details */}
        <div className="bg-[#090d18] rounded-2xl p-2.5 border border-white/10 mb-3 space-y-1 relative z-20 shadow-inner">
          <div className="flex items-center justify-between gap-1 text-[11px]">
            {/* Condition with Star Rating */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-extrabold text-[10px]",
                cond.badgeColor
              )}
              title={cond.desc}
            >
              <span>{cond.label}</span>
              <span className="text-[9px] tracking-tighter opacity-80">{cond.stars}</span>
            </div>

            {/* Language Flag & Code */}
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-black text-[10px] border border-white/15">
              {languageFlag}
            </span>
          </div>

          {/* Card Set & Number with Serial Barcode */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5 border-t border-white/5">
            <span className="truncate max-w-[140px] font-semibold text-neutral-300">
              {card.set || "Edition / Set"}
            </span>
            <span className="font-mono text-neutral-400 text-[9px]">
              {card.cardNumber ? `#${card.cardNumber}` : "PROMO"}
            </span>
          </div>
        </div>

        {/* 2. CARD ARTWORK WINDOW (3:4 ratio with high-tech bezel) */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/95 border border-white/15 shadow-2xl flex items-center justify-center p-2 mb-3.5 z-20 group/art">
          {card.photos[0] ? (
            <img
              src={card.photos[0]}
              alt={card.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-500 group-hover/art:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500 gap-1.5">
              <mode.icon className="w-8 h-8 opacity-40" />
              <span className="text-[10px] font-medium text-neutral-400">Kein Foto</span>
            </div>
          )}

          {/* Mode Ribbon at top-left corner */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md shadow-black/50 border border-white/20 flex items-center gap-1",
                mode.ribbonBg
              )}
            >
              {mode.ribbonText}
            </span>
          </div>

          {/* Video Preview Tag */}
          {card.videoUrl && (
            <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md p-1.5 rounded-full text-white border border-white/25 shadow-md">
              <Play className="w-3 h-3 fill-current text-white" />
            </div>
          )}

          {/* Quick Hover Inspect Lens */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/art:opacity-100 transition-opacity flex items-end justify-center p-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg">
              <Eye className="w-3.5 h-3.5" /> Details & Zoom
            </span>
          </div>
        </div>

        {/* 3. CARD TITLE & DETAILS */}
        <div className="space-y-1.5 mb-3.5 z-20">
          <h3
            className="text-sm sm:text-base font-black text-white truncate group-hover:text-indigo-300 transition-colors"
            title={card.name}
          >
            {card.name}
          </h3>

          {/* Trade Wants Chips (if type === trade) */}
          {card.type === "trade" && card.lookingForWants && (
            <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/25 text-[11px] text-purple-200">
              <span className="font-bold text-purple-300 text-[10px] uppercase block mb-0.5">
                Gesuchte Tauschobjekte (Wants):
              </span>
              <p className="truncate text-white font-medium">{card.lookingForWants}</p>
            </div>
          )}

          {/* Sell Offer Tag (if type === sell) */}
          {card.type === "sell" && (
            <div className="flex items-center gap-2 text-[10px]">
              {card.allowOffers ? (
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  ✓ Gegenangebote (VB) erlaubt
                </span>
              ) : (
                <span className="text-neutral-400 font-semibold bg-white/5 px-2 py-0.5 rounded-md">
                  Festpreis (Kein VB)
                </span>
              )}
            </div>
          )}

          {/* Want description (if type === looking_for) */}
          {card.type === "looking_for" && card.description && (
            <p className="text-[11px] text-neutral-300 line-clamp-1 italic bg-cyan-950/20 p-1.5 rounded-lg border border-cyan-500/20">
              "{card.description}"
            </p>
          )}
        </div>

        {/* 4. VALUE & ACTION BAR */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 z-20">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
              {mode.valueLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-lg sm:text-xl font-black", mode.valueColor)}>
                {card.type === "sell" && card.price !== undefined
                  ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`
                  : card.type === "trade" && card.estimatedTradeValue
                  ? `~${card.estimatedTradeValue} €`
                  : card.type === "looking_for" && (card.priceRange || card.price)
                  ? card.priceRange || `${card.price} €`
                  : "VB"}
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleActionClick}
            className={cn(
              "px-3.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 min-h-[44px] cursor-pointer",
              mode.btnBg
            )}
          >
            <span>{mode.btnText}</span>
          </button>
        </div>

        {/* 5. SELLER / SEEKER FOOTER */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400 z-20">
          <div className="flex items-center gap-2">
            <HoloAvatarFrame
              avatarUrl={card.user.avatarUrl}
              username={card.user.username}
              role={card.user.role}
              verified={card.user.verified}
              size="sm"
            />
            <div className="leading-tight">
              <p className="font-bold text-white text-xs truncate max-w-[110px]">
                {card.user.username}
              </p>
              <p className="text-[10px] text-neutral-400">
                {card.user.dealsCount} Deals
              </p>
            </div>
          </div>

          {card.user.discordUsername && (
            <span className="text-[10px] text-indigo-300 font-mono truncate max-w-[90px]">
              @{card.user.discordUsername}
            </span>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TRADE BALANCE DRAWER (for Trade Cards)                               */}
      {/* ==================================================================== */}
      <TradeBalanceDrawer
        listing={card}
        isOpen={tradeDrawerOpen}
        onClose={() => setTradeDrawerOpen(false)}
      />

      {/* ==================================================================== */}
      {/* BOUNTY MATCH MODAL (for Want Cards)                                  */}
      {/* ==================================================================== */}
      <BountyMatchModal
        listing={card}
        isOpen={bountyModalOpen}
        onClose={() => setBountyModalOpen(false)}
      />

      {/* ==================================================================== */}
      {/* DETAIL MODAL (Full inspection with gallery, description & deals)     */}
      {/* ==================================================================== */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-2xl">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center z-20"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column: Image Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-white/15 flex items-center justify-center p-3 shadow-2xl">
                  {card.photos[0] ? (
                    <img src={card.photos[0]} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-neutral-500">Kein Foto</span>
                  )}
                  <BorderBeam size={220} duration={8} />
                </div>
              </div>

              {/* Right Column: Information & Actions */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-xs font-black px-2.5 py-0.5 rounded-full border", cond.badgeColor)}>
                      {cond.label} ({card.condition})
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
                      Sprache: {languageFlag}
                    </span>
                    <span className={cn("text-xs font-black uppercase px-2 py-0.5 rounded-md", mode.ribbonBg)}>
                      {mode.ribbonText}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white">{card.name}</h2>
                  {card.set && (
                    <p className="text-xs text-neutral-400">
                      {card.set} {card.cardNumber && `• #${card.cardNumber}`}
                    </p>
                  )}

                  {/* Price / ETV Highlight Box */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider block font-bold">
                        {mode.valueLabel}
                      </span>
                      <span className={cn("text-2xl font-black", mode.valueColor)}>
                        {card.type === "sell" && card.price !== undefined
                          ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`
                          : card.type === "trade" && card.estimatedTradeValue
                          ? `~${card.estimatedTradeValue} €`
                          : card.priceRange || "VB"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-neutral-400 block font-semibold">Anbieter</span>
                      <span className="text-sm font-bold text-white">{card.user.username}</span>
                    </div>
                  </div>

                  {card.description && (
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                        Beschreibung
                      </h4>
                      <p className="text-xs text-neutral-200 bg-[#0c101a] p-3 rounded-xl border border-white/5 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  )}

                  {card.type === "trade" && card.lookingForWants && (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                      <span className="font-bold block text-purple-300 mb-0.5">
                        Gesuchte Karten (Wants):
                      </span>
                      {card.lookingForWants}
                    </div>
                  )}
                </div>

                {/* Bottom Trigger Actions */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {card.type === "trade" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDetailModalOpen(false);
                        setTradeDrawerOpen(true);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 min-h-[44px] cursor-pointer"
                    >
                      <Scale className="w-4 h-4" /> Tausch-Waage öffnen & Angebot abgeben
                    </button>
                  ) : card.type === "looking_for" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDetailModalOpen(false);
                        setBountyModalOpen(true);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 min-h-[44px] cursor-pointer"
                    >
                      <Target className="w-4 h-4 fill-black" /> Ich habe diese Karte (Angebot senden)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentUser) {
                          openAuthModal("register");
                          return;
                        }
                        createDeal(card, currentUser);
                        alert(`Kaufanfrage an ${card.user.username} gesendet!`);
                        setDetailModalOpen(false);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 min-h-[44px] cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-black" /> Kaufanfrage an {card.user.username} senden
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
