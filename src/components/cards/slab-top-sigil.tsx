"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SlabTopSigilProps {
  className?: string;
}

/**
 * Überhängendes Manaforge-Siegel für Collector Slabs
 * - Sitzt oben mittig mit Überstand über dem Acrylrand
 * - Lebendiges Glimmen & Magma-Wärmeaura (Smoldering Heat Glow)
 * - Aufsteigende Asche- & Funken-Partikel (Sparks of Ash & Floating Embers)
 * - Taktile 90°-Drehanimation beim Hovern über die Slab
 */
export function SlabTopSigil({ className }: SlabTopSigilProps) {
  return (
    <div
      className={cn("slab-top-sigil-wrapper pointer-events-none select-none", className)}
      aria-hidden="true"
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

      {/* 3. Das eigentliche Fels- & Lavasiegel mit 90°-Hover-Drehung & Glut-Flicker */}
      <div className="slab-top-sigil">
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
