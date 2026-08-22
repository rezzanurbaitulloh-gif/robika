# ROBIKA — MIGRATION AUDIT (PHASE 0)

> Sumber kebenaran: `prdlengkap.md` (Master Migration PRD)
> Tanggal audit: 22 Agustus 2026 · Commit basis: `16251aa`
> Metode: inspeksi langsung kode — bukan asumsi. Setiap klaim di bawah diverifikasi terhadap file.

---

## 1. Ringkasan Eksekutif

ROBIKA saat ini adalah **platform belajar coding gamified** yang sehat secara teknis (build hijau, 276/276 test pass, auth & payment aman). Fondasi untuk target "pixel coding adventure" sudah ada sebagian: game grid BOT-1 dengan validasi server-authoritative, Academy multi-bahasa, CodeLab + Studio, AI subsystem lengkap, ekonomi + Midtrans terverifikasi.

Yang **belum ada sama sekali**: dunia adventure yang bisa dijelajahi (NPC, quest, dialogue), sistem concept ID lintas-modul, feature flags, offline/local save, asset pixel-art produksi, dan analytics.

Kesenjangan arsitektur paling kritis: **game engine saat ini adalah simulator pola-terbatas** (`moveForward/turnLeft/turnRight`), sedangkan target PRD menuntut **kode sungguhan berdampak ke dunia** (contoh vertical slice: `if (power >= 50) openGate()`).

---

## 2. Inventaris Sistem Existing (hasil inspeksi)

### 2.1 Framework & Deployment
| Item | Fakta |
|---|---|
| Framework | Next.js 16.3.1 App Router · React 19.2.8 · TypeScript strict |
| Styling | Tailwind CSS v4 · lucide-react · Base UI · sonner · next-themes |
| State | Zustand terpasang di package.json tapi **tidak ada store yang dipakai** |
| Package manager | npm |
| Deploy | Vercel (`robika.vercel.app`) · PWA manifest ada, service worker sudah dicabut total |
| Testing | Vitest 28 file / 276 test · tsc strict bersih · eslint bersih |

**Klasifikasi: KEEP**

### 2.2 Autentikasi & Sesi
- Supabase Auth: email/password + OAuth Google; callback PKCE di `/auth/callback`.
- `middleware.ts` adalah jalur sesi aktif (terverifikasi via header test); membawa cookie 30 hari (`SUPABASE_COOKIE_OPTIONS`). File ganda `proxy.ts` sudah dihapus.
- Route protection via matcher: `/level /world /codelab /mentor /dashboard /onboarding /shop`.
- **Tidak ada guest mode**, tidak ada role/admin check di kode aplikasi (hanya factory admin client dengan service-role key di `src/lib/db/admin.ts`, belum dipakai untuk RBAC).

**Klasifikasi: KEEP** (+ NEW nanti: role, guest, account conversion — fase lanjut)

### 2.3 Database
11 tabel aktif (migrasi `0001_init.sql` s/d `0008_codelab_progress.sql`):
```
profiles · wallets · hints · inventory · progress · purchases
subscriptions · achievements · boss_attempts · learn_progress · codelab_progress
```
- Semua migrasi bersifat aditif; tidak ada riwayat DROP.
- RLS mengikuti pola existing (user hanya akses data miliknya).

**Klasifikasi: KEEP** (+ NEW tabel konseptual PRD #51 bila dibutuhkan — selalu cek duplikat dulu)

### 2.4 Game Engine & BOT-1 ⚠️ temuan penting
- **Phaser 4 terpasang di dependencies tetapi NOL penggunaan** (tidak ada import di seluruh `src/`).
- Game aktual = **simulator deterministik custom**: `src/lib/game/simulator.ts` (295 baris).
  - Parser berbasis regex/pola untuk `moveForward()`, `turnLeft()`, `turnRight()`.
  - Mendukung `for` loop (di-unroll maks 64 iterasi), fungsi user sederhana, kondisi `ifBlockedAhead` / `ifCanMove`.
  - **Bukan eksekusi JS sungguhan** — interpreter pola terbatas.
- Renderer = komponen React `game-board.tsx` (202 baris): grid DOM/CSS berwarna, tanpa sprite/canvas.
- Kekuatan: engine ini bisa dijalankan **identik di client dan server** → validasi server-authoritative murni.

**Klasifikasi: REFACTOR + EXTEND** — pertahankan prinsip "satu engine, dua sisi", perluas menjadi runtime kode terbatas yang mendukung variabel, if/else, dan API dunia (`openGate()` dll.) sesuai PRD #13–15.

### 2.5 Konten Dunia
- `src/content/world-1/world-1.json`: struktur flat `{world, name, levels[]}`.
- 6 level + boss; tiap level: grid ASCII (`# P C G`), goal type, quiz+lesson tertanam, judul dwibahasa (id/en), starterCode/solution, xpReward, parMs.
- Belum ada konsep REGION/NPC/QUEST/OBJECT/SECRET.

**Klasifikasi: MIGRATE** ke skema data-driven WORLD → REGION → MAP → NPC → QUEST → CHALLENGE (PRD #10–12), mempertahankan world-1 sebagai konten pertama region "Robot District".

### 2.6 Validasi Server (pola emas yang wajib dipertahankan)
`/api/game/complete`: validasi stars 1–3 → level exists → **re-simulasi kode server-side** → cek waktu minimum (anti-autoclick) → cooldown reward → auth wajib.

**Klasifikasi: KEEP** — pola ini adalah fondasi security gameplay; semua challenge baru WAJIB ikut pola ini.

### 2.7 Academy (/learn)
- 9 bahasa × 6–7 modul = **57 modul** statis dari TS (`src/content/curriculum/languages/`).
- Tiap modul: materi + kuis; progres tersimpan di `learn_progress`.
- ID modul ada (`cpp-pengenalan` dst.) tetapi **belum ada concept ID stabil lintas-sistem** gaya `javascript.conditions`.

**Klasifikasi: KEEP + EXTEND** (concept registry baru sebagai jembatan Academy↔Game↔CodeLab↔AI)

### 2.8 CodeLab
- 18 tantangan bug-fix (`challenges.json`) + progress `codelab_progress`.
- Studio: Monaco editor; preview HTML/CSS dalam iframe `sandbox="allow-scripts allow-popups"` ✓.
- Runner JS: `new Function("console", code)` dengan console proxy — **sandbox lemah** (thread utama, globalThis masih terjangkau).
- Python via Pyodide (WASM) — sandbox relatif baik.
- Belum ada: file/folder/tabs/project management.

**Klasifikasi: KEEP (fitur) + REFACTOR (runner)** — hardening sandbox sebelum fitur sharing/kolaborasi; project management = EXTEND.

### 2.9 AI
Subsystem lengkap di `src/lib/ai/`: provider registry (kunci via env server-side saja ✓), kuota harian (`limits.ts`), SSE streaming, cache, prompts.
- AI sudah berperan sebagai assistant (mentor/hint) — belum ada Tutor/Debugger/NPC modes.
- Usage tracking: kuota harian ada; persistensi metrik pemakaian belum.

**Klasifikasi: KEEP + EXTEND** (mode Tutor/Debugger/AI-NPC; AI TETAP non-authority sesuai PRD #24–28)

### 2.10 Ekonomi & Pembayaran
- Midtrans Snap: `/api/payments/create`, `/trial`, `/webhook` — webhook **memverifikasi signature SHA512** (`verifyNotificationSignature`) ✓, status dimapping server-side ✓.
- Katalog 7 item (hints/gems/mentor); skin bot 4 item.
- Ekonomi inti: XP/stars/gems/hints; libs `src/lib/core/` (xp, stars, hints, boss, assessment) + test lengkap.
- Reward diberikan server-side pada endpoint completion ✓.

**Klasifikasi: KEEP** — flow payment & economy sudah memenuhi PRD #36–39. Tidak diubah pada migration awal.

### 2.11 Aset Visual
- `public/`: hanya icon PWA (192/512/maskable), logo.png, SVG boilerplate Next.js.
- **Nol aset pixel-art produksi** — board game dirender CSS blok warna.

**Klasifikasi: NEW** — pipeline aset (Pixel Art Bible → Asset Manifest → PixelLab MCP) dibangun dari nol. PixelLab MCP tersedia di environment ini ✓.

### 2.12 Offline & Sync
- Tidak ada local save, tidak ada sync queue, SW dicabut.

**Klasifikasi: NEW** (Phase 12–13 PRD — dikerjakan belakangan, bukan sekarang)

### 2.13 Navigasi
- Existing: bottom-nav mobile + dropdown "Lainnya" (7 link), navbar desktop.
- Target nav PRD #7 menambah: Adventure, Quest, Inventory, Achievement.

**Klasifikasi: MIGRATE bertahap** — deep link lama tetap hidup; item baru ditambahkan di belakang feature flag.

### 2.14 Analytics & Admin
- Analytics: tidak ada → **NEW** (event inti per PRD #56).
- Admin panel: belum ada → ditunda sampai core stabil (PRD #55).

---

## 3. Tabel Klasifikasi Master

| Sistem | Klasifikasi | Catatan |
|---|---|---|
| Next.js/React/Tailwind/Vitest/Vercel | **KEEP** | fondasi sehat |
| Auth Supabase + middleware sesi 30 hari | **KEEP** | tambahan role/guest belakangan |
| Database 11 tabel + RLS | **KEEP** | migrasi baru selalu aditif |
| Simulator BOT-1 (server+client identik) | **REFACTOR/EXTEND** | perluas jadi runtime kode terbatas |
| Renderer grid React | **KEEP dulu** | Phaser 4 (unused) jadi kandidat engine adventure — keputusan terpisah |
| World JSON flat | **MIGRATE** | skema WORLD→REGION→QUEST baru, world-1 jadi konten pertama |
| Pola validasi `/api/game/complete` | **KEEP** | wajib untuk semua challenge baru |
| Academy 57 modul | **KEEP + EXTEND** | + concept ID + mastery |
| CodeLab + Studio | **KEEP + REFACTOR runner** | sandbox hardening |
| AI subsystem | **KEEP + EXTEND** | mode tutor/debugger/npc |
| Ekonomi + Midtrans | **KEEP** | sudah patuh PRD |
| Achievements (10 badge) | **EXTEND** | tambah kategori learning/adventure |
| Navigasi | **MIGRATE bertahap** | flag-gated |
| Aset pixel-art | **NEW** | dari nol via PixelLab |
| NPC/dialogue/quest | **NEW** | inti vertical slice |
| Concept registry + mastery | **NEW** | jembatan 4 sistem |
| Feature flags | **NEW** | syarat sebelum sentuh prod |
| Offline/local save/sync | **NEW** | fase lanjut |
| Analytics | **NEW** | event inti saja dulu |
| Admin panel | **DEFERRED** | setelah core stabil |

---

## 4. Risiko

### Database 🟡
- Semua kebutuhan baru (concepts, mastery, quests, npc_dialogues, ai_usage, sync_queue) **aditif** — tidak menyentuh tabel existing → risiko rendah selama aturan "no drop" ditegakkan.
- `learn_progress` existing harus tetap satu-satunya sumber progres modul; mastery concept disimpan **terpisah** agar tidak duplikasi sistem progres (PRD #19).

### Security 🔴 prioritas
1. Runner CodeLab `new Function` di thread utama — harden (Worker/iframe isolation) **sebelum** fitur apa pun yang mengeksekusi kode user lebih bebas.
2. Runtime adventure baru wajib: restricted API + timeout + iteration/output cap (PRD #14–15, #23).
3. AI tetap non-authority: tidak boleh menyentuh XP/gems/inventory/quest completion (PRD #27) — sudah konsisten, dipertahankan.

### Aset 🟡
- Identitas visual "pixel-art" saat ini **tidak ada sama sekali** → seluruh kesan produk bergantung pada pipeline baru. Wajib: Pixel Art Bible + sample approval SEBELUM generasi massal (PRD #44).

### Arsitektur 🟡
- Vertical slice menuntut `if (power >= 50) openGate()` — simulator existing tidak sanggup. Keputusan teknis (sudah diambil, lihat §5): perluas interpreter terbatas, BUKAN eval/Function constructor, agar validasi server & client identik dan sandbox by-design.

---

## 5. Keputusan Teknis Awal (berbasis repo + PRD)

1. **Engine eksekusi kode adventure**: perluas pendekatan interpreter deterministik existing (subset JS aman: variabel angka, if/else, while ber-cap, pemanggilan API dunia). Alasan: satu engine jalan di client & server (validasi server-authoritative tetap murni), tanpa `eval`/`new Function`, timeout & caps by design — persis PRD #14–15/#23. Worker browser dipertimbangkan belakangan untuk UX, dengan engine yang sama.
2. **Renderer adventure**: mulai dari renderer grid React existing (KEEP dulu); evaluasi Phaser 4 hanya jika kebutuhan camera/sprite/animasi melebihi kemampuan grid — Phaser sudah ada di deps sehingga biaya adopt rendah, tetapi bukan prasyarat vertical slice.
3. **Konten**: tetap file-based (JSON/TS registry) pada fase awal; DB tables untuk konten ditunda hingga admin panel dibutuhkan.

---

## 6. Urutan Milestone (mengikuti PRD #61 & #79)

| Fase | Milestone | Status |
|---|---|---|
| 0 | Audit (dokumen ini) | ✅ |
| 1 | Foundation: shared types, concept ID, flags | 🔜 |
| 2 | Asset pipeline: Bible, Manifest, sample PixelLab | 🔜 |
| 3–7 | Game foundation → quest → terminal → code→world → **vertical slice "Broken Power Gate" (JS IF/ELSE)** | antrian |
| 8–9 | Academy integration, CodeLab integration | antrian |
| 10–14 | Progression, AI modes, offline, sync, economy | antrian |
| 15–17 | App/PWA, QA regression, production | antrian |

---

## 7. Definition of Done audit ini
- [x] Inspeksi framework, routes, components, engine, BOT-1, levels, Academy, CodeLab, Monaco, runtimes, AI, database, auth, economy, Midtrans, assets, tests, deployment
- [x] Klasifikasi KEEP/EXTEND/REFACTOR/MIGRATE/REPLACE/DEPRECATED/NEW per sistem
- [x] Risiko database / aset / security teridentifikasi
- [x] Rekomendasi milestone berikutnya ditulis
