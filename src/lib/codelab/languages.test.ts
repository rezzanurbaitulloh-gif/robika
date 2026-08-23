import { describe, it, expect } from "vitest";
import {
  LANGUAGES,
  LANGUAGE_LIST,
  languageByFile,
  languageById,
} from "./languages";

describe("language registry", () => {
  it("has unique ids and complete specs", () => {
    expect(LANGUAGE_LIST.length).toBe(Object.keys(LANGUAGES).length);
    const ids = new Set(LANGUAGE_LIST.map((s) => s.id));
    expect(ids.size).toBe(LANGUAGE_LIST.length);
    for (const spec of LANGUAGE_LIST) {
      expect(spec.label.length).toBeGreaterThan(0);
      expect(spec.monaco.length).toBeGreaterThan(0);
      expect(spec.ext.startsWith(".")).toBe(true);
      expect(spec.defaultCode.length).toBeGreaterThan(0);
      expect(["web", "console"]).toContain(spec.run);
    }
  });

  it("maps file names to languages by extension", () => {
    expect(languageByFile("app.js")?.id).toBe("javascript");
    expect(languageByFile("STYLE.CSS")?.id).toBe("css");
    expect(languageByFile("index.html")?.id).toBe("html");
    expect(languageByFile("bot.py")?.id).toBe("python");
    expect(languageByFile("README.md")).toBeUndefined();
    expect(languageByFile("noext")).toBeUndefined();
  });

  it("looks up by id", () => {
    expect(languageById("python").monaco).toBe("python");
    expect(languageById("html").run).toBe("web");
  });
});
