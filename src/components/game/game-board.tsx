"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GameLevel } from "@/lib/game/validate";
import { simulate, type Command, type SimulationResult } from "@/lib/game/simulator";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";
import { themeFor } from "./world-theme";

export interface GameBoardHandle {
  run: () => void;
  reset: () => void;
}

interface GameBoardProps {
  level: GameLevel;
  commands: Command[];
  speedMs?: number;
  onResult?: (result: SimulationResult) => void;
  onRunStart?: () => void;
  disabled?: boolean;
  skinColors?: { body: string; visor: string; glow: string };
}

const BURST_PIXELS = [
  { i: 0, tx: -34, ty: -26 },
  { i: 1, tx: 30, ty: -30 },
  { i: 2, tx: -12, ty: -38 },
  { i: 3, tx: 14, ty: 36 },
  { i: 4, tx: -38, ty: 10 },
  { i: 5, tx: 40, ty: 6 },
  { i: 6, tx: -22, ty: 32 },
  { i: 7, tx: 24, ty: -12 },
  { i: 8, tx: -4, ty: 42 },
  { i: 9, tx: 8, ty: -44 },
  { i: 10, tx: -44, ty: -8 },
  { i: 11, tx: 44, ty: 22 },
];

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

export const GameBoard = forwardRef<GameBoardHandle, GameBoardProps>(
  function GameBoard({
    level,
    commands,
    speedMs = 350,
    onResult,
    onRunStart,
    disabled = false,
    skinColors,
  }, ref) {
    const width = level.grid[0].length;
    const theme = themeFor(level.world);
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
      onRunStart?.();
      setStep(0);
      setRunning(true);
      let i = 0;
      timerRef.current = setInterval(() => {
        i += 1;
        const program = commands.slice(0, i).map((cmd) => ({ type: "cmd" as const, cmd }));
        const result = simulate(level, program);
        setStep(i);
        if (result.crashed || result.won || i >= commands.length) {
          stop();
          onResult?.(result);
        }
      }, speedMs);
    }, [commands, disabled, level, onResult, onRunStart, running, speedMs, stop]);

    const reset = useCallback(() => {
      stop();
      setStep(0);
    }, [stop]);

    useImperativeHandle(ref, () => ({ run, reset }), [run, reset]);

  const current = simulate(
    level,
    commands.slice(0, step).map((cmd) => ({ type: "cmd" as const, cmd })),
  );
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
      <div className="flex flex-wrap items-center gap-2">
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
        <StatusChip status="info" label={`${current.coins}`} />
      </div>

      <div
        className={`relative grid w-full gap-[2px] rounded-lg border border-border bg-card/60 p-2 ${
          level.isBoss ? "boss-ring" : ""
        }`}
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          maxWidth: `min(${width * 34}px, 100%)`,
        }}
      >
        {level.grid.map((row, y) =>
          row.split("").map((tile, x) => {
            const isPlayer = pos.x === x && pos.y === y && !current.won;
            const tileClass =
              tile === "#"
                ? theme.wallClass
                : tile === "."
                  ? theme.floorClass
                  : tile === "C"
                    ? theme.coinClass
                    : tile === "S"
                      ? theme.hazardClass
                      : tile === "G"
                        ? theme.goalClass
                        : "";
            return (
              <div
                key={`${x}-${y}`}
                className={`relative flex aspect-square items-center justify-center text-sm sm:text-base ${tileClass}`}
              >
                {tile === "C" && (
                  <span style={{ color: theme.coinColor, textShadow: `0 0 6px ${theme.coinGlow}` }}>
                    <Icon name="bolt" size={14} />
                  </span>
                )}
                {tile === "S" && (
                  <span style={{ color: theme.hazardColor }}>
                    <Icon name="alert" size={14} />
                  </span>
                )}
                {tile === "G" && (
                  <span style={{ color: theme.goalColor }}>
                    <Icon name="target" size={14} />
                  </span>
                )}
                {isPlayer && (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-base"
                    style={{
                      color: skinColors?.body ?? "#67e8f9",
                      textShadow: `0 0 6px ${skinColors?.glow ?? "rgba(34,211,238,0.9)"}`,
                    }}
                  >
                    {robotFace}
                  </span>
                )}
                {current.won && pos.x === x && pos.y === y && (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center text-emerald-300">
                      <Icon name="star" size={16} />
                    </span>
                    {BURST_PIXELS.map((p, i) => (
                      <span
                        key={i}
                        className="burst-pixel bg-amber-300"
                        style={
                          {
                            "--tx": `${p.tx}px`,
                            "--ty": `${p.ty}px`,
                            "--d": `${600 + p.i * 40}ms`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
);
