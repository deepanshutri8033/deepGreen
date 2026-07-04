"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ndviTimeline } from "@/lib/mock-data";
import { Activity, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NdviChartProps = {
  year: number;
  showAnomaly: boolean;
};

export function NdviChart({ year, showAnomaly }: NdviChartProps) {
  const [showMultiYear, setShowMultiYear] = useState(false);

  // Fused continuous timeline data
  const multiYearData = [
    ...ndviTimeline[2024].map(d => ({ ...d, label: `'24 ${d.month}` })),
    ...ndviTimeline[2025].map(d => ({ ...d, label: `'25 ${d.month}` })),
    ...ndviTimeline[2026].map(d => ({ ...d, label: `'26 ${d.month}` })),
  ];

  const currentYearData = (ndviTimeline[year] ?? ndviTimeline[2024]).map(d => ({
    ...d,
    label: d.month
  }));

  const data = showMultiYear ? multiYearData : currentYearData;

  const maxVal = 1.0;
  const width = 140;
  const height = 60;
  const padding = 5;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxVal) * (height - padding * 2);
    return { x, y, ...d };
  });

  const expectedPoints = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.expected / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });

  const actualPath = points.map((p) => `${p.x},${p.y}`).join(" ");
  const expectedPath = expectedPoints.join(" ");

  // Calculating stats
  const latestActual = data[data.length - 1].value;
  const latestExpected = data[data.length - 1].expected;
  const latestGap = ((latestExpected - latestActual) * 100).toFixed(0);

  // Confidence Score Stats
  const activeConfidence = showAnomaly ? 94 : 12;
  const radius = 28;
  const stroke = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeConfidence / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-100">NDVI Analysis Engine</p>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => setShowMultiYear(!showMultiYear)}
          className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 bg-emerald-950/20 text-emerald-300 transition-all cursor-pointer"
        >
          {showMultiYear ? "View Single Year" : "View 3-Year Trend"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Chart View (7 cols) */}
        <div className="md:col-span-8 space-y-3">
          <div className="relative rounded-2xl bg-emerald-950/15 p-4 ring-1 ring-emerald-500/10">
            {/* SVG Graph */}
            <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full">
              {/* Expected Grid Guide */}
              <polyline
                fill="none"
                stroke="rgba(16,185,129,0.15)"
                strokeWidth="0.6"
                strokeDasharray="2,2"
                points={expectedPath}
              />
              {/* Actual Line */}
              <motion.polyline
                fill="none"
                stroke={showAnomaly ? "#f87171" : "#34d399"}
                strokeWidth="1.2"
                points={actualPath}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              {/* Points */}
              {points.map((p) => (
                <circle
                  key={p.label}
                  cx={p.x}
                  cy={p.y}
                  r="1.2"
                  fill={showAnomaly ? "#f87171" : "#34d399"}
                  className="transition-colors duration-300"
                />
              ))}
            </svg>

            {/* X Axis Labels */}
            <div className="mt-2 flex justify-between text-[8px] font-mono text-emerald-200/40 select-none">
              {data.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 text-[10px] uppercase font-mono text-emerald-200/50">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3.5 bg-emerald-400" />
              Actual NDVI
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3.5 border-t border-dashed border-emerald-400/50" />
              Expected Growth
            </span>
          </div>
        </div>

        {/* Confidence Gauge Panel (4 cols) */}
        <div className="md:col-span-4 flex flex-col justify-between rounded-2xl border border-emerald-500/10 bg-[#080d0a]/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400/70">
              Confidence Score
            </span>
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400/30" />
          </div>

          {/* SVG Circular Gauge */}
          <div className="flex items-center justify-center py-2 relative">
            <svg width="70" height="70" className="rotate-[-90deg]">
              <circle
                r={radius}
                cx="35"
                cy="35"
                fill="transparent"
                stroke="rgba(16,185,129,0.06)"
                strokeWidth={stroke}
              />
              <motion.circle
                r={radius}
                cx="35"
                cy="35"
                fill="transparent"
                stroke={showAnomaly ? "#ef4444" : "#10b981"}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-white font-mono leading-none">
                {activeConfidence}%
              </span>
              <span className="text-[7px] text-emerald-400/40 uppercase font-mono font-medium mt-0.5">
                {showAnomaly ? "Deforest" : "Stable"}
              </span>
            </div>
          </div>

          {/* Noise Metrics Breakdown */}
          <div className="mt-3 space-y-1.5 text-[9px] font-mono text-emerald-200/50">
            <div className="flex justify-between border-b border-emerald-500/5 pb-1">
              <span>Cloud Cover Filter:</span>
              <span className="text-emerald-300">4.1% OK</span>
            </div>
            <div className="flex justify-between border-b border-emerald-500/5 pb-1">
              <span>Seasonal Variation:</span>
              <span className="text-emerald-300">-1.8%</span>
            </div>
            <div className="flex justify-between">
              <span>NDVI Delta Margin:</span>
              <span className={showAnomaly ? "text-red-400" : "text-emerald-300"}>
                {showAnomaly ? "-28.2%" : "Normal"}
              </span>
            </div>
          </div>

          {showAnomaly ? (
            <div className="mt-3 inline-flex items-center gap-1 text-[8px] font-semibold uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg justify-center w-full">
              <AlertTriangle className="w-3 h-3" /> Deforestation Confirmed
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-1 text-[8px] font-semibold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg justify-center w-full">
              <ShieldCheck className="w-3 h-3" /> Normal Variance
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
