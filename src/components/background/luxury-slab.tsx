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
        // Mobile: 115px x 160px | Tablet: 150px x 210px | Desktop: 185px-210px x 260px-293px
        "w-[115px] sm:w-[150px] md:w-[185px] lg:w-[210px] aspect-[63/88]",
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
        - Authentische abgerundete Ecken (wie echte Karten)
        - Subtiler weißer Kartenrand-Glanz (ring-1 ring-white/15)
        - Weicher, fließender Schlagschatten ohne harte Schnittkanten
      */}
      <div
        className={cn(
          "relative w-full h-full rounded-[12px] sm:rounded-[15px] md:rounded-[18px] overflow-hidden",
          "bg-[#0a0d16] ring-1 ring-white/15",
          "shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85),_0_24px_52px_-12px_rgba(0,0,0,0.7),_0_2px_8px_rgba(0,0,0,0.5)]"
        )}
      >
        <Image
          src={slab.image}
          alt={slab.cardName}
          fill
          sizes="(max-width: 640px) 130px, (max-width: 768px) 170px, 230px"
          loading="lazy"
          className="object-cover object-center select-none pointer-events-none rounded-[12px] sm:rounded-[15px] md:rounded-[18px]"
        />

        {/* Subtiler, feiner Oberflächenglanz für lebendige Haptik */}
        <div className="absolute inset-0 pointer-events-none rounded-[12px] sm:rounded-[15px] md:rounded-[18px] bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08]" />
      </div>
    </div>
  );
}
