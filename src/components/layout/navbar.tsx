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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090b10]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(56,189,248,0.35)] group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-black rounded-[9px] overflow-hidden flex items-center justify-center">
              <img
                src="/manaforge-icon.png"
                alt="Manaforge Logo"
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
          </div>
          <div>
            <span className="font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-300">
              MANAFORGE
            </span>
          </div>
        </Link>

        {/* Center Nav items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-500/15 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:border-indigo-500/50 transition-colors"
          >
            {currentUser.verified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-300 font-semibold">Verified</span>
                <span className="text-neutral-500">({currentUser.dealsCount} Deals)</span>
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
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
            >
              <HoloAvatarFrame
                avatarUrl={currentUser.avatarUrl}
                username={currentUser.username}
                role={currentUser.role}
                verified={currentUser.verified}
                size="sm"
              />
              <span className="hidden sm:inline-block text-sm font-medium text-neutral-200">
                {currentUser.username}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
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
