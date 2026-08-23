# SCREEN_MAP — ROBika V2

Status: KEEP (tetap) · MIGRATE (ubah visual/struktur) · NEW (baru) · PROTO (prototipe fase ini)

| # | Layar | Rute | Status | Catatan |
|---|---|---|---|---|
| 1 | Landing marketing | `/` | MIGRATE→REDIRECT | saat new_home aktif, user login diarahkan `/base` |
| 2 | Player Base (home game) | `/base` | **NEW·PROTO** | markas hidup, BOT-1 idle, quest log, menu tile |
| 3 | Login/Register/Onboarding | `(auth)` | KEEP | restyle ringan menyusul |
| 4 | World Map | `/world/[worldId]` | MIGRATE | node level jadi peta terhubung |
| 5 | Level / Game Shell | `/level/[levelId]` | MIGRATE | Phaser shell menggantikan board grid (bertahap, flag per dunia) |
| 6 | HUD in-game | komponen | **NEW·PROTO** | strip atas: LV/HP-slot/gems/quest chip |
| 7 | Coding Terminal overlay | komponen | **NEW·PROTO** | layout §19 PRD; engine interpreter lama dipakai ulang |
| 8 | Popup Quest/Reward/Unlock | komponen | **NEW·PROTO** | POPUP_SPEC |
| 9 | Academy index+lesson | `/learn/*` | KEEP | identitas visual menyusul Phase 9 |
| 10 | CodeLab | `/codelab/*` | KEEP | Monaco+Pyodide dipertahankan |
| 11 | Shop | `/shop` | KEEP | nanti dibungkus scene merchant |
| 12 | Profile character sheet | `/profile` | KEEP | tambah mastery/mastery-badge nanti |
| 13 | Daily missions | `/daily` | KEEP | format checklist PRD §59 |
| 14 | Leaderboard/Certificate/Mentor | `*` | KEEP | |
| 15 | Offline page | `/offline` | KEEP | |

## Prototype Scope Fase Ini

Layar **2, 6, 7(statis), 8** sebagai prototipe nyata di kode, di belakang flag `new_home`/`new_motion`, tanpa memengaruhi rute lama.
