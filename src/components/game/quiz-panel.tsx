"use client";

import { useState } from "react";
import { gradeQuiz, type QuizQuestionLike } from "@/lib/game/quiz";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

interface QuizPanelProps {
  questions: QuizQuestionLike[];
  onComplete?: () => void;
}

export function QuizPanel({ questions, onComplete }: QuizPanelProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const result = submitted ? gradeQuiz(answers, questions) : null;

  const pick = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const retry = () => {
    setAnswers([]);
    setSubmitted(false);
  };

  const answeredAll = answers.length === questions.length;

  return (
    <div className="rounded-sm border border-border bg-card/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide text-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="target" size={16} />
            KUIS MATERI
          </span>
        </h3>
        {submitted && result && (
          <div className="flex items-center gap-2">
            <StatusChip
              status={result.passed ? "success" : "danger"}
              label={`${result.score}/${result.total} (${result.percent}%)`}
            />
            {result.passed && <StatusChip status="info" label="LULUS" />}
          </div>
        )}
      </div>

      <div className="space-y-5">
        {questions.map((question, qi) => {
          const picked = answers[qi];
          const wrongPicked = submitted && picked !== undefined && picked !== question.answer;
          return (
            <div key={qi}>
              <p className="mb-2 text-sm font-medium text-foreground">
                {qi + 1}. {question.q}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option, oi) => {
                  const isPicked = picked === oi;
                  const isCorrect = submitted && oi === question.answer;
                  let tone = "border-border bg-muted/40 text-muted-foreground";
                  if (isPicked && !submitted) {
                    tone = "border-cyan-400/60 bg-cyan-400/10 text-foreground";
                  } else if (submitted && isCorrect) {
                    tone = "border-emerald-400/50 bg-emerald-400/10 text-emerald-200";
                  } else if (submitted && isPicked && wrongPicked) {
                    tone = "border-rose-400/50 bg-rose-400/10 text-rose-200";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => pick(qi, oi)}
                      className={`rounded-sm border px-3 py-2 text-left text-sm transition ${tone} disabled:cursor-default`}
                    >
                      {String.fromCharCode(65 + oi)}. {option}
                    </button>
                  );
                })}
              </div>
              {submitted && wrongPicked && question.explain && (
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-200">
                  <Icon name="info" size={14} className="mt-0.5 shrink-0" />
                  {question.explain}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {!submitted ? (
          <button
            type="button"
            disabled={!answeredAll}
            onClick={() => setSubmitted(true)}
            className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-5 py-2 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20 disabled:pointer-events-none disabled:opacity-40"
          >
            {answeredAll ? "Periksa Jawaban" : `Jawab dulu (${answers.length}/${questions.length})`}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={retry}
              className="rounded-sm border border-border px-5 py-2 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
            >
              Ulangi Kuis
            </button>
            {result?.passed && onComplete && (
              <button
                type="button"
                onClick={onComplete}
                className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-5 py-2 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20"
              >
                <Icon name="check" size={15} /> Selesaikan
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}