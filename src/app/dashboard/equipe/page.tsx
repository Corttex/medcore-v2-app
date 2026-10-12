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
  EyeOff
} from "lucide-react";

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
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [showPassword, setShowPassword] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Formulário Completo com todos os campos solicitados
  const [form, setForm] = useState({
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

  const [error, setError] = useState("");

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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao adicionar usuário à equipe.");
        setIsSubmitting(false);
        return;
      }

      setShowModal(false);
      setActionSuccess("Novo colaborador cadastrado com sucesso!");
      setTimeout(() => setActionSuccess(null), 4000);

      // Reseta formulário
      setForm({
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
      setError("Erro de conexão ao salvar usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeam(prev => prev.filter(m => m.id !== id));
        setDeleteConfirmId(null);
        setActionSuccess("Colaborador removido da equipe.");
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

  const selectedRoleInfo = useMemo(() => {
    return HEALTHCARE_ROLES.find(r => r.code === form.role) || HEALTHCARE_ROLES[0];
  }, [form.role]);

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
    <div className="space-y-6 animate-in fade-in duration-500 w-full pb-20">
      {/* Toast de Sucesso */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Bar Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-4 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Gestão de Equipe & Controle RBAC
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            {team.length} Colaboradores Ativos
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden md:inline">
            22 Níveis de Permissões de Saúde Configurados
          </span>
        </div>

        <button 
          onClick={() => {
            setError("");
            setShowModal(true);
          }} 
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 shadow-md shadow-rd-cyan/20 cursor-pointer active:scale-95"
        >
          <Plus size={16} /> Cadastrar Novo Usuário
        </button>
      </div>

      {/* Métricas Resumidas da Equipe */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total de Equipe</span>
            <Users size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">{stats.total}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Cadastros corporativos</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Corpo Clínico</span>
            <Stethoscope size={16} className="text-cyan-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">{stats.clinicos}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Médicos & Especialistas</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Enfermagem & Apoio</span>
            <HeartPulse size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">{stats.enfermagem}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">COREN, Fisio & Farmácia</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Gestão & TISS</span>
            <Receipt size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">{stats.gestaoBackoffice}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Faturamento, RH & Estoque</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, cargo, CRM/COREN ou função..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
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

      {/* Tabela de Equipe */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Colaborador / Contato</th>
                <th className="p-4 font-bold">Cargo & Departamento</th>
                <th className="p-4 font-bold">Permissão / Perfil RBAC</th>
                <th className="p-4 font-bold">Registro Profissional</th>
                <th className="p-4 font-bold">Unidade</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="w-6 h-6 border-2 border-rd-cyan border-t-transparent rounded-full animate-spin" />
                      <span>Carregando equipe hospitalar...</span>
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
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan font-bold text-xs border border-rd-cyan/20 shrink-0">
                            {member.fullName ? member.fullName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                              {member.fullName || "Sem Nome"}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} /> {member.email}
                            </p>
                            {member.telefone && (
                              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {member.telefone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                            {member.cargo || "Profissional de Saúde"}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {member.departamento || "Geral"}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleMeta.badgeColor}`}>
                            <Shield size={12} /> {roleMeta.label}
                          </span>
                          <p className="text-[10px] text-zinc-400 max-w-[220px] line-clamp-1">
                            {roleMeta.description}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                          {member.registroProfissional || "—"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                          <Building2 size={12} className="text-zinc-400 shrink-0" />
                          {member.unidade || "Unidade Central Alphaville"}
                        </span>
                      </td>

                      <td className="p-4 text-right">
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
                          <button 
                            onClick={() => setDeleteConfirmId(member.id)}
                            title="Remover Colaborador"
                            className="text-zinc-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 size={15} />
                          </button>
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

      {/* MODAL CADASTRAR NOVO USUÁRIO (100% CLEAN WHITE NO TEMA CLARO) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 relative">
            
            {/* Header do Modal */}
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
                  Preencha os dados cadastrais e selecione o perfil de permissão adequado à função hospitalar.
                </p>
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulário Completo */}
            <form onSubmit={handleAddMember} className="space-y-4">
              
              {/* Linha 1: Nome e Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Nome Completo *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Dra. Mariana Costa"
                    value={form.fullName}
                    onChange={e => setForm({...form, fullName: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    E-mail Corporativo *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="Ex: mariana.costa@medcore.com.br"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Linha 2: CPF e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    CPF
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={e => setForm({...form, cpf: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 90000-0000"
                    value={form.telefone}
                    onChange={e => setForm({...form, telefone: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Linha 3: Cargo e Departamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cardiologista / Enfermeiro Plantonista"
                    value={form.cargo}
                    onChange={e => setForm({...form, cargo: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Departamento / Setor
                  </label>
                  <select
                    value={form.departamento}
                    onChange={e => setForm({...form, departamento: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  >
                    <option value="Corpo Clínico">Corpo Clínico / Médicos</option>
                    <option value="Enfermagem Assistencial">Enfermagem Assistencial</option>
                    <option value="Diretoria Médica">Diretoria Médica</option>
                    <option value="Atendimento & Recepção">Atendimento & Recepção</option>
                    <option value="Faturamento & Convênios">Faturamento & Convênios (TISS)</option>
                    <option value="Patrimônio & Farmácia">Patrimônio, CAF & Farmácia</option>
                    <option value="Recursos Humanos">Recursos Humanos & Departamento Pessoal</option>
                    <option value="Gestão & Operações">Gestão Geral & Operações</option>
                    <option value="Tecnologia & TI">Tecnologia & Suporte</option>
                  </select>
                </div>
              </div>

              {/* Linha 4: Registro Profissional e Unidade de Lotação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Registro Profissional (CRM, COREN, CRF...)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: CRM-SP 123456 ou COREN-SP 98765"
                    value={form.registroProfissional}
                    onChange={e => setForm({...form, registroProfissional: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Unidade de Atendimento / Lotação
                  </label>
                  <select
                    value={form.unidade}
                    onChange={e => setForm({...form, unidade: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  >
                    <option value="Unidade Central Alphaville">Unidade Central Alphaville</option>
                    <option value="Hospital Geral Morumbi">Hospital Geral Morumbi</option>
                    <option value="Clínica Diagnóstica Zona Sul">Clínica Diagnóstica Zona Sul</option>
                    <option value="Sede Corporativa & Backoffice">Sede Corporativa & Backoffice</option>
                    <option value="Todas as Unidades (Multilocal)">Todas as Unidades (Multilocal)</option>
                  </select>
                </div>
              </div>

              {/* Linha 5: Tipo de Permissão (20+ OPÇÕES DE SAÚDE) */}
              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Tipo de Permissão / Papel de Acesso (RBAC) *</span>
                  <span className="text-[11px] font-normal text-rd-cyan lowercase">define os módulos visíveis</span>
                </label>
                
                <select
                  required
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-3 text-sm text-zinc-900 dark:text-zinc-100 font-semibold focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                >
                  <optgroup label="👑 Diretoria & Alta Gestão">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Diretoria & Gestão").map(r => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="🩺 Corpo Clínico & Médicos Especialistas">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Corpo Clínico & Especialistas").map(r => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="💉 Enfermagem & Equipe Assistencial">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Enfermagem & Assistencial").map(r => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="🛎️ Atendimento, Recepção & Call Center">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Atendimento & Recepção").map(r => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="📊 Faturamento TISS, Patrimônio, RH & Apoio">
                    {HEALTHCARE_ROLES.filter(r => r.category === "Faturamento, Patrimônio & RH").map(r => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Card explicativo da permissão selecionada */}
                <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex items-start gap-2.5">
                  <Shield size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedRoleInfo.label} ({selectedRoleInfo.category})
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {selectedRoleInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Linha 6: Senha Provisória */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Senha Provisória de Acesso *
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    placeholder="Mínimo de 6 caracteres"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  O colaborador será solicitado a alterar a senha provisória no primeiro login.
                </p>
              </div>

              {/* Botões do Rodapé */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <UserCheck size={16} /> Salvar e Cadastrar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
