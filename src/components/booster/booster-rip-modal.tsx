"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { BoosterReward } from "@/types";
import { rollBoosterReward } from "@/lib/booster-rewards";
import { BoosterPackCard } from "./booster-pack-card";
import {
  X,
  Sparkles,
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Crown,
  Flame,
  Gift,
  Timer,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

type RipStage =
  | "ready" // User sees the pack with the glowing tear strip and rip tab
  | "ripping" // User is dragging / swiping across
  | "ripped" // Top tears completely off with energy flash & smoke
  | "extracting" // Card slides up out from inside the pack
  | "reveal_waiting" // Card is hovering face-down, prompt to tap to flip
  | "revealed"; // Card is flipped face up, loot shown with celebration!

export function BoosterRipModal() {
  const {
    isBoosterModalOpen,
    closeBoosterModal,
    availableBoosters,
    ripBoosterPack,
    manaPoints,
    canClaimDailyBooster,
    dailyBoosterCountdown,
    claimDailyBooster,
  } = useStore();

  const [stage, setStage] = useState<RipStage>("ready");
  const [tearProgress, setTearProgress] = useState(0); // 0 to 100
  const [reward, setReward] = useState<BoosterReward | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Drag tracking refs
  const tearTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  // Sound effects simulation (audio synthesizer / web audio api)
  const playSoundEffect = useCallback((type: "tear" | "pop" | "reveal" | "mythic") => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "tear") {
        // White noise scratch
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1200;
        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start();
      } else if (type === "pop") {
        // Satisfying snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.19);
      } else if (type === "reveal" || type === "mythic") {
        // High harmonic sparkle chime
        const frequencies = type === "mythic" ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          const startTime = ctx.currentTime + idx * 0.08;
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.3, startTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.65);
        });
      }
    } catch {
      // Audio autoplay policy or unavailable, ignore silently
    }
  }, []);

  // Reset modal state whenever it is opened
  useEffect(() => {
    if (isBoosterModalOpen) {
      setStage("ready");
      setTearProgress(0);
      setReward(null);
      setIsFlipped(false);
      setErrorMsg(null);
    }
  }, [isBoosterModalOpen]);

  // Execute full pack tear sequence once user crosses rip threshold
  const triggerRipComplete = useCallback(async () => {
    if (stage !== "ready" && stage !== "ripping") return;
    setStage("ripped");
    setTearProgress(100);
    playSoundEffect("pop");

    try {
      if (availableBoosters > 0) {
        const outcome = await ripBoosterPack();
        setReward(outcome);
      } else {
        // Fallback simulation roll when testing with 0 packs
        const outcome = rollBoosterReward();
        setReward(outcome);
      }

      // Advance to extraction after snap
      setTimeout(() => {
        setStage("extracting");
        setTimeout(() => {
          setStage("reveal_waiting");
        }, 850);
      }, 450);
    } catch (err: any) {
      setErrorMsg(err.message || "Fehler beim Öffnen des Booster Packs.");
      setStage("ready");
    }
  }, [stage, availableBoosters, ripBoosterPack, playSoundEffect]);

  // Pointer / Mouse drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stage !== "ready" && stage !== "ripping") return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setStage("ripping");
    playSoundEffect("tear");
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !tearTrackRef.current) return;
    const rect = tearTrackRef.current.getBoundingClientRect();
    const currentX = e.clientX;
    const diff = currentX - rect.left;
    const progress = Math.max(0, Math.min(100, (diff / rect.width) * 100));

    setTearProgress(progress);

    if (progress >= 75) {
      isDraggingRef.current = false;
      triggerRipComplete();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (tearProgress >= 50) {
      triggerRipComplete();
    } else {
      setTearProgress(0);
      setStage("ready");
    }
  };

  // Dedicated Mobile Touch handlers (guarantees seamless swipe on mobile browsers)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (stage !== "ready" && stage !== "ripping") return;
    if (e.touches.length === 0) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    setStage("ripping");
    playSoundEffect("tear");
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !tearTrackRef.current || e.touches.length === 0) return;
    const rect = tearTrackRef.current.getBoundingClientRect();
    const currentX = e.touches[0].clientX;
    const diff = currentX - rect.left;
    const progress = Math.max(0, Math.min(100, (diff / rect.width) * 100));

    setTearProgress(progress);

    if (progress >= 75) {
      isDraggingRef.current = false;
      triggerRipComplete();
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (tearProgress >= 50) {
      triggerRipComplete();
    } else {
      setTearProgress(0);
      setStage("ready");
    }
  };

  // Flip and reveal card
  const handleRevealCard = () => {
    if (stage !== "reveal_waiting" || isFlipped) return;
    setIsFlipped(true);

    if (reward?.rarity === "mythic") {
      playSoundEffect("mythic");
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#f59e0b", "#ec4899", "#06b6d4", "#a855f7"],
      });
    } else {
      playSoundEffect("reveal");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
      });
    }

    setTimeout(() => {
      setStage("revealed");
    }, 700);
  };

  if (!isBoosterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden h-dvh max-h-dvh">
      {/* Dynamic Ambient Background Light Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            "absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000",
            stage === "revealed"
              ? reward?.rarity === "mythic"
                ? "bg-gradient-to-b from-amber-500/40 via-purple-600/30 to-cyan-500/30"
                : "bg-gradient-to-b from-orange-500/30 via-cyan-500/20 to-transparent"
              : "bg-gradient-to-b from-orange-600/25 via-amber-500/15 to-transparent"
          )}
        />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Close Button (always accessible at top right) */}
      <button
        type="button"
        onClick={closeBoosterModal}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10 active:scale-95 shadow-xl"
        aria-label="Schließen"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header Info Banner */}
      <div className="absolute top-4 sm:top-6 inset-x-0 mx-auto max-w-md text-center z-40 px-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-orange-500/30 text-xs font-bold text-neutral-200 backdrop-blur-md shadow-lg shadow-orange-500/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Manaforge Booster Arena</span>
          <span className="text-neutral-500">•</span>
          {availableBoosters > 0 ? (
            <span className="text-orange-400 font-extrabold">{availableBoosters} {availableBoosters === 1 ? "Pack" : "Packs"} bereit</span>
          ) : canClaimDailyBooster ? (
            <span className="text-emerald-400 font-extrabold">Täglicher Booster bereit!</span>
          ) : (
            <span className="text-amber-300 font-bold">Demo-Modus</span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="relative z-30 flex flex-col items-center justify-center max-w-lg w-full min-h-[460px] sm:min-h-[560px]">
        {/* Claim daily button inside modal if 0 packs */}
        {availableBoosters === 0 && canClaimDailyBooster && (
          <div className="mb-4">
            <button
              type="button"
              onClick={claimDailyBooster}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Gift className="w-4 h-4" />
              <span>🎁 Täglichen Gratis-Booster abholen (1 Pack)</span>
            </button>
          </div>
        )}

        {/* Error message toast if needed */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span>!</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STAGES 0, 1, 2: The Booster Pack Presentation & Ripping */}
        {(stage === "ready" || stage === "ripping" || stage === "ripped" || stage === "extracting") && (
          <div className="relative flex flex-col items-center">
            {/* The 3D Booster Pack */}
            <div
              className={cn(
                "relative transition-all duration-700 ease-out",
                stage === "extracting" && "scale-90 opacity-40 translate-y-24 blur-[1px]",
                stage === "ripped" && "scale-[1.02]"
              )}
            >
              <BoosterPackCard
                size="hero"
                showRipGuide={stage === "ready" || stage === "ripping"}
                isRipped={stage === "ripped" || stage === "extracting"}
                tearProgress={tearProgress}
                interactive={stage === "ready"}
              />

              {/* Ripping Tear Strip Pull Slider (Overlays top 18% of pack) */}
              {(stage === "ready" || stage === "ripping") && (
                <div
                  ref={tearTrackRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  className="absolute top-6 sm:top-8 inset-x-2 sm:inset-x-4 h-16 sm:h-20 z-40 flex items-center cursor-grab active:cursor-grabbing touch-none select-none"
                  title="Ziehe den Schieber nach rechts zum Aufreißen!"
                >
                  {/* Glowing Tear Bar Track */}
                  <div className="relative w-full h-10 sm:h-12 rounded-xl bg-black/40 backdrop-blur-sm border border-cyan-400/50 flex items-center px-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] overflow-hidden group">
                    {/* Animated arrow runway background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/30 to-cyan-500/40 opacity-70 group-hover:opacity-100 transition-opacity" />

                    {/* Tear Progress fill */}
                    <div
                      className="absolute left-0 inset-y-0 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400 shadow-[0_0_15px_rgba(249,115,22,0.8)] transition-all duration-75"
                      style={{ width: `${tearProgress}%` }}
                    />

                    {/* Pull Tab Knob / Ripper Head */}
                    <div
                      className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 border-2 border-white flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(245,158,11,1)] transition-transform duration-75 active:scale-110 flex-shrink-0 cursor-grab active:cursor-grabbing"
                      style={{
                        transform: `translateX(${Math.min(
                          (tearProgress / 100) * 260,
                          260
                        )}px)`,
                      }}
                    >
                      <Zap className="w-5 h-5 fill-black text-black animate-pulse" />
                    </div>

                    {/* Centered Guide Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] sm:text-xs font-black tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pl-10">
                      <span>👉 Nach rechts aufziehen</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Energy Flare explosion when pack tears open */}
              {stage === "ripped" && (
                <div className="absolute top-10 inset-x-0 h-32 flex items-center justify-center pointer-events-none z-50">
                  <div className="w-full h-2 bg-white rounded-full blur-[2px] animate-ping shadow-[0_0_40px_rgba(255,255,255,1),0_0_80px_rgba(249,115,22,1)]" />
                  <div className="absolute w-24 h-24 rounded-full bg-cyan-400/80 blur-xl animate-pulse" />
                </div>
              )}
            </div>

            {/* Quick 1-Click Rip Fallback (for mobile convenience & accessibility) */}
            {(stage === "ready" || stage === "ripping") && (
              <div className="mt-5 w-full flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={triggerRipComplete}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:shadow-[0_0_35px_rgba(249,115,22,0.7)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Booster sofort aufreißen (1-Klick)</span>
                </button>
                <p className="text-[11px] text-neutral-400">
                  Tipp: Ziehe den Regler an der Markierung oder klicke den Button.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: Card Rising Up Out of Pack */}
        {stage === "extracting" && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            {/* Mystery card emerging in 3D */}
            <div className="w-[260px] sm:w-[310px] h-[390px] sm:h-[465px] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(249,115,22,0.6)] border border-amber-500/50 animate-in slide-in-from-bottom-32 fade-in duration-700 bg-neutral-900">
              <img
                src="/manaforge-card-back.jpg"
                alt="Manaforge Card Back"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* STAGES 3 & 4: Card Floating & 3D Flip Reveal */}
        {(stage === "reveal_waiting" || stage === "revealed") && reward && (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 w-full">
            {/* Prompt Banner */}
            <div className="text-center mb-4">
              {!isFlipped ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-xs sm:text-sm font-black text-orange-300 animate-bounce">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tippe auf die Karte, um deinen Fund zu enthüllen!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs sm:text-sm font-black text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Erfolgreich erhalten!</span>
                </div>
              )}
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={handleRevealCard}
              className={cn(
                "relative w-[260px] sm:w-[310px] h-[390px] sm:h-[465px] cursor-pointer group perspective-1000",
                !isFlipped && "hover:scale-105 transition-transform duration-300"
              )}
              style={{ perspective: "1200px" }}
            >
              {/* Rarity Aura Glow */}
              <div
                className={cn(
                  "absolute -inset-6 rounded-3xl blur-2xl opacity-75 transition-all duration-700 pointer-events-none",
                  reward.rarity === "mythic" && "bg-gradient-to-tr from-amber-500 via-pink-500 to-cyan-500 animate-pulse",
                  reward.rarity === "epic" && "bg-gradient-to-tr from-purple-600 to-indigo-600",
                  reward.rarity === "rare" && "bg-gradient-to-tr from-blue-600 to-cyan-500",
                  reward.rarity === "common" && "bg-gradient-to-tr from-emerald-600 to-teal-500"
                )}
              />

              {/* Card Inner with 3D Flip */}
              <div
                className="relative w-full h-full rounded-2xl shadow-2xl transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Card Back Face (Pre-flip) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-neutral-900"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src="/manaforge-card-back.jpg"
                    alt="Manaforge Rückseite"
                    className="w-full h-full object-cover"
                  />
                  {/* Glowing core pulse */}
                  <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-transparent animate-pulse pointer-events-none" />
                </div>

                {/* Card Front Face (Revealed Loot) */}
                <div
                  className={cn(
                    "absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-[#0c101c] flex flex-col justify-between p-3 sm:p-4 border-2",
                    reward.rarity === "mythic" && "border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)]",
                    reward.rarity === "epic" && "border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)]",
                    reward.rarity === "rare" && "border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]",
                    reward.rarity === "common" && "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  )}
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Artwork Image */}
                  <div className="relative w-full h-[62%] rounded-xl overflow-hidden border border-white/20">
                    <img
                      src={reward.cardImage}
                      alt={reward.title}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Holographic foil sheen overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-60 mix-blend-color-dodge pointer-events-none" />

                    {/* Rarity Tag */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1",
                        reward.rarity === "mythic" && "bg-amber-500 text-black border border-amber-300",
                        reward.rarity === "epic" && "bg-purple-600 text-white border border-purple-400",
                        reward.rarity === "rare" && "bg-cyan-600 text-white border border-cyan-300",
                        reward.rarity === "common" && "bg-emerald-600 text-white border border-emerald-300"
                      )}
                    >
                      {reward.rarity === "mythic" && <Crown className="w-3 h-3 fill-black" />}
                      <span>{reward.rarityLabel}</span>
                    </div>
                  </div>

                  {/* Card Description & Reward Payload */}
                  <div className="p-2 space-y-1.5 text-center">
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                      {reward.title}
                    </h3>
                    <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                      {reward.flavorText}
                    </p>

                    {/* Mana Reward Badge */}
                    <div className="pt-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 border border-orange-500/40 text-orange-300 text-xs sm:text-sm font-black shadow-md">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>+{reward.manaPoints} Mana-Punkte</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revealed Post-Loot Action Bar */}
            {stage === "revealed" && (
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                {availableBoosters > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStage("ready");
                      setTearProgress(0);
                      setReward(null);
                      setIsFlipped(false);
                    }}
                    className="w-full flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all active:scale-95 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Nächsten Booster rippen ({availableBoosters})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeBoosterModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                >
                  <span>Fertig & Schließen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info: Current Mana Points Balance */}
      <div className="absolute bottom-4 inset-x-0 mx-auto text-center z-40 px-4 pointer-events-none">
        <p className="text-xs text-neutral-400">
          Dein Gesamtkonto: <b className="text-amber-400 font-extrabold">{manaPoints} Mana-Punkte</b>
        </p>
      </div>
    </div>
  );
}
