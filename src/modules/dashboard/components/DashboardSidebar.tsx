"use client";

import React, { useEffect } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Layers, 
  Bell, 
  Brain, 
  Activity,
  Settings,
  HelpCircle,
  AlertOctagon,
  ShieldCheck,
  BarChart3,
  Lock,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Logo } from "@/modules/shared/components/Logo";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardContext";
import { usePlan, PlanLevel } from "@/modules/shared/context/PlanContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mainMenuItems: { icon: any; label: string; href: string; requiredPlan: PlanLevel }[] = [
  { icon: LayoutDashboard, label: "Visão Executiva", href: "/dashboard", requiredPlan: "BASIC" },
  { icon: Calendar, label: "Agenda", href: "/dashboard/agenda", requiredPlan: "BASIC" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports", requiredPlan: "PRO" },
  { icon: Users, label: "Reuniões", href: "/dashboard/meetings", requiredPlan: "PRO" },
  { icon: FileText, label: "Documentos", href: "/dashboard/documents", requiredPlan: "PRO" },
  { icon: Layers, label: "Processos", href: "/dashboard/processes", requiredPlan: "MAX" },
  { icon: Brain, label: "IA Executiva", href: "/dashboard/ai-exec", requiredPlan: "MAX" },
];

const footerMenuItems = [
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Suporte", href: "/dashboard/support" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useDashboardContext();
  const { hasAccess } = usePlan();

  // Fecha o menu ao trocar de rota no mobile
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Core */}
      <aside 
        className={cn(
          "h-screen w-72 bg-[#020617] shadow-[4px_0_24px_rgba(0,0,0,0.5)] border-r border-white/5 flex flex-col py-8 fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex justify-between items-center px-4 mb-10 w-full relative">
          <div className="flex-1 flex justify-center">
            <Logo className="scale-90" />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const authorized = hasAccess(item.requiredPlan);
            
            const ItemWrapper = authorized ? Link : "div";
            
            return (
              <ItemWrapper
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 transition-all duration-200 font-heading text-sm font-medium tracking-wide group",
                  !authorized && "opacity-50 cursor-not-allowed",
                  authorized && isActive 
                    ? "bg-primary/10 text-primary border-l-4 border-primary" 
                    : authorized 
                      ? "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                      : "text-zinc-600 grayscale bg-zinc-950"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors",
                  isActive && authorized ? "text-primary" : "text-zinc-500",
                  authorized && !isActive && "group-hover:text-zinc-200"
                )} />
                <span className="flex-1 flex items-center justify-between">
                  {item.label}
                  {!authorized && (
                    <span className="flex items-center gap-1 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-full text-[10px] text-zinc-400 font-bold tracking-widest uppercase shadow-inner">
                      <Lock size={10} className="text-zinc-500" />
                      {item.requiredPlan}
                    </span>
                  )}
                </span>
              </ItemWrapper>
            );
          })}
        </nav>

        <div className="mt-auto px-6 space-y-1">
          <div className="mb-6">
            <Link 
              href="/dashboard/emergency" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error/20 transition-all group"
            >
              <AlertOctagon size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Protocolo de Emergência</span>
            </Link>
          </div>

          {footerMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-2.5 text-zinc-500 hover:text-zinc-200 transition-colors font-heading text-sm font-medium tracking-wide"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
