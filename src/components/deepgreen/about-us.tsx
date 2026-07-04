"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4";

export function AboutUs() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardsTriggerRef = useRef<HTMLDivElement | null>(null);
  const fixedCardsRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const sectionThreeRef = useRef<HTMLDivElement | null>(null);
  const sectionThreeInnerRef = useRef<HTMLDivElement | null>(null);

  const [loadingFrames, setLoadingFrames] = useState(true);
  const [framesCount, setFramesCount] = useState(0);
  const [useFallbackVideo, setUseFallbackVideo] = useState(false);

  // Scroll Video frames and status
  const framesRef = useRef<ImageBitmap[]>([]);
  const framesReadyRef = useRef(false);
  const lastFrameIdxRef = useRef(-1);
  const videoSeekingRef = useRef(false);

  // 1. FRAME EXTRACTION AND RENDERING
  useEffect(() => {
    const canvas = canvasRef.current;
    const videoFallback = fallbackVideoRef.current;
    if (!canvas || !videoFallback) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDestroyed = false;

    // Sizing canvas to match the native frame resolution.
    // CSS object-fit: cover handles the rendering aspect ratio scaling on the GPU.
    const resizeCanvas = (width: number, height: number) => {
      if (!canvas) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const drawFrame = (frame: ImageBitmap) => {
      if (!canvas || !ctx) return;
      resizeCanvas(frame.width, frame.height);
      ctx.clearRect(0, 0, frame.width, frame.height);
      ctx.drawImage(frame, 0, 0);
    };

    // Calculate scroll bounds
    const getScrollBounds = () => {
      const vh = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      return { start: vh * 0.2, end: docHeight - vh };
    };

    const getProgress = () => {
      const { start, end } = getScrollBounds();
      const range = end - start;
      if (range <= 0) return 0;
      return Math.max(0, Math.min(1, (window.scrollY - start) / range));
    };

    // Frame preloading function
    const extractFrames = async () => {
      let tempVideoEl: HTMLVideoElement | null = null;
      try {
        const response = await fetch(VIDEO_URL, { mode: "cors" });
        if (!response.ok) throw new Error("CORS fetch failed");
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        tempVideoEl = document.createElement("video");
        tempVideoEl.muted = true;
        tempVideoEl.playsInline = true;
        tempVideoEl.crossOrigin = "anonymous";
        tempVideoEl.preload = "auto";
        // Force rendering process by attaching to DOM temporarily
        tempVideoEl.style.position = "fixed";
        tempVideoEl.style.top = "0";
        tempVideoEl.style.left = "0";
        tempVideoEl.style.width = "1px";
        tempVideoEl.style.height = "1px";
        tempVideoEl.style.opacity = "0";
        tempVideoEl.style.pointerEvents = "none";
        document.body.appendChild(tempVideoEl);
        tempVideoEl.src = objectUrl;

        const video = tempVideoEl;

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error("Video load error"));
          setTimeout(() => reject(new Error("Video metadata timeout")), 15000);
        });

        if (isDestroyed) return;

        // Downscale width to 960px to decrease canvas memory and boost performance
        const scale = Math.min(1, 960 / video.videoWidth);
        const scaledWidth = Math.round(video.videoWidth * scale);
        const scaledHeight = Math.round(video.videoHeight * scale);
        
        // Limit frames count to 75 to double speed up loading and scrolling processing
        const totalFrames = Math.max(30, Math.min(75, Math.round(video.duration * 15)));

        setFramesCount(totalFrames);

        const loadedFrames: ImageBitmap[] = [];

        for (let i = 0; i < totalFrames; i++) {
          if (isDestroyed) return;
          const time = (i / (totalFrames - 1)) * (video.duration - 0.05);
          video.currentTime = time;

          await new Promise<void>((resolve, reject) => {
            const onSeeked = () => {
              video.removeEventListener("seeked", onSeeked);
              resolve();
            };
            video.addEventListener("seeked", onSeeked);
            setTimeout(() => {
              video.removeEventListener("seeked", onSeeked);
              reject(new Error("Seek timeout"));
            }, 3000);
          });

          const bitmap = await createImageBitmap(video, {
            resizeWidth: scaledWidth,
            resizeHeight: scaledHeight,
          });
          loadedFrames.push(bitmap);
        }

        if (loadedFrames.length > 0 && !isDestroyed) {
          framesRef.current = loadedFrames;
          framesReadyRef.current = true;
          setLoadingFrames(false);
          canvas.style.visibility = "visible";
          if (videoFallback) videoFallback.style.display = "none";
        }
        URL.revokeObjectURL(objectUrl);
      } catch (e) {
        console.warn("Failed to extract frames, falling back to direct video seeking:", e);
        if (!isDestroyed) {
          setLoadingFrames(false);
          setUseFallbackVideo(true);
          canvas.style.display = "none";
          if (videoFallback) {
            videoFallback.style.display = "block";
            videoFallback.style.visibility = "visible";
          }
        }
      } finally {
        if (tempVideoEl && tempVideoEl.parentNode) {
          tempVideoEl.parentNode.removeChild(tempVideoEl);
        }
      }
    };

    // Scrub ticker using requestAnimationFrame
    let rAFId: number;
    const tick = () => {
      const progress = getProgress();
      
      if (framesReadyRef.current && framesRef.current.length > 0) {
        const idx = Math.round(progress * (framesRef.current.length - 1));
        if (idx !== lastFrameIdxRef.current) {
          lastFrameIdxRef.current = idx;
          const frame = framesRef.current[idx];
          if (frame) drawFrame(frame);
        }
      } else if (
        videoFallback &&
        videoFallback.duration &&
        isFinite(videoFallback.duration) &&
        videoFallback.readyState >= 1
      ) {
        const target = progress * videoFallback.duration;
        if (!videoSeekingRef.current && Math.abs(videoFallback.currentTime - target) > 0.02) {
          videoSeekingRef.current = true;
          videoFallback.currentTime = target;
        }
      }
      rAFId = requestAnimationFrame(tick);
    };

    const handleSeeked = () => {
      videoSeekingRef.current = false;
    };
    
    videoFallback.addEventListener("seeked", handleSeeked);
    videoFallback.addEventListener("stalled", handleSeeked);
    
    rAFId = requestAnimationFrame(tick);
    extractFrames();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(rAFId);
      videoFallback.removeEventListener("seeked", handleSeeked);
      videoFallback.removeEventListener("stalled", handleSeeked);
      // Clean up bitmaps
      framesRef.current.forEach((bitmap) => bitmap.close());
    };
  }, []);

  // 2. PARTICLES SYSTEM
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.55 + 0.15,
        });
      }
    };

    let rAFId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 231, 183, ${p.opacity})`; // emerald-300 tone
        ctx.fill();
      }
      rAFId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      cancelAnimationFrame(rAFId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // 3. SCROLL-LINKED HERO FADE, CARDS REVEAL AND SECTION 3 INTERSECTION
  useEffect(() => {
    // Scroll triggers
    const trigger = cardsTriggerRef.current;
    const fixedCards = fixedCardsRef.current;
    const cardsGrid = cardsGridRef.current;
    const hero = document.getElementById("about-hero");

    if (!trigger || !fixedCards || !cardsGrid) return;

    let rAFId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // 3a. Hero Fade Out
      if (hero) {
        const fade = Math.max(0, 1 - scrollY / (vh * 0.35));
        hero.style.opacity = fade.toString();
        hero.style.transform = `translateY(${scrollY * 0.12}px)`;
      }

      // 3b. Fixed Cards Mask-Reveal Progress
      const rect = trigger.getBoundingClientRect();
      const triggerTop = rect.top + scrollY;
      const triggerHeight = rect.height;

      const start = triggerTop - vh * 0.55;
      const end = triggerTop + triggerHeight - vh * 0.35;
      const range = end - start;

      let progress = range > 0 ? (scrollY - start) / range : 0;
      progress = Math.max(0, Math.min(1, progress));

      const isActive = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.3;
      const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.25)) / (vh * 0.25)));
      const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.25 - scrollY) / (vh * 0.25)));
      const containerOpacity = isActive ? Math.min(fadeIn, fadeOut) : 0;

      fixedCards.style.opacity = containerOpacity.toString();
      fixedCards.style.pointerEvents = containerOpacity > 0.08 ? "auto" : "none";

      const isMobile = window.innerWidth < 768;
      const revealPct = progress * 135; // Expand width slightly to ensure fully filled

      if (isMobile) {
        cardsGrid.style.maskImage = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 25}%)`;
        cardsGrid.style.webkitMaskImage = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 25}%)`;
      } else {
        cardsGrid.style.maskImage = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 18}%)`;
        cardsGrid.style.webkitMaskImage = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 18}%)`;
      }

      rAFId = requestAnimationFrame(handleScroll);
    };

    rAFId = requestAnimationFrame(handleScroll);

    // 3c. Section 3 Intersection Observer
    const sectionThreeInner = sectionThreeInnerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionThreeInner?.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionThreeInner) observer.observe(sectionThreeInner);

    return () => {
      cancelAnimationFrame(rAFId);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 w-full text-white min-h-screen">
      {/* 1. SCROLL VIDEO CONTAINER */}
      <div
        id="scroll-video-container"
        className="fixed inset-0 z-[-10] bg-[#030604] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ visibility: "hidden" }}
        />
        <video
          ref={fallbackVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: "block" }}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          src={VIDEO_URL}
        />
        {/* Cinematic gradient overlays matching DeepGreen styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a08] via-transparent to-black/60 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a08]/75 via-transparent to-[#060a08]/75 opacity-50" />
        <div className="absolute inset-0 bg-[#060a08]/20 mix-blend-multiply" />
      </div>

      {/* 2. PARTICLES CANVAS */}
      <canvas
        ref={particlesCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[-5]"
      />

      {/* FIXED CARDS - DEEPGREEN MOTIVE REVEAL */}
      <div
        ref={fixedCardsRef}
        className="fixed bottom-0 left-0 right-0 z-20 pb-16 sm:pb-24 px-4 sm:px-8 opacity-0 pointer-events-none transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto">
          <div
            ref={cardsGridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            style={{
              transition: "mask-image 0.1s ease-out, -webkit-mask-image 0.1s ease-out",
            }}
          >
            {/* Card 1 */}
            <div className="glass-panel glow-emerald rounded-2xl p-6 lg:p-8 border border-emerald-500/10 bg-emerald-950/20 backdrop-blur-xl">
              <span className="text-[10px] tracking-[0.25em] font-mono text-emerald-400 font-semibold uppercase block mb-3">
                01 / Corporate Claims
              </span>
              <h3 className="text-xl font-bold text-emerald-50 mb-3 font-sans">
                Exposing Greenwashing
              </h3>
              <p className="text-sm leading-relaxed text-emerald-200/50 font-sans">
                Corporations claim millions of planted trees to offset emissions. We look past the
                glossy PDFs. Our platform scans historical and current ground cover to identify paper
                forests—trees that were never actually planted or maintained.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel glow-emerald rounded-2xl p-6 lg:p-8 border border-emerald-500/10 bg-emerald-950/20 backdrop-blur-xl">
              <span className="text-[10px] tracking-[0.25em] font-mono text-emerald-400 font-semibold uppercase block mb-3">
                02 / Satellite Auditing
              </span>
              <h3 className="text-xl font-bold text-emerald-50 mb-3 font-sans">
                Ground Truth Analysis
              </h3>
              <p className="text-sm leading-relaxed text-emerald-200/50 font-sans">
                By utilizing the Copernicus Sentinel-2 constellations, we obtain direct optical and
                spectral ground data. Near-infrared (NIR) and Red wavelengths are processed to calculate
                active, pixel-level NDVI indices, exposing discrepancies instantly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel glow-emerald rounded-2xl p-6 lg:p-8 border border-emerald-500/10 bg-emerald-950/20 backdrop-blur-xl">
              <span className="text-[10px] tracking-[0.25em] font-mono text-emerald-400 font-semibold uppercase block mb-3">
                03 / Fully Autonomous
              </span>
              <h3 className="text-xl font-bold text-emerald-50 mb-3 font-sans">
                Unbiased Protocols
              </h3>
              <p className="text-sm leading-relaxed text-emerald-200/50 font-sans">
                We operate without human analysts to prevent corporate lobbying, greenwashing, or manual
                influence. Multimodal AI structures corporate disclosure documents while custom computer
                vision models segment, count, and log verified offsets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SCROLL CONTENT FLOW */}
      <div className="relative w-full">
        {/* Section 1: Hero */}
        <section
          id="about-hero"
          className="relative h-screen w-full flex flex-col justify-between items-center pointer-events-none transition-all duration-300"
        >
          {/* Spacer for Top Menu */}
          <div className="h-28" />

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl z-10 pointer-events-auto">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono font-medium mb-4"
            >
              Our Motive
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-8"
            >
              Verify corporate climate promises against{" "}
              <span className="relative inline-block text-emerald-400">
                satellite reality.
                <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-emerald-500/30 rounded-full blur-[1px] -z-1" />
              </span>
            </motion.h1>

            {/* CTAs & Code Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <div className="flex items-center gap-2.5 bg-emerald-950/40 border border-emerald-500/10 hover:border-emerald-500/25 px-5 py-3 rounded-full text-sm font-mono transition-all text-emerald-300/90 shadow-inner">
                <Terminal className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>npm i @deepgreen/sdk</span>
              </div>
              <Button size="lg" asChild className="rounded-full px-6 py-5 bg-white text-neutral-950 hover:bg-neutral-100 shadow-lg shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Launch Sandbox <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Bounce Down Indicator */}
          <div className="pb-10 flex flex-col items-center gap-2 opacity-40">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-emerald-300">
              Scroll down to inspect ground truth
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-7 w-px bg-gradient-to-b from-emerald-400 to-transparent"
            />
          </div>
        </section>

        {/* Spacer between Hero and Cards trigger */}
        <div className="h-[120vh]" />

        {/* Cards Trigger Zone */}
        <div ref={cardsTriggerRef} id="cards-trigger" className="h-[220vh] relative z-10" />

        {/* Spacer between Cards trigger and Section 3 */}
        <div className="h-[80vh]" />

        {/* Section 3: Concluding vision section */}
        <section
          ref={sectionThreeRef}
          className="relative min-h-screen w-full flex items-center justify-center px-4 pb-32 sm:pb-48"
        >
          <div
            ref={sectionThreeInnerRef}
            className="relative z-20 flex flex-col items-center text-center max-w-3xl opacity-0 translate-y-8 blur-md transition-all duration-1000 ease-out"
            style={{
              transitionProperty: "opacity, transform, filter",
            }}
          >
            <span className="text-xs uppercase tracking-[0.35em] text-[#e8702a] font-mono font-medium mb-3">
              Introducing
            </span>
            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6">
              DeepGreen Protocol
            </h2>
            <p className="text-emerald-200/60 leading-relaxed text-base sm:text-lg mb-10 max-w-xl font-sans">
              An un-gameable registry of verified carbon actions. Bridging spatial technology with ecological truth to ensure every tree counts, and every credit represents real ground change.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild className="rounded-full px-6 py-5 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/5">
                <Link href="/docs">Scientific methodology</Link>
              </Button>
              <Button asChild className="rounded-full px-6 py-5 bg-[#e8702a] text-white hover:bg-[#d2611f] shadow-lg shadow-[#e8702a]/20">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Launch Sandbox <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>



      {/* Simple Global CSS utility rules for Section 3 slide-in */}
      <style jsx global>{`
        .visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          filter: blur(0) !important;
        }
      `}</style>
    </div>
  );
}
export default AboutUs;
