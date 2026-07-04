"use client";

import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

const years = [2024, 2025, 2026];

type TimelineSliderProps = {
  year: number;
  onYearChange: (year: number) => void;
};

export function TimelineSlider({ year, onYearChange }: TimelineSliderProps) {
  const index = years.indexOf(year);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-emerald-100">
          Forest Density Timeline
        </p>
        <motion.span
          key={year}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-300 ring-1 ring-emerald-500/25"
        >
          {year}
        </motion.span>
      </div>

      <Slider
        value={[index >= 0 ? index : 0]}
        min={0}
        max={years.length - 1}
        step={1}
        onValueChange={([val]) => onYearChange(years[val])}
      />

      <div className="flex justify-between text-xs text-emerald-200/40">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => onYearChange(y)}
            className={`transition-colors ${
              y === year ? "text-emerald-400" : "hover:text-emerald-300"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
