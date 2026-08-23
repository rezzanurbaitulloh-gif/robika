import Link from "next/link";
import { CURRICULUM_STACKS } from "@/content/curriculum/curriculum";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export default function LearnPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton />
      </div>
      <div className="mb-8">
        <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300/70">
          ▸ PAPAN KURIKULUM
        </p>
        <h1 className="font-display text-2xl tracking-wide sm:text-3xl text-foreground">
          KURIKULUM MULTI-STACK
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih jalur belajarmu. Seluruh materi gratis, tanpa biaya.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CURRICULUM_STACKS.map((stack) => (
          <Link
            key={stack.id}
            href={`/learn/${stack.id}`}
            className="group flex h-full flex-col gap-3 rounded-sm border border-border bg-[#0c101d] p-4 transition hover:border-cyan-400/40"
          >
            <span className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-input/30 text-cyan-300">
              <Icon name={stack.icon} size={18} />
            </span>
            <span className="font-display text-sm uppercase tracking-wider text-foreground">
              {stack.name}
            </span>
            <span className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
              {stack.description}
            </span>
            <span className="mt-auto font-mono text-[11px] uppercase tracking-wider text-cyan-400">
              {stack.modules.length} modul · Mulai →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}