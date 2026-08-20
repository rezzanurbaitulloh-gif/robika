"use client";

import { BackButton } from "@/components/design/back-button";

interface CertificateClientProps {
  username: string;
  level: number;
  xp: number;
  joinedAt: string | null;
  world1Complete: boolean;
  bossDone: boolean;
}

export function CertificateClient({
  username,
  level,
  xp,
  joinedAt,
  world1Complete,
  bossDone,
}: CertificateClientProps) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <BackButton fallbackHref="/dashboard" />
          <h1 className="font-display text-2xl tracking-wide text-foreground">🎓 SERTIFIKAT</h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110 print:hidden"
        >
          🖨️ Simpan PDF
        </button>
      </div>

      <div className="certificate-sheet rounded-xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-10 print:border-amber-400 print:from-white print:via-white print:to-white print:text-black">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.35em] text-amber-400/80 print:text-amber-600 sm:text-xs">
            ROBÍKA LEARNING ACADEMY
          </p>
          <h2 className="mt-2 font-display text-xl tracking-wide text-amber-300 print:text-amber-700 sm:text-3xl">
            SERTIFIKAT PENYELESAIAN
          </h2>
          <div className="mx-auto mt-3 h-px w-3/4 bg-amber-400/40 print:bg-amber-600" />
          <p className="mt-6 text-sm text-muted-foreground print:text-gray-600">
            Diberikan kepada
          </p>
          <p className="mt-1 font-display text-2xl tracking-wide text-foreground print:text-black sm:text-4xl">
            {username.toUpperCase()}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground print:text-gray-700 sm:text-sm">
            atas partisipasi dan penyelesaian materi pembelajaran pemrograman
            dasar di platform <span className="font-semibold text-foreground print:text-black">Robika</span>,
            meliputi logika perintah, perulangan, perencanaan jalur, dan
            penyelesaian Boss Battle Dunia 1.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-border/60 bg-background/40 p-3 print:border-gray-300 print:bg-gray-50">
              <p className="text-lg font-bold text-accent print:text-black">{level}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-500">
                Level Profil
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/40 p-3 print:border-gray-300 print:bg-gray-50">
              <p className="text-lg font-bold text-accent print:text-black">{xp}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-500">
                Total XP
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/40 p-3 print:border-gray-300 print:bg-gray-50">
              <p className="text-lg font-bold text-accent print:text-black">
                {world1Complete ? "✓" : "—"}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-500">
                Dunia 1
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4 text-left">
            <div className="max-w-[180px]">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-500">
                Diterbitkan
              </p>
              <p className="text-sm font-semibold text-foreground print:text-black">{today}</p>
              {joinedAt && (
                <p className="mt-1 text-[10px] text-muted-foreground print:text-gray-500">
                  Bergabung {new Date(joinedAt).toLocaleDateString("id-ID")}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="font-display text-lg tracking-wide text-amber-300 print:text-amber-700">
                {bossDone ? "⚔️ Pemenang Boss Battle" : "⭐ Pelajar Aktif"}
              </p>
              <div className="mx-auto mt-1 h-px w-40 bg-amber-400/40 print:bg-gray-400" />
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-500">
                Capaian
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .certificate-sheet {
            box-shadow: none;
            border-radius: 0;
          }
          main {
            padding: 0;
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}