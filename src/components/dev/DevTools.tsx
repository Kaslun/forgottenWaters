'use client';

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { generatePirateName } from '@/data/nameGenerator';
import { CHARACTER_SUMMARIES } from '@/data/characters/summaries';
import { ALL_ROLE_IDS } from '@/data/roles';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import type { Player } from '@/types/game';

const FILLER_NAMES = [
  'Testbeard', 'Debugger Dan', 'Captain Placeholder',
  'Salty Tester', 'Mockdata Mary', 'Pixel Pete',
];

const TAP_THRESHOLD = 5;
const TAP_WINDOW_MS = 2000;

interface DevToolsProps {
  gameId: string;
  currentPlayerCount: number;
  players?: Player[];
  gameStatus?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function DevTools({ gameId, currentPlayerCount, players, gameStatus }: DevToolsProps) {
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [readying, setReadying] = useState(false);
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

  const readyUpBots = useCallback(async () => {
    if (!players || players.length === 0) return;

    setReadying(true);
    try {
      const botsNeedingSetup = players.filter(
        (p) => !p.is_host && (!p.character_type || p.ship_roles.length === 0)
      );

      if (botsNeedingSetup.length === 0) {
        showToast('All bots are already ready', 'info');
        setReadying(false);
        return;
      }

      const takenCharacters = new Set(
        players.filter((p) => p.character_type).map((p) => p.character_type!)
      );
      const availableCharacters = shuffle(
        CHARACTER_SUMMARIES.filter((c) => !takenCharacters.has(c.id)).map((c) => c.id)
      );

      const takenRoles = new Set(players.flatMap((p) => p.ship_roles));
      const unassignedRoles = shuffle(ALL_ROLE_IDS.filter((r) => !takenRoles.has(r)));

      let charIdx = 0;
      let roleIdx = 0;

      for (const bot of botsNeedingSetup) {
        const updates: Record<string, unknown> = {};

        if (!bot.character_type && charIdx < availableCharacters.length) {
          updates.character_type = availableCharacters[charIdx++];
        }

        if (!bot.pirate_name) {
          updates.pirate_name = generatePirateName();
        }

        if (bot.ship_roles.length === 0 && roleIdx < unassignedRoles.length) {
          updates.ship_roles = [unassignedRoles[roleIdx++]];
        }

        if (Object.keys(updates).length > 0) {
          await supabase.from('players').update(updates).eq('id', bot.id);
        }

        const characterId = (updates.character_type as string) || bot.character_type;
        if (characterId) {
          const { data: existingSheet } = await supabase
            .from('character_sheets')
            .select('id')
            .eq('player_id', bot.id)
            .maybeSingle();

          if (!existingSheet) {
            await supabase.from('character_sheets').insert({
              player_id: bot.id,
              game_id: gameId,
              story_blanks: { '1': 'test', '2': 'test', '3': 'test' },
            });
          }
        }
      }

      // Distribute any remaining unassigned roles round-robin across all players
      const allPlayersAfter = players.map((p) => ({
        ...p,
        ship_roles: [...p.ship_roles],
      }));
      // Apply the roles we just assigned above
      for (const bot of botsNeedingSetup) {
        const ap = allPlayersAfter.find((p) => p.id === bot.id);
        if (ap && ap.ship_roles.length === 0) {
          // Already assigned one role above; reflect it
          const assigned = unassignedRoles.find((_, idx) => {
            const b = botsNeedingSetup.indexOf(bot);
            return idx === b;
          });
          if (assigned) ap.ship_roles = [assigned];
        }
      }

      const stillUnassigned = ALL_ROLE_IDS.filter(
        (r) => !allPlayersAfter.some((p) => p.ship_roles.includes(r))
      );

      if (stillUnassigned.length > 0) {
        const nonHostPlayers = allPlayersAfter.filter((p) => !p.is_host);
        let rIdx = 0;
        for (const role of stillUnassigned) {
          const target = nonHostPlayers[rIdx % nonHostPlayers.length];
          target.ship_roles.push(role);
          rIdx++;
        }

        for (const p of nonHostPlayers) {
          const original = players.find((op) => op.id === p.id);
          if (original && p.ship_roles.length !== original.ship_roles.length) {
            await supabase
              .from('players')
              .update({ ship_roles: p.ship_roles })
              .eq('id', p.id);
          }
        }
      }

      showToast(`${botsNeedingSetup.length} bot(s) readied up`, 'success');
    } catch (err) {
      showToast('Failed to ready bots', 'error');
      console.error(err);
    } finally {
      setReadying(false);
    }
  }, [players, gameId, showToast]);

  const isSetupPhase = gameStatus === 'setup';
  const hasBotsToReady = players?.some(
    (p) => !p.is_host && (!p.character_type || p.ship_roles.length === 0)
  );

  return (
    <>
      {!unlocked && (
        <button
          onClick={handleSecretTap}
          className="fixed bottom-0 right-0 w-16 h-16 z-50 opacity-0"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {unlocked && (
        <div className="fixed bottom-4 right-4 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-12 h-12 rounded-full bg-surface-lowest ghost-border shadow-ambient flex items-center justify-center text-parchment-500 active:text-parchment-300 text-lg"
              aria-label="Open dev tools"
            >
              🛠
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-surface-lowest/95 backdrop-blur-lg ghost-border shadow-ambient w-64 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-parchment-500">
                  Dev Tools ({currentPlayerCount}/7)
                </p>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-parchment-500 active:text-parchment-300 min-w-[32px] min-h-[32px] flex items-center justify-center text-sm"
                  aria-label="Close dev tools"
                >
                  ✕
                </button>
              </div>

              {!isSetupPhase && (
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
              )}

              {isSetupPhase && hasBotsToReady && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={readyUpBots}
                  disabled={readying}
                  className="w-full text-xs"
                >
                  {readying ? 'Setting up bots...' : 'Ready Up All Bots'}
                </Button>
              )}

              {isSetupPhase && !hasBotsToReady && (
                <p className="text-xs font-mono text-teal-400 text-center">
                  All bots are ready
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
