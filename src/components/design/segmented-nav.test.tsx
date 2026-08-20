import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedNav } from "./segmented-nav";

const options = [
  { value: "materi", label: "Materi" },
  { value: "game", label: "Game" },
  { value: "codelab", label: "CodeLab" },
];

describe("SegmentedNav", () => {
  it("renders all options as buttons", () => {
    render(<SegmentedNav options={options} value="materi" onChange={vi.fn()} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByText("Game")).toBeInTheDocument();
  });

  it("marks the active option as selected", () => {
    render(<SegmentedNav options={options} value="game" onChange={vi.fn()} />);
    expect(screen.getByRole("tab", { name: "Game" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Materi" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("calls onChange with the selected value", () => {
    const onChange = vi.fn();
    render(<SegmentedNav options={options} value="materi" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "CodeLab" }));
    expect(onChange).toHaveBeenCalledWith("codelab");
  });

  it("renders icons for options that provide one", () => {
    const withIcon = [
      { value: "id", label: "ID", icon: <span>🌐</span> },
      { value: "en", label: "EN" },
    ];
    render(<SegmentedNav options={withIcon} value="id" onChange={vi.fn()} />);
    expect(screen.getByText("🌐")).toBeInTheDocument();
  });

  it("exposes an accessible group label", () => {
    render(
      <SegmentedNav
        options={options}
        value="materi"
        onChange={vi.fn()}
        aria-label="Mode belajar"
      />,
    );
    expect(screen.getByRole("tablist", { name: "Mode belajar" })).toBeInTheDocument();
  });
});