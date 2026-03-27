'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Game } from '@/types/game';

interface ResumePromptProps {
  game: Game;
  onResume: () => void;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  lobby: 'In Port',
  setup: 'Preparing',
  active: 'At Sea',
  paused: 'Anchored',
  finished: 'Voyage Complete',
};

export function ResumePrompt({ game, onResume, onClose }: ResumePromptProps) {
  return (
    <Card variant="glass" className="space-y-4 text-center shadow-ambient">
      <h2 className="font-pirata text-xl text-gold-400">
        Unfinished Voyage
      </h2>

      <div className="space-y-2">
        <p className="font-pirata text-lg text-parchment-100">
          {game.ship_name}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="warning" className="font-mono">
            {STATUS_LABELS[game.status] ?? game.status}
          </Badge>
          <span className="font-mono text-xs text-parchment-400 tracking-wide">
            Code: {game.join_code}
          </span>
        </div>
      </div>

      <p className="font-body text-sm text-parchment-400">
        Yer crew awaits, Captain. Resume the voyage?
      </p>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="md"
          className="flex-1 min-h-[48px] text-teal-400 hover:text-teal-300"
          onClick={onClose}
        >
          Leave It
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1 min-h-[48px] bg-gold-gradient shadow-glow-gold"
          onClick={onResume}
        >
          Resume Game
        </Button>
      </div>
    </Card>
  );
}
