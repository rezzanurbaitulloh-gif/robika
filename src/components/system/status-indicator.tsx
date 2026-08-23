"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  flushOfflineQueue,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/offline/queue";
import { useOnline } from "@/lib/offline/use-online";

export function StatusIndicator() {
  const online = useOnline();
  const pending = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const flushing = useRef(false);

  useEffect(() => {
    if (!online || flushing.current || pending === 0) return;
    flushing.current = true;
    void flushOfflineQueue().finally(() => {
      flushing.current = false;
    });
  }, [online, pending]);

  if (online) return null;

  return (
    <span
      data-testid="offline-badge"
      className="rounded border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold tracking-widest text-amber-400"
    >
      OFFLINE{pending > 0 ? ` · ${pending}` : ""}
    </span>
  );
}
