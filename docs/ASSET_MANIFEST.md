# ROBIKA — ASSET MANIFEST

> Registri aset produksi & placeholder. Format sesuai PRD #46.
> Status: `EXISTING` · `GENERATED` · `APPROVED` · `REVIEW` · `PLACEHOLDER` · `DEPRECATED`
> Style version mengacu pada `docs/PIXEL_ART_BIBLE.md` §7.

| asset_id | name | category | source | dimensions | style_version | animation | used_by | status |
|---|---|---|---|---|---|---|---|---|
| logo.png | Logo Robika | ui | existing repo | 512×512 | — | — | landing, PWA | EXISTING |
| icon-192.png / icon-512.png / icon-maskable-512.png | Icon PWA | ui | existing repo | 192/512 | — | — | manifest.webmanifest | EXISTING |
| bot-1-idle-1.png | BOT-1 idle frame 1 | character | placeholder script | 16×20 | v1-draft | idle 2f | adventure (rencana) | PLACEHOLDER |
| bot-1-idle-2.png | BOT-1 idle frame 2 | character | placeholder script | 16×20 | v1-draft | idle 2f | adventure (rencana) | PLACEHOLDER |
| tile-ground.png | Tile tanah district | environment | placeholder script | 16×16 | v1-draft | — | world map (rencana) | PLACEHOLDER |
| tile-wall.png | Tile dinding pabrik | environment | placeholder script | 16×16 | v1-draft | — | world map (rencana) | PLACEHOLDER |
| npc-mechanic.png | NPC Mekanik desa robot | character | placeholder script | 16×20 | v1-draft | idle 2f | quest Broken Power Gate (rencana) | PLACEHOLDER |
| gate-power-closed.png | Gerbang daya tertutup | props | placeholder script | 16×24 | v1-draft | — | challenge Broken Power Gate (rencana) | PLACEHOLDER |

## TODO (wajib sebelum status naik ke APPROVED)

```
TODO: Replace placeholder with PixelLab MCP production asset.
```

Alasan masih placeholder: **PixelLab MCP tidak tersedia pada session ini** (PRD #70). Placeholder dibuat sengaja kasar sesuai Bible §8 agar tidak tertukar dengan aset final, tetapi sudah memakai palet inti sehingga integrasi kode dapat dites lebih dulu.

## Sample set untuk approval style (PRD #44)

6 file di atas = sample set pertama. Owner review → setujui/revisi Bible → baru generasi massal.

## Aturan penambahan

1. Cek tabel di atas SEBELUM membuat aset baru (reuse dulu).
2. Aset baru wajib punya baris manifest hari itu juga.
3. Aset tak terpakai >2 milestone → status DEPRECATED, hapus dari bundle.
