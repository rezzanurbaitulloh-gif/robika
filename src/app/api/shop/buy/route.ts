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

  let body: { item_id?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }
  const item = body.item_id ? getSkinItem(body.item_id) : undefined;
  if (!item) {
    return Response.json({ error: "unknown_item" }, { status: 400 });
  }

  const price = item.priceStars ?? item.priceGems ?? 0;
  const { data: owned } = await supabase
    .from("inventory")
    .select("item_id")
    .eq("profile_id", user.id)
    .eq("item_id", item.id)
    .maybeSingle<{ item_id: string }>();
  if (owned) {
    return Response.json({ error: "already_owned" }, { status: 409 });
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("stars, gems")
    .eq("profile_id", user.id)
    .maybeSingle<{ stars: number; gems: number }>();
  const balance =
    item.priceStars !== undefined ? (wallet?.stars ?? 0) : (wallet?.gems ?? 0);
  if (balance < price) {
    return Response.json(
      { error: "insufficient_balance", balance, price },
      { status: 402 },
    );
  }

  const update =
    item.priceStars !== undefined
      ? { stars: balance - price }
      : { gems: balance - price };
  const [{ error: updateError }, { error: insertError }] = await Promise.all([
    supabase
      .from("wallets")
      .update(update)
      .eq("profile_id", user.id),
    supabase.from("inventory").insert({
      profile_id: user.id,
      item_id: item.id,
    }),
  ]);
  if (updateError || insertError) {
    return Response.json({ error: "transaction_failed" }, { status: 500 });
  }

  return Response.json({
    ok: true,
    item_id: item.id,
    balance,
  });
}