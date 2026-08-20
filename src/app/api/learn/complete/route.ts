import { createServerSupabase } from "@/lib/db/server";
import { getCurriculumModule } from "@/content/curriculum/curriculum";
import { applyLevelUp } from "@/lib/game/rewards";
import { updateStreak } from "@/lib/game/streak";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const LEARN_REWARDS: Record<
  "module" | "quiz",
  { xp: number; stars: number }
> = {
  module: { xp: 50, stars: 2 },
  quiz: { xp: 75, stars: 3 },
};

interface CompleteBody {
  item_type?: string;
  item_id?: string;
}

export async function POST(request: Request) {
  let body: CompleteBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const itemType = body.item_type;
  if (itemType !== "module" && itemType !== "quiz") {
    return Response.json({ error: "invalid_item_type" }, { status: 400 });
  }

  const itemId = (body.item_id ?? "").trim();
  const itemRef = resolveItem(itemType, itemId);
  if (!itemRef) {
    return Response.json({ error: "unknown_item" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("learn_progress")
    .select("completed_at")
    .eq("profile_id", user.id)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existing) {
    return Response.json({
      ok: true,
      already_done: true,
      xp: 0,
      stars: 0,
      level: null,
      leveled_up: false,
      item: itemRef,
    });
  }

  const reward = LEARN_REWARDS[itemType];

  const { error: progressError } = await supabase
    .from("learn_progress")
    .insert({
      profile_id: user.id,
      item_type: itemType,
      item_id: itemId,
    });
  if (progressError) {
    return Response.json({ error: "progress_failed" }, { status: 500 });
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("stars")
    .eq("profile_id", user.id)
    .maybeSingle<{ stars: number }>();
  await supabase
    .from("wallets")
    .update({ stars: (wallet?.stars ?? 0) + reward.stars })
    .eq("profile_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak, last_active_at")
    .eq("id", user.id)
    .maybeSingle<{
      xp: number;
      level: number;
      streak: number | null;
      last_active_at: string | null;
    }>();

  let newLevel = null as number | null;
  let leveledUp = false;
  if (profile) {
    const result = applyLevelUp({ xp: profile.xp, level: profile.level }, reward.xp);
    newLevel = result.newLevel;
    leveledUp = result.leveledUp;
    const streakResult = updateStreak(
      profile.last_active_at ? new Date(profile.last_active_at) : null,
      profile.streak ?? 0,
      new Date(),
    );
    await supabase
      .from("profiles")
      .update({
        xp: result.newXp,
        level: result.newLevel,
        streak: streakResult.streak,
        last_active_at: streakResult.lastActiveAt.toISOString(),
      })
      .eq("id", user.id);
  }

  return Response.json({
    ok: true,
    already_done: false,
    xp: reward.xp,
    stars: reward.stars,
    level: newLevel,
    leveled_up: leveledUp,
    item: itemRef,
  });
}

function resolveItem(
  itemType: "module" | "quiz",
  itemId: string,
): { languageId: string; moduleId: string } | null {
  const match = /^([^/]+)\/([^/]+)$/.exec(itemId);
  if (!match) return null;
  const [, languageId, moduleId] = match;
  const found = getCurriculumModule(languageId, moduleId);
  if (!found) return null;
  return { languageId, moduleId };
}