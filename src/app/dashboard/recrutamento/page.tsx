"use client";

import React, { useState, useMemo } from "react";
import { 
  UserPlus, 
  Briefcase, 
  FileCheck2, 
  Clock, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Search, 
  Plus, 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  X, 
  Pencil, 
  Trash2, 
  Eye, 
  AlertCircle, 
  ShieldCheck, 
  Calendar,
  CheckCircle,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react";

export interface Candidate {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  registro: string;
  scoreIA: number; // Ex: 96%
  etapa: "Triagem IA" | "Entrevista Liderança" | "Parecer Técnico" | "Exame Admissional" | "Aprovado";
  experiencia: string;
}

export interface JobOpening {
  id: string;
  titulo: string;
  departamento: "Corpo Clínico" | "Enfermagem UTI" | "Pronto Atendimento" | "Farmácia Hospitalar" | "Atendimento & Recepção" | "Faturamento TISS";
  vagas: number;
  regime: "CLT" | "Plantonista PJ" | "Cooperado";
  escala: string;
  faixaSalarial: string;
  requisitos: string;
  beneficios?: string;
  unidade: string;
  status: "Aberta" | "Em Triagem IA" | "Em Entrevistas" | "Encerrada";
  totalCandidatos: number;
  slaDias: number;
  dataAbertura: string;
  descricao: string;
  candidatos: Candidate[];
}

const INITIAL_JOBS: JobOpening[] = [];

export default function RecrutamentoPage() {
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("TODOS");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobOpening | null>(null);
  const [shareJobModal, setShareJobModal] = useState<JobOpening | null>(null);
  const [copiedJobLink, setCopiedJobLink] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Criação
  const [createForm, setCreateForm] = useState({
    titulo: "",
    departamento: "Corpo Clínico" as JobOpening["departamento"],
    vagas: 1,
    regime: "CLT" as JobOpening["regime"],
    escala: "12x36 Diurno",
    faixaSalarial: "A combinar",
    requisitos: "",
    beneficios: "",
    unidade: "Unidade Central Alphaville",
    status: "Aberta" as JobOpening["status"],
    descricao: ""
  });

  // Form Edição
  const [editForm, setEditForm] = useState({
    id: "",
    titulo: "",
    departamento: "Corpo Clínico" as JobOpening["departamento"],
    vagas: 1,
    regime: "CLT" as JobOpening["regime"],
    escala: "",
    faixaSalarial: "",
    requisitos: "",
    beneficios: "",
    unidade: "",
    status: "Aberta" as JobOpening["status"],
    descricao: ""
  });

  // Criar Vaga
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.titulo.trim()) return;

    const newJob: JobOpening = {
      id: `vaga-${Date.now()}`,
      titulo: createForm.titulo,
      departamento: createForm.departamento,
      vagas: Number(createForm.vagas) || 1,
      regime: createForm.regime,
      escala: createForm.escala || "44h Semanais",
      faixaSalarial: createForm.faixaSalarial || "Compatível com a função",
      requisitos: createForm.requisitos || "Formação superior e registro no conselho de classe.",
      beneficios: createForm.beneficios || "Assistência Médica, Vale Refeição, Seguro de Vida e Adicionais.",
      unidade: createForm.unidade || "Unidade Central",
      status: createForm.status,
      totalCandidatos: 0,
      slaDias: 0,
      dataAbertura: new Date().toISOString().split("T")[0],
      descricao: createForm.descricao || "Processo seletivo aberto para reforço da equipe.",
      candidatos: []
    };

    setJobs([newJob, ...jobs]);
    setShowCreateModal(false);
    setToastMessage(`Vaga "${newJob.titulo}" aberta com sucesso! Triagem com IA ativada.`);
    setTimeout(() => setToastMessage(null), 4000);

    // Reseta form
    setCreateForm({
      titulo: "",
      departamento: "Corpo Clínico",
      vagas: 1,
      regime: "CLT",
      escala: "12x36 Diurno",
      faixaSalarial: "A combinar",
      requisitos: "",
      beneficios: "",
      unidade: "Unidade Central Alphaville",
      status: "Aberta",
      descricao: ""
    });
  };

  // Abrir Modal de Edição
  const handleOpenEdit = (job: JobOpening) => {
    setEditForm({
      id: job.id,
      titulo: job.titulo,
      departamento: job.departamento,
      vagas: job.vagas,
      regime: job.regime,
      escala: job.escala,
      faixaSalarial: job.faixaSalarial,
      requisitos: job.requisitos,
      beneficios: job.beneficios || (job.id === "vaga-02" 
        ? "Assistência Médica e Odontológica Bradesco Saúde Top Nacional\nVale Alimentação / Refeição flexível Flash (R$ 1.200/mês)\nAdicional de Insalubridade grau máximo (40%)\nPlano de Previdência Privada e Auxílio Creche\nAcesso irrestrito à Universidade Corporativa MedCore Educacional"
        : "Assistência Médica Hospitalar Completa\nVale Alimentação / Refeição Flexível\nPlano de Previdência Privada e Seguro de Vida\nAcesso à plataforma e treinamentos MedCore Educacional"),
      unidade: job.unidade,
      status: job.status,
      descricao: job.descricao
    });
    setShowEditModal(true);
  };

  // Salvar Edição
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setJobs(prev => prev.map(item => {
      if (item.id === editForm.id) {
        const updated = {
          ...item,
          titulo: editForm.titulo,
          departamento: editForm.departamento,
          vagas: Number(editForm.vagas) || 1,
          regime: editForm.regime,
          escala: editForm.escala,
          faixaSalarial: editForm.faixaSalarial,
          requisitos: editForm.requisitos,
          beneficios: editForm.beneficios,
          unidade: editForm.unidade,
          status: editForm.status,
          descricao: editForm.descricao
        };

        // Salva sincronizado no localStorage para refletir na página pública (/vagas/[id])
        if (typeof window !== "undefined") {
          try {
            const reqArray = editForm.requisitos
              .split("\n")
              .map(r => r.trim())
              .filter(Boolean);
            const benArray = editForm.beneficios
              .split("\n")
              .map(b => b.trim())
              .filter(Boolean);

            const publicData = {
              id: updated.id,
              protocolo: `MED-REC-${updated.id.toUpperCase()}`,
              titulo: updated.titulo,
              departamento: updated.departamento,
              unidade: updated.unidade,
              regime: updated.regime,
              escala: updated.escala,
              faixaSalarial: updated.faixaSalarial,
              prazoDias: 8,
              descricao: updated.descricao,
              requisitos: reqArray.length > 0 ? reqArray : [updated.requisitos],
              beneficios: benArray.length > 0 ? benArray : [updated.beneficios],
              clinica: "Rede Hospitalar MedCore Health Care"
            };
            localStorage.setItem(`medcore_job_${updated.id}`, JSON.stringify(publicData));
          } catch (err) {
            console.error("Erro ao sincronizar vaga com localStorage:", err);
          }
        }

        return updated;
      }
      return item;
    }));

    setShowEditModal(false);
    setToastMessage("Processo seletivo e página pública atualizados com sucesso!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Excluir Vaga
  const handleDeleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setDeleteConfirmId(null);
    if (selectedJobDetail?.id === id) setSelectedJobDetail(null);
    setToastMessage("Processo seletivo removido do painel.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtragem
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requisitos.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (departmentFilter !== "TODOS" && job.departamento !== departmentFilter) return false;
      if (statusFilter !== "TODOS" && job.status !== statusFilter) return false;
      return true;
    });
  }, [jobs, searchTerm, departmentFilter, statusFilter]);

  // Estatísticas Dinâmicas
  const stats = useMemo(() => {
    const totalVagasAbertas = jobs.filter(j => j.status !== "Encerrada").length;
    const totalCandidatos = jobs.reduce((acc, curr) => acc + curr.totalCandidatos, 0);
    const emTriagemIA = jobs.filter(j => j.status === "Em Triagem IA" || j.status === "Aberta").length;
    const mediaSla = jobs.length > 0 ? Math.round(jobs.reduce((acc, curr) => acc + curr.slaDias, 0) / jobs.length) : 10;
    return {
      totalVagasAbertas,
      totalCandidatos,
      emTriagemIA,
      mediaSla
    };
  }, [jobs]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20 pt-1">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Bar Superior 100% da Largura */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
              <UserPlus size={14} className="text-rd-cyan" />
              Painel de Vagas
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            {stats.totalVagasAbertas} Processos Seletivos Ativos
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            Triagem Forense com IA
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all cursor-pointer active:scale-95"
          >
            <UserPlus size={16} /> Nova Vaga
          </button>
        </div>
      </div>

      {/* Cards de Métricas em Largura Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-rd-cyan/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Vagas em Aberto</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.totalVagasAbertas} Requisições</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">UTI, Clínica Médica, Enfermagem e Apoio.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <FileCheck2 size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Banco de Talentos</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.totalCandidatos} Candidatos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Classificação por CRM, COREN e especialidades.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Triagem Inteligente</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.emTriagemIA} Vagas com IA</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Score de compatibilidade com o perfil técnico da vaga.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">SLA Médio de Fechamento</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.mediaSla} Dias</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Da abertura da vaga à aprovação admissional.</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm w-full">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar vaga por cargo, departamento, unidade ou requisitos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
          >
            <option value="TODOS">Todos os Departamentos</option>
            <option value="Corpo Clínico">Corpo Clínico / Médicos</option>
            <option value="Enfermagem UTI">Enfermagem UTI</option>
            <option value="Pronto Atendimento">Pronto Atendimento</option>
            <option value="Farmácia Hospitalar">Farmácia Hospitalar</option>
            <option value="Atendimento & Recepção">Atendimento & Recepção</option>
            <option value="Faturamento TISS">Faturamento TISS</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Aberta">Aberta</option>
            <option value="Em Triagem IA">Em Triagem IA</option>
            <option value="Em Entrevistas">Em Entrevistas</option>
            <option value="Encerrada">Encerrada</option>
          </select>
        </div>
      </div>

      {/* Tabela de Vagas em 100% da Largura */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Briefcase size={16} className="text-rd-cyan" />
            Quadro de Processos Seletivos ({filteredJobs.length})
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Clique em &ldquo;Candidatos&rdquo; para ver a esteira de avaliação e parecer de IA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Vaga / Setor</th>
                <th className="p-4 font-bold">Regime & Escala</th>
                <th className="p-4 font-bold">Remuneração & Unidade</th>
                <th className="p-4 font-bold">Inscritos / Pipeline</th>
                <th className="p-4 font-bold">Status ATS</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    <UserPlus size={36} className="mx-auto mb-2 text-zinc-400 opacity-60" />
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">Nenhum processo seletivo encontrado</p>
                    <p className="text-xs text-zinc-400 mt-1">Clique em &ldquo;Nova Vaga&rdquo; para abrir uma requisição de contratação.</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan font-bold text-xs border border-rd-cyan/20 shrink-0">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                            {item.titulo}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                              {item.departamento}
                            </span>
                            <span className="text-xs text-zinc-400 font-medium">
                              {item.vagas} {item.vagas > 1 ? "vagas" : "vaga"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {item.regime}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.escala}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <DollarSign size={12} /> {item.faixaSalarial}
                        </p>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {item.unidade}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users size={15} className="text-primary" />
                        <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                          {item.totalCandidatos}
                        </span>
                        <span className="text-xs text-zinc-400">candidaturas</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        item.status === "Aberta" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : item.status === "Em Triagem IA"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          : item.status === "Em Entrevistas"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDeleteJob(item.id)}
                            className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors"
                          >
                            Excluir
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
                            onClick={() => {
                              setShareJobModal(item);
                              setCopiedJobLink(false);
                            }}
                            className="p-1.5 text-zinc-500 hover:text-emerald-500 rounded-lg hover:bg-emerald-500/10 transition-colors"
                            title="Compartilhar Link Público da Vaga"
                          >
                            <Share2 size={15} />
                          </button>
                          <button
                            onClick={() => setSelectedJobDetail(item)}
                            className="p-1.5 text-zinc-500 hover:text-rd-cyan rounded-lg hover:bg-rd-cyan/10 transition-colors"
                            title="Visualizar Vaga & Candidatos"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-zinc-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                            title="Editar Vaga"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Excluir Vaga"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: NOVA VAGA (CLEAN WHITE NO LIGHT MODE) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <UserPlus size={16} className="text-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    ATS & Recrutamento Hospitalar
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Abrir Nova Vaga Hospitalar
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Cadastre a oportunidade para ativar o pipeline de atração e triagem inteligente de candidatos.
                </p>
              </div>

              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Título da Vaga / Função *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Fisioterapeuta Respiratório - UTI Adulto"
                  value={createForm.titulo}
                  onChange={e => setCreateForm({...createForm, titulo: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Departamento / Área *
                  </label>
                  <select
                    value={createForm.departamento}
                    onChange={e => setCreateForm({...createForm, departamento: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Corpo Clínico">Corpo Clínico / Médicos</option>
                    <option value="Enfermagem UTI">Enfermagem UTI</option>
                    <option value="Pronto Atendimento">Pronto Atendimento</option>
                    <option value="Farmácia Hospitalar">Farmácia Hospitalar</option>
                    <option value="Atendimento & Recepção">Atendimento & Recepção</option>
                    <option value="Faturamento TISS">Faturamento TISS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Número de Vagas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.vagas}
                    onChange={e => setCreateForm({...createForm, vagas: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Regime
                  </label>
                  <select
                    value={createForm.regime}
                    onChange={e => setCreateForm({...createForm, regime: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="CLT">CLT</option>
                    <option value="Plantonista PJ">Plantonista PJ</option>
                    <option value="Cooperado">Cooperado</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Escala de Trabalho
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 12x36 Diurno"
                    value={createForm.escala}
                    onChange={e => setCreateForm({...createForm, escala: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Remuneração Estimada
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 6.000 + Insalubridade"
                    value={createForm.faixaSalarial}
                    onChange={e => setCreateForm({...createForm, faixaSalarial: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Requisitos & Conselhos Obrigatórios
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: CREFITO ativo, pós em terapia intensiva..."
                    value={createForm.requisitos}
                    onChange={e => setCreateForm({...createForm, requisitos: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Unidade de Lotação
                  </label>
                  <select
                    value={createForm.unidade}
                    onChange={e => setCreateForm({...createForm, unidade: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Unidade Central Alphaville">Unidade Central Alphaville</option>
                    <option value="Hospital Geral Morumbi">Hospital Geral Morumbi</option>
                    <option value="Clínica Diagnóstica Zona Sul">Clínica Diagnóstica Zona Sul</option>
                    <option value="Sede Corporativa & Backoffice">Sede Corporativa & Backoffice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Descrição das Atividades & Responsabilidades
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalhamento das rotinas, atribuições e benefícios oferecidos..."
                  value={createForm.descricao}
                  onChange={e => setCreateForm({...createForm, descricao: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rd-cyan/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus size={16} /> Abrir Vaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR VAGA (100% FUNCIONAL) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <Pencil size={15} className="text-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Edição do Processo Seletivo
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Editar {editForm.titulo}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Modifique número de vagas, status da seleção, remuneração e requisitos.
                </p>
              </div>

              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Título da Vaga *
                </label>
                <input
                  required
                  type="text"
                  value={editForm.titulo}
                  onChange={e => setEditForm({...editForm, titulo: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Status ATS
                  </label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Aberta">Aberta</option>
                    <option value="Em Triagem IA">Em Triagem IA</option>
                    <option value="Em Entrevistas">Em Entrevistas</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Vagas Disponíveis
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.vagas}
                    onChange={e => setEditForm({...editForm, vagas: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Regime
                  </label>
                  <select
                    value={editForm.regime}
                    onChange={e => setEditForm({...editForm, regime: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="CLT">CLT</option>
                    <option value="Plantonista PJ">Plantonista PJ</option>
                    <option value="Cooperado">Cooperado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Escala de Trabalho
                  </label>
                  <input
                    type="text"
                    value={editForm.escala}
                    onChange={e => setEditForm({...editForm, escala: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Remuneração
                  </label>
                  <input
                    type="text"
                    value={editForm.faixaSalarial}
                    onChange={e => setEditForm({...editForm, faixaSalarial: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              {/* Descrição das Atividades */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                    Descrição das Atividades & Rotina
                  </label>
                  <span className="text-[10px] text-zinc-400">Exibido na página pública</span>
                </div>
                <textarea
                  rows={3}
                  value={editForm.descricao}
                  onChange={e => setEditForm({...editForm, descricao: e.target.value})}
                  placeholder="Descreva as responsabilidades, atuação na clínica/hospital e rotinas do cargo..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              {/* Requisitos Técnicos & Habilitação */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                    Requisitos Técnicos & Habilitação (1 por linha)
                  </label>
                  <span className="text-[10px] text-zinc-400">Formato Checklist</span>
                </div>
                <textarea
                  rows={4}
                  value={editForm.requisitos}
                  onChange={e => setEditForm({...editForm, requisitos: e.target.value})}
                  placeholder="Graduação ou Especialização na área&#10;Registro regular no conselho (CRM, COREN, CRF)&#10;Experiência mínima comprovada&#10;Certificações (ACLS, BLS, Manchester)"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
                {/* Sugestões Rápidas de Requisitos */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    "Registro de Classe Ativo (CRM/COREN/CRF)",
                    "Pós-graduação / Especialização Concluída",
                    "Certificação ACLS / BLS Válida",
                    "Experiência com Cirurgias / UTI",
                    "Disponibilidade para Início Imediato"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const current = editForm.requisitos ? editForm.requisitos + "\n" : "";
                        if (!editForm.requisitos.includes(sug)) {
                          setEditForm({ ...editForm, requisitos: current + sug });
                        }
                      }}
                      className="text-[10px] bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-400 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-0.5 text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefícios & Diferenciais Corporativos */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                    Benefícios & Diferenciais Corporativos (1 por linha)
                  </label>
                  <span className="text-[10px] text-zinc-400">Destaques Corporativos</span>
                </div>
                <textarea
                  rows={4}
                  value={editForm.beneficios}
                  onChange={e => setEditForm({...editForm, beneficios: e.target.value})}
                  placeholder="Assistência Médica e Odontológica Nacional&#10;Vale Alimentação / Refeição flexível (R$ 1.200/mês)&#10;Adicional de Insalubridade grau máximo (40%)&#10;Acesso à Universidade Corporativa e IA de Apoio"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
                {/* Sugestões Rápidas de Benefícios */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    "Assistência Médica e Odontológica Top Nacional",
                    "Vale Alimentação / Refeição Flash Flexível",
                    "Adicional de Insalubridade Grau Máximo (40%)",
                    "Previdência Privada + Auxílio Creche",
                    "Acesso Irrestrito à Universidade MedCore",
                    "Repasse Quinzenal Garantido (PJ)"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const current = editForm.beneficios ? editForm.beneficios + "\n" : "";
                        if (!editForm.beneficios.includes(sug)) {
                          setEditForm({ ...editForm, beneficios: current + sug });
                        }
                      }}
                      className="text-[10px] bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500/10 hover:text-amber-400 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-0.5 text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rd-cyan/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle size={16} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DETALHES DA VAGA & PIPELINE DE CANDIDATOS COM SCORE DE IA */}
      {selectedJobDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rd-cyan">
                  Pipeline ATS & Triagem Forense
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {selectedJobDetail.titulo}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedJobDetail.departamento} • {selectedJobDetail.unidade}
                </p>
              </div>
              <button 
                onClick={() => setSelectedJobDetail(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Informações da Vaga */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Regime</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedJobDetail.regime}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Escala</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedJobDetail.escala}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Remuneração</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedJobDetail.faixaSalarial}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Vagas</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedJobDetail.vagas}</p>
              </div>
            </div>

            {/* Candidatos em Destaque no Pipeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-500" />
                  Candidatos em Triagem ({selectedJobDetail.candidatos.length})
                </h4>
                <span className="text-[11px] text-zinc-400">Classificados por Compatibilidade IA</span>
              </div>

              {selectedJobDetail.candidatos.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  Nenhum candidato inscrito ainda nesta vaga.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedJobDetail.candidatos.map(cand => (
                    <div key={cand.id} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{cand.nome}</p>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                            {cand.registro}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {cand.experiencia} • {cand.telefone}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                          <Sparkles size={10} /> {cand.scoreIA}% Match
                        </span>
                        <p className="text-[10px] font-bold text-zinc-500 mt-1">{cand.etapa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedJobDetail(null);
                  handleOpenEdit(selectedJobDetail);
                }}
                className="flex-1 py-2.5 bg-rd-cyan text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Pencil size={14} /> Editar Vaga
              </button>
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="py-2.5 px-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: COMPARTILHAR LINK PÚBLICO DA VAGA (MEDCORE JOBS) */}
      {shareJobModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Compartilhar Vaga Pública</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Mini Landing Page MedCore Jobs</p>
                </div>
              </div>
              <button onClick={() => setShareJobModal(null)} className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{shareJobModal.titulo}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {shareJobModal.unidade} • {shareJobModal.regime} • {shareJobModal.faixaSalarial}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Link Direto da Vaga (Aberto a Candidatos)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/vagas/${shareJobModal.id}`}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/vagas/${shareJobModal.id}`;
                      navigator.clipboard.writeText(url);
                      setCopiedJobLink(true);
                      setTimeout(() => setCopiedJobLink(false), 2500);
                    }}
                    className="px-3.5 py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Copy size={13} />
                    {copiedJobLink ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `*Oportunidade na MedCore Health:* Vaga aberta para ${shareJobModal.titulo} (${shareJobModal.unidade}). Confira e candidate-se: ${typeof window !== "undefined" ? window.location.origin : ""}/vagas/${shareJobModal.id}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Share2 size={13} /> Compartilhar no WhatsApp
                </a>
                <a
                  href={`/vagas/${shareJobModal.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-zinc-300 dark:border-zinc-700"
                >
                  <ExternalLink size={13} /> Abrir Página Pública
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
