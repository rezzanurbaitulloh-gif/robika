import { createServerSupabase } from "@/lib/db/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRIAL_DAYS = 7;

export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("trial_started_at, trial_ends_at, paid_until")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (
    sub?.paid_until &&
    new Date(sub.paid_until) > now
  ) {
    return Response.json({ error: "already_paid" }, { status: 409 });
  }

  if (sub?.trial_started_at) {
    return Response.json({ error: "trial_used" }, { status: 409 });
  }

  const endsAt = new Date(now.getTime() + TRIAL_DAYS * 86_400_000);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: "mentor",
      trial_started_at: now.toISOString(),
      trial_ends_at: endsAt.toISOString(),
    })
    .eq("profile_id", user.id);

  if (error) {
    return Response.json({ error: "update_failed" }, { status: 500 });
  }

  return Response.json({ trial_ends_at: endsAt.toISOString() });
}