"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/client";
import { classifyAnswers, QUESTIONS } from "@/lib/core/assessment";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

export function OnboardingClient() {
  const router = useRouter();
  const supabase = createClient();
  const [answers, setAnswers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const answered = answers.length;

  const answer = (score: number) => {
    setAnswers((prev) => {
      if (prev.length >= QUESTIONS.length) return prev;
      return [...prev, score];
    });
  };

  const finish = async () => {
    setSaving(true);
    const level = classifyAnswers(answers);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ skill_level: level })
        .eq("id", user.id);
    }

    router.push("/dashboard");
    router.refresh();
  };

  if (answered < QUESTIONS.length) {
    const question = QUESTIONS[answered];
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16">
        <div className="mb-2 flex items-center gap-2">
          <StatusChip status="info" label={`${answered + 1}/${QUESTIONS.length}`} />
          <StatusChip status="neutral" label="SKILL CHECK" />
        </div>
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${((answered + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <h1 className="mb-6 font-display text-2xl tracking-wide text-foreground">
          {question.question}
        </h1>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.score}
              type="button"
              onClick={() => answer(option.score)}
              className="w-full rounded-sm border border-border px-5 py-3 text-left text-sm text-muted-foreground transition hover:border-cyan-400/40 hover:text-foreground"
            >
              {option.label}
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl tracking-wide sm:text-3xl text-foreground">
        ANALISIS SELESAI
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Kurikulummu akan disesuaikan dengan tingkat{" "}
        <span className="text-cyan-300">
          {classifyAnswers(answers).toUpperCase()}
        </span>
        .
      </p>
      <button
        type="button"
        onClick={() => void finish()}
        disabled={saving}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-6 py-2.5 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20 disabled:pointer-events-none disabled:opacity-40"
      >
        {saving ? "Menyimpan..." : <>Mulai Belajar <Icon name="rocket" size={16} /></>}
      </button>
    </main>
  );
}