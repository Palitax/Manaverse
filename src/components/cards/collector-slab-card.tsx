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
      if (onTradeClick) {
        onTradeClick(card);
      } else {
        setTradeDrawerOpen(true);
      }
    } else if (card.type === "looking_for") {
      setBountyModalOpen(true);
    } else {
      setDetailModalOpen(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const slab = e.currentTarget;
    const r = slab.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    slab.style.setProperty('--rx', `${((y - r.height / 2) / (r.height / 2) * -15).toFixed(1)}deg`);
    slab.style.setProperty('--ry', `${((x - r.width / 2) / (r.width / 2) * 15).toFixed(1)}deg`);
    slab.style.setProperty('--px', `${((x / r.width) * 100).toFixed(1)}%`);
    slab.style.setProperty('--py', `${((y / r.height) * 100).toFixed(1)}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const slab = e.currentTarget;
    slab.style.setProperty('--rx', '0deg');
    slab.style.setProperty('--ry', '0deg');
    slab.style.setProperty('--px', '50%');
    slab.style.setProperty('--py', '50%');
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0]) return;
    const slab = e.currentTarget;
    const r = slab.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - r.left;
    const y = touch.clientY - r.top;
    if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
      slab.style.setProperty('--rx', `${((y - r.height / 2) / (r.height / 2) * -10).toFixed(1)}deg`);
      slab.style.setProperty('--ry', `${((x - r.width / 2) / (r.width / 2) * 10).toFixed(1)}deg`);
      slab.style.setProperty('--px', `${((x / r.width) * 100).toFixed(1)}%`);
      slab.style.setProperty('--py', `${((y / r.height) * 100).toFixed(1)}%`);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const slab = e.currentTarget;
    slab.style.setProperty('--rx', '0deg');
    slab.style.setProperty('--ry', '0deg');
    slab.style.setProperty('--px', '50%');
    slab.style.setProperty('--py', '50%');
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* ULTRA-CLEAN ACRYLIC DISPLAY SLAB COMPONENT                          */}
      {/* ==================================================================== */}
      <div className="acrylic-slab-container" style={{ perspective: "1200px" }}>
        <div
          onClick={() => setDetailModalOpen(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "acrylic-display-slab group cursor-pointer select-none",
            className
          )}
        >
          {/* Chamfered Bevel & Specular Glare */}
          <div className="slab-edge-bevel" />
          <div className="slab-glare-effect" />

          {/* Clean Header Plate */}
          <div className="slab-header-plate">
            <div className="plate-top-row">
              <span className="collection-tag">
                {card.type === "sell"
                  ? "SOFORTKAUF"
                  : card.type === "trade"
                  ? "1:1 TAUSCH"
                  : "KOPFGELD"}
              </span>
              <span className="foil-badge">
                {cond.label.toUpperCase()} • {languageFlag}
              </span>
            </div>
            <div className="plate-main-row">
              <div>
                <h4 className="card-name truncate" title={card.name}>
                  {card.name} {card.cardNumber ? `#${card.cardNumber}` : ""}
                </h4>
                <p className="set-info truncate">
                  {card.set || "Edition / Set"} {card.condition ? `• ${cond.label}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Recessed Card Well */}
          <div className="slab-card-window">
            {card.photos[0] ? (
              <img
                src={card.photos[0]}
                alt={card.name}
                className="card-img aspect-[2.5/3.5] object-contain"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[2.5/3.5] flex flex-col items-center justify-center text-neutral-400 gap-1.5 bg-black/60 rounded-lg">
                <mode.icon className="w-8 h-8 opacity-40 text-neutral-400" />
                <span className="text-[10px] font-medium text-neutral-400">Kein Foto</span>
              </div>
            )}
            <div className="holo-foil-layer" />

            {/* Quick Hover Inspect Lens */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 pointer-events-none z-20">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg">
                <Eye className="w-3.5 h-3.5" /> Details & Zoom
              </span>
            </div>

            {/* Video preview badge */}
            {card.videoUrl && (
              <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md p-1.5 rounded-full text-white border border-white/25 shadow-md z-20">
                <Play className="w-3 h-3 fill-current text-white" />
              </div>
            )}
          </div>

          {/* Value & Action Row */}
          <div className="mt-3.5 space-y-2.5 relative z-10">
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-between gap-2 shadow-inner">
              <div className="min-w-0">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold truncate">
                  {mode.valueLabel}
                </span>
                <span className={cn("text-base sm:text-lg font-black leading-tight truncate block", mode.valueColor)}>
                  {card.type === "sell" && card.price !== undefined
                    ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`
                    : card.type === "trade" && card.estimatedTradeValue
                    ? `~${card.estimatedTradeValue} €`
                    : card.type === "looking_for" && (card.priceRange || card.price)
                    ? card.priceRange || `${card.price} €`
                    : "VB"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleActionClick}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 min-h-[44px] cursor-pointer shadow-md flex-shrink-0",
                  mode.btnBg
                )}
              >
                <span>{mode.btnText}</span>
              </button>
            </div>

            {/* Trade Wants / VB note */}
            {card.type === "trade" && card.lookingForWants && (
              <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[10px] text-purple-200 backdrop-blur-sm">
                <span className="font-bold text-purple-300 block text-[9px] uppercase">Wants:</span>
                <p className="truncate text-white font-medium">{card.lookingForWants}</p>
              </div>
            )}

            {card.type === "sell" && card.allowOffers && (
              <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-300 font-bold inline-block">
                ✓ Preisvorschläge (VB) möglich
              </div>
            )}

            {/* Seller / Seeker footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5 min-w-0">
                <HoloAvatarFrame
                  avatarUrl={card.user.avatarUrl}
                  username={card.user.username}
                  role={card.user.role}
                  verified={card.user.verified}
                  size="sm"
                />
                <div className="leading-tight truncate">
                  <p className="font-bold text-white text-[11px] truncate max-w-[100px]">
                    {card.user.username}
                  </p>
                  <p className="text-[9px] text-neutral-400">
                    {card.user.dealsCount} Deals
                  </p>
                </div>
              </div>

              {card.user.discordUsername && (
                <span className="text-[9px] text-indigo-300 font-mono truncate max-w-[80px]">
                  @{card.user.discordUsername}
                </span>
              )}
            </div>
          </div>

          {/* Polished Bottom Acrylic Rim (Clean) */}
          <div className="slab-bottom-rim">
            <div className="rim-reflection" />
          </div>
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
