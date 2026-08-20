export const BOSS_COOLDOWN_MS = 30 * 60 * 1000;
export const INSTANT_RETRY_GEM_COST = 5;

export function canAttemptBoss(
  lastAttemptAt: Date | null,
  now: Date,
  cooldownMs: number = BOSS_COOLDOWN_MS,
): boolean {
  if (lastAttemptAt === null) return true;
  return now.getTime() - lastAttemptAt.getTime() >= cooldownMs;
}

export function bossCooldownRemaining(
  lastAttemptAt: Date | null,
  now: Date,
  cooldownMs: number = BOSS_COOLDOWN_MS,
): number {
  if (lastAttemptAt === null) return 0;
  return Math.max(0, cooldownMs - (now.getTime() - lastAttemptAt.getTime()));
}

export function spendGemsForInstantRetry(
  gems: number,
): { ok: boolean; gems: number } {
  if (gems < INSTANT_RETRY_GEM_COST) {
    return { ok: false, gems: 0 };
  }
  return { ok: true, gems: gems - INSTANT_RETRY_GEM_COST };
}