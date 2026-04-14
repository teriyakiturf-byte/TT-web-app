"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Thermometer, Clock, Calendar } from "lucide-react";
import type { AlertType } from "@/types";

interface AlertBannerProps {
  type: AlertType;
  message: string;
  expiresAt?: Date;
  onDismiss?: () => void;
}

const config: Record<
  AlertType,
  { bg: string; borderColor: string; icon: React.ReactNode }
> = {
  "soil-temp": {
    bg: "bg-lime-light",
    borderColor: "border-l-lime",
    icon: <Thermometer size={16} className="text-lime" />,
  },
  deadline: {
    bg: "bg-orange-light",
    borderColor: "border-l-orange",
    icon: <Clock size={16} className="text-orange" />,
  },
  "upcoming-window": {
    bg: "bg-cream",
    borderColor: "border-l-lime",
    icon: <Calendar size={16} className="text-lime" />,
  },
  "overseeding-window": {
    bg: "bg-lime-light",
    borderColor: "border-l-lime",
    icon: <Calendar size={16} className="text-lime" />,
  },
};

export default function AlertBanner({
  type,
  message,
  expiresAt,
  onDismiss,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (expiresAt && new Date() > expiresAt) {
      setDismissed(true);
    }
  }, [expiresAt]);

  if (dismissed) return null;

  const { bg, borderColor, icon } = config[type];

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border-l-4 ${borderColor} ${bg} px-4 py-3`}
    >
      {icon}
      <p className="flex-1 text-sm text-charcoal">{message}</p>
      {onDismiss && (
        <button
          onClick={() => {
            setDismissed(true);
            onDismiss();
          }}
          className="text-muted hover:text-charcoal"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
