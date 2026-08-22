import { describe, expect, it } from "vitest";
import { conceptForGameLevel, conceptsForModule, getConcept, nextMasteryLevel } from "./registry";


describe("concept registry", () => {
  it("mengambil konsep berdasarkan id stabil", () => {
    const c = getConcept("javascript.conditions");
    expect(c?.language).toBe("javascript");
    expect(c?.academyModuleIds).toContain("js-kontrol");
  });

  it("mengembalikan null untuk id tak dikenal", () => {
    expect(getConcept("javascript.tidakada")).toBeNull();
  });

  it("memetakan modul academy ke konsep", () => {
    expect(conceptsForModule("js-perulangan").map((c) => c.id)).toEqual(["javascript.loops"]);
    expect(conceptsForModule("modul-palsu")).toEqual([]);
  });

  it("level pengantar konsep world-1 terpetakan ke konsep stabil", () => {
    const expected: Array<[string, string]> = [
      ["for loop", "javascript.loops"],
      ["if (blockedAhead())", "javascript.conditions"],
      ["function zigzag()", "javascript.functions"],
    ];
    for (const [label, id] of expected) {
      expect(conceptForGameLevel(label)).toBe(id);
    }
    expect(conceptForGameLevel("moveForward()")).toBe("adventure.bot-movement");
  });

  it("level komposit (debug/boss) sengaja tanpa pemetaan konsep", () => {
    expect(conceptForGameLevel("debugging & maze")).toBeNull();
    expect(conceptForGameLevel("speed run & presisi")).toBeNull();
  });

  it("label tak dikenal menghasilkan null (bukan tebakan)", () => {
    expect(conceptForGameLevel("konsep misterius")).toBeNull();
  });
});

describe("nextMasteryLevel", () => {
  it("naik bertahap sesuai skor", () => {
    expect(nextMasteryLevel("NOT_STARTED", 0, 0)).toBe("NOT_STARTED");
    expect(nextMasteryLevel("NOT_STARTED", 1, 10)).toBe("IN_PROGRESS");
    expect(nextMasteryLevel("IN_PROGRESS", 2, 60)).toBe("COMPLETED");
    expect(nextMasteryLevel("COMPLETED", 3, 95)).toBe("MASTERED");
  });

  it("MASTERED bersifat final", () => {
    expect(nextMasteryLevel("MASTERED", 0, 0)).toBe("MASTERED");
  });

  it("skor rendah setelah COMPLETED tidak menurunkan level", () => {
    expect(nextMasteryLevel("COMPLETED", 5, 30)).toBe("COMPLETED");
  });
});
