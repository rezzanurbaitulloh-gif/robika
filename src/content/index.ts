import world1Json from "./world-1/world-1.json";
import type { GameLevel } from "@/lib/game/validate";
import { validateWorld } from "@/lib/game/validate";

export interface World {
  world: string;
  name: { id: string; en: string };
  levels: GameLevel[];
}

export const worlds: World[] = [
  { ...world1Json, levels: world1Json.levels as GameLevel[] },
];

export function getWorld(worldId: string): World | undefined {
  return worlds.find((w) => w.world === worldId);
}

export function getLevel(levelId: string): GameLevel | undefined {
  for (const world of worlds) {
    const level = world.levels.find((l) => l.id === levelId);
    if (level) return level;
  }
  return undefined;
}

export function getBoss(worldId: string): GameLevel | undefined {
  return getWorld(worldId)?.levels.find((l) => l.isBoss);
}

export function isBossLevel(level: GameLevel): boolean {
  return Boolean(level.isBoss);
}

const validationCache = new Map<string, ReturnType<typeof validateWorld>>();

export function validateAllWorlds(): ReturnType<typeof validateWorld> {
  const key = worlds.map((w) => w.world).join(",");
  if (validationCache.has(key)) return validationCache.get(key)!;
  const errors: string[] = [];
  for (const world of worlds) {
    const result = validateWorld(world.levels);
    errors.push(...result.errors.map((e) => `[${world.world}] ${e}`));
  }
  const result = { ok: errors.length === 0, errors };
  validationCache.set(key, result);
  return result;
}