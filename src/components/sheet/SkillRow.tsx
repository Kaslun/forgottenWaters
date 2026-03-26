'use client';

import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SkillBox } from './SkillBox';
import { tapFeedback } from '@/lib/haptics';
import type { SkillBoxType, SkillName } from '@/types/character';

interface SkillRowProps {
  skillName: SkillName;
  grid: SkillBoxType[];
  level: number;
  onSkillUp: (skill: SkillName) => void;
  onSkillDown: (skill: SkillName) => void;
}

function getModifier(level: number): string {
  if (level <= 0) return '+0';
  return `+${level}`;
}

export function SkillRow({ skillName, grid, level, onSkillUp, onSkillDown }: SkillRowProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const fillableCount = grid.filter((b) => b !== 'blocked').length;
  const isMaxed = level >= fillableCount;

  const nextIndex = level;
  const nextIsBlocked = nextIndex < grid.length && grid[nextIndex] === 'blocked';

  const handleFill = useCallback(() => {
    if (isMaxed) return;
    tapFeedback();
    onSkillUp(skillName);
  }, [isMaxed, onSkillUp, skillName]);

  const startLongPress = useCallback(() => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      if (level > 0) {
        tapFeedback();
        onSkillDown(skillName);
      }
    }, 600);
  }, [level, onSkillDown, skillName]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  let filledSoFar = 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 flex-shrink-0">
        <span className="font-body text-sm text-parchment-200 capitalize">
          {skillName}
        </span>
        <span className="ml-1 text-xs text-gold-500 font-body">
          {getModifier(level)}
        </span>
      </div>

      <div
        className="flex items-center gap-1"
        onPointerDown={level > 0 ? startLongPress : undefined}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
      >
        {grid.map((boxType, i) => {
          const isFillable = boxType !== 'blocked';
          let filled = false;
          if (isFillable) {
            filled = filledSoFar < level;
            filledSoFar++;
          }

          const fillableIndex = isFillable ? filledSoFar - 1 : -1;
          const isNextBox = !isMaxed && isFillable && fillableIndex === level;

          return (
            <SkillBox
              key={i}
              type={boxType}
              filled={filled}
              isNext={isNextBox}
              justFilled={false}
              onClick={isNextBox ? handleFill : undefined}
            />
          );
        })}
      </div>

      <div className="flex-shrink-0 w-10 text-center">
        {isMaxed && (
          <span className="text-[10px] font-body font-bold text-gold-400 bg-gold-600/20 px-1.5 py-0.5 rounded">
            MAX
          </span>
        )}
        {!isMaxed && nextIsBlocked && (
          <span className="text-[10px] font-body text-red-400">blocked</span>
        )}
      </div>
    </div>
  );
}
