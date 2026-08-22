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
import { runLevel, type AnySimResult } from "@/lib/game/engine";

import type { SimDir, SimEvent } from "@/lib/game/interpreter";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

export interface AdventureBoardHandle {
  run: () => void;
  reset: () => void;
}

interface AdventureBoardProps {
  level: GameLevel;
  code: string;
  speedMs?: number;
  onResult?: (result: AnySimResult) => void;
  onRunStart?: () => void;
  disabled?: boolean;
}

interface ReplayState {
  pos: { x: number; y: number };
  dir: SimDir;
  crashed: boolean;
  won: boolean;
  coins: number;
  openGates: Set<string>;
  npcsTalked: Set<string>;
}

const TILE_STYLE: Record<string, string> = {
  "#": "bg-slate-800 border border-slate-700/60",
  ".": "bg-input/40",
  C: "bg-emerald-400/15 border border-emerald-400/40",
  S: "bg-rose-500/20 border border-rose-500/50",
  G: "bg-emerald-400/40 border border-emerald-300 glow-box",
  D: "bg-amber-400/15 border border-amber-400/60",
  N: "bg-violet-400/15 border border-violet-400/50",
};

function findStart(grid: string[]): { x: number; y: number } {
  const width = grid[0].length;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "P") return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

function initialState(level: GameLevel): ReplayState {
  return {
    pos: findStart(level.grid),
    dir: "E",
    crashed: false,
    won: false,
    coins: 0,
    openGates: new Set<string>(),
    npcsTalked: new Set<string>(),
  };
}

function foldEvents(base: ReplayState, events: SimEvent[], grid: string[]): ReplayState {
  let state: ReplayState = base;
  for (const ev of events) {
    if (ev.kind === "move") {
      if (ev.crashed) {
        state = { ...state, crashed: true };
      } else {
        const visitedCoin =
          grid[ev.to.y]?.[ev.to.x] === "C" && !state.openGates.has(`c:${ev.to.x},${ev.to.y}`);
        const coins = visitedCoin ? state.coins + 1 : state.coins;
        const seen = new Set(state.openGates);
        if (visitedCoin) seen.add(`c:${ev.to.x},${ev.to.y}`);
        state = {
          ...state,
          pos: ev.to,
          coins,
          openGates: seen,
          won: Boolean(ev.won),
        };
      }
    } else if (ev.kind === "turn") {
      state = { ...state, dir: ev.dir };
    } else if (ev.kind === "openGate") {
      const seen = new Set(state.openGates);
      grid.forEach((row, gy) =>
        row.split("").forEach((ch, gx) => {
          if (ch === "D") seen.add(`${gx},${gy}`);
        }),
      );
      state = { ...state, openGates: seen };
    } else if (ev.kind === "npcTalk") {
      const talked = new Set(state.npcsTalked);
      talked.add(`${ev.x},${ev.y}`);
      state = { ...state, npcsTalked: talked };
    }
  }
  return state;
}

export const AdventureBoard = forwardRef<AdventureBoardHandle, AdventureBoardProps>(
  function AdventureBoard(
    {
      level,
      code,
      speedMs = 350,
      onResult,
      onRunStart,
      disabled = false,
    },
    ref,
  ) {
    const width = level.grid[0].length;
    const [events, setEvents] = useState<SimEvent[]>([]);
    const [frame, setFrame] = useState(0);
    const [running, setRunning] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, []);

    const stop = useCallback(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setRunning(false);
    }, []);

    const run = useCallback(() => {
      if (disabled || running) return;
      stop();
      onRunStart?.();
      setLastError(null);
      const result = runLevel(level, code);
      const list = result.events ?? [];
      setEvents(list);
      setFrame(0);
      if (result.status !== "ok" || list.length === 0) {
        if (result.status === "error") setLastError(result.error ?? "Terjadi kesalahan");
        setFrame(list.length);
        onResult?.(result);
        return;
      }
      setRunning(true);
      let i = 0;
      timerRef.current = setInterval(() => {
        i += 1;
        setFrame(i);
        if (i >= list.length) {
          stop();
          onResult?.(result);
        }
      }, speedMs);
    }, [code, disabled, level, onResult, onRunStart, running, speedMs, stop]);

    const reset = useCallback(() => {
      stop();
      setEvents([]);
      setFrame(0);
      setLastError(null);
    }, [stop]);

    useImperativeHandle(ref, () => ({ run, reset }), [run, reset]);

    const current = useMemo(
      () => foldEvents(initialState(level), events.slice(0, frame), level.grid),
      [events, frame, level],
    );
    const gatesOpenNow = useMemo(
      () =>
        [...current.openGates].filter((k) => !k.startsWith("c:")).length,
      [current.openGates],
    );

    const robotFace = { N: "▲", E: "►", S: "▼", W: "◄" }[current.dir];
    const npcsTotal = useMemo(
      () =>
        level.grid.reduce((n, row) => n + (row.match(/N/g)?.length ?? 0), 0),
      [level.grid],
    );
    const activeNpc = useMemo(() => {
      const talked = [...current.npcsTalked];
      const last = talked[talked.length - 1];
      if (!last) return null;
      const [nx, ny] = last.split(",").map(Number);
      return level.npcs?.find((npc) => npc.x === nx && npc.y === ny) ?? null;
    }, [current.npcsTalked, level.npcs]);

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
                  : `LANGKAH ${frame}/${events.length}`
            }
          />
          <StatusChip status="info" label={`${current.coins}`} />
          {npcsTotal > 0 && (
            <StatusChip
              status={current.npcsTalked.size >= npcsTotal ? "success" : "info"}
              label={`NPC ${current.npcsTalked.size}/${npcsTotal}`}
            />
          )}
          {gatesOpenNow > 0 && (
            <StatusChip status="warning" label={`${gatesOpenNow} GERBANG TERBUKA`} />
          )}
        </div>

        {lastError && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <span className="font-semibold">Kesalahan kode:</span> {lastError}
          </div>
        )}

        {activeNpc && (
          <div className="flex items-start gap-3 rounded-lg border border-violet-400/40 bg-violet-400/10 px-4 py-3">
            <span className="mt-0.5 shrink-0 text-violet-300">
              <Icon name="chat" size={16} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-300">
                {activeNpc.name}
              </p>
              {activeNpc.lines.map((line, i) => (
                <p key={i} className="mt-1 text-sm text-foreground/90">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        <div
          className="grid w-full gap-[2px] rounded-lg border border-border bg-card/60 p-2"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            maxWidth: `min(${width * 34}px, 100%)`,
          }}
        >
          {level.grid.map((row, y) =>
            row.split("").map((tile, x) => {
              const gateKey = `${x},${y}`;
              const isOpenGate = tile === "D" && current.openGates.has(gateKey);
              const effectiveTile = isOpenGate ? "." : tile;
              const isPlayer =
                current.pos.x === x && current.pos.y === y && !current.won;
              return (
                <div
                  key={gateKey}
                  className={`relative flex aspect-square items-center justify-center text-sm sm:text-base ${
                    TILE_STYLE[effectiveTile] ?? ""
                  }`}
                >
                  {effectiveTile === "D" && (
                    <span className="text-amber-300">
                      <Icon name="lock" size={13} />
                    </span>
                  )}
                  {effectiveTile === "C" && (
                    <span className="text-emerald-300">
                      <Icon name="bolt" size={14} />
                    </span>
                  )}
                  {effectiveTile === "N" && (
                    <span
                      className={
                        current.npcsTalked.has(gateKey)
                          ? "text-violet-400/50"
                          : "text-violet-300 drop-shadow-[0_0_5px_rgba(167,139,250,0.7)]"
                      }
                    >
                      <Icon name="user" size={14} />
                    </span>
                  )}
                  {isPlayer && (
                    <span className="absolute inset-0 flex items-center justify-center text-base text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]">
                      {robotFace}
                    </span>
                  )}
                  {current.won && current.pos.x === x && current.pos.y === y && (
                    <span className="absolute inset-0 flex items-center justify-center text-emerald-300">
                      <Icon name="star" size={16} />
                    </span>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    );
  },
);
