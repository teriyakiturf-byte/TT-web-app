"use client";

import Nav from "@/components/Nav";
import WeatherWidget from "@/components/WeatherWidget";
import { Thermometer } from "lucide-react";

const SOIL_TEMP_GUIDE = [
  { range: "Below 50°F", status: "Dormant", action: "No action needed — turf is sleeping.", color: "bg-blue-50 text-blue-700" },
  { range: "50–55°F", status: "Pre-Emergent Window", action: "Apply crabgrass pre-emergent NOW. Forsythia is blooming.", color: "bg-lime-light text-forest" },
  { range: "55–65°F", status: "Window Closing", action: "Pre-emergent barrier is closing. Last chance to apply.", color: "bg-orange-light text-orange" },
  { range: "65–70°F", status: "Overseeding Ideal", action: "Fall overseeding conditions are perfect for tall fescue.", color: "bg-lime-light text-forest" },
  { range: "Above 70°F", status: "Summer Stress", action: "Mow high (4\"), water deep, avoid fertilizer.", color: "bg-orange-light text-orange" },
];

export default function WeatherPage() {
  return (
    <>
      <Nav userState="guest" />

      <main className="mx-auto max-w-xl px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-hero text-forest">
            KC Weather & Soil Temps
          </h1>
          <p className="text-sm text-muted mt-1">
            Live conditions for Kansas City lawn care decisions.
          </p>
        </div>

        <WeatherWidget />

        {/* Soil temp guide */}
        <div className="mt-8">
          <h2 className="font-display text-xl text-forest mb-3 flex items-center gap-2">
            <Thermometer size={20} className="text-lime" />
            KC Soil Temperature Guide
          </h2>
          <div className="space-y-2">
            {SOIL_TEMP_GUIDE.map((item) => (
              <div key={item.range} className={`rounded-xl ${item.color} p-4`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-lg">{item.range}</span>
                  <span className="font-mono text-xs uppercase tracking-wider">{item.status}</span>
                </div>
                <p className="text-sm opacity-80">{item.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted">
            Data from Open-Meteo. Soil temperature measured at 6cm depth.
            <br />
            Updated every 30 minutes. Coordinates: KC Metro (38.97°N, 94.67°W).
          </p>
        </div>
      </main>
    </>
  );
}
