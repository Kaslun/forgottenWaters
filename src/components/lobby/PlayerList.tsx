'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Player, GameStatus } from '@/types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
  isHost: boolean;
  gameStatus: GameStatus;
  onRemovePlayer?: (id: string) => void;
}

const MAX_PLAYERS = 7;

export function PlayerList({
  players,
  currentPlayerId,
  isHost,
  gameStatus,
  onRemovePlayer,
}: PlayerListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-pirata text-lg text-gold-500">The Crew</h3>
        <span className="font-mono text-sm text-parchment-100 tabular-nums">
          {players.length}/{MAX_PLAYERS} Pirates
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {players.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const canRemove =
            isHost &&
            gameStatus === 'lobby' &&
            !isCurrentPlayer &&
            onRemovePlayer;

          return (
            <Card
              key={player.id}
              variant={isCurrentPlayer ? 'highlighted' : 'default'}
              className={cn(
                'flex items-center gap-3 py-3 ghost-border',
                !isCurrentPlayer &&
                  index % 2 === 1 &&
                  'bg-surface-low shadow-ambient'
              )}
            >
              <span
                className={cn(
                  'inline-block w-2.5 h-2.5 rounded-full shrink-0',
                  player.connected
                    ? 'bg-teal-400 shadow-glow-teal'
                    : 'bg-surface-highest'
                )}
                aria-label={player.connected ? 'Online' : 'Offline'}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body text-parchment-100 truncate">
                    {player.display_name}
                  </span>
                  {player.is_host && (
                    <Badge variant="warning" className="shrink-0">
                      Captain
                    </Badge>
                  )}
                  {isCurrentPlayer && (
                    <Badge variant="success" className="shrink-0">
                      You
                    </Badge>
                  )}
                </div>

                {(player.pirate_name || player.character_type) && (
                  <div className="flex items-center gap-2 mt-0.5">
                    {player.pirate_name && (
                      <span className="font-pirata text-sm text-gold-600">
                        {player.pirate_name}
                      </span>
                    )}
                    {player.character_type && (
                      <span className="font-body text-xs text-parchment-400">
                        &mdash; {player.character_type}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {canRemove && (
                <Button
                  variant="danger"
                  size="sm"
                  className="shrink-0 min-h-[48px] min-w-[48px]"
                  onClick={() => onRemovePlayer(player.id)}
                  aria-label={`Remove ${player.display_name}`}
                >
                  ✕
                </Button>
              )}
            </Card>
          );
        })}
      </ul>

      {players.length === 0 && (
        <p className="font-body text-sm text-parchment-500 text-center py-4">
          No souls aboard yet&hellip;
        </p>
      )}
    </div>
  );
}
