"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame,
  ShoppingBag,
  ArrowLeftRight,
  Search,
  Star,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const cards = [
    {
      id: "sell",
      act: "Acto I",
      title: "VERKAUFEN",
      href: "/sell",
      bgImage: "/tiles/tile-sell.jpg",
      clipClass: "arcane-clip-1",
      filterClass: "arcane-filter-sell",
      flareColor: "bg-amber-500/60",
      icon: <Flame className="w-4 h-4 text-amber-300" />,
      showStar: false,
    },
    {
      id: "buy",
      act: "Acto II",
      title: "KAUFEN",
      href: "/buy",
      bgImage: "/tiles/tile-buy.jpg",
      clipClass: "arcane-clip-2",
      filterClass: "arcane-filter-buy",
      flareColor: "bg-cyan-500/60",
      icon: <ShoppingBag className="w-4 h-4 text-cyan-300" />,
      showStar: false,
    },
    {
      id: "trade",
      act: "Acto III",
      title: "TAUSCHEN",
      href: "/trade",
      bgImage: "/tiles/tile-trade.jpg",
      clipClass: "arcane-clip-3",
      filterClass: "arcane-filter-trade",
      flareColor: "bg-fuchsia-500/80 shadow-[0_0_40px_rgba(217,70,239,1)]",
      icon: <ArrowLeftRight className="w-4 h-4 text-fuchsia-300" />,
      showStar: true,
    },
    {
      id: "looking-for",
      act: "Acto IV",
      title: "GESUCHE",
      href: "/looking-for",
      bgImage: "/tiles/tile-looking-for.jpg",
      clipClass: "arcane-clip-4",
      filterClass: "arcane-filter-look",
      flareColor: "bg-emerald-500/60",
      icon: <Search className="w-4 h-4 text-emerald-300" />,
      showStar: false,
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-x-hidden select-none py-6 sm:py-10">
      {/* High Visibility Background Video */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        >
          <source src="/Dragon_BG.mp4" type="video/mp4" />
        </video>
        {/* Subtle dark tint so the dragon video remains clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b10]/45 via-black/25 to-[#090b10]/65" />
      </div>

      {/* Subtle Central Violet/Magenta Ambient Lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-purple-900/25 via-fuchsia-900/20 to-cyan-900/20 blur-[110px] -z-20" />

      {/* Main 4 Cards in ONE Horizontal Line */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 overflow-visible flex items-center justify-center">
        {/* Horizontal Row with ample padding for hover elevation without clipping */}
        <div className="flex flex-row items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-4 sm:gap-6 lg:gap-8 no-scrollbar py-14 px-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              onClick={() => router.push(card.href)}
              className={`group relative w-[170px] min-[400px]:w-[190px] sm:w-[205px] md:w-[225px] lg:w-[245px] h-[330px] min-[400px]:h-[370px] sm:h-[400px] md:h-[435px] lg:h-[475px] shrink-0 snap-center cursor-pointer transition-all duration-300 ease-out hover:-translate-y-4 hover:scale-[1.03] ${card.filterClass}`}
            >
              {/* Radiant Bottom Neon Flare bleeding onto the background (just like screenshot) */}
              <div
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-xl opacity-60 group-hover:opacity-100 group-hover:h-14 group-hover:w-full transition-all duration-300 pointer-events-none ${card.flareColor}`}
              />

              {/* Precise Arcane Sheared Polygonal Card Silhouette */}
              <div
                className={`relative w-full h-full bg-[#080a10] overflow-hidden ${card.clipClass} transition-transform duration-300`}
              >
                {/* Full-Bleed Artwork Image Background */}
                <img
                  src={card.bgImage}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay for Crisp White Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-10" />

                {/* Top-Right Circular Star/Icon Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/90 bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:border-white transition-all duration-200">
                    {card.showStar ? (
                      <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white fill-white" />
                    ) : (
                      card.icon
                    )}
                  </div>
                </div>

                {/* Bottom-Left Typography (Exact match to Arcane screenshot: Acto I / INICIOS) */}
                <div className="absolute bottom-5 sm:bottom-7 left-4 sm:left-6 z-20 space-y-0.5 sm:space-y-1">
                  {/* Small Tracked Subtitle: "Acto I", "Acto II", "Acto III", "Acto IV" */}
                  <div className="text-xs sm:text-sm font-normal text-white/90 tracking-wide">
                    {card.act}
                  </div>

                  {/* Ultra-Bold Condensed All-Caps Title: "VERKAUFEN", "KAUFEN", "TAUSCHEN", "GESUCHE" */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {card.title}
                  </h2>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}



