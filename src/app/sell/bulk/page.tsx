"use client";

import React, { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { BulkCardItem, CardLanguage, CardCondition } from "@/types";
import { PokemonSearchInput } from "@/components/forms/pokemon-search-input";
import { compressCardImage } from "@/lib/supabase/storage";
import { BTN_SECONDARY, INPUT_BASE } from "@/lib/design-system";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Layers,
  Crown,
  Plus,
  Camera,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function BulkSellPage() {
  const { addBulkSubmission, currentUser, openAuthModal } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [cardsData, setCardsData] = useState<BulkCardItem[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [askingPrice, setAskingPrice] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added: BulkCardItem[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      let imageSrc = "";
      try {
        const compressed = await compressCardImage(file);
        imageSrc = compressed.dataUrl;
      } catch {
        imageSrc = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve((ev.target?.result as string) || "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });
      }
      if (imageSrc) {
        added.push({
          id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: "",
          language: "DE",
          condition: "NM",
          image: imageSrc,
        });
      }
    }

    if (added.length === 0) {
      toast.error("Keine gültigen Bilddateien gefunden", "Bitte wähle PNG-, JPG- oder WEBP-Dateien aus.");
      return;
    }

    setCardsData((prev) => [...prev, ...added]);
    toast.success(`${added.length} ${added.length === 1 ? "Foto" : "Fotos"} hinzugefügt`);
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setCardsData((prev) => [
      ...prev,
      {
        id: `card-${Date.now()}`,
        name: "",
        language: "DE",
        condition: "NM",
        image: trimmed,
      },
    ]);
    setNewImageUrl("");
  };

  const handleRemoveCard = (index: number) => {
    setCardsData((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length === 0) {
        setCurrentStepIndex(0);
        setIsFinished(false);
      } else if (currentStepIndex >= next.length) {
        setCurrentStepIndex(next.length - 1);
      }
      return next;
    });
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
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

    setIsSubmitting(true);
    try {
      await addBulkSubmission({
        cards: cardsData,
        askingPrice: askingPrice ? Number(askingPrice) : undefined,
        notes,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.55 },
        });
      } catch {
        // Konfetti optional
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Bulk-Einreichung fehlgeschlagen:", err);
      toast.error("Einreichung fehlgeschlagen", "Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-28">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/sell"
            className="text-xs text-ink-subtle hover:text-ink inline-flex items-center gap-1.5 transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Vitrine
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] text-ink border border-hairline-strong flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle block">
                Manacards Ankauf
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                Sammlung einreichen
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl leading-relaxed">
            Lade mehrere Karten auf einmal hoch – wir prüfen dein Konvolut und schicken dir ein faires Ankaufsangebot.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-1/95 border border-hairline flex items-center gap-3 self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-ink block">Direkter Ankauf</span>
            <span className="text-ink-subtle">Schnelle Bewertung per Discord</span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-14 px-6 bg-surface-1/95 backdrop-blur-md rounded-3xl border border-hairline-strong space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Sammlung erfolgreich übermittelt
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            Deine {cardsData.length} Karten sind im Manacards-Postfach eingegangen. Wir prüfen alles und melden uns über{" "}
            <strong className="text-ink">
              @{currentUser?.discordUsername || currentUser?.username || "Trainer"}
            </strong>{" "}
            mit einem Angebot bei dir.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/sell"
              className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black transition-colors min-h-[44px] inline-flex items-center justify-center"
            >
              Zurück zur Vitrine
            </Link>
            <Link
              href="/buy"
              className={cn("px-5 py-3 rounded-xl text-xs font-bold min-h-[44px] inline-flex items-center justify-center", BTN_SECONDARY)}
            >
              Marktplatz ansehen
            </Link>
          </div>
        </div>
      ) : cardsData.length === 0 ? (
        /* STEP 1: Fotos hochladen */
        <div className="p-6 sm:p-10 rounded-3xl bg-surface-1/95 backdrop-blur-md border border-hairline text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 text-ink border border-hairline-strong flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-ink tracking-tight">
              Schritt 1: Fotos deiner Karten auswählen
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
              Wähle ein oder mehrere Fotos direkt vom Smartphone oder Computer – oder füge optional eine Bild-URL ein.
            </p>
          </div>

          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-black text-xs sm:text-sm transition-colors min-h-[48px] inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Kartenfotos auswählen (mehrere möglich)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center max-w-md mx-auto py-1">
            <div className="border-t border-hairline w-full" />
            <span className="bg-surface-1 px-3 text-[10px] uppercase tracking-[0.14em] text-ink-subtle font-bold absolute">
              oder per Bild-URL
            </span>
          </div>

          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImageUrl();
                }
              }}
              placeholder="Bild-URL der Karte (https://…)"
              className={cn(INPUT_BASE, "flex-1 px-4 py-2.5 text-xs min-h-[44px] focus:border-hairline-strong")}
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className={cn("px-4 py-2.5 text-xs font-bold rounded-xl min-h-[44px] cursor-pointer", BTN_SECONDARY)}
            >
              Hinzufügen
            </button>
          </div>
        </div>
      ) : !isFinished ? (
        /* STEP 2: Karten einzeln prüfen */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-1/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-hairline relative">
          {/* Left: Card Image & Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-[0.14em] flex items-center gap-1.5 tabular-nums">
                <Layers className="w-4 h-4 text-ink-subtle" /> Karte {currentStepIndex + 1} von {cardsData.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 min-h-[34px] cursor-pointer", BTN_SECONDARY)}
                >
                  <Plus className="w-3.5 h-3.5" /> Foto
                </button>
                <button
                  type="button"
                  aria-label="Diese Karte entfernen"
                  onClick={() => handleRemoveCard(currentStepIndex)}
                  className="min-w-[34px] min-h-[34px] rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-hairline flex items-center justify-center p-3">
              <img
                src={currentCard.image}
                alt={currentCard.name || `Karte ${currentStepIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {cardsData.length > 1 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {cardsData.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Zu Karte ${idx + 1}`}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all cursor-pointer",
                      idx === currentStepIndex ? "w-6 bg-white" : "w-2 bg-white/20 hover:bg-white/40"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Card Details Form */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-ink tracking-tight mb-1">
                  Details für Karte #{currentStepIndex + 1}
                </h3>
                <p className="text-xs text-ink-subtle">
                  Nutze den TCG-Index für schnelle automatische Vervollständigung.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">
                  Kartenname *
                </label>
                <PokemonSearchInput
                  value={currentCard.name}
                  onChange={(val) => updateCurrentCard({ name: val })}
                  onSelectCard={(card) =>
                    updateCurrentCard({
                      name: card.set?.name ? `${card.name} (${card.set.name})` : card.name,
                      language: (card.language as CardLanguage) || currentCard.language,
                      image: currentCard.image || card.images?.large || card.images?.small || "",
                    })
                  }
                  placeholder="z. B. Glurak Base Set, Pikachu 070/XY-P …"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1.5">
                    Sprache *
                  </label>
                  <select
                    value={currentCard.language}
                    onChange={(e) =>
                      updateCurrentCard({ language: e.target.value as CardLanguage })
                    }
                    className={cn(INPUT_BASE, "px-3 py-2.5 text-xs min-h-[44px] focus:border-hairline-strong cursor-pointer")}
                  >
                    <option value="DE">Deutsch (DE)</option>
                    <option value="EN">Englisch (EN)</option>
                    <option value="JP">Japanisch (JP)</option>
                    <option value="CN">Chinesisch (CN)</option>
                    <option value="KR">Koreanisch (KR)</option>
                    <option value="OTHER">Sonstige</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1.5">
                    Zustand *
                  </label>
                  <select
                    value={currentCard.condition}
                    onChange={(e) =>
                      updateCurrentCard({ condition: e.target.value as CardCondition })
                    }
                    className={cn(INPUT_BASE, "px-3 py-2.5 text-xs min-h-[44px] focus:border-hairline-strong cursor-pointer")}
                  >
                    <option value="Graded">Graded</option>
                    <option value="NM">Near Mint (NM)</option>
                    <option value="EX">Excellent (EX)</option>
                    <option value="GD">Good (GD)</option>
                    <option value="LP">Light Played (LP)</option>
                    <option value="PL">Played (PL)</option>
                    <option value="PO">Poor (PO)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">
                  Geschätzter Einzelwert (€, optional)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={currentCard.estimatedValue || ""}
                  onChange={(e) =>
                    updateCurrentCard({
                      estimatedValue: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="z. B. 150"
                  className={cn(INPUT_BASE, "px-3 py-2.5 text-xs min-h-[44px] tabular-nums focus:border-hairline-strong")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-5 border-t border-hairline">
              <button
                type="button"
                onClick={handlePrevCard}
                disabled={currentStepIndex === 0}
                className={cn("px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-30 flex items-center gap-1.5 min-h-[44px] cursor-pointer", BTN_SECONDARY)}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Vorherige
              </button>

              <button
                type="button"
                onClick={handleNextCard}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black flex items-center gap-1.5 transition-colors min-h-[44px] cursor-pointer"
              >
                {currentStepIndex < cardsData.length - 1 ? (
                  <>
                    Nächste Karte <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Übersicht prüfen <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 3: Übersicht & Absenden */
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-1/95 backdrop-blur-md border border-hairline-strong space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Sammlung bereit zum Einreichen
              </h2>
              <p className="text-xs text-ink-subtle mt-0.5">
                {cardsData.length} {cardsData.length === 1 ? "Karte" : "Karten"} erfasst. Prüfe die Angaben vor dem Absenden.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFinished(false)}
              className="text-xs text-ink-muted hover:text-ink underline underline-offset-4 decoration-white/20 self-start sm:self-auto min-h-[36px] cursor-pointer"
            >
              Karten bearbeiten
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cardsData.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-2 rounded-xl bg-surface-2 border border-hairline text-left"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black mb-2">
                  <img src={c.image} alt={c.name || "Karte"} className="w-full h-full object-contain" />
                </div>
                <p className="text-xs font-bold text-ink truncate">{c.name || "Ohne Name"}</p>
                <p className="text-[10px] text-ink-subtle">
                  {c.condition} · {c.language}
                </p>
                {c.estimatedValue && (
                  <p className="text-[11px] font-bold text-ink-muted mt-0.5 tabular-nums">
                    ~{c.estimatedValue} €
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1.5">
                Gesamtwunschsumme (€, optional)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={askingPrice || ""}
                onChange={(e) => setAskingPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="z. B. 1400 (oder leer für Angebot von uns)"
                className={cn(INPUT_BASE, "px-4 py-3 text-sm tabular-nums min-h-[46px] focus:border-hairline-strong")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1.5">
                Hinweise an Manacards (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="z. B. Schneller Verkauf gewünscht, alle Karten im Binder …"
                className={cn(INPUT_BASE, "px-4 py-3 text-sm min-h-[46px] focus:border-hairline-strong")}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-hairline text-center space-y-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitToManacards}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black text-sm tracking-tight transition-colors min-h-[52px] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Crown className="w-4 h-4" />
              <span>{isSubmitting ? "Wird übermittelt …" : "Sammlung an Manacards einreichen"}</span>
            </button>
            <p className="text-[11px] text-ink-subtle">
              Übermittelt Fotos, Details und Kontaktdaten vertraulich an das Manacards-Ankaufteam.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
