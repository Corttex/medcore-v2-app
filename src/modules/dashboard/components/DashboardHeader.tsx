"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ShieldCheck, Menu, User, TrendingUp, AlertTriangle } from "lucide-react";
import { Logo } from "@/modules/shared/components/Logo";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardContext";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Visão Executiva",
  "/dashboard/agenda": "Agenda Clínica",
  "/dashboard/meetings": "Reuniões e Comitês",
  "/dashboard/documents": "Repositório de Documentos",
  "/dashboard/processes": "Gestão de Processos",
  "/dashboard/admin": "Administração do Sistema",
  "/dashboard/ai-exec": "IA Executiva (CORE)",
  "/dashboard/architecture": "Arquitetura Holística",
  "/dashboard/reports": "Relatórios Estratégicos",
};

export function DashboardHeader() {
  const { toggleMobileMenu } = useDashboardContext();
  const pathname = usePathname();
  const currentTitle = routeTitles[pathname] || "Dashboard";
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 w-full h-20 bg-[#020617]/90 backdrop-blur-2xl z-40 border-b border-white/5 shadow-2xl flex justify-between items-center px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 -ml-2 text-zinc-400 hover:text-white lg:hidden transition-colors rounded-lg hover:bg-white/5"
        >
          <Menu size={24} />
        </button>
        <Logo className="hidden lg:hidden w-32" width={120} height={35} />
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl font-heading font-black text-white tracking-tight">{currentTitle}</h1>
          <p className="text-xs text-zinc-400 font-medium tracking-wide">Status: <span className="text-emerald-400 font-semibold">Operacional</span></p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden md:flex items-center bg-surface-container-highest/50 px-4 py-2 rounded-full border border-white/5 focus-within:border-primary/30 transition-all group overflow-hidden max-w-sm">
          <Search className="text-zinc-500 group-focus-within:text-primary transition-colors shrink-0" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar na base..." 
            className="bg-transparent border-none text-sm text-white placeholder:text-zinc-600 focus:ring-0 w-full ml-3 outline-none"
          />
        </div>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "w-10 h-10 flex items-center justify-center transition-all duration-300 relative rounded-full hover:bg-white/5",
              showNotifications ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-primary"
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#3adffa] animate-pulse"></span>
          </button>

          {/* Notificações Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 max-h-[85vh] overflow-y-auto custom-scrollbar bg-[#090b14]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 origin-top-right">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-sm font-black font-heading text-white">Central de Alertas</h3>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">2 Novas</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0 border border-error/20">
                    <AlertTriangle size={14} className="text-error" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">Sobrecarga no CTI (Setor Alpha)</p>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">A capacidade de admissão superou 92%. Ação diretiva requerida.</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors flex gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <TrendingUp size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary">Relatório Estratégico Pronto</p>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">Análise de eficiência cirúrgica semanal gerada pela IA Core.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button className="w-10 h-10 hidden sm:flex items-center justify-center text-zinc-400 hover:text-primary transition-all duration-300 rounded-full hover:bg-white/5">
          <ShieldCheck size={20} />
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-1 md:mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 md:gap-4 transition-all group cursor-pointer hover:opacity-80">
          <div className="text-right hidden sm:block flex-shrink-0">
            <p className="text-sm font-black text-white font-heading leading-tight truncate">Dr. Thorne</p>
            <p className="text-[10px] text-primary/70 font-black uppercase tracking-[0.2em] mt-0.5 truncate">CMO</p>
          </div>
          <div className="relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" 
              alt="Dr. Alistair Thorne" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover ring-2 ring-primary/20 shadow-2xl group-hover:ring-primary/50 transition-all"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-lg"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
