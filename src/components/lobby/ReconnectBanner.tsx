'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ReconnectBannerProps {
  shipName: string;
  joinCode: string;
  pirateName: string | null;
  characterTitle: string | null;
  gameStatus: string;
  onReconnect: () => void;
  onDismiss: () => void;
}

const STATUS_DISPLAY: Record<string, string> = {
  lobby: 'In Port',
  setup: 'Preparing',
  active: 'At Sea',
  paused: 'Anchored',
  finished: 'Voyage Complete',
};

export function ReconnectBanner({
  shipName,
  joinCode,
  pirateName,
  characterTitle,
  gameStatus,
  onReconnect,
  onDismiss,
}: ReconnectBannerProps) {
  const statusLabel = STATUS_DISPLAY[gameStatus] ?? gameStatus;
  const identity = [pirateName, characterTitle].filter(Boolean).join(' — ');

  return (
    <Card variant="glass" className="space-y-3 shadow-ambient">
      <div className="space-y-1">
        <h3 className="font-pirata text-lg text-gold-400">
          Ye Have Unfinished Business
        </h3>
        <p className="font-body text-sm text-parchment-300">
          The <span className="text-parchment-100 font-semibold">{shipName}</span>
          {' '}is{' '}
          <span className="text-teal-400 font-medium">{statusLabel.toLowerCase()}</span>
          {' '}
          &bull;{' '}
          <span className="font-mono text-teal-400 tracking-wide">
            Code: {joinCode}
          </span>
        </p>
        {identity && (
          <p className="font-body text-xs text-parchment-400">
            Sailing as {identity}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="md"
          className="flex-1 min-h-[48px] text-teal-400 hover:text-teal-300"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1 min-h-[48px]"
          onClick={onReconnect}
        >
          Rejoin Crew
        </Button>
      </div>
    </Card>
  );
}
