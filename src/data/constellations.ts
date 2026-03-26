import type { ConstellationData } from '@/types/character';

export const SEEKER_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 50, y: 40, isStart: true, hasEvent: false },
    { id: 1, x: 18, y: 35, isStart: false, hasEvent: true },
    { id: 2, x: 82, y: 20, isStart: false, hasEvent: true },
    { id: 3, x: 30, y: 60, isStart: false, hasEvent: true },
    { id: 4, x: 70, y: 60, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 78, isStart: false, hasEvent: true },
    { id: 6, x: 35, y: 20, isStart: false, hasEvent: false },
    { id: 7, x: 65, y: 20, isStart: false, hasEvent: false },
    { id: 8, x: 20, y: 55, isStart: false, hasEvent: false },
    { id: 9, x: 80, y: 55, isStart: false, hasEvent: false },
    { id: 10, x: 50, y: 15, isStart: false, hasEvent: false },
    { id: 11, x: 90, y: 35, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 1], [0, 4], [0, 3],
    [6, 10], [7, 10], [6, 1], [7, 2],
    [1, 8], [8, 3], [3, 5], [5, 4],
    [4, 9], [9, 2], [2, 11],
    [11, 9],
  ],
};

export const ALL_SEEING_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 50, y: 45, isStart: true, hasEvent: false },
    { id: 1, x: 50, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 18, y: 40, isStart: false, hasEvent: true },
    { id: 3, x: 65, y: 40, isStart: false, hasEvent: true },
    { id: 4, x: 82, y: 40, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 72, isStart: false, hasEvent: true },
    { id: 6, x: 35, y: 28, isStart: false, hasEvent: false },
    { id: 7, x: 65, y: 28, isStart: false, hasEvent: false },
    { id: 8, x: 35, y: 58, isStart: false, hasEvent: false },
    { id: 9, x: 65, y: 58, isStart: false, hasEvent: false },
    { id: 10, x: 50, y: 58, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 3], [0, 2], [0, 10],
    [6, 1], [7, 1], [6, 2], [7, 3],
    [2, 8], [8, 5], [5, 10], [5, 9],
    [3, 4], [3, 9], [4, 7],
    [10, 8], [10, 9],
  ],
};

export const GRIFTER_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 45, y: 52, isStart: true, hasEvent: false },
    { id: 1, x: 38, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 72, y: 15, isStart: false, hasEvent: true },
    { id: 3, x: 30, y: 42, isStart: false, hasEvent: true },
    { id: 4, x: 68, y: 55, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 80, isStart: false, hasEvent: true },
    { id: 6, x: 55, y: 30, isStart: false, hasEvent: false },
    { id: 7, x: 25, y: 60, isStart: false, hasEvent: false },
    { id: 8, x: 60, y: 70, isStart: false, hasEvent: false },
    { id: 9, x: 80, y: 35, isStart: false, hasEvent: false },
    { id: 10, x: 50, y: 45, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 3], [0, 10], [0, 7], [0, 8],
    [10, 6], [6, 1], [6, 2], [6, 9],
    [9, 2], [9, 4],
    [3, 1], [3, 7],
    [7, 5], [5, 8], [8, 4],
    [4, 10],
  ],
};

export const ASSASSIN_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 60, y: 48, isStart: true, hasEvent: false },
    { id: 1, x: 35, y: 20, isStart: false, hasEvent: true },
    { id: 2, x: 70, y: 18, isStart: false, hasEvent: true },
    { id: 3, x: 42, y: 45, isStart: false, hasEvent: true },
    { id: 4, x: 25, y: 70, isStart: false, hasEvent: true },
    { id: 5, x: 75, y: 70, isStart: false, hasEvent: true },
    { id: 6, x: 52, y: 28, isStart: false, hasEvent: false },
    { id: 7, x: 80, y: 35, isStart: false, hasEvent: false },
    { id: 8, x: 50, y: 62, isStart: false, hasEvent: false },
    { id: 9, x: 35, y: 55, isStart: false, hasEvent: false },
    { id: 10, x: 68, y: 58, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 3], [0, 10],
    [6, 1], [6, 2], [1, 3], [2, 7],
    [3, 9], [9, 4], [4, 8],
    [8, 5], [8, 10], [10, 5],
    [7, 2],
  ],
};

export const SURVIVOR_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 55, y: 48, isStart: true, hasEvent: false },
    { id: 1, x: 65, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 40, y: 30, isStart: false, hasEvent: true },
    { id: 3, x: 65, y: 35, isStart: false, hasEvent: true },
    { id: 4, x: 45, y: 62, isStart: false, hasEvent: true },
    { id: 5, x: 55, y: 82, isStart: false, hasEvent: true },
    { id: 6, x: 50, y: 20, isStart: false, hasEvent: false },
    { id: 7, x: 30, y: 48, isStart: false, hasEvent: false },
    { id: 8, x: 75, y: 50, isStart: false, hasEvent: false },
    { id: 9, x: 65, y: 68, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 2], [0, 3], [0, 7], [0, 8], [0, 4],
    [6, 1], [6, 2], [6, 3],
    [2, 7], [7, 4],
    [3, 8], [3, 1],
    [4, 5], [5, 9], [9, 8],
  ],
};

export const DEBATER_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 40, y: 45, isStart: true, hasEvent: false },
    { id: 1, x: 30, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 62, y: 18, isStart: false, hasEvent: true },
    { id: 3, x: 60, y: 50, isStart: false, hasEvent: true },
    { id: 4, x: 75, y: 55, isStart: false, hasEvent: true },
    { id: 5, x: 72, y: 75, isStart: false, hasEvent: true },
    { id: 6, x: 25, y: 35, isStart: false, hasEvent: false },
    { id: 7, x: 48, y: 28, isStart: false, hasEvent: false },
    { id: 8, x: 55, y: 65, isStart: false, hasEvent: false },
    { id: 9, x: 35, y: 60, isStart: false, hasEvent: false },
    { id: 10, x: 48, y: 45, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 10], [0, 9],
    [6, 1], [1, 7], [7, 2],
    [2, 3], [10, 3], [3, 4],
    [9, 8], [8, 5], [8, 3],
    [4, 5],
  ],
};

export const ORPHAN_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 42, y: 42, isStart: true, hasEvent: false },
    { id: 1, x: 28, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 65, y: 18, isStart: false, hasEvent: true },
    { id: 3, x: 35, y: 58, isStart: false, hasEvent: true },
    { id: 4, x: 70, y: 55, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 75, isStart: false, hasEvent: true },
    { id: 6, x: 50, y: 25, isStart: false, hasEvent: false },
    { id: 7, x: 20, y: 40, isStart: false, hasEvent: false },
    { id: 8, x: 65, y: 38, isStart: false, hasEvent: false },
    { id: 9, x: 55, y: 55, isStart: false, hasEvent: false },
    { id: 10, x: 80, y: 70, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 8], [0, 3], [0, 9],
    [6, 1], [6, 2],
    [7, 1], [7, 3],
    [8, 2], [8, 4],
    [9, 5], [9, 4],
    [3, 5],
    [4, 10],
  ],
};

export const SEA_SERPENT_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 52, y: 45, isStart: true, hasEvent: false },
    { id: 1, x: 55, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 35, y: 30, isStart: false, hasEvent: true },
    { id: 3, x: 60, y: 35, isStart: false, hasEvent: true },
    { id: 4, x: 42, y: 60, isStart: false, hasEvent: true },
    { id: 5, x: 42, y: 78, isStart: false, hasEvent: true },
    { id: 6, x: 45, y: 22, isStart: false, hasEvent: false },
    { id: 7, x: 72, y: 28, isStart: false, hasEvent: false },
    { id: 8, x: 28, y: 48, isStart: false, hasEvent: false },
    { id: 9, x: 60, y: 55, isStart: false, hasEvent: false },
    { id: 10, x: 55, y: 68, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 2], [0, 3], [0, 8], [0, 9],
    [6, 1], [6, 2], [1, 7], [7, 3],
    [2, 8], [8, 4],
    [3, 9], [9, 4], [9, 10],
    [4, 5], [5, 10],
  ],
};

export const CANNONWRIGHT_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 50, y: 55, isStart: true, hasEvent: false },
    { id: 1, x: 35, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 40, y: 40, isStart: false, hasEvent: true },
    { id: 3, x: 78, y: 38, isStart: false, hasEvent: true },
    { id: 4, x: 55, y: 68, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 82, isStart: false, hasEvent: true },
    { id: 6, x: 55, y: 25, isStart: false, hasEvent: false },
    { id: 7, x: 25, y: 35, isStart: false, hasEvent: false },
    { id: 8, x: 65, y: 48, isStart: false, hasEvent: false },
    { id: 9, x: 35, y: 65, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 2], [0, 8], [0, 9], [0, 4],
    [6, 1], [6, 3], [6, 2],
    [1, 7], [7, 2],
    [8, 3],
    [9, 5], [4, 5], [4, 8],
  ],
};

export const GOLD_COAT_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 48, y: 45, isStart: true, hasEvent: false },
    { id: 1, x: 45, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 25, y: 35, isStart: false, hasEvent: true },
    { id: 3, x: 60, y: 30, isStart: false, hasEvent: true },
    { id: 4, x: 75, y: 30, isStart: false, hasEvent: true },
    { id: 5, x: 85, y: 42, isStart: false, hasEvent: true },
    { id: 6, x: 35, y: 25, isStart: false, hasEvent: false },
    { id: 7, x: 55, y: 18, isStart: false, hasEvent: false },
    { id: 8, x: 40, y: 55, isStart: false, hasEvent: false },
    { id: 9, x: 62, y: 50, isStart: false, hasEvent: false },
    { id: 10, x: 50, y: 65, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 3], [0, 8], [0, 9],
    [6, 1], [6, 2], [1, 7], [7, 3],
    [3, 4], [4, 5],
    [8, 2], [8, 10], [9, 5],
    [10, 9],
  ],
};

export const DUELIST_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 45, y: 38, isStart: true, hasEvent: false },
    { id: 1, x: 55, y: 12, isStart: false, hasEvent: true },
    { id: 2, x: 30, y: 28, isStart: false, hasEvent: true },
    { id: 3, x: 65, y: 48, isStart: false, hasEvent: true },
    { id: 4, x: 70, y: 65, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 80, isStart: false, hasEvent: true },
    { id: 6, x: 40, y: 20, isStart: false, hasEvent: false },
    { id: 7, x: 55, y: 32, isStart: false, hasEvent: false },
    { id: 8, x: 38, y: 55, isStart: false, hasEvent: false },
    { id: 9, x: 55, y: 60, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 2], [0, 8],
    [6, 1], [6, 2],
    [7, 1], [7, 3],
    [3, 4], [8, 5], [8, 9],
    [9, 5], [9, 4],
  ],
};

export const ALCHEMIST_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 52, y: 38, isStart: true, hasEvent: false },
    { id: 1, x: 50, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 28, y: 45, isStart: false, hasEvent: true },
    { id: 3, x: 55, y: 55, isStart: false, hasEvent: true },
    { id: 4, x: 65, y: 65, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 78, isStart: false, hasEvent: true },
    { id: 6, x: 38, y: 25, isStart: false, hasEvent: false },
    { id: 7, x: 65, y: 25, isStart: false, hasEvent: false },
    { id: 8, x: 40, y: 60, isStart: false, hasEvent: false },
    { id: 9, x: 75, y: 45, isStart: false, hasEvent: false },
    { id: 10, x: 35, y: 40, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 10], [0, 3],
    [6, 1], [7, 1],
    [10, 2], [2, 8],
    [7, 9], [9, 4],
    [3, 4], [3, 8], [3, 5],
    [8, 5], [4, 5],
  ],
};

export const SAFETY_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 55, y: 55, isStart: true, hasEvent: false },
    { id: 1, x: 50, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 38, y: 35, isStart: false, hasEvent: true },
    { id: 3, x: 48, y: 42, isStart: false, hasEvent: true },
    { id: 4, x: 62, y: 75, isStart: false, hasEvent: true },
    { id: 5, x: 50, y: 85, isStart: false, hasEvent: true },
    { id: 6, x: 60, y: 28, isStart: false, hasEvent: false },
    { id: 7, x: 30, y: 50, isStart: false, hasEvent: false },
    { id: 8, x: 70, y: 48, isStart: false, hasEvent: false },
    { id: 9, x: 45, y: 65, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 3], [0, 8], [0, 9],
    [6, 1], [6, 2], [1, 2],
    [2, 3], [3, 7],
    [8, 6],
    [9, 5], [9, 4],
    [4, 5],
  ],
};

export const PARENT_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 38, y: 50, isStart: true, hasEvent: false },
    { id: 1, x: 38, y: 18, isStart: false, hasEvent: true },
    { id: 2, x: 38, y: 32, isStart: false, hasEvent: true },
    { id: 3, x: 55, y: 55, isStart: false, hasEvent: true },
    { id: 4, x: 65, y: 68, isStart: false, hasEvent: true },
    { id: 5, x: 55, y: 80, isStart: false, hasEvent: true },
    { id: 6, x: 55, y: 22, isStart: false, hasEvent: false },
    { id: 7, x: 25, y: 40, isStart: false, hasEvent: false },
    { id: 8, x: 50, y: 40, isStart: false, hasEvent: false },
    { id: 9, x: 45, y: 68, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 2], [0, 7], [0, 8], [0, 3],
    [2, 1], [1, 6], [6, 8],
    [7, 2],
    [3, 4], [3, 9],
    [9, 5], [4, 5],
  ],
};

export const TRICKSTER_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 50, y: 28, isStart: true, hasEvent: false },
    { id: 1, x: 28, y: 40, isStart: false, hasEvent: true },
    { id: 2, x: 50, y: 48, isStart: false, hasEvent: true },
    { id: 3, x: 72, y: 48, isStart: false, hasEvent: true },
    { id: 4, x: 22, y: 70, isStart: false, hasEvent: true },
    { id: 5, x: 55, y: 82, isStart: false, hasEvent: true },
    { id: 6, x: 35, y: 22, isStart: false, hasEvent: false },
    { id: 7, x: 65, y: 22, isStart: false, hasEvent: false },
    { id: 8, x: 40, y: 58, isStart: false, hasEvent: false },
    { id: 9, x: 65, y: 62, isStart: false, hasEvent: false },
    { id: 10, x: 78, y: 72, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 2],
    [6, 1], [7, 3],
    [1, 2], [2, 3], [1, 8],
    [8, 4], [8, 5],
    [3, 9], [9, 5], [9, 10],
  ],
};

export const LOVESICK_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 38, y: 48, isStart: true, hasEvent: false },
    { id: 1, x: 58, y: 12, isStart: false, hasEvent: true },
    { id: 2, x: 72, y: 30, isStart: false, hasEvent: true },
    { id: 3, x: 25, y: 62, isStart: false, hasEvent: true },
    { id: 4, x: 62, y: 58, isStart: false, hasEvent: true },
    { id: 5, x: 40, y: 78, isStart: false, hasEvent: true },
    { id: 6, x: 40, y: 25, isStart: false, hasEvent: false },
    { id: 7, x: 55, y: 35, isStart: false, hasEvent: false },
    { id: 8, x: 20, y: 40, isStart: false, hasEvent: false },
    { id: 9, x: 50, y: 65, isStart: false, hasEvent: false },
    { id: 10, x: 80, y: 48, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 8], [0, 9],
    [6, 1], [7, 1], [7, 2],
    [2, 10],
    [8, 3], [3, 5],
    [9, 4], [9, 5],
    [4, 10],
  ],
};

export const SEASICK_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 48, y: 40, isStart: true, hasEvent: false },
    { id: 1, x: 55, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 30, y: 48, isStart: false, hasEvent: true },
    { id: 3, x: 65, y: 48, isStart: false, hasEvent: true },
    { id: 4, x: 28, y: 70, isStart: false, hasEvent: true },
    { id: 5, x: 62, y: 72, isStart: false, hasEvent: true },
    { id: 6, x: 35, y: 25, isStart: false, hasEvent: false },
    { id: 7, x: 68, y: 28, isStart: false, hasEvent: false },
    { id: 8, x: 48, y: 58, isStart: false, hasEvent: false },
    { id: 9, x: 45, y: 80, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 6], [0, 7], [0, 2], [0, 3],
    [6, 1], [7, 1],
    [2, 4], [3, 5],
    [2, 8], [3, 8],
    [4, 9], [5, 9],
    [8, 9],
  ],
};

export const CULINARY_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 48, y: 55, isStart: true, hasEvent: false },
    { id: 1, x: 35, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 58, y: 20, isStart: false, hasEvent: true },
    { id: 3, x: 25, y: 38, isStart: false, hasEvent: true },
    { id: 4, x: 58, y: 72, isStart: false, hasEvent: true },
    { id: 5, x: 55, y: 85, isStart: false, hasEvent: true },
    { id: 6, x: 45, y: 30, isStart: false, hasEvent: false },
    { id: 7, x: 35, y: 50, isStart: false, hasEvent: false },
    { id: 8, x: 62, y: 42, isStart: false, hasEvent: false },
    { id: 9, x: 40, y: 68, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 7], [0, 8], [0, 9],
    [6, 1], [6, 2], [6, 3],
    [7, 3], [7, 6],
    [8, 2], [8, 4],
    [9, 5], [4, 5],
  ],
};

export const DOOMED_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 48, y: 45, isStart: true, hasEvent: false },
    { id: 1, x: 65, y: 12, isStart: false, hasEvent: true },
    { id: 2, x: 42, y: 28, isStart: false, hasEvent: true },
    { id: 3, x: 55, y: 58, isStart: false, hasEvent: true },
    { id: 4, x: 28, y: 68, isStart: false, hasEvent: true },
    { id: 5, x: 42, y: 78, isStart: false, hasEvent: true },
    { id: 6, x: 50, y: 18, isStart: false, hasEvent: false },
    { id: 7, x: 35, y: 38, isStart: false, hasEvent: false },
    { id: 8, x: 60, y: 38, isStart: false, hasEvent: false },
    { id: 9, x: 42, y: 60, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 2], [0, 7], [0, 8], [0, 9],
    [6, 1], [6, 2],
    [2, 7], [2, 8],
    [8, 1],
    [7, 4], [9, 3], [9, 4],
    [4, 5], [3, 5],
  ],
};

export const SKELETON_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 48, y: 42, isStart: true, hasEvent: false },
    { id: 1, x: 42, y: 15, isStart: false, hasEvent: true },
    { id: 2, x: 20, y: 35, isStart: false, hasEvent: true },
    { id: 3, x: 72, y: 35, isStart: false, hasEvent: true },
    { id: 4, x: 30, y: 68, isStart: false, hasEvent: true },
    { id: 5, x: 62, y: 65, isStart: false, hasEvent: true },
    { id: 6, x: 55, y: 22, isStart: false, hasEvent: false },
    { id: 7, x: 30, y: 25, isStart: false, hasEvent: false },
    { id: 8, x: 35, y: 50, isStart: false, hasEvent: false },
    { id: 9, x: 62, y: 50, isStart: false, hasEvent: false },
    { id: 10, x: 48, y: 75, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 8], [0, 9], [0, 6], [0, 7],
    [7, 1], [6, 1], [7, 2],
    [6, 3], [2, 8],
    [3, 9], [8, 4],
    [9, 5], [4, 10], [5, 10],
    [8, 9],
  ],
};

export const THESPIAN_CONSTELLATION: ConstellationData = {
  stars: [
    { id: 0, x: 38, y: 52, isStart: true, hasEvent: false },
    { id: 1, x: 30, y: 20, isStart: false, hasEvent: true },
    { id: 2, x: 60, y: 20, isStart: false, hasEvent: true },
    { id: 3, x: 22, y: 48, isStart: false, hasEvent: true },
    { id: 4, x: 55, y: 48, isStart: false, hasEvent: true },
    { id: 5, x: 52, y: 75, isStart: false, hasEvent: true },
    { id: 6, x: 45, y: 15, isStart: false, hasEvent: false },
    { id: 7, x: 48, y: 35, isStart: false, hasEvent: false },
    { id: 8, x: 70, y: 38, isStart: false, hasEvent: false },
    { id: 9, x: 35, y: 65, isStart: false, hasEvent: false },
    { id: 10, x: 65, y: 60, isStart: false, hasEvent: false },
  ],
  edges: [
    [0, 3], [0, 7], [0, 9],
    [6, 1], [6, 2],
    [7, 1], [7, 2], [7, 4],
    [3, 1], [4, 8],
    [2, 8],
    [9, 5], [10, 5], [10, 4],
    [9, 3],
  ],
};

export const CONSTELLATION_DATA: Record<string, ConstellationData> = {
  seeker: SEEKER_CONSTELLATION,
  allSeeing: ALL_SEEING_CONSTELLATION,
  grifter: GRIFTER_CONSTELLATION,
  assassin: ASSASSIN_CONSTELLATION,
  survivor: SURVIVOR_CONSTELLATION,
  debater: DEBATER_CONSTELLATION,
  orphan: ORPHAN_CONSTELLATION,
  seaSerpent: SEA_SERPENT_CONSTELLATION,
  cannonwright: CANNONWRIGHT_CONSTELLATION,
  goldCoat: GOLD_COAT_CONSTELLATION,
  duelist: DUELIST_CONSTELLATION,
  alchemist: ALCHEMIST_CONSTELLATION,
  safety: SAFETY_CONSTELLATION,
  parent: PARENT_CONSTELLATION,
  trickster: TRICKSTER_CONSTELLATION,
  lovesick: LOVESICK_CONSTELLATION,
  seasick: SEASICK_CONSTELLATION,
  culinary: CULINARY_CONSTELLATION,
  doomed: DOOMED_CONSTELLATION,
  skeleton: SKELETON_CONSTELLATION,
  thespian: THESPIAN_CONSTELLATION,
};
