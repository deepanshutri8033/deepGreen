"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/deepgreen/navbar";
import { HeroSection } from "@/components/deepgreen/hero-section";
import { Skiper28 } from "@/components/deepgreen/skiper28";
import { FeaturesSection } from "@/components/deepgreen/features-section";
import { WorkflowSection } from "@/components/deepgreen/workflow-section";
import { ArchitectureSection } from "@/components/deepgreen/architecture-section";
import { CtaSection, Footer } from "@/components/deepgreen/cta-footer";
import { VideoIntro, useIntroSeen } from "@/components/deepgreen/video-intro";

export function HomeWithIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShowIntro(!useIntroSeen());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-[#060a08]" />;
  }

  return (
    <>
      {showIntro && (
        <VideoIntro onComplete={() => setShowIntro(false)} />
      )}
      <div className="min-h-screen bg-[#060a08]">
        <Navbar />
        <HeroSection />
        <Skiper28 />
        <FeaturesSection />
        <WorkflowSection />
        <ArchitectureSection />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}
