import { describe, it, expect } from "vitest";
import { canUse, consume, makeDayKey } from "./limits";

describe("makeDayKey", () => {
  it("formats a date as YYYY-MM-DD in UTC", () => {
    expect(makeDayKey(new Date("2026-08-19T23:59:59Z"))).toBe("2026-08-19");
    expect(makeDayKey(new Date("2026-01-05T00:00:00Z"))).toBe("2026-01-05");
  });
});

describe("canUse", () => {
  it("allows usage below the limit", () => {
    expect(canUse(19, 20)).toBe(true);
  });

  it("blocks usage at the limit", () => {
    expect(canUse(20, 20)).toBe(false);
    expect(canUse(25, 20)).toBe(false);
  });

  it("allows usage when limit is unlimited", () => {
    expect(canUse(999, Infinity)).toBe(true);
  });
});

describe("consume", () => {
  const quota = {
    key: "u1|tutor",
    day: "2026-08-19",
    used: 3,
    limit: 20,
  };

  it("increments used when day matches", () => {
    const next = consume(quota, new Date("2026-08-19T12:00:00Z"));
    expect(next.used).toBe(4);
    expect(next.day).toBe("2026-08-19");
  });

  it("resets used to 1 when day changed", () => {
    const next = consume(quota, new Date("2026-08-20T00:00:00Z"));
    expect(next.used).toBe(1);
    expect(next.day).toBe("2026-08-20");
  });

  it("does not allow consuming beyond the limit", () => {
    const full = { ...quota, used: 20, limit: 20 };
    const next = consume(full, new Date("2026-08-19T12:00:00Z"));
    expect(next.used).toBe(20);
  });

  it("keeps key and limit unchanged", () => {
    const next = consume(quota, new Date("2026-08-19T12:00:00Z"));
    expect(next.key).toBe(quota.key);
    expect(next.limit).toBe(20);
  });
});