"use client";

import { Thermometer, Droplets, Wind } from "lucide-react";
import { useWeather, weatherEmoji, weatherLabel } from "@/hooks/useWeather";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  dormant: { label: "Dormant", color: "text-blue-600", bg: "bg-blue-50" },
  "pre-emergent": { label: "Pre-Emergent Window", color: "text-lime", bg: "bg-lime-light" },
  closing: { label: "Window Closing", color: "text-orange", bg: "bg-orange-light" },
  overseeding: { label: "Overseeding Ideal", color: "text-lime", bg: "bg-lime-light" },
  summer: { label: "Summer Stress", color: "text-orange", bg: "bg-orange-light" },
};

export default function WeatherWidget({ compact = false }: { compact?: boolean }) {
  const { weather, loading } = useWeather();

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center justify-center gap-2 py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-lime border-t-transparent" />
          <p className="text-sm text-muted">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (!weather || weather.error || !weather.current) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <p className="text-sm text-muted text-center py-4">
          Weather data unavailable — check back shortly.
        </p>
      </div>
    );
  }

  const status = STATUS_CONFIG[weather.soilTempStatus ?? "dormant"];

  return (
    <div className="space-y-3">
      {/* Current conditions + soil temp */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
              KC Metro — Now
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{weatherEmoji(weather.current.weatherCode)}</span>
              <span className="font-display text-4xl text-forest">{weather.current.temp}°F</span>
            </div>
            <p className="text-sm text-muted mt-1">{weatherLabel(weather.current.weatherCode)}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted justify-end">
              <Droplets size={12} />
              {weather.current.humidity}% humidity
            </div>
            {weather.current.precipitation > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted justify-end">
                <Wind size={12} />
                {weather.current.precipitation}&quot; precip
              </div>
            )}
          </div>
        </div>

        {/* Soil temp bar */}
        {weather.soilTemp !== null && (
          <div className={`mt-4 rounded-lg ${status.bg} p-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer size={16} className={status.color} />
                <div>
                  <p className="font-mono text-xs text-muted uppercase tracking-wide">
                    Soil Temp (6cm)
                  </p>
                  <p className={`font-display text-2xl ${status.color}`}>
                    {weather.soilTemp}°F
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 font-mono text-xs font-medium ${status.color} ${status.bg} border border-current/20`}>
                {status.label}
              </span>
            </div>
          </div>
        )}

        {/* Soil temp alert */}
        {weather.soilTempAlert && (
          <p className="mt-3 text-sm text-charcoal font-medium">
            {weather.soilTempAlert}
          </p>
        )}
      </div>

      {/* 5-day forecast */}
      {!compact && weather.forecast.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
            5-Day Forecast
          </p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {weather.forecast.map((day) => {
              const dayLabel = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "short",
              });
              return (
                <div key={day.date} className="space-y-1">
                  <p className="font-mono text-xs text-muted">{dayLabel}</p>
                  <p className="text-xl">{weatherEmoji(day.weatherCode)}</p>
                  <p className="font-display text-sm text-forest">{day.high}°</p>
                  <p className="text-xs text-muted">{day.low}°</p>
                  {day.precipitation > 0 && (
                    <p className="text-[10px] text-blue-500">{day.precipitation}&quot;</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last updated */}
      {weather.lastUpdated && (
        <p className="text-[10px] text-muted text-center">
          Updated {new Date(weather.lastUpdated).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
