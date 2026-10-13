import { CardLanguage } from "@/types";

// Comprehensive English <-> German Pokémon Name Dictionary
export const EN_TO_DE_POKEMON: Record<string, string> = {
  // Gen 1
  Bulbasaur: "Bisasam",
  Ivysaur: "Bisaknosp",
  Venusaur: "Bisaflor",
  Charmander: "Glumanda",
  Charmeleon: "Glutexo",
  Charizard: "Glurak",
  Squirtle: "Schiggy",
  Wartortle: "Schillok",
  Blastoise: "Turtok",
  Caterpie: "Raupy",
  Metapod: "Safcon",
  Butterfree: "Smettbo",
  Weedle: "Hornliu",
  Kakuna: "Kokuna",
  Beedrill: "Bibor",
  Pidgey: "Taubsi",
  Pidgeotto: "Tauboga",
  Pidgeot: "Tauboss",
  Rattata: "Rattfratz",
  Raticate: "Rattikarl",
  Spearow: "Habitak",
  Fearow: "Ibitak",
  Ekans: "Rettan",
  Arbok: "Arbok",
  Pikachu: "Pikachu",
  Raichu: "Raichu",
  Sandshrew: "Sandan",
  Sandslash: "Sandamer",
  Nidoran: "Nidoran",
  Nidorina: "Nidorina",
  Nidoqueen: "Nidoqueen",
  Nidorino: "Nidorino",
  Nidoking: "Nidoking",
  Clefairy: "Piepi",
  Clefable: "Pixi",
  Vulpix: "Vulpix",
  Ninetales: "Vulnona",
  Jigglypuff: "Pummeluff",
  Wigglytuff: "Knuddeluff",
  Zubat: "Zubat",
  Golbat: "Golbat",
  Oddish: "Myrapla",
  Gloom: "Duflor",
  Vileplume: "Giflor",
  Paras: "Paras",
  Parasect: "Parasek",
  Venonat: "Bluzuk",
  Venomoth: "Omot",
  Diglett: "Digda",
  Dugtrio: "Digdri",
  Meowth: "Mauzi",
  Persian: "Snobilikat",
  Psyduck: "Enton",
  Golduck: "Entoron",
  Mankey: "Menki",
  Primeape: "Rasaff",
  Growlithe: "Fukano",
  Arcanine: "Arkani",
  Poliwag: "Quapsel",
  Poliwhirl: "Quaputzi",
  Poliwrath: "Quappo",
  Abra: "Abra",
  Kadabra: "Kadabra",
  Alakazam: "Simsala",
  Machop: "Machollo",
  Machoke: "Maschock",
  Machamp: "Machomei",
  Bellsprout: "Knofensa",
  Weepinbell: "Ultrigaria",
  Victreebel: "Sarzenia",
  Tentacool: "Tentacha",
  Tentacruel: "Tentoxa",
  Geodude: "Kleinstein",
  Graveler: "Georok",
  Golem: "Geowaz",
  Ponyta: "Ponita",
  Rapidash: "Gallopa",
  Slowpoke: "Flegmon",
  Slowbro: "Lahmus",
  Magnemite: "Magnetilo",
  Magneton: "Magneton",
  "Farfetch'd": "Porenta",
  Doduo: "Dodu",
  Dodrio: "Dodri",
  Seel: "Jurob",
  Dewgong: "Jugong",
  Grimer: "Sleima",
  Muk: "Sleimok",
  Shellder: "Muschas",
  Cloyster: "Austos",
  Gastly: "Nebulak",
  Haunter: "Alpollo",
  Gengar: "Gengar",
  Onix: "Onix",
  Drowzee: "Traumato",
  Hypno: "Hypno",
  Krabby: "Krabby",
  Kingler: "Kingler",
  Voltorb: "Voltobal",
  Electrode: "Lektrobal",
  Exeggcute: "Owei",
  Exeggutor: "Kokowei",
  Cubone: "Tragosso",
  Marowak: "Knogga",
  Hitmonlee: "Kicklee",
  Hitmonchan: "Nockchan",
  Lickitung: "Schlurp",
  Koffing: "Smogon",
  Weezing: "Smogmog",
  Rhyhorn: "Rihorn",
  Rhydon: "Rizeros",
  Chansey: "Chaneira",
  Tangela: "Tangela",
  Kangaskhan: "Kangama",
  Horsea: "Seeper",
  Seadra: "Seemon",
  Goldeen: "Goldini",
  Seaking: "Golking",
  Staryu: "Sterndu",
  Starmie: "Starmie",
  "Mr. Mime": "Pantimos",
  Scyther: "Sichlor",
  Jynx: "Rossana",
  Electabuzz: "Elektek",
  Magmar: "Magmar",
  Pinsir: "Pinsir",
  Tauros: "Tauros",
  Magikarp: "Karpador",
  Gyarados: "Garados",
  Lapras: "Lapras",
  Ditto: "Ditto",
  Eevee: "Evoli",
  Vaporeon: "Aquana",
  Jolteon: "Blitza",
  Flareon: "Flamara",
  Porygon: "Porygon",
  Omanyte: "Amonitas",
  Omastar: "Amoroso",
  Kabuto: "Kabuto",
  Kabutops: "Kabutops",
  Aerodactyl: "Aerodactyl",
  Snorlax: "Relaxo",
  Articuno: "Arktos",
  Zapdos: "Zapdos",
  Moltres: "Lavados",
  Dratini: "Dratini",
  Dragonair: "Dragonir",
  Dragonite: "Dragoran",
  Mewtwo: "Mewtu",
  Mew: "Mew",

  // Gen 2
  Chikorita: "Endivie",
  Bayleef: "Lorblatt",
  Meganium: "Meganie",
  Cyndaquil: "Feurigel",
  Quilava: "Igelavar",
  Typhlosion: "Tornupto",
  Totodile: "Karnimani",
  Croconaw: "Tyracroc",
  Feraligatr: "Impergator",
  Sentret: "Wiesor",
  Furret: "Wiesenior",
  Hoothoot: "Hoothoot",
  Noctowl: "Noctuh",
  Ledyba: "Ledyba",
  Ledian: "Ledian",
  Spinarak: "Webarak",
  Ariados: "Ariados",
  Crobat: "Iksbat",
  Chinchou: "Lampi",
  Lanturn: "Lanturn",
  Pichu: "Pichu",
  Cleffa: "Pii",
  Igglybuff: "Fluffeluff",
  Togepi: "Togepi",
  Togetic: "Togetic",
  Natu: "Natu",
  Xatu: "Xatu",
  Mareep: "Voltilamm",
  Flaaffy: "Waaty",
  Ampharos: "Ampharos",
  Bellossom: "Blubella",
  Marill: "Marill",
  Azumarill: "Azumarill",
  Sudowoodo: "Mogelbaum",
  Politoed: "Quaxo",
  Hoppip: "Hoppspross",
  Skiploom: "Hubelupf",
  Jumpluff: "Papungha",
  Aipom: "Griffel",
  Sunkern: "Sonnkern",
  Sunflora: "Sonnflora",
  Yanma: "Yanma",
  Wooper: "Felino",
  Quagsire: "Morlord",
  Espeon: "Psiana",
  Umbreon: "Nachtara",
  Murkrow: "Kramurx",
  Slowking: "Laschoking",
  Misdreavus: "Traunfugil",
  Unown: "Icognito",
  Wobbuffet: "Woingenau",
  Girafarig: "Girafarig",
  Pineco: "Tannza",
  Forretress: "Forstellka",
  Dunsparce: "Dummisel",
  Gligar: "Skorgla",
  Steelix: "Stahlos",
  Snubbull: "Snubbull",
  Granbull: "Granbull",
  Qwilfish: "Baldorfish",
  Scizor: "Scherox",
  Shuckle: "Pottrott",
  Heracross: "Skaraborn",
  Sneasel: "Sniebel",
  Teddiursa: "Teddiursa",
  Ursaring: "Ursaring",
  Slugma: "Schneckmag",
  Magcargo: "Magcargo",
  Swinub: "Quiekel",
  Piloswine: "Keifel",
  Corsola: "Corasonn",
  Remoraid: "Remoraid",
  Octillery: "Octillery",
  Delibird: "Botogel",
  Mantine: "Mantax",
  Skarmory: "Panzaeron",
  Houndour: "Hunduster",
  Houndoom: "Hundemon",
  Kingdra: "Seedraking",
  Phanpy: "Phanpy",
  Donphan: "Donphan",
  Porygon2: "Porygon2",
  Stantler: "Damhirplex",
  Smeargle: "Farbeagle",
  Tyrogue: "Rabauz",
  Hitmontop: "Kapoera",
  Smoochum: "Kussilla",
  Elekid: "Elekid",
  Magby: "Magby",
  Miltank: "Miltank",
  Blissey: "Heiteira",
  Raikou: "Raikou",
  Entei: "Entei",
  Suicune: "Suicune",
  Larvitar: "Larvitar",
  Pupitar: "Pupitar",
  Tyranitar: "Despotar",
  Lugia: "Lugia",
  "Ho-Oh": "Ho-Oh",
  Celebi: "Celebi",

  // Gen 3
  Treecko: "Geckarbor",
  Grovyle: "Reptain",
  Sceptile: "Gewaldro",
  Torchic: "Flemmli",
  Combusken: "Jungglut",
  Blaziken: "Lohgock",
  Mudkip: "Hydropi",
  Marshtomp: "Moorabbel",
  Swampert: "Sumpex",
  Poochyena: "Fiffyen",
  Mightyena: "Magnayen",
  Zigzagoon: "Zigsachs",
  Linoone: "Geradaks",
  Ralts: "Trasla",
  Kirlia: "Kirlia",
  Gardevoir: "Guardevoir",
  Shroomish: "Knilz",
  Breloom: "Kapilz",
  Slakoth: "Bummelz",
  Vigoroth: "Muntier",
  Slaking: "Letarking",
  Ninjask: "Ninjask",
  Shedinja: "Ninjatom",
  Exploud: "Krawumms",
  Makuhita: "Makuhita",
  Hariyama: "Hariyama",
  Azurill: "Azurill",
  Nosepass: "Nasgnet",
  Skitty: "Eneco",
  Delcatty: "Enekoro",
  Sableye: "Zobiris",
  Mawile: "Flunkifer",
  Aron: "Stollunior",
  Lairon: "Stollrak",
  Aggron: "Stolloss",
  Medicham: "Meditalis",
  Manectric: "Voltenso",
  Roselia: "Roselia",
  Sharpedo: "Tohaido",
  Wailord: "Wailord",
  Flygon: "Libelldra",
  Altaria: "Altaria",
  Zangoose: "Sengo",
  Seviper: "Vipitis",
  Milotic: "Milotic",
  Absol: "Absol",
  Salamence: "Brutalanda",
  Metagross: "Metagross",
  Kyogre: "Kyogre",
  Groudon: "Groudon",
  Rayquaza: "Rayquaza",
  Jirachi: "Jirachi",
  Deoxys: "Deoxys",

  // Gen 4
  Turtwig: "Chelast",
  Grotle: "Chelcarain",
  Torterra: "Chelterrar",
  Chimchar: "Panflam",
  Monferno: "Panpyro",
  Infernape: "Panferno",
  Piplup: "Plinfa",
  Prinplup: "Pliprin",
  Empoleon: "Impoleon",
  Staraptor: "Staraptor",
  Luxray: "Luxtra",
  Roserade: "Roserade",
  Rampardos: "Rameidon",
  Bastiodon: "Bollterus",
  Vespiquen: "Honweisel",
  Pachirisu: "Pachirisu",
  Floatzel: "Bojelin",
  Gastrodon: "Gastrodon",
  Ambipom: "Ambidiffel",
  Drifblim: "Drifzepeli",
  Lopunny: "Schlapor",
  Mismagius: "Traunmagil",
  Honchkrow: "Kramshef",
  Spiritomb: "Kryppuk",
  Garchomp: "Knakrack",
  Lucario: "Lucario",
  Hippowdon: "Hippoterus",
  Drapion: "Piondragi",
  Toxicroak: "Toxiquak",
  Abomasnow: "Rexblisar",
  Weavile: "Snibunna",
  Magnezone: "Magnezone",
  Rhyperior: "Rihornior",
  Tangrowth: "Tangoloss",
  Electivire: "Elevoltek",
  Magmortar: "Magbrant",
  Togekiss: "Togekiss",
  Yanmega: "Yanmega",
  Leafeon: "Folipurba",
  Glaceon: "Glaziola",
  Gliscor: "Skorgro",
  Mamoswine: "Mamutel",
  "Porygon-Z": "Porygon-Z",
  Gallade: "Galagladi",
  Dusknoir: "Zwirrfinst",
  Froslass: "Frosdedje",
  Rotom: "Rotom",
  Dialga: "Dialga",
  Palkia: "Palkia",
  Heatran: "Heatran",
  Regigigas: "Regigigas",
  Giratina: "Giratina",
  Cresselia: "Cresselia",
  Darkrai: "Darkrai",
  Shaymin: "Shaymin",
  Arceus: "Arceus",

  // Gen 5+ Popular
  Victini: "Victini",
  Serperior: "Serpiroyal",
  Emboar: "Flambirex",
  Samurott: "Admurai",
  Zorua: "Zorua",
  Zoroark: "Zoroark",
  Reshiram: "Reshiram",
  Zekrom: "Zekrom",
  Kyurem: "Kyurem",
  Sylveon: "Feelinara",
  Greninja: "Quajutsu",
  Decidueye: "Silvarro",
  Incineroar: "Fuegro",
  Mimikyu: "Mimigma",
  Rillaboom: "Gortrom",
  Cinderace: "Liberlo",
  Inteleon: "Intelleon",
  Corviknight: "Krarmor",
  Dragapult: "Katapuldra",
  Zacian: "Zacian",
  Zamazenta: "Zamazenta",
  Eternatus: "Endynalos",
  Meowscarada: "Maskagato",
  Skeledirge: "Skelokrok",
  Quaquaval: "Bailonda",
  "Roaring Moon": "Donnersichel",
  "Iron Valiant": "Eisenkrieger",
  Koraidon: "Koraidon",
  Miraidon: "Miraidon",
  Terapagos: "Terapagos",
};

// Build inverted German -> English map
export const DE_TO_EN_POKEMON: Record<string, string> = {};
for (const [en, de] of Object.entries(EN_TO_DE_POKEMON)) {
  DE_TO_EN_POKEMON[de] = en;
}

// Japanese Pokémon Names (Katakana / Kanji)
export const EN_TO_JA_POKEMON: Record<string, string> = {
  Charizard: "リザードン",
  Pikachu: "ピカチュウ",
  Umbreon: "ブラッキー",
  Mewtwo: "ミュウツー",
  Mew: "ミュウ",
  Rayquaza: "レックウザ",
  Gengar: "ゲンガー",
  Greninja: "ゲッコウガ",
  Lugia: "ルギア",
  Venusaur: "フシギバナ",
  Blastoise: "カメックス",
  Eevee: "イーブイ",
  Sylveon: "ニンフィア",
  Giratina: "ギラティナ",
  Dialga: "ディアルガ",
  Palkia: "パルキア",
  Arceus: "アルセウス",
  Lucario: "ルカリオ",
  Gardevoir: "サーナイト",
  Dragonite: "カイリュー",
  Snorlax: "カビゴン",
  Zapdos: "サンダー",
  Articuno: "フリーザー",
  Moltres: "ファイヤー",
  Garchomp: "ガブリアス",
  Tyranitar: "バンギラス",
  Latios: "ラティオス",
  Latias: "ラティアス",
  Mimikyu: "ミミッキュ",
  Terapagos: "テラパゴス",
  Koraidon: "コライドン",
  Miraidon: "ミライドン",
  "Roaring Moon": "トドロクツキ",
  "Iron Valiant": "テツノブジン",
  Bulbasaur: "フシギダネ",
  Charmander: "ヒトカゲ",
  Squirtle: "ゼニガメ",
};

// Korean Pokémon Names (Hangul)
export const EN_TO_KO_POKEMON: Record<string, string> = {
  Charizard: "리자몽",
  Pikachu: "피카츄",
  Umbreon: "블래키",
  Mewtwo: "뮤츠",
  Mew: "뮤",
  Rayquaza: "레쿠쟈",
  Gengar: "팬텀",
  Greninja: "개굴닌자",
  Lugia: "루기아",
  Venusaur: "이상해꽃",
  Blastoise: "거북왕",
  Eevee: "이브이",
  Sylveon: "님피아",
  Giratina: "기라티나",
  Dialga: "디아루가",
  Palkia: "펄기아",
  Arceus: "아르세우스",
  Lucario: "루카리오",
  Gardevoir: "가디안",
  Dragonite: "망나뇽",
  Snorlax: "잠만보",
  Zapdos: "썬더",
  Articuno: "프리져",
  Moltres: "파이어",
  Garchomp: "한카리아스",
  Tyranitar: "마기라스",
  Bulbasaur: "이상해씨",
  Charmander: "파이리",
  Squirtle: "꼬부기",
};

// Chinese Pokémon Names (Simplified / Traditional)
export const EN_TO_ZH_POKEMON: Record<string, string> = {
  Charizard: "喷火龙",
  Pikachu: "皮卡丘",
  Umbreon: "月亮伊布",
  Mewtwo: "超梦",
  Mew: "梦幻",
  Rayquaza: "烈空坐",
  Gengar: "耿鬼",
  Greninja: "甲贺忍蛙",
  Lugia: "洛奇亚",
  Venusaur: "妙蛙花",
  Blastoise: "水箭龟",
  Eevee: "伊布",
  Sylveon: "仙子伊布",
  Giratina: "骑拉帝纳",
  Dialga: "帝牙卢卡",
  Palkia: "帕路奇亚",
  Arceus: "阿尔宙斯",
  Lucario: "路卡利欧",
  Gardevoir: "沙奈朵",
  Dragonite: "快龙",
  Snorlax: "卡比兽",
  Zapdos: "闪电鸟",
  Articuno: "急冻鸟",
  Moltres: "火焰鸟",
  Garchomp: "烈咬陆鲨",
  Tyranitar: "班基拉斯",
  Bulbasaur: "妙蛙种子",
  Charmander: "小火龙",
  Squirtle: "杰尼龟",
};

export interface ResolvedCardTitles {
  primaryTitle: string; // German (if DE) or English (if EN/JP/KR/CN)
  secondaryTitle?: string; // Original title: Japanese, Korean, Chinese or German/English
  originalScriptTitle?: string; // Original script (Kanji/Kana, Hangul, Hanzi)
  isGerman: boolean;
  canToggle: boolean;
}

/**
 * Resolves the primary and optional alternative titles for a card listing.
 *
 * Rules per User Specification:
 * - If card is listed as DE: show German name as primary. Clickable to toggle English name.
 * - If card is listed as EN: show English name as primary. Clickable to toggle German name.
 * - If card is JP, KR, CN: show English name as primary + country flag. Clickable to toggle the original script (Japanese / Korean / Chinese)!
 */
export function resolveCardTitles(
  fullName: string,
  cardLanguage: CardLanguage | string
): ResolvedCardTitles {
  if (!fullName) {
    return { primaryTitle: "", isGerman: false, canToggle: false };
  }

  const lang = (cardLanguage || "DE").toUpperCase();
  const isGermanListing = lang === "DE";
  const isJapaneseListing = lang === "JP";
  const isKoreanListing = lang === "KR";
  const isChineseListing = lang === "CN";

  let enCandidate = "";
  let deCandidate = "";
  let originalScriptCandidate = "";

  // Extract base Pokémon candidate from raw name
  let basePokemonEn = "";
  for (const [en] of Object.entries(EN_TO_DE_POKEMON)) {
    const regex = new RegExp(`\\b${en}\\b`, "i");
    if (regex.test(fullName)) {
      basePokemonEn = en;
      break;
    }
  }

  if (!basePokemonEn) {
    for (const [de, en] of Object.entries(DE_TO_EN_POKEMON)) {
      const regex = new RegExp(`\\b${de}\\b`, "i");
      if (regex.test(fullName)) {
        basePokemonEn = en;
        break;
      }
    }
  }

  // Case 1: Name contains a slash e.g. "Umbreon VMAX / Nachtara VMAX (Moonbreon)" or "Charizard / Glurak"
  if (fullName.includes(" / ")) {
    const parts = fullName.split(" / ").map((p) => p.trim());
    const partA = parts[0] || "";
    const partB = parts.slice(1).join(" / ").trim();

    let isPartADe = false;
    for (const deName of Object.keys(DE_TO_EN_POKEMON)) {
      if (
        partA.toLowerCase().includes(deName.toLowerCase()) &&
        !partA.toLowerCase().includes(DE_TO_EN_POKEMON[deName]?.toLowerCase() || "")
      ) {
        isPartADe = true;
        break;
      }
    }

    if (isPartADe) {
      deCandidate = partA;
      enCandidate = partB;
    } else {
      enCandidate = partA;
      deCandidate = partB;
    }
  } else {
    // Single name provided e.g. "Glurak ex", "Charizard ex", "リザードン"
    let foundEn: string | null = null;

    // Check German dictionary first
    for (const [de, en] of Object.entries(DE_TO_EN_POKEMON)) {
      const regex = new RegExp(`\\b${de}\\b`, "i");
      if (regex.test(fullName)) {
        foundEn = en;
        deCandidate = fullName;
        enCandidate = fullName.replace(regex, en);
        break;
      }
    }

    // If not found in German, check English dictionary
    if (!foundEn) {
      for (const [en, de] of Object.entries(EN_TO_DE_POKEMON)) {
        const regex = new RegExp(`\\b${en}\\b`, "i");
        if (regex.test(fullName)) {
          foundEn = en;
          enCandidate = fullName;
          deCandidate = fullName.replace(regex, de);
          break;
        }
      }
    }

    if (!enCandidate && !deCandidate) {
      enCandidate = fullName;
      deCandidate = fullName;
    }
  }

  // Find original script if Asian language
  if (basePokemonEn) {
    if (isJapaneseListing && EN_TO_JA_POKEMON[basePokemonEn]) {
      const jaName = EN_TO_JA_POKEMON[basePokemonEn];
      originalScriptCandidate = enCandidate.replace(new RegExp(`\\b${basePokemonEn}\\b`, "i"), jaName);
    } else if (isKoreanListing && EN_TO_KO_POKEMON[basePokemonEn]) {
      const koName = EN_TO_KO_POKEMON[basePokemonEn];
      originalScriptCandidate = enCandidate.replace(new RegExp(`\\b${basePokemonEn}\\b`, "i"), koName);
    } else if (isChineseListing && EN_TO_ZH_POKEMON[basePokemonEn]) {
      const zhName = EN_TO_ZH_POKEMON[basePokemonEn];
      originalScriptCandidate = enCandidate.replace(new RegExp(`\\b${basePokemonEn}\\b`, "i"), zhName);
    }
  }

  // Ensure clean strings
  enCandidate = enCandidate.trim();
  deCandidate = deCandidate.trim();
  originalScriptCandidate = originalScriptCandidate.trim();

  // If card is German -> primary is German, secondary is English
  if (isGermanListing) {
    const primary = deCandidate || enCandidate || fullName;
    const secondary = enCandidate && enCandidate !== primary ? enCandidate : undefined;
    return {
      primaryTitle: primary,
      secondaryTitle: secondary,
      isGerman: true,
      canToggle: Boolean(secondary),
    };
  }

  // If card is JP, KR, CN -> primary is English, secondary is original script!
  if (isJapaneseListing || isKoreanListing || isChineseListing) {
    const primary = enCandidate || fullName;
    const secondary = originalScriptCandidate || (deCandidate !== primary ? deCandidate : undefined);
    return {
      primaryTitle: primary,
      secondaryTitle: secondary,
      originalScriptTitle: originalScriptCandidate || undefined,
      isGerman: false,
      canToggle: Boolean(secondary),
    };
  }

  // English or Other
  const primary = enCandidate || deCandidate || fullName;
  const secondary = deCandidate && deCandidate !== primary ? deCandidate : undefined;
  return {
    primaryTitle: primary,
    secondaryTitle: secondary,
    isGerman: false,
    canToggle: Boolean(secondary),
  };
}

/**
 * Formats a clean, concise card label strictly showing card name and code (e.g. "Nachtara VMAX #215/203"),
 * stripping bloated subtitles like "(Moonbreon)", "(Alternate Art)", set suffixes, etc.
 * Supports toggling to the original title if requested!
 */
export function formatSlabTitle(
  fullName: string,
  cardLanguage?: string,
  cardNumber?: string,
  showOriginal?: boolean
): {
  cleanName: string;
  cleanCode: string;
  fullLabel: string;
  canToggle: boolean;
  originalName?: string;
} {
  if (!fullName) {
    const code = cardNumber ? (cardNumber.startsWith("#") ? cardNumber : `#${cardNumber}`) : "";
    return { cleanName: "", cleanCode: code, fullLabel: code, canToggle: false };
  }

  const lang = (cardLanguage || "DE").toUpperCase();
  const titles = resolveCardTitles(fullName, lang);

  let baseName = showOriginal && titles.secondaryTitle ? titles.secondaryTitle : (titles.primaryTitle || fullName);

  // 1. Extract embedded card number like #215/203 or #213/342
  let code = cardNumber ? (cardNumber.startsWith("#") ? cardNumber : `#${cardNumber}`) : "";
  const codeMatch = baseName.match(/#([A-Za-z0-9\/-]+)/);
  if (codeMatch) {
    if (!code) {
      code = `#${codeMatch[1]}`;
    }
    baseName = baseName.replace(/#([A-Za-z0-9\/-]+)/, "").trim();
  }

  // 2. Remove parenthesized text e.g. "(Moonbreon)", "(Alternative Art)", "(Secret Rare)"
  baseName = baseName.replace(/\s*\([^)]*\)/g, "").trim();

  // 3. Remove trailing dash or set additions e.g. "– Evolving Skies"
  baseName = baseName.replace(/\s*[-–—]\s*.*$/, "").trim();

  // 4. If name still contains slashes like "Umbreon VMAX / Nachtara VMAX", select language-appropriate side
  if (baseName.includes("/")) {
    const parts = baseName.split("/").map((s) => s.trim());
    baseName = (lang === "DE" ? parts[1] || parts[0] : parts[0]) || baseName;
  }

  // 5. Clean up any accidental double spaces
  baseName = baseName.replace(/\s+/g, " ").trim();

  const fullLabel = code ? `${baseName} ${code}` : baseName;

  return {
    cleanName: baseName,
    cleanCode: code,
    fullLabel,
    canToggle: titles.canToggle,
    originalName: titles.secondaryTitle,
  };
}

