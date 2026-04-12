"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-20 bg-zinc-950/50 backdrop-blur-md border-b border-zinc-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-teal-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por pacientes, processos..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-zinc-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full border-2 border-zinc-950"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-zinc-800 mx-2"></div>

        <button className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-black font-bold text-xs uppercase shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            JD
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-zinc-200 group-hover:text-white">John Doe</p>
            <p className="text-[10px] text-zinc-500">Administrador</p>
          </div>
        </button>
      </div>
    </header>
  );
}
