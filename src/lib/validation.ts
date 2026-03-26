import type { SkillBoxType } from '@/types/character';

export function validateDisplayName(name: string): string | null {
  if (!name.trim()) return 'Name cannot be empty';
  if (name.length > 30) return 'Name is too long (max 30 characters)';
  return null;
}

export function validatePirateName(name: string): string | null {
  if (!name.trim()) return 'Pirate name cannot be empty';
  if (name.length > 50) return 'Pirate name is too long (max 50 characters)';
  return null;
}

export function validateShipName(name: string): string | null {
  if (!name.trim()) return 'Ship name cannot be empty';
  if (name.length > 40) return 'Ship name is too long (max 40 characters)';
  return null;
}

export function validateJoinCode(code: string): string | null {
  if (!code.trim()) return 'Enter a join code';
  if (code.length < 5 || code.length > 10) return 'Invalid code format';
  if (!/^[A-Z0-9]+$/i.test(code)) return 'Code should only contain letters and numbers';
  return null;
}

export function validateStoryBlank(value: string): string | null {
  if (value.length > 100) return 'Too long (max 100 characters)';
  return null;
}

export function validateSkillUpdate(
  currentLevel: number,
  skillGrid: SkillBoxType[]
): boolean {
  if (currentLevel >= 7) return false;
  if (skillGrid[currentLevel] === 'blocked') return false;
  return true;
}

export function validateConstellationFill(
  starId: number,
  eligibleStarIds: number[]
): boolean {
  return eligibleStarIds.includes(starId);
}
