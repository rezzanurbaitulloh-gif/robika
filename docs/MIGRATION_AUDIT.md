# ROBika — MIGRATION AUDIT (PHASE 0)

> Dibuat sesuai PROMPT 1 dari `prdlengkap.md` (Master Blueprint V2).
> Audit murni — tidak ada redesign, tidak ada tabel baru, tidak ada asset baru.
> Tanggal: 2026-08-23 · Baseline commit: `f30953c` · Suite: 356/356 · Build: ✓

---

## 1. Arsitektur Saat Ini

```
Next.js 15 App Router (TS) ── Tailwind v4 + design system custom
│
├── Presentation: (auth)/(learn)/shop/offline routes, component library
├── Game Runtime: CUSTOM turn-based grid simulator (BUKAN Phaser runtime)
├── Learning Engine: curriculum data-driven + quiz + learn_progress
├── Code Execution: JS sandbox (Function+console proxy), Pyodide lazy-load
├── AI Layer: provider registry + SSE stream + hint ladder + limits/cache
├── Progression: XP/level/streak/badges/boss attempts
├── Economy: wallets(gems) + Midtrans + inventory + shop
├── Offline Storage: SW cache statis SAJA (tanpa local save/sync queue)
└── Online Services: Supabase (11 tabel, RLS), Gemini/Mistral, Midtrans
```

**Fakta kritis #1:** `phaser` ada di dependencies dan ter-install di node_modules, tetapi **0 impor di seluruh `src/`**. Klaim PRD "Existing Phaser foundation" belum terwujud — runtime game saat ini adalah simulator giliran kustom (`simulator.ts` 295 baris, `interpreter.ts` untuk engine js).

## 2. Routes Saat Ini (43)

- **Auth:** login, register, forgot/reset-password, onboarding, auth/callback
- **Learn:** dashboard, learn (+ stack/module dinamis), level/[levelId], world/[worldId], daily, leaderboard, mentor, profile, codelab (index/challenge/playground/studio), certificate
- **Shop:** /shop
- **Offline:** /offline
- **Root:** / (landing marketing: hero + 3 feature cards — pola yang direject PRD #67)
- **API:** achievements(2), ai/[mode], boss(3), codelab/complete, game/complete, health, hints(2), leaderboard, learn/complete, payments(3: create/webhook/trial Midtrans), profile(2: profil+skin), shop/buy

## 3. UI Saat Ini

- Design system internal: `BentoCard`, `StatusChip`, `Icon` (custom SVG set), pixel font display, palet gelap neon (#0f1220 bg, cyan/magenta/green accents).
- Dashboard = grid kartu statistik + rekomendasi (dashboard-centric, persis masalah PRD §3).
- Landing = Navbar/Hero/Cards/Footer (pola anti-generic #67 → wajib diganti Player Base).
- Skin system v2: 16 skin berpalet {body,visor,glow}, BotAvatar SVG pixel 16×16, equip in-game.

## 4. Masalah Dashboard Saat Ini

Statistik jadi pusat; quest/current-adventure bukan fokus pertama; tidak ada dunia hidup di home; BOT-1 hanya avatar statis; tidak ada ambience animation; CTA Continue Adventure sekunder.

## 5. Game Saat Ini

- Grid tile ASCII (P/#/./C/S/G/D/N), panah karakter sebagai player, animasi langkah via state replay.
- Engine ganda: `legacy` (DSL move/turn/collect/talk/open) dan `js` (kode JS asli via interpreter aman, mendukung gate, NPC talk, event).
- World-1 "Pabrik Kabel" 7 level + boss Motherboard; World-2 "Distrik Gerbang" 5 level + boss Reaktor Prime (hp/cooldown/xp).
- Tema visual per dunia (world-theme.ts), NPC chip deterministik, boss ring, win burst, quiz panel, hint ladder.
- **Tidak ada:** movement bebas real-time, kamera smooth-follow, combat aksi (attack/dodge/knockback), eksplorasi map besar, secrets/collectibles dunia.

## 6. Learning Saat Ini

Curriculum JSON per bahasa: cpp, go, html-css, java, javascript, php, python, sql, typescript (9 bahasa) → module → lesson → quiz; learn/complete API; progress tabel `learn_progress`; integrasi quiz ke level game.

## 7. CodeLab Saat Ini

Monaco editor; challenges.json (js/python: output/complete-code/fix-bug/preview); playground + studio; runJavaScript sandboxed (console proxy, tanpa DOM/network); Pyodide lazy untuk python; preview iframe untuk html/css; reward XP; codelab_progress persist.

## 8. AI Saat Ini

Registry multi-provider (Gemini primary + Mistral/HC/Qwen/OmniRoute fallback), SSE streaming, prompt system dengan larangan bocor jawaban, rate limit per user, cache respons, mode via `/api/ai/[mode]`, chat UI tunggal (belum contextual actions [HINT]/[DEBUG]/[ASK BOT-1]).

## 9. Economy Saat Ini

Wallet gems server-authoritative; top-up Midtrans Snap (create/webhook idempoten/trial); purchase history; shop 16 skin + paket gems; inventory + equip skin (profiles.skin_id). Belum ada: earned-currency loop dari eksplorasi, emote/VFX/decoration/title products.

## 10. Database Saat Ini

Migrations 0001–0009 (sudah diterapkan ke remote Robika): profiles(+skin_id), progress, wallets, purchases, subscriptions, hints, achievements, boss_attempts, leaderboard view, learn_progress, codelab_progress, inventory. RLS aktif di tabel user-data (14+ policy).

## 11–12. Progress & Assets Saat Ini

Progress: XP/level/streak/badges/stars/boss_attempts/daily — semuanya `completed=true` style, belum ada mastery 4-state per konsep (PRD §51).
Assets pixel: **hanya 6 file PNG** di public/assets/pixel/v1 (tile-ground, tile-wall, gate-power-closed, bot-1 idle ×2, npc-mechanic). Sisanya CSS/Icon/emoji. Manifest asset belum ada.

## 13. PixelLab Configuration

**TIDAK terkonfigurasi** — `opencode.json` tidak punya MCP servers. Wajib disiapkan sebelum Phase 3 (asset generation).

## 14. Sistem Reusable (jangan dibuang)

Simulator+interpreter+validate (logika puzzle), engine gating flags, content pipeline JSON, curriculum+quiz, CodeLab runner+sandbox, AI layer penuh, economy Midtrans penuh, auth+RLS, SW offline dasar, design tokens/palet, BotAvatar/world-theme/NpcChip.

## 15–16. Butuh Migrasi Visual vs Arsitektur

Visual migration: landing→Player Base, dashboard→Base hub, world select→World Map hidup, board grid→canvas Phaser, popup sistemik, HUD in-game.
Architecture changes: **Phaser runtime scene system** (baru), real-time input (WASD/analog), kamera, collision fisik, combat loop, quest state machine, mastery/concept graph, offline sync queue, language registry eksekusi.

## 17. Sistem Hilang

Phaser scenes, combat, enemy AI, BOT-1 companion runtime, world map connected, quest system formal, coding terminal overlay in-world, popup/VFX manager, sound hooks, mastery tracking, concept IDs, sync queue, mobile landscape controls, PixelLab pipeline, e2e testing.

## 18. Yang Tidak Boleleh Dihapus

Akun/XP/gems/inventory/purchases/subscriptions/hints/achievements/learn+codelab progress (PRD §69), semua API pembayaran, curriculum, test suite, RLS.

## 19–22. Risiko

- **DB:** penambahan tabel future (§68) harus additive; mapping data lama→baru wajib; JANGAN drop kolom.
- **Offline:** SW sekarang hanya cache statis — klaim offline gameplay tanpa local-save akan menyesatkan; butuh IndexedDB + queue.
- **Mobile:** game board saat ini column-portrait; landscape-first butuh layout canvas + kontrol touch baru; risiko performa Phaser di low-end Android.
- **Sandbox:** runJavaScript memakai `new Function` di window context — akses global masih mungkin; CodeLab preview iframe harus diverifikasi sandbox attr; PRD §72 butuh hardening (timeout/memory/output limit).

## 23–25. Kebutuhan Asset/Animation/Popup-VFX

Batch 1 minimal: player BOT-1 walk/idle 4-dir, NPC set, enemy Glitch, tileset ground/wall/gate/terminal, HUD frame, VFX spark/unlock. Semua harus dicatat di ASSET_MANIFEST.md dengan PixelLab ID. Animation states minimum per entity sesuai §27. Popup: quest started/updated/complete, unlock, reward-fly-to-HUD.

## 26. Risiko Testing

356 unit/integration tests melindungi logika lama; migrasi visual berisiko mematahkan komponen — jalankan vitest tiap fase; belum ada Playwright e2e; responsive matrix (§74) belum teruji otomatis.

## 27. Urutan Implementasi (rekomendasi)

1. **Phase 1** Design foundation docs + flag baru (new_home, new_navigation, dst.)
2. **Phase 2** Visual prototype: Phaser shell + Player Base home + HUD
3. **Phase 3** Vertical slice if/else → gate terbuka fisik (design gate!)
4. **Phase 4–6** Academy bridge → CodeLab registry → AI contextual
5. **Phase 7–8** Offline sync → economy expansion
6. **Phase 9–10** Full visual migration → QA matrix

## Status Gerbang

✅ Audit selesai. Sesuai PROMPT 1: **STOP di sini.** Fase berikutnya (Design Foundation) hanya boleh dimulai setelah audit ini direview.
