export function starsFromHintsUsed(hintsUsed: number): number {
  if (hintsUsed < 0) {
    throw new RangeError("hintsUsed must be non-negative");
  }
  if (hintsUsed === 0) return 3;
  if (hintsUsed === 1) return 2;
  return 1;
}