export interface DailyQuota {
  key: string;
  day: string;
  used: number;
  limit: number;
}

export function makeDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function canUse(used: number, limit: number): boolean {
  return used < limit;
}

export function consume(quota: DailyQuota, now: Date): DailyQuota {
  const day = makeDayKey(now);
  if (day !== quota.day) {
    return { ...quota, day, used: 1 };
  }
  if (!canUse(quota.used, quota.limit)) {
    return { ...quota };
  }
  return { ...quota, used: quota.used + 1 };
}