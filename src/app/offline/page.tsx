import Link from "next/link";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export const metadata = { title: "Offline — Robika" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="mb-2 self-start">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <span className="text-amber-300">
        <Icon name="bolt" size={40} />
      </span>
      <h1 className="font-display text-2xl tracking-wide text-foreground">
        KONEKSI TERPUTUS
      </h1>
      <p className="text-sm text-muted-foreground">
        Halaman ini belum tersimpan di perangkatmu. Sambungkan internet lalu coba
        lagi — progres yang sudah tersinkron tetap aman.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-lg border border-accent/50 bg-accent/10 px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent"
      >
        Coba Lagi
      </Link>
    </main>
  );
}
