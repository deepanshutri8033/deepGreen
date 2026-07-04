"use client";

import { motion } from "framer-motion";
import { workflowSteps } from "@/lib/mock-data";

export function WorkflowSection() {
  return (
    <section id="workflow" className="border-y border-emerald-500/10 bg-emerald-950/20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            Audit Workflow
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-50 sm:text-4xl">
            From PDF upload to red alert in minutes
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-transparent md:left-1/2 md:block md:-translate-x-px" />

          <div className="space-y-8 md:space-y-0">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden flex-1 md:block" />
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xl font-bold text-emerald-300 md:absolute md:left-1/2 md:-translate-x-1/2">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div
                    className={`glass-panel rounded-2xl p-6 ${
                      step.step === 5 ? "glow-red border-red-500/30" : "glow-emerald"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold ${
                        step.step === 5 ? "text-red-300" : "text-emerald-100"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-emerald-200/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
