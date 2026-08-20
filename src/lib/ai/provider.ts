import { buildMessages } from "./prompts";
import { SseParser, extractContentDeltas } from "./sse";
import { poolForMode, pickModelForProvider, dedupeByBase } from "./registry";
import type { AiContext, AiMode } from "./types";
import { AiUnavailableError } from "./types";

const REQUEST_TIMEOUT_MS = 15_000;

interface Candidate {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export async function* streamAi(
  mode: AiMode,
  lang: "id" | "en",
  question: string,
  context?: AiContext,
  image?: string,
): AsyncGenerator<string> {
  const { system, contents } = buildMessages({ mode, lang, question, context });
  const messages: Array<{
    role: "system" | "assistant" | "user";
    content:
      | string
      | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
  }> = [
    ...(system ? [{ role: "system" as const, content: system }] : []),
    ...contents.map((c) => ({
      role: c.role === "model" ? ("assistant" as const) : ("user" as const),
      content: c.text,
    })),
  ];

  if (image) {
    const last = messages[messages.length - 1];
    if (last && last.role === "user") {
      last.content = [
        { type: "text", text: last.content as string },
        { type: "image_url", image_url: { url: image } },
      ];
    }
  }

  const pool = dedupeByBase(poolForMode(mode, process.env));
  if (pool.length === 0) {
    throw new AiUnavailableError("No AI provider configured");
  }

  const candidates: Candidate[] = pool.flatMap((provider) => {
    const apiKey = process.env[provider.envKey];
    if (!apiKey) return [];
    return [
      {
        id: provider.id,
        name: provider.name,
        baseUrl: provider.baseUrl,
        apiKey,
        model: pickModelForProvider(mode, provider),
      },
    ];
  });

  if (candidates.length === 0) {
    throw new AiUnavailableError("No AI provider configured");
  }

  const body = JSON.stringify({
    model: "__MODEL__",
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1024,
  });

  const settled = await Promise.allSettled(
    candidates.map(async (candidate): Promise<{ candidate: Candidate; response: Response }> => {
      const response = await fetch(
        `${candidate.baseUrl}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${candidate.apiKey}`,
          },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          body: body.replace('"__MODEL__"', JSON.stringify(candidate.model)),
        },
      );
      if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        throw new Error(`HTTP ${response.status}`);
      }
      return { candidate, response };
    }),
  );

  const winners = settled.filter(
    (r): r is PromiseFulfilledResult<{ candidate: Candidate; response: Response }> =>
      r.status === "fulfilled",
  );

  if (winners.length === 0) {
    const reasons = settled
      .map((r) => (r.status === "rejected" ? `${r.reason instanceof Error ? r.reason.message : "?"}` : ""))
      .join("; ");
    throw new AiUnavailableError(`All AI providers failed: ${reasons}`);
  }

  const winner = winners[0].value;
  for (const other of winners.slice(1)) {
    other.value.response.body?.cancel().catch(() => {});
  }

  const winnerId = winner.candidate.id;
  const reader = winner.response.body!.getReader();
  const decoder = new TextDecoder();
  const parser = new SseParser();
  let pendingChunks: Array<{ choices?: Array<{ delta?: { content?: string } }> }> = [];
  parser.onEvent((data) => {
    if (data === "[DONE]") return;
    try {
      pendingChunks.push(JSON.parse(data) as (typeof pendingChunks)[number]);
    } catch {
      // ignore malformed chunk
    }
  });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.push(decoder.decode(value, { stream: true }));
      if (pendingChunks.length > 0) {
        const delta = extractContentDeltas(pendingChunks);
        pendingChunks = [];
        if (delta) yield delta;
      }
    }
  } catch (err) {
    throw new AiUnavailableError(
      err instanceof Error
        ? `${winnerId} stream failed: ${err.message}`
        : `${winnerId} stream failed`,
    );
  } finally {
    reader.releaseLock();
  }
}

export async function generateAi(
  mode: AiMode,
  lang: "id" | "en",
  question: string,
  context?: AiContext,
  image?: string,
): Promise<string> {
  let out = "";
  for await (const token of streamAi(mode, lang, question, context, image)) {
    out += token;
  }
  return out;
}