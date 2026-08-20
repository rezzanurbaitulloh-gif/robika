import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/db/server";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { BackButton } from "@/components/design/back-button";
import { StatusChip } from "@/components/design/status-chip";
import { Icon, type IconName } from "@/components/design/icon";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: wallet }, { data: achievements }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("username, display_name, avatar_url, skill_level, level, xp, streak, created_at")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("wallets")
        .select("stars, gems")
        .eq("profile_id", user.id)
        .maybeSingle<{ stars: number; gems: number }>(),
      supabase
        .from("achievements")
        .select("badge_id", { count: "exact", head: true })
        .eq("profile_id", user.id),
    ]);

  const avatar = profile?.avatar_url ?? "robot";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-slate-900/60">
        <div className="h-20 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-background bg-slate-950 text-4xl shadow-lg">
                {avatar}
              </span>
              <div className="pb-1">
                <h1 className="font-display text-xl tracking-wide text-foreground">
                  {profile?.display_name || profile?.username || "Pelajar"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  @{profile?.username} · {user.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <StatusChip status="info" label={`LV ${profile?.level ?? 1}`} />
              <StatusChip status="neutral" label={`XP ${profile?.xp ?? 0}`} />
              <StatusChip status="warning" label={`Stars ${wallet?.stars ?? 0}`} />
              <StatusChip status="success" label={`Gems ${wallet?.gems ?? 0}`} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {[
              { label: "Streak", value: `${profile?.streak ?? 0} hari`, icon: "flame" },
              { label: "Badge", value: `${achievements?.length ?? 0} / 10`, icon: "medal" },
              { label: "Level keahlian", value: profile?.skill_level ?? "pemula", icon: "layers" },
              {
                label: "Bergabung",
                icon: "calendar",
                value: profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("id-ID", {
                      month: "short",
                      year: "numeric",
                    })
                  : "-",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-slate-950/60 p-3"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Icon name={item.icon as IconName} size={13} />
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProfileSettings
          initial={{
            username: profile?.username ?? "",
            displayName: profile?.display_name ?? "",
            avatarUrl: avatar,
            skillLevel: (profile?.skill_level ?? "pemula") as
              | "pemula"
              | "menengah"
              | "lanjut",
          }}
        />
      </div>
    </main>
  );
}