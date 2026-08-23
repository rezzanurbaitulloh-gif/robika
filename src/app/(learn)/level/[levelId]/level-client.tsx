"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { GameBoard, type GameBoardHandle } from "@/components/game/game-board";
import {
  AdventureBoard,
} from "@/components/game/adventure-board";
import { HintPanel } from "@/components/game/hint-panel";
import { QuizPanel } from "@/components/game/quiz-panel";
import { BossPanel } from "@/components/game/boss-panel";
import { CodeEditor } from "@/components/codelab/code-editor";
import { AiChat } from "@/components/ai/ai-chat";
import { parseCommands, type SimulationResult } from "@/lib/game/simulator";
import { levelEngine, type AnySimResult } from "@/lib/game/engine";
import { starsForHints } from "@/lib/game/stars";
import { StatusChip } from "@/components/design/status-chip";
import { Icon, type IconName } from "@/components/design/icon";
import { BackButton } from "@/components/design/back-button";
import type { GameLevel } from "@/lib/game/validate";

type Tab = "materi" | "kuis" | "game" | "ai";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "materi", label: "Materi", icon: "book" },
  { id: "kuis", label: "Kuis", icon: "target" },
  { id: "game", label: "Game", icon: "gamepad" },
  { id: "ai", label: "AI", icon: "robot" },
];

export function LevelClient({
  level,
  isDaily = false,
  nextLevelId = null,
  skin = null,
}: {
  level: GameLevel;
  isDaily?: boolean;
  nextLevelId?: string | null;
  skin?: { colors: { body: string; visor: string; glow: string }; name: string } | null;
}) {
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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hadError, setHadError] = useState(false);
  const [parBonus, setParBonus] = useState(0);
  const [errorBonus, setErrorBonus] = useState(0);
  const startRef = useRef<number | null>(null);
  const boardRef = useRef<GameBoardHandle>(null);

  const usesJsEngine = useMemo(() => levelEngine(level) === "js", [level]);
  const commands = useMemo(
    () => (usesJsEngine ? [] : parseCommands(code)),
    [code, usesJsEngine],
  );
  const canRun = !result?.won;

  const onResult = (res: SimulationResult | AnySimResult) => {
    setResult(res);
    if (!res.won) {
      if (res.crashed) setHadError(true);
      if (level.isBoss) {
        void fetch("/api/boss/attempt", { method: "POST" });
      }
      return;
    }
    const elapsedMs = startRef.current ? performance.now() - startRef.current : 0;
    void (async () => {
      const response = await fetch("/api/game/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level_id: level.id,
          stars: starsForHints(hintsUsed),
          hints_used: hintsUsed,
          elapsed_ms: Math.round(elapsedMs),
          error_recovered: hadError,
          code,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as {
          xp: number;
          stars_to_credit: number;
          level: number;
          leveled_up: boolean;
          par_bonus: number;
          error_bonus: number;
        };
        setReward({
          xp: data.xp,
          stars: data.stars_to_credit,
          level: data.level,
          leveledUp: data.leveled_up,
        });
        setParBonus(data.par_bonus);
        setErrorBonus(data.error_bonus);
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
          <BackButton fallbackHref={`/world/${level.world}`} />
          <h1 className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
            {level.title.id}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {level.concept} · XP {level.xpReward}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isDaily && <StatusChip status="warning" label="DAILY CHALLENGE" />}
          {result?.won && <StatusChip status="success" label="LEVEL BERHASIL" />}
          {result?.crashed && (
            <StatusChip status="danger" label="CRASH" className="animate-shake" />
          )}
          {level.isBoss && <StatusChip status="info" label="BOSS BATTLE" />}
        </div>
      </div>

      <div
        role="tablist"
        className="sticky top-[52px] z-10 mb-6 flex gap-1 overflow-x-auto rounded-sm border border-border bg-background/90 p-1 backdrop-blur"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
              tab === t.id
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Icon name={t.icon} size={15} />
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {tab === "materi" && level.lesson && (
        <div className="rounded-sm border border-border bg-[#0c101d] p-4 sm:p-6">
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
          <div className="mt-6 rounded-sm border border-cyan-400/30 bg-cyan-400/5 px-4 py-3 text-sm text-foreground">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">MISI: </span>
            {level.objective.id}
          </div>
        </div>
      )}

      {tab === "kuis" && level.quiz && <QuizPanel questions={level.quiz.questions} />}

      {tab === "ai" && (
        <div className="h-[560px]">
          <AiChat
            mode="tutor"
            context={{ topic: level.concept, level: level.title.id, code }}
            placeholder="Buntu di level ini? Tanya — AI memandu dengan petunjuk bertahap, bukan jawaban instan."
          />
        </div>
      )}

      {tab === "game" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {usesJsEngine ? (
              <AdventureBoard
                ref={boardRef}
                level={level}
                code={code}
                onResult={onResult}
                onRunStart={() => {
                  startRef.current = performance.now();
                }}
                disabled={canRun === false}
                skinColors={skin?.colors}
              />
            ) : (
              <GameBoard
                ref={boardRef}
                level={level}
                commands={commands}
                skinColors={skin?.colors}
                onResult={onResult}
                onRunStart={() => {
                  startRef.current = performance.now();
                }}
                disabled={canRun === false}
              />
            )}

            <div className="overflow-hidden rounded-sm border border-border">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 px-3 py-2">
                <span className="font-display text-xs tracking-widest text-muted-foreground">
                  KODE BOT-1
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => boardRef.current?.reset()}
                    disabled={!canRun}
                    className="rounded-sm border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-muted-foreground/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Icon name="refresh" size={14} /> Reset
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("game");
                      boardRef.current?.run();
                    }}
                    disabled={!canRun}
                    className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-3 py-1 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Icon name="play" size={14} />
                      {result?.won ? "Jalankan ulang" : "Jalankan"}
                    </span>
                  </button>
                </div>
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                height="280px"
                language="javascript"
              />
            </div>

            {result?.won && (
              <div className="animate-pop rounded-sm border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Berhasil dalam {result.steps} langkah dengan {result.coins} power
                cell!
                {reward && (
                  <span>
                    {" "}
                    +{reward.xp} XP · {reward.stars} stars
                    {parBonus > 0 && (
                      <span className="ml-1 inline-flex items-center gap-1 text-amber-300"><Icon name="bolt" size={13} /> par +{parBonus} XP</span>
                    )}
                    {errorBonus > 0 && (
                      <span className="ml-1 inline-flex items-center gap-1 text-sky-300"><Icon name="refresh" size={13} /> error recovery +{errorBonus} XP</span>
                    )}
                    {reward.leveledUp && (
                      <StatusChip status="warning" label={`NAIK LEVEL ${reward.level}!`} />
                    )}
                  </span>
                )}
                {newBadges.length > 0 && (
                  <span className="mt-2 block">
                    Badge baru:{" "}
                    {newBadges.map((id) => (
                      <span key={id} className="mr-1 inline-block rounded bg-amber-400/20 px-1.5 py-0.5 text-xs">
                        {id}
                      </span>
                    ))}
                  </span>
                )}
                {result?.won && (
              <span className="mt-3 flex flex-wrap gap-2">
                {isDaily ? (
                  <Link href="/daily" className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-5 py-2 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="check" size={15} /> Selesai
                    </span>
                  </Link>
                ) : (
                  <>
                    {nextLevelId && (
                      <Link
                        href={`/level/${nextLevelId}`}
                        className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-5 py-2 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20"
                      >
                        Level berikutnya
                      </Link>
                    )}
                    <Link
                      href={`/world/${level.world}`}
                      className="rounded-sm border border-border px-5 py-2 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
                    >
                      {nextLevelId ? "Kembali ke peta" : "Selesai — kembali ke peta"}
                    </Link>
                  </>
                )}
              </span>
            )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {level.isBoss && <BossPanel />}
            <HintPanel
              hints={level.hints}
              trackBalance
              onUseHint={() => setHintsUsed((n) => n + 1)}
            />

            <div className="rounded-sm border border-border bg-card/60 p-4">
              <h3 className="mb-2 flex items-center gap-1.5 font-display text-sm tracking-wide">
                <Icon name="robot" size={15} />
                AI TUTOR
              </h3>
              <p className="text-xs text-muted-foreground">
                Butuh petunjuk? Buka tab <span className="font-semibold text-foreground">AI</span> di
                atas — gratis 20×/hari.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}