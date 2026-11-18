import { NextResponse } from "next/server";
import { searchTcgCards, findSetByCode } from "@/lib/tcg-index-data";
import {
  searchFullJapaneseIndex,
  fetchLivePokemonCardJpFallback,
  getJpIndexTotalCount,
} from "@/lib/jp-card-index.server";
import { CardLanguage, PokemonApiCard } from "@/types";

function normalizeCard(raw: any, fallbackLang: CardLanguage = "DE"): PokemonApiCard {
  const imageUrl =
    raw.images?.small ||
    raw.images?.large ||
    raw.imageUrl ||
    "/manaforge-card-back.png";

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
    language: (raw.language || fallbackLang) as CardLanguage,
    images: {
      small: imageUrl,
      large: raw.images?.large || imageUrl,
    },
  };
}

function dedupCards(cards: PokemonApiCard[]): PokemonApiCard[] {
  const seen = new Set<string>();
  const out: PokemonApiCard[] = [];
  for (const c of cards) {
    const lang = c.language || "DE";
    const setNorm = (c.set?.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const numNorm = (c.number || "").toLowerCase().replace(/\s+/g, "");
    // Keep Mirror variants distinct via rarity if same number
    const rarKey = (c.rarity || "").toLowerCase().includes("mirror") ? "|mirror" : "";
    const key = numNorm
      ? `${lang}|${setNorm}|${numNorm}${rarKey}`
      : `${lang}|${setNorm}|${c.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

async function fetchTcgdexWesternFallback(
  query: string,
  lang: "de" | "en",
  limit = 8
): Promise<PokemonApiCard[]> {
  try {
    const cleanName = query
      .replace(/#[A-Za-z0-9/-]+/g, "")
      .replace(/\b\d+\/[A-Za-z0-9-]+\b/g, "")
      .trim();
    if (cleanName.length < 2) return [];

    const res = await fetch(
      `https://api.tcgdex.net/v2/${lang}/cards?name=${encodeURIComponent(cleanName)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(1500),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    const withImages = data.filter((c: any) => Boolean(c.image)).slice(0, limit);
    return withImages.map((c: any) => {
      const setId = String(c.id || "").split("-")[0]?.toUpperCase() || "TCG";
      return {
        id: `tcgdex-${lang}-${c.id}`,
        name: String(c.name || cleanName),
        nameOriginal: String(c.name || cleanName),
        nameEn: lang === "en" ? String(c.name) : "",
        nameDe: lang === "de" ? String(c.name) : "",
        language: (lang === "de" ? "DE" : "EN") as CardLanguage,
        number: String(c.localId || ""),
        rarity: "TCG",
        set: {
          id: setId,
          name: `${setId}`,
          series: "Pokémon TCG",
        },
        images: {
          small: `${c.image}/low.webp`,
          large: `${c.image}/high.webp`,
        },
      };
    });
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const rawLangStr = (searchParams.get("language") || "").trim().toUpperCase();
    const validLangs: CardLanguage[] = ["DE", "EN", "JP", "KR", "CN"];
    const langParam: CardLanguage | "ALL" = validLangs.includes(rawLangStr as CardLanguage)
      ? (rawLangStr as CardLanguage)
      : "ALL";
    const strictLang = searchParams.get("strict") === "1";
    const setParam = searchParams.get("set")?.trim() || "";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "18", 10) || 18, 1), 80);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10) || 0, 0);

    // Resolve canonical set code if user passed an alias (e.g. "XYP" -> "XY-P")
    const resolvedSet = setParam ? findSetByCode(setParam)?.code || setParam : "";

    // =========================================================================
    // MODE A: Strict Language Catalog Mode (used by /tcg-index tabs)
    // =========================================================================
    if (strictLang && langParam !== "ALL") {
      if (langParam === "JP") {
        const jpRes = searchFullJapaneseIndex({
          query,
          setCode: resolvedSet || undefined,
          limit,
          offset,
        });

        if (jpRes.cards.length === 0 && query.length >= 2 && offset === 0) {
          const liveJp = await fetchLivePokemonCardJpFallback(query, limit);
          return NextResponse.json({
            cards: liveJp,
            total: liveJp.length,
            jpIndexTotal: getJpIndexTotalCount(),
          });
        }

        return NextResponse.json({
          cards: jpRes.cards,
          total: jpRes.total,
          jpIndexTotal: getJpIndexTotalCount(),
        });
      }

      // Strict DE / EN / KR / CN
      const localStrict = searchTcgCards(query, langParam, resolvedSet || undefined).map((c) =>
        normalizeCard(c, langParam)
      );

      if (
        localStrict.length < limit &&
        query.length >= 2 &&
        offset === 0 &&
        (langParam === "DE" || langParam === "EN")
      ) {
        const extra = await fetchTcgdexWesternFallback(
          query,
          langParam === "DE" ? "de" : "en",
          limit - localStrict.length
        );
        const merged = dedupCards([...localStrict, ...extra]);
        return NextResponse.json({
          cards: merged.slice(0, limit),
          total: merged.length,
          jpIndexTotal: getJpIndexTotalCount(),
        });
      }

      return NextResponse.json({
        cards: localStrict.slice(offset, offset + limit),
        total: localStrict.length,
        jpIndexTotal: getJpIndexTotalCount(),
      });
    }

    // =========================================================================
    // MODE B: Smart Multilingual Search (Autocomplete + "ALL" tab on /tcg-index)
    // Always includes the full 27,200+ card Japanese index so typing ANY valid
    // Japanese card (e.g. "Pikachu 070", "070/XY-P", "Poncho Pikachu", "Glurak SV2a")
    // finds it immediately even before the user switches the language selector!
    // =========================================================================
    if (!query && !resolvedSet) {
      const curatedStarter = searchTcgCards("", langParam === "ALL" ? "ALL" : langParam).map((c) =>
        normalizeCard(c)
      );
      const jpFeatured = searchFullJapaneseIndex({
        query: "",
        limit: limit,
        offset,
      });
      const combinedStarter =
        offset === 0 ? dedupCards([...curatedStarter, ...jpFeatured.cards]) : jpFeatured.cards;
      return NextResponse.json({
        cards: combinedStarter.slice(0, limit),
        total: jpFeatured.total + curatedStarter.length,
        jpIndexTotal: getJpIndexTotalCount(),
      });
    }

    // 1. Search full 27,211+ Japanese card index
    const jpMatches = searchFullJapaneseIndex({
      query,
      setCode: resolvedSet || undefined,
      limit: offset === 0 ? Math.max(limit, 20) : limit,
      offset,
    });

    // 2. Search curated multilingual cards (DE, EN, JP, KR, CN)
    const curatedAll =
      offset === 0
        ? searchTcgCards(query, "ALL", resolvedSet || undefined).map((c) => normalizeCard(c))
        : [];

    // Detect if query explicitly specifies a card number, Japanese promo/set code, or Kana
    const hasSpecificNumberOrJpHint =
      /\b\d{1,3}(\/[A-Za-z0-9-]+)?\b/.test(query) ||
      /[\u3040-\u30ff\u4e00-\u9faf]/.test(query) ||
      /\b(xy-?p|sm-?p|s-?p|sv-?p|m-?p|bw-?p|dp-?p|l-?p|play|sv\d+[a-z]?|s\d+[a-z]?|sm\d+[a-z]?|pmcg|vs1|poncho|munch|yokohama|kanazawa|nagaba|outbreak|stamp)\b/i.test(
        query
      ) ||
      langParam === "JP";

    let ordered: PokemonApiCard[];
    if (hasSpecificNumberOrJpHint) {
      // Exact card number / Japanese query -> prioritize full Japanese index matches first!
      const preferredCurated = curatedAll.filter((c) =>
        langParam !== "ALL" ? c.language === langParam : false
      );
      ordered = dedupCards([...jpMatches.cards, ...preferredCurated, ...curatedAll]);
    } else if (langParam !== "ALL") {
      // Generic Pokémon name query (e.g. "Pikachu", "Glurak") with a preferred language
      const matchingLangCurated = curatedAll.filter((c) => c.language === langParam);
      const otherCurated = curatedAll.filter((c) => c.language !== langParam);
      ordered = dedupCards([...matchingLangCurated, ...jpMatches.cards, ...otherCurated]);
    } else {
      ordered = dedupCards([...curatedAll, ...jpMatches.cards]);
    }

    if (ordered.length > 0) {
      return NextResponse.json({
        cards: ordered.slice(0, limit),
        total: jpMatches.total + curatedAll.length,
        jpIndexTotal: getJpIndexTotalCount(),
      });
    }

    // 3. External live fallbacks (for newly-released future JP sets or vintage DE/EN cards)
    if (query.length >= 2 && offset === 0) {
      const [liveJp, liveDe, liveEn] = await Promise.all([
        fetchLivePokemonCardJpFallback(query, 8),
        fetchTcgdexWesternFallback(query, "de", 6),
        fetchTcgdexWesternFallback(query, "en", 6),
      ]);
      const liveMerged = dedupCards([...liveJp, ...liveDe, ...liveEn]);
      if (liveMerged.length > 0) {
        return NextResponse.json({
          cards: liveMerged.slice(0, limit),
          total: liveMerged.length,
          jpIndexTotal: getJpIndexTotalCount(),
        });
      }
    }

    return NextResponse.json({
      cards: [],
      total: 0,
      jpIndexTotal: getJpIndexTotalCount(),
    });
  } catch (error) {
    console.error("Pokemon API route error:", error);
    return NextResponse.json({ cards: [], total: 0 });
  }
}
