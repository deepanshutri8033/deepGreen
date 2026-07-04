"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SkipForward } from "lucide-react";

const INTRO_KEY = "deepgreen-intro-seen";
const GREEN_LETTERS = ["G", "r", "e", "e", "n"];

const letterVariants = {
  hidden: { opacity: 0, y: 48, rotateX: -90, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.55 + i * 0.07,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function IntroTitle({ showTagline }: { showTagline: boolean }) {
  return (
    <div className="intro-lockup relative mx-auto max-w-4xl px-4 text-center">
      <div className="intro-lockup-bg pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[2rem] bg-black/35 blur-2xl" />

      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.6em" }}
        animate={{ opacity: 1, letterSpacing: "0.42em" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="intro-eyebrow mb-8 text-[10px] uppercase text-emerald-400/55 sm:text-[11px]"
      >
        Satellite Auditing
      </motion.p>

      <div className="relative inline-block text-left">
        <motion.span
          initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="intro-deep block text-[2.5rem] leading-none text-white/90 sm:text-5xl md:text-6xl"
        >
          Deep
        </motion.span>

        <div className="intro-green-wrap -mt-1 sm:-mt-2 md:-mt-3">
          <span className="intro-green-glow" aria-hidden />
          <span
            className="intro-green block text-[4.5rem] sm:text-[6.5rem] md:text-[8.5rem]"
            aria-label="Green"
          >
            {GREEN_LETTERS.map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="intro-green-letter"
                style={{ perspective: 800 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </div>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="intro-accent-line mt-5 block origin-left sm:mt-6"
        />
      </div>

      <AnimatePresence>
        {showTagline && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="intro-tagline mx-auto mt-8 max-w-sm sm:mt-10"
          >
            <p className="text-sm leading-relaxed text-white/55 sm:text-[15px]">
              We verify sustainability reports against{" "}
              <span className="intro-tagline-accent">live satellite data</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type VideoIntroProps = {
  onComplete: () => void;
};

export function VideoIntro({ onComplete }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exiting, setExiting] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  const finishIntro = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    sessionStorage.setItem(INTRO_KEY, "1");
    setTimeout(onComplete, 700);
  }, [exiting, onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      /* autoplay blocked — user can still skip */
    });

    const taglineTimer = setTimeout(() => setShowTagline(true), 1100);
    return () => clearTimeout(taglineTimer);
  }, []);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/v1.mp4"
            muted
            playsInline
            onEnded={finishIntro}
          />

          <div className="absolute inset-0 bg-[#060a08]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a08] via-transparent to-[#060a08]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,10,8,0.15)_0%,rgba(6,10,8,0.72)_100%)]" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <IntroTitle showTagline={showTagline} />
          </div>

          <motion.button
            type="button"
            onClick={finishIntro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-white/75 backdrop-blur-md transition-colors hover:border-emerald-400/40 hover:bg-black/60 hover:text-emerald-200 sm:bottom-8 sm:right-8 sm:px-5 sm:text-sm"
            aria-label="Skip intro"
          >
            Skip Intro
            <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function useIntroSeen(): boolean {
  return false;
}
