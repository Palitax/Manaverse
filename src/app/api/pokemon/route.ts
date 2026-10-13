import { NextResponse } from "next/server";
import { searchTcgCards, TCG_CARDS } from "@/lib/tcg-index-data";
import { CardLanguage } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || "";
  const langParam = (searchParams.get("language")?.toUpperCase() || "") as CardLanguage | "";

  // 1. Search our curated multilingual TCG index first (DE, EN, JP, KR, CN)
  const localMatches = searchTcgCards(query, langParam || "ALL");
  const formattedLocal = localMatches.map((c) => ({
    id: c.id,
    name: c.name,
    nameOriginal: c.nameOriginal,
    nameEn: c.nameEn,
    nameDe: c.nameDe,
    set: {
      id: c.setCode,
      name: `${c.setName} [${c.setCode}]`,
      series: c.setCode,
    },
    number: c.number,
    rarity: c.rarity,
    language: c.language,
    images: {
      small: c.imageUrl,
      large: c.imageUrl,
    },
  }));

  if (!query || query.length < 2) {
    return NextResponse.json({
      cards: formattedLocal.slice(0, 8),
    });
  }

  // If local index has strong matches, return them immediately!
  if (formattedLocal.length >= 2) {
    return NextResponse.json({ cards: formattedLocal.slice(0, 10) });
  }

  // 2. Query external pokemontcg.io API as fallback for rare English vintage cards
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}*&pageSize=6&select=id,name,set,number,rarity,images`,
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
      if (data.data && data.data.length > 0) {
        // Merge local matches with external results
        const combined = [...formattedLocal, ...data.data];
        return NextResponse.json({ cards: combined.slice(0, 10) });
      }
    }
  } catch (err) {
    console.warn("External Pokémon API fetch skipped/failed, using local index:", err);
  }

  return NextResponse.json({
    cards: formattedLocal.length > 0 ? formattedLocal : TCG_CARDS.slice(0, 5),
  });
}

