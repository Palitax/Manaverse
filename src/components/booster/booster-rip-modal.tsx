"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { BoosterReward } from "@/types";
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
  | "ready" // User sees the pack with the glowing tear seam and animated swipe indicator
  | "ripping" // User is dragging / swiping across
  | "ripped" // Top cap slices off and flies away with energy flash
  | "extracting" // 3 cards slide up out from inside the open pack
  | "reveal_waiting" // Card is hovering face-down, prompt to tap to flip
  | "revealed"; // Card is flipped face up, loot shown with celebration!

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function BoosterRipModal() {
  const {
    currentUser,
    isBoosterModalOpen,
    closeBoosterModal,
    availableBoosters,
    ripBoosterPack,
    manaPoints,
    canClaimDailyBooster,
    dailyBoosterCountdown,
    claimDailyBooster,
    loginWithDiscord,
  } = useStore();

  const [stage, setStage] = useState<RipStage>("ready");
  const [tearProgress, setTearProgress] = useState(0); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [reward, setReward] = useState<BoosterReward | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  // Drag tracking refs
  const tearTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound effects simulation with Web Audio API
  const playSoundEffect = useCallback((type: "tear" | "pop" | "reveal" | "mythic") => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      if (type === "tear") {
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1400;
        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start();
      } else if (type === "pop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(360, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);
      } else if (type === "reveal" || type === "mythic") {
        const frequencies =
          type === "mythic"
            ? [523.25, 659.25, 783.99, 1046.5]
            : [440, 554.37, 659.25];
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
      setIsDragging(false);
      setReward(null);
      setIsFlipped(false);
      setErrorMsg(null);
      setIsClaiming(false);
    }
  }, [isBoosterModalOpen]);

  // Execute full pack tear sequence once user crosses rip threshold
  const triggerRipComplete = useCallback(async () => {
    if (stage !== "ready" && stage !== "ripping") return;
    if (availableBoosters <= 0) {
      setErrorMsg("Keine Booster verfügbar.");
      setStage("ready");
      return;
    }

    setStage("ripped");
    setTearProgress(100);
    setIsDragging(false);
    playSoundEffect("pop");

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([30, 40, 70]);
      } catch {}
    }

    try {
      const outcome = await ripBoosterPack();
      setReward(outcome);

      // Advance to card extraction after pack pops and top cap flies off
      setTimeout(() => {
        setStage("extracting");
        setTimeout(() => {
          setStage("reveal_waiting");
        }, 1100);
      }, 550);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fehler beim Öffnen des Booster Packs.";
      setErrorMsg(msg);
      setStage("ready");
      setTearProgress(0);
    }
  }, [stage, availableBoosters, ripBoosterPack, playSoundEffect]);

  // Pointer drag handlers (Unified mouse and touch via Pointer Events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stage !== "ready" && stage !== "ripping") return;
    if (availableBoosters <= 0) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    setStage("ripping");
    playSoundEffect("tear");

    if (tearTrackRef.current) {
      const rect = tearTrackRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setTearProgress(progress);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !tearTrackRef.current) return;
    const rect = tearTrackRef.current.getBoundingClientRect();
    const currentX = e.clientX;
    const progress = Math.max(0, Math.min(100, ((currentX - rect.left) / rect.width) * 100));

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const dx = currentX - lastXRef.current;
    const velocity = dt > 0 ? dx / dt : 0; // px/ms

    lastXRef.current = currentX;
    lastTimeRef.current = now;

    setTearProgress(progress);

    if (Math.random() < 0.2) {
      playSoundEffect("tear");
    }

    // Trigger rip if reached 65% OR high-velocity swipe across
    if (progress >= 65 || (progress >= 30 && velocity > 0.5)) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      triggerRipComplete();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

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
        particleCount: 160,
        spread: 95,
        origin: { y: 0.55 },
        colors: ["#f59e0b", "#06b6d4", "#ec4899", "#8b5cf6"],
      });
    } else {
      playSoundEffect("reveal");
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.55 },
      });
    }

    setTimeout(() => {
      setStage("revealed");
    }, 700);
  };

  const handleClaimDailyInModal = async () => {
    setIsClaiming(true);
    try {
      const ok = await claimDailyBooster();
      if (ok) {
        setStage("ready");
        setTearProgress(0);
        setErrorMsg(null);
      }
    } finally {
      setIsClaiming(false);
    }
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
                : "bg-gradient-to-b from-cyan-500/30 via-orange-500/20 to-transparent"
              : "bg-gradient-to-b from-cyan-600/25 via-amber-500/15 to-transparent"
          )}
        />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Close Button */}
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-cyan-500/30 text-xs font-bold text-neutral-200 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Manaforge Booster Arena</span>
          <span className="text-neutral-500">•</span>
          {availableBoosters > 0 ? (
            <span className="text-cyan-400 font-extrabold">
              {availableBoosters} {availableBoosters === 1 ? "Booster" : "Booster"} bereit
            </span>
          ) : canClaimDailyBooster ? (
            <span className="text-emerald-400 font-extrabold">Täglicher Gratis-Booster bereit!</span>
          ) : (
            <span className="text-neutral-400 font-semibold">Keine Booster übrig</span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="relative z-30 flex flex-col items-center justify-center max-w-lg w-full min-h-[460px] sm:min-h-[560px]">
        {/* Error message toast if needed */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span>!</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= CASE 1: NOT LOGGED IN ================= */}
        {!currentUser && (
          <div className="flex flex-col items-center text-center space-y-5 p-6 max-w-sm">
            <BoosterPackCard size="md" isLocked={true} interactive={false} />
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">Melde dich mit Discord an</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Registriere dich mit deinem Discord-Account und schalte sofort deinen kostenlosen Manaforge Willkommens-Booster frei!
              </p>
            </div>
            <button
              type="button"
              onClick={() => loginWithDiscord()}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#5865F2]/30 transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
            >
              <DiscordIcon className="w-5 h-5 flex-shrink-0" />
              <span>Mit Discord anmelden & Booster erhalten</span>
            </button>
          </div>
        )}

        {/* ================= CASE 2: LOGGED IN BUT 0 PACKS & DAILY CLAIMABLE ================= */}
        {currentUser && availableBoosters === 0 && canClaimDailyBooster && stage === "ready" && (
          <div className="flex flex-col items-center text-center space-y-5 p-4 max-w-sm animate-in fade-in zoom-in-95 duration-300">
            <BoosterPackCard size="md" interactive={false} />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Täglicher Bonus bereit</span>
              </div>
              <h3 className="text-lg font-black text-white">Dein Gratis-Booster wartet!</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Hole dir jetzt deinen täglichen kostenlosen Booster ab und ziehe ihn direkt auf!
              </p>
            </div>
            <button
              type="button"
              onClick={handleClaimDailyInModal}
              disabled={isClaiming}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Gift className="w-4 h-4 text-white" />
              <span>{isClaiming ? "Wird abgeholt..." : "🎁 Gratis-Booster abholen & rippen"}</span>
            </button>
          </div>
        )}

        {/* ================= CASE 3: LOGGED IN BUT 0 PACKS & COOLDOWN ACTIVE ================= */}
        {currentUser && availableBoosters === 0 && !canClaimDailyBooster && stage === "ready" && (
          <div className="flex flex-col items-center text-center space-y-5 p-4 max-w-sm animate-in fade-in zoom-in-95 duration-300">
            <BoosterPackCard
              size="md"
              isLocked={true}
              lockedCountdown={dailyBoosterCountdown}
              interactive={false}
            />
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Alle Booster geöffnet!</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Du hast heute alle deine Booster aufgerissen. Alle 24 Stunden steht dir ein neuer kostenloser Booster zur Verfügung!
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-cyan-300 text-xs font-black">
                  <Timer className="w-4 h-4 text-cyan-400" />
                  <span>Nächster Gratis-Booster in: {dailyBoosterCountdown}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeBoosterModal}
              className="w-full py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Verstanden & Schließen
            </button>
          </div>
        )}

        {/* ================= CASE 4: ACTIVE RIPPING STAGES (POKÉMON POCKET STYLE) ================= */}
        {availableBoosters > 0 && (stage === "ready" || stage === "ripping" || stage === "ripped") && (
          <div className="relative flex flex-col items-center">
            {/* The 3D Booster Pack */}
            <div
              className={cn(
                "relative transition-all duration-700 ease-out",
                stage === "ripped" && "scale-[1.01]"
              )}
            >
              <BoosterPackCard
                size="hero"
                showRipGuide={stage === "ready" || stage === "ripping"}
                isRipped={stage === "ripped"}
                tearProgress={tearProgress}
                isDragging={isDragging}
                interactive={stage === "ready"}
                enableTearInteraction={stage === "ready" || stage === "ripping"}
                tearTrackRef={tearTrackRef}
                onTearPointerDown={handlePointerDown}
                onTearPointerMove={handlePointerMove}
                onTearPointerUp={handlePointerUp}
                onTearPointerCancel={handlePointerUp}
              />
            </div>

            {/* Quick 1-Click Rip Fallback (Accessible & Thumb-Friendly per AGENTS.md) */}
            {(stage === "ready" || stage === "ripping") && (
              <div className="mt-5 w-full max-w-xs flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={triggerRipComplete}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Booster sofort aufreißen (1-Klick)</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center font-medium">
                  Tipp: Wische mit Finger oder Maus über die leuchtende Naht.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= STAGE 2: 3 CARDS SLIDING OUT (KARTEN KOMMEN RAUS) ================= */}
        {stage === "extracting" && (
          <div className="relative w-[285px] sm:w-[330px] md:w-[360px] h-[465px] sm:h-[540px] md:h-[590px] flex items-center justify-center z-50 pointer-events-none">
            {/* Open Booster Pack Body at the bottom */}
            <div className="absolute inset-0 z-0 opacity-80 scale-95 translate-y-8">
              <BoosterPackCard
                size="hero"
                isRipped={true}
                tearProgress={100}
                interactive={false}
              />
            </div>

            {/* Mystical Mana Rays Bursting from Booster Opening */}
            <div className="absolute inset-x-4 top-[10%] h-36 bg-gradient-to-t from-cyan-400/50 via-amber-400/30 to-transparent blur-xl animate-pulse z-10" />

            {/* Left Fan Card */}
            <div className="absolute w-[220px] sm:w-[260px] h-[330px] sm:h-[390px] rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-neutral-900 -rotate-8 -translate-x-12 -translate-y-4 animate-in slide-in-from-bottom-24 duration-700 opacity-70 z-20">
              <img
                src="/manaforge-card-back.jpg"
                alt="Manaforge Kartenstapel"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Fan Card */}
            <div className="absolute w-[220px] sm:w-[260px] h-[330px] sm:h-[390px] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-neutral-900 rotate-8 translate-x-12 -translate-y-4 animate-in slide-in-from-bottom-24 duration-700 opacity-70 z-20">
              <img
                src="/manaforge-card-back.jpg"
                alt="Manaforge Kartenstapel"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Main Card rising smoothly out of pack */}
            <div className="relative z-30 w-[240px] sm:w-[280px] h-[360px] sm:h-[420px] -translate-y-8 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(6,182,212,0.6)] border-2 border-cyan-400/60 animate-in slide-in-from-bottom-36 fade-in duration-800 bg-neutral-900">
              <img
                src="/manaforge-card-back.jpg"
                alt="Hauptkarte"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-radial from-amber-400/30 via-transparent to-transparent animate-pulse" />
            </div>
          </div>
        )}

        {/* ================= STAGES 3 & 4: FLOATING CARD & 3D FLIP REVEAL ================= */}
        {(stage === "reveal_waiting" || stage === "revealed") && reward && (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 w-full">
            {/* Prompt Banner */}
            <div className="text-center mb-4">
              {!isFlipped ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-xs sm:text-sm font-black text-cyan-300 animate-bounce shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tippe auf die Karte, um deinen Fund zu enthüllen!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs sm:text-sm font-black text-emerald-300 shadow-md">
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
                  "absolute -inset-6 rounded-3xl blur-2xl opacity-80 transition-all duration-700 pointer-events-none",
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
                {/* 1. CARD BACK FACE (Pre-flip) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-neutral-900"
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
                  <div className="absolute inset-0 bg-radial from-amber-500/25 via-transparent to-transparent animate-pulse pointer-events-none" />
                </div>

                {/* 2. CARD FRONT FACE (Revealed Collectible Card) */}
                <div
                  className={cn(
                    "absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] bg-[#0c101c] border-2",
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
                  {/* Full High-Resolution Collectible Card Artwork */}
                  <img
                    src={reward.cardImage}
                    alt={reward.title}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Holographic foil sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-65 mix-blend-color-dodge pointer-events-none" />

                  {/* Rarity Stamp Badge (Top Right) */}
                  <div
                    className={cn(
                      "absolute top-2.5 right-2.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xl flex items-center gap-1 backdrop-blur-md",
                      reward.rarity === "mythic" && "bg-amber-500 text-black border border-amber-300 shadow-amber-500/50",
                      reward.rarity === "epic" && "bg-purple-600 text-white border border-purple-400",
                      reward.rarity === "rare" && "bg-cyan-600 text-white border border-cyan-300",
                      reward.rarity === "common" && "bg-emerald-600 text-white border border-emerald-300"
                    )}
                  >
                    {reward.rarity === "mythic" && <Crown className="w-3.5 h-3.5 fill-black" />}
                    <span>{reward.rarityLabel}</span>
                  </div>

                  {/* Floating Mana Reward Banner (Bottom) */}
                  <div className="absolute bottom-3 inset-x-3 pointer-events-none">
                    <div className="w-full py-2 px-3 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-400/50 flex items-center justify-between shadow-2xl">
                      <div className="text-left">
                        <span className="text-[10px] text-neutral-300 block font-bold">
                          {reward.title}
                        </span>
                        <span className="text-[9px] text-neutral-400 block line-clamp-1">
                          {reward.subtitle}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black shrink-0">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>+{reward.manaPoints} Mana</span>
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
                    className="w-full flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
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
          Dein Gesamtkonto: <b className="text-amber-400 font-extrabold">{manaPoints.toLocaleString()} Mana-Punkte</b>
        </p>
      </div>
    </div>
  );
}
