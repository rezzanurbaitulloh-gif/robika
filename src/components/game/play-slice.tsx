"use client";

import { useEffect, useRef, useState } from "react";
import { HudBar } from "@/components/game/hud-bar";
import { PopupLayer, usePopups } from "@/components/system/popup-layer";
import { createSliceScene, type SliceHandle } from "@/components/game/slice-scene";
import { getLevel } from "@/content";
import { simulateWithJs } from "@/lib/game/interpreter";
import { Icon } from "@/components/design/icon";

const LEVELS = [
  { id: "world-1-level-1", label: "Pabrik" },
  { id: "world-2-level-4", label: "Gerbang" },
];

export function PlaySlice() {
  const [levelId, setLevelId] = useState(LEVELS[0].id);
  const level = getLevel(levelId);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SliceHandle | null>(null);
  const pushedLevels = useRef(new Set<string>());
  const practicedFromLesson = useRef(new Set<string>());
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const push = usePopups((s) => s.push);
  const [code, setCode] = useState(level?.starterCode ?? "");
  const [running, setRunning] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "err" | "info"; text: string } | null>(
    null
  );

  useEffect(() => {
    if (!level || !containerRef.current) return;
    let disposed = false;
    let handle: SliceHandle | null = null;

    createSliceScene(containerRef.current, level, () => {}).then((h) => {
      if (disposed) {
        h.destroy();
        return;
      }
      handle = h;
      sceneRef.current = h;
    });

    if (!pushedLevels.current.has(level.id)) {
      pushedLevels.current.add(level.id);
      push({
        type: "quest-started",
        title: level.title.id,
        body: level.objective.id,
      });
    }

    return () => {
      disposed = true;
      handle?.destroy();
      sceneRef.current = null;
    };
  }, [level, push]);

  if (!level) {
    return <p className="p-6 font-display text-sm text-foreground/60">Level tidak ditemukan.</p>;
  }

  const runCode = async () => {
    if (running || !sceneRef.current) return;
    setRunning(true);
    setFeedback(null);
    try {
      const sim = simulateWithJs(level, code);
      if (sim.status !== "ok") {
        setFeedback({
          tone: "err",
          text: sim.error ? `Error: ${sim.error}` : "BOT-1 menabrak dinding!",
        });
        return;
      }
      const won = await sceneRef.current.runEvents(sim.events);
      if (won) {
        push({
          type: "quest-complete",
          title: level.title.id,
          body: practicedFromLesson.current.has(level.id)
            ? `${level.title.id} selesai. Latihan dari Academy berhasil dipraktikkan di game.`
            : `${level.title.id} selesai. Misi BOT-1 berhasil.`,
          rewards: [
            { label: "XP", amount: `+${level.xpReward}` },
            { label: "Gems", amount: "+5" },
          ],
        });
        setFeedback({ tone: "ok", text: "Misi selesai! BOT-1 aman di tile hijau." });
      } else {
        setFeedback({ tone: "info", text: "Kode berjalan, tapi BOT-1 belum sampai tujuan." });
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 py-6">
      <HudBar level={1} xp={0} gems={0} streak={0} questLabel={level.title.id} />
      <header>
        <div className="mb-2 flex gap-2">
          {LEVELS.map((l) => {
            const active = l.id === levelId;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  if (l.id === levelId) return;
                  setLevelId(l.id);
                  setCode(getLevel(l.id)?.starterCode ?? "");
                  setFeedback(null);
                }}
                className={
                  active
                    ? "rounded-sm border border-cyan-400/70 bg-cyan-400/20 px-3 py-1 font-display text-xs uppercase tracking-wider text-cyan-200"
                    : "rounded-sm border border-border px-3 py-1 font-display text-xs uppercase tracking-wider text-foreground/50 transition hover:border-cyan-400/40 hover:text-cyan-300"
                }
              >
                {l.label}
              </button>
            );
          })}
        </div>
        <h1 className="font-display text-lg uppercase tracking-widest text-cyan-300">
          {level.title.id}
        </h1>
        <div className="mt-1 flex items-start justify-between gap-3">
          <p className="text-sm text-foreground/70">{level.objective.id}</p>
          <button
            type="button"
            onClick={() => setLessonOpen(true)}
            className="shrink-0 rounded-sm border border-amber-400/50 bg-amber-400/10 px-2.5 py-1 font-display text-[10px] uppercase tracking-wider text-amber-300 transition hover:bg-amber-400/20"
          >
            Academy
          </button>
        </div>
        {feedback && feedback.tone !== "ok" && !lessonOpen && (
          <button
            type="button"
            onClick={() => setLessonOpen(true)}
            className="mt-2 rounded-sm border border-amber-400/50 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider text-amber-300 transition hover:bg-amber-400/15"
          >
            Aku belum paham
          </button>
        )}
      </header>

      {lessonOpen && level.lesson && (
        <section
          data-testid="academy-bridge"
          className="rounded-md border border-amber-400/40 bg-[#171426]/90 p-4"
        >
          <p className="font-display text-[10px] uppercase tracking-widest text-amber-400/80">
            Academy · {level.concept}
          </p>
          <h2 className="mt-1 font-display text-base uppercase tracking-wide text-amber-200">
            {level.lesson.title}
          </h2>
          <ul className="mt-2 space-y-1.5">
            {level.lesson.body.map((par) => (
              <li key={par} className="text-sm leading-relaxed text-foreground/75">
                {par}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              practicedFromLesson.current.add(level.id);
              setLessonOpen(false);
              codeRef.current?.focus();
            }}
            className="mt-3 rounded-sm border border-emerald-400/60 bg-emerald-400/15 px-3 py-1.5 font-display text-xs uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-400/25"
          >
            Praktik di Game
          </button>
        </section>
      )}

      <div className="overflow-x-auto rounded-md border border-cyan-400/30 bg-[#0f1220] p-2">
        <div ref={containerRef} />
      </div>

      <section className="rounded-md border border-border bg-[#141a2e]/90 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-xs uppercase tracking-wider text-foreground/60">
            Terminal BOT-1
          </span>
          <button
            type="button"
            onClick={() => void runCode()}
            disabled={running}
            className="flex items-center gap-1.5 rounded-sm border border-emerald-400/60 bg-emerald-400/15 px-3 py-1.5 font-display text-xs uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-400/25 disabled:opacity-40"
          >
            <Icon name="play" className="h-3.5 w-3.5" />
            {running ? "Menjalankan…" : "Run"}
          </button>
        </div>
        <textarea
          ref={codeRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={6}
          className="w-full rounded-sm border border-border bg-[#0b0e17] p-3 font-mono text-sm text-cyan-100 outline-none focus:border-cyan-400/50"
        />
        {feedback && (
          <p
            className={
              feedback.tone === "ok"
                ? "mt-2 font-mono text-xs text-emerald-300"
                : feedback.tone === "err"
                  ? "mt-2 font-mono text-xs text-rose-400"
                  : "mt-2 font-mono text-xs text-amber-300"
            }
          >
            {feedback.text}
          </p>
        )}
      </section>

      <PopupLayer />
    </main>
  );
}
