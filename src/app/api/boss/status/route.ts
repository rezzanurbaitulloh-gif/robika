import { createServerSupabase } from "@/lib/db/server";
import {
  BOSS_COOLDOWN_MS,
  INSTANT_RETRY_GEM_COST,
  bossCooldownRemaining,
  canAttemptBoss,
} from "@/lib/core/boss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const [{ data: attempt }, { data: wallet }] = await Promise.all([
    supabase
      .from("boss_attempts")
      .select("attempted_at")
      .eq("profile_id", user.id)
      .maybeSingle<{ attempted_at: string }>(),
    supabase
      .from("wallets")
      .select("gems")
      .eq("profile_id", user.id)
      .maybeSingle<{ gems: number }>(),
  ]);

  const lastAttempt = attempt?.attempted_at ? new Date(attempt.attempted_at) : null;
  const now = new Date();
  const cooldownMs = bossCooldownRemaining(lastAttempt, now, BOSS_COOLDOWN_MS);

  return Response.json({
    can_attempt: canAttemptBoss(lastAttempt, now, BOSS_COOLDOWN_MS),
    cooldown_ms: cooldownMs,
    cooldown_until: new Date(now.getTime() + cooldownMs).toISOString(),
    gems: wallet?.gems ?? 0,
    instant_retry_cost: INSTANT_RETRY_GEM_COST,
  });
}