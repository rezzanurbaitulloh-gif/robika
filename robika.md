# ROBIKA

**Platform Belajar Coding Interaktif Berbasis AI dengan Konsep Game 2D**

*Dokumen Konsep Lengkap — Versi 1.0*

---

## 1. Ringkasan Eksekutif

**Robika** adalah platform web belajar coding yang menggabungkan tiga kekuatan besar: (1) kurikulum pembelajaran yang mencakup hampir seluruh stack pengembangan perangkat lunak, (2) pendampingan AI yang sabar dan kontekstual, serta (3) pengalaman belajar berbasis game 2D yang membuat proses belajar terasa seperti bermain. Robika dibangun dengan prinsip **"gratis untuk belajar, mikro-payment untuk kenyamanan"** — seluruh materi pembelajaran dapat diakses tanpa biaya, sementara layanan bantuan tambahan (hint, AI chat, kosmetik) tersedia dengan harga yang sangat ramah.

Nama "Robika" berasal dari gabungan *Robot* dan *Kode* — merujuk pada maskot utama platform, **BOT-1**, sebuah robot kecil yang berevolusi bersama perjalanan belajar setiap pengguna.

Robika dioperasikan dengan **biaya operasional Rp0** melalui arsitektur free-tier (Vercel, Supabase, Gemini API, dan teknologi open source), sehingga seluruh dana dari pengguna dapat diinvestasikan kembali untuk pengembangan platform.

---

## 2. Latar Belakang

### 2.1 Kesenjangan Literasi Digital dan Programming di Indonesia

Dunia saat ini bergerak menuju ekonomi digital. Kebutuhan akan tenaga kerja dengan kemampuan pemrograman terus meningkat setiap tahunnya. Namun, realitas di Indonesia menunjukkan kesenjangan yang signifikan:

1. **Harga kursus programming yang mahal** — kursus privat maupun bootcamp berkualitas umumnya dipatok puluhan hingga ratusan juta rupiah, di luar jangkauan sebagian besar pelajar dan mahasiswa.
2. **Konten gratis yang tidak terstruktur** — platform video dan artikel gratis tersedia melimpah, tetapi tidak memiliki kurikulum yang terarah, sistem evaluasi, maupun mekanisme motivasi yang membuat pengguna konsisten belajar.
3. **Bahasa** — mayoritas materi pembelajaran berkualitas tersedia dalam bahasa Inggris, menjadi hambatan bagi pemula berbahasa Indonesia.
4. **Tingkat putus belajar (dropout) yang tinggi** — belajar coding secara mandiri tanpa struktur dan umpan balik cepat menyebabkan frustrasi; banyak yang menyerah di minggu-minggu awal.

### 2.2 Era AI sebagai Peluang

Perkembangan kecerdasan buatan (AI) generatif membuka paradigma baru dalam pendidikan:

- AI dapat bertindak sebagai **tutor pribadi** yang menjelaskan materi dengan gaya yang menyesuaikan level pemahaman siswa.
- AI dapat **membaca kode** yang ditulis siswa, mendiagnosis kesalahan, dan memberikan umpan balik secara instan — sesuatu yang sebelumnya hanya bisa dilakukan oleh mentor manusia.
- AI dapat **men-generate soal latihan** secara adaptif sesuai kemampuan masing-masing siswa.

Perpaduan AI + kurikulum terstruktur + gamifikasi adalah kombinasi yang belum banyak diisi dengan baik di pasar Indonesia.

### 2.3 Pelajaran dari Platform Global

Riset terhadap platform terbaik dunia (CodeCombat, CodinGame, GameCode, CheckiO, ZenPy, CodeGrind, Coding Fantasy, Pybites) menghasilkan delapan pola yang terbukti membuat platform belajar coding adiktif:

1. Karakter yang bertumbuh dan dapat dikustomisasi (CodeCombat, GameCode)
2. Kompetisi multi-dimensi dengan beragam leaderboard (ZenPy, CodinGame)
3. Boss battle berbatas waktu dengan cooldown retry (GameCode)
4. Belajar dari solusi komunitas setelah menyelesaikan soal (CheckiO)
5. Peta dunia dengan unlock berurutan (CheckiO, CodeCombat)
6. Bonus kecepatan — menyelesaikan soal cepat = XP ekstra (ZenPy, CodinGame)
7. Badge dengan tingkat kelangkaan (Common hingga Mythic) (GameCode)
8. Framing positif terhadap kesalahan — "setiap error adalah peluang XP" (GameCode)

Robika mengadopsi seluruh pola tersebut dengan tetap menjaga satu prinsip: **tidak ada pay-to-win** — pembayaran tidak pernah memengaruhi progres pembelajaran.

---

## 3. Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah yang dijawab oleh Robika adalah:

1. Bagaimana menyediakan pembelajaran coding yang **gratis, terstruktur, dan berbahasa Indonesia**?
2. Bagaimana membuat proses belajar coding **menarik dan adiktif** sehingga tingkat ketahanan (retention) pengguna tinggi?
3. Bagaimana memanfaatkan AI untuk menjadi **tutor pribadi** yang sabar, kontekstual, dan terjangkau?
4. Bagaimana menciptakan model bisnis yang **berkelanjutan tanpa memberatkan pengguna**?
5. Bagaimana membangun platform "super premium" dengan **biaya operasional nol rupiah**?

---

## 4. Tujuan

### 4.1 Tujuan Umum

Membangun platform web belajar coding berbasis AI dengan pengalaman game 2D yang berkualitas premium, gratis untuk pembelajaran, dan berkelanjutan secara finansial.

### 4.2 Tujuan Khusus

1. Menyediakan **kurikulum pembelajaran multi-stack** (Frontend, Backend, Database, UI/UX, Fullstack, dan lainnya) dengan penyesuaian level pengguna (pemula/menengah/lanjut).
2. Membangun **mesin game 2D** (Kode Quest) di mana kode yang ditulis pengguna menggerakkan karakter dan menyelesaikan misi.
3. Membangun **CodeLab** — lingkungan coding seperti VS Code di browser dengan eksekusi multi-bahasa dan penilaian otomatis.
4. Membangun **AI Tutor** (gratis) dan **AI Mentor Chat** (berbayar) berbasis Gemini API.
5. Membangun **sistem ekonomi dua mata uang** (Bintang sebagai reward, Gem sebagai mata uang pembelian) serta **sistem Hint** yang ramah.
6. Membangun **sistem gamifikasi lengkap** (XP, streak, badge, leaderboard, sertifikat, evolusi hero).
7. Mengintegrasikan **pembayaran** melalui Midtrans (QRIS, VA, e-wallet) dengan biaya tetap Rp0.
8. Men-deploy ke Vercel dengan biaya operasional nol.

---

## 5. Manfaat

| Pihak | Manfaat |
|---|---|
| **Pengguna** | Belajar coding gratis dan menyenangkan, dibimbing AI, berbahasa Indonesia, motivasi tinggi |
| **Orang tua** | Anak belajar keterampilan masa depan dengan biaya nol atau sangat murah |
| **Sekolah/Guru** | Bahan pendamping pembelajaran (fase lanjut: mode kelas) |
| **Industri** | Calon tenaga kerja dengan skill coding yang lebih banyak dan merata |
| **Pengembang (owner)** | Sumber pendapatan berkelanjutan dari mikro-payment, portofolio, dan aset produk |

---

## 6. Konsep Produk

### 6.1 Deskripsi Umum

Robika adalah aplikasi web (responsive, mobile-friendly) dengan alur pengguna sebagai berikut:

```
Onboarding → Assessment adaptif per stack → Pilih Dunia/Jalur
    ↓
Per Modul: 📖 Materi → 🧪 Kuis → 🕹️ Kode Quest (game) → 💻 CodeLab (challenge)
    ↓
Pendamping: 🤖 AI Tutor (gratis) • 💬 AI Mentor Chat (berbayar) • 🛍️ Shop kosmetik
    ↓
Progres: XP, Streak, Badge, Evolusi Hero BOT-1, Sertifikat, Leaderboard
```

### 6.2 Empat Pilar Produk

#### Pilar 1: Kurikulum Multi-Stack

Robika mencakup 16 kategori stack:

| Kategori | Isi |
|---|---|
| Fundamental | Logika, algoritma, struktur data, cara kerja komputer |
| Web Frontend | HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind |
| Web Backend | Node.js, Express, Python (FastAPI/Flask), Go, PHP/Laravel, Java/Spring |
| Database | SQL, PostgreSQL, MySQL, MongoDB, SQLite, Redis, ORM, Supabase |
| Mobile | Flutter, React Native, Kotlin, Swift (dasar) |
| UI/UX | Prinsip desain, design system, aksesibilitas, Figma dasar |
| DevOps & Tools | Git, Linux, Docker, CI/CD, deployment, testing |
| Data & AI | Python data, Pandas, visualisasi, dasar ML, API AI |
| Fullstack | Proyek end-to-end |
| Career Path | Portofolio, resume, mock interview |
| Game Dev | JS canvas/Phaser, Godot intro |
| Security | Dasar cybersecurity etis (level menengah ke atas) |

**Model jalur**: pengguna memilih jalur (misal Frontend, Backend, Fullstack), lalu tiap jalur menyusun stack di atas secara berurutan; pengguna tetap bebas menjelajah antar stack.

#### Pilar 2: Mode Game — "Kode Quest"

Game 2D bergaya pixel art yang dibangun dengan Phaser 3. Karakter **BOT-1** hanya bergerak jika kode yang ditulis pengguna benar.

| Elemen | Desain |
|---|---|
| Dunia & narasi | Peta dunia berbasis node; Dunia 1: "Robot Rescue" (BOT-1 tersesat, setiap level = misi cerita) |
| Level Dunia 1 | 1) Sequence → 2) Loop → 3) If → 4) Function → 5) Fix-bug → 6) Maze + Boss |
| Boss level | Kombinasi konsep berbatas waktu; kalah = cooldown retry 30 menit atau instant retry dengan Gem |
| Penilaian bintang | 3 bintang tanpa hint, 2 bintang dengan 1 hint, 1 bintang dengan 2+ hint |
| Speed bonus | Menyelesaikan level cepat = bonus XP |
| Error = XP | Memperbaiki error tanpa hint = bonus XP |
| Juice | Confetti, screen shake, efek partikel, sound effect (aset Kenney, CC0) |

**Keamanan eksekusi kode**: kode pengguna dijalankan dalam iframe sandbox (tanpa akses network/file), dengan timeout dan API game terbatas (moveForward, turnLeft, jump, collect, dst).

#### Pilar 3: Mode CodeLab

Lingkungan coding seperti VS Code berbasis **Monaco Editor**:

- File explorer + tab multi-file
- IntelliSense, syntax highlighting, minimap
- Preview iframe untuk challenge web (HTML/CSS/JS)
- Console untuk Python (eksekusi via **Pyodide** — Python WASM di browser)
- 4 jenis challenge: **Output** ("tampilkan X"), **Complete-code** (lengkapi TODO), **Fix-bug** (perbaiki kode rusak), **Free playground** (eksplorasi bebas)
- **Auto-grading** dengan test case tersembunyi
- **"Lihat Solusi"** — setelah selesai, pengguna dapat melihat solusi komunitas + editor's choice + tombol suka (pola CheckiO)

#### Pilar 4: AI

| Fitur AI | Gratis/Berbayar | Deskripsi |
|---|---|---|
| AI Tutor (in-lesson) | Gratis | Chat kontekstual: tahu level, bahasa (ID/EN), materi aktif, kode terakhir; hint bertingkat 3 level; penjelasan kemenangan; rekomendasi materi ulang |
| AI Debugger | Gratis | Menjelaskan error dalam bahasa manusia |
| AI Exercise Generator | Gratis | Men-generate latihan adaptif |
| AI Mentor Chat | Berbayar (trial 1 minggu) | ChatGPT-like: paste kode/error, kirim gambar error (multimodal), tanya konsep; **guardrail: tidak menyelesaikan soal game/kuis secara langsung** |

### 6.3 Sistem Ekonomi & Monetisasi

| Mata uang | Cara didapat | Fungsi |
|---|---|---|
| Bintang | Reward: bintang level, streak, daily challenge, achievement, speed bonus | Kosmetik Common–Epic |
| Gem | Dibeli uang (Midtrans) | Kosmetik Legendary/Mythic, instant boss retry |
| Hint | Gratis 3 hint, refresh tiap 3 hari (cap 3) | Hint bertingkat di game & codelab |

**Paket hint**: 10 = Rp2.000 • 30 = Rp5.000 • 150 = Rp20.000

**Paket gem**: 100 Gem = Rp10.000 • 300 Gem = Rp25.000 (+50%) • 700 Gem = Rp50.000 (+75%)

**AI Mentor Chat**: trial gratis 1 minggu (1x per akun, verifikasi email) → Rp10.000/bulan

**Prinsip**: kosmetik tidak pernah memengaruhi progres belajar. Belajar 100% gratis.

### 6.4 Gamifikasi

- XP, level, streak harian
- Badge 5 rarity: Common / Rare / Epic / Legendary / Mythic
- Multi-leaderboard (Fase 2): Progres, XP, Streak, Kecepatan
- Daily challenge (Fase 2)
- Sertifikat PDF per stack (dibuat client-side, gratis)
- Evolusi & kustomisasi hero BOT-1

---

## 7. Arsitektur Teknis

### 7.1 Stack Utama

```
Next.js 16 + TypeScript → Vercel Hobby ($0)
├── Supabase Free: Auth, Postgres, Storage ($0)
│   └── GitHub Actions cron harian untuk anti-pause
├── AI Layer (server routes /api/ai/*):
│   ├── Gemini API free tier (gemini flash series) — mesin utama
│   ├── Groq free tier + Cloudflare Workers AI — failover otomatis saat 429
│   ├── Streaming SSE, cache prompt, rate-limit per user, model routing
├── Kode Quest: Phaser 3 + sandboxed iframe worker + Kenney assets (CC0)
├── CodeLab: Monaco (@monaco-editor/react, dynamic import) + Pyodide (WASM)
├── Payment: Midtrans Snap (QRIS, VA, e-wallet) — daftar gratis, potongan ~4-5%/transaksi
└── UI: shadcn/ui + Tailwind v4 + design system (ui-ux-pro-max) + GSAP
```

### 7.2 Strategi AI (kunci biaya Rp0)

1. **Pre-generation**: 90% konten (lesson, soal, contoh kode) digenerate sekali saat build → disimpan sebagai file statis → runtime AI hanya untuk chat/hint
2. **Model routing**: tugas sederhana → flash-lite; tutor → flash; gambar → flash multimodal
3. **Cache**: prompt identik dijawab sekali, disimpan
4. **Rate limit**: AI Tutor ~20 pesan/hari, AI Mentor ~30 pesan/hari, batas ukuran paste
5. **Failover**: 429 → otomatis pindah ke Groq → Cloudflare Workers AI

### 7.3 Skema Database (Supabase)

| Tabel | Isi |
|---|---|
| `profiles` | Level per stack, bahasa, XP, streak, avatar |
| `paths`, `modules`, `lessons`, `exercises` | Konten kurasi |
| `progress`, `submissions` | Progres & kiriman kode |
| `achievements` | Badge yang dimiliki |
| `hints` | Balance hint, last_refreshed_at |
| `wallets` | Bintang & gem balance |
| `inventory`, `shop_items` | Kosmetik dimiliki & katalog |
| `transactions` | Order, item, amount, status, webhook_verified |
| `subscriptions` | Plan, trial_used, starts_at, ends_at |
| `mentor_messages` | Riwayat chat + image_url |
| `game_worlds`, `game_levels` | Data level game |
| `boss_attempts` | Cooldown retry boss |
| `solutions`, `solution_likes` | Solusi komunitas (Fase 2) |

---

## 8. Keamanan & Etika

1. **Sandbox kode**: iframe `sandbox`, timeout eksekusi, API terbatas, tanpa akses network/file
2. **Verifikasi pembayaran**: webhook Midtrans diverifikasi server-side
3. **Anti-abuse**: verifikasi email, 1 trial per akun, rate limit harian
4. **Guardrail AI**: AI Mentor tidak memberikan jawaban langsung untuk soal; konten dimoderasi
5. **Privasi**: API keys hanya di server (.env.local, tidak pernah di commit); data pengguna hanya dipakai untuk fungsi platform
6. **Etika monetisasi**: tanpa pay-to-win, tanpa iklan predator, tanpa dark pattern
7. **Catatan legal (masa depan)**: penjualan digital memerlukan NIB/PSE saat skala besar

---

## 9. Roadmap

| Fase | Durasi | Isi |
|---|---|---|
| **MVP** | 8-10 minggu | Assessment + Dunia 1 "Robot Rescue" (6 level + boss) + CodeLab (2 jenis challenge, JS+Python) + Hero BOT-1 + sistem bintang/gem/hint + AI Tutor + AI Mentor (trial, redeem manual) + Shop kosmetik dasar + progres/sertifikat |
| **Fase 2** | 8-12 minggu | Midtrans penuh (top-up hint/gem/langganan), fix-bug & playground penuh, game level Python, jalur Backend/Database/UI-UX, multi-leaderboard, daily challenge, "Lihat Solusi" |
| **Fase 3** | lanjut | Jalur Mobile/DevOps/Data, Clash of Codes 1v1, Bot Arena, escape room bulanan, level builder, mode kelas, global chat |

---

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Kuota Gemini free tier jebol | Pre-generation maksimal, failover, queue, batas harian |
| Abus trial/top-up | Verifikasi email, 1 trial/akun, webhook verifikasi server-side |
| Pay-to-win merusak kepercayaan | Kosmetik murni, belajar tak tersentuh pembayaran |
| Scope membengkak | Konten = JSON skema reusable; fitur fase berikutnya dikunci |
| Sandbox disalahgunakan | iframe sandbox + timeout + API terbatas |
| Supabase free pause (idle 1 minggu) | Cron GitHub Actions harian |

---

## 11. Metrik Keberhasilan (KPI)

| Kategori | Metrik |
|---|---|
| Adopsi | Jumlah pengguna terdaftar, jumlah akun terverifikasi |
| Engagement | DAU/MAU, retention D1/D7, lesson completion rate, streak aktif |
| Belajar | Jumlah level game diselesaikan, jumlah challenge diselesaikan, waktu belajar rata-rata |
| Monetisasi | Konversi trial ke pembayaran, ARPU, jumlah transaksi hint/gem/langganan |
| Kualitas | Skor kepuasan, tingkat keberhasilan tanpa hint |

---

## 12. Kesimpulan

Robika lahir dari keyakinan bahwa **belajar coding adalah hak setiap orang, bukan hak mereka yang mampu membayar**. Dengan menggabungkan kurikulum multi-stack, pengalaman game 2D yang menyenangkan, pendampingan AI yang sabar, ekonomi yang ramah, dan arsitektur berbiaya nol, Robika bertujuan menjadi jembatan antara keinginan belajar dan kemampuan belajar.

Seluruh pola terbaik dari platform global telah dipelajari dan diadopsi — bukan untuk meniru, tetapi untuk memastikan setiap momen di Robika terasa menarik, setiap error menjadi pelajaran, dan setiap pengguna — dari pemula hingga yang lanjut — merasa: *belajar coding itu menyenangkan, dan mereka bisa.*

**Robika: Pelajari Kodenya. Taklukkan Dunianya.**
