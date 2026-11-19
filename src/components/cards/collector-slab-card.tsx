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
import { listingTheme, formatEuro, BTN_SECONDARY, BTN_CLOSE, INPUT_BASE, MODAL_OVERLAY, MODAL_PANEL } from "@/lib/design-system";
import { LanguageTag, getLanguageCode } from "@/components/ui/language-tag";
import { Portal } from "@/components/ui/portal";
import { toast } from "@/components/ui/toast";
import { Check, Copy, UserRound } from "lucide-react";

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

  // Sprachcode (typografisch, ohne Emoji-Flaggen)
  const languageCode = getLanguageCode(card.language);

  // Einheitliches Mode-System: Kaufen = Gold, Tauschen = Violett, Gesucht = Orange
  const theme = listingTheme(card.type);
  const mode = {
    icon: theme.icon,
    badge: theme.badge,
    valueLabel:
      card.type === "trade" ? "Tauschwert (ETV)" : card.type === "looking_for" ? "Max. Budget" : "Kaufpreis",
    valueColor: theme.text,
    btnBg: cn(theme.solid, "font-black", theme.shadow),
    btnText: card.type === "trade" ? "Tauschen" : card.type === "looking_for" ? "Habe ich" : "Kaufen",
    btnIcon: card.type === "trade" ? Scale : card.type === "looking_for" ? Target : Zap,
  };

  const displayValue =
    card.type === "sell" && card.price !== undefined
      ? formatEuro(card.price)
      : card.type === "trade" && card.estimatedTradeValue
      ? `~${card.estimatedTradeValue} €`
      : card.type === "looking_for" && (card.priceRange || card.price)
      ? card.priceRange || formatEuro(card.price)
      : "VB";

  const copyDiscordName = async () => {
    if (!seller.discordUsername) return;
    try {
      await navigator.clipboard.writeText(seller.discordUsername);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
    } catch {
      toast.error("Kopieren nicht möglich", "Bitte markiere den Discord-Namen manuell.");
    }
  };

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
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider truncate flex-shrink-0">
                    Verkauft
                  </span>
                )}
                {card.status === "draft" && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-dashed border-slate-400 text-[9px] font-black uppercase tracking-wider truncate flex-shrink-0">
                    Entwurf
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="foil-badge font-bold tracking-wide flex-shrink-0">
                  {cond.label.toUpperCase()} · {languageCode}
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
                  <span className="text-[9px] text-neutral-400 uppercase tracking-[0.12em] block font-bold truncate">
                    {mode.valueLabel}
                  </span>
                )}
                <span className={cn(
                  "text-base sm:text-lg font-black leading-tight truncate block tabular-nums",
                  card.status === "sold" ? "text-neutral-500 line-through" : mode.valueColor
                )}>
                  {displayValue}
                </span>
              </div>

              {card.status === "sold" ? (
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/[0.04] text-ink-muted border border-hairline flex items-center gap-1 select-none flex-shrink-0"
                  title="Diese Karte ist verkauft"
                >
                  <span>Verkauft</span>
                </div>
              ) : card.status === "draft" ? (
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/[0.04] text-ink-muted border border-dashed border-hairline-strong flex items-center gap-1 select-none flex-shrink-0"
                  title="Entwurf - noch nicht aktiv gelistet"
                >
                  <span>Entwurf</span>
                </div>
              ) : isOwnCard ? (
                <div
                  className="flex items-center gap-1.5 text-[11px] font-bold text-ink py-1 px-2.5 rounded-full bg-white/[0.06] border border-hairline-strong flex-shrink-0"
                  title="Dies ist dein eigenes Inserat"
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", theme.dot)} />
                  <span>Deine Karte</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5 min-h-[38px] cursor-pointer flex-shrink-0",
                    mode.btnBg
                  )}
                >
                  <mode.btnIcon className="w-3.5 h-3.5" />
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
                      if (!currentUser) {
                        openAuthModal("login");
                        return;
                      }
                      setOfferAmount(card.price ? String(Math.round(card.price * 0.9)) : "");
                      setOfferModalOpen(true);
                    }}
                    className={cn(
                      "w-full py-1.5 px-3 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] cursor-pointer min-h-[34px]",
                      theme.soft
                    )}
                  >
                    <Tag className="w-3 h-3" />
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
                  className={cn(
                    "w-full py-1.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer min-h-[34px]",
                    BTN_SECONDARY
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
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
                <div className={cn("p-2 rounded-lg border text-[10px]", theme.soft)}>
                  <span className="font-bold block text-[9px] uppercase tracking-[0.12em] opacity-80">Sucht im Tausch</span>
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
                        copyDiscordName();
                      }}
                      title="Discord-Namen kopieren"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[30px] rounded-full bg-discord/10 hover:bg-discord/20 border border-discord/30 text-[#aab4f5] hover:text-white text-[10px] font-mono transition-colors cursor-pointer active:scale-95"
                    >
                      <svg className="w-3 h-3 fill-current flex-shrink-0 text-discord" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.077.077 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.127c-.598.35-1.22.648-1.873.891a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span>@{seller.discordUsername}</span>
                      {copiedDiscord ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Owner Actions Mini Bar if isOwnCard */}
              {isOwnCard && (
                <div className="pt-2 flex items-center gap-1.5 text-[11px]">
                  {card.status === "sold" || card.status === "draft" ? (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await updateListingStatus(card.id, "active");
                        toast.success(
                          card.status === "draft" ? "Inserat veröffentlicht" : "Inserat wieder aktiv",
                          "Deine Karte ist jetzt im Marktplatz sichtbar."
                        );
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl border font-bold transition-colors text-center min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer",
                        theme.soft
                      )}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {card.status === "draft" ? "Veröffentlichen" : "Wieder aktivieren"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await updateListingStatus(card.id, "sold");
                        toast.success("Als verkauft markiert", "Die Karte wird nicht mehr im Marktplatz angezeigt.");
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl font-bold text-center min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]",
                        BTN_SECONDARY
                      )}
                    >
                      <Tag className="w-3.5 h-3.5" /> Als verkauft markieren
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
        <Portal>
          <div onClick={() => setDetailModalOpen(false)} className={cn(MODAL_OVERLAY, "overlay-fade")}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={cn(MODAL_PANEL, "max-w-3xl p-5 sm:p-8 panel-rise")}
            >
              <button
                type="button"
                aria-label="Details schließen"
                onClick={() => setDetailModalOpen(false)}
                className={cn(BTN_CLOSE, "absolute top-4 right-4 z-20")}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column: Image */}
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-hairline flex items-center justify-center p-3">
                    {card.photos[0] ? (
                      <img src={card.photos[0]} alt={slabTitle.fullLabel} className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-ink-subtle">
                        <mode.icon className="w-8 h-8 opacity-50" />
                        <span className="text-xs">Kein Foto</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Information & Actions */}
                <div className="flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    {/* Eyebrow: Typ · Zustand · Sprache */}
                    <div className="flex flex-wrap items-center gap-2 pr-12">
                      <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded-md border", theme.soft)}>
                        <mode.icon className="w-3 h-3" />
                        {mode.badge}
                      </span>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md border", cond.badgeColor)}>
                        {cond.label}
                      </span>
                      <LanguageTag lang={card.language} showLabel />
                    </div>

                    <button
                      type="button"
                      onClick={() => slabTitle.canToggle && setShowOriginalTitle((prev) => !prev)}
                      className={cn("text-left block", slabTitle.canToggle ? "cursor-pointer group/title" : "cursor-default")}
                      title={slabTitle.canToggle ? "Zwischen übersetztem und originalem Namen wechseln" : undefined}
                    >
                      <h2 className="text-2xl sm:text-3xl font-black text-ink leading-tight tracking-tight break-words">
                        {slabTitle.cleanName} {slabTitle.cleanCode}
                      </h2>
                      {slabTitle.canToggle && (
                        <span className="text-xs text-ink-subtle flex items-center gap-1 mt-1.5 group-hover/title:text-ink transition-colors">
                          <ArrowLeftRight className="w-3 h-3" />
                          {showOriginalTitle ? "Übersetzten Namen anzeigen" : "Original-Schreibweise anzeigen"}
                        </span>
                      )}
                    </button>
                    {card.set && (
                      <p className="text-xs text-ink-subtle -mt-2">
                        {card.set} {slabTitle.cleanCode && `· ${slabTitle.cleanCode}`}
                      </p>
                    )}

                    {/* Preis / Wert */}
                    <div className="p-4 rounded-2xl bg-surface-2 border border-hairline flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-ink-subtle uppercase tracking-[0.14em] block font-bold mb-0.5">
                          {mode.valueLabel}
                        </span>
                        <span className={cn("text-2xl font-black tabular-nums", mode.valueColor)}>
                          {displayValue}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="text-right min-w-0">
                          <span className="text-[10px] text-ink-subtle block font-semibold">
                            {card.type === "looking_for" ? "Gesucht von" : "Anbieter"}
                          </span>
                          <span className="text-sm font-bold text-ink truncate block max-w-[140px]">{seller.username}</span>
                        </div>
                        <HoloAvatarFrame
                          avatarUrl={seller.avatarUrl}
                          username={seller.username}
                          role={seller.role}
                          verified={seller.verified}
                          size="sm"
                        />
                      </div>
                    </div>

                    {card.description && (
                      <div>
                        <h4 className="text-[10px] font-bold text-ink-subtle uppercase tracking-[0.14em] mb-1.5">
                          Beschreibung
                        </h4>
                        <p className="text-xs text-ink-muted bg-surface-2 p-3 rounded-xl border border-hairline leading-relaxed whitespace-pre-line">
                          {card.description}
                        </p>
                      </div>
                    )}

                    {card.type === "trade" && card.lookingForWants && (
                      <div className={cn("p-3 rounded-xl border text-xs", theme.soft)}>
                        <span className="font-bold block mb-0.5 text-[10px] uppercase tracking-[0.14em] opacity-80">
                          Sucht im Tausch
                        </span>
                        <span className="text-ink">{card.lookingForWants}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Trigger Actions */}
                  <div className="pt-4 border-t border-hairline space-y-2">
                    {isOwnCard ? (
                      <div className="p-4 rounded-2xl bg-surface-2 border border-hairline space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-ink">
                          <UserRound className="w-4 h-4 text-ink-muted" />
                          <span>Dein eigenes Inserat</span>
                          {card.status === "sold" && (
                            <span className="ml-auto px-2 py-0.5 rounded-md bg-white/[0.06] text-ink-muted border border-hairline text-[10px] uppercase tracking-wider">
                              Verkauft
                            </span>
                          )}
                          {card.status === "draft" && (
                            <span className="ml-auto px-2 py-0.5 rounded-md bg-white/[0.04] text-ink-muted border border-dashed border-hairline-strong text-[10px] uppercase tracking-wider">
                              Entwurf
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-subtle leading-relaxed">
                          {card.status === "sold"
                            ? "Diese Karte ist als verkauft markiert und nicht mehr im Marktplatz aktiv."
                            : card.status === "draft"
                            ? "Dieser Entwurf ist nur für dich in deinem Profil sichtbar."
                            : "Dieses Inserat ist online und für alle Sammler im Marktplatz sichtbar."}
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
                          {card.status === "sold" || card.status === "draft" ? (
                            <button
                              type="button"
                              onClick={async () => {
                                await updateListingStatus(card.id, "active");
                                toast.success(
                                  card.status === "draft" ? "Inserat veröffentlicht" : "Inserat wieder aktiv",
                                  "Deine Karte ist jetzt im Marktplatz sichtbar."
                                );
                              }}
                              className={cn(
                                "w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px] cursor-pointer",
                                theme.solid
                              )}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              {card.status === "draft" ? "Jetzt veröffentlichen" : "Wieder aktiv listen"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={async () => {
                                await updateListingStatus(card.id, "sold");
                                toast.success("Als verkauft markiert");
                              }}
                              className={cn(
                                "w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer",
                                BTN_SECONDARY
                              )}
                            >
                              <Tag className="w-4 h-4" /> Als verkauft markieren
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setDetailModalOpen(false);
                              setDeleteModalOpen(true);
                            }}
                            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" /> Löschen
                          </button>
                        </div>
                      </div>
                    ) : card.type === "trade" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDetailModalOpen(false);
                          setTradeDrawerOpen(true);
                        }}
                        className={cn(
                          "w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 min-h-[48px] cursor-pointer transition-colors",
                          theme.solid,
                          theme.shadow
                        )}
                      >
                        <Scale className="w-4 h-4" /> Tausch-Waage öffnen
                      </button>
                    ) : card.type === "looking_for" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDetailModalOpen(false);
                          setBountyModalOpen(true);
                        }}
                        className={cn(
                          "w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 min-h-[48px] cursor-pointer transition-colors",
                          theme.solid,
                          theme.shadow
                        )}
                      >
                        <Target className="w-4 h-4" /> Ich habe diese Karte
                      </button>
                    ) : card.status === "sold" ? (
                      <div className="p-3 rounded-xl bg-surface-2 border border-hairline text-center text-xs text-ink-muted">
                        Diese Karte wurde bereits verkauft.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!currentUser) {
                              openAuthModal("register");
                              return;
                            }
                            await createDeal(card, currentUser);
                            toast.success(
                              `Kaufanfrage an ${seller.username} gesendet`,
                              "Du findest den Deal in deinem Profil unter „Transaktionen & Deals“."
                            );
                            setDetailModalOpen(false);
                          }}
                          className={cn(
                            "w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 min-h-[48px] cursor-pointer transition-colors",
                            theme.solid,
                            theme.shadow
                          )}
                        >
                          <Zap className="w-4 h-4" /> Kaufanfrage senden
                        </button>

                        <div className={cn("grid gap-2", card.allowOffers ? "grid-cols-2" : "grid-cols-1")}>
                          {card.allowOffers && (
                            <button
                              type="button"
                              onClick={() => {
                                if (!currentUser) {
                                  openAuthModal("login");
                                  return;
                                }
                                setDetailModalOpen(false);
                                setOfferAmount(card.price ? String(Math.round(card.price * 0.9)) : "");
                                setOfferModalOpen(true);
                              }}
                              className={cn(
                                "w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors min-h-[44px] cursor-pointer",
                                theme.soft
                              )}
                            >
                              <Tag className="w-4 h-4" />
                              <span>Preisvorschlag</span>
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
                            className={cn(
                              "w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer",
                              BTN_SECONDARY
                            )}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Kontaktieren</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ==================================================================== */}
      {/* CONTACT SELLER MODAL (Discord-Direktkontakt)                         */}
      {/* ==================================================================== */}
      {contactModalOpen && (
        <Portal>
          <div className={cn(MODAL_OVERLAY, "overlay-fade")} onClick={() => setContactModalOpen(false)}>
            <div
              className={cn(MODAL_PANEL, "max-w-md p-6 sm:p-7 space-y-5 panel-rise")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-subtle block">
                    Direktkontakt
                  </span>
                  <h3 className="text-lg font-black text-ink tracking-tight">
                    {seller.username} kontaktieren
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Schließen"
                  onClick={() => setContactModalOpen(false)}
                  className={BTN_CLOSE}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Card Reference */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2 border border-hairline">
                {card.photos[0] && (
                  <img
                    src={card.photos[0]}
                    alt={slabTitle.fullLabel}
                    className="w-12 h-16 object-contain rounded-lg flex-shrink-0 bg-black/40"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ink truncate">{slabTitle.fullLabel}</p>
                  <p className="text-[11px] text-ink-subtle mt-0.5">
                    {mode.valueLabel}: <span className={cn("font-bold", theme.text)}>{displayValue}</span>
                  </p>
                </div>
              </div>

              {seller.discordUsername && card.showDiscordName !== false ? (
                <>
                  <div className="p-3 rounded-xl bg-discord/10 border border-discord/30 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] text-ink-subtle font-bold block">Discord</span>
                      <span className="text-xs font-mono text-ink truncate block">@{seller.discordUsername}</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyDiscordName}
                      className="px-3 min-h-[36px] rounded-lg bg-discord/20 hover:bg-discord/30 text-white text-[11px] font-bold transition-colors active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {copiedDiscord ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedDiscord ? "Kopiert" : "Kopieren"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-muted mb-1.5">
                      Deine Nachricht (Vorlage)
                    </label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={`Hallo ${seller.username}, ich interessiere mich für deine Karte „${slabTitle.cleanName}“ auf Manaforge. Ist sie noch verfügbar?`}
                      className={cn(INPUT_BASE, "p-3 text-xs focus:border-hairline-strong")}
                    />
                    <p className="text-[11px] text-ink-subtle mt-1.5">
                      Wir kopieren deine Nachricht in die Zwischenablage und öffnen Discord – füge sie dort im Direktchat ein.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setContactModalOpen(false)}
                      className={cn("px-4 py-3 rounded-xl font-bold text-xs min-h-[44px] cursor-pointer", BTN_SECONDARY)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      disabled={isSendingContact}
                      onClick={async () => {
                        setIsSendingContact(true);
                        const text =
                          contactMessage.trim() ||
                          `Hallo ${seller.username}, ich interessiere mich für deine Karte „${slabTitle.cleanName}“ auf Manaforge. Ist sie noch verfügbar?`;
                        try {
                          await navigator.clipboard.writeText(text);
                        } catch {
                          // Zwischenablage nicht verfügbar – Discord trotzdem öffnen
                        }
                        window.open("https://discord.com/channels/@me", "_blank", "noopener,noreferrer");
                        toast.success(
                          "Nachricht kopiert",
                          `Suche in Discord nach @${seller.discordUsername} und füge die Nachricht ein.`
                        );
                        setIsSendingContact(false);
                        setContactModalOpen(false);
                        setContactMessage("");
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-discord hover:bg-[#4752c4] text-white font-black text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px] cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kopieren & Discord öffnen</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-2 border border-hairline text-xs text-ink-muted leading-relaxed">
                    {seller.username} hat keinen Discord-Namen freigegeben. Sende stattdessen eine unverbindliche
                    Kaufanfrage – {seller.username} sieht sie direkt in den eigenen Deals.
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!currentUser) {
                        openAuthModal("login");
                        return;
                      }
                      await createDeal(card, currentUser);
                      toast.success(`Anfrage an ${seller.username} gesendet`);
                      setContactModalOpen(false);
                    }}
                    className={cn(
                      "w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 min-h-[44px] cursor-pointer transition-colors",
                      theme.solid
                    )}
                  >
                    <Zap className="w-4 h-4" /> Kaufanfrage senden
                  </button>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}

      {/* ==================================================================== */}
      {/* OFFER MODAL ("Angebot machen" / Preisvorschlag senden)              */}
      {/* ==================================================================== */}
      {offerModalOpen && (
        <Portal>
          <div className={cn(MODAL_OVERLAY, "overlay-fade")} onClick={() => setOfferModalOpen(false)}>
            <div
              className={cn(MODAL_PANEL, "max-w-md p-6 sm:p-7 space-y-5 panel-rise")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className={cn("text-[10px] font-bold uppercase tracking-[0.16em] block", theme.textSoft)}>
                    Preisvorschlag
                  </span>
                  <h3 className="text-lg font-black text-ink tracking-tight truncate">
                    {slabTitle.fullLabel}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Schließen"
                  onClick={() => setOfferModalOpen(false)}
                  className={BTN_CLOSE}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2 border border-hairline">
                {card.photos[0] && (
                  <img
                    src={card.photos[0]}
                    alt={slabTitle.fullLabel}
                    className="w-12 h-16 object-contain rounded-lg flex-shrink-0 bg-black/40"
                  />
                )}
                <div className="min-w-0 flex-1 text-[11px] text-ink-subtle space-y-0.5">
                  <p>
                    Kaufpreis: <span className={cn("font-bold", theme.text)}>{displayValue}</span>
                  </p>
                  <p>
                    Verkäufer: <span className="text-ink font-medium">{seller.username}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted mb-1.5">
                  Dein Preisvorschlag *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="1"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="z. B. 85"
                    className={cn(INPUT_BASE, "px-4 py-3 pr-10 text-base font-bold tabular-nums", theme.focus)}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle font-bold">€</span>
                </div>
                {card.price !== undefined && offerAmount && Number(offerAmount) > 0 && (
                  <p className="text-[11px] text-ink-subtle mt-1.5">
                    {Math.round((Number(offerAmount) / card.price) * 100)} % des Kaufpreises
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted mb-1.5">
                  Nachricht an {seller.username} (optional)
                </label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="z. B. Schnelle Abwicklung heute möglich …"
                  className={cn(INPUT_BASE, "p-3 text-xs", theme.focus)}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className={cn("px-4 py-3 rounded-xl font-bold text-xs min-h-[44px] cursor-pointer", BTN_SECONDARY)}
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
                      await createDeal({ ...card, price: amount }, currentUser);
                      toast.success(
                        `Preisvorschlag über ${formatEuro(amount)} gesendet`,
                        `${seller.username} sieht dein Angebot in den eigenen Deals.`
                      );
                      setOfferModalOpen(false);
                      setOfferMessage("");
                    } catch (err) {
                      console.error("Fehler beim Senden des Angebots:", err);
                      toast.error("Preisvorschlag konnte nicht gesendet werden");
                    } finally {
                      setIsSendingOffer(false);
                    }
                  }}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                    theme.solid
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingOffer ? "Wird gesendet …" : "Angebot senden"}</span>
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ==================================================================== */}
      {/* HOLD-TO-CONFIRM DELETE MODAL (Smooth fill, confirmation animation)   */}
      {/* ==================================================================== */}
      {deleteModalOpen && (
        <Portal>
          <div
            onClick={(e) => {
              e.stopPropagation();
              cancelDeleteHold();
              setDeleteModalOpen(false);
            }}
            className={cn(MODAL_OVERLAY, "overlay-fade")}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                MODAL_PANEL,
                "max-w-md p-6 sm:p-7 overflow-hidden transition-all duration-300 panel-rise",
                isDeleting ? "scale-95 opacity-0 translate-y-2" : "scale-100 opacity-100"
              )}
            >
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-black text-ink leading-snug tracking-tight">
                    Inserat endgültig entfernen?
                  </h3>
                  <p className="text-xs text-ink-subtle max-w-sm mx-auto leading-relaxed">
                    <strong className="text-ink-muted font-semibold">{card.name}</strong> wird dauerhaft aus dem
                    Marktplatz gelöscht. Das kann nicht rückgängig gemacht werden.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2 border border-hairline text-left">
                  {card.photos[0] ? (
                    <img
                      src={card.photos[0]}
                      alt={card.name}
                      className="w-12 h-16 object-contain rounded-lg flex-shrink-0 bg-black/40"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <mode.icon className="w-5 h-5 text-ink-subtle" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-sm text-ink truncate">{slabTitle.fullLabel}</p>
                    <p className="text-[11px] text-ink-subtle truncate">{card.set || "Edition"} · {cond.label}</p>
                    <p className={cn("text-xs font-bold mt-0.5 tabular-nums", theme.text)}>{displayValue}</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div
                    onMouseDown={startDeleteHold}
                    onMouseUp={cancelDeleteHold}
                    onMouseLeave={cancelDeleteHold}
                    onTouchStart={startDeleteHold}
                    onTouchEnd={cancelDeleteHold}
                    onTouchCancel={cancelDeleteHold}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "relative overflow-hidden w-full min-h-[52px] rounded-2xl border border-rose-500/35 bg-black/60 flex items-center justify-center select-none cursor-pointer active:scale-[0.99] transition-all",
                      isDeletedSuccess && "border-emerald-500/50 bg-emerald-950/60"
                    )}
                  >
                    {!isDeletedSuccess && (
                      <div
                        className="absolute inset-y-0 left-0 bg-rose-600 transition-[width] ease-linear pointer-events-none"
                        style={{ width: `${deleteHoldProgress}%` }}
                      />
                    )}

                    <div className="relative z-10 font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 px-4">
                      {isDeletedSuccess ? (
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm font-black">Gelöscht</span>
                        </div>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
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
                    className={cn("w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer min-h-[44px]", BTN_SECONDARY)}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
