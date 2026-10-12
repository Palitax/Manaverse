"use client";

import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { AdminMoltenFrame } from "./admin-molten-frame";

interface HoloAvatarFrameProps {
  avatarUrl: string;
  username: string;
  role: UserRole;
  verified: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showBadges?: boolean;
  className?: string;
  children?: React.ReactNode;
  imageTransform?: {
    zoom: number;
    pan: { x: number; y: number };
    rotation: number;
  };
}

export function HoloAvatarFrame({
  avatarUrl,
  username,
  role,
  verified,
  size = "md",
  showBadges = true,
  className,
  children,
  imageTransform,
}: HoloAvatarFrameProps) {
  // EXCLUSIVE ADMIN MOLTEN FLAME FRAME
  if (role === "admin") {
    return (
      <AdminMoltenFrame
        avatarUrl={avatarUrl}
        username={username}
        size={size}
        verified={verified}
        showBadges={showBadges}
        className={className}
        children={children}
        imageTransform={imageTransform}
      />
    );
  }

  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
    "2xl": "w-32 h-32 text-2xl",
  };

  const roleStyles = {
    founder: {
      outer: "p-[3px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 founder-glow animate-pulse",
      inner: "border-2 border-amber-300/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
    },
    beta: {
      outer: "p-[3px] bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 beta-glow animate-holo",
      inner: "border-2 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    },
    admin: {
      outer: "p-[3px] bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 shadow-orange-500/50",
      inner: "border-2 border-orange-500/90 shadow-[0_0_15px_rgba(255,80,0,0.6)]",
    },
    member: {
      outer: "p-[2px] bg-white/10",
      inner: "border border-white/20",
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
              style={
                imageTransform
                  ? {
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: `translate(${imageTransform.pan.x}px, ${imageTransform.pan.y}px) rotate(${imageTransform.rotation}deg) scale(${imageTransform.zoom})`,
                      transformOrigin: "center center",
                      userSelect: "none",
                      pointerEvents: "none",
                    }
                  : undefined
              }
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

          {children}
        </div>
      </div>
    </div>
  );
}
