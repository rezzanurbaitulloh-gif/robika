import { describe, it, expect } from "vitest";
import { BADGES, evaluateBadges, type BadgeState } from "./badges";

const baseState: BadgeState = {
  completedLevels: [],
  world1Complete: false,
  bossDone: false,
  streak: 0,
  level: 1,
  xp: 0,
  codelabDone: false,
  trialActive: false,
  gems: 0,
};

describe("BADGES catalog", () => {
  it("has unique badge ids across 5 rarities", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    const rarities = new Set(BADGES.map((b) => b.rarity));
    expect(rarities.size).toBe(5);
  });
});

describe("evaluateBadges", () => {
  it("earns first-steps after the first level", () => {
    const earned = evaluateBadges(
      { ...baseState, completedLevels: ["world-1-level-1"] },
      [],
    );
    expect(earned.map((b) => b.id)).toContain("first-steps");
  });

  it("earns boss-slayer and world-1-clear together", () => {
    const earned = evaluateBadges(
      { ...baseState, bossDone: true, world1Complete: true },
      [],
    );
    const ids = earned.map((b) => b.id);
    expect(ids).toContain("boss-slayer");
    expect(ids).toContain("world-1-clear");
  });

  it("does not re-earn already owned badges", () => {
    const earned = evaluateBadges(
      { ...baseState, completedLevels: ["world-1-level-1"] },
      ["first-steps"],
    );
    expect(earned.map((b) => b.id)).not.toContain("first-steps");
  });

  it("earns streak badges at thresholds", () => {
    const earned = evaluateBadges({ ...baseState, streak: 7 }, []);
    const ids = earned.map((b) => b.id);
    expect(ids).toContain("streak-3");
    expect(ids).toContain("streak-7");
    const onlyThree = evaluateBadges({ ...baseState, streak: 3 }, []);
    expect(onlyThree.map((b) => b.id)).toContain("streak-3");
    expect(onlyThree.map((b) => b.id)).not.toContain("streak-7");
  });

  it("earns level and xp badges", () => {
    const earned = evaluateBadges({ ...baseState, level: 6, xp: 1400 }, []);
    const ids = earned.map((b) => b.id);
    expect(ids).toContain("level-5");
    expect(ids).toContain("xp-1000");
  });

  it("earns codelab, mentor trial, and gem owner badges", () => {
    const earned = evaluateBadges(
      { ...baseState, codelabDone: true, trialActive: true, gems: 10 },
      [],
    );
    const ids = earned.map((b) => b.id);
    expect(ids).toContain("codelab-first");
    expect(ids).toContain("mentor-trial");
    expect(ids).toContain("gem-owner");
  });

  it("earns nothing for an empty state", () => {
    expect(evaluateBadges(baseState, [])).toEqual([]);
  });
});