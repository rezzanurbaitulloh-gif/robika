# ASSET_MANIFEST — ROBika V2

Format per entri:

```
asset_id · category · name · description
pixellab: <job/asset id atau "external">
dim: WxH · states: [...] · anims: [...]
world: <world-id|global> · used_by: [komponen/scene]
style_version: v2 · status: planned|generated|approved|rejected
file: public/assets/pixel/<path>
```

## Existing (v1 prototype — warisan, akan dinilai ulang terhadap ART_BIBLE)

| asset_id | file | dim | status |
|---|---|---|---|
| tile.ground | public/assets/pixel/v1/tile-ground.png | 16×16 | legacy-review |
| tile.wall | public/assets/pixel/v1/tile-wall.png | 16×16 | legacy-review |
| gate.power.closed | public/assets/pixel/v1/gate-power-closed.png | ? | legacy-review |
| bot1.idle.1/2 | public/assets/pixel/v1/bot-1-idle-*.png | 16×16 | legacy-review |
| npc.mechanic | public/assets/pixel/v1/npc-mechanic.png | ? | legacy-review |

Non-PNG yang sudah berfungsi: BotAvatar SVG (16 skin palet), world-theme CSS, NpcChip.

## Batch 0 — Pipeline Validation (Phase 1)

| asset_id | keterangan | status |
|---|---|---|
| prop.power-node.broken | terminal/node rusak 64×64 transparan — uji end-to-end PixelLab MCP + simpan ke repo | approved |

Detail Batch 0:

```
asset_id · prop.power-node.broken · category · prop · name · Power Node Rusak
description: broken power terminal node, dark slate metal cabinet, cracked cyan screen
pixellab: 01bc74c2-c662-431b-923d-71f5a5746f4b (model pixen)
dim: 64x64 · states: [broken] · anims: []
world: world-1 · used_by: [WorldScene props — Phase 3]
style_version: v2 · status: approved
file: public/assets/pixel/v2/prop-power-node-broken.png
```

Pipeline terverifikasi: generate → download → simpan repo → manifest.

## Batch 0b — Phase 2 Visual Validation (2026-08-23)

| asset_id | keterangan | status |
|---|---|---|
| char.bot1.idle-8dir | BOT-1 hero robot, 48×48, 8 arah rotasi — validasi gaya karakter vs ART_BIBLE | approved |
| anim.bot1.walk-south-4f | BOT-1 walk template 4 frame south — bukti pipeline animasi | approved |

Detail:

```
asset_id · char.bot1.idle-8dir
pixellab character: ac51d6d7-6ecb-4318-8ac8-1946a493f01e (standard mode, 1 gen)
dim: 48x48 · directions: 8 (south/east/north/west + 4 diagonal)
file(s): public/assets/pixel/v2/bot1/bot1-<dir>.png
style_version: v2 · status: approved (user approve 2026-08-23)

asset_id · anim.bot1.walk-south-4f
pixellab animation group: afecfd92-c151-48dc-bf4c-45ec4bf05ef2 · job 2a0fe294-fae0-413c-b6eb-9b4a1ab0e45d
template: walking-4-frames · direction: south · frames: 4 @ ~6.7fps
file(s): public/assets/pixel/v2/bot1/walk-south/{0..3}.png
demo: src/components/game/walk-demo.tsx (siklus 150ms) di /prototype §6
status: approved 2026-08-23 (tambah arah lain via animation_group_id yang sama)
```

Batch 0b approved oleh user 2026-08-23 → Batch 1 dibuka (saldo: 17 generasi).


## Batch 1 — Prototype (Phase 3, SETELAH design gate Phase 2)

planned: player.bot1.walk-4dir · npc.set-hub (3 NPC) · enemy.glitch · tileset.world1 (ground/wall/gate/terminal) · hud.frame · vfx.spark · building.workshop

| asset_id | pixellab id | keterangan | status |
|---|---|---|---|
| anim.bot1.walk-4dir | group afecfd92… + job 57585126 / 4a2a8c49 / 021da4b6 | walk east+north+west (template walking-4-frames, append ke group south) | generated |
| char.npc.pak-kiwar | character 7db50301-5133-4635-b9c4-ef5735dcf0ad | NPC mekanik gerbang (world-2-level-4), 48px→canvas 68×68, 8 arah | generated |
| char.npc.bu-laras | character 08e92c4f-e09a-4bdb-8e6c-549ea0aa8ff9 | NPC guru robotika (hub set #2), standard 1 gen, 8 arah | generated |
| char.npc.raka | character 19903e93-bd6e-46fb-b661-1b6211ad90c4 | NPC siswa (hub set #3), standard 1 gen, 8 arah | generated |
| char.enemy.glitchling | character 4410a6ca-4129-43c5-a138-83b185a4604d | musuh glitch magenta (persiapan level combat), standard 1 gen, 8 arah | generated |

Detail:

```
asset_id · anim.bot1.walk-4dir
pixellab animation group: afecfd92-c151-48dc-bf4c-45ec4bf05ef2 ("walking-4-frames")
jobs: east 57585126-d82e-4aa6-98c1-41c9b5f8d83e · north 4a2a8c49-aa44-4def-beda-f441bf437866 · west 021da4b6-58c5-478b-83fe-b6814790c850
template: walking-4-frames · directions: S/E/N/W · frames: 4 per arah @ ~90ms/frame di scene
file(s): public/assets/pixel/v2/bot1/walk-{south,east,north,west}/{0..3}.png
used_by: src/components/game/slice-scene.ts (startWalk/stopWalk per arah)
status: generated 2026-08-23

asset_id · char.npc.pak-kiwar
pixellab character: 7db50301-5133-4635-b9c4-ef5735dcf0ad (standard mode, 1 gen)
dim: canvas 68x68 (sprite ~48) · directions: 8
file(s): public/assets/pixel/v2/npc/pak-kiwar-<dir>.png
used_by: WorldScene NPC stand-in — Phase 3 lanjutan (world-2-level-4)
style_version: v2 · status: generated 2026-08-23
```

Aturan: 1 job PixelLab = 1 baris manifest. Gagal → cek job dulu sebelum retry (aturan #9 PRD).
