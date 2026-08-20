import { describe, it, expect } from "vitest";
import { starsForHints, errorRecoveryBonus, ERROR_RECOVERY_XP } from "./stars";

describe("starsForHints", () => {
  it("gives 3 stars without any hint", () => {
    expect(starsForHints(0)).toBe(3);
  });

  it("gives 2 stars with 1 hint", () => {
    expect(starsForHints(1)).toBe(2);
  });

  it("gives 1 star with 2 or more hints", () => {
    expect(starsForHints(2)).toBe(1);
    expect(starsForHints(5)).toBe(1);
  });

  it("clamps negative input to 3 stars", () => {
    expect(starsForHints(-1)).toBe(3);
  });
});

describe("errorRecoveryBonus", () => {
  it("gives XP bonus when recovering from an error without hints", () => {
    expect(errorRecoveryBonus(true, 0)).toBe(ERROR_RECOVERY_XP);
  });

  it("gives no bonus when hints were used", () => {
    expect(errorRecoveryBonus(true, 1)).toBe(0);
  });

  it("gives no bonus without any error", () => {
    expect(errorRecoveryBonus(false, 0)).toBe(0);
  });
});