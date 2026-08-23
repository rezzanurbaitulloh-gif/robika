import { describe, expect, it } from "vitest";
import { getFlags, isFlagEnabled, parseFlag } from "./flags";

describe("parseFlag", () => {
  it("mengenali nilai truthy", () => {
    expect(parseFlag("1")).toBe(true);
    expect(parseFlag("true")).toBe(true);
    expect(parseFlag("TRUE")).toBe(true);
  });

  it("mengenali nilai falsy dan undefined", () => {
    expect(parseFlag("0")).toBe(false);
    expect(parseFlag("false")).toBe(false);
    expect(parseFlag(undefined)).toBe(false);
    expect(parseFlag("yes")).toBe(false);
  });
});

describe("getFlags", () => {
  it("default semua flag mati agar fitur unfinished tidak bocor ke produksi", () => {
    const flags = getFlags({});
    expect(Object.values(flags).every((v) => v === false)).toBe(true);
    expect(Object.keys(flags)).toHaveLength(15);
  });

  it("skema flag PRD V2 tersedia dan bisa dinyalakan dari env", () => {
    const flags = getFlags({
      NEXT_PUBLIC_FLAG_NEW_HOME: "1",
      NEXT_PUBLIC_FLAG_NEW_MOTION: "true",
    });
    expect(flags.newHome).toBe(true);
    expect(flags.newMotion).toBe(true);
    expect(flags.newVisualSystem).toBe(false);
  });

  it("membaca override dari env", () => {
    const flags = getFlags({ NEXT_PUBLIC_FLAG_NEW_ADVENTURE: "1" });
    expect(flags.newAdventure).toBe(true);
    expect(flags.offlineMode).toBe(false);
  });
});

describe("isFlagEnabled", () => {
  it("membaca satu flag dari env", () => {
    expect(isFlagEnabled("newAdventure", {})).toBe(false);
    expect(isFlagEnabled("newAdventure", { NEXT_PUBLIC_FLAG_NEW_ADVENTURE: "true" })).toBe(true);
  });
});
