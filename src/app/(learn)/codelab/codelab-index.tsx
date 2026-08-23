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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <div className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">
          ▸ ~/robika/codelab
        </p>
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
          <Icon name="bolt" size={22} />
          CODELAB
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Latihan singkat JavaScript &amp; Python. Pilih bahasa, selesaikan
          tantangan, dapatkan XP dan stars. Tantangan yang lulus ditandai LULUS
          — mengulang tidak menambah reward.
        </p>
      </div>

      <Link
        href="/codelab/studio"
        className="group mb-6 flex items-center gap-4 rounded-sm border border-cyan-400/30 bg-[#0c101d] p-4 transition hover:border-cyan-400/60"
      >
        <span className="shrink-0 grid h-11 w-11 place-items-center rounded-sm border border-border bg-input/30 text-cyan-300">
          <Icon name="code" size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-xs text-muted-foreground">
            <span className="text-emerald-400">$</span> robika open{" "}
            <span className="text-cyan-300 group-hover:underline">studio</span>
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            Studio proyek multi-file — HTML, CSS, JS &amp; Python dengan editor
            Monaco, explorer file, dan preview live tersandbox. Proyekmu
            tersimpan otomatis.
          </span>
        </span>
        <Icon name="chevronRight" size={16} />
      </Link>

      <div
        role="tablist"
        aria-label="Filter bahasa"
        className="mb-6 flex gap-1 overflow-x-auto rounded-sm border border-border bg-[#0c101d] p-1"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "whitespace-nowrap rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition sm:text-xs",
              filter === f.id
                ? "bg-cyan-400/15 text-cyan-200"
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
              className={cn(
                "group flex flex-col gap-2.5 rounded-sm border p-4 transition",
                completed
                  ? "border-emerald-400/25 bg-[#0c101d]"
                  : "border-border bg-[#0c101d] hover:border-cyan-400/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="shrink-0 grid h-8 w-8 place-items-center rounded-sm border border-border bg-input/30 text-cyan-300">
                  <Icon
                    name={KIND_ICON[challenge.kind] ?? "code"}
                    size={16}
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
                <p className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                  <span className="rounded-sm bg-input/40 px-1.5 py-0.5 uppercase tracking-wider text-foreground/80">
                    {KIND_LABEL[challenge.kind] ?? challenge.kind.toUpperCase()}
                  </span>
                  <span className="text-emerald-400">
                    +{challenge.xpReward} XP
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
