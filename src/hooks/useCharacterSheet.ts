'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import type { CharacterSheet } from '@/types/game';
import type { SkillName } from '@/types/character';

const SKILL_DEBOUNCE_MS = 500;
const STORY_DEBOUNCE_MS = 800;

export function useCharacterSheet(gameId: string | null, playerId: string | null) {
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pendingUpdates = useRef<Record<string, unknown>>({});
  const flushTimer = useRef<NodeJS.Timeout>();

  const flush = useCallback(async () => {
    if (Object.keys(pendingUpdates.current).length === 0) return;

    const updates = { ...pendingUpdates.current };
    pendingUpdates.current = {};

    const session = getSession();
    if (!session.playerId || !session.gameId) return;

    const { error: updateError } = await supabase
      .from('character_sheets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('player_id', session.playerId)
      .eq('game_id', session.gameId);

    if (updateError) {
      setError(updateError.message);
    }
  }, []);

  const debouncedWrite = useCallback(
    (field: string, value: unknown, debounceMs: number) => {
      pendingUpdates.current[field] = value;
      clearTimeout(flushTimer.current);
      flushTimer.current = setTimeout(flush, debounceMs);
    },
    [flush]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    const handleBeforeUnload = () => flush();

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      flush();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flush]);

  useEffect(() => {
    if (!gameId || !playerId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSheet() {
      const { data, error: fetchError } = await supabase
        .from('character_sheets')
        .select('*')
        .eq('player_id', playerId)
        .eq('game_id', gameId)
        .single();

      if (cancelled) return;

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError(fetchError.message);
      }

      setSheet(data as CharacterSheet | null);
      setLoading(false);
    }

    fetchSheet();

    return () => {
      cancelled = true;
    };
  }, [gameId, playerId]);

  const createSheet = useCallback(async () => {
    if (!gameId || !playerId) return null;

    const { data, error: insertError } = await supabase
      .from('character_sheets')
      .insert({
        player_id: playerId,
        game_id: gameId,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    const newSheet = data as CharacterSheet;
    setSheet(newSheet);
    return newSheet;
  }, [gameId, playerId]);

  const updateSkill = useCallback(
    (skill: SkillName, value: number) => {
      setSheet((prev) => (prev ? { ...prev, [skill]: value } : null));
      debouncedWrite(skill, value, SKILL_DEBOUNCE_MS);
    },
    [debouncedWrite]
  );

  const updateConstellation = useCallback(
    (filled: number[]) => {
      setSheet((prev) => (prev ? { ...prev, constellation_filled: filled } : null));
      debouncedWrite('constellation_filled', filled, SKILL_DEBOUNCE_MS);
    },
    [debouncedWrite]
  );

  const updateEventsCompleted = useCallback(
    (count: number) => {
      setSheet((prev) => (prev ? { ...prev, constellation_events_completed: count } : null));

      const session = getSession();
      if (!session.playerId || !session.gameId) return;

      supabase
        .from('character_sheets')
        .update({
          constellation_events_completed: count,
          updated_at: new Date().toISOString(),
        })
        .eq('player_id', session.playerId)
        .eq('game_id', session.gameId)
        .then(({ error: updateError }) => {
          if (updateError) setError(updateError.message);
        });
    },
    []
  );

  const updateStoryBlanks = useCallback(
    (blanks: Record<string, string>) => {
      setSheet((prev) => (prev ? { ...prev, story_blanks: blanks } : null));
      debouncedWrite('story_blanks', blanks, STORY_DEBOUNCE_MS);
    },
    [debouncedWrite]
  );

  const batchUpdate = useCallback(
    async (updates: Partial<CharacterSheet>) => {
      setSheet((prev) => (prev ? { ...prev, ...updates } : null));

      clearTimeout(flushTimer.current);
      const combined = { ...pendingUpdates.current, ...updates };
      pendingUpdates.current = {};

      const session = getSession();
      if (!session.playerId || !session.gameId) return;

      const { error: updateError } = await supabase
        .from('character_sheets')
        .update({ ...combined, updated_at: new Date().toISOString() })
        .eq('player_id', session.playerId)
        .eq('game_id', session.gameId);

      if (updateError) {
        setError(updateError.message);
      }
    },
    []
  );

  return {
    sheet,
    loading,
    error,
    createSheet,
    updateSkill,
    updateConstellation,
    updateEventsCompleted,
    updateStoryBlanks,
    batchUpdate,
  };
}
