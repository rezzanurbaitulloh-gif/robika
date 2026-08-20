import { describe, it, expect } from "vitest";
import {
  PROVIDER_CATALOG,
  activeProviders,
  poolForMode,
  pickModelForProvider,
  nextCandidate,
  dedupeByBase,
  MODE_MODELS,
  type AiMode,
} from "./registry";

describe("PROVIDER_CATALOG", () => {
  it("covers every key family from opencode config", () => {
    const ids = PROVIDER_CATALOG.map((p) => p.id);
    expect(ids).toEqual([
      "hc_key1",
      "hc_key2",
      "hc_key3",
      "hc_key4",
      "hc_key5",
      "mistral_key1",
      "mistral_key2",
      "mistral_key3",
      "mistral_key4",
      "mistral_key5",
      "mistral6",
      "qwen3.8-27b",
      "omniroute",
      "9router",
      "gemini",
    ]);
  });

  it("defines at least one model per provider", () => {
    for (const p of PROVIDER_CATALOG) {
      expect(p.models.length).toBeGreaterThan(0);
    }
  });

  it("assigns unique priorities", () => {
    const priorities = PROVIDER_CATALOG.map((p) => p.priority);
    expect(new Set(priorities).size).toBe(priorities.length);
  });

  it("keeps china keys as the cheapest tier", () => {
    const hc = PROVIDER_CATALOG.filter((p) => p.id.startsWith("hc_key"));
    const mistral = PROVIDER_CATALOG.filter((p) => p.id.startsWith("mistral"));
    expect(Math.max(...hc.map((p) => p.priority))).toBeLessThan(
      Math.min(...mistral.map((p) => p.priority)),
    );
  });
});

describe("activeProviders", () => {
  it("filters by env presence", () => {
    const active = activeProviders({
      ROBIKA_KEY_HC_1: "x",
      ROBIKA_KEY_MISTRAL_1: "y",
    });
    expect(active.map((p) => p.id)).toEqual(["hc_key1", "mistral_key1"]);
  });

  it("returns empty when no keys present", () => {
    expect(activeProviders({}).length).toBe(0);
  });
});

describe("poolForMode", () => {
  const env = {
    ROBIKA_KEY_HC_1: "x",
    ROBIKA_KEY_HC_2: "x",
    ROBIKA_KEY_MISTRAL_1: "y",
    ROBIKA_KEY_QWEN_HF: "z",
    GEMINI_API_KEY: "g",
  };

  it("orders tutor pool cheapest-first with fallbacks", () => {
    const pool = poolForMode("tutor", env);
    const ids = pool.map((p) => p.id);
    expect(ids[0]).toBe("hc_key1");
    expect(ids[1]).toBe("hc_key2");
    expect(ids).toContain("mistral_key1");
    expect(ids[ids.length - 1]).toBe("gemini");
  });

  it("prefers capable models for mentor mode", () => {
    const pool = poolForMode("mentor", env);
    const ids = pool.map((p) => p.id);
    expect(ids).toContain("qwen3.8-27b");
    const hcPool = ids.filter((id) => id.startsWith("hc_key"));
    const mistralPool = ids.filter((id) => id.startsWith("mistral"));
    expect(hcPool.length).toBe(2);
    expect(mistralPool.length).toBe(1);
  });
});

describe("pickModelForProvider", () => {
  it("picks the first supported model for the mode", () => {
    const hc = { models: ["DeepSeek-V4-Flash", "Qwen3-Coder-Next-FP8"] };
    expect(pickModelForProvider("tutor", hc)).toBe("DeepSeek-V4-Flash");
    const qwenHf = { models: ["Qwen/Qwen3.8-27B"] };
    expect(pickModelForProvider("mentor", qwenHf)).toBe("Qwen/Qwen3.8-27B");
  });

  it("falls back to first model when mode list has no overlap", () => {
    const odd = { models: ["only-custom-model"] };
    expect(pickModelForProvider("tutor", odd)).toBe("only-custom-model");
  });
});

describe("nextCandidate", () => {
  it("returns the next unused provider in the pool", () => {
    const pool = poolForMode("tutor", { ROBIKA_KEY_HC_1: "x", ROBIKA_KEY_HC_2: "x" });
    const first = nextCandidate(pool, []);
    expect(first?.id).toBe("hc_key1");
    const second = nextCandidate(pool, ["hc_key1"]);
    expect(second?.id).toBe("hc_key2");
  });

  it("returns undefined when the pool is exhausted", () => {
    const pool = poolForMode("tutor", { ROBIKA_KEY_HC_1: "x" });
    expect(nextCandidate(pool, ["hc_key1"])).toBeUndefined();
  });
});

describe("dedupeByBase", () => {
  it("keeps one provider per base url, cheapest first", () => {
    const env = {
      ROBIKA_KEY_HC_1: "x",
      ROBIKA_KEY_HC_2: "x",
      ROBIKA_KEY_MISTRAL_1: "y",
      ROBIKA_KEY_MISTRAL_2: "y",
      ROBIKA_KEY_QWEN_HF: "z",
    };
    const pool = poolForMode("tutor", env);
    const unique = dedupeByBase(pool);
    expect(unique.map((p) => p.id)).toEqual([
      "hc_key1",
      "mistral_key1",
      "qwen3.8-27b",
    ]);
  });

  it("returns empty for empty input", () => {
    expect(dedupeByBase([])).toEqual([]);
  });
});

describe("MODE_MODELS", () => {
  it("defines model preference for every mode", () => {
    const modes: AiMode[] = ["tutor", "debug", "exercises", "mentor"];
    for (const mode of modes) {
      expect(MODE_MODELS[mode].length).toBeGreaterThan(0);
    }
  });
});