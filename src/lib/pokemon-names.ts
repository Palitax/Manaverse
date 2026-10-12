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

export interface ResolvedCardTitles {
  primaryTitle: string;
  secondaryTitle?: string;
  isGerman: boolean;
  canToggle: boolean;
}

/**
 * Resolves the primary and optional alternative (German/English) titles for a card listing.
 *
 * Rules:
 * - If card is listed as DE: show German name as primary. Clickable to toggle English name.
 * - If card is listed as EN: show English name as primary. Clickable to toggle German name.
 * - If card is JP, CN, KR or any other non-EN/DE language:
 *   Always show English name as primary! Clickable to toggle German name.
 * - Slashed names (e.g. "Umbreon VMAX / Nachtara VMAX (Moonbreon)") are parsed into their respective single-language representations.
 */
export function resolveCardTitles(
  fullName: string,
  cardLanguage: CardLanguage | string
): ResolvedCardTitles {
  if (!fullName) {
    return { primaryTitle: "", isGerman: false, canToggle: false };
  }

  const lang = (cardLanguage || "EN").toUpperCase();
  const isGermanListing = lang === "DE";

  let enCandidate = "";
  let deCandidate = "";

  // Case 1: Name contains a slash e.g. "Umbreon VMAX / Nachtara VMAX (Moonbreon)" or "Charizard / Glurak"
  if (fullName.includes(" / ")) {
    const parts = fullName.split(" / ").map((p) => p.trim());
    const partA = parts[0] || "";
    const partB = parts.slice(1).join(" / ").trim();

    // Check if partA is English or German
    let isPartADe = false;
    for (const deName of Object.keys(DE_TO_EN_POKEMON)) {
      if (partA.toLowerCase().includes(deName.toLowerCase()) && !partA.toLowerCase().includes(DE_TO_EN_POKEMON[deName]?.toLowerCase() || "")) {
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
    // Case 2: Single name provided e.g. "Umbreon VMAX", "Nachtara VMAX", "Glurak ex"
    // Let's attempt to identify and translate the base Pokémon name
    let foundEn: string | null = null;
    let foundDe: string | null = null;

    // Check German dictionary first
    for (const [de, en] of Object.entries(DE_TO_EN_POKEMON)) {
      const regex = new RegExp(`\\b${de}\\b`, "i");
      if (regex.test(fullName)) {
        foundDe = de;
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
          foundDe = de;
          enCandidate = fullName;
          deCandidate = fullName.replace(regex, de);
          break;
        }
      }
    }

    // Fallback if no dictionary match: both candidates match raw string
    if (!enCandidate && !deCandidate) {
      enCandidate = fullName;
      deCandidate = fullName;
    }
  }

  // Ensure clean strings
  enCandidate = enCandidate.trim();
  deCandidate = deCandidate.trim();

  // If card is German -> primary is German
  // If card is English -> primary is English
  // If card is JP/CN/KR/other -> ALWAYS primary English!
  if (isGermanListing) {
    const primary = deCandidate || enCandidate || fullName;
    const secondary = enCandidate && enCandidate !== primary ? enCandidate : undefined;
    return {
      primaryTitle: primary,
      secondaryTitle: secondary,
      isGerman: true,
      canToggle: Boolean(secondary),
    };
  } else {
    // EN, JP, CN, KR or any other language
    const primary = enCandidate || deCandidate || fullName;
    const secondary = deCandidate && deCandidate !== primary ? deCandidate : undefined;
    return {
      primaryTitle: primary,
      secondaryTitle: secondary,
      isGerman: false,
      canToggle: Boolean(secondary),
    };
  }
}

/**
 * Formats a clean, concise card label strictly showing card name and code (e.g. "Nachtara VMAX #215/203"),
 * stripping bloated subtitles like "(Moonbreon)", "(Alternate Art)", set suffixes, etc.
 */
export function formatSlabTitle(
  fullName: string,
  cardLanguage?: string,
  cardNumber?: string
): { cleanName: string; cleanCode: string; fullLabel: string } {
  if (!fullName) {
    const code = cardNumber ? (cardNumber.startsWith("#") ? cardNumber : `#${cardNumber}`) : "";
    return { cleanName: "", cleanCode: code, fullLabel: code };
  }

  const lang = (cardLanguage || "DE").toUpperCase();
  const titles = resolveCardTitles(fullName, lang);
  let baseName = titles.primaryTitle || fullName;

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
  };
}
