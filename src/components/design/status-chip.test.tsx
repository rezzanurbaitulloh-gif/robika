import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusChip } from "./status-chip";

describe("StatusChip", () => {
  it("renders the label", () => {
    render(<StatusChip status="success" label="Selesai" />);
    expect(screen.getByText("Selesai")).toBeInTheDocument();
  });

  it("exposes a status role for screen readers", () => {
    render(<StatusChip status="success" label="Selesai" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies success tone classes", () => {
    render(<StatusChip status="success" label="Selesai" data-testid="chip" />);
    expect(screen.getByTestId("chip")).toHaveClass("bg-success/10");
    expect(screen.getByTestId("chip")).toHaveClass("text-success");
  });

  it("applies danger tone classes", () => {
    render(<StatusChip status="danger" label="Gagal" data-testid="chip" />);
    expect(screen.getByTestId("chip")).toHaveClass("text-destructive");
  });

  it("applies warning tone classes", () => {
    render(<StatusChip status="warning" label="Cooldown" data-testid="chip" />);
    expect(screen.getByTestId("chip")).toHaveClass("text-warning");
  });

  it("renders a pulsing dot when pulse is set", () => {
    render(<StatusChip status="info" label="AI aktif" pulse data-testid="chip" />);
    const dot = screen.getByTestId("chip").querySelector("[data-testid='dot']");
    expect(dot).not.toBeNull();
    expect(dot).toHaveClass("blink");
  });

  it("does not render a pulse dot by default", () => {
    render(<StatusChip status="neutral" label="Idle" data-testid="chip" />);
    expect(
      screen.getByTestId("chip").querySelector("[data-testid='dot']"),
    ).toBeNull();
  });
});