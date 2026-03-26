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
  info: 'bg-navy-700 border-gold-700/30 text-parchment-200',
  success: 'bg-gold-600/20 border-gold-600/40 text-gold-400',
  warning: 'bg-amber-600/20 border-amber-600/40 text-amber-300',
  error: 'bg-red-900/30 border-red-800/30 text-red-400',
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
              'pointer-events-auto px-4 py-2.5 rounded-xl border text-sm font-body shadow-lg',
              'max-w-sm w-full cursor-pointer animate-[fadeIn_0.2s_ease-out]',
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
