import { NextResponse } from "next/server";
import { searchTcgCards, TCG_CARDS } from "@/lib/tcg-index-data";
import { CardLanguage, PokemonApiCard } from "@/types";

function normalizeCard(raw: any): PokemonApiCard {
  const imageUrl =
    raw.images?.small ||
    raw.images?.large ||
    raw.imageUrl ||
    "https://images.pokemontcg.io/base1/4_hires.png";

  const setCode = raw.set?.id || raw.setCode || "TCG";
  const setName = raw.set?.name || raw.setName || setCode;

  return {
    id: String(raw.id || `card-${Math.random().toString(36).substring(2, 9)}`),
    name: String(raw.name || "Pokémon Karte"),
    nameOriginal: raw.nameOriginal || raw.name || "",
    nameEn: raw.nameEn || raw.name || "",
    nameDe: raw.nameDe || raw.name || "",
    set: {
      id: setCode,
      name: setName.includes(`[${setCode}]`) ? setName : `${setName} [${setCode}]`,
      series: raw.set?.series || raw.series || setCode,
    },
    number: String(raw.number || ""),
    rarity: String(raw.rarity || "Standard"),
    language: (raw.language || "DE") as CardLanguage,
    images: {
      small: imageUrl,
      large: raw.images?.large || imageUrl,
    },
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const langParam = (searchParams.get("language")?.toUpperCase() || "") as CardLanguage | "";

    // 1. Search our curated multilingual TCG index (DE, EN, JP, KR, CN)
    const localMatches = searchTcgCards(query, langParam || "ALL");
    const formattedLocal = localMatches.map(normalizeCard);

    // If query is very short or empty, provide a curated starter preview
    if (!query || query.length < 2) {
      return NextResponse.json({
        cards: formattedLocal.slice(0, 8),
      });
    }

    // If local index has matches, return them immediately (0ms latency, zero crash risk)
    if (formattedLocal.length > 0) {
      return NextResponse.json({ cards: formattedLocal.slice(0, 10) });
    }

    // 2. Query external pokemontcg.io API as fallback for vintage English cards
    // Sanitize query to prevent Lucene syntax crashes (strip parentheses, slashes, quotes)
    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    const primaryWord = cleanQuery.split(/\s+/)[0] || "";

    if (primaryWord.length >= 2) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1400);

        const res = await fetch(
          `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(primaryWord)}*&pageSize=6&select=id,name,set,number,rarity,images`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.data) && data.data.length > 0) {
            const externalNormalized = data.data.map(normalizeCard);
            return NextResponse.json({ cards: externalNormalized.slice(0, 10) });
          }
        }
      } catch (err) {
        // Silently catch aborts/timeouts/network limits
      }
    }

    // Return empty list so input does not display wrong cards or crash
    return NextResponse.json({ cards: [] });
  } catch (error) {
    console.error("Pokemon API route error:", error);
    return NextResponse.json({ cards: [] });
  }
}
