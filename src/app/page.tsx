import Link from "next/link";
import { BotAvatar } from "@/components/design/bot-avatar";
import { Icon } from "@/components/design/icon";
import { NpcChip } from "@/components/game/npc-chip";
import { SKIN_ITEMS } from "@/lib/shop/catalog";

const NODE_STYLE: Record<string, string> = {
  done: "border-emerald-400/60 bg-emerald-400/15 text-emerald-300",
  current: "border-cyan-300 bg-cyan-400/20 text-cyan-200 animate-pulse",
  locked: "border-border bg-input/30 text-foreground/40",
  boss: "border-fuchsia-400/70 bg-fuchsia-400/15 text-fuchsia-300",
};

const MAP_NODES = [
  { label: "Q", state: "done", href: "#quest", name: "Kode Quest" },
  { label: "A", state: "current", href: "#manfaat", name: "Akademi" },
  { label: "M", state: "boss", href: "#shop", name: "Toko & Mentor" },
  { label: "?", state: "neutral", href: "#faq", name: "FAQ" },
];

const QUEST_LOG = [
  {
    title: "Coding bukan untuk segelintir orang",
    desc: "Setiap anak — apa pun latar belakangnya — berhak belajar pemrograman dengan cara yang menyenangkan, tanpa biaya.",
  },
  {
    title: "Belajar sambil bermain, bukan menghafal",
    desc: "Game 2D, tantangan interaktif, dan reward bintang membuat konsep sulit terasa seperti petualangan, bukan pelajaran.",
  },
  {
    title: "Praktik langsung sejak menit pertama",
    desc: "CodeLab memberi editor nyata di browser: tulis kode, lihat hasilnya, ulangi sampai paham. Tidak ada teori tanpa praktik.",
  },
  {
    title: "Gratis selamanya, tanpa kompromi",
    desc: "Tanpa iklan, tanpa paywall materi, tanpa mengorbankan kualitas. AI Tutor dan kurikulum lengkap tersedia untuk semua.",
  },
];

const INVENTORY = [
  {
    icon: "book" as const,
    tone: "text-cyan-300",
    title: "Kurikulum 9 bahasa pemrograman",
    desc: "HTML & CSS, JavaScript, TypeScript, Python, SQL, Java, PHP, Go, dan C++ — dari dasar sampai mahir.",
  },
  {
    icon: "trophy" as const,
    tone: "text-amber-300",
    title: "Game Kode Quest",
    desc: "Terapkan logika coding untuk menyelesaikan level game 2D — bukti nyata bahwa kamu memahami materinya.",
  },
  {
    icon: "robot" as const,
    tone: "text-emerald-300",
    title: "AI Tutor yang tidak memanjakan",
    desc: "Saat buntu, AI memandu dengan hint bertingkat — bukan jawaban instan. Kamu yang menemukan solusinya.",
  },
  {
    icon: "brain" as const,
    tone: "text-violet-300",
    title: "AI Mentor pribadi",
    desc: "Butuh penjelasan mendalam atau proyek besar? Mentor AI menemani belajar 1-on-1, gratis 1 minggu percobaan.",
  },
  {
    icon: "star" as const,
    tone: "text-yellow-300",
    title: "Reward yang memotivasi",
    desc: "Kumpulkan bintang dan XP dari belajar, selesaikan misi harian, dan bangun streak belajar yang konsisten.",
  },
  {
    icon: "certificate" as const,
    tone: "text-lime-300",
    title: "Sertifikat pencapaian",
    desc: "Selesaikan kurikulum dan dapatkan sertifikat yang bisa ditampilkan sebagai bukti keterampilanmu.",
  },
];

const MODULES = [
  {
    code: "MOD-01",
    icon: "gamepad" as const,
    title: "Kode Quest",
    desc: "Belajar dengan game 2D. Tulis kode yang menggerakkan robot BOT-1 menembus dunia Robot Rescue.",
  },
  {
    code: "MOD-02",
    icon: "bolt" as const,
    title: "CodeLab",
    desc: "Editor ala VS Code dengan preview langsung. JavaScript & Python berjalan di browser.",
  },
  {
    code: "MOD-03",
    icon: "robot" as const,
    title: "AI Tutor",
    desc: "Dibantu AI yang tidak pernah memberi jawaban instan — dia memandu dengan hint bertingkat.",
  },
  {
    code: "MOD-04",
    icon: "brain" as const,
    title: "AI Mentor",
    desc: "Mentor pribadi untuk solusi mendalam. Gratis 1 minggu, lalu Rp10rb/bulan.",
  },
  {
    code: "MOD-05",
    icon: "gem" as const,
    title: "2 Mata Uang",
    desc: "Bintang dari belajar, gem dari top-up. Kosmetik eksklusif tanpa pay-to-win.",
  },
  {
    code: "MOD-06",
    icon: "shield" as const,
    title: "Rp0 untukmu",
    desc: "Semua materi dan CodeLab gratis selamanya. Tanpa iklan, tanpa paywall belajar.",
  },
];

const SHOP_ITEMS = [
  {
    name: "Paket Pelajar",
    tag: "GRATIS SELAMANYA",
    desc: "Semua kurikulum, Kode Quest, CodeLab, AI Tutor, 3 hint tiap 3 hari. Selamanya.",
    price: "Rp0",
    unit: "/bulan",
    cta: "AMBIL GRATIS",
    tone: "border-emerald-400/40",
  },
  {
    name: "Mentor Pass",
    tag: "TRIAL 1 MINGGU",
    desc: "AI Mentor pribadi tanpa batas topik. Trial 1 minggu gratis, lalu berhenti kapan saja.",
    price: "Rp10rb",
    unit: "/bulan",
    cta: "COBA GRATIS",
    tone: "border-fuchsia-400/40",
  },
];

const FAQ = [
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
];

export default function LandingPage() {
  const skin = SKIN_ITEMS[0];
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Robika" className="h-7 w-7 rounded-md" />
          <span className="font-display text-lg tracking-widest text-cyan-300">
            ROBIKA
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-sm border border-border px-3 py-1.5 font-display text-xs uppercase tracking-wider text-foreground/70 transition hover:border-cyan-400/50 hover:text-foreground"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-sm border border-cyan-400/50 bg-cyan-400/15 px-3 py-1.5 font-display text-xs uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/25"
          >
            Mulai
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4">
        <section className="base-floor relative mt-4 overflow-hidden rounded-lg border border-border bg-[#0c101d] p-6">
          <span className="blink absolute left-4 top-4 h-2 w-2 rounded-sm bg-cyan-400/80" />
          <span className="blink absolute right-6 top-8 h-2 w-2 rounded-sm bg-amber-400/70 [animation-delay:400ms]" />
          <span className="blink absolute bottom-24 left-10 h-2 w-2 rounded-sm bg-emerald-400/60 [animation-delay:900ms]" />
          <span className="absolute inset-x-0 bottom-0 h-16 scanline opacity-30" />

          <p className="relative font-mono text-[11px] leading-relaxed text-emerald-400/80">
            &gt; boot robika-os v2.0 … OK
            <br />
            &gt; memuat dunia Robot Rescue … OK
            <br />
            &gt; operator terdeteksi. selamat datang.
          </p>

          <div className="relative flex flex-col items-center pb-8 pt-6 text-center">
            <span className="breathe">
              <BotAvatar colors={skin.colors} size={80} />
            </span>
            <h1 className="mt-6 font-display text-3xl tracking-wide text-foreground sm:text-5xl">
              Belajar Coding
              <br />
              <span className="glow-text text-accent">Jadi Game.</span>
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Robika mengubah belajar coding jadi petualangan 2D dengan AI tutor
              pribadi, editor ala VS Code, dan kurikulum multi-stack. Gratis
              selamanya — tanpa iklan, tanpa paywall.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-sm border border-cyan-400/50 bg-cyan-400/15 px-6 py-3 font-display text-sm uppercase tracking-widest text-cyan-200 transition hover:bg-cyan-400/25"
              >
                <Icon name="play" size={14} /> Mulai Misi Gratis
              </Link>
              <Link
                href="/login"
                className="font-display text-xs uppercase tracking-widest text-foreground/60 underline-offset-4 transition hover:text-foreground hover:underline"
              >
                Saya sudah punya akun
              </Link>
            </div>
            <p className="mt-4 font-display text-[10px] uppercase tracking-widest text-foreground/35">
              Rp0 · tanpa kartu kredit · langsung main
            </p>
          </div>
        </section>

        <section className="base-floor mt-4 rounded-lg border border-border bg-[#0c101d] p-6">
          <p className="mb-4 text-center font-display text-[10px] uppercase tracking-widest text-foreground/45">
            Peta Dunia · pilih titik untuk menjelajah
          </p>
          <div className="flex items-start justify-between gap-2">
            {MAP_NODES.map((n, i) => (
              <div key={n.href} className="flex flex-1 items-center">
                <Link href={n.href} className="group flex flex-col items-center gap-1.5">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full border font-display text-sm ${NODE_STYLE[n.state]} transition group-hover:scale-110`}
                  >
                    {n.label}
                  </span>
                  <span className="font-display text-[9px] uppercase tracking-wider text-foreground/50 group-hover:text-foreground/80">
                    {n.name}
                  </span>
                </Link>
                {i < MAP_NODES.length - 1 && (
                  <span className="mt-5 h-0.5 flex-1 bg-cyan-400/50" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="quest" className="mt-10 rounded-lg border border-border scroll-mt-4">
          <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
            Quest Log · Kenapa Robika Ada?
          </h2>
          <ul className="divide-y divide-border/60">
            {QUEST_LOG.map((q) => (
              <li key={q.title} className="flex gap-3 px-4 py-4">
                <Icon name="check" size={14} className="mt-1 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-semibold text-foreground">{q.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{q.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="manfaat" className="mt-10 scroll-mt-4">
          <h2 className="mb-4 font-display text-xs uppercase tracking-widest text-foreground/60">
            Inventaris · Apa yang Kamu Dapatkan
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {INVENTORY.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-border bg-card/50 p-4 transition hover:border-cyan-400/40"
              >
                <span className={item.tone}>
                  <Icon name={item.icon} size={18} />
                </span>
                <p className="mt-2 font-display text-xs uppercase tracking-wider text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="modul" className="mt-10 scroll-mt-4 rounded-lg border border-border">
          <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
            Terminal Sistem · Satu Platform, Semua yang Kamu Butuhkan
          </h2>
          <ul className="divide-y divide-border/60">
            {MODULES.map((m) => (
              <li key={m.code} className="flex items-start gap-4 px-4 py-4">
                <span className="w-14 shrink-0 pt-1 font-mono text-[11px] text-cyan-400/80">{m.code}</span>
                <span className="shrink-0 pt-0.5 text-foreground/70">
                  <Icon name={m.icon} size={16} />
                </span>
                <div>
                  <p className="font-display text-sm uppercase tracking-wider text-foreground">{m.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="shop" className="mt-10 scroll-mt-4">
          <h2 className="mb-4 font-display text-xs uppercase tracking-widest text-foreground/60">
            Toko Perlengkapan · Harga yang Jujur
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SHOP_ITEMS.map((item) => (
              <div key={item.name} className={`rounded-md border bg-[#0c101d] p-5 ${item.tone}`}>
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm uppercase tracking-wider text-foreground">{item.name}</p>
                  <span className="rounded-sm border border-border bg-input/40 px-1.5 py-0.5 font-display text-[9px] uppercase tracking-wider text-foreground/60">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                <p className="mt-4 font-display text-2xl text-accent">
                  {item.price}
                  <span className="text-sm text-muted-foreground">{item.unit}</span>
                </p>
                <Link
                  href="/register"
                  className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 font-display text-xs uppercase tracking-widest text-cyan-200 transition hover:bg-cyan-400/25"
                >
                  <Icon name="cart" size={13} /> {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-10 scroll-mt-4">
          <h2 className="mb-4 font-display text-xs uppercase tracking-widest text-foreground/60">
            Tanya BOT-1 · Pertanyaan yang Sering Ditanyakan
          </h2>
          <div className="space-y-2">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-md border border-border bg-[#0c101d] px-4 py-3 transition hover:border-cyan-400/30"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="pt-1 text-sm font-semibold text-foreground">
                    <span className="mr-2 font-mono text-[11px] text-cyan-400/80">&gt;</span>
                    {item.q}
                  </span>
                  <Icon
                    name="chevronRight"
                    size={14}
                    className="mt-1 shrink-0 text-foreground/40 transition group-open:rotate-90"
                  />
                </summary>
                <div className="mt-3 flex items-start gap-3 border-t border-border/60 pt-3">
                  <NpcChip name="BOT-1" size={32} />
                  <p className="text-sm leading-relaxed text-foreground/75">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="my-12 rounded-lg border border-cyan-400/40 bg-[#0c101d] p-8 text-center">
          <p className="font-display text-xl tracking-wide text-foreground">
            Dunia Robot Rescue menunggumu.
          </p>
          <Link
            href="/register"
            className="mt-5 inline-flex items-center gap-2 rounded-sm border border-cyan-400/50 bg-cyan-400/15 px-6 py-3 font-display text-sm uppercase tracking-widest text-cyan-200 transition hover:bg-cyan-400/25"
          >
            <Icon name="rocket" size={14} /> Mulai Misi Sekarang
          </Link>
        </section>
      </main>

      <footer className="pb-6 pt-2 text-center font-display text-[10px] uppercase tracking-widest text-foreground/30">
        Robika Base · © 2026 · node stabil · koneksi aktif
      </footer>
    </div>
  );
}
