import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurriculumStack } from "@/content/curriculum/curriculum";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export default async function CurriculumStackPage({
  params,
}: {
  params: Promise<{ stackId: string }>;
}) {
  const { stackId } = await params;
  const stack = getCurriculumStack(stackId);
  if (!stack) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/learn" />
      </div>
      <div className="mb-8">
        <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300/70">
          ▸ JALUR BELAJAR
        </p>
        <h1 className="flex items-center gap-3 font-display text-2xl tracking-wide sm:text-3xl text-foreground">
          <Icon name={stack.icon} size={20} />
          {stack.name.toUpperCase()}
        </h1>
        <p className="text-sm text-muted-foreground">{stack.description}</p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-sm border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider text-cyan-200">
          <Icon name="target" size={12} />
          Tingkat: {stack.difficulty}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stack.modules.map((mod, index) => (
          <Link
            key={mod.id}
            href={`/learn/${stack.id}/${mod.id}`}
            className="group flex h-full flex-col gap-2.5 rounded-sm border border-border bg-[#0c101d] p-4 transition hover:border-cyan-400/40"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border bg-input/30 text-cyan-300">
                <Icon name="book" size={18} />
              </span>
              <span className="font-mono text-xs text-muted-foreground/70">
                MOD-{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <span className="font-display text-sm uppercase tracking-wider text-foreground">
              {index + 1}. {mod.title}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              ±{mod.minutes} menit · {mod.topics.length} topik + kuis
            </span>
            <span className="mt-auto pt-1 font-mono text-[11px] uppercase tracking-wider text-cyan-400">
              Baca materi →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}