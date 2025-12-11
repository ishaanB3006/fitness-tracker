"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: "wellness" | "energy" | "strength" | "calm";
  index?: number;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendValue,
  gradient = "wellness",
  index = 0,
}: StatsCardProps) {
  const gradients = {
    wellness: "from-emerald-400 to-teal-500",
    energy: "from-amber-400 to-orange-500",
    strength: "from-rose-400 to-red-500",
    calm: "from-violet-400 to-purple-500",
  };

  const iconBg = {
    wellness: "bg-emerald-500/10 text-emerald-500",
    energy: "bg-amber-500/10 text-amber-500",
    strength: "bg-rose-500/10 text-rose-500",
    calm: "bg-violet-500/10 text-violet-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl bg-card border shadow-sm p-5 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Gradient accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 bg-gradient-to-br",
          gradients[gradient]
        )}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("p-2.5 rounded-xl", iconBg[gradient])}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && trendValue && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                trend === "up" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                trend === "down" && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                trend === "neutral" && "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "–"} {trendValue}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold">{value}</span>
          {subValue && (
            <span className="text-sm text-muted-foreground">{subValue}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

