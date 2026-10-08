"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Scissors, Zap, Lock } from "lucide-react";

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
}: BoosterPackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: "w-[160px] h-[240px]",
    md: "w-[220px] h-[330px]",
    lg: "w-[280px] h-[420px]",
    hero: "w-[300px] h-[450px] sm:w-[340px] sm:h-[510px] md:w-[380px] md:h-[570px]",
  }[size];

  // Calculate tear rotation and displacement from tearProgress
  const tearAngle = Math.min(28, (tearProgress / 100) * 28);
  const tearOffsetX = (tearProgress / 100) * 20;
  const tearOffsetY = (tearProgress / 100) * 24;

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
            ? "bg-gradient-to-tr from-orange-500/50 via-amber-500/30 to-cyan-500/50 scale-105"
            : "bg-gradient-to-tr from-orange-600/30 via-transparent to-cyan-600/30"
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
          "relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(249,115,22,0.25)] border border-amber-500/40",
          "bg-gradient-to-b from-[#181d2a] via-[#0d111a] to-[#07090e]"
        )}
      >
        {/* ================= BACKGROUND CARDS PEEKING OUT WHEN TORN ================= */}
        {(isTearing || isRipped) && (
          <div className="absolute inset-x-4 top-4 h-32 rounded-xl overflow-hidden shadow-2xl z-0 opacity-90 transition-opacity">
            <img
              src="/manaforge-card-back.jpg"
              alt="Karten im Booster"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        {/* ================= WHOLE PACK (WHEN NOT TORN) ================= */}
        {!isTearing && !isRipped && (
          <div className="relative w-full h-full">
            <img
              src="/manaforge-booster.jpg"
              alt="Manaforge Premium Booster Pack"
              className={cn(
                "w-full h-full object-cover object-center pointer-events-none transition-transform duration-500",
                isHovered && "scale-[1.02]"
              )}
            />

            {/* Dynamic Holographic Foil Glare Overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
              style={{
                opacity: isHovered ? 0.8 : 0.4,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.9) 0%, rgba(34,211,238,0.45) 25%, rgba(249,115,22,0.35) 50%, transparent 75%)`,
              }}
            />

            {/* Metallic Rainbow Reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay opacity-50"
              style={{
                background: `linear-gradient(${
                  115 + (rotateY * 3)
                }deg, transparent 20%, rgba(255, 0, 128, 0.4) 40%, rgba(0, 240, 255, 0.5) 50%, rgba(255, 215, 0, 0.4) 60%, transparent 80%)`,
              }}
            />
          </div>
        )}

        {/* ================= SPLIT PACK (DURING TEAR & RIPPED) ================= */}
        {(isTearing || isRipped) && (
          <>
            {/* 1. BOTTOM BODY (Below 16.5% tear line) */}
            <div
              className="absolute inset-0 z-10"
              style={{
                clipPath: "polygon(0% 16.5%, 100% 16.5%, 100% 100%, 0% 100%)",
              }}
            >
              <img
                src="/manaforge-booster.jpg"
                alt="Manaforge Booster Korpus"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-50"
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(34,211,238,0.4) 30%, transparent 70%)`,
                }}
              />
            </div>

            {/* 2. TOP CAP (Above 16.5% tear line - Peels and rips off) */}
            <div
              className={cn(
                "absolute inset-0 z-20 pointer-events-none origin-bottom-right transition-all",
                isRipped
                  ? "opacity-0 -translate-y-28 rotate-45 scale-90 duration-500 ease-out"
                  : "duration-75 ease-out"
              )}
              style={
                isTearing
                  ? {
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 16.5%, 0% 16.5%)",
                      transform: `rotate(${tearAngle}deg) translate(${tearOffsetX}px, -${tearOffsetY}px)`,
                    }
                  : isRipped
                  ? undefined
                  : { clipPath: "polygon(0% 0%, 100% 0%, 100% 16.5%, 0% 16.5%)" }
              }
            >
              <img
                src="/manaforge-booster.jpg"
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

            {/* 3. GLOWING TEAR RIFT (Along tear line) */}
            {isTearing && (
              <div
                className="absolute inset-x-2 z-30 pointer-events-none flex items-center"
                style={{
                  top: "16%",
                  transform: `translateY(-${tearOffsetY * 0.4}px)`,
                }}
              >
                <div className="w-full h-1.5 bg-gradient-to-r from-amber-300 via-cyan-400 to-amber-300 shadow-[0_0_20px_rgba(6,182,212,1),0_0_10px_rgba(245,158,11,1)] rounded-full animate-pulse" />
              </div>
            )}
          </>
        )}

        {/* Tear Line Guide Highlight (Top ~16% of pack) */}
        {showRipGuide && !isRipped && (
          <div
            className={cn(
              "absolute inset-x-2 sm:inset-x-3 z-30 transition-all duration-300 pointer-events-none",
              isTearing ? "opacity-0" : "opacity-100"
            )}
            style={{ top: "15.8%" }}
          >
            {/* Dashed Tear Line */}
            <div className="relative flex items-center">
              <div
                className={cn(
                  "w-full h-0.5 border-t-2 border-dashed transition-colors duration-300",
                  isHovered || tearProgress > 0
                    ? "border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                    : "border-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                )}
              />

              {/* Glowing Tear Progress Bar */}
              {tearProgress > 0 && (
                <div
                  className="absolute left-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-400 shadow-[0_0_14px_rgba(249,115,22,1)]"
                  style={{ width: `${tearProgress}%` }}
                />
              )}
            </div>

            {/* Tear Here Label & Indicator */}
            <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase mt-1 px-1 text-white">
              <div className="flex items-center gap-1 text-cyan-300 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                <Scissors className="w-3.5 h-3.5 rotate-90" />
                <span>Hier Aufreißen</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                <span>Wischen</span>
                <Zap className="w-3 h-3 fill-amber-300" />
              </div>
            </div>
          </div>
        )}

        {/* Shimmer Border Beam */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />

        {/* Holo-Foil Badge */}
        {interactive && !isRipped && !isLocked && (
          <div className="absolute bottom-6 right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow-lg pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
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
