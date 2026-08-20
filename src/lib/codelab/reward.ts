export const CODELAB_REWARD_XP = 50;
export const CODELAB_REWARD_STARS = 15;

export interface CodelabReward {
  xp: number;
  stars: number;
}

export function codelabReward(): CodelabReward {
  return { xp: CODELAB_REWARD_XP, stars: CODELAB_REWARD_STARS };
}
