import { describe, it, expect } from "vitest";
import { SseParser, extractContentDeltas } from "./sse";

describe("SseParser", () => {
  it("emits complete events from chunked buffers", () => {
    const parser = new SseParser();
    const events: string[] = [];
    parser.onEvent((data) => events.push(data));
    parser.push('data: {"a":1}\n\n');
    parser.push('data: {"b":2}\n\n');
    expect(events).toEqual(['{"a":1}', '{"b":2}']);
  });

  it("handles events split across multiple pushes", () => {
    const parser = new SseParser();
    const events: string[] = [];
    parser.onEvent((data) => events.push(data));
    parser.push('data: {"a"');
    parser.push(':1}\n\ndata: {"b":2}');
    parser.push("\n\n");
    expect(events).toEqual(['{"a":1}', '{"b":2}']);
  });

  it("handles multi-line data fields", () => {
    const parser = new SseParser();
    const events: string[] = [];
    parser.onEvent((data) => events.push(data));
    parser.push('data: {"line":1}\ndata: {"line":2}\n\n');
    expect(events).toEqual(['{"line":1}\n{"line":2}']);
  });

  it("treats [DONE] as an event", () => {
    const parser = new SseParser();
    const events: string[] = [];
    parser.onEvent((data) => events.push(data));
    parser.push("data: [DONE]\n\n");
    expect(events).toEqual(["[DONE]"]);
  });
});

describe("extractContentDeltas", () => {
  it("extracts deltas from openai-style chunks", () => {
    const chunks = [
      { choices: [{ delta: { content: "Hel" } }] },
      { choices: [{ delta: { content: "lo" } }] },
      { choices: [{ delta: {} }] },
    ];
    expect(extractContentDeltas(chunks)).toBe("Hello");
  });

  it("handles empty and non-content chunks", () => {
    expect(extractContentDeltas([])).toBe("");
    expect(
      extractContentDeltas([{ choices: [] }, { choices: [{ delta: { role: "assistant" } }] }]),
    ).toBe("");
  });

  it("skips finish_reason-only chunks", () => {
    expect(
      extractContentDeltas([{ choices: [{ delta: { content: "x" }, finish_reason: "stop" }] }]),
    ).toBe("x");
  });
});