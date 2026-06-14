"use client";

import { useEffect } from "react";
import type { ToastMessage } from "@/types/expressTc";

interface TcToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 4000;

export default function TcToast({ toast, onDismiss }: TcToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      className={`tc-toast tc-toast--${toast.type}`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}
