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
      pokemonImg: "/pokemon/stylized-gengar.png",
      cardBg: "from-pink-950/25 via-purple-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-pink-500/90 via-rose-500/90 to-fuchsia-600/90",
      borderColor: "border-pink-500/30 group-hover:border-pink-400/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.45)]",
      patternColor: "rgba(244, 114, 182, 0.05)",
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
      pokemonImg: "/pokemon/stylized-pikachu.png",
      cardBg: "from-cyan-950/25 via-sky-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-cyan-400/90 via-sky-400/90 to-teal-400/90",
      borderColor: "border-cyan-400/30 group-hover:border-cyan-300/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.45)]",
      patternColor: "rgba(6, 182, 212, 0.05)",
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
      pokemonImg: "/pokemon/stylized-mewtwo.png",
      cardBg: "from-purple-950/25 via-fuchsia-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-purple-400/90 via-fuchsia-400/90 to-pink-500/90",
      borderColor: "border-purple-400/30 group-hover:border-fuchsia-300/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(217,70,239,0.45)]",
      patternColor: "rgba(217, 70, 239, 0.05)",
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
      pokemonImg: "/pokemon/stylized-charizard.png",
      cardBg: "from-amber-950/25 via-orange-950/15 to-black/40",
      sidebarBg: "bg-gradient-to-b from-amber-400/90 via-orange-500/90 to-red-500/90",
      borderColor: "border-orange-400/30 group-hover:border-amber-300/80",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.45)]",
      patternColor: "rgba(249, 115, 22, 0.05)",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-x-hidden select-none py-6 sm:py-10">
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
              {/* 3D Popping Pokemon (Extends ABOVE the top edge and grows on hover for all 4!) */}
              <div className="absolute -top-14 sm:-top-20 inset-x-0 h-[80%] sm:h-[84%] z-20 flex items-center justify-center pointer-events-none">
                <img
                  src={card.pokemonImg}
                  alt={card.name}
                  className="w-[90%] sm:w-[94%] h-auto max-h-full object-contain filter drop-shadow-[0_16px_25px_rgba(0,0,0,0.9)] transform scale-100 group-hover:scale-115 sm:group-hover:scale-120 group-hover:-translate-y-4 transition-all duration-300 ease-out"
                />
              </div>

              {/* Main Card Box Container (Transparent Glass with Backdrop Blur) */}
              <div
                className={`relative w-full h-full rounded-2xl sm:rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.cardBg} backdrop-blur-md ${card.glowColor} overflow-hidden shadow-2xl flex flex-row justify-between transition-all duration-300`}
              >
                {/* Background Tech Texture / Halftone Grid */}
                <div
                  className="absolute inset-0 z-0 opacity-25 halftone-pattern pointer-events-none"
                  style={{
                    backgroundColor: card.patternColor,
                  }}
                />

                {/* Subtle Top Glass Reflection */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

                {/* Left/Center Content Area */}
                <div className="relative z-30 flex-1 flex flex-col justify-end p-4 sm:p-5 pr-2">
                  {/* Translucent dark gradient behind text for high legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/50 to-transparent -z-10" />

                  {/* Metadata Tag Line (e.g. POKÉDEX #094 • SELL) */}
                  <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-neutral-300 uppercase flex items-center gap-1.5 drop-shadow">
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
                  <p className="text-[10px] sm:text-xs text-neutral-200/85 line-clamp-2 leading-snug pt-1.5 font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Right-Side Vertical Tech Stripe */}
                <div
                  className={`relative z-30 w-9 sm:w-11 h-full ${card.sidebarBg} flex flex-col items-center justify-between py-3.5 sm:py-4 px-1 shrink-0 shadow-lg border-l border-black/10`}
                >
                  {/* Top Category Number Pill */}
                  <div className="bg-black text-white font-black text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-[3px] tracking-wider leading-none shadow">
                    {card.categoryNum}
                  </div>

                  {/* Middle Vertical Rotated Title */}
                  <div className="writing-vertical font-black tracking-widest text-[10px] sm:text-[11px] text-black uppercase select-none my-auto">
                    {card.sidebarText}
                  </div>

                  {/* Bottom Tech Target Circle Icon */}
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/20 flex items-center justify-center">
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





