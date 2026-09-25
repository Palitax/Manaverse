"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import {
  ShoppingBag,
  ArrowLeftRight,
  Search,
  Flame,
  Star,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { listings } = useStore();

  const sellCount = listings.filter((l) => l.type === "sell").length;
  const buyCount = listings.filter((l) => l.type === "sell").length;
  const tradeCount = listings.filter((l) => l.type === "trade").length;
  const lookingForCount = listings.filter((l) => l.type === "looking_for").length;

  const cards = [
    {
      id: "sell",
      act: "Acto I",
      title: "VERKAUFEN",
      subtitle: "SELL",
      countText: `${sellCount} Angebote`,
      href: "/sell",
      bgImage: "/tiles/tile-sell.jpg",
      shadowClass: "arcane-card-shadow-sell",
      borderColor: "border-amber-400/60 group-hover:border-amber-300",
      accentGlow: "rgba(245, 158, 11, 0.4)",
      bottomFlare: "from-amber-500/60 via-amber-600/30 to-transparent",
      icon: <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />,
      slantClass: "sm:-skew-y-[2.8deg] sm:-rotate-[1deg]",
    },
    {
      id: "buy",
      act: "Acto II",
      title: "KAUFEN",
      subtitle: "BUY",
      countText: `${buyCount} Karten`,
      href: "/buy",
      bgImage: "/tiles/tile-buy.jpg",
      shadowClass: "arcane-card-shadow-buy",
      borderColor: "border-cyan-400/60 group-hover:border-cyan-300",
      accentGlow: "rgba(6, 182, 212, 0.4)",
      bottomFlare: "from-cyan-500/60 via-cyan-600/30 to-transparent",
      icon: <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />,
      slantClass: "sm:-skew-y-[2.8deg]",
    },
    {
      id: "trade",
      act: "Acto III",
      title: "TAUSCHEN",
      subtitle: "TRADE",
      countText: `${tradeCount} Trades`,
      href: "/trade",
      bgImage: "/tiles/tile-trade.jpg",
      shadowClass: "arcane-card-shadow-trade",
      borderColor: "border-fuchsia-400/60 group-hover:border-fuchsia-300",
      accentGlow: "rgba(217, 70, 239, 0.4)",
      bottomFlare: "from-fuchsia-500/60 via-purple-600/30 to-transparent",
      icon: <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />,
      slantClass: "sm:-skew-y-[2.8deg]",
    },
    {
      id: "looking-for",
      act: "Acto IV",
      title: "GESUCHE",
      subtitle: "SEEK",
      countText: `${lookingForCount} Gesuche`,
      href: "/looking-for",
      bgImage: "/tiles/tile-looking-for.jpg",
      shadowClass: "arcane-card-shadow-look",
      borderColor: "border-emerald-400/60 group-hover:border-emerald-300",
      accentGlow: "rgba(16, 185, 129, 0.4)",
      bottomFlare: "from-emerald-500/60 via-teal-600/30 to-transparent",
      icon: <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />,
      slantClass: "sm:-skew-y-[2.8deg] sm:rotate-[1deg]",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-x-hidden select-none py-8">
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
        {/* Subtle cinematic gradient so background dragon is clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b10]/40 via-black/25 to-[#090b10]/70 backdrop-blur-[0.5px]" />
      </div>

      {/* Subtle Central Violet/Magenta Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-purple-900/20 via-fuchsia-900/15 to-cyan-900/15 blur-[100px] -z-20" />

      {/* Main 4 Cards in ONE Horizontal Line */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 overflow-visible">
        {/* Horizontal Container: Centered on desktop, snap scroll on mobile */}
        <div className="flex flex-row items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3 sm:gap-4 md:gap-5 lg:gap-6 no-scrollbar py-12 px-2">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.07 * index }}
              onClick={() => router.push(card.href)}
              className={`group relative w-[160px] min-[420px]:w-[180px] sm:w-[195px] md:w-[220px] lg:w-[240px] h-[270px] min-[420px]:h-[300px] sm:h-[330px] md:h-[360px] lg:h-[385px] shrink-0 snap-center cursor-pointer transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.04] ${card.slantClass} hover:skew-y-0 hover:rotate-0`}
            >
              {/* Outer Neon Glow Flare beneath the card */}
              <div
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-md opacity-65 group-hover:opacity-100 group-hover:h-12 group-hover:w-full transition-all duration-300 pointer-events-none bg-gradient-to-t ${card.bottomFlare}`}
              />

              {/* Sharp Slanted Card Frame (Zero roundness / sharp polygon cut aesthetic) */}
              <div
                className={`relative w-full h-full overflow-hidden rounded-none border ${card.borderColor} bg-[#07090f] ${card.shadowClass} flex flex-col justify-between transition-all duration-300`}
              >
                {/* Full-Bleed Artwork Image Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={card.bgImage}
                    alt={card.title}
                    className="w-full h-full object-cover object-center scale-100 group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle Top Vignette */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-10" />

                  {/* Dark Cinematic Bottom Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/75 to-transparent z-10" />

                  {/* Neon Color Accent Light Glow */}
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-300 z-10"
                    style={{
                      background: `radial-gradient(circle at 50% 90%, ${card.accentGlow}, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Top-Right Circular Badge */}
                <div className="relative z-20 p-3 sm:p-3.5 flex justify-end">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/80 bg-black/45 backdrop-blur-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-200">
                    {card.icon}
                  </div>
                </div>

                {/* Bottom Content Area: Subtitle + Large Condensed Bold Title */}
                <div className="relative z-20 p-3.5 sm:p-4 pb-4 sm:pb-5 space-y-0.5">
                  {/* "Acto I", "Acto II", "Acto III", "Acto IV" Small Tracked Subtitle */}
                  <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-300 uppercase tracking-widest drop-shadow">
                    {card.act}
                  </div>

                  {/* Large Bold Condensed Main Title (e.g. INICIOS / VERKAUFEN) */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    {card.title}
                  </h2>

                  {/* Active Count / Quick Info */}
                  <div className="text-[10px] sm:text-[11px] font-medium text-neutral-300/80 tracking-wide pt-0.5 opacity-90">
                    {card.countText}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}


