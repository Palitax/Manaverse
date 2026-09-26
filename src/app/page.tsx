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
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const { scrollY } = useScroll();
  // Gradually fade out scroll indicator as user begins scrolling down
  const indicatorOpacity = useTransform(scrollY, [0, 140], [1, 0]);
  const indicatorScale = useTransform(scrollY, [0, 140], [1, 0.85]);
  const indicatorY = useTransform(scrollY, [0, 140], [0, 15]);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  // Top 4 Hero Action Cards
  const heroCards = [
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

  // Detailed 4 Bento Cards with alternating alignment (Left, Right, Left, Right)
  const bentoDetails = [
    {
      id: "bento-sell",
      align: "left", // Card 1: Left Aligned
      categoryNum: "01",
      categoryName: "ANKAUF & VERKAUF",
      pokemonName: "Gengar",
      pokemonImg: "/pokemon/gengar.png",
      title: "Einzelkarten & Sammlungen",
      subtitle: "Maximaler Erlös & Schnelle Auszahlung",
      description:
        "Reiche einzelne Holos, Graded Slabs (PSA, BGS, CGC) oder ganze Sammlungen direkt bei Manaforge ein. Wir berechnen faire Ankaufspreise auf Basis aktueller Cardmarket-Durchschnittswerte und zahlen nach kurzer Prüfung zuverlässig aus.",
      bullets: [
        "Faire ETV- & Cardmarket-Marktpreise",
        "24h Express-Auszahlung via PayPal oder IBAN",
        "Graded Slabs & Raw-Bulk Sammlungen willkommen",
      ],
      tag: "GENGAR // 01",
      cta: "Jetzt verkaufen",
      href: "/sell",
      theme: {
        glow: "from-pink-500/15 via-rose-500/5 to-transparent",
        orbGlow: "bg-pink-500/20",
        border: "border-pink-500/30 hover:border-pink-400/70",
        badge: "bg-pink-500/10 text-pink-400 border-pink-500/30",
        btn: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-600/30",
        accent: "text-pink-400",
        bulletIcon: "text-pink-400 bg-pink-500/10 border-pink-500/30",
        cardGlow: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]",
      },
    },
    {
      id: "bento-buy",
      align: "right", // Card 2: Right Aligned
      categoryNum: "02",
      categoryName: "MARKTPLATZ & COMMUNITY",
      pokemonName: "Pikachu",
      pokemonImg: "/pokemon/pikachu.png",
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
      pokemonImg: "/pokemon/mewtwo.png",
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
      pokemonImg: "/pokemon/charizard.png",
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
      {/* High-Clarity Holographic Background Video (Playback speed reduced by 30% to 0.7x) */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 0.7;
            }
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        >
          <source src="/Abstract_holographic_foil_bg.mp4" type="video/mp4" />
        </video>
        {/* Ultra-light cinematic gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>

      {/* ========================================================
          HERO SECTION: 4 COMPACT ACTION CARDS
         ======================================================== */}
      <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center py-4 sm:py-6 overflow-visible">
        {/* Main 4 Cards in ONE Horizontal Line */}
        <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 overflow-visible flex items-center justify-center my-auto">
          <div className="flex flex-row items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-2.5 min-[390px]:gap-3 sm:gap-3.5 md:gap-4 lg:gap-5 no-scrollbar pt-10 sm:pt-14 pb-6 px-2">
            {heroCards.map((card, index) => (
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

                  {/* Pokemon Character Image */}
                  <img
                    src={bento.pokemonImg}
                    alt={bento.pokemonName}
                    className="relative z-10 h-28 sm:h-36 md:h-40 lg:h-44 w-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)] transform group-hover:scale-110 group-hover:-translate-y-1.5 transition-all duration-300 ease-out"
                  />
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








