import Link from "next/link";
import { redirect } from "next/navigation";
import { worlds, getLevel } from "@/content";
import { dailyLevelId, dailyEndsAt, dailyPoolIds } from "@/lib/game/daily";
import { isFlagEnabled, type FeatureFlags } from "@/lib/flags";
import { createServerSupabase } from "@/lib/db/server";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const pool = dailyPoolIds(worlds, (flag) =>
    isFlagEnabled(flag as keyof FeatureFlags),
  );
  const dailyId = dailyLevelId(new Date(), pool);
  const level = getLevel(dailyId);
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
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
          <Icon name="bolt" size={22} />
          DAILY CHALLENGE
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
        <div className="rounded-sm border border-cyan-400/40 bg-[#0c101d] p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider text-cyan-200">
              TANTANGAN HARI INI
            </span>
            {progress ? (
              <span className="rounded-sm border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider text-emerald-300">
                Selesai {progress.stars}
              </span>
            ) : (
              <span className="rounded-sm border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider text-amber-300">
                Belum dicoba
              </span>
            )}
          </div>
          <h2 className="font-display text-xl tracking-wide text-foreground">
            {level.title.id}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {level.concept} · XP {level.xpReward}
          </p>
          <Link
            href={`/level/${level.id}?daily=1`}
            className="mt-5 inline-flex items-center gap-2 rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20"
          >
            <span className="inline-flex items-center gap-1.5">
              {progress ? "Mainkan Lagi" : "Mulai Tantangan"}
              <Icon name="arrowRight" size={16} />
            </span>
          </Link>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-[#0c101d] p-6 font-mono text-xs text-muted-foreground">
          Tidak ada tantangan hari ini.
        </p>
      )}
    </main>
  );
}