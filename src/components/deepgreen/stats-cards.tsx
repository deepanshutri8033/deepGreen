"use client";

import { motion } from "framer-motion";
import { dashboardStats } from "@/lib/mock-data";

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="glass-panel rounded-2xl p-5"
        >
          <p className="text-sm text-emerald-200/50">{stat.label}</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-bold text-emerald-50">{stat.value}</span>
            <span
              className={`text-xs font-medium ${
                stat.change === "Live"
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
