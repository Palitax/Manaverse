"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Scissors, Zap, Lock, ChevronRight } from "lucide-react";

interface BoosterPackCardProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showRipGuide?: boolean;
  isRipped?: boolean;
  tearProgress?: number; // 0 to 100
  onClick?: () => void;
  interactive?: boolean;
  isLocked?: boolean;
  lockedCountdown?: string;
  isDragging?: boolean;
  enableTearInteraction?: boolean;
  onTearPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTearPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTearPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTearPointerCancel?: (e: React.PointerEvent<HTMLDivElement>) => void;
  tearTrackRef?: React.RefObject<HTMLDivElement | null>;
}

export function BoosterPackCard({
  className,
  size = "md",
  showRipGuide = false,
  isRipped = false,
  tearProgress = 0,
  onClick,
  interactive = true,
  isLocked = false,
  lockedCountdown,
  isDragging = false,
  enableTearInteraction = false,
  onTearPointerDown,
  onTearPointerMove,
  onTearPointerUp,
  onTearPointerCancel,
  tearTrackRef,
}: BoosterPackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive || isDragging) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  const handleMouseEnter = () => {
    if (interactive && !isDragging) {
      setIsHovered(true);
    }
  };

  // Dimensions based on size, matching the booster aspect ratio
  const sizeClasses = {
    sm: "w-[160px] h-[260px]",
    md: "w-[220px] h-[360px]",
    lg: "w-[280px] h-[460px]",
    hero: "w-[285px] h-[465px] sm:w-[330px] sm:h-[540px] md:w-[360px] md:h-[590px]",
  }[size];

  // Calculate tear rotation and displacement from tearProgress (peels slightly during drag)
  const tearAngle = Math.min(22, (tearProgress / 100) * 22);
  const tearOffsetX = (tearProgress / 100) * 18;
  const tearOffsetY = (tearProgress / 100) * 16;

  const isTearing = tearProgress > 0 && !isRipped;

  return (
    <div
      className={cn(
        "relative perspective-1000 select-none",
        sizeClasses,
        interactive && "cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      {/* Outer ambient glow */}
      <div
        className={cn(
          "absolute -inset-4 rounded-3xl transition-all duration-500 pointer-events-none blur-2xl opacity-60",
          isHovered
            ? "bg-gradient-to-tr from-cyan-500/50 via-amber-500/30 to-orange-500/50 scale-105"
            : "bg-gradient-to-tr from-cyan-600/30 via-transparent to-amber-600/30"
        )}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
          }`,
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className={cn(
          "relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.25)] border border-cyan-500/30",
          "bg-gradient-to-b from-[#181d2a] via-[#0d111a] to-[#07090e]"
        )}
      >
        {/* ================= BACKGROUND CARDS PEEKING OUT WHEN TORN ================= */}
        {(isTearing || isRipped) && (
          <div className="absolute inset-x-3.5 top-2.5 h-36 rounded-xl overflow-hidden shadow-2xl z-0 transition-opacity">
            <img
              src="/manaforge-card-back.jpg"
              alt="Karten im Booster"
              className="w-full h-full object-cover object-top"
            />
            {/* Mystical glow shining inside open pack mouth */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/30 via-transparent to-black/70 pointer-events-none" />
          </div>
        )}

        {/* ================= WHOLE PACK (WHEN NOT TORN) ================= */}
        {!isTearing && !isRipped && (
          <div className="relative w-full h-full">
            <img
              src="/manaforge-booster.png"
              alt="Manaforge Magier Booster Pack"
              className={cn(
                "w-full h-full object-cover object-center pointer-events-none transition-transform duration-500",
                isHovered && "scale-[1.01]"
              )}
            />

            {/* Dynamic Holographic Foil Glare Overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
              style={{
                opacity: isHovered ? 0.75 : 0.35,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.9) 0%, rgba(34,211,238,0.45) 25%, rgba(249,115,22,0.3) 50%, transparent 75%)`,
              }}
            />

            {/* Metallic Rainbow Reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay opacity-40"
              style={{
                background: `linear-gradient(${
                  115 + rotateY * 3
                }deg, transparent 20%, rgba(255, 0, 128, 0.35) 40%, rgba(0, 240, 255, 0.45) 50%, rgba(255, 215, 0, 0.35) 60%, transparent 80%)`,
              }}
            />
          </div>
        )}

        {/* ================= SPLIT PACK (DURING TEAR & RIPPED) ================= */}
        {(isTearing || isRipped) && (
          <>
            {/* 1. BOTTOM BODY (Below 10.5% tear line - keeps MANAFORGE logo & wizard intact) */}
            <div
              className="absolute inset-0 z-10"
              style={{
                clipPath: "polygon(0% 10.5%, 100% 10.5%, 100% 100%, 0% 100%)",
              }}
            >
              <img
                src="/manaforge-booster.png"
                alt="Manaforge Booster Korpus"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-40"
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(34,211,238,0.4) 30%, transparent 70%)`,
                }}
              />
            </div>

            {/* 2. TOP CAP (Above 10.5% tear line - Peels and flies off Pokémon Pocket style!) */}
            <div
              className={cn(
                "absolute inset-0 z-20 pointer-events-none origin-bottom-right transition-all",
                isRipped
                  ? "duration-700 ease-out"
                  : "duration-75 ease-out"
              )}
              style={
                isTearing
                  ? {
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 10.5%, 0% 10.5%)",
                      transform: `rotate(${tearAngle}deg) translate(${tearOffsetX}px, -${tearOffsetY}px)`,
                      transformOrigin: "bottom right",
                    }
                  : isRipped
                  ? {
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 10.5%, 0% 10.5%)",
                      transform: "translate(75px, -280px) rotate(34deg) scale(1.15)",
                      opacity: 0,
                      transition: "transform 0.65s cubic-bezier(0.12, 0.8, 0.32, 1.2), opacity 0.5s ease-out",
                    }
                  : { clipPath: "polygon(0% 0%, 100% 0%, 100% 10.5%, 0% 10.5%)" }
              }
            >
              <img
                src="/manaforge-booster.png"
                alt="Manaforge Booster Deckel"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-60"
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.9) 0%, rgba(249,115,22,0.4) 40%, transparent 75%)`,
                }}
              />
            </div>

            {/* 3. MOMENTARY LASER FLASH ON RIP */}
            {isRipped && (
              <div
                className="absolute inset-x-0 z-30 pointer-events-none flex items-center justify-center -translate-y-1/2"
                style={{ top: "10.5%" }}
              >
                <div className="w-[140%] h-4 bg-gradient-to-r from-transparent via-white to-transparent blur-[2px] animate-rip-flash" />
                <div className="absolute w-full h-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-md animate-rip-flash" />
                <div className="absolute w-24 h-24 rounded-full bg-amber-400/80 blur-xl animate-ping" />
              </div>
            )}
          </>
        )}

        {/* ================= POKÉMON POCKET STYLE TEAR SEAM & SWIPE CUE ================= */}
        {showRipGuide && !isRipped && (
          <div
            className="absolute inset-x-0 z-30 pointer-events-none transition-opacity duration-300"
            style={{ top: "10.5%" }}
          >
            {/* The Perforated Luminous Tear Seam */}
            <div className="relative -translate-y-1/2 flex items-center px-1">
              {/* Contrast Underlay Band */}
              <div className="absolute inset-x-0 h-4 -top-2 bg-black/60 backdrop-blur-[2px]" />

              {/* Glowing Dashed Perforation Line */}
              <div
                className={cn(
                  "w-full h-0 border-t-2 border-dashed transition-all duration-300 relative z-10",
                  isHovered || isDragging || tearProgress > 0
                    ? "border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,1)]"
                    : "border-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                )}
              />

              {/* Continuous Neon Energy Flow Wave Along Seam */}
              <div className="absolute inset-x-0 h-1.5 -top-[3px] animate-seam-energy opacity-90 pointer-events-none z-10" />

              {/* Edge Tear Notches */}
              <div className="absolute left-0 -top-1.5 w-3 h-3 bg-cyan-400 rotate-45 -translate-x-1.5 shadow-[0_0_8px_rgba(6,182,212,1)] z-10" />
              <div className="absolute right-0 -top-1.5 w-3 h-3 bg-amber-400 rotate-45 translate-x-1.5 shadow-[0_0_8px_rgba(245,158,11,1)] z-10" />

              {/* Active Cut Progress & Spark (During dragging) */}
              {tearProgress > 0 && (
                <>
                  <div
                    className="absolute left-0 -top-1 h-2 bg-gradient-to-r from-amber-400 via-cyan-400 to-white shadow-[0_0_16px_rgba(6,182,212,1),0_0_24px_rgba(245,158,11,1)] rounded-full z-20"
                    style={{ width: `${tearProgress}%` }}
                  />
                  {/* Dynamic Cutting Spark Orb */}
                  <div
                    className="absolute -top-3.5 z-30 -translate-x-1/2 flex items-center justify-center pointer-events-none"
                    style={{ left: `${tearProgress}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_35px_rgba(6,182,212,1),0_0_50px_rgba(245,158,11,1)] flex items-center justify-center animate-spark-sparkle">
                      <Zap className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
                    </div>
                  </div>
                </>
              )}

              {/* Looping Swipe Cue Animation (When idle / waiting for user swipe) */}
              {!isDragging && tearProgress === 0 && (
                <>
                  {/* Gliding Touch Beacon with Trailing Comet Beam */}
                  <div className="absolute top-1/2 -translate-y-1/2 z-20 animate-swipe-glide pointer-events-none">
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-24 h-2 bg-gradient-to-r from-transparent via-cyan-400/80 to-white blur-[1px]" />
                    <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-white to-amber-300 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_35px_rgba(6,182,212,1),0_0_45px_rgba(245,158,11,0.9)] flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-cyan-950 stroke-[3]" />
                    </div>
                  </div>

                  {/* Floating Hint Badge above Seam */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-30 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-swipe-text">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white whitespace-nowrap">
                      Hier wischen
                    </span>
                    <ChevronRight className="w-3 h-3 text-cyan-300 stroke-[3] shrink-0" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= INVISIBLE SEAM GESTURE CAPTURE LAYER ================= */}
        {enableTearInteraction && !isRipped && (
          <div
            ref={tearTrackRef}
            onPointerDown={onTearPointerDown}
            onPointerMove={onTearPointerMove}
            onPointerUp={onTearPointerUp}
            onPointerCancel={onTearPointerCancel}
            className="absolute inset-x-0 h-20 -translate-y-1/2 z-40 cursor-grab active:cursor-grabbing touch-none select-none"
            style={{ top: "10.5%" }}
            title="Wische hier entlang zum Aufreißen!"
            aria-label="Booster Naht Wischbereich"
            role="slider"
            aria-valuenow={tearProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
          />
        )}

        {/* Shimmer Border Beam */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />

        {/* Holo-Foil Badge */}
        {interactive && !isRipped && !isLocked && (
          <div className="absolute bottom-5 right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-cyan-500/40 text-[10px] font-bold text-cyan-300 shadow-lg pointer-events-none">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Holo-Foil</span>
          </div>
        )}

        {/* Locked Cooldown Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 shadow-lg shadow-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              Booster gesperrt
            </span>
            {lockedCountdown && (
              <span className="text-xs text-neutral-300 font-bold mt-1">
                Verfügbar in: <b className="text-white">{lockedCountdown}</b>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
