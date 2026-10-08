"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Scissors, Zap } from "lucide-react";

interface BoosterPackCardProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showRipGuide?: boolean;
  isRipped?: boolean;
  tearProgress?: number; // 0 to 100
  onClick?: () => void;
  interactive?: boolean;
}

export function BoosterPackCard({
  className,
  size = "md",
  showRipGuide = false,
  isRipped = false,
  tearProgress = 0,
  onClick,
  interactive = true,
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
  const tearAngle = Math.min(25, (tearProgress / 100) * 25);
  const tearGapY = Math.min(20, (tearProgress / 100) * 20);

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
          "relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.25)] border border-amber-500/30",
          "bg-gradient-to-b from-[#181d2a] via-[#0d111a] to-[#07090e]"
        )}
      >
        {/* Top Serrated Crimped Foil Edge */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-6 z-20 transition-transform duration-300 origin-bottom-right pointer-events-none",
            isRipped && "opacity-0 -translate-y-12"
          )}
          style={
            tearProgress > 0 && !isRipped
              ? {
                  transform: `rotate(${tearAngle}deg) translateY(-${tearGapY}px)`,
                }
              : undefined
          }
        >
          {/* Top Crimping pattern */}
          <div className="w-full h-full bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-600 border-b border-white/40 shadow-md relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #fff 0, #fff 3px, #444 3px, #444 6px)",
              }}
            />
            {/* Prismatic Sheen on top crimp */}
            <div
              className="absolute inset-0 opacity-60 mix-blend-color-dodge pointer-events-none"
              style={{
                background: `linear-gradient(${glarePosition.x * 3.6}deg, rgba(255,0,128,0.4), rgba(0,255,255,0.4), rgba(255,215,0,0.4))`,
              }}
            />
          </div>
        </div>

        {/* Main Booster Pack Foil Artwork */}
        <div className="relative w-full h-full">
          <img
            src="/manaforge-booster.jpg"
            alt="Manaforge Premium Booster Pack"
            className={cn(
              "w-full h-full object-cover object-center pointer-events-none transition-transform duration-500",
              isHovered && "scale-[1.03]"
            )}
          />

          {/* Dynamic Holographic Foil Glare Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
            style={{
              opacity: isHovered ? 0.75 : 0.35,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.85) 0%, rgba(34,211,238,0.4) 25%, rgba(249,115,22,0.3) 50%, transparent 75%)`,
            }}
          />

          {/* Metallic Prismatic Rainbow Angle Reflection */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay opacity-50"
            style={{
              background: `linear-gradient(${
                115 + (rotateY * 3)
              }deg, transparent 20%, rgba(255, 0, 128, 0.4) 40%, rgba(0, 240, 255, 0.5) 50%, rgba(255, 215, 0, 0.4) 60%, transparent 80%)`,
            }}
          />

          {/* Tear Line Guide Highlight (Top ~18% of pack) */}
          <div
            className={cn(
              "absolute top-8 sm:top-10 inset-x-2 sm:inset-x-4 z-30 transition-all duration-300",
              isRipped ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            {/* Dashed Tear Line */}
            <div className="relative flex items-center">
              <div
                className={cn(
                  "w-full h-1 border-t-2 border-dashed transition-colors duration-300",
                  isHovered || tearProgress > 0
                    ? "border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    : "border-amber-400/80 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
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
            {showRipGuide && (
              <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase mt-1 px-1 text-white">
                <div className="flex items-center gap-1 text-cyan-300 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                  <Scissors className="w-3.5 h-3.5 rotate-90" />
                  <span>Hier Aufreißen</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                  <span>Swipe</span>
                  <Zap className="w-3 h-3 fill-amber-300" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Serrated Crimped Foil Edge */}
        <div className="absolute bottom-0 inset-x-0 h-6 z-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-neutral-300 via-neutral-400 to-neutral-600 border-t border-white/40 shadow-md relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #fff 0, #fff 3px, #444 3px, #444 6px)",
              }}
            />
            {/* Prismatic Sheen on bottom crimp */}
            <div
              className="absolute inset-0 opacity-60 mix-blend-color-dodge pointer-events-none"
              style={{
                background: `linear-gradient(${glarePosition.y * 3.6}deg, rgba(0,255,255,0.4), rgba(255,215,0,0.4), rgba(255,0,128,0.4))`,
              }}
            />
          </div>
        </div>

        {/* Shimmer Border Beam */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />

        {/* Sparkle icon badge for interactive preview */}
        {interactive && !isRipped && (
          <div className="absolute bottom-7 right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Digital Foil</span>
          </div>
        )}
      </div>
    </div>
  );
}
