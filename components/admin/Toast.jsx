'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message) => {
    const id = Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const api = useMemo(() => ({
    success: (m) => push('success', m),
    error: (m) => push('error', m),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-md items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}
          >
            {t.type === 'error' ? <FiAlertCircle className="shrink-0" /> : <FiCheckCircle className="shrink-0 text-green-400" />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
