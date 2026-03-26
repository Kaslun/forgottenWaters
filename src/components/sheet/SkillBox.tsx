'use client';

import { cn } from '@/lib/utils';
import type { SkillBoxType } from '@/types/character';

interface SkillBoxProps {
  type: SkillBoxType;
  filled: boolean;
  isNext: boolean;
  justFilled: boolean;
  onClick?: () => void;
}

export function SkillBox({ type, filled, isNext, justFilled, onClick }: SkillBoxProps) {
  if (type === 'blocked') {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded bg-navy-900/60 border border-navy-700/40 text-navy-600 text-sm select-none">
        ✕
      </div>
    );
  }

  const isStar = type === 'star';
  const tappable = isNext && !filled && !!onClick;

  return (
    <button
      type="button"
      disabled={!tappable}
      onClick={tappable ? onClick : undefined}
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded border text-sm transition-transform select-none',
        'min-w-[40px] min-h-[40px]',
        filled && 'bg-gold-600 border-gold-500 text-navy-900',
        filled && justFilled && 'animate-box-fill',
        !filled && !isNext && 'border-parchment-500/30 text-parchment-500/40',
        !filled && isNext && 'border-parchment-400/60 active:scale-[0.92]',
        !tappable && 'cursor-default'
      )}
    >
      {filled && isStar && '★'}
      {filled && !isStar && '✓'}
      {!filled && isStar && <span className="text-xs opacity-60">☆</span>}
    </button>
  );
}
