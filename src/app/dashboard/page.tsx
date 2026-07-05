"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, Search, ChevronDown, RefreshCw, UploadCloud, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

import { DashboardSidebar } from "@/components/deepgreen/dashboard-sidebar";
import { UploadZone } from "@/components/deepgreen/upload-zone";
import { RagFindings } from "@/components/deepgreen/rag-findings";
import { SatelliteMap } from "@/components/deepgreen/satellite-map";
import { TimelineSlider } from "@/components/deepgreen/timeline-slider";
import { AlertPanel } from "@/components/deepgreen/alert-panel";
import { AuditWorkflowBar } from "@/components/deepgreen/audit-workflow-bar";
import { sampleClaims } from "@/lib/mock-data";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import new custom visual components matching the requested design language
import {
  NdviTrendChart,
  SaplingClaimsChart,
  CanopyRadarChart,
  type ClaimVerificationRow,
} from "@/components/deepgreen/audit-visuals";

export default function DashboardPage() {
  const [workflowStep, setWorkflowStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFindings, setShowFindings] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [year, setYear] = useState(2024);
  const [selectedClaim] = useState(sampleClaims[0]);

  // Card tab toggles
  const [card1Tab, setCard1Tab] = useState<"summary" | "pipeline">("summary");
  const [card2Tab, setCard2Tab] = useState<"ndvi" | "details">("ndvi");
  const [card3Tab, setCard3Tab] = useState<"verification" | "rag">("verification");
  const [card4Tab, setCard4Tab] = useState<"satellite" | "radar">("satellite");

  const [activeClaimIndex, setActiveClaimIndex] = useState<number | null>(null);

  // Dynamic claims table dataset linked to workflow alert status
  const claimsData: ClaimVerificationRow[] = [
    {
      id: "1",
      zone: "BR-AMZ-04",
      location: "Amazon Zone 4",
      claimed: 5000,
      verified: showAlert || workflowStep >= 5 ? 4400 : 5000, // Deforestation collapse
      variance: showAlert || workflowStep >= 5 ? -600 : 0,
      percentVerified: showAlert || workflowStep >= 5 ? 88 : 100,
    },
    { id: "2", zone: "BR-MNG-12", location: "Coastal Delta", claimed: 8200, verified: 8200, variance: 0, percentVerified: 100 },
    { id: "3", zone: "BR-NOR-08", location: "Northern Corridor", claimed: 6000, verified: 6100, variance: 100, percentVerified: 101.6 },
    { id: "4", zone: "BR-WET-03", location: "Eastern Wetlands", claimed: 3500, verified: 3300, variance: -200, percentVerified: 94.2 },
    { id: "5", zone: "BR-RID-01", location: "Southern Ridge", claimed: 2000, verified: 2000, variance: 0, percentVerified: 100 },
  ];

  // Dynamic radar chart variables
  const radarExpected = [90, 85, 80, 75, 70, 85, 60];
  const radarActual = [
    90,
    85,
    80,
    75,
    showAlert || workflowStep >= 5 ? 58 : 70, // Planted Saplings index drop on anomaly
    85,
    60,
  ];

  // Dynamic stats
  const reportsCount = workflowStep > 0 ? 848 : 847;
  const anomaliesCount = showAlert || workflowStep >= 5 ? 24 : 23;
  const verifiedHectares = showAlert || workflowStep >= 5 ? "13.6K" : "14.2K";
  const activeAlerts = showAlert || workflowStep >= 5 ? "20" : "19";

  const runAuditPipeline = useCallback(() => {
    setIsProcessing(true);
    setWorkflowStep(1);
    setShowAlert(false);
    setShowFindings(false);

    const timers = [
      setTimeout(() => setWorkflowStep(2), 1200),
      setTimeout(() => {
        setWorkflowStep(3);
        setShowFindings(true);
        setIsProcessing(false);
        setCard3Tab("rag"); // Auto-show parsed RAG claims
      }, 2400),
      setTimeout(() => setWorkflowStep(4), 3600),
      setTimeout(() => {
        setWorkflowStep(5);
        setYear(2026);
        setCard4Tab("satellite"); // Focus satellite map
        setCard2Tab("ndvi"); // Focus NDVI collapse curve
      }, 4800),
      setTimeout(() => {
        setWorkflowStep(6);
        setShowAlert(true);
      }, 6000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleUploadComplete = useCallback(() => {
    const cleanup = runAuditPipeline();
    return cleanup;
  }, [runAuditPipeline]);

  useEffect(() => {
    if (year >= 2026 && workflowStep >= 5) {
      setShowAlert(true);
    }
  }, [year, workflowStep]);

  // NDVI chart month-points
  const ndviData = [
    { month: "Jan", value: 0.62, expected: 0.60 },
    { month: "Mar", value: 0.68, expected: 0.65 },
    { month: "Jun", value: showAlert ? 0.58 : 0.71, expected: 0.70 },
    { month: "Sep", value: showAlert ? 0.52 : 0.69, expected: 0.72 },
    { month: "Dec", value: showAlert ? 0.44 : 0.67, expected: 0.74 },
  ];

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-[#040705] text-neutral-100 font-sans selection:bg-[#bbfb1d] selection:text-[#060a08]">
        {/* Compact Navigation Sidebar */}
        <DashboardSidebar />

        {/* Workspace Body */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Decorative Glowing Gradients */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[300px] rounded-full bg-emerald-950/20 blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-[#bbfb1d]/5 blur-[120px] pointer-events-none -z-10" />

          {/* Top Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-6 bg-[#060a08]/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/5">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-white font-sans tracking-tight uppercase">
                    Audit Dashboard
                  </h1>
                  {workflowStep > 0 && (
                    <Badge className="bg-[#bbfb1d]/10 text-[#bbfb1d] border-[#bbfb1d]/20 text-[9px] font-mono animate-pulse uppercase">
                      Pipeline Scanning
                    </Badge>
                  )}
                </div>
                <p className="hidden text-[10px] text-neutral-400 font-mono sm:block tracking-wide">
                  Corporate carbon credit verification & satellite canopy validation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Badge */}
              <div className="hidden items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 sm:flex cursor-pointer hover:bg-white/5 transition">
                <Search className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-[10px] text-neutral-400 font-sans">Search audits...</span>
              </div>

              {/* Notification Alarm Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl animate-none"
              >
                <Bell className="h-5 w-5" />
                {showAlert && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 alert-pulse" />
                )}
              </Button>

              {/* User Dropdown Badge */}
              <div className="flex items-center gap-2 bg-neutral-900 border border-white/[0.08] rounded-full pl-2 pr-3 py-1 cursor-pointer hover:bg-neutral-800 transition">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Alex Brown"
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-500/30"
                />
                <div className="text-left hidden sm:block leading-none">
                  <p className="text-[10px] font-bold text-white font-sans">Alex Brown</p>
                  <p className="text-[8px] text-neutral-400 font-mono mt-0.5 uppercase tracking-wider">Banker & Investor</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
              </div>
            </div>
          </header>

          {/* Main Dashboard Space */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Deforestation Alert Warning */}
            <AlertPanel visible={showAlert} />

            {/* 2x2 Layout Grid */}
            <div className="grid gap-6 xl:grid-cols-2 max-w-[1600px] mx-auto w-full">

              {/* ======================================================= */}
              {/* CARD 1: Audit Pipeline Summary                          */}
              {/* ======================================================= */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c110e]/95 backdrop-blur-md p-5 flex flex-col justify-between min-h-[380px] shadow-xl relative overflow-hidden group">
                <div className="flex items-start justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCard1Tab("summary")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card1Tab === "summary"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      Audit Stats Summary
                    </button>
                    <button
                      onClick={() => setCard1Tab("pipeline")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card1Tab === "pipeline"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      Audit Pipeline
                    </button>
                  </div>

                  {card1Tab === "summary" ? (
                    <button
                      onClick={() => setCard1Tab("pipeline")}
                      className="px-3.5 py-1.5 rounded-full bg-[#bbfb1d] text-[#060a08] text-[10.5px] font-extrabold uppercase tracking-wider transition hover:scale-105 flex items-center gap-1.5 shadow-[0_0_15px_rgba(187,251,29,0.2)]"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Upload Sustainability PDF
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setWorkflowStep(0);
                        setShowAlert(false);
                        setShowFindings(false);
                        setYear(2024);
                      }}
                      className="px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-neutral-300 text-[10px] font-bold uppercase transition hover:bg-neutral-800 flex items-center gap-1.5"
                    >
                      <RefreshCw className="h-3 w-3" /> Reset Pipeline
                    </button>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {card1Tab === "summary" ? (
                      <motion.div
                        key="summary-content"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-5"
                      >
                        {/* Hectares Verified Big Block */}
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                            Total Canopy Verified Hectares
                          </p>
                          <div className="flex items-baseline gap-2.5 mt-1.5">
                            <span className="text-3xl font-black text-white tracking-tight font-mono">
                              {verifiedHectares} ha
                            </span>
                            <Badge className="bg-[#10b981]/15 text-[#10b981] border-[#10b981]/25 text-[10px] font-mono font-bold">
                              +8% increase
                            </Badge>
                          </div>
                        </div>

                        {/* Visual Breakdown Strip bar */}
                        <div className="space-y-1.5">
                          <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-white/5 border border-white/5">
                            <div className="h-full bg-[#10b981] transition-all duration-300" style={{ width: "68%" }} />
                            <div className="h-full bg-[#8b5cf6] transition-all duration-300" style={{ width: "24%" }} />
                            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${showAlert ? 8 : 0}%` }} />
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400">
                            <span>Verified Canopy (68%)</span>
                            <span>Awaiting Verification (24%)</span>
                            <span>{showAlert ? "Deforested Anomaly (8%)" : "No Anomalies"}</span>
                          </div>
                        </div>

                        {/* Four metric sub-cards */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:bg-white/[0.04] transition">
                            <p className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Reports Audited</p>
                            <p className="text-lg font-bold text-white font-mono mt-1">{reportsCount}</p>
                            <p className="text-[8.5px] font-mono text-[#8b5cf6] mt-0.5">+12% increase</p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:bg-white/[0.04] transition">
                            <p className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Anomalies Flagged</p>
                            <p className={`text-lg font-bold font-mono mt-1 ${showAlert ? "text-red-400" : "text-white"}`}>
                              {anomaliesCount}
                            </p>
                            <p className="text-[8.5px] font-mono text-amber-400 mt-0.5">Sentinel-2 alerts</p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:bg-white/[0.04] transition">
                            <p className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Verified Areas</p>
                            <p className="text-lg font-bold text-white font-mono mt-1">{verifiedHectares} ha</p>
                            <p className="text-[8.5px] font-mono text-[#10b981] mt-0.5">Approved offsets</p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:bg-white/[0.04] transition">
                            <p className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Alerts Dispatched</p>
                            <p className="text-lg font-bold text-white font-mono mt-1">{activeAlerts}</p>
                            <p className="text-[8.5px] font-mono text-red-400 mt-0.5">Compliance active</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pipeline-content"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4"
                      >
                        {/* Report Upload Drop Zone */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                          <UploadZone
                            onUploadComplete={handleUploadComplete}
                            isProcessing={isProcessing}
                          />
                        </div>

                        {/* Audit pipeline bar */}
                        {workflowStep > 0 && (
                          <div className="pt-2">
                            <p className="text-[9px] uppercase font-mono tracking-widest text-[#bbfb1d] mb-2 font-bold">
                              RAG Audit Pipeline Status
                            </p>
                            <AuditWorkflowBar step={workflowStep} />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ======================================================= */}
              {/* CARD 2: NDVI Trend Analysis (Curved Line/Area Chart)    */}
              {/* ======================================================= */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c110e]/95 backdrop-blur-md p-5 flex flex-col justify-between min-h-[380px] shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCard2Tab("ndvi")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card2Tab === "ndvi"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      NDVI Trend Analysis
                    </button>
                    <button
                      onClick={() => setCard2Tab("details")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card2Tab === "details"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      Confidence Breakdown
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {card2Tab === "ndvi" ? (
                      <motion.div
                        key="ndvi-chart"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full h-full min-h-[220px]"
                      >
                        <NdviTrendChart data={ndviData} showAnomaly={showAlert} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="confidence-breakdown"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full h-full min-h-[220px]"
                      >
                        {/* Nested confidence gauge detail */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between">
                            <p className="text-[10px] font-mono uppercase text-neutral-400">Sensor Confidence Index</p>
                            <p className={`text-4xl font-extrabold font-mono mt-3 ${showAlert ? "text-red-400 animate-pulse" : "text-[#10b981]"}`}>
                              {showAlert ? "94%" : "12%"}
                            </p>
                            <p className="text-[9px] text-neutral-500 font-sans mt-2">
                              {showAlert ? "Deforestation confirmed via Segment-Anything AI" : "Baseline normal variance"}
                            </p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-2 text-[10.5px] font-mono">
                            <div className="flex justify-between border-b border-white/5 pb-1 text-neutral-400">
                              <span>Cloud Cover Filter:</span>
                              <span className="text-emerald-400 font-bold">4.1% OK</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1 text-neutral-400">
                              <span>Seasonal Margin:</span>
                              <span className="text-emerald-400 font-bold">-1.8%</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                              <span>NDVI Delta Shift:</span>
                              <span className={showAlert ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                                {showAlert ? "-28.2%" : "Normal"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ======================================================= */}
              {/* CARD 3: Sapling Verification & RAG CITATION              */}
              {/* ======================================================= */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c110e]/95 backdrop-blur-md p-5 flex flex-col justify-between min-h-[460px] shadow-xl relative overflow-hidden group xl:col-span-1">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCard3Tab("verification")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card3Tab === "verification"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      Sapling Verification Analysis
                    </button>
                    <button
                      onClick={() => setCard3Tab("rag")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card3Tab === "rag"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      RAG Citations
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between h-full">
                  <AnimatePresence mode="wait">
                    {card3Tab === "verification" ? (
                      <motion.div
                        key="verification-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {/* Upper Line Chart */}
                        <div className="h-40">
                          <SaplingClaimsChart
                            data={claimsData}
                            activeClaimIndex={activeClaimIndex}
                            onSelectClaim={setActiveClaimIndex}
                          />
                        </div>

                        {/* Lower Comparison Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse select-none">
                            <thead>
                              <tr className="text-[9px] uppercase font-bold font-mono tracking-wider text-neutral-500 border-b border-white/[0.06] pb-2">
                                <th className="pb-2">Zone Code</th>
                                <th className="pb-2 text-right">Claimed Saplings</th>
                                <th className="pb-2 text-right">Verified Saplings</th>
                                <th className="pb-2 text-right">Count Variance</th>
                                <th className="pb-2 text-right">% Verified</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04] text-[11px] font-sans text-neutral-300">
                              {claimsData.map((row, index) => {
                                const isDiscrepancy = row.verified < row.claimed;
                                const isHighlighted = activeClaimIndex === index;
                                return (
                                  <tr
                                    key={row.id}
                                    onMouseEnter={() => setActiveClaimIndex(index)}
                                    onMouseLeave={() => setActiveClaimIndex(null)}
                                    className={`transition-colors cursor-pointer ${
                                      isHighlighted ? "bg-[#bbfb1d]/5 text-[#bbfb1d]" : "hover:bg-white/[0.02]"
                                    }`}
                                  >
                                    <td className="py-2.5 font-bold flex items-center gap-1.5">
                                      <span className={`h-1.5 w-1.5 rounded-full ${isHighlighted ? "bg-[#bbfb1d] animate-pulse" : "bg-neutral-600"}`} />
                                      {row.zone} ({row.location})
                                    </td>
                                    <td className="py-2.5 text-right font-mono">{row.claimed.toLocaleString()}</td>
                                    <td className="py-2.5 text-right font-mono">{row.verified.toLocaleString()}</td>
                                    <td
                                      className={`py-2.5 text-right font-mono font-bold ${
                                        isDiscrepancy ? "text-red-400 font-extrabold animate-pulse" : "text-emerald-400"
                                      }`}
                                    >
                                      {isDiscrepancy ? "" : "+"}{row.variance.toLocaleString()}
                                    </td>
                                    <td className={`py-2.5 text-right font-mono font-semibold ${isDiscrepancy ? "text-red-400 font-bold" : ""}`}>
                                      {row.percentVerified.toFixed(1)}%
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="rag-findings"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full min-h-[300px]"
                      >
                        <RagFindings visible={showFindings} selectedClaim={selectedClaim} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ======================================================= */}
              {/* CARD 4: Satellite Swipe Map & Radar Breakdown            */}
              {/* ======================================================= */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c110e]/95 backdrop-blur-md p-5 flex flex-col justify-between min-h-[460px] shadow-xl relative overflow-hidden group xl:col-span-1">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCard4Tab("satellite")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card4Tab === "satellite"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      Satellite Swipe Verification
                    </button>
                    <button
                      onClick={() => setCard4Tab("radar")}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border transition ${
                        card4Tab === "radar"
                          ? "border-[#bbfb1d]/20 bg-[#bbfb1d]/10 text-[#bbfb1d]"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      Canopy Composition
                    </button>
                  </div>

                  {card4Tab === "satellite" && (
                    <div className="w-48 sm:w-56 shrink-0">
                      <TimelineSlider year={year} onYearChange={setYear} />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center w-full">
                  <AnimatePresence mode="wait">
                    {card4Tab === "satellite" ? (
                      <motion.div
                        key="satellite-swipe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                      >
                        <SatelliteMap
                          claim={showFindings ? selectedClaim : null}
                          year={year}
                          showAnomaly={showAlert || year >= 2026}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="radar-canopy"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="w-full flex justify-center"
                      >
                        <CanopyRadarChart expected={radarExpected} actual={radarActual} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
