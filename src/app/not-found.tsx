import Link from "next/link";
import { StatusChip } from "@/components/design/status-chip";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Robika"
        className="mb-6 h-16 w-16 rounded-sm border border-cyan-400/40"
      />
      <StatusChip status="warning" label="404 · SINYAL HILANG" className="mb-4" />
      <h1 className="glow-text font-display text-3xl tracking-widest text-cyan-300 sm:text-4xl">
        HALAMAN TIDAK DITEMUKAN
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
        BOT-1 tidak menemukan node ini di peta. Mungkin halaman dipindah, atau
        tautannya salah.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/dashboard"
          className="rounded-sm border border-border px-5 py-2.5 font-display text-xs uppercase tracking-wider text-muted-foreground transition hover:border-border/80 hover:text-foreground"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}