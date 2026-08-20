export const TILE_CHARS = [".", "#", "P", "G", "C", "S", "E", "^"] as const;
export type TileChar = (typeof TILE_CHARS)[number];

export interface LevelText {
  id: string;
  en: string;
}

export interface LessonContent {
  title: string;
  body: string[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface GameLevel {
  id: string;
  world: string;
  order: number;
  title: LevelText;
  topic: string;
  concept: string;
  objective: LevelText;
  grid: string[];
  goal: { type: "reach" | "collect"; target?: number };
  hints: string[][];
  starterCode: string;
  solution: string;
  xpReward: number;
  lesson?: LessonContent;
  quiz?: QuizContent;
  isBoss?: boolean;
  boss?: { name: string; hp: number; cooldownMs: number };
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function countChar(grid: string[], ch: string): number {
  return grid.reduce(
    (sum, row) => sum + row.split("").filter((c) => c === ch).length,
    0,
  );
}

export function validateLevel(level: GameLevel, existingIds: string[] = []): ValidationResult {
  const errors: string[] = [];

  if (!level.id || level.id.trim() === "") errors.push("level.id must not be empty");
  if (existingIds.includes(level.id)) errors.push(`duplicate level id: ${level.id}`);

  if (level.grid.length === 0) {
    errors.push("grid must not be empty");
  } else {
    const width = level.grid[0].length;
    if (width === 0) errors.push("grid rows must not be empty");
    level.grid.forEach((row, i) => {
      if (row.length !== width) errors.push(`row length mismatch at row ${i}`);
      for (const ch of row) {
        if (!TILE_CHARS.includes(ch as TileChar)) {
          errors.push(`unknown tile char '${ch}' in row ${i}`);
        }
      }
    });

    const startCount = countChar(level.grid, "P");
    if (startCount === 0) errors.push("missing start tile 'P'");
    if (startCount > 1) errors.push("multiple start tiles 'P'");

    const goalCount = countChar(level.grid, "G");
    if (goalCount === 0) errors.push("missing goal tile 'G'");
    if (goalCount > 1) errors.push("multiple goal tiles 'G'");
  }

  if (level.goal.type === "collect") {
    const target = level.goal.target ?? 0;
    if (target <= 0) errors.push("collect goal needs target > 0");
    const coins = countChar(level.grid, "C");
    if (coins < target) errors.push(`not enough coins: ${coins} < ${target}`);
  }

  if (!Array.isArray(level.hints) || level.hints.length !== 3) {
    errors.push("hints must have exactly 3 tiers");
  } else {
    level.hints.forEach((tier, i) => {
      if (!Array.isArray(tier) || tier.length === 0) {
        errors.push(`hint tier ${i} must not be empty`);
      }
    });
  }

  if (!level.starterCode || level.starterCode.trim() === "") {
    errors.push("starterCode must not be empty");
  }
  if (!level.solution || level.solution.trim() === "") {
    errors.push("solution must not be empty");
  }
  if (!level.xpReward || level.xpReward <= 0) {
    errors.push("xpReward must be > 0");
  }
  if (!level.order || level.order <= 0) {
    errors.push("order must be > 0");
  }

  if (level.isBoss) {
    if (!level.boss) {
      errors.push("boss level requires boss spec");
    } else {
      if (!level.boss.name || level.boss.name.trim() === "") {
        errors.push("boss.name must not be empty");
      }
      if (!level.boss.hp || level.boss.hp <= 0) {
        errors.push("boss.hp must be > 0");
      }
      if (!level.boss.cooldownMs || level.boss.cooldownMs <= 0) {
        errors.push("boss.cooldownMs must be > 0");
      }
    }
  }

  if (level.lesson !== undefined) {
    if (!level.lesson.title || level.lesson.title.trim() === "") {
      errors.push("lesson.title must not be empty");
    }
    if (!Array.isArray(level.lesson.body) || level.lesson.body.length === 0) {
      errors.push("lesson.body must contain at least one paragraph");
    } else {
      level.lesson.body.forEach((p, i) => {
        if (typeof p !== "string" || p.trim() === "") {
          errors.push(`lesson.body[${i}] must be a non-empty string`);
        }
      });
    }
  }

  if (level.quiz !== undefined) {
    if (!Array.isArray(level.quiz.questions) || level.quiz.questions.length < 3 || level.quiz.questions.length > 5) {
      errors.push("quiz must have 3-5 questions");
    } else {
      level.quiz.questions.forEach((question, i) => {
        if (!question.q || question.q.trim() === "") {
          errors.push(`quiz.questions[${i}].q must not be empty`);
        }
        if (!Array.isArray(question.options) || question.options.length < 2 || question.options.length > 6) {
          errors.push(`quiz.questions[${i}].options must have 2-6 choices`);
        } else if (
          !Number.isInteger(question.answer) ||
          question.answer < 0 ||
          question.answer >= question.options.length
        ) {
          errors.push(`quiz.questions[${i}].answer out of range`);
        }
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

export function validateWorld(levels: GameLevel[]): ValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();
  const orders = new Set<number>();

  if (levels.length === 0) {
    return { ok: false, errors: ["world must contain at least one level"] };
  }

  for (const level of levels) {
    const result = validateLevel(level, [...ids]);
    errors.push(...result.errors);
    ids.add(level.id);
    if (orders.has(level.order)) {
      errors.push(`duplicate order ${level.order}`);
    }
    orders.add(level.order);
  }

  const bossCount = levels.filter((l) => l.isBoss).length;
  if (bossCount > 1) errors.push("world must have at most one boss level");

  return { ok: errors.length === 0, errors };
}