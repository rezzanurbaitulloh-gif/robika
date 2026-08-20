export const DAY_MS = 86_400_000;

export interface StreakResult {
  streak: number;
  lastActiveAt: Date;
}

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function updateStreak(
  lastActiveAt: Date | null,
  streak: number,
  now: Date,
): StreakResult {
  const today = startOfUtcDay(now);
  if (lastActiveAt === null) {
    return { streak: 1, lastActiveAt: now };
  }
  const last = startOfUtcDay(lastActiveAt);
  const diffDays = Math.round((today - last) / DAY_MS);

  if (diffDays <= 0) {
    return { streak: Math.max(1, streak), lastActiveAt: now };
  }
  if (diffDays === 1) {
    return { streak: streak + 1, lastActiveAt: now };
  }
  return { streak: 1, lastActiveAt: now };
}