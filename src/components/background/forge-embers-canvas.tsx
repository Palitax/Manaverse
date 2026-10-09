"use client";

import React, { useEffect, useRef } from "react";
import { AmbientCardKey } from "@/lib/ambient-theme";

interface ForgeEmbersCanvasProps {
  activeTheme: AmbientCardKey;
  isPaused: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  speedY: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  hue: number;
  saturation: number;
  lightness: number;
}

const THEME_COLOR_RANGES: Record<
  "forge" | "sell" | "buy" | "trade" | "looking-for",
  { hMin: number; hMax: number; s: number; lMin: number; lMax: number }
> = {
  // Warme magische Schmiede: Goldgelb bis Magma-Orange
  forge: { hMin: 24, hMax: 42, s: 95, lMin: 55, lMax: 75 },
  // Verkaufen (Rayquaza): Smaragdgrün bis Mint
  sell: { hMin: 145, hMax: 168, s: 85, lMin: 50, lMax: 70 },
  // Kaufen (Pikachu): Elektrisches Gold bis Cyan-Akzent
  buy: { hMin: 42, hMax: 54, s: 100, lMin: 60, lMax: 80 },
  // Tauschen (Mewtu): Psycho-Violett bis Magenta
  trade: { hMin: 270, hMax: 305, s: 90, lMin: 55, lMax: 75 },
  // Gesucht (Glurak): Loderndes Flammen-Orange bis Feuerrot
  "looking-for": { hMin: 10, hMax: 28, s: 95, lMin: 50, lMax: 70 },
};

export function ForgeEmbersCanvas({
  activeTheme,
  isPaused,
  className,
}: ForgeEmbersCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Resizing & DPR handling (auf max 1.5 begrenzt für maximale Akkuschonung)
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Partikel-Anzahl responsiv: Mobile ca. 35, Desktop 65
    const particleCount = width < 640 ? 32 : width < 1024 ? 48 : 65;
    const particles: Particle[] = [];

    const getThemeConfig = (theme: AmbientCardKey) => {
      const key = theme || "forge";
      return THEME_COLOR_RANGES[key] || THEME_COLOR_RANGES.forge;
    };

    const createParticle = (initialRandomY = false): Particle => {
      const conf = getThemeConfig(activeTheme);
      const hue = conf.hMin + Math.random() * (conf.hMax - conf.hMin);
      const lightness = conf.lMin + Math.random() * (conf.lMax - conf.lMin);

      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 10 + Math.random() * 80,
        radius: 0.9 + Math.random() * 1.8,
        alpha: 0,
        targetAlpha: 0.35 + Math.random() * 0.55,
        speedY: 0.45 + Math.random() * 0.75,
        swayAmp: 0.8 + Math.random() * 2.2,
        swaySpeed: 0.0018 + Math.random() * 0.0025,
        swayPhase: Math.random() * Math.PI * 2,
        hue,
        saturation: conf.s,
        lightness,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      if (document.hidden || isPaused) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min((now - lastTime) / 16.666, 2.5); // Normalisierter Frametakt (~60fps)
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const targetConf = getThemeConfig(activeTheme);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Sanfte Farbadaption bei Themenwechsel
        const targetHue = targetConf.hMin + (p.swayPhase % 1) * (targetConf.hMax - targetConf.hMin);
        p.hue += (targetHue - p.hue) * 0.05 * delta;

        // Vertikale Bewegung nach oben
        p.y -= p.speedY * delta;

        // Natürlicher Sinus-Schwebegang
        p.swayPhase += p.swaySpeed * delta;
        const currentX = p.x + Math.sin(p.swayPhase) * p.swayAmp;

        // Ein- und Ausblenden:
        // Unten sanft aufblenden, im oberen Drittel allmählich verblassen
        const progressY = p.y / height; // 1 = unten, 0 = ganz oben
        let verticalFade = 1;
        if (progressY > 0.85) {
          verticalFade = (1 - progressY) / 0.15; // Einblenden beim Start von unten
        } else if (progressY < 0.25) {
          verticalFade = Math.max(0, progressY / 0.25); // Verblassen nach oben
        }

        p.alpha += (p.targetAlpha - p.alpha) * 0.08 * delta;
        const effectiveAlpha = Math.max(0, Math.min(1, p.alpha * verticalFade));

        // Partikel zeichnen mit feinem Weichzeichner-Glow
        if (effectiveAlpha > 0.02) {
          ctx.beginPath();
          ctx.arc(currentX, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${effectiveAlpha})`;
          ctx.shadowColor = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${effectiveAlpha * 0.8})`;
          ctx.shadowBlur = p.radius * 3.5;
          ctx.fill();
        }

        // Reset am oberen Bildschirmrand oder wenn vollständig verblasst
        if (p.y < -20 || (progressY < 0.05 && effectiveAlpha <= 0.03)) {
          particles[i] = createParticle(false);
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTheme, isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className={className || "absolute inset-0 pointer-events-none select-none"}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
