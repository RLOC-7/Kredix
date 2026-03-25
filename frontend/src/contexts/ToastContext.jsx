import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ToastContext = createContext(undefined);

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-brand-500" />,
  error: <XCircle className="w-5 h-5 text-destructive" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, options) => addToast({ type: 'success', message, ...options }),
    error: (message, options) => addToast({ type: 'error', message, ...options }),
    warning: (message, options) => addToast({ type: 'warning', message, ...options }),
    info: (message, options) => addToast({ type: 'info', message, ...options }),
    custom: (message, options) => addToast({ type: 'custom', message, ...options }),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 glass-card px-4 py-3 min-w-[300px] max-w-md backdrop-blur-2xl border',
                t.type === 'success' && 'border-brand-500/30 bg-brand-500/10 dark:bg-brand-500/5',
                t.type === 'error' && 'border-destructive/30 bg-destructive/10 dark:bg-destructive/5',
                t.type === 'warning' && 'border-yellow-500/30 bg-yellow-500/10 dark:bg-yellow-500/5',
                t.type === 'info' && 'border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/5',
                t.type === 'custom' && 'border-white/20'
              )}
            >
              {t.type !== 'custom' && toastIcons[t.type]}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t.message}</p>
                {t.description && (
                  <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};
