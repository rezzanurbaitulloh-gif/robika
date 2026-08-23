import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ModuleComplete } from "./module-complete";
import { getSnapshot } from "@/lib/offline/queue";

describe("ModuleComplete", () => {
  it("renders continue + back links when already done with a next module", () => {
    render(
      <ModuleComplete
        itemType="module"
        itemId="js/mod1"
        initialDone
        nextHref="/learn/js/mod2"
        backHref="/learn/js"
      />,
    );
    const next = screen.getByRole("link", {
      name: /Lanjut ke Materi Berikutnya/,
    });
    expect(next).toHaveAttribute("href", "/learn/js/mod2");
    const back = screen.getByRole("link", {
      name: /Kembali ke Daftar Modul/,
    });
    expect(back).toHaveAttribute("href", "/learn/js");
  });

  it("shows all-done badge when last module is finished", () => {
    render(
      <ModuleComplete
        itemType="module"
        itemId="cpp/mod6"
        initialDone
        isLast
        backHref="/learn/cpp"
      />,
    );
    expect(screen.getByText(/Semua materi selesai!/)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Lanjut ke Materi Berikutnya/ }),
    ).not.toBeInTheDocument();
  });

  it("does not show continue links before completion", () => {
    render(
      <ModuleComplete
        itemType="module"
        itemId="js/mod1"
        initialDone={false}
        nextHref="/learn/js/mod2"
        backHref="/learn/js"
      />,
    );
    expect(
      screen.queryByRole("link", { name: /Lanjut ke Materi Berikutnya/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Kembali ke Daftar Modul/ }),
    ).not.toBeInTheDocument();
  });

  it("queues the completion locally when offline instead of losing it", async () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    render(<ModuleComplete itemType="module" itemId="js/off1" initialDone={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Tandai Selesai/i }));

    await waitFor(() =>
      expect(screen.getByText(/disimpan lokal/)).toBeInTheDocument(),
    );
    expect(getSnapshot()).toBe(1);
    vi.unstubAllGlobals();
  });
});