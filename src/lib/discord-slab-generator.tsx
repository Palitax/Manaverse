import { ImageResponse } from "next/og";
import React from "react";

export interface SlabGeneratorOptions {
  name: string;
  set?: string;
  cardNumber?: string;
  condition?: string;
  language?: string;
  type?: "sell" | "trade" | "looking_for" | "bulk" | string;
  price?: string | number;
  estimatedTradeValue?: string | number;
  photoUrl?: string;
  username?: string;
  discordUsername?: string;
  avatarUrl?: string;
  dealsCount?: number;
  allowOffers?: boolean;
}

// Convert image buffer to JPEG base64 data URL using sharp for 100% reliable Satori rendering
async function convertBufferToJpegDataUrl(buffer: Buffer): Promise<string> {
  try {
    const sharp = (await import("sharp")).default;
    const jpegBuf = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    return `data:image/jpeg;base64,${jpegBuf.toString("base64")}`;
  } catch (err) {
    console.warn("Sharp JPEG conversion error:", err);
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
}

// Convert any local, remote, or data URL image into a JPEG base64 data URL for Satori
export async function resolveImageToDataUrl(imageUrl?: string): Promise<string | undefined> {
  if (!imageUrl) return undefined;

  // Existing base64 data URL: convert to JPEG to ensure Satori compatibility (e.g. if source was webp)
  if (imageUrl.startsWith("data:")) {
    const base64Index = imageUrl.indexOf(";base64,");
    if (base64Index !== -1) {
      try {
        const rawBase64 = imageUrl.substring(base64Index + 8);
        const buf = Buffer.from(rawBase64, "base64");
        return await convertBufferToJpegDataUrl(buf);
      } catch (e) {
        console.warn("Could not process data URL with sharp:", e);
      }
    }
    return imageUrl;
  }

  // Local filesystem public asset
  if (imageUrl.startsWith("/")) {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const cleanPath = imageUrl.split("?")[0].replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", cleanPath);
      const buffer = await fs.readFile(filePath);
      return await convertBufferToJpegDataUrl(buffer);
    } catch (e) {
      console.warn("Could not read local public file for slab:", e);
    }
  }

  // Remote URL over HTTP/HTTPS
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    try {
      const res = await fetch(imageUrl, {
        headers: { "User-Agent": "Manaforge-Slab-Renderer/1.0" },
      });
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        return await convertBufferToJpegDataUrl(buffer);
      }
    } catch (e) {
      console.warn("Could not fetch remote card photo for slab:", e);
    }
  }

  return undefined;
}

// Map condition codes to full labels matching the app UI
function getConditionLabel(cond: string = "NM"): string {
  const upper = cond.toUpperCase();
  if (upper.includes("NM") || upper.includes("NEAR MINT")) return "NEAR MINT";
  if (upper.includes("EX") || upper.includes("EXCELLENT")) return "EXCELLENT";
  if (upper.includes("GD") || upper.includes("GOOD")) return "GOOD";
  if (upper.includes("LP") || upper.includes("LIGHT")) return "LIGHT PLAYED";
  if (upper.includes("PL") || upper.includes("PLAYED")) return "PLAYED";
  if (upper.includes("PO") || upper.includes("POOR")) return "POOR";
  if (upper.includes("MINT") || upper.includes("GEM")) return "GEM MINT";
  return upper;
}

// Generate the EXACT Acrylic Collector Slab Card PNG matching the Manaforge UI
export async function generateSlabImageBuffer(
  options: SlabGeneratorOptions
): Promise<Buffer> {
  const {
    name,
    set = "Edition / Set",
    cardNumber,
    condition = "NM",
    language = "DE",
    type = "sell",
    price,
    estimatedTradeValue,
    photoUrl,
    avatarUrl,
    username = "Levin ManaCards",
    discordUsername,
    dealsCount = 18,
    allowOffers = true,
  } = options;

  const cardDataUrl = await resolveImageToDataUrl(photoUrl);
  const avatarDataUrl = await resolveImageToDataUrl(avatarUrl);

  const conditionLabel = getConditionLabel(condition);
  const langUpper = (language || "DE").toUpperCase();
  const langText =
    langUpper === "DE"
      ? "DE"
      : langUpper === "EN"
      ? "EN"
      : langUpper === "JP"
      ? "JP"
      : langUpper;

  // Type configuration exactly mirroring collector-slab-card.tsx
  const typeConfig: Record<
    string,
    {
      collectionTag: string;
      valueLabel: string;
      valueColor: string;
      btnText: string;
      btnBg: string;
      btnTextColor: string;
      perkText: string;
      perkBg: string;
      perkBorder: string;
      perkColor: string;
    }
  > = {
    sell: {
      collectionTag: "EINGESTELLT: NEU",
      valueLabel: "KAUFPREIS",
      valueColor: "#34d399",
      btnText: "Kaufen",
      btnBg: "#10b981",
      btnTextColor: "#022c22",
      perkText: "Sofortkauf im Marktplatz",
      perkBg: "rgba(16, 185, 129, 0.12)",
      perkBorder: "rgba(16, 185, 129, 0.28)",
      perkColor: "#34d399",
    },
    trade: {
      collectionTag: "1:1 TAUSCH",
      valueLabel: "ESTIMATED TRADE VALUE",
      valueColor: "#c084fc",
      btnText: "Angebot machen",
      btnBg: "#a855f7",
      btnTextColor: "#ffffff",
      perkText: "Gleichwertiger Tausch gesucht",
      perkBg: "rgba(168, 85, 247, 0.14)",
      perkBorder: "rgba(168, 85, 247, 0.32)",
      perkColor: "#c084fc",
    },
    looking_for: {
      collectionTag: "KOPFGELD",
      valueLabel: "MAXIMALES BUDGET",
      valueColor: "#38bdf8",
      btnText: "Karte anbieten",
      btnBg: "#06b6d4",
      btnTextColor: "#082f49",
      perkText: "Sofortige Auszahlung garantiert",
      perkBg: "rgba(6, 182, 212, 0.12)",
      perkBorder: "rgba(6, 182, 212, 0.28)",
      perkColor: "#38bdf8",
    },
    bulk: {
      collectionTag: "ANKAUF",
      valueLabel: "ANKAUFSPREIS",
      valueColor: "#fbbf24",
      btnText: "Ankauf prüfen",
      btnBg: "#f59e0b",
      btnTextColor: "#451a03",
      perkText: "Manacards Ankauf-Service",
      perkBg: "rgba(245, 158, 11, 0.12)",
      perkBorder: "rgba(245, 158, 11, 0.28)",
      perkColor: "#fbbf24",
    },
  };

  const currentType = typeConfig[type] || typeConfig.sell;

  const displayPrice = price
    ? `${price} €`
    : estimatedTradeValue
    ? `~${estimatedTradeValue} €`
    : "VB";

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "MF";

  const displayDiscord = discordUsername
    ? `@${discordUsername.replace(/^@/, "")}`
    : "@manaforge";

  // Exact 1:1 replica of the Acrylic Slab Card UI from the Manaforge app
  const slabElement = (
    <div
      style={{
        width: "500px",
        height: "820px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#07090e",
        position: "relative",
      }}
    >
      {/* Subtle ambient backdrop reflection */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "380px",
          height: "700px",
          borderRadius: "32px",
          backgroundColor:
            type === "trade"
              ? "rgba(168, 85, 247, 0.15)"
              : type === "looking_for"
              ? "rgba(6, 182, 212, 0.15)"
              : "rgba(16, 185, 129, 0.14)",
          filter: "blur(40px)",
        }}
      />

      {/* The Acrylic Display Slab (Exact class matching .acrylic-display-slab) */}
      <div
        style={{
          width: "410px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 40%, rgba(15,23,42,0.45) 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.24)",
          padding: "16px",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.88)",
        }}
      >
        {/* Chamfered Bevel Inner Line (.slab-edge-bevel) */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "4px",
            left: "4px",
            right: "4px",
            bottom: "4px",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        />

        {/* ================================================================ */}
        {/* 1. CLEAN HEADER PLATE (.slab-header-plate)                        */}
        {/* ================================================================ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
            position: "relative",
          }}
        >
          {/* Top Row: collection-tag + foil-badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "6px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "0.05em",
                padding: "3px 7px",
                borderRadius: "4px",
              }}
            >
              {currentType.collectionTag}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "10px",
                fontWeight: 800,
                color: "#64748b",
                letterSpacing: "0.05em",
              }}
            >
              {`${conditionLabel} • ${langText}`}
            </div>
          </div>

          {/* Main Row: Card Name & Set info */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "15px",
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              {`${name}${cardNumber ? ` #${cardNumber}` : ""}`}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "11px",
                color: "#64748b",
                marginTop: "2px",
              }}
            >
              {`${set} • ${conditionLabel}`}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. RECESSED CARD WINDOW (.slab-card-window)                      */}
        {/* ================================================================ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020617",
            borderRadius: "14px",
            marginTop: "12px",
            padding: "8px",
            position: "relative",
            boxShadow: "inset 0 3px 16px rgba(0, 0, 0, 0.9)",
          }}
        >
          {cardDataUrl ? (
            <img
              src={cardDataUrl}
              alt={name}
              style={{
                width: "100%",
                height: "440px",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "440px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0b101d",
                borderRadius: "8px",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Kein Kartenfoto vorhanden
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* 3. VALUE & ACTION ROW (Exact matching the screenshot)             */}
        {/* ================================================================ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "14px",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "9px",
                color: "#94a3b8",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {currentType.valueLabel}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "20px",
                fontWeight: 900,
                color: currentType.valueColor,
                lineHeight: 1.1,
              }}
            >
              {displayPrice}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: currentType.btnBg,
              color: currentType.btnTextColor,
              fontSize: "13px",
              fontWeight: 900,
              padding: "9px 16px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            {currentType.btnText}
          </div>
        </div>

        {/* Optional Perk / VB Tag */}
        {allowOffers && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              backgroundColor: currentType.perkBg,
              border: `1px solid ${currentType.perkBorder}`,
              color: currentType.perkColor,
              fontSize: "10px",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "6px",
              marginTop: "8px",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentType.perkColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "5px" }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ display: "flex" }}>{currentType.perkText}</span>
          </div>
        )}

        {/* ================================================================ */}
        {/* 4. SELLER / TRADER FOOTER BAR                                     */}
        {/* ================================================================ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Molten / Lava Avatar Frame Circle */}
            <div
              style={{
                display: "flex",
                width: "30px",
                height: "30px",
                borderRadius: "15px",
                padding: "2px",
                background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ffd700 100%)",
                boxShadow: "0 0 10px rgba(255, 69, 0, 0.7)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              {avatarDataUrl ? (
                <img
                  src={avatarDataUrl}
                  alt={username}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "13px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    borderRadius: "13px",
                    backgroundColor: "#100402",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fed7aa",
                    fontSize: "11px",
                    fontWeight: 900,
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: "12px",
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                {username}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "10px",
                  color: "#94a3b8",
                }}
              >
                {`${dealsCount} Deals`}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "10px",
              color: "#a5b4fc",
              fontFamily: "monospace",
              backgroundColor: "rgba(99, 102, 241, 0.12)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              padding: "3px 8px",
              borderRadius: "6px",
            }}
          >
            {displayDiscord}
          </div>
        </div>

        {/* Polished Bottom Acrylic Reflection Rim (.slab-bottom-rim) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "60px",
              height: "2px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            }}
          />
        </div>
      </div>
    </div>
  );

  const res = new ImageResponse(slabElement, {
    width: 500,
    height: 820,
  });

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
