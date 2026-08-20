import Link from "next/link";
import { CURRICULUM_STACKS } from "@/content/curriculum/curriculum";
import { BentoCard } from "@/components/design/bento-card";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export default function LearnPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton />
      </div>
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground">
          KURIKULUM MULTI-STACK
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih jalur belajarmu. Seluruh materi gratis, tanpa biaya.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CURRICULUM_STACKS.map((stack) => (
          <Link key={stack.id} href={`/learn/${stack.id}`} className="h-full">
            <BentoCard
              title={stack.name}
              description={stack.description}
              descriptionClassName="hidden sm:block"
              icon={<Icon name={stack.icon} size={18} />}
              className="h-full gap-2 transition hover:border-accent/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] sm:gap-3"
              footer={
                <span className="text-[11px] font-semibold text-accent sm:text-xs">
                  {stack.modules.length} modul · Mulai →
                </span>
              }
            />
          </Link>
        ))}
      </div>
    </main>
  );
}