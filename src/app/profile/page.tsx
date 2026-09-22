"use client";

import React, { useState } from "react";
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

export default function ProfilePage() {
  const { currentUser, updateProfile, deals, confirmDeal } = useStore();

  const [username, setUsername] = useState(currentUser.username);
  const [whatnotUsername, setWhatnotUsername] = useState(currentUser.whatnotUsername || "");
  const [discordUsername, setDiscordUsername] = useState(currentUser.discordUsername || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
