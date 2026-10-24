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
  Award,
  Globe,
  LogOut,
  ChevronRight,
  Smartphone,
  ShoppingBag
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
import { useUser } from "@/context/UserContext";
import { MaintenanceModal } from "@/components/ui/MaintenanceModal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mapeamento de links para IDs de módulos no Banco de Dados
const moduleIdMap: Record<string, string> = {
  // Habilidades Dra. Conte & Add-ons
  "/dashboard/loja": "dashboard",
  "/dashboard/carreira": "dashboard",
  "/mobile": "dashboard",
  // Inteligência
  "/dashboard/ia-executiva": "ai-exec",
  "/dashboard": "dashboard",
  
  // Relacionamento & CRM
  "/dashboard/pacotes": "enterprise",
  "/dashboard/marketing": "enterprise",
  "/dashboard/webstudio": "enterprise",
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

// Matriz de Controle de Acesso Baseada em Papel (RBAC Hospitalar)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  // Diretoria, Gestão Executiva e Administradores (Acesso Total)
  DIRETOR_GERAL: ["*"],
  DIRETOR_CLINICO: ["*"],
  GESTOR_UNIDADE: ["*"],
  admin: ["*"],
  super_admin: ["*"],
  owner: ["*"],

  // Atendimento & Recepção
  SECRETARIA_RECEPCAO: [
    "/dashboard",
    "/dashboard/agenda",
    "/dashboard/agendamento-online",
    "/dashboard/painel-tv",
    "/dashboard/telemedicina",
    "/dashboard/pacientes",
    "/dashboard/mensagens",
    "/dashboard/lembretes",
    "/dashboard/cadastros"
  ],
  OPERADOR_AGENDAMENTO: [
    "/dashboard",
    "/dashboard/agenda",
    "/dashboard/agendamento-online",
    "/dashboard/pacientes",
    "/dashboard/mensagens",
    "/dashboard/lembretes"
  ],
  CONCIERGE_ESPERA: [
    "/dashboard",
    "/dashboard/painel-tv",
    "/dashboard/agenda",
    "/dashboard/lembretes"
  ],

  // Corpo Clínico & Médicos
  MEDICO_ESPECIALISTA: [
    "/dashboard",
    "/dashboard/ia-executiva",
    "/dashboard/agenda",
    "/dashboard/pacientes",
    "/dashboard/laudos",
    "/dashboard/telemedicina",
    "/dashboard/demandas",
    "/dashboard/lembretes"
  ],
  MEDICO_PLANTONISTA: [
    "/dashboard",
    "/dashboard/ia-executiva",
    "/dashboard/pacientes",
    "/dashboard/laudos",
    "/dashboard/demandas",
    "/dashboard/lembretes"
  ],
  MEDICO_AUDITOR: [
    "/dashboard",
    "/dashboard/pacientes",
    "/dashboard/laudos",
    "/dashboard/tiss",
    "/dashboard/auditoria",
    "/dashboard/relatorios"
  ],
  ODONTOLOGO: [
    "/dashboard",
    "/dashboard/agenda",
    "/dashboard/pacientes",
    "/dashboard/laudos",
    "/dashboard/lembretes"
  ],
  VETERINARIO: [
    "/dashboard",
    "/dashboard/agenda",
    "/dashboard/pacientes",
    "/dashboard/laudos",
    "/dashboard/vacinas",
    "/dashboard/lembretes"
  ],

  // Enfermagem & Assistencial
  ENFERMEIRA_CHEFE: [
    "/dashboard",
    "/dashboard/pacientes",
    "/dashboard/agenda",
    "/dashboard/escalas",
    "/dashboard/ponto",
    "/dashboard/estoque",
    "/dashboard/vacinas",
    "/dashboard/demandas",
    "/dashboard/treinamentos"
  ],
  ENFERMEIRO_ASSISTENCIAL: [
    "/dashboard",
    "/dashboard/pacientes",
    "/dashboard/agenda",
    "/dashboard/estoque",
    "/dashboard/vacinas",
    "/dashboard/ponto",
    "/dashboard/escalas"
  ],
  TECNICO_ENFERMAGEM: [
    "/dashboard",
    "/dashboard/pacientes",
    "/dashboard/estoque",
    "/dashboard/vacinas",
    "/dashboard/ponto"
  ],
  FARMACEUTICO_BIOMEDICO: [
    "/dashboard",
    "/dashboard/estoque",
    "/dashboard/compras",
    "/dashboard/vacinas",
    "/dashboard/laudos",
    "/dashboard/ponto"
  ],
  FISIOTERAPEUTA_MULTI: [
    "/dashboard",
    "/dashboard/agenda",
    "/dashboard/pacientes",
    "/dashboard/demandas",
    "/dashboard/ponto"
  ],

  // Faturamento, Financeiro & Patrimônio
  ANALISTA_TISS: [
    "/dashboard",
    "/dashboard/tiss",
    "/dashboard/contas-a-receber",
    "/dashboard/repasses",
    "/dashboard/notas-fiscais",
    "/dashboard/relatorios-financeiros"
  ],
  ANALISTA_FINANCEIRO: [
    "/dashboard",
    "/dashboard/contas",
    "/dashboard/contas-a-receber",
    "/dashboard/contas-a-pagar",
    "/dashboard/notas-fiscais",
    "/dashboard/relatorios-financeiros"
  ],
  GERENTE_FINANCEIRO: [
    "/dashboard",
    "/dashboard/contas",
    "/dashboard/contas-a-receber",
    "/dashboard/contas-a-pagar",
    "/dashboard/tiss",
    "/dashboard/repasses",
    "/dashboard/notas-fiscais",
    "/dashboard/relatorios-financeiros",
    "/dashboard/relatorios"
  ],
  GESTOR_PATRIMONIO_ESTOQUE: [
    "/dashboard",
    "/dashboard/estoque",
    "/dashboard/compras",
    "/dashboard/patrimonio",
    "/dashboard/os"
  ],

  // Jurídico & Compliance
  JURIDICO: [
    "/dashboard",
    "/dashboard/juridico",
    "/dashboard/arquivos",
    "/dashboard/auditoria",
    "/dashboard/relatorios"
  ],

  // RH & Departamento Pessoal
  ANALISTA_RH_PONTO: [
    "/dashboard",
    "/dashboard/equipe",
    "/dashboard/escalas",
    "/dashboard/ponto",
    "/dashboard/folha",
    "/dashboard/recrutamento",
    "/dashboard/treinamentos",
    "/dashboard/desempenho"
  ],

  // Usuário de Consulta
  USUARIO_CONSULTA: [
    "/dashboard",
    "/dashboard/relatorios"
  ]
};

function isRouteAllowedForRole(role: string | undefined, href: string): boolean {
  if (!role) return true; // Se o perfil ainda não estiver carregado na sessão, mantém visível
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return true; // Papel não restrito tem acesso padrão
  if (allowed.includes("*")) return true; // Acesso total
  return allowed.includes(href);
}

const menuBlocks: {
  title: string;
  pending?: boolean;
  items: {
    icon: any;
    label: string;
    href: string;
    requiredPlan: PlanLevel;
    highlight?: boolean;
    pending?: boolean;
  }[];
}[] = [
  {
    title: "Ecossistema Dra. Conte",
    items: [
      { icon: BrainCircuit, label: "Dra. Conte Executive AI", href: "/dashboard/ia-executiva", requiredPlan: "BASIC" as PlanLevel, highlight: true },
      { icon: LayoutGrid, label: "Visão Executiva", href: "/dashboard", requiredPlan: "BASIC" as PlanLevel },
      { icon: Award, label: "Carreira & Produtividade", href: "/dashboard/carreira", requiredPlan: "BASIC" as PlanLevel, pending: true },
      { icon: ShoppingBag, label: "Habilidades Dra. Conte", href: "/dashboard/loja", requiredPlan: "BASIC" as PlanLevel },
      { icon: Smartphone, label: "Gestão Mobile (PWA)", href: "/mobile", requiredPlan: "BASIC" as PlanLevel, pending: true },
    ]
  },
  {
    title: "Relacionamento & CRM",
    items: [
      { icon: Package, label: "Pacotes & Vendas", href: "/dashboard/pacotes", requiredPlan: "BASIC" as PlanLevel },
      { icon: Megaphone, label: "Marketing", href: "/dashboard/marketing", requiredPlan: "PRO" as PlanLevel, pending: true },
      { icon: Globe, label: "WebStudio (Site)", href: "/dashboard/webstudio", requiredPlan: "PRO" as PlanLevel, pending: true },
      { icon: Smile, label: "Pesquisa NPS", href: "/dashboard/nps", requiredPlan: "BASIC" as PlanLevel },
      { icon: MessageSquare, label: "Inbox", href: "/dashboard/mensagens", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Recepção & Atendimento",
    items: [
      { icon: CalendarRange, label: "Agenda", href: "/dashboard/agenda", requiredPlan: "BASIC" as PlanLevel },
      { icon: HeartHandshake, label: "Agendamento Online", href: "/dashboard/agendamento-online", requiredPlan: "PRO" as PlanLevel },
      { icon: Tv, label: "Painel de TV", href: "/dashboard/painel-tv", requiredPlan: "BASIC" as PlanLevel, pending: true },
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
    pending: true,
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
    pending: true,
    items: [
      { icon: Box, label: "Estoque Central", href: "/dashboard/estoque", requiredPlan: "BASIC" as PlanLevel },
      { icon: Syringe, label: "Injetáveis & Insumos Críticos", href: "/dashboard/vacinas", requiredPlan: "PRO" as PlanLevel },
      { icon: ShoppingCart, label: "Compras", href: "/dashboard/compras", requiredPlan: "BASIC" as PlanLevel },
    ]
  },
  {
    title: "Clínicas & Operações",
    pending: true,
    items: [
      { icon: Building2, label: "Clínicas & Unidades", href: "/dashboard/hospitais", requiredPlan: "BASIC" as PlanLevel },
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
      { icon: GraduationCap, label: "Educacional", href: "/dashboard/treinamentos", requiredPlan: "PRO" as PlanLevel },
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
  const { user, logout } = useUser();

  const [maintenanceModule, setMaintenanceModule] = React.useState<{ name: string; message: string } | null>(null);
  const [selectedEspecialidade, setSelectedEspecialidade] = React.useState("Dermatologia");
  const [showEspecialidadeMenu, setShowEspecialidadeMenu] = React.useState(false);

  // Armazena quais blocos estão abertos na cascata
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
    // Abre por padrão o bloco que contém a rota atual
    const initial: Record<string, boolean> = {};
    menuBlocks.forEach((block) => {
      const containsActive = block.items.some(item => item.href === pathname);
      // Se tiver ativo abre; ou abre os 2 primeiros blocos por conveniência
      if (containsActive || block.title === "Inteligência Clínica" || block.title === "Operacional & Clínico") {
        initial[block.title] = true;
      }
    });
    return initial;
  });

  // Atualiza abertura se a rota mudar para uma seção fechada
  useEffect(() => {
    menuBlocks.forEach((block) => {
      if (block.items.some(item => item.href === pathname)) {
        setOpenSections(prev => ({ ...prev, [block.title]: true }));
      }
    });
  }, [pathname]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

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

  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Avatar / Iniciais do Usuário (sincronizado com isMounted para evitar Hydration mismatch entre SSR e Client)
  const userName = isMounted ? (user?.full_name || user?.email?.split("@")[0] || "Operador") : "Operador";
  const userInitials = isMounted 
    ? (user?.full_name 
        ? user.full_name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("")
        : (user?.email?.charAt(0).toUpperCase() || "O"))
    : "O";
  const userRoleDisplay = isMounted ? (user?.cargo || user?.role || "Acesso") : "Acesso";

  return (
    <>
      {/* ═══════ DESKTOP SIDEBAR (CASCATA PLAZAHUB STYLE) ═══════ */}
      <aside 
        className={cn(
          "h-screen w-64 flex flex-col pt-3.5 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out hidden lg:flex backdrop-blur-3xl border-r-2",
          theme === 'dark' 
            ? "bg-zinc-950/90 border-zinc-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.4)]" 
            : "bg-white/95 border-zinc-300 shadow-[4px_0_24px_rgba(0,0,0,0.06)]"
        )}
      >
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[80%] h-[20%] rounded-full blur-[100px] pointer-events-none transition-opacity duration-700",
          theme === 'dark' ? "bg-rd-cyan/10 opacity-100" : "bg-rd-cyan/5 opacity-50"
        )}></div>

        {/* Logo */}
        <div className="flex items-center px-5 mb-4 relative z-10">
          <Logo className="scale-95 origin-left" />
        </div>

        {/* Especialidade Selector (Desktop) */}
        <div className="px-3.5 mb-3 relative z-50">
          <button 
            onClick={() => setShowEspecialidadeMenu(!showEspecialidadeMenu)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 transition-all group text-left shadow-xs",
              theme === 'dark' ? "bg-zinc-900/90 border-zinc-800 hover:border-rd-cyan/60" : "bg-zinc-50 border-zinc-200 hover:border-rd-cyan/60 hover:bg-white"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-rd-cyan/15 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan shrink-0 transition-transform group-hover:scale-105">
              <Box size={14} strokeWidth={2} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[9px] font-heading font-semibold uppercase tracking-widest leading-none text-zinc-400">
                Especialidade
              </p>
              <p className={cn(
                "text-xs font-sans font-semibold truncate mt-0.5 tracking-tight transition-colors",
                theme === 'dark' ? "text-white group-hover:text-rd-cyan" : "text-zinc-900 group-hover:text-rd-cyan"
              )}>
                {selectedEspecialidade}
              </p>
            </div>
            <div className={cn(
              "shrink-0 transition-transform duration-200",
              showEspecialidadeMenu ? "rotate-180" : "",
              theme === 'dark' ? "text-zinc-400 group-hover:text-rd-cyan" : "text-zinc-500 group-hover:text-rd-cyan"
            )}>
              <ChevronDown size={14} strokeWidth={2} />
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {showEspecialidadeMenu && (
            <div className={cn(
              "absolute top-full left-3.5 right-3.5 mt-1.5 py-1.5 rounded-xl border z-50 shadow-xl backdrop-blur-xl max-h-56 overflow-y-auto custom-scrollbar",
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
                    "w-full text-left px-3.5 py-1.5 text-xs transition-colors",
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

        {/* Main Nav (Cascading Accordion Style) */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 relative z-10 custom-scrollbar">
          {menuBlocks.map((block) => {
            const visibleItems = block.items
              .filter(item => isModuleEnabled(moduleIdMap[item.href] || "dashboard"))
              .filter(item => isRouteAllowedForRole(user?.role, item.href));

            if (visibleItems.length === 0) return null;

            const isOpen = !!openSections[block.title];
            const hasActiveItem = visibleItems.some(i => i.href === pathname);

            return (
              <div 
                key={block.title} 
                className={cn(
                  "rounded-2xl transition-all duration-200 border",
                  isOpen 
                    ? theme === 'dark'
                      ? "bg-zinc-900/50 border-zinc-800/80 shadow-xs"
                      : "bg-zinc-50/80 border-zinc-200/90 shadow-2xs"
                    : theme === 'dark'
                      ? "border-transparent hover:border-zinc-850 hover:bg-zinc-900/30"
                      : "border-transparent hover:border-zinc-200/60 hover:bg-zinc-100/40"
                )}
              >
                {/* Header da Cascata / Acordeom */}
                <button
                  type="button"
                  onClick={() => toggleSection(block.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl transition-colors select-none group",
                    isOpen
                      ? "text-rd-cyan font-bold"
                      : hasActiveItem
                        ? "text-rd-cyan font-bold"
                        : theme === 'dark' ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn(
                      "w-2 h-2 rounded-full transition-all shrink-0",
                      block.pending
                        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"
                        : isOpen
                          ? "bg-rd-cyan scale-125"
                          : hasActiveItem
                            ? "bg-rd-cyan"
                            : "bg-zinc-400 group-hover:bg-zinc-300"
                    )} />
                    <span className={cn(
                      "text-xs font-sans font-medium tracking-normal truncate",
                      block.pending && "text-amber-300/90"
                    )}>
                      {block.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-sans transition-colors",
                      isOpen 
                        ? "bg-rd-cyan/15 text-rd-cyan"
                        : theme === 'dark' ? "bg-zinc-800/80 text-zinc-500" : "bg-zinc-200/80 text-zinc-500"
                    )}>
                      {visibleItems.length}
                    </span>
                    <ChevronDown 
                      size={14} 
                      strokeWidth={2.2} 
                      className={cn(
                        "transition-transform duration-200",
                        isOpen ? "rotate-180 text-rd-cyan" : "text-zinc-400 group-hover:text-zinc-300"
                      )} 
                    />
                  </div>
                </button>

                {/* Sub-itens em Cascata */}
                {isOpen && (
                  <div className="px-1.5 pb-2 pt-0.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {visibleItems.map((item) => {
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
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 font-sans text-xs font-medium group relative overflow-hidden cursor-pointer border",
                            (!authorized || inMaintenance) && "opacity-60 cursor-not-allowed",
                            inMaintenance && "border-rd-cyan/30 bg-rd-cyan/10",
                            
                            /* Default Hover and Active States */
                            authorized && !inMaintenance && isActive && !isHighlighted && (
                              theme === 'dark'
                                ? "bg-rd-cyan/15 border-rd-cyan/40 text-rd-cyan shadow-xs font-semibold"
                                : "bg-rd-cyan/10 border-rd-cyan/30 text-rd-cyan shadow-2xs font-semibold"
                            ),
                            authorized && !inMaintenance && !isActive && !isHighlighted && (
                              theme === 'dark' 
                                ? "border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 hover:border-zinc-700/50" 
                                : "border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-white hover:border-zinc-200/80 shadow-2xs"
                            ),
                            
                            /* HIGHLIGHTED (IA Executiva) Styles */
                            isHighlighted && !inMaintenance && (
                              theme === 'dark'
                                ? "bg-zinc-950 border-rd-cyan/80 text-white shadow-[0_0_12px_rgba(0,169,255,0.2)] font-semibold"
                                : "bg-white border-rd-cyan/80 text-zinc-950 shadow-[0_0_12px_rgba(0,169,255,0.15)] font-semibold"
                            ),
                            isHighlighted && !inMaintenance && isActive && "ring-2 ring-rd-cyan"
                          )}
                        >
                          {/* Animated Shine for MEGA button */}
                          {isHighlighted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
                          )}

                          <item.icon 
                            size={16} 
                            strokeWidth={2}
                            className={cn(
                              "transition-transform duration-200 shrink-0",
                              isActive && authorized && !isHighlighted ? "text-rd-cyan scale-110" : "",
                              isHighlighted 
                                ? theme === 'dark' ? "text-rd-cyan animate-pulse-slow" : "text-zinc-950 animate-pulse-slow" 
                                : "text-zinc-400",
                              authorized && !isActive && !isHighlighted && (
                                theme === 'dark' ? "group-hover:text-zinc-200" : "group-hover:text-zinc-900"
                              ),
                              isHighlighted && "group-hover:scale-120"
                            )} 
                          />
                          
                          <span className="flex-1 flex items-center justify-between z-10 min-w-0">
                            <span className={cn(
                              "truncate",
                              isHighlighted && "font-bold text-inherit"
                            )}>
                              {item.label}
                            </span>

                            {!authorized && !inMaintenance && (
                              <span className={cn(
                                "flex items-center gap-1 border px-1.5 py-0.2 rounded text-[9px] font-heading font-bold tracking-widest uppercase shrink-0 ml-1.5",
                                theme === 'dark' ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-600"
                              )}>
                                <Lock size={9} strokeWidth={2} />
                                {item.requiredPlan}
                              </span>
                            )}
                            {inMaintenance && (
                              <span className="flex items-center gap-1 bg-rd-cyan/20 border border-rd-cyan/40 px-1.5 py-0.2 rounded text-[9px] font-heading text-rd-cyan font-bold tracking-widest uppercase shadow-inner animate-pulse shrink-0 ml-1.5">
                                <Wrench size={9} strokeWidth={2} />
                                MANU
                              </span>
                            )}
                            {item.pending && (
                              <span className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/50 px-1.5 py-0.2 rounded text-[9px] font-heading text-amber-400 font-bold tracking-wider uppercase shadow-inner shrink-0 ml-1.5 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                Pendente
                              </span>
                            )}
                            {isHighlighted && authorized && !inMaintenance && (
                              <Sparkles size={13} strokeWidth={2} className={cn(theme === 'dark' ? "text-rd-cyan" : "text-zinc-950", "animate-pulse shrink-0 ml-1.5")} />
                            )}
                          </span>
                        </ItemWrapper>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* PlazaHUB Style User Profile & Logout Bottom Card */}
        <div className={cn(
          "mt-auto p-3 border-t-2 relative z-20 space-y-2",
          theme === 'dark' ? "border-zinc-800/80 bg-zinc-950/70" : "border-zinc-200 bg-zinc-50/90"
        )}>
          {/* Card Usuário */}
          <div className={cn(
            "flex items-center gap-2.5 p-2 rounded-xl border transition-colors",
            theme === 'dark' ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200 shadow-2xs"
          )}>
            <div className="relative shrink-0">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={userName} 
                  className="w-8 h-8 rounded-lg object-cover border border-rd-cyan/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-rd-cyan/15 border border-rd-cyan/30 flex items-center justify-center font-heading font-bold text-xs text-rd-cyan">
                  {userInitials}
                </div>
              )}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface shadow-[0_0_6px_var(--color-emerald-500)]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-xs font-semibold truncate leading-tight",
                theme === 'dark' ? "text-zinc-100" : "text-zinc-900"
              )}>
                {userName}
              </p>
              <p className="text-[10px] text-zinc-400 truncate leading-tight capitalize mt-0.5">
                {userRoleDisplay}
              </p>
            </div>

            <div className="shrink-0">
              <span className="text-[9px] font-heading font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/30">
                Acesso
              </span>
            </div>
          </div>

          {/* Botão Sair da Conta */}
          <button
            type="button"
            onClick={logout}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-sans font-medium transition-all group",
              theme === 'dark'
                ? "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10"
                : "bg-white border-zinc-200 text-zinc-600 hover:text-rose-600 hover:border-rose-400 hover:bg-rose-50/50 shadow-2xs"
            )}
          >
            <div className="flex items-center gap-2">
              <LogOut size={14} strokeWidth={2} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Sair da Conta</span>
            </div>
            <ChevronRight size={13} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
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
                {units.find(u => u.id === selectedUnitId)?.name || "Selecionar Clínica"}
              </span>
            </div>
            <ChevronDown size={14} strokeWidth={2} className="text-zinc-400" />
          </button>
        </div>

        {/* Navegação Categorizada por Blocos (Inteligência, Operacional, Financeiro, Gestão) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {menuBlocks.map((block) => {
            const visibleItems = block.items
              .filter(item => isModuleEnabled(moduleIdMap[item.href] || "dashboard"))
              .filter(item => isRouteAllowedForRole(user?.role, item.href));

            if (visibleItems.length === 0) return null;

            return (
              <div key={block.title} className="space-y-2.5">
                <h3 className={cn(
                  "px-2 text-xs font-sans font-medium flex items-center gap-2 opacity-95",
                  block.pending ? "text-amber-400 font-bold" : "text-rd-cyan"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    block.pending
                      ? "bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse"
                      : "bg-rd-cyan shadow-[0_0_8px_#a78bfa]"
                  )}></span>
                  {block.title}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {visibleItems.map((item) => {
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
          );
        })}
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
            { icon: MessageSquare, label: "Inbox", href: "/dashboard/mensagens" },
            { icon: BrainCircuit, label: "Dra. Conte", href: "/dashboard/ia-executiva", highlight: true },
            { icon: CalendarRange, label: "Agenda", href: "/dashboard/agenda" },
            { icon: Users, label: "Pacientes", href: "/dashboard/pacientes" },
            { icon: Kanban, label: "Kanban", href: "/dashboard/kanban" },
            { icon: Building2, label: "Clínicas", href: "/dashboard/hospitais" },
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
