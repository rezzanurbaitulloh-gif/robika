# UX_FLOW — ROBika V2

## Alur Utama Desktop

```
/base ──CONTINUE──▶ /level/[next] (Phaser shell)
  │
  ├──WORLD──▶ /world/[worldId] ──pilih node──▶ /level/[id]
  ├──ACADEMY─▶ /learn
  ├──CODELAB─▶ /codelab
  └──menu ikon: SHOP · QUESTS(DAILY) · INVENTORY(PROFILE) · LEADERBOARD
```

## Terminal Coding Flow

1. Player mendekat objek programmable → prompt `E — BUKA TERMINAL`.
2. Overlay terminal: kiri editor, kanan live world tetap terlihat, bawah output.
3. RUN → status RUNNING (world pause ringan) → SUCCESS: animasi world reaction; ERROR: panel SYSTEM REJECTED + [COBA LAGI][HINT][DEBUG AI][PELAJARI].
4. Tutup terminal dengan ESC; state dunia bertahan.

## Mobile Landscape (gameplay)

- Kiri-bawah: analog virtual (movement). Kanan-bawah: Aksi utama (interact/attack), Dodge, Kontekstual.
- Atas: HP/status ringkas + quest chip. Editor terminal full-screen landscape dengan tombol RUN besar kanan-bawah.
- Portrait gameplay tidak ditarget; tampilkan saran "putar perangkat".

## Keyboard

WASD/panah gerak · E interact · Space dodge · J attack · Q quest log · M peta · I inventory · ESC menu. Keymap modular (bisa di-rebind nanti).

## Aksesibilitas

Semua aksi mouse/touch punya padanan keyboard; focus visible; kontras teks AA; reduced-motion mematikan ambient loop & burst.
