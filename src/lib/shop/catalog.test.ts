import { describe, it, expect } from "vitest";
import { SKIN_ITEMS, getSkinItem } from "./catalog";

const HEX = /^#[0-9a-fA-F]{6}$/;

describe("skin catalog v2", () => {
  it("memiliki minimal 16 skin", () => {
    expect(SKIN_ITEMS.length).toBeGreaterThanOrEqual(16);
  });

  it("id unik dan bisa dicari", () => {
    const ids = SKIN_ITEMS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getSkinItem("skin-bot-prime")?.name).toBe("Reaktor Prime");
    expect(getSkinItem("tidak-ada")).toBeUndefined();
  });

  it("setiap skin punya harga dan palet hex valid", () => {
    for (const s of SKIN_ITEMS) {
      expect(s.priceStars !== undefined || s.priceGems !== undefined, s.id).toBe(true);
      expect(HEX.test(s.colors.body), s.id).toBe(true);
      expect(HEX.test(s.colors.visor), s.id).toBe(true);
      expect(HEX.test(s.colors.glow), s.id).toBe(true);
    }
  });

  it("tiap rarity terisi (common..mythic)", () => {
    for (const r of ["common", "epic", "legendary", "mythic"] as const) {
      expect(SKIN_ITEMS.filter((s) => s.rarity === r).length, r).toBeGreaterThan(0);
    }
  });

  it("harga naik seiring kelangkaan", () => {
    const maxStars = (r: string) =>
      Math.max(
        ...SKIN_ITEMS.filter((s) => s.rarity === r).map((s) => s.priceStars ?? 0),
      );
    const maxGems = (r: string) =>
      Math.max(...SKIN_ITEMS.filter((s) => s.rarity === r).map((s) => s.priceGems ?? 0));
    expect(maxGems("mythic")).toBeGreaterThan(maxGems("legendary"));
    expect(maxStars("epic")).toBeGreaterThan(maxStars("common"));
  });
});
