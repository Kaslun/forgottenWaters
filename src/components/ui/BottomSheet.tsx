'use client';

import { useEffect, useRef } from 'react';

interface BottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ onClose, children, title }: BottomSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end bg-black/70 animate-fadeIn"
    >
      <div className="glass-heavy rounded-t-2xl w-full max-h-[70vh] overflow-y-auto pb-[env(safe-area-inset-bottom)] shadow-ambient">
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-parchment-500/30" />
        </div>
        {title && (
          <h3 className="text-gold-400 font-pirata text-lg px-6 pb-3">{title}</h3>
        )}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
