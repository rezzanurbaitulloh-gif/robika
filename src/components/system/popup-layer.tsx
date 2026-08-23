"use client";

import { create } from "zustand";
import { Icon } from "@/components/design/icon";

export type PopupType =
  | "quest-started"
  | "quest-updated"
  | "quest-complete"
  | "unlock"
  | "level-up";

export interface GamePopup {
  id: number;
  type: PopupType;
  title: string;
  body?: string;
  rewards?: { label: string; amount: string }[];
}

interface PopupState {
  queue: GamePopup[];
  push: (popup: Omit<GamePopup, "id">) => void;
  dismiss: () => void;
}

let nextId = 1;

export const usePopups = create<PopupState>((set) => ({
  queue: [],
  push: (popup) =>
    set((s) => ({ queue: [...s.queue, { ...popup, id: nextId++ }] })),
  dismiss: () => set((s) => ({ queue: s.queue.slice(1) })),
}));

const STYLE: Record<
  PopupType,
  { label: string; border: string; icon: "target" | "bolt" | "star" | "lock" | "trophy"; tone: string }
> = {
  "quest-started": { label: "QUEST DIMULAI", border: "border-cyan-400/60", icon: "target", tone: "text-cyan-300" },
  "quest-updated": { label: "OBJEKTIF BARU", border: "border-amber-400/60", icon: "bolt", tone: "text-amber-300" },
  "quest-complete": { label: "✦ QUEST SELESAI ✦", border: "border-emerald-400/70", icon: "star", tone: "text-emerald-300" },
  unlock: { label: "AREA BARU TERBUKA", border: "border-fuchsia-400/60", icon: "lock", tone: "text-fuchsia-300" },
  "level-up": { label: "LEVEL NAIK", border: "border-cyan-300/80", icon: "trophy", tone: "text-cyan-200" },
};

export function PopupLayer() {
  const current = usePopups((s) => s.queue[0]);
  const dismiss = usePopups((s) => s.dismiss);
  if (!current) return null;
  const style = STYLE[current.type];
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto absolute inset-x-0 top-6 z-50 mx-auto w-[min(92%,340px)]"
      onClick={dismiss}
      onKeyDown={(e) => e.key === "Enter" && dismiss()}
      tabIndex={0}
    >
      <div
        className={`animate-pop cursor-pointer rounded-md border bg-[#141a2e]/95 px-4 py-3 text-center shadow-[0_0_24px_rgba(0,0,0,0.5)] ${style.border}`}
      >
        <p className={`font-display text-xs uppercase tracking-widest ${style.tone}`}>
          {style.label}
        </p>
        <p className="mt-1 font-display text-base text-foreground">{current.title}</p>
        {current.body && <p className="mt-1 text-sm text-foreground/70">{current.body}</p>}
        {current.rewards && (
          <div className="mt-2 flex justify-center gap-3">
            {current.rewards.map((r) => (
              <span key={r.label} className="rounded-sm border border-border bg-input/30 px-2 py-0.5 font-display text-xs text-amber-300">
                {r.label} +{r.amount}
              </span>
            ))}
          </div>
        )}
        <span className={`mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-foreground/40`}>
          <Icon name="info" size={10} /> ketuk untuk lanjut
        </span>
      </div>
    </div>
  );
}
