import { describe, it, expect } from "vitest";
import { parseCommands, parseProgram, simulate, type ProgramNode } from "./simulator";
import { getLevel } from "@/content";

const level1 = getLevel("world-1-level-1")!;

const flat = (cmds: string[]): ProgramNode[] =>
  cmds.map((cmd) => ({ type: "cmd", cmd: cmd as "forward" | "left" | "right" }));

describe("parseCommands", () => {
  it("extracts moveForward calls", () => {
    const cmds = parseCommands("moveForward(); moveForward();");
    expect(cmds).toEqual(["forward", "forward"]);
  });

  it("extracts turn calls", () => {
    const cmds = parseCommands("turnLeft(); turnRight();");
    expect(cmds).toEqual(["left", "right"]);
  });

  it("ignores comments and non-command text", () => {
    const cmds = parseCommands(
      "// coba moveForward() di komentar\nmoveForward(); const x = 1;",
    );
    expect(cmds).toEqual(["forward"]);
  });

  it("ignores unknown function calls", () => {
    const cmds = parseCommands("attack(); moveForward(); jump()");
    expect(cmds).toEqual(["forward"]);
  });

  it("handles loops and mixed whitespace", () => {
    const cmds = parseCommands(
      "for (let i = 0; i < 3; i++) { moveForward(); }\n  turnRight();",
    );
    expect(cmds).toEqual(["forward", "forward", "forward", "right"]);
  });

  it("returns empty array for empty input", () => {
    expect(parseCommands("")).toEqual([]);
  });
});

describe("parseProgram (if & function)", () => {
  it("parses an if (blockedAhead()) block", () => {
    const program = parseProgram("if (blockedAhead()) { turnLeft(); }");
    expect(program).toEqual([{ type: "ifBlockedAhead", body: flat(["left"]) }]);
  });

  it("parses an if (canMove()) block", () => {
    const program = parseProgram("if (canMove()) { moveForward(); }");
    expect(program).toEqual([{ type: "ifCanMove", body: flat(["forward"]) }]);
  });

  it("expands user-defined function calls inline", () => {
    const program = parseProgram(
      "function two() { moveForward(); moveForward(); } two(); two();",
    );
    expect(program).toEqual(flat(["forward", "forward", "forward", "forward"]));
  });

  it("ignores function calls that are not defined", () => {
    const program = parseProgram("attack(); moveForward();");
    expect(program).toEqual(flat(["forward"]));
  });

  it("keeps loops unrolled inside the program", () => {
    const program = parseProgram("for (let i = 0; i < 3; i++) { moveForward(); }");
    expect(program).toEqual(flat(["forward", "forward", "forward"]));
  });
});

describe("simulate", () => {
  it("wins when reaching the goal", () => {
    const result = simulate(level1, flat(Array(11).fill("forward")));
    expect(result.won).toBe(true);
  });

  it("does not win before reaching the goal", () => {
    const result = simulate(level1, flat(Array(5).fill("forward")));
    expect(result.won).toBe(false);
  });

  it("crashes into a wall", () => {
    const result = simulate(level1, flat(["left", "forward"]));
    expect(result.crashed).toBe(true);
    expect(result.won).toBe(false);
  });

  it("collects coins on the path", () => {
    const result = simulate(level1, flat(Array(11).fill("forward")));
    expect(result.coins).toBe(1);
  });

  it("turns change direction", () => {
    const l2 = getLevel("world-1-level-2")!;
    const solution = parseProgram(l2.solution);
    expect(parseCommands(l2.solution).length).toBeGreaterThan(0);
    const result = simulate(l2, solution);
    expect(result.won).toBe(true);
  });

  it("crashes on spikes", () => {
    const l4 = getLevel("world-1-level-4")!;
    const result = simulate(l4, flat(["forward", "forward", "forward", "forward", "forward", "forward"]));
    expect(result.crashed).toBe(true);
  });

  it("collect goal requires target coins", () => {
    const l3 = getLevel("world-1-level-3")!;
    const partial = flat([...Array(10).fill("forward"), "right", "forward"]);
    const result = simulate(l3, partial);
    expect(result.won).toBe(false);
    expect(result.coins).toBe(3);
  });

  it("collect goal wins with target coins at goal", () => {
    const l3 = getLevel("world-1-level-3")!;
    const solution = parseProgram(l3.solution);
    const result = simulate(l3, solution);
    expect(result.won).toBe(true);
    expect(result.coins).toBe(3);
  });

  it("tracks step count", () => {
    const result = simulate(level1, flat(Array(11).fill("forward")));
    expect(result.steps).toBe(11);
  });

  it("caps simulation to avoid infinite loops", () => {
    const result = simulate(level1, flat(Array(100_000).fill("forward")), { maxSteps: 10_000 });
    expect(result.steps).toBeLessThanOrEqual(10_000);
  });

  it("stops simulation after crash", () => {
    const result = simulate(level1, flat(Array(50).fill("forward")));
    expect(result.steps).toBeLessThan(50);
  });

  it("detours around a spike with if (blockedAhead())", () => {
    const l4 = getLevel("world-1-level-4")!;
    const program = parseProgram(l4.solution);
    const result = simulate(l4, program);
    expect(result.won).toBe(true);
  });

  it("uses user functions to reach the goal", () => {
    const l5 = getLevel("world-1-level-5")!;
    const program = parseProgram(l5.solution);
    const result = simulate(l5, program);
    expect(result.won).toBe(true);
  });
});

describe("world-1 solutions", () => {
  it("every level solution wins", () => {
    const ids = [
      "world-1-level-1",
      "world-1-level-2",
      "world-1-level-3",
      "world-1-level-4",
      "world-1-level-5",
      "world-1-level-6",
      "world-1-boss",
    ];
    for (const id of ids) {
      const level = getLevel(id)!;
      const program = parseProgram(level.solution);
      const result = simulate(level, program);
      expect(result.won, `solution for ${id} should win`).toBe(true);
    }
  });
});