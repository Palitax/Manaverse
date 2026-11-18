import jpIndexRaw from "@/data/jp-cards-index.json";
import speciesI18nRaw from "@/data/pokemon-species-i18n.json";
import { PokemonApiCard } from "@/types";

type RawSetTuple = [string, string, number, string]; // [nameEn, nameJa, year, series]
type RawCardTuple = [
  string, // 0: id ("jp-30601")
  string, // 1: jaName ("ピカチュウ")
  string, // 2: enName ("Pikachu")
  string, // 3: deName ("" if same as enName, else "Glurak ex")
  string, // 4: setCode ("XY-P")
  string, // 5: number ("070/XY-P")
  string, // 6: rarity ("Promo", "SAR", ...)
  string, // 7: imgCode ("XYP/030601_P_PIKACHUU.jpg" | "~d:25" | url)
  string  // 8: note ("Pikachu Outbreak! Yokohama" | "")
];

interface IndexedJpCard {
  id: string;
  jaName: string;
  enName: string;
  deName: string;
  setCode: string;
  setCodeNorm: string; // hyphenless lowercase e.g. "xyp"
  setNameEn: string;
  setNameJa: string;
  series: string;
  releaseYear: number;
  number: string;
  numLeft: string; // lowercase left side of "/" e.g. "070"
  numLeftTrim: string; // stripped leading zeros e.g. "70"
  numRightNorm: string; // hyphenless lowercase right side of "/" e.g. "xyp" or "165"
  rarity: string;
  imageUrl: string;
  note: string;
  enLower: string;
  deLower: string;
  jaLower: string;
  searchText: string;
  collectorRankBoost: number;
}

const POKEMON_CARD_CDN = "https://www.pokemon-card.com/assets/images/card_images/large/";
const POKEAPI_ART_CDN =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const POKEMONTCG_CDN = "https://images.pokemontcg.io/";
const TCGDEX_JA_CDN = "https://assets.tcgdex.net/ja/";

function expandImageUrl(imgCode: string): string {
  if (!imgCode) return "/manaforge-card-back.png";
  if (imgCode.startsWith("http") || imgCode.startsWith("/")) return imgCode;
  if (imgCode.startsWith("~d:")) {
    return `${POKEAPI_ART_CDN}${imgCode.slice(3)}.png`;
  }
  if (imgCode.startsWith("~p:")) {
    return `${POKEMONTCG_CDN}${imgCode.slice(3)}`;
  }
  if (imgCode.startsWith("~t:")) {
    return `${TCGDEX_JA_CDN}${imgCode.slice(3)}`;
  }
  return `${POKEMON_CARD_CDN}${imgCode}`;
}

/**
 * Lightweight Kana (Katakana & Hiragana) -> Hepburn Romaji converter
 * so Japanese-only cards and Trainer names are also searchable by Romaji.
 */
const DIGRAPH_ROMAJI: Record<string, string> = {
  キャ: "kya", キュ: "kyu", キョ: "kyo",
  シャ: "sha", シュ: "shu", ショ: "sho",
  チャ: "cha", チュ: "chu", チョ: "cho",
  ニャ: "nya", ニュ: "nyu", ニョ: "nyo",
  ヒャ: "hya", ヒュ: "hyu", ヒョ: "hyo",
  ミャ: "mya", ミュ: "myu", ミョ: "myo",
  リャ: "rya", リュ: "ryu", リョ: "ryo",
  ギャ: "gya", ギュ: "gyu", ギョ: "gyo",
  ジャ: "ja",  ジュ: "ju",  ジョ: "jo",
  ビャ: "bya", ビュ: "byu", ビョ: "byo",
  ピャ: "pya", ピュ: "pyu", ピョ: "pyo",
  ファ: "fa",  フィ: "fi",  フェ: "fe", フォ: "fo",
  ティ: "ti",  ディ: "di",  トゥ: "tu", ドゥ: "du",
  ウィ: "wi",  ウェ: "we",  ウォ: "wo",
  ヴァ: "va",  ヴィ: "vi",  ヴェ: "ve", ヴォ: "vo",
  シェ: "she", ジェ: "je",  チェ: "che",
};

const MONO_ROMAJI: Record<string, string> = {
  ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o",
  カ: "ka", キ: "ki", ク: "ku", ケ: "ke", コ: "ko",
  サ: "sa", シ: "shi", ス: "su", セ: "se", ソ: "so",
  タ: "ta", チ: "chi", ツ: "tsu", テ: "te", ト: "to",
  ナ: "na", ニ: "ni", ヌ: "nu", ネ: "ne", ノ: "no",
  ハ: "ha", ヒ: "hi", フ: "fu", ヘ: "he", ホ: "ho",
  マ: "ma", ミ: "mi", ム: "mu", メ: "me", モ: "mo",
  ヤ: "ya", ユ: "yu", ヨ: "yo",
  ラ: "ra", リ: "ri", ル: "ru", レ: "re", ロ: "ro",
  ワ: "wa", ヲ: "o", ン: "n",
  ガ: "ga", ギ: "gi", グ: "gu", ゲ: "ge", ゴ: "go",
  ザ: "za", ジ: "ji", ズ: "zu", ゼ: "ze", ゾ: "zo",
  ダ: "da", ヂ: "ji", ヅ: "zu", デ: "de", ド: "do",
  バ: "ba", ビ: "bi", ブ: "bu", ベ: "be", ボ: "bo",
  パ: "pa", ピ: "pi", プ: "pu", ペ: "pe", ポ: "po",
  ヴ: "vu", ァ: "a", ィ: "i", ゥ: "u", ェ: "e", ォ: "o",
  ャ: "ya", ュ: "yu", ョ: "yo", ー: "",
};

export function kanaToRomaji(input: string): string {
  if (!input) return "";
  // Convert Hiragana (U+3041..U+3096) to Katakana (U+30A1..U+30F6)
  let kata = "";
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 0x3041 && code <= 0x3096) {
      kata += String.fromCharCode(code + 0x60);
    } else {
      kata += input[i];
    }
  }

  let out = "";
  for (let i = 0; i < kata.length; i++) {
    const ch = kata[i];
    if (ch === "ッ" && i + 1 < kata.length) {
      const nextTwo = kata.slice(i + 1, i + 3);
      const nextRom = DIGRAPH_ROMAJI[nextTwo] || MONO_ROMAJI[kata[i + 1]] || "";
      if (nextRom) out += nextRom[0];
      continue;
    }
    const two = kata.slice(i, i + 2);
    if (DIGRAPH_ROMAJI[two]) {
      out += DIGRAPH_ROMAJI[two];
      i++;
      continue;
    }
    if (MONO_ROMAJI[ch] !== undefined) {
      out += MONO_ROMAJI[ch];
    } else {
      out += ch.toLowerCase();
    }
  }
  return out;
}

function computeCollectorBoost(rarity: string, note: string, setCode: string): number {
  let b = 0;
  const r = rarity.toUpperCase();
  if (r.includes("GOLD STAR") || r.includes("☆")) b += 28;
  else if (r.includes("SAR") || r === "MUR") b += 26;
  else if (r.includes("AR") || r.includes("CSR") || r.includes("HR") || r.includes("UR")) b += 22;
  else if (r.includes("CLASSIC HOLO")) b += 21;
  else if (r.includes("SR") || r.includes("CHR") || r.includes("SSR") || r.includes("SHINING")) b += 19;
  else if (r === "PROMO") b += 20;
  else if (r.includes("MASTER BALL") || r.includes("MIRROR")) b += 16;
  else if (r.includes("HOLO") || r === "RR" || r === "MA" || r === "S") b += 10;

  if (note && !note.endsWith("Variant")) b += 8;
  if (
    setCode === "SV2a" ||
    setCode === "S6a" ||
    setCode === "SV8a" ||
    setCode === "S12a" ||
    setCode === "CLL" ||
    setCode === "CLF" ||
    setCode === "CLK"
  ) {
    b += 5;
  }
  return b;
}

// Community nicknames for famous Japanese chase cards
const NICKNAME_TAGS: Array<[ (c: RawCardTuple) => boolean, string ]> = [
  [(c) => c[4] === "S6a" && c[5] === "095/069", "moonbreon mondbreon alt art"],
  [(c) => c[4] === "SV8a" && c[5] === "217/187", "sunbreon terastal"],
  [(c) => c[4] === "SV4a" && c[5] === "347/190", "bubble mew"],
  [(c) => c[4] === "XY-P" && (c[5] === "068/XY-P" || c[5] === "069/XY-P" || c[5] === "070/XY-P"), "outbreak outbreakchu yokohama minato mirai tairyo hassei"],
  [(c) => c[5] === "227/S-P" || c[5] === "226/S-P", "stamp box beauty looking back moon goose kitte"],
  [(c) => c[8].includes("Munch"), "munch scream edvard munch"],
  [(c) => c[4] === "SGG" && c[5] === "020/019", "gengar vmax alt art sa high class"],
  [(c) => c[4] === "SV8" && c[5] === "132/106", "pikachu sar pikachu butt"],
  [(c) => c[4] === "SV3a" && c[5] === "062/062", "groudon ar"],
  [(c) => c[4] === "SV1a" && c[5] === "080/073", "magikarp ar karpador ar shinji kanda"],
  [(c) => c[4] === "S11" && c[5] === "111/100", "giratina v alt art sa shinji kanda"],
  [(c) => c[4] === "S12" && c[5] === "110/098", "lugia v alt art sa"],
  [(c) => c[4] === "WCS23" && c[5] === "001/030", "yokohama pikachu wcs23 world championships"],
];

interface CachedJpIndex {
  cards: IndexedJpCard[];
  sets: Record<string, RawSetTuple>;
  enOrDeToJaSpecies: Map<string, string>;
}

const globalForJpIndex = globalThis as unknown as {
  __manaforgeJpIndex?: CachedJpIndex;
};

function getJpIndex(): CachedJpIndex {
  if (globalForJpIndex.__manaforgeJpIndex) {
    return globalForJpIndex.__manaforgeJpIndex;
  }

  const rawSets = (jpIndexRaw as unknown as { sets: Record<string, RawSetTuple> }).sets;
  const rawCards = (jpIndexRaw as unknown as { cards: RawCardTuple[] }).cards;

  const enOrDeToJaSpecies = new Map<string, string>();
  for (const [en, tuple] of Object.entries(
    speciesI18nRaw as Record<string, string[]>
  )) {
    const [de, ja] = tuple;
    if (ja) {
      enOrDeToJaSpecies.set(en.toLowerCase(), ja);
      if (de) enOrDeToJaSpecies.set(de.toLowerCase(), ja);
    }
  }

  const indexed: IndexedJpCard[] = new Array(rawCards.length);

  for (let i = 0; i < rawCards.length; i++) {
    const tuple = rawCards[i];
    const [id, jaName, enName, rawDe, setCode, number, rarity, imgCode, note] = tuple;
    const deName = rawDe || enName;
    const setMeta = rawSets[setCode] || [setCode, setCode, 2020, "Japanese TCG"];
    const [setNameEn, setNameJa, releaseYear, series] = setMeta;

    const setCodeNorm = setCode.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Parse card number fraction e.g. "070/XY-P", "201/165", "No.006 (021/102)", "DPBP#269"
    let numLeft = "";
    let numRightNorm = "";
    const parenMatch = number.match(/\(([^/)]+)\/([^)]+)\)/);
    if (parenMatch) {
      numLeft = parenMatch[1].toLowerCase().trim();
      numRightNorm = parenMatch[2].toLowerCase().replace(/[^a-z0-9]/g, "");
    } else if (number.includes("/")) {
      const [l, r] = number.split("/");
      numLeft = (l || "").toLowerCase().trim();
      numRightNorm = (r || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    } else {
      numLeft = number.toLowerCase().trim();
    }
    const numLeftTrim = numLeft.replace(/^0+(?=\d)/, "");
    numRightNorm = numRightNorm.replace(/^0+(?=\d)/, "");

    const romaji = kanaToRomaji(jaName);
    let extraAliases = "";
    if (jaName.includes("☆") || enName.includes("☆")) extraAliases += " gold star goldstar star";
    if (jaName.includes("δ") || enName.includes("δ")) extraAliases += " delta species";
    if (jaName.includes("◇") || enName.includes("◇")) extraAliases += " prism star prisma";

    for (const [pred, nick] of NICKNAME_TAGS) {
      if (pred(tuple)) extraAliases += " " + nick;
    }

    const enLower = enName.toLowerCase();
    const deLower = deName.toLowerCase();
    const jaLower = jaName.toLowerCase();

    const searchText = [
      enLower,
      enLower.replace(/-/g, " "),
      deLower,
      deLower.replace(/-/g, " "),
      jaLower,
      romaji,
      setCode.toLowerCase(),
      setCodeNorm,
      setNameEn.toLowerCase(),
      setNameJa.toLowerCase(),
      number.toLowerCase(),
      numLeftTrim,
      rarity.toLowerCase(),
      note.toLowerCase(),
      extraAliases,
    ].join(" ");

    const numLeftInt = /^\d+$/.test(numLeftTrim) ? parseInt(numLeftTrim, 10) : 0;
    const numRightInt = /^\d+$/.test(numRightNorm) ? parseInt(numRightNorm, 10) : 0;
    const secretBoost =
      numLeftInt > 0 && numRightInt > 0 && numLeftInt > numRightInt ? 16 : 0;

    indexed[i] = {
      id,
      jaName,
      enName,
      deName,
      setCode,
      setCodeNorm,
      setNameEn,
      setNameJa,
      series,
      releaseYear,
      number,
      numLeft,
      numLeftTrim,
      numRightNorm,
      rarity,
      imageUrl: expandImageUrl(imgCode),
      note,
      enLower,
      deLower,
      jaLower,
      searchText,
      collectorRankBoost: computeCollectorBoost(rarity, note, setCode) + secretBoost,
    };
  }

  const built: CachedJpIndex = {
    cards: indexed,
    sets: rawSets,
    enOrDeToJaSpecies,
  };
  globalForJpIndex.__manaforgeJpIndex = built;
  return built;
}

function toPokemonApiCard(c: IndexedJpCard): PokemonApiCard {
  const setLabelBase =
    c.setNameEn && c.setNameEn !== c.setCode
      ? `${c.setNameEn} [${c.setCode}]`
      : c.setCode;
  const setLabel =
    c.note && !c.note.startsWith("[") && c.note !== "Variant"
      ? `${setLabelBase} • ${c.note}`
      : setLabelBase;

  return {
    id: c.id,
    name: c.enName,
    nameOriginal: c.jaName,
    nameEn: c.enName,
    nameDe: c.deName,
    language: "JP",
    number: c.number === "Unnumbered" ? "" : c.number,
    rarity: c.rarity,
    set: {
      id: c.setCode,
      name: setLabel,
      series: c.series,
    },
    images: {
      small: c.imageUrl,
      large: c.imageUrl,
    },
  };
}

export interface JpSearchOptions {
  query: string;
  setCode?: string;
  limit?: number;
  offset?: number;
}

export function getJpIndexTotalCount(): number {
  return getJpIndex().cards.length;
}

/**
 * Searches all 27,211+ Japanese Pokémon cards in <3ms with smart number,
 * promo code, English, German, Japanese Kana, Romaji, and nickname ranking.
 */
export function searchFullJapaneseIndex({
  query,
  setCode,
  limit = 20,
  offset = 0,
}: JpSearchOptions): { cards: PokemonApiCard[]; total: number } {
  const { cards } = getJpIndex();

  const normSetFilter = setCode
    ? setCode.trim().toLowerCase().replace(/[^a-z0-9]/g, "")
    : "";

  const cleanQ = (query || "")
    .trim()
    .toLowerCase()
    .replace(/#/g, "")
    .replace(/[()[\]]/g, " ")
    .replace(/\s*\/\s*/g, "/");

  // If no query text, return top chase/featured cards (optionally filtered by setCode)
  if (!cleanQ) {
    const filtered = normSetFilter
      ? cards.filter(
          (c) =>
            c.setCodeNorm === normSetFilter ||
            c.setCode.toLowerCase() === setCode!.trim().toLowerCase()
        )
      : cards;

    const sorted = [...filtered].sort(
      (a, b) => b.collectorRankBoost - a.collectorRankBoost || b.releaseYear - a.releaseYear
    );
    return {
      total: sorted.length,
      cards: sorted.slice(offset, offset + limit).map(toPokemonApiCard),
    };
  }

  const rawTokens = cleanQ.split(/\s+/).filter(Boolean);

  const scored: Array<{ card: IndexedJpCard; score: number }> = [];

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];

    if (
      normSetFilter &&
      c.setCodeNorm !== normSetFilter &&
      !c.setNameEn.toLowerCase().includes(setCode!.trim().toLowerCase())
    ) {
      continue;
    }

    let matchedAll = true;
    let score = c.collectorRankBoost;

    for (let t = 0; t < rawTokens.length; t++) {
      const tok = rawTokens[t];

      // Case 1: Fraction token like "070/xy-p", "70/xyp", "201/165"
      if (tok.includes("/")) {
        const [qL, qR] = tok.split("/");
        const qLTrim = (qL || "").replace(/^0+(?=\d)/, "");
        const qRNorm = (qR || "").replace(/[^a-z0-9]/g, "").replace(/^0+(?=\d)/, "");

        const leftOk = !qL || c.numLeft === qL || c.numLeftTrim === qLTrim;
        const rightOk =
          !qRNorm || c.numRightNorm === qRNorm || c.setCodeNorm === qRNorm;

        if (leftOk && rightOk) {
          score += c.numLeft === qL ? 220 : 190;
          continue;
        }
        if (c.searchText.includes(tok)) {
          score += 80;
          continue;
        }
        matchedAll = false;
        break;
      }

      // Case 2: Pure numeric token like "070", "70", "201", "151"
      if (/^\d+$/.test(tok)) {
        const tokTrim = tok.replace(/^0+(?=\d)/, "");
        if (c.numLeft === tok) {
          score += 150;
          continue;
        }
        if (c.numLeftTrim === tokTrim) {
          score += 125;
          continue;
        }
        if (c.setCodeNorm === tok || c.setNameEn.includes(tok)) {
          score += 65;
          continue;
        }
        if (c.numRightNorm === tokTrim || c.searchText.includes(tok)) {
          score += 15;
          continue;
        }
        matchedAll = false;
        break;
      }

      // Case 3: Set / Promo code or word token (e.g. "xy-p", "xyp", "pikachu", "glurak", "ピカチュウ")
      const tokNorm = tok.replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf☆δ◇]/g, "");

      if (tokNorm && (c.setCodeNorm === tokNorm || c.setCode.toLowerCase() === tok)) {
        score += 110;
        continue;
      }

      if (c.enLower === tok || c.deLower === tok || c.jaLower === tok) {
        score += 90;
        continue;
      }

      if (
        c.enLower.startsWith(tok + " ") ||
        c.deLower.startsWith(tok + " ") ||
        c.enLower.startsWith(tok) ||
        c.deLower.startsWith(tok) ||
        c.jaLower.startsWith(tok)
      ) {
        score += 55;
        continue;
      }

      if (
        c.searchText.includes(tok) ||
        (tokNorm.length >= 2 && c.searchText.includes(tokNorm))
      ) {
        score += 30;
        continue;
      }

      matchedAll = false;
      break;
    }

    if (!matchedAll) continue;

    // Full-phrase exact bonus
    if (c.enLower === cleanQ || c.deLower === cleanQ || c.jaLower === cleanQ) {
      score += 60;
    }

    scored.push({ card: c, score });
  }

  scored.sort((a, b) => b.score - a.score || b.card.releaseYear - a.card.releaseYear);

  return {
    total: scored.length,
    cards: scored.slice(offset, offset + limit).map((x) => toPokemonApiCard(x.card)),
  };
}

/**
 * Live fallback to official pokemon-card.com JSON search API for future
 * newly-released Japanese cards not yet in the static snapshot.
 */
export async function fetchLivePokemonCardJpFallback(
  query: string,
  limit = 10
): Promise<PokemonApiCard[]> {
  try {
    const { enOrDeToJaSpecies } = getJpIndex();
    const words = query.trim().split(/\s+/).filter(Boolean);
    const jaKeywords: string[] = [];

    for (const w of words) {
      const lower = w.toLowerCase().replace(/[^a-zäöüß-]/g, "");
      if (enOrDeToJaSpecies.has(lower)) {
        jaKeywords.push(enOrDeToJaSpecies.get(lower)!);
      } else if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(w)) {
        jaKeywords.push(w);
      }
    }

    if (jaKeywords.length === 0) return [];

    const kw = jaKeywords.join(" ");
    const res = await fetch(
      `https://www.pokemon-card.com/card-search/resultAPI.php?keyword=${encodeURIComponent(
        kw
      )}&regulation_sidebar_form=all&sm_and_keyword=true&page=1`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(1800),
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data?.cardList)) return [];

    return data.cardList.slice(0, limit).map((item: any) => {
      const thumbPath = String(item.cardThumbFile || "");
      const imgUrl = thumbPath.startsWith("http")
        ? thumbPath
        : `https://www.pokemon-card.com${thumbPath}`;
      const setMatch = thumbPath.match(/\/large\/([^/]+)\//);
      const setCode = setMatch ? setMatch[1] : "JP";
      const jaName = String(item.cardNameViewText || item.cardNameAltText || kw);

      return {
        id: `jp-live-${item.cardID}`,
        name: jaName,
        nameOriginal: jaName,
        nameEn: jaName,
        nameDe: jaName,
        language: "JP" as const,
        number: "",
        rarity: "JP Official",
        set: {
          id: setCode,
          name: `${setCode} (Japanisch)`,
          series: "Pokémon Card Game JP",
        },
        images: {
          small: imgUrl,
          large: imgUrl,
        },
      };
    });
  } catch {
    return [];
  }
}
