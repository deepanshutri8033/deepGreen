"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { ArrowLeft, BookOpen, Cpu, Leaf, Brain, ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/deepgreen/navbar";
import { Footer } from "@/components/deepgreen/cta-footer";

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";
const SPOTLIGHT_R = 260;



export default function DocsPage() {
  // NDVI Math Simulator States
  const [nir, setNir] = useState(0.8);
  const [red, setRed] = useState(0.1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mouse Tracking States & Refs
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
      setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Calculate NDVI
  const divisor = nir + red;
  const ndvi = divisor > 0 ? (nir - red) / divisor : 0;

  // Determine Vegetation Status (adapted to warm orange/amber palette)
  const getStatus = (val: number) => {
    if (val > 0.6) return { text: "Lush Forest / Dense Canopy Cover", color: "text-[#e8702a]", bg: "bg-[#e8702a]/10", border: "border-[#e8702a]/30" };
    if (val > 0.4) return { text: "Moderate Canopy / Sparse Vegetation", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    if (val > 0.2) return { text: "Shrubland / Degraded Cover / Saplings", color: "text-yellow-400/80", bg: "bg-yellow-500/5", border: "border-yellow-500/15" };
    if (val > 0.0) return { text: "Barren Ground / Complete Deforestation", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" };
    return { text: "Water Surface / Cloud Cover / Rock", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  };

  const status = getStatus(ndvi);

  return (
    <PageTransition>
      <div 
        className="min-h-screen bg-white tracking-[-0.02em] overflow-x-hidden" 
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Navbar />

        {/* ============================================================== */}
        {/* LITHOS INTERACTIVE SPOTLIGHT HERO SECTION                       */}
        {/* ============================================================== */}
        <section 
          className="relative w-full overflow-hidden h-screen bg-black"
          style={{ height: "100dvh" }}
        >
          {/* 1. Base Image Layer (z-10) */}
          <div 
            className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
            style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
          />

          {/* 2. Reveal Image Spotlight Layer (z-30) */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
            style={{
              backgroundImage: `url(${BG_IMAGE_2})`,
              maskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorPos.x}px ${cursorPos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorPos.x}px ${cursorPos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />

          {/* 3. absolute Heading Overlay (z-50) */}
          <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
            <h1 className="text-white leading-[0.95]">
              <span 
                className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
                style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
              >
                Layers hold
              </span>
              <span 
                className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
                style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
              >
                tales of time
              </span>
            </h1>
          </div>

          {/* 4. Bottom-Left Paragraph (z-50) */}
          <div 
            className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
            style={{ animationDelay: "0.7s" }}
          >
            <p className="text-sm text-white/80 leading-relaxed">
              Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
            </p>
          </div>

          {/* 5. Bottom-Right Controls Block (z-50) */}
          <div 
            className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
            style={{ animationDelay: "0.85s" }}
          >
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
            </p>
            <button 
              onClick={() => document.getElementById("methodology-docs")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 cursor-pointer"
            >
              Start Digging
            </button>
          </div>
        </section>

        {/* ============================================================== */}
        {/* DEEPGREEN SCIENTIFIC METHODOLOGY CONTENT SECTION                */}
        {/* Adjusted to be consistent with the Lithos brand colors         */}
        {/* ============================================================== */}
        <div 
          id="methodology-docs"
          className="relative bg-[#080808] text-[#f5f5f7] py-24 px-6 relative overflow-hidden border-t border-white/[0.04]"
        >
          {/* Ambient Glows: Faded warm amber glow instead of emerald */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#e8702a]/5 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8 mb-12">
              <div className="flex items-center gap-3">
                <Link 
                  href="/" 
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-[#e8702a] border border-white/[0.08] transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#e8702a]" />
                    <span className="text-[10px] tracking-[0.25em] font-semibold text-[#e8702a] uppercase font-mono">
                      DeepGreen Lab Docs
                    </span>
                  </div>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                    Scientific Methodology
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-white/[0.08] text-neutral-300 hover:bg-white/[0.05] hover:text-white" asChild>
                  <Link href="/">Homepage</Link>
                </Button>
                <Button className="bg-[#e8702a] hover:bg-[#d2611f]" asChild>
                  <Link href="/dashboard">Launch Sandbox</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-12">
              {/* 1. Scientific NDVI Section */}
              <section className="bg-neutral-900/40 border border-white/[0.06] hover:border-[#e8702a]/20 shadow-[0_0_30px_rgba(232,112,42,0.01)] rounded-3xl p-6 sm:p-8 space-y-6 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8702a]/10">
                    <Leaf className="h-5 w-5 text-[#e8702a]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">
                      1. NDVI Index Algorithm
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">Normalized Difference Vegetation Index</p>
                  </div>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  Vegetation absorbs red light for photosynthesis but highly reflects Near-Infrared (NIR) light due to its cellular structure. By tracking these wavelengths, we obtain a precise index representing canopy density.
                </p>

                {/* Formula Block */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] text-[#e8702a]/70 uppercase tracking-widest mb-3 font-mono">Equation</p>
                  <div className="text-xl sm:text-2xl font-serif text-neutral-100 flex items-center gap-2">
                    <span>NDVI</span>
                    <span>=</span>
                    <div className="flex flex-col items-center font-sans">
                      <span className="border-b border-white/[0.12] px-3">NIR − Red</span>
                      <span className="px-3">NIR + Red</span>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE SIMULATOR */}
                <div className="border border-white/[0.06] rounded-2xl p-6 bg-white/[0.02] space-y-6">
                  <h3 className="text-xs font-semibold text-[#e8702a] uppercase tracking-widest font-mono">
                    Live NDVI Calculator
                  </h3>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* NIR Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 font-medium">Near-Infrared reflection (NIR)</span>
                        <span className="text-[#e8702a] font-bold font-mono">{nir.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={nir}
                        onChange={(e) => setNir(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8702a]"
                      />
                    </div>

                    {/* Red Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 font-medium">Red reflection (Red)</span>
                        <span className="text-[#e8702a] font-bold font-mono">{red.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={red}
                        onChange={(e) => setRed(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#e8702a]"
                      />
                    </div>
                  </div>

                  {/* Calculation Output Panel */}
                  <div className={`p-4 rounded-xl border ${status.border} ${status.bg} transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans`}>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-mono">Calculated Index</span>
                      <span className="text-3xl font-black text-white font-mono">{ndvi.toFixed(3)}</span>
                    </div>
                    <div className="text-right sm:text-right text-left">
                      <span className="text-[10px] text-neutral-400 block font-mono">Canopy Status</span>
                      <span className={`text-sm font-bold ${status.color}`}>{status.text}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. RAG & AI Orchestration */}
              <section className="bg-neutral-900/40 border border-white/[0.06] hover:border-[#e8702a]/20 shadow-[0_0_30px_rgba(232,112,42,0.01)] rounded-3xl p-6 sm:p-8 space-y-6 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8702a]/10">
                    <Brain className="h-5 w-5 text-[#e8702a]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">
                      2. Multimodal RAG Ingestion
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">Retrieval-Augmented Generation Layer</p>
                  </div>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  When a sustainability report PDF is parsed, we run multi-column text extraction using LlamaParse and pass raw text blocks into vector embeddings. LLMs extract claimed GPS polygons, tree planting volumes, and schedule metrics.
                </p>

                {/* RAG Workflow Map */}
                <div className="grid gap-4 sm:grid-cols-3 text-center text-xs font-sans">
                  <div className="border border-white/[0.06] bg-black/40 p-4 rounded-2xl">
                    <span className="text-[#e8702a] font-mono text-sm block mb-1">01 / Ingestion</span>
                    <p className="text-neutral-400 text-[11px]">PDF sustainability reports parsed with LlamaParse Layout</p>
                  </div>
                  <div className="border border-white/[0.06] bg-black/40 p-4 rounded-2xl">
                    <span className="text-[#e8702a] font-mono text-sm block mb-1">02 / Vectors</span>
                    <p className="text-neutral-400 text-[11px]">Embeddings stored in Qdrant Vector database</p>
                  </div>
                  <div className="border border-white/[0.06] bg-black/40 p-4 rounded-2xl">
                    <span className="text-[#e8702a] font-mono text-sm block mb-1">03 / Polygons</span>
                    <p className="text-neutral-400 text-[11px]">GPT-4o extracts Lat/Lng target coordinates for auditing</p>
                  </div>
                </div>
              </section>

              {/* 3. Computer Vision Verification */}
              <section className="bg-neutral-900/40 border border-white/[0.06] hover:border-[#e8702a]/20 shadow-[0_0_30px_rgba(232,112,42,0.01)] rounded-3xl p-6 sm:p-8 space-y-6 font-sans transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8702a]/10">
                    <Cpu className="h-5 w-5 text-[#e8702a]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">
                      3. Computer Vision & SAM 2
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">Segment Anything Model & Sentinel-2</p>
                  </div>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  Rather than relying on noisy pixel calculations alone, DeepGreen runs segmented tree canopy evaluations using Meta&apos;s Segment Anything Model (SAM 2). This lets us count tree boundaries and compare crown areas in 2024 vs 2026.
                </p>

                <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#e8702a]" />
                    <span className="font-semibold text-neutral-200">Immutable Audit Log</span>
                  </div>
                  <span className="text-[#e8702a] font-mono text-[10px] font-semibold">VERIFIED OK • COP28 COMPLIANT</span>
                </div>
              </section>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}
