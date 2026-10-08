"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BACKGROUND_SLABS_ROW_1,
  BACKGROUND_SLABS_ROW_2,
  BACKGROUND_SLABS_ROW_3,
  BACKGROUND_SLABS_ROW_4,
} from "@/lib/slabs-data";
import { LuxurySlab } from "./luxury-slab";
import { cn } from "@/lib/utils";
import { Eye, Sparkles } from "lucide-react";

export function SlabsVideoBackground() {
  const [isPaused, setIsPaused] = useState(false);
  const [focusMode, setFocusMode] = useState<"ambient" | "bright">("ambient");
  const [isMounted, setIsMounted] = useState(false);

  // Triple array to ensure seamless infinite looping with zero seams
  const row1Doubled = useMemo(
    () => [...BACKGROUND_SLABS_ROW_1, ...BACKGROUND_SLABS_ROW_1, ...BACKGROUND_SLABS_ROW_1],
    []
  );
  const row2Doubled = useMemo(
    () => [...BACKGROUND_SLABS_ROW_2, ...BACKGROUND_SLABS_ROW_2, ...BACKGROUND_SLABS_ROW_2],
    []
  );
  const row3Doubled = useMemo(
    () => [...BACKGROUND_SLABS_ROW_3, ...BACKGROUND_SLABS_ROW_3, ...BACKGROUND_SLABS_ROW_3],
    []
  );
  const row4Doubled = useMemo(
    () => [...BACKGROUND_SLABS_ROW_4, ...BACKGROUND_SLABS_ROW_4, ...BACKGROUND_SLABS_ROW_4],
    []
  );

  useEffect(() => {
    setIsMounted(true);

    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsPaused(true);
      return;
    }

    // Battery & CPU optimization: pause when tab is inactive, resume when active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else if (!prefersReducedMotion) {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#07090e]"
      style={{
        // 3D perspective field for authentic angular depth
        perspective: "1200px",
      }}
      aria-hidden="true"
    >
      {/* ==================================================================== */}
      {/* 1. ATMOSPHERIC AMBIENT GLOW BACKDROP                                 */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080e] via-[#090d18] to-[#05070c]" />

      {/* Subtle Lava / Holo Prismatic radial nebulas */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-600/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-purple-600/[0.09] blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-amber-600/[0.08] blur-[130px] pointer-events-none" />

      {/* ==================================================================== */}
      {/* 2. MULTI-ROW 3D SLAB MARQUEE BANDS (SLOW MOTION)                    */}
      {/* ==================================================================== */}
      <div className="absolute inset-x-0 -top-6 -bottom-6 flex flex-col justify-between overflow-hidden opacity-95">
        {/* ROW 1: Direction Left -> Right (Slow Motion 85s) */}
        <div className="relative w-full overflow-hidden flex items-center py-1 sm:py-2">
          <div
            className="flex gap-4 sm:gap-8 w-max animate-marquee-right"
            style={{
              animationDuration: "85s",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {row1Doubled.map((slab, idx) => (
              <LuxurySlab
                key={`r1-${slab.id}-${idx}`}
                slab={slab}
                tiltVariant={
                  idx % 4 === 0
                    ? "tilt-a"
                    : idx % 4 === 1
                    ? "tilt-b"
                    : idx % 4 === 2
                    ? "tilt-c"
                    : "tilt-d"
                }
              />
            ))}
          </div>
        </div>

        {/* ROW 2: Direction Right -> Left (Slow Motion 100s) */}
        <div className="relative w-full overflow-hidden flex items-center py-1 sm:py-2">
          <div
            className="flex gap-4 sm:gap-8 w-max animate-marquee-left"
            style={{
              animationDuration: "100s",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {row2Doubled.map((slab, idx) => (
              <LuxurySlab
                key={`r2-${slab.id}-${idx}`}
                slab={slab}
                tiltVariant={
                  idx % 4 === 0
                    ? "tilt-b"
                    : idx % 4 === 1
                    ? "tilt-c"
                    : idx % 4 === 2
                    ? "tilt-d"
                    : "tilt-a"
                }
              />
            ))}
          </div>
        </div>

        {/* ROW 3: Direction Left -> Right (Slow Motion 75s) */}
        <div className="relative w-full overflow-hidden flex items-center py-1 sm:py-2">
          <div
            className="flex gap-4 sm:gap-8 w-max animate-marquee-right"
            style={{
              animationDuration: "75s",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {row3Doubled.map((slab, idx) => (
              <LuxurySlab
                key={`r3-${slab.id}-${idx}`}
                slab={slab}
                tiltVariant={
                  idx % 4 === 0
                    ? "tilt-c"
                    : idx % 4 === 1
                    ? "tilt-d"
                    : idx % 4 === 2
                    ? "tilt-a"
                    : "tilt-b"
                }
              />
            ))}
          </div>
        </div>

        {/* ROW 4: Direction Right -> Left (Slow Motion 95s - Desktop only for mobile breathing room) */}
        <div className="relative w-full overflow-hidden hidden sm:flex items-center py-1 sm:py-2">
          <div
            className="flex gap-4 sm:gap-8 w-max animate-marquee-left"
            style={{
              animationDuration: "95s",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {row4Doubled.map((slab, idx) => (
              <LuxurySlab
                key={`r4-${slab.id}-${idx}`}
                slab={slab}
                tiltVariant={
                  idx % 4 === 0
                    ? "tilt-d"
                    : idx % 4 === 1
                    ? "tilt-a"
                    : idx % 4 === 2
                    ? "tilt-b"
                    : "tilt-c"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. CINEMATIC SCRIM & CONTRAST VIGNETTE                               */}
      {/* ==================================================================== */}
      {/* Top and Bottom gradient shadows for smooth fading under header & footer */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none" />

      {/* Atmospheric center scrim overlay for perfect contrast with typography */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 pointer-events-none",
          focusMode === "ambient"
            ? "bg-[#07090e]/35 backdrop-blur-[1px]"
            : "bg-[#07090e]/15 backdrop-blur-[0px]"
        )}
      />

      {/* Radial spotlight focusing onto center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(7,9,14,0.6)_95%)] pointer-events-none" />

      {/* ==================================================================== */}
      {/* 4. DISCRETE AMBIENCE TOGGLE (EXTRALOCKE FÜR SAMMLER)                  */}
      {/* ==================================================================== */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto hidden md:block">
        <button
          type="button"
          onClick={() =>
            setFocusMode((prev) => (prev === "ambient" ? "bright" : "ambient"))
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-neutral-400 hover:text-white border border-white/10 hover:border-white/25 backdrop-blur-md text-[11px] font-semibold transition-all shadow-lg cursor-pointer"
          title="Hintergrund-Fokus umschalten"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {focusMode === "ambient" ? "Hintergrund: Dezent" : "Hintergrund: Scharf"}
          </span>
        </button>
      </div>
    </div>
  );
}
