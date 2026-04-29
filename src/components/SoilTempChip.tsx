"use client";

import { Thermometer } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

const STATUS_COLORS: Record<string, string> = {
  dormant: "bg-blue-50 text-blue-700",
  "pre-emergent": "bg-lime-light text-forest",
  closing: "bg-orange-light text-orange",
  overseeding: "bg-lime-light text-forest",
  summer: "bg-orange-light text-orange",
};

export default function SoilTempChip() {
  const { weather, loading } = useWeather();

  if (loading || !weather?.soilTemp) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-light px-3 py-1 font-mono text-xs text-forest">
        <Thermometer size={12} />
        Soil Temp: loading...
      </span>
    );
  }

  const colors = STATUS_COLORS[weather.soilTempStatus ?? "dormant"] ?? "bg-lime-light text-forest";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs ${colors}`}>
      <Thermometer size={12} />
      Soil Temp: {weather.soilTemp}°F
    </span>
  );
}
