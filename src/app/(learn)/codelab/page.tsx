import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/db/server";
import { CodelabIndex } from "./codelab-index";

export const dynamic = "force-dynamic";

export default async function CodelabPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: progress } = await supabase
    .from("codelab_progress")
    .select("challenge_id")
    .eq("profile_id", user.id);

  return <CodelabIndex done={(progress ?? []).map((p) => p.challenge_id)} />;
}