# Robika — Konsep & Kondisi Saat Ini

> Snapshot baseline sebelum diskusi migrasi konsep besar.
> Tanggal: 22 Agustus 2026 · Commit terakhir: `16251aa` · Deploy: https://robika.vercel.app

---

## 1. Konsep Produk

**Robika** = platform belajar coding **gamified** berbahasa Indonesia, berbasis web (Next.js) dan dapat dipasang sebagai PWA di HP.

Inti pengalamannya:

1. **Belajar lewat main game** — pemain memprogram robot **BOT-1** di papan grid menggunakan perintah JavaScript sungguhan (`moveForward`, `turn`, dll.) untuk menyelesaikan level berjenjang sampai boss.
2. **Kurikulum terstruktur multi-bahasa** — materi teks + kuis per modul untuk 9 stack bahasa pemrograman.
3. **CodeLab** — latihan praktik: tantangan perbaikan bug + studio live-coding di browser.
4. **Ekonomi & progres game-like** — XP, level pemain, bintang, gem, hint, badge, streak harian, leaderboard, sertifikat.
5. **AI Mentor** — asisten AI multimodal (Gemini) untuk tanya-jawab belajar.
6. **Monetisasi ringan** — top-up via Midtrans untuk hint tambahan, gem, dan akses Mentor bulanan.

---

## 2. Peta Fitur & Route

| Route | Fungsi | Akses |
|---|---|---|
| `/` | Landing page | publik |
| `/pricing` | Halaman harga/paket | publik |
| `/login`, `/register` | Masuk (email/password + OAuth Google) | publik |
| `/onboarding` | Setup profil awal | auth |
| `/dashboard` | Peta dunia / home pemain | auth |
| `/world/[worldId]` | Detail dunia & daftar level | auth |
| `/level/[levelId]` | Level game BOT-1 (editor kode + board) | auth |
| `/daily` | Tantangan harian | auth |
| `/learn` | Kurikulum multi-stack (materi + kuis) | auth |
| `/codelab` | Daftar tantangan bug-fix | auth |
| `/codelab/studio` | Live editor HTML/CSS/JS/Python | auth |
| `/codelab/challenge/[id]` | Tantangan bug individual | auth |
| `/leaderboard` | Peringkat pemain | auth |
| `/mentor` | AI Mentor (chat multimodal) | auth |
| `/shop` | Toko skin bot | auth |
| `/certificate` | Sertifikat penyelesaian | auth |
| `/profile`, `/settings` | Profil & pengaturan | auth |

Navigasi mobile: bottom bar + dropdown "Lainnya" (7 item). Desktop: navbar atas.

---

## 3. Konten (saat ini semua statis dari repo)

### Game
- **World-1 "Robot Rescue"**: **6 level + boss** (`src/content/world-1/world-1.json`)
- Mekanik: grid board, perintah JS, kemenangan = bintang (1–3) + XP + gem

### Kurikulum (`src/content/curriculum/languages/`) — **9 bahasa, 57 modul**

| Bahasa | Modul |
|---|---|
| HTML & CSS | 7 |
| JavaScript | 7 |
| Python | 7 |
| C++ | 6 |
| Go | 6 |
| Java | 6 |
| PHP | 6 |
| SQL | 6 |
| TypeScript | 6 |

Setiap modul: materi teks + kuis (progress tersimpan di tabel `learn_progress`).

### CodeLab
- **18 tantangan** bug-fix (`challenges.json`)
- Studio live editor: Monaco + Pyodide (Python di browser)

### Achievements
- **10 badge** (`src/lib/game/badges.ts`)

---

## 4. Sistem Progres & Ekonomi

- **XP → level pemain**, bintang per level game, **streak harian**
- **Gems** (premium currency), **hints** (bayar pakai gems atau rupiah)
- **Inventory skin bot**: classic, neon, gold, void
- **Leaderboard** berbasis skor/XP

### Database Supabase (11 tabel)

```
profiles · wallets · hints · inventory · progress · purchases
subscriptions · achievements · boss_attempts · learn_progress · codelab_progress
```

Migrasi SQL: `supabase/migrations/0001_init.sql` s/d `0008_codelab_progress.sql`

---

## 5. Monetisasi (Midtrans Snap)

| Paket | Harga |
|---|---|
| hints-10 | Rp 2.000 |
| hints-30 | Rp 5.000 |
| hints-150 | Rp 20.000 |
| gems-100 | Rp 10.000 |
| gems-300 | Rp 25.000 |
| gems-700 | Rp 50.000 |
| mentor-1m (Mentor AI 1 bulan) | Rp 10.000 |

---

## 6. Teknologi

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 16.3.1 (App Router, proxy/middleware) · React 19.2.8 |
| Styling/UI | Tailwind CSS v4 · lucide-react · Base UI · sonner · next-themes |
| State | Zustand |
| Editor kode | Monaco Editor (@monaco-editor/react) |
| Game engine | Phaser 4 |
| Python di browser | Pyodide |
| AI | @google/genai (Gemini, multimodal) |
| Backend | Supabase (Auth email + Google OAuth, Postgres + RLS, cookie sesi 30 hari) |
| Pembayaran | Midtrans Snap |
| Chart | Recharts |
| Testing | Vitest (28 file / **276 test**) + Testing Library |
| Deploy | Vercel · PWA (service worker sudah dicabut total) |

---

## 7. Kondisi Teknis Terkini

### Sehat ✅
- Build produksi hijau; `tsc` dan `eslint` bersih tanpa warning
- **276/276 test pass**
- Sesi login: `middleware.ts` terbukti menjadi jalur aktif (tes header) dan membawa cookie 30 hari; file ganda `proxy.ts` sudah dihapus (commit `16251aa`)
- Semua fitur UI (Run button di header editor, tombol "Selesai", dropdown navigasi) terverifikasi via Playwright emulasi mobile — bekerja sempurna di kode baru

### Menunggu verifikasi user ⏳
1. **Logout saat reload/tutup app di HP** — fix sudah dipush; menunggu user: uninstall PWA → clear data → **login ulang** (cookie 30 hari baru tertulis saat login dengan kode baru) → tes buka-tutup app
2. **Dropdown "Lainnya" tidak muncul di HP** — kode terbukti benar; diduga kuat perangkat masih menjalankan bundle lama/zombie

### Catatan utang teknis 📌
- **Konten 100% statis** (JSON/TS dalam repo) — perubahan konten butuh redeploy; tidak ada CMS/admin panel
- Hanya **1 dunia game** (world-1); struktur siap multi-world tapi belum ada kontennya
- Playwright terpasang `--no-save` khusus QA manual (bukan dependensi proyek)
- Tidak ada analitik/metrik pengguna terpasang

---

## 8. Ringkasan Angka

| Metrik | Nilai |
|---|---|
| Bahasa kurikulum | 9 |
| Total modul materi+kuis | 57 |
| Level game (world-1) | 6 + boss |
| Tantangan CodeLab | 18 |
| Badge | 10 |
| Skin bot | 4 |
| Paket pembayaran | 7 |
| Tabel database | 11 |
| Test suite | 28 file / 276 test |
