"use client";

import React, { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Manaforge Siegel (Verifizierungs-Rosette)
 * ------------------------------------------------------------
 * Statt eines generischen "Schild mit Haken" nutzt Manaforge eine
 * geprägte, metallische Rosette – angelehnt an echte Grading-Siegel
 * (PSA/BGS-Labels). Jede Vertrauensstufe hat ihr eigenes Metall:
 *   0 Anwärter  → offene Hairline-Rosette
 *   1 Verifiziert → Platin
 *   2 Veteran     → Kobalt
 *   3 Elite       → Gold
 *   4 Meister     → Rubin
 *   5 Legende     → Prisma
 */

interface SealPalette {
  stops: [string, string, string];
  check: string;
  rim: string;
}

const SEAL_PALETTES: Record<number, SealPalette> = {
  1: { stops: ["#ffffff", "#cbd5e1", "#7c8698"], check: "#0b1220", rim: "rgba(255,255,255,0.55)" },
  2: { stops: ["#d6f6ff", "#38bdf8", "#1e40af"], check: "#04112b", rim: "rgba(214,246,255,0.6)" },
  3: { stops: ["#fff4c2", "#f5b83d", "#a35a07"], check: "#2a1500", rim: "rgba(255,244,194,0.65)" },
  4: { stops: ["#ffe1e6", "#f43f5e", "#881337"], check: "#2b0410", rim: "rgba(255,225,230,0.6)" },
  5: { stops: ["#e9e3ff", "#c084fc", "#f5b83d"], check: "#1a1033", rim: "rgba(233,227,255,0.7)" },
};

function buildRosettePath(points = 14, outer = 11.2, inner = 9.7, cx = 12, cy = 12): string {
  const coords: string[] = [];
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    coords.push(`${(cx + r * Math.cos(angle)).toFixed(3)} ${(cy + r * Math.sin(angle)).toFixed(3)}`);
  }
  return `M${coords.join(" L")} Z`;
}

const ROSETTE_PATH = buildRosettePath();

interface VerifiedSealProps {
  /** Vertrauensstufe 0–5 */
  level?: number;
  /** Kantenlänge in px */
  size?: number;
  className?: string;
  title?: string;
}

export function VerifiedSeal({ level = 1, size = 18, className, title }: VerifiedSealProps) {
  const rawId = useId();
  const id = useMemo(() => rawId.replace(/[^a-zA-Z0-9_-]/g, ""), [rawId]);
  const palette = SEAL_PALETTES[Math.min(5, Math.max(1, level))];

  if (level <= 0) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={cn("flex-shrink-0", className)}
        role="img"
        aria-label={title || "Noch nicht verifiziert"}
      >
        <path
          d={ROSETTE_PATH}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="1.6" fill="rgba(255,255,255,0.45)" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("flex-shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]", className)}
      role="img"
      aria-label={title || "Verifizierter Sammler"}
    >
      <defs>
        <linearGradient id={`seal-metal-${id}`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={palette.stops[0]} />
          <stop offset="52%" stopColor={palette.stops[1]} />
          <stop offset="100%" stopColor={palette.stops[2]} />
        </linearGradient>
        <radialGradient id={`seal-sheen-${id}`} cx="0.35" cy="0.2" r="0.6">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Geprägte Rosette */}
      <path
        d={ROSETTE_PATH}
        fill={`url(#seal-metal-${id})`}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Innerer Prägering */}
      <circle cx="12" cy="12" r="7.1" fill="none" stroke={palette.rim} strokeWidth="0.7" />
      {/* Spiegelnder Glanz */}
      <path d={ROSETTE_PATH} fill={`url(#seal-sheen-${id})`} />
      {/* Haken */}
      <path
        d="M8.4 12.3 L10.8 14.6 L15.6 9.6"
        fill="none"
        stroke={palette.check}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
