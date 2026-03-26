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
    const shareData = {
      title: `Join the ${shipName}!`,
      text: `Board the ${shipName} in Forgotten Waters! Use code: ${joinCode}`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [joinCode, shipName, shareUrl]);

  return (
    <Card variant="highlighted" className="text-center space-y-3">
      <p className="font-pirata text-gold-500 text-sm">
        Aboard the&nbsp;
        <span className="text-gold-400">{shipName}</span>
      </p>

      <button
        onClick={copyCode}
        className={cn(
          'block w-full py-3 rounded-lg bg-navy-900 border border-gold-700/30',
          'font-mono text-3xl tracking-[0.3em] text-parchment-100',
          'active:bg-navy-700 transition-colors min-h-[48px]'
        )}
        aria-label="Copy join code"
      >
        {joinCode}
      </button>

      <p className="font-body text-xs text-parchment-400">
        {copied ? 'Copied to clipboard!' : 'Tap the code to copy'}
      </p>

      <Button
        variant="secondary"
        size="md"
        className="w-full min-h-[48px]"
        onClick={handleShare}
      >
        Share Invite Link
      </Button>
    </Card>
  );
}
