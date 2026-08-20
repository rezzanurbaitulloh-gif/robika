import { describe, it, expect } from "vitest";
import {
  refreshHintBalance,
  consumeHint,
  hintCooldownRemaining,
  HINT_CAP,
  HINT_REFRESH_INTERVAL_MS,
} from "./hints";

const DAY = 24 * 60 * 60 * 1000;

describe("refreshHintBalance", () => {
  it("grants full hint balance on first login (no last refresh)", () => {
    const now = new Date("2026-08-19T00:00:00Z");
    const result = refreshHintBalance(0, null, now);
    expect(result.balance).toBe(HINT_CAP);
    expect(result.lastRefreshedAt).toEqual(now);
  });

  it("does not refresh before 3 days pass", () => {
    const last = new Date("2026-08-16T00:00:00Z");
    const now = new Date("2026-08-18T23:59:59Z");
    const result = refreshHintBalance(1, last, now);
    expect(result.balance).toBe(1);
    expect(result.lastRefreshedAt).toEqual(last);
  });

  it("refreshes to cap after 3 days even with balance 0", () => {
    const last = new Date("2026-08-16T00:00:00Z");
    const now = new Date("2026-08-19T00:00:00Z");
    const result = refreshHintBalance(0, last, now);
    expect(result.balance).toBe(HINT_CAP);
  });

  it("never exceeds cap across multiple cycles", () => {
    const last = new Date("2026-08-01T00:00:00Z");
    const now = new Date("2026-08-19T00:00:00Z");
    const result = refreshHintBalance(2, last, now);
    expect(result.balance).toBe(HINT_CAP);
  });

  it("adds hints per cycle but respects cap", () => {
    const last = new Date("2026-08-16T00:00:00Z");
    const now = new Date("2026-08-19T00:00:00Z");
    const result = refreshHintBalance(1, last, now);
    expect(result.balance).toBe(HINT_CAP);
  });
});

describe("consumeHint", () => {
  it("consumes a hint when balance is sufficient", () => {
    expect(consumeHint(3)).toEqual({ ok: true, balance: 2 });
  });

  it("consumes multiple hints", () => {
    expect(consumeHint(3, 2)).toEqual({ ok: true, balance: 1 });
  });

  it("rejects consumption when balance is insufficient", () => {
    expect(consumeHint(0)).toEqual({ ok: false, balance: 0 });
    expect(consumeHint(1, 2)).toEqual({ ok: false, balance: 1 });
  });

  it("does not go below zero on rejection", () => {
    expect(consumeHint(0, 5).balance).toBe(0);
  });
});

describe("hintCooldownRemaining", () => {
  it("returns full interval when never refreshed", () => {
    expect(hintCooldownRemaining(null, new Date("2026-08-19T00:00:00Z"))).toBe(
      HINT_REFRESH_INTERVAL_MS,
    );
  });

  it("returns remaining ms until next refresh", () => {
    const last = new Date("2026-08-18T00:00:00Z");
    const now = new Date("2026-08-18T12:00:00Z");
    expect(hintCooldownRemaining(last, now)).toBe(2.5 * DAY);
  });

  it("returns 0 when refresh is due", () => {
    const last = new Date("2026-08-16T00:00:00Z");
    const now = new Date("2026-08-19T00:00:00Z");
    expect(hintCooldownRemaining(last, now)).toBe(0);
  });
});