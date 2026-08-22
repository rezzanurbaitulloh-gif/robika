import Link from "next/link";
import { redirect } from "next/navigation";
import { worlds } from "@/content";
import { CURRICULUM_STACKS } from "@/content/curriculum/curriculum";
import { challenges } from "@/content/codelab";
import { BentoCard } from "@/components/design/bento-card";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";
import { BadgeGrid } from "@/components/game/badge-grid";
import { LevelProgressCard } from "@/components/dashboard/level-progress";
import { NextSteps, type NextStepItem } from "@/components/dashboard/next-steps";
import { createServerSupabase } from "@/lib/db/server";
import { isFlagEnabled } from "@/lib/flags";

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

  const { data: progressRows } = await supabase
    .from("progress")
    .select("level_id")
    .eq("profile_id", user.id);
  const doneLevels = new Set(
    (progressRows ?? []).map((r: { level_id: string }) => r.level_id),
  );

  const { data: learnRows } = await supabase
    .from("learn_progress")
    .select("item_id")
    .eq("profile_id", user.id);
  const doneLessons = new Set(
    (learnRows ?? []).map((r: { item_id: string }) => r.item_id),
  );

  const { data: codelabRows } = await supabase
    .from("codelab_progress")
    .select("challenge_id")
    .eq("profile_id", user.id);
  const doneChallenges = new Set(
    (codelabRows ?? []).map((r: { challenge_id: string }) => r.challenge_id),
  );

  const allLevels = worlds.flatMap((w) => w.levels);
  const nextLevel = allLevels.find((l) => !doneLevels.has(l.id));
  const nextStack = CURRICULUM_STACKS[0];
  const nextModule = nextStack?.modules.find(
    (m) => !doneLessons.has(`${nextStack.id}/${m.id}`),
  );
  const nextChallenge = challenges.find((c) => !doneChallenges.has(c.id));

  const nextSteps: NextStepItem[] = [];
  if (nextLevel) {
    nextSteps.push({
      href: `/level/${nextLevel.id}`,
      label: nextLevel.title.id,
      hint: `Kode Quest · ${nextLevel.topic}`,
      icon: "gamepad",
      tone: "accent",
      chip: "LANJUTKAN",
    });
  }
  if (nextModule) {
    nextSteps.push({
      href: `/learn/${nextStack.id}/${nextModule.id}`,
      label: nextModule.title,
      hint: `Belajar · materi & kuis ${nextStack.name}`,
      icon: "book",
      tone: "muted",
      chip: "BELAJAR",
    });
  }
  if (nextChallenge) {
    nextSteps.push({
      href: `/codelab/${nextChallenge.id}`,
      label: nextChallenge.title.id,
      hint: `CodeLab · ${nextChallenge.lang.toUpperCase()}`,
      icon: "bolt",
      tone: "muted",
      chip: "CODELAB",
    });
  }
  nextSteps.push({
    href: "/daily",
    label: "Daily Quest",
    hint: "Tantangan harian — hadiah setiap hari",
    icon: "flame",
    tone: "muted",
    chip: "HARIAN",
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide sm:text-3xl text-foreground">
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
          <StatusChip status="warning" label={`Stars ${wallet?.stars ?? 0}`} />
          <StatusChip status="success" label={`Gems ${wallet?.gems ?? 0}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BentoCard
          title="Kode Quest"
          description="Mainkan game 2D sambil belajar logika dasar."
          icon={<Icon name="gamepad" size={22} />}
          href={`/world/${worlds[0].world}`}
          className="lg:col-span-2"
          footer={
            <span className="text-xs font-semibold text-accent">
              Mulai bermain →
            </span>
          }
        />
        {isFlagEnabled("newAdventure") && (
          <BentoCard
            title="Distrik Gerbang"
            description="Dunia baru: gerbang daya, NPC, dan if/else."
            icon={<Icon name="robot" size={22} />}
            href="/world/world-2"
            footer={
              <span className="text-xs font-semibold text-amber-300">
                Jelajahi distrik →
              </span>
            }
          />
        )}
        <BentoCard
          title="CodeLab"
          description="Latihan JavaScript & Python dengan preview."
          icon={<Icon name="bolt" size={22} />}
          href="/codelab"
          footer={
            <span className="text-xs font-semibold text-accent">
              Pilih tantangan →
            </span>
          }
        />
        <BentoCard
          title="CodeLab Studio"
          description="Editor bebas — pilih bahasa (HTML, JS, Python), hasil live di samping."
          icon={<Icon name="code" size={22} />}
          href="/codelab/studio"
          footer={
            <span className="text-xs font-semibold text-accent">
              Buka studio →
            </span>
          }
        />
        <BentoCard
          title="AI Mentor"
          description="Belajar mendalam dengan mentor AI pribadi."
          icon={<Icon name="brain" size={22} />}
          href="/mentor"
          className="lg:col-span-2"
          footer={
            <span className="text-xs font-semibold text-accent">
              Chat sekarang →
            </span>
          }
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <BadgeGrid owned={(achievements ?? []).map((a) => a.badge_id)} />
        <div className="flex flex-col gap-4">
          <LevelProgressCard xp={profile?.xp ?? 0} />
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <h3 className="mb-3 font-display text-sm tracking-wide">STATISTIK</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="flame" size={14} /> Streak</span>
                <span className="font-semibold text-foreground">
                  {profile?.streak ?? 0} hari
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="medal" size={14} /> Badge</span>
                <span className="font-semibold text-foreground">
                  {achievements?.length ?? 0} / 10
                </span>
              </div>
              <Link
                href="/certificate"
                className="btn btn-outline btn-md mt-3 w-full"
              >
                Unduh Sertifikat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <NextSteps items={nextSteps} />
      </div>
    </main>
  );
}