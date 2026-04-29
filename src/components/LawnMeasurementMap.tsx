"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Ruler, RotateCcw, Check } from "lucide-react";

interface LawnMeasurementMapProps {
  onMeasurementComplete: (sqft: number) => void;
  initialSqft?: number;
}

const KC_CENTER = { lat: 39.0997, lng: -94.5786 };
const DEFAULT_ZOOM = 18;

export default function LawnMeasurementMap({
  onMeasurementComplete,
  initialSqft,
}: LawnMeasurementMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(null);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [sqft, setSqft] = useState<number | null>(initialSqft ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const calculateArea = useCallback(
    (poly: google.maps.Polygon) => {
      const area = google.maps.geometry.spherical.computeArea(
        poly.getPath()
      );
      const areaInSqft = Math.round(area * 10.7639);
      setSqft(areaInSqft);
      onMeasurementComplete(areaInSqft);
    },
    [onMeasurementComplete]
  );

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Maps API key not configured");
      setIsLoading(false);
      return;
    }

    setOptions({ key: apiKey, v: "weekly" });

    async function init() {
      await importLibrary("maps");
      await importLibrary("drawing");
      await importLibrary("geometry");

      if (!mapRef.current) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: KC_CENTER,
        zoom: DEFAULT_ZOOM,
        mapTypeId: "satellite",
        tilt: 0,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const dm = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: "#52B788",
          fillOpacity: 0.35,
          strokeColor: "#52B788",
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
      });

      dm.setMap(mapInstance);

      google.maps.event.addListener(
        dm,
        "polygoncomplete",
        (poly: google.maps.Polygon) => {
          setPolygon(poly);
          setIsDrawing(false);
          dm.setDrawingMode(null);
          calculateArea(poly);

          google.maps.event.addListener(poly.getPath(), "set_at", () =>
            calculateArea(poly)
          );
          google.maps.event.addListener(poly.getPath(), "insert_at", () =>
            calculateArea(poly)
          );
        }
      );

      setMap(mapInstance);
      setDrawingManager(dm);
      setIsLoading(false);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            mapInstance.setCenter({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          () => {
            // Geolocation denied — stay on KC center
          }
        );
      }
    }

    init().catch(() => {
      setError("Failed to load Google Maps");
      setIsLoading(false);
    });
  }, [calculateArea]);

  function startDrawing() {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
      setSqft(null);
    }
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      setIsDrawing(true);
    }
  }

  function resetDrawing() {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
      setSqft(null);
    }
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
      setIsDrawing(false);
    }
  }

  if (error) {
    return (
      <div className="aspect-[4/3] rounded-2xl border border-border bg-white flex items-center justify-center">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-white">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-transparent" />
              <p className="text-sm text-muted mt-3">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!polygon && !isDrawing && (
          <button
            onClick={startDrawing}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
          >
            <Ruler size={16} />
            Draw Lawn Boundary
          </button>
        )}
        {isDrawing && (
          <p className="flex-1 text-center text-sm text-muted py-2.5">
            Tap points to outline your lawn. Tap the first point to close.
          </p>
        )}
        {polygon && (
          <>
            <button
              onClick={resetDrawing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-4 py-2.5 font-display text-sm text-muted uppercase tracking-wider hover:bg-cream transition-colors"
            >
              <RotateCcw size={16} />
              Redraw
            </button>
            {sqft && (
              <div className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5">
                <Check size={16} className="text-lime" />
                <span className="font-display text-lg text-white">
                  {sqft.toLocaleString()} sq ft
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
