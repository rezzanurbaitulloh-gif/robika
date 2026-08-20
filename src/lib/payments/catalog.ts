import { createHash, randomBytes } from "node:crypto";
import type { PaymentItemId } from "./packages";

export { PAYMENT_ITEMS, getPaymentItem } from "./packages";
export type { PaymentEffect, PaymentItem, PaymentItemId } from "./packages";

export function buildOrderId(
  userId: string,
  itemId: PaymentItemId,
  now: Date = new Date(),
): string {
  const ts = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `ROBIKA-${ts}-${userId.slice(0, 8).toUpperCase()}-${suffix}`;
}

export interface NotificationPayload {
  orderId?: string;
  statusCode?: string;
  grossAmount?: string;
  signatureKey?: string;
  transactionStatus?: string;
  fraudStatus?: string;
}

export function verifyNotificationSignature(
  payload: NotificationPayload,
  serverKey: string,
): boolean {
  const { orderId, statusCode, grossAmount, signatureKey } = payload;
  if (!orderId || !statusCode || !grossAmount || !signatureKey) return false;
  const expected = createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return signatureKey === expected;
}

export function mapMidtransStatus(
  status: string | undefined,
): "paid" | "pending" | "denied" | "cancelled" | "expired" | "unknown" {
  if (!status) return "unknown";
  const normalized = status.split("/")[0].toLowerCase();
  if (["200", "201", "202", "capture", "settlement"].includes(normalized)) {
    return "paid";
  }
  if (normalized === "407" || normalized === "deny") return "denied";
  if (normalized === "412" || normalized === "401" || normalized === "cancel") {
    return "cancelled";
  }
  if (normalized === "pending") return "pending";
  if (normalized === "expire") return "expired";
  return "unknown";
}