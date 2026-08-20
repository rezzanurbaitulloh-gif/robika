import { createServerSupabase } from "@/lib/db/server";
import { buildOrderId, getPaymentItem, type PaymentItemId } from "@/lib/payments/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CreateBody {
  itemId: string;
}

export async function POST(request: Request) {
  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const item = getPaymentItem(body.itemId as PaymentItemId);
  if (!item) {
    return Response.json({ error: "unknown_item" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const orderId = buildOrderId(user.id, item.id);

  const { data: purchase, error: insertError } = await supabase
    .from("purchases")
    .insert({
      profile_id: user.id,
      item_type: item.effect.type === "mentor" ? "mentor" : item.effect.type,
      item_ref: item.id,
      amount: item.effect.type === "mentor" ? item.effect.days : item.effect.count,
      price: item.price,
      status: "pending",
      external_id: orderId,
    })
    .select()
    .single();

  if (insertError || !purchase) {
    return Response.json({ error: "purchase_failed" }, { status: 500 });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  if (!serverKey) {
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  const baseUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";

  let snapToken: string;
  let redirectUrl: string;
  try {
    const response = await fetch(`${baseUrl}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: item.price,
        },
        item_details: [
          {
            id: item.id,
            price: item.price,
            quantity: 1,
            name: item.name,
          },
        ],
        customer_details: {
          id: user.id,
        },
        credit_card: { secure: true },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Midtrans create error", response.status, text);
      await supabase.from("purchases").update({ status: "failed" }).eq("external_id", orderId);
      return Response.json({ error: "midtrans_error" }, { status: 502 });
    }

    const data = (await response.json()) as {
      token?: string;
      redirect_url?: string;
    };
    snapToken = data.token ?? "";
    redirectUrl = data.redirect_url ?? "";
    if (!snapToken) {
      throw new Error("missing token");
    }
  } catch (err) {
    console.error("Midtrans create exception", err);
    await supabase.from("purchases").update({ status: "failed" }).eq("external_id", orderId);
    return Response.json({ error: "midtrans_error" }, { status: 502 });
  }

  return Response.json({
    token: snapToken,
    redirect_url: redirectUrl,
    order_id: orderId,
    snap_base: baseUrl,
  });
}