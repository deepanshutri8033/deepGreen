export type AuditClaim = {
  id: string;
  company: string;
  claim: string;
  location: string;
  lat: number;
  lng: number;
  claimedTrees: number;
  zone: string;
};

export type NdviPoint = {
  month: string;
  value: number;
  expected: number;
};

export type ComplianceLaw = {
  code: string;
  title: string;
  jurisdiction: string;
};

export const sampleClaims: AuditClaim[] = [
  {
    id: "claim-1",
    company: "VerdeCorp Industries",
    claim:
      "Planted 5,000 native saplings across Amazon Zone 4 reforestation corridor.",
    location: "Amazon Zone 4",
    lat: -3.46,
    lng: -62.21,
    claimedTrees: 5000,
    zone: "BR-AMZ-04",
  },
  {
    id: "claim-2",
    company: "VerdeCorp Industries",
    claim:
      "Restored 120 hectares of degraded mangrove habitat with verified carbon offsets.",
    location: "Coastal Delta Region",
    lat: -1.92,
    lng: -55.02,
    claimedTrees: 8200,
    zone: "BR-MNG-12",
  },
];

export const ndviTimeline: Record<number, NdviPoint[]> = {
  2024: [
    { month: "Jan", value: 0.62, expected: 0.6 },
    { month: "Mar", value: 0.68, expected: 0.65 },
    { month: "Jun", value: 0.71, expected: 0.7 },
    { month: "Sep", value: 0.69, expected: 0.72 },
    { month: "Dec", value: 0.67, expected: 0.74 },
  ],
  2025: [
    { month: "Jan", value: 0.66, expected: 0.75 },
    { month: "Mar", value: 0.63, expected: 0.78 },
    { month: "Jun", value: 0.58, expected: 0.8 },
    { month: "Sep", value: 0.54, expected: 0.82 },
    { month: "Dec", value: 0.51, expected: 0.84 },
  ],
  2026: [
    { month: "Jan", value: 0.49, expected: 0.85 },
    { month: "Mar", value: 0.47, expected: 0.86 },
    { month: "Jun", value: 0.44, expected: 0.87 },
  ],
};

export const complianceLaws: ComplianceLaw[] = [
  {
    code: "ENV-2024-117",
    title: "Mandatory Reforestation Verification Act",
    jurisdiction: "Brazil — Federal Environmental Agency",
  },
  {
    code: "CARBON-SEC-09",
    title: "Corporate Carbon Credit Disclosure Standard",
    jurisdiction: "International Sustainability Board",
  },
  {
    code: "FOREST-ALERT-03",
    title: "Illegal Logging Rapid Response Protocol",
    jurisdiction: "Amazon Basin Monitoring Coalition",
  },
];

export const workflowSteps = [
  {
    step: 1,
    title: "Upload Report",
    description: "Auditor uploads corporate sustainability PDF",
  },
  {
    step: 2,
    title: "RAG Parsing",
    description: "AI extracts claims, coordinates, and tree counts",
  },
  {
    step: 3,
    title: "Satellite Verification",
    description: "Sentinel-2 tiles fetched for exact coordinates",
  },
  {
    step: 4,
    title: "Anomaly Detection",
    description: "NDVI analysis flags canopy decline vs. claims",
  },
  {
    step: 5,
    title: "Red Alert Dispatch",
    description: "Compliance notice generated and alerts sent",
  },
];

export const dashboardStats = [
  { label: "Reports Audited", value: "847", change: "+12%" },
  { label: "Anomalies Detected", value: "23", change: "+4" },
  { label: "Canopy Verified (ha)", value: "14.2K", change: "+8%" },
  { label: "Alerts Dispatched", value: "19", change: "Live" },
];
