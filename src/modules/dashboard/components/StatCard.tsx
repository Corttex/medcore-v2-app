import React from "react";
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color?: "teal" | "cyan" | "zinc";
}

export function StatCard({ label, value, trend, icon: Icon, color = "teal" }: StatCardProps) {
  const colorMap = {
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    zinc: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl border", colorMap[color])}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-zinc-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
      </div>
    </div>
  );
}
