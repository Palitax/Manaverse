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
        // Scaled sizing: Mobile ~140px, Desktop ~200px
        "w-[145px] sm:w-[195px] md:w-[215px] aspect-[1/1.55]",
        // 3D perspective tilt animation
        `animate-slab-${tiltVariant}`,
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* ==================================================================== */}
      {/* 1. CRYSTAL ACRYLIC SLAB HOUSING (Beveled casing with refractive rim) */}
      {/* ==================================================================== */}
      <div
        className={cn(
          "w-full h-full rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 flex flex-col justify-between relative overflow-hidden",
          "bg-gradient-to-br from-white/[0.14] via-black/40 to-white/[0.08]",
          "border border-white/30 backdrop-blur-md",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9),_inset_0_1px_3px_rgba(255,255,255,0.45),_inset_0_-1px_3px_rgba(0,0,0,0.8)]"
        )}
      >
        {/* Dynamic Specular Acrylic Light Sheen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl z-30">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.18] to-transparent -rotate-45 translate-x-[-100%] animate-slab-glint" />
        </div>

        {/* Acrylic Top Edge Tabs (PSA style teeth) */}
        <div className="absolute top-0 inset-x-8 h-[2px] bg-white/40 rounded-full pointer-events-none" />

        {/* ==================================================================== */}
        {/* 2. AUTHENTIC GRADING COMPANY LABEL                                   */}
        {/* ==================================================================== */}
        {slab.gradingCompany === "PSA" && (
          <div className="bg-[#fcfcfd] rounded-lg sm:rounded-xl p-1.5 sm:p-2 border-2 border-[#dc2626] text-black shadow-md relative z-20">
            {/* Double red pinstripe frame */}
            <div className="border border-[#dc2626]/70 rounded p-1 flex flex-col justify-between">
              {/* Header: Logo, Hologram & Grade */}
              <div className="flex items-start justify-between gap-1 leading-tight">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#dc2626] font-black text-[11px] sm:text-[13px] tracking-tight">
                      PSA
                    </span>
                    {/* Security Hologram Oval */}
                    <div className="w-3.5 h-2 rounded-full bg-gradient-to-r from-slate-200 via-sky-200 to-amber-200 border border-slate-300 shadow-[0_0_4px_rgba(56,189,248,0.5)]" />
                  </div>
                  <p className="text-[7px] sm:text-[8px] font-mono font-bold text-neutral-800 uppercase tracking-tighter truncate max-w-[85px] sm:max-w-[115px]">
                    {slab.setName}
                  </p>
                </div>

                <div className="text-right leading-none">
                  <span className="block text-[7px] sm:text-[8px] font-black text-black tracking-tight">
                    {slab.gradeLabel}
                  </span>
                  <span className="block text-sm sm:text-lg font-black text-black tracking-tight">
                    {slab.grade}
                  </span>
                </div>
              </div>

              {/* Card Title & Number */}
              <div className="my-0.5">
                <p className="text-[8px] sm:text-[9.5px] font-black text-black uppercase tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                  {slab.cardName}
                </p>
                <p className="text-[7px] sm:text-[8px] font-mono text-neutral-600">
                  {slab.cardNumber}
                </p>
              </div>

              {/* Barcode & Cert Number */}
              <div className="flex items-center justify-between pt-0.5 border-t border-neutral-300/60 text-[6.5px] sm:text-[7.5px] font-mono text-neutral-500">
                <div className="flex items-end gap-[1.5px] h-2">
                  {[4, 2, 5, 3, 2, 6, 2, 4, 3, 5, 2, 4, 3, 2, 5].map((h, i) => (
                    <div
                      key={i}
                      className="w-[1.5px] bg-neutral-800"
                      style={{ height: `${h * 1.5}px` }}
                    />
                  ))}
                </div>
                <span>#{slab.certNumber}</span>
              </div>
            </div>
          </div>
        )}

        {slab.gradingCompany === "BGS_BLACK" && (
          <div className="bg-[#09090c] rounded-lg sm:rounded-xl p-1.5 sm:p-2 border border-amber-400/90 shadow-[0_0_15px_rgba(234,179,8,0.3)] text-white relative z-20">
            <div className="border border-amber-400/50 rounded p-1 flex flex-col justify-between">
              {/* Header: BGS Logo & Pristine 10 Black Label */}
              <div className="flex items-start justify-between gap-1 leading-tight">
                <div>
                  <span className="text-amber-400 font-black text-[10px] sm:text-[12px] tracking-wider block">
                    BECKETT
                  </span>
                  <p className="text-[7px] sm:text-[8px] font-bold text-amber-200/90 truncate max-w-[85px] sm:max-w-[115px]">
                    {slab.setName}
                  </p>
                </div>

                <div className="text-right leading-none">
                  <span className="block text-[6.5px] sm:text-[7.5px] font-black text-amber-300 tracking-wider">
                    PRISTINE
                  </span>
                  <span className="block text-sm sm:text-lg font-black text-amber-400 tracking-tight drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]">
                    10
                  </span>
                  <span className="inline-block bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-[6px] sm:text-[6.5px] px-1 py-0.2 rounded-xs uppercase tracking-tighter">
                    BLACK LABEL
                  </span>
                </div>
              </div>

              {/* Card Title */}
              <div className="my-0.5">
                <p className="text-[8px] sm:text-[9.5px] font-black text-white uppercase tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                  {slab.cardName}
                </p>
                <p className="text-[7px] sm:text-[8px] font-mono text-amber-300/80">
                  {slab.cardNumber}
                </p>
              </div>

              {/* 4 Perfect Gold Subgrades */}
              <div className="flex items-center justify-between pt-0.5 border-t border-amber-500/30 text-[6.5px] sm:text-[7.5px] font-mono text-amber-300 font-bold">
                <span>C: 10</span>
                <span>Cr: 10</span>
                <span>E: 10</span>
                <span>S: 10</span>
              </div>
            </div>
          </div>
        )}

        {slab.gradingCompany === "BGS_GOLD" && (
          <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 rounded-lg sm:rounded-xl p-1.5 sm:p-2 border border-amber-500 text-black shadow-md relative z-20">
            <div className="border border-amber-600/40 rounded p-1 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-1 leading-tight">
                <div>
                  <span className="text-black font-black text-[10px] sm:text-[12px] tracking-wider block">
                    BECKETT
                  </span>
                  <p className="text-[7px] sm:text-[8px] font-bold text-neutral-800 truncate max-w-[85px] sm:max-w-[115px]">
                    {slab.setName}
                  </p>
                </div>
                <div className="text-right leading-none">
                  <span className="block text-[6.5px] sm:text-[7.5px] font-black text-neutral-900 tracking-wider">
                    PRISTINE
                  </span>
                  <span className="block text-sm sm:text-lg font-black text-black">
                    10
                  </span>
                </div>
              </div>
              <div className="my-0.5">
                <p className="text-[8px] sm:text-[9.5px] font-black text-black uppercase tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                  {slab.cardName}
                </p>
                <p className="text-[7px] sm:text-[8px] font-mono text-neutral-700">
                  {slab.cardNumber}
                </p>
              </div>
              <div className="flex items-center justify-between pt-0.5 border-t border-amber-600/30 text-[6.5px] sm:text-[7.5px] font-mono text-neutral-900 font-bold">
                <span>C: 10</span>
                <span>Cr: 10</span>
                <span>E: 10</span>
                <span>S: {slab.subgrades?.surface || "9.5"}</span>
              </div>
            </div>
          </div>
        )}

        {slab.gradingCompany === "CGC" && (
          <div className="bg-[#0e1017] rounded-lg sm:rounded-xl p-1 sm:p-1.5 border border-amber-300/80 text-white shadow-md relative z-20">
            {/* Top Gold Banner */}
            <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded text-black px-1.5 py-0.5 flex items-center justify-between font-black text-[8px] sm:text-[9px]">
              <span>CGC CARDS</span>
              <span className="bg-black text-amber-300 px-1 rounded text-[7px] sm:text-[8px]">
                PRISTINE 10
              </span>
            </div>
            <div className="px-1 py-0.5">
              <p className="text-[7px] sm:text-[8px] font-mono text-neutral-400 truncate max-w-[130px] sm:max-w-[160px]">
                {slab.setName}
              </p>
              <p className="text-[8px] sm:text-[9.5px] font-black text-white uppercase tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                {slab.cardName}
              </p>
              <div className="flex items-center justify-between text-[6.5px] sm:text-[7.5px] font-mono text-amber-300/90 pt-0.5 border-t border-white/10">
                <span>{slab.cardNumber}</span>
                <span>#{slab.certNumber}</span>
              </div>
            </div>
          </div>
        )}

        {slab.gradingCompany === "RAW_MAGNETIC" && (
          <div className="rounded-lg sm:rounded-xl p-1 border border-white/20 bg-white/[0.04] text-center relative z-20">
            {/* Gold Magnet Circle */}
            <div className="w-5 h-5 mx-auto rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-md border border-amber-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-200/80" />
            </div>
            <p className="text-[7px] font-mono font-bold text-amber-300 tracking-widest uppercase mt-0.5">
              ONE-TOUCH UV CASE
            </p>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 3. CARD ARTWORK RECESSED BED                                         */}
        {/* ==================================================================== */}
        <div
          className={cn(
            "relative flex-1 my-1.5 sm:my-2 rounded-xl sm:rounded-2xl overflow-hidden",
            "bg-black/95 border border-white/20 shadow-2xl flex items-center justify-center p-1 sm:p-1.5"
          )}
        >
          {/* Inner Card Inset */}
          <div className="relative w-full h-full flex items-center justify-center">
            {slab.image && (
              <img
                src={slab.image}
                alt={slab.cardName}
                loading="eager"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
              />
            )}

            {/* Foil Holo Sheen on Card Face */}
            <div className="absolute inset-0 holofoil-card-sheen opacity-25 pointer-events-none mix-blend-screen" />
          </div>

          {/* Franchise Watermark Badge (Pokémon / One Piece) */}
          <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/20 text-[7px] sm:text-[8px] font-black uppercase tracking-wider text-neutral-300">
            {slab.franchise === "pokemon" ? "⚡ POKÉMON" : "🏴‍☠️ ONE PIECE"}
          </div>

          {/* Estimated Value Pill */}
          <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-sm border border-emerald-500/40 text-[7px] sm:text-[8px] font-mono font-black text-emerald-300">
            {slab.priceEst}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 4. SLAB FOOTER RIM                                                   */}
        {/* ==================================================================== */}
        <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-neutral-400 px-1 relative z-20">
          <span className="tracking-widest uppercase opacity-75">MANAFORGE</span>
          <span className="font-bold text-amber-400/90 tracking-tighter">
            {slab.grade === "10" ? "★ PERFECT 10 ★" : "★ RAW MINT ★"}
          </span>
        </div>
      </div>
    </div>
  );
}
