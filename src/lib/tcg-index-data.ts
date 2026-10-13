import { CardLanguage } from "@/types";

export interface TcgSet {
  id: string;
  code: string; // e.g. "JTG", "SV2a", "MEW", "OBF", "PRE", "SV8a", "S6a"
  name: string;
  nameOriginal?: string;
  language: CardLanguage;
  series: string;
  releaseYear: number;
  totalCards: number;
  equivalentCode?: string; // Cross-link to counterpart (e.g. MEW <-> SV2a)
  equivalentName?: string;
  aliases: string[];
}

export interface TcgCard {
  id: string;
  name: string; // Primary clean name
  nameOriginal: string; // Original Kana / Hangul / Hanzi / German
  nameEn: string; // English standard
  nameDe: string; // German standard
  pokemon: string; // Base creature
  setCode: string; // Standard short code
  setName: string;
  number: string; // e.g. "199/165", "201/165", "215/203"
  language: CardLanguage;
  rarity: string;
  imageUrl: string;
}

// ============================================================================
// 1. COMPREHENSIVE SETS DIRECTORY (DE, EN, JP, KR, CN)
// ============================================================================
export const TCG_SETS: TcgSet[] = [
  // --- DEUTSCH (DE) ---
  {
    id: "sv9-jtg-de",
    code: "JTG",
    name: "Gemeinsam auf Reisen",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2025,
    totalCards: 180,
    equivalentCode: "SV9",
    equivalentName: "Battle Partners (JP)",
    aliases: ["JTG", "Journey Together", "Gemeinsam auf Reisen", "SV9-DE"],
  },
  {
    id: "sv8pt5-pre-de",
    code: "PRE",
    name: "Prismatische Entwicklungen",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2025,
    totalCards: 175,
    equivalentCode: "SV8a",
    equivalentName: "Terastal Festival ex (JP)",
    aliases: ["PRE", "Prismatische Entwicklungen", "Prismatic Evolutions", "SV8.5"],
  },
  {
    id: "sv8-ssp-de",
    code: "SSP",
    name: "Stürzende Funken",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2024,
    totalCards: 252,
    equivalentCode: "SV8",
    equivalentName: "Super Electric Breaker (JP)",
    aliases: ["SSP", "Stürzende Funken", "Surging Sparks", "SV8"],
  },
  {
    id: "sv7-scr-de",
    code: "SCR",
    name: "Stellarkrone",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2024,
    totalCards: 175,
    equivalentCode: "SV7",
    equivalentName: "Stellar Miracle (JP)",
    aliases: ["SCR", "Stellarkrone", "Stellar Crown", "SV7"],
  },
  {
    id: "sv6-twm-de",
    code: "TWM",
    name: "Maskerade des Grauens",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2024,
    totalCards: 226,
    equivalentCode: "SV6",
    equivalentName: "Mask of Change (JP)",
    aliases: ["TWM", "Maskerade des Grauens", "Twilight Masquerade", "SV6"],
  },
  {
    id: "sv5-tef-de",
    code: "TEF",
    name: "Gewalten der Zeit",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2024,
    totalCards: 218,
    equivalentCode: "SV5K",
    equivalentName: "Wild Force / Cyber Judge (JP)",
    aliases: ["TEF", "Gewalten der Zeit", "Temporal Forces", "SV5"],
  },
  {
    id: "sv4pt5-paf-de",
    code: "PAF",
    name: "Paldeas Schicksale",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2024,
    totalCards: 245,
    equivalentCode: "SV4a",
    equivalentName: "Shiny Treasure ex (JP)",
    aliases: ["PAF", "Paldeas Schicksale", "Paldean Fates", "SV4.5"],
  },
  {
    id: "sv3pt5-mew-de",
    code: "MEW",
    name: "151",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2023,
    totalCards: 207,
    equivalentCode: "SV2a",
    equivalentName: "Pokémon Card 151 (JP/KR)",
    aliases: ["MEW", "151", "Pokemon 151", "Karmesin & Purpur 151"],
  },
  {
    id: "sv3-obf-de",
    code: "OBF",
    name: "Obsidianflammen",
    language: "DE",
    series: "Karmesin & Purpur",
    releaseYear: 2023,
    totalCards: 230,
    equivalentCode: "SV3",
    equivalentName: "Ruler of the Black Flame (JP)",
    aliases: ["OBF", "Obsidianflammen", "Obsidian Flames", "SV3"],
  },
  {
    id: "swsh12pt5-crz-de",
    code: "CRZ",
    name: "Zenit der Könige",
    language: "DE",
    series: "Schwert & Schild",
    releaseYear: 2023,
    totalCards: 230,
    equivalentCode: "S12a",
    equivalentName: "VSTAR Universe (JP)",
    aliases: ["CRZ", "Zenit der Könige", "Crown Zenith", "SWSH12.5"],
  },
  {
    id: "swsh7-evs-de",
    code: "EVS",
    name: "Drachenwandel",
    language: "DE",
    series: "Schwert & Schild",
    releaseYear: 2021,
    totalCards: 237,
    equivalentCode: "S6a",
    equivalentName: "Eevee Heroes (JP)",
    aliases: ["EVS", "Drachenwandel", "Evolving Skies", "SWSH7"],
  },
  {
    id: "swsh8-fst-de",
    code: "FST",
    name: "Fusionsangriff",
    language: "DE",
    series: "Schwert & Schild",
    releaseYear: 2021,
    totalCards: 284,
    equivalentCode: "S8",
    equivalentName: "Fusion Arts (JP)",
    aliases: ["FST", "Fusionsangriff", "Fusion Strike", "SWSH8"],
  },
  {
    id: "base1-de",
    code: "BASE",
    name: "Grundset (Base Set)",
    language: "DE",
    series: "Klassik Base",
    releaseYear: 1999,
    totalCards: 102,
    equivalentCode: "BASE-EN",
    equivalentName: "Base Set (EN)",
    aliases: ["BASE", "Grundset", "Base Set", "1999"],
  },

  // --- ENGLISCH (EN) ---
  {
    id: "sv9-jtg-en",
    code: "JTG",
    name: "Journey Together",
    language: "EN",
    series: "Scarlet & Violet",
    releaseYear: 2025,
    totalCards: 180,
    equivalentCode: "SV9",
    equivalentName: "Battle Partners (JP)",
    aliases: ["JTG", "Journey Together", "SV9"],
  },
  {
    id: "sv8pt5-pre-en",
    code: "PRE",
    name: "Prismatic Evolutions",
    language: "EN",
    series: "Scarlet & Violet",
    releaseYear: 2025,
    totalCards: 175,
    equivalentCode: "SV8a",
    equivalentName: "Terastal Festival ex (JP)",
    aliases: ["PRE", "Prismatic Evolutions", "SV8.5"],
  },
  {
    id: "sv8-ssp-en",
    code: "SSP",
    name: "Surging Sparks",
    language: "EN",
    series: "Scarlet & Violet",
    releaseYear: 2024,
    totalCards: 252,
    equivalentCode: "SV8",
    equivalentName: "Super Electric Breaker (JP)",
    aliases: ["SSP", "Surging Sparks", "SV8"],
  },
  {
    id: "sv3pt5-mew-en",
    code: "MEW",
    name: "151",
    language: "EN",
    series: "Scarlet & Violet",
    releaseYear: 2023,
    totalCards: 207,
    equivalentCode: "SV2a",
    equivalentName: "Pokémon Card 151 (JP)",
    aliases: ["MEW", "151", "Pokemon 151", "Scarlet & Violet 151"],
  },
  {
    id: "sv3-obf-en",
    code: "OBF",
    name: "Obsidian Flames",
    language: "EN",
    series: "Scarlet & Violet",
    releaseYear: 2023,
    totalCards: 230,
    equivalentCode: "SV3",
    equivalentName: "Ruler of the Black Flame (JP)",
    aliases: ["OBF", "Obsidian Flames", "SV3"],
  },
  {
    id: "swsh7-evs-en",
    code: "EVS",
    name: "Evolving Skies",
    language: "EN",
    series: "Sword & Shield",
    releaseYear: 2021,
    totalCards: 237,
    equivalentCode: "S6a",
    equivalentName: "Eevee Heroes (JP)",
    aliases: ["EVS", "Evolving Skies", "SWSH7"],
  },

  // --- JAPANISCH (JP) ---
  {
    id: "sv9-jp",
    code: "SV9",
    name: "Battle Partners",
    nameOriginal: "バトルパートナーズ",
    language: "JP",
    series: "Scarlet & Violet",
    releaseYear: 2025,
    totalCards: 140,
    equivalentCode: "JTG",
    equivalentName: "Journey Together (EN/DE)",
    aliases: ["SV9", "Battle Partners", "バトルパートナーズ"],
  },
  {
    id: "sv8a-jp",
    code: "SV8a",
    name: "Terastal Festival ex",
    nameOriginal: "テラスタルフェスex",
    language: "JP",
    series: "Scarlet & Violet",
    releaseYear: 2024,
    totalCards: 187,
    equivalentCode: "PRE",
    equivalentName: "Prismatic Evolutions (EN/DE)",
    aliases: ["SV8a", "Terastal Festival", "テラスタルフェスex", "High Class Pack"],
  },
  {
    id: "sv8-jp",
    code: "SV8",
    name: "Super Electric Breaker",
    nameOriginal: "超電ブレイカー",
    language: "JP",
    series: "Scarlet & Violet",
    releaseYear: 2024,
    totalCards: 106,
    equivalentCode: "SSP",
    equivalentName: "Surging Sparks (EN/DE)",
    aliases: ["SV8", "Super Electric Breaker", "超電ブレイカー"],
  },
  {
    id: "sv4a-jp",
    code: "SV4a",
    name: "Shiny Treasure ex",
    nameOriginal: "シャイニートレジャーex",
    language: "JP",
    series: "Scarlet & Violet",
    releaseYear: 2023,
    totalCards: 190,
    equivalentCode: "PAF",
    equivalentName: "Paldean Fates (EN/DE)",
    aliases: ["SV4a", "Shiny Treasure", "シャイニートレジャーex"],
  },
  {
    id: "sv3-jp",
    code: "SV3",
    name: "Ruler of the Black Flame",
    nameOriginal: "黒炎の支配者",
    language: "JP",
    series: "Scarlet & Violet",
    releaseYear: 2023,
    totalCards: 108,
    equivalentCode: "OBF",
    equivalentName: "Obsidian Flames (EN/DE)",
    aliases: ["SV3", "Ruler of the Black Flame", "黒炎の支配者"],
  },
  {
    id: "sv2a-jp",
    code: "SV2a",
    name: "Pokémon Card 151",
    nameOriginal: "ポケモンカード151",
    language: "JP",
    series: "Scarlet & Violet",
    releaseYear: 2023,
    totalCards: 165,
    equivalentCode: "MEW",
    equivalentName: "151 (EN/DE)",
    aliases: ["SV2a", "151 JP", "Pokemon Card 151", "ポケモンカード151"],
  },
  {
    id: "s12a-jp",
    code: "S12a",
    name: "VSTAR Universe",
    nameOriginal: "VSTARユニバース",
    language: "JP",
    series: "Sword & Shield",
    releaseYear: 2022,
    totalCards: 172,
    equivalentCode: "CRZ",
    equivalentName: "Crown Zenith (EN/DE)",
    aliases: ["S12a", "VSTAR Universe", "VSTARユニバース"],
  },
  {
    id: "s8b-jp",
    code: "S8b",
    name: "VMAX Climax",
    nameOriginal: "VMAXクライマックス",
    language: "JP",
    series: "Sword & Shield",
    releaseYear: 2021,
    totalCards: 184,
    equivalentCode: "SWSH-CHR",
    equivalentName: "Character Secret Rares",
    aliases: ["S8b", "VMAX Climax", "VMAXクライマックス"],
  },
  {
    id: "s6a-jp",
    code: "S6a",
    name: "Eevee Heroes",
    nameOriginal: "イーブイヒーローズ",
    language: "JP",
    series: "Sword & Shield",
    releaseYear: 2021,
    totalCards: 69,
    equivalentCode: "EVS",
    equivalentName: "Evolving Skies (EN/DE)",
    aliases: ["S6a", "Eevee Heroes", "イーブイヒーローズ"],
  },

  // --- KOREANISCH (KR) ---
  {
    id: "sv8a-kr",
    code: "SV8a-KR",
    name: "Terastal Festival ex",
    nameOriginal: "테라스탈 페스티벌 ex",
    language: "KR",
    series: "Scarlet & Violet",
    releaseYear: 2025,
    totalCards: 187,
    equivalentCode: "SV8a",
    equivalentName: "Terastal Festival ex (JP)",
    aliases: ["SV8a-KR", "테라스탈", "Terastal Festival KR"],
  },
  {
    id: "sv2a-kr",
    code: "SV2a-KR",
    name: "Pokémon Card 151",
    nameOriginal: "포켓몬카드 151",
    language: "KR",
    series: "Scarlet & Violet",
    releaseYear: 2023,
    totalCards: 165,
    equivalentCode: "SV2a",
    equivalentName: "Pokémon Card 151 (JP)",
    aliases: ["SV2a-KR", "151 KR", "포켓몬카드 151"],
  },
  {
    id: "s6a-kr",
    code: "S6a-KR",
    name: "Eevee Heroes",
    nameOriginal: "이브이 히어로즈",
    language: "KR",
    series: "Sword & Shield",
    releaseYear: 2021,
    totalCards: 69,
    equivalentCode: "S6a",
    equivalentName: "Eevee Heroes (JP)",
    aliases: ["S6a-KR", "Eevee Heroes KR", "이브이 히어로즈"],
  },

  // --- CHINESISCH (CN) ---
  {
    id: "cs4-cn",
    code: "CS4",
    name: "Shining Synergy",
    nameOriginal: "闪色交云",
    language: "CN",
    series: "Crossing Sun & Moon",
    releaseYear: 2024,
    totalCards: 160,
    equivalentCode: "SM-SHINY",
    equivalentName: "Hidden Fates / Shiny Star V",
    aliases: ["CS4", "CS4a", "CS4b", "闪色交云", "Shining Synergy"],
  },
  {
    id: "cs3-cn",
    code: "CS3",
    name: "Nine Colors Gathering",
    nameOriginal: "九彩汇聚",
    language: "CN",
    series: "Crossing Sun & Moon",
    releaseYear: 2023,
    totalCards: 155,
    equivalentCode: "S6a",
    equivalentName: "Eevee Heroes / Blue Sky Stream",
    aliases: ["CS3", "CS3a", "CS3b", "九彩汇聚", "Nine Colors"],
  },
  {
    id: "cs1-cn",
    code: "CS1",
    name: "Sun & Moon Base CN",
    nameOriginal: "太阳&月亮 横空出世",
    language: "CN",
    series: "Crossing Sun & Moon",
    releaseYear: 2022,
    totalCards: 150,
    equivalentCode: "SM1",
    equivalentName: "Sun & Moon Base",
    aliases: ["CS1", "CS1a", "CS1b", "横空出世"],
  },
];

// ============================================================================
// 2. CURATED MASTER CARD DIRECTORY (AUTHENTIC MULTILINGUAL)
// ============================================================================
export const TCG_CARDS: TcgCard[] = [
  // --- GLURAK / CHARIZARD CARDS ---
  {
    id: "charizard-mew-199-de",
    name: "Glurak ex",
    nameOriginal: "Glurak ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Glurak",
    setCode: "MEW",
    setName: "151",
    number: "199/165",
    language: "DE",
    rarity: "Special Illustration Rare",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
  },
  {
    id: "charizard-mew-199-en",
    name: "Charizard ex",
    nameOriginal: "Charizard ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Charizard",
    setCode: "MEW",
    setName: "151",
    number: "199/165",
    language: "EN",
    rarity: "Special Illustration Rare",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
  },
  {
    id: "charizard-sv2a-201-jp",
    name: "Charizard ex",
    nameOriginal: "リザードン ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Charizard",
    setCode: "SV2a",
    setName: "Pokémon Card 151",
    number: "201/165",
    language: "JP",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
  },
  {
    id: "charizard-sv2a-201-kr",
    name: "Charizard ex",
    nameOriginal: "리자몽 ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Charizard",
    setCode: "SV2a-KR",
    setName: "포켓몬카드 151",
    number: "201/165",
    language: "KR",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
  },
  {
    id: "charizard-cs4-cn",
    name: "Charizard GX",
    nameOriginal: "喷火龙 GX",
    nameEn: "Charizard GX",
    nameDe: "Glurak GX",
    pokemon: "Charizard",
    setCode: "CS4",
    setName: "Shining Synergy (闪色交云)",
    number: "150/150",
    language: "CN",
    rarity: "HR (Hyper Rare)",
    imageUrl: "https://images.pokemontcg.io/sm115/SV49_hires.png",
  },
  {
    id: "charizard-obf-223-de",
    name: "Glurak ex",
    nameOriginal: "Glurak ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Glurak",
    setCode: "OBF",
    setName: "Obsidianflammen",
    number: "223/197",
    language: "DE",
    rarity: "Special Illustration Rare",
    imageUrl: "https://images.pokemontcg.io/sv3/223_hires.png",
  },
  {
    id: "charizard-sv3-134-jp",
    name: "Charizard ex",
    nameOriginal: "リザードン ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Charizard",
    setCode: "SV3",
    setName: "Ruler of the Black Flame",
    number: "134/108",
    language: "JP",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/sv3/223_hires.png",
  },
  {
    id: "charizard-jtg-de",
    name: "Glurak ex",
    nameOriginal: "Glurak ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Glurak",
    setCode: "JTG",
    setName: "Gemeinsam auf Reisen",
    number: "006/180",
    language: "DE",
    rarity: "Double Rare",
    imageUrl: "https://images.pokemontcg.io/base1/4_hires.png",
  },
  {
    id: "charizard-jtg-en",
    name: "Charizard ex",
    nameOriginal: "Charizard ex",
    nameEn: "Charizard ex",
    nameDe: "Glurak ex",
    pokemon: "Charizard",
    setCode: "JTG",
    setName: "Journey Together",
    number: "006/180",
    language: "EN",
    rarity: "Double Rare",
    imageUrl: "https://images.pokemontcg.io/base1/4_hires.png",
  },
  {
    id: "charizard-base1-4-de",
    name: "Glurak (Holo)",
    nameOriginal: "Glurak (1. Edition)",
    nameEn: "Charizard (Shadowless / 1st Edition)",
    nameDe: "Glurak (Holo)",
    pokemon: "Glurak",
    setCode: "BASE",
    setName: "Grundset (Base Set)",
    number: "4/102",
    language: "DE",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/4_hires.png",
  },

  // --- NACHTARA / UMBREON CARDS ---
  {
    id: "umbreon-evs-215-de",
    name: "Nachtara VMAX",
    nameOriginal: "Nachtara VMAX (Mondbreon)",
    nameEn: "Umbreon VMAX (Moonbreon Alt Art)",
    nameDe: "Nachtara VMAX",
    pokemon: "Nachtara",
    setCode: "EVS",
    setName: "Drachenwandel",
    number: "215/203",
    language: "DE",
    rarity: "Secret Rare Alternative Art",
    imageUrl: "https://images.pokemontcg.io/swsh7/215_hires.png",
  },
  {
    id: "umbreon-evs-215-en",
    name: "Umbreon VMAX",
    nameOriginal: "Umbreon VMAX (Moonbreon)",
    nameEn: "Umbreon VMAX (Moonbreon Alt Art)",
    nameDe: "Nachtara VMAX",
    pokemon: "Umbreon",
    setCode: "EVS",
    setName: "Evolving Skies",
    number: "215/203",
    language: "EN",
    rarity: "Secret Rare Alternative Art",
    imageUrl: "https://images.pokemontcg.io/swsh7/215_hires.png",
  },
  {
    id: "umbreon-s6a-095-jp",
    name: "Umbreon VMAX",
    nameOriginal: "ブラッキー VMAX",
    nameEn: "Umbreon VMAX",
    nameDe: "Nachtara VMAX",
    pokemon: "Umbreon",
    setCode: "S6a",
    setName: "Eevee Heroes (イーブイヒーローズ)",
    number: "095/069",
    language: "JP",
    rarity: "HR (Special Art)",
    imageUrl: "https://images.pokemontcg.io/swsh7/215_hires.png",
  },
  {
    id: "umbreon-s6a-095-kr",
    name: "Umbreon VMAX",
    nameOriginal: "블래키 VMAX",
    nameEn: "Umbreon VMAX",
    nameDe: "Nachtara VMAX",
    pokemon: "Umbreon",
    setCode: "S6a-KR",
    setName: "Eevee Heroes (이브이 히어로즈)",
    number: "095/069",
    language: "KR",
    rarity: "HR (Special Art)",
    imageUrl: "https://images.pokemontcg.io/swsh7/215_hires.png",
  },
  {
    id: "umbreon-sv8a-pre-jp",
    name: "Umbreon ex",
    nameOriginal: "ブラッキー ex",
    nameEn: "Umbreon ex",
    nameDe: "Nachtara ex",
    pokemon: "Umbreon",
    setCode: "SV8a",
    setName: "Terastal Festival ex",
    number: "207/187",
    language: "JP",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/swsh7/215_hires.png",
  },

  // --- PIKACHU CARDS ---
  {
    id: "pikachu-ssp-238-de",
    name: "Pikachu ex",
    nameOriginal: "Pikachu ex",
    nameEn: "Pikachu ex",
    nameDe: "Pikachu ex",
    pokemon: "Pikachu",
    setCode: "SSP",
    setName: "Stürzende Funken",
    number: "238/252",
    language: "DE",
    rarity: "Special Illustration Rare",
    imageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
  },
  {
    id: "pikachu-sv8-122-jp",
    name: "Pikachu ex",
    nameOriginal: "ピカチュウ ex",
    nameEn: "Pikachu ex",
    nameDe: "Pikachu ex",
    pokemon: "Pikachu",
    setCode: "SV8",
    setName: "Super Electric Breaker",
    number: "122/106",
    language: "JP",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
  },
  {
    id: "pikachu-base-58-de",
    name: "Pikachu (Rote Backen)",
    nameOriginal: "Pikachu (Red Cheeks)",
    nameEn: "Pikachu (Red Cheeks)",
    nameDe: "Pikachu (Rote Backen)",
    pokemon: "Pikachu",
    setCode: "BASE",
    setName: "Grundset (Base Set)",
    number: "58/102",
    language: "DE",
    rarity: "Common",
    imageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
  },

  // --- GENGAR CARDS ---
  {
    id: "gengar-fst-271-de",
    name: "Gengar VMAX",
    nameOriginal: "Gengar VMAX",
    nameEn: "Gengar VMAX (Alt Art)",
    nameDe: "Gengar VMAX",
    pokemon: "Gengar",
    setCode: "FST",
    setName: "Fusionsangriff",
    number: "271/264",
    language: "DE",
    rarity: "Secret Rare Alternative Art",
    imageUrl: "https://images.pokemontcg.io/swsh8/271_hires.png",
  },
  {
    id: "gengar-s8-020-jp",
    name: "Gengar VMAX",
    nameOriginal: "ゲンガー VMAX",
    nameEn: "Gengar VMAX",
    nameDe: "Gengar VMAX",
    pokemon: "Gengar",
    setCode: "S8",
    setName: "Fusion Arts",
    number: "020/100",
    language: "JP",
    rarity: "SA (Special Art)",
    imageUrl: "https://images.pokemontcg.io/swsh8/271_hires.png",
  },

  // --- MEWTU / MEWTWO CARDS ---
  {
    id: "mewtwo-crz-gg44-de",
    name: "Mewtu VSTAR",
    nameOriginal: "Mewtu VSTAR (Galerie)",
    nameEn: "Mewtwo VSTAR (Galarian Gallery)",
    nameDe: "Mewtu VSTAR",
    pokemon: "Mewtu",
    setCode: "CRZ",
    setName: "Zenit der Könige",
    number: "GG44/GG70",
    language: "DE",
    rarity: "Galarian Gallery Secret",
    imageUrl: "https://images.pokemontcg.io/swsh12pt5/GG44_hires.png",
  },
  {
    id: "mewtwo-s12a-221-jp",
    name: "Mewtwo VSTAR",
    nameOriginal: "ミュウツー VSTAR",
    nameEn: "Mewtwo VSTAR",
    nameDe: "Mewtu VSTAR",
    pokemon: "Mewtwo",
    setCode: "S12a",
    setName: "VSTAR Universe",
    number: "221/172",
    language: "JP",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/swsh12pt5/GG44_hires.png",
  },
  {
    id: "mewtwo-s12a-221-kr",
    name: "Mewtwo VSTAR",
    nameOriginal: "뮤츠 VSTAR",
    nameEn: "Mewtwo VSTAR",
    nameDe: "Mewtu VSTAR",
    pokemon: "Mewtwo",
    setCode: "S12a-KR",
    setName: "VSTAR Universe KR",
    number: "221/172",
    language: "KR",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/swsh12pt5/GG44_hires.png",
  },
  {
    id: "mewtwo-cs3-cn",
    name: "Mewtwo GX",
    nameOriginal: "超梦 GX",
    nameEn: "Mewtwo GX",
    nameDe: "Mewtu GX",
    pokemon: "Mewtwo",
    setCode: "CS3",
    setName: "Nine Colors Gathering (九彩汇聚)",
    number: "078/155",
    language: "CN",
    rarity: "RR",
    imageUrl: "https://images.pokemontcg.io/sm35/78_hires.png",
  },

  // --- RAYQUAZA CARDS ---
  {
    id: "rayquaza-evs-218-de",
    name: "Rayquaza VMAX",
    nameOriginal: "Rayquaza VMAX",
    nameEn: "Rayquaza VMAX (Alt Art)",
    nameDe: "Rayquaza VMAX",
    pokemon: "Rayquaza",
    setCode: "EVS",
    setName: "Drachenwandel",
    number: "218/203",
    language: "DE",
    rarity: "Secret Rare Alternative Art",
    imageUrl: "https://images.pokemontcg.io/swsh7/218_hires.png",
  },
  {
    id: "rayquaza-s7r-083-jp",
    name: "Rayquaza VMAX",
    nameOriginal: "レックウザ VMAX",
    nameEn: "Rayquaza VMAX",
    nameDe: "Rayquaza VMAX",
    pokemon: "Rayquaza",
    setCode: "S7R",
    setName: "Blue Sky Stream (蒼空ストリーム)",
    number: "083/067",
    language: "JP",
    rarity: "HR (Special Art)",
    imageUrl: "https://images.pokemontcg.io/swsh7/218_hires.png",
  },

  // --- QUAJUTSU / GRENINJA CARDS ---
  {
    id: "greninja-twm-214-de",
    name: "Quajutsu ex",
    nameOriginal: "Quajutsu ex",
    nameEn: "Greninja ex",
    nameDe: "Quajutsu ex",
    pokemon: "Quajutsu",
    setCode: "TWM",
    setName: "Maskerade des Grauens",
    number: "214/226",
    language: "DE",
    rarity: "Special Illustration Rare",
    imageUrl: "https://images.pokemontcg.io/sv6pt5/64_hires.png",
  },
  {
    id: "greninja-sv6-130-jp",
    name: "Greninja ex",
    nameOriginal: "ゲッコウガ ex",
    nameEn: "Greninja ex",
    nameDe: "Quajutsu ex",
    pokemon: "Greninja",
    setCode: "SV6",
    setName: "Mask of Change (変幻の仮面)",
    number: "130/101",
    language: "JP",
    rarity: "SAR (Special Art Rare)",
    imageUrl: "https://images.pokemontcg.io/sv6pt5/64_hires.png",
  },
];

// ============================================================================
// 3. INTELLIGENT SEARCH & CROSS-VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Searches the TCG Index by query string, language filter, or set code
 */
export function searchTcgCards(
  query: string,
  languageFilter?: CardLanguage | "ALL",
  setCodeFilter?: string
): TcgCard[] {
  let list = TCG_CARDS;

  if (languageFilter && languageFilter !== "ALL") {
    list = list.filter((c) => c.language === languageFilter);
  }

  if (setCodeFilter) {
    const normSet = setCodeFilter.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.setCode.toLowerCase() === normSet ||
        c.setName.toLowerCase().includes(normSet)
    );
  }

  if (!query || query.trim().length === 0) {
    return list;
  }

  const q = query.trim().toLowerCase();
  return list.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.nameOriginal.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.nameDe.toLowerCase().includes(q) ||
      c.pokemon.toLowerCase().includes(q) ||
      c.setCode.toLowerCase().includes(q) ||
      c.setName.toLowerCase().includes(q) ||
      c.number.toLowerCase().includes(q)
    );
  });
}

/**
 * Returns all TCG sets filtered by language
 */
export function getTcgSets(languageFilter?: CardLanguage | "ALL"): TcgSet[] {
  if (!languageFilter || languageFilter === "ALL") {
    return TCG_SETS;
  }
  return TCG_SETS.filter((s) => s.language === languageFilter);
}

/**
 * Finds a set by its code (e.g. "JTG", "SV2a", "MEW", "OBF") or alias
 */
export function findSetByCode(codeOrAlias: string): TcgSet | undefined {
  if (!codeOrAlias) return undefined;
  const target = codeOrAlias.trim().toLowerCase();

  return TCG_SETS.find(
    (s) =>
      s.code.toLowerCase() === target ||
      s.id.toLowerCase() === target ||
      s.aliases.some((a) => a.toLowerCase() === target)
  );
}

/**
 * Detects the native language of a given set code or name.
 * e.g. "SV2a" -> "JP", "JTG" -> "DE"/"EN", "CS1" -> "CN"
 */
export function detectSetLanguage(codeOrName: string): CardLanguage | null {
  if (!codeOrName) return null;
  const set = findSetByCode(codeOrName);
  if (set) return set.language;

  const lower = codeOrName.trim().toLowerCase();
  // Japanese patterns
  if (
    lower.startsWith("sv") &&
    (lower.endsWith("a") || lower.endsWith("k") || lower.endsWith("m") || lower.endsWith("p") || lower.endsWith("d"))
  ) {
    return "JP";
  }
  if (lower.startsWith("s") && (lower.endsWith("a") || lower.endsWith("b") || lower.endsWith("r") || lower.endsWith("d"))) {
    return "JP";
  }
  // Chinese patterns
  if (lower.startsWith("cs")) {
    return "CN";
  }
  // Western patterns
  if (["jtg", "pre", "ssp", "scr", "twm", "tef", "paf", "mew", "obf", "pal", "svi", "crz", "evs", "fst"].includes(lower)) {
    return "DE";
  }

  return null;
}

/**
 * Cross-validates a set code against a chosen language as requested:
 * "Damit, wenn ich jetzt zum Beispiel oben auswähle, ich habe ein Glurak und ich gebe ein bei Set, das ist zum Beispiel jetzt Japanisch oder sagen wir mal Deutsch, JTG, also Journey Together, dann soll er mir direkt die Sprache der Karte halt auch so setzen. Genau andersrum, wenn ich sage, das ist eine deutsche Karte und ich gebe SV2A ein, dann soll er das Set halt nicht finden können."
 */
export function validateSetWithLanguage(
  setCodeOrName: string,
  selectedLanguage: CardLanguage
): {
  isValid: boolean;
  detectedLang: CardLanguage | null;
  matchedSet?: TcgSet;
  suggestedEquivalent?: TcgSet;
  warningMessage?: string;
} {
  if (!setCodeOrName) {
    return { isValid: true, detectedLang: null };
  }

  const matchedSet = findSetByCode(setCodeOrName);
  const detectedLang = matchedSet?.language || detectSetLanguage(setCodeOrName);

  if (!matchedSet) {
    return {
      isValid: false,
      detectedLang,
      warningMessage: `Set "${setCodeOrName}" ist im TCG-Index nicht verzeichnet.`,
    };
  }

  // Check language match
  // If user selected "DE" and types "SV2a" (which is JP) -> Mismatch!
  const isLanguageMatch =
    matchedSet.language === selectedLanguage ||
    (selectedLanguage === "DE" && matchedSet.language === "EN") ||
    (selectedLanguage === "EN" && matchedSet.language === "DE") ||
    selectedLanguage === "Egal" ||
    selectedLanguage === "OTHER";

  if (!isLanguageMatch) {
    // Look for equivalent set in the user's selected language
    let suggestedEquivalent: TcgSet | undefined;
    if (matchedSet.equivalentCode) {
      suggestedEquivalent = TCG_SETS.find(
        (s) =>
          s.code.toLowerCase() === matchedSet.equivalentCode?.toLowerCase() &&
          s.language === selectedLanguage
      );
    }

    return {
      isValid: false,
      detectedLang,
      matchedSet,
      suggestedEquivalent,
      warningMessage: `Set "${matchedSet.code}" (${matchedSet.name}) ist ein ${
        matchedSet.language === "JP"
          ? "japanisches 🇯🇵"
          : matchedSet.language === "KR"
          ? "koreanisches 🇰🇷"
          : matchedSet.language === "CN"
          ? "chinesisches 🇨🇳"
          : matchedSet.language === "EN"
          ? "englisches 🇬🇧"
          : "deutsches 🇩🇪"
      } Set, deine Karte ist jedoch als "${selectedLanguage}" markiert.`,
    };
  }

  return {
    isValid: true,
    detectedLang,
    matchedSet,
  };
}
