# GAMEPLAY_SPEC — ROBika V2

## 1. Runtime

Phaser 3 (sudah ter-install, belum dipakai). Scene manager:

```
BootScene      → load manifest per dunia (bertahap, bukan semua)
BaseScene      → parallax + ambience (dipakai ulang)
WorldScene     → eksplorasi region (tilemap + collision)
TerminalOverlay→ DOM overlay (bukan canvas) di atas scene
HudScene       → strip HUD sinkron dengan React store (zustand)
```

Kode game hidup di `src/game/` (scenes, entities, systems); React hanya shell + overlay. Lazy-load: `next/dynamic(() => import("@/game/shell"))`, Phaser TIDAK masuk bundle awal.

## 2. Player

- Sprite 16×16 art, scale ×3 nearest-neighbor. Kecepatan jalan 90 px/s, lari (shift/double-tap) 150.
- Collision: arcade body vs tilemap layer `walls`; interaksi radius 24px.
- States animasi: idle/walk/run/hurt/victory (§27 PRD).

## 3. Kamera

Top-down smooth-follow (lerp 0.12), bounds = ukuran map, deadzone 8×8, zoom integer (2 atau 3), pixelArt:true, roundPixels:true. Shake 120ms/0.004 untuk boss-hit & ledakan.

## 4. Combat v0

| Aksi | Frame | Damage | Cooldown | Efek |
|---|---|---|---|---|
| Attack BOT-1 pulse | windup 6 · active 3 · recover 6 | 1 | 450ms | hit spark + knockback 40px |
| Dodge | 10 frame i-frame tengah | — | 900ms | afterimage |
| Enemy Glitch touch | — | 1 hati player | 800ms invuln | shake ringan |

Player HP default 5 hati; death → respawn checkpoint level, tidak kehilangan progress kode.

## 5. Enemy v0 — Glitch

Patrol path tile A↔B 60 px/s; deteksi radius 64 → chase 90 px/s; HP 2; mati → burst VFX + drop shard (earned currency kecil).

## 6. Quest State Machine

`LOCKED → AVAILABLE → ACTIVE → OBJECTIVE_DONE → COMPLETED → CLAIMED`
Sumber data: JSON per world (`quests[]`), disimpan via tabel progress existing (mapping additive, tanpa migrasi data rusak).

## 7. Coding Terminal (kontrak dengan engine lama)

Input kode JS dieksekusi oleh `src/lib/game/interpreter.ts` yang SUDAH ADA dan aman (tanpa eval bebas) — dipakai ulang apa adanya. Kontrak hasil:

```ts
interface TerminalResult { won, crashed, gatesOpened[], events[], error? }
```

World reaction mapping: `gate_open` → animasi pintu tile + lampu koridor menyala; `npc_talked` → bubble reaksi; `collect` → item fly-to-HUD.

## 8. World Mutation Persistence

Setelah quest selesai: tulis ke `/api/game/complete` (existing) → progress table. Offline: queue lokal, sync nanti (Phase 7).
