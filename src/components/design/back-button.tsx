"use client";

import { useRouter } from "next/navigation";

export function BackButton({ fallbackHref = "/dashboard" }: { fallbackHref?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
      aria-label="Kembali ke halaman sebelumnya"
    >
      ← Kembali
    </button>
  );
}