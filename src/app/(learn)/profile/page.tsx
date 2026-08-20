import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/db/server";
import { ProfileView } from "@/components/profile/profile-view";
import { BackButton } from "@/components/design/back-button";

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

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>

      <ProfileView
        initial={{
          username: profile?.username ?? "",
          displayName: profile?.display_name ?? "",
          avatarUrl: profile?.avatar_url ?? "🤖",
          skillLevel: (profile?.skill_level ?? "pemula") as
            | "pemula"
            | "menengah"
            | "lanjut",
          email: user.email ?? "",
          level: profile?.level ?? 1,
          xp: profile?.xp ?? 0,
          stars: wallet?.stars ?? 0,
          gems: wallet?.gems ?? 0,
          streak: profile?.streak ?? 0,
          badgeCount: achievements?.length ?? 0,
          createdAt: profile?.created_at ?? null,
        }}
      />
    </main>
  );
}