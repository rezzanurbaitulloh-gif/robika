import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorld } from "@/content";
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

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground">
          {world.name.id.toUpperCase()}
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih node untuk mulai. Selesaikan semua level untuk membuka boss.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="flex items-center justify-between">
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
    </main>
  );
}