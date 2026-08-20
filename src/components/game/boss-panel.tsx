"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

interface BossStatus {
  can_attempt: boolean;
  cooldown_ms: number;
  cooldown_until: string;
  gems: number;
  instant_retry_cost: number;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function BossPanel() {
  const [status, setStatus] = useState<BossStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/boss/status");
    if (res.ok) setStatus((await res.json()) as BossStatus);
  }, []);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/boss/status");
      if (res.ok) setStatus((await res.json()) as BossStatus);
    })();
    tick.current = setInterval(() => void load(), 5000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [load]);

  const instantRetry = async () => {
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/boss/retry", { method: "POST" });
    setBusy(false);
    if (res.ok) {
      setNotice("Cooldown direset! Boss siap dilawan lagi.");
    } else if (res.status === 402) {
      setNotice("Gem tidak cukup — beli Gem di Shop.");
    } else {
      setNotice("Terjadi kesalahan. Coba lagi.");
    }
    void load();
  };

  if (!status) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground">
        Memuat status boss…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-400/30 bg-card/60 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide text-rose-300">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="skull" size={16} />
            BOSS STATUS
          </span>
        </h3>
        <StatusChip
          status={status.can_attempt ? "success" : "danger"}
          label={status.can_attempt ? "SIAP DILAWAN" : "COOLDOWN"}
        />
      </div>

      {status.can_attempt ? (
        <p className="text-sm text-muted-foreground">
          Boss Motherboard menunggu! Jalankan kode terbaikmu. Jika kalah,
          cooldown 30 menit dimulai.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Boss masih memulihkan diri —{" "}
            <span className="font-mono font-semibold text-rose-300">
              {formatCountdown(status.cooldown_ms)}
            </span>
          </p>
          <button
            type="button"
            disabled={busy || status.gems < status.instant_retry_cost}
            onClick={instantRetry}
            className="btn btn-md mt-3 w-full border border-emerald-400/50 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon name="bolt" size={14} />
              Retry Instan — <Icon name="gem" size={14} />{" "}
              {status.instant_retry_cost}
            </span>
          </button>
          {status.gems < status.instant_retry_cost && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Gem kamu {status.gems} — belum cukup. Beli di Shop.
            </p>
          )}
        </>
      )}

      {notice && <p className="mt-2 text-xs text-amber-200">{notice}</p>}
    </div>
  );
}