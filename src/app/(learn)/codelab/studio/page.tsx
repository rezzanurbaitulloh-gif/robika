import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/db/server";
import { StudioClient } from "@/components/codelab/studio-client";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <StudioClient />;
}