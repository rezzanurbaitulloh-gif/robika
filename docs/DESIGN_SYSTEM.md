# DESIGN_SYSTEM — ROBika V2

Tiga mode visual, satu identitas.

## Mode

| Mode | Tipografi | Tekstur | Aturan |
|---|---|---|---|
| GAME (Base/World/Level) | pixel display untuk judul/HUD, sans untuk body | tile grid, scanline halus | dunia terasa hidup; tanpa kartu SaaS |
| ACADEMY (/learn) | sans nyaman baca; pixel hanya aksen heading | garis terminal tipis | keterbacaan > estetika |
| CODELAB | mono + sans UI profesional | flat gelap | seperti IDE sungguhan |

## Tokens (dari globals.css existing)

- Background `#0f1220` · Panel `#141a2e`/card · Outline `#0b0e17`
- Accent utama cyan `#22d3ee` · Success green `#34d399` · Danger magenta `#e879f9` / rose `#f43f5e` · Warning amber `#fbbf24` · Steel `#94a3b8/#475569`
- Radius: 6px (UI game), 10px (academy). Border 1px solid outline.
- Font display pixel sudah ada di layout (`--font-display`); jangan pakai pixel font untuk paragraf.

## Komponen Inti Game

- **HudBar** — strip atas: avatar mini · LV+XP bar · gems/stars · streak flame · quest chip.
- **MenuTile** — tombol kotak ikon+label+hotkey, hover naik 2px + glow border.
- **TerminalWindow** — header title-bar bergaya window retro, body editor/output.
- **QuestLog** — panel daftar quest dengan status marker.
- **PopupFrame** — bingkai popup bergambar sudut, animasi masuk POPUP_SPEC.

## States (wajib semua interaktif)

IDLE · HOVER (+glow) · PRESS (turun 1px) · DISABLED (50% + no-glow) · LOADING (blink caret) · SUCCESS/ERROR tint.

## Anti-Pattern (REJECT)

Navbar+Hero+Cards sebagai pengalaman utama; glassmorphism; gradient blob; rounded>12px di mode game; ilustrasi stock; emoji sebagai ikon sistem.
