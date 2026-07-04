"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/80 via-[#0a1410] to-[#060a08] p-10 sm:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="relative mx-auto max-w-2xl text-center">
            <Leaf className="mx-auto h-10 w-10 text-emerald-400" />
            <h2 className="mt-6 text-3xl font-bold text-emerald-50 sm:text-4xl">
              Stop phantom forests. Start verifying.
            </h2>
            <p className="mt-4 text-emerald-200/60">
              Upload a sustainability report and watch DeepGreen cross-examine
              every claim against live satellite ground truth.
            </p>
            <Button size="lg" className="mt-8 min-w-[220px]" asChild>
              <Link href="/dashboard">
                Open Audit Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-emerald-500/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-emerald-200/50">
          <Leaf className="h-4 w-4 text-emerald-500" />
          DeepGreen · AI Satellite Auditing Platform
        </div>
        <p className="text-xs text-emerald-200/30">
          Frontend demo · Backend integration ready
        </p>
      </div>
    </footer>
  );
}
