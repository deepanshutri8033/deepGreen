"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/80 via-[#0a1410] to-[#060a08] p-10 sm:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="relative mx-auto max-w-2xl text-center">
            <Leaf className="mx-auto h-10 w-10 text-emerald-400" />
            <h2 className="mt-6 text-3xl font-bold text-emerald-50 sm:text-4xl">
              Stop phantom forests. Start verifying.
            </h2>
            <p className="mt-4 text-emerald-200/60">
              Upload a sustainability report and watch DeepGreen cross-examine
              every claim against live satellite ground truth.
            </p>
            <Button size="lg" className="mt-8 min-w-[220px]" asChild>
              <Link href="/dashboard">
                Open Audit Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const FooterLink = ({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) => {
  const classes = cn(
    "group relative inline-flex items-center text-neutral-500 hover:text-white transition-colors py-0.5 font-sans",
    "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[1px] before:w-full before:bg-white before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:origin-left hover:before:scale-x-100"
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#030604] border-t border-white/[0.06] pt-16 pb-28 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group self-start">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 ring-1 ring-white/5 group-hover:bg-[#e8702a]/10 group-hover:border-[#e8702a]/30 transition-all duration-300">
                <Leaf className="h-[16px] w-[16px] text-[#e8702a] fill-[#e8702a]/10" />
              </div>
              <span className="text-white text-2xl font-playfair italic transition-colors group-hover:text-neutral-200">
                DeepGreen
              </span>
            </Link>
            <p className="text-sm text-neutral-500 font-sans max-w-xs mt-2 leading-relaxed">
              Verify corporate sustainability claims against live Sentinel-2 satellite ground truth. Fully automated auditing.
            </p>
            <p className="text-xs text-neutral-600 font-sans mt-4">
              &copy; copyright DeepGreen {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>

          {/* Links Column 1: Pages */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Pages
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><FooterLink href="/#features">Features</FooterLink></li>
              <li><FooterLink href="/#workflow">Workflow</FooterLink></li>
              <li><FooterLink href="/#architecture">Architecture</FooterLink></li>
              <li><FooterLink href="/docs">Methodology</FooterLink></li>
              <li><FooterLink href="/about">About Us</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 2: Socials */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Socials
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><FooterLink href="https://facebook.com" external>Facebook</FooterLink></li>
              <li><FooterLink href="https://instagram.com" external>Instagram</FooterLink></li>
              <li><FooterLink href="https://twitter.com" external>Twitter</FooterLink></li>
              <li><FooterLink href="https://linkedin.com" external>LinkedIn</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 3: Legal & Register */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Legal
            </h4>
            <ul className="flex flex-col gap-2 text-sm mb-4">
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/cookies">Cookie Policy</FooterLink></li>
            </ul>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Register
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><FooterLink href="/dashboard">Sign Up</FooterLink></li>
              <li><FooterLink href="/dashboard">Login</FooterLink></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant faint backdrop text */}
      <div className="absolute bottom-[-3rem] left-0 right-0 pointer-events-none select-none overflow-hidden h-[16rem] flex items-end">
        <span className="text-[14vw] font-intro-display font-extrabold text-white/[0.03] select-none tracking-tighter leading-none translate-y-[15%] uppercase w-full text-left pl-4 sm:pl-8">
          DeepGreen
        </span>
      </div>
    </footer>
  );
}
