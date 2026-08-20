import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BentoCardProps {
  title: string;
  description?: string;
  descriptionClassName?: string;
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
  descriptionClassName,
  icon,
  children,
  footer,
  className,
  href,
  interactive = false,
  "data-testid": dataTestId,
}: BentoCardProps) {
  const classes = cn(
    "group relative flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4",
    "transition-all duration-200 hover:border-accent/50",
    "sm:gap-3 sm:p-5",
    interactive && "glow-box cursor-pointer",
    className,
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-display text-xs uppercase tracking-wide text-foreground sm:text-sm">
            {title}
          </h3>
          {description ? (
            <p
              className={cn(
                "text-xs leading-relaxed text-muted-foreground sm:text-sm",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {icon ? (
          <span className="shrink-0 rounded-lg bg-accent/10 p-1.5 text-accent sm:p-2">
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