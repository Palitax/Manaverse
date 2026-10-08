"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  BACKGROUND_SLABS_ROW_1,
  BACKGROUND_SLABS_ROW_2,
  BACKGROUND_SLABS_ROW_3,
} from "@/lib/slabs-data";
import { LuxurySlab } from "./luxury-slab";
import { BackgroundSlab } from "@/types/slabs";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const TILT_VARIANTS: Array<"tilt-a" | "tilt-b" | "tilt-c" | "tilt-d"> = [
  "tilt-a",
  "tilt-b",
  "tilt-c",
  "tilt-d",
];

// Erzeugt einen nahtlosen Repetition-Block (3 Wiederholungen der 5 Karten = 15 Karten)
// 15 Karten decken mit den großzügigen Abständen auch 5K- und 6K-Displays mühelos ab,
// während die mathematische Dual-Track-Struktur 100% sprungfreie Endlos-Schleifen garantiert.
function createSeamlessTrack(cards: BackgroundSlab[]) {
  const result: BackgroundSlab[] = [];
  for (let i = 0; i < 3; i++) {
    result.push(...cards);
  }
  return result;
}

interface MarqueeRowProps {
  rowId: string;
  cards: BackgroundSlab[];
  direction: "left" | "right";
  duration: string;
  tiltOffset: number;
  isPaused: boolean;
  className?: string;
}

function MarqueeRow({
  rowId,
  cards,
  direction,
  duration,
  tiltOffset,
  isPaused,
  className,
}: MarqueeRowProps) {
  const trackItems = useMemo(() => createSeamlessTrack(cards), [cards]);

  const animationClass =
    direction === "left"
      ? "animate-marquee-track-left"
      : "animate-marquee-track-right";

  return (
    <div
      className={cn(
        "relative w-full flex items-center py-2 sm:py-3.5 select-none pointer-events-none",
        className
      )}
    >
      {/* Track 1 - Großzügiger, eleganter Galerie-Abstand zwischen den Sammelkarten */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-14 sm:gap-20 md:gap-28 lg:gap-36 pr-14 sm:pr-20 md:pr-28 lg:pr-36",
          animationClass
        )}
        style={{
          animationDuration: duration,
          animationPlayState: isPaused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {trackItems.map((slab, idx) => (
          <LuxurySlab
            key={`t1-${rowId}-${slab.id}-${idx}`}
            slab={slab}
            tiltVariant={TILT_VARIANTS[(idx + tiltOffset) % 4]}
          />
        ))}
      </div>

      {/* Track 2 (Pixel-identischer Zwilling für nahtlose 60fps Endlosschleife) */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-14 sm:gap-20 md:gap-28 lg:gap-36 pr-14 sm:pr-20 md:pr-28 lg:pr-36",
          animationClass
        )}
        style={{
          animationDuration: duration,
          animationPlayState: isPaused ? "paused" : "running",
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        {trackItems.map((slab, idx) => (
          <LuxurySlab
            key={`t2-${rowId}-${slab.id}-${idx}`}
            slab={slab}
            tiltVariant={TILT_VARIANTS[(idx + tiltOffset) % 4]}
          />
        ))}
      </div>
    </div>
  );
}

export function SlabsVideoBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const [focusMode, setFocusMode] = useState<"ambient" | "bright">("ambient");

  useEffect(() => {
    // Barrierefreiheit: Reduzierte Bewegung bei Änderung umschalten
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsPaused(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Batterie- & Performance-Optimierung: Stoppen wenn Tab inaktiv
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else if (!mediaQuery.matches) {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* ==================================================================== */}
      {/* 1. REIN SCHWARZER HINTERGRUND MIT SCHWEBENDEN KARTEN (-Z-10)          */}
      {/* ==================================================================== */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-black"
        aria-hidden="true"
      >
        {/* ==================================================================== */}
        {/* GENAU 3 REIHEN: Ruhige, flüssige Slow-Motion-Bänder                  */}
        {/* Auf der Startseite dezent gedimmt mit weicher Tiefenschärfe,         */}
        {/* auf Unterseiten extrem stark abgedunkelt (opacity-15)               */}
        {/* ==================================================================== */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-evenly py-2 sm:py-6 pointer-events-none select-none transition-all duration-700",
            isHome
              ? focusMode === "ambient"
                ? "opacity-35 brightness-[0.55] contrast-[0.9] blur-[0.8px]"
                : "opacity-60 brightness-[0.75] contrast-[0.95]"
              : "opacity-15 brightness-[0.35] contrast-[0.8] blur-[2px]"
          )}
        >
          {/* REIHE 1: Links -> Rechts (Majestätische Slow Motion) */}
          <MarqueeRow
            rowId="r1"
            cards={BACKGROUND_SLABS_ROW_1}
            direction="right"
            duration="190s"
            tiltOffset={0}
            isPaused={isPaused}
          />

          {/* REIHE 2: Rechts -> Links (Majestätische Slow Motion) */}
          <MarqueeRow
            rowId="r2"
            cards={BACKGROUND_SLABS_ROW_2}
            direction="left"
            duration="230s"
            tiltOffset={1}
            isPaused={isPaused}
          />

          {/* REIHE 3: Links -> Rechts (Majestätische Slow Motion) */}
          <MarqueeRow
            rowId="r3"
            cards={BACKGROUND_SLABS_ROW_3}
            direction="right"
            duration="210s"
            tiltOffset={2}
            isPaused={isPaused}
          />
        </div>

        {/* Weiche Verläufe oben und unten für sauberes Ausblenden unter Navigation */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

        {/* UNTERSEITEN-OVERLAY: Stark abgedunkelt, damit Formulare, Tabellen & UI-Karten klar hervorstechen */}
        {!isHome && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] pointer-events-none z-10 transition-opacity duration-500" />
        )}

        {/* STARTSEITEN-SCRIM: Feiner Kontrastfilter für optimalen Fokus auf die 4 interaktiven Hauptkarten */}
        {isHome && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700 pointer-events-none z-10",
              focusMode === "ambient" ? "bg-black/35" : "bg-black/10"
            )}
          />
        )}
      </div>

      {/* ==================================================================== */}
      {/* 2. DISKRETER AMBIENCE TOGGLE (NUR AUF DER STARTSEITE SICHTBAR)       */}
      {/* ==================================================================== */}
      {isHome && (
        <>
          {/* Desktop-Schalter */}
          <div className="fixed bottom-4 right-4 z-50 pointer-events-auto hidden md:block">
            <button
              type="button"
              onClick={() =>
                setFocusMode((prev) => (prev === "ambient" ? "bright" : "ambient"))
              }
              className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full bg-black/80 hover:bg-black text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md text-xs font-semibold transition-all shadow-xl cursor-pointer"
              title="Hintergrund-Fokus umschalten (Dezent / Scharf)"
              aria-label="Hintergrund-Fokus umschalten"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {focusMode === "ambient" ? "Hintergrund: Dezent" : "Hintergrund: Scharf"}
              </span>
            </button>
          </div>

          {/* Mobile-Schalter (Extralocke: mind. 44x44px Touch-Target, sicher über Mobile Island Bar) */}
          <div
            className="fixed right-3.5 z-50 pointer-events-auto md:hidden"
            style={{
              bottom: "calc(4.75rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setFocusMode((prev) => (prev === "ambient" ? "bright" : "ambient"))
              }
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/90 text-amber-400 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.85)] active:scale-90 transition-all cursor-pointer"
              title="Hintergrund-Fokus umschalten"
              aria-label={
                focusMode === "ambient"
                  ? "Hintergrund auf Scharf stellen"
                  : "Hintergrund auf Dezent stellen"
              }
            >
              <Sparkles
                className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  focusMode === "bright" && "rotate-45 text-yellow-300 scale-110"
                )}
              />
            </button>
          </div>
        </>
      )}
    </>
  );
}
