import { describe, it, expect } from "vitest";
import { challenges, getChallenge, validateChallenges } from "./index";
import { runJavaScript } from "@/lib/codelab/runner";
import { checkOutput } from "@/lib/codelab/check";

describe("codelab challenges", () => {
  it("validates all challenges", () => {
    const result = validateChallenges();
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("covers both languages and kinds", () => {
    const langs = new Set(challenges.map((c) => c.lang));
    const kinds = new Set(challenges.map((c) => c.kind));
    expect(langs).toEqual(new Set(["javascript", "python"]));
    expect(kinds).toEqual(new Set(["output", "complete-code", "fix-bug", "preview"]));
  });

  it("fix-bug challenges declare their bugs", () => {
    for (const c of challenges.filter((c) => c.kind === "fix-bug")) {
      expect(c.bugs).toBeDefined();
      expect(c.bugs!.length).toBeGreaterThan(0);
    }
  });

  it("preview challenges include a full html document", () => {
    for (const c of challenges.filter((c) => c.kind === "preview")) {
      expect(c.html).toBeDefined();
      expect(c.html!.toLowerCase()).toContain("<html");
    }
  });

  it("every challenge has 3 hint tiers", () => {
    for (const c of challenges) {
      expect(c.hints).toHaveLength(3);
    }
  });

  it("exposes challenges by id", () => {
    for (const c of challenges) {
      expect(getChallenge(c.id)?.id).toBe(c.id);
    }
  });

  it("js solution outputs the expected text", () => {
    const hello = getChallenge("codelab-hello")!;
    const result = runJavaScript(hello.solution);
    expect(result.error).toBeUndefined();
    const check = checkOutput(hello.expected ?? "", result.stdout, {
      mode: hello.mode,
    });
    expect(check.passed).toBe(true);
  });

  it("js solution for loop-sum outputs 15", () => {
    const loop = getChallenge("codelab-loop-sum")!;
    const result = runJavaScript(loop.solution);
    expect(result.error).toBeUndefined();
    expect(checkOutput("15", result.stdout).passed).toBe(true);
  });

  it("js runner captures errors", () => {
    const result = runJavaScript("throw new Error('boom');");
    expect(result.error).toBeTruthy();
  });
});