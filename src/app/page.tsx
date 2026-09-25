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
      pokemonTag: "GENGAR • #094",
      title: "VERKAUFEN",
      nameGradient: "from-rose-400 via-pink-200 to-white",
      description: "Einzelkarten & Sammlungen anbieten.",
      href: "/sell",
      pokemonImg: "/pokemon/gengar.png",
      cardBg: "from-pink-950/25 via-purple-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-pink-500/90 via-rose-500/90 to-fuchsia-600/90",
      borderColor: "border-pink-500/30 group-hover:border-pink-400/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(236,72,153,0.45)]",
      patternColor: "rgba(244, 114, 182, 0.05)",
    },
    {
      id: "buy",
      categoryNum: "02",
      sidebarText: "BUY // KAUFEN",
      pokemonTag: "PIKACHU • #025",
      title: "KAUFEN",
      nameGradient: "from-cyan-300 via-amber-200 to-white",
      description: "Seltene Karten im Markt entdecken.",
      href: "/buy",
      pokemonImg: "/pokemon/pikachu.png",
      cardBg: "from-cyan-950/25 via-sky-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-cyan-400/90 via-sky-400/90 to-teal-400/90",
      borderColor: "border-cyan-400/30 group-hover:border-cyan-300/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]",
      patternColor: "rgba(6, 182, 212, 0.05)",
    },
    {
      id: "trade",
      categoryNum: "03",
      sidebarText: "TRADE // TAUSCHEN",
      pokemonTag: "MEWTU • #150",
      title: "TAUSCHEN",
      nameGradient: "holo-text-jinx",
      description: "Karten 1:1 mit ETV-Ausgleich tauschen.",
      href: "/trade",
      pokemonImg: "/pokemon/mewtwo.png",
      cardBg: "from-purple-950/25 via-fuchsia-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-purple-400/90 via-fuchsia-400/90 to-pink-500/90",
      borderColor: "border-purple-400/30 group-hover:border-fuchsia-300/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(217,70,239,0.45)]",
      patternColor: "rgba(217, 70, 239, 0.05)",
    },
    {
      id: "looking-for",
      categoryNum: "04",
      sidebarText: "SEEK // GESUCHE",
      pokemonTag: "GLURAK • #006",
      title: "GESUCHE",
      nameGradient: "from-amber-400 via-orange-200 to-white",
      description: "Holy Grail Gesuche live schalten.",
      href: "/looking-for",
      pokemonImg: "/pokemon/charizard.png",
      cardBg: "from-amber-950/25 via-orange-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-amber-400/90 via-orange-500/90 to-red-500/90",
      borderColor: "border-orange-400/30 group-hover:border-amber-300/80",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(249,115,22,0.45)]",
      patternColor: "rgba(249, 115, 22, 0.05)",
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
              className="group relative w-[160px] min-[400px]:w-[178px] sm:w-[195px] md:w-[218px] lg:w-[238px] h-[280px] min-[400px]:h-[310px] sm:h-[330px] md:h-[360px] lg:h-[385px] shrink-0 snap-center cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-3"
            >
              {/* 3D Popping Pokemon (Extends ABOVE top edge and expands on hover for all 4!) */}
              <div className="absolute -top-10 sm:-top-14 inset-x-0 h-[75%] sm:h-[78%] z-20 flex items-center justify-center pointer-events-none">
                <img
                  src={card.pokemonImg}
                  alt={card.title}
                  className="w-[86%] sm:w-[90%] h-auto max-h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] transform scale-100 group-hover:scale-115 sm:group-hover:scale-120 group-hover:-translate-y-3 transition-all duration-300 ease-out"
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

                {/* Left/Center Content Area */}
                <div className="relative z-30 flex-1 flex flex-col justify-end p-3.5 sm:p-4 pr-1.5 pb-3.5 sm:pb-4">
                  {/* Translucent dark gradient behind text for high legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/50 to-transparent -z-10" />

                  {/* Pokemon Tag Line (e.g. GENGAR • #094) */}
                  <div className="text-[9px] sm:text-[10px] font-bold tracking-wider text-neutral-300 uppercase flex items-center gap-1 drop-shadow">
                    <span>{card.pokemonTag}</span>
                  </div>

                  {/* Large Bold Category Title (VERKAUFEN, KAUFEN, TAUSCHEN, GESUCHE) */}
                  <h2
                    className={`text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-none pt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${
                      card.nameGradient.includes("holo")
                        ? card.nameGradient
                        : `text-transparent bg-clip-text bg-gradient-to-r ${card.nameGradient}`
                    } group-hover:scale-105 transition-transform origin-left`}
                  >
                    {card.title}
                  </h2>

                  {/* Short Description */}
                  <p className="text-[9px] sm:text-[11px] text-neutral-200/80 line-clamp-1 leading-tight pt-1 font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Right-Side Vertical Tech Stripe */}
                <div
                  className={`relative z-30 w-8 sm:w-9 lg:w-10 h-full ${card.sidebarBg} flex flex-col items-center justify-between py-3 sm:py-3.5 px-0.5 shrink-0 shadow-lg border-l border-black/10`}
                >
                  {/* Top Category Number Pill */}
                  <div className="bg-black text-white font-black text-[9px] sm:text-[10px] px-1 py-0.5 rounded-[2px] tracking-wider leading-none shadow">
                    {card.categoryNum}
                  </div>

                  {/* Middle Vertical Rotated Title */}
                  <div className="writing-vertical font-black tracking-widest text-[9px] sm:text-[10px] text-black uppercase select-none my-auto">
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






