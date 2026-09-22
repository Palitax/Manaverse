"use client";

import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { ShieldCheck, Sparkles, Crown } from "lucide-react";
import Image from "next/image";

interface HoloAvatarFrameProps {
  avatarUrl: string;
  username: string;
  role: UserRole;
  verified: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showBadges?: boolean;
  className?: string;
}

export function HoloAvatarFrame({
  avatarUrl,
  username,
  role,
  verified,
  size = "md",
  showBadges = true,
  className,
}: HoloAvatarFrameProps) {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
  };

  const badgeSizeMap = {
    sm: "w-3.5 h-3.5 -bottom-1 -right-1 text-[8px]",
    md: "w-5 h-5 -bottom-1.5 -right-1.5 text-[10px]",
    lg: "w-6 h-6 -bottom-1 -right-1 text-xs",
    xl: "w-8 h-8 -bottom-1 -right-1 text-sm",
  };

  const roleStyles = {
    founder: {
      outer: "p-[3px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 founder-glow animate-pulse",
      inner: "border-2 border-amber-300/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
      badgeColor: "bg-amber-500 text-black",
      icon: <Crown className="w-3 h-3 text-amber-900" />,
      label: "Founder",
    },
    beta: {
      outer: "p-[3px] bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 beta-glow animate-holo",
      inner: "border-2 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
      badgeColor: "bg-cyan-500 text-black",
      icon: <Sparkles className="w-3 h-3 text-cyan-950" />,
      label: "Beta",
    },
    admin: {
      outer: "p-[3px] bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 shadow-rose-500/30",
      inner: "border-2 border-rose-400/80",
      badgeColor: "bg-rose-500 text-white",
      icon: <Crown className="w-3 h-3" />,
      label: "Admin",
    },
    member: {
      outer: "p-[2px] bg-white/10",
      inner: "border border-white/20",
      badgeColor: "bg-neutral-800 text-white",
      icon: null,
      label: "Member",
    },
  };

  const config = roleStyles[role] || roleStyles.member;

  return (
    <div className={cn("relative inline-block select-none", className)}>
      {/* Outer frame */}
      <div className={cn("rounded-full transition-all duration-300", config.outer)}>
        {/* Inner container */}
        <div
          className={cn(
            "rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center relative",
            sizeMap[size],
            config.inner
          )}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-neutral-300">
              {username.slice(0, 2).toUpperCase()}
            </span>
          )}

          {/* Holographic light reflection sheen */}
          {(role === "founder" || role === "beta") && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none opacity-60 mix-blend-overlay" />
          )}
        </div>
      </div>

      {/* Verified Shield Badge (at bottom right) */}
      {showBadges && verified && (
        <div
          title="Verifizierter User (Mind. 3 erfolgreiche Deals)"
          className={cn(
            "absolute rounded-full flex items-center justify-center bg-blue-600 text-white border-2 border-[#090b10] shadow-md shadow-blue-500/50 z-20 animate-bounce",
            badgeSizeMap[size]
          )}
          style={{ animationDuration: "3s" }}
        >
          <ShieldCheck className="w-full h-full p-0.5" />
        </div>
      )}

      {/* Founder / Beta indicator chip */}
      {showBadges && (role === "founder" || role === "beta") && (
        <div
          className={cn(
            "absolute -top-1 -right-1 rounded-full flex items-center justify-center border border-black/40 shadow-sm z-20",
            role === "founder" ? "bg-amber-400 text-black" : "bg-cyan-400 text-black",
            size === "sm" ? "p-0.5" : "p-1"
          )}
          title={config.label}
        >
          {role === "founder" ? (
            <Crown className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
          ) : (
            <Sparkles className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
          )}
        </div>
      )}
    </div>
  );
}
