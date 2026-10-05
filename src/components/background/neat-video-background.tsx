"use client";

import React, { useEffect, useRef, useState } from "react";

export function NeatVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce muted state for mobile autoplay policies
    video.defaultMuted = true;
    video.muted = true;

    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    // Attempt autoplay with promise catch for mobile power-saver modes
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsVideoLoaded(true))
        .catch(() => {
          // Mobile low-power mode or autoplay policy prevented video; poster image displays seamlessly
          setIsVideoLoaded(false);
        });
    }

    // Battery & CPU optimization: pause when tab is inactive, resume when active
    const handleVisibilityChange = () => {
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (!prefersReducedMotion) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-[#0e0720]">
      {/* High-performance hardware-accelerated video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/neat-poster.jpg"
        onCanPlay={() => setIsVideoLoaded(true)}
        className={`w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700 ${
          isVideoLoaded ? "opacity-100" : "opacity-90"
        }`}
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      >
        {/* Hardware-accelerated MP4 for iOS Mobile Safari & Apple Silicon */}
        <source src="/neat.firecms.co.mp4" type="video/mp4" />
        {/* Optimized WebM for Chrome, Firefox & Android */}
        <source src="/neat.firecms.co.webm" type="video/webm" />
      </video>

      {/* Subtle cinematic vignette for optimal contrast with logo, cards and text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55 pointer-events-none" />

      {/* Radial soft glow to highlight the central cards and Manaforge lava branding */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(0,0,0,0.45)_90%)] pointer-events-none" />
    </div>
  );
}
