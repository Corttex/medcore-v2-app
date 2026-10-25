"use client";

import React, { useState, useEffect } from "react";
import { 
  Target, Users, MapPin, Phone, Mail, Building, 
  CheckCircle2, Clock, Calendar, AlertCircle, ArrowLeft, 
  Send, ExternalLink, Printer, Edit3, Save, Sparkles,
  TrendingUp, DollarSign, RefreshCw, X, Shield, Plus
} from "lucide-react";
import Link from "next/link";

interface PipelineLead {
  id: string;
  nome: string;
  donoOuResponsavel: string;
  especialidade: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  avaliacaoGoogle: number;
  totalAvaliacoes: number;
  status: "NOVO" | "WHATSAPP_ENVIADO" | "VISITA_AGENDADA" | "VISITADO" | "FECHADO" | "DECLINADO";
  planoAlvo: string;
  dataCriacao: string;
  proximaAcao: string;
  anotacoes: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NOVO: { label: "Novo Lead", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  WHATSAPP_ENVIADO: { label: "WhatsApp Enviado", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  VISITA_AGENDADA: { label: "Visita Agendada", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  VISITADO: { label: "Visitado (Porta a Porta)", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  FECHADO: { label: "Contrato Fechado! 🎉", color: "bg-emerald-600 text-white border-emerald-500" },
  DECLINADO: { label: "Declinado", color: "bg-red-500/10 text-red-400 border-red-500/20" }
};

export default function PipelineProspeccaoPage() {
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PipelineLead>>({});
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/prospeccao/pipeline");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error("Erro ao buscar pipeline:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStartEdit = (lead: PipelineLead) => {
    setEditingId(lead.id);
    setEditForm({ ...lead });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/prospeccao/pipeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, updates: editForm })
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(prev => prev.map(l => l.id === editingId ? data.lead : l));
        setEditingId(null);
      }
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
    setSaving(false);
  };

  const filteredLeads = filterStatus === "TODOS" 
    ? leads 
    : leads.filter(l => l.status === filterStatus);

  const totalPotencial = leads.length * 1890;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header com Navegação e Métricas de Fechamento */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/prospeccao"
              className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={13} /> Voltar ao Radar de Busca
            </Link>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-full">
              CRM DE PROSPECÇÃO B2B
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Pipeline de Clientes & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Gestão Porta a Porta</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Acompanhe o funil das clínicas atraídas pelo Radar. Gerencie os nomes dos sócios/médicos responsáveis, status das visitas presenciais e anotações de fechamento do Plano Black.
          </p>
        </div>

        {/* Card de Faturamento em Potencial */}
        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pipeline em Negociação</p>
            <p className="text-xl font-black text-emerald-500">
              R$ {totalPotencial.toLocaleString("pt-BR")},00 <span className="text-xs text-zinc-500">/mês</span>
            </p>
            <span className="text-[10px] text-zinc-500 font-medium">{leads.length} Clínicas no Radar</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Filtros de Status do Funil */}
      <div className="flex flex-wrap items-center gap-2">
        {["TODOS", "NOVO", "WHATSAPP_ENVIADO", "VISITA_AGENDADA", "VISITADO", "FECHADO", "DECLINADO"].map(st => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterStatus === st 
                ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20" 
                : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            {st === "TODOS" ? "Todos os Leads" : STATUS_LABELS[st]?.label || st}
          </button>
        ))}
      </div>

      {/* Lista de Clínicas no Funil */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw size={32} className="animate-spin text-amber-500 mx-auto" />
          <p className="text-sm font-bold text-zinc-300">Carregando pipeline de clínicas...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Target size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">Nenhum lead com este status</h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Utilize o Radar de Prospecção para pesquisar clínicas na região e clique em <strong>Atrair Cliente</strong> para trazê-las para este pipeline.
            </p>
          </div>
          <Link
            href="/dashboard/admin/prospeccao"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Plus size={14} /> Mapear Novas Clínicas no Radar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const isEditing = editingId === lead.id;

            return (
              <div 
                key={lead.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4 transition-all"
              >
                {/* Linha 1: Nome da Clínica e Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{lead.nome}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_LABELS[lead.status]?.color || "bg-zinc-800 text-zinc-300"}`}>
                        {STATUS_LABELS[lead.status]?.label || lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-zinc-400 shrink-0" /> {lead.endereco}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => isEditing ? handleSaveEdit() : handleStartEdit(lead)}
                      disabled={saving}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-zinc-200 dark:border-zinc-700"
                    >
                      {isEditing ? (
                        <>
                          <Save size={13} className="text-emerald-500" /> Salvar Ficha
                        </>
                      ) : (
                        <>
                          <Edit3 size={13} /> Editar Ficha & Dono
                        </>
                      )}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Linha 2: Campos Editáveis (Dono, Status, Contatos) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-750">
                  
                  {/* Dono / Sócio */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                      <Users size={12} /> Dono / Sócio / Responsável
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editForm.donoOuResponsavel || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, donoOuResponsavel: e.target.value }))}
                        placeholder="Ex: Dr. Roberto / Dra. Patrícia"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                      />
                    ) : (
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {lead.donoOuResponsavel || "Não preenchido (descobrir na recepção)"}
                      </p>
                    )}
                  </div>

                  {/* Status da Visita */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Clock size={12} /> Status da Abordagem
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.status || lead.status}
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                      >
                        <option value="NOVO">Novo Lead</option>
                        <option value="WHATSAPP_ENVIADO">WhatsApp Enviado</option>
                        <option value="VISITA_AGENDADA">Visita Agendada</option>
                        <option value="VISITADO">Visitado (Porta a Porta)</option>
                        <option value="FECHADO">Contrato Fechado! 🎉</option>
                        <option value="DECLINADO">Declinado</option>
                      </select>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {STATUS_LABELS[lead.status]?.label}
                      </p>
                    )}
                  </div>

                  {/* Telefone & WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Phone size={12} /> WhatsApp Verificado
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editForm.whatsapp || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="Ex: 5561999998888"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    ) : (
                      <p className="text-xs font-mono font-bold text-emerald-500">
                        {lead.whatsapp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Linha 3: Anotações da Visita Presencial */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Anotações da Visita Presencial / Feedback da Clínica:
                  </label>
                  {isEditing ? (
                    <textarea 
                      rows={2}
                      value={editForm.anotacoes || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, anotacoes: e.target.value }))}
                      placeholder="Ex: Conversei com a secretária Ana. O Dr. Carlos só está na quarta à tarde. Mostrar módulo de botox e prontuário estético."
                      className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                      {lead.anotacoes || "Nenhuma anotação registrada ainda. Clique em 'Editar Ficha' após a visita presencial."}
                    </p>
                  )}
                </div>

                {/* Rodapé do Card com Ações Diretas */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-500">
                      Ticket Alvo: {lead.planoAlvo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${lead.whatsapp}?text=Olá,%20somos%20da%20equipe%20do%20MedCore!%20Temos%20uma%20proposta%20personalizada%20para%20a%20${encodeURIComponent(lead.nome)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Send size={12} /> Abrir WhatsApp Web
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.nome + " " + lead.endereco)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <ExternalLink size={12} /> Rota no Maps
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
