"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  BACKGROUND_SLABS_ROW_1,
  BACKGROUND_SLABS_ROW_2,
  BACKGROUND_SLABS_ROW_3,
  BACKGROUND_SLABS_ROW_4,
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

// Helper creating a mathematically seamless repetition block.
// 24 items (4 sets of 6 cards) ensures LCM(6 cards, 4 tilts) = 12 divides evenly into 24,
// guaranteeing 100% continuous, zero-jump loop resets and coverage beyond 5K screens.
function createSeamlessTrack(cards: BackgroundSlab[]) {
  const result: BackgroundSlab[] = [];
  for (let i = 0; i < 4; i++) {
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
        "relative w-full overflow-hidden flex items-center py-1 sm:py-2 select-none pointer-events-none",
        className
      )}
    >
      {/* Track 1 */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-4 sm:gap-8 pr-4 sm:pr-8",
          animationClass
        )}
        style={{
          animationDuration: duration,
          animationPlayState: isPaused ? "paused" : "running",
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

      {/* Track 2 (Pixel-identical twin for mathematically seamless infinite loop) */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-4 sm:gap-8 pr-4 sm:pr-8",
          animationClass
        )}
        style={{
          animationDuration: duration,
          animationPlayState: isPaused ? "paused" : "running",
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
  const [isPaused, setIsPaused] = useState(false);
  const [focusMode, setFocusMode] = useState<"ambient" | "bright">("ambient");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playbackRate = 0.85;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {
            // Low-power fallback; poster image displays seamlessly
            setIsVideoLoaded(false);
          });
      }
    }

    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsPaused(true);
      if (video) video.pause();
      return;
    }

    // Battery & CPU optimization: pause when tab is inactive, resume when active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        if (video) video.pause();
      } else if (!prefersReducedMotion) {
        setIsPaused(false);
        if (video) video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* ==================================================================== */}
      {/* 1. FIXED BACKGROUND SCENE (-Z-10)                                    */}
      {/* ==================================================================== */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#07090e]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080e] via-[#080d19] to-[#05070c]" />

        {/* Ambient fluid video loop */}
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

        {/* Subtle radial ambient nebulas for rich depth */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-600/[0.07] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-purple-600/[0.08] blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-amber-600/[0.07] blur-[130px] pointer-events-none" />

        {/* Multi-Row 3D Slab Marquee Bands */}
        <div className="absolute inset-x-0 -top-4 -bottom-4 flex flex-col justify-between overflow-hidden opacity-95">
          {/* ROW 1: Direction Left -> Right (Slow Motion 90s) */}
          <MarqueeRow
            rowId="r1"
            cards={BACKGROUND_SLABS_ROW_1}
            direction="right"
            duration="90s"
            tiltOffset={0}
            isPaused={isPaused}
          />

          {/* ROW 2: Direction Right -> Left (Slow Motion 110s) */}
          <MarqueeRow
            rowId="r2"
            cards={BACKGROUND_SLABS_ROW_2}
            direction="left"
            duration="110s"
            tiltOffset={1}
            isPaused={isPaused}
          />

          {/* ROW 3: Direction Left -> Right (Slow Motion 80s) */}
          <MarqueeRow
            rowId="r3"
            cards={BACKGROUND_SLABS_ROW_3}
            direction="right"
            duration="80s"
            tiltOffset={2}
            isPaused={isPaused}
          />

          {/* ROW 4: Direction Right -> Left (Slow Motion 100s - Desktop for spacious breathing room) */}
          <MarqueeRow
            rowId="r4"
            cards={BACKGROUND_SLABS_ROW_4}
            direction="left"
            duration="100s"
            tiltOffset={3}
            isPaused={isPaused}
            className="hidden sm:flex"
          />
        </div>

        {/* Top and Bottom gradient shadows for smooth fading under header & footer */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#07090e] via-[#07090e]/85 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#07090e] via-[#07090e]/85 to-transparent pointer-events-none" />

        {/* Atmospheric center scrim overlay for perfect contrast with foreground typography */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700 pointer-events-none",
            focusMode === "ambient"
              ? "bg-[#07090e]/40"
              : "bg-[#07090e]/15"
          )}
        />

        {/* Radial spotlight focusing onto center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(7,9,14,0.65)_95%)] pointer-events-none" />
      </div>

      {/* ==================================================================== */}
      {/* 2. DISKRETER AMBIENCE TOGGLE (DESKTOP + MOBILE EXTRALOCKE)           */}
      {/* Placed outside -z-10 for unconstrained stacking context & tap events */}
      {/* ==================================================================== */}
      {/* Desktop Ambience Button */}
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

      {/* Mobile Ambience Button (Extralocke: mind. 44x44px Touch-Target, sicher über Mobile Island Bar) */}
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
