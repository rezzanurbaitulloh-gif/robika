import Link from "next/link";
import { redirect } from "next/navigation";
import { worlds } from "@/content";
import { BentoCard } from "@/components/design/bento-card";
import { StatusChip } from "@/components/design/status-chip";
import { BadgeGrid } from "@/components/game/badge-grid";
import { createServerSupabase } from "@/lib/db/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, level, xp, streak")
    .eq("id", user.id)
    .maybeSingle<{ username: string; level: number; xp: number; streak: number }>();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("stars, gems")
    .eq("profile_id", user.id)
    .maybeSingle<{ stars: number; gems: number }>();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("badge_id, earned_at")
    .eq("profile_id", user.id);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-foreground">
            SELAMAT DATANG,{" "}
            <span className="text-accent">
              {(profile?.username ?? "PELAJAR").toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Lanjutkan petualangan coding-mu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status="info" label={`LV ${profile?.level ?? 1}`} />
          <StatusChip status="neutral" label={`XP ${profile?.xp ?? 0}`} />
          <StatusChip status="warning" label={`★ ${wallet?.stars ?? 0}`} />
          <StatusChip status="success" label={`◆ ${wallet?.gems ?? 0}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BentoCard
          title="Kode Quest"
          description="Mainkan game 2D sambil belajar logika dasar."
          icon="🎮"
          className="lg:col-span-2"
          footer={
            <Link
              href={`/world/${worlds[0].world}`}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Mulai bermain →
            </Link>
          }
        />
        <BentoCard
          title="CodeLab"
          description="Latihan JavaScript & Python dengan preview."
          icon="⚡"
          footer={
            <span className="flex flex-wrap gap-2">
              <Link
                href="/codelab/codelab-hello"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Buka latihan →
              </Link>
              <Link
                href="/codelab/playground"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Playground →
              </Link>
            </span>
          }
        />
        <BentoCard
          title="AI Mentor"
          description="Belajar mendalam dengan mentor AI pribadi."
          icon="🧠"
          footer={
            <Link
              href="/mentor"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Chat sekarang →
            </Link>
          }
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <BadgeGrid owned={(achievements ?? []).map((a) => a.badge_id)} />
        <div className="rounded-xl border border-border bg-slate-900/60 p-4">
          <h3 className="mb-3 font-display text-sm tracking-wide">STATISTIK</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">🔥 Streak</span>
              <span className="font-semibold text-foreground">
                {profile?.streak ?? 0} hari
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">🏅 Badge</span>
              <span className="font-semibold text-foreground">
                {achievements?.length ?? 0} / 10
              </span>
            </div>
            <Link
              href="/certificate"
              className="mt-3 block rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-center text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              🎓 Unduh Sertifikat
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}