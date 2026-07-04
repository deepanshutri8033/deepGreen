"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell, Mail, MessageSquare, FileText, X, Check, FileCheck } from "lucide-react";
import { complianceLaws } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AlertPanelProps = {
  visible: boolean;
};

export function AlertPanel({ visible }: AlertPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // Auto-open compliance notice once when anomaly is first detected
  useEffect(() => {
    if (visible && !hasAutoOpened) {
      setShowModal(true);
      setHasAutoOpened(true);
    }
  }, [visible, hasAutoOpened]);

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="alert-pulse glow-red rounded-2xl border border-red-500/40 bg-red-950/20 p-6 relative overflow-hidden"
          >
            {/* Ambient Red glow corner */}
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-red-500/10 blur-xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30"
              >
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </motion.div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-red-300 font-sans tracking-tight">
                    CRITICAL WARNING — Forest Anomaly Detected
                  </h3>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/40">Critical Deforestation</Badge>
                </div>
                <p className="mt-2 text-sm text-red-200/70 leading-relaxed font-sans">
                  Green canopy cover has collapsed by <strong className="text-red-300">12%</strong> over the preceding 6 months at coordinates <span className="font-mono text-xs text-red-300">Lat: -3.46, Long: -62.21</span> (Amazon Zone 4), contradicting the claims of 5,000 newly planted saplings.
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-red-400/60 font-mono">
                    Environmental Laws Breached
                  </p>
                  {complianceLaws.map((law) => (
                    <div
                      key={law.code}
                      className="rounded-lg border border-red-500/10 bg-red-950/30 px-3 py-2 text-xs font-sans flex justify-between items-center"
                    >
                      <div>
                        <span className="font-mono text-red-400 font-bold">{law.code}</span>
                        <span className="mx-2 text-red-200/20">·</span>
                        <span className="text-red-200/60">{law.title}</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono text-red-400/50">{law.jurisdiction}</span>
                    </div>
                  ))}
                </div>

                {/* Dashboard Action Triggers */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 border border-red-500/40"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Review Compliance PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-300 hover:bg-red-500/10 rounded-xl"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email Authorities
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-300 hover:bg-red-500/10 rounded-xl"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    SMS Dispatch
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* GOTCHA DEMO MODAL: AUTO-GENERATED LEGAL COMPLIANCE NOTICE      */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Document Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl rounded-2xl bg-neutral-900 border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-neutral-900 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white font-sans">
                    Auto-Generated Compliance Notice
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable PDF Document Body */}
              <div className="flex-1 overflow-auto p-6 sm:p-8 bg-neutral-100 text-neutral-800 font-serif leading-relaxed">
                <div className="border-l-4 border-red-500 pl-4 space-y-4">
                  {/* Document Header */}
                  <div className="flex justify-between items-start border-b border-neutral-300 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-neutral-900 tracking-tight">
                        Notice of Environmental Breach
                      </h2>
                      <p className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                        REGULATION CODE: SECTION 45 ACT / ENV-2024-117
                      </p>
                    </div>
                    <div className="text-right text-[10px] font-mono text-neutral-500 uppercase">
                      <p>Date: July 2026</p>
                      <p>Audit Ref: DG-AMZ-04</p>
                    </div>
                  </div>

                  {/* Document Metadata details */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans pb-2 border-b border-neutral-200">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block font-mono">Issued to:</span>
                      <span className="font-bold text-neutral-900">VerdeCorp Industries</span>
                      <span className="text-[10px] text-neutral-600 block">Ecosystem Mitigation Dept.</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block font-mono">Assigned Agency:</span>
                      <span className="font-bold text-neutral-900">Ibama Environmental Agency</span>
                      <span className="text-[10px] text-neutral-600 block">Brazil Federal Regulator</span>
                    </div>
                  </div>

                  {/* Legal Text */}
                  <div className="space-y-4 text-xs sm:text-sm text-neutral-800 text-justify">
                    <p>
                      <strong>1. FINDINGS:</strong> DeepGreen Satellite auditing arrays detected structural discrepancies in claims filed in the <i>VerdeCorp Annual Sustainability Report 2024</i> on page 14. Standard Multimodal Retrieval-Augmented extraction parsed statements claiming the planting of 5,000 native tree saplings across coordinates designated as Amazon Zone 4 (Latitude -3.46, Longitude -62.21).
                    </p>
                    <p>
                      <strong>2. GROUND TRUTH DISCREPANCY:</strong> Continuous remote sensing NDVI timelines compiled from Copernicus Sentinel-2 multispectral sweeps show a permanent Index drop from 0.68 to 0.44. Crown area segmentation using segment arrays confirms a net canopy reduction of 12.1% in the designated zone instead of the claimed offset increase.
                    </p>
                    <p>
                      <strong>3. DISPATCH ACTION:</strong> Notice is hereby served requesting immediate cessation of carbon credit offsets associated with registry ID carbon-sec-09, pending detailed on-site physical auditing.
                    </p>
                  </div>

                  {/* Stamp & Sign Block */}
                  <div className="pt-6 border-t border-neutral-300 flex justify-between items-end font-sans">
                    <div className="text-[9px] text-neutral-500 font-mono">
                      <p>VERIFIED BY DEEPGREEN AUTO-AUDIT</p>
                      <p>SECURE IMMUTABLE LOG: POLYGON-HASH-84F9</p>
                    </div>
                    
                    {/* Signed Stamp */}
                    <div className="relative min-h-[50px] w-48 flex items-center justify-center">
                      <AnimatePresence>
                        {isSigned ? (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                            animate={{ scale: 1, opacity: 1, rotate: -8 }}
                            className="absolute border-4 border-emerald-600 text-emerald-600 font-black text-xs uppercase px-3 py-1 rounded tracking-widest font-mono text-center rotate-[-8deg] bg-emerald-50/70"
                          >
                            DISPATCHED VIA DOCUSIGN
                            <span className="block text-[8px] font-bold">DISPATCH REF: ENV-26-847</span>
                          </motion.div>
                        ) : (
                          <span className="text-[10px] italic text-neutral-400">Awaiting dispatch signature...</span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons bar */}
              <div className="bg-neutral-900 border-t border-white/[0.06] px-6 py-4 flex justify-between items-center gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Dismiss Preview
                </button>
                <button
                  onClick={handleSign}
                  disabled={isSigning || isSigned}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSigned
                      ? "bg-emerald-600/20 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/10"
                  }`}
                >
                  {isSigning ? (
                    "Signing..."
                  ) : isSigned ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Notice Dispatched
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5" />
                      Sign & Dispatch Notice
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
