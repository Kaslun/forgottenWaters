'use client';

import { useLayoutEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { generatePirateName } from '@/data/nameGenerator';
import { tapFeedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

export interface PirateNameGeneratorProps {
  currentName: string | null;
  onAccept: (name: string) => void;
}

export function PirateNameGenerator({
  currentName,
  onAccept,
}: PirateNameGeneratorProps) {
  const [randomName, setRandomName] = useState(() => currentName ?? '');
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  useLayoutEffect(() => {
    if (currentName !== null) {
      setRandomName(currentName);
      return;
    }
    setRandomName((prev) => prev || generatePirateName());
  }, [currentName]);

  const displayName = customMode ? customValue : randomName;
  const canAccept = displayName.trim().length > 0;

  function handleGenerateNew() {
    tapFeedback();
    setRandomName(generatePirateName());
    setCustomMode(false);
  }

  function toggleCustom() {
    if (!customMode) {
      setCustomValue(randomName);
    }
    setCustomMode((m) => !m);
  }

  function handleAccept() {
    if (!canAccept) return;
    onAccept(displayName.trim());
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl glass shadow-ambient gold-corner-accent',
        'p-6'
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-parchment-400/5 blur-3xl"
      />

      <div className="relative space-y-5">
        <div className="text-center">
          <p className="font-body text-sm tracking-wide text-parchment-400">
            Yer pirate name
          </p>
          {customMode ? (
            <div className="mt-3 space-y-2">
              <label htmlFor="pirate-custom-name" className="sr-only">
                Custom pirate name
              </label>
              <input
                id="pirate-custom-name"
                type="text"
                value={customValue}
                onChange={(e) =>
                  setCustomValue(e.target.value.slice(0, 50))
                }
                maxLength={50}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Captain…"
                className={cn(
                  'w-full rounded-xl ghost-border bg-surface-high px-4 py-3',
                  'font-pirata text-2xl text-parchment-100 placeholder:text-parchment-400/80',
                  'shadow-inner shadow-ambient outline-none transition-[box-shadow]',
                  'focus:ring-2 focus:ring-teal-400/35 focus:ring-offset-0 focus:ring-offset-transparent'
                )}
              />
              <p className="font-body text-xs text-parchment-400">
                {customValue.length}/50
              </p>
            </div>
          ) : (
            <p
              key={randomName}
              className="mt-2 animate-fadeIn font-pirata text-2xl leading-snug text-parchment-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            >
              {randomName || '\u00a0'}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleGenerateNew}
          >
            Generate New Name
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-full bg-gold-gradient shadow-glow-gold sm:w-auto"
            disabled={!canAccept}
            onClick={handleAccept}
          >
            Accept Name
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleCustom}
            className={cn(
              'font-body text-sm text-gold-500 underline decoration-gold-700/60 underline-offset-4',
              'transition-colors hover:text-gold-400 hover:decoration-gold-500',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400'
            )}
          >
            {customMode ? 'Use a random name instead' : 'Or type your own…'}
          </button>
        </div>
      </div>
    </div>
  );
}
