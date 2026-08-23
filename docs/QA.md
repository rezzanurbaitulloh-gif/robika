# QA Matrix — PRD Phase 10

Status per kategori test PRD (`prdlengkap.md` :2554), dengan bukti cakupan otomatis (vitest, 43 file / 390 test).

| Kategori | Status | Bukti |
| --- | --- | --- |
| unit | otomatis | `src/lib/core/*` (xp, stars, hints, boss, assessment), `src/lib/game/*` (engine, interpreter, badges, daily), `src/lib/ai/*`, `src/lib/codelab/*`, `src/content/*` |
| integration | otomatis | API routes: `src/app/api/game/complete`, `src/app/api/payments`, `src/app/api/shop/buy`, `src/app/api/profile/skin` (mock Supabase + verifikasi efek tulis) |
| UI | otomatis (RTL) | `src/components/learn/module-complete.test.tsx`, `src/components/game/*`, `src/components/ai/*`, `src/components/design/*` |
| game | otomatis | engine, interpreter, boss, badges, daily mission, world-1 content validation |
| auth | otomatis (route-level) | setiap route test menolak 401 tanpa user; alur login/register via `(auth)` halaman + middleware Supabase |
| DB | parsial | migration SQL `supabase/migrations/0001–0011`; skema ditype di `src/lib/db/types.ts`; tidak ada harness Postgres lokal — diverifikasi manual saat deploy |
| RLS | parsial | policy di migration init/achievements/boss/learn/codelab; `0011_shop_items_rls.sql` menutup tabel harga shop (select-only) |
| sandbox | otomatis | `src/app/api/payments/payments.test.ts` + Midtrans Snap sandbox (`create`, `trial`, `webhook` dengan signature SHA-512) |
| CodeLab | otomatis | runner & validator `src/lib/codelab/*`, konten challenge `src/content/codelab/*`, editor ter-bundle lokal (offline) |
| progression | otomatis | `/api/learn/complete` + `learn_progress`, XP/stars core, unlock world (`newAdventure`) |
| offline | otomatis | sync queue `src/lib/offline/queue.test.ts`, badge OFFLINE, SW cache-first `/_next/static/` |
| sync | otomatis | replay queue saat online kembali (flush sukses/gagal jaringan/error response) |
| responsive | manual | breakpoint Tailwind (`sm:`/`md:`/`lg:`) dipakai konsisten; perlu spot-check perangkat |
| animation | manual | transisi/hover CSS ringan, tanpa lib animasi berat |
| popup | manual | popup-layer system component (`src/components/system/popup-layer.tsx`) |
| VFX | manual | glow/shadow pada kartu dunia & skin preview |
| migration | otomatis-sebagian | urutan migration idempotent (`if not exists`); RPC `buy_skin` server-authoritative |

## Gaps yang diketahui
- Tidak ada harness Postgres lokal untuk menjalankan migration+RLS secara otomatis (butuh Supabase CLI / docker).
- Responsive, animation, popup, VFX: verifikasi visual manual.
