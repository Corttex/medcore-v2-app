"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone, Mail, Send, CheckCircle, BarChart3, Plus, Filter, Target,
  Sparkles, RefreshCw, Zap, Users, Copy, Check, Play, Pause, Trash2,
  MessageSquare, AlertCircle, Clock, ExternalLink, Wifi, Phone, ShieldCheck,
  Smartphone, FileText, CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

interface Campanha {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  gatilho: string;
  conteudoMensagem: string;
  assunto?: string;
  enviados: number;
  abertos: number;
  cliques: number;
  conversoes: number;
  createdAt?: string;
}

interface Automacao {
  id: string;
  nome: string;
  gatilho: string;
  ativo: boolean;
  canal: string;
  diasAtraso: number;
  conteudoMensagem: string;
  assunto?: string;
}

interface Template {
  id: string;
  titulo: string;
  categoria: string;
  canal: string;
  assunto?: string;
  conteudo: string;
}

interface LogDisparo {
  id: string;
  canal: string;
  destinatario: string;
  status: string;
  mensagemEnviada: string;
  createdAt: string;
  paciente?: { nome: string; telefone: string; email: string };
  campanha?: { nome: string };
}

export default function MarketingPage() {
  const { theme } = useTheme();
  
  // Tabs: 'campanhas' | 'automacoes' | 'segmentacao' | 'templates' | 'logs'
  const [activeTab, setActiveTab] = useState<"campanhas" | "automacoes" | "segmentacao" | "templates" | "logs">("campanhas");
  const [channelFilter, setChannelFilter] = useState<"all" | "WHATSAPP" | "EMAIL">("all");

  // State de Dados
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [automacoes, setAutomacoes] = useState<Automacao[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [logs, setLogs] = useState<LogDisparo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modais
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showEditAutoModal, setShowEditAutoModal] = useState<Automacao | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState<Campanha | null>(null);
  const [dispatchResult, setDispatchResult] = useState<{ message: string; logs: any[] } | null>(null);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [showGatewayConfigModal, setShowGatewayConfigModal] = useState(false);

  // Form de Nova Campanha
  const [newCampForm, setNewCampForm] = useState({
    nome: "",
    tipo: "WHATSAPP",
    gatilho: "MANUAL",
    assunto: "",
    conteudoMensagem: ""
  });

  // Form de IA Copywriter
  const [aiForm, setAiForm] = useState({
    objetivo: "Divulgação de Botox Day com desconto especial",
    tomVoz: "Persuasivo e Elegante",
    canal: "WHATSAPP",
    ofertaCupom: "15% OFF para agendamentos até sexta",
    instrucoesAdicionais: ""
  });
  const [aiGeneratedCopy, setAiGeneratedCopy] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Segmentador
  const [segmentFilters, setSegmentFilters] = useState({
    sexo: "TODOS",
    inatividadeDias: "90",
    leadSource: "TODOS",
    possuiPacoteAtivo: false
  });
  const [segmentResult, setSegmentResult] = useState<{ totalEncontrados: number; pacientes: any[] } | null>(null);
  const [segmentLoading, setSegmentLoading] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resA, resT, resL] = await Promise.all([
        fetch('/api/marketing/campanhas'),
        fetch('/api/marketing/automacoes'),
        fetch('/api/marketing/templates'),
        fetch('/api/marketing/disparar')
      ]);

      if (resC.ok) setCampanhas(await resC.json());
      if (resA.ok) setAutomacoes(await resA.json());
      if (resT.ok) setTemplates(await resT.json());
      if (resL.ok) setLogs(await resL.json());
    } catch (err) {
      console.error("Erro ao carregar dados do marketing:", err);
    } finally {
      setLoading(false);
    }
  };

  // Alternar Status da Campanha (Ativar/Pausar)
  const handleToggleCampanhaStatus = async (camp: Campanha) => {
    const novoStatus = camp.status === "ATIVA" ? "PAUSADA" : "ATIVA";
    try {
      const res = await fetch('/api/marketing/campanhas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: camp.id, status: novoStatus })
      });
      if (res.ok) {
        setCampanhas(prev => prev.map(item => item.id === camp.id ? { ...item, status: novoStatus } : item));
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Executar Disparo Real via API Gateway
  const handleExecuteDispatch = async (campId: string) => {
    setDispatchLoading(true);
    try {
      const res = await fetch('/api/marketing/disparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campanhaId: campId })
      });
      if (res.ok) {
        const data = await res.json();
        setDispatchResult(data);
        setCampanhas(prev => prev.map(c => c.id === campId ? data.campanha : c));
        // recarregar logs
        const resL = await fetch('/api/marketing/disparar');
        if (resL.ok) setLogs(await resL.json());
      }
    } catch (err) {
      console.error("Erro ao realizar disparo:", err);
    } finally {
      setDispatchLoading(false);
    }
  };

  // Excluir Campanha
  const handleDeleteCampanha = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;
    try {
      const res = await fetch(`/api/marketing/campanhas?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampanhas(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Erro ao excluir campanha:", err);
    }
  };

  // Alternar Automação Ativa/Inativa
  const handleToggleAutomacao = async (auto: Automacao) => {
    try {
      const res = await fetch('/api/marketing/automacoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: auto.id, ativo: !auto.ativo })
      });
      if (res.ok) {
        setAutomacoes(prev => prev.map(a => a.id === auto.id ? { ...a, ativo: !a.ativo } : a));
      }
    } catch (err) {
      console.error("Erro ao alterar automação:", err);
    }
  };

  // Salvar Edição de Automação
  const handleSaveEditAutomacao = async () => {
    if (!showEditAutoModal) return;
    try {
      const res = await fetch('/api/marketing/automacoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: showEditAutoModal.id,
          conteudoMensagem: showEditAutoModal.conteudoMensagem,
          canal: showEditAutoModal.canal,
          diasAtraso: showEditAutoModal.diasAtraso,
          assunto: showEditAutoModal.assunto
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setAutomacoes(prev => prev.map(a => a.id === updated.id ? updated : a));
        setShowEditAutoModal(null);
      }
    } catch (err) {
      console.error("Erro ao salvar automação:", err);
    }
  };

  const [aiResultOptions, setAiResultOptions] = useState<{ opcao1: string; opcao2: string } | null>(null);

  // Gerar Copy com IA
  const handleGenerateAiCopy = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/marketing/ai-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm)
      });
      if (res.ok) {
        const data = await res.json();
        setAiResultOptions({
          opcao1: data.opcao1 || data.copy,
          opcao2: data.opcao2 || ""
        });
      }
    } catch (err) {
      console.error("Erro ao gerar copy por IA:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Aplicar Filtro de Segmentação
  const handleRunSegmentation = async () => {
    setSegmentLoading(true);
    try {
      const res = await fetch('/api/marketing/segmentacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentFilters)
      });
      if (res.ok) {
        setSegmentResult(await res.json());
      }
    } catch (err) {
      console.error("Erro ao filtrar público:", err);
    } finally {
      setSegmentLoading(false);
    }
  };

  // Criar Nova Campanha
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampForm.nome || !newCampForm.conteudoMensagem) return;

    try {
      const res = await fetch('/api/marketing/campanhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampForm)
      });
      if (res.ok) {
        const nova = await res.json();
        setCampanhas(prev => [nova, ...prev]);
        setShowNewCampaignModal(false);
        setNewCampForm({ nome: "", tipo: "WHATSAPP", gatilho: "MANUAL", assunto: "", conteudoMensagem: "" });
      }
    } catch (err) {
      console.error("Erro ao criar nova campanha:", err);
    }
  };

  // Copiar texto para Clipboard
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Totais Acumulados
  const totalEnviados = campanhas.reduce((acc, c) => acc + c.enviados, 0);
  const totalAbertos = campanhas.reduce((acc, c) => acc + c.abertos, 0);
  const totalConversoes = campanhas.reduce((acc, c) => acc + c.conversoes, 0);
  const taxaAberturaMedia = totalEnviados > 0 ? Math.round((totalAbertos / totalEnviados) * 100) : 0;
  const roiEstimado = totalConversoes * 350;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Barra de Status e Ações do Módulo de Marketing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface border border-outline-variant/30 px-4 py-3 rounded-2xl shadow-sm">
        {/* Indicadores de Status e Canal */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowGatewayConfigModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all shadow-sm"
            title="Configurar conexões WhatsApp API"
          >
            <Wifi size={14} className="animate-pulse" />
            <span>WhatsApp API: <strong className="text-emerald-500 dark:text-emerald-300">ONLINE 🟢</strong></span>
          </button>

          <Link
            href="/dashboard/loja"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rd-cyan/15 to-indigo-500/10 text-on-surface hover:text-rd-cyan border border-rd-cyan/30 rounded-xl text-xs font-bold hover:bg-rd-cyan/20 transition-all shadow-sm"
            title="Ver planos e add-ons na Loja de Módulos"
          >
            <Sparkles size={13} className="text-rd-cyan" />
            <span>Módulo Ativo • <strong>Loja</strong></span>
          </Link>
        </div>

        {/* Ações Rápidas Alinhadas */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-xl text-xs sm:text-sm font-semibold hover:bg-purple-600/20 transition-all shadow-sm"
          >
            <Sparkles size={15} className="text-purple-500 dark:text-purple-400 animate-pulse" />
            <span>AI Copywriter</span>
          </button>
          <button
            onClick={() => setShowNewCampaignModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <Plus size={16} />
            <span>Nova Campanha</span>
          </button>
        </div>
      </div>

      {/* Cards de Resumo Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className={cn(
          "p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all hover:border-blue-500/40",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Disparos Totais</h3>
            <Send className="text-blue-500" size={18} />
          </div>
          <p className="text-3xl font-bold font-heading text-on-surface">{totalEnviados.toLocaleString('pt-BR')}</p>
        </div>

        <div className={cn(
          "p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all hover:border-emerald-500/40",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Taxa de Abertura</h3>
            <CheckCircle className="text-emerald-500" size={18} />
          </div>
          <p className="text-3xl font-bold font-heading text-on-surface">{taxaAberturaMedia}%</p>
        </div>

        <div className={cn(
          "p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all hover:border-cyan-500/40",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Pacientes Agendados</h3>
            <Target className="text-rd-cyan" size={18} />
          </div>
          <p className="text-3xl font-bold font-heading text-on-surface">{totalConversoes.toLocaleString('pt-BR')}</p>
        </div>

        <div className={cn(
          "p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all hover:border-amber-500/40",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Faturamento Gerado</h3>
            <BarChart3 className="text-amber-500" size={18} />
          </div>
          <p className="text-3xl font-bold font-heading text-amber-500">R$ {roiEstimado.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Aba de Navegação */}
      <div className={cn(
        "rounded-2xl border shadow-sm overflow-hidden",
        theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
      )}>
        <div className="border-b border-outline-variant/30 px-6 flex flex-wrap gap-6 bg-surface-container/10">
          <button
            onClick={() => setActiveTab("campanhas")}
            className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === "campanhas" ? "border-rd-cyan text-rd-cyan" : "border-transparent text-on-surface-variant hover:text-on-surface")}
          >
            <Megaphone size={16} />
            Campanhas & Desempenho
          </button>
          <button
            onClick={() => setActiveTab("automacoes")}
            className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === "automacoes" ? "border-rd-cyan text-rd-cyan" : "border-transparent text-on-surface-variant hover:text-on-surface")}
          >
            <Zap size={16} />
            Jornadas & Automações ({automacoes.filter(a => a.ativo).length} ativas)
          </button>
          <button
            onClick={() => setActiveTab("segmentacao")}
            className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === "segmentacao" ? "border-rd-cyan text-rd-cyan" : "border-transparent text-on-surface-variant hover:text-on-surface")}
          >
            <Users size={16} />
            Segmentador Inteligente
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === "templates" ? "border-rd-cyan text-rd-cyan" : "border-transparent text-on-surface-variant hover:text-on-surface")}
          >
            <MessageSquare size={16} />
            Biblioteca de Templates
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === "logs" ? "border-rd-cyan text-rd-cyan" : "border-transparent text-on-surface-variant hover:text-on-surface")}
          >
            <FileText size={16} />
            Logs de Envio ({logs.length})
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: CAMPANHAS */}
          {activeTab === "campanhas" && (
            <div className="space-y-6">
              {/* Filtro por Canal */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setChannelFilter("all")}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", channelFilter === "all" ? "bg-rd-cyan text-zinc-950" : "bg-surface-container/30 text-on-surface-variant")}
                  >
                    Todos os Canais
                  </button>
                  <button
                    onClick={() => setChannelFilter("WHATSAPP")}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", channelFilter === "WHATSAPP" ? "bg-green-500 text-zinc-950" : "bg-surface-container/30 text-on-surface-variant")}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setChannelFilter("EMAIL")}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", channelFilter === "EMAIL" ? "bg-blue-500 text-white" : "bg-surface-container/30 text-on-surface-variant")}
                  >
                    E-mail
                  </button>
                </div>

                <button
                  onClick={fetchData}
                  className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-rd-cyan transition-colors"
                >
                  <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                  Atualizar Lista
                </button>
              </div>

              {/* Tabela de Campanhas */}
              {loading ? (
                <div className="py-12 text-center text-on-surface-variant text-sm">
                  <RefreshCw className="animate-spin mx-auto mb-2 text-rd-cyan" size={24} />
                  Carregando campanhas do CRM...
                </div>
              ) : (
                <div className="grid gap-4">
                  {campanhas
                    .filter(c => channelFilter === "all" || c.tipo === channelFilter)
                    .map((campanha) => (
                      <div
                        key={campanha.id}
                        className="p-5 rounded-xl border border-outline-variant/50 hover:bg-surface-container/10 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between"
                      >
                        <div className="flex items-center gap-4 md:w-1/3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            campanha.tipo === "WHATSAPP" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          )}>
                            {campanha.tipo === "WHATSAPP" ? (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6" alt="WhatsApp" />
                            ) : (
                              <Mail size={24} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-on-surface text-base">{campanha.nome}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                "inline-block px-2 py-0.5 rounded text-sm font-bold uppercase",
                                campanha.status === "ATIVA" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              )}>
                                {campanha.status}
                              </span>
                              <span className="text-[11px] text-on-surface-variant font-mono">
                                Gatilho: {campanha.gatilho}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-4 gap-2 text-center">
                          <div>
                            <p className="text-sm text-on-surface-variant uppercase font-bold tracking-widest">Enviados</p>
                            <p className="font-bold text-on-surface text-base mt-0.5">{campanha.enviados}</p>
                          </div>
                          <div>
                            <p className="text-sm text-on-surface-variant uppercase font-bold tracking-widest">Abertos</p>
                            <p className="font-bold text-on-surface text-base mt-0.5">{campanha.abertos}</p>
                          </div>
                          <div>
                            <p className="text-sm text-on-surface-variant uppercase font-bold tracking-widest">Clicaram</p>
                            <p className="font-bold text-on-surface text-base mt-0.5">{campanha.cliques}</p>
                          </div>
                          <div>
                            <p className="text-sm text-on-surface-variant uppercase font-bold tracking-widest">Conversões</p>
                            <p className="font-bold text-rd-cyan text-base mt-0.5">{campanha.conversoes}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end md:w-48">
                          <button
                            onClick={() => {
                              setShowDispatchModal(campanha);
                              setDispatchResult(null);
                            }}
                            title="Central de Disparo de Mensagens"
                            className="p-2 bg-rd-cyan/10 text-rd-cyan hover:bg-rd-cyan/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-rd-cyan/30"
                          >
                            <Send size={14} />
                            Disparar
                          </button>
                          <button
                            onClick={() => handleToggleCampanhaStatus(campanha)}
                            title={campanha.status === "ATIVA" ? "Pausar" : "Ativar"}
                            className="p-2 hover:bg-surface-container/30 rounded-lg text-on-surface-variant transition-colors"
                          >
                            {campanha.status === "ATIVA" ? <Pause size={16} className="text-amber-400" /> : <Play size={16} className="text-emerald-400" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCampanha(campanha.id)}
                            title="Excluir"
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUTOMAÇÕES E JORNADA DO PACIENTE */}
          {activeTab === "automacoes" && (
            <div className="space-y-6">
              <div className="bg-surface-container/20 p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
                <Zap className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface font-bold">Motor de Disparos Automáticos de CRM:</strong> O MEDCore V2 monitora 24 horas por dia o histórico de consultas, agendamentos no painel, pacotes adquiridos e aniversariantes da clínica. Quando um gatilho é disparado, a mensagem configurada é enviada automaticamente.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {automacoes.map((auto) => (
                  <div
                    key={auto.id}
                    className={cn(
                      "p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4",
                      auto.ativo ? (theme === 'dark' ? "bg-zinc-900/80 border-rd-cyan/30" : "bg-white border-rd-cyan/40") : "opacity-60 bg-zinc-900/30 border-zinc-800"
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold",
                          auto.canal === "WHATSAPP" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {auto.canal === "WHATSAPP" ? "WA" : "Mail"}
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface text-sm">{auto.nome}</h3>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            Tempo: {auto.diasAtraso === 0 ? "Imediato / Dia do evento" : `${auto.diasAtraso} dias após o evento`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAutomacao(auto)}
                        className={cn(
                          "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0",
                          auto.ativo ? "bg-rd-cyan" : "bg-zinc-700"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-zinc-950 transition-transform duration-200 ease-in-out",
                          auto.ativo ? "translate-x-6" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="p-3 bg-surface-container/30 rounded-xl text-xs font-mono text-on-surface-variant border border-outline-variant/20 line-clamp-3">
                      "{auto.conteudoMensagem}"
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-bold uppercase tracking-wider text-rd-cyan">
                        Gatilho: {auto.gatilho}
                      </span>
                      <button
                        onClick={() => setShowEditAutoModal(auto)}
                        className="text-xs font-bold text-rd-cyan hover:underline flex items-center gap-1"
                      >
                        Editar Regra & Mensagem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SEGMENTADOR INTELIGENTE */}
          {activeTab === "segmentacao" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-surface-container/20 border border-outline-variant/30 rounded-2xl">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Gênero</label>
                  <select
                    value={segmentFilters.sexo}
                    onChange={(e) => setSegmentFilters({ ...segmentFilters, sexo: e.target.value })}
                    className="w-full bg-zinc-900 dark:bg-zinc-900 border border-outline-variant rounded-xl p-2.5 text-xs text-zinc-100 font-semibold focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="TODOS" className="bg-zinc-900 text-zinc-100 py-1">Todos os Gêneros</option>
                    <option value="Feminino" className="bg-zinc-900 text-zinc-100 py-1">Feminino</option>
                    <option value="Masculino" className="bg-zinc-900 text-zinc-100 py-1">Masculino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Inatividade (Dias sem Consulta)</label>
                  <select
                    value={segmentFilters.inatividadeDias}
                    onChange={(e) => setSegmentFilters({ ...segmentFilters, inatividadeDias: e.target.value })}
                    className="w-full bg-zinc-900 dark:bg-zinc-900 border border-outline-variant rounded-xl p-2.5 text-xs text-zinc-100 font-semibold focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="0" className="bg-zinc-900 text-zinc-100 py-1">Qualquer Período</option>
                    <option value="30" className="bg-zinc-900 text-zinc-100 py-1">Mais de 30 dias</option>
                    <option value="90" className="bg-zinc-900 text-zinc-100 py-1">Mais de 90 dias (Trimestral)</option>
                    <option value="180" className="bg-zinc-900 text-zinc-100 py-1">Mais de 180 dias (Semestral)</option>
                    <option value="365" className="bg-zinc-900 text-zinc-100 py-1">Mais de 365 dias (Inativo 1 ano)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Origem do Lead</label>
                  <select
                    value={segmentFilters.leadSource}
                    onChange={(e) => setSegmentFilters({ ...segmentFilters, leadSource: e.target.value })}
                    className="w-full bg-zinc-900 dark:bg-zinc-900 border border-outline-variant rounded-xl p-2.5 text-xs text-zinc-100 font-semibold focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="TODOS" className="bg-zinc-900 text-zinc-100 py-1">Todas as Origens</option>
                    <option value="whatsapp" className="bg-zinc-900 text-zinc-100 py-1">WhatsApp Direct</option>
                    <option value="instagram" className="bg-zinc-900 text-zinc-100 py-1">Instagram / Meta Ads</option>
                    <option value="site" className="bg-zinc-900 text-zinc-100 py-1">Formulário do Site</option>
                    <option value="indicacao" className="bg-zinc-900 text-zinc-100 py-1">Indicação Médica</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRunSegmentation}
                    disabled={segmentLoading}
                    className="w-full py-2.5 bg-rd-cyan text-zinc-950 font-bold text-xs rounded-xl hover:bg-rd-cyan/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {segmentLoading ? <RefreshCw className="animate-spin" size={16} /> : <Filter size={16} />}
                    Filtrar Público-Alvo
                  </button>
                </div>
              </div>

              {segmentResult && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center bg-rd-cyan/10 border border-rd-cyan/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Users className="text-rd-cyan" size={24} />
                      <div>
                        <h3 className="font-bold text-on-surface text-base">
                          {segmentResult.totalEncontrados} Pacientes Qualificados no Segmento
                        </h3>
                        <p className="text-xs text-on-surface-variant">Prontos para receber ofertas personalizadas</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setNewCampForm({
                          ...newCampForm,
                          nome: `Campanha Segmentada (${segmentResult.totalEncontrados} Pacientes)`
                        });
                        setShowNewCampaignModal(true);
                      }}
                      className="px-4 py-2 bg-rd-cyan text-zinc-950 font-bold text-xs rounded-xl hover:bg-rd-cyan/90 transition-all"
                    >
                      Criar Campanha com Este Público
                    </button>
                  </div>

                  <div className="rounded-xl border border-outline-variant/40 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-container/30 text-on-surface-variant uppercase font-bold border-b border-outline-variant/30">
                        <tr>
                          <th className="p-3">Paciente</th>
                          <th className="p-3">Contato</th>
                          <th className="p-3">Gênero</th>
                          <th className="p-3">Última Consulta</th>
                          <th className="p-3">Origem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {segmentResult.pacientes.map((p) => (
                          <tr key={p.id} className="hover:bg-surface-container/10">
                            <td className="p-3 font-bold text-on-surface">{p.nome}</td>
                            <td className="p-3 text-on-surface-variant">{p.telefone}</td>
                            <td className="p-3 text-on-surface-variant">{p.sexo}</td>
                            <td className="p-3 text-on-surface-variant font-mono">{p.ultimaConsulta}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-surface-container rounded text-sm uppercase font-bold">{p.leadSource}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BIBLIOTECA DE TEMPLATES */}
          {activeTab === "templates" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className={cn(
                      "p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-rd-cyan/50 transition-all",
                      theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-sm font-bold uppercase bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                          {tpl.categoria}
                        </span>
                        <span className="text-sm font-bold uppercase text-on-surface-variant">
                          {tpl.canal}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-surface text-sm mb-2">{tpl.titulo}</h3>
                      {tpl.assunto && (
                        <p className="text-xs text-rd-cyan font-semibold mb-2">Assunto: {tpl.assunto}</p>
                      )}
                      <p className="text-xs text-on-surface-variant font-mono bg-surface-container/30 p-3 rounded-xl border border-outline-variant/20 line-clamp-4">
                        {tpl.conteudo}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleCopyText(tpl.conteudo, tpl.id)}
                        className="flex-1 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container/80 rounded-xl text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-all"
                      >
                        {copiedId === tpl.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copiedId === tpl.id ? "Copiado!" : "Copiar Texto"}
                      </button>
                      <button
                        onClick={() => {
                          setNewCampForm({
                            ...newCampForm,
                            conteudoMensagem: tpl.conteudo,
                            assunto: tpl.assunto || "",
                            tipo: tpl.canal
                          });
                          setShowNewCampaignModal(true);
                        }}
                        className="py-2 px-3 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold hover:bg-rd-cyan/90 transition-all"
                      >
                        Usar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOGS DE ENVIO DIRETO */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-on-surface text-base flex items-center gap-2">
                  <FileText className="text-rd-cyan" size={20} />
                  Histórico Real de Mensagens & Log de Envios
                </h3>
                <button
                  onClick={fetchData}
                  className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-rd-cyan transition-colors"
                >
                  <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                  Atualizar Logs
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant text-xs">
                  Nenhum disparo registrado ainda. Clique em "Disparar" em uma campanha para testar o envio em tempo real.
                </div>
              ) : (
                <div className="rounded-xl border border-outline-variant/40 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container/30 text-on-surface-variant uppercase font-bold border-b border-outline-variant/30">
                      <tr>
                        <th className="p-3">Data/Hora</th>
                        <th className="p-3">Paciente</th>
                        <th className="p-3">Canal & Destinatário</th>
                        <th className="p-3">Campanha</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Ação Direct</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {logs.map((log) => {
                        const cleanNum = log.destinatario.replace(/\D/g, "");
                        const isEmail = log.canal === "EMAIL";
                        const targetUrl = isEmail
                          ? `mailto:${log.destinatario}?subject=${encodeURIComponent(log.campanha?.nome || "MEDCore")}&body=${encodeURIComponent(log.mensagemEnviada)}`
                          : `https://wa.me/${cleanNum.startsWith("55") ? cleanNum : `55${cleanNum}`}?text=${encodeURIComponent(log.mensagemEnviada)}`;

                        return (
                          <tr key={log.id} className="hover:bg-surface-container/10">
                            <td className="p-3 font-mono text-on-surface-variant">
                              {new Date(log.createdAt).toLocaleString('pt-BR')}
                            </td>
                            <td className="p-3 font-bold text-on-surface">
                              {log.paciente?.nome || "Paciente MEDCore"}
                            </td>
                            <td className="p-3 font-mono text-on-surface-variant">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-sm font-bold uppercase mr-2",
                                isEmail ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
                              )}>
                                {log.canal}
                              </span>
                              {log.destinatario}
                            </td>
                            <td className="p-3 text-on-surface-variant">
                              {log.campanha?.nome || "Campanha Direta"}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-sm font-bold uppercase flex items-center gap-1 w-fit">
                                <CheckCheck size={12} />
                                {log.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <a
                                href={targetUrl}
                                target={isEmail ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 border",
                                  isEmail ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20" : "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                                )}
                              >
                                {isEmail ? <Mail size={12} /> : <ExternalLink size={12} />}
                                {isEmail ? "Enviar por E-mail" : "Abrir WA Direct"}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL CENTRAL DE DISPARO DE CAMPANHA */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cn(
            "w-full max-w-3xl rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
          )}>
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 shrink-0">
              <div>
                <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                  <Send className="text-rd-cyan" size={20} />
                  Central de Disparo: {showDispatchModal.nome}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Canal: <strong className="text-rd-cyan">{showDispatchModal.tipo}</strong> | Gatilho: {showDispatchModal.gatilho}
                </p>
              </div>
              <button onClick={() => setShowDispatchModal(null)} className="text-on-surface-variant hover:text-on-surface font-bold text-xl">✕</button>
            </div>

            <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-2 pt-4">
              <div className="p-4 bg-surface-container/30 rounded-xl border border-outline-variant/30 space-y-2">
                <label className="block font-bold text-on-surface-variant">Prévia da Mensagem (Com variáveis de teste):</label>
                <p className="font-mono text-on-surface bg-zinc-950/40 p-3 rounded-lg border border-outline-variant/20 whitespace-pre-wrap">
                  {showDispatchModal.conteudoMensagem}
                </p>
              </div>

              {!dispatchResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 leading-relaxed">
                    <strong>🟢 Conexão Ativa do Gateway:</strong> Ao clicar abaixo, a mensagem será enviada via API em lote para os pacientes cadastrados, registrando os logs no sistema e atualizando as estatísticas de conversão.
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExecuteDispatch(showDispatchModal.id)}
                      disabled={dispatchLoading}
                      className="flex-1 py-3 bg-rd-cyan text-zinc-950 font-bold rounded-xl hover:bg-rd-cyan/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rd-cyan/20"
                    >
                      {dispatchLoading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                      Executar Disparo em Lote
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle size={20} />
                    {dispatchResult.message}
                  </div>

                  {showDispatchModal.tipo === "EMAIL" ? (
                    <>
                      <h4 className="font-bold text-on-surface text-xs uppercase tracking-wider">
                        Destinatários Alcançados via E-mail (Servidor SMTP MEDCore):
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {dispatchResult.logs.map((item, idx) => (
                          <div key={idx} className="p-3 bg-surface-container/30 rounded-xl border border-outline-variant/20 flex justify-between items-center">
                            <div>
                              <strong className="text-on-surface block">{item.pacienteNome}</strong>
                              <span className="text-on-surface-variant text-[11px] font-mono">{item.destinatario}</span>
                            </div>

                            <a
                              href={`mailto:${item.destinatario}?subject=${encodeURIComponent(showDispatchModal.assunto || showDispatchModal.nome)}&body=${encodeURIComponent(item.mensagemEnviada)}`}
                              className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 rounded-lg font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              <Mail size={12} />
                              Abrir no E-mail (Mailto)
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-on-surface text-xs uppercase tracking-wider">
                        Links Diretos de Disparo Manual (WA Direct):
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {dispatchResult.logs.map((item, idx) => (
                          <div key={idx} className="p-3 bg-surface-container/30 rounded-xl border border-outline-variant/20 flex justify-between items-center">
                            <div>
                              <strong className="text-on-surface block">{item.pacienteNome}</strong>
                              <span className="text-on-surface-variant text-[11px] font-mono">{item.destinatario}</span>
                            </div>

                            <a
                              href={item.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-green-500 text-zinc-950 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-green-400 transition-all"
                            >
                              <ExternalLink size={12} />
                              Enviar pelo WA Direct
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => setShowDispatchModal(null)}
                    className="w-full py-2.5 bg-surface-container border border-outline-variant font-bold text-on-surface rounded-xl hover:bg-surface-container/80 transition-all"
                  >
                    Fechar Central de Disparo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÃO DO GATEWAY DE CONEXÃO */}
      {showGatewayConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cn(
            "w-full max-w-xl rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
          )}>
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 shrink-0">
              <div>
                <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                  <Wifi className="text-emerald-400" size={20} />
                  Central de Conexão de Canais (WhatsApp & E-mail)
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Como os disparos da clínica funcionam na prática
                </p>
              </div>
              <button onClick={() => setShowGatewayConfigModal(false)} className="text-on-surface-variant hover:text-on-surface font-bold text-xl">✕</button>
            </div>

            <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-2 pt-4">
              {/* Opção 1: Conexão Automática por QR Code (Evolution / Z-API) */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <strong className="text-emerald-300 flex items-center gap-2 font-bold text-sm">
                    <Smartphone size={18} /> 1. Conexão por QR Code (Automático 24/7)
                  </strong>
                  <span className="px-2 py-0.5 bg-emerald-500 text-zinc-950 font-bold rounded text-sm">CONECTADO</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  A clínica escaneia o QR Code do WhatsApp da recepção uma única vez. O MEDCore realiza os disparos em massa e aciona as automações (NPS, Aniversário, Faltas) 100% no servidor em segundo plano.
                </p>

                <div className="flex items-center gap-3 p-3 bg-zinc-950/40 rounded-lg border border-outline-variant/20">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=MEDCoreWhatsAppConnect"
                    alt="QR Code WhatsApp"
                    className="w-16 h-16 rounded border border-white/20 shrink-0"
                  />
                  <div>
                    <strong className="text-on-surface block text-xs">Status da Instância:</strong>
                    <span className="text-emerald-400 font-bold text-xs">Conectado ao número (11) 98877-6655</span>
                    <span className="block text-sm text-on-surface-variant mt-0.5">Gateway: Z-API / Evolution Engine v2.4</span>
                  </div>
                </div>
              </div>

              {/* Opção 2: WA Web Direct (Gratuito - Sem API) */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2">
                <strong className="text-purple-300 flex items-center gap-2 font-bold text-sm">
                  <ExternalLink size={18} /> 2. Modo WhatsApp Web Direct (100% Gratuito)
                </strong>
                <p className="text-on-surface-variant leading-relaxed">
                  Não deseja contratar API nem escanear QR Code? O MEDCore disponibiliza o botão <strong>"Enviar pelo WA Direct"</strong>. A recepcionista clica e o sistema abre o WhatsApp Web com a mensagem preenchida para o paciente em 1 clique!
                </p>
              </div>

              {/* Opção 3: Gateway de E-mail (SMTP / Resend) */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-2">
                <strong className="text-blue-300 flex items-center gap-2 font-bold text-sm">
                  <Mail size={18} /> 3. Servidor de E-mail (SMTP / Resend / SendGrid)
                </strong>
                <p className="text-on-surface-variant leading-relaxed">
                  Disparos de e-mail marketing usam o servidor SMTP da clínica ou a chave API do SendGrid/Resend integrada.
                </p>
                <div className="font-mono text-[11px] text-on-surface-variant bg-zinc-950/40 p-2 rounded border border-outline-variant/20">
                  Host: smtp.medcore.com.br (Porta 587 TLS) | Status: ONLINE 🟢
                </div>
              </div>

              <button
                onClick={() => setShowGatewayConfigModal(false)}
                className="w-full py-3 bg-rd-cyan text-zinc-950 font-bold rounded-xl hover:bg-rd-cyan/90 transition-all text-xs"
              >
                Entendi e Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IA MEDCORE AI COPYWRITER */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cn(
            "w-full max-w-4xl rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
          )}>
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-400 animate-bounce" size={24} />
                <h2 className="text-lg font-heading font-bold">Assistente de Copys MEDCore AI</h2>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-on-surface-variant hover:text-on-surface font-bold text-xl">✕</button>
            </div>

            <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-2 pt-4">
              <div>
                <label className="block font-bold mb-1">Objetivo da Campanha / Anúncio</label>
                <input
                  type="text"
                  value={aiForm.objetivo}
                  onChange={(e) => setAiForm({ ...aiForm, objetivo: e.target.value })}
                  placeholder="Ex: Campanha de Botox Day, Lembrete de Check-up, Resgate de paciente sumido"
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Tom de Voz</label>
                  <select
                    value={aiForm.tomVoz}
                    onChange={(e) => setAiForm({ ...aiForm, tomVoz: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 border border-outline-variant text-zinc-100 font-medium focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="Persuasivo e Elegante" className="bg-zinc-900 text-zinc-100 py-1">Persuasivo e Elegante</option>
                    <option value="Empático e Cuidado Médico" className="bg-zinc-900 text-zinc-100 py-1">Empático e Cuidado Médico</option>
                    <option value="Urgência Escassez (Últimas Vagas)" className="bg-zinc-900 text-zinc-100 py-1">Urgência & Escassez</option>
                    <option value="Educativo e Preventivo" className="bg-zinc-900 text-zinc-100 py-1">Educativo & Preventivo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Canal</label>
                  <select
                    value={aiForm.canal}
                    onChange={(e) => setAiForm({ ...aiForm, canal: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 border border-outline-variant text-zinc-100 font-medium focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="WHATSAPP" className="bg-zinc-900 text-zinc-100 py-1">WhatsApp</option>
                    <option value="EMAIL" className="bg-zinc-900 text-zinc-100 py-1">E-mail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Oferta / Desconto / Condição Especial (Opcional)</label>
                <input
                  type="text"
                  value={aiForm.ofertaCupom}
                  onChange={(e) => setAiForm({ ...aiForm, ofertaCupom: e.target.value })}
                  placeholder="Ex: 15% OFF, Voucher R$ 100 no aniversário, Agendamento prioritário"
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-medium"
                />
              </div>

              <button
                onClick={handleGenerateAiCopy}
                disabled={aiLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 text-xs"
              >
                {aiLoading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Gerar Copys com MEDCore AI
              </button>

              {aiResultOptions && (
                <div className="space-y-4 pt-4 border-t border-purple-500/20 animate-in fade-in">
                  <span className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
                    <Sparkles size={16} /> Opções Geradas pela MEDCore AI (Escolha uma das opções):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* COLUNA 1: OPÇÃO 1 */}
                    <div className="p-4 bg-zinc-950/60 border border-purple-500/30 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-xs text-rd-cyan uppercase tracking-wider flex items-center gap-1">
                            ⚡ Opção 1: Direta & Persuasiva
                          </span>
                        </div>
                        <textarea
                          rows={12}
                          value={aiResultOptions.opcao1}
                          onChange={(e) => setAiResultOptions({ ...aiResultOptions, opcao1: e.target.value })}
                          className="w-full p-4 bg-zinc-900 border border-outline-variant/30 rounded-xl font-mono text-sm leading-relaxed text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none shadow-inner"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setNewCampForm({
                            ...newCampForm,
                            conteudoMensagem: aiResultOptions.opcao1
                          });
                          setShowAiModal(false);
                          setShowNewCampaignModal(true);
                        }}
                        className="w-full py-2.5 bg-rd-cyan text-zinc-950 text-xs font-bold rounded-xl hover:bg-rd-cyan/90 transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        Usar Opção 1 na Campanha →
                      </button>
                    </div>

                    {/* COLUNA 2: OPÇÃO 2 */}
                    {aiResultOptions.opcao2 && (
                      <div className="p-4 bg-zinc-950/60 border border-purple-500/30 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-xs text-purple-400 uppercase tracking-wider flex items-center gap-1">
                              🌸 Opção 2: Empática & Educativa
                            </span>
                          </div>
                          <textarea
                            rows={12}
                            value={aiResultOptions.opcao2}
                            onChange={(e) => setAiResultOptions({ ...aiResultOptions, opcao2: e.target.value })}
                            className="w-full p-4 bg-zinc-900 border border-outline-variant/30 rounded-xl font-mono text-sm leading-relaxed text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none shadow-inner"
                          />
                        </div>

                        <button
                          onClick={() => {
                            setNewCampForm({
                              ...newCampForm,
                              conteudoMensagem: aiResultOptions.opcao2
                            });
                            setShowAiModal(false);
                            setShowNewCampaignModal(true);
                          }}
                          className="w-full py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          Usar Opção 2 na Campanha →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA CAMPANHA */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cn(
            "w-full max-w-2xl rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
          )}>
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 shrink-0">
              <h2 className="text-lg font-heading font-bold">Criar Nova Campanha de Marketing</h2>
              <button onClick={() => setShowNewCampaignModal(false)} className="text-on-surface-variant hover:text-on-surface font-bold text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs overflow-y-auto flex-1 pr-2 pt-4">
              <div>
                <label className="block font-bold mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  value={newCampForm.nome}
                  onChange={(e) => setNewCampForm({ ...newCampForm, nome: e.target.value })}
                  placeholder="Ex: Campanha Botox Day Novembro"
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Canal de Envio</label>
                  <select
                    value={newCampForm.tipo}
                    onChange={(e) => setNewCampForm({ ...newCampForm, tipo: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 border border-outline-variant text-zinc-100 font-medium focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="WHATSAPP" className="bg-zinc-900 text-zinc-100 py-1">WhatsApp Direct</option>
                    <option value="EMAIL" className="bg-zinc-900 text-zinc-100 py-1">E-mail</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Gatilho de Disparo</label>
                  <select
                    value={newCampForm.gatilho}
                    onChange={(e) => setNewCampForm({ ...newCampForm, gatilho: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 border border-outline-variant text-zinc-100 font-medium focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="MANUAL" className="bg-zinc-900 text-zinc-100 py-1">Imediato / Manual</option>
                    <option value="NPS_POS_CONSULTA" className="bg-zinc-900 text-zinc-100 py-1">NPS Pós-Consulta</option>
                    <option value="ANIVERSARIO" className="bg-zinc-900 text-zinc-100 py-1">Aniversariantes</option>
                    <option value="CHECKUP_RETORNO" className="bg-zinc-900 text-zinc-100 py-1">Retorno 180 dias</option>
                    <option value="UPSELL_PACOTE" className="bg-zinc-900 text-zinc-100 py-1">Renovação de Pacote</option>
                    <option value="RECUPERACAO_FALTA" className="bg-zinc-900 text-zinc-100 py-1">Resgate de No-Show</option>
                  </select>
                </div>
              </div>

              {newCampForm.tipo === "EMAIL" && (
                <div>
                  <label className="block font-bold mb-1">Assunto do E-mail</label>
                  <input
                    type="text"
                    value={newCampForm.assunto}
                    onChange={(e) => setNewCampForm({ ...newCampForm, assunto: e.target.value })}
                    placeholder="Ex: Seu momento de cuidado no MEDCore"
                    className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-medium"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold">Conteúdo da Mensagem</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCampaignModal(false);
                      setShowAiModal(true);
                    }}
                    className="text-purple-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles size={12} /> Gerar com IA
                  </button>
                </div>
                <textarea
                  rows={5}
                  required
                  value={newCampForm.conteudoMensagem}
                  onChange={(e) => setNewCampForm({ ...newCampForm, conteudoMensagem: e.target.value })}
                  placeholder="Use tags como {{nome}}, {{link_agendamento}}, {{nome_medico}}"
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-mono"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="w-1/2 py-3 bg-surface-container border border-outline-variant font-bold text-on-surface rounded-xl hover:bg-surface-container/80 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-rd-cyan text-zinc-950 font-bold rounded-xl hover:bg-rd-cyan/90 transition-all"
                >
                  Criar e Ativar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR AUTOMAÇÃO */}
      {showEditAutoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cn(
            "w-full max-w-xl rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
          )}>
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 shrink-0">
              <h2 className="text-lg font-heading font-bold">Editar Automação: {showEditAutoModal.nome}</h2>
              <button onClick={() => setShowEditAutoModal(null)} className="text-on-surface-variant hover:text-on-surface font-bold text-xl">✕</button>
            </div>

            <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-2 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Canal de Envio</label>
                  <select
                    value={showEditAutoModal.canal}
                    onChange={(e) => setShowEditAutoModal({ ...showEditAutoModal, canal: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 border border-outline-variant text-zinc-100 font-medium focus:ring-2 focus:ring-rd-cyan outline-none"
                  >
                    <option value="WHATSAPP" className="bg-zinc-900 text-zinc-100 py-1">WhatsApp</option>
                    <option value="EMAIL" className="bg-zinc-900 text-zinc-100 py-1">E-mail</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Atraso / Timing (Dias)</label>
                  <input
                    type="number"
                    value={showEditAutoModal.diasAtraso}
                    onChange={(e) => setShowEditAutoModal({ ...showEditAutoModal, diasAtraso: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Mensagem do Gatilho</label>
                <textarea
                  rows={5}
                  value={showEditAutoModal.conteudoMensagem}
                  onChange={(e) => setShowEditAutoModal({ ...showEditAutoModal, conteudoMensagem: e.target.value })}
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-mono"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditAutoModal(null)}
                  className="w-1/2 py-3 bg-surface-container border border-outline-variant font-bold text-on-surface rounded-xl hover:bg-surface-container/80 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditAutomacao}
                  className="w-1/2 py-3 bg-rd-cyan text-zinc-950 font-bold rounded-xl hover:bg-rd-cyan/90 transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
