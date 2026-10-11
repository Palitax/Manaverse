"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminMoltenFrameProps {
  avatarUrl: string;
  username: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  verified?: boolean;
  showBadges?: boolean;
  className?: string;
}

export function AdminMoltenFrame({
  avatarUrl,
  username,
  size = "md",
  verified = false,
  showBadges = true,
  className,
}: AdminMoltenFrameProps) {
  // Avatar inner size
  const avatarSizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
    "2xl": "w-32 h-32 text-2xl",
  };

  // Frame border thickness matching avatar proportion
  const framePaddingMap = {
    sm: "p-[3px]",
    md: "p-[4px]",
    lg: "p-[5.5px]",
    xl: "p-[7px]",
    "2xl": "p-[8.5px]",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none group",
        className
      )}
    >
      {/* ==================================================================== */}
      {/* 1. OUTER DEEP ATMOSPHERIC MAGMA HEAT AURA                            */}
      {/* Radiates deep red-orange thermal glow into dark surroundings         */}
      {/* ==================================================================== */}
      <div
        className="absolute inset-[-45%] rounded-full pointer-events-none -z-30 opacity-80 blur-xl animate-molten-heat-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 68, 0, 0.58) 0%, rgba(210, 30, 0, 0.35) 45%, rgba(60, 8, 0, 0.18) 68%, transparent 80%)",
        }}
      />

      {/* ==================================================================== */}
      {/* 2. ROTATING FLAME CORONA (Outer Fire Vortex)                         */}
      {/* ==================================================================== */}
      <div
        className="absolute inset-[-24%] rounded-full pointer-events-none -z-20 animate-molten-spin opacity-90 blur-[1.2px]"
        style={{
          background:
            "conic-gradient(from 0deg, #ff1a00 0%, #ff5500 16%, #ffd200 30%, #ff2600 46%, #1c0301 62%, #ff7700 80%, #ff1a00 100%)",
          maskImage:
            "radial-gradient(circle, transparent 48%, black 64%, transparent 76%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 48%, black 64%, transparent 76%)",
        }}
      />

      {/* Counter-rotating secondary magma plasma ring */}
      <div
        className="absolute inset-[-18%] rounded-full pointer-events-none -z-20 animate-molten-spin-reverse opacity-85"
        style={{
          background:
            "conic-gradient(from 180deg, #ff3b00 0%, #ffa200 20%, #fff4b8 36%, #ff1a00 54%, #120200 68%, #ff5500 86%, #ff3b00 100%)",
          maskImage:
            "radial-gradient(circle, transparent 52%, black 66%, transparent 74%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 52%, black 66%, transparent 74%)",
        }}
      />

      {/* ==================================================================== */}
      {/* 3. FLOATING RISING EMBERS & SPARKS                                   */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
        <div className="absolute top-[6%] left-[16%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#ff9900] animate-ember-1" />
        <div className="absolute top-[10%] right-[14%] w-1 h-1 rounded-full bg-yellow-200 shadow-[0_0_6px_#ff6600] animate-ember-2" />
        <div className="absolute top-[-4%] left-[46%] w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#ff3300] animate-ember-3" />
        <div className="absolute top-[42%] left-[-6%] w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_6px_#ff5500] animate-ember-4" />
      </div>

      {/* ==================================================================== */}
      {/* 4. THE MOLTEN LAVA & OBSIDIAN FRAME RING                             */}
      {/* Rich volcanic rock structure with burning magma fissures and glossy  */}
      {/* 3D liquid highlight (matching the reference image)                   */}
      {/* ==================================================================== */}
      <div
        className={cn(
          "rounded-full relative transition-all duration-300 overflow-hidden",
          framePaddingMap[size],
          "animate-molten-rim-pulse",
          "shadow-[0_0_18px_rgba(255,68,0,0.9),0_0_36px_rgba(200,20,0,0.5),inset_0_0_6px_rgba(255,200,60,0.6)]"
        )}
      >
        {/* Layer A: Base Volcanic Magma Bed (Deep fiery foundation) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #ffd000 0%, #ff5500 25%, #c41800 50%, #1a0301 80%)",
          }}
        />

        {/* Layer B: Swirling Molten Lava Streams & Dark Obsidian Chunks */}
        <div
          className="absolute inset-0 rounded-full animate-molten-spin-slow opacity-95"
          style={{
            background:
              "conic-gradient(from 0deg, #ff1a00 0%, #100201 15%, #ff6600 28%, #fff099 38%, #140201 50%, #ff3b00 68%, #ffd200 80%, #0d0100 92%, #ff1a00 100%)",
          }}
        />

        {/* Layer C: Counter-swirling incandescent core flow */}
        <div
          className="absolute inset-0 rounded-full animate-molten-spin-reverse opacity-75 mix-blend-color-dodge"
          style={{
            background:
              "conic-gradient(from 180deg, #ff4500 0%, #fff 22%, #ff1100 45%, #000 65%, #ffaa00 85%, #ff4500 100%)",
          }}
        />

        {/* Layer D: Glowing Magma Veins & Basalt Fissure Overlay (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none animate-molten-lava-flicker"
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <filter id="lava-crack-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 3D Liquid Specular Sheen Gradient */}
            <linearGradient id="liquid-gloss-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ffd54f" stopOpacity="0.35" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Curved glowing fissures running through the ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke="#ff3b00"
            strokeWidth="1.6"
            strokeDasharray="18 10 24 8 14 12"
            strokeLinecap="round"
            filter="url(#lava-crack-glow)"
          />
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke="#ffea78"
            strokeWidth="0.8"
            strokeDasharray="10 22 18 14"
            strokeLinecap="round"
          />

          {/* Obsidian crack branches */}
          <path
            d="M 22 30 Q 15 48 24 66"
            stroke="#160301"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 78 32 Q 86 50 77 68"
            stroke="#160301"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Intense bubbling magma nodules */}
          <circle cx="28" cy="22" r="2.5" fill="#ffd000" filter="url(#lava-crack-glow)" />
          <circle cx="80" cy="40" r="2.2" fill="#ffe066" filter="url(#lava-crack-glow)" />
          <circle cx="60" cy="88" r="2.8" fill="#ffd700" filter="url(#lava-crack-glow)" />
          <circle cx="16" cy="54" r="2" fill="#ff7700" filter="url(#lava-crack-glow)" />
        </svg>

        {/* Layer E: 3D Glossy Liquid Sheen (The curved glass/resin reflection from the image) */}
        <div
          className="absolute inset-x-1 top-0 h-[48%] rounded-t-full pointer-events-none opacity-75"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 215, 0, 0.3) 40%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at 50% 10%, black 50%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 10%, black 50%, transparent 70%)",
          }}
        />

        {/* ================================================================== */}
        {/* 5. AVATAR CONTAINER & INNER CRATER RIM                             */}
        {/* ================================================================== */}
        <div
          className={cn(
            "rounded-full overflow-hidden bg-[#0c0402] flex items-center justify-center relative z-10",
            "border-2 border-orange-500/90 shadow-[inset_0_0_14px_rgba(255,45,0,0.7)]",
            avatarSizeMap[size]
          )}
        >
          {/* Avatar Image or Initials */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="font-black text-amber-200 tracking-wider">
              {username.slice(0, 2).toUpperCase()}
            </span>
          )}

          {/* Avatar Inner Molten Illumination & Heat Wave */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600/35 via-orange-400/25 to-amber-300/30 mix-blend-screen pointer-events-none z-10 animate-molten-avatar-glow" />

          {/* Volcanic Ambient Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-orange-950/20 to-black/55 mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
}
