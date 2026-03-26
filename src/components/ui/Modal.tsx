'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ onClose, children, title }: ModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="bg-navy-800 border border-gold-700/30 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gold-400 font-pirata text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="text-parchment-500 active:text-parchment-300 min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
