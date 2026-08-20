# ROBIKA — Architecture Plan v1.0

> AI Coding Academy: belajar coding multi-stack dengan game 2D (Kode Quest), CodeLab (VS Code-like), AI Tutor/Mentor, ekonomi 2 mata uang + hint. Biaya operasional Rp0 (free tier).

## 1. Prinsip Arsitektur

| Prinsip | Deskripsi |
|---|---|
| **Rp0-first** | Semua layanan free tier: Vercel, Supabase, Gemini API, Groq/CF failover |
| **Pre-generation** | 90% konten digenerate saat build → runtime AI hanya untuk chat/hint |
| **TDD** | Modul fungsi inti ditulis test-first (Vitest, minimum 80% coverage) |
| **Client-side execution** | Kode user jalan di browser (iframe sandbox, Pyodide, Phaser) — tanpa server runner |
| **Modular domain** | Logika murni (pure functions) terpisah dari I/O (Supabase, API) agar mudah diuji |
| **Progressive enhancement** | Fitur Fase 2/3 dikunci dari MVP — konten berbasis JSON schema reusable |

## 2. Struktur Folder

```
src/
├── app/                        # Next.js App Router (routes & API)
│   ├── (marketing)/            # Landing, pricing
│   ├── (auth)/                 # Login, register, onboarding/assessment
│   ├── (learn)/                # App utama (auth-protected)
│   │   ├── dashboard/          # Progres, streak, badge, skill radar
│   │   ├── world/[worldId]/    # Peta dunia Kode Quest (node + boss)
│   │   ├── level/[levelId]/    # Game 2D + editor (Phaser + CodeMirror)
│   │   ├── codelab/[challengeId]/  # Monaco multi-file + preview/console
│   │   └── mentor/             # AI Mentor Chat (berbayar, terpisah)
│   ├── shop/                   # Kosmetik (bintang/gem)
│   └── api/
│       ├── ai/                 # tutor, debug, exercises, mentor (SSE)
│       ├── payments/           # Midtrans Snap + webhook
│       └── game/               # submit level, boss cooldown
├── components/                 # UI
│   ├── ui/                     # shadcn/ui
│   └── (design)/               # BentoCard, StatusChip, SegmentedNav, dll
├── lib/
│   ├── core/                   # PURE LOGIC (TDD) — tanpa I/O
│   │   ├── hints.ts            # refresh/consume hint
│   │   ├── stars.ts            # penilaian bintang
│   │   ├── xp.ts               # XP, level, bonus
│   │   ├── assessment.ts       # klasifikasi level user
│   │   └── boss.ts             # cooldown retry boss
│   ├── db/                     # Supabase clients & queries
│   ├── ai/                     # Gemini provider + routing + cache
│   ├── game/                   # Level schema JSON, engine bridge
│   └── codelab/                # Runner bridge (Pyodide, iframe)
├── content/                    # Konten pre-generated (MDX/JSON)
├── tests/                      # Test setup, fixtures, e2e
└── docs/
    ├── design-system.md        # Tokens, Bento Grid, komponen
    └── testing/*.tdd.md        # Laporan bukti TDD
```

## 3. Modul Inti & Scope TDD

| Modul | Tanggung jawab | TDD scope |
|---|---|---|
| `hints` | Refresh 3 hint/3 hari (cap 3), consume, sisa cooldown | unit |
| `stars` | 3/2/1 bintang dari jumlah hint terpakai | unit |
| `xp` | XP per level, level dari XP, speed bonus, error-fix bonus | unit |
| `assessment` | Klasifikasi pemula/menengah/lanjut dari skor adaptif | unit |
| `boss` | Cooldown 30 menit, instant retry via gem, sisa waktu | unit |
| BentoCard/StatusChip/SegmentedNav | Komponen basis design system | unit (RTL) |

## 4. Stack

Next.js 16 (App Router, Turbopack) • TypeScript • Tailwind v4 • shadcn/ui • Vitest + Testing Library
Phaser 4 (game) • Monaco (editor) • Pyodide (Python WASM) • Gemini API (AI) • Supabase (DB/Auth) • Midtrans (payment, Fase 2)

## 5. Batasan MVP

- Belum ada pembayaran otomatis (redeem manual untuk tes)
- Game: JavaScript only, 1 dunia (Robot Rescue), 6 level + boss
- CodeLab: 2 jenis challenge (output, complete-code) — JS + Python
- Workspace: localStorage (belum sync Supabase)
