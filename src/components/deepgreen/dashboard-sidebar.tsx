"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  TrendingUp,
  Receipt,
  Home,
  User,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutGrid, label: "Overview", href: "/dashboard", active: false },
  { icon: TrendingUp, label: "Analytics", href: "/dashboard", active: false },
  { icon: Receipt, label: "Budget & Claims", href: "/dashboard", active: true },
  { icon: Home, label: "Home", href: "/", active: false },
  { icon: User, label: "Profile", href: "/dashboard", active: false },
  { icon: ShieldAlert, label: "Security & Alerts", href: "/dashboard", active: false },
  { icon: SlidersHorizontal, label: "Settings", href: "/dashboard", active: false },
];

export function DashboardSidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden w-20 shrink-0 flex-col items-center border-r border-white/[0.08] bg-[#060a08] py-6 lg:flex h-screen sticky top-0"
    >
      {/* Brand Circular Logo */}
      <div className="mb-8">
        <Link href="/" className="group flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500/25 ring-2 ring-emerald-500/10 transition-all hover:scale-105">
          {/* Logo inner geometric shape */}
          <div className="relative h-6 w-6 rounded-full bg-gradient-to-tr from-[#10b981] to-[#bbfb1d] flex items-center justify-center">
            <div className="absolute h-3 w-1 bg-[#060a08] rounded-full" />
            <div className="absolute h-1 w-3 bg-[#060a08] rounded-full" />
          </div>
        </Link>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-1 flex-col gap-4 w-full items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 relative",
                  item.active
                    ? "bg-[#bbfb1d] text-[#060a08] shadow-[0_0_15px_rgba(187,251,29,0.35)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/5 hover:scale-105"
                )}
              >
                <Icon className="h-5 w-5 stroke-[1.8]" />
              </Link>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-white/[0.08] text-white text-[10px] font-sans font-medium px-2 py-1 rounded-md whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Info / Icon */}
      <div className="mt-auto">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
      </div>
    </motion.aside>
  );
}
