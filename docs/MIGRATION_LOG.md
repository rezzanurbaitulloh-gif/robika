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

### Milestone 4.2 — Boss world-2 "Reaktor Prime" (arc dunia baru tuntas)
- world-2-level-5: boss battle engine js — hp 3, cooldown 30 mnt, xp 250, collect 4 inti daya
- Solution terverifikasi via simulator (belokan akhir: kanan-dari-S = Barat, bukan Timur)
- Test: solusi boss menang, coins=4, tanpa crash; jumlah level world-2 → 5
- Suite 331/331; build sukses

### Milestone 5 — Phase 14 QA: regresi jalur pembayaran Midtrans
- Ditemukan sistem pembayaran produksi yang sudah ada (/api/payments create|webhook|trial, tabel purchases, Snap) — percobaan stack paralel dibatalkan & direvert bersih
- 14 test integrasi baru: create (validasi item/auth/key, purchase pending, snap token, gagal→failed), webhook (signature sha512, 404 order asing, kredit gems/hints sekali, replay idempoten, deny→failed), trial (409 sudah bayar/pernah trial, aktif 7 hari)
- Suite 345/345; build sukses

### Milestone 6 — Phase 17 PRODUCTION hardening
- Security headers global: X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (kamera/mikro/lokasi off)
- robots.txt (rute pribadi di-disallow) + sitemap.xml dinamis dari NEXT_PUBLIC_SITE_URL
- GET /api/health untuk uptime monitoring
- .env.example: blok 5 feature flag didokumentasikan
- Suite 345/345; build sukses

### Milestone 7 — Skin v2: 16 skin, pixel-art nyata, sistem equip
- Katalog 4→16 skin (4 per rarity) dengan palet {body, visor, glow} — tema pabrik, distrik, hingga boss Reaktor Prime; harga naik seiring kelangkaan (dikunci test)
- BotAvatar: BOT-1 pixel-art SVG 16×16 crispEdges sesuai Pixel Art Bible (palet inti, outline gelap)
- Equip: migration 0009 profiles.skin_id + POST /api/profile/skin (cek ownership inventory) + tombol Pakai/Terpakai di shop dengan preview avatar berglow
- In-game: warna panah BOT-1 & glow di GameBoard kini mengikuti skin terpasang (plumb server → LevelClient → GameBoard)
- Suite 354/354; build sukses

### Milestone 8 — Identitas dunia & momen dramatis
- world-theme.ts: tema visual per dunia — Pabrik Kabel (slate/cyan) vs Distrik Gerbang (hijau industri/tembaga): dinding, lantai, power-cell, goal, hazard
- NpcChip: avatar inisial ber-hue deterministik dari nama NPC (papan + panel dialog; redup setelah diajak bicara)
- Boss battle: papan bergaris glow rose berdenyut (.boss-ring); menang = ledakan 12 pixel burst CSS murni
- Skin ikut ke AdventureBoard (story mode) lewat prop skinColors baru
- Migrasi 0009 (profiles.skin_id) diterapkan langsung ke project Robika via Management API
- Suite 356/356; build sukses

## Phase 1 — Design Foundation (2026-08-23)

Dokumen desain (10): PRODUCT_FLOW · UX_FLOW · SCREEN_MAP · GAMEPLAY_SPEC · DESIGN_SYSTEM · ART_BIBLE · ASSET_MANIFEST · MOTION_SPEC · POPUP_SPEC · VFX_SPEC.

Kode prototipe:
- flags.ts diperluas ke skema PRD §79: +9 flag baru (new_home/navigation/world/academy/codelab/ai/shop/profile/motion/visual_system), default mati; 5 flag lama tidak berubah.
- Halaman `/base` (Player Base prototype): HUD bar, BOT-1 breathing idle dengan skin terpasang, quest aktif → level berikutnya, grid menu tile, floor grid + scanline CSS.
- Komponen `HudBar` (lv/xp/gems/streak/quest chip) dan `PopupLayer` (store zustand + antrian popup per POPUP_SPEC).
- globals.css: keyframes breathe, base-floor grid, scanline; guard reduced-motion diperluas.
- .env.example: 10 flag baru didokumentasikan.

Pipeline asset:
- PixelLab MCP Batch 0 validasi end-to-end: prop.power-node.broken 64×64 (job 01bc74c2) → public/assets/pixel/v2/.

Verifikasi: tsc ✓ eslint ✓ vitest 357/357 ✓ build ✓ (/base dynamic).
Gate berikutnya: Phase 2 — design review dokumen sebelum Batch 1 asset & Phaser shell.

### Phase 1b — Prototype Gallery (2026-08-23)

- Rute `/prototype` (flag-gated newVisualSystem/newHome): mock statis Game Shell+HUD+Quest Log, Terminal Overlay, World Map node, NPC Dialogue; tautan Academy/CodeLab eksisting.
- prdlengkap.md (PRD V2 dari user) ikut tersinkron ke repo pada commit Phase 1 — file sebelumnya versi lama yang belum pernah di-commit.
- Checklist prototipe PRD: Home=/base · Base ✓ · Game shell ✓(mock) · World ✓(map) · HUD ✓ · Quest ✓ · Dialogue ✓ · Terminal ✓ · Academy/CodeLab = layar hidup eksisting.

Verifikasi: tsc ✓ eslint ✓ vitest 357/357 ✓ build ✓ (/prototype dynamic).

### Phase 2 — Visual Prototype (2026-08-23)

- BOT-1 hero: PixelLab standard mode 1 gen → 8 arah 48×48 (`ac51d6d7…`) → repo `public/assets/pixel/v2/bot1/`.
- Animasi walk south 4 frame (template, group `afecfd92…`) + demo siklus `walk-demo.tsx`.
- `/prototype` §5 world reaction (themeFor world-1 vs world-2) + mock kamera paralaks; §6 strip asset pixel (next/image unoptimized + `.pixelated`).
- Checklist validasi PRD: pixel art ✓ · animation ✓ · HUD ✓ · popup ✓ · VFX ✓ (burst/spark CSS) · world reaction ✓ · camera ✓ (mock paralaks).
- Saldo PixelLab: 17 generasi tersisa. Batch 1 menunggu approve visual user.

Verifikasi: tsc ✓ eslint ✓ vitest 357/357 ✓ build ✓ (/prototype dynamic).

### Phase 3 — Vertical Slice (mulai) (2026-08-23)

- Rute `/play` (flag-gated newVisualSystem/newWorld): loop BASE→WORLD→QUEST→CODE→RUN→WORLD REACTS→REWARD pada level `world-1-level-1`.
- `slice-scene.ts`: Phaser 4 scene via factory async (aman SSR) — grid digambar dari `level.grid` (#/./C/G/P), player BOT-1 pakai tekstur rotasi idle + frame walk-south, goal tile pulse, replay event `SimEvent` (move=tween 170ms, turn=ganti facing).
- `play-slice.tsx`: mount scene + HudBar + PopupLayer; terminal textarea starterCode → `simulateWithJs` → replay animasi; popup quest-started saat masuk, quest-complete + reward XP/Gems saat won; feedback error/crash inline.

Verifikasi: tsc ✓ eslint ✓ vitest 357/357 ✓ build ✓ (/play dynamic).

### Phase 3 — Batch 1 Asset + Walk 4 Arah (2026-08-23)

- Design gate Phase 2 disetujui user → Batch 1 dibuka (saldo awal 17 gen).
- `anim.bot1.walk-4dir`: walk east/north/west di-append ke group `afecfd92…` ("walking-4-frames", 4 job total, 3 gen) → `public/assets/pixel/v2/bot1/walk-{east,north,west}/{0..3}.png`.
- NPC hub set: Pak Kiwar `7db50301…` (mekanik gerbang, world-2-level-4), Bu Laras `08e92c4f…` (guru robotika), Raka `19903e93…` (siswa) — standard 1 gen each, 8 arah, canvas 68×68 → `public/assets/pixel/v2/npc/`.
- Enemy: Glitchling `4410a6ca…` (glitch magenta, persiapan combat) → `public/assets/pixel/v2/enemy/`.
- `slice-scene.ts`: startWalk/stopWalk kini menganimasikan KEEMPAT arah (frame `walk-{N,E,S,W}-{0..3}`); timer walk disimpan per-event (`walkTimer.remove()`) menggantikan `time.removeAllEvents()` yang rapuh.
- Saldo PixelLab pasca-batch: 10 generasi. Sisa rencana Batch 1: tileset.world1, vfx.spark; hud.frame diganti pendekatan murah (create_ui_asset 20-40 gen tidak muat).

Verifikasi: tsc ✓ eslint ✓ vitest 357/357 ✓ build ✓.

### Phase 3 — Mekanik Gerbang + NPC di Slice (2026-08-23)

- `slice-scene.ts`: tile `D` dirender sebagai gate rect amber (disimpan di map `gates`); event `openGate` → tween buka (fade+scaleY, tint hijau); tile `N` menampilkan sprite `pak-kiwar-south` (68×68, TILE+8); event `npcTalk` → gelembung "!" melayang di atas NPC.
- Deteksi menang kini memakai flag `ev.won` dari interpreter (semantik goal reach/collect/quest benar), menggantikan perbandingan koordinat G yang salah untuk goal quest.
- `play-slice.tsx`: picker level (Pabrik = world-1-level-1, Gerbang = world-2-level-4) — ganti level me-recreate scene, reset starterCode; popup quest-started dijaga unik per level via Set ref.
- Checklist Phase 3: BASE ✓ WORLD ✓ NPC ✓ QUEST ✓ GATE ✓ TERMINAL ✓ CODE ✓ RUN ✓ WORLD REACTS ✓ QUEST COMPLETE ✓ REWARD ✓ — vertical slice lengkap.

### Phase 3 — Sisa Batch 1: Tileset + Spark VFX (2026-08-23)

- Server utama menolak `create_building_kit` ("trial generations used up" meski balance tampil 10); server cadangan juga menolak `create_building_kit` dan `create_tiles_pro` ("Tier 1 is required") → kedua tool tileset ter-gate. Solusi: tile per-piece via `pixen` di cadangan (2 gen).
- `tileset.world1.floor+wall`: lantai pabrik (metal gelap + trace cyan) & dinding baja berpaku (strip hazard amber) 48×48 → `public/assets/pixel/v2/tiles/{floor,wall}.png`; jobs `4e5771cf…` / `f0f7c367…` (cadangan).
- `vfx.spark-4f`: sprite percikan 32×32 (pixen utama `9577d5a9…`, 1 gen) dianimasikan jadi 4 frame flicker (`animate_image` utama `399e5380…`) → `public/assets/pixel/v2/vfx/spark-{0..3}.png`.
- `slice-scene.ts`: grid dirender pakai texture tile (floor/wall per sel) menggantikan rect programatik; method `burst()` memutar spark-{0..3} (80ms/frame) + tween scale 1→2.4 alpha→0 saat BOT-1 menang.
- Pelajaran infrastruktur: generasi besar (>10 gen) tidak bisa di akun utama; tool tileset butuh Tier 1 di kedua akun — asset tile besar harus lewat pixen/pixflux per-potongan.

Verifikasi: tsc ✓ eslint ✓ vitest 357/357 ✓ build ✓.

### Phase 4 — Academy Bridge (2026-08-23)

- `validate.ts`: `concept: string` kini wajib di level; `lesson?: { title, body[] }` opsional tervalidasi (title/body non-kosong).
- Konten lesson ditulis ke 2 level slice: `world-1-level-1` (Perintah Dasar — moveForward/turnLeft/turnRight) dan `world-2-level-4` (Misi & Kondisi — quest, kondisi if, loop) sesuai isi Academy PRD.
- `play-slice.tsx` (jembatan Academy↔Game, prdlengkap.md:2461): tombol header "Academy" membuka panel inline dari `level.lesson`; saat feedback tone err/info muncul tombol "Aku belum paham" → panel `academy-bridge` tema amber ("Academy · {concept}" + title + body + CTA "Praktik di Game"); CTA menutup panel, mencatat `level.id` ke ref Set `practicedFromLesson`, lalu fokus textarea kode; kemenangan dengan catatan tersebut memvariasikan popup quest-complete ("Latihan dari Academy berhasil dipraktikkan").
- Test `play-slice.test.tsx` (+2 kasus): buka lesson via tombol Academy; alur gagal-run → shortcut stuck → bridge terbuka. Pelajaran pengujian: pola klik berulang dalam `waitFor(async)` membuat kontinuasi async komponen tak pernah di-flush (act deadlock); pola benar = tunggu `createSliceScene` terpanggil dulu, satu kali klik, lalu `waitFor` pada spy `runEvents`.
- Debug sementara `debug.test.tsx` dihapus sebelum commit.

Verifikasi: tsc ✓ eslint ✓ vitest 359/359 ✓ build ✓ (/play dynamic).

### Phase 5 — CodeLab Studio (2026-08-23)

- `lib/codelab/languages.ts` (BARU): language registry deklaratif — `LANGUAGES{html,css,javascript,python}` berisi label, id Monaco, ekstensi, run kind (`web`/`console`), dan `defaultCode`; helper `languageByFile` (deteksi via ekstensi, case-insensitive) dan `languageById`.
- `lib/codelab/projects.ts` (BARU): model proyek multi-file immutable — `LabProject{files,activeFileId}` + operasi murni `addFile/renameFile/deleteFile/setActive/setFileContent` (rename ikut memperbarui bahasa dari ekstensi; delete menolak menghapus file terakhir; nama duplikat diabaikan), `buildPreviewDoc` (gabung semua CSS → style, HTML pertama → body, semua JS → script), serta `localStorageProjectStore` untuk save/reopen proyek.
- `studio-client.tsx` ditulis ulang sesuai §40: layout tiga kolom EXPLORER | EDITOR | PREVIEW — explorer CRUD file (+file baru inline, hapus per-file, rename via klik judul), editor kini **Monaco** (`code-editor.tsx` diperluas menerima `html`/`css`) menggantikan textarea, strip OUTPUT di bawah editor, preview live iframe `sandbox="allow-scripts allow-popups"` (tanpa allow-same-origin) dengan debounce 400ms.
- Execution state machine pada tombol RUN: idle→running→done/error; file `.py` jalan via Pyodide runner, `.js` via sandbox Function+console proxy; RUN pada file web me-render ulang iframe. Proyek tersimpan otomatis ke localStorage (key `robika.codelab.project.v1`) dan dibuka kembali saat kunjungan berikutnya.
- Monaco & Pyodide existing dipertahankan; playground `/codelab/playground` tetap redirect ke studio.
- Test baru 16 kasus (`languages.test.ts`, `projects.test.ts`): integritas registry, deteksi ekstensi, seed proyek, seluruh operasi file (termasuk guard duplikat/file-terakhir/imutabilitas), rakitan preview doc, round-trip store + payload korup. Pelajaran: mock localStorage jsdom perlu menyediakan `removeItem`.
- Copy kartu Studio di indeks CodeLab diperbarui (proyek multi-file + autosave).

Verifikasi: tsc ✓ eslint ✓ vitest 375/375 ✓ build ✓.

### Phase 6 — AI Kontekstual (2026-08-23)

- `components/ai/contextual-ai.tsx` (BARU): komponen aksi kontekstual inline §45 — tombol pill cyan `[ ... ]` + panel jawaban collapsible yang streaming via `streamAiChat` (mode apa pun: tutor/debug/exercises/mentor); abort controller di-close saat unmount/tutup; error dipetakan ke copy Indonesia (`quota_exceeded` → kuota harian, `mentor_locked` → ajakan trial/langganan, sisanya → "AI sedang tidak tersedia"); kursor ▋ berkedip saat streaming.
- `play-slice.tsx`: saat feedback tone `err`, tombol `[ Debug with AI ]` muncul di samping "Aku belum paham" — mode debug dengan context `{level, code, error}` dan prompt Socratic ("hint bertingkat tanpa solusi lengkap", selaras §46).
- `studio-client.tsx`: strip OUTPUT kini punya `[ Explain ]` (tutor, konteks file aktif + topik) permanen dan `[ Debug with AI ]` (debug, konteks kode + output error) yang hanya tampil saat RUN error.
- Test (+4 kasus → 379/379): `contextual-ai.test.tsx` (streaming SSE mock ReadableStream → teks terender, body POST `{lang:"id", question}` ke `/api/ai/{mode}`, pemetaan quota_exceeded & mentor_locked) dan kasus play-slice (kode tak valid → tombol debug muncul, klik → panel streaming, payload context berisi error parse & level id). Pelajaran pengujian: mock fetch tanpa parameter bernama menghindari warning unused-vars ESLint — ambil init lewat cast tuple.
- Backend AI existing (`/api/ai/[mode]`, `/api/hints`) tidak diubah; halaman chat besar AiChat tetap untuk level & mentor page.

Verifikasi: tsc ✓ eslint ✓ vitest 379/379 ✓ build ✓.

- Lanjutan Phase 6 — AI Exercise Generator (§44): halaman modul Academy (`/learn/[stackId]/[moduleId]`) kini punya section "Latihan Tambahan" sebelum kuis — tombol `[ Latihan dari AI ]` (ContextualAi mode `exercises`, testId `module-exercise`) meminta satu latihan dari materi modul (judul, deskripsi, contoh input/output) dengan konteks `{topic: "<stack>: <module>"}`; backend `/api/ai/exercises` dipakai tanpa perubahan. Test +1 → 380/380.

- Phase 7 — Offline: (1) sync queue `src/lib/offline/queue.ts` — mutasi `/api/learn/complete` yang gagal jaringan disimpan ke localStorage lalu di-replay otomatis saat online (ModuleComplete kini enqueue + pesan "disimpan lokal"); (2) state online/offline via `useOnline` hook + badge OFFLINE·N di header `(learn)/layout`; (3) offline CodeLab — Monaco dibundle lokal (`monaco-editor` 0.56, `loader.config({ monaco })` + editor worker via wrapper file untuk Turbopack) sehingga tak lagi bergantung CDN; konten kurikulum & save CodeLab sudah lokal sejak Phase sebelumnya. Catatan: runtime Python (Pyodide) masih butuh kunjungan online pertama. Test +5 → 385/385.

- Phase 8 — Economy: pembelian skin kini server-authoritative & atomik via Supabase RPC `buy_skin` (migration `0010_buy_skin_rpc.sql`) — tabel `shop_items` menyimpan harga sebagai sumber kebenaran server, fungsi mengunci baris wallet `FOR UPDATE`, cek saldo, insert inventory `ON CONFLICT DO NOTHING`, lalu debit dalam satu transaksi (menutup celah double-spend dari Promise.all sebelumnya). Route `/api/shop/buy` kini hanya meneruskan `item_id` ke RPC dan memetakan error (`unauthorized`/`unknown_item`/`already_owned`/`insufficient_balance`). Entitlement equip sudah ada di `/api/profile/skin`. Earned (stars), premium (gems), top-up Midtrans, mentor subscription: sudah ada dari fase sebelumnya. Test +5 → 390/390.

- Phase 9 — Full Visual Migration: audit seluruh halaman prioritas PRD (Home, Adventure, World, Academy, CodeLab, Profile, Shop, Daily, Progress, Community/Leaderboard, Settings) — semuanya sudah konsisten memakai design system (BentoCard, BackButton, StatusChip, Icon). Satu inkonsistensi struktural diperbaiki: `/shop` dipindah ke route group `(learn)` sehingga kini mendapat header bersama (logo, AppNav, badge OFFLINE, profil, logout) seperti halaman lain; URL tidak berubah. Fallback loading CodeEditor sudah selaras tema. Test 390/390.

- Phase 10 — QA: matriks QA lengkap di `docs/QA.md` memetakan 17 kategori test PRD ke bukti otomatis (390 test vitest) dan gap manual (responsive/animation/popup/VFX; harness Postgres lokal belum ada). Celah security dari Phase 8 ditutup dengan migration `0011_shop_items_rls.sql`: RLS aktif pada tabel harga `shop_items` (select-only, revoke write untuk anon/authenticated) sehingga harga tidak bisa dimanipulasi dari client.

- Polish — BOT-1 companion: widget mengambang `bot-companion.tsx` (avatar BOT-1 + animasi float, hormati prefers-reduced-motion) terpasang di layout `(learn)`. Bubble idle line berganti tiap 8 detik dengan naskah kontekstual per seksi (adventure / codelab / base berdasarkan pathname), plus aksi `[ Ask BOT-1 ]` yang memakai ContextualAi (mode tutor, topic per seksi). Posisi fixed di atas bottom-nav mobile. 3 test baru; suite kini 44 file / 393 test.

- Polish — Design Gate: NPC kini terasa hidup — chip NPC aktif beranimasi breathe (yang sudah dim redup tetap statis) dan panel dialog NPC aktif muncul dengan animate-pop. VFX combat (burst-pixel saat menang, shake saat CRASH), popup bermakna (popup-layer quest/unlock/level-up), dan success feedback animate-pop sebelumnya sudah ter-wire; item mobile landscape tetap di daftar verifikasi manual `docs/QA.md`.

## 2026-08-23 — PHASE 9 · HOME: migrasi Dashboard ke game-shell
- **Root cause keluhan "tampilan masih lama"**: sistem visual PHASE 2 hanya hidup di `/prototype` & `/base` yang terkunci flag off-by-default (`src/lib/flags.ts`, semua default `false`, `.env.local` tanpa override) — halaman nyata tidak pernah dimigrasi.
- `/dashboard` ditulis ulang memakai bahasa game-shell `/base`: HUD bar (level/XP/gem/bintang/streak + misi aktif), panel hangar BOT-1 (avatar skin user, greeting, hitung lencana, tombol "Lanjut" ke level berikutnya), grid menu tiles 3×3 (World, Academy, CodeLab, Studio, Mentor AI, Shop, Misi Harian, Profil, Sertifikat), footer node.
- `HudBar` diperluas prop opsional `stars` (+5 unit test baru).
- Komponen mati dihapus: `components/dashboard/next-steps.tsx`, `level-progress.tsx`.
- Flag & route tidak berubah; `/base` dan `/prototype` tetap apa adanya.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / **398 tests** ✓ · next build ✓

## 2026-08-23 — PHASE 9 · LANDING: re-skin halaman publik ke title-screen game
- **Root cause**: landing `/` masih pola SaaS generik (sticky navbar + hero + grid BentoCard + pricing + FAQ) yang dilarang eksplisit oleh PRD §67 Anti-Generic Rule — sesuatu yang bisa direpresentasikan sebagai world/map/quest/inventory/dialogue wajib memakai bentuk tersebut.
- Halaman ditulis ulang penuh sebagai **title screen** dengan bahasa visual `/base` & `/prototype` (tanpa flag): strip judul minimal (bukan navbar SaaS), panel hangar BOT-1 (base-floor + scanline + blink dots, avatar breathe, boot-sequence terminal), CTA "MULAI MISI GRATIS", strip Peta Dunia berupa 4 node map (Kode Quest / Akademi / Toko & Mentor / FAQ) sebagai anchor scroll, Quest Log menggantikan kartu "kenapa ada", grid Inventaris menggantikan kartu manfaat, Terminal Sistem MOD-01…06 menggantikan feature cards, Toko Perlengkapan menggantikan pricing, dan FAQ menjadi kotak dialog NPC "Tanya BOT-1" (NpcChip).
- Seluruh copy konten lama dipertahankan verbatim (9 bahasa, harga Rp0/Rp10rb, trial mentor, PWA, dsb); tidak ada route/flag/logika baru — file statis server component.
- BentoCard & StatusChip tetap ada (masih dipakai surface lain); ketergantungan baru hanya BotAvatar/NpcChip/SKIN_ITEMS yang sudah teruji.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-23 — PHASE 9 · NAVIGATION: header & nav jadi command bar game
- Header `(learn)/layout` berhenti memakai gaya navbar SaaS (backdrop-blur putih + link teks accent biru generik #3b82f6 yang dilarang §67): kini strip gelap solid `#0c101d`, wordmark ROBIKA cyan, tombol profil & logout chip bergaris sudut-tajam dengan hover cyan (selaras NODE_STYLE game pages).
- `AppNav`: label desktop diubah ke font-display uppercase chip (aktif = `border-cyan-400/50 bg-cyan-400/15 text-cyan-200` dengan penanda ▸), dock mobile diberi panel gelap + indikator garis atas cyan pada item aktif, menu "Lainnya" jadi kotak modul terminal (`#141a2e`, ikon dalam bingkai). Label disesuaikan ke dunia game (Dashboard→Base, Belajar→Akademi, Misi Harian, Peringkat, Toko).
- Logika tidak berubah: rute, aria-current/haspopup, gate flag `newAdventure` untuk link world-2, dan perilaku Escape semuanya dipertahankan; tidak ada test lama yang menyentuh AppNav.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-24 — PHASE 9 · WORLD MAP: halaman distrik jadi peta node
- `/world/[worldId]` berhenti menampilkan grid kartu BentoCard generik (glow accent biru §67) dan kini tampil sebagai peta node bergaya hangar: header distrik memakai panel `base-floor` + `scanline` dengan indikator blink, daftar level menjadi jalur vertikal node terhubung garis (idiom MAP_NODES prototype).
- Status node kini nyata dari tabel `progress` via `createServerSupabase` (pola sama seperti dashboard): done = emerald, misi aktif pertama = cyan pulse, siap = netral redup, boss mengikuti aturan NODE_STYLE fuchsia (terkunci / aktif saat semua level normal selesai / dikalahkan). Label state pakai font-display `[SELESAI]`, `[MISI AKTIF]`, dst.
- Navigasi tidak berubah: semua node tetap bisa diklik ke `/level/:id`, gate flag `newAdventure` untuk strip "Distrik Berikutnya" dipertahankan; AdventureBoard di dalam level sudah bergaya game sehingga tidak disentuh.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-24 — PHASE 9 · SHOP: toko jadi hangar perdagangan
- `ShopClient` berhenti menampilkan grid BentoCard + tombol `btn btn-outline` bergaya SaaS dan kini tampil sebagai toko in-game: panel header `base-floor scanline` dengan indikator blink ("▸ HANGAR PERDAGANGAN · MOD KOSMETIK"), saldo bintang pindah ke chip amber (bukan accent biru generik §67) dan gem tetap fuchsia.
- Kartu skin diganti tile inventaris gelap (`#0c101d`, sudut tajam, hover cyan): avatar BOT-1 dalam frame glow, rarity chip, harga font-display `★`/`◆`; skin terpakai diberi border cyan + label `[DIPAKAI]`.
- Top-up & Mentor Trial ikut di-restyle sebagai tile/baris mod dengan harga amber; semua aksi (equip, buy, checkout Midtrans Snap, aktivasi trial), state, dan copy fungsional dipertahankan identik.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-24 — PHASE 9 · CODELAB HUB: index jadi antarmuka dev terminal
- `CodelabIndex` berhenti memakai accent biru generik §67 (`bg-accent`, glow `rgba(59,130,246,…)`, rounded-xl SaaS) dan kini tampil sebagai workbench dev: eyebrow path mono `~/robika/codelab`, banner Studio menjadi command bar `$ robika open studio` di panel gelap `#0c101d` bersudut tajam.
- Tab filter bahasa jadi segmented control font-mono uppercase dengan state aktif cyan; kartu tantangan jadi tile editor gelap — ikon kind dalam kotak berbingkai, chip lang/LULUS dipertahankan, label kind + XP (+N XP hijau emerald ala diff) memakai mono.
- Tantangan yang sudah lulus diberi border emerald halus sebagai penanda progress; logika filter, doneSet, route, aria tablist tidak berubah.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-24 — PHASE 9 · MENTOR: banner trial jadi panel in-game
- Kartu trial `BentoCard` dengan pill "Segera hadir" ber-background accent biru generik §67 diganti panel gelap `#0c101d` bersudut tajam ber-aksen fuchsia (ikon brain dalam kotak berbingkai) — konsisten dengan warna boss/mentor di peta dunia.
- Pill promo kini chip outline cyan font-display; logika cek subscription (plan/trial_ends_at/paid_until), StatusChip AKTIF/BELUM AKTIF, dan AiChat tidak diubah.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-24 — PHASE 9 · PROFILE: kartu profil jadi kartu operatur
- `ProfileView` berhenti memakai kartu SaaS (banner gradient accent biru §67, rounded-2xl, shadow) dan kini tampil sebagai "KARTU OPERATUR": panel `base-floor scanline`, avatar berbingkai sudut tajam dengan fallback robot cyan, identitas mono.
- Baris status diganti chip font-display: LV cyan, XP netral, stars amber (ikon star), gems fuchsia (ikon gem) — konsisten dengan toko; grid statistik jadi tile gelap `#0c101d` berlabel mono uppercase.
- State, props, `isImageAvatar`, dan `ProfileSettings` tidak diubah.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓

## 2026-08-24 — PHASE 9 · LEARN: papan kurikulum & jalur belajar jadi papan modul
- `learn/page.tsx` dan `learn/[stackId]/page.tsx` melepas `BentoCard` terakhir di surface belajar (glow accent biru generik §67) dan kini tampil sebagai papan modul game: eyebrow "▸ PAPAN KURIKULUM" / "▸ JALUR BELAJAR", tile gelap `#0c101d` bersudut tajam dengan ikon berbingkai, footer mono cyan ("N modul · Mulai →", "Baca materi →").
- Chip tingkat kesulitan jadi chip outline cyan font-display; kartu modul diberi penanda urutan `MOD-01` mono. Data kurikulum, rute, dan struktur grid tidak berubah.
- Gates: tsc ✓ · eslint ✓ · vitest 45 files / 398 tests ✓ · next build ✓
