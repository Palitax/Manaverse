"use client";

import React, { useState, useRef, useEffect } from "react";
import { CardListing, CardCondition } from "@/types";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import { BorderBeam } from "../magicui/border-beam";
import {
  Tag,
  ArrowLeftRight,
  Target,
  ShieldCheck,
  Scale,
  Eye,
  Play,
  CheckCircle2,
  ExternalLink,
  Zap,
  Info,
  DollarSign,
  Send,
  Calendar,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TradeBalanceDrawer } from "./trade-balance-drawer";
import { BountyMatchModal } from "./bounty-match-modal";
import { VerificationShield } from "../profile/verification-shield";
import { resolveCardTitles, formatSlabTitle } from "@/lib/pokemon-names";
import { SlabTopSigil } from "./slab-top-sigil";
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
  const { currentUser, users, createDeal, openAuthModal, deleteListing, updateListingStatus } = useStore();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [tradeDrawerOpen, setTradeDrawerOpen] = useState(false);
  const [bountyModalOpen, setBountyModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState<string>("");
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  // Collapsible bottom drawer state (default collapsed per user requirement)
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(true);

  // Multilingual original title toggle (shows kana/hangul/hanzi or German/English)
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);

  // Hold-to-Delete Modal State (Progress fill, no countdown, confirmation animation)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteHoldProgress, setDeleteHoldProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number | null>(null);

  const startDeleteHold = () => {
    if (isDeletedSuccess) return;
    holdStartRef.current = Date.now();
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      if (!holdStartRef.current) return;
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(100, (elapsed / 1800) * 100);
      setDeleteHoldProgress(progress);
      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        holdStartRef.current = null;
        setIsDeletedSuccess(true);
        setTimeout(() => {
          setIsDeleting(true);
          setTimeout(() => {
            deleteListing(card.id);
            setDeleteModalOpen(false);
            setIsDeleting(false);
            setIsDeletedSuccess(false);
            setDeleteHoldProgress(0);
          }, 300);
        }, 700);
      }
    }, 25);
  };

  const cancelDeleteHold = () => {
    if (isDeletedSuccess) return;
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdStartRef.current = null;
    setDeleteHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Global Escape key listener to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (contactModalOpen) setContactModalOpen(false);
        if (offerModalOpen) setOfferModalOpen(false);
        if (deleteModalOpen) {
          cancelDeleteHold();
          setDeleteModalOpen(false);
        }
        if (detailModalOpen) setDetailModalOpen(false);
        if (tradeDrawerOpen) setTradeDrawerOpen(false);
        if (bountyModalOpen) setBountyModalOpen(false);
      }
    };
    if (
      detailModalOpen ||
      offerModalOpen ||
      contactModalOpen ||
      deleteModalOpen ||
      tradeDrawerOpen ||
      bountyModalOpen
    ) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    detailModalOpen,
    offerModalOpen,
    contactModalOpen,
    deleteModalOpen,
    tradeDrawerOpen,
    bountyModalOpen,
  ]);

  // Dynamic seller profile synchronization (live updates across app)
  const seller = React.useMemo(() => {
    if (
      currentUser &&
      (card.userId === currentUser.id ||
        card.user?.id === currentUser.id ||
        (currentUser.username && card.user?.username?.toLowerCase() === currentUser.username.toLowerCase()))
    ) {
      return {
        ...card.user,
        ...currentUser,
      };
    }
    const matched = users?.find(
      (u) =>
        u.id === card.userId ||
        u.id === card.user?.id ||
        (card.user?.username && u.username.toLowerCase() === card.user.username.toLowerCase())
    );
    if (matched) {
      return {
        ...card.user,
        ...matched,
      };
    }
    return card.user;
  }, [card.user, card.userId, currentUser, users]);

  // Is this card owned by the logged-in user?
  const isOwnCard = Boolean(
    currentUser &&
      (card.userId === currentUser.id ||
        card.user?.id === currentUser.id ||
        (currentUser.username && card.user?.username?.toLowerCase() === currentUser.username.toLowerCase()))
  );

  // Clean, concise slab title strictly showing card name and code (e.g. "Nachtara VMAX #215/203")
  const slabTitle = formatSlabTitle(card.name, card.language, card.cardNumber, showOriginalTitle);

  // Formatted listing date for the slab label
  const listingDate = card.createdAt
    ? new Date(card.createdAt).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  // Condition metadata (German & Stars)
  const conditionMeta: Record<
    CardCondition,
    { label: string; stars: string; badgeColor: string; desc: string }
  > = {
    Graded: {
      label: "Graded",
      stars: "★★★★★",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "Professionell bewertet & gekapselt",
    },
    NM: {
      label: "Near Mint",
      stars: "★★★★★",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      desc: "Wie frisch aus dem Booster gesleevt",
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

  // Language flag helper strictly matching card.language
  const langKey = (card.language || "DE").toUpperCase();
  const flagMap: Record<string, string> = {
    DE: "🇩🇪 DE",
    EN: "🇬🇧 EN",
    JP: "🇯🇵 JP",
    FR: "🇫🇷 FR",
    ES: "🇪🇸 ES",
    IT: "🇮🇹 IT",
    CN: "🇨🇳 CN",
    KR: "🇰🇷 KR",
  };
  const languageFlag = flagMap[langKey] || `${langKey}`;

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
      btnText: "Kaufen",
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

  return (
    <>
      {/* ==================================================================== */}
      {/* ULTRA-CLEAN ACRYLIC DISPLAY SLAB COMPONENT (STABLE, NO HOVER WOBBLE) */}
      {/* ==================================================================== */}
      <div className="acrylic-slab-container">
        <div
          onClick={() => setDetailModalOpen(true)}
          className={cn(
            "acrylic-display-slab group cursor-pointer select-none transition-shadow duration-300",
            className
          )}
        >
          {/* Chamfered Bevel & Specular Glare */}
          <div className="slab-edge-bevel" />
          <div className="slab-glare-effect" />

          {/* Clean Header Plate */}
          <div className="slab-header-plate">
            <div className="plate-top-row">
              <div className="flex items-center gap-1.5 min-w-0">
                {/* Calendar Icon with Hover Tooltip */}
                <div className="relative group/date inline-flex items-center flex-shrink-0">
                  <div
                    className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-help min-h-[28px] min-w-[28px] flex items-center justify-center"
                    title={`Eingestellt am ${listingDate}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute left-0 top-full mt-1 hidden group-hover/date:flex items-center px-2 py-1 rounded-md bg-slate-900 text-white text-[10px] font-semibold whitespace-nowrap shadow-xl z-30 pointer-events-none">
                    Eingestellt am {listingDate}
                  </div>
                </div>

                {/* Status Badges for Sold or Draft */}
                {card.status === "sold" && (
                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-600 text-[9px] font-black uppercase tracking-wider truncate flex-shrink-0">
                    Verkauft
                  </span>
                )}
                {card.status === "draft" && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 border border-amber-500/40 text-[9px] font-black uppercase tracking-wider truncate flex-shrink-0">
                    Entwurf
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="foil-badge font-bold tracking-wide flex-shrink-0">
                  {cond.label.toUpperCase()} • {languageFlag}
                </span>

                {/* Owner Delete Button: Black X */}
                {isOwnCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDeleteModalOpen(true);
                    }}
                    title="Karte vom Marktplatz entfernen"
                    className="w-5 h-5 rounded-full bg-black/10 hover:bg-black/25 active:scale-90 border border-black/20 flex items-center justify-center text-black transition-all cursor-pointer shadow-sm min-h-[22px] min-w-[22px]"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            <div className="plate-main-row">
              <div className="w-full">
                <h4
                  onClick={(e) => {
                    if (slabTitle.canToggle) {
                      e.stopPropagation();
                      setShowOriginalTitle((prev) => !prev);
                    }
                  }}
                  className={cn(
                    "card-name text-[13px] leading-snug font-extrabold text-[#0f172a] truncate",
                    slabTitle.canToggle && "cursor-pointer hover:text-indigo-800 transition-colors"
                  )}
                  title={slabTitle.canToggle ? "Klicken, um zwischen übersetztem und originalem Namen zu wechseln" : slabTitle.fullLabel}
                >
                  {slabTitle.fullLabel}
                </h4>
                <p className="set-info text-[10px] text-slate-500 mt-0.5 truncate">
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
              <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/75 px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg">
                <Eye className="w-3.5 h-3.5" /> Details & Zoom
              </span>
            </div>

            {/* Video preview badge */}
            {card.videoUrl && (
              <div className="absolute top-2.5 right-2.5 bg-black/90 p-1.5 rounded-full text-white border border-white/25 shadow-md z-20">
                <Play className="w-3 h-3 fill-current text-white" />
              </div>
            )}
          </div>

          {/* Value & Action Row */}
          <div className="mt-3.5 space-y-2 relative z-10">
            <div className="p-2.5 rounded-xl bg-black/75 border border-white/10 flex items-center justify-between gap-2 shadow-inner">
              <div className="min-w-0">
                {card.type !== "sell" && (
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold truncate">
                    {mode.valueLabel}
                  </span>
                )}
                <span className={cn(
                  "text-base sm:text-lg font-black leading-tight truncate block",
                  card.status === "sold" ? "text-neutral-500 line-through" : mode.valueColor
                )}>
                  {card.type === "sell" && card.price !== undefined
                    ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`
                    : card.type === "trade" && card.estimatedTradeValue
                    ? `~${card.estimatedTradeValue} €`
                    : card.type === "looking_for" && (card.priceRange || card.price)
                    ? card.priceRange || `${card.price} €`
                    : "VB"}
                </span>
              </div>

              {card.status === "sold" ? (
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-neutral-800 text-neutral-300 border border-neutral-600 flex items-center gap-1 select-none flex-shrink-0"
                  title="Diese Karte ist verkauft"
                >
                  <span>Verkauft</span>
                </div>
              ) : card.status === "draft" ? (
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 select-none flex-shrink-0"
                  title="Entwurf - noch nicht aktiv gelistet"
                >
                  <span>Entwurf</span>
                </div>
              ) : isOwnCard ? (
                <div
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400/90 py-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex-shrink-0"
                  title="Dies ist deine eigene angebotene Karte"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Deine Karte</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 min-h-[38px] cursor-pointer shadow-md flex-shrink-0",
                    mode.btnBg
                  )}
                >
                  <span>{mode.btnText}</span>
                </button>
              )}
            </div>

            {/* Quick Action Buttons under the price box for sell cards */}
            {card.type === "sell" && !isOwnCard && card.status !== "sold" && (
              <div className="space-y-1.5 pt-0.5">
                {/* Slim full-width "Angebot machen" button for sell cards when allowOffers is true */}
                {card.allowOffers && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOfferAmount(card.price ? String(Math.round(card.price * 0.9)) : "");
                      setOfferModalOpen(true);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 hover:text-emerald-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm min-h-[32px]"
                  >
                    <Tag className="w-3 h-3 text-emerald-400" />
                    <span>Angebot machen</span>
                  </button>
                )}

                {/* Slim compact "Verkäufer kontaktieren" button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentUser) {
                      openAuthModal("login");
                      return;
                    }
                    setContactModalOpen(true);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-neutral-200 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm min-h-[32px]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Verkäufer kontaktieren</span>
                </button>
              </div>
            )}

            {/* Centered Animated Manaforge Sigil Trigger (Always animated, rotates on click to expand/collapse) */}
            <div className="flex flex-col items-center justify-center pt-2 pb-0.5">
              <SlabTopSigil
                interactive
                isExpanded={!isBottomCollapsed}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsBottomCollapsed((prev) => !prev);
                }}
              />
            </div>

            {/* Collapsible Lower Section (Snaps animated under the price row) */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-out space-y-2.5",
                isBottomCollapsed
                  ? "max-h-0 opacity-0 pointer-events-none mt-0 pt-0"
                  : "max-h-[380px] opacity-100 mt-1 pt-2 border-t border-white/10"
              )}
            >
              {/* Trade Wants note */}
              {card.type === "trade" && card.lookingForWants && (
                <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-200">
                  <span className="font-bold text-purple-300 block text-[9px] uppercase">Wants:</span>
                  <p className="truncate text-white font-medium">{card.lookingForWants}</p>
                </div>
              )}

              {/* Seller / Seeker footer with generous frame spacing, full username, Trusted shield & deals */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <HoloAvatarFrame
                      avatarUrl={seller.avatarUrl}
                      username={seller.username}
                      role={seller.role}
                      verified={seller.verified}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white text-[12px] leading-tight break-words">
                        {seller.username}
                      </span>
                      <VerificationShield
                        dealsCount={seller.dealsCount || 0}
                        size="sm"
                        className="inline-flex flex-shrink-0"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                      <span className="font-semibold text-neutral-300">
                        {seller.dealsCount || 0} {seller.dealsCount === 1 ? "Deal" : "Deals"}
                      </span>
                    </div>
                  </div>
                </div>

                {card.showDiscordName !== false && seller.discordUsername && (
                  <div className="flex items-center justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(seller.discordUsername!);
                        setCopiedDiscord(true);
                        setTimeout(() => setCopiedDiscord(false), 2000);
                      }}
                      title="Klicken zum Kopieren des Discord-Namen"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 text-[#8ea1e1] hover:text-white text-[10px] font-mono transition-all cursor-pointer group/discord active:scale-95"
                    >
                      <svg className="w-3 h-3 fill-current flex-shrink-0 text-[#5865F2]" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.077.077 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.127c-.598.35-1.22.648-1.873.891a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span>@{seller.discordUsername}</span>
                      <span className="text-[9px] text-indigo-300 font-sans ml-1">
                        {copiedDiscord ? "✓ Kopiert!" : ""}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Owner Actions Mini Bar if isOwnCard */}
              {isOwnCard && (
                <div className="pt-2 flex items-center gap-1.5 text-[10px]">
                  {card.status === "sold" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateListingStatus(card.id, "active");
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all text-center min-h-[34px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Wieder aktivieren
                    </button>
                  ) : card.status === "draft" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateListingStatus(card.id, "active");
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all text-center min-h-[34px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Veröffentlichen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateListingStatus(card.id, "sold");
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 font-bold transition-all text-center min-h-[36px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                    >
                      <Tag className="w-3.5 h-3.5 text-white" /> Als verkauft markieren
                    </button>
                  )}
                </div>
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
        <div
          onClick={() => setDetailModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel bg-[#0c101c] p-6 sm:p-8 border border-white/20 shadow-2xl"
          >
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

                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOriginalTitle((prev) => !prev)}
                      className={cn(
                        "text-left group/title",
                        slabTitle.canToggle && "cursor-pointer"
                      )}
                      title={slabTitle.canToggle ? "Klicken, um zwischen übersetztem und originalem Namen zu wechseln" : undefined}
                    >
                      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight break-words group-hover/title:text-amber-300 transition-colors">
                        {slabTitle.cleanName} {slabTitle.cleanCode}
                      </h2>
                      {slabTitle.canToggle && (
                        <span className="text-xs text-neutral-400 flex items-center gap-1 mt-1 group-hover/title:text-amber-400 transition-colors">
                          <ArrowLeftRight className="w-3 h-3" />
                          {showOriginalTitle ? "Übersetzten Namen anzeigen" : "Original-Schreibweise anzeigen"}
                        </span>
                      )}
                    </button>
                  </div>
                  {card.set && (
                    <p className="text-xs text-neutral-400">
                      {card.set} {slabTitle.cleanCode && `• ${slabTitle.cleanCode}`}
                    </p>
                  )}

                  {/* Price / ETV Highlight Box */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      {card.type !== "sell" && (
                        <span className="text-xs text-neutral-400 uppercase tracking-wider block font-bold">
                          {mode.valueLabel}
                        </span>
                      )}
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
                      <span className="text-sm font-bold text-white">{seller.username}</span>
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
                  ) : isOwnCard ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Deine eigene Karte</span>
                        {card.status === "sold" && (
                          <span className="ml-1.5 px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-600 text-[10px]">
                            VERKAUFT
                          </span>
                        )}
                        {card.status === "draft" && (
                          <span className="ml-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                            ENTWURF
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {card.status === "sold"
                          ? "Diese Karte ist als verkauft markiert und nicht mehr im öffentlichen Marktplatz aktiv."
                          : card.status === "draft"
                          ? "Dieser Entwurf ist nur für dich in deinem Profil sichtbar."
                          : "Dieses Inserat ist in deiner Vitrine online und für andere Sammler im Marktplatz gelistet."}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        {card.status === "sold" ? (
                          <button
                            type="button"
                            onClick={() => {
                              updateListingStatus(card.id, "active");
                              alert("Karte wieder als aktiv markiert!");
                            }}
                            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Wieder aktiv listen
                          </button>
                        ) : card.status === "draft" ? (
                          <button
                            type="button"
                            onClick={() => {
                              updateListingStatus(card.id, "active");
                              alert("Entwurf erfolgreich veröffentlicht!");
                            }}
                            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Jetzt veröffentlichen
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              updateListingStatus(card.id, "sold");
                            }}
                            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                          >
                            <Tag className="w-4 h-4 text-white" /> Als verkauft markieren
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setDetailModalOpen(false);
                            setDeleteModalOpen(true);
                          }}
                          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Inserat löschen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            openAuthModal("register");
                            return;
                          }
                          createDeal(card, currentUser);
                          alert(`Kaufanfrage an ${seller.username} gesendet!`);
                          setDetailModalOpen(false);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 min-h-[44px] cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-black" /> Kaufanfrage an {seller.username} senden
                      </button>

                      {card.allowOffers && (
                        <button
                          type="button"
                          onClick={() => {
                            setDetailModalOpen(false);
                            setOfferAmount(card.price ? String(Math.round(card.price * 0.9)) : "");
                            setOfferModalOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all min-h-[44px] cursor-pointer"
                        >
                          <Tag className="w-4 h-4 text-emerald-400" />
                          <span>Preisvorschlag (Angebot) einreichen</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setDetailModalOpen(false);
                          if (!currentUser) {
                            openAuthModal("login");
                            return;
                          }
                          setContactModalOpen(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-all min-h-[44px] cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-sky-400" />
                        <span>Verkäufer kontaktieren (Nachricht schreiben)</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CONTACT SELLER MODAL ("Verkäufer kontaktieren" / Chat-Bubble)         */}
      {/* ==================================================================== */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl glass-panel bg-[#0c101c] p-6 sm:p-7 border border-sky-500/30 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  Direktnachricht
                </span>
                <h3 className="text-lg font-black text-white">
                  Verkäufer kontaktieren
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Card Reference & Seller */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                {card.photos[0] && (
                  <img
                    src={card.photos[0]}
                    alt={slabTitle.fullLabel}
                    className="w-12 h-16 object-contain rounded-lg flex-shrink-0 bg-black/40"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{slabTitle.fullLabel}</p>
                  <p className="text-[10px] text-neutral-400">
                    Preis:{" "}
                    <span className="text-emerald-400 font-bold">
                      {card.price !== undefined ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €` : "VB"}
                    </span>
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Verkäufer: <span className="text-white font-medium">{seller.username}</span>
                  </p>
                </div>
              </div>

              {/* Discord copy quick pill if available */}
              {card.showDiscordName !== false && seller.discordUsername && (
                <div className="p-2.5 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-neutral-300 font-bold">Discord:</span>
                    <span className="text-xs font-mono text-white truncate">@{seller.discordUsername}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(seller.discordUsername!);
                      setCopiedDiscord(true);
                      setTimeout(() => setCopiedDiscord(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-white text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedDiscord ? "✓ Kopiert!" : "Kopieren"}
                  </button>
                </div>
              )}

              {/* Message field */}
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                  Deine Nachricht an {seller.username} *
                </label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder={`Hallo ${seller.username}, ich interessiere mich für deine Karte "${slabTitle.cleanName}". Hast du Zeit für eine kurze Absprache?`}
                  className="w-full bg-[#111624] border border-white/15 focus:border-sky-500 rounded-xl p-3 text-white text-xs placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 font-bold text-xs min-h-[44px] cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  disabled={!contactMessage.trim() || isSendingContact}
                  onClick={async () => {
                    if (!currentUser) {
                      openAuthModal("login");
                      return;
                    }
                    setIsSendingContact(true);
                    try {
                      await createDeal(
                        {
                          ...card,
                          description: `Nachricht von ${currentUser.username}: ${contactMessage.trim()}`,
                        },
                        currentUser
                      );
                      alert(`Deine Nachricht wurde erfolgreich an ${seller.username} übermittelt!`);
                      setContactModalOpen(false);
                      setContactMessage("");
                    } catch (err) {
                      console.error("Fehler beim Senden der Nachricht:", err);
                      alert("Fehler beim Senden der Nachricht.");
                    } finally {
                      setIsSendingContact(false);
                    }
                  }}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all min-h-[44px] cursor-pointer",
                    (!contactMessage.trim() || isSendingContact) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingContact ? "Wird gesendet..." : "Nachricht senden"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* OFFER MODAL ("Angebot machen" / Preisvorschlag senden)              */}
      {/* ==================================================================== */}
      {offerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150"
          onClick={() => setOfferModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl glass-panel bg-[#0c101c] p-6 sm:p-7 border border-emerald-500/30 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Preisvorschlag einreichen
                </span>
                <h3 className="text-lg font-black text-white">
                  Angebot für {slabTitle.fullLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOfferModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Card Reference */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                {card.photos[0] && (
                  <img
                    src={card.photos[0]}
                    alt={slabTitle.fullLabel}
                    className="w-12 h-16 object-contain rounded-lg flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{slabTitle.fullLabel}</p>
                  <p className="text-[10px] text-neutral-400">
                    Regulärer Kaufpreis:{" "}
                    <span className="text-emerald-400 font-bold">
                      {card.price !== undefined ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €` : "VB"}
                    </span>
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Verkäufer: <span className="text-white font-medium">{seller.username}</span>
                  </p>
                </div>
              </div>

              {/* Offer Amount Input */}
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                  Dein Preisvorschlag (€) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="z. B. 85"
                    className="w-full bg-[#111624] border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-base font-bold placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
                    €
                  </span>
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                  Nachricht an {card.user.username} (optional)
                </label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="z. B. Schnelle Abwicklung heute möglich..."
                  className="w-full bg-[#111624] border border-white/15 focus:border-emerald-500 rounded-xl p-3 text-white text-xs placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 font-bold text-xs min-h-[44px] cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  disabled={!offerAmount || Number(offerAmount) <= 0 || isSendingOffer}
                  onClick={async () => {
                    if (!currentUser) {
                      openAuthModal("register");
                      return;
                    }
                    setIsSendingOffer(true);
                    try {
                      const amount = Number(offerAmount);
                      await createDeal(
                        {
                          ...card,
                          price: amount,
                        },
                        currentUser
                      );
                      alert(
                        `Dein Preisvorschlag über ${amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € wurde erfolgreich an ${card.user.username} übermittelt!`
                      );
                      setOfferModalOpen(false);
                      setOfferMessage("");
                    } catch (err) {
                      console.error("Fehler beim Senden des Angebots:", err);
                      alert("Fehler beim Senden des Preisvorschlags.");
                    } finally {
                      setIsSendingOffer(false);
                    }
                  }}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all min-h-[44px] cursor-pointer",
                    (!offerAmount || Number(offerAmount) <= 0 || isSendingOffer) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingOffer ? "Wird gesendet..." : "Angebot verbindlich senden"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* HOLD-TO-CONFIRM DELETE MODAL (Smooth fill, confirmation animation)   */}
      {/* ==================================================================== */}
      {deleteModalOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            cancelDeleteHold();
            setDeleteModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "max-w-md w-full rounded-3xl bg-[#0c101c] border border-rose-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300",
              isDeleting ? "scale-90 opacity-0 -translate-y-4" : "scale-100 opacity-100"
            )}
          >
            {/* Top red accent glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                <Trash2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  Hey, möchtest du deine Karte wirklich vom Marktplatz entfernen?
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Dein Inserat für <strong className="text-neutral-200 font-semibold">{card.name}</strong> wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
              </div>

              {/* Compact Card Reference */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/60 border border-white/10 text-left">
                {card.photos[0] ? (
                  <img
                    src={card.photos[0]}
                    alt={card.name}
                    className="w-12 h-16 object-contain rounded-lg flex-shrink-0 bg-black/40"
                  />
                ) : (
                  <div className="w-12 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-neutral-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-sm text-white truncate">{slabTitle.fullLabel}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{card.set || "Edition"} • {cond.label}</p>
                  <p className="text-xs font-bold text-rose-300 mt-0.5">
                    {card.price !== undefined ? `${card.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €` : "VB"}
                  </p>
                </div>
              </div>

              {/* Hold to Delete Button (fills from left to right) */}
              <div className="space-y-2.5 pt-1">
                <div
                  onMouseDown={startDeleteHold}
                  onMouseUp={cancelDeleteHold}
                  onMouseLeave={cancelDeleteHold}
                  onTouchStart={startDeleteHold}
                  onTouchEnd={cancelDeleteHold}
                  onTouchCancel={cancelDeleteHold}
                  className={cn(
                    "relative overflow-hidden w-full min-h-[52px] rounded-2xl border border-rose-500/40 bg-neutral-950 flex items-center justify-center select-none cursor-pointer active:scale-[0.99] transition-all shadow-lg shadow-rose-950/50",
                    isDeletedSuccess && "border-emerald-500/60 bg-emerald-950/80 scale-[1.02]"
                  )}
                >
                  {/* Progress bar fill (red from left to right) */}
                  {!isDeletedSuccess && (
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-600 to-red-600 transition-[width] ease-linear pointer-events-none"
                      style={{ width: `${deleteHoldProgress}%` }}
                    />
                  )}

                  {/* Button text / Confirmation Animation */}
                  <div className="relative z-10 font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 px-4 transition-all">
                    {isDeletedSuccess ? (
                      <div className="flex items-center gap-2 text-emerald-300 animate-in zoom-in-95 duration-200">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                        <span className="text-sm font-black">Erfolgreich gelöscht!</span>
                      </div>
                    ) : (
                      <>
                        <Trash2 className={cn("w-4 h-4 text-white", deleteHoldProgress > 0 && "animate-pulse")} />
                        <span>Gedrückt halten zum Löschen</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isDeletedSuccess}
                  onClick={() => {
                    cancelDeleteHold();
                    setDeleteModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer min-h-[44px]"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
