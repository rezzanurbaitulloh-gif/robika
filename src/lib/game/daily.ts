export function hashDate(date: Date): number {
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function dailyLevelId(date: Date, levelIds: string[]): string {
  if (levelIds.length === 0) return "";
  return levelIds[hashDate(date) % levelIds.length];
}

export function dailyChallengeOf(
  levelId: string,
  date: Date,
  levelIds: string[],
): boolean {
  return dailyLevelId(date, levelIds) === levelId;
}

export function dailyEndsAt(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
}

export interface DailyWorldLike {
  flag?: string;
  levels: { id: string; isBoss?: boolean }[];
}

export function dailyPoolIds(
  worldList: DailyWorldLike[],
  flagOn: (flag: string) => boolean,
): string[] {
  return worldList
    .filter((w) => !w.flag || flagOn(w.flag))
    .flatMap((w) => w.levels.filter((l) => !l.isBoss).map((l) => l.id));
}