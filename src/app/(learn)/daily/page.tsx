import Link from "next/link";
import { redirect } from "next/navigation";
import { worlds } from "@/content";
import { dailyLevelId, dailyEndsAt } from "@/lib/game/daily";
import { createServerSupabase } from "@/lib/db/server";
import { BackButton } from "@/components/design/back-button";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const world = worlds[0];
  const regularLevels = world.levels.filter((l) => !l.isBoss);
  const dailyId = dailyLevelId(new Date(), regularLevels.map((l) => l.id));
  const level = world.levels.find((l) => l.id === dailyId);
  const endsAt = dailyEndsAt(new Date());

  const { data: progress } = await supabase
    .from("progress")
    .select("stars")
    .eq("profile_id", user.id)
    .eq("level_id", dailyId)
    .maybeSingle<{ stars: number }>();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="mb-6">
        <BackButton fallbackHref="/leaderboard" />
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          ⚡ DAILY CHALLENGE
        </h1>
        <p className="text-sm text-muted-foreground">
          Satu level khusus setiap hari. Berlaku sampai{" "}
          <span className="font-mono text-xs">
            {endsAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </span>
          .
        </p>
      </div>

      {level ? (
        <div className="rounded-xl border border-accent/40 bg-gradient-to-br from-accent/15 to-transparent p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              TANTANGAN HARI INI
            </span>
            {progress ? (
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
                ✓ Selesai ★{progress.stars}
              </span>
            ) : (
              <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs text-amber-300">
                Belum dicoba
              </span>
            )}
          </div>
          <h2 className="font-display text-xl tracking-wide text-foreground">
            {level.title.id}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {level.concept} · XP {level.xpReward}
          </p>
          <Link
            href={`/level/${level.id}?daily=1`}
            className="mt-5 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:brightness-110"
          >
            {progress ? "Mainkan Lagi" : "Mulai Tantangan"} →
          </Link>
        </div>
      ) : (
        <p className="rounded-xl border border-border bg-slate-900/60 p-6 text-sm text-muted-foreground">
          Tidak ada tantangan hari ini.
        </p>
      )}
    </main>
  );
}