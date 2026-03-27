'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Player } from '@/types/game';

interface IdentityPickerProps {
  disconnectedPlayers: Player[];
  onClaim: (player: Player) => void;
  onClose: () => void;
}

export function IdentityPicker({
  disconnectedPlayers,
  onClaim,
  onClose,
}: IdentityPickerProps) {
  return (
    <div className="space-y-4 glass-heavy rounded-2xl p-4 shadow-ambient ghost-border">
      <div className="text-center space-y-1">
        <h2 className="font-pirata text-xl text-gold-400">
          Who Goes There?
        </h2>
        <p className="font-body text-sm text-parchment-400">
          Choose yer identity to rejoin the crew.
        </p>
      </div>

      <Card variant="warning" className="py-3 px-4">
        <p className="font-body text-xs text-amber-300 text-center">
          On yer honor, pirate &mdash; pick only yer own name.
          Imposters walk the plank!
        </p>
      </Card>

      <ul className="space-y-2">
        {disconnectedPlayers.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => onClaim(player)}
            className={cn(
              'w-full text-left rounded-2xl p-4',
              'bg-surface-high ghost-border',
              'text-parchment-100 hover:text-teal-400 hover:bg-teal-600/15 hover:shadow-glow-teal',
              'active:bg-teal-600/25 focus-visible:outline-none focus-visible:shadow-glow-teal',
              'transition-all min-h-[48px]'
            )}
          >
            <span className="font-body block">
              {player.display_name}
            </span>
            {(player.pirate_name || player.character_type) && (
              <span className="font-body text-xs text-parchment-400 block mt-0.5">
                {[player.pirate_name, player.character_type]
                  .filter(Boolean)
                  .join(' — ')}
              </span>
            )}
          </button>
        ))}
      </ul>

      {disconnectedPlayers.length === 0 && (
        <p className="font-body text-sm text-parchment-500 text-center py-4">
          No lost souls to reclaim.
        </p>
      )}

      <Button
        variant="ghost"
        size="md"
        className="w-full min-h-[48px] text-teal-400 hover:text-teal-300"
        onClick={onClose}
      >
        Cancel
      </Button>
    </div>
  );
}
