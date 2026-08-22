export interface FeatureFlags {
  newAdventure: boolean;
  newWorldMap: boolean;
  aiNpcDialogue: boolean;
  codeLabProjects: boolean;
  offlineMode: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  newAdventure: false,
  newWorldMap: false,
  aiNpcDialogue: false,
  codeLabProjects: false,
  offlineMode: false,
};

const ENV_KEYS: Record<keyof FeatureFlags, string> = {
  newAdventure: "NEXT_PUBLIC_FLAG_NEW_ADVENTURE",
  newWorldMap: "NEXT_PUBLIC_FLAG_NEW_WORLD_MAP",
  aiNpcDialogue: "NEXT_PUBLIC_FLAG_AI_NPC",
  codeLabProjects: "NEXT_PUBLIC_FLAG_CODELAB_PROJECTS",
  offlineMode: "NEXT_PUBLIC_FLAG_OFFLINE_MODE",
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
