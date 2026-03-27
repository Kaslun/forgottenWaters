'use client';

import { Button } from './Button';

interface ErrorStateProps {
  icon: string;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export const ERROR_MESSAGES = {
  GAME_NOT_FOUND: {
    icon: '🏴‍☠️',
    title: 'No Ship by That Name',
    message: 'No game found with that code. Check with your host and try again.',
  },
  GAME_FULL: {
    icon: '⚓',
    title: 'Crew is Full',
    message: 'This game already has 7 pirates. No room aboard, matey.',
  },
  GAME_STARTED: {
    icon: '⛵',
    title: 'Ship Has Sailed',
    message: 'This game is already underway and all seats are taken.',
  },
  GAME_FINISHED: {
    icon: '🏝️',
    title: 'Adventure Complete',
    message: 'This game has already ended. Start a new voyage!',
  },
  CONNECTION_LOST: {
    icon: '🌊',
    title: 'Lost at Sea',
    message: 'Connection lost. Trying to find our way back...',
  },
  GENERIC: {
    icon: '💀',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Try refreshing the page.',
  },
} as const;

export const EMPTY_STATES = {
  NO_EVENTS_RESOLVED: {
    icon: '🔮',
    message: 'No constellation events resolved yet.',
    hint: 'Fill stars with ! markers to earn event tokens, then resolve events here.',
  },
  NO_STORY_BLANKS: {
    icon: '📝',
    message: 'Your story blanks are empty.',
    hint: 'Fill them in to bring your backstory and events to life!',
  },
  LOBBY_WAITING: {
    icon: '🏴‍☠️',
    message: 'Waiting for crew to join...',
    hint: 'Share the code with your fellow pirates.',
  },
  LOG_EMPTY: {
    icon: '📜',
    message: 'The ship log is empty.',
    hint: 'Start recording your adventures, scribe!',
  },
} as const;

export function ErrorState({ icon, title, message, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h2 className="text-gold-400 font-pirata text-xl mb-2">{title}</h2>
      <p className="text-parchment-400 text-sm mb-6 max-w-xs">{message}</p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon, message, hint }: { icon: string; message: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="text-4xl mb-3 opacity-60">{icon}</span>
      <p className="text-parchment-300 text-sm mb-1">{message}</p>
      <p className="text-parchment-500 text-xs">{hint}</p>
    </div>
  );
}
