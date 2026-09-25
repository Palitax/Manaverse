"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const cards = [
    {
      id: "sell",
      categoryNum: "01",
      sidebarText: "SELL // VERKAUFEN",
      title: "VERKAUFEN",
      nameGradient: "holo-text-sell",
      description: "Einzelkarten verkaufen oder ganze Sammlungen bei Manacards einreichen.",
      href: "/sell",
      pokemonImg: "/pokemon/gengar.png",
      cardBg: "from-pink-950/25 via-purple-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-pink-500/90 via-rose-500/90 to-fuchsia-600/90",
      borderColor: "border-pink-500/30 group-hover:border-pink-400/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(236,72,153,0.45)]",
      patternColor: "rgba(244, 114, 182, 0.05)",
      imgClass: "w-[85%] sm:w-[88%]",
    },
    {
      id: "buy",
      categoryNum: "02",
      sidebarText: "BUY // KAUFEN",
      title: "KAUFEN",
      nameGradient: "holo-text-buy",
      description: "Karten und Angebote aus der Community erwerben.",
      href: "/buy",
      pokemonImg: "/pokemon/pikachu.png",
      cardBg: "from-cyan-950/25 via-sky-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-cyan-400/90 via-sky-400/90 to-teal-400/90",
      borderColor: "border-cyan-400/30 group-hover:border-cyan-300/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]",
      patternColor: "rgba(6, 182, 212, 0.05)",
      imgClass: "w-[85%] sm:w-[88%]",
    },
    {
      id: "trade",
      categoryNum: "03",
      sidebarText: "TRADE // TAUSCHEN",
      title: "TAUSCHEN",
      nameGradient: "holo-text-trade",
      description: "Karten fair 1:1 innerhalb der Community tauschen.",
      href: "/trade",
      pokemonImg: "/pokemon/mewtwo.png",
      cardBg: "from-purple-950/25 via-fuchsia-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-purple-400/90 via-fuchsia-400/90 to-pink-500/90",
      borderColor: "border-purple-400/30 group-hover:border-fuchsia-300/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(217,70,239,0.45)]",
      patternColor: "rgba(217, 70, 239, 0.05)",
      imgClass: "w-[95%] sm:w-[98%] scale-[1.08]",
    },
    {
      id: "looking-for",
      categoryNum: "04",
      sidebarText: "SEEK // GESUCHE",
      title: "GESUCHE",
      nameGradient: "holo-text-look",
      description: "Eigene Wunschkarten ausschreiben.",
      href: "/looking-for",
      pokemonImg: "/pokemon/charizard.png",
      cardBg: "from-amber-950/25 via-orange-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-amber-400/90 via-orange-500/90 to-red-500/90",
      borderColor: "border-orange-400/30 group-hover:border-amber-300/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(249,115,22,0.45)]",
      patternColor: "rgba(249, 115, 22, 0.05)",
      imgClass: "w-[98%] sm:w-[102%] scale-[1.10]",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-x-hidden select-none py-4 sm:py-8">
      {/* High-Clarity Background Video */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
        >
          <source src="/Dragon_BG.mp4" type="video/mp4" />
        </video>
        {/* Ultra-light cinematic gradient scrim so dragon is prominently visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />
      </div>

      {/* Main 4 Cards in ONE Horizontal Line */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 overflow-visible flex items-center justify-center">
        <div className="flex flex-row items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 no-scrollbar pt-12 sm:pt-16 pb-8 px-2">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              onClick={() => router.push(card.href)}
              className="group relative w-[165px] min-[400px]:w-[185px] sm:w-[200px] md:w-[225px] lg:w-[245px] h-[290px] min-[400px]:h-[320px] sm:h-[345px] md:h-[375px] lg:h-[400px] shrink-0 snap-center cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-3"
            >
              {/* 3D Popping Pokemon (Extends ABOVE top edge and expands on hover for all 4!) */}
              <div className="absolute -top-11 sm:-top-15 inset-x-0 h-[72%] sm:h-[75%] z-20 flex items-center justify-center pointer-events-none">
                <img
                  src={card.pokemonImg}
                  alt={card.title}
                  className={`${card.imgClass} h-auto max-h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] transform group-hover:scale-120 sm:group-hover:scale-125 group-hover:-translate-y-3.5 transition-all duration-300 ease-out`}
                />
              </div>

              {/* Main Card Box Container (Transparent Glass with Backdrop Blur) */}
              <div
                className={`relative w-full h-full rounded-2xl sm:rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.cardBg} backdrop-blur-md ${card.glowColor} overflow-hidden shadow-2xl flex flex-row justify-between transition-all duration-300`}
              >
                {/* Background Tech Texture / Halftone Grid */}
                <div
                  className="absolute inset-0 z-0 opacity-20 halftone-pattern pointer-events-none"
                  style={{
                    backgroundColor: card.patternColor,
                  }}
                />

                {/* Subtle Top Glass Reflection */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

                {/* Left/Center Content Area (with min-w-0 to prevent pushing the fixed sidebar) */}
                <div className="relative z-30 flex-1 min-w-0 flex flex-col justify-end p-2.5 sm:p-4 pr-1.5 sm:pr-2 pb-3 sm:pb-4">
                  {/* Translucent dark gradient behind text for high legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent -z-10" />

                  {/* Category Title with Adjusted Sizing so VERKAUFEN never cuts off */}
                  <h2
                    className={`text-lg min-[400px]:text-xl sm:text-xl md:text-2xl font-black uppercase tracking-tight leading-none pt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${card.nameGradient} group-hover:scale-105 transition-transform origin-left`}
                  >
                    {card.title}
                  </h2>

                  {/* Short Full Description */}
                  <p className="text-[9.5px] sm:text-[10.5px] md:text-[11px] text-neutral-200/90 leading-snug pt-1 font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Right-Side Vertical Tech Stripe (Strictly fixed uniform width across all cards) */}
                <div
                  className={`relative z-30 w-[36px] sm:w-[40px] md:w-[44px] min-w-[36px] sm:min-w-[40px] md:min-w-[44px] max-w-[36px] sm:max-w-[40px] md:max-w-[44px] h-full ${card.sidebarBg} flex flex-col items-center justify-between py-3 sm:py-3.5 px-0.5 shrink-0 shadow-lg border-l border-black/10`}
                >
                  {/* Top Category Number Pill */}
                  <div className="bg-black text-white font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-[2px] tracking-wider leading-none shadow">
                    {card.categoryNum}
                  </div>

                  {/* Middle Vertical Rotated Title */}
                  <div className="writing-vertical font-black tracking-wider text-[9px] sm:text-[10px] text-black uppercase select-none my-auto whitespace-nowrap">
                    {card.sidebarText}
                  </div>

                  {/* Bottom Tech Target Circle Icon */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black/20 flex items-center justify-center">
                    <CircleDot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
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








