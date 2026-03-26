import { clsx, type ClassValue } from 'clsx';
import type { Player } from '@/types/game';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function renderStoryText(
  template: string,
  blanks: Record<string, string>,
  players: Player[]
): string {
  return template.replace(/\{(\d+)\}/g, (_match, num) => {
    const value = blanks[num];
    if (!value) return `_____(${num})_____`;

    const player = players.find((p) => p.id === value);
    if (player) {
      return player.pirate_name || player.display_name;
    }

    return value;
  });
}
