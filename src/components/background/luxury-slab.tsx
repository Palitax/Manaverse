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
        // Proportioniertes Sammler-Format: Mobile ~145px, Tablet ~185px, Desktop ~220px (Slab-Verhältnis ca. 1:1.42)
        "w-[145px] sm:w-[185px] md:w-[220px] aspect-[1/1.42]",
        // Sanftes, hardware-beschleunigtes Schweben ohne GPU-Overhead
        `animate-slab-${tiltVariant}`,
        className
      )}
      style={{
        willChange: "transform",
      }}
    >
      {/* ==================================================================== */}
      {/* 1. ECHTES ACRYL-GEHÄUSE & BORDÜRE                                   */}
      {/* ==================================================================== */}
      <div
        className={cn(
          "w-full h-full rounded-2xl sm:rounded-3xl relative overflow-hidden",
          "border border-white/20 ring-1 ring-inset ring-white/10",
          "shadow-[0_16px_40px_rgba(0,0,0,0.9),_inset_0_1px_2px_rgba(255,255,255,0.3)]",
          "bg-[#080b12]/90 flex flex-col justify-between p-2 sm:p-2.5"
        )}
      >
        {/* ==================================================================== */}
        {/* 2. AUTHENTISCHE ORIGINAL-GRADING-LABEL (PSA, BGS, CGC, ONE-TOUCH)    */}
        {/* ==================================================================== */}

        {/* --- PSA 10 GEM MT LABEL --- */}
        {slab.gradingCompany === "PSA" && (
          <div className="w-full bg-[#fdfdfd] rounded-xs p-1.5 sm:p-2 border-[2px] border-[#d81920] shadow-sm text-neutral-900 flex flex-col justify-between shrink-0 mb-1.5 sm:mb-2 select-none">
            <div className="flex items-start justify-between gap-1 leading-none">
              <div className="min-w-0 flex-1">
                <p className="text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-wider text-neutral-900 truncate">
                  {slab.setName}
                </p>
                <p className="text-[7.5px] sm:text-[9px] font-black uppercase tracking-tight text-black truncate mt-0.5">
                  {slab.cardName}
                </p>
                <p className="text-[6px] sm:text-[7px] font-bold text-neutral-700 truncate mt-0.5">
                  {slab.cardNumber}
                </p>
              </div>
              <div className="text-right shrink-0 leading-none pl-1">
                <span className="block text-[6px] sm:text-[7px] font-black text-[#d81920] tracking-wider">
                  GEM MT
                </span>
                <span className="block text-sm sm:text-base font-black text-neutral-950 font-mono tracking-tighter mt-0.5">
                  10
                </span>
              </div>
            </div>

            {/* Authentische Barcode-Zeile & PSA-Badge */}
            <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-neutral-300">
              <svg
                className="h-2.5 sm:h-3 w-16 sm:w-20 text-black fill-current"
                viewBox="0 0 80 12"
                aria-hidden="true"
              >
                <rect x="0" y="0" width="2" height="12" />
                <rect x="4" y="0" width="1" height="12" />
                <rect x="7" y="0" width="3" height="12" />
                <rect x="12" y="0" width="1" height="12" />
                <rect x="15" y="0" width="2" height="12" />
                <rect x="19" y="0" width="1" height="12" />
                <rect x="22" y="0" width="3" height="12" />
                <rect x="27" y="0" width="2" height="12" />
                <rect x="31" y="0" width="1" height="12" />
                <rect x="34" y="0" width="2" height="12" />
                <rect x="38" y="0" width="3" height="12" />
                <rect x="43" y="0" width="1" height="12" />
                <rect x="46" y="0" width="2" height="12" />
                <rect x="50" y="0" width="1" height="12" />
                <rect x="53" y="0" width="3" height="12" />
                <rect x="58" y="0" width="2" height="12" />
                <rect x="62" y="0" width="1" height="12" />
                <rect x="65" y="0" width="2" height="12" />
                <rect x="69" y="0" width="3" height="12" />
                <rect x="74" y="0" width="1" height="12" />
                <rect x="77" y="0" width="2" height="12" />
              </svg>
              <div className="px-1 py-0.2 bg-[#d81920] rounded-xs text-[6px] sm:text-[7px] font-black text-white tracking-widest leading-none">
                PSA
              </div>
              <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold text-neutral-800 tracking-wider">
                #{slab.certNumber}
              </span>
            </div>
          </div>
        )}

        {/* --- BECKETT BGS 10 BLACK LABEL --- */}
        {slab.gradingCompany === "BGS_BLACK" && (
          <div className="w-full bg-[#08080a] rounded-sm p-1.5 sm:p-2 border border-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.25)] text-amber-300 flex flex-col justify-between shrink-0 mb-1.5 sm:mb-2 select-none relative overflow-hidden">
            <div className="flex items-start justify-between gap-1 leading-none">
              {/* Beckett Shield */}
              <div className="flex flex-col items-center justify-center shrink-0 pr-1.5 border-r border-amber-400/30">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-amber-400/80 flex items-center justify-center text-[7px] sm:text-[8px] font-black font-serif text-amber-300">
                  B
                </div>
                <span className="text-[5.5px] sm:text-[6px] font-black text-amber-400 tracking-wider mt-0.5">
                  BECKETT
                </span>
              </div>

              {/* Card Info */}
              <div className="min-w-0 flex-1 pl-1.5">
                <p className="text-[6.5px] sm:text-[7.5px] font-mono text-amber-200/90 uppercase truncate">
                  {slab.setName}
                </p>
                <p className="text-[7.5px] sm:text-[9px] font-black text-amber-300 uppercase tracking-tight truncate mt-0.5">
                  {slab.cardName}
                </p>
                <p className="text-[6px] sm:text-[7px] font-mono text-amber-400/70 truncate mt-0.5">
                  {slab.cardNumber}
                </p>
              </div>

              {/* Pristine 10 & Black Label */}
              <div className="text-right shrink-0 leading-none pl-1">
                <span className="block text-[5.5px] sm:text-[6.5px] font-black text-amber-300 tracking-wider">
                  PRISTINE
                </span>
                <span className="block text-sm sm:text-base font-black text-amber-400 font-serif mt-0.5 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">
                  10
                </span>
                <span className="inline-block mt-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-[5px] sm:text-[6px] px-1 py-0.2 rounded-xs tracking-tighter leading-none">
                  BLACK LABEL
                </span>
              </div>
            </div>

            {/* 4 Perfect Gold Subgrades */}
            <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-amber-400/30 text-[5.5px] sm:text-[6.5px] font-mono font-bold text-amber-300/90">
              <span>C: 10</span>
              <span>Cr: 10</span>
              <span>E: 10</span>
              <span>S: 10</span>
              <span className="text-amber-400/60 font-normal">#{slab.certNumber}</span>
            </div>
          </div>
        )}

        {/* --- CGC PRISTINE 10 LABEL --- */}
        {slab.gradingCompany === "CGC" && (
          <div className="w-full bg-[#0a0e17] rounded-sm p-1.5 sm:p-2 border border-cyan-400/50 shadow-md text-white flex flex-col justify-between shrink-0 mb-1.5 sm:mb-2 select-none relative overflow-hidden">
            <div className="flex items-start justify-between gap-1 leading-none">
              <div className="shrink-0 pr-1.5 border-r border-white/15">
                <span className="text-[7.5px] sm:text-[9px] font-black tracking-widest text-cyan-400 block font-serif">
                  CGC
                </span>
                <span className="text-[5px] sm:text-[6px] font-mono text-neutral-400 block tracking-wider">
                  CARDS
                </span>
              </div>

              <div className="min-w-0 flex-1 pl-1.5">
                <p className="text-[6.5px] sm:text-[7.5px] font-mono text-neutral-400 truncate">
                  {slab.setName}
                </p>
                <p className="text-[7.5px] sm:text-[9px] font-black text-white uppercase tracking-tight truncate mt-0.5">
                  {slab.cardName}
                </p>
                <p className="text-[6px] sm:text-[7px] font-mono text-cyan-300/80 truncate mt-0.5">
                  {slab.cardNumber}
                </p>
              </div>

              <div className="text-right shrink-0 leading-none pl-1">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-black px-1.5 py-0.5 rounded-xs text-[6px] sm:text-[7px] font-black tracking-tight leading-none">
                  PRISTINE 10
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-white/10 text-[6px] sm:text-[7px] font-mono text-neutral-400">
              <span>CGC CERTIFIED GRADE</span>
              <span className="text-cyan-300 font-bold">#{slab.certNumber}</span>
            </div>
          </div>
        )}

        {/* --- ULTRA-PRO ONE-TOUCH MAGNETIC (Originale ungradete Karte) --- */}
        {slab.gradingCompany === "RAW_MAGNETIC" && (
          <div className="w-full flex items-center justify-between px-2 py-1 shrink-0 mb-1 sm:mb-1.5 select-none relative">
            <span className="text-[6px] sm:text-[7px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest">
              ULTRA•PRO
            </span>

            {/* Gold Magnetic Rivet */}
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.5)] border border-amber-200/90 flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 shadow-inner" />
            </div>

            <span className="text-[6px] sm:text-[7px] font-mono font-bold text-amber-300/90 tracking-wider">
              UV 35PT
            </span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 3. RECESSED INNER CARD BED MIT ECHTEM HOCHAUFLÖSENDEN SCAN           */}
        {/* ==================================================================== */}
        <div
          className={cn(
            "relative flex-1 w-full rounded-xl sm:rounded-2xl overflow-hidden",
            "bg-[#030508] border border-white/15 shadow-[inset_0_2px_8px_rgba(0,0,0,0.95)] flex items-center justify-center p-1 sm:p-1.5"
          )}
        >
          {/* Echtes authentisches Kartenbild ohne KI-Halluzinationen */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={slab.image}
              alt={`${slab.cardName} (${slab.gradingCompany})`}
              width={400}
              height={560}
              loading="lazy"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
            />
            {/* Feine Acryl-Reflexion */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
          </div>

          {/* Franchise Watermark (⚡ Pokémon / 🏴‍☠️ One Piece) */}
          <div className="absolute bottom-1.5 left-1.5 z-20 pointer-events-none">
            <div className="px-1.5 py-0.5 rounded-full bg-black/85 border border-white/20 text-[6px] sm:text-[7px] font-black uppercase tracking-wider text-neutral-300 shadow-md">
              {slab.franchise === "pokemon" ? "⚡ POKÉMON" : "🏴‍☠️ ONE PIECE"}
            </div>
          </div>

          {/* Sammler-Schätzwert Badge */}
          <div className="absolute bottom-1.5 right-1.5 z-20 pointer-events-none">
            <div className="px-1.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[6.5px] sm:text-[8px] font-mono font-black text-emerald-300 shadow-md">
              {slab.priceEst}
            </div>
          </div>
        </div>

        {/* Subtiler Acryl-Oberflächenglanz (statisch für 0% GPU-Last) */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.06]" />
      </div>
    </div>
  );
}
