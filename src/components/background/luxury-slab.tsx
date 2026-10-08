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
        - Authentische abgerundete Kartenecken (wie originale Pokémon- / One Piece-Karten mit ca. 2.5mm bis 3.0mm Radius)
        - Subtiler weißer Kartenrand-Glanz (ring-1 ring-white/12)
        - Weicher, fließender 3D-Schlagschatten, der sich natürlich im schwarzen Hintergrund auflöst
      */}
      <div
        className={cn(
          "relative w-full h-full rounded-[4.5px] sm:rounded-[5.5px] md:rounded-[6px] lg:rounded-[7px] xl:rounded-[7.5px] overflow-hidden",
          "bg-black ring-1 ring-white/12",
          "shadow-[0_4px_14px_rgba(0,0,0,0.8),_0_12px_30px_rgba(0,0,0,0.9),_0_0_20px_rgba(0,0,0,0.5)]"
        )}
      >
        <Image
          src={slab.image}
          alt={slab.cardName}
          fill
          sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 170px, 200px"
          loading="lazy"
          className="object-cover object-center select-none pointer-events-none rounded-[4.5px] sm:rounded-[5.5px] md:rounded-[6px] lg:rounded-[7px] xl:rounded-[7.5px]"
        />

        {/* Subtiler, feiner Oberflächenglanz für lebendige Haptik */}
        <div className="absolute inset-0 pointer-events-none rounded-[4.5px] sm:rounded-[5.5px] md:rounded-[6px] lg:rounded-[7px] xl:rounded-[7.5px] bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08]" />
      </div>
    </div>
  );
}
