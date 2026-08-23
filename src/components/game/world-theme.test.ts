import { describe, expect, it } from "vitest";
import { themeFor } from "./world-theme";

describe("world-theme", () => {
  it("menyediakan tema khusus untuk setiap dunia yang ada", () => {
    const w1 = themeFor("world-1");
    const w2 = themeFor("world-2");
    expect(w1.wallClass).not.toBe(w2.wallClass);
    expect(w1.coinColor).not.toBe(w2.coinColor);
    expect(w2.goalClass).toContain("teal");
  });

  it("fallback ke tema pabrik untuk dunia tak dikenal", () => {
    expect(themeFor("world-99")).toEqual(themeFor("world-1"));
    expect(themeFor(undefined)).toEqual(themeFor("world-1"));
  });
});
