"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 z-50 ${
        isDark
          ? "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
          : "border-black/10 bg-white text-zinc-600 hover:text-zinc-900 shadow-sm"
      }`}
      title="Alternar tema"
    >
      {isDark ? <Sun size={11} className="text-white" /> : <Moon size={11} className="text-[var(--color-rd-navy)]" />}
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
