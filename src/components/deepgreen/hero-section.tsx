"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Radar,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const floatingIcons = [
  { Icon: Globe2, x: "12%", y: "28%", delay: 0 },
  { Icon: Radar, x: "78%", y: "22%", delay: 0.2 },
  { Icon: ShieldAlert, x: "85%", y: "62%", delay: 0.4 },
  { Icon: Sparkles, x: "8%", y: "68%", delay: 0.3 },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_55%)]" />

      {floatingIcons.map(({ Icon, x, y, delay }) => (
        <motion.div
          key={Icon.displayName ?? Icon.name}
          className="pointer-events-none absolute hidden lg:block"
          style={{ left: x, top: y }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-emerald-400/80" />
          </div>
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            AI-Powered Satellite Auditing
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-emerald-50 sm:text-6xl lg:text-7xl">
            We don&apos;t just read reports—{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              we verify them against ground truth
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-200/60 sm:text-xl">
            DeepGreen cross-examines corporate sustainability claims against
            live Sentinel-2 satellite data—fully automated, without any manual
            satellite analyst.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="/dashboard">
                Start Auditing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#workflow">See How It Works</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="glass-panel glow-emerald overflow-hidden rounded-3xl p-1">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.35rem] bg-[#0a1410]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.25),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(5,150,105,0.15),transparent_40%)]" />
              <div className="absolute inset-0 opacity-40">
                <svg className="h-full w-full" viewBox="0 0 800 450">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="800" height="450" fill="url(#grid)" />
                  <ellipse cx="280" cy="220" rx="120" ry="80" fill="rgba(16,185,129,0.2)" />
                  <ellipse cx="520" cy="180" rx="90" ry="60" fill="rgba(34,197,94,0.15)" />
                  <circle cx="280" cy="220" r="6" fill="#ef4444" className="animate-pulse" />
                  <circle cx="520" cy="180" r="4" fill="#10b981" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div className="glass-panel rounded-xl px-4 py-3 text-left">
                  <p className="text-xs text-emerald-400/70">Live Audit</p>
                  <p className="text-sm font-medium text-emerald-100">
                    Amazon Zone 4 · NDVI −12%
                  </p>
                </div>
                <div className="glass-panel rounded-xl px-4 py-3">
                  <p className="text-xs text-red-400">Anomaly Detected</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
