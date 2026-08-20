import { createServerSupabase } from "@/lib/db/server";
import { consumeHint } from "@/lib/core/hints";

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

  const { data: row } = await supabase
    .from("hints")
    .select("count")
    .eq("profile_id", user.id)
    .maybeSingle<{ count: number }>();

  const balance = row?.count ?? 0;
  const consumed = consumeHint(balance, 1);
  if (!consumed.ok) {
    return Response.json({ error: "no_hints", count: balance }, { status: 409 });
  }

  await supabase
    .from("hints")
    .update({ count: consumed.balance })
    .eq("profile_id", user.id);

  return Response.json({ ok: true, count: consumed.balance });
}