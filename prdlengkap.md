
# ROBika — MASTER CONCEPT + PRD + OPENCODE BLUEPRINT V2

**Project:** ROBika
**Type:** Pixel Coding Adventure RPG + Programming Academy + Live CodeLab
**Development Mode:** Major Existing-Project Migration
**Primary Coding Agent:** OpenCode `1.18.21`
**Asset Generation:** PixelLab MCP
**Frontend:** Existing Next.js / React / TypeScript foundation
**Game Engine:** Existing Phaser foundation
**Backend:** Supabase / PostgreSQL / Auth / RLS
**Deployment:** Vercel
**Target:** Desktop + Web + Mobile Landscape
**Status:** Master Source of Truth

---

# 1. PURPOSE

Dokumen ini merupakan **single source of truth** untuk perubahan besar ROBika.

Dokumen mencakup:

1. Konsep produk baru.
2. Perubahan dari project lama.
3. Product Requirements Document.
4. Gameplay design.
5. Learning system.
6. Live coding system.
7. AI system.
8. Offline/online system.
9. Economy dan top-up.
10. Pixel-art visual direction.
11. Animation system.
12. Popup dan VFX system.
13. PixelLab asset pipeline.
14. Technical architecture.
15. Database architecture.
16. OpenCode implementation blueprint.
17. Acceptance criteria.
18. Design gates.

---

# 2. VISI UTAMA

ROBika **bukan lagi website belajar coding yang kebetulan mempunyai game**.

ROBika harus berubah menjadi:

> **Game petualangan pixel-art yang menjadikan programming sebagai salah satu mekanik inti gameplay, sekaligus menyediakan platform belajar programming yang lengkap dan CodeLab untuk membuat program sendiri.**

Perasaan yang ingin dibangun:

> "Gue pengen main."

kemudian:

> "Lah, gue harus coding buat nyelesaiin ini?"

kemudian:

> "Oh, ternyata gue belajar konsep ini."

kemudian:

> "Gue tulis kodenya."

kemudian:

> "ANJIR KODENYA BENERAN NGUBAH DUNIA GAME."

Dan akhirnya:

> "Sekarang gue pengen bikin program gue sendiri."

---

# 3. MASALAH PROJECT LAMA

Project saat ini memiliki masalah utama:

* terlalu terasa seperti website;
* terlalu dashboard-centric;
* terlalu banyak card;
* UI terasa generik;
* game belum menjadi pusat pengalaman;
* visual belum memiliki identitas kuat;
* pixel-art belum menjadi bahasa visual utama;
* animasi belum cukup;
* interaksi belum terasa hidup;
* coding masih terasa terpisah dari gameplay;
* learning dan game belum benar-benar terhubung;
* popup dan feedback masih seperti UI website;
* fitur banyak tetapi experience belum terasa seperti game.

---

# 4. ARAH PERUBAHAN BESAR

## Dari

```text
Dashboard
    ↓
Materi
    ↓
Quiz
    ↓
Coding
    ↓
Game
```

## Menjadi

```text
WORLD
 ↓
EXPLORATION
 ↓
QUEST
 ↓
PROBLEM
 ↓
LEARNING
 ↓
CODING
 ↓
WORLD REACTION
 ↓
COMBAT / PUZZLE
 ↓
REWARD
 ↓
PROGRESSION
 ↓
NEW WORLD
```

Dan pengguna tetap bisa keluar dari loop tersebut menuju:

```text
ACADEMY
CODELAB
AI
PROFILE
COMMUNITY
SHOP
```

---

# 5. CORE GAME LOOP

```text
ENTER WORLD
      ↓
EXPLORE
      ↓
DISCOVER PROBLEM
      ↓
ACCEPT QUEST
      ↓
INTERACT
      ↓
LEARN CONCEPT
      ↓
WRITE CODE
      ↓
RUN CODE
      ↓
CODE VALIDATION
      ↓
WORLD REACTS
      ↓
COMBAT / PUZZLE / EXPLORATION
      ↓
QUEST COMPLETE
      ↓
XP + REWARD + MASTERY
      ↓
UNLOCK
      ↓
EXPLORE FURTHER
```

---

# 6. PRODUCT PILLARS

ROBika mempunyai 7 pilar utama.

## 6.1 Adventure

Game petualangan dengan:

* eksplorasi;
* NPC;
* quest;
* combat;
* dungeon;
* boss;
* world map;
* secrets;
* collectibles.

## 6.2 Coding

Programming merupakan mekanik gameplay.

## 6.3 Academy

Platform pembelajaran programming lengkap.

## 6.4 CodeLab

IDE-like environment untuk live coding.

## 6.5 AI

AI menjadi:

* tutor;
* debugger;
* mentor;
* companion;
* coding assistant.

## 6.6 Progression

Learning dan gameplay mempunyai progression yang saling berhubungan.

## 6.7 World

Seluruh sistem berada dalam satu identitas dunia yang konsisten.

---

# 7. TARGET PLATFORM

ROBika harus dapat berjalan di:

### Desktop

* Linux
* Windows
* macOS apabila kompatibel dengan deployment stack

### Web

Browser modern.

### Mobile

Mobile **landscape-first untuk gameplay**.

Gameplay portrait tidak menjadi target utama.

---

# 8. HOME / PLAYER BASE

Home tidak boleh berupa dashboard biasa.

Home harus terasa seperti **markas pemain**.

Contoh struktur:

```text
┌──────────────────────────────────────────────┐
│ ROBIKA BASE                  LV 12   ONLINE  │
│                                              │
│              [WORLD / BASE]                 │
│                                              │
│                    🤖                        │
│                  BOT-1                      │
│                                              │
│       NPC                 WORKSHOP           │
│                                              │
│               CURRENT QUEST                  │
│               Repair The Gate                │
│                                              │
│ [CONTINUE]   [WORLD]   [ACADEMY]            │
│                                              │
│ [CODELAB]    [QUESTS]  [INVENTORY]           │
└──────────────────────────────────────────────┘
```

Ini hanya layout konseptual.

Home harus memprioritaskan:

1. Continue Adventure.
2. Current Quest.
3. World.
4. Player.
5. BOT-1.
6. Academy recommendation.
7. CodeLab continuation.
8. Daily mission.

Statistik bukan fokus utama.

---

# 9. HOME AMBIENCE

Home harus hidup.

Contoh:

* BOT-1 idle animation;
* NPC bergerak;
* lampu berkedip;
* terminal aktif;
* mesin bergerak;
* partikel;
* efek ambient;
* NPC reaction;
* interactive props.

Jangan membuat background sebagai gambar statis saja.

---

# 10. WORLD DESIGN

ROBika menggunakan dunia **pixel-art tech-fantasy**.

Inspirasi konsep:

* teknologi;
* terminal;
* network;
* data;
* machine;
* system;
* protocol;
* runtime;
* glitch;
* corrupted process;
* infrastructure.

Tetapi dunia tidak boleh terasa seperti kumpulan meme programming.

Programming menjadi bagian dari lore, bukan satu-satunya tema visual.

---

# 11. WORLD MAP

Dunia harus terasa tersambung.

Contoh:

```text
                     DATA VAULT
                         │
                         │
LOGIC FOREST ───── CENTRAL HUB ───── WEB CITY
                         │
                         │
                    SYSTEM CAVES
                         │
                         │
                    API DISTRICT
                         │
                         │
                   DATABASE VAULT
```

Nama wilayah masih dapat berubah.

---

# 12. REGION DESIGN

Region dapat berhubungan dengan konsep programming.

Contoh:

### Central Hub

Introduction.

### Logic Forest

* variable;
* condition;
* loop;
* function.

### Web City

* HTML;
* CSS;
* JavaScript;
* TypeScript.

### API District

* HTTP;
* REST;
* JSON;
* API.

### Database Vault

* SQL;
* relational database;
* query;
* index;
* transaction.

### System Caves

* memory;
* process;
* concurrency;
* systems.

### AI Sector

* data;
* machine learning;
* AI.

Region tidak harus mengajarkan semua konsep sekaligus.

---

# 13. PLAYER GAMEPLAY

Player dapat:

* berjalan;
* berlari;
* menyerang;
* dodge;
* interact;
* berbicara;
* membuka chest;
* mengambil item;
* menggunakan item;
* menerima quest;
* bertarung;
* mengakses terminal;
* memecahkan puzzle;
* menggunakan coding mechanic.

---

# 14. CONTROL DESKTOP

Default:

```text
WASD        Movement
Arrow Keys  Alternative movement
Mouse       UI / interaction
E           Interact
Space       Dodge / context
J           Attack
I           Inventory
M           Map
Q           Quest
ESC         Menu
```

Keybinding harus dapat dibuat configurable di masa depan.

---

# 15. MOBILE LANDSCAPE

Layout:

```text
┌──────────────────────────────────────────────────┐
│ HP / STATUS                       QUEST           │
│                                                  │
│                                                  │
│                  GAME WORLD                      │
│                                                  │
│                                                  │
│  ◯                           ⚔   ◉   💥          │
│ ANALOG                    ACTION BUTTONS         │
└──────────────────────────────────────────────────┘
```

Kiri:

* analog.

Kanan:

* attack;
* dodge;
* interact;
* contextual action.

---

# 16. CAMERA

Gunakan:

* top-down;
* pixel-perfect;
* smooth follow;
* bounded world;
* nearest-neighbor scaling.

Tidak boleh:

* blur;
* scaling yang membuat sprite pecah secara tidak sengaja;
* camera movement berlebihan.

Camera shake digunakan untuk:

* boss hit;
* critical attack;
* explosion;
* major event.

---

# 17. QUEST SYSTEM

Quest:

* story;
* exploration;
* combat;
* retrieval;
* escort;
* investigation;
* coding;
* debugging;
* environmental puzzle;
* dungeon;
* boss;
* optional learning.

Struktur:

```text
QUEST
 ↓
STORY SETUP
 ↓
EXPLORATION
 ↓
INTERACTION
 ↓
OBJECTIVE
 ↓
CODING / COMBAT / PUZZLE
 ↓
RESOLUTION
 ↓
REWARD
```

Tidak semua quest wajib mempunyai seluruh tahap.

---

# 18. CODING AS GAMEPLAY

Programming menjadi gameplay mechanic.

Contoh:

```text
Condition
→ membuka gate

Loop
→ mengontrol machine berulang

Function
→ membuat ability reusable

Array
→ mengontrol kumpulan object

Object
→ konfigurasi NPC

Event
→ trigger world event

State
→ mengontrol boss

API
→ berkomunikasi dengan system

SQL
→ mengambil data dari vault

Debugging
→ memperbaiki corrupted system
```

---

# 19. CODING TERMINAL

Saat player menemukan objek programmable:

```text
BROKEN POWER NODE

Power routing failed.

Control logic requires repair.

[ OPEN TERMINAL ]
```

Ketika dibuka:

```text
┌─────────────────────────────────────────────────┐
│ POWER NODE                                  ×  │
├──────────────────────────┬──────────────────────┤
│ CODE                     │ LIVE WORLD           │
│                          │                      │
│ 1 const power = ...      │        ⚡            │
│ 2 if (...) {             │       NODE           │
│ 3    ...                 │                      │
│ 4 }                      │                      │
│                          │                      │
│                 [ RUN ]  │                      │
├──────────────────────────┴──────────────────────┤
│ OUTPUT / ERROR / HINT                           │
└─────────────────────────────────────────────────┘
```

World tetap terlihat jika memungkinkan.

---

# 20. WORLD REACTION

Ini sangat penting.

Coding tidak boleh hanya menghasilkan:

```text
Correct!
```

Harus:

```text
CODE SUCCESS
 ↓
TERMINAL GLOW
 ↓
ELECTRICITY FLOWS
 ↓
MACHINE STARTS
 ↓
LIGHTS TURN ON
 ↓
GATE ANIMATES
 ↓
GATE OPENS
 ↓
NPC REACTS
 ↓
QUEST UPDATED
 ↓
REWARD
```

---

# 21. FAILURE FEEDBACK

Jangan:

```text
WRONG!
```

Gunakan:

```text
SYSTEM REJECTED

The sensor value was not handled
for the offline state.

[TRY AGAIN]
[DEBUG]
[ASK AI]
[HINT]
```

---

# 22. COMBAT

Combat harus benar-benar terasa sebagai combat.

Minimum:

* attack;
* dodge;
* enemy attack;
* hit reaction;
* knockback;
* damage;
* death;
* cooldown;
* VFX;
* animation.

---

# 23. COMBAT FEEL

Sequence:

```text
ATTACK WIND-UP
 ↓
ATTACK FRAME
 ↓
IMPACT
 ↓
HIT VFX
 ↓
DAMAGE
 ↓
KNOCKBACK
 ↓
ENEMY REACTION
```

Untuk attack besar:

```text
ATTACK
 ↓
SCREEN SHAKE
 ↓
VFX
 ↓
SOUND HOOK
 ↓
ENEMY STAGGER
```

---

# 24. ENEMY SYSTEM

Contoh enemy:

### Glitch

Basic enemy.

### Null

Menghilangkan action tertentu.

### Loop

Memiliki attack berulang.

### Memory Leak

Semakin lama semakin kuat.

### Deadlock

Dua state saling menunggu.

### Overflow

Damage meningkat jika tidak dihentikan.

Nama hanya konsep awal.

Setiap enemy harus mempunyai gameplay mechanic.

---

# 25. BOSS

Boss memiliki beberapa phase.

Contoh:

```text
PHASE 1
Combat

PHASE 2
Arena changes

PHASE 3
System becomes vulnerable

PLAYER
opens terminal

CODE
changes boss system

PHASE 4
Final combat
```

Boss harus terasa seperti encounter game, bukan soal coding dengan health bar.

---

# 26. BOT-1

BOT-1 adalah companion utama.

Kemampuan:

* follow;
* attack;
* defend;
* interact;
* gather;
* scan;
* assist.

BOT-1 juga dapat diprogram.

Contoh:

```js
if (enemy.distance < 5) {
  attack();
}
```

Advanced gameplay:

Player dapat membuat behavior BOT-1.

---

# 27. ANIMATION SYSTEM

Semua entity penting memiliki animation states.

## Player

* idle;
* walk;
* run;
* attack;
* dodge;
* hurt;
* interact;
* use item;
* victory;
* defeat.

## BOT-1

* idle;
* walk;
* follow;
* attack;
* defend;
* interact;
* gather;
* hurt;
* victory;
* defeat.

## NPC

* idle;
* walk;
* talk;
* interact;
* happy;
* worried;
* surprised;
* quest available;
* quest complete.

## Enemy

* idle;
* patrol;
* alert;
* attack windup;
* attack;
* hurt;
* stagger;
* defeat.

## Boss

* idle;
* attack;
* special;
* hit;
* shield;
* phase transition;
* vulnerable;
* defeat.

---

# 28. MICRO ANIMATION

Environment:

* blinking lights;
* machine vibration;
* screen flicker;
* moving particles;
* wind;
* water;
* floating dust;
* electricity;
* NPC idle movement.

UI:

* button press;
* quest marker pulse;
* reward movement;
* popup entrance;
* popup exit;
* loading animation.

---

# 29. POPUP SYSTEM

Popup harus memiliki fungsi.

## Quest Started

```text
╔══════════════════════╗
      QUEST STARTED

       REPAIR THE GATE

A broken system is blocking
the route.
╚══════════════════════╝
```

## Quest Complete

```text
✦ QUEST COMPLETE ✦

REPAIR THE GATE

+250 XP
+35 ◇
```

## Unlock

```text
NEW AREA UNLOCKED

SYSTEM CAVES
```

## Reward

Reward dapat menggunakan animation:

```text
Reward
 ↓
float
 ↓
move toward HUD
 ↓
currency counter updates
```

---

# 30. POPUP PRIORITY

Jangan spam popup.

Priority:

```text
Critical
 ↓
Major
 ↓
Quest
 ↓
Reward
 ↓
Minor
```

Multiple popup dapat di-stack atau queue.

---

# 31. UI STATES

Button:

```text
IDLE
HOVER
PRESS
DISABLED
LOADING
SUCCESS
ERROR
```

Quest:

```text
LOCKED
AVAILABLE
ACTIVE
OBJECTIVE COMPLETE
COMPLETED
CLAIMED
```

Terminal:

```text
CLOSED
OPENING
READY
RUNNING
SUCCESS
ERROR
DEBUG
CLOSING
```

NPC:

```text
IDLE
PLAYER NEAR
INTERACTABLE
DIALOGUE
QUEST
QUEST COMPLETE
```

---

# 32. VFX

Reusable VFX:

* hit spark;
* slash;
* electrical pulse;
* energy burst;
* coding success;
* coding failure;
* unlock;
* quest complete;
* heal;
* level up;
* collectible;
* teleport;
* boss phase transition.

---

# 33. SOUND HOOK

Sound system harus memiliki event architecture.

Contoh:

```text
player.attack
player.hit
enemy.hit
enemy.death
quest.start
quest.update
quest.complete
code.run
code.success
code.error
terminal.open
terminal.close
level.up
item.collect
boss.phase
world.unlock
```

Asset audio dapat ditambahkan bertahap.

---

# 34. DIALOGUE

Dialogue harus terhubung dengan karakter.

```text
NPC
 ↓
Animation
 ↓
Dialogue
 ↓
Character reaction
 ↓
Quest / Event
```

Dialogue dapat:

* memulai quest;
* membuka area;
* memulai combat;
* memberi item;
* memberikan coding challenge;
* mengarahkan Academy.

---

# 35. ACADEMY

Academy tetap lengkap.

Struktur:

```text
CATEGORY
 ↓
LEARNING PATH
 ↓
LANGUAGE / TECHNOLOGY
 ↓
CHAPTER
 ↓
LESSON
 ↓
INTERACTIVE EXAMPLE
 ↓
PRACTICE
 ↓
ASSESSMENT
 ↓
PRACTICE IN GAME
 ↓
CODELAB
 ↓
PROJECT
```

---

# 36. MATERI PEMBELAJARAN

Setiap lesson dapat berisi:

* teori;
* visual explanation;
* code example;
* interactive editor;
* output;
* common mistake;
* exercise;
* checkpoint;
* assessment;
* Practice in Game;
* CodeLab continuation.

---

# 37. BAHASA PEMROGRAMAN

Architecture harus data-driven.

Kategori:

### Fundamentals

* algorithm;
* logic;
* debugging;
* data structures;
* computational thinking.

### Frontend

* HTML;
* CSS;
* JavaScript;
* TypeScript;
* React;
* Next.js;
* Vue;
* Nuxt;
* Svelte;
* Angular;
* Tailwind;
* browser APIs;
* accessibility.

### Backend

* Node.js;
* Express;
* NestJS;
* Python;
* FastAPI;
* Flask;
* Django;
* PHP;
* Laravel;
* Java;
* Spring;
* Go;
* C#;
* ASP.NET;
* Ruby/Rails;
* Rust.

### Database

* SQL;
* PostgreSQL;
* MySQL;
* SQLite;
* MongoDB;
* Redis;
* indexing;
* transaction;
* normalization;
* database design;
* Supabase.

### Mobile

* Flutter;
* Dart;
* React Native;
* Kotlin;
* Swift.

### Systems

* C;
* C++;
* Rust;
* Go.

### Data / AI

* Python;
* NumPy;
* Pandas;
* visualization;
* ML;
* AI application development.

### DevOps

* Git;
* GitHub;
* Linux;
* Docker;
* CI/CD;
* deployment;
* monitoring;
* testing.

### Security

* authentication;
* authorization;
* OWASP;
* secure coding;
* web security.

### UI/UX

* design;
* typography;
* accessibility;
* design systems;
* Figma.

### Game Development

* JavaScript;
* Canvas;
* Phaser;
* game loop;
* collision;
* state;
* Godot.

### Full Stack

* frontend;
* backend;
* API;
* database;
* authentication;
* deployment;
* architecture.

---

# 38. LANGUAGE REGISTRY

Gunakan registry:

```ts
type LanguageDefinition = {
  id: string
  name: string
  category: string
  fileExtensions: string[]
  syntaxDefinition: string
  executionMode:
    | "browser"
    | "wasm"
    | "sandbox"
    | "preview"
    | "remote"
  compiler?: string
  runtime?: string
  supportsMultiFile: boolean
  supportsPreview: boolean
  curriculumId?: string
}
```

Jangan mengklaim bahasa dapat dijalankan sebelum runtime-nya benar-benar tersedia.

---

# 39. CODELAB

CodeLab harus menjadi development environment sungguhan.

User dapat:

* membuat project;
* membuat folder;
* membuat file;
* edit code;
* run;
* preview;
* debug;
* save;
* reopen;
* multi-file;
* AI assistance.

Jangan membuat clone VS Code penuh.

---

# 40. CODELAB DESKTOP

```text
┌──────────────────────────────────────────────────────┐
│ ROBIKA CODELAB                  PROJECT     RUN ▶     │
├──────────────┬──────────────────────────┬────────────┤
│ EXPLORER     │ EDITOR                   │ PREVIEW    │
│              │                          │            │
│ src/         │ main.ts                  │ LIVE       │
│  main.ts     │ 1 ...                    │ PREVIEW    │
│  utils.ts    │ 2 ...                    │            │
│ assets/      │ 3 ...                    │            │
├──────────────┴──────────────────────────┴────────────┤
│ OUTPUT / TERMINAL / PROBLEMS                         │
└──────────────────────────────────────────────────────┘
```

---

# 41. CODELAB MOBILE

Mobile landscape:

* editor menjadi fokus;
* explorer collapsible;
* preview collapsible;
* output collapsible;
* Run button besar;
* touch target minimal nyaman;
* keyboard aware.

---

# 42. LIVE PREVIEW

Untuk web:

```text
HTML
CSS
JavaScript
TypeScript
```

Pipeline:

```text
EDITOR
 ↓
TRANSFORM
 ↓
SANDBOX
 ↓
PREVIEW
```

Sandbox tidak boleh mengakses:

* Supabase secret;
* cookie aplikasi;
* filesystem;
* server;
* parent window;
* production API privileged.

---

# 43. CODE EXECUTION

Contoh:

```text
JavaScript
→ browser sandbox

TypeScript
→ transpile + sandbox

HTML/CSS
→ sandboxed iframe

Python
→ Pyodide bila sesuai

SQL
→ isolated SQL runtime

C/C++
→ WASM/sandbox bila tersedia

Rust
→ WASM/sandbox bila tersedia

Go
→ WASM/sandbox bila tersedia
```

Jangan execute arbitrary user code langsung di production server process.

---

# 44. AI

AI tidak boleh cuma berupa:

```text
AI Chat
```

AI mempunyai role.

### AI Tutor

Membantu memahami lesson.

### AI Debugger

Menganalisis error.

### AI Mentor

Review project.

### AI Companion

BOT-1.

### AI Exercise Generator

Membuat latihan berdasarkan curriculum.

---

# 45. AI UX

Gunakan contextual action:

```text
[ HINT ]
[ EXPLAIN ]
[ DEBUG WITH AI ]
[ ASK BOT-1 ]
```

Bukan selalu membuka halaman chat besar.

---

# 46. AI LIMITATION

AI tidak boleh:

* memberikan jawaban assessment secara langsung tanpa konteks;
* membocorkan protected solution;
* bypass progression;
* menjalankan privileged command;
* mengakses secret;
* mengakses data user lain.

---

# 47. DEBUG MODE

Saat error:

```text
DEBUG VIEW

VARIABLES
playerHP = 23
enemyHP = 87
shield = true

STATE
bossPhase = 2

ERROR
Expected boolean,
received undefined.
```

Tujuannya juga mengajarkan debugging.

---

# 48. CODING DUNGEON

Programming concept menjadi area game.

Contoh:

```text
DATABASE VAULT

ROOM 01 — SELECT
ROOM 02 — WHERE
ROOM 03 — JOIN
ROOM 04 — INDEX
ROOM 05 — TRANSACTION

BOSS — DATA CORRUPTOR
```

Ini harus berupa area game, bukan list quiz.

---

# 49. SHARED CONCEPT GRAPH

Setiap konsep memiliki ID.

Contoh:

```text
javascript.variables
javascript.conditions
javascript.loops
javascript.functions

python.variables

sql.select
sql.where

html.semantic-elements

css.flexbox
```

Setiap konsep terhubung dengan:

```text
lesson
assessment
game challenge
CodeLab challenge
project
AI context
progress
```

Ini adalah jembatan utama antara Game + Academy + CodeLab + AI.

---

# 50. PROGRESSION

Track:

```text
Player Level
Programming Mastery
Languages
Stacks
World Progress
CodeLab Projects
Achievements
Streak
BOT-1 Progress
Collection
```

Jangan hanya memakai `completed = true`.

---

# 51. MASTERY

State:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
MASTERED
```

Data:

```ts
{
  conceptId,
  userId,
  attempts,
  successfulAttempts,
  lastScore,
  mastery,
  lastPracticedAt
}
```

---

# 52. OFFLINE MODE

ROBika harus memiliki:

## Offline

Dapat:

* menjalankan adventure;
* movement;
* combat;
* story;
* quest;
* downloaded lesson;
* downloaded exercise;
* local CodeLab;
* local progress;
* downloaded assets.

Tidak dapat atau terbatas:

* AI;
* cloud sync;
* community;
* leaderboard;
* online shop;
* top-up;
* remote execution;
* online content.

---

# 53. ONLINE MODE

Online menambahkan:

* AI;
* cloud save;
* community;
* leaderboard;
* shop;
* top-up;
* cloud projects;
* remote runtime;
* content updates.

---

# 54. OFFLINE SYNC

```text
LOCAL EVENT
 ↓
LOCAL VALIDATION
 ↓
QUEUE
 ↓
NETWORK AVAILABLE
 ↓
SERVER VALIDATION
 ↓
SYNC
```

Currency premium dan purchase harus server-authoritative.

---

# 55. ECONOMY

## Earned currency

Diperoleh dari:

* quest;
* coding challenge;
* Academy;
* achievement;
* exploration;
* daily mission;
* boss.

Digunakan untuk:

* cosmetic;
* decoration;
* customization;
* optional convenience.

---

# 56. PREMIUM CURRENCY

Premium currency dapat digunakan untuk:

* skin;
* BOT-1 skin;
* effect;
* emote;
* decoration;
* profile customization;
* optional convenience;
* AI credits jika memang diperlukan.

**Jangan menjual kemampuan belajar.**

Tidak boleh:

```text
Pay → unlock programming knowledge
```

---

# 57. TOP-UP

Top-up digunakan untuk value opsional.

Architecture harus memungkinkan:

* web payment;
* Android billing;
* iOS billing.

Jangan membuat ekonomi bergantung secara permanen kepada payment provider tertentu.

---

# 58. SHOP

Shop harus terasa seperti bagian dari game.

Contoh:

```text
MERCHANT
 ↓
PLAYER
 ↓
COSMETIC
 ↓
PREVIEW
 ↓
PURCHASE
```

Produk:

* player skin;
* BOT-1 skin;
* VFX;
* emote;
* decoration;
* title;
* profile cosmetic.

---

# 59. DAILY MISSION

```text
TODAY

□ Repair one system
□ Complete one coding challenge
□ Practice one concept
□ Explore one hidden area
□ Run one CodeLab project
```

Reward:

* XP;
* earned currency;
* cosmetic progress.

---

# 60. PROFILE

Profile harus seperti **character sheet + developer profile**.

Menampilkan:

* avatar;
* BOT-1;
* level;
* skills;
* mastery;
* achievements;
* worlds;
* languages;
* projects;
* streak;
* certificates;
* showcase.

---

# 61. COMMUNITY

Future:

* user challenge;
* project showcase;
* solutions;
* leaderboard;
* challenge rating;
* public profile.

Security dan moderation wajib.

---

# 62. PIXELLAB MCP

PixelLab MCP menjadi asset production pipeline.

Gunakan untuk:

### Character

* create character;
* character state;
* animation;
* portrait.

### Object

* 1-direction;
* 8-direction;
* states;
* animation.

### Environment

* tileset;
* terrain;
* building kit;
* paths;
* map;
* map objects.

### UI

* UI asset;
* font;
* portraits;
* icons.

### Image

* freeform pixel art;
* edit;
* inpaint;
* animate.

---

# 63. ART BIBLE

Sebelum generate asset massal, OpenCode harus membuat:

```text
docs/ART_BIBLE.md
```

Wajib berisi:

* pixel resolution;
* tile size;
* sprite scale;
* camera perspective;
* palette;
* outline;
* lighting;
* shadows;
* character proportions;
* environment density;
* animation;
* UI;
* VFX;
* typography;
* iconography;
* transition.

---

# 64. ASSET MANIFEST

File:

```text
docs/ASSET_MANIFEST.md
```

Format:

```text
asset_id
category
name
description
PixelLab ID
dimensions
states
animations
world
used_by
style_version
status
```

Contoh:

```text
player.bot1

type:
character

states:
idle
walk
attack
hurt

world:
central-hub

status:
approved
```

---

# 65. PIXELLAB ASSET GENERATION ORDER

## Batch 1 — Prototype

Hanya:

* protagonist;
* BOT-1;
* NPC;
* enemy;
* tileset;
* ground;
* wall;
* gate;
* terminal;
* building;
* props;
* HUD;
* VFX.

## Batch 2 — Vertical Slice

Tambahkan:

* animation;
* quest objects;
* dungeon;
* boss;
* combat VFX;
* dialogue assets;
* coding terminal assets.

## Batch 3

Baru generate asset expansion.

**Jangan generate seluruh game sekaligus.**

---

# 66. VISUAL DESIGN MODES

## Game

Pixel-art.

## Academy

Readable, tetapi tetap memiliki identitas ROBika.

## CodeLab

Professional developer interface.

Bukan berarti seluruh aplikasi harus memakai pixel font.

---

# 67. ANTI-GENERIC RULE

Jika OpenCode membuat:

```text
Navbar
Hero
3 Cards
Stats
Feature Cards
Footer
```

sebagai main experience:

**REJECT.**

Jika sesuatu dapat direpresentasikan sebagai:

* world;
* NPC;
* building;
* terminal;
* quest;
* dungeon;
* map;
* inventory;
* dialogue;
* HUD;

gunakan bentuk tersebut jika memang masuk akal.

Hindari:

* glassmorphism;
* gradient berlebihan;
* AI purple/blue generic;
* floating blobs;
* stock illustration;
* SaaS card layout;
* rounded cards berlebihan;
* dashboard sebagai pusat pengalaman.

---

# 68. DATABASE

Jangan langsung membuat database baru.

OpenCode wajib memeriksa migration existing.

Potential future tables:

```text
languages
learning_paths
concepts
lessons
lesson_steps
game_worlds
game_regions
game_quests
game_challenges
code_projects
code_project_files
code_runs
skill_progress
asset_manifest
offline_sync_events
```

Tetapi tabel hanya boleh dibuat setelah audit schema.

---

# 69. EXISTING DATA

Tidak boleh kehilangan:

* account;
* XP;
* gems;
* hints;
* inventory;
* achievements;
* learning progress;
* CodeLab progress;
* subscription;
* purchase history.

---

# 70. ARCHITECTURE

```text
ROBika
│
├── Presentation
│   ├── Game UI
│   ├── Academy
│   ├── CodeLab
│   └── System UI
│
├── Game Runtime
│   └── Phaser
│
├── Learning Engine
├── Code Execution
├── AI Layer
├── Progression
├── Economy
├── Offline Storage
├── Sync Engine
└── Online Services
    ├── Supabase
    ├── AI
    ├── Payment
    └── Community
```

---

# 71. CONTENT ARCHITECTURE

Recommended:

```text
src/content/

languages/
concepts/
curricula/
lessons/
exercises/
game/
worlds/
regions/
quests/
challenges/
codelab/
projects/
```

Game scene tidak boleh hard-code seluruh quest.

---

# 72. SECURITY

User code adalah untrusted.

Harus ada:

* timeout;
* memory limit;
* output limit;
* network restriction;
* sandbox;
* iframe isolation;
* no secret;
* no privileged API;
* runaway protection.

---

# 73. PERFORMANCE

Target:

* lazy-load Phaser;
* lazy-load Monaco;
* lazy-load assets;
* sprite sheets;
* avoid huge bundle;
* avoid unnecessary React renders;
* load world secara bertahap.

Jangan load seluruh game world saat startup.

---

# 74. RESPONSIVE TEST

Wajib test:

### Mobile

```text
360
390
412
```

### Tablet

```text
768
1024
```

### Desktop

```text
1280
1440
1920
2560
```

Mobile gameplay harus diuji landscape.

---

# 75. ACCESSIBILITY

Support:

* keyboard;
* focus;
* contrast;
* readable text;
* reduced motion;
* non-color feedback;
* accessible labels.

Pixel art tidak boleh menjadi alasan text susah dibaca.

---

# 76. FIRST VERTICAL SLICE

Gunakan:

**JavaScript `if / else`**

Scenario:

> Player menemukan gate rusak.

Academy:

```text
Condition
Comparison
if
else
```

Game:

```text
PLAYER
 ↓
GATE
 ↓
TERMINAL
 ↓
CODE
 ↓
RUN
 ↓
VALIDATION
 ↓
GATE OPENS
```

---

# 77. VERTICAL SLICE ACCEPTANCE

Harus ada:

* player movement;
* collision;
* camera;
* NPC;
* dialogue;
* quest;
* coding terminal;
* Monaco;
* safe execution;
* world mutation;
* animation;
* VFX;
* popup;
* reward;
* persistence;
* desktop controls;
* mobile landscape.

Kalau code cuma mengubah database:

**BELUM SELESAI.**

---

# 78. MIGRATION PHASES

## PHASE 0 — AUDIT

Buat:

```text
docs/MIGRATION_AUDIT.md
```

Tidak boleh redesign.

Tidak boleh membuat database baru.

Tidak boleh generate asset.

---

## PHASE 1 — DESIGN FOUNDATION

Buat:

```text
docs/PRODUCT_FLOW.md
docs/UX_FLOW.md
docs/SCREEN_MAP.md
docs/GAMEPLAY_SPEC.md
docs/DESIGN_SYSTEM.md
docs/ART_BIBLE.md
docs/ASSET_MANIFEST.md
docs/MOTION_SPEC.md
docs/POPUP_SPEC.md
docs/VFX_SPEC.md
```

Prototype:

* Home;
* Base;
* Game shell;
* World;
* HUD;
* Quest;
* Dialogue;
* Terminal;
* Academy;
* CodeLab.

---

## PHASE 2 — VISUAL PROTOTYPE

Validasi:

* pixel art;
* animation;
* camera;
* HUD;
* popup;
* VFX;
* world reaction.

---

## PHASE 3 — VERTICAL SLICE

```text
BASE
 ↓
WORLD
 ↓
NPC
 ↓
QUEST
 ↓
GATE
 ↓
TERMINAL
 ↓
CODE
 ↓
RUN
 ↓
WORLD REACTS
 ↓
QUEST COMPLETE
 ↓
REWARD
```

---

## PHASE 4 — ACADEMY BRIDGE

```text
GAME
 ↓
I DON'T UNDERSTAND
 ↓
ACADEMY
 ↓
PRACTICE
 ↓
PRACTICE IN GAME
 ↓
GAME
```

---

## PHASE 5 — CODELAB

Preserve:

* Monaco;
* Pyodide;
* project;
* progress.

Tambahkan:

* language registry;
* multi-file;
* preview;
* sandbox;
* execution state.

---

## PHASE 6 — AI

Integrasikan AI ke:

* Academy;
* CodeLab;
* Terminal;
* BOT-1;
* Debugging.

---

## PHASE 7 — OFFLINE

Implement:

* local content;
* local save;
* offline CodeLab;
* sync queue;
* online/offline state.

---

## PHASE 8 — ECONOMY

Setelah gameplay stabil:

* earned reward;
* cosmetics;
* premium;
* top-up;
* entitlement.

---

## PHASE 9 — FULL VISUAL MIGRATION

Prioritas:

```text
Home
Adventure
World
Academy
CodeLab
Profile
Shop
Daily
Progress
Community
Settings
```

---

## PHASE 10 — QA

Test:

* unit;
* integration;
* UI;
* game;
* auth;
* DB;
* RLS;
* sandbox;
* CodeLab;
* progression;
* offline;
* sync;
* responsive;
* animation;
* popup;
* VFX;
* migration.

---

# 79. FEATURE FLAGS

Gunakan:

```text
new_home
new_navigation
new_adventure
new_world
new_academy
new_codelab
new_ai
new_offline
new_shop
new_profile
new_motion
new_visual_system
```

---

# 80. BACKWARD COMPATIBILITY

Existing user tidak boleh kehilangan data.

Migration harus:

```text
OLD DATA
 ↓
MAPPING
 ↓
NEW SYSTEM
```

bukan:

```text
OLD DATA
 ↓
DELETE
 ↓
NEW DATA
```

---

# 81. OPENCode MASTER BLUEPRINT

Berikut prompt yang diberikan ke OpenCode **secara bertahap**, bukan sekaligus.

---

## PROMPT 1 — AUDIT

```text
Read ROBika_MASTER_CONCEPT_PRD_BLUEPRINT_V2.md completely before doing anything.

This is a MAJOR EXISTING-PROJECT MIGRATION, NOT A GREENFIELD BUILD.

ROBika must evolve from a dashboard-centric coding learning application into a genuine pixel-art coding adventure game with a complete Academy, CodeLab, AI and offline/online ecosystem.

DO NOT CODE YET.

DO NOT redesign yet.

DO NOT generate PixelLab assets yet.

DO NOT create database tables yet.

DO NOT delete anything.

First perform a complete repository audit.

Inspect:

- package.json
- routes
- layouts
- components
- design system
- dashboard
- Home
- Phaser
- game scenes
- player
- camera
- collision
- combat
- quests
- Academy
- curriculum
- CodeLab
- Monaco
- Pyodide
- AI
- Supabase
- migrations
- tables
- RLS
- economy
- wallet
- inventory
- purchases
- subscriptions
- achievements
- offline persistence
- tests
- assets
- PixelLab MCP
- responsive implementation
- deployment

Create:

docs/MIGRATION_AUDIT.md

Include:

1. current architecture
2. current routes
3. current UI
4. current dashboard problems
5. current game
6. current learning
7. current CodeLab
8. current AI
9. current economy
10. current DB
11. current progress
12. current assets
13. PixelLab configuration
14. reusable systems
15. systems requiring visual migration
16. systems requiring architecture changes
17. missing systems
18. systems that must not be deleted
19. DB risks
20. offline risks
21. mobile risks
22. sandbox risks
23. asset requirements
24. animation requirements
25. popup/VFX requirements
26. testing risks
27. implementation order

Run existing tests and production build if possible.

Do not modify implementation merely to make tests pass.

STOP after the audit.
```

---

# 82. PROMPT 2 — DESIGN FOUNDATION

```text
Read:

ROBika_MASTER_CONCEPT_PRD_BLUEPRINT_V2.md
docs/MIGRATION_AUDIT.md

Implement ONLY the visual/product foundation.

Create:

docs/PRODUCT_FLOW.md
docs/UX_FLOW.md
docs/SCREEN_MAP.md
docs/GAMEPLAY_SPEC.md
docs/DESIGN_SYSTEM.md
docs/ART_BIBLE.md
docs/ASSET_MANIFEST.md
docs/MOTION_SPEC.md
docs/POPUP_SPEC.md
docs/VFX_SPEC.md

Build prototype screens for:

1. Player Base
2. Game shell
3. World
4. World Map
5. HUD
6. Quest
7. NPC Dialogue
8. Coding Terminal
9. Code Success
10. Code Error
11. Quest Started
12. Quest Updated
13. Quest Completed
14. Reward
15. Unlock
16. Academy
17. CodeLab
18. Mobile Landscape

CRITICAL:

ROBika must look like a GAME.

Do not use:

Navbar + Hero + Cards + Statistics

as the main experience.

Home must feel like a player base.

Use pixel-art visual language.

Use animation hooks.

Use contextual popups.

Use VFX hooks.

Use world-reaction states.

Avoid generic SaaS aesthetics.

Do not generate a huge asset library.

Keep old routes working.

Do not delete old systems.
```

---

# 83. PROMPT 3 — PIXELLAB + VERTICAL SLICE

```text
Read:

ROBika_MASTER_CONCEPT_PRD_BLUEPRINT_V2.md
docs/ART_BIBLE.md
docs/ASSET_MANIFEST.md
docs/GAMEPLAY_SPEC.md
docs/MOTION_SPEC.md
docs/POPUP_SPEC.md
docs/VFX_SPEC.md

Use the configured PixelLab MCP server for production pixel assets.

Generate ONLY the minimum vertical-slice assets:

- player
- BOT-1
- NPC
- enemy
- tileset
- ground
- wall
- gate
- terminal
- building
- props
- HUD
- required animation
- VFX

Every asset must follow ART_BIBLE.md.

Track every asset in ASSET_MANIFEST.md.

Then implement:

PLAYER BASE
→ WORLD
→ NPC
→ QUEST
→ BROKEN GATE
→ TERMINAL
→ CODE EDITOR
→ RUN
→ VALIDATE
→ WORLD REACTION
→ QUEST COMPLETE
→ REWARD
→ ACADEMY
→ PRACTICE IN GAME
→ CODELAB
→ SAVE

Use JavaScript if/else as the first coding mechanic.

The gate must physically react to successful code.

Required:

- movement
- collision
- camera
- NPC
- quest
- terminal
- Monaco
- safe code execution
- world state
- animation
- VFX
- popup
- reward
- persistence
- desktop
- mobile landscape

Do not scale to additional content until this vertical slice passes the design gate.
```

---

# 84. PROMPT 4 — FULL MIGRATION

```text
Continue ROBika migration based on:

ROBika_MASTER_CONCEPT_PRD_BLUEPRINT_V2.md

Only proceed after the vertical slice passes its design gate.

Migrate progressively:

1. Home
2. Adventure
3. World Map
4. Quest
5. Combat
6. BOT-1
7. Academy
8. Practice in Game
9. CodeLab
10. AI
11. Progression
12. Offline
13. Online Sync
14. Economy
15. Shop
16. Profile
17. Daily
18. Community

Preserve:

- authentication
- user data
- Supabase
- RLS
- curriculum
- CodeLab
- Monaco
- Pyodide
- tests
- sandbox
- purchases
- subscriptions
- progress

Every major gameplay action must have appropriate:

- animation
- VFX
- feedback
- world reaction
- sound hook

Do not turn the application into a dashboard.

Do not implement everything in one giant change.

Keep the application runnable after each stage.

Update documentation after architectural changes.
```

---

# 85. OPENCode RULES

OpenCode harus:

1. membaca PRD;
2. membaca audit;
3. inspect existing code;
4. reuse existing systems;
5. search existing assets;
6. gunakan PixelLab MCP;
7. mengikuti Art Bible;
8. mencatat asset;
9. memeriksa job PixelLab sebelum retry;
10. menggunakan data-driven architecture;
11. menjaga modularity;
12. menjaga sandbox;
13. menjaga RLS;
14. tidak expose secret;
15. menjalankan test;
16. menjalankan build;
17. mendokumentasikan perubahan;
18. berhenti ketika design gate gagal;
19. tidak membuat semua fitur sekaligus;
20. tidak mengubah ROBika menjadi generic AI SaaS.

---

# 86. FINAL USER EXPERIENCE

Flow utama:

```text
                    ROBIKA
                      │
                PLAYER BASE
                      │
             ┌────────┴────────┐
             │                 │
         ADVENTURE            MENU
             │                 │
          WORLD MAP      ┌─────┼───────────┐
             │           │     │           │
          EXPLORE      ACADEMY CODELAB   PROFILE
             │           │     │
           QUEST         │   PROJECT
             │           │     │
          COMBAT         │     │
             │           │     │
       SYSTEM PROBLEM    │     │
             │           │     │
       CODING TERMINAL   │     │
             │           │     │
            CODE ────────┴─────┘
             │
          RUN CODE
             │
       WORLD REACTION
             │
       QUEST COMPLETE
             │
      XP / REWARD / SKILL
             │
        NEW CONTENT
             │
      BACK TO ADVENTURE
```

---

# 87. EMOTIONAL LOOP

Target:

```text
“I want to play.”
        ↓
“I found something.”
        ↓
“I need to solve it.”
        ↓
“I need to learn this.”
        ↓
“I wrote the code.”
        ↓
“IT ACTUALLY WORKED.”
        ↓
“The world changed.”
        ↓
“I solved the quest.”
        ↓
“I got stronger.”
        ↓
“What else can I build?”
        ↓
“I opened CodeLab.”
        ↓
“I made my own thing.”
```

---

# 88. DEFINITION OF DONE

ROBika dianggap berhasil dimigrasikan jika:

* [ ] first screen terasa seperti game;
* [ ] Home terasa seperti player base;
* [ ] player dapat menjelajah;
* [ ] NPC animated;
* [ ] quest terasa hidup;
* [ ] combat terasa nyata;
* [ ] coding menjadi bagian gameplay;
* [ ] code dapat mengubah world;
* [ ] success memiliki animation/VFX;
* [ ] failure membantu debugging;
* [ ] popup mempunyai tujuan;
* [ ] transition terasa intentional;
* [ ] Academy lengkap;
* [ ] Practice in Game berjalan;
* [ ] CodeLab terasa seperti development environment;
* [ ] AI contextual;
* [ ] offline mode berguna;
* [ ] online sync berjalan;
* [ ] education tidak pay-to-win;
* [ ] progress lama aman;
* [ ] PixelLab assets konsisten;
* [ ] animation purposeful;
* [ ] mobile landscape playable;
* [ ] desain tidak terlihat seperti AI-generated SaaS dashboard.

---

# 89. FINAL DESIGN GATE

**JANGAN SCALE UP** apabila:

* game masih terlihat seperti website;
* Home masih seperti dashboard;
* world masih seperti background statis;
* NPC tidak hidup;
* coding hanya mengubah angka/database;
* combat tidak mempunyai impact;
* popup masih generic;
* UI terlalu banyak card;
* pixel art hanya menjadi tempelan;
* animation minim;
* AI menjadi satu-satunya gimmick;
* CodeLab tidak stabil;
* mobile landscape buruk.

Jika salah satu aspek fundamental gagal:

> **STOP. FIX THE FOUNDATION.**

---

# 90. FINAL PRODUCT IDENTITY

ROBika harus bisa dijelaskan dalam satu kalimat:

> **ROBika adalah pixel-art coding adventure RPG tempat pemain menjelajahi dunia, bertarung, menyelesaikan quest, dan menggunakan kemampuan programming untuk benar-benar mengubah dunia game, sambil mempelajari programming secara mendalam dan dapat membangun program sendiri melalui CodeLab.**

Bukan:

> "Platform belajar coding dengan fitur game."

Tetapi:

> **"Game petualangan yang ngajarin lo coding karena lo benar-benar membutuhkan coding untuk menaklukkan dunianya."**

---

# END OF ROBika MASTER CONCEPT + PRD + OPENCODE BLUEPRINT V2

