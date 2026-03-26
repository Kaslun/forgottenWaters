'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  player_id: string;
}

export function usePresence(gameId: string | null, playerId: string | null) {
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const updatePresenceState = useCallback((channel: RealtimeChannel) => {
    const state = channel.presenceState<PresenceState>();
    const playerIds = Object.values(state)
      .flat()
      .map((p) => p.player_id)
      .filter(Boolean);

    setOnlinePlayers([...new Set(playerIds)]);
  }, []);

  useEffect(() => {
    if (!gameId || !playerId) return;

    const channel = supabase.channel(`game-${gameId}-presence`);
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        updatePresenceState(channel);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ player_id: playerId });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [gameId, playerId, updatePresenceState]);

  const isOnline = useCallback(
    (pid: string) => onlinePlayers.includes(pid),
    [onlinePlayers]
  );

  return { onlinePlayers, isOnline };
}
