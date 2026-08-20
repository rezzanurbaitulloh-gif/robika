import { AiChat } from "@/components/ai/ai-chat";
import { BentoCard } from "@/components/design/bento-card";
import { StatusChip } from "@/components/design/status-chip";
import { createServerSupabase } from "@/lib/db/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MentorPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, trial_ends_at, paid_until")
    .eq("profile_id", user.id)
    .maybeSingle<{
      plan: string;
      trial_ends_at: string | null;
      paid_until: string | null;
    }>();

  const now = new Date();
  const active =
    sub &&
    (sub.plan === "mentor" ||
      (sub.trial_ends_at && new Date(sub.trial_ends_at) > now) ||
      (sub.paid_until && new Date(sub.paid_until) > now));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          AI MENTOR
        </h1>
        {active ? (
          <StatusChip status="success" label="AKTIF" />
        ) : (
          <StatusChip status="warning" label="BELUM AKTIF" />
        )}
      </div>

      {!active && (
        <BentoCard
          title="Mulai Trial 1 Minggu"
          description="Nikmati AI Mentor penuh gratis selama 7 hari. Setelah itu Rp10rb/bulan — berhenti kapan saja. Tidak ada pembayaran otomatis."
          icon="🧠"
          className="mb-6"
          footer={
            <span className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              Segera hadir
            </span>
          }
        />
      )}

      <div className="h-[480px]">
        <AiChat
          mode="mentor"
          placeholder="Tanya konsep apa pun — loop, array, fungsi, hingga algoritma. Mentor menjelaskan secara mendalam."
        />
      </div>
    </main>
  );
}