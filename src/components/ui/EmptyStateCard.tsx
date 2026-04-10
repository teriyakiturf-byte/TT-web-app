"use client";

import type { EmptyStateVariant } from "@/types";
import { MapPin, CheckSquare, Search, CloudOff, LayoutDashboard } from "lucide-react";

interface EmptyStateCardProps {
  variant: EmptyStateVariant;
  headline: string;
  body: string;
  ctaLabel: string;
  onCtaClick: () => void;
  icon?: React.ReactNode;
}

const defaultIcons: Record<EmptyStateVariant, React.ReactNode> = {
  measurement: <MapPin size={24} className="text-forest" />,
  "task-checklist": <CheckSquare size={24} className="text-forest" />,
  "faq-no-results": <Search size={24} className="text-forest" />,
  "weather-unavailable": <CloudOff size={24} className="text-forest" />,
  dashboard: <LayoutDashboard size={24} className="text-forest" />,
};

export default function EmptyStateCard({
  variant,
  headline,
  body,
  ctaLabel,
  onCtaClick,
  icon,
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border bg-cream p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-light mb-4">
        {icon ?? defaultIcons[variant]}
      </div>
      <h3 className="font-display text-xl text-forest uppercase">{headline}</h3>
      <p className="text-sm text-muted mt-2 max-w-xs">{body}</p>
      <button
        onClick={onCtaClick}
        className="mt-4 rounded-xl bg-orange px-6 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
