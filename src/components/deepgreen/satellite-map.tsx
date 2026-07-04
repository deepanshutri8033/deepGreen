"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Satellite, Crosshair, HelpCircle } from "lucide-react";
import type { AuditClaim } from "@/lib/mock-data";

type SatelliteMapProps = {
  claim: AuditClaim | null;
  year: number;
  showAnomaly: boolean;
};

function latToY(lat: number) {
  return ((90 - lat) / 180) * 100;
}

function lngToX(lng: number) {
  return ((lng + 180) / 360) * 100;
}

export function SatelliteMap({ claim, year, showAnomaly }: SatelliteMapProps) {
  const [sliderX, setSliderX] = useState(50); // percentage slider from 0 to 100

  const markers = claim
    ? [{ lat: claim.lat, lng: claim.lng, label: claim.location }]
    : [
        { lat: -3.46, lng: -62.21, label: "Amazon Zone 4" },
        { lat: -1.92, lng: -55.02, label: "Coastal Delta" },
      ];

  const canopyOpacity =
    year === 2024 ? 0.35 : year === 2025 ? 0.22 : 0.12;

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#081210] select-none">
      {/* ============================================================== */}
      {/* BASE LAYER: BEFORE STATE (Lush Green Forest - 2024) */}
      {/* ============================================================== */}
      <div className="absolute inset-0 bg-[#060a08]">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 40% 30% at 35% 45%, rgba(16,185,129,0.38), transparent),
              radial-gradient(ellipse 25% 20% at 55% 35%, rgba(34,197,94,0.32), transparent),
              radial-gradient(ellipse 30% 25% at 48% 55%, rgba(5,150,105,0.25), transparent),
              linear-gradient(180deg, #0a1612 0%, #060a08 100%)
            `,
          }}
        />
        {/* Year Label */}
        <div className="absolute left-4 bottom-14 z-10 text-[9px] font-bold font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.5 rounded">
          2024 / BASELINE VEGETATION
        </div>
      </div>

      {/* ============================================================== */}
      {/* CLIPPED TOP LAYER: AFTER STATE (Barren / Deforested - 2026) */}
      {/* ============================================================== */}
      {showAnomaly && (
        <div
          className="absolute inset-0 overflow-hidden z-0"
          style={{
            clipPath: `polygon(${sliderX}% 0, 100% 0, 100% 100%, ${sliderX}% 100%)`,
          }}
        >
          {/* Deforested Background */}
          <div
            className="absolute inset-0 bg-[#0d0707]"
            style={{
              background: `
                radial-gradient(ellipse 40% 30% at 35% 45%, rgba(239,68,68,0.18), transparent),
                radial-gradient(ellipse 25% 20% at 55% 35%, rgba(220,38,38,0.12), transparent),
                radial-gradient(ellipse 30% 25% at 48% 55%, rgba(185,28,28,0.08), transparent),
                linear-gradient(180deg, #100606 0%, #060202 100%)
              `,
            }}
          />
          {/* Year Label */}
          <div className="absolute right-4 bottom-14 z-10 text-[9px] font-bold font-mono text-red-400 bg-red-950/70 border border-red-500/20 px-2 py-0.5 rounded">
            2026 / DEFORESTATION DETECTED
          </div>
        </div>
      )}

      {/* Grid overlay lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 10}
            x2="100"
            y2={i * 10}
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.2"
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 10}
            y1="0"
            x2={i * 10}
            y2="100"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.2"
          />
        ))}
      </svg>

      {/* Satellite Targets */}
      {markers.map((marker) => (
        <motion.div
          key={marker.label}
          className="absolute z-10"
          style={{
            left: `${lngToX(marker.lng)}%`,
            top: `${latToY(marker.lat)}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="relative">
            {showAnomaly && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/30"
                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 24, height: 24, margin: -4 }}
              />
            )}
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-offset-1 ring-offset-[#081210] ${
                showAnomaly
                  ? "bg-red-500 ring-red-400"
                  : "bg-emerald-500 ring-emerald-400"
              }`}
            />
          </div>
        </motion.div>
      ))}

      {/* Header stats bar */}
      <div className="absolute left-3 top-3 z-25 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm border border-white/[0.04]">
        <Satellite className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-100">
          Sentinel-2 L2A · {showAnomaly ? `Active Swipe` : `Year ${year}`}
        </span>
      </div>

      {claim && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 z-25 flex items-center justify-between gap-2 rounded-xl bg-black/60 px-4 py-2.5 backdrop-blur-sm border border-white/[0.04]"
        >
          <div className="flex items-center gap-2">
            <Crosshair className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-100 font-medium">
              {claim.location} · {claim.lat}, {claim.lng}
            </span>
          </div>
          {showAnomaly && (
            <span className="text-xs font-semibold text-red-400 font-mono">
              Confidence: 94% (Deforestation)
            </span>
          )}
        </motion.div>
      )}

      {/* NDVI gradient indicator scale */}
      <div className="absolute right-3 top-3 z-25 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm border border-white/[0.04]">
        <p className="text-[9px] uppercase font-bold tracking-wider text-emerald-400/70">
          NDVI Index
        </p>
        <div className="mt-1 h-2 w-24 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" />
      </div>

      {/* ============================================================== */}
      {/* DRAGGABLE VERTICAL SLIDER HANDLE & INPUT OVERLAY */}
      {/* ============================================================== */}
      {showAnomaly && (
        <>
          {/* Vertical dividing line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
            style={{ left: `${sliderX}%` }}
          >
            {/* Draggable Circle Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-neutral-900 border-2 border-white/60 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-between px-1.5 cursor-ew-resize">
              <span className="text-[8px] text-white/50 font-bold font-mono">◀</span>
              <span className="text-[8px] text-white/50 font-bold font-mono">▶</span>
            </div>
          </div>

          {/* Invisible interactive input range covering the map */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderX}
            onChange={(e) => setSliderX(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
          />
        </>
      )}
    </div>
  );
}
export default SatelliteMap;
