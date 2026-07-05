"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, X, Check, HelpCircle } from "lucide-react";

// ============================================================================
// HELPER: Smooth Bezier Path Generator for SVG
// ============================================================================
export function getBezierPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
    const cpY2 = p1.y;
    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }
  return path;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export type BudgetCategory = {
  id: string;
  name: string;
  budget: number;
  actual: number;
  variance: number;
  percentSpent: number;
  color: string;
};

// ============================================================================
// COMPONENT: Cash Flow Statement (Smooth Curves Area Chart)
// ============================================================================
export function CashFlowChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  
  // Data in Millions
  const inflow = [18, 21, 19, 24, 23, 20, 22];
  const outflow = [11, 15, 10, 13, 14, 16, 12];
  const netCash = [7, 6, 9, 11, 9, 4, 10];

  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 25;

  const getCoordinates = (data: number[]) => {
    return data.map((val, i) => {
      const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, val };
    });
  };

  const inflowCoords = getCoordinates(inflow);
  const outflowCoords = getCoordinates(outflow);
  const netCoords = getCoordinates(netCash);

  const inflowPath = getBezierPath(inflowCoords);
  const outflowPath = getBezierPath(outflowCoords);
  const netPath = getBezierPath(netCoords);

  const inflowArea = `${inflowPath} L ${inflowCoords[inflowCoords.length - 1].x} ${paddingTop + chartHeight} L ${inflowCoords[0].x} ${paddingTop + chartHeight} Z`;
  const outflowArea = `${outflowPath} L ${outflowCoords[outflowCoords.length - 1].x} ${paddingTop + chartHeight} L ${outflowCoords[0].x} ${paddingTop + chartHeight} Z`;
  const netArea = `${netPath} L ${netCoords[netCoords.length - 1].x} ${paddingTop + chartHeight} L ${netCoords[0].x} ${paddingTop + chartHeight} Z`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Chart Legend */}
      <div className="flex items-center gap-6 text-[11px] font-sans text-neutral-400 select-none pb-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          Inflow
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
          Outflow
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
          Net Cash
        </span>
      </div>

      <div className="relative flex-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradient-inflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-outflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-net" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

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
                  {val}M
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={inflowArea} fill="url(#gradient-inflow)" />
          <path d={outflowArea} fill="url(#gradient-outflow)" />
          <path d={netArea} fill="url(#gradient-net)" />

          {/* Stroke Lines */}
          <motion.path
            d={inflowPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d={outflowPath}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d={netPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* X Axis labels */}
          {months.map((m, i) => {
            const x = paddingLeft + (i / (months.length - 1)) * chartWidth;
            return (
              <text
                key={m}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[9px] font-sans fill-neutral-400 font-medium"
              >
                {m}
              </text>
            );
          })}

          {/* Interactive Hover Guides & Circles */}
          {months.map((_, i) => {
            const x = paddingLeft + (i / (months.length - 1)) * chartWidth;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover bar */}
                <rect
                  x={x - chartWidth / 14}
                  y={paddingTop}
                  width={chartWidth / 7}
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
                    <circle cx={x} cy={inflowCoords[i].y} r="4.5" fill="#10b981" stroke="#060a08" strokeWidth="1.5" />
                    <circle cx={x} cy={outflowCoords[i].y} r="4.5" fill="#8b5cf6" stroke="#060a08" strokeWidth="1.5" />
                    <circle cx={x} cy={netCoords[i].y} r="4.5" fill="#ef4444" stroke="#060a08" strokeWidth="1.5" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Live Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20 top-2 bg-neutral-900/95 border border-white/[0.08] rounded-xl p-3 shadow-2xl backdrop-blur-md text-[10px] font-mono text-neutral-300 min-w-[120px] pointer-events-none"
              style={{
                left: `${Math.min(
                  Math.max(
                    (hoveredIndex / 6) * 100 - 15,
                    5
                  ),
                  75
                )}%`,
              }}
            >
              <div className="text-white font-sans font-bold border-b border-white/5 pb-1 mb-1.5 uppercase text-[9px] tracking-wider text-emerald-400">
                {months[hoveredIndex]} Metrics
              </div>
              <div className="flex justify-between gap-4 py-0.5">
                <span>Inflow:</span>
                <span className="text-emerald-400 font-bold">${inflow[hoveredIndex]}M</span>
              </div>
              <div className="flex justify-between gap-4 py-0.5">
                <span>Outflow:</span>
                <span className="text-[#8b5cf6] font-bold">${outflow[hoveredIndex]}M</span>
              </div>
              <div className="flex justify-between gap-4 py-0.5">
                <span>Net Cash:</span>
                <span className="text-red-400 font-bold">${netCash[hoveredIndex]}M</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Budget vs Actuals Chart + Interactive Category Highlights
// ============================================================================
type BudgetVsActualsProps = {
  data: BudgetCategory[];
  activeCategoryIndex: number | null;
  onSelectCategory: (index: number | null) => void;
};

export function BudgetVsActualsChart({ data, activeCategoryIndex, onSelectCategory }: BudgetVsActualsProps) {
  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 10; // Millions

  // Map category values to coords
  const budgetCoords = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.budget / 1000000 / maxVal) * chartHeight;
    return { x, y, val: d.budget };
  });

  const actualCoords = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.actual / 1000000 / maxVal) * chartHeight;
    return { x, y, val: d.actual };
  });

  const budgetPath = getBezierPath(budgetCoords);
  const actualPath = getBezierPath(actualCoords);

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] font-sans text-neutral-400 select-none pb-2 justify-between">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-[#bbfb1d]" />
            Budgeted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-[#8b5cf6]" />
            Actual
          </span>
        </div>
        <span className="text-[10px] text-neutral-500 font-mono">
          Hover rows or points to highlight
        </span>
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
                  {val}M
                </text>
              </g>
            );
          })}

          {/* Active Category Selection Highlight Box */}
          {activeCategoryIndex !== null && (
            <rect
              x={budgetCoords[activeCategoryIndex].x - chartWidth / (2 * (data.length - 1))}
              y={paddingTop - 5}
              width={chartWidth / (data.length - 1)}
              height={chartHeight + 10}
              fill="rgba(187, 251, 29, 0.04)"
              stroke="rgba(187, 251, 29, 0.15)"
              strokeWidth="0.8"
              rx="4"
            />
          )}

          {/* Stroke Lines */}
          <path d={budgetPath} fill="none" stroke="#bbfb1d" strokeWidth="1.6" />
          <path d={actualPath} fill="none" stroke="#8b5cf6" strokeWidth="1.6" />

          {/* Circles */}
          {data.map((_, i) => {
            const isHovered = activeCategoryIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={budgetCoords[i].x}
                  cy={budgetCoords[i].y}
                  r={isHovered ? "5" : "3"}
                  fill="#bbfb1d"
                  stroke="#060a08"
                  strokeWidth={isHovered ? "2" : "1"}
                  className="transition-all duration-200"
                />
                <circle
                  cx={actualCoords[i].x}
                  cy={actualCoords[i].y}
                  r={isHovered ? "5" : "3"}
                  fill="#8b5cf6"
                  stroke="#060a08"
                  strokeWidth={isHovered ? "2" : "1"}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* X Axis Category Labels */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            const labelParts = d.name.split(" ");
            const shortLabel = labelParts[0]; // just show first word to avoid overlap
            return (
              <text
                key={d.id}
                x={x}
                y={height - 8}
                textAnchor="middle"
                onMouseEnter={() => onSelectCategory(i)}
                onMouseLeave={() => onSelectCategory(null)}
                className={`text-[9px] font-sans font-medium transition-all cursor-pointer ${
                  activeCategoryIndex === i ? "fill-[#bbfb1d] font-bold" : "fill-neutral-400"
                }`}
              >
                {shortLabel}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Budget Breakdown (Heptagonal Radar Chart)
// ============================================================================
type RadarChartProps = {
  data: BudgetCategory[];
};

export function BudgetRadarChart({ data }: RadarChartProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const size = 280;
  const center = size / 2;
  const maxVal = 10000000; // 10M scale
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

  // Generate background rings polygons
  const gridRings = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    return vertexAngles.map((angle) => {
      const r = scale * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  });

  const budgetPolygonPoints = data.map((d, i) => {
    const pt = getPoint(i, d.budget);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const actualPolygonPoints = data.map((d, i) => {
    const pt = getPoint(i, d.actual);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // Labels positioning offset multipliers
  const labelOffsets = [
    { xAlign: "middle", yOffset: -12 }, // Top
    { xAlign: "start", yOffset: -4 },
    { xAlign: "start", yOffset: 8 },
    { xAlign: "middle", yOffset: 16 }, // Bottom Right
    { xAlign: "end", yOffset: 16 }, // Bottom Left
    { xAlign: "end", yOffset: 8 },
    { xAlign: "end", yOffset: -4 },
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2 select-none">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radar-glow-budget" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bbfb1d" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#bbfb1d" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="radar-glow-actual" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Concentric Heptagon grid rings */}
        {gridRings.map((pointsStr, i) => (
          <polygon
            key={i}
            points={pointsStr}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="0.8"
          />
        ))}

        {/* Radial lines from center to vertices */}
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

        {/* Filled polygon for Budget */}
        <polygon
          points={budgetPolygonPoints}
          fill="url(#radar-glow-budget)"
          stroke="#bbfb1d"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          className="transition-all duration-300"
        />

        {/* Filled polygon for Actual */}
        <polygon
          points={actualPolygonPoints}
          fill="url(#radar-glow-actual)"
          stroke="#8b5cf6"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          className="transition-all duration-300"
        />

        {/* Vertex interactive target circles */}
        {data.map((d, i) => {
          const ptBudget = getPoint(i, d.budget);
          const ptActual = getPoint(i, d.actual);
          const isHovered = hoveredNode === i;
          return (
            <g
              key={d.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle cx={ptBudget.x} cy={ptBudget.y} r={isHovered ? 4.5 : 2.5} fill="#bbfb1d" />
              <circle cx={ptActual.x} cy={ptActual.y} r={isHovered ? 4.5 : 2.5} fill="#8b5cf6" />
            </g>
          );
        })}

        {/* Labels at heptagon vertices */}
        {data.map((d, i) => {
          const angle = vertexAngles[i];
          const x = center + (radius + 8) * Math.cos(angle);
          const y = center + (radius + 8) * Math.sin(angle);
          const offset = labelOffsets[i];
          const isNegative = d.variance < 0;

          return (
            <g key={d.id} className="text-[9px] font-sans font-medium">
              {/* Category Name */}
              <text
                x={x}
                y={y + (offset?.yOffset || 0) - 5}
                textAnchor={offset?.xAlign as "middle" | "start" | "end"}
                fill="white"
                className="font-bold opacity-80"
              >
                {d.name.split(" ")[0]}
              </text>
              {/* Value and Variance */}
              <text
                x={x}
                y={y + (offset?.yOffset || 0) + 5}
                textAnchor={offset?.xAlign as "middle" | "start" | "end"}
                fill={isNegative ? "#f87171" : "#10b981"}
                className="font-mono font-semibold"
              >
                {(d.actual / 1000000).toFixed(1)}M ({isNegative ? "" : "+"}{(d.percentSpent - 100).toFixed(0)}%)
              </text>
            </g>
          );
        })}
      </svg>

      {/* Mini-Tooltip for Radar nodes */}
      <AnimatePresence>
        {hoveredNode !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 bg-neutral-900/95 border border-white/[0.08] p-3 rounded-xl shadow-2xl backdrop-blur-md text-[10px] font-mono text-neutral-300 pointer-events-none min-w-[140px]"
          >
            <p className="text-white font-sans font-bold border-b border-white/5 pb-1 mb-1.5 uppercase text-[9px] tracking-wider text-emerald-400">
              {data[hoveredNode].name}
            </p>
            <div className="flex justify-between py-0.5">
              <span>Budget:</span>
              <span className="text-[#bbfb1d] font-bold">
                ${(data[hoveredNode].budget / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Actual:</span>
              <span className="text-[#8b5cf6] font-bold">
                ${(data[hoveredNode].actual / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Variance:</span>
              <span className={data[hoveredNode].variance < 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {data[hoveredNode].variance < 0 ? "-" : "+"}${Math.abs(data[hoveredNode].variance / 1000000).toFixed(2)}M
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENT: Budget Allocation Sliders Drawer/Modal
// ============================================================================
type BudgetAllocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: BudgetCategory[];
  onUpdateBudget: (id: string, value: number) => void;
};

export function BudgetAllocationModal({
  isOpen,
  onClose,
  categories,
  onUpdateBudget,
}: BudgetAllocationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#040705] backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0a0f0d] border-l border-white/[0.08] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                <div>
                  <h3 className="text-md font-bold text-white font-sans flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[#bbfb1d]" />
                    Adjust Budget Allocation
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    Real-time visual scenario calibration
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/[0.08] p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sliders list */}
              <div className="space-y-6">
                {categories.map((cat) => {
                  const minVal = 500000;
                  const maxVal = 10000000;
                  return (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-white font-medium">{cat.name}</span>
                        <span className="font-mono text-[#bbfb1d] font-bold">
                          ${(cat.budget / 1000000).toFixed(2)}M
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <input
                          type="range"
                          min={minVal}
                          max={maxVal}
                          step={100000}
                          value={cat.budget}
                          onChange={(e) => onUpdateBudget(cat.id, Number(e.target.value))}
                          className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#bbfb1d] focus:outline-none"
                        />
                      </div>
                      
                      <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                        <span>$0.5M</span>
                        <span>$10M</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Panel Actions */}
            <div className="border-t border-white/[0.08] pt-6 mt-6">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 mb-4 text-[10px] text-neutral-400 font-mono flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Calibrating allocating variables immediately propagates calculations into the charts, variances, and polygonal models across the dashboard.
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#bbfb1d] hover:bg-[#a6e01a] text-[#060a08] font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(187,251,29,0.2)]"
              >
                <Check className="h-4 w-4" /> Save Scenario Allocation
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
