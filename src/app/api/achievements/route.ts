import { createServerSupabase } from "@/lib/db/server";

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

  const { data: owned } = await supabase
    .from("achievements")
    .select("badge_id, earned_at")
    .eq("profile_id", user.id);

  return Response.json({
    earned: owned ?? [],
  });
}