"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Eye,
  FileSearch,
  MapPin,
  Satellite,
  Siren,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "Multimodal RAG Parsing",
    description:
      "LlamaParse extracts claims, coordinates, and tree counts from complex multi-column CSR PDFs.",
  },
  {
    icon: Satellite,
    title: "Sentinel-2 Verification",
    description:
      "Automatically pulls open Copernicus satellite tiles for exact lat/lng coordinates from reports.",
  },
  {
    icon: Eye,
    title: "SAM 2 Canopy Segmentation",
    description:
      "Computer vision pipelines segment tree canopy and compute NDVI trends over time.",
  },
  {
    icon: Brain,
    title: "Agentic Workflows",
    description:
      "LangGraph orchestrates end-to-end auditing—from PDF upload to anomaly classification.",
  },
  {
    icon: MapPin,
    title: "Interactive Geo Dashboard",
    description:
      "Timeline slider reveals shifting forest density across 2024–2026 on an immersive map view.",
  },
  {
    icon: Siren,
    title: "Proactive Compliance Alerts",
    description:
      "Red alerts trigger automatic legal notices matched against environmental law databases.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            Platform Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-50 sm:text-4xl">
            Four layers. One immutable audit trail.
          </h2>
          <p className="mt-4 text-emerald-200/60">
            From PDF ingestion to blockchain-logged compliance notices—every
            step is automated and verifiable.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group h-full transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 transition-colors group-hover:bg-emerald-500/20">
                    <feature.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
