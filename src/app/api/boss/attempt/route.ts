import { createServerSupabase } from "@/lib/db/server";
import { BOSS_COOLDOWN_MS, canAttemptBoss } from "@/lib/core/boss";

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

  const { data: attempt } = await supabase
    .from("boss_attempts")
    .select("attempted_at")
    .eq("profile_id", user.id)
    .maybeSingle<{ attempted_at: string }>();

  const lastAttempt = attempt?.attempted_at ? new Date(attempt.attempted_at) : null;
  if (!canAttemptBoss(lastAttempt, new Date(), BOSS_COOLDOWN_MS)) {
    return Response.json({ error: "cooldown_active" }, { status: 429 });
  }

  const { error } = await supabase.from("boss_attempts").upsert(
    { profile_id: user.id, attempted_at: new Date().toISOString() },
    { onConflict: "profile_id" },
  );
  if (error) {
    return Response.json({ error: "attempt_failed" }, { status: 500 });
  }

  return Response.json({ ok: true, attempted_at: new Date().toISOString() });
}