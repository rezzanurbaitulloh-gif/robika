import { describe, expect, it } from "vitest";
import { simulateWithJs } from "./interpreter";
import type { GameLevel } from "./validate";

function level(grid: string[], goal: GameLevel["goal"] = { type: "reach" }): GameLevel {
  return {
    id: "test-level",
    grid,
    goal,
  } as unknown as GameLevel;
}

describe("simulateWithJs", () => {
  it("menjalankan perintah dasar seperti simulator lama", () => {
    const lv = level([
      "..#",
      "P.G",
    ]);
    const r = simulateWithJs(lv, "moveForward(); moveForward(); turnRight(); moveForward();");
    expect(r.status).toBe("ok");
    expect(r.won).toBe(true);
    expect(r.position).toEqual({ x: 2, y: 1 });
  });

  it("mendukung for loop numerik", () => {
    const lv = level(["P......G"]);
    const r = simulateWithJs(lv, "for (let i = 0; i < 7; i++) { moveForward(); }");
    expect(r.won).toBe(true);
    expect(r.steps).toBeGreaterThanOrEqual(7);
  });

  it("mendukung if/else dengan sensor blockedAhead", () => {
    const lv = level([
      "#.#",
      "P.G",
      "###",
    ]);
    const code = `
      while (canMove()) { moveForward(); }
      turnRight();
      moveForward();
      if (blockedAhead()) { turnLeft(); }
      moveForward();
    `;
    const r = simulateWithJs(lv, code);
    expect(r.won).toBe(true);
  });

  it("mendukung variabel dan aritmetika", () => {
    const lv = level(["P...G"]);
    const code = `
      let langkah = 2;
      langkah = langkah + 1;
      langkah *= 1;
      let total = langkah + 1;
      for (let i = 0; i < total; i++) moveForward();
    `;
    const r = simulateWithJs(lv, code);
    expect(r.won).toBe(true);
    expect(r.position).toEqual({ x: 4, y: 0 });
  });

  it("mendukung fungsi tanpa parameter dan pemanggilannya", () => {
    const lv = level([
      "...G",
      "P...",
    ]);
    const code = `
      function zigzag() {
        moveForward();
        turnLeft();
        moveForward();
      }
      zigzag();
      turnRight();
      moveForward();
      moveForward();
    `;
    const r = simulateWithJs(lv, code);
    expect(r.won).toBe(true);
  });

  it("openGate membuka gerbang D sehingga BOT bisa lewat", () => {
    const lv = level(["P.D..G"]);
    const blocked = simulateWithJs(lv, "moveForward(); moveForward(); moveForward();");
    expect(blocked.crashed).toBe(true);

    const opened = simulateWithJs(lv, "moveForward(); openGate(); moveForward(); moveForward(); moveForward(); moveForward();");
    expect(opened.crashed).toBe(false);
    expect(opened.gatesOpened).toBe(1);
    expect(opened.won).toBe(true);
  });

  it("koin terkumpul untuk goal collect", () => {
    const lv = level([
      "PC.C",
      "...G",
    ], { type: "collect", target: 2 });
    const r = simulateWithJs(
      lv,
      "for (let i = 0; i < 3; i++) moveForward(); turnRight(); for (let j = 0; j < 3; j++) moveForward();",
    );
    expect(r.coins).toBe(2);
    expect(r.won).toBe(true);
  });

  it("kode dengan error sintaks menghasilkan status error ramah", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, "moveForward(;");
    expect(r.status).toBe("error");
    expect(r.error).toBeTruthy();
    expect(r.won).toBe(false);
  });

  it("perintah tidak dikenal ditolak (fail closed)", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, "teleportToGoal();");
    expect(r.status).toBe("error");
    expect(r.error).toContain("tidak dikenal");
  });

  it("mengakses variabel global window/globalThis mustahil karena parser menolak titik", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, "window.location;");
    expect(r.status).toBe("error");
  });

  it("infinite loop dipotong oleh step budget / iterasi guard", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, "while (true) { }", { maxSteps: 500 });
    expect(r.status).toBe("error");
    expect(r.error).toMatch(/terlalu (lama|banyak)/);
  });

  it("rekursi tak berujung tertahan call-depth cap", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(
      lv,
      "function ulang() { ulang(); } ulang();",
      { maxSteps: 100_000 },
    );
    expect(r.status).toBe("error");
    expect(r.error).toContain("terlalu dalam");
  });

  it("string literal ditolak (hanya angka & boolean)", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, 'let nama = "hack";');
    expect(r.status).toBe("error");
  });

  it("pembagian nol menghasilkan error ramah", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, "let x = 5 / 0;");
    expect(r.status).toBe("error");
    expect(r.error).toContain("nol");
  });

  it("return di luar fungsi menghasilkan error jelas", () => {
    const lv = level(["P.G"]);
    const r = simulateWithJs(lv, "return 1;");
    expect(r.status).toBe("error");
    expect(r.error).toContain("return hanya boleh");
  });

  it("deterministik: input sama hasil sama", () => {
    const lv = level(["P.C..G"]);
    const code = "while (canMove()) moveForward();";
    const a = simulateWithJs(lv, code);
    const b = simulateWithJs(lv, code);
    expect(a).toEqual(b);
  });
});
