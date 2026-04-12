"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-20 glass px-8 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-teal-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por pacientes, processos..." 
            className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/30 transition-all placeholder:text-zinc-600 block"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-teal-500/20 transition-all relative group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]"></span>
        </button>
        
        <div className="h-6 w-[1px] bg-zinc-800/50"></div>

        <button className="flex items-center gap-4 px-3 py-1.5 rounded-2xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-zinc-200 font-heading leading-tight group-hover:text-white">Admin User</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Super Médico</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs group-hover:border-teal-500/30 transition-all shadow-inner">
            AU
          </div>
        </button>
      </div>
    </header>
  );
}
