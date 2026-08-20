# Robika — Laporan TDD Bootstrap (Phase 1-6)

Status: **GREEN** — 19 file test, 201 test lulus, typecheck & lint bersih, build produksi sukses.

## Hasil Verifikasi Akhir

| Check | Hasil |
|---|---|
| `npm test` (vitest) | 19/19 file, **201/201 test lulus** |
| `npx tsc --noEmit` | **0 error** |
| `npx eslint .` | **0 error, 0 warning** |
| `npx next build` | Sukses — 17 route (9 halaman + 8 API) |

## Cakupan TDD per Modul

| Modul | File | Test | Fungsi |
|---|---|---|---|
| Logika inti | `src/lib/core/{hints,stars,xp,assessment,boss}.ts` | 53 | hint kuota, bintang, XP, klasifikasi skill, cooldown boss |
| Design system | `src/components/design/{bento-card,status-chip,segmented-nav}` | 19 | Bento Grid, status chip, navigasi tab |
| AI cache & limit | `src/lib/ai/{cache,limits}.ts` | 16 | TTL cache, kuota harian (tutor 20/hari, mentor 30/hari) |
| Level validator | `src/lib/game/validate.ts` | 19 | schema level + world, grid, hint tiers, boss spec |
| Konten world-1 | `src/content/world-1/` | 7 | 6 level + boss Motherboard (solvabilitas via simulator) |
| Simulator game | `src/lib/game/simulator.ts` | 18 | parser kode (komentar, for-loop unroll) + simulasi grid |
| CodeLab check | `src/lib/codelab/check.ts` | 12 | normalisasi output, exact/contains, first diff line |
| Konten CodeLab | `src/content/codelab/` | 12 | 4 challenge (JS/Python, output/complete-code), solusi tervalidasi |
| Payment catalog | `src/lib/payments/{packages,catalog}.ts` | 14 | katalog 7 paket, order id, verifikasi signature SHA-512, mapping status Midtrans |
| Reward level | `src/lib/game/rewards.ts` | 9 | XP completion (base + speed bonus), kredit stars idempotent, level-up |
| Provider registry | `src/lib/ai/registry.ts` | 15 | 15 provider (14 key opencode + Gemini), pool per mode, dedupe base URL, rotasi |
| SSE parser | `src/lib/ai/sse.ts` | 7 | parse chunk SSE, ekstrak delta konten OpenAI-compatible |

## Multi-Provider AI (Phase 6.5 — failover paralel)

Semua key dari `~/.config/opencode/opencode.json` dialihkan ke env `ROBIKA_KEY_*` (14 keys) + `GEMINI_API_KEY`:

| Pool | Base URL | Model | Prioritas |
|---|---|---|---|
| hc_key1–5 | api.hcnsec.cn/v1 | DeepSeek-V4-Flash, Qwen3-Coder-Next-FP8, Qwen3.5-397B-A17B | 10–14 |
| mistral_key1–6 | router.bynara.id/v1 | mistral-large | 20–25 |
| qwen3.8-27b | HuggingFace endpoint | Qwen/Qwen3.8-27B | 30 |
| omniroute / 9router | localhost:20128 | auto, nvidia/*, qwer/*, dsb. | 40–41 |
| gemini | generativelanguage v1beta/openai | gemini-2.0-flash | 50 |

Strategi: **race paralel** — satu request per base URL (bukan per key), timeout 15s per request, pemenang pertama dipakai, sisanya dibatalkan (`response.body.cancel()`). Terbukti: hcnsec hang untuk chat completion (>30s) → mistral menang race (6.4s) dan jawab normal. Mode `mentor` memprioritaskan model berkemampuan besar (Qwen3.5-397B, mistral-large).

## Monetisasi (Phase 6 — Midtrans Sandbox)

- `POST /api/payments/create` → transaksi Snap (order `ROBIKA-*`, item_details, harga rupiah), simpan `purchases` status pending, balikan `token` + `snap_base`.
- `POST /api/payments/webhook` → verifikasi signature SHA-512 (`orderId+statusCode+grossAmount+serverKey`), mapping status (200/201/202/capture/settlement → paid), kredit **gems/hints** ke wallet (admin client bypass RLS), extend **subscriptions** untuk paket mentor, idempotent (fulfilled hanya sekali).
- `POST /api/payments/trial` → aktivasi trial mentor 7 hari (sekali seumur hidup; ditolak jika sudah pernah/berbayar).
- Shop UI: kartu uji Midtrans **4811 1111 1111 1114** (exp bulan depan, CVV apa pun, OTP 112233).
- **Migration 0002**: `hints_count_check` diubah `between 0 and 3` → `>= 0` (top-up 10/30/150).

## Persistensi (Phase 6)

- `POST /api/game/complete` → upsert `progress` (stars/best_score max), kredit stars selisih tier (idempotent), XP + speed bonus (pakai `xpReward` per level dari konten), level-up via `levelFromXp`.
- `GET /api/hints` → refresh saldo harian (3/3 hari) lalu kembalikan saldo; `POST /api/hints/reveal` → konsumsi 1 hint; HintPanel tersambung (`trackBalance`).

## Catatan Penting

1. **Supabase types**: versi supabase-js 2.112.3 mensyaratkan key `Relationships` di setiap tabel — tanpanya seluruh query jadi `never`. Ditangani di `src/lib/db/types.ts`.
2. **Konten divisi**: validator + simulator menemukan 3 bug konten (panjang baris grid, tile G ganda di boss, jalur solusi level 6 & boss off-by-one) — semua diperbaiki dan tervalidasi otomatis oleh test `every level solution wins`.
3. **MVP simplifikasi**: board game dirender sebagai CSS grid (bukan Phaser) — mekanik & validasi 100% identik dengan simulator yang di-TDD; Phaser dapat ditambahkan sebagai renderer alternatif tanpa mengubah logika.
4. **Aksesibilitas**: SegmentedNav memakai pola `tablist`/`tab` resmi; hydration guard editor memakai `useSyncExternalStore` (bukan setState-in-effect).
5. **Kuota AI**: in-memory TTL (26 jam) per user — cukup untuk free tier single instance Vercel.

## Lingkungan & Aset

- `.env.local`: Supabase (ref `iqkhdxxbjhgbxjviruu`), `GEMINI_API_KEY`, Midtrans sandbox (`MIDTRANS_IS_PRODUCTION=false`).
- Logo `logo.png` → `public/logo.png`, terpasang di metadata + header.
- `supabase/migrations/0001_init.sql`: 7 tabel + RLS + trigger `handle_new_user` + kolom `skill_level`.
- `proxy.ts` (Next 16): refresh session + guard route.

## Route (17)

`/` landing • `/login` • `/register` • `/onboarding` (5 soal skill check) • `/dashboard` • `/world/[worldId]` • `/level/[levelId]` (game + editor + hint real + reward) • `/codelab/[challengeId]` (Monaco + runner) • `/mentor` (SSE AI chat, gating trial) • `/shop` (kosmetik + top-up Snap + trial)
API: `/api/ai/[mode]` (SSE) • `/api/payments/{create,webhook,trial}` • `/api/game/complete` • `/api/hints` • `/api/hints/reveal`

## Login Google (Phase 6.6)

- `src/app/auth/callback/route.ts`: tukar `code` → session (`exchangeCodeForSession`), redirect aman (anti open-redirect), bawa `next`.
- `AuthForm`: tombol "Lanjutkan dengan Google" (SVG resmi) + `signInWithOAuth({ provider: "google", redirectTo: origin + "/auth/callback" })`.
- `proxy.ts` diperbaiki: guard auth sekarang mencakup `/level /world /codelab /mentor /dashboard /onboarding /shop` (sebelumnya `/(learn)` tidak pernah cocok dengan pathname asli) + `/auth/callback` dikecualikan dari guard.
- Migration **0003**: `handle_new_user` membaca metadata Google (`full_name`, `avatar_url`), username fallback dari email + suffix acak jika duplikat; semua insert `on conflict do nothing` (idempotent).

**Setup manual (dashboard Supabase)**: Authentication → Providers → Google → aktifkan, isi Client ID + Client Secret dari Google Cloud Console (OAuth client "Web application"), redirect URI `https://<ref>.supabase.co/auth/v1/callback`; tambahkan `https://<app-domain>/auth/callback` ke Authorized redirect URIs.

## Gap Closure (Fase A–F)

### Fase A — Materi + Kuis per level
- `validate.ts`: skema `lesson` (title + body ≥1 paragraf) & `quiz` (3–5 soal, 2–6 opsi, answer in-range) → 23 test.
- Konten dunia 1: semua 7 level kini punya lesson + quiz (loop, hazard, boss strategy).
- `src/lib/game/quiz.ts` (5 test): `gradeQuiz` pass-rate 70%.
- Level page → tab **📖 Materi | 🧪 Kuis | 🕹️ Game** (sticky tab bar, scrollable di mobile).
- Board game responsif: sel `aspect-square`, max-width proporsional (sebelumnya fixed 34px × 14 = meluber di layar <476px).

### Fase B — Badge + streak + sertifikat
- `src/lib/game/streak.ts` (5 test): UTC-day streak — +1 jika kemarin, tetap jika hari ini, reset 1 jika putus.
- `src/lib/game/badges.ts` (8 test): katalog 10 badge × 5 rarity; `evaluateBadges(state, owned)` idempotent.
- Migration **0004**: tabel `achievements` (PK profile_id+badge_id) + RLS own.
- `POST /api/game/complete` kini juga update `streak`/`last_active_at` (engine streak).
- API: `GET /api/achievements`, `POST /api/achievements/check` (baca progress+profile+wallet+subscriptions → earn baru). Dipanggil otomatis setelah menang level (badge muncul di notifikasi).
- Dashboard: `BadgeGrid` (kunci 🔒 untuk yang belum didapat), statistik streak, link sertifikat.
- `/certificate`: kartu sertifikat printable (`window.print()` → PDF; style `@media print` putih).

### Fase C — Boss cooldown + instant retry Gem
- Engine `src/lib/core/boss.ts` (cooldown 30 menit, retry ◆5) sudah ada + test.
- Migration **0005**: tabel `boss_attempts` (1 baris per user, upsert).
- API: `GET /api/boss/status` (can_attempt, cooldown_ms, gems), `POST /api/boss/attempt` (mulai cooldown saat kalah), `POST /api/boss/retry` (bayar ◆5 → reset cooldown).
- `BossPanel` di tab Game level boss: countdown live + tombol Retry Instan (402 → arahkan ke Shop).

### Fase D — AI Mentor multimodal
- `image?: string` (data URL) mengalir: `ai-chat.tsx` (resize canvas ≤1024px, JPEG 0.8) → `client.ts` → route (validasi prefix `data:image/` + ≤5MB) → `stream.ts` → `provider.ts` (pesan user terakhir jadi array `text` + `image_url` OpenAI-compatible).
- Tombol 🖼️ di chat, thumbnail + batal, preview gambar di bubble user.

### Fase E — Leaderboard + Daily Challenge
- Migration **0006**: function `get_leaderboard(limit)` security definer (order XP desc).
- `GET /api/leaderboard` + halaman `/leaderboard` (medali 🥇🥈🥉, highlight "kamu", responsif grid→stack).
- `src/lib/game/daily.ts` (7 test): `hashDate` (UTC) → `dailyLevelId` deterministik per hari, `dailyEndsAt` tengah malam UTC.
- `/daily`: kartu tantangan hari ini + tombol `?daily=1` → chip "⚡ DAILY CHALLENGE" di level page.

### Fase F — CodeLab fix-bug + playground + preview
- `runner.ts`: kind baru `fix-bug` (daftar `bugs`) & `preview` (dokumen HTML lengkap) + validator (test kinds diperbarui → 9 test codelab).
- Challenge baru: `codelab-fixbug-loop` (off-by-one) & `codelab-preview-card` (kartu interaktif).
- Challenge page: panel 🐞 daftar bug, tombol Reset, label "PERBAIKI KODE", dan **preview iframe live** (`sandbox="allow-scripts"`, `srcDoc`) untuk kind preview.
- `/codelab/playground`: editor tab HTML/CSS/JS + preview iframe live (debounce 500ms), link di nav + dashboard.

## Fase G — Pematuhan Visi robika.md (rework dunia 1)

### G1 — Simulator kontrol alur: if + function (TDD)
- `simulator.ts`: `parseProgram(code): ProgramNode[]` — ekstraksi `function name() {...}`, ekspansi panggilan inline, unroll `for` manual (brace-matching, dukung body bersarang), parse `if (blockedAhead())` / `if (canMove())` / blok ekspansi fungsi.
- `simulate()` rekursif terhadap struktur program dengan guard `maxSteps`. `parseCommands` tetap (flatten) untuk step-counter UI.
- Test baru (parseProgram + simulate): if blockedAhead, if canMove, ekspansi fungsi, loop ter-unroll, detour spike, fungsi zigzag → 25 test simulator.

### G2 — Bintang berbasis hint + error recovery XP (TDD)
- `src/lib/game/stars.ts`: `starsForHints()` (0→3★, 1→2★, ≥2→1★) & `errorRecoveryBonus()` (+10 XP saat crash pernah terjadi tanpa hint). 7 test.
- `rewards.ts`: `computeCompletionRewards` menerima `errorRecoveryXp`, mengekspos `parBonus` & `errorBonus` (bonus hanya untuk first completion). Test diperbarui.
- `/api/game/complete`: `parMs` kini dari `level.parMs` (bukan hardcode 300_000); kredit error-XP; `best_score` = min hints (bukan max).

### G3 — Paket gem 100/300/700 (visi robika.md)
- `packages.ts`/`catalog.ts`: `gems-10/25/50` → `gems-100/300/700` (harga tetap Rp10rb/25rb/50rb). Test catalog diperbarui.

### G4 — Konten dunia 1: If, Function, Fix-bug+Maze
- L4 = If: spike di (7,1), solusi `if (blockedAhead())` detour (test lama "crashes on spikes" 6×forward tetap valid).
- L5 = Function: `zigzag()` dipanggil 3× menuju goal.
- L6 = Fix-bug + Maze: starter buggy (`turnLeft` salah arah) menabrak dinding; solusi `turnRight` menang.
- Semua level diberi `parMs` (15s–60s); lesson/quiz L4–L6 ditulis ulang (kondisi, fungsi, debugging).
- Validator: field opsional `parMs > 0` (test baru).

### G5 — UI & juice
- `game-board.tsx`: prop `onRunStart` untuk timer akurat.
- `level-client.tsx`: timer `performance.now()`, `hintsUsed` dari `HintPanel.onUseHint`, kirim `error_recovered`, tampil `⚡ par +XP` & `🛠️ error recovery +XP`, chip CRASH ber-getar (`animate-shake`), panel menang ber-`animate-pop`.
- `globals.css`: keyframes pop & shake (dengan `prefers-reduced-motion`).

## Status Akhir

- **24 file test, 250 test, tsc 0 error, eslint 0 error, `next build` sukses** (17 route API + halaman).
- Migrations untuk dijalankan: `0003`–`0006`; deploy Vercel + Google OAuth + migration Supabase **sudah selesai oleh user**.
- Git: repo `rezzanurbaitulloh-gif/robika` (main), secret `enp` dikeluarkan + di-ignore, `.env*` aman.

## Fase Berikutnya (opsional)

- Webhook uji nyata: transaksi Snap → notifikasi → cek wallet bertambah
- Phaser renderer untuk board game
- Uji end-to-end mobile (Playwright viewport 360px)
- Onboarding adaptif per-stack (visi: 5 soal statis saat ini)