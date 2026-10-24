"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Plus, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Pencil, 
  Trash2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Play, 
  Building, 
  UserCheck,
  PlayCircle,
  ExternalLink,
  HeartPulse
} from "lucide-react";

export interface TrainingCourse {
  id: string;
  titulo: string;
  categoria: "Segurança NR-32" | "Assistência & Enfermagem" | "Diretrizes Médicas & PEP" | "LGPD & Compliance" | "Atendimento & Humanização";
  cargaHoraria: string;
  modalidade: "Online / EAD" | "Presencial / Simulação" | "Híbrido";
  setorAlvo: string;
  instrutor: string;
  validadeReciclagem: "Anual (Obrigatório)" | "Bienal" | "Semestral" | "Livre / Contínuo";
  status: "Ativo" | "Em Planejamento" | "Reciclagem Obrigatória" | "Concluído";
  totalInscritos: number;
  concluidos: number;
  taxaAdesao: number; // Porcentagem
  dataInicio: string;
  descricao: string;
}

const INITIAL_TRAININGS: TrainingCourse[] = [
  {
    id: "trn-nr32",
    titulo: "NR-32: Segurança em Serviços de Saúde & Riscos Biológicos",
    categoria: "Segurança NR-32",
    cargaHoraria: "8 horas",
    modalidade: "Híbrido",
    setorAlvo: "Corpo Clínico & Enfermagem",
    instrutor: "Dra. Camila Vasconcellos (Infectologia)",
    validadeReciclagem: "Anual (Obrigatório)",
    status: "Ativo",
    totalInscritos: 48,
    concluidos: 42,
    taxaAdesao: 88,
    dataInicio: "2026-01-15",
    descricao: "Prevenção de acidentes com perfurocortantes, uso correto de EPIs, descarte de resíduos infectantes e condutas em exposição biológica."
  },
  {
    id: "trn-sepse",
    titulo: "Protocolo Clínico de Sepse & Reconhecimento Precoce",
    categoria: "Diretrizes Médicas & PEP",
    cargaHoraria: "6 horas",
    modalidade: "Online / EAD",
    setorAlvo: "Médicos & Pronto Atendimento",
    instrutor: "Dr. Roberto Mendonça (Terapia Intensiva)",
    validadeReciclagem: "Anual (Obrigatório)",
    status: "Ativo",
    totalInscritos: 35,
    concluidos: 31,
    taxaAdesao: 89,
    dataInicio: "2026-02-10",
    descricao: "Identificação rápida de disfunção orgânica, escore qSOFA, coleta de hemoculturas e início precoce de antibioticoterapia na primeira hora (Golden Hour)."
  },
  {
    id: "trn-lgpd",
    titulo: "LGPD na Saúde: Segurança de Prontuários e Sigilo CFM",
    categoria: "LGPD & Compliance",
    cargaHoraria: "4 horas",
    modalidade: "Online / EAD",
    setorAlvo: "Recepção, TI & Médicos",
    instrutor: "Dra. Larissa Toledo (Direito Médico)",
    validadeReciclagem: "Bienal",
    status: "Ativo",
    totalInscritos: 62,
    concluidos: 58,
    taxaAdesao: 94,
    dataInicio: "2026-03-01",
    descricao: "Boas práticas de proteção de dados sensíveis de pacientes, compartilhamento de laudos, consentimento livre e esclarecido e blindagem contra vazamentos."
  },
  {
    id: "trn-bls",
    titulo: "BLS: Suporte Básico de Vida & Desfibrilação com DEA",
    categoria: "Assistência & Enfermagem",
    cargaHoraria: "8 horas",
    modalidade: "Presencial / Simulação",
    setorAlvo: "Toda a Equipe Assistencial",
    instrutor: "Enf. Marcos Vinicius (Urgência & Emergência)",
    validadeReciclagem: "Bienal",
    status: "Ativo",
    totalInscritos: 40,
    concluidos: 36,
    taxaAdesao: 90,
    dataInicio: "2026-04-12",
    descricao: "Manobras de ressuscitação cardiopulmonar (RCP) de alta qualidade em adultos e crianças, desobstrução de vias aéreas e operação prática de DEA."
  },
  {
    id: "trn-atendimento",
    titulo: "Atendimento Humanizado & Comunicação de Más Notícias (Spikes)",
    categoria: "Atendimento & Humanização",
    cargaHoraria: "4 horas",
    modalidade: "Híbrido",
    setorAlvo: "Recepção, Médicos & Psicologia",
    instrutor: "Dra. Helena Barreto (Psicologia Médica)",
    validadeReciclagem: "Livre / Contínuo",
    status: "Ativo",
    totalInscritos: 52,
    concluidos: 49,
    taxaAdesao: 94,
    dataInicio: "2026-05-05",
    descricao: "Técnicas de acolhimento na recepção, empatia assistencial, protocolo SPIKES para comunicação assertiva de notícias difíceis e redução de atritos."
  },
  {
    id: "trn-infeccao",
    titulo: "CCIH: Higiene das Mãos & Prevenção de Infecções Clínicas",
    categoria: "Segurança NR-32",
    cargaHoraria: "3 horas",
    modalidade: "Online / EAD",
    setorAlvo: "Multiprofissional",
    instrutor: "Coordenação CCIH MedCore",
    validadeReciclagem: "Semestral",
    status: "Ativo",
    totalInscritos: 75,
    concluidos: 70,
    taxaAdesao: 93,
    dataInicio: "2026-06-01",
    descricao: "Os 5 momentos para a higiene das mãos segundo a OMS, uso racional de antissépticos e controle de contaminação cruzada em consultórios e salas de exames."
  }
];

export default function TreinamentosPage() {
  const [trainings, setTrainings] = useState<TrainingCourse[]>(INITIAL_TRAININGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  
  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrainingDetail, setSelectedTrainingDetail] = useState<TrainingCourse | null>(null);
  const [classroomCourse, setClassroomCourse] = useState<TrainingCourse | null>(null);
  const [classroomTab, setClassroomTab] = useState<"AULA" | "APOSTILA" | "QUIZ" | "CERTIFICADO">("AULA");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form de Criação
  const [createForm, setCreateForm] = useState({
    titulo: "",
    categoria: "Segurança NR-32" as TrainingCourse["categoria"],
    cargaHoraria: "8 horas",
    modalidade: "Híbrido" as TrainingCourse["modalidade"],
    setorAlvo: "Hospitalar Geral",
    instrutor: "",
    validadeReciclagem: "Anual (Obrigatório)" as TrainingCourse["validadeReciclagem"],
    status: "Ativo" as TrainingCourse["status"],
    totalInscritos: 50,
    descricao: ""
  });

  // Form de Edição
  const [editForm, setEditForm] = useState({
    id: "",
    titulo: "",
    categoria: "Segurança NR-32" as TrainingCourse["categoria"],
    cargaHoraria: "",
    modalidade: "Híbrido" as TrainingCourse["modalidade"],
    setorAlvo: "",
    instrutor: "",
    validadeReciclagem: "Anual (Obrigatório)" as TrainingCourse["validadeReciclagem"],
    status: "Ativo" as TrainingCourse["status"],
    totalInscritos: 0,
    concluidos: 0,
    descricao: ""
  });

  // Criação
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.titulo.trim()) return;

    const newTraining: TrainingCourse = {
      id: `trn-${Date.now()}`,
      titulo: createForm.titulo,
      categoria: createForm.categoria,
      cargaHoraria: createForm.cargaHoraria || "4 horas",
      modalidade: createForm.modalidade,
      setorAlvo: createForm.setorAlvo || "Geral",
      instrutor: createForm.instrutor || "Coordenação Médica",
      validadeReciclagem: createForm.validadeReciclagem,
      status: createForm.status,
      totalInscritos: Number(createForm.totalInscritos) || 30,
      concluidos: 0,
      taxaAdesao: 0,
      dataInicio: new Date().toISOString().split("T")[0],
      descricao: createForm.descricao || "Capacitação clínica institucional para aperfeiçoamento contínuo."
    };

    setTrainings([newTraining, ...trainings]);
    setShowCreateModal(false);
    setToastMessage(`Treinamento "${newTraining.titulo}" cadastrado com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Reseta form
    setCreateForm({
      titulo: "",
      categoria: "Segurança NR-32",
      cargaHoraria: "8 horas",
      modalidade: "Híbrido",
      setorAlvo: "Hospitalar Geral",
      instrutor: "",
      validadeReciclagem: "Anual (Obrigatório)",
      status: "Ativo",
      totalInscritos: 50,
      descricao: ""
    });
  };

  // Abre Modal de Edição
  const handleOpenEdit = (course: TrainingCourse) => {
    setEditForm({
      id: course.id,
      titulo: course.titulo,
      categoria: course.categoria,
      cargaHoraria: course.cargaHoraria,
      modalidade: course.modalidade,
      setorAlvo: course.setorAlvo,
      instrutor: course.instrutor,
      validadeReciclagem: course.validadeReciclagem,
      status: course.status,
      totalInscritos: course.totalInscritos,
      concluidos: course.concluidos,
      descricao: course.descricao
    });
    setShowEditModal(true);
  };

  // Salva Edição
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const concluidosNum = Number(editForm.concluidos) || 0;
    const inscritosNum = Math.max(Number(editForm.totalInscritos) || 1, concluidosNum);
    const taxaCalc = Math.round((concluidosNum / inscritosNum) * 100);

    setTrainings(prev => prev.map(item => {
      if (item.id === editForm.id) {
        return {
          ...item,
          titulo: editForm.titulo,
          categoria: editForm.categoria,
          cargaHoraria: editForm.cargaHoraria,
          modalidade: editForm.modalidade,
          setorAlvo: editForm.setorAlvo,
          instrutor: editForm.instrutor,
          validadeReciclagem: editForm.validadeReciclagem,
          status: editForm.status,
          totalInscritos: inscritosNum,
          concluidos: concluidosNum,
          taxaAdesao: taxaCalc,
          descricao: editForm.descricao
        };
      }
      return item;
    }));

    setShowEditModal(false);
    setToastMessage(`Treinamento atualizado com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Excluir
  const handleDelete = (id: string) => {
    setTrainings(prev => prev.filter(t => t.id !== id));
    setDeleteConfirmId(null);
    if (selectedTrainingDetail?.id === id) setSelectedTrainingDetail(null);
    setToastMessage("Treinamento removido do programa de capacitação.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtragem
  const filteredTrainings = useMemo(() => {
    return trainings.filter(t => {
      const matchesSearch = 
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.instrutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.setorAlvo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categoria.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (categoryFilter !== "TODOS" && t.categoria !== categoryFilter) return false;
      if (statusFilter !== "TODOS" && t.status !== statusFilter) return false;
      return true;
    });
  }, [trainings, searchTerm, categoryFilter, statusFilter]);

  // Estatísticas Dinâmicas
  const stats = useMemo(() => {
    const totalModulos = trainings.length;
    const totalCertificados = trainings.reduce((acc, curr) => acc + curr.concluidos, 0);
    const totalInscritos = trainings.reduce((acc, curr) => acc + curr.totalInscritos, 0);
    const mediaAdesao = totalInscritos > 0 ? Math.round((totalCertificados / totalInscritos) * 100) : 95;
    return {
      totalModulos,
      totalCertificados,
      mediaAdesao,
      ativos: trainings.filter(t => t.status === "Ativo").length
    };
  }, [trainings]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20 pt-1">
      
      {/* Toast de Feedback */}
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
              <GraduationCap size={14} className="text-rd-cyan" />
              Programa Educacional
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            Conformidade NR-32 & ONA 3
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            {stats.mediaAdesao}% de Adesão Geral
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} /> Novo Treinamento
          </button>
        </div>
      </div>

      {/* Cards de Métricas em Largura Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-rd-cyan/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cursos Cadastrados</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.totalModulos} Módulos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{stats.ativos} módulos em andamento e reciclagem.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Certificados Válidos</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.totalCertificados} Concluídos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Validação em prontuário de RH e acreditação.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Índice de Adesão</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats.mediaAdesao}%</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Engajamento ativo dos colaboradores nas reciclagens.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Carga Horária Média</p>
              <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-white">6.2h / Mês</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Educação continuada integrada ao ponto digital.</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/85 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm w-full">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar treinamento por título, instrutor, setor alvo ou categoria..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
          >
            <option value="TODOS">Todas as Categorias</option>
            <option value="Segurança NR-32">Segurança NR-32</option>
            <option value="Assistência & Enfermagem">Assistência & Enfermagem</option>
            <option value="Diretrizes Médicas & PEP">Diretrizes Médicas & PEP</option>
            <option value="LGPD & Compliance">LGPD & Compliance</option>
            <option value="Atendimento & Humanização">Atendimento & Humanização</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Em Planejamento">Em Planejamento</option>
            <option value="Reciclagem Obrigatória">Reciclagem Obrigatória</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>
      </div>

      {/* Tabela de Treinamentos em 100% da Largura */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen size={16} className="text-rd-cyan" />
            Matriz de Treinamentos Cadastrados ({filteredTrainings.length})
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Acompanhe o cumprimento das metas educacionais e NR-32
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Treinamento / Categoria</th>
                <th className="p-4 font-bold">Instrutor & Setor</th>
                <th className="p-4 font-bold">Carga & Modalidade</th>
                <th className="p-4 font-bold">Adesão & Certificados</th>
                <th className="p-4 font-bold">Validade / Status</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    <GraduationCap size={36} className="mx-auto mb-2 text-zinc-400 opacity-60" />
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">Nenhum treinamento encontrado</p>
                    <p className="text-xs text-zinc-400 mt-1">Clique em &ldquo;Novo Treinamento&rdquo; para criar um módulo de capacitação.</p>
                  </td>
                </tr>
              ) : (
                filteredTrainings.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan font-bold text-xs border border-rd-cyan/20 shrink-0">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                            {item.titulo}
                          </p>
                          <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 inline-block mt-1">
                            {item.categoria}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {item.instrutor}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Building size={11} /> {item.setorAlvo}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                          <Clock size={12} className="text-zinc-400" /> {item.cargaHoraria}
                        </p>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.modalidade}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="w-40">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.concluidos} / {item.totalInscritos}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.taxaAdesao}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${item.taxaAdesao}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.status === "Ativo" 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : item.status === "Reciclagem Obrigatória"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }`}>
                          {item.status}
                        </span>
                        <p className="text-[10px] text-zinc-400">
                          {item.validadeReciclagem}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDelete(item.id)}
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
                              setClassroomCourse(item);
                              setClassroomTab("AULA");
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                            }}
                            className="p-1.5 text-zinc-500 hover:text-emerald-500 rounded-lg hover:bg-emerald-500/10 transition-colors"
                            title="Assistir Aula & Fazer Avaliação"
                          >
                            <PlayCircle size={15} />
                          </button>
                          <button
                            onClick={() => setSelectedTrainingDetail(item)}
                            className="p-1.5 text-zinc-500 hover:text-rd-cyan rounded-lg hover:bg-rd-cyan/10 transition-colors"
                            title="Visualizar Treinamento"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-zinc-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                            title="Editar Treinamento"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Excluir Treinamento"
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

      {/* MODAL 1: NOVO TREINAMENTO (100% FUNCIONAL E CLEAN WHITE NO LIGHT MODE) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    LMS Hospitalar & Educação Continuada
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Cadastrar Novo Treinamento
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Estruture um curso para capacitação de equipes assistenciais, técnicas ou administrativas.
                </p>
              </div>

              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Título do Treinamento / Módulo *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Treinamento NR-32: Manuseio de Quimioterápicos"
                  value={createForm.titulo}
                  onChange={e => setCreateForm({...createForm, titulo: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Categoria do Curso *
                  </label>
                  <select
                    value={createForm.categoria}
                    onChange={e => setCreateForm({...createForm, categoria: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Segurança NR-32">Segurança NR-32</option>
                    <option value="Assistência & Enfermagem">Assistência & Enfermagem</option>
                    <option value="Diretrizes Médicas & PEP">Diretrizes Médicas & PEP</option>
                    <option value="LGPD & Compliance">LGPD & Compliance</option>
                    <option value="Atendimento & Humanização">Atendimento & Humanização</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Modalidade *
                  </label>
                  <select
                    value={createForm.modalidade}
                    onChange={e => setCreateForm({...createForm, modalidade: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Híbrido">Híbrido (EAD + Prática)</option>
                    <option value="Presencial / Simulação">Presencial / Simulação Realística</option>
                    <option value="Online / EAD">Online / EAD Assíncrono</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Carga Horária
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 8 horas"
                    value={createForm.cargaHoraria}
                    onChange={e => setCreateForm({...createForm, cargaHoraria: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Setor / Público Alvo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: UTI Adulto / Geral"
                    value={createForm.setorAlvo}
                    onChange={e => setCreateForm({...createForm, setorAlvo: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Meta de Inscritos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.totalInscritos}
                    onChange={e => setCreateForm({...createForm, totalInscritos: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Instrutor Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Mariana Costa (CRM 12345)"
                    value={createForm.instrutor}
                    onChange={e => setCreateForm({...createForm, instrutor: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Reciclagem / Validade
                  </label>
                  <select
                    value={createForm.validadeReciclagem}
                    onChange={e => setCreateForm({...createForm, validadeReciclagem: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Anual (Obrigatório)">Anual (Obrigatório)</option>
                    <option value="Bienal">Bienal (A cada 2 anos)</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Livre / Contínuo">Livre / Contínuo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Ementa e Objetivos do Módulo
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva o conteúdo programático, requisitos e critérios de aprovação..."
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
                  <Plus size={16} /> Criar Treinamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR TREINAMENTO (100% FUNCIONAL) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <Pencil size={15} className="text-rd-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Edição do Curso
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  Editar {editForm.titulo}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Atualize metas de inscritos, concluintes, instrutores e critérios de reciclagem.
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
                  Título do Treinamento *
                </label>
                <input
                  required
                  type="text"
                  value={editForm.titulo}
                  onChange={e => setEditForm({...editForm, titulo: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Categoria
                  </label>
                  <select
                    value={editForm.categoria}
                    onChange={e => setEditForm({...editForm, categoria: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Segurança NR-32">Segurança NR-32</option>
                    <option value="Assistência & Enfermagem">Assistência & Enfermagem</option>
                    <option value="Diretrizes Médicas & PEP">Diretrizes Médicas & PEP</option>
                    <option value="LGPD & Compliance">LGPD & Compliance</option>
                    <option value="Atendimento & Humanização">Atendimento & Humanização</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Status do Curso
                  </label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Em Planejamento">Em Planejamento</option>
                    <option value="Reciclagem Obrigatória">Reciclagem Obrigatória</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Total de Inscritos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.totalInscritos}
                    onChange={e => setEditForm({...editForm, totalInscritos: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Colaboradores Concluídos (Certificados)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.concluidos}
                    onChange={e => setEditForm({...editForm, concluidos: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Instrutor Responsável
                  </label>
                  <input
                    type="text"
                    value={editForm.instrutor}
                    onChange={e => setEditForm({...editForm, instrutor: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Carga Horária
                  </label>
                  <input
                    type="text"
                    value={editForm.cargaHoraria}
                    onChange={e => setEditForm({...editForm, cargaHoraria: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                  Descrição & Ementa
                </label>
                <textarea
                  rows={3}
                  value={editForm.descricao}
                  onChange={e => setEditForm({...editForm, descricao: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan focus:outline-none"
                />
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

      {/* MODAL 3: DETALHES DO TREINAMENTO SELECIONADO */}
      {selectedTrainingDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 relative">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rd-cyan">
                  Ficha do Módulo de Capacitação
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {selectedTrainingDetail.titulo}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedTrainingDetail.categoria} • Carga Horária: {selectedTrainingDetail.cargaHoraria}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTrainingDetail(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Informações Centrais */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Instrutor Responsável</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedTrainingDetail.instrutor}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Setor Alvo</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedTrainingDetail.setorAlvo}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Modalidade</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedTrainingDetail.modalidade}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Reciclagem</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedTrainingDetail.validadeReciclagem}</p>
              </div>
            </div>

            {/* Adesão */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Adesão & Certificação</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedTrainingDetail.taxaAdesao}% ({selectedTrainingDetail.concluidos}/{selectedTrainingDetail.totalInscritos})</span>
              </div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-900/60 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedTrainingDetail.taxaAdesao}%` }} />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h4 className="text-xs font-bold uppercase text-zinc-500 mb-1">Ementa e Diretrizes</h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {selectedTrainingDetail.descricao}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedTrainingDetail(null);
                  handleOpenEdit(selectedTrainingDetail);
                }}
                className="flex-1 py-2.5 bg-rd-cyan text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Pencil size={14} /> Editar Curso
              </button>
              <button
                onClick={() => setSelectedTrainingDetail(null)}
                className="py-2.5 px-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SALA DE AULA DO ALUNO (LMS CORPORATIVO COM AULA, APOSTILA, QUIZ & CERTIFICADO) */}
      {classroomCourse && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Header da Sala de Aula */}
            <div className="p-4 sm:p-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rd-cyan/15 border border-rd-cyan/30 text-rd-cyan flex items-center justify-center shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30">
                      Universidade MedCore
                    </span>
                    <span className="text-xs text-zinc-400 font-medium hidden sm:inline">• {classroomCourse.cargaHoraria}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-extrabold text-white line-clamp-1 mt-0.5">
                    {classroomCourse.titulo}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setClassroomCourse(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Abas da Sala de Aula: Videoaula | Apostila Digital | Avaliação / Quiz | Certificado */}
            <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-4 sm:px-6 overflow-x-auto shrink-0">
              <button
                onClick={() => setClassroomTab("AULA")}
                className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  classroomTab === "AULA" 
                    ? "border-rd-cyan text-rd-cyan bg-rd-cyan/5" 
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Play size={14} /> Videoaula Interativa
              </button>

              <button
                onClick={() => setClassroomTab("APOSTILA")}
                className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  classroomTab === "APOSTILA" 
                    ? "border-rd-cyan text-rd-cyan bg-rd-cyan/5" 
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FileText size={14} /> Apostila & Protocolo
              </button>

              <button
                onClick={() => setClassroomTab("QUIZ")}
                className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  classroomTab === "QUIZ" 
                    ? "border-rd-cyan text-rd-cyan bg-rd-cyan/5" 
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <CheckCircle2 size={14} /> Avaliação (Quiz)
              </button>

              <button
                onClick={() => setClassroomTab("CERTIFICADO")}
                className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  classroomTab === "CERTIFICADO" 
                    ? "border-emerald-400 text-emerald-400 bg-emerald-500/5" 
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Award size={14} /> Certificado Oficial
              </button>
            </div>

            {/* Conteúdo Dinâmico por Aba */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              
              {/* ABA 1: VIDEOAULA INTERATIVA */}
              {classroomTab === "AULA" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="relative aspect-video w-full bg-zinc-900 rounded-3xl border-2 border-zinc-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
                    <div className="relative z-10 text-center space-y-3 p-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rd-cyan/20 border-2 border-rd-cyan/50 text-rd-cyan flex items-center justify-center mx-auto shadow-xl group-hover:scale-105 transition-transform cursor-pointer">
                        <Play size={32} className="ml-1 text-rd-cyan" />
                      </div>
                      <p className="text-sm sm:text-base font-bold text-white max-w-md">
                        Módulo 1: Diretrizes Fundamentais e Casos Práticos de Aplicação Clínica
                      </p>
                      <span className="text-xs text-zinc-400 block font-mono">
                        Instrutor: {classroomCourse.instrutor} • Duração: 45 min
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/80 px-4 py-2 rounded-xl backdrop-blur-md border border-zinc-800">
                      <span>Qualidade: 1080p Full HD</span>
                      <span className="text-emerald-400 font-semibold">Progresso: 85% Concluído</span>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-white">Próximo Passo:</p>
                      <p className="text-[11px] text-zinc-400">Consulte a apostila ou avance direto para a Avaliação com nota de corte mínima de 70%.</p>
                    </div>
                    <button
                      onClick={() => setClassroomTab("QUIZ")}
                      className="px-4 py-2 bg-rd-cyan text-zinc-950 font-bold text-xs rounded-xl hover:bg-rd-cyan/90 transition-all uppercase tracking-wider shrink-0"
                    >
                      Ir para Avaliação
                    </button>
                  </div>
                </div>
              )}

              {/* ABA 2: APOSTILA & PROTOCOLO */}
              {classroomTab === "APOSTILA" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Manual Institucional 2026</span>
                        <h4 className="text-lg font-bold text-white">{classroomCourse.titulo}</h4>
                      </div>
                      <button
                        onClick={() => {
                          setToastMessage("Download da apostila PDF iniciado.");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={13} /> Baixar PDF
                      </button>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                      <p className="font-semibold text-white">1. Objetivos da Capacitação Hospitalar:</p>
                      <p>{classroomCourse.descricao}</p>

                      <p className="font-semibold text-white pt-2">2. Procedimentos Operacionais Padrão (POP):</p>
                      <ul className="list-disc list-inside space-y-1 text-zinc-400">
                        <li>Higienização das mãos segundo os 5 momentos preconizados pela ANVISA/OMS.</li>
                        <li>Notificação compulsória em até 24 horas no sistema interno e Ministério da Saúde.</li>
                        <li>Registro circunstanciado em prontuário eletrônico certificado com assinatura ICP-Brasil.</li>
                        <li>Descarte exclusivo de resíduos infectantes e perfurocortantes em caixas rígidas Descarpax.</li>
                      </ul>

                      <p className="font-semibold text-white pt-2">3. Sanções e Auditorias:</p>
                      <p className="text-zinc-400">A reciclagem deste treinamento tem validade de {classroomCourse.validadeReciclagem}. A conformidade é monitorada automaticamente pelo comitê de controle de infecção hospitalar (CCIH).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: QUIZ / AVALIAÇÃO DE CONHECIMENTOS */}
              {classroomTab === "QUIZ" && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Nota de Corte: 70%</span>
                        <h4 className="text-lg font-bold text-white">Avaliação Técnica de Conhecimentos</h4>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono">3 Questões Objetivas</span>
                    </div>

                    {/* Questão 1 */}
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        1. Qual a frequência regulamentar obrigatória para reciclagem das capacitações da NR-32 e diretrizes críticas?
                      </p>
                      <div className="space-y-2 text-xs">
                        {["Apenas no momento da admissão do colaborador", "Anual ou sempre que houver alteração de processo de trabalho", "A cada 5 anos"].map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/80 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <input
                              type="radio"
                              name="q1"
                              checked={quizAnswers[1] === i}
                              onChange={() => setQuizAnswers({ ...quizAnswers, 1: i })}
                              className="text-rd-cyan focus:ring-0"
                            />
                            <span className="text-zinc-300">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Questão 2 */}
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        2. Em caso de acidente de trabalho com material perfurocortante biológico, qual a conduta imediata preconizada?
                      </p>
                      <div className="space-y-2 text-xs">
                        {["Lavar abundantemente com água e sabão e comunicar imediatamente a chefia e CCIH/SESMT", "Aguardar o final do plantão para preencher a CAT", "Aplicar álcool 70% com força até parar o sangramento"].map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/80 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <input
                              type="radio"
                              name="q2"
                              checked={quizAnswers[2] === i}
                              onChange={() => setQuizAnswers({ ...quizAnswers, 2: i })}
                              className="text-rd-cyan focus:ring-0"
                            />
                            <span className="text-zinc-300">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Questão 3 */}
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        3. A validação de certificados corporativos MedCore é garantida através de:
                      </p>
                      <div className="space-y-2 text-xs">
                        {["Apenas assinatura física manuscrita em papel timbrado", "Código criptográfico único verificado publicamente no portal /validar-certificado", "Carimbo simples sem número de registro"].map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/80 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <input
                              type="radio"
                              name="q3"
                              checked={quizAnswers[3] === i}
                              onChange={() => setQuizAnswers({ ...quizAnswers, 3: i })}
                              className="text-rd-cyan focus:ring-0"
                            />
                            <span className="text-zinc-300">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Resultado / Submissão */}
                    {quizSubmitted ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={24} className="text-emerald-400" />
                          <div>
                            <p className="text-xs font-bold text-white">Aprovado com Distinção! ({quizScore}%)</p>
                            <p className="text-[11px] text-zinc-400">Você superou a nota de corte. Seu certificado oficial foi liberado.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setClassroomTab("CERTIFICADO")}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase rounded-xl transition-all shadow-md shrink-0"
                        >
                          Visualizar Certificado
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const correct = (quizAnswers[1] === 1 ? 1 : 0) + (quizAnswers[2] === 0 ? 1 : 0) + (quizAnswers[3] === 1 ? 1 : 0);
                          const score = Math.round((correct / 3) * 100);
                          setQuizScore(score);
                          setQuizSubmitted(true);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-rd-cyan to-indigo-600 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rd-cyan/20 cursor-pointer"
                      >
                        Submeter Respostas & Avaliar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ABA 4: CERTIFICADO OFICIAL WHITE-LABEL COM LOGO DA CLÍNICA & ASSINATURA */}
              {classroomTab === "CERTIFICADO" && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Visualização de Impressão do Certificado */}
                  <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-10 border-4 border-double border-zinc-300 shadow-2xl relative overflow-hidden font-serif">
                    
                    {/* Borda Decorativa Dourada/Cyan */}
                    <div className="absolute inset-2 border-2 border-dashed border-amber-600/30 rounded-2xl pointer-events-none" />

                    {/* Cabeçalho do Certificado */}
                    <div className="flex items-center justify-between pb-6 border-b border-zinc-200 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xl shadow-md">
                          <HeartPulse size={26} className="text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-extrabold uppercase tracking-tight text-zinc-950">MedCore Health Care</h4>
                          <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest">Universidade Corporativa & Educação Médica Continuada</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Registro de Autenticidade</span>
                        <span className="text-xs font-mono font-bold text-indigo-700">MED-CERT-2026-9481</span>
                      </div>
                    </div>

                    {/* Título & Corpo */}
                    <div className="text-center py-8 space-y-4 relative z-10">
                      <span className="text-xs uppercase font-sans tracking-widest text-amber-700 font-bold">
                        Certificado de Conclusão e Habilitação
                      </span>
                      <h2 className="text-xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Certificamos com louvor que o profissional
                      </h2>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-900 underline decoration-cyan-500 decoration-2 underline-offset-4">
                        Dr. Felipe Azevedo — CRM-SP 124.890
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl mx-auto font-sans leading-relaxed">
                        concluiu com êxito a capacitação em <strong>{classroomCourse.titulo}</strong> com carga horária oficial de <strong>{classroomCourse.cargaHoraria}</strong>, obtendo aproveitamento satisfatório de 100% nas avaliações teóricas e práticas.
                      </p>
                    </div>

                    {/* Rodapé com Assinaturas & QR Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-200 relative z-10 font-sans text-xs">
                      <div>
                        <p className="text-[11px] text-zinc-500">Validação e Autenticidade Eletrônica:</p>
                        <p className="font-mono text-[10px] text-zinc-700 mt-0.5">
                          Hash SHA-256: 8a9f4c2e9102b371fc59b48f6c
                        </p>
                        <Link
                          href="/validar-certificado?codigo=MED-CERT-2026-9481"
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-900 mt-1"
                        >
                          <ExternalLink size={12} /> Consultar Autenticidade em /validar-certificado
                        </Link>
                      </div>

                      <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-200">
                        <div className="w-40 sm:ml-auto border-b border-zinc-800 pb-1 mb-1 font-serif italic text-zinc-800 text-sm">
                          Dr. Felipe Azevedo
                        </div>
                        <p className="font-bold text-zinc-900 text-xs">Dr. Felipe Azevedo</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Diretoria Médica • CRM-SP 124.890</p>
                      </div>
                    </div>
                  </div>

                  {/* Ações do Certificado */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-zinc-400">Certificado emitido e registrado no banco institucional.</span>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Download size={14} /> Imprimir / Salvar PDF
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
