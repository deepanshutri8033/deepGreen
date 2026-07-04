"use client";

import { motion } from "framer-motion";

const layers = [
  {
    name: "Frontend / Visualization",
    tech: "Next.js 15 · Tailwind · shadcn/ui · Framer Motion · Mapbox",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    name: "Retrieval (RAG) Layer",
    tech: "LangChain · LlamaParse · LangGraph · Pinecone · ChromaDB",
    color: "from-teal-500/20 to-teal-500/5",
  },
  {
    name: "Vision & Analysis Layer",
    tech: "FastAPI · Sentinel-2 · SAM 2 · TorchGeo · Rasterio",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    name: "Proactive Action & Compliance",
    tech: "Supabase · Redis · Celery · Twilio · Polygon L2",
    color: "from-lime-500/20 to-lime-500/5",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            System Architecture
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-50 sm:text-4xl">
            Built for national-scale verification
          </h2>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel rounded-2xl bg-gradient-to-r ${layer.color} p-6`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-bold text-emerald-300">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-emerald-100">{layer.name}</h3>
                  <p className="mt-1 text-sm text-emerald-200/50">{layer.tech}</p>
                </div>
              </div>
              {index < layers.length - 1 && (
                <div className="ml-4 mt-4 flex justify-center">
                  <div className="h-6 w-px bg-emerald-500/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
