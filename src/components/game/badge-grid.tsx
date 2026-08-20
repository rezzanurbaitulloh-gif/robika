import { BADGES, RARITY_ORDER, type BadgeRarity } from "@/lib/game/badges";
import { Icon, type IconName } from "@/components/design/icon";

const RARITY_STYLE: Record<BadgeRarity, string> = {
  common: "border-slate-500/40 bg-slate-500/10",
  rare: "border-sky-400/50 bg-sky-400/10",
  epic: "border-purple-400/50 bg-purple-400/10",
  legendary: "border-amber-400/60 bg-amber-400/15",
  mythic: "border-emerald-400/60 bg-emerald-400/15",
};

const RARITY_TEXT: Record<BadgeRarity, string> = {
  common: "text-slate-400",
  rare: "text-sky-300",
  epic: "text-purple-300",
  legendary: "text-amber-300",
  mythic: "text-emerald-300",
};

export function BadgeGrid({ owned }: { owned: string[] }) {
  const ownedSet = new Set(owned);
  const sorted = [...BADGES].sort(
    (a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity],
  );

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="medal" size={16} />
            BADGE COLLECTION
          </span>
        </h3>
        <span className="text-xs text-muted-foreground">
          {ownedSet.size} / {BADGES.length} terkumpul
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sorted.map((badge) => {
          const has = ownedSet.has(badge.id);
          return (
            <div
              key={badge.id}
              title={`${badge.name} — ${badge.description}`}
              className={`rounded-lg border p-3 text-center transition ${
                has ? RARITY_STYLE[badge.rarity] : "border-border bg-muted/30 opacity-50"
              }`}
            >
              <div className="flex h-9 items-center justify-center">
                {has ? (
                  <Icon name={badge.icon as IconName} size={28} />
                ) : (
                  <Icon name="lock" size={28} className="opacity-60" />
                )}
              </div>
              <p
                className={`mt-1 truncate text-[11px] font-semibold ${
                  has ? RARITY_TEXT[badge.rarity] : "text-muted-foreground"
                }`}
              >
                {badge.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}