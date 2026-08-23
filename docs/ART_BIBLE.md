# ART_BIBLE — ROBika V2

Sumber kebenaran visual untuk SEMUA generasi PixelLab. Tidak ada asset yang lolos tanpa cocok dokumen ini.

## Teknis Dasar

- **Resolusi seni:** sprite karakter/objek 16×16 px; tile 16×16 px; render scale ×3 (integer).
- **Tile size game:** 48 px di layar (16×3). Kamera top-down ~20°, pixel-perfect, `pixelArt: true`.
- **Canvas karakter:** 32×32 (ruang animasi), anchor kaki-tengah.
- **Perspektif:** low top-down 3/4 (bukan isometrik, bukan side-view).

## Palet Inti (kunci)

```
outline   #0b0e17
bg-deep   #0f1220
panel     #141a2e
steel-hi  #94a3b8    steel-lo #475569
cyan      #22d3ee    cyan-dim #0e7490
green     #34d399    magenta  #e879f9
amber     #fbbf24    rose     #f43f5e
white     #e2e8f0
```

Dunia: world-1 Pabrik Kabel = slate+cyan · world-2 Distrik Gerbang = emerald+tembaga (`#fbbf24` tembaga). Dunia baru wajib 1 warna identitas + steel netral.

## Outline & Shading

- Single-color black outline (#0b0e17) selektif — luar objek tebal 1px, detail dalam tanpa outline.
- Flat shading + 1 level shadow keras (offset 1px, alpha 25%) arah kanan-bawah. Tanpa gradient halus.
- Lighting diegetik: sumber cahaya nyata di scene (lampu node, layar terminal) memberi rim light cyan/amber 1px.

## Proporsi Karakter

- BOT-1: kepala-bodi 60:40, tinggi efektif 14px, antena 2px, mata visor 2px glow.
- NPC humanoid: 3-head-tall chibi (kepala 6px, badan 5px, kaki 3px).
- Enemy Glitch: blob 12×10 dengan fragmen mengambang.

## Environment Density

Setiap layar 20×11 tile memuat ≥4 prop hidup (lampu berkedip/kabel/mesin) + 1 landmark. Jangan kosong, jangan penuh sesak.

## Animasi

Frame-rate 8fps untuk walk/idle (4–8 frame), attack 10fps. Idle selalu ada micro-motion (antena kedip, mata blink tiap 4s).

## UI & VFX & Tipografi

- UI frame: border pixel 2px + sudut terpotong 2px; panel gelap panel-color.
- VFX: partikel persegi 2–4px, palet inti; burst radial maksimal 12 partikel.
- Font display pixel hanya untuk judul/HUD ≤24px; body sans.
- Iconography: 16px grid stroke 1px, sudut tajam.

## Transisi Scene

Fade-to-black 200ms dengan scanline overlay; unlock area = iris-wipe dari pintu.

## Checklist Approval per Asset

[ ] 16px grid · [ ] palet inti ±2 warna dunia · [ ] outline #0b0e17 · [ ] flat+hard shadow · [ ] proporsioni §Proporsi · [ ] tercatat ASSET_MANIFEST
