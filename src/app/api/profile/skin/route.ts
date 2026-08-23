import { createServerSupabase } from "@/lib/db/server";
import { getSkinItem } from "@/lib/shop/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { itemId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }
  const item = body.itemId ? getSkinItem(body.itemId) : undefined;
  if (!item) {
    return Response.json({ error: "unknown_item" }, { status: 400 });
  }

  const { data: owned } = await supabase
    .from("inventory")
    .select("item_id")
    .eq("profile_id", user.id)
    .eq("item_id", item.id)
    .maybeSingle<{ item_id: string }>();
  if (!owned) {
    return Response.json({ error: "not_owned" }, { status: 403 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ skin_id: item.id })
    .eq("id", user.id);
  if (error) {
    return Response.json({ error: "equip_failed" }, { status: 500 });
  }

  return Response.json({ ok: true, skinId: item.id });
}
