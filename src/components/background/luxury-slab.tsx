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
        // Proportioniertes Sizing: Mobile ~140px, Tablet ~185px, Desktop ~220px (3:4 Format)
        "w-[140px] sm:w-[185px] md:w-[220px] aspect-[3/4]",
        // Sanfter, subtiler 3D-Schwebemodus
        `animate-slab-${tiltVariant}`,
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* ==================================================================== */}
      {/* 1. ECHTES ACRYL-GEHÄUSE & BORDÜRE                                   */}
      {/* ==================================================================== */}
      <div
        className={cn(
          "w-full h-full rounded-2xl sm:rounded-3xl relative overflow-hidden",
          "border border-white/15",
          "shadow-[0_20px_50px_rgba(0,0,0,0.85),_inset_0_1px_2px_rgba(255,255,255,0.25)]",
          "bg-[#07090e]/85 backdrop-blur-xs flex items-center justify-center"
        )}
      >
        {/* ==================================================================== */}
        {/* 2. AUTHENTISCHES HOCHWERTIGES SLAB- / KARTEN-FOTO                    */}
        {/* ==================================================================== */}
        <Image
          src={slab.image}
          alt={`${slab.cardName} (${slab.gradingCompany})`}
          width={448}
          height={600}
          loading="lazy"
          className="w-full h-full object-cover filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)]"
        />

        {/* Dynamic Specular Acrylic Light Sheen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl z-30">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent animate-slab-glint" />
        </div>

        {/* ==================================================================== */}
        {/* 3. DISKRETE BADGES & WERTERMITTLUNG                                  */}
        {/* ==================================================================== */}
        {/* Grading / Card Company Badge (Top-Left) */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          {slab.gradingCompany === "PSA" && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/90 backdrop-blur-md border border-red-500/50 text-[7px] sm:text-[8px] font-black text-red-200 shadow-md">
              <span className="text-red-400">PSA 10</span>
              <span className="opacity-70 font-mono font-normal hidden xs:inline">• GEM MT</span>
            </div>
          )}

          {slab.gradingCompany === "BGS_BLACK" && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/90 backdrop-blur-md border border-amber-400/60 text-[7px] sm:text-[8px] font-black text-amber-300 shadow-[0_0_10px_rgba(250,204,21,0.35)]">
              <span>BGS 10</span>
              <span className="text-amber-200/80 font-mono font-normal hidden xs:inline">• BLACK LABEL</span>
            </div>
          )}

          {slab.gradingCompany === "CGC" && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0a101d]/90 backdrop-blur-md border border-cyan-400/50 text-[7px] sm:text-[8px] font-black text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              <span className="text-cyan-400">CGC 10</span>
              <span className="text-amber-300 font-mono font-normal hidden xs:inline">• PRISTINE</span>
            </div>
          )}

          {slab.gradingCompany === "RAW_MAGNETIC" && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-amber-500/50 text-[7px] sm:text-[8px] font-black text-amber-200 shadow-md">
              <span className="text-amber-400">ORIGINAL</span>
              <span className="opacity-70 font-mono font-normal hidden xs:inline">• ONE-TOUCH</span>
            </div>
          )}
        </div>

        {/* Franchise Watermark (Bottom-Left) */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <div className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-wider text-neutral-300 shadow-md">
            {slab.franchise === "pokemon" ? "⚡ POKÉMON" : "🏴‍☠️ ONE PIECE"}
          </div>
        </div>

        {/* Estimated Collector Value (Bottom-Right) */}
        <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
          <div className="px-2 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-[7px] sm:text-[8.5px] font-mono font-black text-emerald-300 shadow-md">
            {slab.priceEst}
          </div>
        </div>
      </div>
    </div>
  );
}
