import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorld, worlds } from "@/content";
import { isFlagEnabled, type FeatureFlags } from "@/lib/flags";
import { createServerSupabase } from "@/lib/db/server";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

type NodeState = "done" | "current" | "ready" | "boss-ready" | "boss-done";

const NODE_BADGE: Record<NodeState, string> = {
  done: "border-emerald-400/60 bg-emerald-400/15 text-emerald-300",
  current: "border-cyan-300 bg-cyan-400/20 text-cyan-200 animate-pulse",
  ready: "border-border bg-input/30 text-foreground/50",
  "boss-ready": "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-300/70",
  "boss-done": "border-emerald-400/60 bg-emerald-400/15 text-emerald-300",
};

const STATE_LABEL: Record<NodeState, string> = {
  done: "SELESAI",
  current: "MISI AKTIF",
  ready: "SIAP",
  "boss-ready": "BOSS TERKUNCI",
  "boss-done": "BOSS DIKALAHKAN",
};

export default async function WorldPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const world = getWorld(worldId);
  if (!world) notFound();
  if (world.flag && !isFlagEnabled(world.flag as keyof FeatureFlags)) notFound();

  const worldIndex = worlds.findIndex((w) => w.world === worldId);
  const nextWorld = worldIndex >= 0 ? worlds[worldIndex + 1] : undefined;
  const showNextDistrict = Boolean(nextWorld) && isFlagEnabled("newAdventure");

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let doneIds = new Set<string>();
  if (user) {
    const { data: rows } = await supabase
      .from("progress")
      .select("level_id")
      .eq("profile_id", user.id);
    doneIds = new Set(
      (rows ?? []).map((r: { level_id: string }) => r.level_id),
    );
  }

  const normalLevels = world.levels.filter((l) => !l.isBoss);
  const normalsDone = normalLevels.every((l) => doneIds.has(l.id));
  const firstUndone = world.levels.find((l) => !doneIds.has(l.id));

  const nodes = world.levels.map((level) => {
    let state: NodeState;
    if (level.isBoss) {
      state = doneIds.has(level.id)
        ? "boss-done"
        : normalsDone
          ? "current"
          : "boss-ready";
    } else if (doneIds.has(level.id)) {
      state = "done";
    } else if (level.id === firstUndone?.id) {
      state = "current";
    } else {
      state = "ready";
    }
    return { level, state };
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>

      <div className="base-floor scanline relative mb-6 overflow-hidden rounded-md border border-border p-5">
        <div className="absolute right-3 top-3 flex gap-1.5">
          <span className="blink h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/40" />
        </div>
        <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300/70">
          ▸ PETA DISTRIK · {world.levels.length} NODE
        </p>
        <h1 className="mt-1 font-display text-2xl tracking-wide text-foreground sm:text-3xl">
          {world.name.id.toUpperCase()}
        </h1>
        <p className="mt-1 max-w-lg text-sm text-muted-foreground">
          Selesaikan node berurutan untuk membuka gerbang boss.
        </p>
      </div>

      <ol className="relative ml-5 space-y-1 border-l border-border pl-6">
        {nodes.map(({ level, state }, i) => {
          return (
            <li key={level.id}>
              <Link
                href={`/level/${level.id}`}
                className="group flex items-center gap-4 rounded-md border border-transparent px-3 py-3 transition hover:border-cyan-400/30 hover:bg-cyan-400/5"
              >
                <span
                  className={`absolute -left-[41px] grid h-8 w-8 place-items-center rounded-full border font-display text-xs ${NODE_BADGE[state]}`}
                >
                  {level.isBoss ? <Icon name="skull" size={14} /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-display text-sm uppercase tracking-wider text-foreground group-hover:text-cyan-200">
                      {level.title.id}
                    </p>
                    <span
                      className={`font-display text-[9px] tracking-widest ${
                        state === "done" || state === "boss-done"
                          ? "text-emerald-400/80"
                          : state === "current"
                            ? "text-cyan-300"
                            : "text-muted-foreground/70"
                      }`}
                    >
                      [{STATE_LABEL[state]}]
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {level.concept}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-xs text-amber-300">
                    +{level.xpReward} XP
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {level.goal.type === "collect"
                      ? `Kumpulkan ${level.goal.target}`
                      : "Raih tujuan"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {showNextDistrict && nextWorld && (
        <Link
          href={`/world/${nextWorld.world}`}
          className="mt-8 flex items-center justify-between gap-4 rounded-md border border-amber-400/40 bg-amber-400/5 px-5 py-4 transition hover:border-amber-300/70"
        >
          <div>
            <p className="font-display text-sm tracking-widest text-amber-300">
              ▸ DISTRIK BERIKUTNYA
            </p>
            <p className="text-base font-semibold text-foreground">
              {nextWorld.name.id}
            </p>
            <p className="text-xs text-muted-foreground">
              {nextWorld.levels.length} node baru · gerbang daya & API dunia
            </p>
          </div>
          <span className="text-amber-300">
            <Icon name="lock" size={22} />
          </span>
        </Link>
      )}
    </main>
  );
}
