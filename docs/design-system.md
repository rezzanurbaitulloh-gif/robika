# Robika — Design System v1.0

> Sumber kebenaran visual Robika. Dihasilkan via ui-ux-pro-max (pola: Immersive/Interactive Experience; gaya: **HUD / Sci-Fi FUI**).

## 1. Prinsip

1. **HUD-First** — seluruh UI terasa seperti antarmuka mesin/robot (matching tema BOT-1 & Kode Quest)
2. **Dark-first** — latar gelap `#0B0B10` untuk fokus & imersi; light mode disiapkan token tapi bukan prioritas
3. **Glow sebagai affordance** — elemen interaktif bercahaya (accent) membedakan konten vs aksi
4. **Monospace adalah identitas** — heading & body memakai font monospace (tech vibe), kode tetap mono
5. **Bento Grid** — komposisi kartu dengan variasi ukuran/span untuk dashboard, dunia, dan shop

## 2. Bento Grid Approach

- Grid dasar: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- Variasi span per tingkat kepentingan:
  - Feature utama → `md:col-span-2 lg:col-span-2 row-span-2`
  - Metrik → `lg:col-span-1`
  - Call-to-action → `lg:col-span-4`
- Stagger entrance: GSAP `back.out(1.4)`, 300-450ms, `from: 'center'` (biar fokus ke tengah)
- Hormati `prefers-reduced-motion` — render state akhir langsung

## 3. Tokens Warna

| Role | Hex | Penggunaan |
|---|---|---|
| `--background` | `#0B0B10` | Latar utama (dark) |
| `--foreground` | `#F8FAFC` | Teks utama |
| `--card` | `#1E1E23` | Kartu/surface |
| `--primary` | `#F8FAFC` | CTA utama (white) |
| `--accent` | `#3B82F6` | Aksi interaktif, link, glow |
| `--muted-foreground` | `#94A3B8` | Teks sekunder |
| `--border` | `#1E293B` | Border/divider |
| `--success` | `#22C55E` | Sukses / XP |
| `--warning` | `#F59E0B` | Peringatan / streak |
| `--destructive` | `#EF4444` | Error / danger |

Semua warna hanya diakses via Tailwind utility (bg-card, text-muted-foreground, dst) — **tidak pernah hardcode hex di komponen**.

## 4. Tipografi

| Level | Font | Token |
|---|---|---|
| Display / Heading | **Share Tech Mono** (400) | `--font-display` |
| Body / UI / Kode | **Fira Code** (300-700) | `--font-sans`, `--font-mono` |

- Heading: `font-display uppercase tracking-wide` untuk aura HUD
- Body: `font-sans` (Fira Code), ukuran 14-16px
- Kode inline: `font-mono` (sama dengan body — konsisten)

## 5. Komponen Basis

| Komponen | File | Penggunaan |
|---|---|---|
| `BentoCard` | `components/design/bento-card.tsx` | Kartu grid: dashboard, world map, shop |
| `StatusChip` | `components/design/status-chip.tsx` | Status: success/warning/danger/info/neutral + pulse |
| `SegmentedNav` | `components/design/segmented-nav.tsx` | Navigasi segmented: Materi/Game/CodeLab, ID/EN |
| `AppNav` | `components/nav/app-nav.tsx` | Navigasi app: bottom-nav mobile + nav desktop (active state via pathname) |
| `Button` | `components/ui/button.tsx` | Blok dasar standar (shadcn/base-ui) |
| Tombol aksi | kelas `.btn .btn-accent .btn-outline .btn-secondary .btn-sm .btn-md .btn-lg` | Satu-satunya sistem tombol yang dipakai halaman (definisi di `globals.css`) |

## 6. Micro-interactions

| Interaksi | Aturan |
|---|---|
| Hover card | `glow-box` (box-shadow accent 25%→12%) + transisi 150-300ms |
| Text penting | `.glow-text` (double text-shadow accent) |
| Loading | `.blink` (1.2s step-end) — cocok untuk "mengetik..." AI |
| Status berhasil | `.animate-pop` (0.35s ease-out) — banner reward level |
| Error/CRASH | `.animate-shake` (0.25s) — indikasi crash robot |
| Focus keyboard | Ring accent `outline-ring/50` — wajib terlihat |

## 7. Anti-pattern

- ❌ Emoji sebagai ikon struktural (pakai Lucide/`Icon`) — avatar default harus ikon robot, bukan emoji
- ❌ Hardcode warna di komponen (pakai token: `bg-card`, `bg-input`, `bg-muted`)
- ❌ Animasi tanpa `prefers-reduced-motion` guard
- ❌ Kontras teks < 4.5:1 (pakai muted-foreground hanya untuk teks sekunder)
- ❌ Menambah font baru tanpa approval (monospace adalah identitas)
- ❌ Tombol custom inline (selalu pakai kelas `.btn-*`)

## 8. Checklist Pre-Delivery

- [ ] Render di 375px, 768px, 1024px, 1440px
- [ ] Focus states visible untuk keyboard
- [ ] `cursor-pointer` pada semua elemen klik
- [ ] Reduced-motion respected (blink/glow mati)
- [ ] Tombol aksi ≥44px hit area
- [ ] Nav punya active state (`aria-current`)