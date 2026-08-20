import { describe, it, expect } from "vitest";
import {
  getBoss,
  getLevel,
  getWorld,
  isBossLevel,
  validateAllWorlds,
  worlds,
} from "../index";

describe("world-1 content", () => {
  it("validates all worlds without errors", () => {
    const result = validateAllWorlds();
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("has exactly 7 levels in world-1 (6 + boss)", () => {
    const world = getWorld("world-1");
    expect(world?.levels).toHaveLength(7);
  });

  it("has ordered levels 1..7 with unique order", () => {
    const world = getWorld("world-1")!;
    const orders = world.levels.map((l) => l.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("has exactly one boss level with spec", () => {
    const boss = getBoss("world-1");
    expect(boss).toBeDefined();
    expect(boss?.boss?.name).toBe("Motherboard");
    expect(boss?.boss?.hp).toBe(3);
    expect(boss?.boss?.cooldownMs).toBe(1_800_000);
  });

  it("exposes every level by id", () => {
    const ids = worlds[0].levels.map((l) => l.id);
    for (const id of ids) {
      expect(getLevel(id)?.id).toBe(id);
    }
  });

  it("marks only the boss level as boss", () => {
    const world = getWorld("world-1")!;
    const bossCount = world.levels.filter((l) => isBossLevel(l)).length;
    expect(bossCount).toBe(1);
  });

  it("provides 3 hint tiers for every level", () => {
    for (const level of worlds[0].levels) {
      expect(level.hints).toHaveLength(3);
      level.hints.forEach((tier) => expect(tier.length).toBeGreaterThan(0));
    }
  });
});