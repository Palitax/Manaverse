"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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
        "relative w-full overflow-hidden flex items-center py-1 sm:py-3 select-none pointer-events-none",
        className
      )}
    >
      {/* Track 1 - Maximal großzügiger Abstand zwischen den Slabs für pure Galerie-Eleganz */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-20 sm:gap-32 md:gap-44 lg:gap-52 pr-20 sm:pr-32 md:pr-44 lg:pr-52",
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
          "flex shrink-0 items-center gap-20 sm:gap-32 md:gap-44 lg:gap-52 pr-20 sm:pr-32 md:pr-44 lg:pr-52",
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const [focusMode, setFocusMode] = useState<"ambient" | "bright">("ambient");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playbackRate = 0.7;

      if (!prefersReducedMotion) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsVideoLoaded(true))
            .catch(() => {
              setIsVideoLoaded(false);
            });
        }
      }
    }

    // Barrierefreiheit: Reduzierte Bewegung bei Änderung umschalten
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsPaused(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Batterie- & Performance-Optimierung: Stoppen wenn Tab inaktiv
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        if (videoRef.current) videoRef.current.pause();
      } else if (!mediaQuery.matches) {
        setIsPaused(false);
        if (videoRef.current) videoRef.current.play().catch(() => {});
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
      {/* 1. FIXIERTE HINTERGRUND-SZENE (-Z-10)                                */}
      {/* ==================================================================== */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#07090e]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080e] via-[#080d19] to-[#05070c]" />

        {/* Ambient Video-Loop im Hintergrund */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/gradient-poster.jpg"
          onCanPlay={() => setIsVideoLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-1000",
            isVideoLoaded ? "opacity-60" : "opacity-35"
          )}
        >
          <source src="/slow_motion_gradient_bg.webm" type="video/webm" />
          <source src="/slow_motion_gradient_bg.mp4" type="video/mp4" />
        </video>

        {/* Hardware-optimierte Radiale Lichtfelder (ohne blur-Filter, 0% Composite-Overhead) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(6,182,212,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_45%,rgba(168,85,247,0.08),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(245,158,11,0.07),transparent_50%)] pointer-events-none" />

        {/* ==================================================================== */}
        {/* GENAU 3 REIHEN: Ruhige, flüssige Slow-Motion-Bänder                  */}
        {/* ==================================================================== */}
        <div className="absolute inset-0 flex flex-col justify-evenly py-2 sm:py-6 h-[100dvh] overflow-hidden opacity-95">
          {/* REIHE 1: Links -> Rechts (Majestätische 200s Slow Motion) */}
          <MarqueeRow
            rowId="r1"
            cards={BACKGROUND_SLABS_ROW_1}
            direction="right"
            duration="200s"
            tiltOffset={0}
            isPaused={isPaused}
          />

          {/* REIHE 2: Rechts -> Links (Majestätische 240s Slow Motion) */}
          <MarqueeRow
            rowId="r2"
            cards={BACKGROUND_SLABS_ROW_2}
            direction="left"
            duration="240s"
            tiltOffset={1}
            isPaused={isPaused}
          />

          {/* REIHE 3: Links -> Rechts (Majestätische 220s Slow Motion) */}
          <MarqueeRow
            rowId="r3"
            cards={BACKGROUND_SLABS_ROW_3}
            direction="right"
            duration="220s"
            tiltOffset={2}
            isPaused={isPaused}
          />
        </div>

        {/* Weiche Verläufe oben und unten für sauberes Ausblenden unter Navigation */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-40 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none" />

        {/* Atmosphärischer Kontrastfilter für optimale Lesbarkeit */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700 pointer-events-none",
            focusMode === "ambient" ? "bg-[#07090e]/40" : "bg-[#07090e]/15"
          )}
        />

        {/* Radialer Scheinwerfer zur Betonung des Zentrum-Contents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(7,9,14,0.6)_95%)] pointer-events-none" />
      </div>

      {/* ==================================================================== */}
      {/* 2. DISKRETER AMBIENCE TOGGLE (DESKTOP + MOBILE EXTRALOCKE)           */}
      {/* ==================================================================== */}
      {/* Desktop-Schalter */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto hidden md:block">
        <button
          type="button"
          onClick={() =>
            setFocusMode((prev) => (prev === "ambient" ? "bright" : "ambient"))
          }
          className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full bg-black/75 hover:bg-black/95 text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md text-xs font-semibold transition-all shadow-xl cursor-pointer"
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
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#0c111d]/90 text-amber-400 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.85)] active:scale-90 transition-all cursor-pointer"
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
  );
}
