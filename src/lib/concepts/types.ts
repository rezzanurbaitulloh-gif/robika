export type MasteryLevel = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";

export type ConceptId = string;

export interface ConceptDef {
  id: ConceptId;
  language: string;
  title: { id: string; en: string };
  academyModuleIds: string[];
}

export interface ConceptMastery {
  userId: string;
  conceptId: ConceptId;
  attempts: number;
  successfulAttempts: number;
  bestScore: number;
  masteryScore: number;
  lastPracticedAt: string | null;
}
