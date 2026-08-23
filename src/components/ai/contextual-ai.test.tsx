import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ContextualAi } from "./contextual-ai";

function sseResponse(events: object[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, { status: 200 });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ContextualAi", () => {
  it("streams the answer into an inline panel on click", async () => {
    const fetchMock = vi.fn(async () =>
      sseResponse([
        { type: "start", mode: "debug" },
        { type: "token", token: "Cek " },
        { type: "token", token: "kondisi gerakmu." },
        { type: "done" },
      ])
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <ContextualAi mode="debug" label="[ Debug with AI ]" question="q" testId="dbg" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "[ Debug with AI ]" }));

    await waitFor(() =>
      expect(screen.getByTestId("dbg-panel")).toHaveTextContent(
        "Cek kondisi gerakmu."
      ),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/debug",
      expect.objectContaining({ method: "POST" })
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string
    );
    expect(body.lang).toBe("id");
    expect(body.question).toBe("q");
  });

  it("maps quota_exceeded to friendly copy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => sseResponse([{ type: "error", error: "quota_exceeded" }]))
    );

    render(<ContextualAi mode="tutor" label="[ Explain ]" question="q" testId="exp" />);
    fireEvent.click(screen.getByRole("button", { name: "[ Explain ]" }));

    await waitFor(() =>
      expect(screen.getByTestId("exp-panel")).toHaveTextContent(/Kuota AI harian/)
    );
  });

  it("maps mentor_locked to subscription copy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => sseResponse([{ type: "error", error: "mentor_locked" }]))
    );

    render(<ContextualAi mode="mentor" label="[ Review ]" question="q" testId="rev" />);
    fireEvent.click(screen.getByRole("button", { name: "[ Review ]" }));

    await waitFor(() =>
      expect(screen.getByTestId("rev-panel")).toHaveTextContent(/langganan/)
    );
  });

  it("hits the exercises endpoint for drill generation", async () => {
    const fetchMock = vi.fn(async () =>
      sseResponse([
        { type: "token", token: "Latihan: buat fungsi sapa()." },
        { type: "done" },
      ])
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <ContextualAi
        mode="exercises"
        label="[ Latihan dari AI ]"
        question="Buat latihan."
        context={{ topic: "HTML dasar" }}
        testId="ex"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "[ Latihan dari AI ]" }));

    await waitFor(() =>
      expect(screen.getByTestId("ex-panel")).toHaveTextContent(
        "Latihan: buat fungsi sapa()."
      )
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/exercises", expect.anything());
  });
});
