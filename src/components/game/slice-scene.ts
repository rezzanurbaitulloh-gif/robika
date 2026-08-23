import type { SimEvent, SimDir } from "@/lib/game/interpreter";
import type { GameLevel } from "@/lib/game/validate";

const TILE = 48;
const COLORS = {
  wall: 0x475569,
  floor: 0x1a2138,
  goal: 0x34d399,
  coin: 0xfbbf24,
  bg: 0x0f1220,
  gate: 0xf59e0b,
};

const DIR_TEX: Record<SimDir, string> = {
  N: "bot-north",
  E: "bot-east",
  S: "bot-south",
  W: "bot-west",
};

const DIR_FILE: Record<SimDir, string> = {
  N: "north",
  E: "east",
  S: "south",
  W: "west",
};

export interface SliceHandle {
  destroy(): void;
  runEvents(events: SimEvent[]): Promise<boolean>;
}

interface Cell {
  ch: string;
  x: number;
  y: number;
}

function findCell(grid: string[], ch: string): Cell | null {
  for (let y = 0; y < grid.length; y++) {
    const x = grid[y].indexOf(ch);
    if (x >= 0) return { ch, x, y };
  }
  return null;
}

async function loadPhaser() {
  const mod = await import("phaser");
  return (mod as unknown as { default?: typeof import("phaser") }).default ?? mod;
}

export async function createSliceScene(
  container: HTMLElement,
  level: GameLevel,
  onWin: () => void
): Promise<SliceHandle> {
  const Phaser = await loadPhaser();
  const grid = level.grid;
  const cols = grid[0].length;
  const rows = grid.length;
  const start = findCell(grid, "P");
  const goal = findCell(grid, "G");

  class SliceScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Image;
    private gates = new Map<string, Phaser.GameObjects.Rectangle>();
    private moving = false;
    private walkTick = 0;
    private walkTimer?: Phaser.Time.TimerEvent;
    private won = false;

    constructor() {
      super("slice");
    }

    preload() {
      const base = "/assets/pixel/v2/bot1";
      this.load.image("bot-south", `${base}/bot1-south.png`);
      this.load.image("bot-north", `${base}/bot1-north.png`);
      this.load.image("bot-east", `${base}/bot1-east.png`);
      this.load.image("bot-west", `${base}/bot1-west.png`);
      for (const d of Object.keys(DIR_FILE) as SimDir[]) {
        for (let i = 0; i < 4; i++) {
          this.load.image(`walk-${d}-${i}`, `${base}/walk-${DIR_FILE[d]}/${i}.png`);
        }
      }
      this.load.image(
        "npc-pak-kiwar",
        "/assets/pixel/v2/npc/pak-kiwar-south.png"
      );
      this.load.image("tile-floor", "/assets/pixel/v2/tiles/floor.png");
      this.load.image("tile-wall", "/assets/pixel/v2/tiles/wall.png");
      for (let i = 0; i < 4; i++) {
        this.load.image(`spark-${i}`, `/assets/pixel/v2/vfx/spark-${i}.png`);
      }
    }

    create() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const ch = grid[y][x];
          this.add
            .image(
              x * TILE + TILE / 2 - 1,
              y * TILE + TILE / 2 - 1,
              ch === "#" ? "tile-wall" : "tile-floor"
            )
            .setDisplaySize(TILE - 2, TILE - 2);
          if (ch === "C") {
            const gfx = this.add.graphics();
            gfx.fillStyle(COLORS.coin, 1);
            gfx.fillCircle(x * TILE + TILE / 2 - 1, y * TILE + TILE / 2 - 1, 6);
          }
          if (ch === "D") {
            const gate = this.add.rectangle(
              x * TILE + TILE / 2 - 1,
              y * TILE + TILE / 2 - 1,
              TILE - 8,
              TILE - 8
            );
            gate.setFillStyle(COLORS.gate, 0.95);
            gate.setStrokeStyle(2, 0xfff7ed, 0.9);
            this.gates.set(`${x},${y}`, gate);
          }
          if (ch === "N") {
            const npc = this.add.image(
              x * TILE + TILE / 2,
              y * TILE + TILE / 2 - 4,
              "npc-pak-kiwar"
            );
            npc.setDisplaySize(TILE + 8, TILE + 8);
          }
        }
      }

      if (goal) {
        const glow = this.add.rectangle(
          goal.x * TILE + TILE / 2 - 1,
          goal.y * TILE + TILE / 2 - 1,
          TILE - 4,
          TILE - 4
        );
        glow.setStrokeStyle(2, COLORS.goal, 0.9);
        this.tweens.add({
          targets: glow,
          alpha: { from: 1, to: 0.25 },
          duration: 600,
          yoyo: true,
          repeat: -1,
        });
      }

      this.player = this.add.image(
        (start?.x ?? 1) * TILE + TILE / 2,
        (start?.y ?? 1) * TILE + TILE / 2,
        "bot-south"
      );
      this.player.setDisplaySize(TILE + 12, TILE + 12);
    }

    private burst(atX: number, atY: number) {
      const fx = this.add.image(atX, atY, "spark-0");
      fx.setDepth(6);
      let tick = 0;
      const timer = this.time.addEvent({
        delay: 80,
        loop: true,
        callback: () => {
          tick = (tick + 1) % 4;
          fx.setTexture(`spark-${tick}`);
        },
      });
      this.tweens.add({
        targets: fx,
        scale: { from: 1, to: 2.4 },
        alpha: { from: 1, to: 0 },
        duration: 520,
        ease: "Sine.easeOut",
        onComplete: () => {
          timer.remove();
          fx.destroy();
        },
      });
    }

    private setFacing(dir: SimDir) {
      if (!this.moving) this.player.setTexture(DIR_TEX[dir]);
    }

    private startWalk(dir: SimDir) {
      this.moving = true;
      this.walkTick = 0;
      this.player.setTexture(`walk-${dir}-0`);
      this.walkTimer = this.time.addEvent({
        delay: 90,
        loop: true,
        callback: () => {
          this.walkTick = (this.walkTick + 1) % 4;
          this.player.setTexture(`walk-${dir}-${this.walkTick}`);
        },
      });
    }

    private stopWalk(dir: SimDir) {
      this.moving = false;
      this.walkTimer?.remove();
      this.walkTimer = undefined;
      this.player.setTexture(DIR_TEX[dir]);
    }

    runEvents(events: SimEvent[]): Promise<boolean> {
      return new Promise((resolve) => {
        const queue = [...events];
        const step = () => {
          const ev = queue.shift();
          if (!ev) {
            resolve(this.won);
            return;
          }
          if (ev.kind === "turn") {
            this.setFacing(ev.dir);
            this.time.delayedCall(80, step);
            return;
          }
          if (ev.kind === "openGate") {
            const gates = [...this.gates.values()];
            gates.forEach((g) => g.setFillStyle(COLORS.goal, 0.4));
            this.tweens.add({
              targets: gates,
              alpha: 0.12,
              scaleY: 0.25,
              duration: 260,
              ease: "Sine.easeOut",
            });
            this.time.delayedCall(300, step);
            return;
          }
          if (ev.kind === "npcTalk") {
            const cx = ev.x * TILE + TILE / 2;
            const cy = ev.y * TILE - 14;
            const bubble = this.add
              .text(cx, cy, "!", {
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#34d399",
                fontStyle: "bold",
              })
              .setOrigin(0.5)
              .setDepth(5);
            this.tweens.add({
              targets: bubble,
              y: cy - 10,
              alpha: 0,
              duration: 520,
              ease: "Sine.easeOut",
              onComplete: () => bubble.destroy(),
            });
            this.time.delayedCall(350, step);
            return;
          }
          if (ev.kind !== "move") {
            this.time.delayedCall(60, step);
            return;
          }
          this.startWalk(this.facingOf(ev));
          this.tweens.add({
            targets: this.player,
            x: ev.to.x * TILE + TILE / 2,
            y: ev.to.y * TILE + TILE / 2,
            duration: 170,
            onComplete: () => {
              if (ev.won) {
                this.burst(ev.to.x * TILE + TILE / 2, ev.to.y * TILE + TILE / 2);
                this.won = true;
                onWin();
              }
              this.stopWalk(this.facingOf(ev));
              this.time.delayedCall(40, step);
            },
          });
        };
        step();
      });
    }

    private facingOf(ev: Extract<SimEvent, { kind: "move" }>): SimDir {
      if (ev.to.y < ev.from.y) return "N";
      if (ev.to.y > ev.from.y) return "S";
      if (ev.to.x > ev.from.x) return "E";
      return "W";
    }
  }

  const scene = new SliceScene();
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width: cols * TILE,
    height: rows * TILE,
    backgroundColor: COLORS.bg,
    pixelArt: true,
    scene: [scene],
  });

  await new Promise<void>((resolve) => game.events.once("ready", resolve));

  return {
    destroy: () => game.destroy(true),
    runEvents: (events) => scene.runEvents(events),
  };
}
