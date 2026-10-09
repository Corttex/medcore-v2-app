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
  color?: "teal" | "cyan" | "zinc" | "lilac" | "emerald";
}

export function StatCard({ label, value, trend, icon: Icon, color = "teal" }: StatCardProps) {
  const colorMap = {
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20 shadow-[0_0_20px_rgba(45,212,191,0.05)]",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]",
    zinc: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20 shadow-[0_0_20px_rgba(113,113,122,0.05)]",
    lilac: "text-rd-cyan bg-rd-cyan/10 border-rd-cyan/20 shadow-[0_0_20px_var(--color-rd-cyan)]",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
  };

  return (
    <div className="p-5 bg-surface border border-white/10 rounded-2xl shadow-card hover:border-teal-500/30 transition-all group relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 blur-[30px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/10 transition-colors"></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className={cn("p-2.5 rounded-xl border flex items-center justify-center backdrop-blur-md shadow-inner", colorMap[color])}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border",
            trend.isPositive 
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
              : "bg-red-500/10 text-red-500 border-red-500/20"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-semibold text-on-surface font-heading tracking-tight group-hover:text-teal-400 transition-colors">{value}</h3>
      </div>
    </div>
  );
}
