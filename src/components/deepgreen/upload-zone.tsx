"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Loader2, CheckCircle2 } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type UploadZoneProps = {
  onUploadComplete: () => void;
  isProcessing: boolean;
};

export function UploadZone({ onUploadComplete, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.includes("pdf")) return;
      setFileName(file.name);
      setUploaded(true);
      onUploadComplete();
    },
    [onUploadComplete]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
        isDragging
          ? "border-emerald-400 bg-emerald-500/10"
          : "border-emerald-500/20 bg-emerald-950/30",
        uploaded && "border-emerald-500/40"
      )}
    >
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            <p className="text-sm font-medium text-emerald-200">
              RAG layer parsing PDF...
            </p>
            <p className="text-xs text-emerald-200/50">
              Extracting coordinates & tree count claims
            </p>
          </motion.div>
        ) : uploaded ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-100">{fileName}</p>
            <p className="text-xs text-emerald-200/50">Report indexed successfully</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
              <FileUp className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-100">
                Drop Sustainability PDF here
              </p>
              <p className="mt-1 text-xs text-emerald-200/50">
                Annual CSR / Environmental Report · PDF only
              </p>
            </div>
            <label className="mt-2 cursor-pointer rounded-xl bg-emerald-500/15 px-4 py-2 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/25 transition hover:bg-emerald-500/25">
              Browse Files
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
