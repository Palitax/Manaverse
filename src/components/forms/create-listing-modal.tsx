"use client";

import React, { useState } from "react";
import { ListingType, CardLanguage, CardCondition } from "@/types";
import { useStore } from "@/lib/store";
import { X, Sparkles, Plus, Image as ImageIcon, Send, Film } from "lucide-react";
import { PokemonSearchInput } from "./pokemon-search-input";

interface CreateListingModalProps {
  initialType?: ListingType;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateListingModal({
  initialType = "sell",
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

  if (!isOpen) return null;

  const handleAddPhotoField = () => {
    if (photos.length < 5) {
      setPhotos([...photos, ""]);
    }
  };

  const handlePhotoChange = (index: number, val: string) => {
    const updated = [...photos];
    updated[index] = val;
    setPhotos(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    const validPhotos = photos.filter((p) => p.trim() !== "");
    const finalPhotos = validPhotos.length > 0 ? validPhotos : ["https://images.pokemontcg.io/base1/4_hires.png"];

    try {
      await addListing({
        type,
        name,
        set: setNameText || undefined,
        cardNumber: cardNumber || undefined,
        language,
        condition,
        photos: finalPhotos,
        videoUrl: videoUrl || undefined,
        description,
        price: type === "sell" ? Number(price) : undefined,
        priceRange: type === "looking_for" ? priceRange : undefined,
        estimatedTradeValue: type === "trade" ? Number(estimatedTradeValue) : undefined,
        lookingForWants: type === "trade" ? lookingForWants : undefined,
        allowOffers,
        postToDiscord,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl glass-panel p-6 border border-white/15 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Neues Inserat aufgeben</h2>
              <p className="text-xs text-neutral-400">
                Einstellen für die Whatnot & Discord Community
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector tabs */}
        <div className="grid grid-cols-3 gap-2 my-5 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setType("sell")}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === "sell"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Sell (Verkaufen)
          </button>
          <button
            type="button"
            onClick={() => setType("trade")}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === "trade"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Trade (Tauschen)
          </button>
          <button
            type="button"
            onClick={() => setType("looking_for")}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === "looking_for"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Looking For (Gesuch)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Name with Autocomplete */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Karten-Name (Pflicht) *
            </label>
            <PokemonSearchInput
              value={name}
              onChange={setName}
              onSelectCard={(card) => {
                setName(card.name);
                setSetNameText(card.set.name);
                if (card.number) setCardNumber(card.number);
                if (card.images.large) {
                  setPhotos([card.images.large]);
                }
              }}
              placeholder="Name eingeben für Autocomplete..."
            />
          </div>

          {/* Set & Number row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Set (z.B. 151, Evolving Skies)
              </label>
              <input
                type="text"
                value={setNameText}
                onChange={(e) => setSetNameText(e.target.value)}
                placeholder="Set Name"
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Kartennummer (z.B. 215/203)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="z.B. 4/102"
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Language & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Sprache (Pflicht) *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as CardLanguage)}
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="DE">Deutsch (DE)</option>
                <option value="EN">Englisch (EN)</option>
                <option value="JP">Japanisch (JP)</option>
                <option value="OTHER">Sonstige</option>
                {type === "looking_for" && <option value="Egal">Egal (jede Sprache)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Zustand (Pflicht) *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as CardCondition)}
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="NM">Near Mint (NM) - Wie neu</option>
                <option value="EX">Excellent (EX) - Minimale Spuren</option>
                <option value="GD">Good (GD) - Leichte Abnutzung</option>
                <option value="LP">Light Played (LP) - Sichtbare Spuren</option>
                <option value="PL">Played (PL) - Deutlich bespielt</option>
                <option value="PO">Poor (PO) - Beschädigt</option>
                {type === "looking_for" && <option value="Egal">Egal (jeder Zustand)</option>}
              </select>
            </div>
          </div>

          {/* Pricing depending on Type */}
          {type === "sell" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Preis (€) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={price !== undefined ? price : ""}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="z.B. 45"
                  required
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mt-auto">
                <span className="text-xs text-neutral-300">Angebote zulassen</span>
                <input
                  type="checkbox"
                  checked={allowOffers}
                  onChange={(e) => setAllowOffers(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </div>
            </div>
          )}

          {type === "trade" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Estimated Trade Value (ETV in €) *
                </label>
                <input
                  type="number"
                  value={estimatedTradeValue !== undefined ? estimatedTradeValue : ""}
                  onChange={(e) => setEstimatedTradeValue(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="z.B. 120"
                  required
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Was suchst du dafür? (Wunschliste / Kriterien)
                </label>
                <input
                  type="text"
                  value={lookingForWants}
                  onChange={(e) => setLookingForWants(e.target.value)}
                  placeholder="z.B. Gluraks, Vintage Holos oder Evoli-SARs..."
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {type === "looking_for" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Preis oder Preisrange (z.B. 50€ - 80€ oder max. 100€)
              </label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="z.B. 70€ - 90€ oder VB"
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Photos & Videos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Fotos (Bild-URLs) *
              </label>
              <button
                type="button"
                onClick={handleAddPhotoField}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Weiteres Foto
              </button>
            </div>
            {photos.map((photo, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => handlePhotoChange(i, e.target.value)}
                  placeholder={i === 0 ? "Foto-URL (Vorderseite)" : i === 1 ? "Foto-URL (Rückseite)" : "Weiteres Detailfoto"}
                  className="flex-1 bg-[#111624] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                {photo && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" /> Video-URL (Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="z.B. Video-Scan Link (MP4 / Webm)"
              className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Beschreibung & Zustandshinweise
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Besonderheiten (z.B. Swirl vorhanden, frisch gezogen, kleine Drucklinie am Rand...)"
              rows={2}
              className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Discord Switch */}
          <div className="p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-90 transition-all hover:scale-[1.01] cursor-pointer"
          >
            {isSubmitting ? "Wird eingestellt..." : "Karte jetzt veröffentlichen"}
          </button>
        </form>
      </div>
    </div>
  );
}
