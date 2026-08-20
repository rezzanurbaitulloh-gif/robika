export type AiMode = "tutor" | "debug" | "exercises" | "mentor";

export interface AiProvider {
  id: string;
  name: string;
  baseUrl: string;
  envKey: string;
  models: string[];
  priority: number;
}

const HC_MODELS = ["DeepSeek-V4-Flash", "Qwen3-Coder-Next-FP8", "Qwen3.5-397B-A17B"];
const MISTRAL_MODELS = ["mistral-large"];
const OMNIROUTE_MODELS = [
  "auto",
  "auto/coding",
  "auto/fast",
  "auto/cheap",
  "oc/big-pickle",
  "oc/deepseek-v4-flash-free",
  "kr/claude-sonnet-4.5",
  "kr/claude-haiku-4.5",
  "kr/deepseek-3.2",
  "kr/minimax-m2.5",
  "kr/minimax-m2.1",
  "kr/glm-5",
  "kr/qwen3-coder-next",
  "nvidia/z-ai/glm-5.2",
  "nvidia/stepfun-ai/step-3.7-flash",
  "nvidia/deepseek-ai/deepseek-v4-flash",
  "nvidia/nvidia/nemotron-3-super-120b-a12b",
  "nvidia/nvidia/nemotron-3-ultra-550b-a55b",
];
const ROUTER9_MODELS = [
  "qwer/DeepSeek-V4-Flash",
  "qwer/DeepSeek-V4-Pro",
  "qwer/auto",
  "qwer/Qwen3.6-35B-A3B",
  "qwer/Qwen3.5-397B-A17B",
  "qwer/sensenova-6.7-flash-lite",
  "qwer/step-3.5-flash",
  "qwer/step-3.5-flash-2603",
  "qwer/step-router-v1",
  "qwer/step-3.7-flash",
  "nvidia/nvidia/nemotron-3-ultra-550b-a55b",
  "nararouter/mistral-large",
  "combo",
];

export const PROVIDER_CATALOG: AiProvider[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `hc_key${i + 1}`,
    name: `China Key ${i + 1}`,
    baseUrl: "https://api.hcnsec.cn/v1",
    envKey: `ROBIKA_KEY_HC_${i + 1}`,
    models: HC_MODELS,
    priority: 10 + i,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `mistral_key${i + 1}`,
    name: `Mistral Key ${i + 1}`,
    baseUrl: "https://router.bynara.id/v1",
    envKey: `ROBIKA_KEY_MISTRAL_${i + 1}`,
    models: MISTRAL_MODELS,
    priority: 20 + i,
  })),
  {
    id: "mistral6",
    name: "Mistral Key 6",
    baseUrl: "https://router.bynara.id/v1",
    envKey: "ROBIKA_KEY_MISTRAL_6",
    models: MISTRAL_MODELS,
    priority: 25,
  },
  {
    id: "qwen3.8-27b",
    name: "Qwen 3.8 27B (HF)",
    baseUrl: "https://g9hnto0u7lvbu837.us-east-2.aws.endpoints.huggingface.cloud/v1",
    envKey: "ROBIKA_KEY_QWEN_HF",
    models: ["Qwen/Qwen3.8-27B"],
    priority: 30,
  },
  {
    id: "omniroute",
    name: "Omniroute (local)",
    baseUrl: "http://localhost:20128/v1",
    envKey: "ROBIKA_KEY_OMNIROUTE",
    models: OMNIROUTE_MODELS,
    priority: 40,
  },
  {
    id: "9router",
    name: "9Router (local)",
    baseUrl: "http://127.0.0.1:20128/v1",
    envKey: "ROBIKA_KEY_ROUTER9",
    models: ROUTER9_MODELS,
    priority: 41,
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    envKey: "GEMINI_API_KEY",
    models: ["gemini-2.0-flash"],
    priority: 50,
  },
];

export const MODE_MODELS: Record<AiMode, string[]> = {
  tutor: [
    "DeepSeek-V4-Flash",
    "Qwen3-Coder-Next-FP8",
    "mistral-large",
    "Qwen/Qwen3.8-27B",
    "Qwen3.5-397B-A17B",
    "gemini-2.0-flash",
  ],
  debug: [
    "DeepSeek-V4-Flash",
    "Qwen3-Coder-Next-FP8",
    "mistral-large",
    "Qwen/Qwen3.8-27B",
    "Qwen3.5-397B-A17B",
    "gemini-2.0-flash",
  ],
  exercises: [
    "DeepSeek-V4-Flash",
    "Qwen3-Coder-Next-FP8",
    "mistral-large",
    "Qwen/Qwen3.8-27B",
    "Qwen3.5-397B-A17B",
    "gemini-2.0-flash",
  ],
  mentor: [
    "Qwen3.5-397B-A17B",
    "mistral-large",
    "Qwen3-Coder-Next-FP8",
    "DeepSeek-V4-Flash",
    "Qwen/Qwen3.8-27B",
    "gemini-2.0-flash",
  ],
};

export type EnvLike = Record<string, string | undefined>;

export function activeProviders(env: EnvLike): AiProvider[] {
  return PROVIDER_CATALOG.filter((p) => Boolean(env[p.envKey]))
    .sort((a, b) => a.priority - b.priority);
}

export function poolForMode(mode: AiMode, env: EnvLike): AiProvider[] {
  return activeProviders(env).filter((p) =>
    p.models.some((m) => MODE_MODELS[mode].includes(m)),
  );
}

export function pickModelForProvider(
  mode: AiMode,
  provider: Pick<AiProvider, "models">,
): string {
  const preferred = MODE_MODELS[mode].find((m) => provider.models.includes(m));
  return preferred ?? provider.models[0];
}

export function nextCandidate(
  pool: AiProvider[],
  usedIds: string[],
): AiProvider | undefined {
  return pool.find((p) => !usedIds.includes(p.id));
}

export function dedupeByBase(pool: AiProvider[]): AiProvider[] {
  const seen = new Set<string>();
  const unique: AiProvider[] = [];
  for (const provider of pool) {
    if (seen.has(provider.baseUrl)) continue;
    seen.add(provider.baseUrl);
    unique.push(provider);
  }
  return unique;
}