import { describe, it, expect } from "vitest";
import { gradeQuiz, QUIZ_PASS_RATE } from "./quiz";

const questions = [
  { q: "a?", options: ["x", "y"], answer: 1 },
  { q: "b?", options: ["x", "y", "z"], answer: 0 },
  { q: "c?", options: ["x", "y"], answer: 1 },
  { q: "d?", options: ["x", "y"], answer: 0 },
];

describe("gradeQuiz", () => {
  it("counts correct answers", () => {
    const result = gradeQuiz([1, 0, 1, 0], questions);
    expect(result.score).toBe(4);
    expect(result.total).toBe(4);
    expect(result.percent).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("fails below the pass rate", () => {
    const result = gradeQuiz([1, 1, 0, 1], questions);
    expect(result.score).toBe(1);
    expect(result.passed).toBe(false);
  });

  it("treats out-of-range answers as wrong", () => {
    const result = gradeQuiz([9, 0, 1, 0], questions);
    expect(result.score).toBe(3);
  });

  it("passes above the threshold and fails below", () => {
    const threeOfFour = gradeQuiz([1, 0, 1, 1], questions); // 75%
    expect(threeOfFour.passed).toBe(true);
    const twoOfThree = gradeQuiz([1, 1, 1], questions.slice(0, 3)); // 66.7%
    expect(twoOfThree.passed).toBe(false);
  });

  it("exposes the pass rate constant", () => {
    expect(QUIZ_PASS_RATE).toBe(0.7);
  });
});