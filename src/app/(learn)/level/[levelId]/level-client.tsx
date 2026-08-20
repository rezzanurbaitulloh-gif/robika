"use client";

import { useState } from "react";
import Link from "next/link";
import { GameBoard } from "@/components/game/game-board";
import { HintPanel } from "@/components/game/hint-panel";
import { QuizPanel } from "@/components/game/quiz-panel";
import { BossPanel } from "@/components/game/boss-panel";
import { CodeEditor } from "@/components/codelab/code-editor";
import { parseCommands, type SimulationResult } from "@/lib/game/simulator";
import { StatusChip } from "@/components/design/status-chip";
import type { GameLevel } from "@/lib/game/validate";

type Tab = "materi" | "kuis" | "game";

const TABS: { id: Tab; label: string }[] = [
  { id: "materi", label: "📖 Materi" },
  { id: "kuis", label: "🧪 Kuis" },
  { id: "game", label: "🕹️ Game" },
];

export function LevelClient({ level, isDaily = false }: { level: GameLevel; isDaily?: boolean }) {
  const [tab, setTab] = useState<Tab>("materi");
  const [code, setCode] = useState(level.starterCode);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [reward, setReward] = useState<{
    xp: number;
    stars: number;
    level: number;
    leveledUp: boolean;
  } | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const commands = parseCommands(code);
  const canRun = !result?.won;

  const onResult = (res: SimulationResult) => {
    setResult(res);
    if (!res.won) {
      if (level.isBoss) {
        void fetch("/api/boss/attempt", { method: "POST" });
      }
      return;
    }
    void (async () => {
      const response = await fetch("/api/game/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level_id: level.id,
          stars: res.steps <= 12 ? 3 : res.steps <= 20 ? 2 : 1,
          hints_used: 0,
          elapsed_ms: res.steps * 350,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as {
          xp: number;
          stars_to_credit: number;
          level: number;
          leveled_up: boolean;
        };
        setReward({
          xp: data.xp,
          stars: data.stars_to_credit,
          level: data.level,
          leveledUp: data.leveled_up,
        });
        const check = await fetch("/api/achievements/check", { method: "POST" });
        if (check.ok) {
          const badgeData = (await check.json()) as { earned: string[] };
          setNewBadges(badgeData.earned);
        }
      }
    })();
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/world/world-1"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Kembali ke peta dunia
          </Link>
          <h1 className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
            {level.title.id}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {level.concept} · XP {level.xpReward}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isDaily && <StatusChip status="warning" label="⚡ DAILY CHALLENGE" />}
          {result?.won && <StatusChip status="success" label="✓ LEVEL BERHASIL" />}
          {result?.crashed && <StatusChip status="danger" label="✗ CRASH" />}
          {level.isBoss && <StatusChip status="info" label="BOSS BATTLE" />}
        </div>
      </div>

      <div
        role="tablist"
        className="sticky top-0 z-10 mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-background/90 p-1 backdrop-blur"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
              tab === t.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "materi" && level.lesson && (
        <div className="rounded-xl border border-border bg-slate-900/60 p-4 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-foreground">
            {level.lesson.title}
          </h2>
          <div className="mt-4 space-y-3">
            {level.lesson.body.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground">
            <span className="text-accent">MISI: </span>
            {level.objective.id}
          </div>
        </div>
      )}

      {tab === "kuis" && level.quiz && <QuizPanel questions={level.quiz.questions} />}

      {tab === "game" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <GameBoard
              level={level}
              commands={commands}
              onResult={onResult}
              disabled={canRun === false}
            />

            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 px-4 py-2">
                <span className="font-display text-xs tracking-widest text-muted-foreground">
                  KODE BOT-1
                </span>
                <span className="text-xs text-muted-foreground">
                  moveForward() · turnLeft() · turnRight()
                </span>
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                height="280px"
                language="javascript"
              />
            </div>

            {result?.won && (
              <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Berhasil dalam {result.steps} langkah dengan {result.coins} power
                cell!
                {reward && (
                  <span>
                    {" "}
                    +{reward.xp} XP · ★{reward.stars}
                    {reward.leveledUp && (
                      <StatusChip status="warning" label={`NAIK LEVEL ${reward.level}!`} />
                    )}
                  </span>
                )}
                {newBadges.length > 0 && (
                  <span className="mt-2 block">
                    🏅 Badge baru:{" "}
                    {newBadges.map((id) => (
                      <span key={id} className="mr-1 inline-block rounded bg-amber-400/20 px-1.5 py-0.5 text-xs">
                        {id}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {level.isBoss && <BossPanel />}
            <HintPanel hints={level.hints} trackBalance />

            <div className="rounded-xl border border-border bg-slate-900/60 p-4">
              <h3 className="mb-2 font-display text-sm tracking-wide">AI TUTOR</h3>
              <p className="text-xs text-muted-foreground">
                Butuh petunjuk? Buka AI Tutor lewat menu bawah — bebas 20×/hari.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}