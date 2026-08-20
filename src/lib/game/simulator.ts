import type { GameLevel } from "./validate";

export type Command = "forward" | "left" | "right";

export interface SimulationResult {
  won: boolean;
  crashed: boolean;
  coins: number;
  steps: number;
  position: { x: number; y: number };
}

export type ProgramNode =
  | { type: "cmd"; cmd: Command }
  | { type: "ifBlockedAhead"; body: ProgramNode[] }
  | { type: "ifCanMove"; body: ProgramNode[] }
  | { type: "seq"; body: ProgramNode[] };

export type Program = ProgramNode[];

const COMMAND_PATTERN = /moveForward\s*\(\)|turnLeft\s*\(\)|turnRight\s*\(\)/g;

function stripComments(code: string): string {
  return code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "");
}

const LOOP_HEAD = /for\s*\(\s*let\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*(\d+)\s*;\s*\w+\+\+\s*\)\s*/;

function unrollLoops(code: string): string {
  let current = code;
  for (let pass = 0; pass < 64; pass++) {
    const m = current.match(LOOP_HEAD);
    if (!m) break;
    const headStart = m.index!;
    const headEnd = headStart + m[0].length;
    const count = Number(m[1]);
    const rest = current.slice(headEnd);

    if (rest.startsWith("{")) {
      let depth = 0;
      let end = -1;
      for (let i = headEnd; i < current.length; i++) {
        if (current[i] === "{") depth += 1;
        else if (current[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }
      if (end === -1) break;
      const body = current.slice(headEnd + 1, end);
      current = current.slice(0, headStart) + body.repeat(count) + current.slice(end + 1);
    } else {
      const semi = current.indexOf(";", headEnd);
      if (semi === -1) break;
      const stmt = current.slice(headEnd, semi + 1);
      current = current.slice(0, headStart) + stmt.repeat(count) + current.slice(semi + 1);
    }
  }
  return current;
}

const FUNCTION_PATTERN = /function\s+(\w+)\s*\(\s*\)\s*\{([^{}]*)\}/g;
const CALL_PATTERN = /(\w+)\s*\(\s*\)\s*;/g;
const IF_BLOCKED_PATTERN = /if\s*\(\s*blockedAhead\s*\(\s*\)\s*\)\s*\{([^{}]*)\}/;
const IF_CANMOVE_PATTERN = /if\s*\(\s*canMove\s*\(\s*\)\s*\)\s*\{([^{}]*)\}/;
const BARE_BLOCK_PATTERN = /\{(?!\s*if\b)([^{}]*)\}/;

function extractFunctions(code: string): { code: string; functions: Map<string, string> } {
  const functions = new Map<string, string>();
  const cleaned = code.replace(FUNCTION_PATTERN, (_match, name: string, body: string) => {
    functions.set(name, body);
    return "";
  });
  return { code: cleaned, functions };
}

function expandCalls(code: string, functions: Map<string, string>, depth = 0): string {
  if (depth > 64) return code;
  let current = code;
  let changed = true;
  while (changed) {
    changed = false;
    current = current.replace(CALL_PATTERN, (_match, name: string) => {
      const body = functions.get(name);
      if (body === undefined) return _match;
      changed = true;
      return `{${body}}`;
    });
  }
  return current;
}

function parseFragment(fragment: string): ProgramNode[] {
  const nodes: ProgramNode[] = [];
  let rest = fragment;
  while (rest.length > 0) {
    const ifBlocked = rest.match(IF_BLOCKED_PATTERN);
    const ifCanMove = rest.match(IF_CANMOVE_PATTERN);
    const bareBlock = rest.match(BARE_BLOCK_PATTERN);
    const command = rest.match(COMMAND_PATTERN);

    const candidates: Array<{
      index: number;
      length: number;
      items: ProgramNode[];
    }> = [];

    if (ifBlocked) {
      candidates.push({
        index: rest.indexOf(ifBlocked[0]),
        length: ifBlocked[0].length,
        items: [{ type: "ifBlockedAhead" as const, body: parseFragment(ifBlocked[1]) }],
      });
    }
    if (ifCanMove) {
      candidates.push({
        index: rest.indexOf(ifCanMove[0]),
        length: ifCanMove[0].length,
        items: [{ type: "ifCanMove" as const, body: parseFragment(ifCanMove[1]) }],
      });
    }
    if (bareBlock) {
      candidates.push({
        index: rest.indexOf(bareBlock[0]),
        length: bareBlock[0].length,
        items: parseFragment(bareBlock[1]),
      });
    }
    if (command) {
      candidates.push({
        index: rest.indexOf(command[0]),
        length: command[0].length,
        items: [
          {
            type: "cmd" as const,
            cmd: command[0].startsWith("moveForward")
              ? ("forward" as const)
              : command[0].startsWith("turnLeft")
                ? ("left" as const)
                : ("right" as const),
          },
        ],
      });
    }

    if (candidates.length === 0) break;

    candidates.sort((a, b) => a.index - b.index);
    const first = candidates[0];
    nodes.push(...first.items);
    rest = rest.slice(first.index + first.length);
  }
  return nodes;
}

export function parseProgram(code: string): Program {
  const { code: cleaned, functions } = extractFunctions(stripComments(code));
  const expanded = unrollLoops(expandCalls(cleaned, functions));
  return parseFragment(expanded);
}

export function parseCommands(code: string): Command[] {
  const commands: Command[] = [];
  const collect = (nodes: ProgramNode[]) => {
    for (const node of nodes) {
      if (node.type === "cmd") commands.push(node.cmd);
      else collect(node.body);
    }
  };
  collect(parseProgram(code));
  return commands;
}

export interface SimulateOptions {
  maxSteps?: number;
}

type Direction = "N" | "E" | "S" | "W";

const DIR_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 },
};

const TURN_RIGHT: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

const TURN_LEFT: Record<Direction, Direction> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

export function simulate(
  level: GameLevel,
  program: Program,
  options: SimulateOptions = {},
): SimulationResult {
  const maxSteps = options.maxSteps ?? 100_000;
  const width = level.grid[0].length;
  const height = level.grid.length;

  let px = 0;
  let py = 0;
  let direction: Direction = "E";
  let coins = 0;
  let steps = 0;
  let crashed = false;
  let won = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (level.grid[y][x] === "P") {
        px = x;
        py = y;
      }
    }
  }

  const tileAt = (x: number, y: number): string => {
    if (x < 0 || y < 0 || x >= width || y >= height) return "#";
    return level.grid[y][x];
  };

  const goal = level.goal;
  const coinsNeeded = goal.type === "collect" ? (goal.target ?? 1) : 0;

  const move = (): boolean => {
    const vec = DIR_VECTORS[direction];
    const nx = px + vec.dx;
    const ny = py + vec.dy;
    const tile = tileAt(nx, ny);
    steps += 1;

    if (tile === "#" || tile === "S") {
      crashed = true;
      return true;
    }

    px = nx;
    py = ny;
    if (tile === "C") coins += 1;
    if (tile === "G") {
      won = goal.type === "reach" || coins >= coinsNeeded;
      return true;
    }
    return false;
  };

  const run = (nodes: ProgramNode[]): void => {
    for (const node of nodes) {
      if (steps >= maxSteps || won || crashed) return;

      if (node.type === "cmd") {
        if (node.cmd === "left") {
          direction = TURN_LEFT[direction];
        } else if (node.cmd === "right") {
          direction = TURN_RIGHT[direction];
        } else {
          const finished = move();
          if (finished) return;
        }
        continue;
      }

      if (node.type === "seq") {
        run(node.body);
        continue;
      }

      const vec = DIR_VECTORS[direction];
      const ahead = tileAt(px + vec.dx, py + vec.dy);
      const blocked = ahead === "#" || ahead === "S";
      if (node.type === "ifBlockedAhead" && blocked) run(node.body);
      if (node.type === "ifCanMove" && !blocked) run(node.body);
    }
  };

  run(program);

  if (!won && !crashed) {
    won = tileAt(px, py) === "G" && (goal.type === "reach" || coins >= coinsNeeded);
  }

  return { won, crashed, coins, steps, position: { x: px, y: py } };
}