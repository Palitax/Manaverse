"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "../frames/holo-avatar-frame";
import {
  ShoppingBag,
  ArrowLeftRight,
  Target,
  PlusCircle,
  Home,
  Zap,
  Gift,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    label: "Start",
    href: "/",
    icon: Home,
    dot: "bg-white",
    mobileActive: "bg-white/[0.12] text-ink border-hairline-strong",
  },
  {
    label: "Verkaufen",
    href: "/sell",
    icon: PlusCircle,
    dot: "bg-emerald-400",
    mobileActive: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  },
  {
    label: "Kaufen",
    href: "/buy",
    icon: ShoppingBag,
    dot: "bg-amber-400",
    mobileActive: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  },
  {
    label: "Tauschen",
    href: "/trade",
    icon: ArrowLeftRight,
    dot: "bg-violet-400",
    mobileActive: "bg-violet-400/15 text-violet-300 border-violet-400/30",
  },
  {
    label: "Gesucht",
    href: "/looking-for",
    icon: Target,
    dot: "bg-orange-400",
    mobileActive: "bg-orange-400/15 text-orange-300 border-orange-400/30",
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    loginWithDiscord,
    openAuthModal,
    availableBoosters,
    canClaimDailyBooster,
    openBoosterModal,
  } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Wordmark */}
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
            src="/manaforge-logo.webp"
            alt="MANAFORGE"
            loading="lazy"
            decoding="async"
            className="h-9 sm:h-11 md:h-12 w-auto max-w-[170px] sm:max-w-[210px] object-contain drop-shadow-[0_2px_14px_rgba(249,115,22,0.4)] group-hover:scale-[1.03] transition-transform duration-200"
          />
        </Link>

        {/* Center Desktop Navigation Dock */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-surface-1/85 backdrop-blur-xl border border-hairline shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[38px]",
                  isActive
                    ? "bg-white/[0.1] text-ink border border-hairline-strong"
                    : "text-ink-muted hover:text-ink hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {isActive && <span className={cn("w-1.5 h-1.5 rounded-full", item.dot)} />}
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Auth / Booster & Profile */}
        <div className="flex items-center gap-2">
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loginWithDiscord()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 rounded-xl bg-discord hover:bg-[#4752c4] text-white text-xs font-bold transition-colors active:scale-[0.98] cursor-pointer min-h-[40px]"
                title="Schnell per Discord anmelden"
              >
                <DiscordIcon className="w-4 h-4" />
                <span>Discord</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="inline-flex items-center gap-1.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black transition-colors active:scale-[0.98] cursor-pointer min-h-[40px]"
              >
                <span>Anmelden</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {availableBoosters > 0 ? (
                <button
                  type="button"
                  onClick={openBoosterModal}
                  className="inline-flex items-center gap-1.5 px-3 rounded-xl bg-surface-1/90 hover:bg-surface-2 border border-amber-400/35 text-amber-200 text-xs font-bold backdrop-blur-md active:scale-[0.98] transition-colors cursor-pointer min-h-[40px]"
                  title="Booster digital öffnen"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Booster</span>
                  <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums">
                    {availableBoosters}
                  </span>
                </button>
              ) : canClaimDailyBooster ? (
                <button
                  type="button"
                  onClick={openBoosterModal}
                  className="inline-flex items-center gap-1.5 px-3 rounded-xl bg-surface-1/90 hover:bg-surface-2 border border-emerald-400/35 text-emerald-200 text-xs font-bold backdrop-blur-md active:scale-[0.98] transition-colors cursor-pointer min-h-[40px]"
                  title="Täglicher Gratis-Booster bereit"
                >
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Gratis-Booster</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </button>
              ) : null}

              <Link
                href="/profile"
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 rounded-full bg-surface-1/85 hover:bg-surface-2 border border-hairline hover:border-hairline-strong backdrop-blur-md transition-colors cursor-pointer active:scale-[0.98] min-h-[40px]"
                title="Mein Profil anzeigen"
              >
                <HoloAvatarFrame
                  avatarUrl={currentUser.avatarUrl}
                  username={currentUser.username}
                  role={currentUser.role}
                  verified={currentUser.verified}
                  size="sm"
                />
                <span className="hidden sm:inline-block text-xs font-semibold text-ink max-w-[120px] truncate">
                  {currentUser.username}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Island Tab Bar */}
      <div className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-2.5 right-2.5 max-w-md mx-auto z-50 pointer-events-auto">
        <nav
          aria-label="Mobile Navigation"
          className="flex items-center justify-around p-1.5 rounded-2xl bg-surface-1/95 backdrop-blur-xl border border-hairline-strong shadow-[0_14px_40px_rgba(0,0,0,0.8)]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 px-1 rounded-xl border transition-colors active:scale-95",
                  isActive
                    ? cn(item.mobileActive, "font-bold")
                    : "text-ink-subtle hover:text-ink border-transparent"
                )}
              >
                <Icon className="w-4 h-4" />
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
