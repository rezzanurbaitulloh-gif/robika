import { describe, it, expect, vi, beforeEach } from "vitest";

const state: {
  user: string | null;
  inventory: string[];
  skinId: string | null;
} = {
  user: "user-1",
  inventory: ["skin-bot-neon"],
  skinId: null,
};

vi.mock("@/lib/db/server", () => ({
  createServerSupabase: async () => makeDb(),
}));

function makeDb() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: state.user ? { id: state.user } : null },
        error: null,
      }),
    },
    from: (table: string) => {
      let itemId = "";
      const chain = () => ({
        eq: (_key: string, val: string) => {
          if (table === "inventory" && _key === "item_id") itemId = val;
          return chain();
        },
        maybeSingle: async () => {
          if (table === "inventory")
            return {
              data: state.inventory.includes(itemId) ? { item_id: itemId } : null,
              error: null,
            };
          return { data: { skin_id: state.skinId }, error: null };
        },
      });
      return {
        select: chain,
        update: (row: Record<string, unknown>) => ({
          eq: () => {
            if (table === "profiles") state.skinId = (row.skin_id as string) ?? null;
            return Promise.resolve({ error: null });
          },
        }),
      };
    },
  };
}

beforeEach(() => {
  state.user = "user-1";
  state.inventory = ["skin-bot-neon"];
  state.skinId = null;
});

import { POST } from "./route";

function req(body?: unknown): Request {
  return new Request("http://localhost/api/profile/skin", {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("POST /api/profile/skin", () => {
  it("unauthorized tanpa sesi", async () => {
    state.user = null;
    expect((await POST(req({ itemId: "skin-bot-neon" }))).status).toBe(401);
  });

  it("menolak item tak dikenal", async () => {
    expect((await POST(req({ itemId: "skin-hack" }))).status).toBe(400);
  });

  it("menolak skin yang belum dimiliki", async () => {
    expect((await POST(req({ itemId: "skin-bot-gold" }))).status).toBe(403);
    expect(state.skinId).toBeNull();
  });

  it("memasang skin yang dimiliki", async () => {
    const res = await POST(req({ itemId: "skin-bot-neon" }));
    expect(res.status).toBe(200);
    const data = (await res.json()) as { skinId: string };
    expect(data.skinId).toBe("skin-bot-neon");
    expect(state.skinId).toBe("skin-bot-neon");
  });
});
