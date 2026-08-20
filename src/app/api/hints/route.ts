import { createServerSupabase } from "@/lib/db/server";
import { HINT_CAP, refreshHintBalance } from "@/lib/core/hints";

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

  const { data: row } = await supabase
    .from("hints")
    .select("count, next_refresh_at")
    .eq("profile_id", user.id)
    .maybeSingle<{ count: number; next_refresh_at: string }>();

  if (!row) {
    return Response.json({ count: HINT_CAP, next_refresh_at: null });
  }

  const now = new Date();
  const refreshed = refreshHintBalance(
    row.count,
    row.next_refresh_at ? new Date(row.next_refresh_at) : null,
    now,
  );

  if (refreshed.balance !== row.count) {
    await supabase
      .from("hints")
      .update({
        count: refreshed.balance,
        next_refresh_at: refreshed.lastRefreshedAt.toISOString(),
      })
      .eq("profile_id", user.id);
  }

  return Response.json({
    count: refreshed.balance,
    next_refresh_at: refreshed.lastRefreshedAt.toISOString(),
  });
}