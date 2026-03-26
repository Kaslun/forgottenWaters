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
      <div className="flex flex-row h-[100dvh] bg-navy-900">
        <nav className="w-12 flex-shrink-0 flex flex-col items-center gap-1 py-3 bg-navy-800 border-r border-gold-700/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-colors min-w-[48px] min-h-[48px]',
                activeTab === tab.id
                  ? 'bg-gold-600/20 text-gold-400'
                  : 'text-parchment-500 active:text-parchment-300 active:bg-navy-700/50'
              )}
              aria-label={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </nav>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-navy-800/90 backdrop-blur-sm border-b border-gold-700/20">
            <h1 className="font-pirata text-gold-400 text-base truncate">
              {pirateName}
            </h1>
            <span className="text-parchment-500 text-sm truncate">
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
    <div className="flex flex-col h-[100dvh] bg-navy-900">
      <header className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-navy-800/90 backdrop-blur-sm border-b border-gold-700/20">
        <h1 className="font-pirata text-gold-400 text-base truncate">
          {pirateName}
        </h1>
        <span className="text-parchment-500 text-sm truncate">
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

      <nav className="flex-shrink-0 h-14 flex items-center justify-around bg-navy-800 border-t border-gold-700/20 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] rounded-lg transition-colors',
              activeTab === tab.id
                ? 'text-gold-400'
                : 'text-parchment-500 active:text-parchment-300'
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
