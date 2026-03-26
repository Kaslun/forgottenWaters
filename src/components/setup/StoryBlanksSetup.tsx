'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { StoryBlankPrompt } from '@/types/character';
import type { Player } from '@/types/game';

interface StoryBlanksSetupProps {
  storyBlanks: StoryBlankPrompt[];
  values: Record<string, string>;
  players: Player[];
  currentPlayerId: string;
  onChange: (number: string, value: string) => void;
}

export function StoryBlanksSetup({
  storyBlanks,
  values,
  players,
  currentPlayerId,
  onChange,
}: StoryBlanksSetupProps) {
  const [playerPickerFor, setPlayerPickerFor] = useState<string | null>(null);

  const otherPlayers = players.filter(p => p.id !== currentPlayerId);

  const selectedPlayerName = (blankNumber: string) => {
    const playerId = values[blankNumber];
    if (!playerId) return null;
    const player = players.find(p => p.id === playerId);
    return player ? (player.pirate_name || player.display_name) : null;
  };

  return (
    <div className="space-y-4">
      {storyBlanks.map(blank => {
        const key = String(blank.number);

        if (blank.type === 'text') {
          return (
            <label key={key} className="block">
              <span className="font-body text-parchment-300 text-sm mb-1 block">
                {blank.prompt}
              </span>
              <input
                type="text"
                value={values[key] || ''}
                onChange={e => onChange(key, e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                className={cn(
                  'w-full min-h-[48px] px-4 py-3 rounded-xl font-body text-base',
                  'bg-navy-700 text-parchment-200 border border-gold-700/30',
                  'placeholder:text-parchment-500/50',
                  'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500',
                )}
                placeholder="Type your answer…"
              />
            </label>
          );
        }

        if (blank.type === 'player_name') {
          const name = selectedPlayerName(key);
          return (
            <div key={key}>
              <span className="font-body text-parchment-300 text-sm mb-1 block">
                {blank.prompt}
              </span>
              <button
                type="button"
                onClick={() => setPlayerPickerFor(key)}
                className={cn(
                  'w-full min-h-[48px] px-4 py-3 rounded-xl font-body text-base text-left',
                  'bg-navy-700 border border-gold-700/30',
                  'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500',
                  name ? 'text-parchment-200' : 'text-parchment-500/50',
                )}
              >
                {name || 'Select a crewmate…'}
              </button>
            </div>
          );
        }

        return null;
      })}

      {playerPickerFor !== null && (
        <BottomSheet
          title="Choose a Crewmate"
          onClose={() => setPlayerPickerFor(null)}
        >
          <div className="space-y-2">
            {otherPlayers.map(player => (
              <button
                key={player.id}
                type="button"
                onClick={() => {
                  onChange(playerPickerFor, player.id);
                  setPlayerPickerFor(null);
                }}
                className={cn(
                  'w-full min-h-[48px] px-4 py-3 rounded-xl font-body text-base text-left',
                  'bg-navy-700 text-parchment-200 border border-gold-700/30',
                  'active:bg-navy-600 transition-colors',
                  values[playerPickerFor] === player.id && 'border-gold-500 bg-navy-600',
                )}
              >
                {player.pirate_name || player.display_name}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
