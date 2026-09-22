"use client";

import React, { useState } from "react";
import { CardListing, CardCondition } from "@/types";
import { CardContainer, CardBody, CardItem } from "../aceternity/3d-card";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import { BorderBeam } from "../magicui/border-beam";
import {
  Tag,
  ArrowLeftRight,
  Eye,
  CheckCircle2,
  Share2,
  MessageSquare,
  Play,
  X,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CardItemViewProps {
  card: CardListing;
  onTradeClick?: (card: CardListing) => void;
  onBuyClick?: (card: CardListing) => void;
}

export function CardItemView({ card, onTradeClick, onBuyClick }: CardItemViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const { currentUser, createDeal } = useStore();

  const conditionColors: Record<CardCondition, string> = {
    NM: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    EX: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    GD: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    LP: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PL: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    PO: "bg-red-500/20 text-red-400 border-red-500/30",
    Egal: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
  };

  const conditionLabels: Record<CardCondition, string> = {
    NM: "Near Mint",
    EX: "Excellent",
    GD: "Good",
    LP: "Light Played",
    PL: "Played",
    PO: "Poor",
    Egal: "Beliebiger Zustand",
  };

  const handleStartDeal = () => {
    if (card.userId === currentUser.id) {
      alert("Das ist dein eigenes Listing!");
      return;
    }
    createDeal(card, currentUser);
    alert(`Deal-Anfrage an ${card.user.username} gesendet! Ihr könnt den Deal in eurem Profil beidseitig bestätigen.`);
    setModalOpen(false);
  };

  return (
    <>
      <CardContainer className="inter-var w-full">
        <CardBody className="bg-[#101422] relative group/card hover:shadow-2xl hover:shadow-indigo-500/[0.15] border border-white/10 w-full rounded-2xl p-4 transition-all">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HoloAvatarFrame
                avatarUrl={card.user.avatarUrl}
                username={card.user.username}
                role={card.user.role}
                verified={card.user.verified}
                size="sm"
              />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">
                  {card.user.username}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {card.user.whatnotUsername ? `@${card.user.whatnotUsername}` : "Community"}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  conditionColors[card.condition]
                )}
                title={conditionLabels[card.condition]}
              >
                {card.condition}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                {card.language}
              </span>
            </div>
          </div>

          {/* Card Artwork / Photo */}
          <CardItem
            translateZ="50"
            className="w-full relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shadow-inner group/art cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <img
              src={card.photos[0] || "https://images.pokemontcg.io/base1/4_hires.png"}
              alt={card.name}
              className="w-full h-full object-contain p-2 group-hover/art:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {card.videoUrl && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md p-1.5 rounded-full text-white border border-white/20">
                <Play className="w-3 h-3 fill-current" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-center p-3">
              <span className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400/40">
                <Eye className="w-3.5 h-3.5" /> Details ansehen
              </span>
            </div>
          </CardItem>

          {/* Card Title & Description */}
          <div className="mt-3">
            <h3
              onClick={() => setModalOpen(true)}
              className="font-bold text-sm text-white truncate cursor-pointer hover:text-indigo-300 transition-colors"
              title={card.name}
            >
              {card.name}
            </h3>
            {card.set && (
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                {card.set} {card.cardNumber && `• #${card.cardNumber}`}
              </p>
            )}
          </div>

          {/* Price / ETV and Action Button */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              {card.type === "sell" && (
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Preis
                  </span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {card.price} €
                  </span>
                </div>
              )}
              {card.type === "trade" && (
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Tauschwert
                  </span>
                  <span className="text-base font-extrabold text-purple-400">
                    ~{card.estimatedTradeValue} €
                  </span>
                </div>
              )}
              {card.type === "looking_for" && (
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Budget
                  </span>
                  <span className="text-sm font-extrabold text-cyan-400">
                    {card.priceRange || "VB"}
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {card.type === "sell" && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all hover:scale-105"
              >
                Kaufen / Bieten
              </button>
            )}
            {card.type === "trade" && (
              <button
                onClick={() => (onTradeClick ? onTradeClick(card) : setModalOpen(true))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all hover:scale-105"
              >
                <ArrowLeftRight className="w-3 h-3" /> Tauschen
              </button>
            )}
            {card.type === "looking_for" && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all hover:scale-105"
              >
                Habe ich!
              </button>
            )}
          </div>
        </CardBody>
      </CardContainer>

      {/* Detail Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 border border-white/15 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image Gallery & Video */}
              <div className="space-y-3">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 flex items-center justify-center">
                  <img
                    src={card.photos[selectedPhotoIndex] || card.photos[0]}
                    alt={card.name}
                    className="w-full h-full object-contain p-2"
                  />
                  <BorderBeam size={250} duration={8} />
                </div>

                {/* Thumbnails */}
                {card.photos.length > 1 && (
                  <div className="flex gap-2">
                    {card.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={cn(
                          "w-16 h-20 rounded-lg overflow-hidden border transition-all",
                          selectedPhotoIndex === idx
                            ? "border-indigo-500 scale-105 shadow-md shadow-indigo-500/30"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Information & Actions */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                        conditionColors[card.condition]
                      )}
                    >
                      {conditionLabels[card.condition]} ({card.condition})
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-neutral-300">
                      Sprache: {card.language}
                    </span>
                    {card.type === "sell" && card.allowOffers && (
                      <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        Angebote erlaubt
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-white">{card.name}</h2>
                  {card.set && (
                    <p className="text-sm text-neutral-400">
                      {card.set} {card.cardNumber && `• #${card.cardNumber}`}
                    </p>
                  )}

                  {/* Price / ETV Banner */}
                  <div className="my-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                        {card.type === "sell"
                          ? "Kaufpreis"
                          : card.type === "trade"
                          ? "Estimated Trade Value"
                          : "Gesuchter Preis"}
                      </span>
                      <span className="text-2xl font-black text-white">
                        {card.price
                          ? `${card.price} €`
                          : card.estimatedTradeValue
                          ? `~${card.estimatedTradeValue} €`
                          : card.priceRange || "VB"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block">Typ</span>
                      <span className="text-xs font-bold uppercase text-indigo-400">
                        {card.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {card.description && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                        Beschreibung & Details
                      </h4>
                      <p className="text-sm text-neutral-300 leading-relaxed bg-[#0c101a] p-3 rounded-xl border border-white/5">
                        {card.description}
                      </p>
                    </div>
                  )}

                  {/* Wants (for Trade) */}
                  {card.type === "trade" && card.lookingForWants && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                        Gesuchte Tauschobjekte
                      </h4>
                      <p className="text-sm text-purple-200 bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
                        {card.lookingForWants}
                      </p>
                    </div>
                  )}

                  {/* Seller Info Box */}
                  <div className="p-3 rounded-2xl bg-[#0d121f] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HoloAvatarFrame
                        avatarUrl={card.user.avatarUrl}
                        username={card.user.username}
                        role={card.user.role}
                        verified={card.user.verified}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                          {card.user.username}
                          {card.user.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {card.user.dealsCount} erfolgreiche Deals • {card.user.role}
                        </p>
                      </div>
                    </div>

                    {card.user.whatnotUsername && (
                      <a
                        href={`https://whatnot.com/user/${card.user.whatnotUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                      >
                        Whatnot <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  <button
                    onClick={handleStartDeal}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all hover:scale-[1.01]"
                  >
                    Deal anfragen & in Profil vormerken
                  </button>
                  <p className="text-[11px] text-center text-neutral-500">
                    Der Handel und die Bezahlung finden direkt zwischen euch statt. Nach Abschluss könnt ihr euch gegenseitig als erfolgreicher Deal bestätigen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
