'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { useGame } from '@/hooks/useGame';
import { usePlayers } from '@/hooks/usePlayers';
import { useCharacterSheet } from '@/hooks/useCharacterSheet';
import { useShipLog } from '@/hooks/useShipLog';
import { usePresence } from '@/hooks/usePresence';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useOrientation } from '@/hooks/useOrientation';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingScreen } from '@/components/ui/SkeletonLoader';
import { SheetLayout } from '@/components/sheet/SheetLayout';
import { SkillGridComponent } from '@/components/sheet/SkillGrid';
import { ConstellationMap } from '@/components/sheet/ConstellationMap';
import { SkillChoiceModal } from '@/components/sheet/SkillChoiceModal';
import { StoryTab } from '@/components/sheet/StoryTab';
import { EndingsTab } from '@/components/sheet/EndingsTab';
import { LogTab } from '@/components/sheet/LogTab';
import { RoleTab } from '@/components/sheet/RoleTab';
import { Button } from '@/components/ui/Button';
import { RotatePrompt } from '@/components/ui/RotatePrompt';
import { getCharacterDefinition } from '@/data/characters';
import { getEligibleStarIds } from '@/lib/constellation';
import { tapFeedback, successFeedback, starFeedback } from '@/lib/haptics';
import { validateSkillUpdate, validateConstellationFill } from '@/lib/validation';
import { CONSTELLATION_DATA } from '@/data/constellations';
import type { CharacterDefinition, SkillName } from '@/types/character';

const ONBOARDING_KEY = 'fw_seen_sheet_tip';

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = React.use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const connectionStatus = useConnectionStatus();
  const isLandscape = useOrientation();

  const session = getSession();
  const { game, loading: gameLoading, updateGameStatus } = useGame(gameId);
  const { players, currentPlayer, loading: playersLoading } = usePlayers(gameId);
  const {
    sheet,
    loading: sheetLoading,
    updateSkill,
    updateConstellation,
    updateEventsCompleted,
    updateStoryBlanks,
    batchUpdate,
  } = useCharacterSheet(gameId, session.playerId);
  const { entries, addEntry, updateEntry } = useShipLog(gameId);

  usePresence(gameId, session.playerId);
  useWakeLock();

  const [character, setCharacter] = useState<CharacterDefinition | null>(null);
  const [activeTab, setActiveTab] = useState('sheet');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [pendingStarSkill, setPendingStarSkill] = useState<{
    skill: SkillName;
    newLevel: number;
  } | null>(null);
  const [showHostMenu, setShowHostMenu] = useState(false);
  const [showSheetTip, setShowSheetTip] = useState(false);

  // Load character definition
  useEffect(() => {
    if (!currentPlayer?.character_type) return;
    let cancelled = false;
    getCharacterDefinition(currentPlayer.character_type).then((def) => {
      if (!cancelled) setCharacter(def);
    });
    return () => {
      cancelled = true;
    };
  }, [currentPlayer?.character_type]);

  // Guards: redirect if no session or wrong game status
  useEffect(() => {
    if (gameLoading || playersLoading) return;

    if (!session.playerId || !currentPlayer) {
      router.replace('/');
      return;
    }
    if (game?.status === 'lobby') {
      router.replace(`/lobby/${gameId}`);
      return;
    }
    if (game?.status === 'setup') {
      router.replace(`/setup/${gameId}`);
      return;
    }
  }, [game?.status, gameLoading, playersLoading, session.playerId, currentPlayer, gameId, router]);

  // Onboarding tip
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen && activeTab === 'sheet' && sheet && character) {
      setShowSheetTip(true);
    }
  }, [activeTab, sheet, character]);

  const dismissSheetTip = useCallback(() => {
    setShowSheetTip(false);
    localStorage.setItem(ONBOARDING_KEY, '1');
  }, []);

  const constellation = useMemo(() => {
    if (!currentPlayer?.character_type) return null;
    return CONSTELLATION_DATA[currentPlayer.character_type] ?? null;
  }, [currentPlayer?.character_type]);

  const filledStars = sheet?.constellation_filled ?? [];

  const eligibleStarIds = useMemo(() => {
    if (!constellation) return [];
    return getEligibleStarIds(constellation, filledStars);
  }, [constellation, filledStars]);

  // --- Skill up handler ---
  const handleSkillUp = useCallback(
    (skill: SkillName) => {
      if (!sheet || !character) return;
      const currentLevel = sheet[skill];
      const grid = character.skillGrid[skill];

      if (!validateSkillUpdate(currentLevel, grid)) {
        showToast('Cannot increase this skill further', 'warning');
        return;
      }

      const boxType = grid[currentLevel];
      if (boxType === 'star') {
        showToast('Fill in a constellation star!', 'info');
        setPendingStarSkill({ skill, newLevel: currentLevel + 1 });
        tapFeedback();
        return;
      }

      updateSkill(skill, currentLevel + 1);
      tapFeedback();
    },
    [sheet, character, updateSkill, showToast],
  );

  // --- Skill down (undo) handler ---
  const handleSkillDown = useCallback(
    (skill: SkillName) => {
      if (!sheet || !character) return;
      const currentLevel = sheet[skill];
      if (currentLevel <= 0) return;

      const prevBoxIndex = currentLevel - 1;
      const boxType = character.skillGrid[skill][prevBoxIndex];

      updateSkill(skill, currentLevel - 1);
      if (boxType === 'star') {
        showToast('Star box undone — you may also undo the constellation star', 'info');
      }
      tapFeedback();
    },
    [sheet, character, updateSkill, showToast],
  );

  // --- Constellation fill handler ---
  const handleStarFill = useCallback(
    (starId: number) => {
      if (!sheet || !constellation) return;

      if (!validateConstellationFill(starId, eligibleStarIds)) {
        showToast('This star is not reachable yet', 'warning');
        return;
      }

      const star = constellation.stars.find((s) => s.id === starId);
      if (star?.hasEvent) {
        showToast('Take a constellation event token from the supply!', 'success');
      }

      const newFilled = [...filledStars, starId];

      if (pendingStarSkill) {
        batchUpdate({
          [pendingStarSkill.skill]: pendingStarSkill.newLevel,
          constellation_filled: newFilled,
        });
        setPendingStarSkill(null);
      } else {
        updateConstellation(newFilled);
      }

      starFeedback();
    },
    [sheet, constellation, eligibleStarIds, filledStars, pendingStarSkill, batchUpdate, updateConstellation, showToast],
  );

  // --- Undo last star ---
  const handleUndoStar = useCallback(() => {
    if (!sheet || !constellation || filledStars.length === 0) return;

    const lastStarId = filledStars[filledStars.length - 1];
    const star = constellation.stars.find((s) => s.id === lastStarId);

    const newFilled = filledStars.slice(0, -1);
    updateConstellation(newFilled);

    if (star?.hasEvent) {
      showToast('Return the constellation event token to the supply', 'info');
    }
    tapFeedback();
  }, [sheet, constellation, filledStars, updateConstellation, showToast]);

  // --- Skill choice modal handler ---
  const handleSkillChoice = useCallback(
    (skill: SkillName) => {
      setShowSkillModal(false);
      handleSkillUp(skill);
    },
    [handleSkillUp],
  );

  // --- Story blanks handler ---
  const handleBlankChange = useCallback(
    (number: string, value: string) => {
      if (!sheet) return;
      const updated = { ...sheet.story_blanks, [number]: value };
      updateStoryBlanks(updated);
    },
    [sheet, updateStoryBlanks],
  );

  // --- Resolve constellation event ---
  const handleResolveEvent = useCallback(() => {
    if (!sheet) return;
    updateEventsCompleted(sheet.constellation_events_completed + 1);
    successFeedback();
    showToast('Event resolved!', 'success');
  }, [sheet, updateEventsCompleted, showToast]);

  // --- Host controls ---
  const handlePause = useCallback(() => {
    updateGameStatus('paused');
    showToast('Game paused', 'info');
    setShowHostMenu(false);
  }, [updateGameStatus, showToast]);

  const handleResume = useCallback(() => {
    updateGameStatus('active');
    showToast('Game resumed', 'info');
    setShowHostMenu(false);
  }, [updateGameStatus, showToast]);

  const handleEndAdventure = useCallback(() => {
    if (!window.confirm('End the adventure for all players? This cannot be undone.')) return;
    updateGameStatus('finished');
    showToast('Adventure ended!', 'info');
    setShowHostMenu(false);
  }, [updateGameStatus, showToast]);

  const handleBackToSetup = useCallback(() => {
    updateGameStatus('setup');
    setShowHostMenu(false);
  }, [updateGameStatus]);

  // --- Tab config ---
  const isScribe = currentPlayer?.ship_roles?.includes('ship_scribe') || false;
  const isHost = currentPlayer?.is_host || false;

  const tabs = useMemo(
    () => [
      { id: 'sheet', icon: '⭐', label: 'Sheet' },
      { id: 'story', icon: '📖', label: 'Story' },
      { id: 'endings', icon: '🏴‍☠️', label: 'Endings' },
      ...(isScribe ? [{ id: 'log', icon: '📜', label: 'Log' }] : []),
      { id: 'role', icon: '🎭', label: 'Role' },
    ],
    [isScribe],
  );

  // --- Loading & guard rendering ---
  if (gameLoading || playersLoading || sheetLoading) {
    return <LoadingScreen message="Charting your course..." />;
  }

  if (!game || !currentPlayer || !sheet || !character || !constellation) {
    return <LoadingScreen message="Loading character sheet..." />;
  }

  const pirateName = currentPlayer.pirate_name || currentPlayer.display_name;
  const characterTitle = character.title;

  return (
    <>
    <RotatePrompt />
    <SheetLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      pirateName={pirateName}
      characterTitle={characterTitle}
      connectionStatus={connectionStatus}
    >
      {/* Paused banner */}
      {game.status === 'paused' && (
        <div className="mb-4 rounded-xl border border-amber-600/40 bg-amber-600/10 px-4 py-3 text-center">
          <p className="text-amber-300 font-body text-sm font-semibold">
            Game Paused
          </p>
        </div>
      )}

      {/* Host controls */}
      {isHost && (
        <div className="mb-4 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHostMenu((v) => !v)}
          >
            ⚙️ Host Controls
          </Button>

          {showHostMenu && (
            <div className="absolute left-0 top-full mt-1 z-30 w-56 rounded-xl border border-gold-700/30 bg-navy-800 shadow-xl overflow-hidden">
              {game.status === 'active' && (
                <button
                  onClick={handlePause}
                  className="w-full text-left px-4 min-h-[48px] flex items-center gap-2 text-parchment-200 font-body text-sm hover:bg-navy-700 active:bg-navy-700 transition-colors"
                >
                  ⏸️ Pause Game
                </button>
              )}
              {game.status === 'paused' && (
                <button
                  onClick={handleResume}
                  className="w-full text-left px-4 min-h-[48px] flex items-center gap-2 text-parchment-200 font-body text-sm hover:bg-navy-700 active:bg-navy-700 transition-colors"
                >
                  ▶️ Resume Game
                </button>
              )}
              <button
                onClick={handleBackToSetup}
                className="w-full text-left px-4 min-h-[48px] flex items-center gap-2 text-parchment-200 font-body text-sm hover:bg-navy-700 active:bg-navy-700 transition-colors"
              >
                👥 Add/Change Players
              </button>
              <button
                onClick={handleEndAdventure}
                className="w-full text-left px-4 min-h-[48px] flex items-center gap-2 text-red-400 font-body text-sm hover:bg-navy-700 active:bg-navy-700 transition-colors"
              >
                🏁 End Adventure
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'sheet' && (
        <div className="relative">
          {/* Onboarding tip */}
          {showSheetTip && (
            <div className="mb-4 rounded-xl border border-gold-600/40 bg-gold-600/10 px-4 py-3 relative">
              <button
                onClick={dismissSheetTip}
                className="absolute top-2 right-2 text-parchment-500 hover:text-parchment-300 min-w-[32px] min-h-[32px] flex items-center justify-center"
                aria-label="Dismiss tip"
              >
                ✕
              </button>
              <p className="text-gold-400 font-body text-sm font-semibold mb-1">
                How it works
              </p>
              <p className="text-parchment-300 font-body text-xs leading-relaxed pr-6">
                Tap a skill row to fill the next box. When you hit a ★ box,
                you&apos;ll also fill a star on your constellation. Stars with a
                &quot;!&quot; trigger story events — grab a token from the supply!
              </p>
            </div>
          )}

          {isLandscape ? (
            <div className="flex gap-4">
              <div className="w-[60%] flex-shrink-0">
                <SkillGridComponent
                  skillGrid={character.skillGrid}
                  sheet={sheet}
                  onSkillUp={handleSkillUp}
                  onSkillDown={handleSkillDown}
                />
              </div>
              <div className="w-[40%] flex flex-col gap-2">
                <ConstellationMap
                  constellation={constellation}
                  filledStars={filledStars}
                  onStarFill={handleStarFill}
                  highlightEligible={!!pendingStarSkill}
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-parchment-400 font-body text-xs">
                    {filledStars.length} star{filledStars.length !== 1 ? 's' : ''} filled
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndoStar}
                    disabled={filledStars.length === 0}
                  >
                    ↩ Undo Star
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <SkillGridComponent
                skillGrid={character.skillGrid}
                sheet={sheet}
                onSkillUp={handleSkillUp}
                onSkillDown={handleSkillDown}
              />
              <div className="space-y-2">
                <ConstellationMap
                  constellation={constellation}
                  filledStars={filledStars}
                  onStarFill={handleStarFill}
                  highlightEligible={!!pendingStarSkill}
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-parchment-400 font-body text-xs">
                    {filledStars.length} star{filledStars.length !== 1 ? 's' : ''} filled
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndoStar}
                    disabled={filledStars.length === 0}
                  >
                    ↩ Undo Star
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Floating action button for skill choice */}
          <button
            onClick={() => setShowSkillModal(true)}
            className={`fixed z-20 w-14 h-14 rounded-full bg-gold-600 text-navy-900 text-2xl font-bold shadow-lg shadow-gold-600/30 flex items-center justify-center active:scale-95 transition-transform ${
              isLandscape
                ? 'bottom-6 right-6'
                : 'bottom-20 right-4'
            }`}
            aria-label="Gain a skill"
          >
            +
          </button>

          {showSkillModal && (
            <SkillChoiceModal
              skillGrid={character.skillGrid}
              sheet={sheet}
              onChoose={handleSkillChoice}
              onClose={() => setShowSkillModal(false)}
            />
          )}
        </div>
      )}

      {activeTab === 'story' && (
        <StoryTab
          character={character}
          sheet={sheet}
          players={players}
          currentPlayerId={currentPlayer.id}
          onBlankChange={handleBlankChange}
          onResolveEvent={handleResolveEvent}
        />
      )}

      {activeTab === 'endings' && (
        <EndingsTab
          character={character}
          sheet={sheet}
          players={players}
          gameStatus={game.status}
        />
      )}

      {activeTab === 'log' && isScribe && (
        <LogTab
          entries={entries}
          onAddEntry={addEntry}
          onUpdateEntry={updateEntry}
        />
      )}

      {activeTab === 'role' && (
        <RoleTab
          roles={currentPlayer.ship_roles}
          allPlayers={players}
        />
      )}
    </SheetLayout>
    </>
  );
}
