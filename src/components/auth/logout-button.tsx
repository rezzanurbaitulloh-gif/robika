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
      className="text-sm text-muted-foreground transition hover:text-foreground"
    >
      Keluar
    </button>
  );
}