export const XP_PER_LEVEL = 250;

export function xpForLevel(level: number): number {
  if (level < 1) {
    throw new RangeError("level must be >= 1");
  }
  return (level - 1) * XP_PER_LEVEL;
}

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function speedBonusXp(
  baseXp: number,
  elapsedMs: number,
  parMs: number,
): number {
  if (baseXp <= 0) {
    throw new RangeError("baseXp must be positive");
  }
  if (parMs <= 0) {
    throw new RangeError("parMs must be positive");
  }
  const ratio = elapsedMs / parMs;
  if (ratio <= 0.5) return Math.round(baseXp * 0.5);
  if (ratio <= 1) return Math.round(baseXp * 0.25);
  return 0;
}

export function errorFixXp(baseXp: number): number {
  if (baseXp <= 0) {
    throw new RangeError("baseXp must be positive");
  }
  return Math.max(5, Math.round(baseXp * 0.1));
}

export interface LevelProgress {
  level: number;
  intoLevel: number;
  needed: number;
  remaining: number;
  percent: number;
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelFromXp(xp);
  const intoLevel = xp - xpForLevel(level);
  const percent = Math.min(
    100,
    Math.round((intoLevel / XP_PER_LEVEL) * 100),
  );
  return {
    level,
    intoLevel,
    needed: XP_PER_LEVEL,
    remaining: Math.max(0, XP_PER_LEVEL - intoLevel),
    percent,
  };
}