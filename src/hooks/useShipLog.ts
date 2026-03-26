'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import type { ShipLogEntry } from '@/types/game';

export function useShipLog(gameId: string | null) {
  const [entries, setEntries] = useState<ShipLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchEntries() {
      const { data, error: fetchError } = await supabase
        .from('ship_log_entries')
        .select('*')
        .eq('game_id', gameId)
        .order('entry_order', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setEntries((data as ShipLogEntry[]) || []);
      setLoading(false);
    }

    fetchEntries();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const addEntry = useCallback(
    async (content: string, entryType: ShipLogEntry['entry_type'] = 'log') => {
      if (!gameId) return;
      const session = getSession();
      if (!session.playerId) return;

      const nextOrder = entries.length > 0
        ? Math.max(...entries.map((e) => e.entry_order)) + 1
        : 1;

      const optimistic: ShipLogEntry = {
        id: crypto.randomUUID(),
        game_id: gameId,
        author_player_id: session.playerId,
        content,
        entry_type: entryType,
        entry_order: nextOrder,
        created_at: new Date().toISOString(),
      };

      setEntries((prev) => [...prev, optimistic]);

      const { data, error: insertError } = await supabase
        .from('ship_log_entries')
        .insert({
          game_id: gameId,
          author_player_id: session.playerId,
          content,
          entry_type: entryType,
          entry_order: nextOrder,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setEntries((prev) => prev.filter((e) => e.id !== optimistic.id));
        return;
      }

      setEntries((prev) =>
        prev.map((e) => (e.id === optimistic.id ? (data as ShipLogEntry) : e))
      );
    },
    [gameId, entries]
  );

  const updateEntry = useCallback(
    async (entryId: string, content: string) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, content } : e))
      );

      const { error: updateError } = await supabase
        .from('ship_log_entries')
        .update({ content })
        .eq('id', entryId);

      if (updateError) {
        setError(updateError.message);
      }
    },
    []
  );

  return { entries, loading, error, addEntry, updateEntry };
}
