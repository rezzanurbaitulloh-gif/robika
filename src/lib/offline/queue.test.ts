import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  enqueueOfflineMutation,
  flushOfflineQueue,
  getEntries,
  getSnapshot,
} from "./queue";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal(
    "localStorage",
    {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("offline mutation queue", () => {
  it("persists enqueued mutations to localStorage", () => {
    enqueueOfflineMutation("/api/learn/complete", { item_type: "module", item_id: "a/b" });

    expect(getSnapshot()).toBe(1);
    expect(getEntries()[0].url).toBe("/api/learn/complete");
    expect(JSON.parse(getEntries()[0].body)).toEqual({
      item_type: "module",
      item_id: "a/b",
    });
  });

  it("flushes entries via POST and removes the ones that succeed", async () => {
    enqueueOfflineMutation("/api/learn/complete", { item_type: "module" });
    enqueueOfflineMutation("/api/learn/complete", { item_type: "quiz" });

    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const synced = await flushOfflineQueue();

    expect(synced).toBe(2);
    expect(getSnapshot()).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0] as unknown as [string]).toContain("/api/learn/complete");
  });

  it("keeps entries whose POST returns an error response", async () => {
    enqueueOfflineMutation("/api/learn/complete", { item_type: "module" });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "x" }), { status: 500 })),
    );

    const synced = await flushOfflineQueue();

    expect(synced).toBe(0);
    expect(getSnapshot()).toBe(1);
  });

  it("stops at the first network failure and keeps remaining entries", async () => {
    enqueueOfflineMutation("/api/a", {});
    enqueueOfflineMutation("/api/b", {});

    let calls = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls += 1;
        if (calls === 1) throw new TypeError("network down");
        return new Response("{}", { status: 200 });
      }),
    );

    const synced = await flushOfflineQueue();

    expect(synced).toBe(0);
    expect(getSnapshot()).toBe(2);
    expect(calls).toBe(1);
  });
});
