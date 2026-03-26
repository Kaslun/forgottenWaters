'use client';

import { useOrientation } from '@/hooks/useOrientation';
import { SkillRow } from './SkillRow';
import { cn } from '@/lib/utils';
import type { SkillGrid as SkillGridType, SkillName } from '@/types/character';
import type { CharacterSheet } from '@/types/game';

const SKILL_ORDER: SkillName[] = [
  'exploration',
  'brawn',
  'hunting',
  'aim',
  'swagger',
  'navigation',
];

interface SkillGridProps {
  skillGrid: SkillGridType;
  sheet: CharacterSheet;
  onSkillUp: (skill: SkillName) => void;
  onSkillDown: (skill: SkillName) => void;
}

export function SkillGridComponent({
  skillGrid,
  sheet,
  onSkillUp,
  onSkillDown,
}: SkillGridProps) {
  const isLandscape = useOrientation();

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        isLandscape && 'gap-1'
      )}
    >
      {SKILL_ORDER.map((skill) => (
        <SkillRow
          key={skill}
          skillName={skill}
          grid={skillGrid[skill]}
          level={sheet[skill]}
          onSkillUp={onSkillUp}
          onSkillDown={onSkillDown}
        />
      ))}
    </div>
  );
}
