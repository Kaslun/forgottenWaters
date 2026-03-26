import type { ConstellationData } from '@/types/character';

export function getAdjacentStarIds(
  constellation: ConstellationData,
  starId: number
): number[] {
  return constellation.edges
    .filter(([a, b]) => a === starId || b === starId)
    .map(([a, b]) => (a === starId ? b : a));
}

export function getEligibleStarIds(
  constellation: ConstellationData,
  filledStarIds: number[]
): number[] {
  const startStar = constellation.stars.find((s) => s.isStart);
  if (!startStar) return [];

  const allFilled = new Set([startStar.id, ...filledStarIds]);

  const eligible = new Set<number>();
  for (const filledId of allFilled) {
    for (const adjId of getAdjacentStarIds(constellation, filledId)) {
      if (!allFilled.has(adjId)) {
        eligible.add(adjId);
      }
    }
  }
  return Array.from(eligible);
}
