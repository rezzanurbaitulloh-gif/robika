import { levelFromXp, speedBonusXp } from "@/lib/core/xp";

export const XP_BASE_PER_LEVEL = 100;
export const XP_PER_STAR_STEP = 25;
export const STAR_XP_BONUS: Record<number, number> = { 1: 0, 2: 30, 3: 50 };

export function xpForCompletion(levelIndex: number, stars: number): number {
  if (levelIndex < 0) throw new RangeError("levelIndex must be >= 0");
  if (stars < 1 || stars > 3) throw new RangeError("stars must be 1..3");
  return XP_BASE_PER_LEVEL + levelIndex * XP_PER_STAR_STEP + STAR_XP_BONUS[stars];
}

export interface CompletionInput {
  levelIndex: number;
  stars: number;
  existingStars: number;
  isFirstCompletion: boolean;
  elapsedMs: number;
  parMs: number;
  baseXp?: number;
}

export interface CompletionRewards {
  starsToCredit: number;
  xp: number;
}

export function computeCompletionRewards(input: CompletionInput): CompletionRewards {
  const {
    levelIndex,
    stars,
    existingStars,
    isFirstCompletion,
    elapsedMs,
    parMs,
    baseXp,
  } = input;
  const starsToCredit = Math.max(0, stars - existingStars);

  if (!isFirstCompletion || starsToCredit === 0) {
    return { starsToCredit, xp: 0 };
  }

  const base = baseXp ?? xpForCompletion(levelIndex, stars);
  const bonus = speedBonusXp(base, elapsedMs, parMs);
  return { starsToCredit, xp: base + bonus };
}

export function applyLevelUp(
  profile: { xp: number; level: number },
  gainedXp: number,
): { newXp: number; newLevel: number; leveledUp: boolean } {
  const newXp = profile.xp + gainedXp;
  const newLevel = levelFromXp(newXp);
  return { newXp, newLevel, leveledUp: newLevel > profile.level };
}