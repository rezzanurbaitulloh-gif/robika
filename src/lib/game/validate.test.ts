import { describe, it, expect } from "vitest";
import { validateLevel, TILE_CHARS, type GameLevel } from "./validate";

const base: GameLevel = {
  id: "world-1-level-1",
  world: "world-1",
  order: 1,
  title: { id: "Boot Up", en: "Boot Up" },
  topic: "perintah dasar",
  concept: "moveForward & turnLeft",
  objective: {
    id: "Raih kotak neon hijau.",
    en: "Reach the neon green tile.",
  },
  grid: [
    "........",
    "........",
    "P......G",
    "........",
    "........",
  ],
  goal: { type: "reach" },
  hints: [["Coba moveForward()."], ["Gunakan 8 kali."], ["Cukup moveForward(); x8."]],
  starterCode: "// tulis kodemu\n",
  solution: "moveForward();".repeat(8),
  xpReward: 50,
};

describe("validateLevel", () => {
  it("accepts a valid level", () => {
    const { ok, errors } = validateLevel(base);
    expect(ok).toBe(true);
    expect(errors).toEqual([]);
  });

  it("accepts optional lesson and quiz", () => {
    const { ok, errors } = validateLevel({
      ...base,
      lesson: {
        title: "Perintah Dasar",
        body: ["BOT-1 bergerak dengan perintah.", "moveForward() maju satu petak."],
      },
      quiz: {
        questions: [
          { q: "Perintah untuk maju?", options: ["turnLeft()", "moveForward()"], answer: 1 },
          { q: "Berapa langkah ke goal?", options: ["8", "10"], answer: 0 },
          { q: "Apa fungsi turnLeft()?", options: ["Berputar 90° kiri", "Maju"], answer: 0 },
        ],
      },
    });
    expect(ok).toBe(true);
    expect(errors).toEqual([]);
  });

  it("rejects empty lesson body", () => {
    const { ok, errors } = validateLevel({
      ...base,
      lesson: { title: "X", body: [] },
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("lesson"))).toBe(true);
  });

  it("rejects quiz with fewer than 3 questions", () => {
    const { ok, errors } = validateLevel({
      ...base,
      quiz: { questions: [{ q: "a?", options: ["x", "y"], answer: 0 }] },
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("quiz"))).toBe(true);
  });

  it("rejects answer index out of range", () => {
    const { ok, errors } = validateLevel({
      ...base,
      quiz: {
        questions: [
          { q: "a?", options: ["x", "y"], answer: 5 },
          { q: "b?", options: ["x", "y"], answer: 0 },
          { q: "c?", options: ["x", "y"], answer: 0 },
        ],
      },
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("answer"))).toBe(true);
  });

  it("rejects empty id", () => {
    const { ok, errors } = validateLevel({ ...base, id: "" });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("id"))).toBe(true);
  });

  it("rejects duplicate level ids in a world", () => {
    const { ok, errors } = validateLevel(base, ["world-1-level-1"]);
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("duplicate"))).toBe(true);
  });

  it("rejects empty grid", () => {
    const { ok, errors } = validateLevel({ ...base, grid: [] });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("grid"))).toBe(true);
  });

  it("rejects ragged grid rows", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["........", "....."],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("row length"))).toBe(true);
  });

  it("rejects unknown tile characters", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["....X...", "........"],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("char"))).toBe(true);
  });

  it("rejects missing start tile", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["........", ".......G"],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("start"))).toBe(true);
  });

  it("rejects multiple start tiles", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["P.......", "P......G"],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("start"))).toBe(true);
  });

  it("rejects missing goal tile", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["........", "P......."],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("goal"))).toBe(true);
  });

  it("rejects collect goal without enough coins", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["........", "P......G"],
      goal: { type: "collect", target: 3 },
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("coin"))).toBe(true);
  });

  it("accepts collect goal with enough coins", () => {
    const { ok, errors } = validateLevel({
      ...base,
      grid: ["CC......", "P......G", "..C....."],
      goal: { type: "collect", target: 3 },
    });
    expect(ok).toBe(true);
    expect(errors).toEqual([]);
  });

  it("rejects hints not exactly 3 tiers", () => {
    const { ok, errors } = validateLevel({
      ...base,
      hints: [["satu"], ["dua"]],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("hint"))).toBe(true);
  });

  it("rejects empty hint tier", () => {
    const { ok, errors } = validateLevel({
      ...base,
      hints: [["satu"], [], ["tiga"]],
    });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.includes("hint"))).toBe(true);
  });

  it("rejects missing starterCode or solution", () => {
    expect(validateLevel({ ...base, starterCode: "" }).ok).toBe(false);
    expect(validateLevel({ ...base, solution: "" }).ok).toBe(false);
  });

  it("rejects non-positive xpReward or order", () => {
    expect(validateLevel({ ...base, xpReward: 0 }).ok).toBe(false);
    expect(validateLevel({ ...base, order: 0 }).ok).toBe(false);
  });

  it("rejects boss level without boss spec", () => {
    expect(validateLevel({ ...base, isBoss: true }).ok).toBe(false);
  });

  it("accepts valid boss level", () => {
    const boss = {
      ...base,
      id: "world-1-boss",
      isBoss: true,
      boss: { name: "Motherboard", hp: 3, cooldownMs: 1_800_000 },
    };
    const { ok, errors } = validateLevel(boss);
    expect(ok).toBe(true);
    expect(errors).toEqual([]);
  });

  it("rejects boss with invalid hp or cooldown", () => {
    const badHp = {
      ...base,
      isBoss: true,
      boss: { name: "Motherboard", hp: 0, cooldownMs: 1_800_000 },
    };
    expect(validateLevel(badHp).ok).toBe(false);

    const badCd = {
      ...base,
      isBoss: true,
      boss: { name: "Motherboard", hp: 3, cooldownMs: -1 },
    };
    expect(validateLevel(badCd).ok).toBe(false);
  });
});

describe("TILE_CHARS", () => {
  it("defines every supported tile char", () => {
    expect(TILE_CHARS).toContain(".");
    expect(TILE_CHARS).toContain("#");
    expect(TILE_CHARS).toContain("P");
    expect(TILE_CHARS).toContain("G");
    expect(TILE_CHARS).toContain("C");
    expect(TILE_CHARS).toContain("S");
    expect(TILE_CHARS).toContain("E");
    expect(TILE_CHARS).toContain("^");
  });
});