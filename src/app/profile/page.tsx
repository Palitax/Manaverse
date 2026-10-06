"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import { BorderBeam } from "@/components/magicui/border-beam";
import { UserRole } from "@/types";
import {
  ShieldCheck,
  CheckCircle,
  Crown,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock,
  Save,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

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
            <div>
              <label className="block text-neutral-300 font-semibold mb-2">
                Spezial-Avatarrahmen wählen
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "founder", label: "Founder (Gold)", icon: <Crown className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: "beta", label: "Beta (Holo)", icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> },
                  { id: "member", label: "Standard", icon: null },
                ].map((roleOption) => (
                  <button
                    key={roleOption.id}
                    type="button"
                    onClick={() => setSelectedRole(roleOption.id as UserRole)}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all",
                      selectedRole === roleOption.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    )}
                  >
                    {roleOption.icon}
                    <span>{roleOption.label}</span>
                  </button>
                ))}
              </div>
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
