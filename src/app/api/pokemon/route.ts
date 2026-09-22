import { NextResponse } from "next/server";

// Curated instant-cache of popular cards for instant suggestions
const FALLBACK_POPULAR_CARDS = [
  {
    id: "base1-4",
    name: "Charizard / Glurak",
    set: { id: "base1", name: "Base Set", series: "Base" },
    number: "4/102",
    rarity: "Rare Holo",
    images: {
      small: "https://images.pokemontcg.io/base1/4.png",
      large: "https://images.pokemontcg.io/base1/4_hires.png",
    },
  },
  {
    id: "swsh7-215",
    name: "Umbreon VMAX / Nachtara VMAX (Moonbreon)",
    set: { id: "swsh7", name: "Evolving Skies", series: "Sword & Shield" },
    number: "215/203",
    rarity: "Secret Rare Alternative Art",
    images: {
      small: "https://images.pokemontcg.io/swsh7/215.png",
      large: "https://images.pokemontcg.io/swsh7/215_hires.png",
    },
  },
  {
    id: "swsh7-218",
    name: "Rayquaza VMAX (Alt Art)",
    set: { id: "swsh7", name: "Evolving Skies", series: "Sword & Shield" },
    number: "218/203",
    rarity: "Secret Rare Alternative Art",
    images: {
      small: "https://images.pokemontcg.io/swsh7/218.png",
      large: "https://images.pokemontcg.io/swsh7/218_hires.png",
    },
  },
  {
    id: "sv3pt5-199",
    name: "Charizard ex / Glurak ex (Special Illustration Rare)",
    set: { id: "sv3pt5", name: "151", series: "Scarlet & Violet" },
    number: "199/165",
    rarity: "Special Illustration Rare",
    images: {
      small: "https://images.pokemontcg.io/sv3pt5/199.png",
      large: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
    },
  },
  {
    id: "base1-58",
    name: "Pikachu (Red Cheeks / Shadowless)",
    set: { id: "base1", name: "Base Set", series: "Base" },
    number: "58/102",
    rarity: "Common",
    images: {
      small: "https://images.pokemontcg.io/base1/58.png",
      large: "https://images.pokemontcg.io/base1/58_hires.png",
    },
  },
  {
    id: "neo1-9",
    name: "Lugia",
    set: { id: "neo1", name: "Neo Genesis", series: "Neo" },
    number: "9/111",
    rarity: "Rare Holo",
    images: {
      small: "https://images.pokemontcg.io/neo1/9.png",
      large: "https://images.pokemontcg.io/neo1/9_hires.png",
    },
  },
  {
    id: "swsh8-271",
    name: "Gengar VMAX (Alt Art)",
    set: { id: "swsh8", name: "Fusion Strike", series: "Sword & Shield" },
    number: "271/264",
    rarity: "Secret Rare Alternative Art",
    images: {
      small: "https://images.pokemontcg.io/swsh8/271.png",
      large: "https://images.pokemontcg.io/swsh8/271_hires.png",
    },
  },
  {
    id: "swsh45-SV107",
    name: "Charizard VMAX (Shiny Vault)",
    set: { id: "swsh45sv", name: "Shining Fates", series: "Sword & Shield" },
    number: "SV107/SV122",
    rarity: "Rare Shiny GX",
    images: {
      small: "https://images.pokemontcg.io/swsh45sv/SV107.png",
      large: "https://images.pokemontcg.io/swsh45sv/SV107_hires.png",
    },
  },
  {
    id: "sv04-182",
    name: "Roaring Moon ex",
    set: { id: "sv04", name: "Paradox Rift", series: "Scarlet & Violet" },
    number: "182/182",
    rarity: "Special Illustration Rare",
    images: {
      small: "https://images.pokemontcg.io/sv04/182.png",
      large: "https://images.pokemontcg.io/sv04/182_hires.png",
    },
  },
  {
    id: "sv6pt5-064",
    name: "Greninja ex / Quajutsu ex (SIR)",
    set: { id: "sv6pt5", name: "Shrouded Fable", series: "Scarlet & Violet" },
    number: "064/064",
    rarity: "Special Illustration Rare",
    images: {
      small: "https://images.pokemontcg.io/sv6pt5/64.png",
      large: "https://images.pokemontcg.io/sv6pt5/64_hires.png",
    },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ cards: FALLBACK_POPULAR_CARDS.slice(0, 6) });
  }

  try {
    // Try querying the official Pokemontcg API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}*&pageSize=8&select=id,name,set,number,rarity,images`,
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
        return NextResponse.json({ cards: data.data });
      }
    }
  } catch (err) {
    console.warn("Pokémon API fetch error or timeout, using fallback matching:", err);
  }

  // Fallback fuzzy search within popular list
  const lowerQuery = query.toLowerCase();
  const matched = FALLBACK_POPULAR_CARDS.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.set.name.toLowerCase().includes(lowerQuery)
  );

  return NextResponse.json({
    cards: matched.length > 0 ? matched : FALLBACK_POPULAR_CARDS.slice(0, 4),
  });
}
