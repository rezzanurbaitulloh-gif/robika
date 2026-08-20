export type PaymentItemId =
  | "hints-10"
  | "hints-30"
  | "hints-150"
  | "gems-100"
  | "gems-300"
  | "gems-700"
  | "mentor-1m";

export type PaymentEffect =
  | { type: "hints"; count: number }
  | { type: "gems"; count: number }
  | { type: "mentor"; days: number };

export interface PaymentItem {
  id: PaymentItemId;
  name: string;
  description: string;
  price: number;
  effect: PaymentEffect;
}

export const PAYMENT_ITEMS: PaymentItem[] = [
  {
    id: "hints-10",
    name: "10 Petunjuk",
    description: "10 petunjuk instan untuk level tersulit",
    price: 2000,
    effect: { type: "hints", count: 10 },
  },
  {
    id: "hints-30",
    name: "30 Petunjuk",
    description: "30 petunjuk — cukup untuk satu dunia",
    price: 5000,
    effect: { type: "hints", count: 30 },
  },
  {
    id: "hints-150",
    name: "150 Petunjuk",
    description: "150 petunjuk — persediaan sebulan",
    price: 20000,
    effect: { type: "hints", count: 150 },
  },
  {
    id: "gems-100",
    name: "100 Permata",
    description: "Paket starter — skin & aksesoris dasar BOT-1",
    price: 10000,
    effect: { type: "gems", count: 100 },
  },
  {
    id: "gems-300",
    name: "300 Permata",
    description: "Paket hemat (+50%) untuk kolektor skin",
    price: 25000,
    effect: { type: "gems", count: 300 },
  },
  {
    id: "gems-700",
    name: "700 Permata",
    description: "Paket terlaris (+75%) — semua skin dunia 1",
    price: 50000,
    effect: { type: "gems", count: 700 },
  },
  {
    id: "mentor-1m",
    name: "Mentor 1 Bulan",
    description: "Akses penuh AI Mentor tanpa batas kuota",
    price: 10000,
    effect: { type: "mentor", days: 30 },
  },
];

export function getPaymentItem(id: PaymentItemId): PaymentItem | undefined {
  return PAYMENT_ITEMS.find((item) => item.id === id);
}