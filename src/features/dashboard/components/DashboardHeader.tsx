"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ShieldCheck, Menu, User, TrendingUp, AlertTriangle, Settings, LifeBuoy, Sun, Moon, HelpCircle, X, BookOpen, Building2, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Logo } from "@/components/ui/Logo";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { usePathname, useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/pacotes": "Pacotes de Vendas e Tratamento",
  "/dashboard/marketing": "Marketing & CRM",
  "/dashboard/nps": "Pesquisa NPS",
  "/dashboard/mensagens": "Inbox CRM",
  "/dashboard/agenda": "Agenda Clínica",
  "/dashboard/agendamento-online": "Agendamento Online",
  "/dashboard/painel-tv": "Painel de TV",
  "/dashboard/telemedicina": "Telemedicina",
  "/dashboard/pacientes": "Pacientes",
  "/dashboard/prontuario": "Prontuário Eletrônico (PEP)",
  "/dashboard/demandas": "Demandas Internas",
  "/dashboard/kanban": "Organizador de Notas / Tarefas",
  "/dashboard/lembretes": "Lembretes & Notificações",
  "/dashboard/laudos": "Worklist de Laudos",
  "/dashboard/financeiro": "Faturamento TISS & Analytics",
  "/dashboard/contas": "Gestor de Contas",
  "/dashboard/contas-a-receber": "Contas a Receber",
  "/dashboard/contas-a-pagar": "Contas a Pagar",
  "/dashboard/tiss": "Faturamento TISS",
  "/dashboard/repasses": "Repasses Médicos",
  "/dashboard/notas-fiscais": "Emitir NF",
  "/dashboard/relatorios-financeiros": "Relatório Financeiro",
  "/dashboard/estoque": "Estoque Central",
  "/dashboard/vacinas": "Controle de Vacinas",
  "/dashboard/compras": "Compras",
  "/dashboard/hospitais": "Unidades Hospitalares",
  "/dashboard/cadastros": "Cadastros Base",
  "/dashboard/os": "Central de OS",
  "/dashboard/patrimonio": "Patrimônio",
  "/dashboard/arquivos": "Drive & Scanner",
  "/dashboard/juridico": "Processos Jurídicos",
  "/dashboard/emails": "Painel de E-mails",
  "/dashboard/escalas": "Escalas & Plantões",
  "/dashboard/ponto": "Ponto & Frequência",
  "/dashboard/folha": "Folha de Pagamento & Benefícios",
  "/dashboard/recrutamento": "Recrutamento (ATS)",
  "/dashboard/treinamentos": "Treinamentos",
  "/dashboard/desempenho": "Avaliação de Desempenho",
  "/dashboard/equipe": "Gerenciar Equipe",
  "/dashboard/auditoria": "Auditoria & LGPD",
  "/dashboard/relatorios": "BI & Indicadores",
  "/dashboard/loja": "Loja de Módulos & Add-ons Extras",
  "/dashboard/ia-executiva": "Dra. Conte — Copilot Clínico & IA",
  "/dashboard/emergencia": "Gestão de Emergência",
  "/dashboard/architecture": "Arquitetura do Sistema",
  "/dashboard/admin": "Administração do Sistema",
};

function getTitleForPath(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const matched = Object.keys(routeTitles)
    .filter(k => k !== "/dashboard" && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return matched ? routeTitles[matched] : "Dashboard";
}

const HELP_DESCRIPTIONS: Record<string, { title: string; desc: string; tips: string[] }> = {
  "/dashboard": {
    title: "Dashboard Executivo",
    desc: "Painel central de gestão hospitalar com métricas estratégicas, indicadores de desempenho e alertas de IA em tempo real.",
    tips: ["Acompanhe a ocupação dos leitos em tempo real.", "Verifique alertas críticos na barra superior.", "Consulte relatórios de IA Core no menu lateral."]
  },
  "/dashboard/demandas": {
    title: "Demandas Internas e Reuniões",
    desc: "Gestão completa de reuniões, atas inteligentes, solicitações de alimentação e equipamentos para infraestrutura hospitalar.",
    tips: ["Ao agendar equipamentos, ative a Ordem de Serviço (OS) automática se necessário.", "Adicione convidados informando Nome, Cargo e Contato (Email / WhatsApp).", "Use o botão IA para gerar a ata automaticamente."]
  },
  "/dashboard/kanban": {
    title: "Organizador de Notas & Tarefas",
    desc: "Quadro interativo para organizar fluxos operacionais, tarefas clínicas e notas em 4 etapas: A Fazer, Em Andamento, Concluído e Arquivado.",
    tips: ["Arraste e solte os cards entre as colunas para atualizar o progresso.", "Clique em '+ Novo Card' com borda destacada para criar uma nova tarefa.", "Use tags e prioridades para categorizar demandas."]
  },
  "/dashboard/agenda": {
    title: "Agenda Clínica & Consultas",
    desc: "Agendamento centralizado de consultas médicas, procedimentos cirúrgicos e escalas de atendimento.",
    tips: ["Filtre atendimentos por profissional ou especialidade.", "Clique nos horários disponíveis para registrar agendamentos."]
  },
};

export function DashboardHeader() {
  const { toggleMobileMenu, selectedUnitId, setSelectedUnitId, units } = useDashboardContext();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout: handleLogout } = useUser();
  const currentTitle = getTitleForPath(pathname);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 w-full h-16 bg-surface/95 backdrop-blur-2xl z-40 border-b border-outline-variant/30 shadow-sm flex justify-between items-stretch px-0">
      {/* Bloco Esquerdo: Menu Mobile + Título + Status Operacional */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0 px-4 md:px-6 border-r border-zinc-200 dark:border-zinc-800 h-full">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface lg:hidden transition-colors rounded-lg hover:bg-surface-container shrink-0"
        >
          <Menu size={24} />
        </button>
        <Logo className="block lg:hidden w-24 sm:w-32 shrink-0" width={110} height={32} />
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl font-heading font-semibold text-on-surface tracking-tight truncate">{currentTitle}</h1>
          <p className="text-xs text-on-surface-variant font-medium tracking-wide truncate">Status: <span className="text-emerald-600 font-semibold">Operacional</span></p>
        </div>
      </div>

      {/* Bloco Direito: Ferramentas e Ações com linhas divisórias verticais de ponta a ponta */}
      <div className="flex items-stretch shrink-0 h-full">
        {/* Campo de Pesquisa */}
        <div className="hidden md:flex items-center h-full px-3 lg:px-4 border-l border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center bg-surface-container-low px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 focus-within:border-rd-cyan/50 transition-all group overflow-hidden max-w-xs">
            <Search className="text-on-surface-variant/60 group-focus-within:text-rd-cyan transition-colors shrink-0" size={15} />
            <input 
              type="text" 
              placeholder="Pesquisar na base..." 
              className="bg-transparent border-none text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 w-full ml-2 outline-none"
            />
          </div>
        </div>
        
        {/* Seletor de Hospital / Unidade */}
        <div className="hidden lg:flex items-center h-full px-3 lg:px-4 border-l border-zinc-200 dark:border-zinc-800">
          <div className="relative group">
            <button 
              onClick={() => setSelectedUnitId(null)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all hover:bg-surface-container",
                theme === 'dark' ? "bg-zinc-900 text-zinc-300" : "bg-zinc-50 text-zinc-700"
              )}
            >
              <Building2 size={14} className="text-rd-cyan" />
              <span className="text-xs font-sans font-semibold truncate max-w-[140px]">
                {units.find(u => u.id === selectedUnitId)?.name || "Selecionar Hospital"}
              </span>
            </button>
          </div>
        </div>

        {/* Loja de Módulos Extras (Marketplace PRO) */}
        <div className="flex items-center h-full px-2.5 sm:px-3 lg:px-4 border-l border-zinc-200 dark:border-zinc-800">
          <Link
            href="/dashboard/loja"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rd-cyan/40 bg-gradient-to-r from-rd-cyan/15 to-indigo-500/10 hover:from-rd-cyan/25 hover:to-indigo-500/20 text-on-surface hover:text-rd-cyan transition-all shadow-sm group hover:scale-[1.02] active:scale-[0.98]"
            title="Loja de Módulos Extras & Add-ons"
          >
            <Sparkles size={14} className="text-rd-cyan group-hover:rotate-12 transition-transform shrink-0" />
            <span className="text-xs font-sans font-semibold hidden sm:inline">
              Loja de Módulos
            </span>
            <span className="text-[10px] font-heading font-bold uppercase px-1.5 py-0.5 bg-gradient-to-r from-rd-cyan to-indigo-600 text-white rounded-full tracking-widest shadow-sm shrink-0">
              PRO
            </span>
          </Link>
        </div>
        
        {/* Alternador de Tema (Dark / Light) */}
        <div className="flex items-center h-full px-2 sm:px-3 border-l border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-rd-cyan transition-all duration-300 rounded-xl hover:bg-surface-container border border-zinc-200 dark:border-zinc-700"
            title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Notificações */}
        <div className="flex items-center h-full px-2 sm:px-3 border-l border-zinc-200 dark:border-zinc-800">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-all duration-300 relative rounded-xl hover:bg-surface-container border border-zinc-200 dark:border-zinc-700",
                showNotifications ? "text-rd-cyan bg-rd-cyan/10" : "text-on-surface-variant hover:text-rd-cyan"
              )}
            >
              <Bell size={18} />
              <span className={cn(
                "absolute top-2 right-2 w-2 h-2 bg-rd-cyan rounded-full shadow-[0_0_8px_var(--color-rd-cyan)]",
                !showNotifications && "animate-pulse"
              )}></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 max-h-[85vh] overflow-y-auto bg-surface border border-outline-variant/60 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-[11px] font-heading font-semibold text-on-surface uppercase tracking-widest">Central de Alertas</h3>
                  <span className="text-[10px] font-heading bg-rd-cyan/10 text-rd-cyan px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-rd-cyan/20">2 Novas</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high transition-colors flex gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0 border border-error/20">
                      <AlertTriangle size={14} className="text-error" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-semibold text-on-surface">Sobrecarga no CTI (Setor Alpha)</p>
                      <p className="text-xs font-sans text-on-surface-variant mt-1 line-clamp-1">A capacidade de admissão superou 92%. Ação diretiva requerida.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-rd-cyan/5 border border-rd-cyan/20 hover:bg-rd-cyan/10 transition-colors flex gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-rd-cyan/15 flex items-center justify-center shrink-0 border border-rd-cyan/30">
                      <TrendingUp size={14} className="text-rd-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-semibold text-rd-cyan">Relatório Estratégico Pronto</p>
                      <p className="text-xs font-sans text-on-surface-variant mt-1 line-clamp-1">Análise de eficiência cirúrgica semanal gerada pela IA Core.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Segurança */}
        <div className="hidden sm:flex items-center h-full px-2 sm:px-3 border-l border-zinc-200 dark:border-zinc-800">
          <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-rd-cyan transition-all duration-300 rounded-xl hover:bg-surface-container border border-zinc-200 dark:border-zinc-700" title="Sistema Seguro & Auditado">
            <ShieldCheck size={18} />
          </button>
        </div>

        {/* Perfil do Usuário */}
        <div className="flex items-center h-full px-3 md:px-5 border-l border-zinc-200 dark:border-zinc-800">
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 md:gap-3 transition-all group cursor-pointer hover:opacity-85"
            >
              <div className="text-right hidden sm:block flex-shrink-0">
                <p className="text-xs font-sans font-semibold text-on-surface leading-tight truncate">
                  {isMounted ? (user?.full_name || user?.email?.split("@")[0] || "Operador") : "Operador"}
                </p>
                <p className="text-[9px] font-heading text-rd-cyan font-bold uppercase tracking-widest mt-0.5 truncate">
                  {isMounted ? (user?.role || "Acesso") : "Acesso"}
                </p>
              </div>
              <div className="relative shrink-0">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name || "Perfil"} 
                    className={cn(
                      "w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover ring-2 shadow-sm transition-all",
                      showProfileMenu ? "ring-rd-cyan" : "ring-rd-cyan/20 group-hover:ring-rd-cyan/50"
                    )}
                  />
                ) : (
                  <div className={cn(
                    "w-9 h-9 md:w-10 md:h-10 rounded-xl bg-rd-cyan/10 flex items-center justify-center text-rd-cyan text-sm font-bold ring-2 transition-all",
                    showProfileMenu ? "ring-rd-cyan" : "ring-rd-cyan/20 group-hover:ring-rd-cyan/50"
                  )}>
                    {isMounted ? (user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U") : "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface shadow-sm"></div>
              </div>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-surface border border-outline-variant/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
              <div className="px-3 py-2 mb-2 border-b border-outline-variant/30">
                <p className="text-[11px] font-heading font-semibold text-on-surface uppercase tracking-widest">Painel Pessoal</p>
                {user?.id && (
                  <p className="text-xs font-mono text-zinc-500 mt-1 break-all select-all" title="Seu identificador único (UUID)">
                    ID: {user.id}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Link 
                  href="/dashboard/configuracoes"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings size={16} className="text-zinc-500" />
                  Configurações
                </Link>
                <Link 
                  href="/dashboard/suporte"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <LifeBuoy size={16} className="text-zinc-500" />
                  Suporte Técnico
                </Link>
                <div className="h-[1px] bg-outline-variant/30 my-1 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all w-full"
                >
                  <AlertTriangle size={16} />
                  Encerrar Sessão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
  );
}
