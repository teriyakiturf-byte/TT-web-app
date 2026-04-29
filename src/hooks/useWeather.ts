"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
  } | null;
  soilTemp: number | null;
  soilTempStatus: "dormant" | "pre-emergent" | "closing" | "overseeding" | "summer" | null;
  soilTempAlert: string | null;
  forecast: {
    date: string;
    high: number;
    low: number;
    precipitation: number;
    weatherCode: number;
  }[];
  lastUpdated: string | null;
  error?: boolean;
}

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        const json: WeatherData = await res.json();
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setData({
            current: null,
            soilTemp: null,
            soilTempStatus: null,
            soilTempAlert: null,
            forecast: [],
            lastUpdated: null,
            error: true,
          });
          setLoading(false);
        }
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { weather: data, loading };
}

const WEATHER_EMOJI: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  56: "🌧️",
  57: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌨️",
  67: "🌨️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  77: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  85: "🌨️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

export function weatherEmoji(code: number): string {
  return WEATHER_EMOJI[code] ?? "🌤️";
}

const WEATHER_LABEL: Record<number, string> = {
  0: "Clear",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  80: "Light Showers",
  81: "Showers",
  82: "Heavy Showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Severe Storm",
};

export function weatherLabel(code: number): string {
  return WEATHER_LABEL[code] ?? "Fair";
}
