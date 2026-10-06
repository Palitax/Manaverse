"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import {
  ShoppingBag,
  ArrowLeftRight,
  Search,
  PlusCircle,
  ShieldCheck,
  Settings,
  ChevronDown,
  Home,
  LogOut,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    users,
    switchUser,
    isAuthenticated,
    loginWithDiscord,
    logout,
    openAuthModal,
  } = useStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Verkaufen", href: "/sell", icon: <PlusCircle className="w-4 h-4" /> },
    { label: "Kaufen", href: "/buy", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Tauschen", href: "/trade", icon: <ArrowLeftRight className="w-4 h-4" /> },
    { label: "Gesucht", href: "/looking-for", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo (The epic custom Manaforge Wordmark) */}
        <Link
          href="/"
          className={cn(
            "flex items-center group py-0.5 transition-all duration-300",
            isHome && !scrolled
              ? "opacity-0 pointer-events-none -translate-x-2"
              : "opacity-100 translate-x-0"
          )}
        >
          <img
            src="/manaforge-logo.png"
            alt="MANAFORGE"
            className="h-9 sm:h-11 md:h-12 w-auto max-w-[170px] sm:max-w-[210px] object-contain drop-shadow-[0_2px_14px_rgba(249,115,22,0.45)] group-hover:scale-105 group-hover:drop-shadow-[0_4px_22px_rgba(249,115,22,0.85)] transition-all duration-300"
          />
        </Link>

        {/* Center Nav items (High-contrast glass pills) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 backdrop-blur-md",
                  isActive
                    ? "bg-white/20 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                    : "text-white/85 hover:text-white bg-black/35 hover:bg-black/55 border border-white/10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Profile & Discord Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loginWithDiscord()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(88,101,242,0.35)] hover:shadow-[0_0_20px_rgba(88,101,242,0.55)] active:scale-95 cursor-pointer min-h-[36px]"
                title="Schnell per Discord anmelden"
              >
                <DiscordIcon className="w-4 h-4" />
                <span>Discord</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.55)] active:scale-95 cursor-pointer min-h-[36px]"
              >
                <span>Anmelden / Registrieren</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-md transition-colors focus:outline-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                <HoloAvatarFrame
                  avatarUrl={currentUser.avatarUrl}
                  username={currentUser.username}
                  role={currentUser.role}
                  verified={currentUser.verified}
                  size="sm"
                />
                <span className="hidden sm:inline-block text-sm font-semibold text-white">
                  {currentUser.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-300" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c111d]/98 backdrop-blur-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 border border-white/15 animate-in fade-in duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-neutral-400">
                      {currentUser.discordUsername ? "Via Discord angemeldet" : "Angemeldet"}
                    </p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      {currentUser.username}
                      <span
                        className={cn(
                          "text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded",
                          currentUser.role === "admin" && "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.3)]",
                          currentUser.role === "founder" && "bg-amber-400/20 text-amber-300",
                          currentUser.role === "beta" && "bg-cyan-400/20 text-cyan-300",
                          currentUser.role === "member" && "bg-neutral-800 text-neutral-300"
                        )}
                      >
                        {currentUser.role === "admin" ? "⚡ Admin" : currentUser.role}
                      </span>
                    </p>
                    {currentUser.discordUsername && (
                      <p className="text-[10px] text-indigo-300 mt-0.5">
                        Discord: @{currentUser.discordUsername}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Mein Profil & Deals ({currentUser.dealsCount})
                  </Link>

                  {(currentUser.role === "founder" || currentUser.role === "admin") && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                      Admin-Zentrale & Rollen
                    </Link>
                  )}

                  <div className="border-t border-white/10 my-1 pt-1">
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Abmelden
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern iOS 26 Floating Island Tab Bar */}
      <div className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 max-w-sm mx-auto z-50 pointer-events-auto">
        <nav
          aria-label="Mobile Navigation"
          className="flex items-center justify-around p-1.5 rounded-2xl bg-[#080c14]/80 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 px-1 rounded-xl transition-all duration-200 active:scale-90",
                  isActive
                    ? "bg-white/15 text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.25)] border border-white/10 font-bold"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <div className="w-4 h-4 flex items-center justify-center">{item.icon}</div>
                <span className="text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
