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

console.log("=== STARTING BOOSTER SYSTEM VERIFICATION ===");

// 1. Verify Assets
const boosterPath = path.join(process.cwd(), "public/manaforge-booster.jpg");
const cardBackPath = path.join(process.cwd(), "public/manaforge-card-back.jpg");
const cardFrontPath = path.join(process.cwd(), "public/mana-crystal-card.jpg");

assert(fs.existsSync(boosterPath) && fs.statSync(boosterPath).size > 10000, "Booster pack asset exists and is valid size");
assert(fs.existsSync(cardBackPath) && fs.statSync(cardBackPath).size > 10000, "Card back asset exists and is valid size");
assert(fs.existsSync(cardFrontPath) && fs.statSync(cardFrontPath).size > 10000, "Card front asset exists and is valid size");

// 2. Verify Reward definitions
assert(BOOSTER_REWARDS.length === 4, "4 Booster reward tiers are configured");
for (const reward of BOOSTER_REWARDS) {
  assert(Boolean(reward.id && reward.title && reward.manaPoints > 0), `Reward ${reward.id} has title and manaPoints`);
  assert(Boolean(reward.cardImage && reward.flavorText), `Reward ${reward.id} has cardImage and flavorText`);
}

// 3. Verify Roll distribution over 10,000 simulations
const counts: Record<string, number> = { common: 0, rare: 0, epic: 0, mythic: 0 };
const SIMULATIONS = 10000;

for (let i = 0; i < SIMULATIONS; i++) {
  const rolled = rollBoosterReward();
  counts[rolled.rarity] = (counts[rolled.rarity] || 0) + 1;
}

console.log("10,000 Roll Distribution:", counts);

assert(counts.common > counts.rare, "Common is more frequent than Rare");
assert(counts.rare > counts.epic, "Rare is more frequent than Epic");
assert(counts.epic > counts.mythic, "Epic is more frequent than Mythic");
assert(counts.mythic > 0, "Mythic cards drop at least once");

const commonPct = (counts.common / SIMULATIONS) * 100;
const rarePct = (counts.rare / SIMULATIONS) * 100;
const epicPct = (counts.epic / SIMULATIONS) * 100;
const mythicPct = (counts.mythic / SIMULATIONS) * 100;

assert(commonPct >= 45 && commonPct <= 55, `Common % is ~50% (got ${commonPct.toFixed(1)}%)`);
assert(rarePct >= 25 && rarePct <= 35, `Rare % is ~30% (got ${rarePct.toFixed(1)}%)`);
assert(epicPct >= 11 && epicPct <= 19, `Epic % is ~15% (got ${epicPct.toFixed(1)}%)`);
assert(mythicPct >= 2.5 && mythicPct <= 7.5, `Mythic % is ~5% (got ${mythicPct.toFixed(1)}%)`);

// 4. Verify 24-Hour Timer & Daily Claim Logic
assert(isDailyBoosterClaimable(null) === true, "Null claim timestamp is claimable");
assert(isDailyBoosterClaimable(undefined) === true, "Undefined claim timestamp is claimable");

const twentyFiveHoursAgo = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
assert(isDailyBoosterClaimable(twentyFiveHoursAgo) === true, "25 hours ago is claimable");

const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
assert(isDailyBoosterClaimable(twoHoursAgo) === false, "2 hours ago is not claimable");

// 5. Verify Countdown Formatting
const countdownReady = formatDailyBoosterCountdown(null);
assert(countdownReady.isReady === true && countdownReady.formatted === "Bereit!", "Countdown for null is Ready");

const countdownActive = formatDailyBoosterCountdown(twoHoursAgo);
assert(countdownActive.isReady === false, "Countdown for 2h ago is not ready");
assert(countdownActive.hours === 21 || countdownActive.hours === 22, `Remaining hours should be ~22 (got ${countdownActive.hours})`);
assert(countdownActive.formatted.includes("Std."), `Formatted string contains 'Std.' (got '${countdownActive.formatted}')`);

console.log("=== ALL BOOSTER VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
