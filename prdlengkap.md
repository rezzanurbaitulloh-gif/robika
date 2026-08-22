

# ROBIKA — MASTER PRD & DEVELOPMENT BLUEPRINT

### Major Rearchitecture & Migration Specification

**Project:** ROBIKA
**Project type:** Coding Adventure + Learning Platform + CodeLab + AI
**Development mode:** Major Rearchitecture / Migration
**Target:** Web Application → Installable Application / PWA-ready architecture
**Primary visual identity:** Pixel Art
**Asset generation:** PixelLab MCP
**Modes:** Online + Offline
**Payment:** Midtrans
**AI:** Integrated AI Mentor/Tutor system

---

# 1. EXECUTIVE SUMMARY

ROBİKA adalah platform belajar pemrograman yang menggabungkan:

* game adventure;
* pembelajaran programming;
* coding challenges;
* CodeLab;
* AI mentor;
* progression;
* reward;
* economy;
* online/offline experience.

ROBİKA **sudah memiliki project existing**, tetapi project tersebut akan mengalami **perubahan arsitektur besar**.

Oleh karena itu, proses ini **bukan sekadar menambahkan fitur ke project lama**.

Pendekatannya adalah:

```text
EXISTING ROBIKA
      ↓
DEEP AUDIT
      ↓
EXTRACT VALUABLE FEATURES
      ↓
REDESIGN ARCHITECTURE
      ↓
REDESIGN DATABASE
      ↓
REDESIGN UX
      ↓
MIGRATE / REBUILD COMPONENTS
      ↓
INTEGRATE
      ↓
TEST
      ↓
ROBİKA V2
```

Existing implementation **tidak dianggap sebagai batasan arsitektur**.

Jika sebuah sistem lama sudah tidak sesuai dengan visi ROBIKA baru, sistem tersebut boleh:

* direfactor;
* dipindahkan;
* dipecah;
* digabung;
* diganti;
* atau dibuat ulang.

Database juga **boleh direstrukturisasi atau dibuat ulang** jika dibutuhkan.

---

# 2. PRODUCT VISION

> **ROBİKA membuat belajar programming terasa seperti memainkan sebuah adventure game.**

Player tidak hanya membaca materi.

Player akan:

```text
EXPLORE
↓
ENCOUNTER PROBLEM
↓
UNDERSTAND
↓
LEARN
↓
WRITE CODE
↓
RUN CODE
↓
SEE THE WORLD REACT
↓
SOLVE PROBLEM
↓
GET REWARD
↓
PROGRESS
↓
BUILD SOMETHING
```

Tujuan akhirnya adalah menciptakan hubungan:

```text
GAME
 ↕
LEARNING
 ↕
CODING
 ↕
CREATION
```

---

# 3. PRODUCT PRINCIPLES

Setiap fitur ROBİKA harus mendukung setidaknya satu:

### Learn

Membantu player memahami programming.

### Play

Membuat proses belajar menyenangkan.

### Code

Memberikan pengalaman coding nyata.

### Build

Mendorong player membuat sesuatu.

### Progress

Memberikan rasa perkembangan.

Jika sebuah fitur tidak memberikan kontribusi terhadap salah satu hal tersebut, fitur harus dievaluasi kembali.

---

# 4. TARGET USER

## Primary

Pemula programming.

Contoh:

* siswa;
* pelajar;
* orang yang baru belajar coding;
* calon programmer;
* pengguna yang mudah bosan dengan course konvensional.

## Secondary

Intermediate learner yang ingin:

* latihan;
* debugging;
* membuat project;
* bereksperimen dengan coding.

---

# 5. CORE PRODUCT STRUCTURE

ROBİKA terdiri dari:

```text
ROBİKA
│
├── Adventure
├── Academy
├── CodeLab
├── Quest
├── AI Mentor
├── Progression
├── Inventory
├── Shop
├── Achievement
├── Profile
└── Settings
```

Sistem tersebut tidak boleh menjadi aplikasi yang terasa terpisah.

Semua harus terhubung melalui:

```text
USER
 ↓
CONCEPT
 ↓
LEARNING
 ↓
GAME
 ↓
CODING
 ↓
PROGRESS
```

---

# 6. APPLICATION MODES

ROBİKA harus mendukung:

```text
ONLINE MODE
OFFLINE MODE
```

## Online

Semua fitur yang membutuhkan server/internet tersedia.

Contoh:

* AI;
* cloud sync;
* leaderboard;
* payment;
* online events;
* account;
* server validation.

## Offline

Player tetap bisa menggunakan core ROBİKA.

Contoh:

* Adventure;
* cached world;
* NPC;
* quest;
* coding challenge tertentu;
* Academy yang telah di-cache;
* CodeLab lokal;
* local progression.

Fitur online harus menunjukkan status dengan jelas.

Contoh:

> AI Mentor membutuhkan koneksi internet.

Bukan crash atau blank screen.

---

# 7. APPLICATION-FIRST ARCHITECTURE

ROBİKA bukan hanya website.

Architecture harus dipersiapkan untuk menjadi:

```text
WEB
 ↓
PWA / INSTALLABLE APP
 ↓
OPTIONAL NATIVE WRAPPER
```

Gunakan architecture yang tidak bergantung pada asumsi desktop browser saja.

Pertimbangkan:

* touch;
* keyboard;
* mouse;
* responsive UI;
* local storage;
* offline cache;
* application lifecycle.

---

# 8. MAJOR MIGRATION PRINCIPLE

**Existing ROBİKA adalah source of knowledge, bukan source of architectural truth.**

Artinya:

### Pertahankan

Fitur yang bagus dan relevan.

### Migrasikan

Fitur yang masih dibutuhkan tetapi implementasinya tidak cocok.

### Refactor

Fitur yang bagus tetapi code-nya bermasalah.

### Replace

Fitur yang lebih baik dibuat menggunakan pendekatan baru.

### Remove

Fitur yang tidak lagi sesuai.

### Rebuild

Fitur yang memang membutuhkan architecture baru.

---

# 9. FIRST TASK — PROJECT AUDIT

OpenCode **tidak boleh langsung coding**.

Langkah pertama:

```text
READ ENTIRE PROJECT
```

Inspect:

* folder;
* package;
* framework;
* routes;
* components;
* state management;
* database;
* API;
* authentication;
* game engine;
* game assets;
* Academy;
* CodeLab;
* AI;
* payment;
* tests;
* deployment.

Buat:

```text
docs/MIGRATION_AUDIT.md
```

---

# 10. AUDIT CLASSIFICATION

Setiap sistem existing dikategorikan:

```text
KEEP
EXTEND
REFACTOR
MIGRATE
REBUILD
REPLACE
REMOVE
```

Jangan membuat keputusan berdasarkan nama file saja.

Baca implementasinya.

---

# 11. TARGET ARCHITECTURE

Target:

```text
                    ROBİKA APPLICATION
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ADVENTURE            ACADEMY             CODELAB
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                     CONCEPT SYSTEM
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
             PROGRESS      AI        REWARDS
                │                       │
                └───────────┬───────────┘
                            ▼
                       USER PROFILE
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
              ONLINE               OFFLINE
                  │                   │
                  └─────────┬─────────┘
                            ▼
                      SYNC SYSTEM
```

---

# 12. SHARED CONCEPT SYSTEM

Ini adalah salah satu fondasi terpenting.

Satu konsep programming harus dikenali oleh seluruh platform.

Contoh:

```text
javascript.variables
javascript.conditions
javascript.loops
javascript.functions
javascript.arrays
javascript.objects
```

Concept digunakan oleh:

* Academy;
* Adventure;
* Challenge;
* CodeLab;
* AI;
* Progress;
* Achievement.

---

# 13. PLAYER PROGRESSION

Progress player tidak hanya berdasarkan level.

Gunakan beberapa dimensi:

```text
PLAYER LEVEL
CONCEPT MASTERY
QUEST PROGRESS
ACADEMY PROGRESS
CODELAB PROJECTS
ACHIEVEMENTS
```

Contoh:

```text
Level 12
JavaScript:
 ├── Variables      MASTERED
 ├── Conditions     MASTERED
 ├── Loops          IN PROGRESS
 └── Functions      NOT STARTED
```

---

# 14. ADVENTURE MODE

Adventure adalah jantung ROBİKA.

Player mengendalikan BOT-1 dalam dunia pixel-art.

Fitur:

* movement;
* exploration;
* NPC;
* dialogue;
* quest;
* puzzle;
* coding challenge;
* interactable object;
* world events;
* collectibles;
* secrets;
* reward.

---

# 15. BOT-1

BOT-1 adalah karakter utama.

Kemampuan:

* movement;
* interaction;
* dialogue;
* terminal;
* coding;
* item;
* cosmetic;
* progression.

BOT-1 harus mempunyai visual consistency.

Jika existing BOT-1 masih relevan:

> Migrasikan dan pertahankan identitasnya.

---

# 16. WORLD SYSTEM

World harus data-driven.

Struktur:

```text
WORLD
 ├── REGION
 │    ├── MAP
 │    ├── NPC
 │    ├── OBJECT
 │    ├── QUEST
 │    ├── CHALLENGE
 │    └── SECRET
 │
 └── PROGRESSION
```

Hindari hardcode logic seluruh dunia dalam satu file.

---

# 17. QUEST SYSTEM

Jenis:

```text
MAIN
SIDE
NPC
CODING
DEBUGGING
EXPLORATION
COLLECTION
PUZZLE
BOSS
LEARNING
EVENT
```

Quest memiliki:

```text
id
title
description
type
requirements
objectives
rewards
unlock
```

---

# 18. DIALOGUE SYSTEM

Dialogue harus mendukung:

* NPC;
* branching;
* choices;
* quest state;
* player state;
* concept;
* conditional dialogue.

Contoh:

```text
NPC
 ↓
PLAYER CHOICE
 ↓
QUEST STATE
 ↓
NEXT DIALOGUE
```

---

# 19. CODING AS GAMEPLAY

Coding adalah gameplay mechanic utama.

Contoh:

```text
NPC
 ↓
"Power Gate rusak."
 ↓
Inspect
 ↓
Terminal
 ↓
Write Code
 ↓
Run
 ↓
Game State Changes
 ↓
Gate Opens
```

Coding tidak boleh hanya berupa quiz dengan input jawaban.

---

# 20. GAME CODING API

Game challenge menyediakan API terbatas.

Contoh:

```text
move()
scan()
collect()
openGate()
activate()
turn()
```

API harus sandboxed.

Player tidak boleh mengakses:

* filesystem;
* server;
* database;
* environment;
* payment;
* account;
* privileged API.

---

# 21. CODE EXECUTION

Player code adalah untrusted.

Runtime wajib mempunyai:

* sandbox;
* timeout;
* output limitation;
* API restriction;
* error handling.

Status:

```text
SUCCESS
FAILED
ERROR
TIMEOUT
```

Game validator tetap menjadi authority.

AI tidak menentukan keberhasilan challenge.

---

# 22. ACADEMY

Academy adalah learning system.

Flow:

```text
PATH
 ↓
COURSE
 ↓
CHAPTER
 ↓
LESSON
 ↓
CONCEPT
 ↓
EXAMPLE
 ↓
PRACTICE
 ↓
CHALLENGE
```

---

# 23. LEARNING PATH

Contoh:

```text
Programming Fundamentals
JavaScript
Python
Web Development
HTML
CSS
SQL
```

Jangan membuat daftar bahasa terlalu banyak pada awal release.

Prioritaskan bahasa/runtime yang benar-benar didukung.

---

# 24. LESSON

Lesson dapat berisi:

* explanation;
* code example;
* interactive example;
* quiz;
* mini challenge;
* game challenge;
* CodeLab task.

---

# 25. MASTERY

Status:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
MASTERED
```

Mastery score dapat menggunakan:

* attempt;
* success;
* score;
* difficulty;
* repeated practice.

---

# 26. CODELAB

CodeLab adalah coding workspace ROBİKA.

Fitur:

* editor;
* files;
* folders;
* run;
* output;
* errors;
* preview;
* save;
* projects;
* challenge;
* playground.

Monaco Editor dapat digunakan apabila cocok dengan architecture existing.

---

# 27. CODELAB MODES

## Challenge

```text
Problem
Requirements
Starter Code
Tests
```

## Playground

Player bebas coding.

Contoh:

```text
my-project
├── index.html
├── style.css
└── script.js
```

---

# 28. SHARED CODE SYSTEM

CodeLab dan Adventure harus menggunakan konsep yang sama.

Contoh:

Player belajar:

```text
if / else
```

Academy → lesson.

Adventure → Power Gate.

CodeLab → mini project.

AI → memahami context tersebut.

---

# 29. AI SYSTEM

AI adalah mentor.

Bukan game master yang mempunyai akses penuh.

AI features:

```text
AI TUTOR
AI DEBUGGER
AI HINT
AI MENTOR
AI NPC
AI EXERCISE GENERATOR
```

---

# 30. AI TUTOR

AI menerima context:

```text
lesson
concept
language
current code
errors
mastery
```

Prioritas:

```text
EXPLAIN
→ GUIDE
→ HINT
→ PARTIAL SOLUTION
→ FULL SOLUTION
```

---

# 31. AI DEBUGGER

AI membantu:

* memahami error;
* menemukan sumber masalah;
* menjelaskan konsep;
* memberi langkah debugging.

AI tidak wajib memberikan full solution.

---

# 32. AI MENTOR

AI dapat membantu project CodeLab.

Contoh:

> "Bagaimana membuat inventory sederhana?"

AI membantu player merancang:

* struktur;
* logic;
* debugging;
* improvement.

---

# 33. AI NPC

AI dapat memberikan dialogue dinamis.

Tetapi:

> AI tidak boleh menjadi sumber state game.

Game state berasal dari game engine/server.

---

# 34. AI SECURITY

API key:

```text
SERVER ONLY
```

Wajib:

* rate limit;
* timeout;
* usage tracking;
* context limitation;
* fallback;
* error handling.

AI tidak boleh:

```text
grantReward()
modifyInventory()
completeQuest()
changeBalance()
```

---

# 35. OFFLINE SYSTEM

Offline harus dianggap sebagai **mode resmi**.

Bukan fallback error.

Architecture:

```text
LOCAL DATA
     ↓
LOCAL GAME
     ↓
LOCAL PROGRESS
     ↓
SYNC QUEUE
     ↓
SERVER
```

---

# 36. OFFLINE AVAILABLE FEATURES

Minimal:

* Adventure content yang telah tersedia;
* Academy cached;
* coding challenge tertentu;
* CodeLab draft;
* local save;
* inventory cache;
* settings.

---

# 37. ONLINE REQUIRED

* AI;
* payment;
* cloud sync;
* leaderboard;
* online events;
* server verification;
* account operations tertentu.

---

# 38. SYNC SYSTEM

Saat online kembali:

```text
LOCAL CHANGES
 ↓
SYNC QUEUE
 ↓
VALIDATE
 ↓
SERVER
 ↓
RESOLVE CONFLICT
 ↓
UPDATE LOCAL STATE
```

Server authoritative untuk:

* currency;
* payment;
* inventory;
* premium item;
* verified achievement.

---

# 39. ECONOMY

Gunakan economy sederhana.

### XP

Progress level.

### Stars

Reward gameplay.

### Gems

Premium currency.

### Hints

Learning assistance.

Jangan membuat terlalu banyak currency.

---

# 40. REWARD SYSTEM

Reward:

```text
XP
Stars
Gems
Hints
Cosmetics
Skins
Titles
Achievements
Unlocks
```

Reward harus berasal dari server/game validator.

---

# 41. TOP-UP

Top-up bukan syarat untuk belajar.

Pembelian dapat digunakan untuk:

* premium cosmetics;
* BOT-1 skins;
* visual customization;
* optional convenience;
* optional AI usage package jika diperlukan.

Jangan membuat:

> "Bayar → langsung menguasai materi."

ROBİKA harus tetap educational, bukan pay-to-win.

---

# 42. SHOP

Kategori:

```text
COSMETIC
BOT SKIN
UI THEME
SPECIAL ITEM
OPTIONAL CONVENIENCE
```

Shop harus terintegrasi dengan inventory.

---

# 43. MIDTRANS

Flow:

```text
SHOP
 ↓
CHECKOUT
 ↓
MIDTRANS
 ↓
PAYMENT
 ↓
WEBHOOK
 ↓
SERVER VERIFICATION
 ↓
TRANSACTION
 ↓
GRANT ITEM
```

Frontend tidak boleh menjadi authority pembayaran.

---

# 44. PAYMENT SECURITY

Wajib:

* server verification;
* webhook;
* idempotency;
* transaction state;
* duplicate prevention.

Status:

```text
PENDING
PAID
FAILED
EXPIRED
REFUNDED
```

---

# 45. INVENTORY

Inventory menyimpan:

* cosmetics;
* skins;
* collectibles;
* hints;
* unlocks.

Premium item harus server authoritative.

---

# 46. ACHIEVEMENT

Kategori:

```text
LEARNING
CODING
ADVENTURE
EXPLORATION
CODELAB
PROJECT
STREAK
SPECIAL EVENT
```

---

# 47. LEADERBOARD

Contoh:

* XP;
* challenge completion;
* learning progression;
* streak.

Server authoritative.

---

# 48. PIXEL ART DIRECTION

ROBİKA menggunakan pixel art sebagai identitas visual utama.

Tetapi pixel art harus tetap:

* readable;
* modern;
* clean;
* consistent;
* tidak terlalu ramai.

---

# 49. PIXELLAB MCP

**PixelLab MCP adalah pipeline asset utama untuk production pixel-art baru apabila tersedia pada environment OpenCode.**

Sebelum membuat asset:

```text
CHECK EXISTING
 ↓
DEFINE STYLE
 ↓
GENERATE
 ↓
REVIEW
 ↓
APPROVE
 ↓
INTEGRATE
```

---

# 50. PIXEL ART BIBLE

Buat:

```text
docs/PIXEL_ART_BIBLE.md
```

Dokumen berisi:

* sprite resolution;
* tile size;
* palette;
* outline;
* lighting;
* shadow;
* perspective;
* character proportions;
* animation rules;
* environment rules;
* UI rules.

---

# 51. ASSET MANIFEST

Buat:

```text
docs/ASSET_MANIFEST.md
```

Setiap asset:

```text
asset_id
name
category
source
dimensions
style_version
animation
used_by
status
```

---

# 52. ASSET CATEGORIES

```text
CHARACTER
NPC
ENEMY
BOSS
ENVIRONMENT
TILE
BUILDING
PROP
ITEM
UI
ICON
FX
BACKGROUND
```

---

# 53. DATABASE REARCHITECTURE

**Database existing boleh dirombak.**

Tidak wajib mempertahankan schema lama.

Prioritas:

```text
TARGET ARCHITECTURE
>
CLEAN DATA MODEL
>
SIMPLICITY
>
SCALABILITY
>
SECURITY
>
BACKWARD COMPATIBILITY
```

Backward compatibility **bukan prioritas tertinggi**.

---

# 54. DATABASE STRATEGY

OpenCode harus terlebih dahulu membuat:

```text
docs/DATABASE_ARCHITECTURE.md
```

Berisi:

* ERD;
* tables;
* relations;
* PK;
* FK;
* indexes;
* enums;
* RLS;
* ownership;
* lifecycle;
* offline sync;
* economy;
* transactions.

---

# 55. DATABASE RESET POLICY

Jika project masih development dan tidak terdapat production data penting:

> **Database boleh dibuat ulang dari nol.**

Jika terdapat data penting:

> lakukan migration terkontrol.

Jangan mengorbankan architecture baru hanya karena schema lama.

---

# 56. TARGET DATA MODEL

Konseptual:

```text
users
profiles

worlds
regions
maps
npcs
quests
quest_objectives
dialogues

concepts
learning_paths
courses
chapters
lessons
lesson_progress
concept_mastery

challenges
challenge_tests
challenge_attempts

code_projects
code_files
code_runs

player_progress
game_progress

achievements
user_achievements

items
inventory
currencies

shop_products
transactions
payments

ai_sessions
ai_usage

assets

sync_events
```

**Ini bukan schema final.**

OpenCode harus menyesuaikannya dengan hasil architecture design.

---

# 57. DATABASE DESIGN PRINCIPLES

Gunakan:

* normalized structure;
* proper relationships;
* indexes;
* clear ownership;
* RLS;
* server-authoritative state.

Hindari:

* duplicate data;
* giant table;
* JSON untuk semua hal;
* business logic tersebar;
* duplicated user progress;
* duplicated currency state.

---

# 58. AUTH

Authentication harus mendukung:

* register;
* login;
* logout;
* session;
* protected route;
* profile;
* account state.

Gunakan existing auth provider jika masih cocok.

---

# 59. SECURITY

Wajib:

```text
AUTHENTICATION
AUTHORIZATION
RLS
INPUT VALIDATION
SANDBOX
RATE LIMIT
SECRET PROTECTION
PAYMENT VERIFICATION
WEBHOOK VALIDATION
XSS PROTECTION
```

---

# 60. PERFORMANCE

Target:

* fast initial load;
* lazy loading;
* code splitting;
* asset optimization;
* world streaming/loading;
* cached content;
* optimized queries.

Jangan load seluruh ROBİKA pada initial screen.

---

# 61. RESPONSIVE

Support:

```text
360
390
412
768
1024
1280
1440
1920
```

Mobile:

* touch;
* compact HUD;
* responsive editor.

Desktop:

* keyboard;
* mouse;
* large game viewport;
* CodeLab workspace.

---

# 62. ACCESSIBILITY

Support:

* keyboard;
* focus;
* readable text;
* sufficient contrast;
* reduced motion;
* semantic labels;
* clear errors;
* non-color-only indicators.

---

# 63. APPLICATION UI

### Adventure

Immersive pixel-art.

### Academy

Clean learning interface.

### CodeLab

Professional IDE-style interface.

### Shop

Visual/game-like.

### Profile

Clean dashboard.

Jangan memaksa seluruh UI menjadi pixel-art jika usability terganggu.

---

# 64. ANALYTICS

Track:

### Adventure

* quest;
* challenge;
* deaths/retries;
* progression.

### Academy

* lessons;
* mastery;
* quiz.

### CodeLab

* project;
* run;
* success;
* errors.

### AI

* request;
* latency;
* failure;
* usage.

### Business

* purchase;
* conversion;
* transaction.

---

# 65. TESTING

Wajib:

```text
UNIT
INTEGRATION
E2E
AUTH
DATABASE
RLS
GAME
CODE EXECUTION
AI
PAYMENT
OFFLINE
SYNC
RESPONSIVE
```

Sebelum final:

```text
lint
typecheck
test
build
```

Gunakan command yang benar berdasarkan project existing.

---

# 66. DEVELOPMENT PHASES

## Phase 0 — Audit

```text
Repository
Architecture
Database
Assets
Features
```

Output:

```text
MIGRATION_AUDIT.md
```

---

## Phase 1 — Target Architecture

Output:

```text
ARCHITECTURE.md
DATABASE_ARCHITECTURE.md
```

---

## Phase 2 — Design System

* colors;
* typography;
* spacing;
* component;
* pixel style.

---

## Phase 3 — Pixel Pipeline

* PixelLab MCP;
* Pixel Art Bible;
* Asset Manifest.

---

## Phase 4 — Core Application

* routing;
* shell;
* navigation;
* auth;
* profile.

---

## Phase 5 — Adventure

* BOT-1;
* movement;
* world;
* NPC;
* dialogue;
* quest.

---

## Phase 6 — Coding Gameplay

* terminal;
* editor;
* runtime;
* sandbox;
* game API.

---

# 67. VERTICAL SLICE

Ini milestone paling penting.

Implement:

```text
HOME
 ↓
ADVENTURE
 ↓
WORLD
 ↓
BOT-1
 ↓
NPC
 ↓
QUEST
 ↓
BROKEN POWER GATE
 ↓
TERMINAL
 ↓
CODE
 ↓
RUN
 ↓
GAME STATE CHANGES
 ↓
QUEST COMPLETE
 ↓
REWARD
```

Concept:

> JavaScript IF / ELSE

Contoh:

```js
if (power >= 50) {
    openGate();
}
```

Jika berhasil:

```text
Gate → OPEN
Quest → COMPLETE
XP → +100
Stars → +20
```

---

# 68. PHASE 7 — ACADEMY

* learning paths;
* concepts;
* lessons;
* progress;
* mastery;
* practice.

---

# 69. PHASE 8 — CODELAB

* editor;
* filesystem;
* runtime;
* projects;
* challenge;
* playground.

---

# 70. PHASE 9 — PROGRESSION

* XP;
* level;
* stars;
* gems;
* achievements;
* inventory.

---

# 71. PHASE 10 — AI

Implement bertahap:

```text
AI Tutor
 ↓
AI Debugger
 ↓
AI Hint
 ↓
AI Mentor
 ↓
AI NPC
```

---

# 72. PHASE 11 — OFFLINE

* local storage/database;
* caching;
* offline game;
* offline Academy;
* offline CodeLab.

---

# 73. PHASE 12 — SYNC

* sync queue;
* server validation;
* conflict resolution.

---

# 74. PHASE 13 — ECONOMY

* shop;
* gems;
* cosmetics;
* inventory.

---

# 75. PHASE 14 — PAYMENT

* Midtrans;
* checkout;
* webhook;
* verification;
* transaction;
* reward fulfillment.

---

# 76. PHASE 15 — APPLICATION

Prepare:

```text
Web
 ↓
PWA
 ↓
Installable
```

Optional:

```text
Native wrapper
```

Jangan menentukan wrapper sebelum architecture final.

---

# 77. PHASE 16 — QA

Full regression terhadap:

* existing functionality;
* new functionality;
* migration;
* database;
* payment;
* offline;
* AI;
* game;
* CodeLab.

---

# 78. PHASE 17 — PRODUCTION

* deployment;
* environment variables;
* monitoring;
* logging;
* error tracking;
* backup;
* rollback;
* analytics.

---

# 79. FEATURE FLAG

Fitur besar dapat menggunakan:

```text
adventure_v2
academy_v2
codelab_v2
ai_mentor
offline_mode
economy_v2
```

Jangan expose unfinished feature ke production tanpa kontrol.

---

# 80. AGENT RULES

OpenCode harus:

### DO

* inspect;
* reason;
* document;
* migrate;
* refactor;
* test;
* verify;
* reuse good existing code;
* rebuild bad architecture;
* design before implementing large systems.

### DON'T

* blindly preserve old architecture;
* blindly rewrite everything;
* delete important data;
* invent functionality;
* fake API;
* fake payment;
* expose secrets;
* execute arbitrary code unsafely;
* generate random production assets;
* duplicate existing systems tanpa alasan.

---

# 81. STOP CONDITIONS

OpenCode harus berhenti sebelum destructive action jika:

* tidak jelas apakah data penting;
* tidak jelas apakah feature masih digunakan;
* database reset berpotensi kehilangan data;
* payment behavior ambigu;
* authentication conflict;
* runtime security belum jelas;
* PixelLab MCP tidak tersedia untuk asset yang wajib final;
* architecture mempunyai dua pilihan besar yang sama-sama valid.

---

# 82. DOCUMENTATION STRUCTURE

Target:

```text
docs/
│
├── PRD.md
├── MIGRATION_AUDIT.md
├── ARCHITECTURE.md
├── DATABASE_ARCHITECTURE.md
├── GAME_ARCHITECTURE.md
├── ACADEMY_ARCHITECTURE.md
├── CODELAB_ARCHITECTURE.md
├── AI_ARCHITECTURE.md
├── OFFLINE_SYNC.md
├── ECONOMY.md
├── PAYMENT.md
├── PIXEL_ART_BIBLE.md
├── ASSET_MANIFEST.md
└── MIGRATION_LOG.md
```

---

# 83. DEFINITION OF DONE

Feature dianggap selesai jika:

```text
FUNCTIONAL
✓

INTEGRATED
✓

PERSISTENT
✓

SECURE
✓

RESPONSIVE
✓

TESTED
✓

DOCUMENTED
✓

BUILD SUCCESSFUL
✓
```

---

# 84. MASTER OPENCODE PROMPT

**Bagian ini yang paling penting kalau lo mau langsung kirim ke OpenCode.**

```text
You are the lead engineer responsible for the major rearchitecture and migration of ROBIKA.

PROJECT NAME:
ROBİKA

ROBİKA IS AN EXISTING PROJECT.

This is NOT a greenfield project.

However, ROBIKA is undergoing a MAJOR ARCHITECTURAL TRANSFORMATION.

The existing project is the source of:
- existing features
- existing content
- existing assets
- existing implementation knowledge

But the existing architecture is NOT sacred.

You are allowed to:
- refactor
- restructure
- replace
- rebuild
- migrate
- remove obsolete systems
- redesign the database
- rebuild modules when necessary

DO NOT blindly preserve bad architecture.

DO NOT blindly rewrite everything either.

The correct strategy is:

AUDIT
→ UNDERSTAND
→ DESIGN TARGET ARCHITECTURE
→ PLAN MIGRATION
→ IMPLEMENT
→ TEST
→ VERIFY

==================================================
PRODUCT
==================================================

ROBİKA is a coding adventure platform.

It combines:

GAME
+
LEARNING
+
CODING
+
AI
+
PROGRESSION
+
CREATION

The core experience is:

EXPLORE
→ FIND PROBLEM
→ LEARN
→ CODE
→ RUN
→ CODE AFFECTS WORLD
→ SOLVE
→ REWARD
→ PROGRESS
→ BUILD

ROBİKA should make programming feel like an adventure game.

==================================================
CORE SYSTEMS
==================================================

1. ADVENTURE
2. ACADEMY
3. CODELAB
4. AI
5. PROGRESSION
6. INVENTORY
7. SHOP
8. ACHIEVEMENT
9. OFFLINE MODE
10. ONLINE MODE
11. SYNC
12. PAYMENT
13. APPLICATION/PWA

==================================================
FIRST TASK
==================================================

DO NOT START BY WRITING FEATURES.

FIRST AUDIT THE EXISTING ROBIKA PROJECT.

Inspect:

- framework
- package manager
- folder structure
- routing
- components
- state management
- database
- authentication
- API
- Adventure
- BOT-1
- maps
- NPC
- quests
- Academy
- CodeLab
- Monaco
- code runtime
- AI
- payment
- Midtrans
- economy
- inventory
- achievements
- assets
- tests
- deployment

Create:

docs/MIGRATION_AUDIT.md

Classify every major existing system as:

KEEP
EXTEND
REFACTOR
MIGRATE
REBUILD
REPLACE
REMOVE

==================================================
DATABASE POLICY
==================================================

The database MAY be redesigned.

Do NOT preserve the old database schema merely for backward compatibility.

If the old schema is unsuitable for ROBIKA's new architecture:

REDESIGN IT.

If the project is still development and there is no important production data:

RESET + REBUILD IS ALLOWED.

Before doing so:

1. audit current schema
2. identify important data
3. design target schema
4. document migration/reset decision

Create:

docs/DATABASE_ARCHITECTURE.md

Include:

- ERD
- tables
- relationships
- indexes
- RLS
- ownership
- progression
- Academy
- Adventure
- CodeLab
- AI
- economy
- inventory
- payment
- offline sync

Target architecture has priority over legacy schema.

==================================================
PIXEL ART
==================================================

ROBİKA uses pixel art as a major visual identity.

For NEW production pixel-art assets:

USE PIXELLAB MCP WHEN AVAILABLE.

Do not randomly generate production assets.

First establish:

docs/PIXEL_ART_BIBLE.md

Define:

- sprite resolution
- tile size
- palette
- outline
- lighting
- shadow
- character proportions
- animation
- environment style
- UI style

Create:

docs/ASSET_MANIFEST.md

Reuse existing good assets.

Generate new assets through PixelLab MCP.

If PixelLab MCP is unavailable:

use placeholders and mark them as non-final.

==================================================
GAMEPLAY
==================================================

Adventure is the core experience.

BOT-1 is the player character.

The world contains:

- maps
- NPCs
- quests
- objects
- challenges
- secrets
- rewards

Coding must affect the game world.

Example:

Broken Power Gate

Player investigates.

Player opens terminal.

Player writes:

if (power >= 50) {
    openGate();
}

Player runs code.

Game validates the result.

Gate opens.

Quest completes.

Player receives reward.

==================================================
CODE EXECUTION
==================================================

Player code is UNTRUSTED.

Use a sandbox.

Never allow arbitrary:

- filesystem access
- server access
- database access
- environment access
- secrets
- payment APIs

Provide only approved game APIs.

Examples:

move()
scan()
collect()
openGate()
activate()

Game validator is authoritative.

AI cannot decide whether a challenge is completed.

==================================================
ACADEMY
==================================================

Academy teaches real programming concepts.

Use shared concept IDs.

Examples:

javascript.variables
javascript.conditions
javascript.loops
javascript.functions

Concepts must be shared between:

Academy
Adventure
CodeLab
AI
Progression

==================================================
CODELAB
==================================================

CodeLab is a real coding workspace.

Support:

- editor
- files
- folders
- run
- output
- errors
- preview
- save
- projects
- challenge
- playground

Preserve useful existing CodeLab functionality but rebuild architecture if necessary.

==================================================
AI
==================================================

AI is an educational assistant.

AI can:

- explain
- teach
- debug
- hint
- mentor
- generate exercises
- assist NPC dialogue

AI cannot directly:

- grant currency
- grant items
- complete quests
- modify inventory
- modify payments
- modify account permissions

Keep AI API keys server-side.

Use:

- rate limiting
- timeout
- usage tracking
- fallback
- safe context handling

==================================================
OFFLINE
==================================================

ROBİKA supports:

ONLINE
and
OFFLINE

Offline is a real product mode.

Offline may support:

- cached Adventure
- cached Academy
- coding challenges
- local CodeLab drafts
- local progression

Online is required for:

- AI
- payment
- cloud sync
- leaderboard
- server validation
- online events

Use a sync queue.

Server is authoritative for:

- currency
- payments
- premium inventory
- server achievements

==================================================
ECONOMY
==================================================

Use a simple economy.

XP:
progression

Stars:
gameplay rewards

Gems:
premium currency

Hints:
learning assistance

Do not make learning pay-to-win.

==================================================
PAYMENT
==================================================

Use Midtrans.

Flow:

SHOP
→ CHECKOUT
→ MIDTRANS
→ PAYMENT
→ WEBHOOK
→ SERVER VERIFICATION
→ TRANSACTION
→ ITEM GRANT

Never trust frontend payment success.

Use:

- webhook
- verification
- idempotency
- transaction records
- duplicate prevention

==================================================
MIGRATION PHILOSOPHY
==================================================

Existing ROBIKA is a reference.

Not a prison.

Keep good systems.

Rebuild bad systems.

Redesign database when necessary.

Do not preserve technical debt merely for backward compatibility.

But do not destroy useful existing content without checking it.

==================================================
DEVELOPMENT ORDER
==================================================

PHASE 0
AUDIT

PHASE 1
TARGET ARCHITECTURE

PHASE 2
DATABASE ARCHITECTURE

PHASE 3
DESIGN SYSTEM + PIXEL ART BIBLE

PHASE 4
CORE APPLICATION

PHASE 5
ADVENTURE

PHASE 6
CODING GAMEPLAY

PHASE 7
VERTICAL SLICE

PHASE 8
ACADEMY

PHASE 9
CODELAB

PHASE 10
PROGRESSION

PHASE 11
AI

PHASE 12
OFFLINE

PHASE 13
SYNC

PHASE 14
ECONOMY

PHASE 15
MIDTRANS

PHASE 16
APPLICATION/PWA

PHASE 17
QA

PHASE 18
PRODUCTION

==================================================
VERTICAL SLICE
==================================================

The first major proof of ROBIKA should be:

HOME
→ ADVENTURE
→ WORLD
→ BOT-1
→ NPC
→ QUEST
→ BROKEN POWER GATE
→ TERMINAL
→ CODE
→ RUN
→ GAME STATE CHANGES
→ GATE OPENS
→ QUEST COMPLETE
→ REWARD

The programming concept:

JAVASCRIPT IF / ELSE

This vertical slice is more important than building dozens of unfinished screens.

==================================================
RULES
==================================================

DO:

- inspect before coding
- document architecture
- design before large implementation
- reuse useful code
- rebuild when necessary
- test
- secure
- verify
- use PixelLab MCP for new pixel assets
- keep systems modular
- use shared concepts
- make the world data-driven

DO NOT:

- blindly preserve legacy architecture
- blindly rewrite everything
- delete important data without checking
- fake payment
- expose secrets
- execute unsafe arbitrary code
- let AI control game authority
- duplicate systems unnecessarily
- generate inconsistent pixel assets
- implement every feature simultaneously

==================================================
STOP CONDITIONS
==================================================

Stop and ask for a decision if:

- destructive database action may lose important data
- authentication architecture is unclear
- payment architecture is unclear
- sandbox security is unclear
- two major architecture choices are equally valid
- required PixelLab MCP capability is unavailable

==================================================
FIRST RESPONSE
==================================================

Your first action is NOT implementation.

Perform the repository audit.

Create:

docs/MIGRATION_AUDIT.md

Then report:

1. EXISTING ARCHITECTURE
2. EXISTING FEATURES
3. EXISTING DATABASE
4. EXISTING GAME SYSTEM
5. EXISTING ACADEMY
6. EXISTING CODELAB
7. EXISTING AI
8. EXISTING PAYMENT
9. EXISTING ASSETS
10. KEEP
11. EXTEND
12. REFACTOR
13. MIGRATE
14. REBUILD
15. REPLACE
16. REMOVE
17. DATABASE RESET/MIGRATION RECOMMENDATION
18. PIXELLAB MCP AVAILABILITY
19. MAJOR RISKS
20. RECOMMENDED NEXT STEP

DO NOT IMPLEMENT THE FULL PRODUCT AFTER THE AUDIT.

Wait for the migration architecture to be established before beginning large-scale implementation.
```

---

## 86. TARGET END STATE

Kalau semuanya berhasil, ROBİKA akhirnya punya alur yang nyambung:

```text
                    ┌──────────────┐
                    │   ROBİKA     │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      ADVENTURE         ACADEMY          CODELAB
          │                │                │
          │                ▼                │
          │           CONCEPTS             │
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                       PROGRESS
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
             AI         REWARD       ACHIEVEMENT
              │            │
              │            ▼
              │         ECONOMY
              │            │
              └──────┬─────┘
                     ▼
                USER PROFILE
                     │
              ┌──────┴──────┐
              ▼             ▼
           ONLINE         OFFLINE
              │             │
              └──────┬──────┘
                     ▼
                  SYNC
```

