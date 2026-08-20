import Link from "next/link";
import { StatusChip } from "@/components/design/status-chip";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Robika"
        className="mb-6 h-16 w-16 rounded-2xl border border-accent/30 shadow-[0_0_24px_rgba(59,130,246,0.25)]"
      />
      <StatusChip status="warning" label="404 · SINYAL HILANG" className="mb-4" />
      <h1 className="glow-text font-display text-3xl tracking-widest text-accent sm:text-4xl">
        HALAMAN TIDAK DITEMUKAN
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
        BOT-1 tidak menemukan node ini di peta. Mungkin halaman dipindah, atau
        tautannya salah.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-accent btn-lg">
          Kembali ke Beranda
        </Link>
        <Link href="/dashboard" className="btn btn-secondary btn-lg">
          Dashboard
        </Link>
      </div>
    </div>
  );
}