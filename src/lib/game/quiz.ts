export const QUIZ_PASS_RATE = 0.7;

export interface QuizQuestionLike {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
}

export function gradeQuiz(
  answers: number[],
  questions: QuizQuestionLike[],
): QuizResult {
  const total = questions.length;
  let score = 0;
  questions.forEach((question, i) => {
    if (answers[i] === question.answer) score += 1;
  });
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  return { score, total, percent, passed: percent / 100 >= QUIZ_PASS_RATE };
}