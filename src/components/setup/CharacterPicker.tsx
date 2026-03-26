'use client';

import { CHARACTER_SUMMARIES } from '@/data/characters/summaries';
import { CharacterCard } from '@/components/setup/CharacterCard';
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
  const selectedByMap = new Map<string, Player>();

  for (const player of players) {
    if (player.character_type) {
      selectedByMap.set(player.character_type, player);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
      {CHARACTER_SUMMARIES.map(char => {
        const claimedBy = selectedByMap.get(char.id);
        const isSelected = currentPlayer?.character_type === char.id;
        const takenByOther = !!claimedBy && claimedBy.id !== currentPlayerId;

        return (
          <CharacterCard
            key={char.id}
            id={char.id}
            title={char.title}
            shortDescription={char.shortDescription}
            isSelected={isSelected}
            selectedBy={takenByOther ? (claimedBy.pirate_name || claimedBy.display_name) : null}
            isDisabled={takenByOther}
            onSelect={() => onSelect(char.id)}
            skillGrid={characterSkillGrids[char.id]}
          />
        );
      })}
    </div>
  );
}
