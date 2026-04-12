"use client";

import React, { useEffect } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Layers, 
  Brain, 
  Settings,
  HelpCircle,
  BarChart3,
  Lock,
  X,
  Inbox,
  Sparkles,
  Building2,
  KanbanSquare,
  Bell,
  Scale,
  CreditCard,
  ScanLine,
  Mail
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
  { icon: Inbox, label: "Demandas Internas", href: "/dashboard/processes", requiredPlan: "BASIC" },
  { icon: Bell, label: "Lembretes", href: "/dashboard/reminders", requiredPlan: "BASIC" },
  { icon: KanbanSquare, label: "Kanban", href: "/dashboard/kanban", requiredPlan: "BASIC" },
  { icon: Building2, label: "Unidades", href: "/dashboard/units", requiredPlan: "BASIC" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports", requiredPlan: "PRO" },
  { icon: Scale, label: "Jurídico", href: "/dashboard/legal", requiredPlan: "PRO" },
  { icon: CreditCard, label: "Contas", href: "/dashboard/accounts", requiredPlan: "PRO" },
  { icon: ScanLine, label: "Scanner", href: "/dashboard/scanner", requiredPlan: "PRO" },
  { icon: Mail, label: "E-mails", href: "/dashboard/email", requiredPlan: "MAX" },
];

const footerMenuItems: { icon: any; label: string; href: string }[] = [];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useDashboardContext();
  const { hasAccess } = usePlan();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Core */}
      <aside 
        className={cn(
          "h-screen w-72 bg-surface shadow-[4px_0_24px_rgba(0,0,0,0.08)] border-r border-outline-variant/50 flex flex-col py-8 fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex justify-between items-center px-4 mb-10 w-full relative">
          <div className="flex-1 flex justify-center">
            <Logo className="scale-90" />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute right-4 p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const authorized = hasAccess(item.requiredPlan);
            
            const ItemWrapper = authorized ? Link : "div";
            
            return (
              <ItemWrapper
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-heading text-sm font-medium tracking-wide group",
                  !authorized && "opacity-40 cursor-not-allowed",
                  authorized && isActive 
                    ? "bg-primary/10 text-primary shadow-sm border border-primary/20" 
                    : authorized 
                      ? "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      : "text-on-surface-variant/50 grayscale"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors shrink-0",
                  isActive && authorized ? "text-primary" : "text-on-surface-variant/60",
                  authorized && !isActive && "group-hover:text-on-surface"
                )} />
                <span className="flex-1 flex items-center justify-between">
                  {item.label}
                  {!authorized && (
                    <span className="flex items-center gap-1 bg-surface-container border border-outline-variant/60 px-2 py-0.5 rounded-full text-[10px] text-on-surface-variant/60 font-bold tracking-widest uppercase">
                      <Lock size={9} />
                      {item.requiredPlan}
                    </span>
                  )}
                </span>
              </ItemWrapper>
            );
          })}
        </nav>

        <div className="mt-auto px-4 space-y-2">
          {/* Botão IA Executiva - Destaque Principal */}
          <div className="mb-3">
            <Link 
              href="/dashboard/ai-exec" 
              className="group relative flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary-container overflow-hidden shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Glow Animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-white/10 rounded-full blur-lg" />
              
              <div className="relative flex items-center justify-center w-9 h-9 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                <Brain size={20} className="text-white" />
                <Sparkles size={10} className="text-white/80 absolute -top-1 -right-1" />
              </div>
              <div className="relative flex-1">
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] leading-none mb-0.5">Exclusivo MAX</p>
                <p className="text-sm font-black text-white tracking-tight">IA Executiva</p>
              </div>
              <div className="relative w-2 h-2 bg-emerald-300 rounded-full shadow-[0_0_8px_#6ee7b7] animate-pulse" />
            </Link>
          </div>

          {footerMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-heading text-sm font-medium tracking-wide"
            >
              <item.icon size={18} className="text-on-surface-variant/60" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
