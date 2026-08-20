import { describe, it, expect } from "vitest";
import {
  xpForCompletion,
  computeCompletionRewards,
  applyLevelUp,
} from "./rewards";

describe("xpForCompletion", () => {
  it("scales with level index and star count", () => {
    expect(xpForCompletion(0, 3)).toBe(150);
    expect(xpForCompletion(0, 2)).toBe(130);
    expect(xpForCompletion(0, 1)).toBe(100);
    expect(xpForCompletion(5, 3)).toBe(275);
  });

  it("rejects invalid inputs", () => {
    expect(() => xpForCompletion(-1, 3)).toThrow(RangeError);
    expect(() => xpForCompletion(0, 0)).toThrow(RangeError);
    expect(() => xpForCompletion(0, 4)).toThrow(RangeError);
  });
});

describe("computeCompletionRewards", () => {
  it("credits only the star tier delta on repeat completions", () => {
    const first = computeCompletionRewards({
      levelIndex: 0,
      stars: 2,
      existingStars: 0,
      isFirstCompletion: true,
      elapsedMs: 60_000,
      parMs: 120_000,
    });
    expect(first.starsToCredit).toBe(2);

    const repeat = computeCompletionRewards({
      levelIndex: 0,
      stars: 2,
      existingStars: 2,
      isFirstCompletion: false,
      elapsedMs: 60_000,
      parMs: 120_000,
    });
    expect(repeat.starsToCredit).toBe(0);
    expect(repeat.xp).toBe(0);
  });

  it("credits the upgrade delta when improving from fewer stars", () => {
    const improved = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 1,
      isFirstCompletion: false,
      elapsedMs: 60_000,
      parMs: 120_000,
    });
    expect(improved.starsToCredit).toBe(2);
  });

  it("grants xp only on first completion", () => {
    const r = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 0,
      isFirstCompletion: true,
      elapsedMs: 60_000,
      parMs: 120_000,
    });
    expect(r.xp).toBeGreaterThan(0);
  });

  it("honors an explicit baseXp override", () => {
    const r = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 0,
      isFirstCompletion: true,
      elapsedMs: 60_000,
      parMs: 120_000,
      baseXp: 200,
    });
    expect(r.xp).toBe(300);
  });

  it("adds an error recovery bonus on first completion", () => {
    const r = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 0,
      isFirstCompletion: true,
      elapsedMs: 60_000,
      parMs: 120_000,
      errorRecoveryXp: 10,
    });
    expect(r.errorBonus).toBe(10);
    expect(r.xp).toBeGreaterThan(150);
  });

  it("does not add error bonus on repeat completions", () => {
    const r = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 3,
      isFirstCompletion: false,
      elapsedMs: 60_000,
      parMs: 120_000,
      errorRecoveryXp: 10,
    });
    expect(r.xp).toBe(0);
    expect(r.errorBonus).toBe(0);
  });

  it("exposes the par speed bonus separately", () => {
    const fast = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 0,
      isFirstCompletion: true,
      elapsedMs: 60_000,
      parMs: 120_000,
    });
    const slow = computeCompletionRewards({
      levelIndex: 0,
      stars: 3,
      existingStars: 0,
      isFirstCompletion: true,
      elapsedMs: 240_000,
      parMs: 120_000,
    });
    expect(fast.parBonus).toBeGreaterThan(slow.parBonus);
  });
});

describe("applyLevelUp", () => {
  it("levels up when crossing the threshold", () => {
    const result = applyLevelUp({ xp: 240, level: 1 }, 30);
    expect(result.newXp).toBe(270);
    expect(result.newLevel).toBe(2);
    expect(result.leveledUp).toBe(true);
  });

  it("stays on the same level below threshold", () => {
    const result = applyLevelUp({ xp: 240, level: 1 }, 5);
    expect(result.newXp).toBe(245);
    expect(result.newLevel).toBe(1);
    expect(result.leveledUp).toBe(false);
  });

  it("handles multi-level jumps", () => {
    const result = applyLevelUp({ xp: 240, level: 1 }, 800);
    expect(result.newLevel).toBe(5);
    expect(result.leveledUp).toBe(true);
  });
});