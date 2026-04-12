"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon,
  ChevronDown,
  LayoutGrid
} from "lucide-react";
import { useTheme } from "@/modules/shared/context/ThemeContext";

export function EnterpriseHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar em todas as unidades..."
              className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl py-2.5 pl-12 pr-4 text-xs font-medium text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-outline-variant/10 hover:bg-surface-container-highest transition-all text-on-surface"
            title={theme === 'dark' ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Apps */}
          <button className="p-2.5 rounded-xl border border-outline-variant/10 hover:bg-surface-container-highest transition-all text-zinc-500 hover:text-on-surface">
            <LayoutGrid size={18} />
          </button>

          {/* Notifications */}
          <button className="p-2.5 rounded-xl border border-outline-variant/10 hover:bg-surface-container-highest transition-all text-zinc-500 hover:text-on-surface relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-outline-variant/20 mx-2 hidden sm:block"></div>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-2 py-1.5 pr-3 rounded-xl hover:bg-surface-container-highest transition-all cursor-pointer group border border-transparent hover:border-outline-variant/10">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[10px] font-black text-on-surface leading-tight uppercase tracking-tight italic">Admin Master</p>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-0.5">Gestão Global</p>
            </div>
            <ChevronDown size={14} className="text-zinc-600 group-hover:rotate-180 transition-transform hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
