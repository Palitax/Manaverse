import {
  BOOSTER_REWARDS,
  rollBoosterReward,
  isDailyBoosterClaimable,
  formatDailyBoosterCountdown,
} from "../src/lib/booster-rewards";
import fs from "fs";
import path from "path";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

console.log("=== STARTING COMPREHENSIVE BOOSTER SYSTEM VERIFICATION ===");

// 1. Verify Assets
const boosterPath = path.join(process.cwd(), "public/manaforge-booster.jpg");
const cardBackPath = path.join(process.cwd(), "public/manaforge-card-back.jpg");
const cardFrontPath = path.join(process.cwd(), "public/mana-crystal-card.jpg");

assert(fs.existsSync(boosterPath) && fs.statSync(boosterPath).size > 100000, "Booster pack asset exists and is high-res (>100KB)");
assert(fs.existsSync(cardBackPath) && fs.statSync(cardBackPath).size > 100000, "Card back asset exists and is high-res (>100KB)");
assert(fs.existsSync(cardFrontPath) && fs.statSync(cardFrontPath).size > 100000, "Card front asset exists and is high-res (>100KB)");

// 2. Verify Reward definitions & strictly German titles
assert(BOOSTER_REWARDS.length === 4, "4 Booster reward tiers are configured");
const expectedTitles = [
  "Mana-Splitter",
  "Leuchtender Mana-Kristall",
  "Prismatischer Mana-Kristall",
  "Strahlender Mana-Kristall",
];

BOOSTER_REWARDS.forEach((reward, i) => {
  assert(reward.title === expectedTitles[i], `Reward tier ${reward.rarity} has strictly German title '${expectedTitles[i]}' (got '${reward.title}')`);
  assert(reward.manaPoints > 0, `Reward ${reward.id} has positive mana points (${reward.manaPoints})`);
  assert(Boolean(reward.cardImage && reward.flavorText), `Reward ${reward.id} has cardImage and flavorText`);
});

// 3. Verify Roll distribution over 20,000 simulations
const counts: Record<string, number> = { common: 0, rare: 0, epic: 0, mythic: 0 };
const SIMULATIONS = 20000;

for (let i = 0; i < SIMULATIONS; i++) {
  const rolled = rollBoosterReward();
  counts[rolled.rarity] = (counts[rolled.rarity] || 0) + 1;
}

console.log("20,000 Roll Distribution:", counts);

assert(counts.common > counts.rare, "Common is more frequent than Rare");
assert(counts.rare > counts.epic, "Rare is more frequent than Epic");
assert(counts.epic > counts.mythic, "Epic is more frequent than Mythic");
assert(counts.mythic > 0, "Mythic cards drop at least once");

const commonPct = (counts.common / SIMULATIONS) * 100;
const rarePct = (counts.rare / SIMULATIONS) * 100;
const epicPct = (counts.epic / SIMULATIONS) * 100;
const mythicPct = (counts.mythic / SIMULATIONS) * 100;

assert(commonPct >= 47 && commonPct <= 53, `Common % is ~50% (got ${commonPct.toFixed(1)}%)`);
assert(rarePct >= 27 && rarePct <= 33, `Rare % is ~30% (got ${rarePct.toFixed(1)}%)`);
assert(epicPct >= 12 && epicPct <= 18, `Epic % is ~15% (got ${epicPct.toFixed(1)}%)`);
assert(mythicPct >= 3.5 && mythicPct <= 6.5, `Mythic % is ~5% (got ${mythicPct.toFixed(1)}%)`);

// 4. Verify 24-Hour Timer & Daily Claim Logic
assert(isDailyBoosterClaimable(null) === true, "Null claim timestamp is claimable");
assert(isDailyBoosterClaimable(undefined) === true, "Undefined claim timestamp is claimable");

const twentyFiveHoursAgo = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
assert(isDailyBoosterClaimable(twentyFiveHoursAgo) === true, "25 hours ago is claimable");

const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
assert(isDailyBoosterClaimable(twoHoursAgo) === false, "2 hours ago is not claimable");

// 5. Verify Countdown Formatting & Sub-hour precision
const countdownReady = formatDailyBoosterCountdown(null);
assert(countdownReady.isReady === true && countdownReady.formatted === "Bereit!", "Countdown for null is Ready");

const countdown2hAgo = formatDailyBoosterCountdown(twoHoursAgo);
assert(countdown2hAgo.isReady === false, "Countdown for 2h ago is not ready");
assert(countdown2hAgo.hours === 21 || countdown2hAgo.hours === 22, `Remaining hours should be ~22 (got ${countdown2hAgo.hours})`);
assert(countdown2hAgo.formatted.includes("Std."), `Formatted string contains 'Std.' (got '${countdown2hAgo.formatted}')`);

// 23h 30m ago => remaining ~30 mins (under 1 hour)
const twentyThreeAndHalfHoursAgo = new Date(Date.now() - (23.5 * 3600 * 1000)).toISOString();
const countdown30m = formatDailyBoosterCountdown(twentyThreeAndHalfHoursAgo);
assert(countdown30m.isReady === false, "Countdown for 23.5h ago is not ready");
assert(countdown30m.hours === 0, `Under 1h remaining has hours === 0 (got ${countdown30m.hours})`);
assert(countdown30m.formatted.includes("Min.") && countdown30m.formatted.includes("Sek."), `Under 1h shows Min. and Sek. (got '${countdown30m.formatted}')`);

// 23h 59m 45s ago => remaining 15 seconds
const almostDue = new Date(Date.now() - (24 * 3600 * 1000 - 15 * 1000)).toISOString();
const countdown15s = formatDailyBoosterCountdown(almostDue);
assert(countdown15s.isReady === false, "Countdown for almost due is not ready");
assert(countdown15s.formatted.includes("Sek."), `Seconds countdown format works (got '${countdown15s.formatted}')`);

console.log("=== ALL BOOSTER VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
