"use client";

import { useEffect, useState } from "react";

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export function ErrorBanner({ message, onDismiss, autoDismissMs = 6000 }: ErrorBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      if (autoDismissMs > 0) {
        const timer = setTimeout(() => { setVisible(false); onDismiss?.(); }, autoDismissMs);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [message, autoDismissMs, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={() => { setVisible(false); onDismiss?.(); }}
        className="flex-shrink-0 rounded-md p-0.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
        aria-label="Dismiss"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
