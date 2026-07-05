"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { getBezierPath } from "./financial-charts";

// ============================================================================
// COMPONENT: Redesigned NDVI Trend Chart (Smooth Curved Area Chart)
// ============================================================================
type NdviTrendChartProps = {
  data: { month: string; value: number; expected: number }[];
  showAnomaly: boolean;
};

export function NdviTrendChart({ data, showAnomaly }: NdviTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 1.0;

  const getCoordinates = (valueKey: "value" | "expected") => {
    return data.map((d, i) => {
      const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (d[valueKey] / maxVal) * chartHeight;
      return { x, y, val: d[valueKey] };
    });
  };

  const actualCoords = getCoordinates("value");
  const expectedCoords = getCoordinates("expected");

  const actualPath = getBezierPath(actualCoords);
  const expectedPath = getBezierPath(expectedCoords);

  const actualArea = `${actualPath} L ${actualCoords[actualCoords.length - 1].x} ${paddingTop + chartHeight} L ${actualCoords[0].x} ${paddingTop + chartHeight} Z`;
  const expectedArea = `${expectedPath} L ${expectedCoords[expectedCoords.length - 1].x} ${paddingTop + chartHeight} L ${expectedCoords[0].x} ${paddingTop + chartHeight} Z`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] font-sans text-neutral-400 select-none pb-2 justify-between">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            Expected NDVI
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${showAnomaly ? "bg-red-400" : "bg-[#8b5cf6]"}`} />
            Actual NDVI
          </span>
        </div>
        <span className="text-[10px] text-neutral-500 font-mono">
          Hover data points for info
        </span>
      </div>

      <div className="relative flex-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradient-expected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-actual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={showAnomaly ? "#ef4444" : "#8b5cf6"} stopOpacity="0.2" />
              <stop offset="100%" stopColor={showAnomaly ? "#ef4444" : "#8b5cf6"} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const val = (i * maxVal) / 4;
            const y = paddingTop + chartHeight - (i / 4) * chartHeight;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-neutral-500 font-medium"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={expectedArea} fill="url(#gradient-expected)" />
          <path d={actualArea} fill="url(#gradient-actual)" />

          {/* Stroke Lines */}
          <motion.path
            d={expectedPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d={actualPath}
            fill="none"
            stroke={showAnomaly ? "#ef4444" : "#8b5cf6"}
            strokeWidth="1.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* X Axis months */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            return (
              <text
                key={d.month}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[9px] font-sans fill-neutral-400 font-medium"
              >
                {d.month}
              </text>
            );
          })}

          {/* Interactive hover zones */}
          {data.map((_, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x - chartWidth / (2 * (data.length - 1))}
                  y={paddingTop}
                  width={chartWidth / (data.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                />

                {hoveredIndex === i && (
                  <>
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    <circle cx={x} cy={expectedCoords[i].y} r="4" fill="#10b981" stroke="#060a08" strokeWidth="1.5" />
                    <circle cx={x} cy={actualCoords[i].y} r="4" fill={showAnomaly ? "#ef4444" : "#8b5cf6"} stroke="#060a08" strokeWidth="1.5" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20 top-2 bg-neutral-900/95 border border-white/[0.08] rounded-xl p-3 shadow-2xl backdrop-blur-md text-[10px] font-mono text-neutral-300 min-w-[140px] pointer-events-none"
              style={{
                left: `${Math.min(
                  Math.max(
                    (hoveredIndex / (data.length - 1)) * 100 - 15,
                    5
                  ),
                  70
                )}%`,
              }}
            >
              <div className="text-white font-sans font-bold border-b border-white/5 pb-1 mb-1.5 uppercase text-[9px] tracking-wider text-emerald-400">
                {data[hoveredIndex].month} Auditing
              </div>
              <div className="flex justify-between gap-4 py-0.5">
                <span>Expected:</span>
                <span className="text-emerald-400 font-bold">{data[hoveredIndex].expected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4 py-0.5">
                <span>Observed:</span>
                <span className={`${showAnomaly ? "text-red-400" : "text-[#8b5cf6]"} font-bold`}>
                  {data[hoveredIndex].value.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-0.5 border-t border-white/5 mt-1 pt-1">
                <span>Delta:</span>
                <span className={`${showAnomaly ? "text-red-400 font-bold" : "text-emerald-400"}`}>
                  {((data[hoveredIndex].value - data[hoveredIndex].expected) * 100).toFixed(0)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Sapling Claims Verification (Claimed vs Verified Line Chart)
// ============================================================================
export type ClaimVerificationRow = {
  id: string;
  zone: string;
  location: string;
  claimed: number;
  verified: number;
  variance: number;
  percentVerified: number;
};

type SaplingClaimsChartProps = {
  data: ClaimVerificationRow[];
  activeClaimIndex: number | null;
  onSelectClaim: (index: number | null) => void;
};

export function SaplingClaimsChart({ data, activeClaimIndex, onSelectClaim }: SaplingClaimsChartProps) {
  const width = 500;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 10000; // max tree count

  const claimedCoords = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.claimed / maxVal) * chartHeight;
    return { x, y, val: d.claimed };
  });

  const verifiedCoords = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.verified / maxVal) * chartHeight;
    return { x, y, val: d.verified };
  });

  const claimedPath = getBezierPath(claimedCoords);
  const verifiedPath = getBezierPath(verifiedCoords);

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] font-sans text-neutral-400 select-none pb-2 justify-between">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-[#10b981]" />
            Claimed Saplings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-[#8b5cf6]" />
            Verified Canopy Count
          </span>
        </div>
      </div>

      <div className="relative flex-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const val = (i * maxVal) / 5;
            const y = paddingTop + chartHeight - (i / 5) * chartHeight;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-neutral-500 font-medium"
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Active Highlight vertical bar */}
          {activeClaimIndex !== null && (
            <rect
              x={claimedCoords[activeClaimIndex].x - chartWidth / (2 * (data.length - 1))}
              y={paddingTop - 5}
              width={chartWidth / (data.length - 1)}
              height={chartHeight + 10}
              fill="rgba(16, 185, 129, 0.03)"
              stroke="rgba(16, 185, 129, 0.12)"
              strokeWidth="0.8"
              rx="4"
            />
          )}

          {/* Stroke Lines */}
          <path d={claimedPath} fill="none" stroke="#10b981" strokeWidth="1.6" />
          <path d={verifiedPath} fill="none" stroke="#8b5cf6" strokeWidth="1.6" />

          {/* Circles */}
          {data.map((_, i) => {
            const isHovered = activeClaimIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={claimedCoords[i].x}
                  cy={claimedCoords[i].y}
                  r={isHovered ? "5" : "3"}
                  fill="#10b981"
                  stroke="#060a08"
                  strokeWidth={isHovered ? "2" : "1"}
                />
                <circle
                  cx={verifiedCoords[i].x}
                  cy={verifiedCoords[i].y}
                  r={isHovered ? "5" : "3"}
                  fill="#8b5cf6"
                  stroke="#060a08"
                  strokeWidth={isHovered ? "2" : "1"}
                />
              </g>
            );
          })}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            return (
              <text
                key={d.id}
                x={x}
                y={height - 8}
                textAnchor="middle"
                onMouseEnter={() => onSelectClaim(i)}
                onMouseLeave={() => onSelectClaim(null)}
                className={`text-[9.5px] font-sans font-medium transition-all cursor-pointer ${
                  activeClaimIndex === i ? "fill-[#bbfb1d] font-bold" : "fill-neutral-400"
                }`}
              >
                {d.zone}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Canopy Structure Radar Breakdown (Heptagon Radar Chart)
// ============================================================================
type CanopyRadarChartProps = {
  expected: number[];
  actual: number[];
};

export function CanopyRadarChart({ expected, actual }: CanopyRadarChartProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const categories = [
    { name: "Primary Forest", desc: "Old-growth crown" },
    { name: "Secondary Forest", desc: "Regrowth tree cover" },
    { name: "Riparian Corridors", desc: "Riverbanks mitigation" },
    { name: "Estuary Mangroves", desc: "Coastal carbon sinks" },
    { name: "Planted Saplings", desc: "Verification zones" },
    { name: "Wetland Margins", desc: "High water flora" },
    { name: "Degraded Savannah", desc: "Recovery grassland" },
  ];

  const size = 280;
  const center = size / 2;
  const maxVal = 100; // percent scale
  const radius = 80;

  const vertexAngles = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      return i * ((2 * Math.PI) / 7) - Math.PI / 2;
    });
  }, []);

  const getPoint = (index: number, val: number) => {
    const r = (Math.min(val, maxVal) / maxVal) * radius;
    const angle = vertexAngles[index];
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric heptagon grids
  const gridRings = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    return vertexAngles.map((angle) => {
      const r = scale * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  });

  const expectedPolygon = expected.map((val, i) => {
    const pt = getPoint(i, val);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const actualPolygon = actual.map((val, i) => {
    const pt = getPoint(i, val);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const labelOffsets = [
    { xAlign: "middle", yOffset: -12 },
    { xAlign: "start", yOffset: -4 },
    { xAlign: "start", yOffset: 8 },
    { xAlign: "middle", yOffset: 16 },
    { xAlign: "end", yOffset: 16 },
    { xAlign: "end", yOffset: 8 },
    { xAlign: "end", yOffset: -4 },
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2 select-none">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="glow-expected" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="glow-actual" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Rings */}
        {gridRings.map((pointsStr, i) => (
          <polygon
            key={i}
            points={pointsStr}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="0.8"
          />
        ))}

        {/* Radial guidelines */}
        {vertexAngles.map((angle, i) => {
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Polygons */}
        <polygon
          points={expectedPolygon}
          fill="url(#glow-expected)"
          stroke="#10b981"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          className="transition-all duration-300"
        />
        <polygon
          points={actualPolygon}
          fill="url(#glow-actual)"
          stroke="#8b5cf6"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          className="transition-all duration-300"
        />

        {/* Vertex nodes */}
        {categories.map((_, i) => {
          const ptExp = getPoint(i, expected[i]);
          const ptAct = getPoint(i, actual[i]);
          const isHovered = hoveredNode === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle cx={ptExp.x} cy={ptExp.y} r={isHovered ? 4.5 : 2.5} fill="#10b981" />
              <circle cx={ptAct.x} cy={ptAct.y} r={isHovered ? 4.5 : 2.5} fill="#8b5cf6" />
            </g>
          );
        })}

        {/* Text Labels */}
        {categories.map((cat, i) => {
          const angle = vertexAngles[i];
          const x = center + (radius + 8) * Math.cos(angle);
          const y = center + (radius + 8) * Math.sin(angle);
          const offset = labelOffsets[i];
          const delta = actual[i] - expected[i];

          return (
            <g key={i} className="text-[9px] font-sans font-medium">
              <text
                x={x}
                y={y + (offset?.yOffset || 0) - 5}
                textAnchor={offset?.xAlign as "middle" | "start" | "end"}
                fill="white"
                className="font-bold opacity-80"
              >
                {cat.name.split(" ")[0]}
              </text>
              <text
                x={x}
                y={y + (offset?.yOffset || 0) + 5}
                textAnchor={offset?.xAlign as "middle" | "start" | "end"}
                fill={delta < 0 ? "#f87171" : "#10b981"}
                className="font-mono font-semibold"
              >
                {actual[i]}% ({delta >= 0 ? "+" : ""}{delta.toFixed(0)}%)
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 bg-neutral-900/95 border border-white/[0.08] p-3 rounded-xl shadow-2xl backdrop-blur-md text-[10px] font-mono text-neutral-300 pointer-events-none min-w-[150px]"
          >
            <p className="text-white font-sans font-bold border-b border-white/5 pb-1 mb-1.5 uppercase text-[9px] tracking-wider text-emerald-400">
              {categories[hoveredNode].name}
            </p>
            <p className="text-[8.5px] text-neutral-400 mb-2 italic">{categories[hoveredNode].desc}</p>
            <div className="flex justify-between py-0.5">
              <span>Baseline target:</span>
              <span className="text-emerald-400 font-bold">{expected[hoveredNode]}%</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Observed canopy:</span>
              <span className="text-[#8b5cf6] font-bold">{actual[hoveredNode]}%</span>
            </div>
            <div className="flex justify-between py-0.5 border-t border-white/5 mt-1 pt-1">
              <span>Deviation:</span>
              <span className={actual[hoveredNode] < expected[hoveredNode] ? "text-red-400 font-bold" : "text-emerald-400"}>
                {actual[hoveredNode] - expected[hoveredNode]}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
