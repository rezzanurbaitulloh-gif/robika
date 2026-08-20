export interface SkinItem {
  id: string;
  name: string;
  rarity: "common" | "epic" | "legendary" | "mythic";
  priceStars?: number;
  priceGems?: number;
  icon: "robot" | "bolt" | "trophy" | "moon";
}

export const SKIN_ITEMS: SkinItem[] = [
  {
    id: "skin-bot-classic",
    name: "BOT-1 Classic",
    rarity: "common",
    priceStars: 500,
    icon: "robot",
  },
  {
    id: "skin-bot-neon",
    name: "BOT-1 Neon",
    rarity: "epic",
    priceStars: 2500,
    icon: "bolt",
  },
  {
    id: "skin-bot-gold",
    name: "BOT-1 Gold",
    rarity: "legendary",
    priceGems: 250,
    icon: "trophy",
  },
  {
    id: "skin-bot-void",
    name: "BOT-1 Void",
    rarity: "mythic",
    priceGems: 600,
    icon: "moon",
  },
] as const;

export function getSkinItem(id: string): SkinItem | undefined {
  return SKIN_ITEMS.find((item) => item.id === id);
}