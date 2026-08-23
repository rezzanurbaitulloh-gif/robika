import { notFound } from "next/navigation";
import { getLevel, getWorld } from "@/content";
import { isFlagEnabled, type FeatureFlags } from "@/lib/flags";
import { getSkinItem } from "@/lib/shop/catalog";
import { createServerSupabase } from "@/lib/db/server";
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
  if (world?.flag && !isFlagEnabled(world.flag as keyof FeatureFlags)) notFound();
  const nextLevel =
    world?.levels
      .filter((l) => !l.isBoss)
      .sort((a, b) => a.order - b.order)
      .find((l) => l.order > level.order) ?? null;

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let skinColors = null as ReturnType<typeof getSkinItem> | null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("skin_id")
      .eq("id", user.id)
      .maybeSingle<{ skin_id: string | null }>();
    if (profile?.skin_id) skinColors = getSkinItem(profile.skin_id) ?? null;
  }

  return (
    <LevelClient
      level={level}
      isDaily={daily === "1"}
      nextLevelId={nextLevel?.id ?? null}
      skin={skinColors ? { colors: skinColors.colors, name: skinColors.name } : null}
    />
  );
}