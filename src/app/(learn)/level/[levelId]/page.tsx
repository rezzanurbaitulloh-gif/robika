import { notFound } from "next/navigation";
import { getLevel, getWorld } from "@/content";
import { LevelClient } from "./level-client";

export default async function LevelPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelId: string }>;
  searchParams: Promise<{ daily?: string }>;
}) {
  const { levelId } = await params;
  const { daily } = await searchParams;
  const level = getLevel(levelId);
  if (!level) notFound();

  const world = getWorld(level.world);
  const nextLevel =
    world?.levels
      .filter((l) => !l.isBoss)
      .sort((a, b) => a.order - b.order)
      .find((l) => l.order > level.order) ?? null;

  return <LevelClient level={level} isDaily={daily === "1"} nextLevelId={nextLevel?.id ?? null} />;
}