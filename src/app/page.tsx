"use client";

import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { CreateListingModal } from "@/components/forms/create-listing-modal";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useStore } from "@/lib/store";
import {
  Sparkles,
  PlusCircle,
  ShoppingBag,
  ArrowLeftRight,
  Search,
  ShieldCheck,
  Crown,
  Layers,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, listings, deals } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Counts
  const sellCount = listings.filter((l) => l.type === "sell").length;
  const buyCount = listings.filter((l) => l.type === "sell").length;
  const tradeCount = listings.filter((l) => l.type === "trade").length;
  const lookingForCount = listings.filter((l) => l.type === "looking_for").length;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Community Header */}
      <section className="relative overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Offizielle Whatnot Community Plattform • Manaverse
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Sammeln, Kaufen, Tauschen & Gesuche.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Direkt in der Community.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Die zentrale Drehscheibe für Whatnot-Zuschauer und Sammler. Veröffentliche Einzelkarten oder ganze Sammlungen, schlage Trades vor und synchronisiere deine Angebote per Klick mit Discord.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ShimmerButton
                onClick={() => setCreateModalOpen(true)}
                background="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                className="py-2.5 px-5 text-xs font-bold"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Karte einstellen
              </ShimmerButton>

              <Link
                href="/sell/bulk"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all hover:scale-105"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                Sammlung verkaufen (An Manacards)
              </Link>
            </div>
          </div>

          {/* User Profile Welcome Card */}
          <div className="w-full md:w-auto min-w-[280px] p-6 rounded-3xl glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
            <BorderBeam size={180} duration={9} />
            <div className="flex items-center gap-4 mb-4">
              <HoloAvatarFrame
                avatarUrl={currentUser.avatarUrl}
                username={currentUser.username}
                role={currentUser.role}
                verified={currentUser.verified}
                size="lg"
              />
              <div>
                <p className="text-xs text-neutral-400">Eingeloggt als</p>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  {currentUser.username}
                  {currentUser.verified && (
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  )}
                </h3>
                <p className="text-xs text-indigo-400 capitalize font-medium">
                  {currentUser.role} Status
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Erfolgreiche Deals:</span>
                <span className="font-bold text-white">{currentUser.dealsCount}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Verifizierungs-Status:</span>
                <span className={currentUser.verified ? "text-blue-400 font-bold" : "text-amber-400 font-bold"}>
                  {currentUser.verified ? "✓ Verifiziert" : `${currentUser.dealsCount}/3 Deals`}
                </span>
              </div>
              {currentUser.whatnotUsername && (
                <div className="flex justify-between text-neutral-400">
                  <span>Whatnot:</span>
                  <span className="text-yellow-400 font-medium">@{currentUser.whatnotUsername}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4 BENTO TILES (Landing Page Core) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              Wähle deinen Bereich
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Vier einfache Kacheln für jeden Zweck der Community.
            </p>
          </div>
        </div>

        <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. SELL */}
          <BentoGridItem
            onClick={() => router.push("/sell")}
            title={
              <span className="flex items-center justify-between w-full">
                Sell (Verkaufen)
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </span>
            }
            description="Biete Einzelkarten zum Festpreis an oder nutze den Bulk-Upload, um ganze Sammlungen mit Vorverkaufsrecht an Manacards anzubieten."
            icon={<PlusCircle className="w-6 h-6 text-emerald-400" />}
            badge={
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {sellCount} Angebote
              </span>
            }
            header={
              <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-950/40 via-emerald-900/10 to-transparent p-4 border border-emerald-500/20 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Karten verkaufen
                </span>
                <p className="text-xs text-emerald-200 font-semibold">
                  Einzelkarten & Sammlung-Ankauf
                </p>
              </div>
            }
            className="hover:border-emerald-500/40 hover:shadow-emerald-500/10"
          />

          {/* 2. BUY */}
          <BentoGridItem
            onClick={() => router.push("/buy")}
            title={
              <span className="flex items-center justify-between w-full">
                Buy (Kaufen)
                <ArrowUpRight className="w-4 h-4 text-indigo-400" />
              </span>
            }
            description="Entdecke alle Community-Karten. Filter nach Sets, Sprache, Zustand oder suche direkt nach Pokémon-Namen und Verkäufern."
            icon={<ShoppingBag className="w-6 h-6 text-indigo-400" />}
            badge={
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Marktplatz
              </span>
            }
            header={
              <div className="h-28 rounded-xl bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-transparent p-4 border border-indigo-500/20 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  Karten stöbern
                </span>
                <p className="text-xs text-indigo-200 font-semibold">
                  Mit Set-, Sprach- & Zustandsfilter
                </p>
              </div>
            }
            className="hover:border-indigo-500/40 hover:shadow-indigo-500/10"
          />

          {/* 3. TRADE */}
          <BentoGridItem
            onClick={() => router.push("/trade")}
            title={
              <span className="flex items-center justify-between w-full">
                Trade (Tauschen)
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
              </span>
            }
            description="Stelle Karten ein, die du tauschen möchtest, und erhalte konkrete Gegenangebote anderer Sammler mit geschätztem Tauschwert (ETV)."
            icon={<ArrowLeftRight className="w-6 h-6 text-purple-400" />}
            badge={
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {tradeCount} Trades
              </span>
            }
            header={
              <div className="h-28 rounded-xl bg-gradient-to-br from-purple-950/40 via-purple-900/10 to-transparent p-4 border border-purple-500/20 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
                  Karte gegen Karte
                </span>
                <p className="text-xs text-purple-200 font-semibold">
                  Mit Estimated Trade Value & Offers
                </p>
              </div>
            }
            className="hover:border-purple-500/40 hover:shadow-purple-500/10"
          />

          {/* 4. LOOKING FOR */}
          <BentoGridItem
            onClick={() => router.push("/looking-for")}
            title={
              <span className="flex items-center justify-between w-full">
                Looking For (Gesuche)
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </span>
            }
            description="Fehlt dir eine Karte für dein Master-Set? Starte ein Gesuch mit deinem Wunschbudget. Community-Mitglieder können sofort antworten."
            icon={<Search className="w-6 h-6 text-cyan-400" />}
            badge={
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {lookingForCount} Gesuche
              </span>
            }
            header={
              <div className="h-28 rounded-xl bg-gradient-to-br from-cyan-950/40 via-cyan-900/10 to-transparent p-4 border border-cyan-500/20 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                  Wunschkarten finden
                </span>
                <p className="text-xs text-cyan-200 font-semibold">
                  Mit 'Habe ich'-Direktantwort
                </p>
              </div>
            }
            className="hover:border-cyan-500/40 hover:shadow-cyan-500/10"
          />
        </BentoGrid>
      </section>

      {/* Featured / Recent Cards Showcase */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 rounded-3xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Aktuelle Highlights aus der Community
              </h3>
              <p className="text-xs text-neutral-400">
                Frisch eingestellte Hits zum Kaufen und Tauschen
              </p>
            </div>
            <Link
              href="/buy"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Alle ansehen <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 3).map((card) => (
              <div
                key={card.id}
                onClick={() => router.push(card.type === "sell" ? "/buy" : card.type === "trade" ? "/trade" : "/looking-for")}
                className="p-4 rounded-2xl bg-[#0e121e] border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/60 mb-3 relative flex items-center justify-center">
                  <img
                    src={card.photos[0]}
                    alt={card.name}
                    className="h-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/20">
                    {card.condition} • {card.language}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors truncate max-w-[180px]">
                      {card.name}
                    </h4>
                    <p className="text-xs text-neutral-400">Von {card.user.username}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400">
                      {card.price ? `${card.price} €` : card.estimatedTradeValue ? `~${card.estimatedTradeValue} €` : card.priceRange || "VB"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for creating a new card */}
      <CreateListingModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
