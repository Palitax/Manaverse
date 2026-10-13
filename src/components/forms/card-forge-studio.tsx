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
import { formatSlabTitle } from "@/lib/pokemon-names";
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
  Calendar,
  MessageSquare,
  Upload,
  AlertTriangle,
  Zap,
  RefreshCw,
  Search,
  Sliders,
  DollarSign,
  Scale,
  Key,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SlabTopSigil } from "../cards/slab-top-sigil";
import {
  validateSetWithLanguage,
  detectSetLanguage,
  findSetByCode,
  TCG_SETS,
} from "@/lib/tcg-index-data";

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
    value: "Graded",
    label: "Graded",
    gradeLabel: "SLAB GRADED",
    gradeScore: "PSA/BGS/CGC",
    stars: "★★★★★",
    desc: "Professionell bewertet (PSA, BGS, CGC u.a.)",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/50 text-purple-300",
  },
  {
    value: "NM",
    label: "Near Mint",
    gradeLabel: "GEM-MT 10",
    gradeScore: "10.0",
    stars: "★★★★★",
    desc: "Wie frisch aus dem Booster gesleevt",
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
  { value: "KR", label: "Koreanisch", flag: "🇰🇷" },
  { value: "CN", label: "Chinesisch", flag: "🇨🇳" },
  { value: "Egal", label: "Beliebig", flag: "🌐" },
  { value: "OTHER", label: "Sonstige", flag: "🌍" },
];

const QUICK_BUDGETS = ["15 €", "35 €", "65 €", "120 €", "250 €", "VB", "Marktwert"];

interface CardForgeStudioProps {
  initialType?: ListingType;
  initialName?: string;
  initialSet?: string;
  initialNumber?: string;
  initialLanguage?: CardLanguage;
  initialPhoto?: string;
  mode?: "page" | "inline";
  onSuccess?: (createdId?: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function CardForgeStudio({
  initialType = "sell",
  initialName = "",
  initialSet = "",
  initialNumber = "",
  initialLanguage,
  initialPhoto,
  mode = "page",
  onSuccess,
  onCancel,
  className,
}: CardForgeStudioProps) {
  const { addListing, currentUser, openAuthModal } = useStore();

  // Wizard Step: 1 = Foto & KI-Scan, 2 = Details & Identität, 3 = Preis & Konditionen, 4 = Vorschau & Veröffentlichen
  const [step, setStep] = useState<number>(initialName || initialPhoto ? 2 : 1);

  // Form State
  const [type, setType] = useState<ListingType>(initialType);
  const [name, setName] = useState(initialName);
  const [setNameText, setSetNameText] = useState(initialSet);
  const [cardNumber, setCardNumber] = useState(initialNumber);
  const [language, setLanguage] = useState<CardLanguage>(initialLanguage || "DE");
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [photos, setPhotos] = useState<string[]>(initialPhoto ? [initialPhoto] : [""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [priceRange, setPriceRange] = useState("");
  const [estimatedTradeValue, setEstimatedTradeValue] = useState<number | string>("");
  const [lookingForWants, setLookingForWants] = useState("");
  const [allowOffers, setAllowOffers] = useState(true);
  const [postToDiscord, setPostToDiscord] = useState(true);
  const [showDiscordName, setShowDiscordName] = useState(true);

  // AI Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [detectedSummary, setDetectedSummary] = useState<string | null>(null);
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");

  // Preview Image Upload & Drag-and-Drop Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load custom Gemini API key from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("manaverse_gemini_api_key");
      if (stored) setUserApiKey(stored);
    }
  }, []);

  const saveApiKey = (val: string) => {
    setUserApiKey(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("manaverse_gemini_api_key", val.trim());
    }
  };

  // Sync initial type when changed
  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  // Escape key listener to close modal/studio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCancel) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // Core File Upload & AI Vision Scan Handler
  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Bitte lade eine Bilddatei (PNG, JPG, WEBP) hoch.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      // Immediately display image in slab
      setPhotos([dataUrl]);
      setIsScanning(true);
      setScanMessage("KI-Kartenanalyse läuft... Lese Pokémon, Set-Kürzel & Nummer...");
      setDetectedSummary(null);

      try {
        const storedKey = typeof window !== "undefined" ? localStorage.getItem("manaverse_gemini_api_key") || "" : "";
        const res = await fetch("/api/ai/scan-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: dataUrl,
            apiKey: storedKey,
            filename: file.name,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const d = json.data;
            if (d.name) setName(d.name);
            if (d.setCode) setSetNameText(d.setCode);
            if (d.cardNumber) setCardNumber(d.cardNumber);
            if (d.language) setLanguage(d.language);
            if (d.condition) setCondition(d.condition);

            if (json.isAiDetected) {
              const summary = `${d.name} (${d.setCode || "Set"} • #${d.cardNumber || "—"} • ${d.language || "DE"})`;
              setDetectedSummary(summary);
              setScanMessage(`✓ Karte erfolgreich per KI erkannt!`);
            } else {
              setScanMessage("Foto geladen! Du kannst die Details in Schritt 2 kurz prüfen.");
            }
          }
        } else {
          setScanMessage("Foto geladen! Bitte passe den Kartennamen kurz in Schritt 2 an.");
        }
      } catch (err) {
        console.warn("AI card scan error:", err);
        setScanMessage("Foto geladen! Bitte wähle den Kartennamen kurz im TCG-Index.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // UX State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const activeCondition =
    CONDITIONS.find((c) => c.value === condition) || CONDITIONS[0];
  const activeLanguage =
    LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  // Set & Language cross-validation and auto-detection
  const handleSetChange = (val: string) => {
    setSetNameText(val);
    const matched = findSetByCode(val);
    if (matched) {
      setLanguage(matched.language);
    } else {
      const detected = detectSetLanguage(val);
      if (detected) {
        setLanguage(detected);
      }
    }
  };

  const setValidation = React.useMemo(() => {
    if (!setNameText.trim()) return { isValid: true, detectedLang: null };
    return validateSetWithLanguage(setNameText, language);
  }, [setNameText, language]);

  const handleSelectApiCard = (card: PokemonApiCard) => {
    setName(card.name);
    if (card.set?.id) {
      setSetNameText(card.set.id);
    } else if (card.set?.name) {
      setSetNameText(card.set.name);
    }
    if (card.number) setCardNumber(card.number);
    if (card.language) {
      setLanguage(card.language);
    } else {
      const detected = detectSetLanguage(card.set?.id || card.set?.name || "");
      if (detected) setLanguage(detected);
    }
    // Only replace photo if no custom photo uploaded yet
    if (!photos[0] || photos[0].startsWith("http")) {
      if (card.images?.large) {
        setPhotos([card.images.large]);
      } else if (card.images?.small) {
        setPhotos([card.images.small]);
      }
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
    if (!name.trim()) {
      setStep(2);
      return;
    }

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
              setStep(1);
            }}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/20 min-h-[44px] cursor-pointer"
          >
            + Weiteres Inserat erstellen
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

  // Common Slab Component Function to ensure 100% visual consistency
  const renderSlab = (interactiveUpload = false) => {
    return (
      <div className="acrylic-slab-container w-full max-w-[340px] sm:max-w-[360px] mx-auto">
        <div className="acrylic-display-slab select-none relative">
          {/* Chamfered Bevel & Specular Glare */}
          <div className="slab-edge-bevel" />
          <div className="slab-glare-effect" />

          {/* Clean Header Plate */}
          <div className="slab-header-plate">
            <div className="plate-top-row">
              <div className="relative group/date inline-flex items-center flex-shrink-0">
                <div
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-help min-h-[28px] min-w-[28px] flex items-center justify-center"
                  title={`Eingestellt am ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              </div>

              <span className="foil-badge font-bold tracking-wide flex-shrink-0">
                {activeCondition.label.toUpperCase()} • {activeLanguage.flag}
              </span>
            </div>
            <div className="plate-main-row">
              <div className="w-full">
                <h4
                  className="card-name text-[13px] leading-snug font-extrabold text-[#0f172a] truncate"
                  title={formatSlabTitle(name || "DEINE POKÉMON KARTE", language, cardNumber).fullLabel}
                >
                  {formatSlabTitle(name || "DEINE POKÉMON KARTE", language, cardNumber).fullLabel}
                </h4>
                <p className="set-info text-[10px] text-slate-500 mt-0.5 truncate">
                  {setNameText || "Edition / Set"} • {activeCondition.gradeLabel} ({activeCondition.stars})
                </p>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handlePhotoUpload(f);
            }}
            className="hidden"
          />

          {/* Recessed Card Well with Click & Drag-and-Drop Image Upload */}
          <div
            onClick={() => {
              if (interactiveUpload) fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              if (interactiveUpload) {
                e.preventDefault();
                setIsDragging(true);
              }
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              if (interactiveUpload) {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handlePhotoUpload(f);
              }
            }}
            className={cn(
              "slab-card-window relative overflow-hidden transition-all",
              interactiveUpload && "cursor-pointer",
              isDragging && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-black scale-[1.01]"
            )}
            title={interactiveUpload ? "Klicken oder Bild hier ablegen zum Hochladen & Scannen" : undefined}
          >
            {/* AI Scanning Visual Laser & Grid Overlay */}
            {isScanning && (
              <>
                <div className="ai-scan-laser-beam" />
                <div className="ai-scan-grid-overlay" />
                <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 animate-pulse">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-black text-white">KI-Scan läuft...</p>
                  <p className="text-[10px] text-cyan-200/90 leading-tight">
                    Pokémon, Set-Kürzel & Nummer werden analysiert
                  </p>
                </div>
              </>
            )}

            {photos[0] ? (
              <img
                src={photos[0]}
                alt={name || "Kartenvorschau"}
                className="card-img aspect-[2.5/3.5] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="aspect-[2.5/3.5] flex flex-col items-center justify-center text-neutral-400 gap-3 bg-black/60 rounded-lg p-4 text-center border-2 border-dashed border-white/20 hover:border-cyan-400/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Foto hier ablegen</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">oder klicken zum Auswählen</span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-all">
                  Bild wählen
                </span>
              </div>
            )}
            <div className="holo-foil-layer pointer-events-none" />
          </div>

          {/* Bottom Slab Footer / Price Tag */}
          <div className="mt-3.5 space-y-2 relative z-10">
            <div className="p-2.5 rounded-xl bg-black/75 border border-white/10 flex items-center justify-between text-xs shadow-inner">
              <div className="min-w-0">
                {!isSell && (
                  <span className="text-[9px] text-neutral-400 uppercase font-bold block leading-none truncate">
                    {isTrade ? "Tauschwert (ETV)" : "Gesuch-Budget"}
                  </span>
                )}
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
              <button
                type="button"
                className={cn(
                  "text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border cursor-pointer active:scale-95 transition-all shadow-sm",
                  isSell ? "bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-400" : themeAccentBg
                )}
              >
                {isSell ? "Kaufen" : isTrade ? "Tausch" : "Gesuch"}
              </button>
            </div>

            {/* Quick Action Preview Buttons for sell cards */}
            {isSell && (
              <div className="space-y-1.5 pt-0.5">
                {allowOffers && (
                  <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] text-center shadow-sm">
                    Angebot machen
                  </div>
                )}
                <div className="w-full py-1.5 px-3 rounded-xl bg-white/5 border border-white/15 text-neutral-300 font-bold text-[11px] text-center shadow-sm flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Verkäufer kontaktieren</span>
                </div>
              </div>
            )}

            {/* Centered Animated Manaforge Sigil Trigger Preview */}
            <div className="flex flex-col items-center justify-center pt-2 pb-0.5">
              <SlabTopSigil interactive isExpanded={false} />
            </div>
          </div>

          {/* Polished Bottom Acrylic Rim */}
          <div className="slab-bottom-rim">
            <div className="rim-reflection" />
          </div>
        </div>
      </div>
    );
  };

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
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
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
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isSell
                ? "Karte zum Verkauf einstellen"
                : isTrade
                ? "Karte zum Tausch anbieten"
                : "Gesuch aufgeben"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Geführter 4-Schritte-Assistent mit automatischer KI-Kartenerkennung
            </p>
          </div>
        </div>

        {/* Action Controls / Close button */}
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

      {/* Step Progress Indicator Bar (Steps 1 to 4) */}
      <div className="relative z-10 mb-6 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">Schritt {step} von 4:</span>
            <span className="text-neutral-300 font-semibold truncate">
              {step === 1 && "📸 Foto-Upload & KI-Scan"}
              {step === 2 && "🔍 Kartendetails & Identität"}
              {step === 3 && (isSell ? "💰 Verkaufspreis" : isTrade ? "🔄 Tauschwert & Wünsche" : "🎯 Dein Budget")}
              {step === 4 && "✨ Vorschau & Veröffentlichen"}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">
            {Math.round((step / 4) * 100)}%
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isSell
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : isTrade
                ? "bg-gradient-to-r from-purple-500 to-indigo-400"
                : "bg-gradient-to-r from-cyan-500 to-sky-400"
            )}
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Interactive Step Chips */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-[11px]">
          {[
            { num: 1, label: "1. Foto & KI" },
            { num: 2, label: "2. Details" },
            { num: 3, label: isSell ? "3. Preis" : isTrade ? "3. Tausch" : "3. Budget" },
            { num: 4, label: "4. Abschluss" },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              disabled={s.num > step && !name.trim() && !photos[0]}
              onClick={() => setStep(s.num)}
              className={cn(
                "py-1.5 px-2 rounded-lg font-bold text-center transition-all min-h-[36px] flex items-center justify-center truncate cursor-pointer",
                step === s.num
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : step > s.num
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                  : "bg-white/5 text-neutral-500 border border-transparent"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 📸 SCHRITT 1: FOTO-UPLOAD & KI-SCAN (FOKUS AUF DIE SLAB) */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="relative z-10 max-w-xl mx-auto space-y-6 py-2 text-center animate-in fade-in duration-300">
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isSell
                ? "Bitte lade ein Foto deiner Karte hoch"
                : isTrade
                ? "Lade ein Foto deiner Tauschkarte hoch"
                : "Lade ein Referenzfoto der gesuchten Karte hoch"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
              Unsere KI erkennt Pokémon-Name, Set-Kürzel, Sprache und Kartennummer automatisch – auch auf Japanisch & Chinesisch.
            </p>
          </div>

          {/* The Slab Display (Prominently Centered with Interactive Upload) */}
          <div className="pt-2">
            {renderSlab(true)}
          </div>

          {/* Scan Status & Confirmation Message */}
          {scanMessage && (
            <div
              className={cn(
                "p-3 rounded-2xl text-xs max-w-md mx-auto border transition-all animate-in fade-in flex items-center justify-center gap-2",
                isScanning
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                  : detectedSummary
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold"
                  : "bg-white/10 border-white/15 text-white"
              )}
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
              ) : detectedSummary ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
              <span>{scanMessage}</span>
            </div>
          )}

          {/* Step 1 Control Buttons */}
          <div className="space-y-3 pt-2 max-w-md mx-auto">
            {photos[0] ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className={cn(
                  "w-full min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer",
                  themePrimaryButton
                )}
              >
                <span>Weiter zu Schritt 2: Details prüfen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-full min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer",
                  themePrimaryButton
                )}
              >
                <Upload className="w-4 h-4" />
                <span>Foto von Festplatte wählen</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-neutral-400 hover:text-white font-semibold underline transition-colors cursor-pointer py-1"
              >
                Ohne Foto fortfahren (manuell eingeben) →
              </button>
            </div>

            {/* Optional Free-tier Gemini API Key Expander */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowApiKeySetting(!showApiKeySetting)}
                className="text-[11px] text-neutral-400 hover:text-neutral-300 flex items-center justify-center gap-1.5 mx-auto py-1"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Eigener Gemini API-Key (Optional für kostenlose KI-Scans)</span>
              </button>

              {showApiKeySetting && (
                <div className="mt-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2 animate-in fade-in">
                  <label className="block text-[11px] font-bold text-neutral-300">
                    Google AI Studio Key (100% kostenlos unter ai.studio/projects)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={userApiKey}
                      onChange={(e) => saveApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 bg-[#111624] border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => alert("API-Key erfolgreich im Browser gespeichert!")}
                      className="px-3 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
                    >
                      Gespeichert
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Der Key wird nur sicher in deinem lokalen Browser gespeichert und für Kartenscans genutzt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🔍 SCHRITT 2: KARTENDETAILS & IDENTITÄT                  */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          {/* Left Column: Live Slab Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {renderSlab(true)}
            <p className="text-[11px] text-neutral-400 mt-3 text-center">
              Klicke auf das Bild, um ein anderes Foto hochzuladen.
            </p>
          </div>

          {/* Right Column: Card Details Inputs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pokémon Card Name Search */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-2">
              <label className="block text-xs font-bold text-white">
                Pokémon-Kartenname *
              </label>
              <PokemonSearchInput
                value={name}
                onChange={setName}
                onSelectCard={handleSelectApiCard}
                language={language}
                placeholder="z.B. Glurak, Charizard VMAX, Moonbreon..."
              />
              <p className="text-[11px] text-neutral-400">
                Tippe für Vorschläge aus dem offiziellen mehrsprachigen TCG-Index.
              </p>
            </div>

            {/* Set & Number Identification */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Set-Kürzel / Edition
                  </label>
                  <input
                    type="text"
                    value={setNameText}
                    onChange={(e) => handleSetChange(e.target.value)}
                    placeholder="z.B. SV2a, JTG, MEW, 151"
                    className="w-full bg-[#111624] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:border-cyan-400 outline-none transition-colors"
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
                    placeholder="z.B. 201/165 oder 103/078"
                    className="w-full bg-[#111624] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Set Validation Notice */}
              {setValidation.warningMessage && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Set- & Sprachprüfung</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90">{setValidation.warningMessage}</p>
                  {setValidation.detectedLang && (
                    <button
                      type="button"
                      onClick={() => setLanguage(setValidation.detectedLang!)}
                      className="mt-1 px-2.5 py-1 rounded-lg bg-amber-400 text-black font-black text-[10px] cursor-pointer"
                    >
                      Karte auf {setValidation.detectedLang} setzen
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-2.5">
              <label className="block text-xs font-bold text-white">
                Kartensprache
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setLanguage(l.value)}
                    className={cn(
                      "py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-between border transition-all cursor-pointer min-h-[44px]",
                      language === l.value
                        ? "bg-white/20 border-cyan-400 text-white shadow-sm"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    )}
                  >
                    <span>{l.label}</span>
                    <span className="text-base">{l.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-2.5">
              <label className="block text-xs font-bold text-white">
                Zustand der Karte
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCondition(c.value)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[50px] flex flex-col justify-center",
                      condition === c.value
                        ? "bg-white/20 border-cyan-400 text-white shadow-sm"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    )}
                  >
                    <span className="text-xs font-black block truncate">{c.label}</span>
                    <span className="text-[10px] text-amber-400 block">{c.stars}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Footer for Step 2 */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-[48px] px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zurück zum Foto</span>
              </button>

              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(3)}
                className={cn(
                  "flex-1 min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer",
                  !name.trim() ? "bg-white/10 text-neutral-500 cursor-not-allowed" : themePrimaryButton
                )}
              >
                <span>Weiter zu Schritt 3: {isSell ? "Preis festlegen" : isTrade ? "Tauschwert" : "Budget"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 💰 SCHRITT 3: PREIS & TAUSCHKONDITIONEN                  */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          {/* Left Column: Live Slab Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {renderSlab(false)}
          </div>

          {/* Right Column: Pricing & Trade Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* If Sell: Price Controls */}
            {isSell && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Kaufpreis festlegen
                </h4>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Verkaufspreis (€) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white text-lg font-black focus:border-emerald-400 outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
                      €
                    </span>
                  </div>
                </div>

                {/* Quick Budget Chips */}
                <div>
                  <span className="block text-[11px] text-neutral-400 mb-2">Schnellwahl:</span>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_BUDGETS.slice(0, 5).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setPrice(q.replace(/[^0-9]/g, ""))}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs cursor-pointer min-h-[36px]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allow Offers Toggle */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Gegengebote zulassen</p>
                    <p className="text-[10px] text-neutral-400">
                      Käufer können dir faire Gegenangebote vorschlagen.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowOffers}
                    onChange={(e) => setAllowOffers(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer min-h-[44px] min-w-[24px]"
                  />
                </div>
              </div>
            )}

            {/* If Trade: Trade Value & Wants */}
            {isTrade && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" /> Tauschwert & Wünsche
                </h4>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Geschätzter Tauschwert (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={estimatedTradeValue}
                      onChange={(e) => setEstimatedTradeValue(e.target.value)}
                      placeholder="z.B. 120"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white text-lg font-black focus:border-purple-400 outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
                      €
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Was suchst du dafür? (Suchwünsche / Wants)
                  </label>
                  <textarea
                    rows={3}
                    value={lookingForWants}
                    onChange={(e) => setLookingForWants(e.target.value)}
                    placeholder="z.B. Glurak VMAX, Vintage Holos, Evoli-Entwicklungen..."
                    className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* If Looking For: Budget */}
            {isLookingFor && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" /> Dein Wunschbudget
                </h4>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Maximales Budget oder Preisvorstellung
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="z.B. 45 €, bis 100 €, VB"
                    className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Optional Description */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-2">
              <label className="block text-xs font-bold text-white">
                Optionale Beschreibung / Besonderheiten
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="z.B. First Edition, im Toploader gelagert, tierfreier Nichtraucherhaushalt..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Navigation Footer for Step 3 */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="min-h-[48px] px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zurück zu Details</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className={cn(
                  "flex-1 min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer",
                  themePrimaryButton
                )}
              >
                <span>Weiter zu Schritt 4: Vorschau & Veröffentlichen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🚀 SCHRITT 4: VORSCHAU & VERÖFFENTLICHEN                */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          {/* Left Column: Full Live Slab Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {renderSlab(false)}
          </div>

          {/* Right Column: Final Settings & Publication */}
          <div className="lg:col-span-7 space-y-5">
            {/* Additional Media (Photos / Video) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-white">
                Weitere Detail-Fotos (optional)
              </label>
              {photos.map((p, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={p}
                    onChange={(e) => handleUpdatePhoto(idx, e.target.value)}
                    placeholder={`Bild-URL ${idx + 1}`}
                    className="flex-1 bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white text-xs truncate"
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
                  className="text-xs text-cyan-400 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Weiteres Bild hinzufügen
                </button>
              )}

              <div className="pt-2">
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
            </div>

            {/* Discord Alert Switch */}
            <div className="p-4 rounded-2xl bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-between">
              <div className="pr-2">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#5865F2]" />
                  Discord Bot-Alert aktivieren
                </p>
                <p className="text-[10px] text-neutral-300">
                  Sendet sofort eine Inserat-Meldung in den offiziellen Discord #marktplatz.
                </p>
              </div>
              <input
                type="checkbox"
                checked={postToDiscord}
                onChange={(e) => setPostToDiscord(e.target.checked)}
                className="w-5 h-5 accent-[#5865F2] rounded cursor-pointer min-h-[44px] min-w-[20px]"
              />
            </div>

            {/* Discord Name Switch */}
            <div className="p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/25 flex items-center justify-between">
              <div className="pr-2">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#5865F2]" />
                  Discord-Name auf Inserat anzeigen
                </p>
                <p className="text-[10px] text-neutral-300">
                  Zeigt deinen verknüpften Discord-Tag auf der Karte an, damit Interessenten dich direkt finden.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showDiscordName}
                onChange={(e) => setShowDiscordName(e.target.checked)}
                className="w-5 h-5 accent-[#5865F2] rounded cursor-pointer min-h-[44px] min-w-[20px]"
              />
            </div>

            {/* Final Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isSubmitting || !name.trim()}
                  onClick={() => handleSubmit(undefined, true)}
                  className="sm:w-1/3 min-h-[48px] rounded-xl font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Tag className="w-4 h-4" />
                  <span>Als Entwurf</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !name.trim()}
                  onClick={() => handleSubmit(undefined, false)}
                  className={cn(
                    "flex-1 min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer",
                    isSubmitting ? "opacity-75 cursor-wait" : themePrimaryButton
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Inserat wird veröffentlicht...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Jetzt veröffentlichen</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-neutral-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Zurück zu Schritt 3
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
