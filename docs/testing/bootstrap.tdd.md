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

## Fase Berikutnya (opsional)

- Deploy Vercel (Hobby) + jalankan migration 0001–0002 ke Supabase + cron GitHub Actions anti-pause
- Webhook uji nyata: transaksi Snap → notifikasi → cek wallet bertambah
- Phaser renderer untuk board game
- Leaderboard XP antar pemain (RLS `profiles` sudah siap)