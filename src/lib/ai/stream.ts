import { createTtlCache } from "./cache";
import { canUse, consume, makeDayKey, type DailyQuota } from "./limits";
import { streamAi } from "./provider";
import type { AiContext, AiMode } from "./types";
import { AiQuotaExceededError, AiUnavailableError } from "./types";

export const DAILY_QUOTAS: Record<AiMode, number> = {
  tutor: 20,
  debug: 20,
  exercises: 20,
  mentor: 30,
};

const quotaStore = createTtlCache<DailyQuota>(10_000);

export function getDailyQuota(userId: string, mode: AiMode): DailyQuota {
  const key = `${userId}|${mode}`;
  const cached = quotaStore.get(key);
  if (cached) return cached;
  const fresh: DailyQuota = {
    key,
    day: makeDayKey(new Date()),
    used: 0,
    limit: DAILY_QUOTAS[mode],
  };
  quotaStore.set(key, fresh, 26 * 60 * 60 * 1000);
  return fresh;
}

export function tryConsumeQuota(userId: string, mode: AiMode): boolean {
  const current = getDailyQuota(userId, mode);
  if (!canUse(current.used, current.limit)) return false;
  const next = consume(current, new Date());
  quotaStore.set(`${userId}|${mode}`, next, 26 * 60 * 60 * 1000);
  return true;
}

export async function* streamAiSse(
  userId: string,
  mode: AiMode,
  lang: "id" | "en",
  question: string,
  context?: AiContext,
  image?: string,
): AsyncGenerator<string, void, unknown> {
  if (!tryConsumeQuota(userId, mode)) {
    throw new AiQuotaExceededError();
  }
  try {
    yield* streamAi(mode, lang, question, context, image);
  } catch (err) {
    if (err instanceof AiUnavailableError) throw err;
    throw new AiUnavailableError();
  }
}

export function encodeSse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}