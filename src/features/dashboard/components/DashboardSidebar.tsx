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
  Stethoscope,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Logo } from "@/components/ui/Logo";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { usePlan, PlanLevel } from "@/context/PlanContext";
import { useModules } from "@/context/ModuleContext";
import { MaintenanceModal } from "@/components/ui/MaintenanceModal";
import { Wrench } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mapeamento de links para IDs de módulos no Banco de Dados
const moduleIdMap: Record<string, string> = {
  "/dashboard": "dashboard",
  "/dashboard/ai-exec": "ai-exec",
  "/dashboard/units": "enterprise",
  "/dashboard/accounts": "enterprise",
  "/dashboard/scanner": "enterprise",
  "/dashboard/legal": "enterprise",
  "/dashboard/reports": "enterprise",
  "/dashboard/email": "enterprise",
  "/dashboard/receivables": "enterprise",
  "/dashboard/payables": "enterprise",
  "/dashboard/invoices": "enterprise",
  "/dashboard/finance-reports": "enterprise",
};

const menuBlocks = [
  {
    title: "Inteligência",
    items: [
      { icon: Brain, label: "IA Executiva", href: "/dashboard/ai-exec", requiredPlan: "BASIC" as PlanLevel, highlight: true },
      { icon: LayoutDashboard, label: "Visão Executiva", href: "/dashboard", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Operacional",
    items: [
      { icon: Inbox, label: "Demandas", href: "/dashboard/processes", requiredPlan: "BASIC" as PlanLevel },
      { icon: KanbanSquare, label: "Kanban", href: "/dashboard/kanban", requiredPlan: "BASIC" as PlanLevel },
      { icon: Calendar, label: "Agenda", href: "/dashboard/agenda", requiredPlan: "BASIC" as PlanLevel },
      { icon: Bell, label: "Lembretes", href: "/dashboard/reminders", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Financeiro",
    items: [
      { icon: CreditCard, label: "Contas", href: "/dashboard/accounts", requiredPlan: "PRO" as PlanLevel },
      { icon: ArrowDownRight, label: "Contas a Receber", href: "/dashboard/receivables", requiredPlan: "PRO" as PlanLevel },
      { icon: ArrowUpRight, label: "Contas a Pagar", href: "/dashboard/payables", requiredPlan: "PRO" as PlanLevel },
      { icon: Receipt, label: "Emitir NF", href: "/dashboard/invoices", requiredPlan: "PRO" as PlanLevel },
      { icon: PieChart, label: "Relatório Dados", href: "/dashboard/finance-reports", requiredPlan: "PRO" as PlanLevel },
    ]
  },
  {
    title: "Gestão & Estrutura",
    items: [
      { icon: Building2, label: "Unidades", href: "/dashboard/units", requiredPlan: "BASIC" as PlanLevel },
      { icon: FolderOpen, label: "Drive & Scanner", href: "/dashboard/scanner", requiredPlan: "PRO" as PlanLevel },
      { icon: Scale, label: "Jurídico", href: "/dashboard/legal", requiredPlan: "PRO" as PlanLevel },
      { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports", requiredPlan: "PRO" as PlanLevel },
      { icon: Mail, label: "E-mails", href: "/dashboard/email", requiredPlan: "MAX" as PlanLevel },
    ]
  }
];

// Mobile bottom nav — most used items only
const mobileNavItems = [
  { icon: LayoutDashboard, label: "Início", href: "/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
  { icon: Inbox, label: "Demandas", href: "/dashboard/processes" },
  { icon: KanbanSquare, label: "Kanban", href: "/dashboard/kanban" },
  { icon: Brain, label: "IA", href: "/dashboard/ai-exec", highlight: true },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports" },
  { icon: Bell, label: "Lembretes", href: "/dashboard/reminders" },
  { icon: Building2, label: "Unidades", href: "/dashboard/units" },
  { icon: Scale, label: "Jurídico", href: "/dashboard/legal" },
  { icon: CreditCard, label: "Contas", href: "/dashboard/accounts" },
  { icon: FolderOpen, label: "Drive", href: "/dashboard/scanner" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { 
    isMobileMenuOpen, 
    setMobileMenuOpen, 
    selectedUnitId, 
    setSelectedUnitId,
    units 
  } = useDashboardContext();
  const { theme } = useTheme();
  const { hasAccess } = usePlan();
  const { isModuleEnabled, isModuleInMaintenance, getModuleMaintenanceMessage } = useModules();

  const [maintenanceModule, setMaintenanceModule] = React.useState<{ name: string; message: string } | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      {/* ═══════ DESKTOP SIDEBAR ═══════ */}
      <aside 
        className={cn(
          "h-screen w-[260px] flex flex-col py-4 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out hidden lg:flex backdrop-blur-3xl border-r",
          theme === 'dark' 
            ? "bg-zinc-950/80 border-zinc-800/50 shadow-[4px_0_24px_rgba(0,0,0,0.2)]" 
            : "bg-white/95 border-zinc-200 shadow-[4px_0_24px_rgba(0,0,0,0.05)]"
        )}
      >
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[80%] h-[20%] rounded-full blur-[100px] pointer-events-none transition-opacity duration-700",
          theme === 'dark' ? "bg-brand/10 opacity-100" : "bg-brand/5 opacity-50"
        )}></div>

        {/* Logo */}
        <div className="flex items-center px-5 mb-6 relative z-10">
          <Logo className="scale-95 origin-left" />
        </div>

        {/* Unit Display (Static) */}
        <div className="px-4 mb-5 relative z-10">
          <div className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200 shadow-sm"
          )}>
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
              <Building2 size={16} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest leading-none",
                theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
              )}>Hospital</p>
              <p className={cn(
                "text-[12px] font-black italic truncate mt-1 tracking-tight",
                theme === 'dark' ? "text-white" : "text-zinc-900"
              )}>
                {units[0]?.name || "Sem unidade"}
              </p>
              <p className="text-[8px] text-brand font-bold uppercase tracking-widest mt-0.5">Status Ativo • V2</p>
            </div>
          </div>
        </div>

        {/* Main Nav (Block Layout) */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-7 relative z-10 custom-scrollbar">
          {menuBlocks.map((block) => (
            <div key={block.title} className="space-y-3">
              <h3 className="px-2 text-[10px] font-black text-brand uppercase tracking-[0.2em] italic opacity-80">
                {block.title}
              </h3>
              <div className={cn(
                "border rounded-2xl p-1.5 flex flex-col gap-1 transition-colors",
                theme === 'dark' ? "bg-zinc-900/40 border-zinc-800/40" : "bg-zinc-100/50 border-zinc-200"
              )}>
                {block.items.filter(item => isModuleEnabled(moduleIdMap[item.href] || "dashboard")).map((item) => {
                  const isActive = pathname === item.href;
                  const authorized = hasAccess(item.requiredPlan);
                  const moduleId = moduleIdMap[item.href] || "dashboard";
                  const inMaintenance = isModuleInMaintenance(moduleId);
                  
                  const ItemWrapper = (authorized && !inMaintenance) ? Link : "div";
                  const isHighlighted = item.highlight;
                  
                  return (
                    <ItemWrapper
                      key={item.href}
                      href={item.href}
                      onClick={inMaintenance ? () => setMaintenanceModule({ 
                        name: item.label, 
                        message: getModuleMaintenanceMessage(moduleId) 
                      }) : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-1 rounded-xl transition-all duration-300 font-heading text-[11px] font-black uppercase tracking-widest italic group relative overflow-hidden cursor-pointer",
                        (!authorized || inMaintenance) && "opacity-60 cursor-not-allowed",
                        inMaintenance && "border border-brand/20 bg-brand/5",
                        
                        /* Default Hover and Active States */
                        authorized && !inMaintenance && isActive && !isHighlighted && "bg-brand/10 text-brand shadow-sm",
                        authorized && !inMaintenance && !isActive && !isHighlighted && (
                          theme === 'dark' 
                            ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50" 
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
                        ),
                        
                        /* MEGA HIGHLIGHTED (IA Executiva) Styles */
                        isHighlighted && !inMaintenance && (
                          theme === 'dark'
                            ? "bg-gradient-to-br from-brand/40 via-brand/10 to-transparent border-2 border-brand/60 text-white shadow-[0_0_35px_rgba(167,139,250,0.25)] scale-[1.04] py-5 mb-2 mt-1"
                            : "bg-gradient-to-br from-brand via-brand/80 to-brand/60 border-2 border-white text-white shadow-[0_0_25px_rgba(167,139,250,0.3)] scale-[1.04] py-5 mb-2 mt-1"
                        ),
                        isHighlighted && !inMaintenance && isActive && "border-white/50 shadow-[0_0_45px_rgba(167,139,250,0.4)] ring-2 ring-brand/40"
                      )}
                    >
                      {/* Animated Shine for MEGA button */}
                      {isHighlighted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
                      )}

                      <item.icon size={isHighlighted ? 20 : 16} className={cn(
                        "transition-transform duration-300 shrink-0",
                        isActive && authorized && !isHighlighted ? "text-brand" : "",
                        isHighlighted 
                          ? theme === 'dark' ? "text-brand animate-pulse-slow" : "text-white animate-pulse-slow" 
                          : "text-zinc-500",
                        authorized && !isActive && !isHighlighted && (
                          theme === 'dark' ? "group-hover:text-zinc-300" : "group-hover:text-zinc-900"
                        ),
                        isHighlighted && "group-hover:scale-125"
                      )} />
                      
                      <span className="flex-1 flex items-center justify-between z-10">
                        <span className={cn(isHighlighted && "text-sm tracking-tighter")}>{item.label}</span>
                        {!authorized && !inMaintenance && (
                          <span className={cn(
                            "flex items-center gap-1 border px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase shadow-inner",
                            theme === 'dark' ? "bg-zinc-950 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-400"
                          )}>
                            <Lock size={8} />
                            {item.requiredPlan}
                          </span>
                        )}
                        {inMaintenance && (
                          <span className="flex items-center gap-1 bg-brand/20 border border-brand/30 px-2 py-0.5 rounded-md text-[9px] text-brand font-black tracking-widest uppercase shadow-inner animate-pulse">
                            <Wrench size={8} />
                            MANU
                          </span>
                        )}
                        {isHighlighted && authorized && !inMaintenance && (
                          <Sparkles size={14} className={cn(theme === 'dark' ? "text-brand" : "text-white", "animate-bounce")} />
                        )}
                      </span>
                    </ItemWrapper>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer (Simplified) */}
        <div className={cn(
          "mt-auto px-4 py-4 border-t",
          theme === 'dark' ? "border-zinc-800/50" : "border-zinc-200"
        )}>
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_var(--color-emerald-500)]"></div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em]",
              theme === 'dark' ? "text-zinc-600" : "text-zinc-400"
            )}>Kernel Engine: v2.4.0</span>
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
            { icon: Building2, href: "/dashboard/units" },
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

      <MaintenanceModal 
        isOpen={!!maintenanceModule}
        onClose={() => setMaintenanceModule(null)}
        moduleName={maintenanceModule?.name || ""}
        message={maintenanceModule?.message || ""}
      />
    </>
  );
}
