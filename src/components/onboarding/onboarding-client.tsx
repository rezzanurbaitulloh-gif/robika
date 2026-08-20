"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/client";
import { classifyAnswers, QUESTIONS } from "@/lib/core/assessment";
import { StatusChip } from "@/components/design/status-chip";

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
        <h1 className="mb-6 font-display text-2xl tracking-wide text-foreground">
          {question.question}
        </h1>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.score}
              type="button"
              onClick={() => answer(option.score)}
              className="w-full rounded-xl border border-border bg-slate-900/60 px-4 py-3 text-left text-sm text-foreground transition hover:border-accent/60 hover:bg-accent/5"
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
      <h1 className="font-display text-3xl tracking-wide text-foreground">
        ANALISIS SELESAI
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Kurikulummu akan disesuaikan dengan tingkat{" "}
        <span className="text-accent">
          {classifyAnswers(answers).toUpperCase()}
        </span>
        .
      </p>
      <button
        type="button"
        onClick={() => void finish()}
        disabled={saving}
        className="mx-auto mt-8 rounded-xl bg-accent px-8 py-3 font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Mulai Belajar 🚀"}
      </button>
    </main>
  );
}