'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import { useAutoReconnect } from '@/hooks/useAutoReconnect';
import { ReconnectBanner } from '@/components/lobby/ReconnectBanner';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/SkeletonLoader';

export default function LandingPage() {
  const router = useRouter();
  const { reconnectInfo, checking, dismiss } = useAutoReconnect();

  useEffect(() => {
    async function autoRedirect() {
      const session = getSession();
      if (!session.sessionToken || !session.gameId) return;

      const { data: game } = await supabase
        .from('games')
        .select('id, status')
        .eq('id', session.gameId)
        .single();

      if (game && game.status !== 'finished') {
        router.replace(`/game/${game.id}`);
      }
    }

    autoRedirect();
  }, [router]);

  if (checking) {
    return <LoadingScreen message="Checking for active voyages…" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-navy-900 px-6 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold-500/[0.03] blur-[100px] pointer-events-none" />

      <div className="flex flex-col items-center gap-10 w-full max-w-sm relative z-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-xs text-teal-400/60 tracking-[0.4em] uppercase">
            Companion App
          </p>
          <h1 className="font-pirata text-4xl sm:text-5xl text-gold-400 leading-tight">
            Forgotten Waters
          </h1>
          <div className="w-16 h-px bg-gold-gradient mx-auto opacity-40" />
        </div>

        {reconnectInfo && (
          <ReconnectBanner
            shipName={reconnectInfo.shipName}
            joinCode={reconnectInfo.joinCode}
            pirateName={reconnectInfo.pirateName}
            characterTitle={reconnectInfo.characterTitle}
            gameStatus={reconnectInfo.gameStatus}
            onReconnect={() => router.push(`/game/${reconnectInfo.gameId}`)}
            onDismiss={dismiss}
          />
        )}

        <div className="flex flex-col gap-4 w-full">
          <Button
            variant="primary"
            size="lg"
            className="w-full text-lg py-4"
            onClick={() => router.push('/host')}
          >
            Host New Game
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full text-lg py-4"
            onClick={() => router.push('/join')}
          >
            Join / Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
