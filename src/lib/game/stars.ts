export const ERROR_RECOVERY_XP = 10;

export function starsForHints(hintsUsed: number): number {
  if (hintsUsed <= 0) return 3;
  if (hintsUsed === 1) return 2;
  return 1;
}

export function errorRecoveryBonus(hadError: boolean, hintsUsed: number): number {
  return hadError && hintsUsed <= 0 ? ERROR_RECOVERY_XP : 0;
}