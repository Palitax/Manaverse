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
      pokedexTag: "POKÉDEX #094 • SELL",
      name: "GENGAR",
      nameGradient: "from-rose-400 via-pink-200 to-white",
      description: "Biete Einzelkarten zum Festpreis oder Sammlungen per Sofort-Ankauf an.",
      href: "/sell",
      pokemonImg: "/pokemon/gengar.png",
      cardBg: "from-[#2f0d3a] via-[#1a0724] to-[#09020f]",
      sidebarBg: "bg-gradient-to-b from-pink-500 via-rose-500 to-fuchsia-600",
      borderColor: "border-pink-500/40 group-hover:border-pink-400/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]",
      patternColor: "rgba(244, 114, 182, 0.08)",
      imgScale: "scale-[1.12] sm:scale-[1.16]",
    },
    {
      id: "buy",
      categoryNum: "02",
      sidebarText: "BUY // KAUFEN",
      pokedexTag: "POKÉDEX #025 • BUY",
      name: "PIKACHU",
      nameGradient: "from-cyan-300 via-amber-200 to-white",
      description: "Entdecke seltene Einzelkarten aus der Community mit Sofort-Filtern.",
      href: "/buy",
      pokemonImg: "/pokemon/pikachu.png",
      cardBg: "from-[#0a2738] via-[#061724] to-[#020b12]",
      sidebarBg: "bg-gradient-to-b from-cyan-400 via-sky-400 to-teal-400",
      borderColor: "border-cyan-400/40 group-hover:border-cyan-300/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]",
      patternColor: "rgba(6, 182, 212, 0.08)",
      imgScale: "scale-[1.15] sm:scale-[1.20]",
    },
    {
      id: "trade",
      categoryNum: "03",
      sidebarText: "TRADE // TAUSCHEN",
      pokedexTag: "POKÉDEX #150 • TRADE",
      name: "MEWTU",
      nameGradient: "holo-text-jinx",
      description: "Tausche Karten 1:1 mit transparentem ETV-Wertausgleich im Card Nexus.",
      href: "/trade",
      pokemonImg: "/pokemon/mewtwo.png",
      cardBg: "from-[#320f40] via-[#1c0826] to-[#0a0210]",
      sidebarBg: "bg-gradient-to-b from-purple-400 via-fuchsia-400 to-pink-500",
      borderColor: "border-purple-400/40 group-hover:border-fuchsia-300/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(217,70,239,0.4)]",
      patternColor: "rgba(217, 70, 239, 0.08)",
      imgScale: "scale-[1.22] sm:scale-[1.28]",
    },
    {
      id: "looking-for",
      categoryNum: "04",
      sidebarText: "SEEK // GESUCHE",
      pokedexTag: "POKÉDEX #006 • SEEK",
      name: "GLURAK",
      nameGradient: "from-amber-400 via-orange-200 to-white",
      description: "Starte Gesuche nach deinen Holy Grails und lass Verkäufer dich finden.",
      href: "/looking-for",
      pokemonImg: "/pokemon/charizard.png",
      cardBg: "from-[#3d1607] via-[#240b03] to-[#0e0301]",
      sidebarBg: "bg-gradient-to-b from-amber-400 via-orange-500 to-red-500",
      borderColor: "border-orange-400/40 group-hover:border-amber-300/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]",
      patternColor: "rgba(249, 115, 22, 0.08)",
      imgScale: "scale-[1.25] sm:scale-[1.32]",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-x-hidden select-none py-6 sm:py-10">
      {/* Background Video with Clean Transparency */}
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
        {/* Cinematic gradient scrim so background dragon is clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b10]/40 via-black/20 to-[#090b10]/65" />
      </div>

      {/* Main 4 Cards in ONE Horizontal Line */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 overflow-visible flex items-center justify-center">
        <div className="flex flex-row items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-4 sm:gap-5 lg:gap-6 no-scrollbar pt-16 sm:pt-20 pb-10 px-2">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              onClick={() => router.push(card.href)}
              className="group relative w-[210px] min-[400px]:w-[230px] sm:w-[245px] md:w-[265px] lg:w-[285px] h-[370px] min-[400px]:h-[400px] sm:h-[420px] md:h-[450px] lg:h-[475px] shrink-0 snap-center cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-3"
            >
              {/* 3D Popping Pokemon (Extends ABOVE the top of the card frame!) */}
              <div className="absolute -top-12 sm:-top-16 inset-x-0 h-[75%] sm:h-[78%] z-20 flex items-center justify-center pointer-events-none">
                <img
                  src={card.pokemonImg}
                  alt={card.name}
                  className={`w-[84%] sm:w-[88%] h-auto max-h-full object-contain ${card.imgScale} filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.85)] group-hover:scale-125 group-hover:-translate-y-3 transition-all duration-400 ease-out`}
                />
              </div>

              {/* Main Card Box Container */}
              <div
                className={`relative w-full h-full rounded-2xl sm:rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.cardBg} ${card.glowColor} overflow-hidden shadow-2xl flex flex-row justify-between transition-all duration-300`}
              >
                {/* Background Tech Texture / Halftone Grid */}
                <div
                  className="absolute inset-0 z-0 opacity-40 halftone-pattern"
                  style={{
                    backgroundColor: card.patternColor,
                  }}
                />

                {/* Subtle Top Inner Highlight */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

                {/* Left/Center Content Area */}
                <div className="relative z-30 flex-1 flex flex-col justify-end p-4 sm:p-5 pr-2">
                  {/* Dark gradient behind text for supreme readability */}
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/75 to-transparent -z-10" />

                  {/* Metadata Tag Line (e.g. POKÉDEX #094 • SELL) */}
                  <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5 drop-shadow">
                    <span>{card.pokedexTag}</span>
                  </div>

                  {/* Large Bold Pokemon Name */}
                  <h2
                    className={`text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none pt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] ${
                      card.nameGradient.includes("holo")
                        ? card.nameGradient
                        : `text-transparent bg-clip-text bg-gradient-to-r ${card.nameGradient}`
                    } group-hover:scale-105 transition-transform origin-left`}
                  >
                    {card.name}
                  </h2>

                  {/* Description Line */}
                  <p className="text-[10px] sm:text-xs text-neutral-300/80 line-clamp-2 leading-snug pt-1.5 font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Right-Side Vertical Tech Stripe (Exact match to screenshot!) */}
                <div
                  className={`relative z-30 w-9 sm:w-11 h-full ${card.sidebarBg} flex flex-col items-center justify-between py-3.5 sm:py-4 px-1 shrink-0 shadow-lg border-l border-black/10`}
                >
                  {/* Top Category Number Pill (e.g. 01, 02, 03, 04) */}
                  <div className="bg-black text-white font-black text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-[3px] tracking-wider leading-none shadow">
                    {card.categoryNum}
                  </div>

                  {/* Middle Vertical Rotated Title (e.g. SELL // VERKAUFEN) */}
                  <div className="writing-vertical font-black tracking-widest text-[10px] sm:text-[11px] text-black uppercase select-none my-auto">
                    {card.sidebarText}
                  </div>

                  {/* Bottom Tech Target Circle Icon */}
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/15 flex items-center justify-center">
                    <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
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




