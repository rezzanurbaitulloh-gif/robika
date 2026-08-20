"use client";

import { useState } from "react";
import { QuizPanel } from "@/components/game/quiz-panel";
import { ModuleComplete } from "@/components/learn/module-complete";
import type { QuizQuestionLike } from "@/lib/game/quiz";

interface QuizCompletePanelProps {
  questions: QuizQuestionLike[];
  itemId: string;
  initialDone: boolean;
}

export function QuizCompletePanel({
  questions,
  itemId,
  initialDone,
}: QuizCompletePanelProps) {
  const [passed, setPassed] = useState(initialDone);

  return (
    <>
      <QuizPanel
        questions={questions}
        onComplete={() => setPassed(true)}
      />
      <ModuleComplete
        itemType="quiz"
        itemId={itemId}
        initialDone={initialDone}
        quizPassed={passed}
      />
    </>
  );
}