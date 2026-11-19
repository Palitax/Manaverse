"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ListingType,
  CardLanguage,
  CardCondition,
  PokemonApiCard,
} from "@/types";
import { useStore } from "@/lib/store";
import { compressCardImage, uploadCardPhoto } from "@/lib/supabase/storage";
import { studioTheme, listingTheme, BTN_SECONDARY } from "@/lib/design-system";
import { FlagSwatch, getLanguageCode } from "@/components/ui/language-tag";
import { toast } from "@/components/ui/toast";
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
  Camera,
  Coins,
  Send,
  FileText,
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

const LANGUAGES: { value: CardLanguage; label: string }[] = [
  { value: "DE", label: "Deutsch" },
  { value: "EN", label: "Englisch" },
  { value: "JP", label: "Japanisch" },
  { value: "KR", label: "Koreanisch" },
  { value: "CN", label: "Chinesisch" },
  { value: "Egal", label: "Beliebig" },
  { value: "OTHER", label: "Sonstige" },
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
      toast.error("Bitte lade eine Bilddatei hoch", "Unterstützt werden PNG, JPG und WEBP.");
      return;
    }

    let previewDataUrl = "";
    let uploadBlob: Blob | File = file;

    try {
      const compressed = await compressCardImage(file);
      previewDataUrl = compressed.dataUrl;
      uploadBlob = compressed.blob;
    } catch {
      previewDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve((ev.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });
    }

    if (!previewDataUrl) return;

    // Sofortige Vorschau im Slab anzeigen
    setPhotos([previewDataUrl]);
    setSubmitError(null);
    setIsScanning(true);
    setScanMessage("KI-Kartenanalyse läuft... Lese Pokémon, Set-Kürzel & Nummer...");
    setDetectedSummary(null);

    // Parallel im Hintergrund in Supabase Storage ('card-photos') hochladen, falls angemeldet
    if (currentUser?.id) {
      uploadCardPhoto(uploadBlob, currentUser.id)
        .then((publicUrl) => {
          if (publicUrl) {
            setPhotos((prev) =>
              prev[0] === previewDataUrl ? [publicUrl, ...prev.slice(1)] : prev
            );
          }
        })
        .catch(() => {
          // Wird beim Veröffentlichen erneut versucht oder nutzt das komprimierte Bild
        });
    }

    try {
      const storedKey = typeof window !== "undefined" ? localStorage.getItem("manaverse_gemini_api_key") || "" : "";
      const res = await fetch("/api/ai/scan-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: previewDataUrl,
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
            setScanMessage("Karte erfolgreich per KI erkannt");
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

  // UX State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeCondition =
    CONDITIONS.find((c) => c.value === condition) || CONDITIONS[0];
  const activeLanguage =
    LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  // Set & Language cross-validation and auto-detection
  const handleSetChange = (val: string) => {
    setSetNameText(val);
    if (!val.trim()) return;
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

  // Auto-detect promo set code from card number e.g. "070/XY-P", "227/S-P", "288/SM-P"
  const handleCardNumberChange = (val: string) => {
    setCardNumber(val);
    if (val.includes("/")) {
      const suffix = val.split("/")[1]?.trim() || "";
      if (/[A-Za-z]/.test(suffix)) {
        const promoSet = findSetByCode(suffix);
        if (promoSet) {
          if (!setNameText.trim()) setSetNameText(promoSet.code);
          setLanguage(promoSet.language);
        }
      }
    }
  };

  const setValidation = React.useMemo(() => {
    if (!setNameText.trim()) return { isValid: true, detectedLang: null };
    return validateSetWithLanguage(setNameText, language);
  }, [setNameText, language]);

  const handleSelectApiCard = (card: PokemonApiCard) => {
    const chosenName = card.language === "DE" && card.nameDe ? card.nameDe : card.name;
    setName(chosenName);
    if (card.set?.id) {
      setSetNameText(card.set.id);
    } else if (card.set?.name) {
      setSetNameText(card.set.name);
    }
    if (card.number !== undefined) setCardNumber(card.number);
    if (card.language) {
      setLanguage(card.language);
    } else {
      const detected = detectSetLanguage(card.set?.id || card.set?.name || "");
      if (detected) setLanguage(detected);
    }
    // Only replace photo if no custom photo uploaded yet
    if (!photos[0] || photos[0].startsWith("http") || photos[0].startsWith("/")) {
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
    setSubmitError(null);
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
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Das Inserat konnte nicht veröffentlicht werden. Bitte versuche es erneut."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color schemes based on active type
  const isSell = type === "sell";
  const isTrade = type === "trade";
  const isLookingFor = type === "looking_for";

  // Einheitliches Mode-System (Verkaufen = Smaragd, Tauschen = Violett, Gesucht = Orange)
  const theme = studioTheme(type);
  const previewTheme = listingTheme(type);
  const themeAccentBg = theme.soft;
  const themePrimaryButton = cn(theme.solid, theme.shadow);
  const inputFocus = theme.focus;

  if (isSuccess) {
    return (
      <div className={cn(
        "w-full p-8 sm:p-12 rounded-3xl bg-surface-1 border border-hairline-strong text-center space-y-4 shadow-2xl relative overflow-hidden panel-rise"
      )}>
        <div className={cn(
          "w-20 h-20 rounded-full border flex items-center justify-center mx-auto",
          isDraftSaved
            ? "bg-white/[0.04] text-ink border-hairline-strong"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
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
              Dein Inserat für <strong className="text-white">{name}</strong> ist ab sofort live im Manaforge-Marktplatz
              {postToDiscord && " und wurde im Discord gepostet"}.
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
            className={cn("px-6 py-3 rounded-xl font-black text-xs transition-colors min-h-[44px] cursor-pointer inline-flex items-center gap-1.5", theme.solid)}
          >
            <Plus className="w-4 h-4" /> Weiteres Inserat erstellen
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className={cn("px-5 py-3 rounded-xl font-bold text-xs min-h-[44px] cursor-pointer", BTN_SECONDARY)}
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
                {activeCondition.label.toUpperCase()} · {getLanguageCode(language)}
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
              isDragging && "ring-2 ring-white/60 ring-offset-2 ring-offset-black scale-[1.01]"
            )}
            title={interactiveUpload ? "Klicken oder Bild hier ablegen zum Hochladen & Scannen" : undefined}
          >
            {/* AI Scanning Visual Laser & Grid Overlay */}
            {isScanning && (
              <>
                <div className="ai-scan-laser-beam" />
                <div className="ai-scan-grid-overlay" />
                <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white animate-pulse">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-black text-white">KI-Scan läuft...</p>
                  <p className="text-[10px] text-white/75 leading-tight">
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
              <div className="aspect-[2.5/3.5] flex flex-col items-center justify-center text-neutral-400 gap-3 bg-black/60 rounded-lg p-4 text-center border-2 border-dashed border-white/20 hover:border-white/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-ink">
                  <Camera className="w-6 h-6" />
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
                <span className={cn("text-base font-black truncate block tabular-nums", previewTheme.text)}>
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
                tabIndex={-1}
                className={cn(
                  "text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-default inline-flex items-center gap-1",
                  previewTheme.solid
                )}
              >
                {isSell ? <Zap className="w-3 h-3" /> : isTrade ? <Scale className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                {isSell ? "Kaufen" : isTrade ? "Tauschen" : "Habe ich"}
              </button>
            </div>

            {/* Quick Action Preview Buttons for sell cards */}
            {isSell && (
              <div className="space-y-1.5 pt-0.5">
                {allowOffers && (
                  <div className={cn("w-full py-1.5 px-3 rounded-xl border font-bold text-[11px] text-center flex items-center justify-center gap-1.5", previewTheme.soft)}>
                    <Tag className="w-3 h-3" />
                    Angebot machen
                  </div>
                )}
                <div className={cn("w-full py-1.5 px-3 rounded-xl font-bold text-[11px] text-center flex items-center justify-center gap-1.5", BTN_SECONDARY)}>
                  <MessageSquare className="w-3.5 h-3.5" />
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
        "relative w-full rounded-3xl border border-hairline-strong bg-surface-1/95 backdrop-blur-2xl overflow-hidden transition-all duration-300",
        mode === "inline" ? "p-4 sm:p-7 my-6" : "p-4 sm:p-8 lg:p-10",
        className
      )}
    >
      {/* Akzent-Hairline im aktiven Bereichston */}
      <div className={cn("absolute inset-x-0 top-0 h-px opacity-70", theme.fill)} />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0", themeAccentBg)}>
            <theme.icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isSell
                ? "Karte zum Verkauf einstellen"
                : isTrade
                ? "Karte zum Tausch anbieten"
                : "Gesuch aufgeben"}
            </h2>
            <p className="text-xs text-ink-subtle mt-0.5">
              In 4 Schritten zum Inserat – mit automatischer KI-Kartenerkennung
            </p>
          </div>
        </div>

        {/* Action Controls / Close button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn("px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 min-h-[44px] cursor-pointer", BTN_SECONDARY)}
            >
              <X className="w-4 h-4" />
              <span>Schließen</span>
            </button>
          )}
        </div>
      </div>

      {/* Step Progress Indicator Bar (Steps 1 to 4) */}
      <div className="relative z-10 mb-6 p-3 sm:p-4 rounded-2xl bg-surface-2 border border-hairline">
        <div className="flex items-center justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn("w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0", themeAccentBg)}>
              {step === 1 && <Camera className="w-3.5 h-3.5" />}
              {step === 2 && <Search className="w-3.5 h-3.5" />}
              {step === 3 && (isSell ? <Coins className="w-3.5 h-3.5" /> : isTrade ? <Scale className="w-3.5 h-3.5" /> : <Target className="w-3.5 h-3.5" />)}
              {step === 4 && <Send className="w-3.5 h-3.5" />}
            </span>
            <span className="font-black text-ink whitespace-nowrap">Schritt {step} von 4</span>
            <span className="text-ink-subtle font-semibold truncate hidden sm:inline">
              {step === 1 && "· Foto & KI-Scan"}
              {step === 2 && "· Kartendetails"}
              {step === 3 && (isSell ? "· Verkaufspreis" : isTrade ? "· Tauschwert & Wünsche" : "· Dein Budget")}
              {step === 4 && "· Vorschau & Veröffentlichen"}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-ink-subtle tabular-nums">
            {Math.round((step / 4) * 100)}%
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden flex">
          <div
            className={cn("h-full rounded-full transition-all duration-300", theme.fill)}
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Interactive Step Chips */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-[11px]">
          {[
            { num: 1, label: "Foto" },
            { num: 2, label: "Details" },
            { num: 3, label: isSell ? "Preis" : isTrade ? "Tausch" : "Budget" },
            { num: 4, label: "Abschluss" },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              disabled={s.num > step && !name.trim() && !photos[0]}
              onClick={() => setStep(s.num)}
              className={cn(
                "py-1.5 px-2 rounded-lg font-semibold text-center transition-colors min-h-[40px] flex items-center justify-center gap-1 truncate cursor-pointer disabled:cursor-not-allowed",
                step === s.num
                  ? "bg-white/[0.08] text-ink border border-hairline-strong"
                  : step > s.num
                  ? "text-ink-muted border border-hairline hover:text-ink"
                  : "text-ink-subtle border border-transparent"
              )}
            >
              {step > s.num ? <CheckCircle2 className={cn("w-3 h-3 flex-shrink-0", theme.text)} /> : <span className="tabular-nums opacity-60">{s.num}</span>}
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SCHRITT 1: FOTO-UPLOAD & KI-SCAN (FOKUS AUF DIE SLAB) */}
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
                  ? "bg-white/[0.04] border-hairline-strong text-ink-muted"
                  : detectedSummary
                  ? "bg-emerald-500/[0.06] border-emerald-500/30 text-emerald-300 font-bold"
                  : "bg-white/[0.04] border-hairline text-ink"
              )}
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin text-ink-muted flex-shrink-0" />
              ) : detectedSummary ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Camera className="w-4 h-4 text-ink-muted flex-shrink-0" />
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
                className="text-xs text-ink-subtle hover:text-ink font-semibold underline underline-offset-4 decoration-white/20 transition-colors cursor-pointer min-h-[44px]"
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
                      className="flex-1 bg-surface-2 border border-hairline rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => toast.success("API-Key im Browser gespeichert")}
                      className={cn("px-3 py-2 rounded-xl font-bold text-xs min-h-[40px]", BTN_SECONDARY)}
                    >
                      Speichern
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
      {/* SCHRITT 2: KARTENDETAILS & IDENTITÄT                  */}
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
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-2">
              <label className="block text-xs font-bold text-white">
                Pokémon-Kartenname *
              </label>
              <PokemonSearchInput
                value={name}
                onChange={setName}
                onSelectCard={handleSelectApiCard}
                language={language}
                setHint={setNameText}
                keepCleanNameOnSelect
                placeholder="z.B. Pikachu 070/XY-P, Glurak ex, リザードン, Moonbreon..."
              />
              <p className="text-[11px] text-neutral-400">
                Durchsucht den kompletten japanischen (27.000+ Karten) & internationalen TCG-Index nach Name, Nummer oder Set.
              </p>
            </div>

            {/* Set & Number Identification */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Set-Kürzel / Edition
                  </label>
                  <input
                    type="text"
                    value={setNameText}
                    onChange={(e) => handleSetChange(e.target.value)}
                    placeholder="z.B. XY-P, SV2a, S6a, JTG, MEW"
                    className={"w-full bg-surface-2 border border-hairline rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold outline-none transition-colors min-h-[44px] " + inputFocus}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Kartennummer
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="z.B. 070/XY-P oder 201/165"
                    className={"w-full bg-surface-2 border border-hairline rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold outline-none transition-colors min-h-[44px] " + inputFocus}
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
                      className="mt-1 px-3 min-h-[36px] rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black text-[11px] cursor-pointer"
                    >
                      Karte auf {setValidation.detectedLang} setzen
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-2.5">
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
                        ? "bg-white/[0.08] border-white/40 text-ink"
                        : "bg-white/[0.02] border-hairline text-ink-subtle hover:text-ink hover:border-hairline-strong"
                    )}
                  >
                    <span>{l.label}</span>
                    <FlagSwatch lang={l.value} />
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-2.5">
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
                        ? "bg-white/[0.08] border-white/40 text-ink"
                        : "bg-white/[0.02] border-hairline text-ink-subtle hover:text-ink hover:border-hairline-strong"
                    )}
                  >
                    <span className="text-xs font-black block truncate">{c.label}</span>
                    <span className="text-[10px] text-ink-subtle tracking-[0.1em] block">{c.stars}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Footer for Step 2 */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={cn("min-h-[48px] px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer", BTN_SECONDARY)}
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
      {/* SCHRITT 3: PREIS & TAUSCHKONDITIONEN                  */}
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
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Coins className={cn("w-4 h-4", theme.text)} /> Kaufpreis festlegen
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
                      className={cn("w-full bg-surface-2 border border-hairline rounded-xl pl-4 pr-10 py-3 text-white text-lg font-black outline-none tabular-nums", inputFocus)}
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
                    className={cn("w-5 h-5 rounded cursor-pointer min-h-[44px] min-w-[24px]", theme.accent)}
                  />
                </div>
              </div>
            )}

            {/* If Trade: Trade Value & Wants */}
            {isTrade && (
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Scale className={cn("w-4 h-4", theme.text)} /> Tauschwert & Wünsche
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
                      className={cn("w-full bg-surface-2 border border-hairline rounded-xl pl-4 pr-10 py-3 text-white text-lg font-black outline-none tabular-nums", inputFocus)}
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
                    className={cn("w-full bg-surface-2 border border-hairline rounded-xl p-3 text-white text-xs outline-none", inputFocus)}
                  />
                </div>
              </div>
            )}

            {/* If Looking For: Budget */}
            {isLookingFor && (
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className={cn("w-4 h-4", theme.text)} /> Dein Wunschbudget
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
                    className={cn("w-full bg-surface-2 border border-hairline rounded-xl px-4 py-3 text-white text-sm font-bold outline-none", inputFocus)}
                  />
                </div>
              </div>
            )}

            {/* Optional Description */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-2">
              <label className="block text-xs font-bold text-white">
                Optionale Beschreibung / Besonderheiten
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="z.B. First Edition, im Toploader gelagert, tierfreier Nichtraucherhaushalt..."
                className={cn("w-full bg-surface-2 border border-hairline rounded-xl p-3 text-white text-xs outline-none", inputFocus)}
              />
            </div>

            {/* Navigation Footer for Step 3 */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className={cn("min-h-[48px] px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer", BTN_SECONDARY)}
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
      {/* SCHRITT 4: VORSCHAU & VERÖFFENTLICHEN                */}
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
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-hairline space-y-3">
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
                    className="flex-1 bg-surface-2 border border-hairline rounded-xl px-3 py-2 text-white text-xs truncate min-h-[40px] outline-none focus:border-hairline-strong"
                  />
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      aria-label="Bild entfernen"
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl"
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
                  className={cn("text-xs font-semibold flex items-center gap-1 cursor-pointer min-h-[40px]", theme.text)}
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
                  className="w-full bg-surface-2 border border-hairline rounded-xl px-3 py-2 text-white text-xs min-h-[40px] outline-none focus:border-hairline-strong"
                />
              </div>
            </div>

            {/* Discord-Einstellungen */}
            <div className="rounded-2xl bg-surface-2 border border-hairline divide-y divide-white/[0.06]">
              <SettingToggle
                title="Im Discord posten"
                description="Sendet dein Inserat automatisch in den passenden Manaforge-Discord-Kanal."
                checked={postToDiscord}
                onChange={setPostToDiscord}
              />
              <SettingToggle
                title="Discord-Namen anzeigen"
                description="Zeigt deinen Discord-Tag auf der Karte, damit Interessenten dich direkt finden."
                checked={showDiscordName}
                onChange={setShowDiscordName}
              />
            </div>

            {/* Final Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isSubmitting || !name.trim()}
                  onClick={() => handleSubmit(undefined, true)}
                  className={cn("sm:w-1/3 min-h-[48px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50", BTN_SECONDARY)}
                >
                  <FileText className="w-4 h-4" />
                  <span>Als Entwurf speichern</span>
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

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 p-4 cursor-pointer min-h-[64px]">
      <span className="min-w-0">
        <span className="text-xs font-bold text-ink flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-discord fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          {title}
        </span>
        <span className="text-[11px] text-ink-subtle leading-relaxed block mt-0.5">{description}</span>
      </span>
      <span className="relative inline-flex flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="w-10 h-6 rounded-full bg-white/[0.1] border border-hairline-strong peer-checked:bg-discord peer-checked:border-discord transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/40"
        />
        <span
          aria-hidden
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"
        />
      </span>
    </label>
  );
}
