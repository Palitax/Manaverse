"use client";

import React, { useEffect, useRef } from "react";

export function BlueHourPrism() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Handle high DPI resize
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startTime = performance.now();

    const render = (currentTime: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (currentTime - startTime) * 0.001; // seconds
      // Slow, hypnotic, ambient breathing pace
      const t = prefersReducedMotion ? 0 : elapsed * 0.55;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Determine strip count based on screen width:
      // Mobile: 14 strips, Tablet: 18 strips, Desktop: 24 strips (matching screenshot)
      const numStrips = width < 640 ? 14 : width < 1024 ? 18 : 24;
      const stripWidth = width / numStrips;

      // Base background color fallback (Storm Blue)
      ctx.fillStyle = "#22265E";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < numStrips; i++) {
        // Normalized horizontal coordinate across strips [0, 1]
        const xNorm = numStrips > 1 ? i / (numStrips - 1) : 0.5;

        // Base arch modeled directly after Image 2:
        // Peak is centered at x ~ 0.44.
        // Skewed curve: rises from left, crests at 44%, descends more gently to the right.
        const distFromPeak = xNorm - 0.44;
        const spread = distFromPeak < 0 ? 0.36 : 0.48;
        const bell = Math.exp(-Math.pow(distFromPeak / spread, 2));

        // Tilt so the right side drops deeper than the left side (matching screenshot)
        const tilt = -0.15 * (xNorm - 0.44);
        const baseLift = 0.16 + 0.44 * bell + tilt;

        // Harmonic traveling waves that modulate the arch over time
        const wave1 = Math.sin(t * 0.85 + xNorm * 3.6) * 0.045;
        const wave2 = Math.cos(t * 0.55 - xNorm * 2.2) * 0.032;
        const wave3 = Math.sin(t * 1.15 + i * 0.28) * 0.018;

        // Total vertical lift (0 = low, 1 = high)
        // High lift means bright colors rise higher into the screen
        const lift = Math.max(0.04, Math.min(0.68, baseLift + wave1 + wave2 + wave3));

        // Vertical gradient span & positioning
        const gradSpan = height * 1.30;
        const yTop = height * (0.58 - lift * 0.98);
        const yBottom = yTop + gradSpan;

        // Vertical gradient for this specific strip
        const grad = ctx.createLinearGradient(0, yTop, 0, yBottom);

        // Authentic Blue Hour color stops
        grad.addColorStop(0.00, "#22265E"); // Storm Blue
        grad.addColorStop(0.26, "#3B4EA8"); // Clear Hanada
        grad.addColorStop(0.48, "#7785DE"); // Pale Lagoon
        grad.addColorStop(0.70, "#BCC4F1"); // Glass Indigo
        grad.addColorStop(1.00, "#E4E9FA"); // Ice Hanada

        // Draw the vertical strip with slight subpixel overlap to prevent seam gaps
        ctx.fillStyle = grad;
        const xPos = i * stripWidth;
        ctx.fillRect(Math.floor(xPos), 0, Math.ceil(stripWidth + 0.8), height);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
      {/* Dynamic 60fps GPU Canvas rendering the animated Prism strips */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
        style={{ width: "100%", height: "100%" }}
      />

      {/* 2% Fine Grain Texture Overlay (Matching Noise: 2% in screenshot) */}
      <div className="blue-hour-grain absolute inset-0 pointer-events-none" />

      {/* Subtle Cinematic Vignette for optimal card and text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 pointer-events-none" />
    </div>
  );
}
