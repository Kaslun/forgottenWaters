'use client';

import { useState } from 'react';
import { CHARACTER_SUMMARIES } from '@/data/characters/summaries';
import { CharacterCard } from '@/components/setup/CharacterCard';
import { Button } from '@/components/ui/Button';
import type { Player } from '@/types/game';
import type { SkillGrid } from '@/types/character';

interface CharacterPickerProps {
  players: Player[];
  currentPlayerId: string;
  onSelect: (characterId: string) => void;
  characterSkillGrids: Record<string, SkillGrid>;
}

export function CharacterPicker({
  players,
  currentPlayerId,
  onSelect,
  characterSkillGrids,
}: CharacterPickerProps) {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);

  const selectedByMap = new Map<string, Player>();
  for (const player of players) {
    if (player.character_type) {
      selectedByMap.set(player.character_type, player);
    }
  }

  const handleCardTap = (charId: string) => {
    setPendingChoice(prev => (prev === charId ? null : charId));
  };

  const handleConfirm = () => {
    if (pendingChoice) {
      onSelect(pendingChoice);
      setPendingChoice(null);
    }
  };

  const pendingSummary = pendingChoice
    ? CHARACTER_SUMMARIES.find(c => c.id === pendingChoice)
    : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-2">
        {CHARACTER_SUMMARIES.map(char => {
          const claimedBy = selectedByMap.get(char.id);
          const isSelected = currentPlayer?.character_type === char.id;
          const takenByOther = !!claimedBy && claimedBy.id !== currentPlayerId;
          const isPending = pendingChoice === char.id;

          return (
            <CharacterCard
              key={char.id}
              id={char.id}
              title={char.title}
              shortDescription={char.shortDescription}
              isSelected={isSelected || isPending}
              selectedBy={takenByOther ? (claimedBy.pirate_name || claimedBy.display_name) : null}
              isDisabled={takenByOther}
              onSelect={() => handleCardTap(char.id)}
              skillGrid={characterSkillGrids[char.id]}
            />
          );
        })}
      </div>

      {pendingChoice && pendingSummary && (
        <div className="sticky bottom-0 pt-2 pb-2 bg-navy-900/90 backdrop-blur-sm">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleConfirm}
          >
            Confirm: {pendingSummary.title}
          </Button>
        </div>
      )}
    </div>
  );
}
