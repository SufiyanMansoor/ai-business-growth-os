import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function toastStyles(kind: ToastKind) {
  if (kind === 'success') return { border: 'var(--success)', icon: '✓' };
  if (kind === 'error') return { border: 'var(--error)', icon: '!' };
  return { border: 'var(--primary-color)', icon: 'i' };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-20 right-6 z-[70] space-y-2 w-[320px] max-w-[85vw]">
        {toasts.map((toast) => {
          const style = toastStyles(toast.kind);
          return (
            <div
              key={toast.id}
              className="glass-card !p-3 flex items-start gap-3 shadow-lg"
              style={{ borderLeft: `3px solid ${style.border}` }}
            >
              <span className="text-xs font-bold mt-0.5" style={{ color: style.border }}>{style.icon}</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

