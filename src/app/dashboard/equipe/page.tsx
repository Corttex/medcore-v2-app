"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Plus, 
  Shield, 
  Search, 
  Trash2, 
  UserCheck, 
  Building2, 
  Mail, 
  Phone, 
  Lock, 
  Key, 
  FileText, 
  Briefcase, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Stethoscope,
  HeartPulse,
  Receipt,
  Boxes,
  Eye,
  EyeOff,
  Pencil,
  RotateCcw,
  Sparkles,
  Send,
  Copy,
  ExternalLink
} from "lucide-react";
import { usePlan, PlanLevel } from "@/context/PlanContext";

export interface TeamMember {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  cargo?: string;
  departamento?: string;
  telefone?: string;
  cpf?: string;
  registroProfissional?: string;
  unidade?: string;
  status?: string;
  inviteToken?: string;
  createdAt: string;
}

export interface RoleDefinition {
  code: string;
  label: string;
  category: "Diretoria & Gestão" | "Corpo Clínico & Especialistas" | "Enfermagem & Assistencial" | "Atendimento & Recepção" | "Faturamento, Patrimônio & RH";
  badgeColor: string;
  description: string;
}

export const HEALTHCARE_ROLES: RoleDefinition[] = [
  // Diretoria & Gestão
  {
    code: "DIRETOR_GERAL",
    label: "Diretor Geral / Executivo",
    category: "Diretoria & Gestão",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Acesso irrestrito a todas as unidades, auditorias, DRE, finanças e governança executiva."
  },
  {
    code: "DIRETOR_CLINICO",
    label: "Diretor Clínico / Responsável Técnico",
    category: "Diretoria & Gestão",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Supervisão do corpo clínico, prontuários, comissões de ética, óbito e protocolos médicos."
  },
  {
    code: "GESTOR_UNIDADE",
    label: "Gestor Geral de Unidade / Operações",
    category: "Diretoria & Gestão",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    description: "Gestão completa da operação da unidade, escalas, leitos, fluxo de pacientes e indicadores."
  },
  {
    code: "GERENTE_FINANCEIRO",
    label: "Gerente Financeiro & Controladoria",
    category: "Diretoria & Gestão",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Gestão de fluxo de caixa, contas a pagar/receber, conciliação bancária, DRE e orçamentos."
  },

  // Corpo Clínico & Especialistas
  {
    code: "MEDICO_ESPECIALISTA",
    label: "Médico Assistencial / Especialista",
    category: "Corpo Clínico & Especialistas",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    description: "Acesso a PEP, agenda ambulatorial, prescrições, atestados, exames e solicitação de procedimentos."
  },
  {
    code: "MEDICO_PLANTONISTA",
    label: "Médico Plantonista / Pronto Atendimento",
    category: "Corpo Clínico & Especialistas",
    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    description: "Atendimento emergencial, classificação de risco, prescrições imediatas e internações."
  },
  {
    code: "MEDICO_AUDITOR",
    label: "Médico Auditor (Auditoria & Glosas)",
    category: "Corpo Clínico & Especialistas",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Auditoria concorrente e retrospectiva de prontuários, recursos de glosas e contas médicas."
  },
  {
    code: "ODONTOLOGO",
    label: "Cirurgião Dentista / Odontologia",
    category: "Corpo Clínico & Especialistas",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    description: "Odontograma, anamnese odontológica, orçamentos, procedimentos e procedimentos cirúrgicos."
  },
  {
    code: "VETERINARIO",
    label: "Médico Veterinário (Módulo MedVet)",
    category: "Corpo Clínico & Especialistas",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Prontuário veterinário, fichas de espécies/raças, vacinação animal e cirurgia veterinária."
  },

  // Enfermagem & Assistencial
  {
    code: "ENFERMEIRA_CHEFE",
    label: "Enfermeira(o) Chefe / Supervisão de Enfermagem",
    category: "Enfermagem & Assistencial",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Coordenação da equipe de enfermagem, escalas de plantão, auditoria de SAE e supervisão de leitos."
  },
  {
    code: "ENFERMEIRO_ASSISTENCIAL",
    label: "Enfermeiro(o) Assistencial",
    category: "Enfermagem & Assistencial",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Triagem com Protocolo Manchester, SAE, evolução de enfermagem e curativos avançados."
  },
  {
    code: "TECNICO_ENFERMAGEM",
    label: "Técnico(a) em Enfermagem",
    category: "Enfermagem & Assistencial",
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    description: "Checagem de beira de leito, administração de medicamentos, sinais vitais e anotações."
  },
  {
    code: "FARMACEUTICO_BIOMEDICO",
    label: "Farmacêutico(a) / Biomédico(a)",
    category: "Enfermagem & Assistencial",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Dispensação de medicamentos, controle de psicotrópicos, CAF e liberação de exames laboratoriais."
  },
  {
    code: "FISIOTERAPEUTA_MULTI",
    label: "Equipe Multidisciplinar (Fisio, Nutri, Psico)",
    category: "Enfermagem & Assistencial",
    badgeColor: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
    description: "Evoluções multidisciplinares, planos terapêuticos de reabilitação e dietas hospitalares."
  },

  // Atendimento & Recepção
  {
    code: "SECRETARIA_RECEPCAO",
    label: "Secretária & Recepção",
    category: "Atendimento & Recepção",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Check-in presencial, abertura de fichas de atendimento, elegibilidade de convênio e biometria."
  },
  {
    code: "OPERADOR_AGENDAMENTO",
    label: "Central de Agendamento & Call Center",
    category: "Atendimento & Recepção",
    badgeColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    description: "Agendamento telefônico, WhatsApp, confirmação de consultas e fila de espera."
  },
  {
    code: "CONCIERGE_ESPERA",
    label: "Concierge / Painel de Chamada e Fluxo",
    category: "Atendimento & Recepção",
    badgeColor: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
    description: "Orientação na recepção, totens de autoatendimento e monitoramento do tempo de espera."
  },

  // Faturamento, Patrimônio & RH
  {
    code: "ANALISTA_TISS",
    label: "Analista de Faturamento TISS & Convênios",
    category: "Faturamento, Patrimônio & RH",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Geração de guias TISS (Consulta, SP/SADT, Resumo de Internação), lotes XML e faturamento."
  },
  {
    code: "ANALISTA_FINANCEIRO",
    label: "Analista Financeiro (Caixa & Cobrança)",
    category: "Faturamento, Patrimônio & RH",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Operação do caixa diário, emissão de boletos, NF-e de serviços e conciliação de recebíveis."
  },
  {
    code: "GESTOR_PATRIMONIO_ESTOQUE",
    label: "Gestor de Patrimônio, Almoxarifado & Equipamentos",
    category: "Faturamento, Patrimônio & RH",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    description: "Tombamento patrimonial, QR Code de equipamentos médicos, manutenções e estoque hospitalar."
  },
  {
    code: "ANALISTA_RH_PONTO",
    label: "Analista de RH & Ponto Eletrônico",
    category: "Faturamento, Patrimônio & RH",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Espelho de ponto, atestados médicos da equipe, escalas de trabalho, folha e avaliação 360°."
  },
  {
    code: "USUARIO_CONSULTA",
    label: "Usuário Operacional (Somente Leitura)",
    category: "Faturamento, Patrimônio & RH",
    badgeColor: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    description: "Visualização de relatórios operacionais sem permissão de alteração ou exclusão de dados."
  }
];

export default function EquipePage() {
  const { activePlan, setActivePlan } = usePlan();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Modo de Onboarding no Modal: "SENHA" ou "CONVITE_EMAIL"
  const [createMode, setCreateMode] = useState<"SENHA" | "CONVITE_EMAIL">("CONVITE_EMAIL");
  const [lastGeneratedInvite, setLastGeneratedInvite] = useState<{ url: string; token: string; email: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [showPassword, setShowPassword] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Limite de Usuários por Plano
  const planLimits: Record<PlanLevel, { max: number; label: string; nextPlan?: PlanLevel }> = {
    BASIC: { max: 5, label: "Plano Básico (Até 5 Usuários)", nextPlan: "PRO" },
    PRO: { max: 20, label: "Plano Profissional (Até 20 Usuários)", nextPlan: "MAX" },
    MAX: { max: 9999, label: "Plano Enterprise / Max (Ilimitado)" }
  };

  const currentLimit = planLimits[activePlan] || planLimits.BASIC;
  const isQuotaReached = team.length >= currentLimit.max;
  const quotaPercent = Math.min(100, Math.round((team.length / currentLimit.max) * 100));

  // Formulário de Cadastro
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    telefone: "",
    cargo: "",
    departamento: "Corpo Clínico",
    registroProfissional: "",
    unidade: "Unidade Central Alphaville",
    password: "",
    role: "MEDICO_ESPECIALISTA"
  });

  // Formulário de Edição
  const [editForm, setEditForm] = useState({
    id: "",
    fullName: "",
    email: "",
    cpf: "",
    telefone: "",
    cargo: "",
    departamento: "Corpo Clínico",
    registroProfissional: "",
    unidade: "Unidade Central Alphaville",
    password: "",
    role: "MEDICO_ESPECIALISTA"
  });

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (e) {
      console.error("Erro ao carregar equipe:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Abre modal de edição com dados pré-preenchidos
  const handleOpenEdit = (member: TeamMember) => {
    setErrorMessage("");
    setEditForm({
      id: member.id,
      fullName: member.fullName || "",
      email: member.email || "",
      cpf: member.cpf || "",
      telefone: member.telefone || "",
      cargo: member.cargo || "",
      departamento: member.departamento || "Corpo Clínico",
      registroProfissional: member.registroProfissional || "",
      unidade: member.unidade || "Unidade Central Alphaville",
      password: "",
      role: member.role || "MEDICO_ESPECIALISTA"
    });
    setShowEditModal(true);
  };

  // Criação de Colaborador
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isQuotaReached) {
      setShowCreateModal(false);
      setShowUpgradeModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...createForm,
        inviteMode: createMode === "CONVITE_EMAIL"
      };

      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Erro ao adicionar usuário à equipe.");
        setIsSubmitting(false);
        return;
      }

      if (createMode === "CONVITE_EMAIL" && data.inviteUrl) {
        setLastGeneratedInvite({
          url: window.location.origin + data.inviteUrl,
          token: data.inviteToken,
          email: createForm.email
        });
        setActionSuccess(`Convite gerado com sucesso para ${createForm.email}! Link de ativação pronto para compartilhamento.`);
      } else {
        setShowCreateModal(false);
        setActionSuccess("Novo colaborador cadastrado com sucesso! Evento registrado na auditoria LGPD.");
      }
      
      setTimeout(() => setActionSuccess(null), 6000);

      // Reseta form de criação
      setCreateForm({
        fullName: "",
        email: "",
        cpf: "",
        telefone: "",
        cargo: "",
        departamento: "Corpo Clínico",
        registroProfissional: "",
        unidade: "Unidade Central Alphaville",
        password: "",
        role: "MEDICO_ESPECIALISTA"
      });

      fetchTeam();
    } catch {
      setErrorMessage("Erro de conexão ao salvar usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edição de Colaborador
  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Erro ao atualizar dados do colaborador.");
        setIsSubmitting(false);
        return;
      }

      setShowEditModal(false);
      setActionSuccess(`Cadastro de ${editForm.fullName} atualizado! Alteração auditada e gravada.`);
      setTimeout(() => setActionSuccess(null), 4000);

      fetchTeam();
    } catch {
      setErrorMessage("Erro de conexão ao atualizar usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exclusão
  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeam(prev => prev.filter(m => m.id !== id));
        setDeleteConfirmId(null);
        setActionSuccess("Colaborador removido da equipe. Ação registrada no log de auditoria.");
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (e) {
      console.error("Erro ao remover:", e);
    }
  };

  // Filtragem
  const filteredTeam = useMemo(() => {
    return team.filter(member => {
      const matchesSearch = 
        (member.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.cargo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.registroProfissional || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.role || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory !== "TODOS") {
        const roleInfo = HEALTHCARE_ROLES.find(r => r.code === member.role);
        return roleInfo?.category === selectedCategory;
      }

      return true;
    });
  }, [team, searchTerm, selectedCategory]);

  const selectedCreateRoleInfo = useMemo(() => {
    return HEALTHCARE_ROLES.find(r => r.code === createForm.role) || HEALTHCARE_ROLES[0];
  }, [createForm.role]);

  const selectedEditRoleInfo = useMemo(() => {
    return HEALTHCARE_ROLES.find(r => r.code === editForm.role) || HEALTHCARE_ROLES[0];
  }, [editForm.role]);

  // Contadores
  const stats = useMemo(() => {
    return {
      total: team.length,
      clinicos: team.filter(m => ["MEDICO_ESPECIALISTA", "MEDICO_PLANTONISTA", "MEDICO_AUDITOR", "DIRETOR_CLINICO", "ODONTOLOGO", "VETERINARIO"].includes(m.role)).length,
      enfermagem: team.filter(m => ["ENFERMEIRA_CHEFE", "ENFERMEIRO_ASSISTENCIAL", "TECNICO_ENFERMAGEM", "FARMACEUTICO_BIOMEDICO", "FISIOTERAPEUTA_MULTI"].includes(m.role)).length,
      gestaoBackoffice: team.filter(m => ["DIRETOR_GERAL", "GESTOR_UNIDADE", "GERENTE_FINANCEIRO", "ANALISTA_TISS", "ANALISTA_FINANCEIRO", "GESTOR_PATRIMONIO_ESTOQUE", "SECRETARIA_RECEPCAO", "ANALISTA_RH_PONTO"].includes(m.role)).length,
    };
  }, [team]);

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-500 w-full pb-20">
      
      {/* Toast de Sucesso */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-500 hover:text-emerald-700 p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Bar Superior Responsiva com Medidor de Cota do Plano */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-4 sm:px-5 py-4 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
              <Users size={14} className="text-rd-cyan" />
              Quadro de Colaboradores
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
          
          {/* MEDIDOR DE COTA DE USUÁRIOS NO PLANO */}
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-xl">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">
                  {currentLimit.max < 9000 ? `${team.length} de ${currentLimit.max} Colaboradores` : `${team.length} Colaboradores (Ilimitado)`}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                  Plano {activePlan === "BASIC" ? "Básico" : activePlan === "PRO" ? "Pro" : "Enterprise"}
                </span>
              </div>
              {currentLimit.max < 9000 && (
                <div className="w-36 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full transition-all duration-500 ${quotaPercent >= 100 ? "bg-rose-500" : quotaPercent >= 80 ? "bg-amber-500" : "bg-rd-cyan"}`} 
                    style={{ width: `${quotaPercent}%` }} 
                  />
                </div>
              )}
            </div>
            {isQuotaReached && currentLimit.max < 9000 && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm cursor-pointer animate-pulse"
              >
                Upgrade de Plano
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {currentLimit.nextPlan && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-rd-cyan hover:border-rd-cyan/50 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Gerenciar Cota</span>
            </button>
          )}

          <button 
            onClick={() => {
              setErrorMessage("");
              setLastGeneratedInvite(null);
              if (isQuotaReached) {
                setShowUpgradeModal(true);
              } else {
                setShowCreateModal(true);
              }
            }} 
            className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 shadow-md ${
              isQuotaReached 
                ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 border border-zinc-400 dark:border-zinc-700 cursor-not-allowed" 
                : "bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 shadow-rd-cyan/20"
            }`}
          >
            <Plus size={16} /> 
            {isQuotaReached ? "Cota Atingida (Faça Upgrade)" : "Cadastrar Novo Usuário"}
          </button>
        </div>
      </div>

      {/* Métricas Resumidas da Equipe */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900/85 p-3.5 sm:p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total de Equipe</span>
            <Users size={16} className="text-primary shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1.5">{stats.total}</p>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate">Cadastros ativos</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 p-3.5 sm:p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Corpo Clínico</span>
            <Stethoscope size={16} className="text-cyan-500 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1.5">{stats.clinicos}</p>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate">Médicos & CRM</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 p-3.5 sm:p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Enfermagem & Apoio</span>
            <HeartPulse size={16} className="text-rose-500 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1.5">{stats.enfermagem}</p>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate">COREN & Fisio</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 p-3.5 sm:p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Gestão & TISS</span>
            <Receipt size={16} className="text-emerald-500 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1.5">{stats.gestaoBackoffice}</p>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate">Faturamento & RH</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-zinc-900/85 p-3.5 sm:p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cargo, CRM/COREN ou permissão..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
          >
            <option value="TODOS">Todas as Categorias</option>
            <option value="Diretoria & Gestão">Diretoria & Gestão</option>
            <option value="Corpo Clínico & Especialistas">Corpo Clínico & Médicos</option>
            <option value="Enfermagem & Assistencial">Enfermagem & Assistencial</option>
            <option value="Atendimento & Recepção">Atendimento & Recepção</option>
            <option value="Faturamento, Patrimônio & RH">Faturamento, Patrimônio & RH</option>
          </select>
        </div>
      </div>

      {/* Tabela de Equipe Responsiva */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-[11px] sm:text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-3.5 sm:p-4 font-bold">Colaborador / Contato</th>
                <th className="p-3.5 sm:p-4 font-bold">Cargo & Setor</th>
                <th className="p-3.5 sm:p-4 font-bold">Permissão / Perfil RBAC</th>
                <th className="p-3.5 sm:p-4 font-bold">Registro Profissional</th>
                <th className="p-3.5 sm:p-4 font-bold">Unidade de Lotação</th>
                <th className="p-3.5 sm:p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="w-6 h-6 border-2 border-rd-cyan border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Carregando equipe hospitalar...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    <Users size={36} className="mx-auto mb-2 text-zinc-400 opacity-60" />
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">Nenhum colaborador encontrado</p>
                    <p className="text-xs text-zinc-400 mt-1">Tente ajustar a busca ou adicionar um novo usuário.</p>
                  </td>
                </tr>
              ) : (
                filteredTeam.map(member => {
                  const roleMeta = HEALTHCARE_ROLES.find(r => r.code === member.role) || {
                    code: member.role,
                    label: member.role,
                    category: "Outros",
                    badgeColor: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
                    description: "Perfil operacional"
                  };

                  return (
                    <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan font-bold text-xs border border-rd-cyan/20 shrink-0">
                            {member.fullName ? member.fullName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
                                {member.fullName || "Sem Nome"}
                              </p>
                              {member.status === "PENDENTE_ATIVACAO" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  Convite Pendente
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  Ativo
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                              <Mail size={11} /> {member.email}
                            </p>
                            {member.telefone && (
                              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {member.telefone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <div>
                          <p className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                            {member.cargo || "Profissional de Saúde"}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {member.departamento || "Geral"}
                          </p>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleMeta.badgeColor}`}>
                            <Shield size={11} /> {roleMeta.label}
                          </span>
                          <p className="text-[10px] text-zinc-400 max-w-[220px] line-clamp-1">
                            {roleMeta.description}
                          </p>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                          {member.registroProfissional || "—"}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                          <Building2 size={12} className="text-zinc-400 shrink-0" />
                          {member.unidade || "Unidade Central Alphaville"}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4 text-right">
                        {deleteConfirmId === member.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs rounded-lg hover:bg-zinc-300"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleOpenEdit(member)}
                              title="Editar Cadastro do Colaborador"
                              className="text-zinc-500 hover:text-rd-cyan transition-colors p-2 hover:bg-rd-cyan/10 rounded-lg cursor-pointer"
                            >
                              <Pencil size={15} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(member.id)}
                              title="Remover Colaborador"
                              className="text-zinc-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CADASTRAR NOVO USUÁRIO (CLEAN WHITE NO TEMA CLARO) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Controle de Acessos & RBAC
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Cadastrar Novo Usuário
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Preencha os dados e defina a permissão adequada. O cadastro será registrado nos logs de auditoria.
                </p>
              </div>

              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Alternador de Método de Onboarding: Senha Provisória vs Enviar Link de Ativação por E-mail */}
            <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setCreateMode("CONVITE_EMAIL")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  createMode === "CONVITE_EMAIL"
                    ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm border border-zinc-200 dark:border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <Send size={14} />
                <span>Link de Ativação por E-mail</span>
              </button>

              <button
                type="button"
                onClick={() => setCreateMode("SENHA")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  createMode === "SENHA"
                    ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm border border-zinc-200 dark:border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <Key size={14} />
                <span>Definir Senha Provisória</span>
              </button>
            </div>

            {/* Sucesso com Link de Ativação Gerado */}
            {lastGeneratedInvite && (
              <div className="p-4 bg-rd-cyan/10 border-2 border-rd-cyan/30 rounded-2xl space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-rd-cyan" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                      Link de Ativação Gerado!
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Token válido por 72h</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Compartilhe com o colaborador <strong>{lastGeneratedInvite.email}</strong> para que ele defina sua senha definitiva:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={lastGeneratedInvite.url}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-rd-cyan/40 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(lastGeneratedInvite.url);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }}
                    className="px-3.5 py-2 bg-rd-cyan text-zinc-950 font-bold text-xs rounded-xl hover:bg-rd-cyan/90 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Copy size={13} />
                    {copiedLink ? "Copiado!" : "Copiar Link"}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Nome Completo *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Dra. Mariana Costa"
                    value={createForm.fullName}
                    onChange={e => setCreateForm({...createForm, fullName: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">E-mail Corporativo *</label>
                  <input
                    required
                    type="email"
                    placeholder="Ex: mariana.costa@medcore.com.br"
                    value={createForm.email}
                    onChange={e => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={createForm.cpf}
                    onChange={e => setCreateForm({...createForm, cpf: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 90000-0000"
                    value={createForm.telefone}
                    onChange={e => setCreateForm({...createForm, telefone: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Cargo / Função</label>
                  <input
                    type="text"
                    placeholder="Ex: Cardiologista / Enfermeiro Chefe"
                    value={createForm.cargo}
                    onChange={e => setCreateForm({...createForm, cargo: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Departamento / Setor</label>
                  <select
                    value={createForm.departamento}
                    onChange={e => setCreateForm({...createForm, departamento: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Corpo Clínico">Corpo Clínico / Médicos</option>
                    <option value="Enfermagem Assistencial">Enfermagem Assistencial</option>
                    <option value="Diretoria Médica">Diretoria Médica</option>
                    <option value="Atendimento & Recepção">Atendimento & Recepção</option>
                    <option value="Faturamento & Convênios">Faturamento & Convênios (TISS)</option>
                    <option value="Patrimônio & Farmácia">Patrimônio, CAF & Farmácia</option>
                    <option value="Recursos Humanos">Recursos Humanos & Departamento Pessoal</option>
                    <option value="Gestão & Operações">Gestão Geral & Operações</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Registro Profissional (CRM, COREN...)</label>
                  <input
                    type="text"
                    placeholder="Ex: CRM-SP 123456"
                    value={createForm.registroProfissional}
                    onChange={e => setCreateForm({...createForm, registroProfissional: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Unidade de Lotação</label>
                  <select
                    value={createForm.unidade}
                    onChange={e => setCreateForm({...createForm, unidade: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Unidade Central Alphaville">Unidade Central Alphaville</option>
                    <option value="Hospital Geral Morumbi">Hospital Geral Morumbi</option>
                    <option value="Clínica Diagnóstica Zona Sul">Clínica Diagnóstica Zona Sul</option>
                    <option value="Sede Corporativa & Backoffice">Sede Corporativa & Backoffice</option>
                    <option value="Todas as Unidades (Multilocal)">Todas as Unidades (Multilocal)</option>
                  </select>
                </div>
              </div>

              {/* Permissão RBAC */}
              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Tipo de Permissão / Papel RBAC *</span>
                  <span className="text-[11px] font-normal text-rd-cyan lowercase">define os módulos acessíveis</span>
                </label>
                
                <select
                  required
                  value={createForm.role}
                  onChange={e => setCreateForm({...createForm, role: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 font-semibold focus:border-rd-cyan focus:outline-none"
                >
                  <optgroup label="👑 Diretoria & Alta Gestão">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Diretoria & Gestão").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🩺 Corpo Clínico & Médicos">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Corpo Clínico & Especialistas").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="💉 Enfermagem & Equipe Assistencial">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Enfermagem & Assistencial").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🛎️ Atendimento, Recepção & Apoio">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Atendimento & Recepção").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="📊 Faturamento TISS, Patrimônio & RH">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Faturamento, Patrimônio & RH").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                </select>

                <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex items-start gap-2.5">
                  <Shield size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{selectedCreateRoleInfo.label}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{selectedCreateRoleInfo.description}</p>
                  </div>
                </div>
              </div>

              {/* Se for modo SENHA, exibe campo de senha. Se for CONVITE_EMAIL, exibe informativo */}
              {createMode === "SENHA" ? (
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Senha Provisória *</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      placeholder="Mínimo de 6 caracteres"
                      value={createForm.password}
                      onChange={e => setCreateForm({...createForm, password: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rd-cyan/5 border border-rd-cyan/20 flex items-start gap-3">
                  <Mail size={18} className="text-rd-cyan shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Convite Seguro por E-mail</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Um link de ativação com token criptográfico seguro será gerado para o colaborador. Assim que ele definir a senha definitiva, um alerta em tempo real será disparado no sino do Gestor.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rd-cyan/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Processando..."
                  ) : createMode === "CONVITE_EMAIL" ? (
                    <><Send size={16} /> Enviar Link de Ativação</>
                  ) : (
                    <><UserCheck size={16} /> Cadastrar com Senha</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1.5: UPGRADE DE PLANO (TRAVA DE COTA) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-amber-500/50 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Limite de Colaboradores Atingido</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Plano Atual: {currentLimit.label}</p>
                </div>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <p>
                Sua clínica está utilizando <strong>{team.length} de {currentLimit.max} licenças</strong> contratadas no <strong>{activePlan}</strong>.
              </p>
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                <p className="font-bold text-zinc-900 dark:text-zinc-100">Disponível no Plano Superior:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-500 dark:text-zinc-400">
                  <li>Até 20 colaboradores no Plano Pro ou Ilimitado no Enterprise</li>
                  <li>Módulos de Auditoria Forense Avançada e SLA Hospitalar</li>
                  <li>Integrações com convênios TISS e Prontuário RAG com IA</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activePlan === "BASIC") setActivePlan("PRO");
                  else if (activePlan === "PRO") setActivePlan("MAX");
                  setShowUpgradeModal(false);
                  setActionSuccess("Upgrade de plano simulado com sucesso! Cota expandida.");
                  setTimeout(() => setActionSuccess(null), 4000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Sparkles size={14} /> Fazer Upgrade Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR COLABORADOR (AUDITADO E COM REGISTRO DE HISTÓRICO) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <Pencil size={15} className="text-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Edição Auditada de Colaborador
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Editar Cadastro de {editForm.fullName || "Colaborador"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Atualize cargo, transferência de unidade ou alteração de permissão. Toda alteração é registrada na Trilha de Auditoria LGPD.
                </p>
              </div>

              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Nome Completo *</label>
                  <input
                    required
                    type="text"
                    value={editForm.fullName}
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">E-mail Corporativo *</label>
                  <input
                    required
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">CPF</label>
                  <input
                    type="text"
                    value={editForm.cpf}
                    onChange={e => setEditForm({...editForm, cpf: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={editForm.telefone}
                    onChange={e => setEditForm({...editForm, telefone: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Cargo / Função *</label>
                  <input
                    required
                    type="text"
                    value={editForm.cargo}
                    onChange={e => setEditForm({...editForm, cargo: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Departamento / Setor *</label>
                  <select
                    value={editForm.departamento}
                    onChange={e => setEditForm({...editForm, departamento: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Corpo Clínico">Corpo Clínico / Médicos</option>
                    <option value="Enfermagem Assistencial">Enfermagem Assistencial</option>
                    <option value="Diretoria Médica">Diretoria Médica</option>
                    <option value="Atendimento & Recepção">Atendimento & Recepção</option>
                    <option value="Faturamento & Convênios">Faturamento & Convênios (TISS)</option>
                    <option value="Patrimônio & Farmácia">Patrimônio, CAF & Farmácia</option>
                    <option value="Recursos Humanos">Recursos Humanos & Departamento Pessoal</option>
                    <option value="Gestão & Operações">Gestão Geral & Operações</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Registro Profissional (CRM, COREN...)</label>
                  <input
                    type="text"
                    value={editForm.registroProfissional}
                    onChange={e => setEditForm({...editForm, registroProfissional: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Unidade de Lotação / Transferência</label>
                  <select
                    value={editForm.unidade}
                    onChange={e => setEditForm({...editForm, unidade: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Unidade Central Alphaville">Unidade Central Alphaville</option>
                    <option value="Hospital Geral Morumbi">Hospital Geral Morumbi</option>
                    <option value="Clínica Diagnóstica Zona Sul">Clínica Diagnóstica Zona Sul</option>
                    <option value="Sede Corporativa & Backoffice">Sede Corporativa & Backoffice</option>
                    <option value="Todas as Unidades (Multilocal)">Todas as Unidades (Multilocal)</option>
                  </select>
                </div>
              </div>

              {/* Permissão RBAC */}
              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Tipo de Permissão / Papel RBAC *</span>
                  <span className="text-[11px] font-normal text-rd-cyan lowercase">define o que o usuário visualiza</span>
                </label>
                
                <select
                  required
                  value={editForm.role}
                  onChange={e => setEditForm({...editForm, role: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 font-semibold focus:border-rd-cyan focus:outline-none"
                >
                  <optgroup label="👑 Diretoria & Alta Gestão">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Diretoria & Gestão").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🩺 Corpo Clínico & Médicos">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Corpo Clínico & Especialistas").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="💉 Enfermagem & Equipe Assistencial">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Enfermagem & Assistencial").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🛎️ Atendimento, Recepção & Apoio">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Atendimento & Recepção").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="📊 Faturamento TISS, Patrimônio & RH">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Faturamento, Patrimônio & RH").map(r => (
                      <option key={r.code} value={r.code}>{r.label}</option>
                    ))}
                  </optgroup>
                </select>

                <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex items-start gap-2.5">
                  <Shield size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{selectedEditRoleInfo.label}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{selectedEditRoleInfo.description}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Redefinir Senha de Acesso (Opcional)
                </label>
                <input
                  type="password"
                  placeholder="Deixe em branco para manter a senha atual"
                  value={editForm.password}
                  onChange={e => setEditForm({...editForm, password: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 text-xs">
                🔒 Esta edição será gravada com assinatura digital e carimbo de data/hora na <strong>Trilha de Auditoria Forense LGPD</strong>.
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rd-cyan/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Atualizando..." : <><UserCheck size={16} /> Salvar Alterações</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
