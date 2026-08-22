# ROBIKA — MIGRATION LOG

> Satu entri per milestone, format sesuai PRD #75.

---

## Milestone 0 — PHASE 0 AUDIT

- **Date:** 2026-08-22
- **Milestone:** Phase 0 — Audit existing systems
- **Changes:** Tidak mengubah kode; dokumen audit komprehensif
- **Files:** `docs/MIGRATION_AUDIT.md`, `docs/konsep-saat-ini.md`
- **Database:** Tidak ada perubahan
- **Assets:** Inventarisasi (hasil: nol aset pixel-art produksi)
- **Tests:** Baseline 276/276 pass
- **Risks:** Simulator tidak mendukung if/else+API dunia (vertical slice); runner CodeLab `new Function` sandbox lemah; nol aset visual
- **Rollback:** N/A (dokumen saja)
- **Next:** Phase 1 Foundation

---

## Milestone 1 — PHASE 1 FOUNDATION

- **Date:** 2026-08-22
- **Milestone:** Foundation — feature flags, concept ID registry, shared adventure types
- **Changes:**
  - `src/lib/flags.ts`: 5 feature flag (`newAdventure`, `newWorldMap`, `aiNpcDialogue`, `codeLabProjects`, `offlineMode`) via env `NEXT_PUBLIC_FLAG_*`, default SEMUA MATI (fitur unfinished tak bocor ke prod)
  - `src/lib/concepts/types.ts`: `MasteryLevel` (NOT_STARTED→IN_PROGRESS→COMPLETED→MASTERED), `ConceptDef`, `ConceptMastery` sesuai PRD #17/#19
  - `src/lib/concepts/registry.ts`: 6 konsep stabil seed (`javascript.basics/variables/conditions/loops/functions`, `adventure.bot-movement`) terpetakan ke modul Academy existing; adapter label konsep level game → concept ID; aturan kenaikan mastery
  - `src/lib/adventure/types.ts`: skema data-driven WORLD→REGION→NPC/DIALOGUE/OBJECT/QUEST (11 tipe quest sesuai PRD #12)
- **Files:** 6 file baru (4 src + 2 test) — nol modifikasi file existing → zero regression risk
- **Database:** Tidak ada perubahan (mastery DB ditunda ke fase integrasi)
- **Assets:** Tidak ada
- **Tests:** +14 test baru (flags 7, concepts 7); tsc & eslint bersih
- **Risks:** Rendah — murni aditif; registry konsep akan bertambah saat Academy/CodeLab terintegrasi
- **Rollback:** Revert commit tunggal
- **Next:** Phase 2 Asset Pipeline (Pixel Art Bible → Manifest → sample PixelLab MCP)

---

## Milestone 2 — PHASE 3 GAME FOUNDATION (interpreter deterministik)

- **Date:** 2026-08-22
- **Milestone:** Engine game baru — subset JS aman tanpa eval
- **Changes:**
  - `src/lib/game/interpreter.ts` (baru, ~870 baris): tokenizer → parser recursive-descent → evaluator AST
    - Mendukung: moveForward/turnLeft/turnRight, sensor blockedAhead/canMove/atGoal, openGate(), variabel numerik+aritmetika, if/else, while, for, fungsi tanpa parameter, return, Math.abs/min/max/floor, komentar
    - Tile baru: `D` = gerbang terkunci (solid; terbuka via openGate())
    - Keamanan: TANPA eval/new Function; perintah tak dikenal = error fail-closed; string literal ditolak; step budget 100k + iterasi guard 10k + call-depth 32; deterministik penuh (client & server hasil identik)
    - Error ramah bahasa Indonesia untuk anak
  - Simulator lama (`simulator.ts`) TIDAK diubah — world-1 existing tetap jalan lewat jalur lama (zero regression)
  - `src/lib/game/interpreter.test.ts`: 16 test (perintah dasar, loop, if/else sensor, variabel, fungsi, gate, koin, sintaks error, fail-closed API asing, window.location ditolak, infinite loop, rekursi, string ditolak, div-nol, return liar, determinisme)
- **Files:** 2 baru — nol modifikasi file existing
- **Database:** Tidak ada
- **Assets:** Tidak ada
- **Tests:** 306/306 pass (+16); tsc & eslint bersih
- **Risks:** Sedang — engine belum terhubung ke UI/API (isolated). Integrasi di vertical slice.
- **Rollback:** Revert commit tunggal
- **Next:** Phase 4-5 — vertical slice "Broken Power Gate": dunia JSON baru + routing engine + UI terminal

---

## Milestone 3 — PHASE 4-7 VERTICAL SLICE "Broken Power Gate"

- **Date:** 2026-08-22
- **Milestone:** Slice end-to-end pertama: kode → interpreter → dunia berubah (gerbang terbuka)
- **Changes:**
  - `src/lib/game/validate.ts`: tile `D` resmi + field `engine?: "legacy"|"js"` + aturan solusi gerbang wajib openGate()
  - `src/lib/game/interpreter.ts`: event log (move/turn/openGate) untuk animasi UI deterministik
  - `src/lib/game/engine.ts`: router engine — auto-detect via tile D / field engine; legacy world-1 tak tersentuh
  - `src/content/world-2/world-2.json` (baru): 2 level — "Gerbang Daya Putus" & "Koridor Koin Terkunci", lengkap lesson+quiz+hints, self-solvable
  - `src/components/game/adventure-board.tsx` (baru): board js-engine — replay event log, render gerbang terkunci/terbuka, banner error ramah
  - `level-client.tsx`: routing board per engine (legacy → GameBoard, js → AdventureBoard); parseCommands di-guard agar kode JS tidak menyentuh parser lama
  - `/api/game/complete`: validasi server kini via runLevel() — server-authoritative tetap terjaga
- **Files:** 5 baru, 4 modifikasi
- **Database:** Tidak ada
- **Assets:** Tidak ada (board masih CSS; sprite menyusul Phase 8)
- **Tests:** 315/315 pass (+9: routing 5, slice 4 termasuk self-solve guardrail & starter-code-tidak-menang)
- **Risks:** Rendah — jalur legacy utuh; world-2 hanya aktif via konten baru
- **Rollback:** Revert commit tunggal
- **Next:** Feature flag newAdventure di halaman dunia + asset pixel nyata (Phase 8) atau lanjut NPC/dialog (Phase 9-10)

### Milestone 3.1 — Wiring pintu masuk world-2 (flag newAdventure)
- Nav desktop: item "Distrik Gerbang" hanya muncul saat NEXT_PUBLIC_FLAG_NEW_ADVENTURE=true
- Halaman /world/world-1: kartu "DISTRIK BERIKUTNYA" (flag-gated) menuju /world/world-2
- Mobile bottom-nav tidak diubah (grid 5 slot); akses mobile lewat kartu di halaman world-1
- Known limitation: URL /level/world-2-* masih bisa diakses langsung tanpa flag (soft gate) — hard gate menyusul bila dibutuhkan
- Verifikasi: tsc/eslint bersih, `next build` sukses penuh

### Milestone 3.2 — Level "Persimpangan Reaktor" (konsep IF/ELSE sesuai PRD #67)
- world-2-level-3: jalur berliku tanpa tanda jarak; solusi kanonik `while (true) { if (canMove()) moveForward(); else turnRight(); }`
- Engine menghentikan eksekusi saat won — loop tak perlu kondisi keluar (diuji)
- xpReward 100 sesuai spesifikasi slice PRD (+100 XP)
- Verifikasi: self-solve guardrail 3/3, starter tidak menang, suite penuh 316/316

### Milestone 3.3 — NPC & Quest (rantai PRD #67 lengkap)
- Tile 'N' = NPC; BOT-1 bicara otomatis saat menginjak petaknya (event npcTalk, sekali per NPC)
- Goal type baru "quest": semua NPC disapa DAN mencapai tujuan; validasi quest wajib punya tile N
- Result baru npcsTotal/npcsTalked; UI chip progres + render ikon mekanik (dim setelah bicara)
- world-2-level-4 "Mekanik Gerbang" (xp 120): bicara dulu → openGate() → tujuan
- Suite penuh 317/317; build sukses

### Milestone 3.4 — Dialog NPC (skema LevelNpc)
- GameLevel.npcs?: {x,y,name,lines[]} — posisi terikat ke tile N, divalidasi ketat
- Panel dialog muncul di papan saat BOT-1 menginjak NPC (event npcTalk → lookup dialog)
- Pak Kiwar si Mekanik punya 3 baris dialog yang menyisipkan petunjuk openGate()
- Suite penuh 319/319; build sukses

### Milestone 3.5 — Hard-gate flag + bug fix level.world + test integrasi API
- World.flag?: keyof FeatureFlags; world-2 = "newAdventure"; halaman world & level → notFound() tanpa flag
- BUG FIX: field level.world hilang di kedua JSON (route /api/game/complete balik "unknown_world") — diinjeksi otomatis; validateWorld kini menerima worldId dan menolak level dengan world salah
- Test integrasi route (7): anti-cheat js (kode kalah ditolak), timing guard, stars range, happy path reward+progress, legacy parity, injection komentar
- Suite penuh 327/327; build sukses

### Milestone 4 — Phase 11 OFFLINE (fondasi PWA flag-gated)
- public/sw.js: cache robika-v1 — navigasi network-first + fallback /offline; _next/static & ikon cache-first; /api/* tidak pernah di-cache
- SwRegistrar: flag offlineMode ON → register SW; OFF → perilaku lama (unregister + purge cache) dipertahankan
- Halaman /offline sebagai fallback navigasi
- Layout kini server-rendered flag, tanpa inline script
- Suite 327/327; build sukses; rute /offline ter-generate

### Milestone 4.1 — Daily lintas dunia + akses mobile ke world-2
- dailyPoolIds(worlds, flagOn): pool harian dari semua world yang tidak terkunci flag; boss selalu dikecualikan (3 test baru)
- Halaman /daily kini memakai getLevel(dailyId) lintas dunia — level js bisa jadi tantangan harian saat flag aktif
- Dashboard: kartu "Distrik Gerbang" (world-2) di belakang flag newAdventure — jalur akses utama di mobile
- Suite 330/330; build sukses
