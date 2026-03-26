'use client';

import { useState } from 'react';
import { useOrientation } from '@/hooks/useOrientation';

export function RotatePrompt() {
  const isLandscape = useOrientation();
  const [dismissed, setDismissed] = useState(false);

  if (isLandscape || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-900/90 flex flex-col items-center justify-center animate-fadeIn"
      onClick={() => setDismissed(true)}
    >
      <span className="text-5xl mb-4 animate-[spin_2s_ease-in-out_1]">📱</span>
      <p className="text-parchment-200 text-lg font-pirata">
        Rotate for the best experience
      </p>
      <p className="text-parchment-400 text-sm mt-2">Tap to dismiss</p>
    </div>
  );
}
