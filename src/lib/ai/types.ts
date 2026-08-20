export type AiMode = "tutor" | "debug" | "exercises" | "mentor";

export interface AiContext {
  topic?: string;
  level?: string;
  code?: string;
  error?: string;
  history?: { role: "user" | "model"; text: string }[];
}

export interface AiRequest {
  mode: AiMode;
  lang: "id" | "en";
  question: string;
  context?: AiContext;
}

export class AiQuotaExceededError extends Error {
  constructor() {
    super("Daily AI quota exceeded");
    this.name = "AiQuotaExceededError";
  }
}

export class AiUnavailableError extends Error {
  constructor(message = "AI provider temporarily unavailable") {
    super(message);
    this.name = "AiUnavailableError";
  }
}