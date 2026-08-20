import { levelProgress } from "@/lib/core/xp";
import { Icon } from "@/components/design/icon";

export function LevelProgressCard({ xp }: { xp: number }) {
  const p = levelProgress(xp);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-sm tracking-wide">
          <Icon name="star" size={15} />
          PROGRES LEVEL
        </h3>
        <span className="text-xs text-muted-foreground">
          Level {p.level} · XP {p.intoLevel}/{p.needed}
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={p.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progres ke level ${p.level + 1}`}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${p.percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {p.percent >= 100 ? (
          <>Siap naik ke level {p.level + 1}!</>
        ) : (
          <>
            Butuh{" "}
            <span className="font-semibold text-foreground">
              {p.remaining} XP lagi
            </span>{" "}
            untuk naik ke level {p.level + 1}.
          </>
        )}
      </p>
    </div>
  );
}