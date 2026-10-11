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
}

// Convert any local or remote image into a base64 data URL for fast, reliable Satori rendering
export async function resolveImageToDataUrl(imageUrl?: string): Promise<string | undefined> {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("data:")) return imageUrl;

  // Local filesystem public asset
  if (imageUrl.startsWith("/")) {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const cleanPath = imageUrl.split("?")[0].replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", cleanPath);
      const buffer = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
          ? "image/gif"
          : "image/jpeg";
      return `data:${mime};base64,${buffer.toString("base64")}`;
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
        const contentType = res.headers.get("content-type") || "image/jpeg";
        const base64 = Buffer.from(arrayBuf).toString("base64");
        return `data:${contentType};base64,${base64}`;
      }
    } catch (e) {
      console.warn("Could not fetch remote card photo for slab:", e);
    }
  }

  return undefined;
}

// Generate the full Acrylic Collector Slab PNG buffer
export async function generateSlabImageBuffer(
  options: SlabGeneratorOptions
): Promise<Buffer> {
  const {
    name,
    set = "Sammelkartenspiel",
    cardNumber,
    condition = "NM",
    language = "DE",
    type = "sell",
    price,
    estimatedTradeValue,
    photoUrl,
    username = "Manaforge Trainer",
  } = options;

  const dataUrl = await resolveImageToDataUrl(photoUrl);

  const typeConfig: Record<
    string,
    { label: string; bg: string; text: string; priceLabel: string; valueColor: string }
  > = {
    sell: {
      label: "MANAFORGE • SOFORTKAUF",
      bg: "#10b981",
      text: "#ffffff",
      priceLabel: "FESTPREIS",
      valueColor: "#34d399",
    },
    trade: {
      label: "MANAFORGE • 1:1 TAUSCH",
      bg: "#a855f7",
      text: "#ffffff",
      priceLabel: "ESTIMATED TRADE VALUE",
      valueColor: "#c084fc",
    },
    looking_for: {
      label: "MANAFORGE • GESUCH",
      bg: "#06b6d4",
      text: "#ffffff",
      priceLabel: "BUDGET / KOPFGELD",
      valueColor: "#38bdf8",
    },
    bulk: {
      label: "MANAFORGE • BULK-ANKAUF",
      bg: "#f59e0b",
      text: "#ffffff",
      priceLabel: "ANKAUFSPREIS",
      valueColor: "#fbbf24",
    },
  };

  const currentType = typeConfig[type] || typeConfig.sell;

  const displayPrice = price
    ? `${price} €`
    : estimatedTradeValue
    ? `${estimatedTradeValue} €`
    : "Auf Anfrage";

  // Build a unique certification ID
  const certId = `MF-${Math.abs(
    (name || "CARD")
      .split("")
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString(36)
    .toUpperCase()
    .slice(0, 6)}-${language}`;

  const slabElement = (
    <div
      style={{
        width: "600px",
        height: "920px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#070a12",
        position: "relative",
      }}
    >
      {/* Outer ambient glow behind acrylic slab */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "440px",
          height: "780px",
          borderRadius: "40px",
          backgroundColor: currentType.bg,
          opacity: 0.18,
          filter: "blur(40px)",
        }}
      />

      {/* The Acrylic Slab Container */}
      <div
        style={{
          width: "480px",
          height: "850px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "32px",
          border: "2px solid rgba(255, 255, 255, 0.35)",
          padding: "16px",
          position: "relative",
          boxShadow: "0 30px 70px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Chamfered Bevel Inner Rim */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "6px",
            left: "6px",
            right: "6px",
            bottom: "6px",
            borderRadius: "26px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        />

        {/* 4 Corner Screws / Acrylic Rivets */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "14px",
            left: "14px",
            width: "12px",
            height: "12px",
            borderRadius: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "12px",
            height: "12px",
            borderRadius: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "14px",
            left: "14px",
            width: "12px",
            height: "12px",
            borderRadius: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "14px",
            right: "14px",
            width: "12px",
            height: "12px",
            borderRadius: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        />

        {/* Header Plate (Label) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "12px 16px",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            position: "relative",
          }}
        >
          {/* Top Row: Type Badge + Condition / Language */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "6px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: currentType.bg,
                color: currentType.text,
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.5px",
                padding: "3px 8px",
                borderRadius: "5px",
              }}
            >
              {currentType.label}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "11px",
                fontWeight: 800,
                color: "#334155",
                letterSpacing: "0.5px",
              }}
            >
              {`${condition.toUpperCase()} • ${language.toUpperCase()}`}
            </div>
          </div>

          {/* Main Row: Card Name & Set info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "18px",
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
                fontWeight: 600,
                color: "#64748b",
                marginTop: "2px",
              }}
            >
              {`${set} • Manaforge Certified`}
            </div>
          </div>
        </div>

        {/* Recessed Acrylic Card Display Well */}
        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020617",
            borderRadius: "16px",
            marginTop: "12px",
            padding: "8px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={name}
              style={{
                height: "540px",
                maxWidth: "100%",
                borderRadius: "12px",
                objectFit: "contain",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.8)",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Kein Foto hinterlegt
            </div>
          )}

          {/* Holographic light sheen diagonal overlay */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 40%, rgba(255,255,255,0.06) 60%, transparent 100%)",
            }}
          />
        </div>

        {/* Bottom Rim (Slab Footer) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            padding: "10px 14px",
            backgroundColor: "rgba(10, 14, 24, 0.9)",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          {/* Left: Cert ID & User */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "10px",
                fontWeight: 800,
                color: "#94a3b8",
                letterSpacing: "0.5px",
              }}
            >
              {`CERT: ${certId}`}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "9px",
                color: "#64748b",
                marginTop: "1px",
              }}
            >
              {`Trainer: @${username}`}
            </div>
          </div>

          {/* Right: Price / Value Highlight */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontSize: "9px",
                fontWeight: 800,
                color: "#94a3b8",
                letterSpacing: "0.5px",
              }}
            >
              {currentType.priceLabel}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "17px",
                fontWeight: 900,
                color: currentType.valueColor,
                lineHeight: 1.1,
              }}
            >
              {displayPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const res = new ImageResponse(slabElement, {
    width: 600,
    height: 920,
  });

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
