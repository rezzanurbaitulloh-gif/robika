import Link from "next/link";
import { redirect } from "next/navigation";
import { worlds } from "@/content";
import { BotAvatar } from "@/components/design/bot-avatar";
import { Icon, type IconName } from "@/components/design/icon";
import { HudBar } from "@/components/game/hud-bar";
import { PopupLayer } from "@/components/system/popup-layer";
import { createServerSupabase } from "@/lib/db/server";
import { getSkinItem, SKIN_ITEMS } from "@/lib/shop/catalog";

export const dynamic = "force-dynamic";

const MENU_TILES: {
  href: string;
  label: string;
  hotkey: string;
  icon: IconName;
  tone: string;
}[] = [
  { href: "/world/world-1", label: "World", hotkey: "M", icon: "layers", tone: "text-cyan-300" },
  { href: "/learn", label: "Academy", hotkey: "A", icon: "book", tone: "text-emerald-300" },
  { href: "/codelab", label: "CodeLab", hotkey: "C", icon: "code", tone: "text-fuchsia-300" },
  { href: "/codelab/studio", label: "Studio", hotkey: "B", icon: "pen", tone: "text-sky-300" },
  { href: "/mentor", label: "Mentor AI", hotkey: "T", icon: "chat", tone: "text-violet-300" },
  { href: "/shop", label: "Shop", hotkey: "S", icon: "cart", tone: "text-amber-300" },
  { href: "/daily", label: "Misi Harian", hotkey: "Q", icon: "clock", tone: "text-orange-300" },
  { href: "/profile", label: "Profil", hotkey: "I", icon: "user", tone: "text-rose-300" },
  { href: "/certificate", label: "Sertifikat", hotkey: "P", icon: "certificate", tone: "text-lime-300" },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: wallet }, { data: achievements }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("username, level, xp, streak, skin_id")
        .eq("id", user.id)
        .maybeSingle<{
          username: string;
          level: number;
          xp: number;
          streak: number;
          skin_id: string | null;
        }>(),
      supabase
        .from("wallets")
        .select("stars, gems")
        .eq("profile_id", user.id)
        .maybeSingle<{ stars: number; gems: number }>(),
      supabase
        .from("achievements")
        .select("badge_id")
        .eq("profile_id", user.id),
    ]);

  const { data: progressRows } = await supabase
    .from("progress")
    .select("level_id")
    .eq("profile_id", user.id);
  const doneLevels = new Set(
    (progressRows ?? []).map((r: { level_id: string }) => r.level_id),
  );

  const allLevels = worlds.flatMap((w) => w.levels);
  const nextLevel = allLevels.find((l) => !doneLevels.has(l.id));
  const nextWorld = nextLevel
    ? worlds.find((w) => w.levels.some((l) => l.id === nextLevel.id))
    : undefined;

  const skin =
    (profile?.skin_id ? getSkinItem(profile.skin_id) : undefined) ??
    SKIN_ITEMS[0];
  const badgeCount = achievements?.length ?? 0;

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 py-4">
      <PopupLayer />
      <HudBar
        level={profile?.level ?? 1}
        xp={profile?.xp ?? 0}
        gems={wallet?.gems ?? 0}
        stars={wallet?.stars ?? 0}
        streak={profile?.streak ?? 0}
        questLabel={nextLevel ? nextLevel.title.id : null}
        questHref={nextLevel ? `/level/${nextLevel.id}` : undefined}
      />

      <section className="base-floor relative overflow-hidden rounded-lg border border-border bg-[#0c101d] p-6">
        <span className="blink absolute left-4 top-4 h-2 w-2 rounded-sm bg-cyan-400/80" />
        <span className="blink absolute right-6 top-8 h-2 w-2 rounded-sm bg-amber-400/70 [animation-delay:400ms]" />
        <span className="blink absolute bottom-5 left-10 h-2 w-2 rounded-sm bg-emerald-400/60 [animation-delay:900ms]" />
        <span className="absolute inset-x-0 bottom-0 h-16 scanline opacity-30" />

        <div className="relative flex flex-col items-center gap-3 pb-14 pt-6">
          <span className="breathe">
            <BotAvatar colors={skin.colors} size={72} />
          </span>
          <p className="font-display text-xs uppercase tracking-widest text-cyan-300">
            BOT-1 · siap · lencana {badgeCount}/10
          </p>
          <p className="text-center text-sm text-foreground/60">
            {profile?.username ?? "Operator"}, sistem menunggu perintahmu.
          </p>
        </div>

        {nextLevel && (
          <Link
            href={`/level/${nextLevel.id}`}
            className="group absolute inset-x-6 bottom-4 flex items-center justify-between rounded-md border border-emerald-400/40 bg-[#141a2e]/90 px-4 py-3 transition group-hover:border-emerald-300"
          >
            <div className="min-w-0">
              <p className="font-display text-[10px] uppercase tracking-widest text-emerald-300">
                Misi Aktif · {nextWorld?.name.id ?? ""}
              </p>
              <p className="truncate text-sm font-semibold">{nextLevel.title.id}</p>
            </div>
            <span className="ml-3 flex shrink-0 items-center gap-1.5 rounded-sm border border-emerald-400/50 bg-emerald-400/15 px-3 py-1.5 font-display text-xs uppercase tracking-wider text-emerald-300 transition group-hover:bg-emerald-400/25">
              <Icon name="play" size={12} /> Lanjut
            </span>
          </Link>
        )}
      </section>

      <nav aria-label="Menu markas" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {MENU_TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="flex flex-col items-center gap-1.5 rounded-md border border-border bg-card/70 px-2 py-3 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-card"
          >
            <span className={tile.tone}>
              <Icon name={tile.icon} size={18} />
            </span>
            <span className="font-display text-[10px] uppercase tracking-wider text-foreground/80">
              {tile.label}
            </span>
            <span className="rounded-sm border border-border bg-input/40 px-1 text-[9px] text-foreground/40">
              {tile.hotkey}
            </span>
          </Link>
        ))}
      </nav>

      <footer className="pb-2 text-center font-display text-[10px] uppercase tracking-widest text-foreground/30">
        ROBIKA BASE · node stabil · koneksi aktif
      </footer>
    </main>
  );
}
