import { createServerSupabase } from "@/lib/db/server";
import { getLevel, getWorld } from "@/content";
import { applyLevelUp, computeCompletionRewards } from "@/lib/game/rewards";
import { errorRecoveryBonus } from "@/lib/game/stars";
import { updateStreak } from "@/lib/game/streak";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CompleteBody {
  level_id?: string;
  stars?: number;
  hints_used?: number;
  elapsed_ms?: number;
  error_recovered?: boolean;
}

export async function POST(request: Request) {
  let body: CompleteBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const levelId = body.level_id ?? "";
  const stars = body.stars ?? 0;
  if (stars < 1 || stars > 3) {
    return Response.json({ error: "invalid_stars" }, { status: 400 });
  }

  const level = getLevel(levelId);
  if (!level) {
    return Response.json({ error: "unknown_level" }, { status: 400 });
  }
  const world = getWorld(level.world);
  if (!world) {
    return Response.json({ error: "unknown_world" }, { status: 400 });
  }
  const levelIndex = world.levels.findIndex((l) => l.id === level.id);

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("progress")
    .select("stars, best_score")
    .eq("profile_id", user.id)
    .eq("level_id", levelId)
    .maybeSingle<{ stars: number; best_score: number }>();

  const rewards = computeCompletionRewards({
    levelIndex,
    stars,
    existingStars: existing?.stars ?? 0,
    isFirstCompletion: !existing,
    elapsedMs: body.elapsed_ms ?? 0,
    parMs: level.parMs ?? 300_000,
    baseXp: level.xpReward,
    errorRecoveryXp: errorRecoveryBonus(
      body.error_recovered === true,
      body.hints_used ?? 0,
    ),
  });

  if (!existing) {
    const { error } = await supabase.from("progress").insert({
      profile_id: user.id,
      level_id: levelId,
      stars,
      best_score: Math.max(0, body.hints_used ?? 0),
    });
    if (error) {
      return Response.json({ error: "progress_failed" }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("progress")
      .update({
        stars: Math.max(existing.stars, stars),
        best_score: Math.min(
          existing.best_score > 0 ? existing.best_score : Number.MAX_SAFE_INTEGER,
          body.hints_used ?? 0,
        ),
        completed_at: new Date().toISOString(),
      })
      .eq("profile_id", user.id)
      .eq("level_id", levelId);
    if (error) {
      return Response.json({ error: "progress_failed" }, { status: 500 });
    }
  }

  if (rewards.starsToCredit > 0) {
    const { data: wallet } = await supabase
      .from("wallets")
      .select("stars")
      .eq("profile_id", user.id)
      .maybeSingle<{ stars: number }>();
    await supabase
      .from("wallets")
      .update({ stars: (wallet?.stars ?? 0) + rewards.starsToCredit })
      .eq("profile_id", user.id);
  }

  let newLevel = 1;
  let leveledUp = false;
  if (rewards.xp > 0) {
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
    if (profile) {
      const result = applyLevelUp({ xp: profile.xp, level: profile.level }, rewards.xp);
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
  }

  return Response.json({
    ok: true,
    stars_to_credit: rewards.starsToCredit,
    xp: rewards.xp,
    par_bonus: rewards.parBonus,
    error_bonus: rewards.errorBonus,
    level: newLevel,
    leveled_up: leveledUp,
  });
}