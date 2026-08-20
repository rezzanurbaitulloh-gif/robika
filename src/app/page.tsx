import Link from "next/link";
import { BentoCard } from "@/components/design/bento-card";
import { StatusChip } from "@/components/design/status-chip";

const FEATURES = [
  {
    title: "Kode Quest",
    description:
      "Belajar dengan game 2D. Tulis kode yang menggerakkan robot BOT-1 menembus dunia Robot Rescue.",
    icon: "🎮",
    span: 2,
  },
  {
    title: "CodeLab",
    description:
      "Editor ala VS Code dengan preview langsung. JavaScript & Python berjalan di browser.",
    icon: "⚡",
  },
  {
    title: "AI Tutor",
    description:
      "Dibantu AI yang tidak pernah memberi jawaban instan — dia memandu dengan hint bertingkat.",
    icon: "🤖",
  },
  {
    title: "AI Mentor",
    description:
      "Mentor pribadi untuk solusi mendalam. Gratis 1 minggu, lalu Rp10rb/bulan.",
    icon: "🧠",
  },
  {
    title: "2 Mata Uang",
    description:
      "Bintang dari belajar, gem dari top-up. Kosmetik eksklusif tanpa pay-to-win.",
    icon: "💎",
  },
  {
    title: "Rp0 untukmu",
    description:
      "Semua materi dan CodeLab gratis selamanya. Tanpa iklan, tanpa paywall belajar.",
    icon: "🛡️",
    span: 2,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Robika" className="h-8 w-8 rounded-lg" />
            <span className="font-display text-lg tracking-widest text-foreground">
              ROBIKA
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/#fitur" className="hidden hover:text-foreground sm:inline">
              Fitur
            </Link>
            <Link href="/#pricing" className="hidden hover:text-foreground sm:inline">
              Harga
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-accent px-3 py-1.5 font-semibold text-accent-foreground hover:brightness-110"
            >
              Mulai Gratis
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="py-20 text-center">
          <StatusChip status="info" label="● AI CODING ACADEMY" className="mb-6" />
          <h1 className="font-display text-4xl tracking-wide text-foreground md:text-6xl">
            Belajar Coding
            <br />
            <span className="glow-text text-accent">Jadi Game.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Robika mengubah belajar coding jadi petualangan 2D dengan AI tutor
            pribadi, editor ala VS Code, dan kurikulum multi-stack. Gratis
            selamanya — tanpa iklan, tanpa paywall.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:brightness-110"
            >
              Mulai Petualangan
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-border px-6 py-3 text-foreground transition hover:bg-muted"
            >
              Saya sudah punya akun
            </Link>
          </div>
        </section>

        <section id="fitur" className="pb-20">
          <h2 className="mb-8 text-center font-display text-2xl tracking-wide text-foreground">
            SATU PLATFORM, SEMUA YANG KAMU BUTUHKAN
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <BentoCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className={feature.span === 2 ? "lg:col-span-2" : undefined}
              />
            ))}
          </div>
        </section>

        <section id="pricing" className="pb-20">
          <h2 className="mb-8 text-center font-display text-2xl tracking-wide text-foreground">
            HARGA YANG JUJUR
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            <BentoCard
              title="Gratis"
              description="Semua kurikulum, Kode Quest, CodeLab, AI Tutor, 3 hint tiap 3 hari. Selamanya."
              icon="🛡️"
              footer={
                <span className="font-display text-2xl text-accent">
                  Rp0<span className="text-sm text-muted-foreground">/bulan</span>
                </span>
              }
            />
            <BentoCard
              title="Mentor"
              description="AI Mentor pribadi tanpa batas topik. Trial 1 minggu gratis, lalu berhenti kapan saja."
              icon="🧠"
              footer={
                <span className="font-display text-2xl text-accent">
                  Rp10rb<span className="text-sm text-muted-foreground">/bulan</span>
                </span>
              }
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © 2026 Robika — belajar coding tanpa biaya, dengan kualitas premium.
      </footer>
    </div>
  );
}