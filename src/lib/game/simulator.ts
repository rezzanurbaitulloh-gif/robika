import type { GameLevel } from "./validate";

export type Command = "forward" | "left" | "right";

export interface SimulationResult {
  won: boolean;
  crashed: boolean;
  coins: number;
  steps: number;
  position: { x: number; y: number };
}

const COMMAND_PATTERN = /moveForward\s*\(\)|turnLeft\s*\(\)|turnRight\s*\(\)/g;

function stripComments(code: string): string {
  return code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "");
}

function unrollLoops(code: string): string {
  let prev = "";
  let current = code;
  while (current !== prev) {
    prev = current;
    current = current.replace(
      /for\s*\(\s*let\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*(\d+)\s*;\s*\w+\+\+\s*\)\s*\{([^}]*)\}/g,
      (_match, count: string, body: string) => body.repeat(Number(count)),
    );
    current = current.replace(
      /for\s*\(\s*let\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*(\d+)\s*;\s*\w+\+\+\s*\)\s*([^;{}]*);/g,
      (_match, count: string, statement: string) =>
        (statement + ";").repeat(Number(count)),
    );
  }
  return current;
}

export function parseCommands(code: string): Command[] {
  const commands: Command[] = [];
  const expanded = unrollLoops(stripComments(code));
  const matches = expanded.match(COMMAND_PATTERN);
  if (!matches) return commands;
  for (const match of matches) {
    if (match.startsWith("moveForward")) commands.push("forward");
    else if (match.startsWith("turnLeft")) commands.push("left");
    else commands.push("right");
  }
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
  commands: Command[],
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

  for (const command of commands) {
    if (steps >= maxSteps) break;

    if (command === "left") {
      direction = TURN_LEFT[direction];
      continue;
    }
    if (command === "right") {
      direction = TURN_RIGHT[direction];
      continue;
    }

    const vec = DIR_VECTORS[direction];
    const nx = px + vec.dx;
    const ny = py + vec.dy;
    const tile = tileAt(nx, ny);
    steps += 1;

    if (tile === "#" || tile === "S") {
      crashed = true;
      break;
    }

    px = nx;
    py = ny;
    if (tile === "C") coins += 1;
    if (tile === "G") {
      const won = goal.type === "reach" || coins >= coinsNeeded;
      return { won, crashed: false, coins, steps, position: { x: px, y: py } };
    }
  }

  const won =
    !crashed && tileAt(px, py) === "G" && (goal.type === "reach" || coins >= coinsNeeded);

  return { won, crashed, coins, steps, position: { x: px, y: py } };
}