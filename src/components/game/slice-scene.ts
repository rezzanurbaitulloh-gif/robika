import type { SimEvent, SimDir } from "@/lib/game/interpreter";
import type { GameLevel } from "@/lib/game/validate";

const TILE = 48;
const COLORS = {
  wall: 0x475569,
  floor: 0x1a2138,
  goal: 0x34d399,
  coin: 0xfbbf24,
  bg: 0x0f1220,
};

const DIR_TEX: Record<SimDir, string> = {
  N: "bot-north",
  E: "bot-east",
  S: "bot-south",
  W: "bot-west",
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
    private moving = false;
    private walkTick = 0;
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
      for (let i = 0; i < 4; i++) {
        this.load.image(`walk-${i}`, `${base}/walk-south/${i}.png`);
      }
    }

    create() {
      const gfx = this.add.graphics();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const ch = grid[y][x];
          let color = COLORS.floor;
          if (ch === "#") color = COLORS.wall;
          else if (ch === "G") color = COLORS.goal;
          gfx.fillStyle(color, 1);
          gfx.fillRect(x * TILE, y * TILE, TILE - 2, TILE - 2);
          if (ch === "C") {
            gfx.fillStyle(COLORS.coin, 1);
            gfx.fillCircle(x * TILE + TILE / 2 - 1, y * TILE + TILE / 2 - 1, 6);
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

    private setFacing(dir: SimDir) {
      if (!this.moving) this.player.setTexture(DIR_TEX[dir]);
    }

    private startWalk(dir: SimDir) {
      this.moving = true;
      if (dir !== "S") {
        this.player.setTexture(DIR_TEX[dir]);
        return;
      }
      this.walkTick = 0;
      this.time.addEvent({
        delay: 90,
        loop: true,
        callback: () => {
          this.walkTick = (this.walkTick + 1) % 4;
          this.player.setTexture(`walk-${this.walkTick}`);
        },
      });
    }

    private stopWalk(dir: SimDir) {
      this.moving = false;
      this.time.removeAllEvents();
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
              if (goal && ev.to.x === goal.x && ev.to.y === goal.y) {
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
