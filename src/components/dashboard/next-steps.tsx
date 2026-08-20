import Link from "next/link";
import { Icon, type IconName } from "@/components/design/icon";
import { cn } from "@/lib/utils";

export interface NextStepItem {
  href: string;
  label: string;
  hint: string;
  icon: IconName;
  tone: "accent" | "muted";
  chip?: string;
}

export function NextSteps({ items }: { items: NextStepItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm tracking-wide">
        <Icon name="target" size={15} />
        TUGAS BERIKUTNYA
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5 transition hover:border-accent/50",
                item.tone === "accent" && "border-accent/40 bg-accent/5",
              )}
            >
              <span
                className={cn(
                  "rounded-md p-1.5",
                  item.tone === "accent"
                    ? "bg-accent/10 text-accent"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon name={item.icon} size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.hint}
                </span>
              </span>
              {item.chip && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    item.tone === "accent"
                      ? "bg-accent/15 text-accent"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.chip}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}