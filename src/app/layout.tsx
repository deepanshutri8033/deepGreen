import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/ui/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const introSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-intro-serif",
  subsets: ["latin"],
});

const introDisplay = Syne({
  weight: ["700", "800"],
  variable: "--font-intro-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeepGreen — AI Satellite Auditing Platform",
  description:
    "Verify corporate sustainability claims against live Sentinel-2 satellite ground truth. Fully automated carbon credit auditing without manual analysts.",
  keywords: [
    "satellite auditing",
    "carbon credits",
    "NDVI",
    "greenwashing",
    "Sentinel-2",
    "sustainability reports",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${introSerif.variable} ${introDisplay.variable} antialiased`}
    >
      <body className="min-h-screen">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
