import { describe, it, expect } from "vitest";
import { dailyLevelId, dailyChallengeOf, dailyEndsAt, hashDate } from "./daily";

const levels = ["world-1-level-1", "world-1-level-2", "world-1-level-3", "world-1-level-4"];

describe("hashDate", () => {
  it("is deterministic for the same date", () => {
    expect(hashDate(new Date("2026-08-20T23:59:59Z"))).toBe(
      hashDate(new Date("2026-08-20T00:00:01Z")),
    );
  });

  it("differs across dates", () => {
    expect(hashDate(new Date("2026-08-20"))).not.toBe(hashDate(new Date("2026-08-21")));
  });
});

describe("dailyLevelId", () => {
  it("returns a level within the list", () => {
    const id = dailyLevelId(new Date("2026-08-20"), levels);
    expect(levels).toContain(id);
  });

  it("is stable within the same UTC day", () => {
    const a = dailyLevelId(new Date("2026-08-20T00:10:00Z"), levels);
    const b = dailyLevelId(new Date("2026-08-20T22:10:00Z"), levels);
    expect(a).toBe(b);
  });

  it("changes on the next day", () => {
    const a = dailyLevelId(new Date("2026-08-20"), levels);
    const b = dailyLevelId(new Date("2026-08-21"), levels);
    expect(a).not.toBe(b);
  });
});

describe("dailyChallengeOf", () => {
  it("matches the same date only", () => {
    const date = new Date("2026-08-20");
    const id = dailyLevelId(date, levels);
    expect(dailyChallengeOf(id, date, levels)).toBe(true);
    expect(dailyChallengeOf(id, new Date("2026-08-21"), levels)).toBe(false);
  });
});

describe("dailyEndsAt", () => {
  it("returns the next UTC midnight", () => {
    const end = dailyEndsAt(new Date("2026-08-20T15:00:00Z"));
    expect(end.toISOString()).toBe("2026-08-21T00:00:00.000Z");
  });
});