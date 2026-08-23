# PRODUCT_FLOW — ROBika V2

## Loop Utama (target)

```
PLAYER BASE (/base)
  ↓ CONTINUE / WORLD MAP
WORLD (/world/[worldId])
  ↓ pilih region/level
LEVEL GAME (/level/[levelId] · Phaser shell)
  ↓ eksplorasi → NPC/quest → gate rusak
CODING TERMINAL (overlay in-world)
  ↓ tulis kode (JS) → RUN
WORLD REACTION (gerbang terbuka fisik, lampu nyala, NPC bereaksi)
  ↓ objective selesai
QUEST COMPLETE popup → XP/gems/badge → mastery naik
  ↓
kembali ke WORLD atau lanjut level berikutnya
```

Cabang keluar dari loop (tetap satu dunia):
- ACADEMY `/learn` — saat pemain "tidak paham" dari terminal (tombol [PELAJARI KONSEP]).
- CODELAB `/codelab` — lanjutan kreatif setelah menyelesaikan challenge game.
- SHOP/PROFILE/LEADERBOARD/DAILY dari menu Markas.

## Pemetaan Sistem Lama → Baru

| Lama | Menjadi |
|---|---|
| `/` landing hero+cards | Player Base `/base` (flag new_home) |
| `/dashboard` grid statistik | cadangan kompatibel; data dipakai Base |
| Board grid turn-based | Phaser scene dengan movement bebas (Phase 2–3) |
| Quiz panel | tetap, dirender sebagai terminal/HUD in-game |

## Aturan

1. Tidak ada rute lama yang dihapus; migrasi lewat flag.
2. Setiap layar baru harus bisa dijelaskan sebagai tempat di DUNIA, bukan halaman web.
3. Statistik bukan konten utama — hanya HUD.
