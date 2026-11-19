import {
  ShoppingBag,
  Tag,
  ArrowLeftRight,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { CardCondition, ListingType } from "@/types";

/**
 * ==============================================================================
 * MANAFORGE MODE-SYSTEM (siehe DESIGN.md › Semantic Color Tokens)
 * ==============================================================================
 * Jeder Marktplatz-Bereich besitzt exakt EINE Akzentfarbe, die sich durch
 * Navigation, Slab-Preis, Buttons, Modals und Formulare zieht:
 *
 *   Verkaufen  (eigene Vitrine & Erstellen)  → Smaragd   (emerald)
 *   Kaufen     (Sofortkauf-Inserate)         → Gold      (amber)
 *   Tauschen   (1:1 Tausch-Inserate)         → Violett   (violet)
 *   Gesucht    (Gesuche / Kopfgeld)          → Orange    (orange)
 *
 * Neutrale Zustände (eigene Karte, sekundäre Aktionen) laufen bewusst über
 * Hairline + Ink-Töne, damit sie mit jeder Akzentfarbe harmonieren.
 * Status-Farben (Erfolg = emerald, Warnung = amber, Fehler = rose) sind davon getrennt.
 */

export type ModeKey = "sell" | "buy" | "trade" | "want";

export interface ModeTheme {
  key: ModeKey;
  /** Bereichs-Name in der Navigation */
  label: string;
  /** Kurzes Typ-Label auf Karten & Badges */
  badge: string;
  icon: LucideIcon;
  /** Akzent-Text (Preise, Kennzahlen) */
  text: string;
  /** Dezenter Akzent-Text für Labels/Eyebrows */
  textSoft: string;
  /** Kleiner Status-Punkt */
  dot: string;
  /** Primärer, gefüllter CTA */
  solid: string;
  /** Sekundärer, getönter CTA bzw. Badge */
  soft: string;
  /** Akzent-Rahmen für Modals & aktive Elemente */
  border: string;
  /** Fokus-Rahmen für Eingabefelder */
  focus: string;
  /** Fortschrittsbalken / Akzentflächen */
  fill: string;
  /** Native Checkbox/Radio-Akzent */
  accent: string;
  /** Zarter Schatten für primäre CTAs */
  shadow: string;
}

export const MODE_THEME: Record<ModeKey, ModeTheme> = {
  sell: {
    key: "sell",
    label: "Verkaufen",
    badge: "Verkauf",
    icon: Tag,
    text: "text-emerald-300",
    textSoft: "text-emerald-300/80",
    dot: "bg-emerald-400",
    solid: "bg-emerald-400 hover:bg-emerald-300 text-black",
    soft: "bg-emerald-400/10 hover:bg-emerald-400/15 border-emerald-400/25 hover:border-emerald-400/40 text-emerald-200",
    border: "border-emerald-400/30",
    focus: "focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/30",
    fill: "bg-emerald-400",
    accent: "accent-emerald-400",
    shadow: "shadow-lg shadow-emerald-500/15",
  },
  buy: {
    key: "buy",
    label: "Kaufen",
    badge: "Sofortkauf",
    icon: ShoppingBag,
    text: "text-amber-300",
    textSoft: "text-amber-300/80",
    dot: "bg-amber-400",
    solid: "bg-amber-400 hover:bg-amber-300 text-black",
    soft: "bg-amber-400/10 hover:bg-amber-400/15 border-amber-400/25 hover:border-amber-400/40 text-amber-200",
    border: "border-amber-400/30",
    focus: "focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/30",
    fill: "bg-amber-400",
    accent: "accent-amber-400",
    shadow: "shadow-lg shadow-amber-500/15",
  },
  trade: {
    key: "trade",
    label: "Tauschen",
    badge: "Tausch",
    icon: ArrowLeftRight,
    text: "text-violet-300",
    textSoft: "text-violet-300/80",
    dot: "bg-violet-400",
    solid: "bg-violet-500 hover:bg-violet-400 text-white",
    soft: "bg-violet-400/10 hover:bg-violet-400/15 border-violet-400/25 hover:border-violet-400/40 text-violet-200",
    border: "border-violet-400/30",
    focus: "focus:border-violet-400/70 focus:ring-1 focus:ring-violet-400/30",
    fill: "bg-violet-400",
    accent: "accent-violet-400",
    shadow: "shadow-lg shadow-violet-500/20",
  },
  want: {
    key: "want",
    label: "Gesucht",
    badge: "Gesuch",
    icon: Target,
    text: "text-orange-300",
    textSoft: "text-orange-300/80",
    dot: "bg-orange-400",
    solid: "bg-orange-500 hover:bg-orange-400 text-white",
    soft: "bg-orange-400/10 hover:bg-orange-400/15 border-orange-400/25 hover:border-orange-400/40 text-orange-200",
    border: "border-orange-400/30",
    focus: "focus:border-orange-400/70 focus:ring-1 focus:ring-orange-400/30",
    fill: "bg-orange-400",
    accent: "accent-orange-400",
    shadow: "shadow-lg shadow-orange-500/20",
  },
};

/** Akzent eines Inserats, so wie es andere Sammler im Marktplatz sehen. */
export function listingTheme(type: ListingType): ModeTheme {
  if (type === "trade") return MODE_THEME.trade;
  if (type === "looking_for") return MODE_THEME.want;
  return MODE_THEME.buy;
}

/** Akzent des Erstellungs-Assistenten (Verkaufen = eigene Vitrine). */
export function studioTheme(type: ListingType): ModeTheme {
  if (type === "trade") return MODE_THEME.trade;
  if (type === "looking_for") return MODE_THEME.want;
  return MODE_THEME.sell;
}

export function listingTypeLabel(type: string): string {
  if (type === "trade") return "Tausch";
  if (type === "looking_for") return "Gesuch";
  if (type === "bulk") return "Ankauf";
  return "Verkauf";
}

/* ==============================================================================
   NEUTRALE KOMPONENTEN-TOKENS
   ============================================================================== */

/** Sekundärer Button auf dunklem Grund (Abbrechen, Zurück, Kontakt …) */
export const BTN_SECONDARY =
  "bg-white/[0.04] hover:bg-white/[0.08] border border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink transition-colors";

/** Standard-Eingabefeld */
export const INPUT_BASE =
  "w-full bg-surface-2 border border-hairline rounded-xl text-ink placeholder:text-ink-subtle outline-none transition-colors";

/** Icon-Schließen-Button für Modals (44×44 Touch-Target) */
export const BTN_CLOSE =
  "inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-hairline text-ink-muted hover:text-ink transition-colors cursor-pointer";

/** Modal-Overlay & Container */
export const MODAL_OVERLAY =
  "fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md";
export const MODAL_PANEL =
  "relative w-full max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface-1 border border-hairline-strong shadow-[0_30px_80px_rgba(0,0,0,0.85)]";

/* ==============================================================================
   KARTENZUSTÄNDE
   ============================================================================== */

export const CONDITION_LABELS: Record<CardCondition, string> = {
  Graded: "Graded",
  NM: "Near Mint",
  EX: "Excellent",
  GD: "Good",
  LP: "Light Played",
  PL: "Played",
  PO: "Poor",
  Egal: "Beliebig",
};

/** Verifizierter Sammler = manuell verifiziert oder mindestens 3 abgeschlossene Deals */
export function isVerifiedCollector(user?: { verified?: boolean; dealsCount?: number } | null): boolean {
  if (!user) return false;
  return Boolean(user.verified) || (user.dealsCount || 0) >= 3;
}

export function formatEuro(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "VB";
  return `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}
