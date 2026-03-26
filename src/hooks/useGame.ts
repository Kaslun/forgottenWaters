'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import type { Game, GameStatus } from '@/types/game';

export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchGame() {
      const { data, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setGame(data as Game);
      setLoading(false);
    }

    fetchGame();

    const channel = supabase
      .channel(`game-${gameId}-game`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setGame(payload.new as Game);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const updateGameStatus = useCallback(
    async (status: GameStatus) => {
      if (!gameId) return;
      const session = getSession();
      if (!session.playerId) return;

      setGame((prev) => (prev ? { ...prev, status } : null));

      const { error: updateError } = await supabase
        .from('games')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', gameId);

      if (updateError) {
        setError(updateError.message);
      }
    },
    [gameId]
  );

  const updateGameSettings = useCallback(
    async (updates: Partial<Pick<Game, 'character_mode' | 'role_mode' | 'scenario_name'>>) => {
      if (!gameId) return;

      setGame((prev) => (prev ? { ...prev, ...updates } : null));

      const { error: updateError } = await supabase
        .from('games')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', gameId);

      if (updateError) {
        setError(updateError.message);
      }
    },
    [gameId]
  );

  return { game, loading, error, updateGameStatus, updateGameSettings };
}
