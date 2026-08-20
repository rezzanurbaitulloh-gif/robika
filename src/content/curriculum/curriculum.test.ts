import { describe, it, expect } from "vitest";
import { CURRICULUM_STACKS, getCurriculumStack, getCurriculumModule } from "./curriculum";

describe("curriculum", () => {
  it("covers the multi-stack vision from robika.md", () => {
    const ids = CURRICULUM_STACKS.map((s) => s.id);
    expect(ids).toContain("web-frontend");
    expect(ids).toContain("web-backend");
    expect(ids).toContain("data-ai");
    expect(ids).toContain("mobile");
    expect(ids).toContain("game-dev");
    expect(ids).toContain("database-stack");
    expect(ids).toContain("fullstack");
    expect(ids).toContain("ui-ux");
  });

  it("keeps stack ids unique and modules unique per stack", () => {
    const stackIds = new Set<string>();
    for (const stack of CURRICULUM_STACKS) {
      expect(stackIds.has(stack.id)).toBe(false);
      stackIds.add(stack.id);
      const moduleIds = new Set<string>();
      for (const mod of stack.modules) {
        expect(moduleIds.has(mod.id), `${stack.id}/${module.id}`).toBe(false);
        moduleIds.add(mod.id);
      }
    }
  });

  it("every module has topics and a complete quiz", () => {
    for (const stack of CURRICULUM_STACKS) {
      for (const mod of stack.modules) {
        expect(mod.topics.length, `${stack.id}/${mod.id} topics`).toBeGreaterThan(0);
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
    expect(getCurriculumStack("web-frontend")?.name).toBe("Web Frontend");
    expect(getCurriculumStack("unknown")).toBeUndefined();
    const found = getCurriculumModule("web-frontend", "html-dasar");
    expect(found?.module.title).toContain("HTML");
    expect(getCurriculumModule("web-frontend", "nope")).toBeUndefined();
  });
});