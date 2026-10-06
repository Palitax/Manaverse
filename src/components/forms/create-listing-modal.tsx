"use client";

import React, { useState, useEffect } from "react";
import { ListingType, CardLanguage, CardCondition, PokemonApiCard } from "@/types";
import { useStore } from "@/lib/store";
import {
  X,
  Sparkles,
  Plus,
  Image as ImageIcon,
  Send,
  Film,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowLeftRight,
  Tag,
  DollarSign,
  Info,
  SlidersHorizontal,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { PokemonSearchInput } from "./pokemon-search-input";

interface CreateListingModalProps {
  initialType?: ListingType;
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES: { value: CardLanguage; label: string; short: string }[] = [
  { value: "DE", label: "Deutsch", short: "DE" },
  { value: "EN", label: "Englisch", short: "EN" },
  { value: "JP", label: "Japanisch", short: "JP" },
  { value: "Egal", label: "Beliebig", short: "Egal" },
  { value: "OTHER", label: "Sonstige", short: "Andere" },
];

const CONDITIONS: { value: CardCondition; label: string; desc: string; color: string }[] = [
  { value: "NM", label: "Near Mint (NM)", desc: "Wie neu, makellos", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { value: "EX", label: "Excellent (EX)", desc: "Minimale Spielspuren", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "GD", label: "Good (GD)", desc: "Leichte Abnutzung", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { value: "LP", label: "Light Played (LP)", desc: "Sichtbare Spielspuren", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { value: "PL", label: "Played (PL)", desc: "Deutlich bespielt", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { value: "PO", label: "Poor (PO)", desc: "Stark beschädigt", color: "text-red-400 border-red-500/30 bg-red-500/10" },
  { value: "Egal", label: "Beliebig (Egal)", desc: "Jeder Zustand akzeptabel", color: "text-neutral-300 border-white/20 bg-white/5" },
];

const QUICK_BUDGET_SUGGESTIONS = [
  "VB",
  "Marktwert",
  "10 - 25 €",
  "25 - 50 €",
  "50 - 100 €",
  "100+ €",
];

export function CreateListingModal({
  initialType = "looking_for",
  isOpen,
  onClose,
}: CreateListingModalProps) {
  const { addListing, currentUser } = useStore();

  const [type, setType] = useState<ListingType>(initialType);
  const [name, setName] = useState("");
  const [setNameText, setSetNameText] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [language, setLanguage] = useState<CardLanguage>("DE");
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [photos, setPhotos] = useState<string[]>([""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [priceRange, setPriceRange] = useState("");
  const [estimatedTradeValue, setEstimatedTradeValue] = useState<number | undefined>(undefined);
  const [lookingForWants, setLookingForWants] = useState("");
  const [allowOffers, setAllowOffers] = useState(true);
  const [postToDiscord, setPostToDiscord] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mobile multi-step state (1 to 4)
  const [mobileStep, setMobileStep] = useState<number>(1);
  const [showManualFields, setShowManualFields] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setMobileStep(1);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSelectApiCard = (card: PokemonApiCard) => {
    setName(card.name);
    setSetNameText(card.set.name);
    if (card.number) setCardNumber(card.number);
    if (card.images?.large) {
      setPhotos([card.images.large]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

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
        price: type === "sell" ? Number(price) : undefined,
        priceRange: type === "looking_for" ? priceRange.trim() || "VB" : undefined,
        estimatedTradeValue: type === "trade" ? Number(estimatedTradeValue) : undefined,
        lookingForWants: type === "trade" ? lookingForWants.trim() : undefined,
        allowOffers,
        postToDiscord,
      });

      onClose();
    } catch (err) {
      console.error("Fehler beim Erstellen des Listings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper colors based on active listing type
  const isLookingFor = type === "looking_for";
  const isSell = type === "sell";
  const isTrade = type === "trade";

  const themeAccentColor = isLookingFor
    ? "text-cyan-400"
    : isSell
    ? "text-emerald-400"
    : "text-purple-400";

  const themeBgBadge = isLookingFor
    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
    : isSell
    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
    : "bg-purple-500/10 text-purple-300 border-purple-500/30";

  const themeSubmitGradient = isLookingFor
    ? "bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 shadow-cyan-600/30 hover:shadow-cyan-600/50"
    : isSell
    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-600/30 hover:shadow-emerald-600/50"
    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-purple-600/30 hover:shadow-purple-600/50";

  return (
    <>
      {/* ======================================================== */}
      {/* 📱 MOBILE VIEW: STEP-BY-STEP ERSTELLUNGS-FLOW ( < md )  */}
      {/* ======================================================== */}
      <div className="fixed inset-0 z-50 flex flex-col bg-[#080b12] text-white md:hidden h-[100dvh] overflow-hidden">
        {/* Top Header & Progress */}
        <div className="flex-shrink-0 bg-[#0e1320] border-b border-white/10 px-4 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border ${themeBgBadge}`}>
                {isLookingFor ? "Gesuch" : isSell ? "Verkauf" : "Tausch"}
              </span>
              <h2 className="text-sm font-black text-white">
                {mobileStep === 1 && "1. Karte auswählen"}
                {mobileStep === 2 && "2. Zustand & Sprache"}
                {mobileStep === 3 && (isLookingFor ? "3. Dein Budget" : isSell ? "3. Verkaufspreis" : "3. Tauschwert")}
                {mobileStep === 4 && "4. Details & Abschluss"}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Schließen"
              className="p-2 -mr-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar & Steps */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] text-neutral-400">
              <span>Schritt {mobileStep} von 4</span>
              <span className="font-semibold text-neutral-300">
                {mobileStep === 1 && "Pokémon-Auswahl"}
                {mobileStep === 2 && "Kriterien"}
                {mobileStep === 3 && (isLookingFor ? "Preisvorstellung" : "Wert")}
                {mobileStep === 4 && "Veröffentlichen"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isLookingFor
                    ? "bg-gradient-to-r from-cyan-500 to-sky-400"
                    : isSell
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-purple-500 to-indigo-400"
                }`}
                style={{ width: `${(mobileStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* STEP 1: Karte & Edition */}
          {mobileStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                <p className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-cyan-400" />
                  Welche Karte suchst du?
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Tippe den Namen ein, um die Karte samt Artwork und Set auszuwählen.
                </p>
              </div>

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
              </div>

              {/* Card Preview if selected */}
              {name && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-14 h-20 bg-neutral-900 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center">
                    {photos[0] ? (
                      <img src={photos[0]} alt={name} className="w-full h-full object-contain" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{name}</p>
                    <p className="text-xs text-neutral-400 truncate">
                      {setNameText || "Kein Set angegeben"} {cardNumber ? `• #${cardNumber}` : ""}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowManualFields(!showManualFields)}
                      className="mt-1.5 text-[11px] text-cyan-400 font-semibold hover:underline block"
                    >
                      {showManualFields ? "Details einklappen" : "Set & Kartennummer anpassen"}
                    </button>
                  </div>
                </div>
              )}

              {/* Collapsible manual fields */}
              {(showManualFields || !photos[0]) && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="text-xs font-bold text-neutral-300">Manuelle Editions-Angaben</p>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Set-Name</label>
                    <input
                      type="text"
                      value={setNameText}
                      onChange={(e) => setSetNameText(e.target.value)}
                      placeholder="z.B. 151, Paldea Evolved, Base Set..."
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Kartennummer</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="z.B. 199/165"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Zustand & Sprache */}
          {mobileStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  Gewünschte Sprache *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => {
                    const isSelected = language === lang.value;
                    return (
                      <button
                        type="button"
                        key={lang.value}
                        onClick={() => setLanguage(lang.value)}
                        className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                            : "bg-[#111624] border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <span>{lang.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  Zustand der Karte *
                </label>
                <div className="space-y-2">
                  {CONDITIONS.map((cond) => {
                    const isSelected = condition === cond.value;
                    return (
                      <button
                        type="button"
                        key={cond.value}
                        onClick={() => setCondition(cond.value)}
                        className={`w-full min-h-[48px] p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-white/10 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                            : "bg-[#111624] border-white/10 text-neutral-300 hover:bg-white/5"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${cond.color}`}>
                              {cond.label.split(" ")[0]}
                            </span>
                            <span className="text-xs font-bold text-white">{cond.label}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{cond.desc}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Preisvorstellung */}
          {mobileStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              {isLookingFor && (
                <>
                  <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                    <p className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      Dein Budget oder Preisspanne
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Gib an, wie viel du maximal zahlen möchtest oder tippe auf eine Schnellauswahl.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Wunschpreis / Spanne
                    </label>
                    <input
                      type="text"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="z.B. 40 - 60 € oder VB"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Quick Select Chips */}
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                      Schnellauswahl zum Antippen:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_BUDGET_SUGGESTIONS.map((sugg) => (
                        <button
                          type="button"
                          key={sugg}
                          onClick={() => setPriceRange(sugg)}
                          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            priceRange === sugg
                              ? "bg-cyan-500 text-black border-cyan-400 font-black"
                              : "bg-[#111624] text-neutral-300 border-white/10 hover:border-cyan-500/40"
                          }`}
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allow Offers Toggle */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Angebote von Sammlern zulassen</p>
                      <p className="text-[11px] text-neutral-400">
                        Sammler können dir auch alternative Gegenangebote machen
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowOffers}
                      onChange={(e) => setAllowOffers(e.target.checked)}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Sell pricing on mobile if accessed */}
              {isSell && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Verkaufspreis (€) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={price !== undefined ? price : ""}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="z.B. 45"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Preisvorschläge zulassen</p>
                      <p className="text-[11px] text-neutral-400">Käufer dürfen dir Rabattangebote senden</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowOffers}
                      onChange={(e) => setAllowOffers(e.target.checked)}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Trade pricing on mobile if accessed */}
              {isTrade && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Geschätzter Tauschwert (€) *
                    </label>
                    <input
                      type="number"
                      value={estimatedTradeValue !== undefined ? estimatedTradeValue : ""}
                      onChange={(e) => setEstimatedTradeValue(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="z.B. 120"
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Was suchst du dafür?
                    </label>
                    <input
                      type="text"
                      value={lookingForWants}
                      onChange={(e) => setLookingForWants(e.target.value)}
                      placeholder="z.B. Glurak Holos, SARs, Vintage Karten..."
                      className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Details & Veröffentlichung */}
          {mobileStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              {/* Summary Card Preview */}
              <div className="p-3.5 rounded-2xl bg-[#0f1422] border border-cyan-500/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Vorschau deines Gesuchs
                </span>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-16 bg-neutral-900 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center">
                    {photos[0] ? (
                      <img src={photos[0]} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white truncate">{name || "Pokémon-Karte"}</h3>
                    <p className="text-xs text-neutral-400 truncate">
                      {setNameText || "Set"} {cardNumber ? `• #${cardNumber}` : ""}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                        {language}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {condition}
                      </span>
                      <span className="text-xs font-black text-cyan-400 ml-auto">
                        {isLookingFor ? priceRange || "VB" : isSell ? `${price || 0} €` : `~${estimatedTradeValue || 0} €`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Notizen & Besonderheiten (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="z.B. Suche Karte mit Holo-Swirl, gut zentriert oder als PSA-Kandidat..."
                  rows={3}
                  className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Discord Sync Switch */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Im Discord #gesuche posten</p>
                    <p className="text-[10px] text-neutral-400">
                      Benachrichtigt sofort hunderte Sammler in der Community
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={postToDiscord}
                  onChange={(e) => setPostToDiscord(e.target.checked)}
                  className="w-5 h-5 accent-indigo-500 cursor-pointer ml-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Bottom Navigation Bar (min 44px touch targets) */}
        <div className="flex-shrink-0 p-3 bg-[#0d121f] border-t border-white/10 flex gap-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          {mobileStep > 1 ? (
            <button
              type="button"
              onClick={() => setMobileStep((prev) => Math.max(1, prev - 1))}
              className="min-h-[48px] px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" /> Zurück
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-4 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-400 font-bold text-xs flex items-center justify-center transition-all active:scale-95"
            >
              Abbrechen
            </button>
          )}

          {mobileStep < 4 ? (
            <button
              type="button"
              disabled={mobileStep === 1 && !name.trim()}
              onClick={() => setMobileStep((prev) => Math.min(4, prev + 1))}
              className={`flex-1 min-h-[48px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg ${
                mobileStep === 1 && !name.trim()
                  ? "bg-white/10 text-neutral-500 cursor-not-allowed"
                  : themeSubmitGradient
              }`}
            >
              Weiter zu Schritt {mobileStep + 1}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || !name.trim()}
              onClick={() => handleSubmit()}
              className={`flex-1 min-h-[48px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl text-white ${
                isSubmitting ? "opacity-75 cursor-wait" : themeSubmitGradient
              }`}
            >
              {isSubmitting ? (
                "Wird veröffentlicht..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Gesuch jetzt veröffentlichen
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🖥️ DESKTOP VIEW: 2-SPALTEN LAYOUT MIT LIVE-VORSCHAU ( >= md ) */}
      {/* ======================================================== */}
      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-5xl my-6 rounded-3xl glass-panel p-6 border border-white/15 shadow-2xl bg-[#0b0f1a] max-h-[92vh] overflow-y-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl border ${themeBgBadge}`}>
                {isLookingFor ? (
                  <Search className="w-5 h-5 text-cyan-400" />
                ) : isSell ? (
                  <Tag className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowLeftRight className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  {isLookingFor ? "Neues Gesuch aufgeben" : isSell ? "Karte verkaufen" : "Tausch-Inserat erstellen"}
                </h2>
                <p className="text-xs text-neutral-400">
                  {isLookingFor
                    ? "Schreibe dein Kartengesuch aus und erreiche Sammler auf Whatnot & Discord"
                    : "Stelle deine Karte für die Community zum Verkauf oder Tausch ein"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Schließen"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 my-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setType("looking_for")}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                type === "looking_for"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Gesucht (Want)
            </button>
            <button
              type="button"
              onClick={() => setType("sell")}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                type === "sell"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Tag className="w-3.5 h-3.5" /> Verkaufen
            </button>
            <button
              type="button"
              onClick={() => setType("trade")}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                type === "trade"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Tauschen
            </button>
          </div>

          {/* Form Content: 2 Columns */}
          <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6 mt-4">
            {/* Left Column: Live Card Preview & Tips (5 Columns) */}
            <div className="col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-[#101524] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className={`w-3.5 h-3.5 ${themeAccentColor}`} /> Live-Vorschau
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${themeBgBadge}`}>
                    {isLookingFor ? "Gesuch" : isSell ? "Verkauf" : "Tausch"}
                  </span>
                </div>

                {/* Card Mockup Visual */}
                <div className="relative aspect-[3/4] w-full max-w-[260px] mx-auto rounded-2xl overflow-hidden bg-[#0a0d16] border border-white/15 flex items-center justify-center shadow-xl group">
                  {photos[0] ? (
                    <img
                      src={photos[0]}
                      alt={name || "Kartenvorschau"}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-6 text-neutral-500 space-y-2">
                      <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-cyan-400" />
                      <p className="text-xs font-medium">Karte oben suchen für automatisches Artwork</p>
                    </div>
                  )}

                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                </div>

                {/* Meta details below card image */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div>
                    <h3 className="text-base font-black text-white truncate">
                      {name || "Kartenname auswählen"}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">
                      {setNameText || "Set Name"} {cardNumber ? `• #${cardNumber}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-neutral-300">
                        {language}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {condition}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">
                        {isLookingFor ? "Budget" : isSell ? "Preis" : "Tauschwert"}
                      </span>
                      <span className={`text-base font-black ${themeAccentColor}`}>
                        {isLookingFor
                          ? priceRange || "VB"
                          : isSell
                          ? `${price !== undefined ? `${price} €` : "0 €"}`
                          : `~${estimatedTradeValue !== undefined ? `${estimatedTradeValue} €` : "0 €"}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Helpful Tips Card */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-neutral-300 space-y-1.5">
                <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" /> Manaforge Sammler-Tipp
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Gesuche mit einer konkreten Preisspanne (z.B. „40 - 60 €“) und flexiblen Kriterien erhalten
                  im Schnitt dreimal schneller Angebote von Sammlern.
                </p>
              </div>
            </div>

            {/* Right Column: Structured Form Fields (7 Columns) */}
            <div className="col-span-7 space-y-4">
              {/* SECTION 1: Karte & Edition */}
              <div className="p-4 rounded-2xl bg-[#101524] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Search className="w-3.5 h-3.5" /> 1. Karte & Edition
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Karten-Name (Pflicht) *
                  </label>
                  <PokemonSearchInput
                    value={name}
                    onChange={setName}
                    onSelectCard={handleSelectApiCard}
                    placeholder="Name eingeben für Autocomplete..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Set (z.B. 151, Paldea Evolved)
                    </label>
                    <input
                      type="text"
                      value={setNameText}
                      onChange={(e) => setSetNameText(e.target.value)}
                      placeholder="Set Name"
                      className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Kartennummer (z.B. 215/203)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="z.B. 4/102"
                      className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Kriterien (Sprache & Zustand) */}
              <div className="p-4 rounded-2xl bg-[#101524] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> 2. Kriterien
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Sprache *
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as CardLanguage)}
                      className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="DE">Deutsch (DE)</option>
                      <option value="EN">Englisch (EN)</option>
                      <option value="JP">Japanisch (JP)</option>
                      <option value="Egal">Beliebig / Egal</option>
                      <option value="OTHER">Sonstige</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Zustand *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as CardCondition)}
                      className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="NM">Near Mint (NM) - Wie neu</option>
                      <option value="EX">Excellent (EX) - Minimale Spuren</option>
                      <option value="GD">Good (GD) - Leichte Abnutzung</option>
                      <option value="LP">Light Played (LP) - Sichtbare Spuren</option>
                      <option value="PL">Played (PL) - Deutlich bespielt</option>
                      <option value="PO">Poor (PO) - Beschädigt</option>
                      <option value="Egal">Beliebig (Egal)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Budget / Preis / Tausch */}
              <div className="p-4 rounded-2xl bg-[#101524] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5" /> 3. Budget & Konditionen
                </div>

                {isLookingFor && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Preisspanne oder Wunschpreis
                      </label>
                      <input
                        type="text"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        placeholder="z.B. 50€ - 80€ oder VB"
                        className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    {/* Quick Budget Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 mr-1">Schnellwahl:</span>
                      {QUICK_BUDGET_SUGGESTIONS.map((sugg) => (
                        <button
                          type="button"
                          key={sugg}
                          onClick={() => setPriceRange(sugg)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                            priceRange === sugg
                              ? "bg-cyan-500 text-black border-cyan-400 font-bold"
                              : "bg-white/5 text-neutral-300 border-white/10 hover:border-cyan-500/40"
                          }`}
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSell && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Verkaufspreis (€) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={price !== undefined ? price : ""}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="z.B. 45"
                        required
                        className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs text-neutral-300">Angebote erlauben</span>
                      <input
                        type="checkbox"
                        checked={allowOffers}
                        onChange={(e) => setAllowOffers(e.target.checked)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {isTrade && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Geschätzter Tauschwert (€) *
                      </label>
                      <input
                        type="number"
                        value={estimatedTradeValue !== undefined ? estimatedTradeValue : ""}
                        onChange={(e) => setEstimatedTradeValue(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="z.B. 120"
                        required
                        className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Gesuchte Tauschobjekte
                      </label>
                      <input
                        type="text"
                        value={lookingForWants}
                        onChange={(e) => setLookingForWants(e.target.value)}
                        placeholder="z.B. Gluraks, Vintage Holos..."
                        className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: Notizen & Discord-Veröffentlichung */}
              <div className="p-4 rounded-2xl bg-[#101524] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Send className="w-3.5 h-3.5" /> 4. Details & Discord
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Notizen / Beschreibung
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Besonderheiten (z.B. Swirl vorhanden, frisch gezogen, kleine Drucklinie am Rand...)"
                    rows={2}
                    className="w-full bg-[#0a0d16] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Im Discord posten</p>
                      <p className="text-[10px] text-neutral-400">
                        Sendet sofort ein formatiertes Rich-Embed in den entsprechenden Kanal
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={postToDiscord}
                    onChange={(e) => setPostToDiscord(e.target.checked)}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className={`flex-1 py-3.5 rounded-xl text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer ${
                    !name.trim() ? "opacity-50 cursor-not-allowed bg-white/10" : themeSubmitGradient
                  }`}
                >
                  {isSubmitting ? (
                    "Wird eingestellt..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {isLookingFor
                        ? "Gesuch jetzt veröffentlichen"
                        : isSell
                        ? "Karte jetzt einstellen"
                        : "Tausch-Inserat veröffentlichen"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
