import { createServerSupabase } from "@/lib/db/server";
import { INSTANT_RETRY_GEM_COST } from "@/lib/core/boss";

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

  const { data: wallet } = await supabase
    .from("wallets")
    .select("gems")
    .eq("profile_id", user.id)
    .maybeSingle<{ gems: number }>();
  const gems = wallet?.gems ?? 0;
  if (gems < INSTANT_RETRY_GEM_COST) {
    return Response.json({ error: "not_enough_gems" }, { status: 402 });
  }

  const { error } = await supabase
    .from("wallets")
    .update({ gems: gems - INSTANT_RETRY_GEM_COST })
    .eq("profile_id", user.id);
  if (error) {
    return Response.json({ error: "wallet_failed" }, { status: 500 });
  }

  const { error: attemptError } = await supabase
    .from("boss_attempts")
    .upsert(
      {
        profile_id: user.id,
        attempted_at: new Date(0).toISOString(),
      },
      { onConflict: "profile_id" },
    );
  if (attemptError) {
    return Response.json({ error: "attempt_failed" }, { status: 500 });
  }

  return Response.json({ ok: true, gems: gems - INSTANT_RETRY_GEM_COST });
}