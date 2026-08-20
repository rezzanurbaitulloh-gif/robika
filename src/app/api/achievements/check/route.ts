import { createServerSupabase } from "@/lib/db/server";
import { evaluateBadges, BADGES } from "@/lib/game/badges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const [{ data: progress }, { data: profile }, { data: wallet }, { data: owned }, { data: codelabDone }] =
    await Promise.all([
      supabase
        .from("progress")
        .select("level_id")
        .eq("profile_id", user.id),
      supabase
        .from("profiles")
        .select("xp, level, streak")
        .eq("id", user.id)
        .maybeSingle<{ xp: number; level: number; streak: number | null }>(),
      supabase
        .from("wallets")
        .select("gems")
        .eq("profile_id", user.id)
        .maybeSingle<{ gems: number }>(),
      supabase.from("achievements").select("badge_id").eq("profile_id", user.id),
      supabase
        .from("codelab_progress")
        .select("challenge_id")
        .eq("profile_id", user.id)
        .limit(1),
    ]);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, trial_ends_at, paid_until")
    .eq("profile_id", user.id)
    .maybeSingle<{ plan: string | null; trial_ends_at: string | null; paid_until: string | null }>();

  const completedLevels = (progress ?? []).map((p) => p.level_id);
  const world1Regular = [
    "world-1-level-1",
    "world-1-level-2",
    "world-1-level-3",
    "world-1-level-4",
    "world-1-level-5",
    "world-1-level-6",
  ];
  const world1Complete = world1Regular.every((id) => completedLevels.includes(id));
  const now = new Date();
  const trialActive =
    !!subscription?.plan &&
    (!!subscription.trial_ends_at && new Date(subscription.trial_ends_at) > now ||
      !!subscription.paid_until && new Date(subscription.paid_until) > now);

  const earned = evaluateBadges(
    {
      completedLevels,
      world1Complete,
      bossDone: completedLevels.includes("world-1-boss"),
      streak: profile?.streak ?? 0,
      level: profile?.level ?? 1,
      xp: profile?.xp ?? 0,
      codelabDone: (codelabDone ?? []).length > 0,
      trialActive,
      gems: wallet?.gems ?? 0,
    },
    (owned ?? []).map((a) => a.badge_id),
  );

  if (earned.length > 0) {
    await supabase.from("achievements").insert(
      earned.map((badge) => ({
        profile_id: user.id,
        badge_id: badge.id,
      })),
    );
  }

  return Response.json({
    earned: earned.map((b) => b.id),
    catalog: BADGES,
  });
}