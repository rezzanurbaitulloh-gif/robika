# MOTION_SPEC — ROBika V2

## Prinsip

Motion = informasi, bukan dekorasi. Setiap animasi menjawab: apa yang berubah?

## Durasi & Easing Standar

| Jenis | Durasi | Easing |
|---|---|---|
| micro (hover/press/chip) | 120ms | ease-out |
| panel masuk/keluar | 200ms | cubic-bezier(.2,.9,.3,1) |
| popup entrance | 260ms | back-out ringan |
| world reaction (gate/lampu) | 400–700ms | steps(4) untuk rasa mekanis |
| transisi scene | 200ms fade + scanline |

## State Motion

- Button press: translateY 1px + shadow mengecil.
- Quest marker: pulse opacity .5↔1 @1.6s.
- BOT-1 idle (Base): breathing scale 1↔1.02 @2.4s + antena blink.
- Reward fly: translate ke arah HUD + scale .6 + fade, 500ms, delay stagger 60ms/item.

## Aturan Keras

1. `prefers-reduced-motion` → semua ambient loop OFF; burst diganti flash statis 150ms. (pola existing globals.css dilanjutkan)
2. Tidak ada animasi >800ms untuk feedback; ambience boleh loop panjang.
3. Maksimal 1 world-reaction berjalan bersamaan; lainnya queue.
4. Canvas (Phaser): tween engine Phaser, bukan CSS.

## Flag

Semua motion baru di belakang `NEXT_PUBLIC_FLAG_NEW_MOTION`; default mati sampai Phase 9.
