import { createAdminSupabase } from "@/lib/db/admin";
import { mapMidtransStatus, verifyNotificationSignature } from "@/lib/payments/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MidtransNotification {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  if (!serverKey) {
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  let payload: MidtransNotification;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const valid = verifyNotificationSignature(
    {
      orderId: payload.order_id,
      statusCode: payload.status_code,
      grossAmount: payload.gross_amount,
      signatureKey: payload.signature_key,
    },
    serverKey,
  );
  if (!valid) {
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  const orderId = payload.order_id;
  if (!orderId) {
    return Response.json({ error: "missing_order_id" }, { status: 400 });
  }

  const supabase = await createAdminSupabase();
  const { data: purchase } = await supabase
    .from("purchases")
    .select("*")
    .eq("external_id", orderId)
    .maybeSingle();

  if (!purchase) {
    return Response.json({ error: "unknown_order" }, { status: 404 });
  }

  const status = mapMidtransStatus(payload.transaction_status ?? payload.status_code);

  if (status === "paid") {
    if (purchase.status !== "paid" && purchase.status !== "fulfilled") {
      if (purchase.item_type === "gems") {
        const { data: wallet } = await supabase
          .from("wallets")
          .select("gems")
          .eq("profile_id", purchase.profile_id)
          .maybeSingle();
        await supabase
          .from("wallets")
          .update({ gems: (wallet?.gems ?? 0) + purchase.amount })
          .eq("profile_id", purchase.profile_id);
      } else if (purchase.item_type === "hints") {
        const { data: hints } = await supabase
          .from("hints")
          .select("count")
          .eq("profile_id", purchase.profile_id)
          .maybeSingle();
        await supabase
          .from("hints")
          .update({ count: (hints?.count ?? 0) + purchase.amount })
          .eq("profile_id", purchase.profile_id);
      } else if (purchase.item_type === "mentor") {
        const now = new Date();
        now.setDate(now.getDate() + purchase.amount);
        await supabase.from("subscriptions").upsert(
          {
            profile_id: purchase.profile_id,
            plan: "mentor",
            paid_until: now.toISOString(),
          },
          { onConflict: "profile_id" },
        );
      }
      await supabase.from("purchases").update({ status: "fulfilled" }).eq("external_id", orderId);
    }
  } else if (status === "denied" || status === "cancelled" || status === "expired") {
    await supabase.from("purchases").update({ status: "failed" }).eq("external_id", orderId);
  }

  return Response.json({ ok: true });
}