'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { SkillGrid, SkillBoxType } from '@/types/character';

interface CharacterCardProps {
  id: string;
  title: string;
  shortDescription: string;
  isSelected: boolean;
  selectedBy: string | null;
  isDisabled: boolean;
  onSelect: () => void;
  skillGrid?: SkillGrid;
}

function SkillSpread({ skillGrid }: { skillGrid?: SkillGrid }) {
  if (!skillGrid) return null;
  const skills: (keyof SkillGrid)[] = ['exploration', 'brawn', 'hunting', 'aim', 'swagger', 'navigation'];
  return (
    <div className="flex gap-1 mt-2">
      {skills.map(skill => {
        const available = skillGrid[skill].filter((b: SkillBoxType) => b !== 'blocked').length;
        return (
          <div key={skill} className="flex flex-col items-center gap-0.5" title={skill}>
            <div className="w-2 h-8 bg-surface-high rounded-full overflow-hidden flex flex-col-reverse shadow-inner">
              <div
                className="rounded-full bg-teal-400/85 shadow-glow-teal"
                style={{ height: `${(available / 7) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[8px] text-parchment-400 uppercase">{skill.slice(0, 3)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CharacterCard({
  title,
  shortDescription,
  isSelected,
  selectedBy,
  isDisabled,
  onSelect,
  skillGrid,
}: CharacterCardProps) {
  const takenByOther = !!selectedBy && !isSelected;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isDisabled}
      className={cn(
        'w-full text-left min-h-[48px] transition-all rounded-2xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
        isDisabled && !isSelected && 'opacity-50 cursor-not-allowed',
      )}
    >
      <Card
        variant={isSelected ? 'highlighted' : 'default'}
        className={cn(
          'h-full transition-all gold-corner-accent shadow-ambient',
          takenByOther && 'grayscale opacity-60',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-pirata text-gold-400 text-base leading-tight">{title}</h3>
          {isSelected && <Badge variant="success">Yours</Badge>}
          {takenByOther && <Badge>{selectedBy}</Badge>}
        </div>

        <p className="font-body text-parchment-400 text-sm mt-1 leading-snug">
          {shortDescription}
        </p>

        <SkillSpread skillGrid={skillGrid} />
      </Card>
    </button>
  );
}
