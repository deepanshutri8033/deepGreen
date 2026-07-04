"use client";

import { motion } from "framer-motion";
import { MapPin, TreePine, Eye, FileText, CheckCircle2 } from "lucide-react";
import { sampleClaims, type AuditClaim } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type RagFindingsProps = {
  visible: boolean;
  selectedClaim: AuditClaim;
};

export function RagFindings({ visible, selectedClaim }: RagFindingsProps) {
  const [activeClaimId, setActiveClaimId] = useState<string>(sampleClaims[0].id);

  if (!visible) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-emerald-500/15 p-6 text-center">
        <p className="text-sm text-emerald-200/40">
          Upload a report to see RAG-extracted claims
        </p>
      </div>
    );
  }

  const activeClaim = sampleClaims.find((c) => c.id === activeClaimId) || selectedClaim;

  // Mock PDF source paragraphs depending on the selected claim
  const getPdfSource = (id: string) => {
    if (id === "claim-1") {
      return {
        title: "VerdeCorp Annual Sustainability Report 2024",
        section: "Section 3.4: Reforestation & Ecosystem Offsets",
        page: "Page 14",
        textPre: "Regarding our global afforestation initiatives, VerdeCorp has actively financed corridor rehabilitation projects. In Brazil, local community networks coordinated the operations. Specifically, our auditing logs confirm we have ",
        highlightText: "planted 5,000 native saplings across Amazon Zone 4 reforestation corridor",
        textPost: " during the third quarter. These saplings comprise native species including Mahogany and Ceiba, which are optimized for local soil types and rapid root anchoring. This corridor is registered under local registry BR-AMZ-04.",
      };
    }
    return {
      title: "VerdeCorp Annual Sustainability Report 2024",
      section: "Section 4.1: Coastal Mangrove Offsets",
      page: "Page 22",
      textPre: "Our marine vegetation initiative focuses on tropical estuaries. In the northern region, mangrove restoration was completed. Verified logs state that our partners successfully ",
      highlightText: "restored 120 hectares of degraded mangrove habitat with verified carbon offsets",
      textPost: " which corresponds to approximately 8,200 mangrove trees under canopy tracking ID BR-MNG-12. These delta ecosystems show high carbon sequestration performance compared to terrestrial forests.",
    };
  };

  const pdfSource = getPdfSource(activeClaimId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 lg:grid-cols-12"
    >
      {/* Left Column: Claims List */}
      <div className="space-y-3 lg:col-span-5">
        <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/70 mb-2">
          Extracted Claims List
        </p>
        {sampleClaims.map((claim, index) => (
          <motion.div
            key={claim.id}
            onClick={() => setActiveClaimId(claim.id)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12 }}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              claim.id === activeClaimId
                ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.06)]"
                : "border-emerald-500/10 bg-emerald-950/20 hover:border-emerald-500/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                {claim.zone}
              </Badge>
              <span className="text-[10px] font-mono text-emerald-400/50">Verified RAG Extraction</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-emerald-100">
              &ldquo;{claim.claim}&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5 text-[11px] text-emerald-300/70">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-400" />
                Lat: {claim.lat}, Lng: {claim.lng}
              </span>
              <span className="inline-flex items-center gap-1">
                <TreePine className="h-3 w-3 text-emerald-400" />
                {claim.claimedTrees.toLocaleString()} trees
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Column: Explainability Layer (PDF Mockup) */}
      <div className="lg:col-span-7 flex flex-col">
        <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/70 mb-2 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          RAG Explainability Citation
        </p>

        <div className="rounded-2xl border border-emerald-500/10 bg-[#080e0b]/90 p-5 shadow-inner relative flex-1 flex flex-col justify-between overflow-hidden min-h-[250px]">
          {/* PDF Page Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3 mb-4 text-[10px] text-emerald-200/50 uppercase font-mono">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              {pdfSource.title}
            </span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">
              {pdfSource.page}
            </span>
          </div>

          {/* PDF Page Body (Mock layout) */}
          <div className="space-y-3 text-xs text-emerald-200/60 leading-relaxed font-sans pr-2">
            <p className="font-semibold text-emerald-100/90 text-[11px] uppercase tracking-wider mb-2">
              {pdfSource.section}
            </p>
            <p className="text-justify">
              {pdfSource.textPre}
              <mark className="bg-yellow-500/20 text-yellow-200 font-medium px-1.5 py-0.5 rounded border border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                {pdfSource.highlightText}
              </mark>
              {pdfSource.textPost}
            </p>
            <p className="text-emerald-200/30 line-through select-none text-[11px] leading-tight">
              Additionally, VerdeCorp sustainability parameters conform strictly to standard GHG protocol measures. Soil carbon organic content is assessed every semester, and remote-sensing arrays are calibrated with ground control points to maintain statistical validation criteria.
            </p>
          </div>

          {/* Citation Info */}
          <div className="mt-6 pt-3 border-t border-emerald-500/10 flex justify-between items-center text-[10px] text-emerald-400/60 font-mono">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Source integrity verified
            </div>
            <span>Confidence Index: 98.4%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
