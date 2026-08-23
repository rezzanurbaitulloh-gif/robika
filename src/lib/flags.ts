export interface FeatureFlags {
  newAdventure: boolean;
  newWorldMap: boolean;
  aiNpcDialogue: boolean;
  codeLabProjects: boolean;
  offlineMode: boolean;
  newHome: boolean;
  newNavigation: boolean;
  newWorld: boolean;
  newAcademy: boolean;
  newCodelab: boolean;
  newAi: boolean;
  newShop: boolean;
  newProfile: boolean;
  newMotion: boolean;
  newVisualSystem: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  newAdventure: false,
  newWorldMap: false,
  aiNpcDialogue: false,
  codeLabProjects: false,
  offlineMode: false,
  newHome: false,
  newNavigation: false,
  newWorld: false,
  newAcademy: false,
  newCodelab: false,
  newAi: false,
  newShop: false,
  newProfile: false,
  newMotion: false,
  newVisualSystem: false,
};

const ENV_KEYS: Record<keyof FeatureFlags, string> = {
  newAdventure: "NEXT_PUBLIC_FLAG_NEW_ADVENTURE",
  newWorldMap: "NEXT_PUBLIC_FLAG_NEW_WORLD_MAP",
  aiNpcDialogue: "NEXT_PUBLIC_FLAG_AI_NPC",
  codeLabProjects: "NEXT_PUBLIC_FLAG_CODELAB_PROJECTS",
  offlineMode: "NEXT_PUBLIC_FLAG_OFFLINE_MODE",
  newHome: "NEXT_PUBLIC_FLAG_NEW_HOME",
  newNavigation: "NEXT_PUBLIC_FLAG_NEW_NAVIGATION",
  newWorld: "NEXT_PUBLIC_FLAG_NEW_WORLD",
  newAcademy: "NEXT_PUBLIC_FLAG_NEW_ACADEMY",
  newCodelab: "NEXT_PUBLIC_FLAG_NEW_CODELAB",
  newAi: "NEXT_PUBLIC_FLAG_NEW_AI",
  newShop: "NEXT_PUBLIC_FLAG_NEW_SHOP",
  newProfile: "NEXT_PUBLIC_FLAG_NEW_PROFILE",
  newMotion: "NEXT_PUBLIC_FLAG_NEW_MOTION",
  newVisualSystem: "NEXT_PUBLIC_FLAG_NEW_VISUAL_SYSTEM",
};

export function parseFlag(value: string | undefined): boolean {
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true";
}

export function getFlags(env: Record<string, string | undefined> = process.env): FeatureFlags {
  const flags = { ...DEFAULT_FLAGS };
  for (const key of Object.keys(ENV_KEYS) as (keyof FeatureFlags)[]) {
    const raw = env[ENV_KEYS[key]];
    if (raw !== undefined) flags[key] = parseFlag(raw);
  }
  return flags;
}

export function isFlagEnabled<K extends keyof FeatureFlags>(
  flag: K,
  env: Record<string, string | undefined> = process.env,
): boolean {
  return getFlags(env)[flag];
}
