import { describe, it, expect } from "vitest";
import {
  BOSS_COOLDOWN_MS,
  canAttemptBoss,
  bossCooldownRemaining,
  spendGemsForInstantRetry,
  INSTANT_RETRY_GEM_COST,
} from "./boss";

const MINUTE = 60 * 1000;

describe("canAttemptBoss", () => {
  it("allows first attempt with no history", () => {
    expect(canAttemptBoss(null, new Date("2026-08-19T00:00:00Z"))).toBe(true);
  });

  it("blocks retry within cooldown", () => {
    const last = new Date("2026-08-19T00:00:00Z");
    const now = new Date("2026-08-19T00:29:59Z");
    expect(canAttemptBoss(last, now)).toBe(false);
  });

  it("allows retry exactly at cooldown boundary", () => {
    const last = new Date("2026-08-19T00:00:00Z");
    const now = new Date("2026-08-19T00:30:00Z");
    expect(canAttemptBoss(last, now)).toBe(true);
  });

  it("allows retry after cooldown", () => {
    const last = new Date("2026-08-19T00:00:00Z");
    const now = new Date("2026-08-19T10:00:00Z");
    expect(canAttemptBoss(last, now)).toBe(true);
  });
});

describe("bossCooldownRemaining", () => {
  it("returns 0 when no history", () => {
    expect(bossCooldownRemaining(null, new Date("2026-08-19T00:00:00Z"))).toBe(0);
  });

  it("returns remaining cooldown ms", () => {
    const last = new Date("2026-08-19T00:00:00Z");
    const now = new Date("2026-08-19T00:10:00Z");
    expect(bossCooldownRemaining(last, now)).toBe(20 * MINUTE);
  });

  it("returns 0 when cooldown already elapsed", () => {
    const last = new Date("2026-08-19T00:00:00Z");
    const now = new Date("2026-08-19T00:31:00Z");
    expect(bossCooldownRemaining(last, now)).toBe(0);
  });

  it("uses default cooldown constant of 30 minutes", () => {
    expect(BOSS_COOLDOWN_MS).toBe(30 * MINUTE);
  });
});

describe("spendGemsForInstantRetry", () => {
  it("allows spending when gems suffice", () => {
    expect(spendGemsForInstantRetry(10)).toEqual({ ok: true, gems: 10 - INSTANT_RETRY_GEM_COST });
  });

  it("rejects spending when gems are insufficient", () => {
    expect(spendGemsForInstantRetry(INSTANT_RETRY_GEM_COST - 1)).toEqual({ ok: false, gems: 0 });
  });

  it("rejects spending exactly zero gems", () => {
    expect(spendGemsForInstantRetry(0)).toEqual({ ok: false, gems: 0 });
  });

  it("exposes a positive gem cost constant", () => {
    expect(INSTANT_RETRY_GEM_COST).toBeGreaterThan(0);
  });
});