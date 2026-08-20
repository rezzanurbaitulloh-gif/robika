import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTtlCache } from "./cache";

describe("createTtlCache", () => {
  let now: Date;
  beforeEach(() => {
    now = new Date("2026-08-19T10:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  it("stores and retrieves values within TTL", () => {
    const cache = createTtlCache<string>();
    cache.set("a", "value-a", 60_000);
    expect(cache.get("a")).toBe("value-a");
    expect(cache.has("a")).toBe(true);
  });

  it("expires entries after TTL elapses", () => {
    const cache = createTtlCache<string>();
    cache.set("a", "value-a", 60_000);
    vi.advanceTimersByTime(60_001);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.has("a")).toBe(false);
  });

  it("returns undefined for missing keys", () => {
    const cache = createTtlCache<string>();
    expect(cache.get("nope")).toBeUndefined();
    expect(cache.has("nope")).toBe(false);
  });

  it("overwrites existing key with new TTL", () => {
    const cache = createTtlCache<string>();
    cache.set("a", "old", 60_000);
    cache.set("a", "new", 60_000);
    expect(cache.get("a")).toBe("new");
  });

  it("evicts the oldest entry when at capacity", () => {
    const cache = createTtlCache<string>(2);
    cache.set("a", "1", 60_000);
    cache.set("b", "2", 60_000);
    cache.set("c", "3", 60_000);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe("2");
    expect(cache.get("c")).toBe("3");
  });

  it("does not count evicted entries in size", () => {
    const cache = createTtlCache<string>(2);
    cache.set("a", "1", 60_000);
    cache.set("b", "2", 60_000);
    cache.set("c", "3", 60_000);
    expect(cache.size()).toBe(2);
  });

  it("lazily prunes expired entries on access", () => {
    const cache = createTtlCache<string>();
    cache.set("a", "1", 1_000);
    vi.advanceTimersByTime(2_000);
    expect(cache.size()).toBe(0);
  });

  it("clear removes all entries", () => {
    const cache = createTtlCache<string>();
    cache.set("a", "1", 60_000);
    cache.set("b", "2", 60_000);
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get("a")).toBeUndefined();
  });
});