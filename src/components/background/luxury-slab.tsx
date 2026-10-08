"use client";

import React from "react";
import Image from "next/image";
import { BackgroundSlab } from "@/types/slabs";
import { cn } from "@/lib/utils";

interface LuxurySlabProps {
  slab: BackgroundSlab;
  tiltVariant?: "tilt-a" | "tilt-b" | "tilt-c" | "tilt-d";
  className?: string;
}

export function LuxurySlab({
  slab,
  tiltVariant = "tilt-a",
  className,
}: LuxurySlabProps) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 select-none pointer-events-none transition-transform duration-700",
        // Authentisches TCG-Kartenformat: 63mm x 88mm (~1:1.397)
        // Responsive Skalierung, damit 3 Reihen auf allen Displayhöhen mit großzügigem Freiraum schweben
        "w-[105px] sm:w-[120px] md:w-[138px] lg:w-[152px] xl:w-[165px] aspect-[63/88]",
        // Sanftes, hardware-beschleunigtes Schweben (0% CPU-Last)
        `animate-slab-${tiltVariant}`,
        className
      )}
      style={{
        willChange: "transform",
      }}
    >
      {/* 
        Reine TCG-Sammelkarte:
        - Authentische abgerundete Kartenecken (wie echte Pokémon-/One Piece-/Riftbound-Karten)
        - Subtiler weißer Kartenrand-Glanz (ring-1 ring-white/12)
        - Weicher, fließender 3D-Schlagschatten, der sich natürlich im Hintergrund auflöst ohne Schnittkanten
      */}
      <div
        className={cn(
          "relative w-full h-full rounded-[11px] sm:rounded-[13px] md:rounded-[15px] overflow-hidden",
          "bg-[#0a0d16] ring-1 ring-white/12",
          "shadow-[0_4px_12px_rgba(0,0,0,0.6),_0_10px_28px_rgba(0,0,0,0.65),_0_0_20px_rgba(0,0,0,0.4)]"
        )}
      >
        <Image
          src={slab.image}
          alt={slab.cardName}
          fill
          sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 170px, 200px"
          loading="lazy"
          className="object-cover object-center select-none pointer-events-none rounded-[11px] sm:rounded-[13px] md:rounded-[15px]"
        />

        {/* Subtiler, feiner Oberflächenglanz für lebendige Haptik */}
        <div className="absolute inset-0 pointer-events-none rounded-[11px] sm:rounded-[13px] md:rounded-[15px] bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08]" />
      </div>
    </div>
  );
}
