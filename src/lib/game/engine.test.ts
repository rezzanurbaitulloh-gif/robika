import { describe, expect, it } from "vitest";
import { levelEngine, runLevel } from "@/lib/game/engine";
import type { GameLevel } from "@/lib/game/validate";
import { worlds, validateAllWorlds } from "@/content";

describe("engine routing", () => {
  const legacyLevel: GameLevel = {
    id: "t-legacy",
    world: "t",
    order: 1,
    title: { id: "a", en: "a" },
    topic: "t",
    concept: "c",
    objective: { id: "o", en: "o" },
    grid: ["P.G", "..."],
    goal: { type: "reach" },
    hints: [["h1"], ["h2"], ["h3"]],
    starterCode: "moveForward();",
    solution: "moveForward(); moveForward();",
    xpReward: 10,
  };

  it("level tanpa gerbang dan tanpa engine → legacy", () => {
    expect(levelEngine(legacyLevel)).toBe("legacy");
  });

  it("level dengan tile D otomatis pakai engine js", () => {
    const gate = { ...legacyLevel, grid: ["P.D", "..."] };
    expect(levelEngine(gate)).toBe("js");
  });

  it("field engine menimpa deteksi otomatis", () => {
    expect(levelEngine({ ...legacyLevel, engine: "js" as const })).toBe("js");
    const gate = { ...legacyLevel, grid: ["P.D", "..."], engine: "legacy" as const };
    expect(levelEngine(gate)).toBe("legacy");
  });

  it("runLevel legacy tetap berperilaku seperti simulator lama", () => {
    const r = runLevel(legacyLevel, "moveForward(); moveForward();");
    expect(r.won).toBe(true);
    expect(r.status).toBeUndefined();
  });

  it("runLevel js membawa status dan events", () => {
    const gate = { ...legacyLevel, grid: ["PDG"], engine: "js" as const };
    const r = runLevel(gate, "openGate(); moveForward(); moveForward();");
    expect(r.won).toBe(true);
    expect(r.status).toBe("ok");
    expect(r.gatesOpened).toBe(1);
    expect(r.events?.length).toBeGreaterThan(0);
  });
});

describe("world-2 vertical slice", () => {
  it("semua world lolos validasi termasuk aturan gerbang baru", () => {
    const v = validateAllWorlds();
    expect(v.errors).toEqual([]);
    expect(v.ok).toBe(true);
  });

  it("solution world-2-level-1 memenangkan levelnya sendiri", () => {
    const level = worlds.find((w) => w.world === "world-2")!.levels[0];
    const r = runLevel(level, level.solution);
    expect(r.status).toBe("ok");
    expect(r.won).toBe(true);
    expect(r.gatesOpened).toBe(1);
  });

  it("solution world-2-level-2 mengumpulkan 2 koin dan menang", () => {
    const level = worlds.find((w) => w.world === "world-2")!.levels[1];
    const r = runLevel(level, level.solution);
    expect(r.status).toBe("ok");
    expect(r.won).toBe(true);
    expect(r.coins).toBe(2);
  });

  it("starter code world-2 TIDAK langsung menang (masih ada tantangan)", () => {
    for (const level of worlds.find((w) => w.world === "world-2")!.levels) {
      const r = runLevel(level, level.starterCode);
      expect(r.won).toBe(false);
    }
  });
});
