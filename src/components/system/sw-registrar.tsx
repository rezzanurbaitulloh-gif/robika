"use client";

import { useEffect } from "react";

export function SwRegistrar({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (enabled) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
      return;
    }
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((reg) => reg.unregister()))
      .catch(() => {});
    if (window.caches && typeof window.caches.keys === "function") {
      window.caches
        .keys()
        .then((keys) => keys.forEach((key) => window.caches.delete(key)))
        .catch(() => {});
    }
  }, [enabled]);

  return null;
}
