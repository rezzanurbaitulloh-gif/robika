interface Entry<V> {
  value: V;
  expiresAt: number;
}

export interface TtlCache<V> {
  get(key: string): V | undefined;
  set(key: string, value: V, ttlMs: number): void;
  has(key: string): boolean;
  size(): number;
  clear(): void;
}

export function createTtlCache<V>(maxEntries = 100): TtlCache<V> {
  const store = new Map<string, Entry<V>>();

  function prune(): void {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.expiresAt <= now) store.delete(key);
    }
    while (store.size > maxEntries) {
      const oldest = store.keys().next().value;
      if (oldest === undefined) break;
      store.delete(oldest);
    }
  }

  return {
    get(key) {
      prune();
      const entry = store.get(key);
      if (!entry) return undefined;
      store.delete(key);
      store.set(key, entry);
      return entry.value;
    },
    set(key, value, ttlMs) {
      prune();
      if (store.has(key)) store.delete(key);
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    has(key) {
      prune();
      const entry = store.get(key);
      return entry !== undefined && entry.expiresAt > Date.now();
    },
    size() {
      prune();
      return store.size;
    },
    clear() {
      store.clear();
    },
  };
}