'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setSession } from '@/lib/session';
import { useToast } from '@/components/ui/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateJoinCode } from '@/data/joinCodes';
import { validateDisplayName, validateShipName } from '@/lib/validation';
import type { SelectionMode } from '@/types/game';

export default function HostPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [shipName, setShipName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [characterMode, setCharacterMode] = useState<SelectionMode>('choice');
  const [roleMode, setRoleMode] = useState<SelectionMode>('choice');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const shipErr = validateShipName(shipName);
    if (shipErr) { showToast(shipErr, 'error'); return; }

    const nameErr = validateDisplayName(displayName);
    if (nameErr) { showToast(nameErr, 'error'); return; }

    setSubmitting(true);

    try {
      let joinCode = '';
      let codeUnique = false;

      for (let attempt = 0; attempt < 10; attempt++) {
        joinCode = generateJoinCode(shipName);
        const { data: existing } = await supabase
          .from('games')
          .select('id')
          .eq('join_code', joinCode)
          .neq('status', 'finished')
          .maybeSingle();

        if (!existing) { codeUnique = true; break; }
      }

      if (!codeUnique) {
        showToast('Could not generate a unique join code. Try a different ship name.', 'error');
        setSubmitting(false);
        return;
      }

      const { data: game, error: gameErr } = await supabase
        .from('games')
        .insert({
          join_code: joinCode,
          ship_name: shipName.trim(),
          status: 'lobby',
          character_mode: characterMode,
          role_mode: roleMode,
        })
        .select()
        .single();

      if (gameErr || !game) {
        showToast('Failed to create game. Please try again.', 'error');
        setSubmitting(false);
        return;
      }

      const sessionToken = crypto.randomUUID();

      const { data: player, error: playerErr } = await supabase
        .from('players')
        .insert({
          game_id: game.id,
          display_name: displayName.trim(),
          is_host: true,
          session_token: sessionToken,
          player_order: 1,
          connected: true,
        })
        .select()
        .single();

      if (playerErr || !player) {
        showToast('Failed to create player. Please try again.', 'error');
        setSubmitting(false);
        return;
      }

      await supabase
        .from('games')
        .update({ host_player_id: player.id })
        .eq('id', game.id);

      setSession(sessionToken, game.id, player.id);
      router.push(`/lobby/${game.id}`);
    } catch {
      showToast('An unexpected error occurred.', 'error');
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-navy-900 px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-parchment-400 text-sm font-body hover:text-parchment-200 transition-colors"
        >
          ← Back
        </button>

        <h1 className="font-pirata text-3xl text-gold-400 text-center">
          Host New Game
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Card>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-body text-sm text-parchment-300">Ship Name</label>
                <input
                  type="text"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  placeholder="The Black Pearl"
                  maxLength={40}
                  className="w-full rounded-lg bg-navy-700 border border-gold-700/20 px-3 py-2.5 font-body text-parchment-100 placeholder:text-parchment-500 focus:outline-none focus:border-gold-600/60 min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-body text-sm text-parchment-300">Your Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Captain Hook"
                  maxLength={30}
                  className="w-full rounded-lg bg-navy-700 border border-gold-700/20 px-3 py-2.5 font-body text-parchment-100 placeholder:text-parchment-500 focus:outline-none focus:border-gold-600/60 min-h-[48px]"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <ModeToggle
                label="Character Selection"
                value={characterMode}
                onChange={setCharacterMode}
              />
              <ModeToggle
                label="Role Assignment"
                value={roleMode}
                onChange={setRoleMode}
              />
            </div>
          </Card>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-lg"
            disabled={submitting}
          >
            {submitting ? 'Creating Voyage…' : 'Set Sail ⚓'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ModeToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SelectionMode;
  onChange: (v: SelectionMode) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-body text-sm text-parchment-300">{label}</label>
      <div className="flex rounded-lg overflow-hidden border border-gold-700/20">
        <button
          type="button"
          onClick={() => onChange('choice')}
          className={`flex-1 py-2.5 text-sm font-body transition-colors min-h-[48px] ${
            value === 'choice'
              ? 'bg-gold-600 text-navy-900 font-semibold'
              : 'bg-navy-700 text-parchment-400'
          }`}
        >
          Player Choice
        </button>
        <button
          type="button"
          onClick={() => onChange('random')}
          className={`flex-1 py-2.5 text-sm font-body transition-colors min-h-[48px] ${
            value === 'random'
              ? 'bg-gold-600 text-navy-900 font-semibold'
              : 'bg-navy-700 text-parchment-400'
          }`}
        >
          Random
        </button>
      </div>
    </div>
  );
}
