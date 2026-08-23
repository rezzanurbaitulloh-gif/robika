import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusChipProps {
  status: StatusTone;
  label: string;
  pulse?: boolean;
  className?: string;
  "data-testid"?: string;
}

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusChip({
  status,
  label,
  pulse = false,
  className,
  "data-testid": dataTestId,
}: StatusChipProps) {
  return (
    <span
      role="status"
      data-testid={dataTestId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[status],
        className,
      )}
    >
      {pulse ? (
        <span
          data-testid="dot"
          className={cn("size-1.5 rounded-full bg-current", pulse && "blink")}
        />
      ) : null}
      {label}
    </span>
  );
}