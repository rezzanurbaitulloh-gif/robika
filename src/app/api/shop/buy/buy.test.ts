import { describe, it, expect, vi } from "vitest";

const state: {
  user: string | null;
  rpcData: Record<string, unknown> | null;
  lastArgs?: Record<string, unknown>;
} = {
  user: "user-1",
  rpcData: null,
};

vi.mock("@/lib/db/server", () => ({
  createServerSupabase: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: state.user ? { id: state.user } : null },
      }),
    },
    rpc: async (_fn: string, args: Record<string, unknown>) => {
      state.lastArgs = args;
      return { data: state.rpcData, error: null };
    },
  }),
}));

async function post(itemId?: string) {
  const { POST } = await import("./route");
  return POST(
    new Request("http://local/api/shop/buy", {
      method: "POST",
      body: JSON.stringify({ item_id: itemId }),
    }),
  );
}

describe("POST /api/shop/buy", () => {
  it("rejects items outside the catalog before touching the wallet", async () => {
    const res = await post("skin-not-real");
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "unknown_item" });
  });

  it("returns conflict when the server reports an owned skin", async () => {
    state.rpcData = { error: "already_owned" };
    const res = await post("skin-bot-classic");
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ error: "already_owned" });
  });

  it("maps insufficient balance with price context", async () => {
    state.rpcData = { error: "insufficient_balance", balance: 120, price: 500 };
    const res = await post("skin-bot-classic");
    expect(res.status).toBe(402);
    const json = await res.json();
    expect(json.balance).toBe(120);
    expect(json.price).toBe(500);
    expect(state.lastArgs).toEqual({ p_item_id: "skin-bot-classic" });
  });

  it("confirms purchase on success", async () => {
    state.rpcData = { ok: true, item_id: "skin-bot-classic" };
    const res = await post("skin-bot-classic");
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      ok: true,
      item_id: "skin-bot-classic",
    });
  });

  it("requires auth", async () => {
    state.user = null;
    state.rpcData = null;
    const res = await post("skin-bot-classic");
    expect(res.status).toBe(401);
    state.user = "user-1";
  });
});
