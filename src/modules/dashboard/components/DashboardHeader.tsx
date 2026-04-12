"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ShieldCheck, Menu, User, TrendingUp, AlertTriangle, Settings, LifeBuoy, Sun, Moon } from "lucide-react";
import { useTheme } from "@/modules/shared/context/ThemeContext";
import { Logo } from "@/modules/shared/components/Logo";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardContext";
import { usePlan, PlanLevel } from "@/modules/shared/context/PlanContext";
import { usePathname, useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Visão Executiva",
  "/dashboard/agenda": "Agenda Clínica",
  "/dashboard/processes": "Demandas Internas",
  "/dashboard/reminders": "Lembretes & Notificações",
  "/dashboard/kanban": "Kanban de Notas",
  "/dashboard/units": "Unidades Hospitalares",
  "/dashboard/reports": "Relatórios Estratégicos",
  "/dashboard/legal": "Processos Jurídicos",
  "/dashboard/accounts": "Gestor de Contas",
  "/dashboard/scanner": "Scanner de Documentos",
  "/dashboard/email": "Painel de E-mails",
  "/dashboard/admin": "Administração do Sistema",
  "/dashboard/ai-exec": "IA Executiva (CORE)",
  "/dashboard/emergency": "Gestão de Emergência",
  "/dashboard/architecture": "Arquitetura do Sistema",
};

export function DashboardHeader() {
  const { toggleMobileMenu } = useDashboardContext();
  const { activePlan, setActivePlan } = usePlan();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const currentTitle = routeTitles[pathname] || "Dashboard";
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (planRef.current && !planRef.current.contains(event.target as Node)) {
        setShowPlanSwitcher(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 w-full h-16 bg-surface/95 backdrop-blur-2xl z-40 border-b border-outline-variant/30 shadow-sm flex justify-between items-center px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface lg:hidden transition-colors rounded-lg hover:bg-surface-container"
        >
          <Menu size={24} />
        </button>
        <Logo className="hidden lg:hidden w-32" width={120} height={35} />
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl font-heading font-black text-on-surface tracking-tight">{currentTitle}</h1>
          <p className="text-xs text-on-surface-variant font-medium tracking-wide">Status: <span className="text-emerald-600 font-semibold">Operacional</span></p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/50 focus-within:border-lilac/50 transition-all group overflow-hidden max-w-sm">
          <Search className="text-on-surface-variant/60 group-focus-within:text-lilac transition-colors shrink-0" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar na base..." 
            className="bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 w-full ml-3 outline-none"
          />
        </div>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-lilac transition-all duration-300 rounded-xl hover:bg-surface-container border border-outline-variant/30"
          title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Plan Switcher */}
        <div className="relative z-50 ml-2" ref={planRef}>
          <button 
            onClick={() => setShowPlanSwitcher(!showPlanSwitcher)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-lilac-500/30 bg-lilac-500/10 hover:bg-lilac-500/20 transition-all shadow-[0_0_15px_rgba(167,139,250,0.1)] group"
          >
            <span className="text-[10px] font-bold text-lilac-400/70 uppercase tracking-widest hidden sm:block">Simulador:</span>
            <span className="text-xs font-black text-lilac-400 tracking-wider">
              {activePlan}
            </span>
          </button>
          
          {showPlanSwitcher && (
            <div className="absolute right-0 mt-3 w-40 bg-surface border border-outline-variant/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 origin-top-right flex flex-col gap-1">
              {(["BASIC", "PRO", "MAX"] as PlanLevel[]).map((plan) => (
                <button
                  key={plan}
                  onClick={() => {
                    setActivePlan(plan);
                    setShowPlanSwitcher(false);
                  }}
                  className={cn(
                    "text-left px-3 py-2 rounded-xl text-xs font-bold transition-all",
                    activePlan === plan 
                      ? "bg-lilac/10 text-lilac border border-lilac/20" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  )}
                >
                  Modo {plan}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "w-10 h-10 flex items-center justify-center transition-all duration-300 relative rounded-full hover:bg-surface-container",
              showNotifications ? "text-lilac bg-lilac/10" : "text-on-surface-variant hover:text-lilac"
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-lilac rounded-full shadow-[0_0_8px_rgba(167,139,250,0.6)] animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 max-h-[85vh] overflow-y-auto bg-surface border border-outline-variant/60 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 origin-top-right">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-sm font-black font-heading text-on-surface">Central de Alertas</h3>
                <span className="text-[10px] bg-lilac/10 text-lilac px-2 py-0.5 rounded-full font-bold border border-lilac/20">2 Novas</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high transition-colors flex gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0 border border-error/20">
                    <AlertTriangle size={14} className="text-error" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Sobrecarga no CTI (Setor Alpha)</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1">A capacidade de admissão superou 92%. Ação diretiva requerida.</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-lilac/5 border border-lilac/20 hover:bg-lilac/10 transition-colors flex gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-lilac/15 flex items-center justify-center shrink-0 border border-lilac/30">
                    <TrendingUp size={14} className="text-lilac" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-lilac">Relatório Estratégico Pronto</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1">Análise de eficiência cirúrgica semanal gerada pela IA Core.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button className="w-10 h-10 hidden sm:flex items-center justify-center text-on-surface-variant hover:text-lilac transition-all duration-300 rounded-full hover:bg-surface-container">
          <ShieldCheck size={20} />
        </button>

        <div className="h-8 w-[1px] bg-outline-variant/50 mx-1 md:mx-2 hidden sm:block"></div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 md:gap-4 transition-all group cursor-pointer hover:opacity-80"
          >
            <div className="text-right hidden sm:block flex-shrink-0">
              <p className="text-sm font-black text-on-surface font-heading leading-tight truncate">Dr. Thorne</p>
              <p className="text-[10px] text-lilac font-black uppercase tracking-[0.2em] mt-0.5 truncate">CMO</p>
            </div>
            <div className="relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" 
                alt="Dr. Alistair Thorne" 
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover ring-2 shadow-md transition-all",
                  showProfileMenu ? "ring-lilac" : "ring-lilac/20 group-hover:ring-lilac/50"
                )}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-surface border border-outline-variant/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
              <div className="px-3 py-2 mb-2 border-b border-outline-variant/30">
                <p className="text-xs font-black text-on-surface font-heading uppercase tracking-widest">Painel Pessoal</p>
              </div>
              <div className="flex flex-col gap-1">
                <Link 
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings size={16} className="text-zinc-500" />
                  Configurações
                </Link>
                <Link 
                  href="/dashboard/support"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <LifeBuoy size={16} className="text-zinc-500" />
                  Suporte Técnico
                </Link>
                <div className="h-[1px] bg-outline-variant/30 my-1 mx-2"></div>
                <button 
                  onClick={() => { /* Logout logic */ }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-error hover:bg-error/10 transition-all"
                >
                  <AlertTriangle size={16} />
                  Encerrar Sessão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
