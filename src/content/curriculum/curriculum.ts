import type { IconName } from "@/components/design/icon";
import { JAVASCRIPT_TRACK } from "./languages/javascript";
import { PYTHON_TRACK } from "./languages/python";
import { HTML_CSS_TRACK } from "./languages/html-css";
import { TYPESCRIPT_TRACK } from "./languages/typescript";
import { SQL_TRACK } from "./languages/sql";
import { JAVA_TRACK } from "./languages/java";
import { PHP_TRACK } from "./languages/php";
import { GO_TRACK } from "./languages/go";
import { CPP_TRACK } from "./languages/cpp";

export interface CurriculumTopic {
  title: string;
  body: string;
  code?: string;
}

export interface CurriculumQuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  minutes: number;
  topics: CurriculumTopic[];
  quiz: CurriculumQuizQuestion[];
}

export interface CurriculumStack {
  id: string;
  name: string;
  icon: IconName;
  description: string;
  color: string;
  difficulty: "Pemula" | "Menengah" | "Lanjut";
  modules: CurriculumModule[];
}

export const CURRICULUM_STACKS: CurriculumStack[] = [
  HTML_CSS_TRACK,
  JAVASCRIPT_TRACK,
  TYPESCRIPT_TRACK,
  PYTHON_TRACK,
  SQL_TRACK,
  JAVA_TRACK,
  PHP_TRACK,
  GO_TRACK,
  CPP_TRACK,
];

export function getCurriculumStack(stackId: string): CurriculumStack | undefined {
  return CURRICULUM_STACKS.find((s) => s.id === stackId);
}

export function getCurriculumModule(
  stackId: string,
  moduleId: string,
): { stack: CurriculumStack; module: CurriculumModule } | undefined {
  const stack = getCurriculumStack(stackId);
  if (!stack) return undefined;
  const mod = stack.modules.find((m) => m.id === moduleId);
  if (!mod) return undefined;
  return { stack, module: mod };
}