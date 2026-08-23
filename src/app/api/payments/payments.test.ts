import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHash } from "node:crypto";

const state: {
  user: string | null;
  purchases: Array<Record<string, unknown>>;
  walletGems: number;
  hintsCount: number;
  subscription: Record<string, unknown> | null;
  walletUpdated: Record<string, unknown> | null;
  hintsUpdated: Record<string, unknown> | null;
  subUpserted: Record<string, unknown> | null;
  insertedPurchase: Record<string, unknown> | null;
  purchaseStatusUpdates: Array<Record<string, unknown>>;
} = {
  user: "user-1",
  purchases: [],
  walletGems: 5,
  hintsCount: 2,
  subscription: null,
  walletUpdated: null,
  hintsUpdated: null,
  subUpserted: null,
  insertedPurchase: null,
  purchaseStatusUpdates: [],
};

vi.mock("@/lib/db/server", () => ({
  createServerSupabase: async () => makeDb(),
}));

vi.mock("@/lib/db/admin", () => ({
  createAdminSupabase: async () => makeDb(),
}));

function makeDb() {
  const make = (table: string) => {
    let lastExternalId = "";
    const c = {
      select: () => c,
      eq: (key: string, val: string) => {
        if (key === "external_id") lastExternalId = val;
        return c;
      },
      maybeSingle: async () => {
        if (table === "purchases")
          return {
            data: state.purchases.find((p) => p.external_id === lastExternalId) ?? null,
            error: null,
          };
        if (table === "wallets") return { data: { gems: state.walletGems }, error: null };
        if (table === "hints") return { data: { count: state.hintsCount }, error: null };
        if (table === "subscriptions")
          return { data: state.subscription ? { ...state.subscription } : null, error: null };
        return { data: null, error: null };
      },
      single: async () => ({ data: state.insertedPurchase, error: null }),
      insert: (row: Record<string, unknown>) => {
        state.insertedPurchase = { ...row };
        state.purchases.push({ ...row });
        return c;
      },
      update: (row: Record<string, unknown>) => ({
        eq: () => {
          if (table === "purchases") {
            const target = state.purchases.find((p) => p.external_id === lastExternalId);
            if (target) Object.assign(target, row);
            state.purchaseStatusUpdates.push({ row });
          } else if (table === "wallets") {
            state.walletUpdated = row;
            state.walletGems = (row.gems as number) ?? state.walletGems;
          } else if (table === "hints") {
            state.hintsUpdated = row;
            state.hintsCount = (row.count as number) ?? state.hintsCount;
          } else if (table === "subscriptions") {
            state.subUpserted = row;
            state.subscription = { ...(state.subscription ?? {}), ...row };
          }
          return Promise.resolve({ error: null });
        },
      }),
      upsert: (row: Record<string, unknown>) => {
        state.subUpserted = row;
        state.subscription = { ...row };
        return Promise.resolve({ error: null });
      },
    };
    return c;
  };
  return {
    auth: {
      getUser: async () => ({
        data: { user: state.user ? { id: state.user } : null },
        error: null,
      }),
    },
    from: make,
  };
}

function signPayload(orderId: string, statusCode: string, grossAmount: string): string {
  return createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}sk-test`)
    .digest("hex");
}

function seedPurchase(overrides: Partial<Record<string, unknown>> = {}) {
  state.purchases.push({
    external_id: "ORD-1",
    profile_id: "user-1",
    item_type: "gems",
    item_ref: "gems-100",
    amount: 100,
    price: 10000,
    status: "pending",
    ...overrides,
  });
}

beforeEach(() => {
  Object.assign(state, {
    user: "user-1",
    purchases: [],
    walletGems: 5,
    hintsCount: 2,
    subscription: null,
    walletUpdated: null,
    hintsUpdated: null,
    subUpserted: null,
    insertedPurchase: null,
    purchaseStatusUpdates: [],
  });
  vi.stubEnv("MIDTRANS_SERVER_KEY", "sk-test");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

import { POST as createRoute } from "./create/route";
import { POST as webhookRoute } from "./webhook/route";
import { POST as trialRoute } from "./trial/route";

function post(body?: unknown): Request {
  return new Request("http://localhost/api/x", {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("/api/payments/create", () => {
  it("menolak json rusak dan item tak dikenal", async () => {
    const bad = new Request("http://x", { method: "POST", body: "{oops" });
    expect((await createRoute(bad)).status).toBe(400);
    expect((await createRoute(post({ itemId: "nope" }))).status).toBe(400);
  });

  it("unauthorized tanpa sesi", async () => {
    state.user = null;
    expect((await createRoute(post({ itemId: "gems-100" }))).status).toBe(401);
  });

  it("500 saat server key tidak dikonfigurasi", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "");
    const res = await createRoute(post({ itemId: "gems-100" }));
    expect(res.status).toBe(500);
    expect(state.insertedPurchase).toMatchObject({ status: "pending" });
  });

  it("membuat purchase pending lalu mengembalikan snap token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ token: "tok-1", redirect_url: "https://pay" }), {
          status: 200,
        }),
      ),
    );
    const res = await createRoute(post({ itemId: "gems-100" }));
    expect(res.status).toBe(200);
    const data = (await res.json()) as { token: string; order_id: string };
    expect(data.token).toBe("tok-1");
    expect(data.order_id.startsWith("ROBIKA-")).toBe(true);
    expect(state.insertedPurchase).toMatchObject({
      profile_id: "user-1",
      item_type: "gems",
      amount: 100,
      status: "pending",
    });
  });

  it("kegagalan Midtrans menandai purchase failed", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 500 })));
    const res = await createRoute(post({ itemId: "hints-10" }));
    expect(res.status).toBe(502);
    expect(state.purchaseStatusUpdates[0]?.row).toMatchObject({ status: "failed" });
  });
});

describe("/api/payments/webhook", () => {
  function notification(
    orderId: string,
    transactionStatus: string,
    statusCode = "200",
    grossAmount = "10000",
  ): Request {
    return post({
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signPayload(orderId, statusCode, grossAmount),
      transaction_status: transactionStatus,
    });
  }

  it("menolak signature palsu", async () => {
    seedPurchase();
    const res = await webhookRoute(
      post({
        order_id: "ORD-1",
        status_code: "200",
        gross_amount: "10000",
        signature_key: "bad",
        transaction_status: "settlement",
      }),
    );
    expect(res.status).toBe(401);
  });

  it("order tak dikenal → 404", async () => {
    expect((await webhookRoute(notification("UNKNOWN", "settlement"))).status).toBe(404);
  });

  it("settlement gems: kredit wallet sekali + fulfilled", async () => {
    seedPurchase();
    const res = await webhookRoute(notification("ORD-1", "capture"));
    expect(res.status).toBe(200);
    expect(state.walletGems).toBe(105);
    expect(state.purchaseStatusUpdates[0]?.row).toMatchObject({ status: "fulfilled" });
  });

  it("replay settlement tidak mengkredit ganda", async () => {
    seedPurchase({ status: "fulfilled" });
    await webhookRoute(notification("ORD-1", "capture"));
    expect(state.walletUpdated).toBeNull();
    expect(state.walletGems).toBe(5);
  });

  it("item hints mengkredit petunjuk", async () => {
    seedPurchase({ item_type: "hints", item_ref: "hints-10", amount: 10 });
    await webhookRoute(notification("ORD-1", "settlement"));
    expect(state.hintsCount).toBe(12);
  });

  it("deny memfailkan purchase tanpa efek wallet", async () => {
    seedPurchase();
    const res = await webhookRoute(notification("ORD-1", "deny"));
    expect(res.status).toBe(200);
    expect(state.walletUpdated).toBeNull();
    expect(state.purchaseStatusUpdates[0]?.row).toMatchObject({ status: "failed" });
  });
});

describe("/api/payments/trial", () => {
  it("unauthorized tanpa sesi", async () => {
    state.user = null;
    expect((await trialRoute()).status).toBe(401);
  });

  it("menolak jika sudah bayar atau sudah pernah trial", async () => {
    state.subscription = { paid_until: new Date(Date.now() + 86400000).toISOString() };
    expect((await trialRoute()).status).toBe(409);
    state.subscription = { trial_started_at: new Date().toISOString(), paid_until: null };
    expect((await trialRoute()).status).toBe(409);
  });

  it("mengaktifkan trial 7 hari", async () => {
    const res = await trialRoute();
    expect(res.status).toBe(200);
    const data = (await res.json()) as { trial_ends_at: string };
    const days =
      (new Date(data.trial_ends_at).getTime() - Date.now()) / 86_400_000;
    expect(days).toBeGreaterThan(6.9);
    expect(days).toBeLessThan(7.01);
    expect(state.subUpserted ?? state.hintsUpdated).toBeTruthy();
  });
});
