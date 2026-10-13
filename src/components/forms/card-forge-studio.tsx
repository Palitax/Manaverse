"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ListingType,
  CardLanguage,
  CardCondition,
  PokemonApiCard,
} from "@/types";
import { useStore } from "@/lib/store";
import { PokemonSearchInput } from "./pokemon-search-input";
import { resolveCardTitles, formatSlabTitle } from "@/lib/pokemon-names";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Tag,
  ArrowLeftRight,
  Target,
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Video,
  Info,
  DollarSign,
  Scale,
  Zap,
  Layers,
  Sliders,
  Check,
  RefreshCw,
  Search,
  Calendar,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SlabTopSigil } from "../cards/slab-top-sigil";

// 1-Click Quick Picks for instant test delight
const QUICK_PRESETS = [
  {
    name: "Glurak ex (Special Illustration Rare)",
    set: "151 (MEW)",
    number: "199/165",
    condition: "NM" as CardCondition,
    language: "DE" as CardLanguage,
    price: 185,
    estimatedTradeValue: 190,
    priceRange: "170 - 200 €",
    photo: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
    wants: "Gengar VMAX Alt Art, Rayquaza VMAX",
  },
  {
    name: "Pikachu with Grey Felt Hat",
    set: "SVP Black Star Promos",
    number: "085",
    condition: "NM" as CardCondition,
    language: "EN" as CardLanguage,
    price: 95,
    estimatedTradeValue: 100,
    priceRange: "85 - 110 €",
    photo: "https://images.pokemontcg.io/svp/85_hires.png",
    wants: "Vintage WotC Holos, Mario Pikachu",
  },
  {
    name: "Umbreon VMAX (Moonbreon Alternate Art)",
    set: "Evolving Skies",
    number: "215/203",
    condition: "NM" as CardCondition,
    language: "EN" as CardLanguage,
    price: 780,
    estimatedTradeValue: 800,
    priceRange: "700 - 850 €",
    photo: "https://images.pokemontcg.io/swsh7/215_hires.png",
    wants: "Giratina V Alt Art, Latias & Latios GX Alt",
  },
  {
    name: "Gengar VMAX (Alternate Art)",
    set: "Fusion Strike",
    number: "271/264",
    condition: "EX" as CardCondition,
    language: "DE" as CardLanguage,
    price: 240,
    estimatedTradeValue: 250,
    priceRange: "220 - 260 €",
    photo: "https://images.pokemontcg.io/swsh8/271_hires.png",
    wants: "Mew VMAX Alt Art, Glurak V Alt",
  },
];

const CONDITIONS: {
  value: CardCondition;
  label: string;
  gradeLabel: string;
  gradeScore: string;
  stars: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "NM",
    label: "Near Mint",
    gradeLabel: "GEM-MT 10",
    gradeScore: "10.0",
    stars: "★★★★★",
    desc: "Makellos, wie frisch aus dem Booster gesleevt",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/50 text-emerald-300",
  },
  {
    value: "EX",
    label: "Excellent",
    gradeLabel: "MINT 9",
    gradeScore: "9.0",
    stars: "★★★★☆",
    desc: "Minimale weiße Pünktchen an den Kanten",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-300",
  },
  {
    value: "GD",
    label: "Good",
    gradeLabel: "NEAR-MT 7",
    gradeScore: "7.0",
    stars: "★★★☆☆",
    desc: "Leichte sichtbare Spielspuren oder Kratzer",
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-300",
  },
  {
    value: "LP",
    label: "Light Played",
    gradeLabel: "EX-MT 5",
    gradeScore: "5.0",
    stars: "★★☆☆☆",
    desc: "Deutliche weiße Kanten oder leichte Trübung",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-300",
  },
  {
    value: "PL",
    label: "Played",
    gradeLabel: "VG 3",
    gradeScore: "3.0",
    stars: "★☆☆☆☆",
    desc: "Stark bespielt, kleine Knicke oder Eckenabrieb",
    color: "from-orange-500/20 to-rose-500/20 border-orange-500/50 text-orange-300",
  },
  {
    value: "PO",
    label: "Poor",
    gradeLabel: "POOR 1",
    gradeScore: "1.0",
    stars: "☆☆☆☆☆",
    desc: "Stark beschädigt, deutliche Knicke oder Risse",
    color: "from-rose-500/20 to-red-500/20 border-rose-500/50 text-rose-300",
  },
  {
    value: "Egal",
    label: "Beliebig",
    gradeLabel: "AUTHENTIC",
    gradeScore: "ANY",
    stars: "—",
    desc: "Jeder Zustand ist für die Sammlung willkommen",
    color: "from-white/10 to-neutral-500/10 border-white/20 text-neutral-300",
  },
];

const LANGUAGES: { value: CardLanguage; label: string; flag: string }[] = [
  { value: "DE", label: "Deutsch", flag: "🇩🇪" },
  { value: "EN", label: "Englisch", flag: "🇬🇧" },
  { value: "JP", label: "Japanisch", flag: "🇯🇵" },
  { value: "Egal", label: "Beliebig", flag: "🌐" },
  { value: "OTHER", label: "Sonstige", flag: "🌍" },
];

const QUICK_BUDGETS = ["15 €", "35 €", "65 €", "120 €", "250 €", "VB", "Marktwert"];

interface CardForgeStudioProps {
  initialType?: ListingType;
  mode?: "page" | "inline";
  onSuccess?: (createdId?: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function CardForgeStudio({
  initialType = "sell",
  mode = "page",
  onSuccess,
  onCancel,
  className,
}: CardForgeStudioProps) {
  const { addListing, currentUser, openAuthModal } = useStore();

  // Form State
  const [type, setType] = useState<ListingType>(initialType);

  useEffect(() => {
    if (initialType) {
      setType(initialType);
    }
  }, [initialType]);
  const [name, setName] = useState("");
  const [setNameText, setSetNameText] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [language, setLanguage] = useState<CardLanguage>("DE");
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [photos, setPhotos] = useState<string[]>([""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [priceRange, setPriceRange] = useState("");
  const [estimatedTradeValue, setEstimatedTradeValue] = useState<number | string>("");
  const [lookingForWants, setLookingForWants] = useState("");
  const [allowOffers, setAllowOffers] = useState(true);
  const [postToDiscord, setPostToDiscord] = useState(true);
  const [showDiscordName, setShowDiscordName] = useState(true);

  // UX State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [mobileStep, setMobileStep] = useState<number>(1);
  const [showManualFields, setShowManualFields] = useState(false);

  // Sync initial type when changed
  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const activeCondition =
    CONDITIONS.find((c) => c.value === condition) || CONDITIONS[0];
  const activeLanguage =
    LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  const handleSelectApiCard = (card: PokemonApiCard) => {
    setName(card.name);
    setSetNameText(card.set.name);
    if (card.number) setCardNumber(card.number);
    if (card.images?.large) {
      setPhotos([card.images.large]);
    }
  };

  const handleApplyPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setName(preset.name);
    setSetNameText(preset.set);
    setCardNumber(preset.number);
    setCondition(preset.condition);
    setLanguage(preset.language);
    setPhotos([preset.photo]);
    if (type === "sell") {
      setPrice(preset.price);
    } else if (type === "trade") {
      setEstimatedTradeValue(preset.estimatedTradeValue);
      setLookingForWants(preset.wants);
    } else {
      setPriceRange(preset.priceRange);
    }
  };

  const handleAddPhotoSlot = () => {
    if (photos.length < 5) {
      setPhotos([...photos, ""]);
    }
  };

  const handleUpdatePhoto = (index: number, val: string) => {
    const updated = [...photos];
    updated[index] = val;
    setPhotos(updated);
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length === 1) {
      setPhotos([""]);
    } else {
      setPhotos(photos.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e?: React.FormEvent, isDraft: boolean = false) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    if (!currentUser) {
      openAuthModal("register");
      return;
    }

    setIsSubmitting(true);
    const validPhotos = photos.filter((p) => p.trim() !== "");

    try {
      await addListing({
        type,
        name: name.trim(),
        set: setNameText.trim() || undefined,
        cardNumber: cardNumber.trim() || undefined,
        language,
        condition,
        photos: validPhotos,
        videoUrl: videoUrl.trim() || undefined,
        description: description.trim(),
        price: type === "sell" && price !== "" ? Number(price) : undefined,
        priceRange:
          type === "looking_for" ? priceRange.trim() || "VB" : undefined,
        estimatedTradeValue:
          type === "trade" && estimatedTradeValue !== ""
            ? Number(estimatedTradeValue)
            : undefined,
        lookingForWants: type === "trade" ? lookingForWants.trim() : undefined,
        allowOffers,
        postToDiscord: isDraft ? false : postToDiscord,
        showDiscordName,
        status: isDraft ? "draft" : "active",
      });

      setIsDraftSaved(isDraft);
      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1400);
      }
    } catch (err) {
      console.error("Fehler beim Erstellen der Karte:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color schemes based on active type
  const isSell = type === "sell";
  const isTrade = type === "trade";
  const isLookingFor = type === "looking_for";

  const themeAccentBg = isSell
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : isTrade
    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

  const themeGlow = isSell
    ? "shadow-[0_0_50px_rgba(16,185,129,0.15)]"
    : isTrade
    ? "shadow-[0_0_50px_rgba(168,85,247,0.15)]"
    : "shadow-[0_0_50px_rgba(6,182,212,0.15)]";

  const themePrimaryButton = isSell
    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black shadow-emerald-500/30 hover:shadow-emerald-500/50"
    : isTrade
    ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50"
    : "bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-black shadow-cyan-500/30 hover:shadow-cyan-500/50";

  if (isSuccess) {
    return (
      <div className={cn(
        "w-full p-8 sm:p-12 rounded-3xl bg-[#0b0f1a] border text-center space-y-4 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300",
        isDraftSaved ? "border-amber-500/40" : "border-emerald-500/40"
      )}>
        <BorderBeam size={280} duration={6} colorFrom={isDraftSaved ? "#f59e0b" : "#10b981"} colorTo="#06b6d4" />
        <div className={cn(
          "w-20 h-20 rounded-full border flex items-center justify-center mx-auto",
          isDraftSaved
            ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
        )}>
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white">
          {isDraftSaved ? "Als Entwurf gespeichert!" : "Inserat erfolgreich veröffentlicht!"}
        </h3>
        <p className="text-sm text-neutral-300 max-w-md mx-auto">
          {isDraftSaved ? (
            <>
              Dein Entwurf für <strong className="text-white">{name}</strong> ist in deinem Profil gespeichert und noch nicht öffentlich im Marktplatz gelistet.
            </>
          ) : (
            <>
              Dein Inserat für <strong className="text-white">{name}</strong> ist ab sofort live im Manaverse Marktplatz
              {postToDiscord && " und wurde per Webhook im Discord #marktplatz gepostet"}.
            </>
          )}
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setIsSuccess(false);
              setIsDraftSaved(false);
              setName("");
              setPhotos([""]);
              setPrice("");
              setEstimatedTradeValue("");
              setPriceRange("");
              setMobileStep(1);
            }}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/20 min-h-[44px] cursor-pointer"
          >
            + Weiteres Inserat / Entwurf erstellen
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all min-h-[44px] cursor-pointer"
            >
              Schließen
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-3xl border border-white/15 bg-[#090d16]/95 backdrop-blur-2xl overflow-hidden transition-all duration-300",
        themeGlow,
        mode === "inline" ? "p-4 sm:p-7 my-6" : "p-4 sm:p-8 lg:p-10",
        className
      )}
    >
      {/* Decorative ambient background glows */}
      <div
        className={cn(
          "absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-25",
          isSell ? "bg-emerald-500" : isTrade ? "bg-purple-600" : "bg-cyan-500"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20",
          isSell ? "bg-cyan-500" : isTrade ? "bg-pink-600" : "bg-blue-600"
        )}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-2xl border shadow-lg flex-shrink-0", themeAccentBg)}>
            {isSell ? (
              <Tag className="w-6 h-6 text-emerald-400" />
            ) : isTrade ? (
              <ArrowLeftRight className="w-6 h-6 text-purple-400" />
            ) : (
              <Target className="w-6 h-6 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border flex items-center gap-1.5",
                  isSell
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : isTrade
                    ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                    : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                )}
              >
                {isSell && <Tag className="w-3 h-3 text-emerald-400" />}
                {isTrade && <ArrowLeftRight className="w-3 h-3 text-purple-400" />}
                {isLookingFor && <Target className="w-3 h-3 text-cyan-400" />}
                {isSell ? "SOFORTKAUF & VERKAUF" : isTrade ? "1:1 SAMMLERTAUSCH" : "KOPFGELD & GESUCH"}
              </span>
              <span className="hidden sm:inline-flex text-[10px] text-neutral-400">• 0% Provision</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isSell
                ? "Karte zum Verkauf einstellen"
                : isTrade
                ? "Karte zum Tausch anbieten"
                : "Gesuch aufgeben (Kopfgeld)"}
            </h2>
          </div>
        </div>

        {/* Action Controls / Close button for inline mode */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Schließen</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 📱 MOBILE VIEW: DEDIZIERTER 4-SCHRITTE-FLOW ( < md )     */}
      {/* ======================================================== */}
      <div className="md:hidden relative z-10 space-y-4">
        {/* Step Progress & Indicator */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-white">
              Schritt {mobileStep} von 4:{" "}
              {mobileStep === 1 && "Pokémon-Auswahl"}
              {mobileStep === 2 && "Zustand & Sprache"}
              {mobileStep === 3 && (isSell ? "Verkaufspreis" : isTrade ? "Tauschwert & Wants" : "Dein Budget")}
              {mobileStep === 4 && "Medien & Veröffentlichung"}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {Math.round((mobileStep / 4) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isSell
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : isTrade
                  ? "bg-gradient-to-r from-purple-500 to-indigo-400"
                  : "bg-gradient-to-r from-cyan-500 to-sky-400"
              )}
              style={{ width: `${(mobileStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Mini Preview Slab for Mobile (Keeps card visible at top) */}
        {name && (
          <div className="p-3 rounded-2xl bg-[#0f1422] border border-white/15 flex items-center gap-3 shadow-lg">
            <div className="w-12 h-16 bg-black/60 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center">
              {photos[0] ? (
                <img src={photos[0]} alt={name} className="w-full h-full object-contain p-0.5" />
              ) : (
                <ImageIcon className="w-5 h-5 text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{name}</p>
              <p className="text-[11px] text-neutral-400 truncate">
                {setNameText || "Set offen"} {cardNumber ? `• #${cardNumber}` : ""}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                  {activeCondition.label} ({activeCondition.stars})
                </span>
                <span className="text-[10px] font-bold text-neutral-300">{activeLanguage.flag}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Karte wählen & Autocomplete */}
        {mobileStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Pokémon-Kartenname suchen *
              </label>
              <PokemonSearchInput
                value={name}
                onChange={setName}
                onSelectCard={handleSelectApiCard}
                placeholder="z.B. Glurak, Charizard VMAX, Moonbreon..."
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Wähle einen Treffer für automatisches High-Res Artwork & Set-Info.
              </p>
            </div>

            {/* Quick-Pick Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Schnell-Vorlagen (1 Klick)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 flex items-center gap-2"
                  >
                    <img
                      src={preset.photo}
                      alt={preset.name}
                      className="w-8 h-11 object-contain rounded flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{preset.name}</p>
                      <p className="text-[10px] text-neutral-400">{preset.set}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible manual fields */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowManualFields(!showManualFields)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1"
              >
                {showManualFields ? "Manuelle Details verbergen" : "Set & Kartennummer manuell bearbeiten"}
              </button>
              {showManualFields && (
                <div className="mt-2.5 space-y-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Set-Name / Edition</label>
                    <input
                      type="text"
                      value={setNameText}
                      onChange={(e) => setSetNameText(e.target.value)}
                      placeholder="z.B. 151, Paldea Evolved, Base Set..."
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Kartennummer</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="z.B. 199/165"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Zustand & Sprache */}
        {mobileStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                Kartenzustand wählen *
              </label>
              <div className="space-y-1.5">
                {CONDITIONS.map((c) => {
                  const isSelected = condition === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCondition(c.value)}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all min-h-[48px]",
                        isSelected
                          ? "bg-white/15 border-white/40 shadow-lg text-white"
                          : "bg-white/5 border-white/10 text-neutral-300"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold">{c.gradeLabel}</span>
                        <div>
                          <p className="text-xs font-bold leading-tight">{c.label}</p>
                          <p className="text-[10px] text-neutral-400">{c.desc}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-amber-400 text-xs tracking-tighter">{c.stars}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                Kartensprache *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguage(lang.value)}
                    className={cn(
                      "p-3 rounded-xl border text-left flex items-center gap-2 min-h-[48px] transition-all",
                      language === lang.value
                        ? "bg-white/15 border-white/40 text-white font-bold"
                        : "bg-white/5 border-white/10 text-neutral-300"
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Wert & Konditionen */}
        {mobileStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {isSell && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Verkaufspreis in € *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="z.B. 45"
                      className="w-full bg-[#111624] border border-emerald-500/40 rounded-xl px-4 py-3 pl-9 text-white font-black text-lg focus:outline-none"
                    />
                    <DollarSign className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Quick Price Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_BUDGETS.slice(0, 5).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setPrice(Number(q.replace(" €", "")))}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-300 min-h-[36px]"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between min-h-[48px]">
                  <span className="text-xs text-neutral-300 font-semibold">
                    Preisvorschläge erlauben
                  </span>
                  <input
                    type="checkbox"
                    checked={allowOffers}
                    onChange={(e) => setAllowOffers(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {isTrade && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Geschätzter Tauschwert (ETV in €) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={estimatedTradeValue}
                      onChange={(e) => setEstimatedTradeValue(e.target.value)}
                      placeholder="z.B. 120"
                      className="w-full bg-[#111624] border border-purple-500/40 rounded-xl px-4 py-3 pl-9 text-white font-black text-lg focus:outline-none"
                    />
                    <Scale className="w-5 h-5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Was suchst du im Gegenzug? (Wants)
                  </label>
                  <textarea
                    rows={2}
                    value={lookingForWants}
                    onChange={(e) => setLookingForWants(e.target.value)}
                    placeholder="z.B. Suche Vintage Gluraks, Gengar VMAX oder Sealed Displays..."
                    className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {isLookingFor && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Dein Budget / Kopfgeld-Rahmen *
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="z.B. 50 - 80 € oder Marktwert"
                    className="w-full bg-[#111624] border border-cyan-500/40 rounded-xl px-4 py-3 text-white font-bold text-base focus:outline-none"
                  />
                </div>

                {/* Quick Budget Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_BUDGETS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setPriceRange(q)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-300 min-h-[36px]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Optionale Beschreibung / Besonderheiten
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="z.B. First Edition, im Toploader gelagert, tierfreier Nichtraucherhaushalt..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Medien & Veröffentlichung */}
        {mobileStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Karten-Fotos (Bild-URLs)
              </label>
              {photos.map((p, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={p}
                    onChange={(e) => handleUpdatePhoto(idx, e.target.value)}
                    placeholder={`Bild-URL ${idx + 1} (z.B. Imgur)`}
                    className="flex-1 bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs"
                  />
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="p-2 text-rose-400 bg-rose-500/10 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPhotoSlot}
                  className="text-xs text-indigo-400 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Weiteres Bild hinzufügen
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Video-Proof (optional)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="TikTok, Instagram Reels oder YouTube Shorts URL"
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            {/* Discord Webhook Switch */}
            <div className="p-3.5 rounded-2xl bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-between">
              <div className="pr-2">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#5865F2]" />
                  Discord Bot-Alert aktivieren
                </p>
                <p className="text-[10px] text-neutral-300">
                  Sendet sofort eine Vorab-Meldung in den offiziellen Discord #marktplatz.
                </p>
              </div>
              <input
                type="checkbox"
                checked={postToDiscord}
                onChange={(e) => setPostToDiscord(e.target.checked)}
                className="w-5 h-5 accent-[#5865F2] rounded cursor-pointer min-h-[44px] min-w-[20px]"
              />
            </div>

            {/* Discord Name on Slab Switch */}
            <div className="p-3.5 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/25 flex items-center justify-between">
              <div className="pr-2">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#5865F2]" />
                  Discord-Name auf Inserat anzeigen
                </p>
                <p className="text-[10px] text-neutral-300">
                  Zeigt deinen verknüpften Discord-Tag öffentlich auf der Karte an, damit Interessenten dich direkt finden.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showDiscordName}
                onChange={(e) => setShowDiscordName(e.target.checked)}
                className="w-5 h-5 accent-[#5865F2] rounded cursor-pointer min-h-[44px] min-w-[20px]"
              />
            </div>
          </div>
        )}

        {/* 📱 STICKY BOTTOM BAR FOR MOBILE WIZARD */}
        <div className="pt-2 sticky bottom-0 bg-[#090d16]/95 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-white/10 -mx-4 px-4 pt-3 flex items-center gap-2">
          {mobileStep > 1 && (
            <button
              type="button"
              onClick={() => setMobileStep((s) => Math.max(1, s - 1))}
              className="min-h-[48px] px-4 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Zurück
            </button>
          )}

          {mobileStep < 4 ? (
            <button
              type="button"
              disabled={mobileStep === 1 && !name.trim()}
              onClick={() => setMobileStep((s) => Math.min(4, s + 1))}
              className={cn(
                "flex-1 min-h-[48px] rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all",
                mobileStep === 1 && !name.trim()
                  ? "bg-white/10 text-neutral-500 cursor-not-allowed"
                  : themePrimaryButton
              )}
            >
              <span>Weiter zu Schritt {mobileStep + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex-1 flex flex-col gap-2">
              <button
                type="button"
                disabled={isSubmitting || !name.trim()}
                onClick={() => handleSubmit(undefined, true)}
                className="w-full min-h-[44px] rounded-xl font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Tag className="w-4 h-4" /> Als Entwurf speichern
              </button>
              <button
                type="button"
                disabled={isSubmitting || !name.trim()}
                onClick={() => handleSubmit(undefined, false)}
                className={cn(
                  "w-full min-h-[48px] rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer",
                  isSubmitting ? "opacity-75 cursor-wait" : themePrimaryButton
                )}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Inserat wird veröffentlicht...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Jetzt veröffentlichen
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🖥️ DESKTOP VIEW: 2-SPALTEN HIGH-END STUDIO ( >= md )     */}
      {/* ======================================================== */}
      <form onSubmit={handleSubmit} className="hidden md:grid grid-cols-12 gap-8 relative z-10">
        {/* Left Column: 3D Holographic Graded Slab Preview (5 Cols) */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 text-white">
              <Layers className="w-4 h-4 text-amber-400" />
              Live Graded-Slab Vorschau
            </span>
            <span className="text-[10px] text-neutral-400">Acryl-Display-Slab</span>
          </div>

          {/* Ultra-Clean Acrylic Display Slab Component Preview (Stable, no wobble) */}
          <div className="acrylic-slab-container">
            <div className="acrylic-display-slab select-none">
              {/* Overhanging Top Crest Sigil (Manaforge Sigil / Magma Glow / Rising Ash / 90° Hover Rotation) */}
              <SlabTopSigil />

              {/* Chamfered Bevel & Specular Glare */}
              <div className="slab-edge-bevel" />
              <div className="slab-glare-effect" />

              {/* Clean Header Plate */}
              <div className="slab-header-plate">
                <div className="plate-top-row">
                  {/* Calendar Icon with Hover Tooltip */}
                  <div className="relative group/date inline-flex items-center flex-shrink-0">
                    <div
                      className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-help min-h-[28px] min-w-[28px] flex items-center justify-center"
                      title={`Eingestellt am ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="absolute left-0 top-full mt-1 hidden group-hover/date:flex items-center px-2 py-1 rounded-md bg-slate-900 text-white text-[10px] font-semibold whitespace-nowrap shadow-xl z-30 pointer-events-none">
                      Eingestellt am {new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </div>
                  </div>

                  <span className="foil-badge font-bold tracking-wide flex-shrink-0">
                    {activeCondition.label.toUpperCase()} • {activeLanguage.flag}
                  </span>
                </div>
                <div className="plate-main-row">
                  <div className="w-full">
                    <h4 className="card-name text-[13px] leading-snug font-extrabold text-[#0f172a] truncate" title={formatSlabTitle(name || "DEINE POKÉMON KARTE", language, cardNumber).fullLabel}>
                      {formatSlabTitle(name || "DEINE POKÉMON KARTE", language, cardNumber).fullLabel}
                    </h4>
                    <p className="set-info text-[10px] text-slate-500 mt-0.5 truncate">
                      {setNameText || "Edition / Set"} • {activeCondition.gradeLabel} ({activeCondition.stars})
                    </p>
                  </div>
                </div>
              </div>

              {/* Recessed Card Well */}
              <div className="slab-card-window">
                {photos[0] ? (
                  <img
                    src={photos[0]}
                    alt={name || "Kartenvorschau"}
                    className="card-img aspect-[2.5/3.5] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  />
                ) : (
                  <div className="aspect-[2.5/3.5] flex flex-col items-center justify-center text-neutral-400 gap-2 bg-black/60 rounded-lg">
                    <ImageIcon className="w-8 h-8 opacity-40 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-300">Noch kein Bild gewählt</span>
                    <span className="text-[10px] text-neutral-500 text-center px-4">
                      Nutze die Suche rechts oder eine Vorlage für automatisches Artwork.
                    </span>
                  </div>
                )}
                <div className="holo-foil-layer pointer-events-none" />
              </div>

              {/* Bottom Slab Footer / Price Tag */}
              <div className="mt-3.5 space-y-2 relative z-10">
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs shadow-inner">
                  <div className="min-w-0">
                    <span className="text-[9px] text-neutral-400 uppercase font-bold block leading-none truncate">
                      {isSell ? "Verkaufspreis" : isTrade ? "Tauschwert (ETV)" : "Kopfgeld-Budget"}
                    </span>
                    <span className="text-base font-black text-white truncate block">
                      {isSell
                        ? price
                          ? `${Number(price).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`
                          : "Preis festlegen"
                        : isTrade
                        ? estimatedTradeValue
                          ? `~${estimatedTradeValue} €`
                          : "Tauschwert offen"
                        : priceRange || "VB"}
                    </span>
                  </div>
                  <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border", themeAccentBg)}>
                    {isSell ? "Kaufen" : isTrade ? "Tausch" : "Gesuch"}
                  </span>
                </div>

                {/* Slim full-width "Angebot machen" preview button for sell with offers */}
                {isSell && allowOffers && (
                  <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] text-center shadow-sm">
                    Angebot machen
                  </div>
                )}
              </div>

              {/* Polished Bottom Acrylic Rim (Clean) */}
              <div className="slab-bottom-rim">
                <div className="rim-reflection" />
              </div>
            </div>
          </div>

          {/* Quick-Pick 1-Click Starter Cards */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> 1-Klick Schnellvorlagen zum Testen:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:border-white/30 flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={preset.photo}
                    alt={preset.name}
                    className="w-7 h-10 object-contain rounded flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{preset.name}</p>
                    <p className="text-[10px] text-neutral-400">{preset.set}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Discord Webhook Preview Badge */}
          {postToDiscord && (
            <div className="p-3.5 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center gap-3 text-xs text-neutral-300">
              <Zap className="w-5 h-5 text-[#5865F2] flex-shrink-0" />
              <span>
                <strong className="text-white">Discord-Alert aktiv:</strong> Nach Veröffentlichung wird ein Benachrichtigungs-Embed im Channel <code className="text-[#5865F2]">#marktplatz</code> gepostet.
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Form Fields & Customization (7 Cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Card Search & Identity */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#0f1422] border border-white/10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" /> 1. Kartendetails & Artwork
            </h4>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Karten-Name *
              </label>
              <PokemonSearchInput
                value={name}
                onChange={setName}
                onSelectCard={handleSelectApiCard}
                placeholder="z.B. Glurak, Charizard VMAX, Moonbreon..."
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Tippe mindestens 2 Buchstaben für Live-Vorschläge mit Original-Artwork.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Edition / Set-Name
                </label>
                <input
                  type="text"
                  value={setNameText}
                  onChange={(e) => setSetNameText(e.target.value)}
                  placeholder="z.B. 151, Paldea Evolved"
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Kartennummer
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="z.B. 199/165"
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Condition Grading Selector */}
          <div className="space-y-3 p-5 rounded-2xl bg-[#0f1422] border border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Zustand & Sprache
              </h4>
              <span className="text-xs text-amber-400 font-mono font-bold">
                {activeCondition.label} ({activeCondition.stars})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITIONS.slice(0, 4).map((c) => {
                const isSelected = condition === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCondition(c.value)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[58px]",
                      isSelected
                        ? "bg-white/15 border-white/50 text-white shadow-lg scale-[1.02]"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <p className="text-xs font-bold truncate">{c.label}</p>
                    <p className="text-[10px] text-amber-400">{c.stars}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CONDITIONS.slice(4).map((c) => {
                const isSelected = condition === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCondition(c.value)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[50px]",
                      isSelected
                        ? "bg-white/15 border-white/50 text-white shadow-lg scale-[1.02]"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <p className="text-xs font-bold truncate">{c.label}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{c.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                Sprache der Karte
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguage(lang.value)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[38px]",
                      language === lang.value
                        ? "bg-white/20 border-white/40 text-white shadow"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing / Value / Mode Details */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#0f1422] border border-white/10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              {isSell ? "3. Preisgestaltung" : isTrade ? "3. Tauschkonditionen" : "3. Dein Suchbudget"}
            </h4>

            {isSell && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Verkaufspreis in € *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="z.B. 45"
                        required
                        className="w-full bg-[#111624] border border-emerald-500/40 rounded-xl px-4 py-3 pl-9 text-white font-black text-lg focus:outline-none"
                      />
                      <DollarSign className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Schnellwahl
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_BUDGETS.slice(0, 5).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setPrice(Number(q.replace(" €", "")))}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-300 cursor-pointer min-h-[36px]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-semibold">
                    Preisvorschläge und Gegenangebote von Käufern erlauben
                  </span>
                  <input
                    type="checkbox"
                    checked={allowOffers}
                    onChange={(e) => setAllowOffers(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {isTrade && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Geschätzter Tauschwert (ETV in €) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={estimatedTradeValue}
                        onChange={(e) => setEstimatedTradeValue(e.target.value)}
                        placeholder="z.B. 120"
                        required
                        className="w-full bg-[#111624] border border-purple-500/40 rounded-xl px-4 py-3 pl-9 text-white font-black text-lg focus:outline-none"
                      />
                      <Scale className="w-5 h-5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="text-[11px] text-neutral-400">
                      Der ETV hilft Sammlern faire Tauschangebote mit gleichem Marktwert zusammenzustellen.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Gesuchte Tauschkarten (Deine Wants)
                  </label>
                  <textarea
                    rows={2}
                    value={lookingForWants}
                    onChange={(e) => setLookingForWants(e.target.value)}
                    placeholder="z.B. Suche Vintage Glurak, Gengar VMAX, Sealed 151 Displays..."
                    className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {isLookingFor && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Dein Budget / Kopfgeld-Rahmen *
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="z.B. 50 - 80 € oder VB"
                    className="w-full bg-[#111624] border border-cyan-500/40 rounded-xl px-4 py-3 text-white font-bold text-base focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_BUDGETS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setPriceRange(q)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-300 cursor-pointer min-h-[36px]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Zusatzinfos & Beschreibung (optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="z.B. Nur versicherter Versand, Karte stets im Toploader aufbewahrt..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Media & Community Links */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#0f1422] border border-white/10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" /> 4. Fotos, Video & Community
            </h4>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Karten-Fotos (Bild-URLs)
              </label>
              {photos.map((p, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={p}
                    onChange={(e) => handleUpdatePhoto(idx, e.target.value)}
                    placeholder={`Bild-URL ${idx + 1} (z.B. Imgur oder Direct Image Link)`}
                    className="flex-1 bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none"
                  />
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="p-2 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/30 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPhotoSlot}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Weiteres Bild hinzufügen
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Video-Proof (optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="TikTok, Reels, Shorts oder Imgur Video"
                    className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 pl-8 text-white text-xs focus:outline-none"
                  />
                  <Video className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-white font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#5865F2]" /> Auf Discord posten
                  </span>
                  <input
                    type="checkbox"
                    checked={postToDiscord}
                    onChange={(e) => setPostToDiscord(e.target.checked)}
                    className="w-4 h-4 accent-[#5865F2] rounded cursor-pointer min-h-[44px] min-w-[20px]"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-white font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#5865F2]" /> Discord-Name anzeigen
                  </span>
                  <input
                    type="checkbox"
                    checked={showDiscordName}
                    onChange={(e) => setShowDiscordName(e.target.checked)}
                    className="w-4 h-4 accent-[#5865F2] rounded cursor-pointer min-h-[44px] min-w-[20px]"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting || !name.trim()}
              onClick={() => handleSubmit(undefined, true)}
              className={cn(
                "min-h-[52px] px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer",
                isSubmitting || !name.trim()
                  ? "bg-white/5 text-neutral-600 border-white/5 cursor-not-allowed"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/10 hover:border-white/20 active:scale-98"
              )}
            >
              <FileText className="w-4 h-4 text-neutral-400" />
              Als Entwurf speichern
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={cn(
                "flex-1 min-h-[52px] rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer active:scale-98",
                isSubmitting || !name.trim()
                  ? "bg-white/10 text-neutral-500 cursor-not-allowed"
                  : themePrimaryButton
              )}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Inserat wird veröffentlicht...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {isSell
                    ? "Karte jetzt im Marktplatz zum Verkauf listen"
                    : isTrade
                    ? "Tausch-Inserat live schalten"
                    : "Kopfgeld jetzt auf dem Radar aktivieren"}
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="min-h-[52px] px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
              >
                Abbrechen
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
