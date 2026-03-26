'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession, clearSession } from '@/lib/session';
import type { Game, Player } from '@/types/game';

export interface ReconnectInfo {
  gameId: string;
  shipName: string;
  joinCode: string;
  characterTitle: string | null;
  pirateName: string | null;
  gameStatus: string;
}

export function useAutoReconnect() {
  const [reconnectInfo, setReconnectInfo] = useState<ReconnectInfo | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const session = getSession();

      if (!session.sessionToken || !session.gameId || !session.playerId) {
        setChecking(false);
        return;
      }

      const { data: player } = await supabase
        .from('players')
        .select('*, games(*)')
        .eq('session_token', session.sessionToken)
        .single();

      if (!player) {
        clearSession();
        setChecking(false);
        return;
      }

      const typedPlayer = player as Player & { games: Game };
      const game = typedPlayer.games;

      if (!game || game.status === 'finished') {
        clearSession();
        setChecking(false);
        return;
      }

      setReconnectInfo({
        gameId: game.id,
        shipName: game.ship_name,
        joinCode: game.join_code,
        characterTitle: typedPlayer.character_type,
        pirateName: typedPlayer.pirate_name,
        gameStatus: game.status,
      });
      setChecking(false);
    }

    checkSession();
  }, []);

  const dismiss = () => {
    clearSession();
    setReconnectInfo(null);
  };

  return { reconnectInfo, checking, dismiss };
}
