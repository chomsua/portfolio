"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * 잠깐 떴다 사라지는 알림(토스트). 이메일 복사 등에 쓴다.
 * aria-live로 화면낭독기에도 내용이 읽힌다.
 */
type ToastContextValue = { show: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), 2400);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext value={{ show }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-5"
      >
        <p
          className={`text-label rounded-full bg-ink px-4 py-2.5 text-paper shadow-lg transition-all duration-300 ease-out-soft ${
            message ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {message ?? " "}
        </p>
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
