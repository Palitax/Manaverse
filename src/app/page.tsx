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
      cardBg: "from-pink-950/20 via-purple-950/10 to-black/35",
      sidebarBg: "bg-gradient-to-b from-pink-500/90 via-rose-500/90 to-fuchsia-600/90",
      borderColor: "border-pink-500/30 group-hover:border-pink-400/80",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]",
      patternColor: "rgba(244, 114, 182, 0.04)",
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
      cardBg: "from-cyan-950/20 via-sky-950/10 to-black/35",
      sidebarBg: "bg-gradient-to-b from-cyan-400/90 via-sky-400/90 to-teal-400/90",
      borderColor: "border-cyan-400/30 group-hover:border-cyan-300/80",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
      patternColor: "rgba(6, 182, 212, 0.04)",
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
      cardBg: "from-purple-950/20 via-fuchsia-950/10 to-black/35",
      sidebarBg: "bg-gradient-to-b from-purple-400/90 via-fuchsia-400/90 to-pink-500/90",
      borderColor: "border-purple-400/30 group-hover:border-fuchsia-300/80",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]",
      patternColor: "rgba(217, 70, 239, 0.04)",
      imgClass: "w-[95%] sm:w-[98%] scale-[1.08]",
    },
    {
      id: "looking-for",
      categoryNum: "04",
      sidebarText: "SEEK // GESUCHT",
      title: "GESUCHT",
      nameGradient: "holo-text-look",
      description: "Eigene Wunschkarten ausschreiben.",
      href: "/looking-for",
      pokemonImg: "/pokemon/charizard.png",
      cardBg: "from-amber-950/20 via-orange-950/10 to-black/35",
      sidebarBg: "bg-gradient-to-b from-amber-400/90 via-orange-500/90 to-red-500/90",
      borderColor: "border-orange-400/30 group-hover:border-amber-300/80",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]",
      patternColor: "rgba(249, 115, 22, 0.04)",
      imgClass: "w-[98%] sm:w-[102%] scale-[1.10]",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-x-hidden select-none py-4 sm:py-6">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
      </div>

      {/* Main 4 Cards in ONE Horizontal Line */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 overflow-visible flex items-center justify-center">
        <div className="flex flex-row items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-2.5 min-[390px]:gap-3 sm:gap-3.5 md:gap-4 lg:gap-5 no-scrollbar pt-10 sm:pt-14 pb-6 px-2">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              onClick={() => router.push(card.href)}
              className="group relative w-[138px] min-[390px]:w-[155px] sm:w-[175px] md:w-[195px] lg:w-[215px] h-[245px] min-[390px]:h-[270px] sm:h-[295px] md:h-[325px] lg:h-[350px] shrink-0 snap-center cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2.5"
            >
              {/* 3D Popping Pokemon (Extends ABOVE top edge and expands on hover for all 4!) */}
              <div className="absolute -top-9 min-[390px]:-top-11 sm:-top-13 inset-x-0 h-[68%] sm:h-[72%] z-20 flex items-center justify-center pointer-events-none">
                <img
                  src={card.pokemonImg}
                  alt={card.title}
                  className={`${card.imgClass} h-auto max-h-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.85)] transform group-hover:scale-120 sm:group-hover:scale-125 group-hover:-translate-y-3 transition-all duration-300 ease-out`}
                />
              </div>

              {/* Main Card Box Container (Transparent Glass with Backdrop Blur) */}
              <div
                className={`relative w-full h-full rounded-xl sm:rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.cardBg} backdrop-blur-sm ${card.glowColor} overflow-hidden shadow-xl flex flex-row justify-between transition-all duration-300`}
              >
                {/* Background Tech Texture / Halftone Grid */}
                <div
                  className="absolute inset-0 z-0 opacity-15 halftone-pattern pointer-events-none"
                  style={{
                    backgroundColor: card.patternColor,
                  }}
                />

                {/* Subtle Top Glass Reflection */}
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

                {/* Left/Center Content Area (with min-w-0 to prevent pushing the fixed sidebar) */}
                <div className="relative z-30 flex-1 min-w-0 flex flex-col justify-end p-2 min-[390px]:p-2.5 sm:p-3 pr-1 sm:pr-1.5 pb-2.5 min-[390px]:pb-3 sm:pb-3.5">
                  {/* Translucent dark gradient behind text for high legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/50 to-transparent -z-10" />

                  {/* Category Title with Adjusted Sizing */}
                  <h2
                    className={`text-sm min-[390px]:text-base sm:text-lg md:text-xl font-black uppercase tracking-tight leading-none pt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${card.nameGradient} group-hover:scale-105 transition-transform origin-left`}
                  >
                    {card.title}
                  </h2>

                  {/* Short Full Description */}
                  <p className="text-[8px] min-[390px]:text-[9px] sm:text-[9.5px] md:text-[10px] text-neutral-200/90 leading-snug pt-1 font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Right-Side Vertical Tech Stripe (Strictly fixed uniform width across all cards) */}
                <div
                  className={`relative z-30 w-[30px] min-[390px]:w-[34px] sm:w-[38px] md:w-[40px] min-w-[30px] min-[390px]:min-w-[34px] sm:min-w-[38px] md:min-w-[40px] max-w-[30px] min-[390px]:max-w-[34px] sm:max-w-[38px] md:max-w-[40px] h-full ${card.sidebarBg} flex flex-col items-center justify-between py-2.5 sm:py-3 px-0.5 shrink-0 shadow-lg border-l border-black/10`}
                >
                  {/* Top Category Number Pill */}
                  <div className="bg-black text-white font-black text-[8px] sm:text-[9px] px-1 py-0.5 rounded-[2px] tracking-wider leading-none shadow">
                    {card.categoryNum}
                  </div>

                  {/* Middle Vertical Rotated Title */}
                  <div className="writing-vertical font-black tracking-wider text-[8px] min-[390px]:text-[8.5px] sm:text-[9.5px] text-black uppercase select-none my-auto whitespace-nowrap">
                    {card.sidebarText}
                  </div>

                  {/* Bottom Tech Target Circle Icon */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/20 flex items-center justify-center">
                    <CircleDot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black" />
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








