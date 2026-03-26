'use client';

import { useState, useEffect } from 'react';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'offline';

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('connected');

  useEffect(() => {
    const handleOnline = () => setStatus('connected');
    const handleOffline = () => setStatus('offline');

    if (!navigator.onLine) {
      setStatus('offline');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
