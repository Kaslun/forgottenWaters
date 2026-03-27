'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getSession, setSession } from '@/lib/session';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingScreen } from '@/components/ui/SkeletonLoader';
import { ErrorState, ERROR_MESSAGES } from '@/components/ui/ErrorState';
import { IdentityPicker } from '@/components/lobby/IdentityPicker';
import { validateDisplayName, validateJoinCode } from '@/lib/validation';
import type { Game, Player } from '@/types/game';

function redirectForStatus(status: string, gameId: string, router: ReturnType<typeof useRouter>) {
  switch (status) {
    case 'lobby':
      router.push(`/lobby/${gameId}`);
      break;
    case 'setup':
      router.push(`/setup/${gameId}`);
      break;
    case 'active':
    case 'paused':
      router.push(`/game/${gameId}`);
      break;
  }
}

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES] | null>(null);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState<Player[] | null>(null);
  const [pendingGame, setPendingGame] = useState<Game | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) setJoinCode(code.toUpperCase());
  }, [searchParams]);

  const handleClaimIdentity = useCallback(async (player: Player) => {
    if (!pendingGame) return;
    setSubmitting(true);

    try {
      const newToken = crypto.randomUUID();
      const { error: updateErr } = await supabase
        .from('players')
        .update({ connected: true, session_token: newToken })
        .eq('id', player.id);

      if (updateErr) {
        showToast('Failed to reclaim identity', 'error');
        setSubmitting(false);
        return;
      }

      setSession(newToken, pendingGame.id, player.id);
      redirectForStatus(pendingGame.status, pendingGame.id, router);
    } catch {
      showToast('An unexpected error occurred', 'error');
      setSubmitting(false);
    }
  }, [pendingGame, router, showToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDisconnectedPlayers(null);

    const codeErr = validateJoinCode(joinCode);
    if (codeErr) {
      showToast(codeErr, 'warning');
      return;
    }

    setSubmitting(true);

    try {
      // Look up game by join_code
      const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('join_code', joinCode.toUpperCase().trim())
        .neq('status', 'finished')
        .maybeSingle();

      if (!game) {
        // Could be finished or non-existent — check for finished
        const { data: finishedGame } = await supabase
          .from('games')
          .select('id')
          .eq('join_code', joinCode.toUpperCase().trim())
          .eq('status', 'finished')
          .maybeSingle();

        setError(finishedGame ? ERROR_MESSAGES.GAME_FINISHED : ERROR_MESSAGES.GAME_NOT_FOUND);
        setSubmitting(false);
        return;
      }

      const typedGame = game as Game;
      setPendingGame(typedGame);

      // Check if current user is already in this game
      const session = getSession();
      if (session.sessionToken) {
        const { data: existingPlayer } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', typedGame.id)
          .eq('session_token', session.sessionToken)
          .maybeSingle();

        if (existingPlayer) {
          await supabase
            .from('players')
            .update({ connected: true })
            .eq('id', existingPlayer.id);

          setSession(session.sessionToken, typedGame.id, existingPlayer.id);
          redirectForStatus(typedGame.status, typedGame.id, router);
          return;
        }
      }

      // Game is past lobby and no existing session — show identity picker for disconnected players
      if (typedGame.status !== 'lobby') {
        const { data: disconnected } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', typedGame.id)
          .eq('connected', false);

        if (disconnected && disconnected.length > 0) {
          setDisconnectedPlayers(disconnected as Player[]);
          setSubmitting(false);
          return;
        }

        setError(ERROR_MESSAGES.GAME_STARTED);
        setSubmitting(false);
        return;
      }

      // Game in lobby — check capacity
      const { count } = await supabase
        .from('players')
        .select('id', { count: 'exact', head: true })
        .eq('game_id', typedGame.id);

      if (count !== null && count >= 7) {
        setError(ERROR_MESSAGES.GAME_FULL);
        setSubmitting(false);
        return;
      }

      // Validate display name for fresh join
      const nameErr = validateDisplayName(displayName);
      if (nameErr) {
        showToast(nameErr, 'warning');
        setSubmitting(false);
        return;
      }

      // Fresh join
      const sessionToken = crypto.randomUUID();
      const playerOrder = (count ?? 0) + 1;

      const { data: newPlayer, error: playerErr } = await supabase
        .from('players')
        .insert({
          game_id: typedGame.id,
          display_name: displayName.trim(),
          is_host: false,
          session_token: sessionToken,
          player_order: playerOrder,
          connected: true,
        })
        .select()
        .single();

      if (playerErr || !newPlayer) {
        showToast(playerErr?.message ?? 'Failed to join game', 'error');
        setSubmitting(false);
        return;
      }

      setSession(sessionToken, typedGame.id, newPlayer.id);
      redirectForStatus(typedGame.status, typedGame.id, router);
    } catch {
      showToast('An unexpected error occurred', 'error');
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="h-[100dvh] bg-navy-900 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <ErrorState
          {...error}
          action={{ label: 'Try Again', onClick: () => setError(null) }}
        />
      </div>
    );
  }

  if (disconnectedPlayers) {
    return (
      <div className="h-[100dvh] bg-navy-900 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <IdentityPicker
            disconnectedPlayers={disconnectedPlayers}
            onClaim={handleClaimIdentity}
            onClose={() => {
              setDisconnectedPlayers(null);
              setPendingGame(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] flex-col bg-navy-900">
      <div className="absolute top-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gold-500/[0.03] blur-[100px] pointer-events-none" />
      <div className="relative flex-1 overflow-y-auto px-6 py-10">
      <div className="w-full max-w-md mx-auto space-y-8">
        <header className="rounded-2xl px-4 py-5 text-center backdrop-blur-md bg-surface-low/80">
          <h1 className="font-pirata text-3xl text-gold-400">Join a Crew</h1>
          <p className="mt-1 font-body text-sm text-parchment-400">
            Enter the code from yer captain
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Join Code */}
          <div className="space-y-1.5">
            <label htmlFor="joinCode" className="block font-body text-sm text-parchment-400">
              Join Code
            </label>
            <input
              id="joinCode"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="SHIP42"
              autoCapitalize="characters"
              maxLength={10}
              className="ghost-border w-full min-h-[48px] rounded-2xl bg-surface-lowest px-4 py-4 text-center font-mono text-2xl tracking-widest text-parchment-100 placeholder:text-lg placeholder:text-parchment-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="displayName" className="block font-body text-sm text-parchment-400">
              Your Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Barnacle Bill"
              className="ghost-border w-full min-h-[48px] rounded-2xl bg-surface-lowest px-4 py-3 font-body text-base text-parchment-100 placeholder:text-parchment-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-lg"
            disabled={submitting}
          >
            {submitting ? 'Boarding…' : 'Join Game'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => router.back()}
          className="mx-auto block font-body text-sm text-teal-400 transition-colors hover:text-teal-300 active:text-teal-500"
        >
          ← Back
        </button>
      </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <JoinContent />
    </Suspense>
  );
}
