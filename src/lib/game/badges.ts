export type BadgeRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  icon: string;
}

export interface BadgeState {
  completedLevels: string[];
  world1Complete: boolean;
  bossDone: boolean;
  streak: number;
  level: number;
  xp: number;
  codelabDone: boolean;
  trialActive: boolean;
  gems: number;
}

export const BADGES: Badge[] = [
  {
    id: "first-steps",
    name: "Langkah Pertama",
    description: "Selesaikan level pertamamu di Kode Quest.",
    rarity: "common",
    icon: "rocket",
  },
  {
    id: "world-1-clear",
    name: "Penakluk Dunia 1",
    description: "Selesaikan semua level biasa di Dunia 1.",
    rarity: "rare",
    icon: "globe",
  },
  {
    id: "boss-slayer",
    name: "Pembunuh Boss",
    description: "Kalahkan Boss Motherboard.",
    rarity: "epic",
    icon: "skull",
  },
  {
    id: "streak-3",
    name: "Konsisten 3 Hari",
    description: "Belajar 3 hari berturut-turut.",
    rarity: "common",
    icon: "flame",
  },
  {
    id: "streak-7",
    name: "Seminggu Penuh",
    description: "Belajar 7 hari berturut-turut.",
    rarity: "rare",
    icon: "flame",
  },
  {
    id: "level-5",
    name: "Naik Kelas",
    description: "Capai level profil 5.",
    rarity: "rare",
    icon: "star",
  },
  {
    id: "xp-1000",
    name: "Ribuan XP",
    description: "Kumpulkan total 1.000 XP.",
    rarity: "epic",
    icon: "gem",
  },
  {
    id: "codelab-first",
    name: "Tukang Kode",
    description: "Selesaikan tantangan pertamamu di CodeLab.",
    rarity: "common",
    icon: "code",
  },
  {
    id: "mentor-trial",
    name: "Mentor Pribadi",
    description: "Aktifkan AI Mentor Trial.",
    rarity: "legendary",
    icon: "brain",
  },
  {
    id: "gem-owner",
    name: "Kolektor Gem",
    description: "Miliki setidaknya 1 Gem.",
    rarity: "mythic",
    icon: "gem",
  },
];

const BY_ID = new Map(BADGES.map((b) => [b.id, b]));

export function evaluateBadges(
  state: BadgeState,
  ownedIds: string[],
): Badge[] {
  const owned = new Set(ownedIds);
  const conditions: [string, boolean][] = [
    ["first-steps", state.completedLevels.length >= 1],
    ["world-1-clear", state.world1Complete],
    ["boss-slayer", state.bossDone],
    ["streak-3", state.streak >= 3],
    ["streak-7", state.streak >= 7],
    ["level-5", state.level >= 5],
    ["xp-1000", state.xp >= 1000],
    ["codelab-first", state.codelabDone],
    ["mentor-trial", state.trialActive],
    ["gem-owner", state.gems >= 1],
  ];
  return conditions
    .filter(([id, met]) => met && !owned.has(id))
    .map(([id]) => BY_ID.get(id)!);
}

export const RARITY_ORDER: Record<BadgeRarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
  mythic: 4,
};