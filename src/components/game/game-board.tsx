"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameLevel } from "@/lib/game/validate";
import { simulate, type Command, type SimulationResult } from "@/lib/game/simulator";
import { StatusChip } from "@/components/design/status-chip";

interface GameBoardProps {
  level: GameLevel;
  commands: Command[];
  speedMs?: number;
  onResult?: (result: SimulationResult) => void;
  disabled?: boolean;
}

const TILE_STYLE: Record<string, string> = {
  "#": "bg-slate-800 border border-slate-700/60",
  ".": "bg-slate-950/60",
  C: "bg-emerald-400/15 border border-emerald-400/40",
  S: "bg-rose-500/20 border border-rose-500/50",
  G: "bg-emerald-400/40 border border-emerald-300 glow-box",
};

function tileEmoji(tile: string): string {
  switch (tile) {
    case "#":
      return "";
    case "C":
      return "🔋";
    case "S":
      return "⚠️";
    case "G":
      return "◈";
    default:
      return "";
  }
}

function findStart(grid: string[]): { x: number; y: number } {
  const width = grid[0].length;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "P") return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

const TURN_LEFT_MAP: Record<string, "N" | "E" | "S" | "W"> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const TURN_RIGHT_MAP: Record<string, "N" | "E" | "S" | "W"> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

export function GameBoard({
  level,
  commands,
  speedMs = 350,
  onResult,
  disabled = false,
}: GameBoardProps) {
  const width = level.grid[0].length;
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const startPos = useMemo(() => findStart(level.grid), [level]);

  useEffect(() => {
    startRef.current = startPos;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startPos]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  }, []);

  const run = useCallback(() => {
    if (disabled || running) return;
    stop();
    setStep(0);
    setRunning(true);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      const result = simulate(level, commands.slice(0, i));
      setStep(i);
      if (result.crashed || result.won || i >= commands.length) {
        stop();
        onResult?.(result);
      }
    }, speedMs);
  }, [commands, disabled, level, onResult, running, speedMs, stop]);

  const reset = useCallback(() => {
    stop();
    setStep(0);
  }, [stop]);

  const current = simulate(level, commands.slice(0, step));
  const pos = current.crashed && step === 0 ? startPos : current.position;
  const dir = useMemo(() => {
    const cmds = commands.slice(0, step);
    let d = "E" as "N" | "E" | "S" | "W";
    for (const c of cmds) {
      if (c === "left") d = TURN_LEFT_MAP[d];
      if (c === "right") d = TURN_RIGHT_MAP[d];
    }
    return d;
  }, [commands, step]);

  const robotFace = { N: "▲", E: "►", S: "▼", W: "◄" }[dir];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={disabled || running}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
        >
          {running ? "Menjalankan..." : "▶ Jalankan"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-4 py-1.5 text-sm transition hover:bg-muted"
        >
          ⟲ Reset
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <StatusChip
            status={
              current.won ? "success" : current.crashed ? "danger" : "neutral"
            }
            label={
              current.won
                ? "BERHASIL"
                : current.crashed
                  ? "CRASH"
                  : `LANGKAH ${step}/${commands.length}`
            }
          />
          <StatusChip status="info" label={`🔋 ${current.coins}`} />
        </div>
      </div>

      <div
        className="grid w-full gap-[2px] rounded-lg border border-border bg-slate-900/60 p-2"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          maxWidth: `${width * 34}px`,
        }}
      >
        {level.grid.map((row, y) =>
          row.split("").map((tile, x) => {
            const isPlayer = pos.x === x && pos.y === y && !current.won;
            return (
              <div
                key={`${x}-${y}`}
                className={`relative flex aspect-square items-center justify-center text-sm sm:text-base ${TILE_STYLE[tile] ?? ""}`}
              >
                {tileEmoji(tile)}
                {isPlayer && (
                  <span className="absolute inset-0 flex items-center justify-center text-base text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]">
                    {robotFace}
                  </span>
                )}
                {current.won && pos.x === x && pos.y === y && (
                  <span className="absolute inset-0 flex items-center justify-center text-base text-emerald-300">
                    ★
                  </span>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}