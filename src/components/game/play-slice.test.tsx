import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("phaser", () => ({ default: {} }));

import { PlaySlice } from "./play-slice";

const runEventsMock = vi.fn(async () => true);
const createSceneMock = vi.fn(async () => ({
  runEvents: () => runEventsMock(),
  destroy: vi.fn(),
}));

vi.mock("./slice-scene", () => ({
  createSliceScene: () => createSceneMock(),
}));

describe("PlaySlice academy bridge", () => {
  it("opens lesson from header Academy button and marks practice-in-game", async () => {
    render(<PlaySlice />);
    fireEvent.click(screen.getByRole("button", { name: "Academy" }));
    const bridge = screen.getByTestId("academy-bridge");
    expect(bridge).toBeInTheDocument();
    expect(screen.getByText(/Perintah Dasar/)).toBeInTheDocument();
    expect(screen.getAllByText(/moveForward\(\)/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Praktik di Game" }));
    await waitFor(() => {
      expect(screen.queryByTestId("academy-bridge")).not.toBeInTheDocument();
    });
  });

  it("shows stuck shortcut after a failed run and opens the bridge", async () => {
    runEventsMock.mockResolvedValue(false);
    render(<PlaySlice />);
    await waitFor(() =>
      expect(createSceneMock.mock.calls.length).toBeGreaterThan(0),
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Run/ }).at(-1)!);
    await waitFor(() => expect(runEventsMock).toHaveBeenCalled());
    const stuck = await screen.findByRole("button", { name: /Aku belum paham/ });
    fireEvent.click(stuck);
    expect(screen.getByTestId("academy-bridge")).toBeInTheDocument();
    expect(screen.getByText(/Perintah Dasar/)).toBeInTheDocument();
  });

  it("offers Debug with AI after a hard error and streams hints into the panel", async () => {
    const fetchMock = vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "token", token: "Hint: cek urutan." })}\n\n`)
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        },
      });
      return new Response(stream, { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<PlaySlice />);
    await waitFor(() =>
      expect(createSceneMock.mock.calls.length).toBeGreaterThan(0),
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "???" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Run/ }).at(-1)!);

    const debugBtn = await screen.findByRole("button", { name: /\[ Debug with AI \]/ });
    fireEvent.click(debugBtn);
    await waitFor(() =>
      expect(screen.getByTestId("debug-ai-panel")).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByTestId("debug-ai-panel")).toHaveTextContent("Hint: cek urutan."),
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string
    );
    expect(body.context.error).toMatch(/^Error: /);
    expect(body.context.level).toBe("world-1-level-1");
    vi.unstubAllGlobals();
  });
});
