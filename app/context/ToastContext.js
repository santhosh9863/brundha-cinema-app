"use client";

import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 🔥 TOAST UI */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <div className="glass px-4 py-2 rounded-lg text-sm text-white shadow-[0_0_20px_rgba(255,200,0,0.2)]">
            {toast}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}