import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/db/server";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export const dynamic = "force-dynamic";

const RANK_STYLE = [
  "text-amber-300",
  "text-slate-300",
  "text-orange-400",
];

export default async function LeaderboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase.rpc("get_leaderboard", { limit_rows: 20 });
  const rows = (data ?? []) as unknown as Array<{
    id: string;
    username: string | null;
    xp: number;
    level: number;
    streak: number;
  }>;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <BackButton fallbackHref="/dashboard" />
          <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
            <Icon name="trophy" size={22} />
            LEADERBOARD
          </h1>
        </div>
        <Link
          href="/daily"
          className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
        >
          <span className="inline-flex items-center gap-1.5">
            <Icon name="bolt" size={16} />
            Daily Challenge
          </span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-slate-900/60">
        <div className="grid grid-cols-[3rem_1fr_auto] gap-2 border-b border-border bg-muted/40 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground sm:grid-cols-[3rem_1fr_4rem_4rem_4rem]">
          <span>Rank</span>
          <span>Pelajar</span>
          <span className="hidden text-right sm:block">LV</span>
          <span className="hidden text-right sm:block">
            <Icon name="flame" size={14} />
          </span>
          <span className="text-right">XP</span>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Belum ada peserta. Jadilah yang pertama!
          </p>
        ) : (
          rows.map((row, i) => {
            const isMe = row.id === user.id;
            return (
              <div
                key={row.id}
                className={`grid grid-cols-[3rem_1fr_auto] items-center gap-2 border-b border-border/50 px-4 py-2.5 text-sm last:border-0 sm:grid-cols-[3rem_1fr_4rem_4rem_4rem] ${
                  isMe ? "bg-accent/10" : ""
                }`}
              >
                <span
                  className={`font-display text-base ${RANK_STYLE[i] ?? "text-muted-foreground"}`}
                >
                  {i < 3 ? (
                    <Icon name="medal" size={16} />
                  ) : (
                    `#${i + 1}`
                  )}
                </span>
                <span className="truncate font-medium text-foreground">
                  {row.username}
                  {isMe && <span className="ml-1 text-xs text-accent">(kamu)</span>}
                </span>
                <span className="hidden text-right text-muted-foreground sm:block">
                  {row.level}
                </span>
                <span className="hidden text-right text-muted-foreground sm:block">
                  {row.streak}
                </span>
                <span className="text-right font-semibold text-accent">{row.xp}</span>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}