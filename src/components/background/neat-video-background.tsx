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

    // Gentle slow-motion playback rate for ambient fluid gradient flow
    video.playbackRate = 0.85;

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
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-[#090b14]">
      {/* High-performance hardware-accelerated animated gradient video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/gradient-poster.jpg"
        onCanPlay={() => setIsVideoLoaded(true)}
        className={`w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700 ${
          isVideoLoaded ? "opacity-100" : "opacity-90"
        }`}
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      >
        {/* Optimized WebM for Chrome, Firefox & Android */}
        <source src="/slow_motion_gradient_bg.webm" type="video/webm" />
        {/* Hardware-accelerated MP4 for iOS Mobile Safari & Apple Silicon */}
        <source src="/slow_motion_gradient_bg.mp4" type="video/mp4" />
      </video>

      {/* Cinematic subtle vignette scrim for high contrast with cards and typography */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45 pointer-events-none" />

      {/* Radial soft glow to highlight the central cards and lava branding */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_35%,rgba(0,0,0,0.35)_95%)] pointer-events-none" />
    </div>
  );
}
