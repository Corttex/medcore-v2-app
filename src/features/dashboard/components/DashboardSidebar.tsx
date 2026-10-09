"use client";

import React, { useEffect } from "react";
import { 
  LayoutGrid, 
  CalendarRange, 
  Users, 
  FileText, 
  Layers, 
  BrainCircuit, 
  Settings,
  HelpCircle,
  BarChart2,
  Lock,
  Shield,
  X,
  Inbox,
  MessageSquare,
  Activity,
  Sparkles,
  Building2,
  Kanban,
  BellRing,
  Scale,
  CreditCard,
  ScanLine,
  Mail,
  FolderOpen,
  Stethoscope,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  PieChart,
  ChevronDown,
  Box,
  Wrench,
  Package,
  HeartHandshake,
  Smile,
  Megaphone,
  Tv,
  Video,
  FileSpreadsheet,
  HandCoins,
  Syringe,
  ShoppingCart,
  Briefcase,
  UserCheck,
  CalendarDays,
  GraduationCap,
  Award
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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mapeamento de links para IDs de módulos no Banco de Dados
const moduleIdMap: Record<string, string> = {
  // Loja de Módulos & Add-ons
  "/dashboard/loja": "dashboard",
  // Inteligência
  "/dashboard/ia-executiva": "ai-exec",
  "/dashboard": "dashboard",
  
  // Relacionamento & CRM
  "/dashboard/pacotes": "enterprise",
  "/dashboard/marketing": "enterprise",
  "/dashboard/nps": "dashboard",
  "/dashboard/mensagens": "dashboard",
  
  // Recepção & Atendimento
  "/dashboard/agenda": "dashboard",
  "/dashboard/agendamento-online": "enterprise",
  "/dashboard/painel-tv": "dashboard",
  "/dashboard/telemedicina": "enterprise",
  
  // Operacional & Clínico
  "/dashboard/pacientes": "dashboard",
  "/dashboard/demandas": "dashboard",
  "/dashboard/kanban": "dashboard",
  "/dashboard/lembretes": "dashboard",
  
  // Central Diagnóstica (RIS)
  "/dashboard/laudos": "dashboard",
  
  // Financeiro & Faturamento
  "/dashboard/contas": "enterprise",
  "/dashboard/contas-a-receber": "enterprise",
  "/dashboard/contas-a-pagar": "enterprise",
  "/dashboard/tiss": "enterprise",
  "/dashboard/repasses": "enterprise",
  "/dashboard/notas-fiscais": "enterprise",
  "/dashboard/relatorios-financeiros": "enterprise",
  
  // Suprimentos
  "/dashboard/estoque": "dashboard",
  "/dashboard/vacinas": "enterprise",
  "/dashboard/compras": "dashboard",
  
  // Gestão & Estrutura
  "/dashboard/hospitais": "enterprise",
  "/dashboard/cadastros": "dashboard",
  "/dashboard/os": "dashboard",
  "/dashboard/patrimonio": "dashboard",
  "/dashboard/arquivos": "enterprise",
  "/dashboard/juridico": "enterprise",
  "/dashboard/emails": "enterprise",
  
  // RH & Departamento Pessoal
  "/dashboard/escalas": "enterprise",
  "/dashboard/ponto": "enterprise",
  "/dashboard/folha": "enterprise",
  "/dashboard/recrutamento": "enterprise",
  "/dashboard/treinamentos": "enterprise",
  "/dashboard/desempenho": "enterprise",
  "/dashboard/equipe": "dashboard",
  
  // Administração
  "/dashboard/auditoria": "dashboard",
  "/dashboard/relatorios": "enterprise",
};

const menuBlocks = [
  {
    title: "Inteligência Clínica",
    items: [
      { icon: BrainCircuit, label: "Dra. Conte (Copilot)", href: "/dashboard/ia-executiva", requiredPlan: "BASIC" as PlanLevel, highlight: true },
      { icon: LayoutGrid, label: "Visão Executiva", href: "/dashboard", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Relacionamento & CRM",
    items: [
      { icon: Package, label: "Pacotes & Vendas", href: "/dashboard/pacotes", requiredPlan: "BASIC" as PlanLevel },
      { icon: Megaphone, label: "Marketing", href: "/dashboard/marketing", requiredPlan: "PRO" as PlanLevel },
      { icon: Smile, label: "Pesquisa NPS", href: "/dashboard/nps", requiredPlan: "BASIC" as PlanLevel },
      { icon: MessageSquare, label: "Inbox CRM", href: "/dashboard/mensagens", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Recepção & Atendimento",
    items: [
      { icon: CalendarRange, label: "Agenda", href: "/dashboard/agenda", requiredPlan: "BASIC" as PlanLevel },
      { icon: HeartHandshake, label: "Agendamento Online", href: "/dashboard/agendamento-online", requiredPlan: "PRO" as PlanLevel },
      { icon: Tv, label: "Painel de TV", href: "/dashboard/painel-tv", requiredPlan: "BASIC" as PlanLevel },
      { icon: Video, label: "Telemedicina", href: "/dashboard/telemedicina", requiredPlan: "PRO" as PlanLevel },
    ]
  },
  {
    title: "Operacional & Clínico",
    items: [
      { icon: Users, label: "Pacientes", href: "/dashboard/pacientes", requiredPlan: "BASIC" as PlanLevel },
      { icon: Inbox, label: "Demandas", href: "/dashboard/demandas", requiredPlan: "BASIC" as PlanLevel },
      { icon: Kanban, label: "Kanban", href: "/dashboard/kanban", requiredPlan: "BASIC" as PlanLevel },
      { icon: BellRing, label: "Lembretes", href: "/dashboard/lembretes", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Central Diagnóstica (RIS)",
    items: [
      { icon: Activity, label: "Worklist de Laudos", href: "/dashboard/laudos", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Financeiro & Faturamento",
    items: [
      { icon: CreditCard, label: "Contas (Caixa)", href: "/dashboard/contas", requiredPlan: "PRO" as PlanLevel },
      { icon: ArrowDownRight, label: "Contas a Receber", href: "/dashboard/contas-a-receber", requiredPlan: "PRO" as PlanLevel },
      { icon: ArrowUpRight, label: "Contas a Pagar", href: "/dashboard/contas-a-pagar", requiredPlan: "PRO" as PlanLevel },
      { icon: FileSpreadsheet, label: "Faturamento TISS", href: "/dashboard/tiss", requiredPlan: "PRO" as PlanLevel },
      { icon: HandCoins, label: "Repasses Médicos", href: "/dashboard/repasses", requiredPlan: "PRO" as PlanLevel },
      { icon: Receipt, label: "Emitir NF", href: "/dashboard/notas-fiscais", requiredPlan: "PRO" as PlanLevel },
      { icon: PieChart, label: "Relatório Financeiro", href: "/dashboard/relatorios-financeiros", requiredPlan: "PRO" as PlanLevel },
    ]
  },
  {
    title: "Suprimentos",
    items: [
      { icon: Box, label: "Estoque Central", href: "/dashboard/estoque", requiredPlan: "BASIC" as PlanLevel },
      { icon: Syringe, label: "Controle de Vacinas", href: "/dashboard/vacinas", requiredPlan: "PRO" as PlanLevel },
      { icon: ShoppingCart, label: "Compras", href: "/dashboard/compras", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Gestão & Estrutura",
    items: [
      { icon: Building2, label: "Hospitais", href: "/dashboard/hospitais", requiredPlan: "BASIC" as PlanLevel },
      { icon: Settings, label: "Cadastros Base", href: "/dashboard/cadastros", requiredPlan: "BASIC" as PlanLevel },
      { icon: Wrench, label: "Central de OS", href: "/dashboard/os", requiredPlan: "BASIC" as PlanLevel },
      { icon: Box, label: "Patrimônio", href: "/dashboard/patrimonio", requiredPlan: "BASIC" as PlanLevel },
      { icon: FolderOpen, label: "Drive & Scanner", href: "/dashboard/arquivos", requiredPlan: "PRO" as PlanLevel },
      { icon: Scale, label: "Jurídico", href: "/dashboard/juridico", requiredPlan: "PRO" as PlanLevel },
      { icon: Mail, label: "E-mails Corporativos", href: "/dashboard/emails", requiredPlan: "MAX" as PlanLevel },
    ]
  },
  {
    title: "RH & Departamento Pessoal",
    items: [
      { icon: CalendarDays, label: "Escalas & Plantões", href: "/dashboard/escalas", requiredPlan: "PRO" as PlanLevel },
      { icon: UserCheck, label: "Ponto & Frequência", href: "/dashboard/ponto", requiredPlan: "PRO" as PlanLevel },
      { icon: FileSpreadsheet, label: "Folha & Benefícios", href: "/dashboard/folha", requiredPlan: "PRO" as PlanLevel },
      { icon: Briefcase, label: "Recrutamento (ATS)", href: "/dashboard/recrutamento", requiredPlan: "PRO" as PlanLevel },
      { icon: GraduationCap, label: "Treinamentos", href: "/dashboard/treinamentos", requiredPlan: "PRO" as PlanLevel },
      { icon: Award, label: "Avaliação de Desempenho", href: "/dashboard/desempenho", requiredPlan: "PRO" as PlanLevel },
      { icon: Users, label: "Gerenciar Equipe", href: "/dashboard/equipe", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Administração",
    items: [
      { icon: Shield, label: "Auditoria & LGPD", href: "/dashboard/auditoria", requiredPlan: "BASIC" as PlanLevel },
      { icon: BarChart2, label: "BI & Indicadores", href: "/dashboard/relatorios", requiredPlan: "PRO" as PlanLevel },
    ]
  }
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
  const [selectedEspecialidade, setSelectedEspecialidade] = React.useState("Dermatologia");
  const [showEspecialidadeMenu, setShowEspecialidadeMenu] = React.useState(false);

  const ESPECIALIDADES = [
    "Clínica Geral",
    "Dermatologia",
    "Estética",
    "Capilar",
    "Ginecologia",
    "Cardiologia",
    "Fisioterapia",
    "Nutrição",
    "Ortopedia",
    "Psicologia",
    "Psiquiatria",
    "Odontologia",
    "Medicina Diagnóstica"
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      {/* ═══════ DESKTOP SIDEBAR ═══════ */}
      <aside 
        className={cn(
          "h-screen w-[260px] flex flex-col py-4 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out hidden lg:flex backdrop-blur-3xl border-r-2",
          theme === 'dark' 
            ? "bg-zinc-950/80 border-zinc-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.4)]" 
            : "bg-white/95 border-zinc-300 shadow-[4px_0_24px_rgba(0,0,0,0.08)]"
        )}
      >
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[80%] h-[20%] rounded-full blur-[100px] pointer-events-none transition-opacity duration-700",
          theme === 'dark' ? "bg-rd-cyan/10 opacity-100" : "bg-rd-cyan/5 opacity-50"
        )}></div>

        {/* Logo */}
        <div className="flex items-center px-5 mb-6 relative z-10">
          <Logo className="scale-95 origin-left" />
        </div>

        {/* Especialidade Selector (Desktop) */}
        <div className="px-4 mb-5 relative z-50">
          <button 
            onClick={() => setShowEspecialidadeMenu(!showEspecialidadeMenu)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 transition-all group text-left shadow-sm",
              theme === 'dark' ? "bg-zinc-900/90 border-zinc-750 hover:border-rd-cyan/60" : "bg-zinc-50 border-zinc-300 hover:border-rd-cyan/60 hover:bg-white"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-rd-cyan/15 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan shrink-0 transition-transform group-hover:scale-110">
              <Box size={16} strokeWidth={2} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className={cn(
                "text-[10px] font-heading font-semibold uppercase tracking-widest leading-none",
                theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
              )}>Especialidade</p>
              <p className={cn(
                "text-sm font-sans font-semibold truncate mt-1 tracking-tight transition-colors",
                theme === 'dark' ? "text-white group-hover:text-rd-cyan" : "text-zinc-900 group-hover:text-rd-cyan"
              )}>
                {selectedEspecialidade}
              </p>
            </div>
            <div className={cn(
              "shrink-0 transition-all",
              showEspecialidadeMenu ? "rotate-180" : "group-hover:translate-y-0.5",
              theme === 'dark' ? "text-zinc-400 group-hover:text-rd-cyan" : "text-zinc-500 group-hover:text-rd-cyan"
            )}>
              <ChevronDown size={14} strokeWidth={2} />
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {showEspecialidadeMenu && (
            <div className={cn(
              "absolute top-full left-4 right-4 mt-2 py-2 rounded-xl border z-50 shadow-xl backdrop-blur-xl max-h-60 overflow-y-auto custom-scrollbar",
              theme === 'dark' ? "bg-zinc-900/95 border-zinc-800" : "bg-white/95 border-zinc-200"
            )}>
              {ESPECIALIDADES.map((esp) => (
                <button
                  key={esp}
                  onClick={() => {
                    setSelectedEspecialidade(esp);
                    setShowEspecialidadeMenu(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    selectedEspecialidade === esp 
                      ? (theme === 'dark' ? "bg-rd-cyan/20 text-rd-cyan font-bold" : "bg-rd-cyan/10 text-rd-cyan font-bold")
                      : (theme === 'dark' ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900")
                  )}
                >
                  {esp}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Nav (Block Layout) */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 relative z-10 custom-scrollbar">
          {menuBlocks.map((block) => (
            <div key={block.title} className="space-y-2.5">
              <h3 className="px-2 text-[11px] font-heading font-semibold text-rd-cyan uppercase tracking-[0.2em] opacity-90">
                {block.title}
              </h3>
              <div className={cn(
                "border-2 rounded-2xl p-1.5 flex flex-col gap-1 transition-colors shadow-sm",
                theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-zinc-100/70 border-zinc-300"
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
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 font-sans text-sm font-medium group relative overflow-hidden cursor-pointer border border-transparent",
                        (!authorized || inMaintenance) && "opacity-60 cursor-not-allowed",
                        inMaintenance && "border-rd-cyan/30 bg-rd-cyan/10",
                        
                        /* Default Hover and Active States */
                        authorized && !inMaintenance && isActive && !isHighlighted && (
                          theme === 'dark'
                            ? "bg-rd-cyan/15 border-rd-cyan/40 text-rd-cyan shadow-sm"
                            : "bg-rd-cyan/10 border-rd-cyan/30 text-rd-cyan shadow-sm"
                        ),
                        authorized && !inMaintenance && !isActive && !isHighlighted && (
                          theme === 'dark' 
                            ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 hover:border-zinc-700/60" 
                            : "text-zinc-600 hover:text-zinc-950 hover:bg-white hover:border-zinc-300 shadow-2xs"
                        ),
                        
                        /* HIGHLIGHTED (IA Executiva) Styles */
                        isHighlighted && !inMaintenance && (
                          theme === 'dark'
                            ? "bg-zinc-950 border border-rd-cyan text-white shadow-[0_0_15px_rgba(0,169,255,0.2)]"
                            : "bg-white border border-rd-cyan text-zinc-950 shadow-[0_0_15px_rgba(0,169,255,0.2)]"
                        ),
                        isHighlighted && !inMaintenance && isActive && "ring-2 ring-rd-cyan"
                      )}
                    >
                      {/* Animated Shine for MEGA button */}
                      {isHighlighted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
                      )}

                      <item.icon 
                        size={isHighlighted ? 20 : 16} 
                        strokeWidth={2}
                        className={cn(
                          "transition-transform duration-300 shrink-0",
                          isActive && authorized && !isHighlighted ? "text-rd-cyan" : "",
                          isHighlighted 
                            ? theme === 'dark' ? "text-rd-cyan animate-pulse-slow" : "text-zinc-950 animate-pulse-slow" 
                            : "text-zinc-400",
                          authorized && !isActive && !isHighlighted && (
                            theme === 'dark' ? "group-hover:text-zinc-200" : "group-hover:text-zinc-900"
                          ),
                          isHighlighted && "group-hover:scale-125"
                        )} 
                      />
                      
                      <span className="flex-1 flex items-center justify-between z-10">
                        <span className={cn(isHighlighted && "font-bold text-inherit")}>{item.label}</span>
                        {!authorized && !inMaintenance && (
                          <span className={cn(
                            "flex items-center gap-1 border-2 px-1.5 py-0.5 rounded-md text-[10px] font-heading font-bold tracking-widest uppercase shadow-inner shrink-0 ml-2",
                            theme === 'dark' ? "bg-zinc-950 border-zinc-700 text-zinc-400" : "bg-white border-zinc-300 text-zinc-600"
                          )}>
                            <Lock size={10} strokeWidth={2} />
                            {item.requiredPlan}
                          </span>
                        )}
                        {inMaintenance && (
                          <span className="flex items-center gap-1 bg-rd-cyan/20 border border-rd-cyan/40 px-1.5 py-0.5 rounded-md text-[10px] font-heading text-rd-cyan font-bold tracking-widest uppercase shadow-inner animate-pulse shrink-0 ml-2">
                            <Wrench size={10} strokeWidth={2} />
                            MANU
                          </span>
                        )}
                        {isHighlighted && authorized && !inMaintenance && (
                          <Sparkles size={14} strokeWidth={2} className={cn(theme === 'dark' ? "text-rd-cyan" : "text-zinc-950", "animate-pulse")} />
                        )}
                      </span>
                    </ItemWrapper>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "mt-auto px-4 py-4 border-t-2",
          theme === 'dark' ? "border-zinc-800/80" : "border-zinc-300"
        )}>
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_var(--color-emerald-500)]"></div>
            <span className={cn(
              "text-[10px] font-heading font-semibold uppercase tracking-widest",
              theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
            )}>Kernel Engine: v2.4.0</span>
          </div>
        </div>
      </aside>

      {/* ═══════ MOBILE & TABLET FULL SCREEN MENU (CATEGORIZADO) ═══════ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 w-full bg-surface z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-2xl border-r-2",
        theme === 'dark' ? "border-zinc-750 bg-zinc-950" : "border-zinc-300 bg-white",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header Drawer */}
        <div className={cn("flex justify-between items-center px-5 py-4 border-b-2", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
          <Logo className="scale-90" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className={cn("p-2 rounded-xl transition-colors border-2", theme === 'dark' ? "text-zinc-400 hover:text-white bg-zinc-900 border-zinc-750" : "text-zinc-600 hover:text-zinc-950 bg-zinc-100 border-zinc-300")}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Unit Selector Mobile / Tablet */}
        <div className={cn("px-4 py-3 border-b-2", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
          <button 
            onClick={() => { setSelectedUnitId(null); setMobileMenuOpen(false); }}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all shadow-sm",
              theme === 'dark' ? "bg-zinc-900/90 border-zinc-750 text-white hover:border-rd-cyan/60" : "bg-zinc-50 border-zinc-300 text-zinc-900 hover:border-rd-cyan/60"
            )}
          >
            <div className="flex items-center gap-2.5">
               <Stethoscope size={16} strokeWidth={2} className="text-rd-cyan" />
               <span className="text-sm font-sans font-semibold truncate max-w-[240px]">
                 {units.find(u => u.id === selectedUnitId)?.name || "Selecionar Hospital"}
               </span>
            </div>
            <ChevronDown size={14} strokeWidth={2} className="text-zinc-400" />
          </button>
        </div>

        {/* Navegação Categorizada por Blocos (Inteligência, Operacional, Financeiro, Gestão) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {menuBlocks.map((block) => (
            <div key={block.title} className="space-y-2.5">
              <h3 className="px-2 text-[11px] font-heading font-semibold text-rd-cyan uppercase tracking-[0.2em] flex items-center gap-2 opacity-90">
                <span className="w-1.5 h-3.5 bg-rd-cyan rounded-full shadow-[0_0_8px_#a78bfa]"></span>
                {block.title}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {block.items.filter(item => isModuleEnabled(moduleIdMap[item.href] || "dashboard")).map((item) => {
                  const isActive = pathname === item.href;
                  const authorized = hasAccess(item.requiredPlan);
                  const isHighlighted = item.highlight;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all active:scale-95 text-center relative overflow-hidden shadow-sm w-full",
                        isActive
                          ? "bg-blue-500/10 border-blue-500/50 shadow-md shadow-blue-500/20 font-bold"
                          : theme === 'dark'
                            ? "bg-zinc-900/80 border-blue-500/20 text-zinc-300 hover:border-blue-500/50 hover:text-white"
                            : "bg-zinc-50 border-blue-500/20 text-zinc-700 hover:border-blue-500/50 hover:bg-white",
                        isHighlighted && !isActive && "border-blue-500/60 bg-blue-500/10"
                      )}
                    >
                      <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 group-hover:border-blue-500/50 transition-all overflow-hidden flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] pointer-events-none" />
                        <item.icon size={20} strokeWidth={2} className="text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-[11px] font-sans font-semibold tracking-wide leading-tight w-full break-words line-clamp-2 px-1 text-center">{item.label}</span>
                      {!authorized && (
                        <span className="text-[10px] font-heading font-bold px-1.5 py-0.5 bg-zinc-950 border border-zinc-700 text-zinc-400 rounded flex items-center gap-1 uppercase shrink-0 mt-auto tracking-widest">
                          <Lock size={10} strokeWidth={2} /> {item.requiredPlan}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Mobile / Tablet IA CTA */}
        <div className={cn("p-4 border-t-2", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
          <Link
            href="/dashboard/ia-executiva"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-rd-cyan to-indigo-700 shadow-lg shadow-rd-cyan/30 active:scale-[0.98] transition-all border-2 border-rd-cyan/60"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative shrink-0">
              <BrainCircuit size={20} strokeWidth={2} className="text-white" />
              <Sparkles size={10} strokeWidth={2} className="text-white/80 absolute -top-1 -right-1" />
            </div>
            <div>
              <p className="text-sm font-sans font-semibold text-white">Dra. Conte — Copilot Clínico</p>
              <p className="text-[11px] font-sans font-medium text-white/80">Assistente médica e automação de cadastros ativa</p>
            </div>
            <div className="ml-auto w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
          </Link>
        </div>
      </div>

      {/* ═══════ MOBILE & TABLET STICKY BOTTOM BAR (Bordas Evidentes) ═══════ */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden backdrop-blur-2xl border-t-2 safe-area-bottom shadow-2xl",
        theme === 'dark' ? "bg-zinc-950/95 border-zinc-750" : "bg-white/95 border-zinc-300"
      )}>
        <div className="flex items-center justify-start sm:justify-around px-2 py-2 w-full overflow-x-auto no-scrollbar gap-2 sm:gap-0">
          {[
            { icon: LayoutGrid, label: "Início", href: "/dashboard" },
            { icon: MessageSquare, label: "Inbox CRM", href: "/dashboard/mensagens" },
            { icon: BrainCircuit, label: "Dra. Conte", href: "/dashboard/ia-executiva", highlight: true },
            { icon: CalendarRange, label: "Agenda", href: "/dashboard/agenda" },
            { icon: Users, label: "Pacientes", href: "/dashboard/pacientes" },
            { icon: Kanban, label: "Kanban", href: "/dashboard/kanban" },
            { icon: Building2, label: "Hospitais", href: "/dashboard/hospitais" },
          ].map((item) => {
            const isActive = pathname === item.href;
            const isHighlighted = item.highlight;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-1 py-1 rounded-xl transition-all min-w-[56px] shrink-0",
                  isActive ? "text-rd-cyan font-bold" : "text-zinc-400 hover:text-on-surface",
                  isHighlighted && "text-rd-cyan"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center transition-transform",
                  isHighlighted && "p-1.5 bg-rd-cyan/15 rounded-xl border-2 border-rd-cyan/40 text-rd-cyan shadow-sm"
                )}>
                  <item.icon size={isHighlighted ? 22 : 20} strokeWidth={2} />
                </div>
                <span className={cn(
                  "text-[10px] font-sans font-semibold tracking-wide text-center",
                  isHighlighted ? "text-rd-cyan font-bold" : "text-zinc-400"
                )}>
                  {item.label}
                </span>
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
