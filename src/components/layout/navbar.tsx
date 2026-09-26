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
    { label: "Sell", href: "/sell", icon: <PlusCircle className="w-4 h-4" /> },
    { label: "Buy", href: "/buy", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Trade", href: "/trade", icon: <ArrowLeftRight className="w-4 h-4" /> },
    { label: "Looking For", href: "/looking-for", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-md border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo (Standalone without frame or black box) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/manaforge-logo.png"
            alt="Manaforge Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(99,102,241,0.85)] transition-all duration-300"
          />
          <div>
            <span className="font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              MANAFORGE
            </span>
          </div>
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
          {/* Deals / Verified Progress Pill */}
          <Link
            href="/profile"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-xs text-neutral-200 hover:border-indigo-500/50 hover:bg-black/60 transition-all drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            {currentUser.verified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-300 font-semibold">Verified</span>
                <span className="text-neutral-400">({currentUser.dealsCount} Deals)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>{currentUser.dealsCount}/3 Deals bis Verified</span>
              </>
            )}
          </Link>

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

      {/* Mobile nav bar fixed at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-1.5 px-1 border-t border-white/10 bg-[#090b10]/95 backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-1 text-[11px] font-semibold py-1 px-1 rounded-xl transition-all active:scale-95",
                isActive
                  ? "text-cyan-400 bg-white/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <div className="w-4 h-4 flex items-center justify-center">{item.icon}</div>
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
