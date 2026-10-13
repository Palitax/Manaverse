"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { PokemonApiCard, CardLanguage } from "@/types";

interface PokemonSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCard?: (card: PokemonApiCard) => void;
  language?: CardLanguage | "ALL";
  placeholder?: string;
  required?: boolean;
}

export function PokemonSearchInput({
  value,
  onChange,
  onSelectCard,
  language,
  placeholder = "z.B. Glurak, Charizard VMAX, Moonbreon...",
  required = true,
}: PokemonSearchInputProps) {
  const [suggestions, setSuggestions] = useState<PokemonApiCard[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = (value || "").trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const langQuery = language && language !== "ALL" && language !== "Egal"
          ? `&language=${encodeURIComponent(language)}`
          : "";
        const res = await fetch(
          `/api/pokemon?query=${encodeURIComponent(trimmed)}${langQuery}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.cards)) {
            setSuggestions(data.cards);
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
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, language]);

  // Click outside and escape key listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (card: PokemonApiCard) => {
    const setNameStr = card.set?.name || "";
    const numStr = card.number ? ` #${card.number}` : "";
    const cleanTitle = setNameStr ? `${card.name} (${setNameStr}${numStr})` : card.name;
    onChange(cleanTitle);
    if (onSelectCard) {
      onSelectCard(card);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm min-h-[44px]"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-[#121826] border border-indigo-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-150">
          <div className="px-3 py-2 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" /> Pokémon TCG Autovervollständigung
            </span>
            <span className="opacity-70 text-[10px]">Klick füllt Details & Artwork</span>
          </div>

          <div className="p-1 space-y-1">
            {suggestions.map((card, idx) => {
              const imageSrc =
                card.images?.small ||
                card.images?.large ||
                (card as any).imageUrl ||
                "https://images.pokemontcg.io/base1/4_hires.png";
              const setName = card.set?.name || (card as any).setName || "Unbekanntes Set";

              return (
                <button
                  type="button"
                  key={card.id || `card-${idx}`}
                  onClick={() => handleSelect(card)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group min-h-[44px] cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-14 bg-neutral-900 rounded-md overflow-hidden flex-shrink-0 border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={imageSrc}
                      alt={card.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback icon if image fails
                        (e.target as HTMLImageElement).src = "/icon.png";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {card.name}
                      </p>
                      {card.nameOriginal && card.nameOriginal !== card.name && (
                        <span className="text-[11px] text-neutral-400 font-mono truncate">
                          ({card.nameOriginal})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      Set: <span className="text-neutral-300">{setName}</span>
                      {card.number && ` • #${card.number}`}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {card.language && (
                        <span className="text-[10px] font-bold text-neutral-300 bg-white/10 px-1.5 py-0.5 rounded">
                          {card.language === "DE"
                            ? "🇩🇪 DE"
                            : card.language === "JP"
                            ? "🇯🇵 JP"
                            : card.language === "KR"
                            ? "🇰🇷 KR"
                            : card.language === "CN"
                            ? "🇨🇳 CN"
                            : "🇬🇧 EN"}
                        </span>
                      )}
                      {card.rarity && (
                        <span className="text-[10px] text-indigo-400 font-medium bg-indigo-500/15 px-1.5 py-0.5 rounded border border-indigo-500/20 truncate max-w-[150px]">
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
