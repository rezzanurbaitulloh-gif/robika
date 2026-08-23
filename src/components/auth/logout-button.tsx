"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="rounded-sm border border-border bg-input/40 px-2 py-1 font-display text-[11px] uppercase tracking-wider text-muted-foreground transition hover:border-cyan-400/50 hover:text-cyan-200"
    >
      Keluar
    </button>
  );
}