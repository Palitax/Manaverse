"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import {
  X,
  CheckCircle2,
  Sparkles,
  User,
  Radio,
  Image as ImageIcon,
  Save,
  ArrowRight,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

function DiscordIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const AVATAR_PRESETS = [
  {
    name: "Rayquaza",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png",
  },
  {
    name: "Glurak",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    name: "Pikachu",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    name: "Mewtu",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  },
  {
    name: "Gengar",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
  {
    name: "Evoli",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  },
];

export function DiscordWelcomeModal() {
  const { currentUser, updateProfile, openBoosterModal } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [whatnotUsername, setWhatnotUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Check whether we should show the welcome modal
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const hasWelcomeParam =
      params.get("discord_welcome") === "1" ||
      params.get("welcome") === "discord" ||
      params.get("discord_onboarding") === "1";
    const hasStorageFlag = sessionStorage.getItem("manaforge_discord_welcome") === "true";

    if (hasWelcomeParam || hasStorageFlag) {
      setIsOpen(true);
      // Clean up the URL parameter cleanly without page reload
      if (hasWelcomeParam) {
        const url = new URL(window.location.href);
        url.searchParams.delete("discord_welcome");
        url.searchParams.delete("welcome");
        url.searchParams.delete("discord_onboarding");
        window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
      }
      sessionStorage.removeItem("manaforge_discord_welcome");
    }
  }, []);

  // Sync profile data once user is loaded
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setWhatnotUsername(currentUser.whatnotUsername || "");
      setBio(currentUser.bio || "");
      setAvatarUrl(currentUser.avatarUrl || "");
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        username: username.trim() || currentUser?.username || "Trainer",
        avatarUrl: avatarUrl || currentUser?.avatarUrl,
        whatnotUsername: whatnotUsername.trim() || undefined,
        bio: bio.trim() || undefined,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsSaving(false);
        setIsOpen(false);
      }, 600);
    } catch (err) {
      console.error("Fehler beim Speichern des Profils:", err);
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121316] border border-orange-500/30 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(249,115,22,0.15)] max-h-[92dvh] overflow-y-auto">
        {/* Subtle orange ambient glow in background */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-500/15 via-amber-500/5 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center z-20"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Discord + Manaforge Branding */}
        <div className="text-center space-y-3 mb-6 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center shadow-lg">
              <img
                src="/manaforge-logo.png"
                alt="MANAFORGE"
                className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.5)]"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 text-xs font-black">
              ⚡
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] shadow-lg shadow-[#5865F2]/20">
              <DiscordIcon className="w-8 h-8" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Erfolgreich mit Discord verbunden</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Willkommen bei Manaforge!
          </h2>
          <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
            Dein Discord-Account wurde verknüpft. Hier kannst du deinen Trainer-Namen, deine Bio und dein Profilbild direkt anpassen.
          </p>
        </div>

        {/* Free Discord Welcome Booster Reward Card */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-cyan-500/20 border border-orange-500/50 shadow-lg relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-16 rounded-xl overflow-hidden border border-amber-400/50 shadow-md shrink-0 bg-neutral-900">
              <img
                src="/manaforge-booster.jpg"
                alt="Manaforge Booster"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-400">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Discord-Bonus erhalten!</span>
              </div>
              <h3 className="text-sm font-black text-white">
                1x Gratis Manaforge Booster
              </h3>
              <p className="text-[11px] text-neutral-300">
                Öffne deinen Booster digital und sammle Mana-Punkte.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openBoosterModal();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs shadow-md shadow-orange-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Jetzt Booster rippen</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-5 relative z-10">
          {/* Avatar Section */}
          <div className="bg-black/35 rounded-2xl p-4 border border-white/10 space-y-3">
            <label className="block text-xs font-bold text-neutral-300">
              Profilbild anpassen
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Current Avatar Holo Frame Preview */}
              <div className="shrink-0 flex flex-col items-center">
                <HoloAvatarFrame
                  avatarUrl={avatarUrl}
                  username={username || "Trainer"}
                  role={currentUser?.role || "member"}
                  verified={Boolean(currentUser?.verified)}
                  size="lg"
                />
                <span className="text-[10px] text-neutral-400 mt-1">Live-Vorschau</span>
              </div>

              {/* Quick Pick Presets */}
              <div className="flex-1 w-full space-y-2">
                <div className="text-[11px] text-neutral-400 font-semibold">
                  Wähle einen Avatar oder nutze dein Discord-Bild:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentUser?.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(currentUser.avatarUrl)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                        avatarUrl === currentUser.avatarUrl
                          ? "bg-orange-500/20 text-orange-300 border-orange-500 shadow-md"
                          : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                      <span>Discord-Bild</span>
                    </button>
                  )}

                  {AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setAvatarUrl(p.url)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                        avatarUrl === p.url
                          ? "bg-orange-500/20 text-orange-300 border-orange-500 shadow-md"
                          : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-4 h-4 object-contain" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>

                {/* Option for custom image url */}
                <div className="pt-1">
                  {!showCustomAvatarInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomAvatarInput(true)}
                      className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold underline cursor-pointer"
                    >
                      + Eigene Bild-URL eingeben
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="url"
                        placeholder="https://dein-bild.jpg"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 min-h-[36px]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl.trim()) {
                            setAvatarUrl(customAvatarUrl.trim());
                          }
                        }}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[36px]"
                      >
                        Übernehmen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trainer-Name Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Trainer-Name (Benutzername)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Dein gewünschter Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors min-h-[44px]"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Wird auf deinen Inseraten und im Marktplatz angezeigt.
            </p>
          </div>

          {/* Whatnot Username (optional) */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Whatnot-Nutzername <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Radio className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="z.B. all_out_luffy"
                value={whatnotUsername}
                onChange={(e) => setWhatnotUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors min-h-[44px]"
              />
            </div>
          </div>

          {/* Bio (optional) */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Über dich / Bio <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="z.B. Sammle Vintage WOTC Holos & Glurak-Karten..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs border border-white/10 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Später anpassen
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Wird gespeichert..." : "Profil speichern & Starten"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
