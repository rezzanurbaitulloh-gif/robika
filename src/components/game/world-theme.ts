export interface WorldVisualTheme {
  wallClass: string;
  floorClass: string;
  coinClass: string;
  coinColor: string;
  coinGlow: string;
  goalClass: string;
  goalColor: string;
  hazardClass: string;
  hazardColor: string;
}

/** Pabrik Kabel — industrial slate + cyan */
const WORLD_1: WorldVisualTheme = {
  wallClass: "bg-slate-800 border border-slate-700/60",
  floorClass: "bg-input/40",
  coinClass: "bg-cyan-400/10 border border-cyan-300/40",
  coinColor: "#67e8f9",
  coinGlow: "rgba(103, 232, 249, 0.8)",
  goalClass: "bg-emerald-400/30 border border-emerald-300/70",
  goalColor: "#34d399",
  hazardClass: "bg-rose-500/15 border border-rose-400/40",
  hazardColor: "#fb7185",
};

/** Distrik Gerbang — hijau industri + tembaga */
const WORLD_2: WorldVisualTheme = {
  wallClass: "bg-[#10231b] border border-emerald-800/70",
  floorClass: "bg-emerald-950/40",
  coinClass: "bg-amber-400/10 border border-amber-500/50",
  coinColor: "#fbbf24",
  coinGlow: "rgba(251, 191, 36, 0.85)",
  goalClass: "bg-teal-400/30 border border-teal-300/70",
  goalColor: "#2dd4bf",
  hazardClass: "bg-orange-500/15 border border-orange-400/40",
  hazardColor: "#fb923c",
};

const THEMES: Record<string, WorldVisualTheme> = {
  "world-1": WORLD_1,
  "world-2": WORLD_2,
};

export function themeFor(worldId?: string): WorldVisualTheme {
  return (worldId && THEMES[worldId]) || WORLD_1;
}
