import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/db/server";
import { CertificateClient } from "./certificate-client";

export const dynamic = "force-dynamic";

export default async function CertificatePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, xp, level, created_at")
      .eq("id", user.id)
      .maybeSingle<{ username: string; xp: number; level: number; created_at: string }>(),
    supabase.from("progress").select("level_id").eq("profile_id", user.id),
  ]);

  const completed = (progress ?? []).map((p) => p.level_id);
  const world1Complete = [
    "world-1-level-1",
    "world-1-level-2",
    "world-1-level-3",
    "world-1-level-4",
    "world-1-level-5",
    "world-1-level-6",
  ].every((id) => completed.includes(id));
  const bossDone = completed.includes("world-1-boss");

  return (
    <CertificateClient
      username={profile?.username ?? "Pelajar"}
      level={profile?.level ?? 1}
      xp={profile?.xp ?? 0}
      joinedAt={profile?.created_at ?? null}
      world1Complete={world1Complete}
      bossDone={bossDone}
    />
  );
}