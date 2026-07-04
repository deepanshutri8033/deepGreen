"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  FileText,
  LayoutDashboard,
  Leaf,
  Map,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: true },
  { icon: FileText, label: "Reports", href: "/dashboard", active: false },
  { icon: Map, label: "Satellite Map", href: "/dashboard", active: false },
  { icon: BarChart3, label: "NDVI Analytics", href: "/dashboard", active: false },
  { icon: AlertTriangle, label: "Alerts", href: "/dashboard", active: false },
  { icon: Shield, label: "Compliance", href: "/dashboard", active: false },
  { icon: Settings, label: "Settings", href: "/dashboard", active: false },
];

export function DashboardSidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden w-64 shrink-0 flex-col border-r border-emerald-500/10 bg-[#060a08]/90 lg:flex"
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-emerald-500/10 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-bold text-emerald-50">DeepGreen</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
              item.active
                ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/25"
                : "text-emerald-200/50 hover:bg-emerald-500/5 hover:text-emerald-200"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-emerald-500/10 p-4">
        <div className="glass-panel rounded-xl p-3">
          <p className="text-xs font-medium text-emerald-300">Audit Status</p>
          <p className="mt-1 text-xs text-emerald-200/50">
            Sentinel-2 tiles cached · Redis active
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-950">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
