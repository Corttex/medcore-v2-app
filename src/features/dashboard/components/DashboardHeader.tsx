"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Bell, ShieldCheck, Menu, User, TrendingUp, AlertTriangle, Settings, LifeBuoy, Sun, Moon, HelpCircle, X, BookOpen, Building2, Sparkles, FlaskConical, CheckCircle2, Database } from "lucide-react";
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
  "/dashboard/mensagens": "Inbox",
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
  "/dashboard/vacinas": "Injetáveis & Insumos Críticos",
  "/dashboard/compras": "Compras & Suprimentos",
  "/dashboard/hospitais": "Clínicas & Operações",
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
  "/dashboard/carreira": "Desenvolvimento Profissional & Carreira",
  "/dashboard/equipe": "Gerenciar Equipe",
  "/dashboard/auditoria": "Auditoria & LGPD",
  "/dashboard/relatorios": "BI & Indicadores",
  "/dashboard/loja": "Habilidades da Dra. Conte",
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
  const { toggleMobileMenu, selectedUnitId, setSelectedUnitId, units, isDemoMode, setDemoMode, toggleDemoMode } = useDashboardContext();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout: handleLogout } = useUser();
  const currentTitle = getTitleForPath(pathname);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [demoToast, setDemoToast] = useState<{ show: boolean; message: string; type: "demo" | "real" } | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const roleUpper = (user?.role || "").toUpperCase();
  const isAdmin = 
    roleUpper.includes("ADMIN") || 
    roleUpper.includes("DIRETOR") || 
    roleUpper.includes("GESTOR") || 
    roleUpper.includes("OWNER") || 
    !user?.role || 
    process.env.NODE_ENV !== "production";

  const handleToggleDemoMode = (targetValue?: boolean) => {
    const nextVal = typeof targetValue === "boolean" ? targetValue : !isDemoMode;
    setDemoMode(nextVal);
    setDemoToast({
      show: true,
      message: nextVal 
        ? "Modo Demonstrativo ATIVADO: Dados fictícios carregados no painel para conferência visual de layout, cores e textos."
        : "Modo Registro Real ATIVADO: Dados fictícios zerados. Painel pronto para operação com dados reais.",
      type: nextVal ? "demo" : "real"
    });
    setTimeout(() => {
      setDemoToast(null);
    }, 4500);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {}
  };

  useEffect(() => {
    setIsMounted(true);
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Polling leve a cada 10s

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
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
        {/* Alternador de Dados Demonstrativos (Apenas Administrador) */}
        {isAdmin && (
          <div className="flex items-center h-full px-2 sm:px-3 lg:px-4 border-l border-zinc-200 dark:border-zinc-800">
            <div 
              className={cn(
                "flex items-center gap-2 p-1 pl-2.5 rounded-xl border transition-all shadow-sm",
                isDemoMode 
                  ? "bg-rd-cyan/10 border-rd-cyan/40 text-on-surface" 
                  : "bg-surface-container-low border-zinc-200 dark:border-zinc-800 text-on-surface-variant"
              )}
              title="Modo Administrador: Alterna entre Registros Reais (limpo) e Dados Fictícios Demonstrativos para conferência de layout, texto e cores."
            >
              <div className="flex items-center gap-1.5 shrink-0">
                <FlaskConical 
                  size={14} 
                  className={cn(
                    "transition-all",
                    isDemoMode ? "text-rd-cyan animate-pulse drop-shadow-[0_0_8px_var(--color-rd-cyan)]" : "text-on-surface-variant/60"
                  )} 
                />
                <span className="text-[11px] font-heading font-semibold hidden xl:inline text-on-surface">
                  Dados Demo:
                </span>
              </div>

              {/* Toggle Switch / Scrollzinho (Não / Sim) */}
              <div 
                onClick={() => handleToggleDemoMode(!isDemoMode)}
                role="switch"
                aria-checked={isDemoMode}
                className={cn(
                  "relative flex items-center p-0.5 rounded-lg cursor-pointer transition-all duration-300 select-none border",
                  isDemoMode 
                    ? "bg-zinc-950/40 border-rd-cyan/40 shadow-[0_0_12px_rgba(0,212,255,0.2)]" 
                    : "bg-surface-container border-zinc-200 dark:border-zinc-700"
                )}
              >
                {/* Indicador Deslizante (Pill) */}
                <div 
                  className={cn(
                    "absolute top-0.5 bottom-0.5 w-[36px] rounded-md transition-all duration-300 shadow-sm",
                    isDemoMode 
                      ? "left-[39px] bg-gradient-to-r from-rd-cyan to-teal-400 text-white shadow-rd-cyan/30" 
                      : "left-0.5 bg-white dark:bg-zinc-700 text-on-surface shadow-black/10"
                  )}
                />

                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); if (isDemoMode) handleToggleDemoMode(false); }}
                  className={cn(
                    "relative z-10 w-[36px] py-1 text-center text-[10px] font-heading font-bold uppercase tracking-wider transition-colors",
                    !isDemoMode ? "text-on-surface font-extrabold" : "text-on-surface-variant/50 hover:text-on-surface"
                  )}
                >
                  Não
                </button>

                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); if (!isDemoMode) handleToggleDemoMode(true); }}
                  className={cn(
                    "relative z-10 w-[36px] py-1 text-center text-[10px] font-heading font-bold uppercase tracking-wider transition-colors",
                    isDemoMode ? "text-zinc-950 font-extrabold" : "text-on-surface-variant/50 hover:text-rd-cyan"
                  )}
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}

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
        
        {/* Seletor de Clínica / Unidade */}
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
                {units.find(u => u.id === selectedUnitId)?.name || "Selecionar Clínica"}
              </span>
            </button>
          </div>
        </div>

        {/* Habilidades da Dra. Conte (Skills & Add-ons) */}
        <div className="flex items-center h-full px-2.5 sm:px-3 lg:px-4 border-l border-zinc-200 dark:border-zinc-800">
          <Link
            href="/dashboard/loja"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rd-cyan/40 bg-gradient-to-r from-rd-cyan/15 to-indigo-500/10 hover:from-rd-cyan/25 hover:to-indigo-500/20 text-on-surface hover:text-rd-cyan transition-all shadow-sm group hover:scale-[1.02] active:scale-[0.98]"
            title="Habilidades da Dra. Conte & Add-ons de Inteligência"
          >
            <Sparkles size={14} className="text-rd-cyan group-hover:rotate-12 transition-transform shrink-0" />
            <span className="text-xs font-sans font-semibold hidden sm:inline">
              Habilidades Dra. Conte
            </span>
            <span className="text-[10px] font-heading font-bold uppercase px-1.5 py-0.5 bg-gradient-to-r from-rd-cyan to-indigo-600 text-white rounded-full tracking-widest shadow-sm shrink-0">
              SKILLS
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
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rd-cyan rounded-full shadow-[0_0_8px_var(--color-rd-cyan)] animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-84 max-h-[85vh] overflow-y-auto bg-surface border border-outline-variant/60 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-[11px] font-heading font-semibold text-on-surface uppercase tracking-widest">Central de Alertas</h3>
                  <span className="text-[10px] font-heading bg-rd-cyan/10 text-rd-cyan px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-rd-cyan/20">
                    {notifications.filter(n => !n.read).length} Novas
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-on-surface-variant text-center py-4">Nenhuma notificação no momento.</p>
                  ) : (
                    notifications.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={async () => {
                          try {
                            await fetch("/api/notifications", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: item.id })
                            });
                            setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className={cn(
                          "p-3 rounded-xl border transition-colors flex gap-3 group cursor-pointer",
                          item.read 
                            ? "bg-surface-container/50 border-outline-variant/20 opacity-75" 
                            : item.type === "CRITICO" 
                              ? "bg-error/10 border-error/30" 
                              : "bg-rd-cyan/5 border-rd-cyan/20 hover:bg-rd-cyan/10"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                          item.type === "CRITICO" 
                            ? "bg-error/20 border-error/30 text-error" 
                            : "bg-rd-cyan/15 border-rd-cyan/30 text-rd-cyan"
                        )}>
                          {item.type === "CRITICO" ? <AlertTriangle size={14} /> : <TrendingUp size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-sans font-semibold text-on-surface truncate">{item.title}</p>
                          <p className="text-[11px] font-sans text-on-surface-variant mt-0.5 line-clamp-2">{item.message}</p>
                          <span className="text-[9px] text-zinc-400 mt-1 block">
                            {new Date(item.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
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

    {/* Toast Flutuante de Feedback do Modo Demonstrativo via Portal (Evita corte por backdrop-blur do header) */}
    {demoToast?.show && isMounted && typeof document !== "undefined" && createPortal(
      <div className="fixed top-20 right-6 z-[9999] flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-zinc-950/95 dark:bg-zinc-900/95 text-white border border-rd-cyan/40 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4 fade-in duration-300 max-w-md">
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
          demoToast.type === "demo" 
            ? "bg-rd-cyan/20 border-rd-cyan/40 text-rd-cyan shadow-[0_0_12px_rgba(0,212,255,0.3)]" 
            : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
        )}>
          {demoToast.type === "demo" ? <FlaskConical size={18} /> : <CheckCircle2 size={18} />}
        </div>
        <div className="text-xs flex-1">
          <p className="font-heading font-bold text-white tracking-wide flex items-center gap-1.5">
            {demoToast.type === "demo" ? "Modo Demonstrativo (Mock) Ativado" : "Modo Registro Real Ativado"}
            <span className="text-[10px] font-sans px-1.5 py-0.2 rounded font-semibold bg-white/10 uppercase tracking-widest text-zinc-300">
              Admin
            </span>
          </p>
          <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{demoToast.message}</p>
        </div>
        <button 
          onClick={() => setDemoToast(null)}
          className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors ml-1 shrink-0 cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>,
      document.body
    )}
  </header>
  );
}
