# POPUP_SPEC — ROBika V2

## Tipe & Anatomi

| Tipe | Konten | Animasi masuk | Keluar |
|---|---|---|---|
| QUEST_STARTED | judul quest + 1 kalimat setup | frame turun dari atas + glow border | auto 2.2s |
| QUEST_UPDATED | objective baru (chip) | slide kiri kecil | auto 1.6s |
| QUEST_COMPLETE | ✦ title + reward list (+XP/+◇) | scale .8→1 back-out + burst pixel | klik/auto 3s |
| UNLOCK | "AREA BARU — nama" + ikon pintu | iris-wipe dari tengah | klik |
| LEVEL_UP | LV baru + stat naik | naik dari bawah + shockwave ring | auto 2.5s |
| REWARD_FLY | item → HUD counter | translate+fade stagger | selesai sendiri |

## Priority Queue

`critical(level_up/death) > major(unlock) > quest > reward > minor`
Satu popup tampil pada satu waktu; lainnya antre. Minor boleh digabung jadi ticker.

## Aturan

1. Popup TIDAK memblok input dunia kecuali critical.
2. Semua popup punya jalur keyboard: Enter=tutup/claim.
3. Angka reward dihitung server (`rewards.ts` existing) — popup hanya presenter.
4. Implementasi: satu komponen `<PopupLayer>` global dengan store zustand `usePopups.push({type,...})`.
