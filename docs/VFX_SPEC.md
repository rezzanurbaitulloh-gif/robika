# VFX_SPEC — ROBika V2

## Katalog Reusable

| id | Trigger | Implementasi fase-1 | Fase canvas |
|---|---|---|---|
| vfx.code-success | terminal SUCCESS | burst-pixel CSS (existing) + flash border hijau | partikel tile |
| vfx.code-fail | ERROR | shake 2px + border magenta blink | spark merah |
| vfx.gate-open | gatesOpened | translate gate + glow sweep | tween sprite |
| vfx.hit-spark | combat hit | — | 6 partikel kuning 3px |
| vfx.unlock | area/level baru | iris ring CSS | shader-lite |
| vfx.collect | item/coin | fly-to-HUD (POPUP_SPEC) | partikel trail |
| vfx.level-up | naik level | shockwave ring (border scale+fade) | ring partikel |
| vfx.boss-phase | pergantian fase boss | boss-ring intensify (existing) | screen tint |

## Aturan Teknis

1. Semua VFX pakai palet ART_BIBLE; tidak ada warna baru.
2. Partikel = persegi 2–4px, maksimum 12 per burst, hidup ≤700ms.
3. VFX DOM hanya di dalam container game/base, `pointer-events:none`.
4. reduced-motion: ganti dengan indikator statis (ikon + border berkedip 1×).

## Sound Hook (stub saja fase ini)

Event name wajib ditempel saat VFX dipanggil: `code.success`, `gate.open`, `quest.complete`, dll. Audio asset menyusul bertahap — arsitektur: satu emitter `playSfx(name)` no-op sampai file ada.
