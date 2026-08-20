import Link from "next/link";
import { BentoCard } from "@/components/design/bento-card";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

const FEATURES = [
  {
    title: "Kode Quest",
    description:
      "Belajar dengan game 2D. Tulis kode yang menggerakkan robot BOT-1 menembus dunia Robot Rescue.",
    icon: <Icon name="gamepad" size={16} />,
    span: 2,
  },
  {
    title: "CodeLab",
    description:
      "Editor ala VS Code dengan preview langsung. JavaScript & Python berjalan di browser.",
    icon: <Icon name="bolt" size={16} />,
  },
  {
    title: "AI Tutor",
    description:
      "Dibantu AI yang tidak pernah memberi jawaban instan — dia memandu dengan hint bertingkat.",
    icon: <Icon name="robot" size={16} />,
  },
  {
    title: "AI Mentor",
    description:
      "Mentor pribadi untuk solusi mendalam. Gratis 1 minggu, lalu Rp10rb/bulan.",
    icon: <Icon name="brain" size={16} />,
  },
  {
    title: "2 Mata Uang",
    description:
      "Bintang dari belajar, gem dari top-up. Kosmetik eksklusif tanpa pay-to-win.",
    icon: <Icon name="gem" size={16} />,
  },
  {
    title: "Rp0 untukmu",
    description:
      "Semua materi dan CodeLab gratis selamanya. Tanpa iklan, tanpa paywall belajar.",
    icon: <Icon name="shield" size={16} />,
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
            <Link href="/#tujuan" className="hidden hover:text-foreground sm:inline">
              Tujuan
            </Link>
            <Link href="/#manfaat" className="hidden hover:text-foreground sm:inline">
              Manfaat
            </Link>
            <Link href="/#fitur" className="hidden hover:text-foreground sm:inline">
              Fitur
            </Link>
            <Link href="/#pricing" className="hidden hover:text-foreground sm:inline">
              Harga
            </Link>
            <Link href="/#faq" className="hidden hover:text-foreground sm:inline">
              FAQ
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

        <section id="tujuan" className="pb-20">
          <h2 className="mb-8 text-center font-display text-2xl tracking-wide text-foreground">
            KENAPA ROBIKA ADA?
          </h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            <BentoCard
              title="Coding bukan untuk segelintir orang"
              description="Setiap anak — apa pun latar belakangnya — berhak belajar pemrograman dengan cara yang menyenangkan, tanpa biaya."
              icon={<Icon name="sparkles" size={16} />}
            />
            <BentoCard
              title="Belajar sambil bermain, bukan menghafal"
              description="Game 2D, tantangan interaktif, dan reward bintang membuat konsep sulit terasa seperti petualangan, bukan pelajaran."
              icon={<Icon name="gamepad" size={16} />}
            />
            <BentoCard
              title="Praktik langsung sejak menit pertama"
              description="CodeLab memberi editor nyata di browser: tulis kode, lihat hasilnya, ulangi sampai paham. Tidak ada teori tanpa praktik."
              icon={<Icon name="bolt" size={16} />}
            />
            <BentoCard
              title="Gratis selamanya, tanpa kompromi"
              description="Tanpa iklan, tanpa paywall materi, tanpa mengorbankan kualitas. AI Tutor dan kurikulum lengkap tersedia untuk semua."
              icon={<Icon name="shield" size={16} />}
            />
          </div>
        </section>

        <section id="manfaat" className="pb-20">
          <h2 className="mb-8 text-center font-display text-2xl tracking-wide text-foreground">
            APA YANG KAMU DAPATKAN
          </h2>
          <div className="mx-auto max-w-4xl space-y-3">
            {[
              {
                icon: <Icon name="book" size={16} />,
                title: "Kurikulum 9 bahasa pemrograman",
                desc: "HTML & CSS, JavaScript, TypeScript, Python, SQL, Java, PHP, Go, dan C++ — dari dasar sampai mahir, bertahap dan terstruktur.",
              },
              {
                icon: <Icon name="trophy" size={16} />,
                title: "Game Kode Quest",
                desc: "Terapkan logika coding untuk menyelesaikan level game 2D — bukti nyata bahwa kamu memahami materinya.",
              },
              {
                icon: <Icon name="robot" size={16} />,
                title: "AI Tutor yang tidak memanjakan",
                desc: "Saat buntu, AI memandu dengan hint bertingkat — bukan jawaban instan. Kamu yang menemukan solusinya.",
              },
              {
                icon: <Icon name="brain" size={16} />,
                title: "AI Mentor pribadi",
                desc: "Butuh penjelasan mendalam atau proyek besar? Mentor AI menemani belajar 1-on-1, gratis 1 minggu percobaan.",
              },
              {
                icon: <Icon name="star" size={16} />,
                title: "Reward yang memotivasi",
                desc: "Kumpulkan bintang dan XP dari belajar, selesaikan misi harian, dan bangun streak belajar yang konsisten.",
              },
              {
                icon: <Icon name="certificate" size={16} />,
                title: "Sertifikat pencapaian",
                desc: "Selesaikan kurikulum dan dapatkan sertifikat yang bisa ditampilkan sebagai bukti keterampilanmu.",
              },
            ].map((item) => (
              <BentoCard
                key={item.title}
                title={item.title}
                description={item.desc}
                icon={item.icon}
                className="items-start"
              />
            ))}
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
              icon={<Icon name="shield" size={16} />}
              footer={
                <span className="font-display text-2xl text-accent">
                  Rp0<span className="text-sm text-muted-foreground">/bulan</span>
                </span>
              }
            />
            <BentoCard
              title="Mentor"
              description="AI Mentor pribadi tanpa batas topik. Trial 1 minggu gratis, lalu berhenti kapan saja."
              icon={<Icon name="brain" size={16} />}
              footer={
                <span className="font-display text-2xl text-accent">
                  Rp10rb<span className="text-sm text-muted-foreground">/bulan</span>
                </span>
              }
            />
          </div>
        </section>
      <section id="faq" className="pb-20">
          <h2 className="mb-8 text-center font-display text-2xl tracking-wide text-foreground">
            PERTANYAAN YANG SERING DITANYAKAN
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              {
                q: "Benarkah Robika gratis selamanya?",
                a: "Ya. Semua kurikulum, Kode Quest, CodeLab, dan AI Tutor gratis selamanya tanpa iklan dan tanpa paywall. Satu-satunya fitur berbayar adalah AI Mentor (Rp10rb/bulan) dengan trial gratis 1 minggu — dan kamu bisa berhenti kapan saja.",
              },
              {
                q: "Apakah saya harus bisa coding dulu?",
                a: "Tidak. Robika dirancang untuk pemula total: setiap bahasa dimulai dari nol dengan materi bertahap, latihan langsung, dan AI Tutor yang memandu tanpa memberi jawaban instan.",
              },
              {
                q: "Untuk usia berapa Robika cocok?",
                a: "Robika cocok untuk pelajar SMP/SMA ke atas dan siapa pun yang ingin mulai coding. Materi disusun sederhana dan menyenangkan, namun cukup dalam untuk membangun fondasi yang serius.",
              },
              {
                q: "Bahasa pemrograman apa saja yang diajarkan?",
                a: "Saat ini 9 bahasa: HTML & CSS, JavaScript, TypeScript, Python, SQL, Java, PHP, Go, dan C++. Setiap bahasa punya kurikulum lengkap dengan topik mendalam, contoh kode, dan kuis.",
              },
              {
                q: "Apakah bisa diakses dari HP?",
                a: "Bisa. Robika adalah aplikasi web yang dioptimalkan untuk layar ponsel dan bisa dipasang sebagai aplikasi (PWA) — jalankan offline untuk materi yang sudah dimuat.",
              },
              {
                q: "Bagaimana cara saya mendapat bantuan saat buntu?",
                a: "Gunakan AI Tutor yang memberi hint bertingkat, tanyakan ke AI Mentor (setelah aktivasi trial), atau ulangi materi modul — kunci belajar coding adalah mencoba dan memperbaiki sendiri.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-border bg-background px-5 py-4 transition hover:border-accent/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Icon
                    name="chevronRight"
                    size={14}
                    className="shrink-0 transition group-open:rotate-90"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © 2026 Robika — belajar coding tanpa biaya, dengan kualitas premium.
      </footer>
    </div>
  );
}