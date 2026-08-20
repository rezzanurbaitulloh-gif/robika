import { notFound } from "next/navigation";
import { getCurriculumModule } from "@/content/curriculum/curriculum";
import { QuizPanel } from "@/components/game/quiz-panel";
import { BackButton } from "@/components/design/back-button";
import { Icon, type IconName } from "@/components/design/icon";

export default async function CurriculumModulePage({
  params,
}: {
  params: Promise<{ stackId: string; moduleId: string }>;
}) {
  const { stackId, moduleId } = await params;
  const found = getCurriculumModule(stackId, moduleId);
  if (!found) notFound();
  const { stack, module: mod } = found;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref={`/learn/${stack.id}`} />
      </div>
      <div className="mb-8">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name={stack.icon as IconName} size={14} />
          {stack.name} · ±{mod.minutes} menit
        </p>
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          {mod.title}
        </h1>
      </div>

      <div className="space-y-6">
        {mod.topics.map((topic, i) => (
          <section
            key={i}
            className="rounded-xl border border-border bg-slate-900/60 p-4 sm:p-5"
          >
            <h2 className="mb-2 font-display text-base tracking-wide text-foreground">
              {i + 1}. {topic.title}
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">{topic.body}</p>
            {topic.code && (
              <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-slate-950 p-3 text-xs leading-relaxed text-emerald-200">
                <code>{topic.code}</code>
              </pre>
            )}
          </section>
        ))}

        <section className="rounded-xl border border-border bg-slate-900/60 p-4 sm:p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base tracking-wide text-foreground">
            <Icon name="target" size={18} />
            Kuis Pemahaman
          </h2>
          <QuizPanel questions={mod.quiz} />
        </section>
      </div>
    </main>
  );
}