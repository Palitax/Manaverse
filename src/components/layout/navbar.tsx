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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, users, switchUser } = useStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Verkaufen", href: "/sell", icon: <PlusCircle className="w-4 h-4" /> },
    { label: "Kaufen", href: "/buy", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Tauschen", href: "/trade", icon: <ArrowLeftRight className="w-4 h-4" /> },
    { label: "Gesucht", href: "/looking-for", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo (The epic custom Manaforge Wordmark) */}
        <Link href="/" className="flex items-center group py-0.5">
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

        {/* Right side: Profile & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* User selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-md transition-colors focus:outline-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
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
                className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/10"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs text-neutral-400">Aktiver Account</p>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    {currentUser.username}
                    <span
                      className={cn(
                        "text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded",
                        currentUser.role === "founder" && "bg-amber-400/20 text-amber-300",
                        currentUser.role === "beta" && "bg-cyan-400/20 text-cyan-300",
                        currentUser.role === "member" && "bg-neutral-800 text-neutral-300"
                      )}
                    >
                      {currentUser.role}
                    </span>
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Mein Profil & Deals ({currentUser.dealsCount})
                </Link>

                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-amber-400" />
                  Manacards Postfach & Discord
                </Link>

                <div className="border-t border-white/10 my-1 pt-1">
                  <p className="px-3 py-1 text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Account wechseln (Testing)
                  </p>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => switchUser(u.id)}
                      className={cn(
                        "w-full text-left flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors",
                        u.id === currentUser.id
                          ? "bg-indigo-600/30 text-white font-semibold"
                          : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <HoloAvatarFrame
                          avatarUrl={u.avatarUrl}
                          username={u.username}
                          role={u.role}
                          verified={u.verified}
                          size="sm"
                          showBadges={false}
                        />
                        <span>{u.username}</span>
                      </div>
                      <span className="text-[10px] capitalize opacity-70">
                        {u.role} • {u.dealsCount}d
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
