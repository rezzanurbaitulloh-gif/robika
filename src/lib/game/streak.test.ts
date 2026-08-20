import { describe, it, expect } from "vitest";
import { updateStreak } from "./streak";

const DAY_MS = 86_400_000;
const now = new Date("2026-08-20T10:00:00Z");

function daysAgo(n: number): Date {
  return new Date(now.getTime() - n * DAY_MS);
}

describe("updateStreak", () => {
  it("starts a streak at 1 on first activity", () => {
    const result = updateStreak(null, 0, now);
    expect(result.streak).toBe(1);
    expect(result.lastActiveAt.getTime()).toBe(now.getTime());
  });

  it("increments when active yesterday", () => {
    const result = updateStreak(daysAgo(1), 5, now);
    expect(result.streak).toBe(6);
  });

  it("keeps the streak when active earlier today", () => {
    const earlierToday = new Date(now.getTime() - 2 * 3_600_000);
    const result = updateStreak(earlierToday, 5, now);
    expect(result.streak).toBe(5);
  });

  it("resets to 1 when the streak was broken", () => {
    const result = updateStreak(daysAgo(3), 12, now);
    expect(result.streak).toBe(1);
  });

  it("keeps streak when the last activity is within the same UTC day boundary", () => {
    const result = updateStreak(new Date("2026-08-19T23:00:00Z"), 4, now);
    expect(result.streak).toBe(5);
  });
});