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
  Crown,
  Sparkles,
  ShieldCheck,
  Star,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { listings, deals, users } = useStore();

  const sellCount = listings.filter((l) => l.type === "sell").length;
  const buyCount = listings.filter((l) => l.type === "sell").length;
  const tradeCount = listings.filter((l) => l.type === "trade").length;
  const lookingForCount = listings.filter((l) => l.type === "looking_for").length;
  const verifiedCount = users.filter((u) => u.verified).length;

  const cards = [
    {
      id: "sell",
      act: "Acto I",
      title: "VERKAUFEN",
      subtitle: "SELL",
      description: "Biete Einzelkarten zum Festpreis an oder reiche Sammlungen ein.",
      href: "/sell",
      bgImage: "/tiles/tile-sell.jpg",
      shadowClass: "arcane-card-shadow-sell",
      borderColor: "border-amber-500/50 group-hover:border-amber-400",
      accentGlow: "rgba(245, 158, 11, 0.4)",
      bottomFlare: "from-amber-500/40 via-amber-600/20 to-transparent",
      accentBadge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      taglineColor: "text-amber-300",
      countText: `${sellCount} Angebote`,
      icon: <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />,
      hasBulkLink: true,
      slantClass: "sm:-skew-y-2 sm:-rotate-1",
    },
    {
      id: "buy",
      act: "Acto II",
      title: "KAUFEN",
      subtitle: "BUY",
      description: "Entdecke seltene Einzelkarten aus der aktiven Community.",
      href: "/buy",
      bgImage: "/tiles/tile-buy.jpg",
      shadowClass: "arcane-card-shadow-buy",
      borderColor: "border-cyan-500/50 group-hover:border-cyan-400",
      accentGlow: "rgba(6, 182, 212, 0.4)",
      bottomFlare: "from-cyan-500/40 via-cyan-600/20 to-transparent",
      accentBadge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      taglineColor: "text-cyan-300",
      countText: `${buyCount} Karten`,
      icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />,
      slantClass: "sm:-skew-y-2",
    },
    {
      id: "trade",
      act: "Acto III",
      title: "TAUSCHEN",
      subtitle: "TRADE",
      description: "Tausche Karten 1:1 mit transparentem ETV-Wertvergleich.",
      href: "/trade",
      bgImage: "/tiles/tile-trade.jpg",
      shadowClass: "arcane-card-shadow-trade",
      borderColor: "border-fuchsia-500/50 group-hover:border-fuchsia-400",
      accentGlow: "rgba(217, 70, 239, 0.4)",
      bottomFlare: "from-fuchsia-500/40 via-purple-600/20 to-transparent",
      accentBadge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
      taglineColor: "text-fuchsia-300",
      countText: `${tradeCount} Trades`,
      icon: <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />,
      slantClass: "sm:-skew-y-2",
      showStar: true,
    },
    {
      id: "looking-for",
      act: "Acto IV",
      title: "GESUCHE",
      subtitle: "SEEK",
      description: "Finde Grail-Karten und lass Verkäufer dich direkt kontaktieren.",
      href: "/looking-for",
      bgImage: "/tiles/tile-looking-for.jpg",
      shadowClass: "arcane-card-shadow-look",
      borderColor: "border-emerald-500/50 group-hover:border-emerald-400",
      accentGlow: "rgba(16, 185, 129, 0.4)",
      bottomFlare: "from-emerald-500/40 via-teal-600/20 to-transparent",
      accentBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      taglineColor: "text-emerald-300",
      countText: `${lookingForCount} Gesuche`,
      icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />,
      slantClass: "sm:-skew-y-2 sm:rotate-1",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-between overflow-x-hidden select-none">
      {/* Background Video with Dark Moody Backdrop */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.15]"
        >
          <source src="/Dragon_BG.mp4" type="video/mp4" />
        </video>
        {/* Deep atmospheric overlay matching screenshot ambience */}
        <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-[1px]" />
      </div>

      {/* Central Ambient Radial Glow behind the cards */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-purple-900/25 via-fuchsia-900/20 to-cyan-900/20 blur-[120px] -z-20" />

      {/* Ambient Graphic Doodles matching the Screenshot */}
      {/* Left side: Dotted spiral loop & Neon Magenta Cross */}
      <div className="pointer-events-none absolute left-2 lg:left-8 top-1/3 -translate-y-1/2 w-48 h-64 -z-10 hidden sm:block opacity-60">
        <svg
          viewBox="0 0 150 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full stroke-white/40"
        >
          <path
            d="M20 180 C 10 130, 80 110, 70 60 C 60 20, 10 30, 20 70 C 30 110, 120 130, 130 170"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        </svg>
        {/* Magenta cross doodle */}
        <div className="absolute bottom-6 left-6 text-fuchsia-400 text-3xl font-black rotate-12 drop-shadow-[0_0_12px_rgba(236,72,153,0.9)] animate-pulse">
          ✕
        </div>
      </div>

      {/* Right side: Dashed trajectory, pink dot, white circle ring */}
      <div className="pointer-events-none absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 w-40 h-64 -z-10 hidden sm:block opacity-70">
        <svg
          viewBox="0 0 120 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full stroke-white/40"
        >
          <path
            d="M10 30 C 50 40, 90 90, 80 140 C 70 170, 40 160, 30 140"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        </svg>
        {/* Glowing pink dot */}
        <div className="absolute top-16 right-10 w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_16px_rgba(236,72,153,1)]" />
        {/* Crisp hollow circle ring */}
        <div className="absolute top-28 right-8 w-4 h-4 rounded-full border-2 border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>

      {/* Top Header Bar styled like Screenshot */}
      <header className="pt-6 sm:pt-8 pb-4 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Top Left: Stylized Neon/Graffiti Header ("LÍNEA TEMPORAL" aesthetic) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            {/* Top Brush Neon Script */}
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 arcane-title-brush drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              MANA
            </span>
            {/* Heavy Condensed White Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] -mt-1 sm:-mt-2">
              BEREICHE
            </h1>
          </motion.div>

          {/* Top Right: Screenshot-style Minimalist Line & "SINOPSIS" */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 sm:gap-6 self-start sm:self-end pb-2 w-full sm:w-auto"
          >
            <div className="h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-white/70 flex-1 sm:w-48 lg:w-72" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-neutral-300 uppercase whitespace-nowrap">
              SINOPSIS
            </span>
          </motion.div>
        </div>
      </header>

      {/* Main 4 Cards in ONE Horizontal Line */}
      <main className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Cards Row: Horizontal Grid on sm/md/lg/xl, Horizontal Snap Row on Mobile */}
        <div className="flex flex-row overflow-x-auto sm:grid sm:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6 no-scrollbar snap-x snap-mandatory pt-4 pb-8 sm:pb-4 px-1 -mx-1">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              onClick={() => router.push(card.href)}
              className={`group relative w-[76vw] max-w-[280px] sm:w-auto shrink-0 snap-center cursor-pointer transition-all duration-400 ease-out hover:-translate-y-4 hover:scale-[1.03] ${card.slantClass} hover:skew-y-0 hover:rotate-0`}
            >
              {/* Outer Glow Backlight at Bottom */}
              <div
                className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-10 rounded-full blur-xl opacity-70 group-hover:opacity-100 group-hover:w-full group-hover:h-14 transition-all duration-400 pointer-events-none bg-gradient-to-t ${card.bottomFlare}`}
              />

              {/* Main Card Container with Slanted Border & Glow */}
              <div
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 ${card.borderColor} bg-[#0a0d14] ${card.shadowClass} flex flex-col justify-between aspect-[9/14] sm:aspect-[9/15] lg:aspect-[9/14.5] min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] transition-all duration-400`}
              >
                {/* Full-Bleed Artwork Image Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={card.bgImage}
                    alt={card.title}
                    className="w-full h-full object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Top Vignette */}
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent z-10" />

                  {/* Dark Cinematic Bottom Gradient for High Legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#06080d] via-[#06080d]/85 to-transparent z-10" />

                  {/* Neon Color Accent Light Glow */}
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-screen group-hover:opacity-45 transition-opacity duration-400 z-10"
                    style={{
                      background: `radial-gradient(circle at 50% 90%, ${card.accentGlow}, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Top Header inside Card */}
                <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between">
                  {/* Category Pill Tag */}
                  <span
                    className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${card.accentBadge}`}
                  >
                    {card.countText}
                  </span>

                  {/* Top-Right Circular Badge (Star / Category icon in Glowing Ring) */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/80 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300">
                    {card.showStar ? (
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                    ) : (
                      card.icon
                    )}
                  </div>
                </div>

                {/* Bottom Content Area matching Screenshot */}
                <div className="relative z-20 p-4 sm:p-5 pt-0 space-y-1.5 sm:space-y-2">
                  {/* "Acto I", "Acto II", "Acto III", "Acto IV" Small Tracked Subtitle */}
                  <div className="text-[11px] sm:text-xs font-semibold text-neutral-300/90 tracking-wider uppercase drop-shadow">
                    {card.act}
                  </div>

                  {/* Large Bold Condensed Main Title (e.g. INICIOS / VERKAUFEN) */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] group-hover:text-white transition-colors">
                    {card.title}
                  </h2>

                  {/* Subtitle / Description */}
                  <p className="text-[11px] sm:text-xs text-neutral-300/80 line-clamp-2 leading-snug pt-0.5">
                    {card.description}
                  </p>

                  {/* Action Link & Bulk Ankauf Option */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(card.href);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all duration-200 min-h-[44px] flex-1 group-hover:border-white/40"
                    >
                      <span>Öffnen</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Quick Link for Bulk-Ankauf on Sell */}
                    {card.hasBulkLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/sell/bulk");
                        }}
                        title="Bulk-Ankauf durch Manacards"
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md transition-all duration-200 min-h-[44px] shrink-0"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span className="hidden xl:inline ml-1">Bulk</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint Indicator */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] text-neutral-400 mt-2">
          <span>Horizontal wischen für alle 4 Bereiche</span>
          <ChevronRight className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
        </div>
      </main>

      {/* Footer Stats Pill Bar */}
      <footer className="py-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-neutral-300"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{listings.length} Aktive Angebote</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{verifiedCount} Verifizierte Sammler</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{deals.length} Erfolgreiche Deals</span>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}

