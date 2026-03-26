'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn, renderStoryText } from '@/lib/utils';
import type { Player, CharacterSheet } from '@/types/game';
import type { CharacterDefinition } from '@/types/character';

interface StoryTabProps {
  character: CharacterDefinition;
  sheet: CharacterSheet;
  players: Player[];
  currentPlayerId: string;
  onBlankChange: (number: string, value: string) => void;
  onResolveEvent: () => void;
}

function formatReadAloudText(
  text: string,
  blanks: Record<string, string>,
  players: Player[]
): React.ReactNode[] {
  const parts = text.split(/(\{\d+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{(\d+)\}$/);
    if (match) {
      const num = match[1];
      const value = blanks[num];
      if (!value)
        return (
          <span key={i} className="text-parchment-500">
            ___({num})___
          </span>
        );
      const player = players.find((p) => p.id === value);
      const display = player
        ? player.pirate_name || player.display_name
        : value;
      return (
        <span key={i} className="text-gold-400 font-semibold">
          {display}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ReadAloudView({
  text,
  effect,
  blanks,
  players,
  onClose,
}: {
  text: string;
  effect?: string;
  blanks: Record<string, string>;
  players: Player[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-navy-900/95 flex flex-col">
      <div className="flex items-center justify-end p-4">
        <button
          onClick={onClose}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl bg-navy-700 text-parchment-300 text-xl"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <p className="text-xl leading-relaxed text-parchment-200 font-body whitespace-pre-line">
          {formatReadAloudText(text, blanks, players)}
        </p>

        {effect && (
          <div className="mt-6 rounded-xl border border-gold-600/30 bg-navy-800 p-4">
            <p className="text-xs font-body text-parchment-500 uppercase tracking-wider mb-1">
              Game Effect
            </p>
            <p className="text-gold-400 font-body text-base">{effect}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function StoryTab({
  character,
  sheet,
  players,
  currentPlayerId,
  onBlankChange,
  onResolveEvent,
}: StoryTabProps) {
  const [readAloud, setReadAloud] = useState<{
    text: string;
    effect?: string;
  } | null>(null);
  const [playerPickerFor, setPlayerPickerFor] = useState<string | null>(null);

  const otherPlayers = players.filter((p) => p.id !== currentPlayerId);
  const completed = sheet.constellation_events_completed;

  return (
    <>
      {readAloud && (
        <ReadAloudView
          text={readAloud.text}
          effect={readAloud.effect}
          blanks={sheet.story_blanks}
          players={players}
          onClose={() => setReadAloud(null)}
        />
      )}

      <div className="space-y-6">
        {/* Story Blanks */}
        <section>
          <h2 className="font-pirata text-gold-400 text-lg mb-3">
            Story Blanks
          </h2>
          <Card>
            <div className="space-y-3">
              {character.storyBlanks.map((blank) => (
                <div key={blank.number}>
                  <label className="block text-parchment-400 text-sm font-body mb-1">
                    {blank.number}. {blank.prompt}
                  </label>

                  {blank.type === 'player_name' ? (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setPlayerPickerFor(
                            playerPickerFor === String(blank.number)
                              ? null
                              : String(blank.number)
                          )
                        }
                        className={cn(
                          'w-full text-left min-h-[48px] px-3 py-2 rounded-lg border font-body text-sm',
                          'bg-navy-700 border-gold-700/30 text-parchment-200',
                          'active:bg-navy-600 transition-colors'
                        )}
                      >
                        {sheet.story_blanks[String(blank.number)]
                          ? (() => {
                              const p = players.find(
                                (pl) =>
                                  pl.id ===
                                  sheet.story_blanks[String(blank.number)]
                              );
                              return p
                                ? p.pirate_name || p.display_name
                                : sheet.story_blanks[String(blank.number)];
                            })()
                          : 'Choose a player…'}
                      </button>

                      {playerPickerFor === String(blank.number) && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg border border-gold-700/30 bg-navy-700 shadow-xl overflow-hidden">
                          {otherPlayers.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                onBlankChange(String(blank.number), p.id);
                                setPlayerPickerFor(null);
                              }}
                              className="w-full text-left px-4 min-h-[48px] flex items-center text-parchment-200 font-body text-sm hover:bg-navy-600 active:bg-navy-600 transition-colors"
                            >
                              {p.pirate_name || p.display_name}
                            </button>
                          ))}
                          {otherPlayers.length === 0 && (
                            <p className="px-4 py-3 text-parchment-500 text-sm font-body">
                              No other players yet
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={sheet.story_blanks[String(blank.number)] || ''}
                      onChange={(e) =>
                        onBlankChange(String(blank.number), e.target.value)
                      }
                      placeholder={blank.prompt}
                      className="w-full min-h-[48px] px-3 py-2 rounded-lg border bg-navy-700 border-gold-700/30 text-parchment-200 placeholder:text-parchment-500 font-body text-sm focus:outline-none focus:border-gold-600/60"
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Backstory */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-pirata text-gold-400 text-lg">Backstory</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setReadAloud({ text: character.backstory })
              }
            >
              📖 Read Aloud
            </Button>
          </div>
          <Card>
            <p className="text-parchment-300 text-sm font-body leading-relaxed whitespace-pre-line">
              {renderStoryText(
                character.backstory,
                sheet.story_blanks,
                players
              )}
            </p>
          </Card>
        </section>

        {/* Constellation Events */}
        <section>
          <h2 className="font-pirata text-gold-400 text-lg mb-3">
            Constellation Events
          </h2>
          <div className="space-y-3">
            {character.events.map((event, index) => {
              const eventNum = index + 1;
              const isResolved = eventNum <= completed;
              const isNext = eventNum === completed + 1;
              const isLocked = eventNum > completed + 1;

              if (isLocked) {
                return (
                  <Card key={index} className="opacity-40">
                    <div className="flex items-center gap-3">
                      <span className="text-parchment-500 text-lg">🔒</span>
                      <p className="text-parchment-500 font-body text-sm">
                        Event {eventNum}
                      </p>
                    </div>
                  </Card>
                );
              }

              return (
                <Card
                  key={index}
                  variant={isResolved ? 'highlighted' : 'default'}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 flex-shrink-0">
                      {isResolved ? '✅' : '⭐'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-parchment-400 font-body text-xs uppercase tracking-wider">
                          Event {eventNum}
                          {isResolved && ' — Resolved'}
                        </p>
                        {isResolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setReadAloud({
                                text: event.narrative,
                                effect: event.effect,
                              })
                            }
                          >
                            📖
                          </Button>
                        )}
                      </div>

                      <p className="text-parchment-300 text-sm font-body leading-relaxed whitespace-pre-line">
                        {renderStoryText(
                          event.narrative,
                          sheet.story_blanks,
                          players
                        )}
                      </p>

                      <div className="mt-2 rounded-lg bg-navy-900/50 px-3 py-2">
                        <p className="text-gold-500 font-body text-xs">
                          {event.effect}
                        </p>
                      </div>

                      {isNext && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-3"
                          onClick={onResolveEvent}
                        >
                          ✨ Resolve Event
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
