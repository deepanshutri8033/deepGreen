"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import React, { useRef, useEffect } from "react";

interface Skiper28Props {
  text?: string;
  glowColor?: string;
  textColor?: string;
}

const DEFAULT_TEXT =
  "TODAY, LARGE CORPORATIONS FILE FALSE SUSTAINABILITY REPORTS TO EVADE TAXES AND BOOST THEIR BRAND IMAGE. THEY CLAIM TO HAVE PLANTED THOUSANDS OF TREES... BUT SATELLITES DON'T LIE. THOSE ARE PHANTOM FORESTS — TREES THAT EXIST ONLY ON PAPER. DEEPGREEN CROSS-EXAMINES CARBON CREDIT CLAIMS IN REAL-TIME AGAINST LIVE COPERNICUS SENTINEL-2 SATELLITE GROUND TRUTH. 100% AUTOMATED COMPUTER VISION AND MULTIMODAL RAG AUDITING. ZERO MANUAL ANALYSTS. DEEPGREEN BENDS THE DYNAMICS OF AUDITING.";

export const Skiper28: React.FC<Skiper28Props> = ({
  text = DEFAULT_TEXT,
  glowColor = "#10b981", // Emerald-500 theme accent
  textColor = "#a7f3d0", // Emerald-200 theme text
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Track scroll inside the component container for text animations
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Calculate scrolling translation & opacity for the 3D text
  const yMotionValue = useTransform(scrollYProgress, [0, 1], [350, -50]);
  const opacityValue = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Combine perspective and rotation matrix transforms
  const transform = useMotionTemplate`rotateX(30deg) translateY(${yMotionValue}px) translateZ(12px)`;

  // Scroll-based Video Scrubbing Logic
  const seekingRef = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || seekingRef.current) return;

    const duration = video.duration;
    if (isNaN(duration) || duration <= 0) return;

    // Direct temporal mapping: scale current playhead to scroll position
    // We cap it to slightly below duration to prevent video loops
    const targetTime = latest * (duration - 0.05);
    
    // Only seek if the difference is notable to prevent CPU thrashing
    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      seekingRef.current = true;
      video.currentTime = targetTime;
    }
  });

  // Listen to native seeked events and pause the video initially
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      seekingRef.current = false;
    };

    video.addEventListener("seeked", handleSeeked);
    video.pause();

    return () => {
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  return (
    <div
      ref={targetRef}
      className="relative z-10 h-[220vh] w-full bg-[#060a08] text-white overflow-hidden border-t border-emerald-500/10"
      id="perspective-scroll"
    >
      {/* Scroll-Scrubbed Video Background */}
      <video
        ref={videoRef}
        src="/v2.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        style={{ filter: "brightness(0.55) contrast(1.15) saturate(0.85)" }}
      />

      {/* Dynamic tech-grid background mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none z-1" />

      {/* Decorative ambient neon backlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none z-1"
      />

      {/* Scroll down prompt */}
      <div className="absolute left-1/2 top-[8%] grid -translate-x-1/2 content-start justify-items-center gap-3 text-center pointer-events-none z-10">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.45 }}
          className="text-[9px] tracking-[0.35em] uppercase text-emerald-400/80 font-mono font-medium"
        >
          SCROLL TO SCRUB SATELLITE IMAGERY
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-[#10b981] to-transparent"
        />
      </div>

      {/* Sticky 3D Text Container */}
      <div
        className="sticky top-0 mx-auto flex h-screen items-center justify-center bg-transparent px-6 sm:px-12 py-20 overflow-hidden z-10"
        style={{
          transformStyle: "preserve-3d",
          perspective: "250px",
        }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transform,
            opacity: opacityValue,
            color: textColor,
            textShadow: `0 0 35px ${glowColor}18, 0 0 70px ${glowColor}0a`,
          }}
          className="w-full max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.1] select-none font-sans"
        >
          {text}

          {/* Fade-to-dark mask bottom */}
          <div className="absolute -bottom-10 left-0 h-[30vh] w-full bg-gradient-to-b from-transparent to-[#060a08] pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};
export default Skiper28;
