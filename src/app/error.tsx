"use client";

import { StatusChip } from "@/components/design/status-chip";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Robika"
        className="mb-6 h-16 w-16 rounded-2xl border border-rose-400/40 shadow-[0_0_24px_rgba(239,68,68,0.25)]"
      />
      <StatusChip status="danger" label="SISTEM ERROR" className="mb-4" />
      <h1 className="glow-text font-display text-3xl tracking-widest text-foreground sm:text-4xl">
        BOT-1 MENGALAMI GANGGUAN
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
        Terjadi kesalahan yang tidak terduga. Coba lagi — data belajarmu tetap
        aman.
      </p>
      <div className="mt-8">
        <button type="button" onClick={reset} className="btn btn-accent btn-lg">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}