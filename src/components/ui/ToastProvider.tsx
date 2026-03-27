'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const toastStyles: Record<ToastType, string> = {
  info: 'glass ghost-border text-parchment-100',
  success: 'bg-gold-500/15 text-gold-400 shadow-glow-gold',
  warning: 'bg-amber-600/15 text-amber-300',
  error: 'bg-red-900/20 text-red-400',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, 3000);

    timersRef.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-[60] flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={cn(
              'pointer-events-auto px-4 py-2.5 rounded-xl text-sm font-body shadow-ambient',
              'max-w-sm w-full cursor-pointer animate-fadeIn backdrop-blur-md',
              toastStyles[toast.type]
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
