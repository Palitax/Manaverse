"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Gem,
  Crown,
  Flame,
  Award,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerificationTierInfo {
  level: number;
  title: string;
  subtitle: string;
  badgeLabel: string;
  minDeals: number;
  nextTierDeals: number | null;
  glowColor: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  perks: string;
}

export function getVerificationTier(dealsCount: number): VerificationTierInfo {
  if (dealsCount >= 100) {
    return {
      level: 5,
      title: "Legendärer Titan",
      subtitle: "Höchste Verifizierungsstufe der Manaforge",
      badgeLabel: "Stufe 5 • Legende",
      minDeals: 100,
      nextTierDeals: null,
      glowColor: "shadow-[0_0_10px_rgba(168,85,247,0.35)]",
      borderColor: "border-purple-400/60",
      badgeBg: "bg-purple-950/40",
      textColor: "text-purple-300",
      perks: "100+ Deals gemeistert • Unanfechtbare Händler-Reputation",
    };
  }

  if (dealsCount >= 50) {
    return {
      level: 4,
      title: "Meister Trader",
      subtitle: "Exzellente Zuverlässigkeit & Handelselite",
      badgeLabel: "Stufe 4 • Meister",
      minDeals: 50,
      nextTierDeals: 100,
      glowColor: "shadow-[0_0_8px_rgba(244,63,94,0.3)]",
      borderColor: "border-rose-400/60",
      badgeBg: "bg-rose-950/40",
      textColor: "text-rose-300",
      perks: "50+ Deals erfolgreich • Priorisierter Treuhand-Status",
    };
  }

  if (dealsCount >= 25) {
    return {
      level: 3,
      title: "Goldener Elite Trader",
      subtitle: "Renommierter Top-Händler der Community",
      badgeLabel: "Stufe 3 • Elite",
      minDeals: 25,
      nextTierDeals: 50,
      glowColor: "shadow-[0_0_8px_rgba(245,158,11,0.3)]",
      borderColor: "border-amber-400/60",
      badgeBg: "bg-amber-950/40",
      textColor: "text-amber-300",
      perks: "25+ Deals • Höchste Vertrauensstufe im Marktplatz",
    };
  }

  if (dealsCount >= 10) {
    return {
      level: 2,
      title: "Veteran Trader",
      subtitle: "Erfahrener Stamm-Händler mit solider Historie",
      badgeLabel: "Stufe 2 • Veteran",
      minDeals: 10,
      nextTierDeals: 25,
      glowColor: "shadow-[0_0_8px_rgba(6,182,212,0.3)]",
      borderColor: "border-cyan-400/50",
      badgeBg: "bg-cyan-950/40",
      textColor: "text-cyan-300",
      perks: "10+ Deals • Verifizierter Händler mit hoher Aktivität",
    };
  }

  if (dealsCount >= 3) {
    return {
      level: 1,
      title: "Verifizierter Händler",
      subtitle: "Erfolgreich geprüfter TCG-Handelspartner",
      badgeLabel: "Stufe 1 • Verifiziert",
      minDeals: 3,
      nextTierDeals: 10,
      glowColor: "shadow-[0_0_6px_rgba(59,130,246,0.25)]",
      borderColor: "border-blue-400/50",
      badgeBg: "bg-blue-950/40",
      textColor: "text-blue-300",
      perks: "Mindestens 3 Deals verifiziert • Sicherer Handelspartner",
    };
  }

  return {
    level: 0,
    title: "Verifizierungs-Anwärter",
    subtitle: "Sammle 3 erfolgreiche Deals für den ersten Schild",
    badgeLabel: "Stufe 0 • Anwärter",
    minDeals: 0,
    nextTierDeals: 3,
    glowColor: "shadow-none",
    borderColor: "border-neutral-700",
    badgeBg: "bg-neutral-800/80",
    textColor: "text-neutral-400",
    perks: "Noch nicht verifiziert (ab 3 Deals)",
  };
}

interface VerificationShieldProps {
  dealsCount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLevelNumber?: boolean;
  textOnly?: boolean;
}

export function VerificationShield({
  dealsCount,
  size = "md",
  className,
  showLevelNumber = false,
  textOnly = false,
}: VerificationShieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = getVerificationTier(dealsCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute fixed floating tooltip coordinates relative to window viewport
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const popoverWidth = Math.min(320, window.innerWidth - 32);
      const popoverHeight = 240; // estimated popover height
      const spaceBelow = window.innerHeight - rect.bottom;
      const placeAbove = spaceBelow < popoverHeight && rect.top > popoverHeight;

      // Center horizontally on the trigger, but clamp to screen edges with 16px margin
      const desiredLeft = rect.left + rect.width / 2;
      const halfWidth = popoverWidth / 2;
      const minLeft = 16 + halfWidth;
      const maxLeft = window.innerWidth - 16 - halfWidth;
      const clampedLeft = Math.max(minLeft, Math.min(maxLeft, desiredLeft));

      setCoords({
        top: placeAbove ? rect.top - 8 : rect.bottom + 8,
        left: clampedLeft,
        placeAbove,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
  };

  // Progress to next tier
  const progressPercent = tier.nextTierDeals
    ? Math.min(
        100,
        Math.max(
          0,
          ((dealsCount - tier.minDeals) / (tier.nextTierDeals - tier.minDeals)) * 100
        )
      )
    : 100;

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block select-none", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Interactive Trigger Button with min 44x44px Touch Target */}
      {textOnly ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-label={`${tier.title} (Klicken für Details)`}
          className="h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer select-none active:scale-95"
        >
          <span>{tier.level > 0 ? "Verifiziert" : "Nicht verifiziert"}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-label={`${tier.title} (Klicken für Details)`}
          className={cn(
            "relative flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]",
            "active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500/50"
          )}
        >
          {/* Shield Icon Visual Container with single calm glow */}
          <div
            className={cn(
              "relative flex items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300",
              sizeClasses[size],
              tier.borderColor,
              tier.badgeBg,
              tier.glowColor
            )}
          >
            {/* Level 0: Minimaler matter Schild */}
            {tier.level === 0 && (
              <Shield className={cn(iconSizes[size], "text-neutral-500 opacity-60")} />
            )}

            {/* Level 1: Blauer Verifizierungs-Schild */}
            {tier.level === 1 && (
              <ShieldCheck className={cn(iconSizes[size], "text-blue-400")} />
            )}

            {/* Level 2: Cyan Veteran Schild (Ruhiger, sauberer Schild ohne Ping-Animation) */}
            {tier.level === 2 && (
              <div className="relative flex items-center justify-center">
                <ShieldCheck className={cn(iconSizes[size], "text-cyan-300")} />
              </div>
            )}

            {/* Level 3: Goldener Elite Schild mit Krone/Stern */}
            {tier.level === 3 && (
              <div className="relative flex items-center justify-center">
                <ShieldCheck className={cn(iconSizes[size], "text-amber-300 fill-amber-500/20")} />
                <Crown className="w-2 h-2 text-yellow-300 absolute -top-1 -right-1 drop-shadow-[0_0_4px_#f59e0b]" />
              </div>
            )}

            {/* Level 4: Feuriger Rubin-Schild */}
            {tier.level === 4 && (
              <div className="relative flex items-center justify-center">
                <ShieldCheck className={cn(iconSizes[size], "text-rose-300 fill-rose-500/30")} />
                <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-500 absolute -top-1.5 -right-1 drop-shadow-[0_0_6px_#ff4500]" />
              </div>
            )}

            {/* Level 5: Kosmischer Prismen-Schild */}
            {tier.level === 5 && (
              <div className="relative flex items-center justify-center">
                <ShieldCheck className={cn(iconSizes[size], "text-purple-200 fill-purple-400/30")} />
                <Gem className="w-2.5 h-2.5 text-amber-300 absolute -top-1.5 -right-1" />
              </div>
            )}

            {/* Optional Level Number Badge */}
            {showLevelNumber && tier.level > 0 && (
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-black/90 border border-white/20 text-[9px] font-black text-white">
                {tier.level}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Hover & Tap Popover Tooltip via Portal into document.body (Never clipped by parent overflow) */}
      {mounted && isOpen && coords && createPortal(
        <div
          role="tooltip"
          style={{
            position: "fixed",
            top: coords.placeAbove ? undefined : coords.top,
            bottom: coords.placeAbove ? window.innerHeight - coords.top : undefined,
            left: coords.left,
            transform: "translateX(-50%)",
            width: "min(320px, calc(100vw - 32px))",
            zIndex: 99999,
          }}
          className="p-4 rounded-2xl bg-[#0c101c] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-left pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Top Notch Pointer */}
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c101c] border-white/20 rotate-45",
              coords.placeAbove
                ? "-bottom-1.5 border-r border-b"
                : "-top-1.5 border-l border-t"
            )}
          />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center border",
                  tier.borderColor,
                  tier.badgeBg
                )}
              >
                {tier.level === 0 ? (
                  <Shield className="w-4 h-4 text-neutral-400" />
                ) : tier.level >= 4 ? (
                  <Flame className="w-4 h-4 text-rose-300" />
                ) : tier.level === 3 ? (
                  <Crown className="w-4 h-4 text-amber-300" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-300" />
                )}
              </div>
              <div>
                <h4 className={cn("text-xs font-black tracking-wide", tier.textColor)}>
                  {tier.title}
                </h4>
                <span className="text-[10px] text-neutral-400 font-semibold block">
                  {tier.badgeLabel}
                </span>
              </div>
            </div>

            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-black border",
                tier.level > 0
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700"
              )}
            >
              {tier.level > 0 ? "✓ Verifiziert" : "Anwärter"}
            </span>
          </div>

          <p className="text-[11px] text-neutral-300 leading-snug mb-3">
            {tier.subtitle}
          </p>

          {/* Deals Count & Progress Bar to next level */}
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 mb-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 font-medium">Erfolgreiche Deals:</span>
              <span className="font-black text-white">{dealsCount} Deals</span>
            </div>

            {tier.nextTierDeals ? (
              <>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      tier.level === 0
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>
                    Noch {Math.max(0, tier.nextTierDeals - dealsCount)} Deals bis Stufe {tier.level + 1}
                  </span>
                  <span>{tier.nextTierDeals} Deals Ziel</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                <span>Maximaler Verifizierungs-Rang erreicht!</span>
              </div>
            )}
          </div>

          {/* Trust note */}
          <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 pt-1 border-t border-white/10">
            <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{tier.perks}</span>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

