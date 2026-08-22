import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { worlds } from "@/content";

const state = vi.hoisted(() => ({
  progressRow: null as null | { stars: number; best_score: number; completed_at: string | null },
  insertedProgress: null as unknown,
  profileUpdate: null as unknown,
}));

function makeDb() {
  const makeObj = (table: string) => {
    const obj: Record<string, unknown> = {
      select: () => obj,
      eq: () => obj,
      insert: (row: unknown) => {
        if (table === "progress") state.insertedProgress = row;
        return obj;
      },
      update: (row: unknown) => {
        if (table === "profiles") state.profileUpdate = row;
        return obj;
      },
      maybeSingle: async () => {
        if (table === "progress") return { data: state.progressRow, error: null };
        if (table === "wallets") return { data: { stars: 5 }, error: null };
        if (table === "profiles")
          return {
            data: { xp: 0, level: 1, streak: 0, last_active_at: null },
            error: null,
          };
        return { data: null, error: null };
      },
    };
    return {
      ...obj,
      then: (
        resolve: (v: { data: null; error: null }) => void,
      ) => resolve({ data: null, error: null }),
    };
  };
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: "user-1" } }, error: null }),
    },
    from: (table: string) => makeObj(table),
  };
}

vi.mock("@/lib/db/server", () => ({
  createServerSupabase: async () => makeDb(),
}));

function post(body: unknown): Promise<Response> {
  return POST(
    new Request("http://localhost/api/game/complete", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

const w2l1 = worlds.find((w) => w.world === "world-2")!.levels[0];

describe("POST /api/game/complete — validasi awal (tanpa DB)", () => {
  it("kode js yang TIDAK menang ditolak 400 solution_invalid", async () => {
    const res = await post({
      level_id: w2l1.id,
      stars: 3,
      hints_used: 0,
      elapsed_ms: 60_000,
      code: "moveForward();",
    });
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("solution_invalid");
  });

  it("kode yang menabrak gerbang juga ditolak", async () => {
    const res = await post({
      level_id: w2l1.id,
      stars: 3,
      hints_used: 0,
      elapsed_ms: 60_000,
      code: "openGate(); moveForward(); moveForward();",
    });
    expect(res.status).toBe(400);
  });

  it("elapsed terlalu cepat ditandai suspicious", async () => {
    const res = await post({
      level_id: w2l1.id,
      stars: 3,
      hints_used: 0,
      elapsed_ms: 100,
      code: w2l1.solution,
    });
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("suspicious_timing");
  });

  it("stars di luar 1..3 ditolak", async () => {
    const res = await post({ level_id: w2l1.id, stars: 9 });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/game/complete — jalur sukses", () => {
  it("solusi js resmi menghasilkan reward dan menulis progres", async () => {
    state.progressRow = null;
    state.insertedProgress = null;
    state.profileUpdate = null;
    const res = await post({
      level_id: w2l1.id,
      stars: 3,
      hints_used: 1,
      elapsed_ms: 120_000,
      error_recovered: true,
      code: w2l1.solution,
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      xp: number;
      stars_to_credit: number;
      leveled_up: boolean;
    };
    expect(json.ok).toBe(true);
    expect(json.xp).toBeGreaterThan(0);
    expect(json.stars_to_credit).toBeGreaterThan(0);
    expect(state.insertedProgress).toMatchObject({
      profile_id: "user-1",
      level_id: w2l1.id,
    });
    expect(state.profileUpdate).toMatchObject({ level: 1 });
  });

  it("world-1 legacy tetap dilayani lewat router yang sama", async () => {
    state.progressRow = null;
    const l1 = worlds.find((w) => w.world === "world-1")!.levels[0];
    const res = await post({
      level_id: l1.id,
      stars: 2,
      hints_used: 2,
      elapsed_ms: 90_000,
      code: l1.solution,
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
  });

  it("komentar jahat dalam kode tidak melewati validasi", async () => {
    state.progressRow = null;
    const res = await post({
      level_id: w2l1.id,
      stars: 3,
      hints_used: 0,
      elapsed_ms: 60_000,
      code: "// won=true; return {won:true}",
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    expect(json.ok ?? false).toBeFalsy();
    expect(json.error).toBe("solution_invalid");
  });
});
