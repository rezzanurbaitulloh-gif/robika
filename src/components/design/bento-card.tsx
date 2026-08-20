import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BentoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
  "data-testid"?: string;
}

export function BentoCard({
  title,
  description,
  icon,
  children,
  footer,
  className,
  href,
  interactive = false,
  "data-testid": dataTestId,
}: BentoCardProps) {
  const classes = cn(
    "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5",
    "transition-all duration-200 hover:border-accent/50",
    interactive && "glow-box cursor-pointer",
    className,
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <h3 className="font-display text-sm font-medium uppercase tracking-wide text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {icon ? (
          <span className="shrink-0 rounded-lg bg-accent/10 p-2 text-accent">
            {icon}
          </span>
        ) : null}
      </div>
      {children ? <div className="mt-auto">{children}</div> : null}
      {footer ? <div className="mt-auto">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} data-testid={dataTestId}>
        {content}
      </a>
    );
  }

  return (
    <div className={classes} data-testid={dataTestId}>
      {content}
    </div>
  );
}