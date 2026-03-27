'use client';

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { generatePirateName } from '@/data/nameGenerator';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

const FILLER_NAMES = [
  'Testbeard', 'Debugger Dan', 'Captain Placeholder',
  'Salty Tester', 'Mockdata Mary', 'Pixel Pete',
];

const TAP_THRESHOLD = 5;
const TAP_WINDOW_MS = 2000;

interface DevToolsProps {
  gameId: string;
  currentPlayerCount: number;
}

export function DevTools({ gameId, currentPlayerCount }: DevToolsProps) {
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [unlocked, setUnlocked] = useState(process.env.NODE_ENV !== 'production');
  const [expanded, setExpanded] = useState(false);
  const tapsRef = useRef<number[]>([]);

  const handleSecretTap = useCallback(() => {
    const now = Date.now();
    tapsRef.current = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS);
    tapsRef.current.push(now);

    if (tapsRef.current.length >= TAP_THRESHOLD) {
      setUnlocked(true);
      setExpanded(true);
      tapsRef.current = [];
      showToast('Dev tools unlocked', 'info');
    }
  }, [showToast]);

  const addFillerPlayer = useCallback(async (count: number = 1) => {
    if (currentPlayerCount + count > 7) {
      showToast(`Can only add ${7 - currentPlayerCount} more players`, 'warning');
      return;
    }

    setAdding(true);
    try {
      for (let i = 0; i < count; i++) {
        const idx = currentPlayerCount + i;
        const displayName = FILLER_NAMES[idx % FILLER_NAMES.length] || `Tester ${idx + 1}`;
        const pirateName = generatePirateName();

        const { error } = await supabase
          .from('players')
          .insert({
            game_id: gameId,
            display_name: displayName,
            pirate_name: pirateName,
            session_token: crypto.randomUUID(),
            connected: true,
            player_order: idx + 1,
            is_host: false,
          });

        if (error) {
          showToast(`Failed to add player: ${error.message}`, 'error');
          break;
        }
      }
      showToast(`Added ${count} test pirate${count > 1 ? 's' : ''}`, 'success');
    } catch {
      showToast('Failed to add test players', 'error');
    } finally {
      setAdding(false);
    }
  }, [gameId, currentPlayerCount, showToast]);

  const fillToMinimum = useCallback(() => {
    const needed = Math.max(0, 3 - currentPlayerCount);
    if (needed === 0) {
      showToast('Already have 3+ players', 'info');
      return;
    }
    addFillerPlayer(needed);
  }, [currentPlayerCount, addFillerPlayer, showToast]);

  const fillToFull = useCallback(() => {
    const needed = Math.max(0, 7 - currentPlayerCount);
    if (needed === 0) {
      showToast('Crew is already full', 'info');
      return;
    }
    addFillerPlayer(needed);
  }, [currentPlayerCount, addFillerPlayer, showToast]);

  return (
    <>
      {/* Hidden tap target in the bottom-right corner for production unlock */}
      {!unlocked && (
        <button
          onClick={handleSecretTap}
          className="fixed bottom-0 right-0 w-16 h-16 z-50 opacity-0"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {unlocked && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-mono text-parchment-500/50 active:text-parchment-400 w-full text-center py-2"
          >
            {expanded ? '▾ Dev Tools' : '▸ Dev Tools'}
          </button>

          {expanded && (
            <div className="mt-2 p-3 rounded-xl bg-surface-lowest ghost-border space-y-2">
              <p className="text-xs font-mono text-parchment-500 mb-2">
                Fill with test accounts ({currentPlayerCount}/7)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addFillerPlayer(1)}
                  disabled={adding || currentPlayerCount >= 7}
                  className="flex-1 text-xs"
                >
                  +1
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fillToMinimum}
                  disabled={adding || currentPlayerCount >= 3}
                  className="flex-1 text-xs"
                >
                  Fill to 3
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fillToFull}
                  disabled={adding || currentPlayerCount >= 7}
                  className="flex-1 text-xs"
                >
                  Fill to 7
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
