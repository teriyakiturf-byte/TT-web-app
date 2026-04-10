"use client";

import { useEffect, useState } from "react";
import { Check, AlertTriangle, X } from "lucide-react";
import type { ToastType } from "@/types";

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: () => void;
}

const config: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: "bg-forest",
    icon: <Check size={16} className="text-lime" />,
  },
  alert: {
    bg: "bg-orange",
    icon: <AlertTriangle size={16} className="text-white" />,
  },
  error: {
    bg: "bg-red-600",
    icon: <X size={16} className="text-white" />,
  },
};

export default function ToastNotification({
  type,
  message,
  duration = 4000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const { bg, icon } = config[type];

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 ${
        visible ? "toast-enter" : "opacity-0 translate-y-4"
      } transition-all duration-300`}
    >
      <div
        className={`flex items-center gap-2 rounded-xl ${bg} px-5 py-3 text-white shadow-lg`}
      >
        {icon}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
