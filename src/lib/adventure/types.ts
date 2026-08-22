export type QuestType =
  | "main_story"
  | "side_quest"
  | "npc_quest"
  | "coding_quest"
  | "debugging_quest"
  | "exploration_quest"
  | "collection_quest"
  | "puzzle"
  | "boss"
  | "learning_quest"
  | "event";

export interface LocalizedText {
  id: string;
  en: string;
}

export interface NpcDef {
  id: string;
  name: string;
  spriteAssetId?: string;
  dialogueIds: string[];
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: LocalizedText;
}

export type ObjectiveType =
  | "coding_challenge"
  | "talk_npc"
  | "reach_tile"
  | "collect_item"
  | "activate_object";

export interface QuestObjective {
  id: string;
  type: ObjectiveType;
  targetId: string;
  description: LocalizedText;
  requiredCount?: number;
}

export interface QuestRewards {
  xp?: number;
  stars?: number;
  gems?: number;
  hints?: number;
  cosmeticIds?: string[];
  achievementIds?: string[];
}

export interface QuestDef {
  id: string;
  worldId: string;
  regionId: string;
  type: QuestType;
  title: LocalizedText;
  description: LocalizedText;
  prerequisites: string[];
  objectives: QuestObjective[];
  rewards: QuestRewards;
  unlocks: string[];
  conceptIds?: string[];
  gameLevelId?: string;
}

export interface RegionDef {
  id: string;
  theme: string;
  mapAssetId?: string;
  tilesetId?: string;
  npcIds: string[];
  objectIds: string[];
  questIds: string[];
  secretIds?: string[];
  progressionRequirement?: string[];
}

export interface WorldObjectDef {
  id: string;
  kind: "terminal" | "gate" | "machine" | "switch" | "collectible" | "prop";
  position: { x: number; y: number };
  assetId?: string;
  linkedQuestId?: string;
}

export interface AdventureWorldDef {
  id: string;
  name: LocalizedText;
  regionIds: string[];
}
