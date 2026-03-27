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
      <div className="w-10 h-10 flex items-center justify-center rounded bg-surface-high font-mono text-parchment-400/60 text-base leading-none select-none">
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
        'w-10 h-10 flex items-center justify-center rounded text-sm transition-transform select-none',
        'min-w-[40px] min-h-[40px]',
        !filled &&
          'outline outline-dashed outline-1 outline-parchment-400/35 outline-offset-0 bg-surface-low/30',
        filled && 'bg-gold-400 text-navy-900 shadow-glow-gold',
        filled && justFilled && 'animate-box-fill',
        !filled && !isStar && !isNext && 'text-parchment-400/45',
        !filled && isStar && 'text-teal-400',
        !filled && isNext && 'shadow-glow-teal active:scale-[0.92]',
        !tappable && 'cursor-default'
      )}
    >
      {filled && isStar && <span className="text-navy-900">★</span>}
      {filled && !isStar && '✓'}
      {!filled && isStar && <span className="text-xs">☆</span>}
    </button>
  );
}
