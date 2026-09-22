"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { BulkCardItem, CardLanguage, CardCondition } from "@/types";
import { PokemonSearchInput } from "@/components/forms/pokemon-search-input";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Shield,
  Layers,
  Crown,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function BulkSellPage() {
  const { addBulkSubmission, currentUser } = useStore();

  // Preset sample images for quick testing or user custom images
  const sampleBatchImages = [
    "https://images.pokemontcg.io/base1/4_hires.png",
    "https://images.pokemontcg.io/swsh7/215_hires.png",
    "https://images.pokemontcg.io/swsh7/218_hires.png",
    "https://images.pokemontcg.io/sv3pt5/199_hires.png",
    "https://images.pokemontcg.io/neo1/9_hires.png",
  ];

  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [cardsData, setCardsData] = useState<BulkCardItem[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [askingPrice, setAskingPrice] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize or add images
  const handleLoadSampleBatch = () => {
    setImages(sampleBatchImages);
    setCardsData(
      sampleBatchImages.map((img, i) => ({
        id: `card-${i + 1}`,
        name: i === 0 ? "Glurak Base Set" : i === 1 ? "Nachtara VMAX Alt Art" : "",
        language: "DE",
        condition: "NM",
        image: img,
        estimatedValue: i === 0 ? 300 : i === 1 ? 800 : undefined,
      }))
    );
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl) return;
    const newCards = [
      ...cardsData,
      {
        id: `card-${Date.now()}`,
        name: "",
        language: "DE" as CardLanguage,
        condition: "NM" as CardCondition,
        image: newImageUrl,
      },
    ];
    setImages([...images, newImageUrl]);
    setCardsData(newCards);
    setNewImageUrl("");
  };

  const currentCard = cardsData[currentStepIndex];

  const updateCurrentCard = (data: Partial<BulkCardItem>) => {
    setCardsData((prev) =>
      prev.map((c, idx) => (idx === currentStepIndex ? { ...c, ...data } : c))
    );
  };

  const handleNextCard = () => {
    if (currentStepIndex < cardsData.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevCard = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSubmitToManacards = async () => {
    await addBulkSubmission({
      cards: cardsData,
      askingPrice: askingPrice ? Number(askingPrice) : undefined,
      notes,
    });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/sell"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Zurück zum Sell-Bereich
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Sammlung verkaufen (Bulk Wizard)
              </h1>
              <p className="text-sm text-neutral-400">
                Lade bis zu 20+ Karten auf einmal hoch und erhalte ein direktes Ankaufsangebot von Manacards.
              </p>
            </div>
          </div>
        </div>

        {/* Action badge */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <span className="font-bold text-white block">Manacards Vorverkaufsrecht</span>
            <span className="text-neutral-400">Garantierter Ankauf bei Einigung</span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-16 px-6 glass-panel rounded-3xl border border-amber-500/30 space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto animate-bounce">
            <Crown className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white">
            Sammlung erfolgreich an Manacards übermittelt!
          </h2>
          <p className="text-sm text-neutral-300 max-w-lg mx-auto">
            Deine {cardsData.length} Karten wurden an unser Postfach und den Ankauf-Kanal übermittelt. Wir prüfen die Karten und melden uns per Discord (@{currentUser.discordUsername || currentUser.username}) mit einem Angebot bei dir!
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-semibold hover:bg-amber-500/30"
            >
              Im Manacards Postfach ansehen
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20"
            >
              Zurück zum Dashboard
            </Link>
          </div>
        </div>
      ) : cardsData.length === 0 ? (
        /* STEP 1: Upload / Add Images */
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Schritt 1: Karten-Fotos deiner Sammlung hochladen
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Füge Bild-URLs ein oder lade zum Testen sofort einen vorgefertigten Stapel von 5 Pokémon Hits.
            </p>

            {/* URL Input */}
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Bild-URL der Karte (z.B. https://...)"
                className="flex-1 bg-[#111624] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Hinzufügen
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLoadSampleBatch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 text-xs font-semibold transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Beispiel-Sammlung (5 High-End Karten) laden
              </button>
            </div>
          </div>
        </div>
      ) : !isFinished ? (
        /* STEP 2: Step-by-Step Card Inspector */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative">
          <BorderBeam size={280} duration={12} />

          {/* Left: Card Image & Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Karte {currentStepIndex + 1} von {cardsData.length}
              </span>
              <div className="flex gap-1">
                {cardsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? "bg-amber-400 scale-125"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 flex items-center justify-center p-3 shadow-2xl">
              <img
                src={currentCard.image}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right: Card Details Form for this card */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-white mb-1">
                  Details für Karte #{currentStepIndex + 1} eingeben
                </h3>
                <p className="text-xs text-neutral-400">
                  Nutze die Pokémon API Autovervollständigung für schnelle Erfassung.
                </p>
              </div>

              {/* Name with Autocomplete */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Karten-Name *
                </label>
                <PokemonSearchInput
                  value={currentCard.name}
                  onChange={(val) => updateCurrentCard({ name: val })}
                  onSelectCard={(card) =>
                    updateCurrentCard({
                      name: `${card.name} (${card.set.name})`,
                      image: card.images.large || currentCard.image,
                    })
                  }
                  placeholder="z.B. Glurak Base Set..."
                />
              </div>

              {/* Language & Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Sprache *
                  </label>
                  <select
                    value={currentCard.language}
                    onChange={(e) =>
                      updateCurrentCard({ language: e.target.value as CardLanguage })
                    }
                    className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="DE">Deutsch (DE)</option>
                    <option value="EN">Englisch (EN)</option>
                    <option value="JP">Japanisch (JP)</option>
                    <option value="OTHER">Sonstige</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Zustand *
                  </label>
                  <select
                    value={currentCard.condition}
                    onChange={(e) =>
                      updateCurrentCard({ condition: e.target.value as CardCondition })
                    }
                    className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="NM">Near Mint (NM)</option>
                    <option value="EX">Excellent (EX)</option>
                    <option value="GD">Good (GD)</option>
                    <option value="LP">Light Played (LP)</option>
                    <option value="PL">Played (PL)</option>
                    <option value="PO">Poor (PO)</option>
                  </select>
                </div>
              </div>

              {/* Estimated Value for this single card */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Geschätzter Einzelwert (€) (optional)
                </label>
                <input
                  type="number"
                  value={currentCard.estimatedValue || ""}
                  onChange={(e) =>
                    updateCurrentCard({
                      estimatedValue: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="z.B. 150"
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrevCard}
                disabled={currentStepIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold disabled:opacity-30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Vorherige
              </button>

              <button
                type="button"
                onClick={handleNextCard}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
              >
                {currentStepIndex < cardsData.length - 1 ? (
                  <>
                    Nächste Karte <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Sammlung abschließen <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 3: Final Collection Overview & "An Manacards verkaufen" Button */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-amber-500/30 relative overflow-hidden">
            <BorderBeam size={320} duration={10} colorFrom="#f59e0b" colorTo="#ec4899" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Crown className="w-6 h-6 text-amber-400" />
                  Sammlung bereit für Manacards
                </h2>
                <p className="text-xs text-neutral-400">
                  {cardsData.length} Karten erfasst. Überprüfe die Details vor dem Absenden.
                </p>
              </div>
              <button
                onClick={() => setIsFinished(false)}
                className="text-xs text-neutral-400 hover:text-white underline"
              >
                Karten bearbeiten
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {cardsData.map((c, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-neutral-900/80 border border-white/10 text-left"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black mb-2">
                    <img src={c.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs font-bold text-white truncate">{c.name || "Ohne Name"}</p>
                  <p className="text-[10px] text-neutral-400">
                    {c.condition} • {c.language}
                  </p>
                  {c.estimatedValue && (
                    <p className="text-[11px] font-bold text-amber-400 mt-0.5">
                      ~{c.estimatedValue} €
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Collection Asking Price & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Deine Gesamtwunschsumme (€) für alles zusammen
                </label>
                <input
                  type="number"
                  value={askingPrice || ""}
                  onChange={(e) => setAskingPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="z.B. 1400 (oder leer lassen für Angebot von uns)"
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Hinweise / Notizen an Manacards
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="z.B. Schneller Verkauf gewünscht, alle Karten Nichtraucher..."
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* PROMINENT BUTTON: An Manacards verkaufen */}
            <div className="pt-4 border-t border-white/10 text-center space-y-3">
              <ShimmerButton
                onClick={handleSubmitToManacards}
                background="linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)"
                shimmerColor="#ffffff"
                className="w-full py-4 text-base font-black tracking-wide text-neutral-950 shadow-2xl shadow-amber-500/40"
              >
                <span className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-neutral-950 fill-current" />
                  AN MANACARDS VERKAUFEN (Vorverkaufsrecht einräumen)
                </span>
              </ShimmerButton>
              <p className="text-[11px] text-neutral-400">
                Schickt alle Fotos, Details und Kontaktdaten direkt an das Manacards Admin-Postfach & Discord-Ankaufteam.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
