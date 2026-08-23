"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BotAvatar } from "@/components/design/bot-avatar";
import { ContextualAi } from "@/components/ai/contextual-ai";
import type { AiContext } from "@/lib/ai/types";
import type { SkinColors } from "@/lib/shop/catalog";

const COLORS: SkinColors = {
  body: "#38bdf8",
  visor: "#0b0e17",
  glow: "#22d3ee",
};

type Section = "adventure" | "codelab" | "base";

function sectionOf(pathname: string): Section {
  if (pathname.startsWith("/codelab")) return "codelab";
  if (
    pathname.startsWith("/play") ||
    pathname.startsWith("/level") ||
    pathname.startsWith("/world")
  ) {
    return "adventure";
  }
  return "base";
}

const IDLE_LINES: Record<Section, string[]> = {
  adventure: [
    "Musuh di depan bisa dikalahkan dengan loop. Aku percaya lo bisa!",
    "Kalau stuck, buka Academy dulu — konsepnya singkat kok.",
    "Scan selesai: node berikutnya terbuka kalau level ini tuntas.",
  ],
  codelab: [
    "Runner lokal aktif. Kode jalan tanpa internet di sini.",
    "Coba pecah masalahnya jadi fungsi kecil dulu.",
    "Project tersimpan aman. Lanjut ngoding!",
  ],
  base: [
    "Status misi: siap tempur. Mau mulai dari mana?",
    "Daily mission belum? XP-nya gede lho hari ini.",
    "Aku standby di pojok layar kalau butuh bantuan.",
  ],
};

const ASK_QUESTION: Record<Section, string> = {
  adventure:
    "Jelaskan konsep level yang sedang kupelajari dan beri hint bertingkat tanpa memberikan solusi lengkap.",
  codelab:
    "Bantu rencanakan pendekatan untuk project CodeLab-ku: langkah kecil, best practice, dan hal yang perlu dihindari.",
  base: "Beri saran fokus belajar hari ini berdasarkan progres Robika-ku secara singkat.",
};

const TOPIC: Record<Section, string> = {
  adventure: "Adventure",
  codelab: "CodeLab",
  base: "Home Base",
};

export function BotCompanion() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const section = sectionOf(pathname);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLineIndex((n) => n + 1);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  const lines = IDLE_LINES[section];
  const line = lines[lineIndex % lines.length];

  return (
    <div
      data-testid="bot-companion"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-end gap-2 md:bottom-4"
    >
      {open && (
        <div className="animate-pop w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-cyan-400/40 bg-[#0f1420]/95 p-3 shadow-xl backdrop-blur">
          <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300">
            BOT-1
          </p>
          <p data-testid="companion-line" className="mt-1 text-sm text-foreground/85">
            {line}
          </p>
          <div className="mt-2">
            <ContextualAi
              mode="tutor"
              label="[ Ask BOT-1 ]"
              question={ASK_QUESTION[section]}
              context={{ topic: TOPIC[section] } satisfies AiContext}
              testId="bot-ask"
            />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="BOT-1 companion"
        data-testid="bot-toggle"
        className="float rounded-full border border-border bg-background p-1 shadow-lg transition hover:border-accent"
      >
        <BotAvatar colors={COLORS} size={44} />
      </button>
    </div>
  );
}
