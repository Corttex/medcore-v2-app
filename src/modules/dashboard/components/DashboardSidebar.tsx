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
  Mail,
  FolderOpen,
  Stethoscope
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
  { icon: Inbox, label: "Demandas", href: "/dashboard/processes", requiredPlan: "BASIC" },
  { icon: Bell, label: "Lembretes", href: "/dashboard/reminders", requiredPlan: "BASIC" },
  { icon: KanbanSquare, label: "Kanban", href: "/dashboard/kanban", requiredPlan: "BASIC" },
  { icon: Building2, label: "Unidades", href: "/dashboard/units", requiredPlan: "BASIC" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports", requiredPlan: "PRO" },
  { icon: Scale, label: "Jurídico", href: "/dashboard/legal", requiredPlan: "PRO" },
  { icon: CreditCard, label: "Contas", href: "/dashboard/accounts", requiredPlan: "PRO" },
  { icon: FolderOpen, label: "Drive & Scanner", href: "/dashboard/scanner", requiredPlan: "PRO" },
  { icon: Mail, label: "E-mails", href: "/dashboard/email", requiredPlan: "MAX" },
];

// Mobile bottom nav — most used items only
const mobileNavItems = [
  { icon: LayoutDashboard, label: "Início", href: "/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
  { icon: Inbox, label: "Demandas", href: "/dashboard/processes" },
  { icon: KanbanSquare, label: "Kanban", href: "/dashboard/kanban" },
  { icon: Brain, label: "IA", href: "/dashboard/ai-exec" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports" },
  { icon: Bell, label: "Lembretes", href: "/dashboard/reminders" },
  { icon: Building2, label: "Unidades", href: "/dashboard/units" },
  { icon: Scale, label: "Jurídico", href: "/dashboard/legal" },
  { icon: CreditCard, label: "Contas", href: "/dashboard/accounts" },
  { icon: FolderOpen, label: "Drive", href: "/dashboard/scanner" },
  { icon: Settings, label: "Config.", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useDashboardContext();
  const { hasAccess } = usePlan();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      {/* ═══════ DESKTOP SIDEBAR ═══════ */}
      <aside 
        className="h-screen w-60 bg-surface shadow-[4px_0_24px_rgba(0,0,0,0.08)] border-r border-outline-variant/30 flex flex-col py-4 fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out hidden lg:flex"
      >
        {/* Logo */}
        <div className="flex items-center px-4 mb-6">
          <Logo className="scale-90" />
        </div>

        {/* Unit Selector (stub) */}
        <div className="px-3 mb-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container/50 border border-outline-variant/20 text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:bg-surface-container transition-colors">
            <Stethoscope size={12} className="text-lilac" />
            <span className="truncate flex-1 text-left">Selecionar Unidade</span>
          </button>
        </div>

        {/* Main Nav */}
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
                  "flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-200 font-heading text-[12px] font-black uppercase tracking-widest italic group",
                  !authorized && "opacity-40 cursor-not-allowed",
                  authorized && isActive 
                    ? "bg-lilac/10 text-lilac shadow-sm border border-lilac/20" 
                    : authorized 
                      ? "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      : "text-on-surface-variant/50 grayscale"
                )}
              >
                <item.icon size={16} className={cn(
                  "transition-colors shrink-0",
                  isActive && authorized ? "text-lilac" : "text-on-surface-variant/60",
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

        {/* Footer */}
        <div className="mt-auto px-4 space-y-2">
          {/* IA Executiva CTA */}
          <Link 
            href="/dashboard/ai-exec" 
            className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-lilac to-lilac-container overflow-hidden shadow-lg shadow-lilac/30 hover:shadow-lilac/50 transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse-slow"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            <div className="relative flex items-center justify-center w-8 h-8 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
              <Brain size={18} className="text-white" />
              <Sparkles size={10} className="text-white/80 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div className="relative flex-1">
              <p className="text-[10px] font-black text-white tracking-tight italic">IA Executiva</p>
              <p className="text-[9px] text-white/60">MedCode · Online</p>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </Link>

          {/* Settings + Support */}
          <div className="flex gap-2 pb-4">
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                pathname === "/dashboard/settings"
                  ? "bg-lilac/10 text-lilac border-lilac/20"
                  : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <Settings size={12} />
              Config.
            </Link>
            <Link
              href="/dashboard/support"
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                pathname === "/dashboard/support"
                  ? "bg-lilac/10 text-lilac border-lilac/20"
                  : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <HelpCircle size={12} />
              Suporte
            </Link>
          </div>
        </div>
      </aside>

      {/* ═══════ MOBILE FULL SCREEN MENU ═══════ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-surface z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-2xl",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/20">
          <Logo className="scale-90" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Unit Selector Mobile */}
        <div className="px-4 py-3 border-b border-outline-variant/10">
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 text-xs font-black text-on-surface-variant uppercase tracking-widest">
            <Stethoscope size={14} className="text-lilac" />
            Selecionar Unidade
          </button>
        </div>

        {/* 2-Column Grid Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all active:scale-95",
                    isActive
                      ? "bg-lilac/10 border-lilac/30 text-lilac shadow-sm"
                      : "bg-surface-container/40 border-outline-variant/15 text-on-surface-variant hover:border-lilac/20 hover:bg-surface-container"
                  )}
                >
                  <item.icon size={22} className={isActive ? "text-lilac" : "text-on-surface-variant/70"} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-center">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile IA CTA */}
        <div className="p-4 border-t border-outline-variant/20">
          <Link
            href="/dashboard/ai-exec"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-lilac to-lilac-container shadow-lg shadow-lilac/30 active:scale-[0.98] transition-all"
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center relative">
              <Brain size={18} className="text-white" />
              <Sparkles size={10} className="text-white/80 absolute -top-1 -right-1" />
            </div>
            <div>
              <p className="text-xs font-black text-white italic">IA Executiva — MedCode</p>
              <p className="text-[10px] text-white/60">Assistente clínico ativo</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </Link>
        </div>
      </div>

      {/* ═══════ MOBILE STICKY BOTTOM BAR ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { icon: LayoutDashboard, href: "/dashboard" },
            { icon: Calendar, href: "/dashboard/agenda" },
            { icon: Inbox, href: "/dashboard/processes" },
            { icon: KanbanSquare, href: "/dashboard/kanban" },
            { icon: Settings, href: "/dashboard/settings" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isActive ? "text-lilac" : "text-on-surface-variant/50"
                )}
              >
                <item.icon size={22} />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
