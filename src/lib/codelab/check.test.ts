import { describe, it, expect } from "vitest";
import { checkOutput, normalizeOutput, type ChallengeCheck } from "./check";

describe("normalizeOutput", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeOutput("  hello \n")).toBe("hello");
  });

  it("collapses internal blank lines", () => {
    expect(normalizeOutput("a\n\n\nb")).toBe("a\nb");
  });

  it("normalizes trailing spaces per line", () => {
    expect(normalizeOutput("a  \nb \t")).toBe("a\nb");
  });

  it("handles empty and whitespace-only output", () => {
    expect(normalizeOutput("   \n  ")).toBe("");
    expect(normalizeOutput("")).toBe("");
  });
});

describe("checkOutput", () => {
  it("passes on exact match", () => {
    expect(checkOutput("Hello", "Hello").passed).toBe(true);
  });

  it("passes ignoring whitespace differences", () => {
    expect(checkOutput("Hello World", "  Hello World  ").passed).toBe(true);
    expect(checkOutput("Hello\nWorld", "Hello\nWorld\n").passed).toBe(true);
  });

  it("fails on different content", () => {
    const result = checkOutput("Hello", "Hallo");
    expect(result.passed).toBe(false);
    expect(result.expected).toBe("Hello");
    expect(result.actual).toBe("Hallo");
  });

  it("fails on missing output", () => {
    expect(checkOutput("Hello", "").passed).toBe(false);
  });

  it("supports case-insensitive comparison", () => {
    expect(checkOutput("hello", "HELLO", { caseInsensitive: true }).passed).toBe(true);
    expect(checkOutput("hello", "HELLO").passed).toBe(false);
  });

  it("supports partial match mode", () => {
    expect(
      checkOutput("42", "final result: 42", { mode: "contains" }).passed,
    ).toBe(true);
    expect(
      checkOutput("final result: 42", "42", { mode: "contains" }).passed,
    ).toBe(false);
  });

  it("reports mismatch context for debugging", () => {
    const result = checkOutput("line1\nline2\nline3", "line1\nlineX\nline3");
    expect(result.passed).toBe(false);
    expect(result.firstDiffLine).toBe(2);
  });
});

describe("ChallengeCheck", () => {
  it("defines both challenge kinds", () => {
    const kinds: ChallengeCheck[] = [
      { kind: "output", expected: "1\n2\n3", mode: "exact" },
      { kind: "complete-code", expected: "b = a * 2", mode: "contains" },
    ];
    expect(kinds).toHaveLength(2);
  });
});