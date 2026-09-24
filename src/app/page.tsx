"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import {
  ShoppingBag,
  ArrowLeftRight,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Crown,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { listings, deals, users } = useStore();

  const sellCount = listings.filter((l) => l.type === "sell").length;
  const buyCount = listings.filter((l) => l.type === "sell").length;
  const tradeCount = listings.filter((l) => l.type === "trade").length;
  const lookingForCount = listings.filter((l) => l.type === "looking_for").length;
  const verifiedCount = users.filter((u) => u.verified).length;

  const tiles = [
    {
      id: "sell",
      title: "Sell (Verkaufen)",
      tagline: "SCHMIEDE DEIN ANGEBOT",
      description:
        "Biete Einzelkarten zum Festpreis an oder reiche ganze Sammlungen zur schnellen Prüfung und Übernahme an Manacards ein.",
      href: "/sell",
      bgImage: "/tiles/tile-sell.jpg",
      accentColor: "from-amber-500/30 to-emerald-500/30",
      borderColor: "border-amber-500/30 group-hover:border-amber-400/60",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]",
      badgeText: `${sellCount} Angebote aktiv`,
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      ctaText: "Karten anbieten",
      hasBulkLink: true,
    },
    {
      id: "buy",
      title: "Buy (Kaufen)",
      tagline: "MYSTISCHER MARKTPLATZ",
      description:
        "Entdecke seltene Einzelkarten aus der Community. Filtere blitzschnell nach Edition, Sprache und Erhaltungszustand.",
      href: "/buy",
      bgImage: "/tiles/tile-buy.jpg",
      accentColor: "from-cyan-500/30 to-blue-500/30",
      borderColor: "border-cyan-500/30 group-hover:border-cyan-400/60",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]",
      badgeText: `${buyCount} Karten verfügbar`,
      icon: <ShoppingBag className="w-5 h-5 text-cyan-400" />,
      ctaText: "Marktplatz entdecken",
    },
    {
      id: "trade",
      title: "Trade (Tauschen)",
      tagline: "CARD SWAP NEXUS",
      description:
        "Stelle eigene Tauschkarten ein und erhalte faire Gegenangebote anderer Sammler inklusive transparentem ETV-Wert.",
      href: "/trade",
      bgImage: "/tiles/tile-trade.jpg",
      accentColor: "from-purple-500/30 to-pink-500/30",
      borderColor: "border-purple-500/30 group-hover:border-purple-400/60",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]",
      badgeText: `${tradeCount} Trades offen`,
      icon: <ArrowLeftRight className="w-5 h-5 text-purple-400" />,
      ctaText: "Trades ansehen & tauschen",
    },
    {
      id: "looking-for",
      title: "Looking For (Gesuche)",
      tagline: "RADAR & WANT-LIST",
      description:
        "Fehlt dir noch das Master-Set Piece oder dein Holy Grail? Starte ein Gesuch mit deinem Budget und lass Verkäufer dich finden.",
      href: "/looking-for",
      bgImage: "/tiles/tile-looking-for.jpg",
      accentColor: "from-teal-500/30 to-emerald-500/30",
      borderColor: "border-teal-500/30 group-hover:border-teal-400/60",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(20,184,166,0.25)]",
      badgeText: `${lookingForCount} Gesuche aktiv`,
      icon: <Search className="w-5 h-5 text-teal-400" />,
      ctaText: "Gesuche durchstöbern",
    },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-between overflow-x-hidden">
      {/* Background Video with Mobile & Desktop Optimization */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        >
          <source src="/Dragon_BG.mp4" type="video/mp4" />
        </video>
        {/* Dark cinematic gradient scrim for high contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b10]/80 via-[#090b10]/70 to-[#090b10]/95 backdrop-blur-[0.5px]" />
      </div>

      {/* Ambient background glow matching the Manaforge blue aesthetic */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-cyan-600/15 via-indigo-600/10 to-transparent blur-3xl -z-10" />

      {/* Hero Welcome Header */}
      <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Glowing Flask Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="/manaforge-icon.png"
              alt="Manaforge Flask"
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-cyan-200">
            Willkommen in der Manaforge
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
        >
          Wähle deinen{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300">
            Bereich
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed"
        >
          Die offizielle Community-Plattform für Sammelkarten. Kaufe, verkaufe, tausche oder finde deine Traumkarten direkt im Netzwerk.
        </motion.p>

        {/* Compact stats pill bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-neutral-300"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{listings.length} Aktive Angebote</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{verifiedCount} Verifizierte Sammler</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{deals.length} Erfolgreiche Deals</span>
          </div>
        </motion.div>
      </section>

      {/* The 4 Graphical Tiles (Core Selection) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              onClick={() => router.push(tile.href)}
              className={`group relative overflow-hidden rounded-3xl border ${tile.borderColor} ${tile.glowColor} bg-[#0c1019] shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[310px] sm:min-h-[350px] lg:min-h-[370px]`}
            >
              {/* High-Resolution Artwork Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={tile.bgImage}
                  alt={tile.title}
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Multi-layered dark gradient overlay for optimal text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/80 to-[#080b11]/35 group-hover:via-[#080b11]/70 transition-colors duration-300" />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tile.accentColor} opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-300`}
                />
              </div>

              {/* Card Header Content */}
              <div className="relative z-10 p-5 sm:p-7 flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 border border-white/10">
                      {tile.tagline}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 pt-1 group-hover:text-cyan-200 transition-colors">
                    {tile.title}
                  </h2>
                </div>

                {/* Badge with count */}
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-sm shrink-0 ${tile.badgeColor}`}
                >
                  {tile.badgeText}
                </span>
              </div>

              {/* Card Body & Action Bottom */}
              <div className="relative z-10 p-5 sm:p-7 pt-0 space-y-4">
                <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed font-normal max-w-lg">
                  {tile.description}
                </p>

                {/* Interactive Action Row */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(tile.href);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg transition-all duration-200 min-h-[44px] group-hover:border-white/40"
                  >
                    <span>{tile.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Special secondary link for Sell (Bulk collection purchase by Manacards) */}
                  {tile.hasBulkLink && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/sell/bulk");
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 border border-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-md transition-all duration-200 min-h-[44px]"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bulk-Ankauf</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
