import { parseProgram, simulate, type SimulationResult } from "./simulator";
import { simulateWithJs, type JsSimulationResult } from "./interpreter";
import type { GameLevel } from "./validate";

export type EngineName = "legacy" | "js";

export type AnySimResult = SimulationResult & Partial<JsSimulationResult>;

export function levelEngine(level: GameLevel): EngineName {
  if (level.engine === "legacy") return "legacy";
  if (level.engine === "js") return "js";
  if (level.grid.some((row) => row.includes("D"))) return "js";
  return "legacy";
}

export function runLevel(level: GameLevel, code: string): AnySimResult {
  if (levelEngine(level) === "legacy") {
    return simulate(level, parseProgram(code));
  }
  const result = simulateWithJs(level, code);
  return {
    won: result.won,
    crashed: result.crashed,
    coins: result.coins,
    steps: result.steps,
    position: result.position,
    status: result.status,
    error: result.error,
    gatesOpened: result.gatesOpened,
    npcsTotal: result.npcsTotal,
    npcsTalked: result.npcsTalked,
    events: result.events,
  };
}
