'use client';

import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { SkillGrid, SkillName } from '@/types/character';
import type { CharacterSheet } from '@/types/game';

const SKILL_ORDER: SkillName[] = [
  'exploration',
  'brawn',
  'hunting',
  'aim',
  'swagger',
  'navigation',
];

interface SkillChoiceModalProps {
  skillGrid: SkillGrid;
  sheet: CharacterSheet;
  onChoose: (skill: SkillName) => void;
  onClose: () => void;
}

export function SkillChoiceModal({
  skillGrid,
  sheet,
  onChoose,
  onClose,
}: SkillChoiceModalProps) {
  return (
    <Modal onClose={onClose} title="Gain 1 Skill">
      <div className="flex flex-col gap-2">
        {SKILL_ORDER.map((skill) => {
          const grid = skillGrid[skill];
          const level = sheet[skill];
          const fillableCount = grid.filter((b) => b !== 'blocked').length;
          const isMaxed = level >= fillableCount;

          const nextFillableIndex = (() => {
            let count = 0;
            for (let i = 0; i < grid.length; i++) {
              if (grid[i] !== 'blocked') {
                if (count === level) return i;
                count++;
              }
            }
            return -1;
          })();

          const nextIsStar =
            nextFillableIndex >= 0 && grid[nextFillableIndex] === 'star';
          const nextIsBlocked =
            !isMaxed && nextFillableIndex >= 0 && grid[nextFillableIndex] === 'blocked';
          const disabled = isMaxed || nextIsBlocked;

          return (
            <button
              key={skill}
              disabled={disabled}
              onClick={() => onChoose(skill)}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl border font-body text-left transition-colors',
                'min-h-[48px]',
                disabled
                  ? 'border-navy-700/30 text-parchment-500/40 cursor-not-allowed'
                  : 'border-gold-700/30 text-parchment-200 active:bg-navy-700/50'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="capitalize text-sm">{skill}</span>
                {nextIsStar && !disabled && (
                  <span className="text-gold-400 text-xs">★</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-parchment-400">
                  {level}/{fillableCount}
                </span>
                {isMaxed && (
                  <span className="text-[10px] font-bold text-gold-400 bg-gold-600/20 px-1.5 py-0.5 rounded">
                    MAX
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
