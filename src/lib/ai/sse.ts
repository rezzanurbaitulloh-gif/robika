export class SseParser {
  private buffer = "";

  onEvent(callback: (data: string) => void): void {
    this.callback = callback;
  }

  private callback: ((data: string) => void) | null = null;

  push(chunk: string): void {
    this.buffer += chunk;
    let sepIndex: number;
    while ((sepIndex = this.buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = this.buffer.slice(0, sepIndex);
      this.buffer = this.buffer.slice(sepIndex + 2);
      const dataLines = rawEvent
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart());
      if (dataLines.length > 0) {
        this.callback?.(dataLines.join("\n"));
      }
    }
  }

  flush(): void {
    if (this.buffer.trim().length === 0) return;
    const dataLines = this.buffer
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart());
    if (dataLines.length > 0) {
      this.callback?.(dataLines.join("\n"));
    }
    this.buffer = "";
  }
}

interface OpenAiChunk {
  choices?: Array<{
    delta?: { content?: string; role?: string };
    finish_reason?: string;
  }>;
}

export function extractContentDeltas(chunks: OpenAiChunk[]): string {
  return chunks
    .map((c) => c.choices?.[0]?.delta?.content ?? "")
    .join("");
}