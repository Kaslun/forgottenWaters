'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { usePlayers } from '@/hooks/usePlayers';
import { usePresence } from '@/hooks/usePresence';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingScreen } from '@/components/ui/SkeletonLoader';
import { ErrorState, ERROR_MESSAGES } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { JoinCodeDisplay } from '@/components/lobby/JoinCodeDisplay';
import { PlayerList } from '@/components/lobby/PlayerList';
import { GameSettings } from '@/components/lobby/GameSettings';
import { ResumePrompt } from '@/components/lobby/ResumePrompt';
import type { SelectionMode } from '@/types/game';

const MIN_PLAYERS = 3;

export default function LobbyPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = React.use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const { game, loading: gameLoading, error: gameError, updateGameStatus, updateGameSettings } = useGame(gameId);
  const { players, currentPlayer, loading: playersLoading, error: playersError, removePlayer } = usePlayers(gameId);
  usePresence(gameId, currentPlayer?.id ?? null);

  const [showResume, setShowResume] = useState(false);
  const [starting, setStarting] = useState(false);

  const loading = gameLoading || playersLoading;
  const isHost = currentPlayer?.is_host ?? false;

  // Redirect if no session / not a player in this game
  useEffect(() => {
    if (loading) return;
    if (!currentPlayer) {
      router.replace('/join');
    }
  }, [loading, currentPlayer, router]);

  // Redirect based on game status
  useEffect(() => {
    if (!game || loading) return;

    switch (game.status) {
      case 'setup':
        router.replace(`/setup/${gameId}`);
        break;
      case 'active':
      case 'paused':
        router.replace(`/game/${gameId}`);
        break;
      case 'finished':
        router.replace('/');
        break;
    }
  }, [game, loading, gameId, router]);

  // Show resume prompt for host reconnecting to a paused game
  useEffect(() => {
    if (!game || !isHost) return;
    if (game.status === 'paused') {
      setShowResume(true);
    }
  }, [game, isHost]);

  const handleRemovePlayer = useCallback(
    async (playerId: string) => {
      try {
        await removePlayer(playerId);
        showToast('Player removed', 'success');
      } catch {
        showToast('Failed to remove player', 'error');
      }
    },
    [removePlayer, showToast]
  );

  const handleStartGame = useCallback(async () => {
    setStarting(true);
    try {
      await updateGameStatus('setup');
    } catch {
      showToast('Failed to start game', 'error');
      setStarting(false);
    }
  }, [updateGameStatus, showToast]);

  const handleResumeGame = useCallback(async () => {
    await updateGameStatus('active');
    setShowResume(false);
  }, [updateGameStatus]);

  const handleChangeCharacterMode = useCallback(
    (mode: SelectionMode) => updateGameSettings({ character_mode: mode }),
    [updateGameSettings]
  );

  const handleChangeRoleMode = useCallback(
    (mode: SelectionMode) => updateGameSettings({ role_mode: mode }),
    [updateGameSettings]
  );

  if (loading) {
    return <LoadingScreen message="Finding your ship..." />;
  }

  if (gameError || playersError) {
    return (
      <ErrorState
        {...ERROR_MESSAGES.GENERIC}
        action={{ label: 'Go Home', onClick: () => router.replace('/') }}
      />
    );
  }

  if (!game || !currentPlayer) {
    return null;
  }

  const connectedPlayers = players.filter((p) => p.connected);
  const canStart = connectedPlayers.length >= MIN_PLAYERS;

  return (
    <div className="min-h-[100dvh] bg-navy-900 flex flex-col">
      <header className="px-4 pt-[env(safe-area-inset-top,16px)] pb-3 bg-navy-800 border-b border-gold-700/20">
        <h1 className="font-pirata text-2xl text-gold-400 text-center">
          Gathering the Crew
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
        {showResume && game.status === 'paused' && (
          <ResumePrompt
            game={game}
            onResume={handleResumeGame}
            onClose={() => setShowResume(false)}
          />
        )}

        <JoinCodeDisplay joinCode={game.join_code} shipName={game.ship_name} />

        <PlayerList
          players={players}
          currentPlayerId={currentPlayer.id}
          isHost={isHost}
          gameStatus={game.status}
          onRemovePlayer={isHost ? handleRemovePlayer : undefined}
        />

        {isHost && (
          <GameSettings
            characterMode={game.character_mode}
            roleMode={game.role_mode}
            onChangeCharacterMode={handleChangeCharacterMode}
            onChangeRoleMode={handleChangeRoleMode}
          />
        )}

        {isHost && (
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!canStart || starting}
              onClick={handleStartGame}
            >
              {starting ? 'Setting Sail...' : 'Start Game'}
            </Button>
            {!canStart && (
              <p className="font-body text-sm text-parchment-500 text-center">
                Need at least {MIN_PLAYERS} pirates ({connectedPlayers.length}/{MIN_PLAYERS})
              </p>
            )}
          </div>
        )}

        {!isHost && (
          <div className="text-center py-4">
            <p className="font-body text-sm text-parchment-400">
              Waiting for the Captain to start the game&hellip;
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
