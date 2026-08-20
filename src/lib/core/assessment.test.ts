import { describe, it, expect } from "vitest";
import { classifyLevel, QUESTIONS, classifyAnswers } from "./assessment";

describe("classifyLevel", () => {
  it("classifies a low score as pemula", () => {
    expect(classifyLevel(3, 10)).toBe("pemula");
  });

  it("classifies a mid score as menengah", () => {
    expect(classifyLevel(6, 10)).toBe("menengah");
  });

  it("classifies a high score as lanjut", () => {
    expect(classifyLevel(8, 10)).toBe("lanjut");
  });

  it("treats perfect score as lanjut", () => {
    expect(classifyLevel(10, 10)).toBe("lanjut");
  });

  it("treats zero score as pemula", () => {
    expect(classifyLevel(0, 10)).toBe("pemula");
  });

  it("throws when maxScore is not positive", () => {
    expect(() => classifyLevel(5, 0)).toThrow(RangeError);
    expect(() => classifyLevel(5, -1)).toThrow(RangeError);
  });

  it("throws when score is negative", () => {
    expect(() => classifyLevel(-1, 10)).toThrow(RangeError);
  });

  it("clamps score above max to lanjut", () => {
    expect(classifyLevel(12, 10)).toBe("lanjut");
  });
});
describe("QUESTIONS", () => {
  it("has exactly 5 questions for onboarding", () => {
    expect(QUESTIONS).toHaveLength(5);
  });

  it("every question has options with valid scores", () => {
    for (const q of QUESTIONS) {
      expect(q.question.length).toBeGreaterThan(0);
      expect(q.options.length).toBeGreaterThan(1);
      for (const o of q.options) {
        expect(o.score).toBeGreaterThanOrEqual(0);
        expect(o.label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("classifyAnswers", () => {
  it("classifies low answers as pemula", () => {
    expect(classifyAnswers([1, 1, 0, 1, 1])).toBe("pemula");
  });

  it("classifies high answers as lanjut", () => {
    expect(classifyAnswers([5, 5, 5, 5, 5])).toBe("lanjut");
  });

  it("classifies mixed answers as menengah", () => {
    expect(classifyAnswers([3, 3, 3, 3, 3])).toBe("menengah");
  });
});
