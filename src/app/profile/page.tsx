"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import { BorderBeam } from "@/components/magicui/border-beam";
import { UserRole } from "@/types";
import {
  ShieldCheck,
  CheckCircle,
  CheckCircle2,
  Crown,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock,
  Save,
  Zap,
  Lock,
  Gift,
  Flame,
  Timer,
  ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { BoosterPackCard } from "@/components/booster/booster-pack-card";

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function ProfilePage() {
  const {
    currentUser,
    updateProfile,
    deals,
    confirmDeal,
    loginWithDiscord,
    logout,
    isAuthenticated,
    openAuthModal,
    manaPoints,
    availableBoosters,
    openedBoostersCount,
    canClaimDailyBooster,
    dailyBoosterCountdown,
    openBoosterModal,
    claimDailyBooster,
  } = useStore();

  const [username, setUsername] = useState(currentUser?.username || "");
  const [whatnotUsername, setWhatnotUsername] = useState(currentUser?.whatnotUsername || "");
  const [discordUsername, setDiscordUsername] = useState(currentUser?.discordUsername || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || "member");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setWhatnotUsername(currentUser.whatnotUsername || "");
      setDiscordUsername(currentUser.discordUsername || "");
      setBio(currentUser.bio || "");
      setAvatarUrl(currentUser.avatarUrl);
      setSelectedRole(currentUser.role);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <BorderBeam size={220} duration={10} colorFrom="#6366f1" colorTo="#06b6d4" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-8 h-8 text-amber-200" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Dein Trainer-Profil</h1>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
              Melde dich an oder erstelle ein kostenloses Konto, um deine Deals einzusehen, dein öffentliches Profil zu bearbeiten und Discord zu verknüpfen.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => loginWithDiscord()}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#5865F2]/25 transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
            >
              <DiscordIcon className="w-5 h-5 flex-shrink-0" />
              <span>Mit Discord anmelden</span>
            </button>

            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer min-h-[44px]"
            >
              Mit E-Mail registrieren oder anmelden
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Deals involving the current user
  const myDeals = deals.filter(
    (d) => d.sellerId === currentUser.id || d.buyerId === currentUser.id
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username,
      whatnotUsername,
      discordUsername,
      bio,
      avatarUrl,
      role: selectedRole,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 pb-24">
      {/* Header Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <BorderBeam size={260} duration={10} colorFrom="#6366f1" colorTo="#ec4899" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <HoloAvatarFrame
            avatarUrl={avatarUrl}
            username={username}
            role={selectedRole}
            verified={currentUser.verified}
            size="xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{username}</h1>

              {/* Badges */}
              {currentUser.verified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold shadow-md shadow-blue-500/20">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> Verifizierter User
                </span>
              )}

              {selectedRole === "admin" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400" /> Administrator ⚡
                </span>
              )}

              {selectedRole === "founder" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Founder
                </span>
              )}

              {selectedRole === "beta" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Beta Tester
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              {bio || "Keine Bio hinterlegt."}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-400">
              {whatnotUsername && (
                <a
                  href={`https://whatnot.com/user/${whatnotUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-yellow-400 hover:underline"
                >
                  Whatnot: @{whatnotUsername} <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {discordUsername && (
                <span className="text-indigo-400">Discord: @{discordUsername}</span>
              )}
              <span className="text-white font-semibold">
                {currentUser.dealsCount} erfolgreiche Deals
              </span>
            </div>
          </div>
        </div>

        {/* Verification Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Verifizierungs-Status (ab 3 Deals)
            </span>
            <span className={currentUser.verified ? "text-blue-400 font-bold" : "text-amber-400 font-bold"}>
              {currentUser.verified
                ? "✓ 100% Verifiziert"
                : `${currentUser.dealsCount} von 3 Deals abgeschlossen`}
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                currentUser.verified
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 w-full"
                  : "bg-gradient-to-r from-amber-500 to-yellow-400"
              )}
              style={{ width: `${Math.min(100, (currentUser.dealsCount / 3) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* MANAFORGE BOOSTER ARENA & SCHATZKAMMER (HIGHLIGHT SECTION) */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(249,115,22,0.15)] bg-gradient-to-b from-[#131622]/95 via-[#0c0f18]/95 to-[#080a10]/95">
        <BorderBeam size={280} duration={8} colorFrom="#f59e0b" colorTo="#06b6d4" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-500/15 via-amber-500/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-500/40 text-[11px] font-black uppercase text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Digital Booster Opening</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Manaforge Booster Arena</span>
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1 leading-relaxed">
              Rippe digitale Manaforge Booster mit interaktiver Foil-Animation, entdecke seltene Mana-Kristalle und sichere dir alle 24 Stunden deinen kostenlosen Daily Booster!
            </p>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="px-4 py-2 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] text-neutral-400 block font-semibold">Booster verfügbar</span>
              <span className="text-lg font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                {availableBoosters} {availableBoosters === 1 ? "Pack" : "Packs"}
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/50 border border-orange-500/30 backdrop-blur-md">
              <span className="text-[10px] text-neutral-400 block font-semibold">Mana-Guthaben</span>
              <span className="text-lg font-black text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-400" />
                {manaPoints.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body: Left 3D Booster Showcase / Right Rewards Dashboard */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          {/* Left Column: Interactive 3D Booster Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div
              onClick={() => {
                openBoosterModal();
              }}
              className="relative cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              title="Klicke hier, um den Booster zu öffnen!"
            >
              <BoosterPackCard
                size="hero"
                showRipGuide={true}
                interactive={true}
                className="mx-auto"
              />

              {/* Ready Indicator Floating Tag */}
              {availableBoosters > 0 && (
                <div className="absolute -top-3 inset-x-0 mx-auto w-fit px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border border-white/40 text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-bounce flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{availableBoosters}x Bereit zum Rippen!</span>
                </div>
              )}
            </div>

            {/* Primary Action Button directly under pack */}
            <div className="w-full max-w-xs space-y-2">
              {availableBoosters > 0 ? (
                <button
                  type="button"
                  onClick={openBoosterModal}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2 group"
                >
                  <Zap className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>Jetzt Booster rippen!</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : canClaimDailyBooster ? (
                <button
                  type="button"
                  onClick={async () => {
                    await claimDailyBooster();
                    openBoosterModal();
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5 text-white" />
                  <span>Täglichen Booster abholen & öffnen</span>
                </button>
              ) : (
                <div className="text-center p-3 rounded-2xl bg-black/40 border border-white/10">
                  <p className="text-xs text-neutral-400 font-semibold flex items-center justify-center gap-1.5">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span>Nächster Gratis-Booster in:</span>
                  </p>
                  <p className="text-sm font-black text-amber-300 mt-0.5">
                    {dailyBoosterCountdown}
                  </p>
                </div>
              )}

              <p className="text-[11px] text-center text-neutral-400">
                Mit der Maus oder per Wischgeste aufziehen & Karte aufdecken.
              </p>
            </div>
          </div>

          {/* Right Column: Rewards Dashboard & Daily Claim Cards */}
          <div className="lg:col-span-7 space-y-4">
            {/* Card 1: Daily 24h Booster Claim */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-orange-500/40 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Täglicher Gratis-Booster</h3>
                    <p className="text-[11px] text-neutral-400">Alle 24 Stunden 1x kostenlos abholbar</p>
                  </div>
                </div>

                <div>
                  {canClaimDailyBooster ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Jetzt abholbereit
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      In {dailyBoosterCountdown}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-xs text-neutral-300">
                  {canClaimDailyBooster
                    ? "Dein täglicher Bonus liegt bereit. Klicke auf Abholen, um deinen Booster direkt gutgeschrieben zu bekommen."
                    : `Du hast deinen täglichen Booster bereits abgeholt. Schau in ${dailyBoosterCountdown} wieder vorbei.`}
                </p>

                {canClaimDailyBooster && (
                  <button
                    type="button"
                    onClick={claimDailyBooster}
                    className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/30 cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Booster einsammeln</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Discord Welcome Pack Status */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-indigo-500/40 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                    <DiscordIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Discord-Registrierungs-Booster</h3>
                    <p className="text-[11px] text-neutral-400">Einmaliger Willkommens-Bonus für Discord-User</p>
                  </div>
                </div>

                <div>
                  {currentUser.hasReceivedDiscordWelcomePack || currentUser.discordUsername ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      Freigeschaltet
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black animate-pulse">
                      ⚡ 1x Gratis Booster Bonus
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-xs text-neutral-300">
                  {currentUser.hasReceivedDiscordWelcomePack || currentUser.discordUsername
                    ? "Dein Discord-Konto wurde verknüpft und dein Free Booster freigeschaltet."
                    : "Verknüpfe jetzt deinen Discord-Account und erhalte direkt 1x kostenlosen Booster Pack geschenkt!"}
                </p>

                {!(currentUser.hasReceivedDiscordWelcomePack || currentUser.discordUsername) && (
                  <button
                    type="button"
                    onClick={() => loginWithDiscord()}
                    className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xs transition-all shadow-md shadow-[#5865F2]/30 cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <DiscordIcon className="w-4 h-4" />
                    <span>Mit Discord verbinden</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 3: Loot Table & Drop Rarities */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Mögliche Funde & Seltenheitsgrade
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Bisher geöffnet: <b className="text-white font-bold">{openedBoostersCount}</b>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-black text-emerald-400 block">Häufig (50%)</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">100 Mana</span>
                  <span className="text-[9px] text-neutral-400">Mana-Splitter</span>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <span className="text-[10px] uppercase font-black text-cyan-400 block">Selten (30%)</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">250 Mana</span>
                  <span className="text-[9px] text-neutral-400">Leuchtkristall</span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <span className="text-[10px] uppercase font-black text-purple-400 block">Episch (15%)</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">500 Mana</span>
                  <span className="text-[9px] text-neutral-400">Prisma-Kristall</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <span className="text-[10px] uppercase font-black text-amber-400 block flex items-center justify-center gap-1">
                    <Crown className="w-3 h-3 fill-amber-400" />
                    Mythisch (5%)
                  </span>
                  <span className="text-xs font-black text-amber-300 mt-0.5 block">1.000 Mana</span>
                  <span className="text-[9px] text-neutral-300 font-semibold">Radiant Crystal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discord Account Status & Quick Connect Card */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shadow-lg shadow-[#5865F2]/25 flex-shrink-0">
                <DiscordIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-white flex items-center gap-1.5">
                  Mit Discord verbunden <CheckCircle className="w-4 h-4 text-emerald-400" />
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Angemeldet als <b className="text-indigo-300">@{currentUser.discordUsername || currentUser.username}</b>
                  {currentUser.email ? ` • ${currentUser.email}` : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 text-xs font-bold transition-all border border-white/10"
            >
              Abmelden
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shadow-lg shadow-[#5865F2]/25 flex-shrink-0">
                <DiscordIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-white">
                  Mit deinem Discord-Account anmelden & registrieren
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Registriere dich mit 1 Klick – dein Discord-Avatar und Benutzername werden automatisch für deine Pokémon-Karten hinterlegt.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => loginWithDiscord()}
              className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-black shadow-lg shadow-[#5865F2]/30 active:scale-95 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <DiscordIcon className="w-4 h-4" />
              Mit Discord registrieren
            </button>
          </div>
        )}
      </div>

      {/* Grid: Edit Profile & Deals History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Edit Profile & Frames */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            Profil & Rahmen bearbeiten
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Avatar Frame Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-neutral-300 font-semibold">
                  Spezial-Avatarrahmen
                </label>
                {currentUser?.role === "admin" && (
                  <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-cyan-400" /> Admin-Blitzrahmen aktiv
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "admin",
                    label: "Admin ⚡",
                    sublabel: "Anime-Blitz",
                    icon: <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-300" />,
                    isLocked: currentUser?.role !== "admin" && currentUser?.role !== "founder",
                  },
                  {
                    id: "founder",
                    label: "Founder",
                    sublabel: "Gold-Glanz",
                    icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
                    isLocked: currentUser?.role !== "founder",
                  },
                  {
                    id: "beta",
                    label: "Beta",
                    sublabel: "Holo-Effekt",
                    icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
                    isLocked: false,
                  },
                  {
                    id: "member",
                    label: "Standard",
                    sublabel: "Schlicht",
                    icon: null,
                    isLocked: false,
                  },
                ].map((roleOption) => {
                  const isSelected = selectedRole === roleOption.id;

                  if (roleOption.isLocked) {
                    return (
                      <div
                        key={roleOption.id}
                        title="Exklusiv für Administratoren. Kann nur durch einen bestehenden Administrator manuell zugewiesen werden."
                        className="p-2.5 rounded-xl border border-white/5 bg-black/40 text-neutral-500 flex flex-col items-center justify-center gap-0.5 opacity-60 cursor-not-allowed select-none min-h-[58px]"
                      >
                        <div className="flex items-center gap-1 text-xs font-bold text-neutral-400">
                          <Lock className="w-3 h-3 text-neutral-500" />
                          <span>{roleOption.label}</span>
                        </div>
                        <span className="text-[9px] text-neutral-500">Gesperrt</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={roleOption.id}
                      type="button"
                      onClick={() => setSelectedRole(roleOption.id as UserRole)}
                      className={cn(
                        "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all min-h-[58px] cursor-pointer",
                        isSelected
                          ? roleOption.id === "admin"
                            ? "bg-cyan-950/40 border-cyan-400 text-white font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                            : "bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20"
                          : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {roleOption.icon}
                        <span>{roleOption.label}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{roleOption.sublabel}</span>
                    </button>
                  );
                })}
              </div>

              {currentUser?.role !== "admin" && currentUser?.role !== "founder" && (
                <p className="text-[11px] text-neutral-500 italic">
                  ⚡ Der animierte Blitzrahmen ist exklusiv für Administratoren und muss manuell von einem Admin im Dashboard vergeben werden.
                </p>
              )}
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Avatar Bild-URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Whatnot Username (@)
                </label>
                <input
                  type="text"
                  value={whatnotUsername}
                  onChange={(e) => setWhatnotUsername(e.target.value)}
                  placeholder="Dein Whatnot Name"
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Discord Username
                </label>
                <input
                  type="text"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="z.B. Levin#0001"
                  className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Bio / Sammler-Schwerpunkt
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-[#111624] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                {savedSuccess ? "Gespeichert! ✓" : "Profil speichern"}
              </button>

              <button
                type="button"
                onClick={handleTestConfetti}
                className="text-neutral-400 hover:text-white underline text-[11px]"
              >
                Konfetti testen
              </button>
            </div>
          </form>
        </div>

        {/* Right: Deals & Mutual Confirmation */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Transaktionen & Deals ({myDeals.length})
            </h2>
            <span className="text-[10px] text-neutral-400">
              Beidseitige Bestätigung
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Sobald Käufer und Verkäufer einen Deal als abgeschlossen markieren, steigt der Punktestand beider User. Bei 3 Deals wird der <b>Verified-Status</b> vergeben.
          </p>

          <div className="space-y-3 pt-2">
            {myDeals.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                Noch keine Deals gestartet. Klicke auf einer Karte auf „Deal anfragen“, um eine Transaktion zu beginnen.
              </div>
            ) : (
              myDeals.map((deal) => {
                const isSeller = deal.sellerId === currentUser.id;
                const isBuyer = deal.buyerId === currentUser.id;
                const myConfirmed = isSeller ? deal.sellerConfirmed : deal.buyerConfirmed;
                const partnerConfirmed = isSeller ? deal.buyerConfirmed : deal.sellerConfirmed;
                const partnerName = isSeller ? deal.buyerUsername : deal.sellerUsername;

                return (
                  <div
                    key={deal.id}
                    className="p-4 rounded-2xl bg-[#0e1320] border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{deal.listingTitle}</p>
                        <p className="text-[11px] text-neutral-400">
                          Partner: <span className="text-indigo-300 font-semibold">{partnerName}</span> ({deal.listingType.toUpperCase()})
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full font-bold text-[10px] border",
                          deal.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        )}
                      >
                        {deal.status === "completed" ? "✓ Abgeschlossen" : "Warte auf Bestätigung"}
                      </span>
                    </div>

                    {/* Status checks */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1.5">
                        <span className={deal.sellerConfirmed ? "text-emerald-400" : "text-neutral-500"}>
                          {deal.sellerConfirmed ? "✓" : "○"}
                        </span>
                        <span className="text-neutral-300">
                          Verkäufer ({deal.sellerUsername})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={deal.buyerConfirmed ? "text-emerald-400" : "text-neutral-500"}>
                          {deal.buyerConfirmed ? "✓" : "○"}
                        </span>
                        <span className="text-neutral-300">
                          Käufer ({deal.buyerUsername})
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    {deal.status !== "completed" && (
                      <div>
                        {myConfirmed ? (
                          <p className="text-[11px] text-amber-400 text-center font-semibold">
                            Du hast bestätigt! Warte auf Bestätigung von {partnerName}...
                          </p>
                        ) : (
                          <button
                            onClick={() => confirmDeal(deal.id, isSeller ? "seller" : "buyer")}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Deal als erfolgreich abschließen
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
