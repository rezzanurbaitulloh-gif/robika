export const HINT_CAP = 3;
export const HINT_REFRESH_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;
const HINTS_PER_CYCLE = 3;

export interface HintRefreshResult {
  balance: number;
  lastRefreshedAt: Date;
}

export function refreshHintBalance(
  balance: number,
  lastRefreshedAt: Date | null,
  now: Date,
): HintRefreshResult {
  if (lastRefreshedAt === null) {
    return { balance: HINT_CAP, lastRefreshedAt: now };
  }

  const elapsed = now.getTime() - lastRefreshedAt.getTime();
  if (elapsed < HINT_REFRESH_INTERVAL_MS) {
    return { balance, lastRefreshedAt };
  }

  const cycles = Math.floor(elapsed / HINT_REFRESH_INTERVAL_MS);
  const refreshedAt = new Date(
    lastRefreshedAt.getTime() + cycles * HINT_REFRESH_INTERVAL_MS,
  );
  return {
    balance: Math.min(HINT_CAP, balance + cycles * HINTS_PER_CYCLE),
    lastRefreshedAt: refreshedAt,
  };
}

export function consumeHint(
  balance: number,
  count = 1,
): { ok: boolean; balance: number } {
  if (count < 1) {
    throw new RangeError("count must be positive");
  }
  if (balance < count) {
    return { ok: false, balance };
  }
  return { ok: true, balance: balance - count };
}

export function hintCooldownRemaining(
  lastRefreshedAt: Date | null,
  now: Date,
): number {
  if (lastRefreshedAt === null) {
    return HINT_REFRESH_INTERVAL_MS;
  }
  const elapsed = now.getTime() - lastRefreshedAt.getTime();
  return Math.max(0, HINT_REFRESH_INTERVAL_MS - elapsed);
}