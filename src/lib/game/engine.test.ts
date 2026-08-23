import { describe, expect, it } from "vitest";
import { levelEngine, runLevel } from "@/lib/game/engine";
import type { GameLevel } from "@/lib/game/validate";
import { worlds, validateAllWorlds } from "@/content";
import { validateLevel } from "@/lib/game/validate";

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

  it("world-2 terkunci di balik flag newAdventure", () => {
    const world = worlds.find((w) => w.world === "world-2")!;
    expect(world.flag).toBe("newAdventure");
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

  it("solution world-2-level-3 (if/else + while) memenangkan level tanpa crash", () => {
    const world = worlds.find((w) => w.world === "world-2")!;
    expect(world.levels).toHaveLength(5);
    const level = world.levels[2];
    expect(levelEngine(level)).toBe("js");
    const r = runLevel(level, level.solution);
    expect(r.status).toBe("ok");
    expect(r.won).toBe(true);
    expect(r.crashed).toBe(false);
  });

  it("solution world-2-level-4 (quest NPC) memenangkan level dan mencatat bicara NPC", () => {
    const world = worlds.find((w) => w.world === "world-2")!;
    expect(world.levels).toHaveLength(5);
    const level = world.levels[3];
    const r = runLevel(level, level.solution);
    expect(r.status).toBe("ok");
    expect(r.won).toBe(true);
    expect(r.npcsTotal).toBe(1);
    expect(r.npcsTalked).toBe(1);
    expect((r.events ?? []).some((e) => e.kind === "npcTalk")).toBe(true);
  });

  it("solution boss world-2-level-5 (Reaktor Prime) memenangkan level", () => {
    const world = worlds.find((w) => w.world === "world-2")!;
    const level = world.levels[4];
    expect(level.isBoss).toBe(true);
    expect(levelEngine(level)).toBe("js");
    expect(level.boss?.name).toBe("Reaktor Prime");
    const r = runLevel(level, level.solution);
    expect(r.status).toBe("ok");
    expect(r.won).toBe(true);
    expect(r.crashed).toBe(false);
    expect(r.coins).toBe(4);
  });

  it("starter code world-2 TIDAK langsung menang (masih ada tantangan)", () => {
    for (const level of worlds.find((w) => w.world === "world-2")!.levels) {
      const r = runLevel(level, level.starterCode);
      expect(r.won).toBe(false);
    }
  });

  it("level-4 membawa dialog mekanik yang valid", () => {
    const level = worlds.find((w) => w.world === "world-2")!.levels[3];
    expect(level.npcs).toHaveLength(1);
    const npc = level.npcs![0];
    expect(npc.lines.length).toBeGreaterThanOrEqual(2);
    expect(level.grid[npc.y][npc.x]).toBe("N");
  });

  it("validasi menolak npc yang tidak menunjuk tile N", () => {
    const bad: GameLevel = {
      id: "t-npc-bad",
      world: "t",
      order: 1,
      title: { id: "a", en: "a" },
      topic: "t",
      concept: "c",
      objective: { id: "o", en: "o" },
      grid: ["#P#"],
      goal: { type: "quest" },
      hints: [["h1"], ["h2"], ["h3"]],
      starterCode: "",
      solution: "",
      xpReward: 10,
      npcs: [{ x: 1, y: 0, name: "X", lines: ["halo"] }],
    };
    const v = validateLevel(bad);
    expect(v.ok).toBe(false);
    expect(v.errors.some((e) => e.includes("'N'"))).toBe(true);
  });
});
