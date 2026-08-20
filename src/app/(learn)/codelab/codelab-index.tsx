"use client";

import { useState } from "react";
import Link from "next/link";
import { challenges } from "@/content/codelab";
import { StatusChip } from "@/components/design/status-chip";
import { BackButton } from "@/components/design/back-button";
import { Icon, type IconName } from "@/components/design/icon";
import { cn } from "@/lib/utils";

type LangFilter = "all" | "javascript" | "python";

const FILTERS: { id: LangFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
];

const KIND_ICON: Record<string, IconName> = {
  output: "code",
  "complete-code": "pen",
  "fix-bug": "alert",
  preview: "eye",
};

const KIND_LABEL: Record<string, string> = {
  output: "TULIS KODE",
  "complete-code": "LENGKAPI",
  "fix-bug": "FIX BUG",
  preview: "PREVIEW",
};

export function CodelabIndex({ done }: { done: string[] }) {
  const [filter, setFilter] = useState<LangFilter>("all");
  const doneSet = new Set(done);
  const visible = challenges.filter(
    (c) => filter === "all" || c.lang === filter,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
          <Icon name="bolt" size={22} />
          CODELAB
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Latihan singkat JavaScript & Python. Pilih bahasa, selesaikan
          tantangan, dapatkan XP dan stars. Tantangan yang lulus ditandai LULUS
          — mengulang tidak menambah reward.
        </p>
      </div>

      <Link
        href="/codelab/studio"
        className="group mb-6 flex items-center gap-4 rounded-xl border border-accent/40 bg-gradient-to-r from-accent/10 via-card to-card p-4 transition hover:border-accent/70 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
      >
        <span className="shrink-0 rounded-xl bg-accent/15 p-3 text-accent">
          <Icon name="code" size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm uppercase tracking-wide text-foreground">
            CodeLab Studio
          </span>
          <span className="block text-xs text-muted-foreground">
            Editor bebas — pilih bahasa (HTML, CSS, JS, Python), hasil tampil
            live di samping.
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold text-accent">
          Buka →
        </span>
      </Link>

      <div
        role="tablist"
        aria-label="Filter bahasa"
        className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-background/90 p-1"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-semibold transition sm:text-sm",
              filter === f.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((challenge) => {
          const completed = doneSet.has(challenge.id);
          return (
            <Link
              key={challenge.id}
              href={`/codelab/${challenge.id}`}
              className="group flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="shrink-0 rounded-lg bg-accent/10 p-2 text-accent">
                  <Icon
                    name={KIND_ICON[challenge.kind] ?? "code"}
                    size={20}
                  />
                </span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <StatusChip
                    status={challenge.lang === "python" ? "info" : "neutral"}
                    label={challenge.lang === "python" ? "PYTHON" : "JS"}
                  />
                  {completed && (
                    <StatusChip status="success" label="LULUS" />
                  )}
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <h3 className="font-display text-sm uppercase tracking-wide text-foreground">
                  {challenge.title.id}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {challenge.description.id}
                </p>
                <p className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground/80">
                    {KIND_LABEL[challenge.kind] ?? challenge.kind.toUpperCase()}
                  </span>
                  <span className="text-accent">+{challenge.xpReward} XP</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}