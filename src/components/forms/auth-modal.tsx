"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function DiscordIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    loginWithDiscord,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
  } = useStore();

  const [tab, setTab] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (authModalMode) {
      setTab(authModalMode);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setResetSent(false);
  }, [authModalMode, authModalOpen]);

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleDiscordClick = async () => {
    setLoading(true);
    setErrorMsg(null);
    const result = await loginWithDiscord();
    if (result?.error) {
      setErrorMsg(result.error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === "register") {
        if (!username.trim()) {
          setErrorMsg("Bitte gib deinen gewünschten Trainer-Namen ein.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Das Passwort muss mindestens 6 Zeichen lang sein.");
          setLoading(false);
          return;
        }

        const res = await registerWithEmail(email, password, username);
        if (!res.success) {
          setErrorMsg(res.error || "Registrierung fehlgeschlagen.");
        } else {
          setSuccessMsg("Konto erfolgreich erstellt! Du bist jetzt eingeloggt.");
          setTimeout(() => closeAuthModal(), 1200);
        }
      } else {
        const res = await loginWithEmail(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Anmeldung fehlgeschlagen.");
        } else {
          setSuccessMsg("Erfolgreich angemeldet!");
          setTimeout(() => closeAuthModal(), 1000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMsg("Bitte gib zuerst deine E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    const res = await resetPassword(email);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Konnte Reset-Link nicht senden.");
    } else {
      setResetSent(true);
      setSuccessMsg("Ein Link zum Zurücksetzen deines Passworts wurde an deine E-Mail gesendet!");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#121316] border border-orange-500/25 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(249,115,22,0.12)] max-h-[92dvh] overflow-y-auto">
        {/* Subtle orange ambient glow in background */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center z-20"
          aria-label="Dialog schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6 relative z-10">
          <div className="flex justify-center mb-1">
            <img
              src="/manaforge-logo.png"
              alt="MANAFORGE"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_16px_rgba(249,115,22,0.4)]"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {tab === "register" ? "Konto erstellen" : "Willkommen zurück"}
          </h2>
          <p className="text-xs text-neutral-400">
            {tab === "register"
              ? "Werde Teil der Manaforge Pokémon-Community"
              : "Melde dich an, um Karten zu kaufen, tauschen und anzubieten"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-black/40 p-1 mb-5 border border-white/10 relative z-10">
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setErrorMsg(null);
            }}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all min-h-[38px] cursor-pointer",
              tab === "register"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
                : "text-neutral-400 hover:text-white"
            )}
          >
            Registrieren
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg(null);
            }}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all min-h-[38px] cursor-pointer",
              tab === "login"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
                : "text-neutral-400 hover:text-white"
            )}
          >
            Anmelden
          </button>
        </div>

        {/* 1-Click Discord OAuth Option */}
        <div className="space-y-3 mb-5 relative z-10">
          <button
            type="button"
            onClick={handleDiscordClick}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#5865F2]/25 transition-all active:scale-[0.98] cursor-pointer min-h-[44px] disabled:opacity-50"
          >
            <DiscordIcon className="w-5 h-5 flex-shrink-0" />
            <span>
              {tab === "register" ? "Mit Discord registrieren" : "Mit Discord anmelden"}
            </span>
          </button>
          <p className="text-[11px] text-center text-neutral-400">
            Schnellster Weg: Übernimmt automatisch deinen Avatar & Discord-Tag.
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4 z-10">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#121316] px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
            oder mit E-Mail
          </span>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in relative z-10">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in relative z-10">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {tab === "register" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Trainer-Name (Benutzername)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="z.B. AshKetchum"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors min-h-[44px]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              E-Mail-Adresse
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="trainer@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Passwort
              </label>
              {tab === "login" && !resetSent && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-medium transition-colors cursor-pointer"
                >
                  Passwort vergessen?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder={tab === "register" ? "Mindestens 6 Zeichen" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors min-h-[44px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : tab === "register" ? (
              <>
                <span>Konto erstellen</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Anmelden</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="mt-5 text-center text-xs text-neutral-400 relative z-10">
          {tab === "register" ? (
            <p>
              Bereits registriert?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMsg(null);
                }}
                className="text-orange-400 hover:text-orange-300 font-bold underline transition-colors cursor-pointer"
              >
                Hier anmelden
              </button>
            </p>
          ) : (
            <p>
              Noch kein Konto?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMsg(null);
                }}
                className="text-orange-400 hover:text-orange-300 font-bold underline transition-colors cursor-pointer"
              >
                Jetzt registrieren
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
