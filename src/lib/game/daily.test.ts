import { describe, it, expect } from "vitest";
import { dailyLevelId, dailyChallengeOf, dailyEndsAt, hashDate, dailyPoolIds } from "./daily";

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
describe("dailyPoolIds", () => {
  const sample = [
    { levels: [{ id: "w1-l1" }, { id: "w1-boss", isBoss: true }] },
    { flag: "locked", levels: [{ id: "w2-l1" }] },
    { flag: "open", levels: [{ id: "w3-l1" }] },
  ];

  it("hanya memasukkan world tanpa flag atau dengan flag aktif", () => {
    const pool = dailyPoolIds(sample, (f) => f === "open");
    expect(pool).toContain("w1-l1");
    expect(pool).toContain("w3-l1");
    expect(pool).not.toContain("w2-l1");
  });

  it("menyertakan world berflag saat flag dinyalakan", () => {
    expect(dailyPoolIds(sample, () => true)).toContain("w2-l1");
  });

  it("boss level tidak pernah masuk pool harian", () => {
    for (const flag of [true, false]) {
      expect(dailyPoolIds(sample, () => flag)).not.toContain("w1-boss");
    }
  });
});
