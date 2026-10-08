import { BoosterReward, BoosterRarity } from "@/types";

export const BOOSTER_REWARDS: BoosterReward[] = [
  {
    id: "reward-mana-crystal-common",
    title: "Mana-Splitter",
    subtitle: "Gewöhnlicher Fund",
    rarity: "common",
    rarityLabel: "Häufig",
    manaPoints: 100,
    cardImage: "/mana-crystal-card.jpg",
    flavorText: "Ein funkelnder Kristallsplitter aus der Tiefe der Schmiede. Erfüllt mit reinster Energie.",
  },
  {
    id: "reward-mana-crystal-rare",
    title: "Leuchtender Mana-Kristall",
    subtitle: "Seltener Fund",
    rarity: "rare",
    rarityLabel: "Selten",
    manaPoints: 250,
    cardImage: "/mana-crystal-card.jpg",
    flavorText: "Dieser Kristall vibriert mit arkaner Macht und verstärkt die Präsenz deiner Sammlung.",
  },
  {
    id: "reward-mana-crystal-epic",
    title: "Prismatischer Mana-Kristall",
    subtitle: "Epischer Fund",
    rarity: "epic",
    rarityLabel: "Episch",
    manaPoints: 500,
    cardImage: "/mana-crystal-card.jpg",
    flavorText: "Ein außergewöhnlich reiner Kristall, der in allen Regenbogenfarben der Mana-Schmiede schimmert.",
  },
  {
    id: "reward-mana-crystal-mythic",
    title: "Radiant Mana Crystal",
    subtitle: "Mythischer Glücksgriff",
    rarity: "mythic",
    rarityLabel: "Mythisch",
    manaPoints: 1000,
    cardImage: "/mana-crystal-card.jpg",
    flavorText: "Legendäre Ur-Energie aus dem Anbeginn von Manaforge. Ein unvergleichlicher Schatz für wahre Sammler!",
  },
];

/**
 * Rolls a weighted random booster reward.
 * Probabilities:
 * - Common: 50% (100 Mana)
 * - Rare: 30% (250 Mana)
 * - Epic: 15% (500 Mana)
 * - Mythic: 5% (1000 Mana)
 */
export function rollBoosterReward(): BoosterReward {
  const roll = Math.random() * 100;
  if (roll < 5) {
    return BOOSTER_REWARDS[3]; // Mythic 5%
  } else if (roll < 20) {
    return BOOSTER_REWARDS[2]; // Epic 15%
  } else if (roll < 50) {
    return BOOSTER_REWARDS[1]; // Rare 30%
  } else {
    return BOOSTER_REWARDS[0]; // Common 50%
  }
}

/**
 * Checks if 24 hours have passed since the last daily booster claim.
 */
export function isDailyBoosterClaimable(lastClaimedAt?: string | null): boolean {
  if (!lastClaimedAt) return true;
  const lastTime = new Date(lastClaimedAt).getTime();
  if (isNaN(lastTime)) return true;
  const now = Date.now();
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  return now - lastTime >= TWENTY_FOUR_HOURS_MS;
}

/**
 * Formats remaining time until next daily booster can be claimed.
 */
export function formatDailyBoosterCountdown(lastClaimedAt?: string | null): {
  isReady: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  if (!lastClaimedAt) {
    return { isReady: true, hours: 0, minutes: 0, seconds: 0, formatted: "Bereit!" };
  }
  const lastTime = new Date(lastClaimedAt).getTime();
  if (isNaN(lastTime)) {
    return { isReady: true, hours: 0, minutes: 0, seconds: 0, formatted: "Bereit!" };
  }
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  const targetTime = lastTime + TWENTY_FOUR_HOURS_MS;
  const diffMs = targetTime - Date.now();

  if (diffMs <= 0) {
    return { isReady: true, hours: 0, minutes: 0, seconds: 0, formatted: "Bereit!" };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = `${hours} Std. ${minutes} Min.`;

  return { isReady: false, hours, minutes, seconds, formatted };
}
