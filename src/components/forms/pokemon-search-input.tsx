"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { PokemonApiCard } from "@/types";

interface PokemonSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCard?: (card: PokemonApiCard) => void;
  placeholder?: string;
  required?: boolean;
}

export function PokemonSearchInput({
  value,
  onChange,
  onSelectCard,
  placeholder = "z.B. Glurak, Charizard VMAX, Moonbreon...",
  required = true,
}: PokemonSearchInputProps) {
  const [suggestions, setSuggestions] = useState<PokemonApiCard[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/pokemon?query=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.cards && data.cards.length > 0) {
            setSuggestions(data.cards);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (card: PokemonApiCard) => {
    onChange(`${card.name} (${card.set.name} #${card.number || ""})`);
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
          className="w-full bg-[#111624] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-[#121826] border border-indigo-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto backdrop-blur-xl">
          <div className="px-3 py-2 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Pokémon TCG Autovervollständigung
            </span>
            <span className="opacity-70">Klick füllt Details & Artwork</span>
          </div>

          <div className="p-1 space-y-1">
            {suggestions.map((card) => (
              <button
                type="button"
                key={card.id}
                onClick={() => handleSelect(card)}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group"
              >
                {/* Thumbnail */}
                <div className="w-10 h-14 bg-neutral-900 rounded-md overflow-hidden flex-shrink-0 border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src={card.images.small}
                    alt={card.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {card.name}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    Set: <span className="text-neutral-300">{card.set.name}</span>
                    {card.number && ` • #${card.number}`}
                  </p>
                  {card.rarity && (
                    <span className="inline-block mt-0.5 text-[10px] text-indigo-400 font-medium bg-indigo-500/15 px-1.5 py-0.2 rounded border border-indigo-500/20">
                      {card.rarity}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
