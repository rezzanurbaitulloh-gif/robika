import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BotAvatar } from "@/components/design/bot-avatar";
import { Icon } from "@/components/design/icon";
import { HudBar } from "@/components/game/hud-bar";
import { NpcChip } from "@/components/game/npc-chip";
import { WalkDemo } from "@/components/game/walk-demo";
import { themeFor } from "@/components/game/world-theme";
import { SKIN_ITEMS } from "@/lib/shop/catalog";
import { getFlags } from "@/lib/flags";

export const dynamic = "force-dynamic";

const MAP_NODES = [
  { id: 1, label: "1", state: "done" },
  { id: 2, label: "2", state: "done" },
  { id: 3, label: "3", state: "current" },
  { id: 4, label: "4", state: "locked" },
  { id: 5, label: "B", state: "boss" },
] as const;

const NODE_STYLE: Record<string, string> = {
  done: "border-emerald-400/60 bg-emerald-400/15 text-emerald-300",
  current: "border-cyan-300 bg-cyan-400/20 text-cyan-200 animate-pulse",
  locked: "border-border bg-input/30 text-foreground/40",
  boss: "border-fuchsia-400/70 bg-fuchsia-400/15 text-fuchsia-300",
};

export default async function PrototypePage() {
  if (!getFlags().newVisualSystem && !getFlags().newHome) redirect("/dashboard");
  const skin = SKIN_ITEMS[0];

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-6 px-4 py-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-lg uppercase tracking-widest text-cyan-300">
          Prototipe Visual · ROBIKA v2
        </h1>
        <Link href="/base" className="rounded-sm border border-border px-3 py-1.5 font-display text-xs uppercase tracking-wider text-foreground/70 transition hover:border-cyan-400/50 hover:text-foreground">
          ← Base
        </Link>
      </header>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
          1 · Game Shell + HUD + Quest Log
        </h2>
        <div className="relative bg-[#0c101d] p-4">
          <div className="base-floor scanline relative overflow-hidden rounded-md border border-border p-4">
            <HudBar level={7} xp={240} gems={128} streak={12} questLabel="Kunci Gerbang Tembaga" />
            <div className="mt-4 flex h-40 items-center justify-center gap-10">
              <span className="breathe">
                <BotAvatar colors={skin.colors} size={64} />
              </span>
              <div className="grid place-items-center gap-1">
                <span className="rounded-sm border border-fuchsia-400/60 bg-fuchsia-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-fuchsia-300">glitch</span>
              </div>
            </div>
            <aside className="absolute right-3 top-16 w-44 rounded-md border border-border bg-[#141a2e]/95 p-3">
              <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300">Quest</p>
              <ul className="mt-2 space-y-1.5 text-xs text-foreground/75">
                <li className="flex items-center gap-1.5"><Icon name="check" size={11} className="text-emerald-400" /> Aktifkan node utama</li>
                <li className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> Buka gerbang kode</li>
                <li className="flex items-center gap-1.5"><Icon name="lock" size={11} className="text-foreground/40" /> Kalahkan Reaktor Prime</li>
              </ul>
            </aside>
            <div className="pointer-events-none absolute inset-x-0 top-14 mx-auto w-72 rounded-md border border-emerald-400/70 bg-[#141a2e]/95 px-3 py-2 text-center animate-pop">
              <p className="font-display text-[9px] uppercase tracking-widest text-emerald-300">✦ Quest Selesai ✦</p>
              <p className="text-xs text-foreground/80">Node Utama aktif · XP +120 · ◇+25</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
          2 · Coding Terminal Overlay
        </h2>
        <div className="bg-[#0c101d] p-4">
          <div className="overflow-hidden rounded-md border border-cyan-400/40 bg-[#0f1220]">
            <div className="flex items-center justify-between border-b border-border bg-[#141a2e] px-3 py-1.5">
              <span className="font-display text-[10px] uppercase tracking-widest text-cyan-300">terminal — gate_east.js</span>
              <span className="text-[10px] text-foreground/40">ESC tutup</span>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              <pre className="min-h-28 overflow-x-auto border-b border-border p-3 text-xs leading-relaxed text-cyan-100/90 sm:border-b-0 sm:border-r"><code>{`function buka(gerbang) {
  if (gerbang.dayaku > 5) {
    return "BUKA";
  }
  return "TERKUNCI";
}`}</code></pre>
              <div className="flex flex-col justify-between p-3">
                <p className="text-xs text-foreground/60">Output dunia menunggu di kanan…</p>
                <button className="self-end rounded-sm border border-emerald-400/50 bg-emerald-400/15 px-4 py-1.5 font-display text-xs uppercase tracking-wider text-emerald-300">
                  ▶ Run
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
          3 · World Map Node
        </h2>
        <div className="base-floor bg-[#0c101d] p-6">
          <div className="flex items-center justify-between gap-2">
            {MAP_NODES.map((n, i) => (
              <div key={n.id} className="flex flex-1 items-center">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-display text-sm ${NODE_STYLE[n.state]}`}>
                  {n.label}
                </span>
                {i < MAP_NODES.length - 1 && (
                  <span className={`h-0.5 flex-1 ${n.state === "locked" ? "bg-border" : "bg-cyan-400/50"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
          4 · NPC Dialogue
        </h2>
        <div className="bg-[#0c101d] p-4">
          <div className="mx-auto max-w-md rounded-md border border-border bg-[#141a2e]/95 p-3">
            <div className="flex items-start gap-3">
              <NpcChip name="Mekanik Vera" size={36} />
              <div>
                <p className="font-display text-[10px] uppercase tracking-widest text-amber-300">Mekanik Vera</p>
                <p className="mt-1 text-sm text-foreground/80">
                  &ldquo;Terminal timur rusak. Buka lewat kode, atau jangan harap lewat.&rdquo;
                </p>
                <p className="mt-1.5 text-[10px] uppercase tracking-widest text-foreground/35">E lanjut · Q tutup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
          5 · World Reaction + Kamera Paralaks
        </h2>
        <div className="grid gap-4 bg-[#0c101d] p-4 sm:grid-cols-2">
          {(["world-1", "world-2"] as const).map((wid) => {
            const t = themeFor(wid);
            return (
              <div key={wid}>
                <p className={`mb-2 font-display text-[10px] uppercase tracking-widest ${wid === "world-1" ? "text-cyan-300" : "text-amber-400"}`}>
                  {wid} · {wid === "world-1" ? "Pabrik Kabel" : "Distrik Gerbang"}
                </p>
                <div className="grid grid-cols-5 gap-[2px] overflow-hidden rounded-md border border-border bg-[#0f1220] p-[2px]">
                  {Array.from({ length: 15 }, (_, i) => {
                    const kind = i % 7;
                    const cls =
                      kind === 0
                        ? `${t.wallClass}`
                        : kind === 2
                          ? t.coinClass
                          : kind === 4
                            ? t.goalClass
                            : kind === 6
                              ? t.hazardClass
                              : t.floorClass;
                    return <span key={i} className={`aspect-square rounded-[2px] ${cls}`} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border bg-[#0f1220] px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-widest text-foreground/50">Kamera · paralaks 3 lapis</p>
          <div className="mt-2 h-16 overflow-hidden rounded-md border border-border bg-gradient-to-b from-[#0b0e17] via-[#141a2e] to-[#0c101d] p-1">
            <div className="ml-auto flex w-2/3 justify-end gap-6 opacity-40">lapisan belakang</div>
            <div className="-mt-3 flex w-1/2 justify-end gap-8 opacity-70">lapisan tengah</div>
            <div className="-mt-2 flex justify-start gap-10 opacity-100">lantai depan</div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground/60">
          6 · Asset Pixel Hasil Generasi (Batch Validasi)
        </h2>
        <div className="flex flex-wrap items-end gap-8 bg-[#0c101d] p-4">
          <figure className="text-center">
            <Image unoptimized src="/assets/pixel/v2/bot1/bot1-south.png" alt="BOT-1 menghadap selatan" width={48} height={48} style={{ width: 144, height: 144 }} className="pixelated" />
            <figcaption className="mt-1 text-[10px] uppercase tracking-widest text-foreground/45">bot1 · south ×3</figcaption>
          </figure>
          <figure className="text-center">
            <Image unoptimized src="/assets/pixel/v2/bot1/bot1-east.png" alt="BOT-1 menghadap timur" width={48} height={48} style={{ width: 96, height: 96 }} className="pixelated" />
            <figcaption className="mt-1 text-[10px] uppercase tracking-widest text-foreground/45">bot1 · east ×2</figcaption>
          </figure>
          <figure className="text-center">
            <Image unoptimized src="/assets/pixel/v2/prop-power-node-broken.png" alt="Node daya rusak" width={64} height={64} style={{ width: 128, height: 128 }} className="pixelated" />
            <figcaption className="mt-1 text-[10px] uppercase tracking-widest text-foreground/45">prop · power-node ×2</figcaption>
          </figure>
          <figure className="text-center">
            <WalkDemo />
            <figcaption className="mt-1 text-[10px] uppercase tracking-widest text-foreground/45">bot1 · walk-south · 4f @ ~6,7fps</figcaption>
          </figure>
          <p className="max-w-52 self-center text-xs leading-relaxed text-foreground/55">
            Sprite asli 48×48 / 64×64 dirender ×3 integer. Verifikasi visual: outline hitam selektif, flat shading, palet slate+cyan.
          </p>
        </div>
      </section>

      <nav className="grid grid-cols-2 gap-2 pb-4">
        <Link href="/learn" className="menu-tile flex items-center justify-center gap-2 rounded-md border border-border bg-card/70 py-3 font-display text-xs uppercase tracking-wider text-emerald-300 transition hover:-translate-y-0.5 hover:border-emerald-400/50">
          <Icon name="book" size={14} /> Academy (layar hidup)
        </Link>
        <Link href="/codelab" className="menu-tile flex items-center justify-center gap-2 rounded-md border border-border bg-card/70 py-3 font-display text-xs uppercase tracking-wider text-fuchsia-300 transition hover:-translate-y-0.5 hover:border-fuchsia-400/50">
          <Icon name="code" size={14} /> CodeLab (layar hidup)
        </Link>
      </nav>
    </main>
  );
}
