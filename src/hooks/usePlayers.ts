'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import type { Player } from '@/types/game';

export function usePlayers(gameId: string | null) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPlayers() {
      const { data, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId)
        .order('player_order', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setPlayers((data as Player[]) || []);
      setLoading(false);
    }

    fetchPlayers();

    const channel = supabase
      .channel(`game-${gameId}-players`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers((prev) => [...prev, payload.new as Player]);
          } else if (payload.eventType === 'UPDATE') {
            setPlayers((prev) =>
              prev.map((p) => (p.id === (payload.new as Player).id ? (payload.new as Player) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setPlayers((prev) => prev.filter((p) => p.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const currentPlayer = (() => {
    const session = getSession();
    if (!session.playerId) return null;
    return players.find((p) => p.id === session.playerId) || null;
  })();

  const updatePlayer = useCallback(
    async (playerId: string, updates: Partial<Pick<Player, 'display_name' | 'pirate_name' | 'character_type' | 'ship_roles' | 'connected'>>) => {
      const session = getSession();
      if (!session.playerId || !gameId) return;

      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, ...updates } : p))
      );

      const { error: updateError } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId)
        .eq('game_id', gameId);

      if (updateError) {
        setError(updateError.message);
      }
    },
    [gameId]
  );

  const removePlayer = useCallback(
    async (playerId: string) => {
      if (!gameId) return;

      setPlayers((prev) => prev.filter((p) => p.id !== playerId));

      const { error: deleteError } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
        .eq('game_id', gameId);

      if (deleteError) {
        setError(deleteError.message);
      }
    },
    [gameId]
  );

  return { players, currentPlayer, loading, error, updatePlayer, removePlayer };
}
