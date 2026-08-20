import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  PAYMENT_ITEMS,
  buildOrderId,
  verifyNotificationSignature,
  mapMidtransStatus,
  getPaymentItem,
  type PaymentItemId,
} from "./catalog";

describe("PAYMENT_ITEMS", () => {
  it("covers hints, gems, and mentor packages", () => {
    const ids = PAYMENT_ITEMS.map((i) => i.id);
    expect(ids).toEqual([
      "hints-10",
      "hints-30",
      "hints-150",
      "gems-100",
      "gems-300",
      "gems-700",
      "mentor-1m",
    ]);
  });

  it("prices match the plan in robika.md", () => {
    const price = (id: PaymentItemId) => getPaymentItem(id)!.price;
    expect(price("hints-10")).toBe(2000);
    expect(price("hints-30")).toBe(5000);
    expect(price("hints-150")).toBe(20000);
    expect(price("gems-100")).toBe(10000);
    expect(price("gems-300")).toBe(25000);
    expect(price("gems-700")).toBe(50000);
    expect(price("mentor-1m")).toBe(10000);
  });

  it("defines effects for every item", () => {
    for (const item of PAYMENT_ITEMS) {
      expect(item.effect.type).toBeTruthy();
      if (item.effect.type === "hints" || item.effect.type === "gems") {
        expect(item.effect.count).toBeGreaterThan(0);
      } else {
        expect(item.effect.days).toBeGreaterThan(0);
      }
    }
  });

  it("gem counts match top-up tiers", () => {
    const g100 = getPaymentItem("gems-100")!.effect;
    const g300 = getPaymentItem("gems-300")!.effect;
    const g700 = getPaymentItem("gems-700")!.effect;
    expect(g100.type === "gems" ? g100.count : -1).toBe(100);
    expect(g300.type === "gems" ? g300.count : -1).toBe(300);
    expect(g700.type === "gems" ? g700.count : -1).toBe(700);
  });

  it("returns undefined for unknown item", () => {
    expect(getPaymentItem("unknown" as PaymentItemId)).toBeUndefined();
  });
});

describe("buildOrderId", () => {
  it("produces unique prefixed order ids", () => {
    const a = buildOrderId("u1", "gems-100", new Date("2026-08-19T10:00:00Z"));
    const b = buildOrderId("u1", "gems-100", new Date("2026-08-19T10:00:00Z"));
    expect(a).not.toBe(b);
    expect(a.startsWith("ROBIKA-")).toBe(true);
  });
});

describe("verifyNotificationSignature", () => {
  // known fixture: sha512(orderId + statusCode + grossAmount + serverKey)
  const serverKey = "TEST-SERVER-KEY";
  const orderId = "ROBIKA-123";
  const statusCode = "200";
  const grossAmount = "10000.00";

  const expectedSig = createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");

  it("accepts a valid signature", () => {
    expect(
      verifyNotificationSignature(
        { orderId, statusCode, grossAmount, signatureKey: expectedSig },
        serverKey,
      ),
    ).toBe(true);
  });

  it("rejects a tampered signature", () => {
    expect(
      verifyNotificationSignature(
        { orderId, statusCode, grossAmount, signatureKey: "deadbeef" },
        serverKey,
      ),
    ).toBe(false);
  });

  it("rejects signature with wrong server key", () => {
    expect(
      verifyNotificationSignature(
        { orderId, statusCode, grossAmount, signatureKey: expectedSig },
        "OTHER-KEY",
      ),
    ).toBe(false);
  });

  it("rejects missing signature", () => {
    expect(
      verifyNotificationSignature(
        { orderId, statusCode, grossAmount, signatureKey: "" },
        serverKey,
      ),
    ).toBe(false);
  });
});

describe("mapMidtransStatus", () => {
  it("maps success codes to paid", () => {
    expect(mapMidtransStatus("200")).toBe("paid");
    expect(mapMidtransStatus("201")).toBe("paid");
    expect(mapMidtransStatus("202")).toBe("paid");
  });

  it("maps pending/deny codes", () => {
    expect(mapMidtransStatus("201/407")).toBe("paid");
    expect(mapMidtransStatus("407")).toBe("denied");
    expect(mapMidtransStatus("412")).toBe("cancelled");
    expect(mapMidtransStatus("401")).toBe("cancelled");
  });

  it("maps transaction status strings", () => {
    expect(mapMidtransStatus("capture")).toBe("paid");
    expect(mapMidtransStatus("settlement")).toBe("paid");
    expect(mapMidtransStatus("pending")).toBe("pending");
    expect(mapMidtransStatus("deny")).toBe("denied");
    expect(mapMidtransStatus("expire")).toBe("expired");
    expect(mapMidtransStatus("cancel")).toBe("cancelled");
  });

  it("falls back to unknown", () => {
    expect(mapMidtransStatus("999")).toBe("unknown");
  });
});