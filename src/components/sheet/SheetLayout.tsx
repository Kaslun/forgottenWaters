'use client';

import { useOrientation } from '@/hooks/useOrientation';
import { ConnectionDot } from '@/components/ui/ConnectionDot';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  icon: string;
  label: string;
}

interface SheetLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
  pirateName: string;
  characterTitle: string;
  connectionStatus: 'connected' | 'reconnecting' | 'offline';
  children: React.ReactNode;
}

export function SheetLayout({
  activeTab,
  onTabChange,
  tabs,
  pirateName,
  characterTitle,
  connectionStatus,
  children,
}: SheetLayoutProps) {
  const isLandscape = useOrientation();

  if (isLandscape) {
    return (
      <div className="flex flex-row h-[100dvh] bg-surface">
        <nav className="w-12 flex-shrink-0 flex flex-col items-center gap-1 py-3 bg-surface-low ghost-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-colors min-w-[48px] min-h-[48px]',
                activeTab === tab.id
                  ? 'bg-teal-600/15 text-teal-400 shadow-glow-teal'
                  : 'text-parchment-400 active:text-parchment-100 active:bg-surface-high/50'
              )}
              aria-label={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </nav>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 glass backdrop-blur-md">
            <h1 className="font-pirata text-gold-400 text-base truncate">
              {pirateName}
            </h1>
            <span className="font-body text-parchment-400 text-sm truncate">
              {characterTitle}
            </span>
            <ConnectionDot status={connectionStatus} className="ml-auto flex-shrink-0" />
          </header>

          <main
            className="flex-1 overflow-y-auto p-4"
            style={{ overscrollBehaviorY: 'contain' }}
          >
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-surface">
      <header className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 glass backdrop-blur-md">
        <h1 className="font-pirata text-gold-400 text-base truncate">
          {pirateName}
        </h1>
        <span className="font-body text-parchment-400 text-sm truncate">
          {characterTitle}
        </span>
        <ConnectionDot status={connectionStatus} className="ml-auto flex-shrink-0" />
      </header>

      <main
        className="flex-1 overflow-y-auto p-4"
        style={{ overscrollBehaviorY: 'contain' }}
      >
        {children}
      </main>

      <nav className="flex-shrink-0 h-14 flex items-center justify-around bg-surface-low ghost-border pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] rounded-lg transition-colors',
              activeTab === tab.id
                ? 'text-teal-400 shadow-glow-teal'
                : 'text-parchment-400 active:text-parchment-100'
            )}
            aria-label={tab.label}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {activeTab === tab.id && (
              <span className="text-[10px] font-body leading-none">
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
