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
});
