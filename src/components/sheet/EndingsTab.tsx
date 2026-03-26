'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { Player, CharacterSheet } from '@/types/game';
import type { CharacterDefinition } from '@/types/character';

interface EndingsTabProps {
  character: CharacterDefinition;
  sheet: CharacterSheet;
  players: Player[];
  gameStatus: string;
}

const TIER_META: Record<string, { label: string; icon: string; color: string }> = {
  bad: { label: 'Bad Ending', icon: '💀', color: 'text-red-400' },
  good: { label: 'Good Ending', icon: '⚓', color: 'text-parchment-200' },
  legendary: { label: 'Legendary Ending', icon: '👑', color: 'text-gold-400' },
};

function formatReadAloudText(
  text: string,
  blanks: Record<string, string>,
  players: Player[]
): React.ReactNode[] {
  const parts = text.split(/(\{\d+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{(\d+)\}$/);
    if (match) {
      const num = match[1];
      const value = blanks[num];
      if (!value)
        return (
          <span key={i} className="text-parchment-500">
            ___({num})___
          </span>
        );
      const player = players.find((p) => p.id === value);
      const display = player
        ? player.pirate_name || player.display_name
        : value;
      return (
        <span key={i} className="text-gold-400 font-semibold">
          {display}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ReadAloudOverlay({
  text,
  blanks,
  players,
  onClose,
}: {
  text: string;
  blanks: Record<string, string>;
  players: Player[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-navy-900/95 flex flex-col">
      <div className="flex items-center justify-end p-4">
        <button
          onClick={onClose}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl bg-navy-700 text-parchment-300 text-xl"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <p className="text-xl leading-relaxed text-parchment-200 font-body whitespace-pre-line">
          {formatReadAloudText(text, blanks, players)}
        </p>
      </div>
    </div>
  );
}

function getApplicableTier(completed: number): 'bad' | 'good' | 'legendary' {
  if (completed >= 5) return 'legendary';
  if (completed === 4) return 'good';
  return 'bad';
}

export function EndingsTab({
  character,
  sheet,
  players,
  gameStatus,
}: EndingsTabProps) {
  const [readAloudText, setReadAloudText] = useState<string | null>(null);

  const completed = sheet.constellation_events_completed;
  const activeTier = getApplicableTier(completed);
  const tiers = ['bad', 'good', 'legendary'] as const;
  const isFinished = gameStatus === 'finished';

  return (
    <>
      {readAloudText && (
        <ReadAloudOverlay
          text={readAloudText}
          blanks={sheet.story_blanks}
          players={players}
          onClose={() => setReadAloudText(null)}
        />
      )}

      <div className="space-y-5">
        {isFinished && (
          <div className="text-center py-6">
            <h2 className="font-pirata text-gold-400 text-2xl mb-3">
              Your journey has ended
            </h2>
            <div className="flex items-center justify-center gap-1 text-2xl mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'transition-opacity',
                    i < completed ? 'opacity-100' : 'opacity-30'
                  )}
                >
                  {i < completed ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-parchment-400 font-body text-sm">
              {completed} of 5 constellation events completed
            </p>
          </div>
        )}

        {tiers.map((tier) => {
          const ending = character.endings[tier];
          const meta = TIER_META[tier];
          const isActive = tier === activeTier;

          if (!isActive) {
            return (
              <Card key={tier} className="opacity-40">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{meta.icon}</span>
                  <div>
                    <p className={cn('font-pirata text-base', meta.color)}>
                      {meta.label}
                    </p>
                    <p className="text-parchment-500 font-body text-xs">
                      Threshold: {ending.threshold} events
                    </p>
                  </div>
                </div>
              </Card>
            );
          }

          return (
            <Card key={tier} variant="highlighted">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{meta.icon}</span>
                <div className="flex-1">
                  <p className={cn('font-pirata text-lg', meta.color)}>
                    {meta.label}
                  </p>
                  <p className="text-parchment-500 font-body text-xs">
                    Threshold: {ending.threshold} events
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReadAloudText(ending.text)}
                >
                  📖 Read Aloud
                </Button>
              </div>

              <p className="text-parchment-300 text-sm font-body leading-relaxed whitespace-pre-line">
                {formatReadAloudText(
                  ending.text,
                  sheet.story_blanks,
                  players
                )}
              </p>
            </Card>
          );
        })}
      </div>
    </>
  );
}
