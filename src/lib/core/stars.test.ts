import { describe, it, expect } from "vitest";
import { starsFromHintsUsed } from "./stars";

describe("starsFromHintsUsed", () => {
  it("awards 3 stars when no hint is used", () => {
    expect(starsFromHintsUsed(0)).toBe(3);
  });

  it("awards 2 stars with exactly 1 hint", () => {
    expect(starsFromHintsUsed(1)).toBe(2);
  });

  it("awards 1 star with 2 hints", () => {
    expect(starsFromHintsUsed(2)).toBe(1);
  });

  it("stays at 1 star for many hints", () => {
    expect(starsFromHintsUsed(5)).toBe(1);
  });

  it("throws for negative hint count", () => {
    expect(() => starsFromHintsUsed(-1)).toThrow(RangeError);
  });
});