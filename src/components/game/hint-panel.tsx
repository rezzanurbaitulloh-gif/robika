"use client";

import { useEffect, useState } from "react";

interface HintPanelProps {
  hints: string[][];
  maxHints?: number;
  onUseHint?: (tier: number) => void;
  trackBalance?: boolean;
}

export function HintPanel({
  hints,
  maxHints = 3,
  onUseHint,
  trackBalance = false,
}: HintPanelProps) {
  const [revealed, setRevealed] = useState(0);
  const [balance, setBalance] = useState<number | null>(
    trackBalance ? null : maxHints,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackBalance) return;
    void (async () => {
      try {
        const response = await fetch("/api/hints");
        if (response.ok) {
          const data = (await response.json()) as { count: number };
          setBalance(data.count);
        }
      } catch {
        setBalance(maxHints);
      }
    })();
  }, [trackBalance, maxHints]);

  const reveal = async () => {
    if (revealed >= hints.length) return;

    if (trackBalance) {
      try {
        const response = await fetch("/api/hints/reveal", { method: "POST" });
        if (!response.ok) {
          setError("Saldo hint habis — isi ulang lewat Shop atau tunggu refresh.");
          return;
        }
        const data = (await response.json()) as { count: number };
        setBalance(data.count);
      } catch {
        setError("Gagal terhubung — coba lagi.");
        return;
      }
    }

    const next = revealed + 1;
    setRevealed(next);
    setError(null);
    onUseHint?.(next);
  };

  const remaining = balance ?? maxHints;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm tracking-wide text-foreground">
          HINT SYSTEM
        </h3>
        <span className="text-xs text-muted-foreground">
          {revealed}/{hints.length} terpakai · saldo {remaining}
        </span>
      </div>

      <div className="space-y-2">
        {Array.from({ length: hints.length }).map((_, index) => {
          const isRevealed = index < revealed;
          return (
            <div
              key={index}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                isRevealed
                  ? "border-accent/40 bg-accent/10 text-foreground"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}
            >
              {isRevealed ? hints[index][0] : `Hint ${index + 1} — terkunci`}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}

      <button
        type="button"
        onClick={() => void reveal()}
        disabled={revealed >= maxHints || (trackBalance && (balance ?? 0) <= 0)}
        className="btn btn-outline btn-md mt-3 w-full"
      >
        {trackBalance && (balance ?? 0) <= 0
          ? "Saldo habis"
          : revealed >= maxHints
            ? "Hint habis"
            : "Minta Hint"}
      </button>
    </div>
  );
}