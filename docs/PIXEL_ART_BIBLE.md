# ROBIKA — PIXEL ART BIBLE

> Aturan gaya visual pixel-art produksi ROBIKA. Setiap aset baru WAJIB mengikuti dokumen ini.
> Status: v1 (draft awal untuk sample approval — PRD #44)

---

## 1. Prinsip

1. **Keterbacaan di atas detail** — game dimainkan di layar 360–412px; sprite harus terbaca pada ukuran kecil.
2. **Satu keluarga palet** — semua aset berasal dari palet inti di §3; tidak ada warna di luar palet tanpa revisi Bible.
3. **Crisp edges** — tanpa anti-aliasing; `image-rendering: pixelated` saat render.
4. **Outline selektif** — outline gelap hanya pada sisi yang memisahkan objek dari background (silhouette-first).

## 2. Resolusi & Skala

| Item | Nilai |
|---|---|
| Ukuran tile native | **16×16 px** |
| Karakter native | **16×16 px** (BOT-1 boleh 16×20) |
| Render scale in-game | **2×** (tile tampil 32×32) |
| Viewport referensi | mobile 360×640 → ~11×20 tile terlihat |
| Format file | PNG, indexed-color bila memungkinkan |

## 3. Palet Inti (v1)

Peran warna mengikuti identitas UI existing (dark navy + neon):

| Peran | Hex | Pemakaian |
|---|---|---|
| Background gelap | `#0f1220` | langit/ruang kosong dunia |
| Outline tergelap | `#0b0e17` | outline semua sprite |
| Neon cyan | `#22d3ee` | teknologi, terminal, energi |
| Neon green | `#34d399` | tujuan/sukses, tile goal |
| Neon magenta | `#e879f9` | aksen langka, item spesial |
| Amber | `#fbbf24` | koin/gem/reward |
| Steel light | `#94a3b8` | logam terang, NPC netral |
| Steel dark | `#475569` | logam gelap, dinding pabrik |
| Skin/warm | `#f59e0b` | aksen hangat karakter organik |

Maksimal **12 warna per sprite**, idealnya 6–8.

## 4. Perspektif & Proporsi

- Perspektiv: **top-down ¾** (gaya klasik konsol 16-bit).
- Kepala : badan ≈ 1:1 untuk robot (kotak-friendly), NPC organik 1:1.5.
- Ground shadow: ellipse gelap semi transparan 1px di bawah karakter.

## 5. Animasi

| Jenis | Frame | Catatan |
|---|---|---|
| Idle BOT-1 | 2 frame | bob naik-turun 1px + kedip LED |
| Jalan/idle NPC | 2 frame | swap kaki |
| Walk cycle penuh | 4 frame | hanya jika gerak halus dibutuhkan |
| FX sukses/error | 4 frame | spark/glitch |

Semua animasi loop penuh (first frame == last frame secara visual).

## 6. UI Pixel Style

- Panel: border 1px `#0b0e17` + inner highlight 1px steel light atas-kiri (bevel sederhana).
- Icon: grid 16×16, bentuk silhouette jelas.
- Font tetap font UI web existing (bukan bitmap font) — pixel-art hanya untuk dunia & ikon.

## 7. Pipeline Approval

1. Buat **maksimal 5 sample asset** (BOT-1, 1 tile ground, 1 tile wall, 1 NPC, 1 gate).
2. Review visual oleh owner → setuju/tolak dengan catatan.
3. Setelah disetujui → style_version dinaikkan, baru generasi massal via PixelLab MCP.
4. Semua aset terdaftar di `docs/ASSET_MANIFEST.md`.

## 8. Aturan Placeholder

Jika PixelLab MCP tidak tersedia: buat placeholder **sengaja kasar** (blok warna palet + label) agar tidak tertukar dengan aset final. Status manifest = `PLACEHOLDER` + TODO:
`TODO: Replace placeholder with PixelLab MCP production asset.`
