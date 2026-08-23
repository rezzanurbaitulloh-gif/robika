import Link from "next/link";
import { Icon } from "@/components/design/icon";

export interface HudBarProps {
  level: number;
  xp: number;
  gems: number;
  streak: number;
  questLabel?: string | null;
  questHref?: string;
}

export function HudBar({ level, xp, gems, streak, questLabel, questHref }: HudBarProps) {
  const xpInLevel = xp % 100;
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-[#141a2e]/90 px-3 py-2 font-display text-xs uppercase tracking-wider text-foreground/90">
      <span className="flex items-center gap-1.5">
        <span className="grid h-6 w-6 place-items-center rounded-sm border border-cyan-400/50 bg-cyan-400/10 text-cyan-300">
          {level}
        </span>
        <span className="hidden sm:inline text-foreground/60">lv</span>
      </span>
      <span className="relative h-2 w-16 overflow-hidden rounded-full border border-border bg-input/40 sm:w-24" title={`XP ${xpInLevel}/100`}>
        <span
          className="absolute inset-y-0 left-0 bg-cyan-400/80"
          style={{ width: `${Math.min(100, xpInLevel)}%` }}
        />
      </span>
      <span className="flex items-center gap-1 text-fuchsia-300">
        <Icon name="gem" size={13} />
        {gems}
      </span>
      <span className="flex items-center gap-1 text-amber-300">
        <Icon name="flame" size={13} />
        {streak}
      </span>
      {questLabel && (
        <Link
          href={questHref ?? "#"}
          className="ml-auto flex min-w-0 items-center gap-1.5 rounded-sm border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 truncate text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-400/20"
        >
          <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          <span className="truncate normal-case tracking-normal">{questLabel}</span>
        </Link>
      )}
    </div>
  );
}
