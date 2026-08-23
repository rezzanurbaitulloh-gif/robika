import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BotCompanion } from "./bot-companion";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("BotCompanion", () => {
  it("renders collapsed by default with aria-expanded false", () => {
    render(<BotCompanion />);
    const toggle = screen.getByTestId("bot-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("img", { name: "BOT-1" })).toBeInTheDocument();
  });

  it("opens bubble with idle line and ask button on toggle", () => {
    render(<BotCompanion />);
    fireEvent.click(screen.getByTestId("bot-toggle"));
    expect(screen.getByTestId("bot-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByTestId("companion-line")).toBeInTheDocument();
    expect(screen.getByText("[ Ask BOT-1 ]")).toBeInTheDocument();
  });

  it("closes the bubble when toggled again", () => {
    render(<BotCompanion />);
    fireEvent.click(screen.getByTestId("bot-toggle"));
    fireEvent.click(screen.getByTestId("bot-toggle"));
    expect(screen.getByTestId("bot-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByTestId("companion-line")).not.toBeInTheDocument();
  });
});
