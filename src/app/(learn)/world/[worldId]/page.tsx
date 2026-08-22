import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorld, worlds } from "@/content";
import { isFlagEnabled, type FeatureFlags } from "@/lib/flags";
import { StatusChip } from "@/components/design/status-chip";
import { BentoCard } from "@/components/design/bento-card";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

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

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <div className="mb-8">
        <h1 className="font-display text-2xl tracking-wide sm:text-3xl text-foreground">
          {world.name.id.toUpperCase()}
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih node untuk mulai. Selesaikan semua level untuk membuka boss.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {world.levels.map((level) => (
          <Link key={level.id} href={`/level/${level.id}`}>
            <BentoCard
              title={level.title.id}
              description={level.concept}
              icon={
                level.isBoss ? (
                  <Icon name="skull" size={20} />
                ) : (
                  <Icon name="robot" size={20} />
                )
              }
              className="h-full transition hover:border-accent/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              footer={
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <span className="text-xs text-muted-foreground">
                    {level.goal.type === "collect"
                      ? `Kumpulkan ${level.goal.target}`
                      : "Raih tujuan"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {level.xpReward} XP
                    </span>
                    {level.isBoss ? (
                      <StatusChip status="info" label="BOSS" />
                    ) : null}
                  </span>
                </div>
              }
            />
          </Link>
        ))}
      </div>

      {showNextDistrict && nextWorld && (
        <Link
          href={`/world/${nextWorld.world}`}
          className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-amber-400/40 bg-amber-400/5 px-5 py-4 transition hover:border-amber-300/70"
        >
          <div>
            <p className="font-display text-sm tracking-widest text-amber-300">
              DISTRIK BERIKUTNYA
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