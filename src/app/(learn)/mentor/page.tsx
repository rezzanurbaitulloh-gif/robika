import { AiChat } from "@/components/ai/ai-chat";
import { StatusChip } from "@/components/design/status-chip";
import { BackButton } from "@/components/design/back-button";
import { createServerSupabase } from "@/lib/db/server";
import { redirect } from "next/navigation";
import { Icon } from "@/components/design/icon";

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
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
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
        <div className="mb-6 flex items-start gap-4 rounded-sm border border-fuchsia-400/30 bg-[#0c101d] p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-border bg-input/30 text-fuchsia-300">
            <Icon name="brain" size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm uppercase tracking-wider text-foreground">
              Mulai Trial 1 Minggu
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Nikmati AI Mentor penuh gratis selama 7 hari. Setelah itu
              Rp10rb/bulan — berhenti kapan saja. Tidak ada pembayaran otomatis.
            </p>
          </div>
          <span className="shrink-0 self-center rounded-sm border border-cyan-400/40 px-3 py-1.5 font-display text-[11px] uppercase tracking-wider text-cyan-200/80">
            Segera hadir
          </span>
        </div>
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