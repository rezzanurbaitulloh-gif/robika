import { describe, expect, it } from "vitest";
import {
  CODELAB_REWARD_STARS,
  CODELAB_REWARD_XP,
  codelabReward,
} from "./reward";

describe("codelabReward", () => {
  it("returns the fixed reward amounts", () => {
    const reward = codelabReward();
    expect(reward).toEqual({ xp: CODELAB_REWARD_XP, stars: CODELAB_REWARD_STARS });
  });

  it("reward is positive and modest vs level rewards", () => {
    const reward = codelabReward();
    expect(reward.xp).toBeGreaterThan(0);
    expect(reward.xp).toBeLessThanOrEqual(100);
    expect(reward.stars).toBeGreaterThan(0);
  });
});