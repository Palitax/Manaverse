"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Database,
  ArrowRight,
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { TCG_SETS, TCG_CARDS, searchTcgCards, TcgCard, TcgSet } from "@/lib/tcg-index-data";
import { CardLanguage } from "@/types";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

const LANGUAGE_TABS: { id: CardLanguage | "ALL"; label: string; flag: string }[] = [
  { id: "ALL", label: "Alle Sprachen", flag: "🌐" },
  { id: "DE", label: "Deutsch", flag: "🇩🇪" },
  { id: "EN", label: "Englisch", flag: "🇬🇧" },
  { id: "JP", label: "Japanisch", flag: "🇯🇵" },
  { id: "KR", label: "Koreanisch", flag: "🇰🇷" },
  { id: "CN", label: "Chinesisch", flag: "🇨🇳" },
];

export default function TcgIndexPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<CardLanguage | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSetCode, setSelectedSetCode] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"cards" | "sets">("cards");
  const [toggledCardIds, setToggledCardIds] = useState<Record<string, boolean>>({});

  // Toggle card title between Primary (DE/EN) and Original (JP/KR/CN)
  const toggleCardTitle = (cardId: string) => {
    setToggledCardIds((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return searchTcgCards(
      searchQuery,
      selectedLanguage,
      selectedSetCode === "ALL" ? undefined : selectedSetCode
    );
  }, [searchQuery, selectedLanguage, selectedSetCode]);

  // Filtered Sets
  const filteredSets = useMemo(() => {
    return TCG_SETS.filter((s) => {
      const matchLang = selectedLanguage === "ALL" || s.language === selectedLanguage;
      const matchQuery =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchLang && matchQuery;
    });
  }, [selectedLanguage, searchQuery]);

  return (
    <div className="min-h-screen bg-[#060911] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      {/* Decorative Glow Backgrounds */}
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header Hero Section */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 backdrop-blur-md">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Offizieller Pokémon TCG Index & Set-Matrix</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Einheitlicher <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400">TCG-Katalog</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Verifizierte Kartennamen, offizielle Set-Kürzel und Sprachverknüpfungen für 🇩🇪 Deutsch, 🇬🇧 Englisch, 🇯🇵 Japanisch, 🇰🇷 Koreanisch und 🇨🇳 Chinesisch. Nie wieder Schreibfehler oder falsche Set-Zuordnungen.
          </p>
        </div>

        {/* Global Controls & Language Selector */}
        <div className="relative z-10 space-y-4 mb-8">
          {/* Language Selector Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {LANGUAGE_TABS.map((tab) => {
              const isSelected = selectedLanguage === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(tab.id);
                    setSelectedSetCode("ALL");
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[42px] border active:scale-95",
                    isSelected
                      ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/20"
                      : "bg-[#111625] hover:bg-white/10 text-neutral-300 border-white/10"
                  )}
                >
                  <span className="text-base">{tab.flag}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Mode Switcher */}
          <div className="p-3 sm:p-4 rounded-2xl bg-[#0d121f] border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suche nach Pokémon (z.B. Glurak, Charizard, リザードン) oder Set-Kürzel (JTG, SV2a, MEW, OBF)..."
                className="w-full bg-[#131929] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10 cursor-pointer"
                >
                  Zurücksetzen
                </button>
              )}
            </div>

            {/* Set Dropdown Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSetCode}
                onChange={(e) => setSelectedSetCode(e.target.value)}
                className="bg-[#131929] border border-white/10 rounded-xl px-3 py-3 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-amber-400 cursor-pointer min-h-[44px]"
              >
                <option value="ALL">Alle Editionen / Sets</option>
                {TCG_SETS.filter(
                  (s) => selectedLanguage === "ALL" || s.language === selectedLanguage
                ).map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.code} – {s.name} ({s.language})
                  </option>
                ))}
              </select>

              {/* View Switcher: Karten vs. Set-Matrix */}
              <div className="flex bg-[#131929] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("cards")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px]",
                    activeTab === "cards"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  Karten ({filteredCards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sets")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px]",
                    activeTab === "sets"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  Set-Matrix ({filteredSets.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* VIEW 1: KARTEN-KATALOG                                           */}
        {/* ================================================================ */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            {filteredCards.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0c101b] border border-white/10 space-y-3">
                <p className="text-base font-bold text-white">Keine passenden Karten im TCG-Index gefunden</p>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Überprüfe die gewählte Sprache oder das Kürzel. Japanische Sets wie &quot;SV2a&quot; werden nur unter 🇯🇵 Japanisch oder 🌐 Alle gelistet.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLanguage("ALL");
                    setSearchQuery("");
                    setSelectedSetCode("ALL");
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs cursor-pointer min-h-[40px]"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCards.map((card) => {
                  const isToggled = toggledCardIds[card.id] || false;
                  const displayTitle = isToggled
                    ? card.nameOriginal
                    : card.language === "DE"
                    ? card.nameDe
                    : card.nameEn;

                  const flag =
                    card.language === "DE"
                      ? "🇩🇪 DE"
                      : card.language === "JP"
                      ? "🇯🇵 JP"
                      : card.language === "KR"
                      ? "🇰🇷 KR"
                      : card.language === "CN"
                      ? "🇨🇳 CN"
                      : "🇬🇧 EN";

                  return (
                    <div
                      key={card.id}
                      className="group relative rounded-2xl bg-[#0c111d] border border-white/10 hover:border-amber-400/50 p-4 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
                    >
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between gap-1 mb-3">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-neutral-200 border border-white/10">
                          {flag} • {card.setCode}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 truncate">
                          #{card.number}
                        </span>
                      </div>

                      {/* Card Artwork Display */}
                      <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center p-2 mb-3">
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Card Details & Interactive Title */}
                      <div className="space-y-1.5 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleCardTitle(card.id)}
                          title="Klicken, um zwischen übersetztem und originalem Namen zu wechseln"
                          className="text-left w-full group/title cursor-pointer"
                        >
                          <h3 className="font-extrabold text-sm text-white group-hover/title:text-amber-300 transition-colors line-clamp-1">
                            {displayTitle}
                          </h3>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1 group-hover/title:text-amber-400/90 transition-colors">
                            <ArrowLeftRight className="w-3 h-3 flex-shrink-0" />
                            {isToggled
                              ? card.language === "DE"
                                ? `Deutsch: ${card.nameDe}`
                                : `Englisch: ${card.nameEn}`
                              : `Original: ${card.nameOriginal}`}
                          </span>
                        </button>

                        <p className="text-[11px] text-neutral-400 truncate">
                          {card.setName}
                        </p>

                        <div className="pt-1">
                          <span className="inline-block text-[10px] font-semibold text-amber-300/90 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                            {card.rarity}
                          </span>
                        </div>
                      </div>

                      {/* Action CTA: Inserat mit verifizierten Daten erstellen */}
                      <div className="pt-4 mt-2 border-t border-white/10">
                        <Link
                          href={`/sell?name=${encodeURIComponent(
                            card.language === "DE" ? card.nameDe : card.nameEn
                          )}&set=${encodeURIComponent(card.setName)}&number=${encodeURIComponent(
                            card.number
                          )}&lang=${encodeURIComponent(card.language)}&photo=${encodeURIComponent(
                            card.imageUrl
                          )}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 min-h-[38px]"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>Karte anbieten</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* VIEW 2: SET-MATRIX & MULTILINGUAL EQUIVALENCE TABLE              */}
        {/* ================================================================ */}
        {activeTab === "sets" && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d121f] border border-white/10 space-y-2">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Internationale Set-Matrix (Kürzel & Namen im Vergleich)
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Diese Tabelle zeigt dir die genauen Entsprechungen zwischen westlichen (DE / EN) und asiatischen (JP / KR / CN) Editionen. So weißt du immer, welches Kürzel für welche Sprache gilt.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c101b]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Sprache</th>
                    <th className="py-3 px-4">Set-Kürzel</th>
                    <th className="py-3 px-4">Offizieller Name</th>
                    <th className="py-3 px-4">Original-Schreibweise</th>
                    <th className="py-3 px-4">Gegenstück / Äquivalent</th>
                    <th className="py-3 px-4">Jahr / Karten</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300 font-medium">
                  {filteredSets.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {s.language === "DE" && "🇩🇪 Deutsch"}
                          {s.language === "EN" && "🇬🇧 Englisch"}
                          {s.language === "JP" && "🇯🇵 Japanisch"}
                          {s.language === "KR" && "🇰🇷 Koreanisch"}
                          {s.language === "CN" && "🇨🇳 Chinesisch"}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-amber-300">
                        {s.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {s.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-400">
                        {s.nameOriginal || "—"}
                      </td>
                      <td className="py-3 px-4 text-cyan-300">
                        {s.equivalentName ? (
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <ArrowLeftRight className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                            {s.equivalentName} ({s.equivalentCode})
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                        {s.releaseYear} • {s.totalCards} Karten
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
