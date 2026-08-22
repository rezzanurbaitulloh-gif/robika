import type { ConceptDef, ConceptId, MasteryLevel } from "./types";

export const CONCEPTS: readonly ConceptDef[] = [
  {
    id: "javascript.basics",
    language: "javascript",
    title: { id: "Dasar JavaScript", en: "JavaScript Basics" },
    academyModuleIds: ["js-pengenalan"],
  },
  {
    id: "javascript.variables",
    language: "javascript",
    title: { id: "Variabel & Tipe Data", en: "Variables & Types" },
    academyModuleIds: ["js-variabel"],
  },
  {
    id: "javascript.conditions",
    language: "javascript",
    title: { id: "Kondisi (if/else)", en: "Conditionals (if/else)" },
    academyModuleIds: ["js-kontrol"],
  },
  {
    id: "javascript.loops",
    language: "javascript",
    title: { id: "Perulangan", en: "Loops" },
    academyModuleIds: ["js-perulangan"],
  },
  {
    id: "javascript.functions",
    language: "javascript",
    title: { id: "Fungsi", en: "Functions" },
    academyModuleIds: ["js-fungsi"],
  },
  {
    id: "adventure.bot-movement",
    language: "adventure",
    title: { id: "Perintah Gerak BOT-1", en: "BOT-1 Movement" },
    academyModuleIds: [],
  },
] as const;

const BY_ID = new Map<string, ConceptDef>(CONCEPTS.map((c) => [c.id, c]));

const GAME_CONCEPT_MAP: Record<string, ConceptId> = {
  "moveForward()": "adventure.bot-movement",
  "moveForward(), turnLeft(), turnRight()": "adventure.bot-movement",
  "for loop": "javascript.loops",
  "if (blockedAhead())": "javascript.conditions",
  "function zigzag()": "javascript.functions",
};

export function getConcept(id: string): ConceptDef | null {
  return BY_ID.get(id) ?? null;
}

export function conceptsForModule(moduleId: string): ConceptDef[] {
  return CONCEPTS.filter((c) => c.academyModuleIds.includes(moduleId));
}

export function conceptForGameLevel(conceptLabel: string): ConceptId | null {
  return GAME_CONCEPT_MAP[conceptLabel.trim()] ?? null;
}

const RANK: Record<MasteryLevel, number> = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  MASTERED: 3,
};

export function nextMasteryLevel(current: MasteryLevel, successfulAttempts: number, bestScore: number): MasteryLevel {
  if (RANK[current] >= RANK.MASTERED) return current;
  let level: MasteryLevel = current;
  if (successfulAttempts > 0 && RANK[level] < RANK.IN_PROGRESS) level = "IN_PROGRESS";
  if (bestScore >= 60 && RANK[level] < RANK.COMPLETED) level = "COMPLETED";
  if (bestScore >= 90) level = "MASTERED";
  return level;
}
