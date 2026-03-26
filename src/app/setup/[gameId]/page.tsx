'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { useGame } from '@/hooks/useGame';
import { usePlayers } from '@/hooks/usePlayers';
import { useCharacterSheet } from '@/hooks/useCharacterSheet';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingScreen } from '@/components/ui/SkeletonLoader';
import { ErrorState, ERROR_MESSAGES } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PirateNameGenerator } from '@/components/setup/PirateNameGenerator';
import { CharacterPicker } from '@/components/setup/CharacterPicker';
import { RolePicker } from '@/components/setup/RolePicker';
import { StoryBlanksSetup } from '@/components/setup/StoryBlanksSetup';
import { getCharacterDefinition } from '@/data/characters';
import { ALL_ROLE_IDS, SHIP_ROLES } from '@/data/roles';
import type { CharacterDefinition, SkillGrid } from '@/types/character';

type SetupStep = 'pirate_name' | 'character' | 'roles' | 'story_blanks' | 'waiting';
const STEP_ORDER: SetupStep[] = ['pirate_name', 'character', 'roles', 'story_blanks', 'waiting'];

const STEP_LABELS: Record<SetupStep, string> = {
  pirate_name: 'Name',
  character: 'Character',
  roles: 'Roles',
  story_blanks: 'Story',
  waiting: 'Ready',
};

export default function SetupPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = React.use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const session = getSession();
  const { game, loading: gameLoading, error: gameError, updateGameStatus } = useGame(gameId);
  const { players, currentPlayer, loading: playersLoading, updatePlayer } = usePlayers(gameId);
  const {
    sheet,
    loading: sheetLoading,
    createSheet,
    updateStoryBlanks,
  } = useCharacterSheet(gameId, currentPlayer?.id ?? null);

  const [step, setStep] = useState<SetupStep>('pirate_name');
  const [charDef, setCharDef] = useState<CharacterDefinition | null>(null);
  const [characterSkillGrids, setCharacterSkillGrids] = useState<Record<string, SkillGrid>>({});
  const [storyValues, setStoryValues] = useState<Record<string, string>>({});
  const [beginningAdventure, setBeginningAdventure] = useState(false);

  const loading = gameLoading || playersLoading;
  const isHost = currentPlayer?.is_host ?? false;

  // Redirect: no session
  useEffect(() => {
    if (!session.playerId) {
      router.replace('/');
    }
  }, [session.playerId, router]);

  // Redirect based on game status
  useEffect(() => {
    if (!game || loading) return;

    switch (game.status) {
      case 'lobby':
        router.replace(`/lobby/${gameId}`);
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

  // Redirect if not a player
  useEffect(() => {
    if (loading) return;
    if (!currentPlayer) {
      router.replace('/join');
    }
  }, [loading, currentPlayer, router]);

  // Restore step from existing player data
  useEffect(() => {
    if (!currentPlayer) return;

    if (currentPlayer.pirate_name && currentPlayer.character_type && currentPlayer.ship_roles.length > 0 && sheet?.story_blanks && Object.keys(sheet.story_blanks).length > 0) {
      setStep('waiting');
    } else if (currentPlayer.pirate_name && currentPlayer.character_type && currentPlayer.ship_roles.length > 0) {
      setStep('story_blanks');
    } else if (currentPlayer.pirate_name && currentPlayer.character_type) {
      setStep('roles');
    } else if (currentPlayer.pirate_name) {
      setStep('character');
    }
  }, [currentPlayer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load character definition when character_type is set
  useEffect(() => {
    if (!currentPlayer?.character_type) return;

    let cancelled = false;
    getCharacterDefinition(currentPlayer.character_type).then((def) => {
      if (!cancelled) {
        setCharDef(def);
        setCharacterSkillGrids((prev) => ({ ...prev, [def.id]: def.skillGrid }));
      }
    });
    return () => { cancelled = true; };
  }, [currentPlayer?.character_type]);

  // Sync story blanks from sheet on load
  useEffect(() => {
    if (sheet?.story_blanks && Object.keys(sheet.story_blanks).length > 0) {
      setStoryValues(sheet.story_blanks);
    }
  }, [sheet?.story_blanks]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Handlers ---

  const handleAcceptName = useCallback(
    async (name: string) => {
      if (!currentPlayer) return;
      await updatePlayer(currentPlayer.id, { pirate_name: name });
      setStep('character');
    },
    [currentPlayer, updatePlayer]
  );

  const handleSelectCharacter = useCallback(
    async (characterId: string) => {
      if (!currentPlayer) return;
      await updatePlayer(currentPlayer.id, { character_type: characterId });

      if (!sheet) {
        await createSheet();
      }

      setStep('roles');
    },
    [currentPlayer, updatePlayer, sheet, createSheet]
  );

  const handleClaimRole = useCallback(
    async (roleId: string) => {
      if (!currentPlayer) return;

      const alreadyOwned = currentPlayer.ship_roles.includes(roleId);
      const assignedByOther = players.some(
        (p) => p.id !== currentPlayer.id && p.ship_roles.includes(roleId)
      );

      if (assignedByOther) {
        showToast('That role is already taken', 'warning');
        return;
      }

      const newRoles = alreadyOwned
        ? currentPlayer.ship_roles.filter((r) => r !== roleId)
        : [...currentPlayer.ship_roles, roleId];

      await updatePlayer(currentPlayer.id, { ship_roles: newRoles });
    },
    [currentPlayer, players, updatePlayer, showToast]
  );

  const handleAutoDistribute = useCallback(async () => {
    const assignedRoles = new Set(players.flatMap((p) => p.ship_roles));
    const unassigned = ALL_ROLE_IDS.filter((r) => !assignedRoles.has(r));

    if (unassigned.length === 0) return;

    const sortedPlayers = [...players].sort(
      (a, b) => a.ship_roles.length - b.ship_roles.length
    );

    const updates = new Map<string, string[]>();
    for (const p of sortedPlayers) {
      updates.set(p.id, [...p.ship_roles]);
    }

    let idx = 0;
    for (const roleId of unassigned) {
      const player = sortedPlayers[idx % sortedPlayers.length];
      updates.get(player.id)!.push(roleId);
      idx++;
    }

    for (const [playerId, roles] of updates) {
      const original = players.find((p) => p.id === playerId);
      if (original && roles.length !== original.ship_roles.length) {
        await updatePlayer(playerId, { ship_roles: roles });
      }
    }
  }, [players, updatePlayer]);

  const handleContinueFromRoles = useCallback(() => {
    if (charDef && charDef.storyBlanks.length > 0) {
      setStep('story_blanks');
    } else {
      setStep('waiting');
    }
  }, [charDef]);

  const handleStoryBlankChange = useCallback(
    (number: string, value: string) => {
      setStoryValues((prev) => {
        const next = { ...prev, [number]: value };
        updateStoryBlanks(next);
        return next;
      });
    },
    [updateStoryBlanks]
  );

  const handleContinueFromStory = useCallback(() => {
    setStep('waiting');
  }, []);

  const handleBeginAdventure = useCallback(async () => {
    setBeginningAdventure(true);
    try {
      await updateGameStatus('active');
    } catch {
      showToast('Failed to begin adventure', 'error');
      setBeginningAdventure(false);
    }
  }, [updateGameStatus, showToast]);

  // --- Derived state ---

  const allRolesAssigned = useMemo(() => {
    const assigned = new Set(players.flatMap((p) => p.ship_roles));
    return ALL_ROLE_IDS.every((r) => assigned.has(r));
  }, [players]);

  const allPlayersReady = useMemo(() => {
    return players.every(
      (p) => p.pirate_name && p.character_type && p.ship_roles.length > 0
    );
  }, [players]);

  const canBeginAdventure = allPlayersReady && allRolesAssigned;

  const stepIndex = STEP_ORDER.indexOf(step);

  // --- Render ---

  if (loading || sheetLoading) {
    return <LoadingScreen message="Preparing the voyage..." />;
  }

  if (gameError) {
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

  return (
    <div className="min-h-[100dvh] bg-navy-900 flex flex-col">
      <header className="px-4 pt-[env(safe-area-inset-top,16px)] pb-3 bg-navy-800 border-b border-gold-700/20">
        <h1 className="font-pirata text-xl text-gold-400 text-center mb-3">
          Prepare for Voyage
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-1 max-w-xs mx-auto">
          {STEP_ORDER.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full transition-colors ${
                  i <= stepIndex
                    ? 'bg-gold-500'
                    : 'bg-navy-600'
                }`}
              />
              <span
                className={`font-body text-[10px] ${
                  i <= stepIndex
                    ? 'text-gold-400'
                    : 'text-parchment-600'
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full">
        {/* Step 1: Pirate Name */}
        {step === 'pirate_name' && (
          <div className="space-y-4">
            <p className="font-body text-parchment-300 text-center text-sm">
              Every pirate needs a proper name. Generate one or write yer own.
            </p>
            <PirateNameGenerator
              currentName={currentPlayer.pirate_name}
              onAccept={handleAcceptName}
            />
          </div>
        )}

        {/* Step 2: Character Selection */}
        {step === 'character' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="font-pirata text-lg text-gold-400">
                Choose Yer Story
              </h2>
              <p className="font-body text-parchment-400 text-sm mt-1">
                Each character has a unique backstory, skills, and endings.
              </p>
            </div>
            <CharacterPicker
              players={players}
              currentPlayerId={currentPlayer.id}
              onSelect={handleSelectCharacter}
              characterSkillGrids={characterSkillGrids}
            />
          </div>
        )}

        {/* Step 3: Role Selection */}
        {step === 'roles' && game && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="font-pirata text-lg text-gold-400">
                Claim Yer Duties
              </h2>
              <p className="font-body text-parchment-400 text-sm mt-1">
                The ship needs all {SHIP_ROLES.length} roles filled.
                {players.length < 7 && ' Some pirates will take on multiple duties.'}
              </p>
            </div>
            <RolePicker
              players={players}
              currentPlayer={currentPlayer}
              roleMode={game.role_mode}
              isHost={isHost}
              onClaimRole={handleClaimRole}
              onAutoDistribute={handleAutoDistribute}
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleContinueFromRoles}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 4: Story Blanks */}
        {step === 'story_blanks' && charDef && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="font-pirata text-lg text-gold-400">
                Write Yer Tale
              </h2>
              <p className="font-body text-parchment-400 text-sm mt-1">
                Fill in the blanks to shape your pirate&apos;s story.
              </p>
            </div>
            <StoryBlanksSetup
              storyBlanks={charDef.storyBlanks}
              values={storyValues}
              players={players}
              currentPlayerId={currentPlayer.id}
              onChange={handleStoryBlankChange}
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleContinueFromStory}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 5: Waiting / Begin */}
        {step === 'waiting' && (
          <div className="space-y-6">
            <Card variant="highlighted" className="text-center space-y-3">
              <span className="text-4xl block">⚓</span>
              <h2 className="font-pirata text-xl text-gold-400">
                Ready to Sail
              </h2>
              <p className="font-body text-parchment-300 text-sm">
                {currentPlayer.pirate_name} — {charDef?.title ?? currentPlayer.character_type}
              </p>
              {currentPlayer.ship_roles.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentPlayer.ship_roles.map((roleId) => {
                    const role = SHIP_ROLES.find((r) => r.id === roleId);
                    return role ? (
                      <span
                        key={roleId}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-700 border border-gold-700/30 font-body text-xs text-parchment-300"
                      >
                        {role.icon} {role.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </Card>

            {/* Crew readiness */}
            <Card variant="default" className="space-y-3">
              <h3 className="font-pirata text-sm text-gold-500">Crew Readiness</h3>
              <ul className="space-y-1.5">
                {players.map((p) => {
                  const ready = !!(p.pirate_name && p.character_type && p.ship_roles.length > 0);
                  return (
                    <li key={p.id} className="flex items-center gap-2 font-body text-sm">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${ready ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="text-parchment-300 truncate">
                        {p.pirate_name || p.display_name}
                      </span>
                      <span className="text-parchment-500 text-xs ml-auto">
                        {ready ? 'Ready' : 'Preparing...'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>

            {isHost && (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!canBeginAdventure || beginningAdventure}
                  onClick={handleBeginAdventure}
                >
                  {beginningAdventure ? 'Raising Anchor...' : 'Begin Adventure'}
                </Button>
                {!canBeginAdventure && (
                  <p className="font-body text-sm text-parchment-500 text-center">
                    {!allRolesAssigned
                      ? 'All 7 ship roles must be assigned before departing.'
                      : 'Waiting for all crew members to finish setup.'}
                  </p>
                )}
              </div>
            )}

            {!isHost && (
              <p className="font-body text-sm text-parchment-400 text-center py-2">
                Waiting for the Captain to begin the adventure&hellip;
              </p>
            )}

            {/* Allow navigating back to edit */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setStep('pirate_name')}
              >
                Edit Name
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setStep('character')}
              >
                Change Character
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setStep('roles')}
              >
                Edit Roles
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
