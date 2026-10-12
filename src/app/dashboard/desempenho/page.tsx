"use client";

import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  Plus, 
  Star, 
  CheckCircle, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  X, 
  CheckCircle2, 
  Download, 
  Stethoscope, 
  HeartPulse, 
  ShieldCheck, 
  Sparkles,
  BarChart3,
  ChevronRight,
  Eye,
  Trash2
} from "lucide-react";

export interface EvaluationRecord {
  id: string;
  colaborador: string;
  cargo: string;
  departamento: string;
  avaliador: string;
  ciclo: string;
  tipo: "360° Completa" | "Liderança Direta (180°)" | "Autoavaliação" | "Feedback Contínuo";
  dataAvaliacao: string;
  status: "Concluído" | "PDI em Andamento" | "Em Validação";
  classificacao9Box: "Talento Chave" | "Forte Desempenho" | "Profissional Sólido" | "Em Desenvolvimento";
  notas: {
    humanizacao: number;
    protocolos: number;
    comunicacao: number;
    pontualidade: number;
    resolucao: number;
  };
  mediaGeral: number;
  pontosFortes: string;
  pontosMelhoria: string;
  planoPDI: string;
}

const INITIAL_EVALUATIONS: EvaluationRecord[] = [
  {
    id: "eval-01",
    colaborador: "Dr. Felipe Azevedo",
    cargo: "Diretor Clínico & Cirurgião Geral",
    departamento: "Diretoria Médica",
    avaliador: "Comitê Executivo / Diretoria Geral",
    ciclo: "2º Semestre / 2026",
    tipo: "360° Completa",
    dataAvaliacao: "2026-10-05",
    status: "Concluído",
    classificacao9Box: "Talento Chave",
    notas: {
      humanizacao: 5.0,
      protocolos: 5.0,
      comunicacao: 4.8,
      pontualidade: 4.7,
      resolucao: 5.0
    },
    mediaGeral: 4.9,
    pontosFortes: "Liderança inspiradora com o corpo clínico, domínio absoluto de protocolos cirúrgicos e excelente relação médico-paciente.",
    pontosMelhoria: "Delegação de processos administrativos secundários para focar em governança estratégica.",
    planoPDI: "Conduzir o programa de mentoring para novos médicos residentes e supervisão do novo bloco cirúrgico."
  },
  {
    id: "eval-02",
    colaborador: "Mariana Santos",
    cargo: "Enfermeira Chefe da UTI",
    departamento: "Enfermagem Assistencial",
    avaliador: "Dr. Felipe Azevedo",
    ciclo: "2º Semestre / 2026",
    tipo: "360° Completa",
    dataAvaliacao: "2026-10-02",
    status: "Concluído",
    classificacao9Box: "Talento Chave",
    notas: {
      humanizacao: 5.0,
      protocolos: 4.9,
      comunicacao: 4.7,
      pontualidade: 4.9,
      resolucao: 4.8
    },
    mediaGeral: 4.86,
    pontosFortes: "Gestão impecável da equipe de plantão, zero registros de não conformidade no checklist de segurança do paciente.",
    pontosMelhoria: "Estimular maior automação do registro de passagem de plantão pelo módulo digital.",
    planoPDI: "Especialização executiva em Gestão de Serviços de Terapia Intensiva e Qualidade Hospitalar ONA."
  },
  {
    id: "eval-03",
    colaborador: "Dra. Beatriz Albuquerque",
    cargo: "Cardiologista & Ecocardiografia",
    departamento: "Corpo Clínico",
    avaliador: "Dr. Felipe Azevedo",
    ciclo: "2º Semestre / 2026",
    tipo: "360° Completa",
    dataAvaliacao: "2026-09-28",
    status: "Concluído",
    classificacao9Box: "Forte Desempenho",
    notas: {
      humanizacao: 4.9,
      protocolos: 4.8,
      comunicacao: 4.5,
      pontualidade: 4.4,
      resolucao: 4.7
    },
    mediaGeral: 4.66,
    pontosFortes: "Precisão diagnóstica excepcional e alta satisfação aferida no NPS dos pacientes ambulatoriais.",
    pontosMelhoria: "Ajuste fino no tempo médio de consulta nos horários de pico para evitar atrasos na recepção.",
    planoPDI: "Implantação do protocolo rápido de telelaudo de eletrocardiograma integrado ao PACS."
  },
  {
    id: "eval-04",
    colaborador: "Carlos Eduardo Mendes",
    cargo: "Recepcionista Líder",
    departamento: "Atendimento & Recepção",
    avaliador: "Amanda Cristina Rocha",
    ciclo: "2º Semestre / 2026",
    tipo: "Liderança Direta (180°)",
    dataAvaliacao: "2026-09-20",
    status: "PDI em Andamento",
    classificacao9Box: "Profissional Sólido",
    notas: {
      humanizacao: 4.7,
      protocolos: 4.4,
      comunicacao: 4.6,
      pontualidade: 4.8,
      resolucao: 4.2
    },
    mediaGeral: 4.54,
    pontosFortes: "Gentileza ímpar no acolhimento de pacientes idosos e agilidade na conferência de guias TISS.",
    pontosMelhoria: "Reduzir o tempo de espera no totem durante a troca de turnos matinais.",
    planoPDI: "Treinamento em desescalada de conflitos e domínio avançado do módulo de autorização de convênios."
  },
  {
    id: "eval-05",
    colaborador: "Lucas Andrade",
    cargo: "Técnico de Enfermagem",
    departamento: "Enfermagem Assistencial",
    avaliador: "Mariana Santos",
    ciclo: "2º Semestre / 2026",
    tipo: "Liderança Direta (180°)",
    dataAvaliacao: "2026-09-18",
    status: "Concluído",
    classificacao9Box: "Forte Desempenho",
    notas: {
      humanizacao: 4.8,
      protocolos: 4.7,
      comunicacao: 4.5,
      pontualidade: 4.9,
      resolucao: 4.6
    },
    mediaGeral: 4.7,
    pontosFortes: "Cumprimento rigoroso da checagem beira de leito e pontualidade exemplar nos plantões noturnos.",
    pontosMelhoria: "Participação mais ativa nos treinamentos de suporte a emergências pediátricas.",
    planoPDI: "Inscrição no curso de aperfeiçoamento em Acessos Vasculares Guiados por Ultrassom."
  }
];

export default function DesempenhoPage() {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(INITIAL_EVALUATIONS);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvalDetail, setSelectedEvalDetail] = useState<EvaluationRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State para Nova Avaliação
  const [form, setForm] = useState({
    colaborador: "",
    cargo: "",
    departamento: "Corpo Clínico",
    avaliador: "Coordenação & Diretoria Clínica",
    ciclo: "2º Semestre / 2026",
    tipo: "360° Completa" as EvaluationRecord["tipo"],
    classificacao9Box: "Talento Chave" as EvaluationRecord["classificacao9Box"],
    status: "Concluído" as EvaluationRecord["status"],
    humanizacao: 5,
    protocolos: 5,
    comunicacao: 5,
    pontualidade: 5,
    resolucao: 5,
    pontosFortes: "",
    pontosMelhoria: "",
    planoPDI: ""
  });

  // Cálculo da nota média em tempo real no form
  const computedMedia = useMemo(() => {
    const sum = Number(form.humanizacao) + Number(form.protocolos) + Number(form.comunicacao) + Number(form.pontualidade) + Number(form.resolucao);
    return Number((sum / 5).toFixed(2));
  }, [form.humanizacao, form.protocolos, form.comunicacao, form.pontualidade, form.resolucao]);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.colaborador.trim()) return;

    const newEvaluation: EvaluationRecord = {
      id: `eval-${Date.now()}`,
      colaborador: form.colaborador,
      cargo: form.cargo || "Profissional de Saúde",
      departamento: form.departamento,
      avaliador: form.avaliador,
      ciclo: form.ciclo,
      tipo: form.tipo,
      dataAvaliacao: new Date().toISOString().split("T")[0],
      status: form.status,
      classificacao9Box: form.classificacao9Box,
      notas: {
        humanizacao: Number(form.humanizacao),
        protocolos: Number(form.protocolos),
        comunicacao: Number(form.comunicacao),
        pontualidade: Number(form.pontualidade),
        resolucao: Number(form.resolucao)
      },
      mediaGeral: computedMedia,
      pontosFortes: form.pontosFortes || "Demonstrou excelente engajamento e compromisso assistencial.",
      pontosMelhoria: form.pontosMelhoria || "Manter evolução contínua nos indicadores do setor.",
      planoPDI: form.planoPDI || "Acompanhamento trimestral com a liderança imediata."
    };

    setEvaluations([newEvaluation, ...evaluations]);
    setShowModal(false);
    setToastMessage(`Avaliação de ${form.colaborador} registrada com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Reseta form
    setForm({
      colaborador: "",
      cargo: "",
      departamento: "Corpo Clínico",
      avaliador: "Coordenação & Diretoria Clínica",
      ciclo: "2º Semestre / 2026",
      tipo: "360° Completa",
      classificacao9Box: "Talento Chave",
      status: "Concluído",
      humanizacao: 5,
      protocolos: 5,
      comunicacao: 5,
      pontualidade: 5,
      resolucao: 5,
      pontosFortes: "",
      pontosMelhoria: "",
      planoPDI: ""
    });
  };

  const handleDelete = (id: string) => {
    setEvaluations(prev => prev.filter(e => e.id !== id));
    if (selectedEvalDetail?.id === id) setSelectedEvalDetail(null);
    setToastMessage("Avaliação removida do histórico.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtragem
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(item => {
      const matchesSearch = 
        item.colaborador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.avaliador.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter !== "TODOS" && item.status !== statusFilter) return false;
      return true;
    });
  }, [evaluations, searchTerm, statusFilter]);

  // Estatísticas Dinâmicas
  const stats = useMemo(() => {
    const total = evaluations.length;
    const mediaGeralTotal = total > 0 
      ? (evaluations.reduce((acc, curr) => acc + curr.mediaGeral, 0) / total).toFixed(2) 
      : "5.0";
    const pdiAtivos = evaluations.filter(e => e.planoPDI && e.planoPDI.length > 5).length;
    return {
      total,
      mediaGeral: mediaGeralTotal,
      pdiAtivos,
      concluidos: evaluations.filter(e => e.status === "Concluído").length
    };
  }, [evaluations]);

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

      {/* Action Bar Superior Compacta - 100% da Largura */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
              <Target size={14} className="text-rd-cyan" />
              Ciclo 360° Hospitalar
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            Ciclo Vigente: 2º Semestre / 2026
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            {stats.concluidos} Concluídas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} /> Nova Avaliação
          </button>
        </div>
      </div>

      {/* Cards de Métricas em Largura Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-rd-cyan/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Avaliados no Ciclo</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.total} Avaliações</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Autoavaliação, avaliação da liderança e pares 360°.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Star size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Índice Médio Geral</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.mediaGeral} / 5.0</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Média calculada sobre todas as competências assistenciais.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Planos PDI Ativos</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.pdiAtivos} Planos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Metas pactuadas para desenvolvimento e novas lideranças.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Adesão aos Protocolos</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">98.2%</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Conformidade com PEP, segurança e acreditação ONA.</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm w-full">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por colaborador avaliado, cargo, departamento ou avaliador..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Concluído">Concluído</option>
            <option value="PDI em Andamento">PDI em Andamento</option>
            <option value="Em Validação">Em Validação</option>
          </select>
        </div>
      </div>

      {/* Tabela de Avaliações em 100% da Largura */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart3 size={16} className="text-rd-cyan" />
            Quadro de Avaliações Registradas ({filteredEvaluations.length})
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Clique em &ldquo;Detalhes&rdquo; para ver notas individuais e PDI
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Colaborador / Função</th>
                <th className="p-4 font-bold">Ciclo & Modalidade</th>
                <th className="p-4 font-bold">Média de Desempenho</th>
                <th className="p-4 font-bold">Matriz 9-Box</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    <Target size={36} className="mx-auto mb-2 text-zinc-400 opacity-60" />
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">Nenhuma avaliação encontrada</p>
                    <p className="text-xs text-zinc-400 mt-1">Clique em &ldquo;Nova Avaliação&rdquo; para iniciar uma avaliação de desempenho.</p>
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan font-bold text-xs border border-rd-cyan/20 shrink-0">
                          {item.colaborador.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                            {item.colaborador}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {item.cargo} • <span className="text-zinc-400">{item.departamento}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {item.ciclo}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {item.tipo} • Avaliador: {item.avaliador}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                          {item.mediaGeral.toFixed(1)}
                        </span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={12} 
                              className={star <= Math.round(item.mediaGeral) ? "fill-amber-400" : "text-zinc-300 dark:text-zinc-700"} 
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.classificacao9Box === "Talento Chave" 
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          : item.classificacao9Box === "Forte Desempenho"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                      }`}>
                        <Sparkles size={11} /> {item.classificacao9Box}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.status === "Concluído"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : item.status === "PDI em Andamento"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEvalDetail(item)}
                          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-rd-cyan hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                        >
                          <Eye size={13} /> Detalhes
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Excluir Avaliação"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriz 9-Box e Competências Globais em Largura Total */}
      <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/85 backdrop-blur-xl rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-md w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Award className="text-rd-cyan" size={20} />
              Competências Clínicas Institucionais
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
              Mapeamento de desempenho médio de todas as equipes ativas nas 5 dimensões estratégicas.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full border border-zinc-200 dark:border-zinc-700">
            Acreditação ONA Nível 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 w-full text-left">
          {[
            { comp: "Acolhimento & Humanização", score: "4.9 / 5.0", pct: 98, badge: "Supera Expectativas" },
            { comp: "Protocolos Clínicos e PEP", score: "4.8 / 5.0", pct: 96, badge: "Supera Expectativas" },
            { comp: "Comunicação Interdisciplinar", score: "4.6 / 5.0", pct: 92, badge: "Atende Plenamente" },
            { comp: "Pontualidade & Escalas", score: "4.7 / 5.0", pct: 94, badge: "Supera Expectativas" },
            { comp: "Resolução em Intercorrências", score: "4.7 / 5.0", pct: 94, badge: "Supera Expectativas" }
          ].map((item) => (
            <div key={item.comp} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.comp}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-extrabold text-rd-cyan">{item.score}</span>
                  <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{item.badge}</span>
                </div>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-rd-cyan h-full rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: NOVA AVALIAÇÃO DE DESEMPENHO (100% FUNCIONAL E CLEAN WHITE NO TEMA CLARO) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 relative">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Ciclo de Avaliação 2026
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Registrar Nova Avaliação de Desempenho
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Atribua notas às 5 competências institucionais, elabore o parecer e defina o Plano de Desenvolvimento (PDI).
                </p>
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="space-y-5">
              
              {/* Linha 1: Colaborador e Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Nome do Colaborador Avaliado *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Dra. Mariana Costa"
                    value={form.colaborador}
                    onChange={e => setForm({...form, colaborador: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Cargo / Especialidade *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Cardiologista / Enfermeiro Chefe"
                    value={form.cargo}
                    onChange={e => setForm({...form, cargo: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Linha 2: Departamento, Avaliador e Modalidade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Departamento
                  </label>
                  <select
                    value={form.departamento}
                    onChange={e => setForm({...form, departamento: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Corpo Clínico">Corpo Clínico</option>
                    <option value="Enfermagem Assistencial">Enfermagem</option>
                    <option value="Diretoria Médica">Diretoria Médica</option>
                    <option value="Atendimento & Recepção">Recepção</option>
                    <option value="Faturamento & Convênios">Faturamento</option>
                    <option value="Patrimônio & Farmácia">Patrimônio / CAF</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Modalidade
                  </label>
                  <select
                    value={form.tipo}
                    onChange={e => setForm({...form, tipo: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="360° Completa">360° Completa</option>
                    <option value="Liderança Direta (180°)">Liderança (180°)</option>
                    <option value="Autoavaliação">Autoavaliação</option>
                    <option value="Feedback Contínuo">Feedback Contínuo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Matriz 9-Box
                  </label>
                  <select
                    value={form.classificacao9Box}
                    onChange={e => setForm({...form, classificacao9Box: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Talento Chave">Talento Chave (Alto Pot./Alto Des.)</option>
                    <option value="Forte Desempenho">Forte Desempenho</option>
                    <option value="Profissional Sólido">Profissional Sólido</option>
                    <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                  </select>
                </div>
              </div>

              {/* Seção de Notas: 5 Competências */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                    Avaliação das 5 Competências (Notas de 1.0 a 5.0)
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-rd-cyan/20 border border-rd-cyan/30 rounded-xl">
                    <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Média Calculada:</span>
                    <span className="text-sm font-extrabold text-rd-cyan">{computedMedia.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">1. Acolhimento & Humanização:</span>
                      <span className="font-bold text-rd-cyan">{form.humanizacao}</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" step="0.5" 
                      value={form.humanizacao} 
                      onChange={e => setForm({...form, humanizacao: Number(e.target.value)})}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">2. Protocolos Clínicos & PEP:</span>
                      <span className="font-bold text-rd-cyan">{form.protocolos}</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" step="0.5" 
                      value={form.protocolos} 
                      onChange={e => setForm({...form, protocolos: Number(e.target.value)})}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">3. Comunicação Interdisciplinar:</span>
                      <span className="font-bold text-rd-cyan">{form.comunicacao}</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" step="0.5" 
                      value={form.comunicacao} 
                      onChange={e => setForm({...form, comunicacao: Number(e.target.value)})}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">4. Pontualidade & Cumprimento de Escalas:</span>
                      <span className="font-bold text-rd-cyan">{form.pontualidade}</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" step="0.5" 
                      value={form.pontualidade} 
                      onChange={e => setForm({...form, pontualidade: Number(e.target.value)})}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">5. Resolução em Intercorrências Clínicas:</span>
                      <span className="font-bold text-rd-cyan">{form.resolucao}</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" step="0.5" 
                      value={form.resolucao} 
                      onChange={e => setForm({...form, resolucao: Number(e.target.value)})}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Linha 3: Feedback Descritivo e PDI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Pontos Fortes & Evidências
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Excelente relação com equipe e pacientes, precisão no registro de prontuário..."
                    value={form.pontosFortes}
                    onChange={e => setForm({...form, pontosFortes: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Oportunidades de Melhoria & PDI
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Treinamento em auditoria de enfermagem, capacitação em suporte avançado de vida..."
                    value={form.planoPDI}
                    onChange={e => setForm({...form, planoPDI: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              {/* Rodapé Modal */}
              <div className="flex items-center gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={16} /> Concluir & Registrar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DA AVALIAÇÃO SELECIONADA */}
      {selectedEvalDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rd-cyan">
                  Parecer Completo de Avaliação
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {selectedEvalDetail.colaborador}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedEvalDetail.cargo} • {selectedEvalDetail.departamento}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEvalDetail(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Média e 9-Box */}
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase">Média Geral Aferida</p>
                <p className="text-2xl font-black text-rd-cyan">{selectedEvalDetail.mediaGeral.toFixed(2)} / 5.0</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {selectedEvalDetail.classificacao9Box}
                </span>
                <p className="text-[11px] text-zinc-400 mt-1">Data: {selectedEvalDetail.dataAvaliacao}</p>
              </div>
            </div>

            {/* Desdobramento de Notas */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-[11px]">
                Competências Avaliadas
              </h4>
              <div className="space-y-1.5">
                {[
                  { label: "Acolhimento & Humanização", score: selectedEvalDetail.notas.humanizacao },
                  { label: "Protocolos Clínicos & PEP", score: selectedEvalDetail.notas.protocolos },
                  { label: "Comunicação Interdisciplinar", score: selectedEvalDetail.notas.comunicacao },
                  { label: "Pontualidade & Escalas", score: selectedEvalDetail.notas.pontualidade },
                  { label: "Resolução em Intercorrências", score: selectedEvalDetail.notas.resolucao }
                ].map((c) => (
                  <div key={c.label} className="flex items-center justify-between p-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/30">
                    <span className="text-zinc-700 dark:text-zinc-300">{c.label}</span>
                    <span className="font-bold text-rd-cyan">{c.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parecer Liderança */}
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Pontos Fortes da Liderança</p>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{selectedEvalDetail.pontosFortes}</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">Plano de Desenvolvimento Individual (PDI)</p>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{selectedEvalDetail.planoPDI}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvalDetail(null)}
              className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
