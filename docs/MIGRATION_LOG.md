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
