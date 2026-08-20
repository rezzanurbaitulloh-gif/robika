import type { AiContext, AiMode } from "./types";

export type AiStreamEvent =
  | { type: "start"; mode: string }
  | { type: "token"; token: string }
  | { type: "done" }
  | { type: "error"; error: string };

export async function streamAiChat(
  mode: AiMode,
  question: string,
  context?: AiContext,
  opts: {
    onToken: (token: string) => void;
    signal?: AbortSignal;
    image?: string;
  } = { onToken: () => {} },
): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch(`/api/ai/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lang: "id", question, context, image: opts.image }),
    signal: opts.signal,
  });

  if (!response.ok) {
    let error = "unknown_error";
    try {
      const body = await response.json();
      error = body.error ?? error;
    } catch {
      // keep default
    }
    return { ok: false, error };
  }

  const reader = response.body?.getReader();
  if (!reader) return { ok: false, error: "no_stream" };

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const raw of events) {
        const line = raw.trim();
        if (!line.startsWith("data: ")) continue;
        let event: AiStreamEvent;
        try {
          event = JSON.parse(line.slice(6)) as AiStreamEvent;
        } catch {
          continue;
        }
        if (event.type === "token") opts.onToken(event.token);
        if (event.type === "error") return { ok: false, error: event.error };
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return { ok: false, error: "aborted" };
    return { ok: false, error: "stream_failed" };
  }

  return { ok: true };
}