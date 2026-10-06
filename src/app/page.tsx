"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CircleDot,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Flame,
  ShoppingBag,
  PlusCircle,
  ArrowLeftRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  // Gradually fade out scroll indicator as user begins scrolling down
  const indicatorOpacity = useTransform(scrollY, [0, 140], [1, 0]);
  const indicatorScale = useTransform(scrollY, [0, 140], [1, 0.85]);
  const indicatorY = useTransform(scrollY, [0, 140], [0, 15]);

  // Top 4 Hero Action Cards
  const heroCards = [
    {
      id: "sell",
      categoryNum: "01",
      sidebarText: "SELL // VERKAUFEN",
      title: "VERKAUFEN",
      nameGradient: "holo-text-sell",
      description: "Einzelkarten verkaufen oder ganze Sammlungen bei Manaforge einreichen.",
      href: "/sell",
      bgImage: "/pokemon/rayquaza.jpg",
      cardBg: "from-emerald-950/40 via-teal-950/20 to-black/60",
      sidebarBg: "bg-gradient-to-b from-emerald-400/90 via-green-500/90 to-teal-600/90",
      borderColor: "border-emerald-500/40 group-hover:border-emerald-400/90",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(16,185,129,0.45)]",
      patternColor: "rgba(16, 185, 129, 0.05)",
    },
    {
      id: "buy",
      categoryNum: "02",
      sidebarText: "BUY // KAUFEN",
      title: "KAUFEN",
      nameGradient: "holo-text-buy",
      description: "Karten und Angebote aus der Community erwerben.",
      href: "/buy",
      bgImage: "/pokemon/pikachu.jpg",
      cardBg: "from-cyan-950/40 via-sky-950/20 to-black/60",
      sidebarBg: "bg-gradient-to-b from-yellow-400/90 via-amber-400/90 to-cyan-400/90",
      borderColor: "border-cyan-400/40 group-hover:border-yellow-300/90",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]",
      patternColor: "rgba(6, 182, 212, 0.05)",
    },
    {
      id: "trade",
      categoryNum: "03",
      sidebarText: "TRADE // TAUSCHEN",
      title: "TAUSCHEN",
      nameGradient: "holo-text-trade",
      description: "Karten fair 1:1 innerhalb der Community tauschen.",
      href: "/trade",
      bgImage: "/pokemon/mewtwo.jpg",
      cardBg: "from-purple-950/40 via-fuchsia-950/20 to-black/60",
      sidebarBg: "bg-gradient-to-b from-purple-400/90 via-fuchsia-400/90 to-pink-500/90",
      borderColor: "border-purple-400/40 group-hover:border-fuchsia-300/90",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(217,70,239,0.45)]",
      patternColor: "rgba(217, 70, 239, 0.05)",
    },
    {
      id: "looking-for",
      categoryNum: "04",
      sidebarText: "SEEK // GESUCHT",
      title: "GESUCHT",
      nameGradient: "holo-text-look",
      description: "Eigene Wunschkarten ausschreiben.",
      href: "/looking-for",
      bgImage: "/pokemon/charizard.jpg",
      cardBg: "from-amber-950/40 via-orange-950/20 to-black/60",
      sidebarBg: "bg-gradient-to-b from-amber-400/90 via-orange-500/90 to-red-500/90",
      borderColor: "border-orange-400/40 group-hover:border-amber-300/90",
      glowColor: "group-hover:shadow-[0_0_35px_rgba(249,115,22,0.45)]",
      patternColor: "rgba(249, 115, 22, 0.05)",
    },
  ];

  // Detailed 4 Bento Cards with alternating alignment (Left, Right, Left, Right)
  const bentoDetails = [
    {
      id: "bento-sell",
      align: "left", // Card 1: Left Aligned
      categoryNum: "01",
      categoryName: "ANKAUF & VERKAUF",
      pokemonName: "Rayquaza",
      pokemonImg: "/pokemon/rayquaza.jpg",
      title: "Einzelkarten & Sammlungen",
      subtitle: "Maximaler Erlös & Schnelle Auszahlung",
      description:
        "Reiche einzelne Holos, Graded Slabs (PSA, BGS, CGC) oder ganze Sammlungen direkt bei Manaforge ein. Wir berechnen faire Ankaufspreise auf Basis aktueller Cardmarket-Durchschnittswerte und zahlen nach kurzer Prüfung zuverlässig aus.",
      bullets: [
        "Faire ETV- & Cardmarket-Marktpreise",
        "24h Express-Auszahlung via PayPal oder IBAN",
        "Graded Slabs & Raw-Bulk Sammlungen willkommen",
      ],
      tag: "RAYQUAZA // 01",
      cta: "Jetzt verkaufen",
      href: "/sell",
      theme: {
        glow: "from-emerald-500/15 via-teal-500/5 to-transparent",
        orbGlow: "bg-emerald-500/20",
        border: "border-emerald-500/30 hover:border-emerald-400/70",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        btn: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30",
        accent: "text-emerald-400",
        bulletIcon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        cardGlow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
      },
    },
    {
      id: "bento-buy",
      align: "right", // Card 2: Right Aligned
      categoryNum: "02",
      categoryName: "MARKTPLATZ & COMMUNITY",
      pokemonName: "Pikachu",
      pokemonImg: "/pokemon/pikachu.jpg",
      title: "Verifizierter Marktplatz",
      subtitle: "Geprüfte Karten & Exklusive Drops",
      description:
        "Entdecke seltene Einzelkarten und Angebote direkt aus der verifizierten Community. Jedes Inserat enthält lückenlose Front- & Back-Scans sowie eine transparente Zustandsprüfung, damit du sicher und transparent einkaufst.",
      bullets: [
        "Echte Hochglanz-Scans jeder Einzelkarte",
        "0% versteckte Gebühren für Käufer",
        "Direkte Kontaktaufnahme via verifiziertem Discord",
      ],
      tag: "PIKACHU // 02",
      cta: "Marktplatz öffnen",
      href: "/buy",
      theme: {
        glow: "from-cyan-500/15 via-sky-500/5 to-transparent",
        orbGlow: "bg-cyan-500/20",
        border: "border-cyan-400/30 hover:border-cyan-300/70",
        badge: "bg-cyan-500/10 text-cyan-400 border-cyan-400/30",
        btn: "bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-cyan-600/30",
        accent: "text-cyan-400",
        bulletIcon: "text-cyan-400 bg-cyan-500/10 border-cyan-400/30",
        cardGlow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]",
      },
    },
    {
      id: "bento-trade",
      align: "left", // Card 3: Left Aligned
      categoryNum: "03",
      categoryName: "1:1 FAIR-TRADE",
      pokemonName: "Mewtu",
      pokemonImg: "/pokemon/mewtwo.jpg",
      title: "1:1 Tausch & ETV-Ausgleich",
      subtitle: "Faire Deals auf Augenhöhe",
      description:
        "Tausche Karten ohne Risiko. Unser integrierter Estimated Trade Value (ETV) Algorithmus ermittelt sekundengenau den fairen Differenzbetrag in Euro, sodass beide Tauschpartner einen absolut gleichwertigen Deal abschließen.",
      bullets: [
        "Automatischer Live-ETV-Wertausgleich",
        "1-Klick Tauschvorschläge an Kartenbesitzer",
        "Treuhand-Sicherheit & Reputationssystem",
      ],
      tag: "MEWTU // 03",
      cta: "Tauschbörse ansehen",
      href: "/trade",
      theme: {
        glow: "from-purple-500/15 via-fuchsia-500/5 to-transparent",
        orbGlow: "bg-purple-500/20",
        border: "border-purple-400/30 hover:border-fuchsia-300/70",
        badge: "bg-purple-500/10 text-purple-400 border-purple-400/30",
        btn: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-600/30",
        accent: "text-purple-400",
        bulletIcon: "text-purple-400 bg-purple-500/10 border-purple-400/30",
        cardGlow: "group-hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]",
      },
    },
    {
      id: "bento-seek",
      align: "right", // Card 4: Right Aligned
      categoryNum: "04",
      categoryName: "LIVE BOUNTIES & SUCHE",
      pokemonName: "Glurak",
      pokemonImg: "/pokemon/charizard.jpg",
      title: "Want-Lists & Bounties",
      subtitle: "Finde deine Holy Grails gezielt",
      description:
        "Fehlt dir eine begehrte Karte für dein Master-Set? Schreibe ein Live-Gesuch mit individuellem Wunschpreis oder Gegenangebot aus. Unsere Discord-Bots synchronisieren dein Gesuch sofort im #gesucht-Kanal für hunderte Sammler.",
      bullets: [
        "Live Push-Alerts an Sammler im Discord",
        "Wunschpreis & Zustand flexibel festlegen",
        "Schnelleres Finden von Vintage & Secret Rares",
      ],
      tag: "GLURAK // 04",
      cta: "Wunschkarte posten",
      href: "/looking-for",
      theme: {
        glow: "from-amber-500/15 via-orange-500/5 to-transparent",
        orbGlow: "bg-amber-500/20",
        border: "border-orange-400/30 hover:border-amber-300/70",
        badge: "bg-amber-500/10 text-amber-400 border-orange-400/30",
        btn: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-orange-600/30",
        accent: "text-amber-400",
        bulletIcon: "text-amber-400 bg-amber-500/10 border-orange-400/30",
        cardGlow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]",
      },
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden select-none">
      {/* Blue Hour Background is applied site-wide in layout.tsx */}

      {/* ========================================================
          HERO SECTION: 4 COMPACT ACTION CARDS
         ======================================================== */}
      <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center py-2 sm:py-4 md:py-6 overflow-visible">
        {/* ========================================================
            HERO BRAND LOGO: Centered at top of website in grand size
           ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center justify-center pt-1 sm:pt-2 pb-1 sm:pb-2 px-4 z-30 pointer-events-auto"
        >
          <img
            src="/manaforge-logo.png"
            alt="MANAFORGE"
            className="w-[145px] min-[390px]:w-[165px] sm:w-[210px] md:w-[250px] lg:w-[280px] max-w-[85vw] h-auto object-contain filter drop-shadow-[0_3px_20px_rgba(249,115,22,0.6)] drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] hover:scale-105 transition-all duration-300 select-none"
          />
        </motion.div>

        {/* Main 4 Cards: 2x2 Grid on Mobile (Zero horizontal scrolling), 4-in-a-row on Desktop */}
        <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 overflow-visible flex items-center justify-center my-auto">
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-center sm:justify-center gap-3 min-[390px]:gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 pt-3 sm:pt-6 pb-3 sm:pb-5 px-1 max-w-[390px] min-[410px]:max-w-[420px] sm:max-w-none w-full">
            {heroCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
                onClick={() => router.push(card.href)}
                className="group relative w-full sm:w-[170px] md:w-[195px] lg:w-[215px] h-[205px] min-[390px]:h-[220px] min-[420px]:h-[235px] sm:h-[295px] md:h-[335px] lg:h-[360px] shrink-0 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2.5 active:scale-95"
              >
                {/* Main Card Box Container (Pokemon Artwork as Background) */}
                <div
                  className={`relative w-full h-full rounded-xl sm:rounded-2xl border ${card.borderColor} bg-black/75 backdrop-blur-md ${card.glowColor} overflow-hidden shadow-2xl flex flex-row justify-between transition-all duration-300`}
                >
                  {/* Pokemon Artwork Background with smooth hover zoom */}
                  <img
                    src={card.bgImage}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover object-top sm:object-center transform group-hover:scale-110 transition-transform duration-500 ease-out pointer-events-none select-none z-0"
                  />

                  {/* Dark Vignette Gradient for High-Contrast Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-10" />

                  {/* Top Glass Sheen */}
                  <div className="absolute inset-x-0 top-0 h-12 sm:h-16 bg-gradient-to-b from-white/15 to-transparent pointer-events-none z-10" />

                  {/* Background Tech Texture / Halftone Grid (Subtle overlay) */}
                  <div
                    className="absolute inset-0 z-10 opacity-15 halftone-pattern pointer-events-none"
                    style={{
                      backgroundColor: card.patternColor,
                    }}
                  />

                  {/* Left/Center Content Area (with min-w-0 to prevent pushing the fixed sidebar) */}
                  <div className="relative z-30 flex-1 min-w-0 flex flex-col justify-end p-2.5 min-[390px]:p-3 sm:p-3.5 pr-1 sm:pr-1.5 pb-2.5 min-[390px]:pb-3 sm:pb-3.5">
                    {/* Category Title with Adjusted Sizing */}
                    <h2
                      className={`text-xs min-[390px]:text-sm sm:text-lg md:text-xl font-black uppercase tracking-tight leading-none pt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${card.nameGradient} group-hover:scale-105 transition-transform origin-left`}
                    >
                      {card.title}
                    </h2>

                    {/* Short Full Description */}
                    <p className="text-[7.5px] min-[390px]:text-[8.5px] sm:text-[9.5px] md:text-[10px] text-neutral-200 leading-tight pt-1 font-normal line-clamp-2 min-[390px]:line-clamp-3 sm:line-clamp-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {card.description}
                    </p>
                  </div>

                  {/* Right-Side Vertical Tech Stripe (Strictly fixed uniform width across all cards) */}
                  <div
                    className={`relative z-30 w-[24px] min-[390px]:w-[26px] sm:w-[34px] md:w-[40px] min-w-[24px] min-[390px]:min-w-[26px] sm:min-w-[34px] md:min-w-[40px] max-w-[24px] min-[390px]:max-w-[26px] sm:max-w-[34px] md:max-w-[40px] h-full ${card.sidebarBg} flex flex-col items-center justify-between py-2 min-[390px]:py-2.5 sm:py-3 px-0.5 shrink-0 shadow-lg border-l border-black/20 backdrop-blur-md`}
                  >
                    {/* Top Category Number Pill */}
                    <div className="bg-black text-white font-black text-[7px] min-[390px]:text-[8px] sm:text-[9px] px-1 py-0.5 rounded-[2px] tracking-wider leading-none shadow">
                      {card.categoryNum}
                    </div>

                    {/* Middle Vertical Rotated Title */}
                    <div className="writing-vertical font-black tracking-wider text-[6.5px] min-[390px]:text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-black uppercase select-none my-auto whitespace-nowrap">
                      {card.sidebarText}
                    </div>

                    {/* Bottom Tech Target Circle Icon */}
                    <div className="w-3 h-3 min-[390px]:w-3.5 min-[390px]:h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/20 flex items-center justify-center">
                      <CircleDot className="w-2 h-2 min-[390px]:w-2.5 min-[390px]:h-2.5 sm:w-3 sm:h-3 text-black" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Floating Scroll Indicator that progressively fades out on scroll */}
        <motion.div
          style={{
            opacity: indicatorOpacity,
            scale: indicatorScale,
            y: indicatorY,
          }}
          className="w-full flex flex-col items-center justify-center pb-2 z-20 pointer-events-auto"
        >
          <a
            href="#ecosystem-bento"
            className="flex flex-col items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-neutral-300 hover:text-cyan-400 transition-colors group cursor-pointer"
          >
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-[11px] sm:text-xs">
              Alle 4 Optionen im Detail
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:border-cyan-400/60 group-hover:bg-cyan-500/10 transition-all shadow-lg"
            >
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </motion.div>
          </a>
        </motion.div>
      </section>

      {/* ========================================================
          DETAILED UNIFIED 4-TIER HORIZONTAL BENTO GRID
         ======================================================== */}
      <section
        id="ecosystem-bento"
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        {/* Section Header with Scroll Reveal Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Alle 4 Kernbereiche{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
              im Detail
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300/90 max-w-2xl mx-auto leading-relaxed">
            Transparenter Ankauf, sicherer Marktplatz, 1:1 Tauschsystem und Live-Bounties in einer zusammenhängenden TCG-Plattform.
          </p>
        </motion.div>

        {/* Unified 4-Tier Horizontal Bento Grid (Seamless, Connected Single Grid with Smooth Gradient Fades) */}
        <div className="w-full rounded-3xl border border-white/10 bg-[#080b11]/85 backdrop-blur-2xl shadow-2xl overflow-hidden divide-y divide-white/5">
          {bentoDetails.map((bento, index) => {
            const isLeft = bento.align === "left";

            return (
              <motion.div
                key={bento.id}
                initial={{
                  opacity: 0,
                  x: isLeft ? -30 : 30,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex flex-col ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } items-center justify-between overflow-hidden transition-all duration-300 hover:bg-white/[0.02] p-4 sm:p-6 md:p-7 min-h-[220px] sm:min-h-[240px]`}
              >
                {/* Soft Gradient Fade from Pokemon side into the Dark Card Background (NO vertical dividing bar) */}
                <div
                  className={`absolute inset-0 pointer-events-none -z-10 transition-opacity duration-500 opacity-70 group-hover:opacity-100 ${
                    isLeft
                      ? `bg-gradient-to-r ${bento.theme.glow}`
                      : `bg-gradient-to-l ${bento.theme.glow}`
                  }`}
                />

                {/* Ambient Halftone Grid Noise */}
                <div className="absolute inset-0 halftone-pattern opacity-5 pointer-events-none -z-10" />

                {/* ================= POKEMON ARTWORK (FLUSH LEFT OR FLUSH RIGHT) ================= */}
                <div
                  className={`relative w-full md:w-[240px] lg:w-[280px] shrink-0 py-2 sm:py-0 flex items-center ${
                    isLeft
                      ? "justify-center md:justify-start md:pl-2 lg:pl-4"
                      : "justify-center md:justify-end md:pr-2 lg:pr-4"
                  } overflow-visible`}
                >
                  {/* Glowing Ambient Aura Orb */}
                  <div
                    className={`absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full ${bento.theme.orbGlow} blur-2xl group-hover:scale-125 transition-transform duration-500`}
                  />

                  {/* Pokemon Character Artwork Card */}
                  <div className="relative z-10 w-24 sm:w-28 md:w-32 h-36 sm:h-40 md:h-44 rounded-2xl overflow-hidden border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-white/30 transition-all duration-300 bg-black">
                    <img
                      src={bento.pokemonImg}
                      alt={bento.pokemonName}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-1.5 inset-x-0 text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-white/90 drop-shadow">
                        {bento.pokemonName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================= CONTENT & FEATURES SECTION ================= */}
                <div
                  className={`flex-1 w-full px-2 sm:px-6 md:px-8 py-2 flex flex-col justify-between ${
                    isLeft ? "items-start text-left" : "items-end text-right"
                  }`}
                >
                  {/* Category Pill Tag & Index */}
                  <div
                    className={`flex items-center gap-2 mb-1.5 ${
                      isLeft ? "flex-row justify-start" : "flex-row-reverse justify-start"
                    }`}
                  >
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase border backdrop-blur-md ${bento.theme.badge}`}
                    >
                      {bento.categoryName}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-neutral-400">
                      // {bento.categoryNum}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className={`w-full ${isLeft ? "text-left" : "text-right"}`}>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                      {bento.title}
                    </h3>
                    <p className={`text-[11px] sm:text-xs font-bold ${bento.theme.accent} mt-0.5`}>
                      {bento.subtitle}
                    </p>
                  </div>

                  {/* Detailed Description */}
                  <p
                    className={`text-[11px] sm:text-xs text-neutral-300/90 leading-relaxed my-2 max-w-2xl ${
                      isLeft ? "text-left" : "text-right"
                    }`}
                  >
                    {bento.description}
                  </p>

                  {/* Compact 3 Highlights Pills */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 my-2">
                    {bento.bullets.map((bullet, bIndex) => (
                      <div
                        key={bIndex}
                        className={`px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2 transition-colors group-hover:border-white/10 ${
                          isLeft
                            ? "flex-row text-left justify-start"
                            : "flex-row-reverse text-right justify-start"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${bento.theme.bulletIcon}`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[10.5px] sm:text-[11px] font-medium text-neutral-200 leading-tight">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA Button */}
                  <div
                    className={`w-full pt-1.5 flex ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >
                    <button
                      onClick={() => router.push(bento.href)}
                      className={`h-9 sm:h-10 min-h-[38px] sm:min-h-[44px] px-5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-white ${
                        bento.theme.btn
                      } ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                    >
                      <span>{bento.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Community & Discord Quick Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-black/60 backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">
                Verifizierte TCG-Community & Discord Live-Sync
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
                Jedes Listing, jedes Gesuch und jeder Tausch wird in Echtzeit mit unserem Discord synchronisiert.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/buy")}
            className="h-11 min-h-[44px] px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <span>Jetzt Community beitreten</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </button>
        </motion.div>
      </section>
    </div>
  );
}








