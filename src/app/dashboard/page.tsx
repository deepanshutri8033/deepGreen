"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/deepgreen/dashboard-sidebar";
import { StatsCards } from "@/components/deepgreen/stats-cards";
import { UploadZone } from "@/components/deepgreen/upload-zone";
import { RagFindings } from "@/components/deepgreen/rag-findings";
import { SatelliteMap } from "@/components/deepgreen/satellite-map";
import { TimelineSlider } from "@/components/deepgreen/timeline-slider";
import { NdviChart } from "@/components/deepgreen/ndvi-chart";
import { AlertPanel } from "@/components/deepgreen/alert-panel";
import { AuditWorkflowBar } from "@/components/deepgreen/audit-workflow-bar";
import { sampleClaims } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/ui/page-transition";

export default function DashboardPage() {
  const [workflowStep, setWorkflowStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFindings, setShowFindings] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [year, setYear] = useState(2024);
  const [selectedClaim] = useState(sampleClaims[0]);

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
      }, 2400),
      setTimeout(() => setWorkflowStep(4), 3600),
      setTimeout(() => {
        setWorkflowStep(5);
        setYear(2026);
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

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-[#060a08]">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4 sm:px-6 bg-black/10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white font-sans">
                Audit Dashboard
              </h1>
              <p className="hidden text-xs text-neutral-400/60 sm:block font-mono">
                Corporate carbon credit verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 sm:flex">
              <Search className="h-3.5 w-3.5 text-[#e8702a]/60" />
              <span className="text-xs text-neutral-400/60 font-sans">Search audits...</span>
            </div>
            <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white hover:bg-white/5">
              <Bell className="h-5 w-5" />
              {showAlert && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e8702a] animate-pulse" />
              )}
            </Button>
            <Link 
              href="/" 
              className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-1.5 transition-all duration-200"
            >
              Home
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-7xl space-y-6"
          >
            <StatsCards />

            {workflowStep > 0 && <AuditWorkflowBar step={workflowStep} />}

            <AlertPanel visible={showAlert} />

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Report Upload
                    <Badge variant="secondary">RAG Layer</Badge>
                  </CardTitle>
                  <CardDescription>
                    Drop a corporate sustainability PDF to begin automated verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadZone
                    onUploadComplete={handleUploadComplete}
                    isProcessing={isProcessing}
                  />
                </CardContent>
              </Card>

              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    RAG Extracted Claims
                    {showFindings && (
                      <Badge variant="default">2 claims found</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    AI-parsed coordinates and tree count assertions from the report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RagFindings visible={showFindings} selectedClaim={selectedClaim} />
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="map" className="w-full">
              <TabsList>
                <TabsTrigger value="map">Satellite Map</TabsTrigger>
                <TabsTrigger value="ndvi">NDVI Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="map">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>Satellite Verification</CardTitle>
                        <CardDescription>
                          Sentinel-2 tiles for extracted coordinates
                        </CardDescription>
                      </div>
                      <div className="w-full sm:w-72">
                        <TimelineSlider year={year} onYearChange={setYear} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SatelliteMap
                      claim={showFindings ? selectedClaim : null}
                      year={year}
                      showAnomaly={showAlert || year >= 2026}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ndvi">
                <Card>
                  <CardHeader>
                    <CardTitle>NDVI Trend Analysis</CardTitle>
                    <CardDescription>
                      Normalized Difference Vegetation Index vs. expected sapling growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NdviChart
                      year={year}
                      showAnomaly={showAlert || year >= 2026}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
    </PageTransition>
  );
}
