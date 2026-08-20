import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BentoCard } from "./bento-card";
import { Icon } from "./icon";

describe("BentoCard", () => {
  it("renders title and description", () => {
    render(<BentoCard title="Kode Quest" description="Game 2D untuk belajar" />);
    expect(screen.getByText("Kode Quest")).toBeInTheDocument();
    expect(screen.getByText("Game 2D untuk belajar")).toBeInTheDocument();
  });

  it("renders an icon when provided", () => {
    render(
      <BentoCard
        title="Dunia 1"
        icon={<Icon name="robot" size={20} data-testid="icon" />}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <BentoCard title="Statistik">
        <p data-testid="child">XP: 100</p>
      </BentoCard>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies custom className for grid span", () => {
    render(
      <BentoCard
        title="Hero"
        className="md:col-span-2"
        data-testid="card"
      />,
    );
    expect(screen.getByTestId("card")).toHaveClass("md:col-span-2");
  });

  it("renders as a link when href is provided", () => {
    render(<BentoCard title="Mulai" href="/world/1" />);
    const link = screen.getByRole("link", { name: "Mulai" });
    expect(link).toHaveAttribute("href", "/world/1");
  });

  it("applies accent glow when interactive", () => {
    render(<BentoCard title="Shop" interactive data-testid="card" />);
    expect(screen.getByTestId("card")).toHaveClass("glow-box");
  });

  it("forwarded data attributes reach the element", () => {
    render(<BentoCard title="Arena" data-testid="arena" />);
    expect(screen.getByTestId("arena")).toBeInTheDocument();
  });
});