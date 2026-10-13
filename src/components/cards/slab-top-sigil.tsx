"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SlabTopSigilProps {
  className?: string;
  isExpanded?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  interactive?: boolean;
}

/**
 * Manaforge-Siegel für Collector Slabs
 * - Lebendiges Glimmen & Magma-Wärmeaura (Smoldering Heat Glow) dauerhaft aktiv
 * - Aufsteigende Asche- & Funken-Partikel dauerhaft aktiv
 * - 90°-Drehanimation beim Ausklappen
 */
export function SlabTopSigil({
  className,
  isExpanded = false,
  onClick,
  interactive = false,
}: SlabTopSigilProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center select-none group/sigil-btn",
        interactive ? "cursor-pointer pointer-events-auto" : "pointer-events-none",
        className
      )}
      title={interactive ? (isExpanded ? "Details einklappen" : "Details & Sammler ausklappen") : undefined}
    >
      {/* 1. Pulsierende Magma-Wärmeaura (Smoldering Heat Core Glow) */}
      <div className="slab-sigil-heat-aura" />

      {/* 2. Aufsteigende Asche- & glimmende Funken-Partikel (Sparks of Ash Rising) */}
      <div className="slab-ash-emitter">
        {/* Funke 1: Magma-Glut aus linker Sichel */}
        <span className="slab-ash-particle ash-p1" />
        {/* Funke 2: Heller Glutpartikel aus innerer Lavaspirale */}
        <span className="slab-ash-particle ash-p2" />
        {/* Funke 3: Aufsteigende Glut aus oberem Lavagestein */}
        <span className="slab-ash-particle ash-p3" />
        {/* Funke 4: Feine Ascheflocke aus rechter Glutspitze */}
        <span className="slab-ash-particle ash-p4" />
        {/* Funke 5: Aschepartikel aus unterer Felsbasis */}
        <span className="slab-ash-particle ash-p5" />
        {/* Funke 6: Mikro-Glutfunke aus dem oberen Flammenkern */}
        <span className="slab-ash-particle ash-p6" />
      </div>

      {/* 3. Das eigentliche Fels- & Lavasiegel mit 90°-Drehung & Glut-Flicker */}
      <div
        className={cn(
          "slab-top-sigil transition-transform duration-500 ease-out",
          isExpanded && "rotate-90"
        )}
      >
        <img
          src="/manaforge-emblem.png"
          alt="Manaforge Siegel"
          className="w-full h-full object-contain slab-sigil-img"
          loading="eager"
          draggable={false}
        />
      </div>
    </div>
  );
}
