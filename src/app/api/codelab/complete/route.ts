import { createServerSupabase } from "@/lib/db/server";
import { challenges } from "@/content/codelab";
import { applyLevelUp } from "@/lib/game/rewards";
import { codelabReward } from "@/lib/codelab/reward";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { challenge_id?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const challenge = challenges.find((c) => c.id === body.challenge_id);
  if (!challenge) {
    return Response.json({ error: "unknown_challenge" }, { status: 400 });
  }
  if (challenge.kind === "preview") {
    return Response.json({ error: "no_reward" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("codelab_progress")
    .select("challenge_id")
    .eq("profile_id", user.id)
    .eq("challenge_id", challenge.id)
    .maybeSingle<{ challenge_id: string }>();
  if (existing) {
    return Response.json({ error: "already_done" }, { status: 409 });
  }

  const reward = codelabReward();
  const { error: insertError } = await supabase.from("codelab_progress").insert({
    profile_id: user.id,
    challenge_id: challenge.id,
  });
  if (insertError) {
    return Response.json({ error: "progress_failed" }, { status: 500 });
  }

  const [{ data: wallet }, { data: profile }] = await Promise.all([
    supabase
      .from("wallets")
      .select("stars")
      .eq("profile_id", user.id)
      .maybeSingle<{ stars: number }>(),
    supabase
      .from("profiles")
      .select("xp, level")
      .eq("id", user.id)
      .maybeSingle<{ xp: number; level: number }>(),
  ]);

  let newLevel = profile?.level ?? 1;
  let leveledUp = false;
  if (profile) {
    const result = applyLevelUp(
      { xp: profile.xp, level: profile.level },
      reward.xp,
    );
    newLevel = result.newLevel;
    leveledUp = result.leveledUp;
    await supabase
      .from("profiles")
      .update({ xp: result.newXp, level: result.newLevel })
      .eq("id", user.id);
  }

  await supabase
    .from("wallets")
    .update({ stars: (wallet?.stars ?? 0) + reward.stars })
    .eq("profile_id", user.id);

  let earned: string[] = [];
  const check = await fetch(new URL("/api/achievements/check", request.url), {
    method: "POST",
  });
  if (check.ok) {
    const badgeData = (await check.json()) as { earned: string[] };
    earned = badgeData.earned;
  }

  return Response.json({
    ok: true,
    xp: reward.xp,
    stars: reward.stars,
    level: newLevel,
    leveled_up: leveledUp,
    earned,
  });
}