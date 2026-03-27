'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface JoinCodeDisplayProps {
  joinCode: string;
  shipName: string;
}

export function JoinCodeDisplay({ joinCode, shipName }: JoinCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/join?code=${joinCode}`
      : '';

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [joinCode]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [shareUrl]);

  return (
    <Card variant="glass" className="text-center space-y-4">
      <p className="font-pirata text-parchment-400 text-sm tracking-wide">
        Aboard the&nbsp;
        <span className="text-gold-400">{shipName}</span>
      </p>

      <button
        onClick={copyCode}
        className={cn(
          'block w-full py-4 rounded-2xl glass ghost-border',
          'font-mono text-3xl tracking-[0.35em] text-parchment-100 font-semibold',
          'active:opacity-90 transition-opacity min-h-[48px]',
          'focus-visible:shadow-glow-gold'
        )}
        aria-label="Copy join code"
      >
        {joinCode}
      </button>

      <p className="font-body text-xs text-parchment-400">
        {copied ? '✓ Copied to clipboard' : 'Tap the code to copy'}
      </p>

      <Button
        variant="primary"
        size="md"
        className="w-full min-h-[48px]"
        onClick={handleShare}
      >
        Copy Invite Link
      </Button>
    </Card>
  );
}
