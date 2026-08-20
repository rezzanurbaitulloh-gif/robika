import { createServerSupabase } from "@/lib/db/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeaderboardRow {
  id: string;
  username: string | null;
  xp: number;
  level: number;
  streak: number;
}

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_leaderboard", {
    limit_rows: 20,
  });
  if (error) {
    return Response.json({ error: "leaderboard_failed" }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as LeaderboardRow[];
  const myRank = rows.findIndex((r) => r.id === user.id) + 1;

  return Response.json({
    entries: rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      xp: r.xp,
      level: r.level,
      streak: r.streak,
    })),
    my_rank: myRank > 0 ? myRank : null,
  });
}