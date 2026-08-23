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

  const { data, error } = await supabase.rpc("buy_skin", {
    p_item_id: item.id,
  });
  if (error) {
    return Response.json({ error: "transaction_failed" }, { status: 500 });
  }
  const result = data as { error?: string; balance?: number; price?: number };

  switch (result.error) {
    case "unauthorized":
      return Response.json({ error: result.error }, { status: 401 });
    case "unknown_item":
      return Response.json({ error: result.error }, { status: 400 });
    case "already_owned":
      return Response.json({ error: result.error }, { status: 409 });
    case "insufficient_balance":
      return Response.json(
        { error: result.error, balance: result.balance, price: result.price },
        { status: 402 },
      );
    default:
      return Response.json({
        ok: true,
        item_id: item.id,
        balance: result.balance,
      });
  }
}
