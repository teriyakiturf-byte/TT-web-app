"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface TaskCompletionToastProps {
  /** Primary feedback line (on-track / behind messaging). */
  message: string;
  /** Optional second line — used for the "Prioritize next: …" behind state. */
  subMessage?: string;
  /** Auto-dismiss delay in ms. */
  duration?: number;
  onDismiss: () => void;
}

/**
 * Post-completion feedback toast. Slides up from the bottom, holds for
 * `duration`, then animates back out. Design per #30.
 */
export default function TaskCompletionToast({
  message,
  subMessage,
  duration = 4000,
  onDismiss,
}: TaskCompletionToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Mount off-screen, then flip to visible on the next frame so the
    // translate/opacity transition actually runs.
    const raf = requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 z-50 transition duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-[#1B4332] text-white rounded-2xl p-4 shadow-xl">
        <div className="flex items-center">
          <span className="bg-[#52B788] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={18} strokeWidth={3} />
          </span>
          <p className="text-sm font-medium text-white ml-3">{message}</p>
        </div>
        {subMessage && (
          <p className="text-xs text-[#95D5B2] mt-1 ml-11">{subMessage}</p>
        )}
      </div>
    </div>
  );
}
