import { NextResponse } from "next/server";
import sharp from "sharp";
import { findSetByCode, detectSetLanguage, searchTcgCards, TCG_SETS } from "@/lib/tcg-index-data";
import { CardLanguage } from "@/types";

// Supported Gemini models in priority order
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
];

const SCAN_PROMPT = `
You are an expert Pokémon and Trading Card Game (TCG) authenticator and metadata extractor specializing in Asian and International trading cards (Japanese, Chinese, Korean, German, English).

You are provided with:
1. FULL CARD IMAGE: Overall card face, artwork, card name at top, card type.
2. HIGH-RESOLUTION ZOOMED-IN CLOSE-UP of the bottom border: Look specifically at this zoomed close-up image across the bottom strip to read the set code box, card number, rarity, and regulation mark with 100% precision.

CRITICAL RULES FOR POKÉMON CARDS:
- "is_card": true if a trading card is visible.
- "card_name_original": The native name printed on the card face in its original language (e.g. "リザードンex", "皮卡丘", "Glurak ex", "Charizard ex").
- "card_name_de": The official German Pokémon name (e.g. "Glurak-ex", "Pikachu", "Nachtara", "Mewtu").
- "card_name_en": The official English Pokémon name (e.g. "Charizard ex", "Pikachu", "Umbreon", "Mewtwo").
- "set_code": Look at the bottom-left corner rectangle box or footer (e.g. "SV2a", "SV1S", "JTG", "MEW", "OBF", "PAF", "151", "S6a", "s12a", "CBB4C", "CS1a").
- "set_name": Expansion name if identifiable (e.g. "Pokémon Card 151", "Scarlet & Violet", "Terastal Festival", "Stürzende Funken").
- "set_number": Card number fraction printed at bottom (e.g. "201/165", "103/078", "006/165", "130/170").
- "rarity": Printed rarity symbol or letters (e.g. "SAR", "AR", "SR", "UR", "RR", "R", "U", "C", "Double Rare", "Illustration Rare", "Ultra Rare").
- "language": Detect the card language accurately:
    * "JP": If card text contains Japanese Katakana / Hiragana (e.g. リザードン, たね, グッズ, サポート).
    * "CN": If card text contains Chinese Hanzi without Kana, or Chinese set codes (CS, CBB).
    * "KR": If card text contains Korean Hangul.
    * "DE": If card text is German (e.g. KP, Phase 1, Basis, Schwäche).
    * "EN": If card text is English (e.g. HP, Stage 1, Basic, Weakness).
- "condition": "NM"

Return ONLY a valid JSON object matching this schema:
{
  "is_card": boolean,
  "card_name_original": string,
  "card_name_de": string,
  "card_name_en": string,
  "set_code": string,
  "set_name": string,
  "set_number": string,
  "rarity": string,
  "language": string,
  "condition": string
}
`;

/**
 * Generates an ultra-sharp, zoomed-in crop of the bottom info band
 * where the set code, card number, and rarity are printed.
 */
async function createBottomInfoCrop(
  imageBuffer: Buffer
): Promise<{ data: string; mimeType: string } | null> {
  try {
    const meta = await sharp(imageBuffer).metadata();
    if (!meta.width || !meta.height) return null;

    // Bottom 25% of the card
    const cropTop = Math.max(0, Math.round(meta.height * 0.75));
    const cropHeight = meta.height - cropTop;
    const cropLeft = 0;
    const cropWidth = meta.width;

    const buffer = await sharp(imageBuffer)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .resize({ width: 1400, withoutEnlargement: false })
      .jpeg({ quality: 95 })
      .toBuffer();

    return {
      data: buffer.toString("base64"),
      mimeType: "image/jpeg",
    };
  } catch (err) {
    console.warn("[Card Scan API] Bottom crop warning:", err);
    return null;
  }
}

/**
 * Normalizes detected language to our app's CardLanguage type
 */
function normalizeDetectedLanguage(lang?: string): CardLanguage {
  const l = (lang || "").trim().toUpperCase();
  if (l.includes("JP") || l.includes("JAP")) return "JP";
  if (l.includes("DE") || l.includes("GER")) return "DE";
  if (l.includes("EN") || l.includes("ENG")) return "EN";
  if (l.includes("KR") || l.includes("KOR")) return "KR";
  if (l.includes("CN") || l.includes("ZH") || l.includes("CHIN")) return "CN";
  return "JP";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, apiKey: clientApiKey, filename } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Kein Bild übergeben", success: false },
        { status: 400 }
      );
    }

    // Extract raw base64 data & mime type
    let cleanBase64 = image;
    let mimeType = "image/jpeg";
    if (image.startsWith("data:")) {
      const parts = image.split(",");
      const match = parts[0].match(/data:(.*?);base64/);
      if (match) mimeType = match[1];
      cleanBase64 = parts[1] || "";
    }

    const imageBuffer = Buffer.from(cleanBase64, "base64");

    // Create high-res bottom info close-up crop for set code and card number accuracy
    const bottomCrop = await createBottomInfoCrop(imageBuffer);

    // Resolve Gemini API Key (Priority: Client custom key > Server env var > settings fallback)
    const apiKey = (
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_KEY ||
      ""
    ).trim();

    let aiResult: any = null;
    let aiError: string | null = null;

    if (apiKey) {
      // Build multimodal payload
      const parts: any[] = [
        { text: SCAN_PROMPT },
        {
          inline_data: {
            mime_type: mimeType,
            data: cleanBase64,
          },
        },
      ];

      if (bottomCrop) {
        parts.push({
          inline_data: {
            mime_type: bottomCrop.mimeType,
            data: bottomCrop.data,
          },
        });
      }

      const payload = {
        contents: [{ parts }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1,
          max_output_tokens: 600,
        },
      };

      for (const model of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.warn(`[Gemini Vision] Model ${model} returned ${res.status}:`, errText);
            // If quota or payment error, stop trying other models to avoid delay
            if (res.status === 402 || res.status === 403) {
              aiError = `Google AI Studio: ${res.status === 402 ? "Guthaben aufgebraucht" : "Ungültiger API-Key"}`;
              break;
            }
            continue;
          }

          const resData = await res.json();
          const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            try {
              aiResult = JSON.parse(text);
              break;
            } catch (e) {
              console.warn("[Gemini Vision] JSON parse failed:", text);
            }
          }
        } catch (err: any) {
          console.warn(`[Gemini Vision] Error with ${model}:`, err?.message);
        }
      }
    }

    // --------------------------------------------------------------------------
    // Process & Enrich the extracted information
    // --------------------------------------------------------------------------
    let detectedName = "";
    let detectedOriginalName = "";
    let detectedEnName = "";
    let detectedDeName = "";
    let detectedSetCode = "";
    let detectedSetName = "";
    let detectedNumber = "";
    let detectedLang: CardLanguage = "DE";
    let detectedRarity = "";
    let detectedCondition = "NM";
    let isAiDetected = false;

    if (aiResult && aiResult.is_card !== false) {
      isAiDetected = true;
      detectedOriginalName = (aiResult.card_name_original || "").trim();
      detectedDeName = (aiResult.card_name_de || "").trim();
      detectedEnName = (aiResult.card_name_en || "").trim();
      detectedSetCode = (aiResult.set_code || "").trim();
      detectedSetName = (aiResult.set_name || "").trim();
      detectedNumber = (aiResult.set_number || "").trim();
      detectedRarity = (aiResult.rarity || "").trim();
      detectedLang = normalizeDetectedLanguage(aiResult.language);

      // Determine the best display name
      if (detectedLang === "DE" && detectedDeName) {
        detectedName = detectedDeName;
      } else if (detectedLang === "EN" && detectedEnName) {
        detectedName = detectedEnName;
      } else if (detectedOriginalName) {
        detectedName = detectedOriginalName;
      } else {
        detectedName = detectedDeName || detectedEnName || "Pokémon Karte";
      }
    }

    // --------------------------------------------------------------------------
    // Heuristic Fallback from Filename (if AI is inactive or didn't find set/number)
    // --------------------------------------------------------------------------
    if (!detectedName && filename && typeof filename === "string") {
      const cleanName = filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
      const parts = cleanName.split(/\s+/);
      if (parts.length > 0) {
        detectedName = parts[0];
      }
      // Check for set code in filename (e.g. SV2a, JTG, MEW)
      for (const p of parts) {
        const matched = findSetByCode(p);
        if (matched) {
          detectedSetCode = matched.code;
          detectedSetName = matched.name;
          detectedLang = matched.language;
          break;
        }
      }
    }

    // --------------------------------------------------------------------------
    // Cross-reference with our TCG Index Sets & Cards for 100% Accuracy
    // --------------------------------------------------------------------------
    if (detectedSetCode) {
      const setMatch = findSetByCode(detectedSetCode);
      if (setMatch) {
        detectedSetCode = setMatch.code;
        if (!detectedSetName || detectedSetName === detectedSetCode) {
          detectedSetName = setMatch.name;
        }
        detectedLang = setMatch.language;
      }
    }

    // If card number is present (e.g. "201/165" or "201"), search local cards
    if (detectedNumber) {
      const numOnly = detectedNumber.split("/")[0].replace(/^0+/, "");
      const matchedCards = searchTcgCards(numOnly, detectedLang);
      const exactCard = matchedCards.find((c) => {
        const cNumOnly = c.number.split("/")[0].replace(/^0+/, "");
        return (
          cNumOnly === numOnly &&
          (!detectedSetCode || c.setCode.toLowerCase() === detectedSetCode.toLowerCase())
        );
      });

      if (exactCard) {
        if (detectedLang === "JP") {
          detectedName = exactCard.nameOriginal || exactCard.name;
          detectedOriginalName = exactCard.nameOriginal;
          detectedDeName = exactCard.nameDe;
          detectedEnName = exactCard.nameEn;
        } else if (detectedLang === "DE") {
          detectedName = exactCard.nameDe || exactCard.name;
        } else {
          detectedName = exactCard.nameEn || exactCard.name;
        }
        detectedSetName = exactCard.setName;
        detectedSetCode = exactCard.setCode;
        detectedNumber = exactCard.number;
        detectedRarity = exactCard.rarity || detectedRarity;
      }
    }

    return NextResponse.json({
      success: true,
      isAiDetected,
      aiError,
      data: {
        name: detectedName,
        cardNameOriginal: detectedOriginalName,
        cardNameDe: detectedDeName,
        cardNameEn: detectedEnName,
        setCode: detectedSetCode,
        setName: detectedSetName,
        cardNumber: detectedNumber,
        rarity: detectedRarity,
        language: detectedLang,
        condition: detectedCondition,
      },
      message: isAiDetected
        ? "Karte erfolgreich per KI erkannt!"
        : "Bild geladen. Bitte überprüfe die Details oder wähle die Karte im TCG-Index.",
    });
  } catch (error: any) {
    console.error("[Card Scan API] Critical route error:", error);
    return NextResponse.json(
      {
        success: false,
        isAiDetected: false,
        error: error?.message || "Fehler beim Analysieren des Bildes",
      },
      { status: 500 }
    );
  }
}
