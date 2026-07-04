"use client";

import { motion } from "framer-motion";
import { FileCheck, Hash } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AuditWorkflowProps = {
  step: number;
};

const steps = [
  "Uploading PDF",
  "RAG Parsing Claims",
  "Fetching Sentinel-2 Tiles",
  "Running NDVI Analysis",
  "Generating Compliance Notice",
];

export function AuditWorkflowBar({ step }: AuditWorkflowProps) {
  const progress = Math.min((step / steps.length) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-100">
            Audit Pipeline
          </span>
        </div>
        <span className="text-xs text-emerald-200/50">
          Step {Math.min(step, steps.length)} of {steps.length}
        </span>
      </div>

      <Progress value={progress} className="mt-4" />

      <div className="mt-3 flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`rounded-lg px-2.5 py-1 text-[11px] transition-all ${
              i < step
                ? "bg-emerald-500/20 text-emerald-300"
                : i === step
                  ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/30"
                  : "text-emerald-200/30"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {step >= steps.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
        >
          <Hash className="h-3.5 w-3.5" />
          Audit hash logged to Polygon L2: 0x7f3a...e9c2
        </motion.div>
      )}
    </motion.div>
  );
}
