"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Database,
  ArrowLeftRight,
  Tag,
  Globe,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { TCG_SETS, TCG_CARDS } from "@/lib/tcg-index-data";
import { CardLanguage, PokemonApiCard } from "@/types";
import { cn } from "@/lib/utils";

const LANGUAGE_TABS: { id: CardLanguage | "ALL"; label: string; flag: string }[] = [
  { id: "ALL", label: "Alle Sprachen", flag: "🌐" },
  { id: "DE", label: "Deutsch", flag: "🇩🇪" },
  { id: "EN", label: "Englisch", flag: "🇬🇧" },
  { id: "JP", label: "Japanisch", flag: "🇯🇵" },
  { id: "KR", label: "Koreanisch", flag: "🇰🇷" },
  { id: "CN", label: "Chinesisch", flag: "🇨🇳" },
];

const PAGE_SIZE = 24;

function localTcgToApiCard(c: (typeof TCG_CARDS)[number]): PokemonApiCard {
  return {
    id: c.id,
    name: c.name,
    nameOriginal: c.nameOriginal,
    nameEn: c.nameEn,
    nameDe: c.nameDe,
    language: c.language,
    number: c.number,
    rarity: c.rarity,
    set: {
      id: c.setCode,
      name: c.setName,
    },
    images: {
      small: c.imageUrl,
      large: c.imageUrl,
    },
  };
}

export default function TcgIndexPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<CardLanguage | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSetCode, setSelectedSetCode] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"cards" | "sets">("cards");
  const [toggledCardIds, setToggledCardIds] = useState<Record<string, boolean>>({});

  const [cards, setCards] = useState<PokemonApiCard[]>(() =>
    TCG_CARDS.slice(0, PAGE_SIZE).map(localTcgToApiCard)
  );
  const [totalCards, setTotalCards] = useState<number>(27240);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);

  const toggleCardTitle = (cardId: string) => {
    setToggledCardIds((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // Fetch paginated cards from unified server TCG index (27,200+ JP cards + DE/EN/KR/CN)
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setOffset(0);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("query", searchQuery.trim());
        if (selectedLanguage !== "ALL") {
          params.set("language", selectedLanguage);
          params.set("strict", "1");
        }
        if (selectedSetCode !== "ALL") {
          params.set("set", selectedSetCode);
        }
        params.set("limit", String(PAGE_SIZE));
        params.set("offset", "0");

        const res = await fetch(`/api/pokemon?${params.toString()}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.cards)) {
            setCards(data.cards);
            setTotalCards(Number(data?.total ?? data.cards.length));
          }
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("TCG-Index Abfragefehler:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, selectedLanguage, selectedSetCode]);

  const handleLoadMore = async () => {
    if (isLoadingMore || cards.length >= totalCards) return;
    const nextOffset = offset + PAGE_SIZE;
    setIsLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (selectedLanguage !== "ALL") {
        params.set("language", selectedLanguage);
        params.set("strict", "1");
      }
      if (selectedSetCode !== "ALL") {
        params.set("set", selectedSetCode);
      }
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(nextOffset));

      const res = await fetch(`/api/pokemon?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.cards) && data.cards.length > 0) {
          setCards((prev) => [...prev, ...data.cards]);
          setOffset(nextOffset);
        }
      }
    } catch (err) {
      console.warn("Fehler beim Nachladen weiterer Karten:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filtered Sets
  const filteredSets = useMemo(() => {
    return TCG_SETS.filter((s) => {
      const matchLang = selectedLanguage === "ALL" || s.language === selectedLanguage;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.nameOriginal && s.nameOriginal.toLowerCase().includes(q)) ||
        s.code.toLowerCase().includes(q) ||
        s.aliases.some((a) => a.toLowerCase().includes(q));
      return matchLang && matchQuery;
    });
  }, [selectedLanguage, searchQuery]);

  return (
    <div className="min-h-screen bg-[#060911] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header Hero Section */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 backdrop-blur-md">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Vollständiger Pokémon TCG-Index (27.200+ japanische & internationale Karten)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Einheitlicher{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400">
              TCG-Katalog
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Verifizierte Kartennamen, sämtliche japanische Erweiterungen & Promo-Serien (1996–2026 inkl. XY-P, SM-P, S-P, SV-P, Old Back) sowie internationale Set-Verknüpfungen für 🇩🇪 Deutsch, 🇬🇧 Englisch, 🇯🇵 Japanisch, 🇰🇷 Koreanisch und 🇨🇳 Chinesisch.
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
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px] border active:scale-95",
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
          <div className="p-3 sm:p-4 rounded-2xl bg-[#0d121f] border border-white/10 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between shadow-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suche nach Pokémon, Nummer oder Set (z.B. Pikachu 070/XY-P, Glurak 201, リザードン, Poncho)..."
                className="w-full bg-[#131929] border border-white/10 rounded-xl px-4 py-3 pl-11 pr-24 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 min-h-[46px]"
              />
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin absolute left-4 top-1/2 -translate-y-1/2" />
              ) : (
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-300 hover:text-white px-2 py-1 rounded-lg bg-white/10 cursor-pointer min-h-[30px]"
                >
                  Zurücksetzen
                </button>
              )}
            </div>

            {/* Set Dropdown Filter + View Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedSetCode}
                onChange={(e) => setSelectedSetCode(e.target.value)}
                className="bg-[#131929] border border-white/10 rounded-xl px-3 py-3 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-amber-400 cursor-pointer min-h-[46px] flex-1 sm:max-w-[260px]"
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
                    "flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[38px]",
                    activeTab === "cards"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  Karten ({totalCards.toLocaleString("de-DE")})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sets")}
                  className={cn(
                    "flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[38px]",
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
          <div className="space-y-8">
            {cards.length === 0 && !isLoading ? (
              <div className="p-10 sm:p-12 text-center rounded-3xl bg-[#0c101b] border border-white/10 space-y-3">
                <p className="text-base font-bold text-white">
                  Keine passenden Karten im TCG-Index gefunden
                </p>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Überprüfe die gewählte Sprache oder das Set-Kürzel. Japanische Promos und Editionen (wie XY-P, SM-P, SV2a) sind unter 🇯🇵 Japanisch und 🌐 Alle Sprachen verfügbar.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLanguage("ALL");
                    setSearchQuery("");
                    setSelectedSetCode("ALL");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs cursor-pointer min-h-[44px]"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                  {cards.map((card, idx) => {
                    const cardKey = card.id || `card-${idx}`;
                    const isToggled = toggledCardIds[cardKey] || false;
                    const lang = card.language || "DE";
                    const primaryLabel =
                      lang === "DE"
                        ? card.nameDe || card.name
                        : card.nameEn || card.name;
                    const originalLabel = card.nameOriginal || card.name;
                    const displayTitle = isToggled ? originalLabel : primaryLabel;

                    const flag =
                      lang === "DE"
                        ? "🇩🇪 DE"
                        : lang === "JP"
                        ? "🇯🇵 JP"
                        : lang === "KR"
                        ? "🇰🇷 KR"
                        : lang === "CN"
                        ? "🇨🇳 CN"
                        : "🇬🇧 EN";

                    const imageSrc =
                      card.images?.large ||
                      card.images?.small ||
                      "/manaforge-card-back.png";
                    const setCode = card.set?.id || "TCG";
                    const setName = card.set?.name || setCode;

                    return (
                      <div
                        key={cardKey}
                        className="group relative rounded-2xl bg-[#0c111d] border border-white/10 hover:border-amber-400/50 p-4 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
                      >
                        {/* Top Header Badge */}
                        <div className="flex items-center justify-between gap-1 mb-3">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-neutral-200 border border-white/10 truncate max-w-[65%]">
                            {flag} • {setCode}
                          </span>
                          {card.number && (
                            <span className="text-[10px] font-mono text-neutral-400 truncate">
                              #{card.number}
                            </span>
                          )}
                        </div>

                        {/* Card Artwork Display */}
                        <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center p-2 mb-3">
                          <img
                            src={imageSrc}
                            alt={displayTitle}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/manaforge-card-back.png";
                            }}
                          />
                        </div>

                        {/* Card Details & Interactive Title */}
                        <div className="space-y-1.5 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleCardTitle(cardKey)}
                            title="Klicken, um zwischen übersetztem und originalem Namen zu wechseln"
                            className="text-left w-full group/title cursor-pointer min-h-[44px]"
                          >
                            <h3 className="font-extrabold text-sm text-white group-hover/title:text-amber-300 transition-colors line-clamp-1">
                              {displayTitle}
                            </h3>
                            <span className="text-[10px] text-neutral-400 flex items-center gap-1 group-hover/title:text-amber-400/90 transition-colors truncate">
                              <ArrowLeftRight className="w-3 h-3 flex-shrink-0" />
                              {isToggled
                                ? lang === "DE"
                                  ? `Deutsch: ${primaryLabel}`
                                  : `Englisch: ${primaryLabel}`
                                : `Original: ${originalLabel}`}
                            </span>
                          </button>

                          <p className="text-[11px] text-neutral-400 truncate" title={setName}>
                            {setName}
                          </p>

                          {card.rarity && (
                            <div className="pt-1">
                              <span className="inline-block text-[10px] font-semibold text-amber-300/90 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded truncate max-w-full">
                                {card.rarity}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action CTA: Inserat mit verifizierten Daten erstellen */}
                        <div className="pt-4 mt-2 border-t border-white/10">
                          <Link
                            href={`/sell?name=${encodeURIComponent(
                              primaryLabel
                            )}&set=${encodeURIComponent(setCode)}&number=${encodeURIComponent(
                              card.number || ""
                            )}&lang=${encodeURIComponent(lang)}&photo=${encodeURIComponent(
                              imageSrc
                            )}`}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 min-h-[44px]"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>Karte anbieten</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Pagination */}
                {cards.length < totalCards && (
                  <div className="flex flex-col items-center justify-center gap-2 pt-4">
                    <p className="text-xs text-neutral-400">
                      Zeige {cards.length.toLocaleString("de-DE")} von{" "}
                      {totalCards.toLocaleString("de-DE")} passenden Karten
                    </p>
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-6 py-3 rounded-xl bg-[#131929] hover:bg-white/10 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer min-h-[46px] active:scale-95"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Weitere Karten werden geladen...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-amber-400" />
                          <span>Weitere 24 Karten laden</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* VIEW 2: SET-MATRIX & MULTILINGUAL EQUIVALENCE                    */}
        {/* ================================================================ */}
        {activeTab === "sets" && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d121f] border border-white/10 space-y-2">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>Internationale Set-Matrix (Kürzel & Namen im Vergleich)</span>
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Diese Übersicht zeigt die Entsprechungen zwischen westlichen (DE / EN) und asiatischen (JP / KR / CN) Editionen sowie allen japanischen Promo-Blöcken.
              </p>
            </div>

            {/* Mobile Extralocke: Card View on Smartphones (< md) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredSets.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(s.language);
                    setSelectedSetCode(s.code);
                    setActiveTab("cards");
                  }}
                  className="text-left p-4 rounded-2xl bg-[#0c101b] border border-white/10 hover:border-amber-400/40 space-y-2.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 font-mono font-bold text-xs text-amber-300">
                      {s.code}
                    </span>
                    <span className="text-xs font-bold text-neutral-300">
                      {s.language === "DE" && "🇩🇪 Deutsch"}
                      {s.language === "EN" && "🇬🇧 Englisch"}
                      {s.language === "JP" && "🇯🇵 Japanisch"}
                      {s.language === "KR" && "🇰🇷 Koreanisch"}
                      {s.language === "CN" && "🇨🇳 Chinesisch"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">{s.name}</p>
                    {s.nameOriginal && (
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">{s.nameOriginal}</p>
                    )}
                  </div>
                  {s.equivalentName && (
                    <div className="text-[11px] text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-2.5 py-1.5">
                      <ArrowLeftRight className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {s.equivalentName} ({s.equivalentCode})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-white/5">
                    <span>{s.series}</span>
                    <span>
                      {s.releaseYear} • {s.totalCards} Karten
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-[#0c101b]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Sprache</th>
                    <th className="py-3.5 px-4">Set-Kürzel</th>
                    <th className="py-3.5 px-4">Offizieller Name</th>
                    <th className="py-3.5 px-4">Original-Schreibweise</th>
                    <th className="py-3.5 px-4">Gegenstück / Äquivalent</th>
                    <th className="py-3.5 px-4">Jahr / Karten</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300 font-medium">
                  {filteredSets.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => {
                        setSelectedLanguage(s.language);
                        setSelectedSetCode(s.code);
                        setActiveTab("cards");
                      }}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                      title="Klicken, um alle Karten dieses Sets anzuzeigen"
                    >
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
                      <td className="py-3 px-4 font-bold text-white">{s.name}</td>
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
