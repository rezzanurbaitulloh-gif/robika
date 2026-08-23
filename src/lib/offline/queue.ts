const QUEUE_KEY = "robika.offline.queue.v1";

export interface OfflineMutation {
  id: string;
  url: string;
  body: string;
  createdAt: number;
}

type Listener = () => void;

const listeners = new Set<Listener>();

function read(): OfflineMutation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineMutation[]) : [];
  } catch {
    return [];
  }
}

function write(entries: OfflineMutation[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(entries));
  } catch {
    return;
  }
}

function emit(): void {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): number {
  return read().length;
}

export function getServerSnapshot(): number {
  return 0;
}

export function getEntries(): OfflineMutation[] {
  return read();
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function enqueueOfflineMutation(url: string, body: unknown): void {
  const entries = read();
  entries.push({
    id: makeId(),
    url,
    body: JSON.stringify(body),
    createdAt: Date.now(),
  });
  write(entries);
  emit();
}

export async function flushOfflineQueue(): Promise<number> {
  const entries = read();
  if (entries.length === 0) return 0;
  let synced = 0;
  for (const entry of entries) {
    let ok = false;
    try {
      const res = await fetch(entry.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: entry.body,
      });
      ok = res.ok;
    } catch {
      break;
    }
    if (!ok) continue;
    write(read().filter((e) => e.id !== entry.id));
    synced += 1;
  }
  if (synced > 0) emit();
  return synced;
}
