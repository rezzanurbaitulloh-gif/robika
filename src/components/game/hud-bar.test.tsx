import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HudBar } from "./hud-bar";

describe("HudBar", () => {
  it("renders level, xp bar, gems and streak", () => {
    render(<HudBar level={7} xp={240} gems={128} streak={12} />);
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("hides stars chip when stars is not provided", () => {
    render(<HudBar level={1} xp={0} gems={5} streak={1} />);
    expect(screen.queryByText("40")).not.toBeInTheDocument();
  });

  it("renders stars chip when stars is provided", () => {
    render(<HudBar level={1} xp={0} gems={5} stars={40} streak={1} />);
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("renders quest link when questLabel is given", () => {
    render(
      <HudBar
        level={2}
        xp={10}
        gems={3}
        streak={4}
        questLabel="Kunci Gerbang Tembaga"
        questHref="/level/lv-03"
      />,
    );
    const link = screen.getByRole("link", { name: /Kunci Gerbang Tembaga/ });
    expect(link).toHaveAttribute("href", "/level/lv-03");
  });

  it("omits quest link without questLabel", () => {
    render(<HudBar level={2} xp={10} gems={3} streak={4} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
