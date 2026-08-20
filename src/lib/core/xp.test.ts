import { describe, it, expect } from "vitest";
import {
  XP_PER_LEVEL,
  xpForLevel,
  levelFromXp,
  speedBonusXp,
  errorFixXp,
} from "./xp";

describe("xpForLevel", () => {
  it("level 1 starts at 0 xp", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("level 2 requires one full level of xp", () => {
    expect(xpForLevel(2)).toBe(XP_PER_LEVEL);
  });

  it("level 3 requires two full levels of xp", () => {
    expect(xpForLevel(3)).toBe(XP_PER_LEVEL * 2);
  });

  it("throws for level below 1", () => {
    expect(() => xpForLevel(0)).toThrow(RangeError);
  });
});

describe("levelFromXp", () => {
  it("maps 0 xp to level 1", () => {
    expect(levelFromXp(0)).toBe(1);
  });

  it("maps exactly one level of xp to level 2", () => {
    expect(levelFromXp(XP_PER_LEVEL)).toBe(2);
  });

  it("maps just below a level boundary to previous level", () => {
    expect(levelFromXp(XP_PER_LEVEL - 1)).toBe(1);
  });

  it("clamps negative xp to level 1", () => {
    expect(levelFromXp(-100)).toBe(1);
  });
});

describe("speedBonusXp", () => {
  const base = 100;

  it("grants +50% when faster than half the par time", () => {
    expect(speedBonusXp(base, 5000, 10000)).toBe(50);
  });

  it("grants +25% when within par time", () => {
    expect(speedBonusXp(base, 10000, 10000)).toBe(25);
    expect(speedBonusXp(base, 9000, 10000)).toBe(25);
  });

  it("grants nothing when slower than par", () => {
    expect(speedBonusXp(base, 15001, 10000)).toBe(0);
  });

  it("rounds bonus to nearest integer", () => {
    expect(speedBonusXp(33, 5000, 10000)).toBe(17);
  });

  it("throws on non-positive base xp", () => {
    expect(() => speedBonusXp(0, 5000, 10000)).toThrow(RangeError);
    expect(() => speedBonusXp(-5, 5000, 10000)).toThrow(RangeError);
  });
});

describe("errorFixXp", () => {
  it("awards 10% of base xp with a floor of 5", () => {
    expect(errorFixXp(100)).toBe(10);
    expect(errorFixXp(30)).toBe(5);
  });

  it("rounds to nearest integer", () => {
    expect(errorFixXp(125)).toBe(13);
  });

  it("throws on non-positive base xp", () => {
    expect(() => errorFixXp(0)).toThrow(RangeError);
  });
});