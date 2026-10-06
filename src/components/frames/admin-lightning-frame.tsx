"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Zap } from "lucide-react";

interface AdminLightningFrameProps {
  avatarUrl: string;
  username: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  verified?: boolean;
  showBadges?: boolean;
  className?: string;
}

export function AdminLightningFrame({
  avatarUrl,
  username,
  size = "md",
  verified = false,
  showBadges = true,
  className,
}: AdminLightningFrameProps) {
  // Sizing maps
  const avatarSizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
    "2xl": "w-32 h-32 text-2xl",
  };

  const badgeSizeMap = {
    sm: "w-3.5 h-3.5 -bottom-1 -right-1 text-[8px]",
    md: "w-5 h-5 -bottom-1.5 -right-1.5 text-[10px]",
    lg: "w-6 h-6 -bottom-1 -right-1 text-xs",
    xl: "w-8 h-8 -bottom-1.5 -right-1.5 text-sm",
    "2xl": "w-9 h-9 -bottom-2 -right-2 text-base",
  };

  const adminChipSizeMap = {
    sm: "w-3.5 h-3.5 -top-1 -right-1 p-0.5",
    md: "w-4.5 h-4.5 -top-1.5 -right-1.5 p-0.5",
    lg: "w-6 h-6 -top-2 -right-2 p-1",
    xl: "w-7 h-7 -top-2 -right-2 p-1",
    "2xl": "w-8 h-8 -top-2.5 -right-2.5 p-1.5",
  };

  const zapIconSizeMap = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none group",
        className
      )}
    >
      {/* ==================================================================== */}
      {/* 1. OUTER ATMOSPHERIC ELECTRIC AURA & GLOW                            */}
      {/* ==================================================================== */}
      <div
        className="absolute inset-[-40%] rounded-full pointer-events-none -z-20 opacity-70 blur-xl animate-electric-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.45) 0%, rgba(2, 132, 199, 0.25) 50%, rgba(10, 25, 60, 0) 75%)",
        }}
      />

      {/* ==================================================================== */}
      {/* 2. ROTATING ELECTRIC PLASMA VORTEX (Outer Corona)                    */}
      {/* ==================================================================== */}
      <div
        className="absolute inset-[-18%] rounded-full pointer-events-none -z-10 animate-lightning-spin opacity-85 blur-[1px]"
        style={{
          background:
            "conic-gradient(from 0deg, #00f0ff 0%, #0369a1 25%, #ffffff 40%, #0284c7 60%, #38bdf8 80%, #00f0ff 100%)",
          maskImage: "radial-gradient(circle, transparent 52%, black 66%, transparent 74%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 52%, black 66%, transparent 74%)",
        }}
      />

      {/* Counter-rotating secondary plasma ring */}
      <div
        className="absolute inset-[-14%] rounded-full pointer-events-none -z-10 animate-lightning-spin-reverse opacity-75"
        style={{
          background:
            "conic-gradient(from 180deg, #38bdf8 0%, #0ea5e9 30%, #ffffff 50%, #0369a1 75%, #38bdf8 100%)",
          maskImage: "radial-gradient(circle, transparent 54%, black 68%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 54%, black 68%, transparent 72%)",
        }}
      />

      {/* ==================================================================== */}
      {/* 3. RADIAL MANGA ELECTRIC SPEED-LINES / JAGGED ENERGY SPIKES          */}
      {/* ==================================================================== */}
      <svg
        className="absolute inset-[-30%] w-[160%] h-[160%] pointer-events-none -z-10 animate-lightning-spin-fast opacity-60"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Radiating comic electric rays */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
          <line
            key={idx}
            x1="50"
            y1="50"
            x2={50 + 44 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 44 * Math.sin((angle * Math.PI) / 180)}
            stroke={idx % 2 === 0 ? "#00f0ff" : "#ffffff"}
            strokeWidth={idx % 3 === 0 ? "1.4" : "0.7"}
            strokeDasharray="4 16"
            strokeLinecap="round"
            opacity={0.7}
          />
        ))}
      </svg>

      {/* ==================================================================== */}
      {/* 4. CONTINUOUS CRACKLING ELECTRIC ARCS AROUND PERIMETER               */}
      {/* ==================================================================== */}
      <svg
        className="absolute inset-[-12%] w-[124%] h-[124%] pointer-events-none z-10 animate-lightning-crackle"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#00f0ff"
          strokeWidth="1.2"
          strokeDasharray="6 14 2 10 12 18"
          strokeLinecap="round"
          className="filter drop-shadow-[0_0_5px_#00f0ff]"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeDasharray="3 22 5 18"
          strokeLinecap="round"
        />
      </svg>

      {/* ==================================================================== */}
      {/* 5. REGULAR INWARD LIGHTNING STRIKES (Dramatic Intermittent Arcs)      */}
      {/* Strikes from outside into the center avatar image                     */}
      {/* ==================================================================== */}
      <svg
        className="absolute inset-[-20%] w-[140%] h-[140%] pointer-events-none z-20 animate-lightning-strike"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Glow filter definition */}
        <defs>
          <filter id="electric-bolt-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Primary Bolt 1: From Top-Left plunging directly into center */}
        <path
          d="M 12 10 L 28 26 L 24 32 L 38 42 L 34 46 L 50 50"
          stroke="#00f0ff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="miter"
          filter="url(#electric-bolt-glow)"
        />
        <path
          d="M 12 10 L 28 26 L 24 32 L 38 42 L 34 46 L 50 50"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="miter"
        />
        {/* Secondary branch off Bolt 1 */}
        <path
          d="M 28 26 L 36 22 L 44 32 L 42 36 L 52 48"
          stroke="#38bdf8"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* Primary Bolt 2: From Bottom-Right tearing up into center */}
        <path
          d="M 90 92 L 74 76 L 78 70 L 64 60 L 67 55 L 50 50"
          stroke="#00f0ff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="miter"
          filter="url(#electric-bolt-glow)"
        />
        <path
          d="M 90 92 L 74 76 L 78 70 L 64 60 L 67 55 L 50 50"
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="miter"
        />
        {/* Secondary branch off Bolt 2 */}
        <path
          d="M 74 76 L 68 82 L 58 74 L 52 52"
          stroke="#67e8f9"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        {/* Primary Bolt 3: From Top-Right striking inward */}
        <path
          d="M 88 12 L 72 28 L 75 34 L 62 44 L 50 50"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="miter"
          filter="url(#electric-bolt-glow)"
        />
        <path
          d="M 88 12 L 72 28 L 75 34 L 62 44 L 50 50"
          stroke="#ffffff"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        {/* Primary Bolt 4: From Bottom-Left arcing inward */}
        <path
          d="M 14 86 L 30 72 L 27 66 L 42 56 L 50 50"
          stroke="#00f0ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="miter"
          filter="url(#electric-bolt-glow)"
        />
        <path
          d="M 14 86 L 30 72 L 27 66 L 42 56 L 50 50"
          stroke="#ffffff"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        {/* Center Impact Spark Burst */}
        <circle cx="50" cy="50" r="3.5" fill="#ffffff" filter="url(#electric-bolt-glow)" />
        <circle cx="50" cy="50" r="6" stroke="#00f0ff" strokeWidth="1" opacity="0.8" />
      </svg>

      {/* ==================================================================== */}
      {/* 6. MAIN AVATAR CONTAINER & BORDER FRAME                              */}
      {/* ==================================================================== */}
      <div
        className={cn(
          "rounded-full p-[2.5px] transition-all duration-300 relative",
          "bg-gradient-to-tr from-cyan-400 via-sky-200 to-blue-500",
          "shadow-[0_0_18px_rgba(0,240,255,0.85),0_0_35px_rgba(2,132,199,0.55)]"
        )}
      >
        {/* Core circle that clips the avatar image */}
        <div
          className={cn(
            "rounded-full overflow-hidden bg-[#070b14] flex items-center justify-center relative",
            "border-2 border-cyan-300/90",
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
            <span className="font-black text-cyan-200 tracking-wider">
              {username.slice(0, 2).toUpperCase()}
            </span>
          )}

          {/* ================================================================ */}
          {/* 7. AVATAR IMPACT FLASH & SHOCKWAVE                               */}
          {/* Regular lightning discharge illuminating the avatar image        */}
          {/* ================================================================ */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300/80 via-white/95 to-sky-200/90 mix-blend-screen pointer-events-none z-10 animate-avatar-flash" />

          {/* Expanding electric shockwave ripple across the photo */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-200 shadow-[0_0_15px_#00f0ff] pointer-events-none z-10 animate-electric-shockwave" />

          {/* Subtle electric vignette overlay */}
          <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-cyan-500/10 to-blue-950/40 mix-blend-overlay" />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 8. VERIFIED BADGE (Bottom Right)                                     */}
      {/* ==================================================================== */}
      {showBadges && verified && (
        <div
          title="Verifizierter Benutzer (Mind. 3 erfolgreiche Deals)"
          className={cn(
            "absolute rounded-full flex items-center justify-center bg-blue-600 text-white border-2 border-[#090b10] shadow-md shadow-blue-500/60 z-30 animate-bounce",
            badgeSizeMap[size]
          )}
          style={{ animationDuration: "3s" }}
        >
          <ShieldCheck className="w-full h-full p-0.5" />
        </div>
      )}

      {/* ==================================================================== */}
      {/* 9. EXCLUSIVE ADMIN BADGE (Top Right with Electric Zap)               */}
      {/* ==================================================================== */}
      {showBadges && (
        <div
          title="Administrator ⚡ (Höchste Berechtigung)"
          className={cn(
            "absolute rounded-full flex items-center justify-center z-30",
            "bg-[#070e24] text-cyan-300 border border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.85)]",
            "transition-transform duration-200 group-hover:scale-110",
            adminChipSizeMap[size]
          )}
        >
          <Zap
            className={cn(
              "text-cyan-300 fill-cyan-400 drop-shadow-[0_0_6px_#00f0ff] animate-pulse",
              zapIconSizeMap[size]
            )}
          />
        </div>
      )}
    </div>
  );
}
