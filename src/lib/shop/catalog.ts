export type SkinRarity = "common" | "epic" | "legendary" | "mythic";

export interface SkinColors {
  /** warna bodi utama */
  body: string;
  /** warna visor/mata */
  visor: string;
  /** warna inti dada + glow */
  glow: string;
}

export interface SkinItem {
  id: string;
  name: string;
  rarity: SkinRarity;
  priceStars?: number;
  priceGems?: number;
  icon: "robot" | "bolt" | "trophy" | "moon";
  colors: SkinColors;
}

export const SKIN_ITEMS: SkinItem[] = [
  // --- Common (stars) ---
  {
    id: "skin-bot-classic",
    name: "BOT-1 Klasik",
    rarity: "common",
    priceStars: 500,
    icon: "robot",
    colors: { body: "#94a3b8", visor: "#0b1220", glow: "#22d3ee" },
  },
  {
    id: "skin-bot-steel",
    name: "Baja Gelap",
    rarity: "common",
    priceStars: 450,
    icon: "robot",
    colors: { body: "#475569", visor: "#cbd5e1", glow: "#94a3b8" },
  },
  {
    id: "skin-bot-mint",
    name: "Mint Pabrik",
    rarity: "common",
    priceStars: 600,
    icon: "robot",
    colors: { body: "#34d399", visor: "#0b1220", glow: "#6ee7b7" },
  },
  {
    id: "skin-bot-ember",
    name: "Bara Pabrik",
    rarity: "common",
    priceStars: 600,
    icon: "bolt",
    colors: { body: "#f59e0b", visor: "#0b1220", glow: "#fbbf24" },
  },

  // --- Epic (stars) ---
  {
    id: "skin-bot-neon",
    name: "BOT-1 Neon",
    rarity: "epic",
    priceStars: 2500,
    icon: "bolt",
    colors: { body: "#22d3ee", visor: "#0b1220", glow: "#67e8f9" },
  },
  {
    id: "skin-bot-sunset",
    name: "Senja Neon",
    rarity: "epic",
    priceStars: 2800,
    icon: "bolt",
    colors: { body: "#fb7185", visor: "#0b1220", glow: "#fb923c" },
  },
  {
    id: "skin-bot-toxic",
    name: "Toksik",
    rarity: "epic",
    priceStars: 3000,
    icon: "bolt",
    colors: { body: "#a3e635", visor: "#0b1220", glow: "#bef264" },
  },
  {
    id: "skin-bot-graffiti",
    name: "Grafiti Distrik",
    rarity: "epic",
    priceStars: 3200,
    icon: "robot",
    colors: { body: "#e879f9", visor: "#22d3ee", glow: "#f0abfc" },
  },

  // --- Legendary (gems) ---
  {
    id: "skin-bot-gold",
    name: "BOT-1 Gold",
    rarity: "legendary",
    priceGems: 250,
    icon: "trophy",
    colors: { body: "#fbbf24", visor: "#0b1220", glow: "#fde68a" },
  },
  {
    id: "skin-bot-abyss",
    name: "Samudra Dalam",
    rarity: "legendary",
    priceGems: 300,
    icon: "moon",
    colors: { body: "#0ea5e9", visor: "#e0f2fe", glow: "#7dd3fc" },
  },
  {
    id: "skin-bot-magma",
    name: "Magma",
    rarity: "legendary",
    priceGems: 320,
    icon: "bolt",
    colors: { body: "#ef4444", visor: "#fbbf24", glow: "#fca5a5" },
  },
  {
    id: "skin-bot-aurora",
    name: "Aurora",
    rarity: "legendary",
    priceGems: 350,
    icon: "moon",
    colors: { body: "#38bdf8", visor: "#e879f9", glow: "#7dd3fc" },
  },

  // --- Mythic (gems) ---
  {
    id: "skin-bot-void",
    name: "BOT-1 Void",
    rarity: "mythic",
    priceGems: 600,
    icon: "moon",
    colors: { body: "#1e1b4b", visor: "#a78bfa", glow: "#7c3aed" },
  },
  {
    id: "skin-bot-gateway",
    name: "Penjaga Gerbang",
    rarity: "mythic",
    priceGems: 650,
    icon: "trophy",
    colors: { body: "#059669", visor: "#34d399", glow: "#34d399" },
  },
  {
    id: "skin-bot-prisma",
    name: "Prismabar",
    rarity: "mythic",
    priceGems: 700,
    icon: "trophy",
    colors: { body: "#c084fc", visor: "#22d3ee", glow: "#e879f9" },
  },
  {
    id: "skin-bot-prime",
    name: "Reaktor Prime",
    rarity: "mythic",
    priceGems: 900,
    icon: "bolt",
    colors: { body: "#f43f5e", visor: "#fbbf24", glow: "#fb7185" },
  },
] as const;

export function getSkinItem(id: string): SkinItem | undefined {
  return SKIN_ITEMS.find((item) => item.id === id);
}
