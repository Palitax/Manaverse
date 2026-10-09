"use client";

import { useSyncExternalStore } from "react";

export type AmbientCardKey = "sell" | "buy" | "trade" | "looking-for" | null;

let currentHoveredCard: AmbientCardKey = null;
const listeners = new Set<() => void>();

export function setAmbientHoveredCard(key: AmbientCardKey) {
  if (currentHoveredCard !== key) {
    currentHoveredCard = key;
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("Fehler beim Benachrichtigen des Ambient-Listeners:", e);
      }
    });
  }
}

export function getAmbientHoveredCard(): AmbientCardKey {
  return currentHoveredCard;
}

export function subscribeAmbientHoveredCard(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useAmbientHoveredCard(): AmbientCardKey {
  return useSyncExternalStore(
    subscribeAmbientHoveredCard,
    getAmbientHoveredCard,
    () => null
  );
}
