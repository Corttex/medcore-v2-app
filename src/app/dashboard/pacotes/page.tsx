"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  AlertCircle,
  Play,
  X,
  MessageSquare,
  RefreshCw,
  Layers,
  Calendar,
  CreditCard,
  Flame,
  Phone,
  ShieldCheck,
  TrendingUp,
  Tag,
  Trash2,
  Check,
  ArrowUpRight,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

interface PacoteCatalogo {
  id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  qtdSessoes: number;
  unitId: string;
  _count?: { pacientes: number };
  createdAt: string;
}

interface PacienteData {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
}

interface VendaPacote {
  id: string;
  pacienteId: string;
  pacoteId: string;
  sessoesRealizadas: number;
  sessoesTotais: number;
  status: "ATIVO" | "CONCLUIDO" | "CANCELADO" | string;
  dataAquisicao: string;
  updatedAt: string;
  paciente: PacienteData;
  pacote: PacoteCatalogo;
}

interface StatsData {
  totalVendas: number;
  totalAtivos: number;
  totalConcluidos: number;
  totalCancelados: number;
  receitaTotal: number;
  sessoesExecutadas: number;
  sessoesRestantes: number;
  alertasRenovacao: number;
  taxaConclusao: number;
}

export default function PacotesDashboardPage() {
  const { selectedUnitId } = useDashboardContext();

  // Estados principais
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [catalogo, setCatalogo] = useState<PacoteCatalogo[]>([]);
  const [vendas, setVendas] = useState<VendaPacote[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalVendas: 0,
    totalAtivos: 0,
    totalConcluidos: 0,
    totalCancelados: 0,
    receitaTotal: 0,
    sessoesExecutadas: 0,
    sessoesRestantes: 0,
    alertasRenovacao: 0,
    taxaConclusao: 0,
  });

  // Lista de pacientes para seleção no modal de venda
  const [pacientesList, setPacientesList] = useState<PacienteData[]>([]);

  // Abas e Filtros
  const [activeTab, setActiveTab] = useState<"vendas" | "catalogo" | "crm">("vendas");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | "ATIVO" | "CONCLUIDO" | "CANCELADO">("TODOS");

  // Modais
  const [isVendaModalOpen, setIsVendaModalOpen] = useState(false);
  const [isCatalogoModalOpen, setIsCatalogoModalOpen] = useState(false);
  const [isSessaoModalOpen, setIsSessaoModalOpen] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<VendaPacote | null>(null);

  // Form states para Nova Venda
  const [vendaForm, setVendaForm] = useState({
    pacienteId: "",
    pacoteId: "",
    sessoesTotais: 1,
    formaPagamento: "CARTAO_CREDITO",
    parcelas: "1",
    desconto: 0,
    observacao: "",
  });

  // Form states para Novo Pacote no Catálogo
  const [catalogoForm, setCatalogoForm] = useState({
    nome: "",
    descricao: "",
    valor: "",
    qtdSessoes: "10",
  });

  // Form state para registro de sessão
  const [sessaoObs, setSessaoObs] = useState("");
  const [sessaoProfissional, setSessaoProfissional] = useState("Dr(a). Especialista Clínico");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Carregar dados de pacotes e pacientes
  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const url = selectedUnitId ? `/api/pacotes?unitId=${selectedUnitId}` : "/api/pacotes";
      const [resPacotes, resPacientes] = await Promise.all([
        fetch(url),
        fetch("/api/pacientes"),
      ]);

      const dataPacotes = await resPacotes.json();
      if (dataPacotes.success && dataPacotes.data) {
        setCatalogo(dataPacotes.data.catalogo || []);
        setVendas(dataPacotes.data.vendas || []);
        if (dataPacotes.data.stats) setStats(dataPacotes.data.stats);
      }

      if (resPacientes.ok) {
        const dataPacientes = await resPacientes.json();
        if (Array.isArray(dataPacientes)) {
          setPacientesList(dataPacientes);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados de pacotes:", err);
      showToast("Não foi possível carregar os dados de pacotes.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUnitId]);

  // Vendas filtradas por busca e status
  const vendasFiltradas = useMemo(() => {
    return vendas.filter((v) => {
      const matchSearch =
        v.paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pacote.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.paciente.telefone && v.paciente.telefone.includes(searchTerm));

      const matchStatus = statusFilter === "TODOS" || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vendas, searchTerm, statusFilter]);

  // Oportunidades de Renovação (CRM)
  const oportunidadesRenovacao = useMemo(() => {
    return vendas.filter((v) => {
      if (v.status !== "ATIVO") return false;
      const restantes = v.sessoesTotais - v.sessoesRealizadas;
      const percentual = v.sessoesRealizadas / v.sessoesTotais;
      return restantes <= 2 || percentual >= 0.75;
    });
  }, [vendas]);

  // Abrir modal de venda com pacote pré-selecionado vindo do catálogo
  const handleVenderPacoteCatalogo = (pacote: PacoteCatalogo) => {
    setVendaForm({
      pacienteId: pacientesList[0]?.id || "",
      pacoteId: pacote.id,
      sessoesTotais: pacote.qtdSessoes,
      formaPagamento: "CARTAO_CREDITO",
      parcelas: "1",
      desconto: 0,
      observacao: "",
    });
    setIsVendaModalOpen(true);
  };

  // Submeter Nova Venda
  const handleCreateVenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendaForm.pacienteId || !vendaForm.pacoteId) {
      showToast("Por favor selecione o paciente e o pacote.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pacotes/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId: vendaForm.pacienteId,
          pacoteId: vendaForm.pacoteId,
          sessoesTotais: vendaForm.sessoesTotais,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Venda de pacote realizada com sucesso! Tratamento iniciado.");
        setIsVendaModalOpen(false);
        fetchData(true);
      } else {
        showToast(json.error || "Erro ao realizar venda.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Falha de comunicação com o servidor.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Submeter Novo Pacote no Catálogo
  const handleCreateCatalogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogoForm.nome || !catalogoForm.qtdSessoes) {
      showToast("Informe o nome do pacote e número de sessões.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pacotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: catalogoForm.nome,
          descricao: catalogoForm.descricao,
          valor: parseFloat(catalogoForm.valor) || 0,
          qtdSessoes: parseInt(catalogoForm.qtdSessoes, 10) || 1,
          unitId: selectedUnitId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Novo modelo de pacote adicionado ao catálogo!");
        setIsCatalogoModalOpen(false);
        setCatalogoForm({ nome: "", descricao: "", valor: "", qtdSessoes: "10" });
        fetchData(true);
      } else {
        showToast(json.error || "Erro ao criar pacote.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Falha ao salvar pacote.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar registro de sessão clínica (+1)
  const handleConfirmarSessao = async () => {
    if (!vendaSelecionada) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/pacotes/vendas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vendaSelecionada.id,
          action: "registrar_sessao",
        }),
      });

      const json = await res.json();
      if (json.success) {
        const novaSessao = vendaSelecionada.sessoesRealizadas + 1;
        const total = vendaSelecionada.sessoesTotais;
        if (novaSessao >= total) {
          showToast(`Parabéns! Sessão ${novaSessao}/${total} registrada e pacote CONCLUÍDO com sucesso!`);
        } else {
          showToast(`Sessão ${novaSessao}/${total} registrada com sucesso para ${vendaSelecionada.paciente.nome}!`);
        }
        setIsSessaoModalOpen(false);
        setVendaSelecionada(null);
        setSessaoObs("");
        fetchData(true);
      } else {
        showToast(json.error || "Erro ao registrar sessão.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Falha ao registrar sessão.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Alterar Status da Venda (Concluir / Cancelar / Reativar)
  const handleAlterarStatusVenda = async (id: string, action: "concluir" | "cancelar" | "reativar") => {
    const confirmMsg =
      action === "cancelar"
        ? "Deseja realmente cancelar este pacote de tratamento?"
        : action === "concluir"
        ? "Deseja marcar todas as sessões como concluídas?"
        : "Deseja reativar este pacote?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/pacotes/vendas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Status atualizado com sucesso para ${action.toUpperCase()}!`);
        fetchData(true);
      } else {
        showToast(json.error || "Erro ao alterar status.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao processar alteração.", "error");
    }
  };

  // Excluir modelo do catálogo
  const handleDeletePacoteCatalogo = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o pacote "${nome}" do catálogo?`)) return;

    try {
      const res = await fetch(`/api/pacotes?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast(`Pacote "${nome}" removido do catálogo.`);
        fetchData(true);
      } else {
        showToast(json.error || "Erro ao remover.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir pacote.", "error");
    }
  };

  // Gerar link direto para WhatsApp com mensagem personalizada
  const gerarLinkWhatsapp = (venda: VendaPacote) => {
    const telefoneLimpo = (venda.paciente.telefone || "").replace(/\D/g, "");
    const restantes = venda.sessoesTotais - venda.sessoesRealizadas;
    const saudacao = "Olá " + venda.paciente.nome.split(" ")[0];
    const texto = encodeURIComponent(
      `${saudacao}! Tudo bem? Passando para lembrar que você já realizou ${venda.sessoesRealizadas} de ${venda.sessoesTotais} sessões do seu ${venda.pacote.nome}. ${
        restantes <= 1
          ? "Como falta apenas 1 sessão para concluir seu ciclo, que tal garantir seu plano de manutenção com condição exclusiva?"
          : "Podemos agendar a sua próxima sessão com nossos especialistas?"
      }`
    );
    return `https://wa.me/55${telefoneLimpo}?text=${texto}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast de Feedback */}
      {feedbackToast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border transition-all animate-in slide-in-from-bottom-5",
            feedbackToast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/40 text-rose-200"
          )}
        >
          {feedbackToast.type === "success" ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertCircle size={18} className="text-rose-400" />}
          <span className="text-sm font-medium">{feedbackToast.message}</span>
        </div>
      )}

      {/* Barra Compacta de Status & Ações */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-zinc-200 dark:border-zinc-800 p-3 sm:p-3.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-cyan-700 dark:text-rd-cyan">
          <Layers size={16} />
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Gestão de Planos & Sessões de Tratamento</span>
          {refreshing && <RefreshCw size={13} className="animate-spin text-cyan-600 dark:text-rd-cyan ml-1" />}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto justify-end">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:text-white transition-all text-xs flex items-center gap-1.5"
            title="Atualizar dados"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => setIsCatalogoModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-rd-cyan/30 bg-rd-cyan/10 hover:bg-rd-cyan/20 text-cyan-700 dark:text-rd-cyan font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Novo no Catálogo</span>
          </button>

          <button
            onClick={() => {
              setVendaForm({
                pacienteId: pacientesList[0]?.id || "",
                pacoteId: catalogo[0]?.id || "",
                sessoesTotais: catalogo[0]?.qtdSessoes || 10,
                formaPagamento: "CARTAO_CREDITO",
                parcelas: "1",
                desconto: 0,
                observacao: "",
              });
              setIsVendaModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-rd-cyan text-zinc-950 font-bold text-sm hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-rd-cyan/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={16} /> Nova Venda de Pacote
          </button>
        </div>
      </div>

      {/* KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total em Pacotes */}
        <div className="bg-surface border border-zinc-300 dark:border-zinc-700/60 p-5 rounded-xl relative overflow-hidden group hover:border-rd-cyan/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-rd-cyan/5 rounded-full blur-2xl group-hover:bg-rd-cyan/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento em Pacotes</span>
            <div className="w-8 h-8 rounded-lg bg-rd-cyan/10 text-cyan-700 dark:text-rd-cyan flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
            {stats.receitaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp size={13} />
            <span>Ticket médio: {(stats.totalVendas > 0 ? stats.receitaTotal / stats.totalVendas : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
        </div>

        {/* Pacotes Ativos */}
        <div className="bg-surface border border-zinc-300 dark:border-zinc-700/60 p-5 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tratamentos em Andamento</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">{stats.totalAtivos}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">ativos ({stats.totalConcluidos} concluídos)</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{stats.totalVendas} vendas registradas no total</span>
          </div>
        </div>

        {/* Sessões Realizadas vs Restantes */}
        <div className="bg-surface border border-zinc-300 dark:border-zinc-700/60 p-5 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Execução Clínica</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Play size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
            {stats.sessoesExecutadas} <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">/ {stats.sessoesExecutadas + stats.sessoesRestantes} sessões</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-rd-cyan h-full rounded-full transition-all duration-500"
              style={{
                width: `${stats.sessoesExecutadas + stats.sessoesRestantes > 0 ? (stats.sessoesExecutadas / (stats.sessoesExecutadas + stats.sessoesRestantes)) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 text-right">
            {stats.sessoesRestantes} sessões a executar
          </div>
        </div>

        {/* Alertas de Renovação / CRM */}
        <div
          onClick={() => setActiveTab("crm")}
          className="bg-surface border border-zinc-300 dark:border-zinc-700/60 p-5 rounded-xl relative overflow-hidden group hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Oportunidades de Renovação</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight flex items-center gap-2">
            {stats.alertasRenovacao}
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Up-Sell Imediato
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:text-white transition-colors">
            <span>Ver pacientes com ciclo terminando</span>
            <ChevronRight size={13} />
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center justify-between border-b-2 border-zinc-300 dark:border-zinc-800 pb-4 mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("vendas")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              activeTab === "vendas"
                ? "bg-cyan-50 dark:bg-rd-cyan/15 text-cyan-700 dark:text-rd-cyan border border-rd-cyan/30"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white hover:bg-zinc-100 dark:bg-white/5"
            )}
          >
            <Package size={16} /> Vendas & Tratamentos ({vendas.length})
          </button>

          <button
            onClick={() => setActiveTab("catalogo")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              activeTab === "catalogo"
                ? "bg-cyan-50 dark:bg-rd-cyan/15 text-cyan-700 dark:text-rd-cyan border border-rd-cyan/30"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white hover:bg-zinc-100 dark:bg-white/5"
            )}
          >
            <Tag size={16} /> Catálogo de Pacotes ({catalogo.length})
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative",
              activeTab === "crm"
                ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white hover:bg-zinc-100 dark:bg-white/5"
            )}
          >
            <Flame size={16} className="text-amber-600 dark:text-amber-400" /> Oportunidades de Renovação
            {stats.alertasRenovacao > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm flex items-center justify-center">
                {stats.alertasRenovacao}
              </span>
            )}
          </button>
        </div>

        {activeTab === "vendas" && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar paciente ou pacote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl bg-surface border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan/50 w-52 sm:w-64"
              />
            </div>

            <div className="flex items-center gap-1 bg-surface border border-zinc-300 dark:border-zinc-700/60 p-1 rounded-xl">
              {(["TODOS", "ATIVO", "CONCLUIDO", "CANCELADO"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors",
                    statusFilter === st ? "bg-zinc-200 dark:bg-white/10 text-zinc-950 dark:text-white font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white"
                  )}
                >
                  {st === "TODOS" ? "Todos" : st === "ATIVO" ? "Ativos" : st === "CONCLUIDO" ? "Concluídos" : "Cancelados"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Aba 1: Vendas e Pacientes */}
      {activeTab === "vendas" && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-zinc-500 flex flex-col items-center gap-3">
              <RefreshCw size={24} className="animate-spin text-cyan-700 dark:text-rd-cyan" />
              <p className="text-sm">Carregando tratamentos e pacotes ativos...</p>
            </div>
          ) : vendasFiltradas.length === 0 ? (
            <div className="bg-surface border border-zinc-300 dark:border-zinc-700/60 rounded-xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Nenhum pacote encontrado</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                {searchTerm || statusFilter !== "TODOS"
                  ? "Tente ajustar os termos de pesquisa ou filtros de status."
                  : "Nenhum pacote vendido registrado ainda. Clique em 'Nova Venda de Pacote' para começar!"}
              </p>
              <button
                onClick={() => setIsVendaModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus size={14} /> Realizar Primeira Venda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendasFiltradas.map((venda) => {
                const percentual = Math.min(100, Math.round((venda.sessoesRealizadas / venda.sessoesTotais) * 100));
                const restantes = Math.max(0, venda.sessoesTotais - venda.sessoesRealizadas);
                const isProximoFim = venda.status === "ATIVO" && (restantes <= 1 || percentual >= 80);

                return (
                  <div
                    key={venda.id}
                    className={cn(
                      "bg-surface border rounded-xl p-5 shadow-sm transition-all duration-300 flex flex-col justify-between relative group hover:border-rd-cyan/30",
                      venda.status === "CONCLUIDO"
                        ? "border-emerald-500/20 bg-emerald-950/5"
                        : venda.status === "CANCELADO"
                        ? "border-rose-500/20 opacity-60"
                        : isProximoFim
                        ? "border-amber-500/50 bg-amber-950/5"
                        : "border-zinc-300 dark:border-zinc-700/60"
                    )}
                  >
                    {/* Header do Card */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-rd-cyan/30 border border-rd-cyan/30 text-cyan-700 dark:text-rd-cyan font-bold text-sm flex items-center justify-center shrink-0 shadow-inner">
                            {venda.paciente.nome
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="truncate">
                            <h4 className="text-base font-bold text-zinc-950 dark:text-white truncate" title={venda.paciente.nome}>
                              {venda.paciente.nome}
                            </h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                              {venda.paciente.telefone ? (
                                <span className="hover:text-emerald-600 dark:text-emerald-400 transition-colors flex items-center gap-1">
                                  <Phone size={10} /> {venda.paciente.telefone}
                                </span>
                              ) : (
                                <span>Sem telefone</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-sm font-bold tracking-wider uppercase shrink-0 border",
                            venda.status === "ATIVO"
                              ? isProximoFim
                                ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 animate-pulse"
                                : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30"
                              : venda.status === "CONCLUIDO"
                              ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30"
                              : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30"
                          )}
                        >
                          {venda.status === "ATIVO" && isProximoFim
                            ? "ÚLTIMAS SESSÕES"
                            : venda.status}
                        </span>
                      </div>

                      {/* Nome do Pacote e Valor */}
                      <div className="bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-xl p-3.5 mb-4">
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200 line-clamp-1">{venda.pacote.nome}</p>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span>
                            Valor:{" "}
                            <strong className="text-zinc-950 dark:text-white">
                              {venda.pacote.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </strong>
                          </span>
                          <span>{venda.sessoesTotais} sessões contratadas</span>
                        </div>
                      </div>

                      {/* Progresso de Sessões */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Progresso das Sessões</span>
                          <span className="font-bold text-zinc-950 dark:text-white">
                            <strong className="text-cyan-700 dark:text-rd-cyan text-base">{venda.sessoesRealizadas}</strong>
                            <span className="text-zinc-500 dark:text-zinc-400"> / {venda.sessoesTotais}</span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 ml-1.5 font-normal">({percentual}%)</span>
                          </span>
                        </div>

                        <div className="w-full bg-zinc-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-white/5">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              venda.status === "CONCLUIDO"
                                ? "bg-emerald-400"
                                : isProximoFim
                                ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                                : "bg-gradient-to-r from-blue-500 to-rd-cyan"
                            )}
                            style={{ width: `${percentual}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span>
                            {venda.status === "CONCLUIDO" ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={12} /> Todas as sessões realizadas
                              </span>
                            ) : restantes === 1 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">Resta apenas 1 sessão!</span>
                            ) : (
                              <span>Restam {restantes} sessões</span>
                            )}
                          </span>

                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Aquisição: {new Date(venda.dataAquisicao).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ações do Card */}
                    <div className="pt-3 border-t border-zinc-200 dark:border-white/5 flex items-center gap-2">
                      {venda.status === "ATIVO" ? (
                        <>
                          <button
                            onClick={() => {
                              setVendaSelecionada(venda);
                              setIsSessaoModalOpen(true);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600/90 to-rd-cyan/90 text-zinc-950 font-bold text-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-rd-cyan/10"
                          >
                            <Play size={13} /> Registrar Sessão ({venda.sessoesRealizadas + 1})
                          </button>

                          {venda.paciente.telefone && (
                            <a
                              href={gerarLinkWhatsapp(venda)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs"
                              title="Conversar no WhatsApp"
                            >
                              <MessageSquare size={15} />
                            </a>
                          )}

                          <button
                            onClick={() => handleAlterarStatusVenda(venda.id, "concluir")}
                            className="p-2 rounded-xl border border-white/10 hover:bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white transition-all text-xs"
                            title="Concluir Pacote Manualmente"
                          >
                            <Check size={14} />
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                          <span>Pacote {venda.status.toLowerCase()}</span>
                          <button
                            onClick={() => handleAlterarStatusVenda(venda.id, "reativar")}
                            className="text-rd-cyan hover:underline text-[11px] font-semibold"
                          >
                            Reativar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Aba 2: Catálogo de Pacotes */}
      {activeTab === "catalogo" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 bg-surface border border-zinc-300 dark:border-zinc-700/60 p-5 rounded-xl">
            <div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <Tag className="text-cyan-700 dark:text-rd-cyan" size={18} /> Modelos de Pacotes da Clínica
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure os pacotes padrões oferecidos aos pacientes, valores de tabela e quantidade de sessões.
              </p>
            </div>

            <button
              onClick={() => setIsCatalogoModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={14} /> Cadastrar Novo Modelo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogo.map((item) => {
              const valorPorSessao = item.qtdSessoes > 0 ? item.valor / item.qtdSessoes : 0;
              const totalVendasAtivas = item._count?.pacientes || 0;

              return (
                <div
                  key={item.id}
                  className="bg-surface border border-zinc-300 dark:border-zinc-700/60 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-rd-cyan/50 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-sm font-bold text-cyan-700 dark:text-rd-cyan uppercase tracking-wider bg-rd-cyan/10 px-2.5 py-1 rounded-full border border-rd-cyan/20">
                          {item.qtdSessoes} Sessões
                        </span>
                        <h4 className="text-base font-bold text-zinc-950 dark:text-white mt-2 group-hover:text-cyan-700 dark:group-hover:text-rd-cyan transition-colors">
                          {item.nome}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleDeletePacoteCatalogo(item.id, item.nome)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Excluir pacote do catálogo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {item.descricao || "Sem descrição clínica cadastrada para este pacote."}
                    </p>

                    <div className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-xl p-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">Valor Total</p>
                          <p className="text-2xl font-extrabold text-zinc-950 dark:text-white mt-0.5">
                            {item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">Por Sessão</p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {valorPorSessao.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Users size={14} className="text-cyan-700 dark:text-rd-cyan" />
                      <span>{totalVendasAtivas} pacientes já aderiram a este pacote</span>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-zinc-200 dark:border-white/5">
                    <button
                      onClick={() => handleVenderPacoteCatalogo(item)}
                      className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-rd-cyan hover:text-zinc-950 text-zinc-950 dark:text-white font-bold text-xs transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} /> Vender Este Pacote para Paciente
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Oportunidades de Renovação (CRM) */}
      {activeTab === "crm" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-50 dark:from-amber-500/15 via-white dark:via-surface to-white dark:to-surface border border-amber-500/30 p-6 rounded-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-2">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={14} /> Motor de Retenção & Up-Sell Automático
              </span>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Pacientes com Ciclo de Tratamento no Fim</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Pacientes que estão na última ou penúltima sessão têm 3x mais chance de renovar o plano com a clínica.
                Utilize os botões abaixo para enviar mensagens personalizadas no WhatsApp com 1 clique!
              </p>
            </div>
          </div>

          {oportunidadesRenovacao.length === 0 ? (
            <div className="bg-surface border border-zinc-300 dark:border-zinc-700/60 rounded-xl p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="text-base font-bold text-zinc-950 dark:text-white">Nenhum paciente no ciclo final no momento</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Os tratamentos ativos ainda possuem sessões suficientes. Assim que um paciente atingir 75%+ do pacote, ele aparecerá nesta central de oportunidades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {oportunidadesRenovacao.map((op) => {
                const restantes = op.sessoesTotais - op.sessoesRealizadas;
                const percentual = Math.round((op.sessoesRealizadas / op.sessoesTotais) * 100);

                return (
                  <div
                    key={op.id}
                    className="bg-surface border border-amber-500/30 rounded-xl p-6 shadow-sm flex flex-col justify-between relative group hover:border-amber-400/60 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-sm font-extrabold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-300 dark:border-amber-500/30">
                            {restantes === 1 ? "Última Sessão!" : `Restam ${restantes} Sessões`}
                          </span>
                          <h4 className="text-base font-bold text-zinc-950 dark:text-white mt-2">{op.paciente.nome}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{op.pacote.nome}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-black text-amber-600 dark:text-amber-400">{percentual}%</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase">Concluído</p>
                        </div>
                      </div>

                      <div className="bg-zinc-50 dark:bg-black/25 border border-zinc-200 dark:border-white/5 p-3.5 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                          <span>Sessões:</span>
                          <strong className="text-zinc-950 dark:text-white">
                            {op.sessoesRealizadas} de {op.sessoesTotais} realizadas
                          </strong>
                        </div>
                        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                          <span>Telefone / WhatsApp:</span>
                          <strong className="text-emerald-600 dark:text-emerald-400">{op.paciente.telefone || "Não cadastrado"}</strong>
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 italic pt-1 border-t border-zinc-200 dark:border-white/5">
                          Sugestão: Oferecer plano de manutenção ou renovação com condição especial antes da última sessão.
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-white/5 flex items-center gap-2">
                      {op.paciente.telefone ? (
                        <a
                          href={gerarLinkWhatsapp(op)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white font-bold text-xs hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4" alt="WhatsApp" />
                          Ofertar Renovação via WhatsApp
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-500 text-xs font-semibold cursor-not-allowed"
                        >
                          Sem telefone cadastrado
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setVendaForm({
                            pacienteId: op.paciente.id,
                            pacoteId: op.pacote.id,
                            sessoesTotais: op.pacote.qtdSessoes,
                            formaPagamento: "CARTAO_CREDITO",
                            parcelas: "1",
                            desconto: 10,
                            observacao: "Renovação comercial com 10% de desconto fidelidade",
                          });
                          setIsVendaModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl border border-white/10 hover:bg-zinc-200 dark:bg-white/10 text-zinc-950 dark:text-white font-semibold text-xs transition-all flex items-center gap-1"
                        title="Vender Novo Pacote Imediatamente"
                      >
                        <Plus size={14} /> Novo Pacote
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Nova Venda de Pacote */}
      {isVendaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-zinc-300 dark:border-zinc-600 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-lg">
                <Sparkles className="text-cyan-700 dark:text-rd-cyan" size={20} /> Nova Venda de Pacote
              </div>
              <button
                onClick={() => setIsVendaModalOpen(false)}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white p-1 rounded-lg hover:bg-zinc-100 dark:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVenda} className="space-y-4">
              {/* Seleção do Paciente */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Paciente *</label>
                <select
                  required
                  value={vendaForm.pacienteId}
                  onChange={(e) => setVendaForm({ ...vendaForm, pacienteId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                >
                  <option value="">Selecione o paciente...</option>
                  {pacientesList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} {p.cpf ? `(${p.cpf})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção do Pacote */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Pacote de Tratamento *</label>
                <select
                  required
                  value={vendaForm.pacoteId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const pct = catalogo.find((c) => c.id === selId);
                    setVendaForm({
                      ...vendaForm,
                      pacoteId: selId,
                      sessoesTotais: pct ? pct.qtdSessoes : 1,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                >
                  <option value="">Selecione o modelo do pacote...</option>
                  {catalogo.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} - {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ({c.qtdSessoes} sessões)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade de Sessões e Forma de Pagamento */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Total de Sessões</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vendaForm.sessoesTotais}
                    onChange={(e) => setVendaForm({ ...vendaForm, sessoesTotais: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Forma de Pagamento</label>
                  <select
                    value={vendaForm.formaPagamento}
                    onChange={(e) => setVendaForm({ ...vendaForm, formaPagamento: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                  >
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                    <option value="PIX">PIX (À Vista)</option>
                    <option value="BOLETO">Boleto Parcelado</option>
                    <option value="DINHEIRO">Dinheiro / Espécie</option>
                  </select>
                </div>
              </div>

              {/* Parcelas e Desconto */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Parcelamento</label>
                  <select
                    value={vendaForm.parcelas}
                    onChange={(e) => setVendaForm({ ...vendaForm, parcelas: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                  >
                    <option value="1">1x (Sem juros)</option>
                    <option value="2">2x</option>
                    <option value="3">3x</option>
                    <option value="6">6x</option>
                    <option value="10">10x</option>
                    <option value="12">12x</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Desconto Comercial (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={vendaForm.desconto}
                    onChange={(e) => setVendaForm({ ...vendaForm, desconto: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Observações Internas (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Campanha de Black Friday, indicação de paciente..."
                  value={vendaForm.observacao}
                  onChange={(e) => setVendaForm({ ...vendaForm, observacao: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                />
              </div>

              {/* Botões */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsVendaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-rd-cyan text-zinc-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-95 transition-opacity"
                >
                  {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Confirmar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Cadastrar Modelo no Catálogo */}
      {isCatalogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-zinc-300 dark:border-zinc-600 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-lg">
                <Tag className="text-cyan-700 dark:text-rd-cyan" size={20} /> Cadastrar Modelo no Catálogo
              </div>
              <button
                onClick={() => setIsCatalogoModalOpen(false)}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white p-1 rounded-lg hover:bg-zinc-100 dark:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCatalogo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Nome do Pacote *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Depilação a Laser - 10 Sessões"
                  value={catalogoForm.nome}
                  onChange={(e) => setCatalogoForm({ ...catalogoForm, nome: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Descrição Clínica dos Procedimentos</label>
                <textarea
                  rows={3}
                  placeholder="Detalhes dos procedimentos inclusos, intervalo recomendado entre sessões, etc."
                  value={catalogoForm.descricao}
                  onChange={(e) => setCatalogoForm({ ...catalogoForm, descricao: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Valor Total de Tabela (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="1890.00"
                    value={catalogoForm.valor}
                    onChange={(e) => setCatalogoForm({ ...catalogoForm, valor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Quantidade de Sessões</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={catalogoForm.qtdSessoes}
                    onChange={(e) => setCatalogoForm({ ...catalogoForm, qtdSessoes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                  />
                </div>
              </div>

              {/* Cálculo em tempo real do valor por sessão */}
              {catalogoForm.valor && catalogoForm.qtdSessoes && (
                <div className="bg-rd-cyan/5 border border-rd-cyan/20 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Preço Calculado por Sessão:</span>
                  <span className="text-cyan-700 dark:text-rd-cyan font-bold text-sm">
                    {(parseFloat(catalogoForm.valor) / parseInt(catalogoForm.qtdSessoes, 10) || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCatalogoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-95 transition-opacity"
                >
                  {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Salvar Pacote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Registrar Presença / Execução de Sessão */}
      {isSessaoModalOpen && vendaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-zinc-300 dark:border-zinc-600 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-lg">
                <Play className="text-cyan-700 dark:text-rd-cyan" size={20} /> Registrar Execução de Sessão
              </div>
              <button
                onClick={() => {
                  setIsSessaoModalOpen(false);
                  setVendaSelecionada(null);
                }}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white p-1 rounded-lg hover:bg-zinc-100 dark:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{vendaSelecionada.paciente.nome}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{vendaSelecionada.pacote.nome}</p>
                  </div>
                  <span className="text-lg font-black text-cyan-700 dark:text-rd-cyan">
                    Sessão {vendaSelecionada.sessoesRealizadas + 1} de {vendaSelecionada.sessoesTotais}
                  </span>
                </div>

                {vendaSelecionada.sessoesRealizadas + 1 >= vendaSelecionada.sessoesTotais && (
                  <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl flex items-center gap-1.5 font-medium">
                    <Sparkles size={14} /> Esta é a última sessão! Ao confirmar, o pacote será marcado como CONCLUÍDO.
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Profissional Responsável</label>
                <input
                  type="text"
                  value={sessaoProfissional}
                  onChange={(e) => setSessaoProfissional(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Anotações da Sessão Clínica</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Paciente tolerou bem os parâmetros do laser. Sem intercorrências."
                  value={sessaoObs}
                  onChange={(e) => setSessaoObs(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white text-xs focus:outline-none focus:border-rd-cyan/60"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsSessaoModalOpen(false);
                    setVendaSelecionada(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmarSessao}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-rd-cyan text-zinc-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-95 transition-opacity"
                >
                  {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Confirmar Sessão ({vendaSelecionada.sessoesRealizadas + 1})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
