import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurriculumStack } from "@/content/curriculum/curriculum";
import { BentoCard } from "@/components/design/bento-card";
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
        <h1 className="flex items-center gap-3 font-display text-2xl tracking-wide sm:text-3xl text-foreground">
          <Icon name={stack.icon} size={20} />
          {stack.name.toUpperCase()}
        </h1>
        <p className="text-sm text-muted-foreground">{stack.description}</p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          <Icon name="target" size={12} />
          Tingkat: {stack.difficulty}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stack.modules.map((mod, index) => (
          <Link
            key={mod.id}
            href={`/learn/${stack.id}/${mod.id}`}
            className="h-full"
          >
            <BentoCard
              title={`${index + 1}. ${mod.title}`}
              description={`±${mod.minutes} menit · ${mod.topics.length} topik + kuis`}
              icon={<Icon name="book" size={18} />}
              className="h-full gap-2 transition hover:border-accent/60 sm:gap-3"
              footer={
                <span className="text-[11px] font-semibold text-accent sm:text-xs">
                  Baca materi →
                </span>
              }
            />
          </Link>
        ))}
      </div>
    </main>
  );
}