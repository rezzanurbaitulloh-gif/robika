import { describe, it, expect } from "vitest";
import { CURRICULUM_STACKS, getCurriculumStack, getCurriculumModule } from "./curriculum";

describe("curriculum", () => {
  it("covers the per-language stacks from the roadmap", () => {
    const ids = CURRICULUM_STACKS.map((s) => s.id);
    expect(ids).toContain("html-css");
    expect(ids).toContain("javascript");
    expect(ids).toContain("typescript");
    expect(ids).toContain("python");
    expect(ids).toContain("sql");
    expect(ids).toContain("java");
    expect(ids).toContain("php");
    expect(ids).toContain("go");
    expect(ids).toContain("cpp");
  });

  it("keeps stack ids unique, modules unique per stack, and valid difficulty", () => {
    const stackIds = new Set<string>();
    for (const stack of CURRICULUM_STACKS) {
      expect(stackIds.has(stack.id)).toBe(false);
      stackIds.add(stack.id);
      expect(["Pemula", "Menengah", "Lanjut"]).toContain(stack.difficulty);
      const moduleIds = new Set<string>();
      for (const mod of stack.modules) {
        expect(moduleIds.has(mod.id), `${stack.id}/${mod.id}`).toBe(false);
        moduleIds.add(mod.id);
      }
    }
  });

  it("every module has comprehensive topics and a complete quiz", () => {
    for (const stack of CURRICULUM_STACKS) {
      for (const mod of stack.modules) {
        expect(mod.topics.length, `${stack.id}/${mod.id} topics`).toBeGreaterThanOrEqual(5);
        expect(mod.quiz.length, `${stack.id}/${mod.id} quiz`).toBe(3);
        for (const question of mod.quiz) {
          expect(question.options.length).toBe(4);
          expect(question.answer).toBeGreaterThanOrEqual(0);
          expect(question.answer).toBeLessThan(4);
          expect(question.explain.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("looks up stacks and modules by id", () => {
    expect(getCurriculumStack("html-css")?.name).toBe("HTML & CSS");
    expect(getCurriculumStack("javascript")?.difficulty).toBe("Pemula");
    expect(getCurriculumStack("unknown")).toBeUndefined();
    const found = getCurriculumModule("html-css", "html-pengenalan");
    expect(found?.module.title).toContain("HTML");
    expect(getCurriculumModule("html-css", "nope")).toBeUndefined();
  });
});