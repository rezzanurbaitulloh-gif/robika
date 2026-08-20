import { notFound } from "next/navigation";
import { challenges } from "@/content/codelab";
import { ChallengeClient } from "./challenge-client";
import { createServerSupabase } from "@/lib/db/server";

export const dynamic = "force-dynamic";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = await params;
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: doneRow } = await supabase
    .from("codelab_progress")
    .select("challenge_id")
    .eq("profile_id", user.id)
    .eq("challenge_id", challenge.id)
    .maybeSingle<{ challenge_id: string }>();

  return (
    <ChallengeClient
      key={challenge.id}
      challengeId={challenge.id}
      alreadyDone={Boolean(doneRow)}
    />
  );
}