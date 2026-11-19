"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { PokemonApiCard, CardLanguage } from "@/types";
import { cn } from "@/lib/utils";
import { LanguageTag } from "@/components/ui/language-tag";

interface PokemonSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCard?: (card: PokemonApiCard) => void;
  language?: CardLanguage | "ALL";
  setHint?: string;
  keepCleanNameOnSelect?: boolean;
  placeholder?: string;
  required?: boolean;
}

export function PokemonSearchInput({
  value,
  onChange,
  onSelectCard,
  language,
  setHint,
  keepCleanNameOnSelect = false,
  placeholder = "z.B. Pikachu 070/XY-P, Glurak ex, リザードン, Moonbreon...",
  required = true,
}: PokemonSearchInputProps) {
  const [suggestions, setSuggestions] = useState<PokemonApiCard[]>([]);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suppressNextFetchRef = useRef<boolean>(false);

  useEffect(() => {
    if (suppressNextFetchRef.current) {
      suppressNextFetchRef.current = false;
      return;
    }

    const trimmed = (value || "").trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setTotalMatches(0);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const langQuery =
          language && language !== "ALL" && language !== "Egal" && language !== "OTHER"
            ? `&language=${encodeURIComponent(language)}`
            : "";
        const setQuery =
          setHint && setHint.trim().length > 0
            ? `&set=${encodeURIComponent(setHint.trim())}`
            : "";
        const res = await fetch(
          `/api/pokemon?query=${encodeURIComponent(trimmed)}${langQuery}${setQuery}&limit=16`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.cards)) {
            setSuggestions(data.cards);
            setTotalMatches(Number(data?.total || data.cards.length));
            setActiveIndex(-1);
            setIsOpen(data.cards.length > 0);
          }
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("Autocomplete fetch error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, language, setHint]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (card: PokemonApiCard) => {
    suppressNextFetchRef.current = true;
    setIsOpen(false);
    setActiveIndex(-1);

    if (keepCleanNameOnSelect) {
      onChange(card.name);
    } else {
      const setNameStr = card.set?.name || "";
      const numStr = card.number ? ` #${card.number}` : "";
      const cleanTitle = setNameStr ? `${card.name} (${setNameStr}${numStr})` : card.name;
      onChange(cleanTitle);
    }

    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Escape") setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            suppressNextFetchRef.current = false;
            onChange(e.target.value);
          }}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full bg-surface-2 border border-hairline rounded-xl px-4 py-3 pl-11 text-ink placeholder:text-ink-subtle focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-colors text-sm min-h-[46px]"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-surface-1 border border-hairline-strong rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden max-h-96 overflow-y-auto backdrop-blur-xl toast-enter">
          <div className="px-3.5 py-2 bg-surface-2/95 border-b border-hairline flex items-center justify-between gap-2 text-[11px] text-ink-muted font-semibold sticky top-0 backdrop-blur-md z-10">
            <span className="flex items-center gap-1.5 truncate">
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                TCG-Index ({totalMatches > suggestions.length ? `${suggestions.length} von ${totalMatches.toLocaleString("de-DE")}` : `${suggestions.length}`} Treffer)
              </span>
            </span>
            <span className="opacity-75 text-[10px] hidden sm:inline flex-shrink-0">
              Auswahl übernimmt Set, Nummer & Sprache
            </span>
          </div>

          <div className="p-1.5 space-y-1">
            {suggestions.map((card, idx) => {
              const imageSrc =
                card.images?.small ||
                card.images?.large ||
                (card as any).imageUrl ||
                "/manaforge-card-back.png";
              const setName = card.set?.name || (card as any).setName || "Unbekanntes Set";
              const isHighlighted = idx === activeIndex;

              return (
                <button
                  type="button"
                  key={card.id || `card-${idx}`}
                  onClick={() => handleSelect(card)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-left group min-h-[54px] cursor-pointer",
                    isHighlighted ? "bg-white/[0.07] border border-hairline-strong" : "hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-14 bg-black/80 rounded-md overflow-hidden flex-shrink-0 border border-white/10 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center p-0.5">
                    <img
                      src={imageSrc}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/manaforge-card-back.png";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-ink truncate">
                        {card.language === "DE" && card.nameDe ? card.nameDe : card.name}
                      </p>
                      {card.nameOriginal && card.nameOriginal !== card.name && (
                        <span className="text-[11px] text-neutral-400 font-mono truncate">
                          ({card.nameOriginal})
                        </span>
                      )}
                      {card.number && (
                        <span className="text-[11px] font-mono font-bold text-ink-muted">
                          #{card.number}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      <span className="text-neutral-300">{setName}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {card.language && (
                        <LanguageTag lang={card.language} className="px-1.5 py-0.5" />
                      )}
                      {card.set?.id && (
                        <span className="text-[10px] font-mono font-bold text-ink-muted bg-white/[0.04] px-1.5 py-0.5 rounded-md border border-hairline">
                          {card.set.id}
                        </span>
                      )}
                      {card.rarity && card.rarity !== "Standard" && (
                        <span className="text-[10px] text-ink-subtle font-medium bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-hairline truncate max-w-[170px]">
                          {card.rarity}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
