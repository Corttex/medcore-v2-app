"use client";

import React, { useState } from "react";
import { Plus, AlertTriangle, Clock, FileText, Brain, Loader2, ChevronRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

type LegalStatus = "Recebido" | "Análise Interna" | "Enviado ao Jurídico" | "Aguardando Devolutiva" | "Em Resolução" | "Concluído";

interface LegalProcess {
  id: string;
  number: string;
  title: string;
  description: string;
  responsible: string;
  deadline: string;
  status: LegalStatus;
  priority: "Alta" | "Média" | "Baixa";
  documents: string[];
  aiAnalysis: string;
  createdAt: string;
}

const FLOW: LegalStatus[] = ["Recebido", "Análise Interna", "Enviado ao Jurídico", "Aguardando Devolutiva", "Em Resolução", "Concluído"];

const STATUS_COLORS: Record<LegalStatus, string> = {
  "Recebido":           "bg-slate-100 border-slate-200 text-slate-700",
  "Análise Interna":    "bg-blue-50 border-blue-200 text-blue-700",
  "Enviado ao Jurídico":"bg-violet-50 border-violet-200 text-violet-700",
  "Aguardando Devolutiva":"bg-amber-50 border-amber-200 text-amber-700",
  "Em Resolução":       "bg-orange-50 border-orange-200 text-orange-700",
  "Concluído":          "bg-emerald-50 border-emerald-200 text-emerald-700",
};

const PRIORITY_COLORS = {
  "Alta":  "text-error bg-red-50 border-red-200",
  "Média": "text-amber-700 bg-amber-50 border-amber-200",
  "Baixa": "text-emerald-700 bg-emerald-50 border-emerald-200",
};

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr + "T00:00:00").getTime() - today.getTime()) / 86400000);
}

const INITIAL: LegalProcess[] = [];

export default function LegalPage() {
  const [processes, setProcesses] = useState<LegalProcess[]>(INITIAL);
  const [selected, setSelected] = useState<LegalProcess | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ number: "", title: "", description: "", responsible: "", deadline: "", priority: "Média" as LegalProcess["priority"] });

  const advance = (id: string) => {
    setProcesses(ps => ps.map(p => {
      if (p.id !== id) return p;
      const idx = FLOW.indexOf(p.status);
      if (idx < FLOW.length - 1) return { ...p, status: FLOW[idx + 1] };
      return p;
    }));
    if (selected?.id === id) {
      const updated = processes.find(p => p.id === id)!;
      const idx = FLOW.indexOf(updated.status);
      if (idx < FLOW.length - 1) setSelected({ ...updated, status: FLOW[idx + 1] });
    }
  };

  const runAI = async (p: LegalProcess) => {
    setAiLoading(true);
    try {
      const { analyzeProcess } = await import("@/lib/services/openrouter");
      const analysis = await analyzeProcess(
        `[${p.number}] ${p.title} — ${p.description}`,
        new Date(p.deadline).toLocaleDateString("pt-BR")
      );
      const updated = { ...p, aiAnalysis: analysis };
      setProcesses(prev => prev.map(x => x.id === p.id ? updated : x));
      setSelected(updated);
    } catch {
      alert("Erro ao conectar com a IA. Verifique a chave do OpenRouter.");
    }
    setAiLoading(false);
  };

  const saveProcess = () => {
    if (!form.title.trim()) return;
    
    const cleanForm = {
      number: sanitize(form.number),
      title: sanitize(form.title),
      description: sanitize(form.description),
      responsible: sanitize(form.responsible),
      deadline: sanitize(form.deadline),
      priority: form.priority
    };

    const newP: LegalProcess = { ...cleanForm, id: Date.now().toString(), status: "Recebido", documents: [], aiAnalysis: "", createdAt: new Date().toISOString().split("T")[0] };
    setProcesses(prev => [...prev, newP]);
    setShowForm(false);
    setForm({ number: "", title: "", description: "", responsible: "", deadline: "", priority: "Média" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-widest rounded-full">Esteira Jurídica</span>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface mt-2">
            Processos & <span className="text-gradient">Jurídico</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {processes.filter(p => p.status !== "Concluído").length} ativos · {processes.filter(p => daysUntil(p.deadline) <= 7 && p.status !== "Concluído").length} urgentes
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold">
          <Plus size={18} /> Novo Processo
        </button>
      </div>

      {/* Pipeline visual */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {FLOW.map((step, i) => {
            const count = processes.filter(p => p.status === step).length;
            return (
              <div key={step} className="flex items-center gap-2">
                <div className="text-center px-4 py-2 rounded-xl bg-surface border border-outline-variant/40 min-w-[140px]">
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">{step}</p>
                  <p className="font-heading font-semibold text-2xl text-on-surface">{count}</p>
                </div>
                {i < FLOW.length - 1 && <ChevronRight size={16} className="text-outline-variant shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Process list */}
        <div className="xl:col-span-2 space-y-3">
          {processes.map(p => {
            const days = daysUntil(p.deadline);
            const isUrgent = days <= 7 && p.status !== "Concluído";
            const isOverdue = days < 0 && p.status !== "Concluído";
            return (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className={`group flex items-start gap-4 p-5 bg-surface rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition-all ${isOverdue ? "border-error/40 bg-red-50/30" : isUrgent ? "border-amber-300/60 bg-amber-50/30" : "border-outline-variant/40"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-on-surface-variant">{p.number}</span>
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[p.priority]}`}>{p.priority}</span>
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="font-medium text-sm text-on-surface group-hover:text-primary transition-colors">{p.title}</p>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{p.responsible}</p>
                </div>
                <div className={`text-right shrink-0 text-xs font-semibold rounded-xl px-3 py-1.5 ${isOverdue ? "bg-error/10 text-error" : isUrgent ? "bg-amber-100 text-amber-700" : "bg-surface-container text-on-surface-variant"}`}>
                  {isOverdue ? `${Math.abs(days)}d atrasado` : days === 0 ? "Hoje!" : `${days}d`}
                  <div className="text-xs font-normal">{new Date(p.deadline + "T00:00:00").toLocaleDateString("pt-BR")}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-on-surface-variant">{selected.number}</p>
                    <h3 className="font-medium text-sm text-on-surface mt-0.5">{selected.title}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={13} /></button>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{selected.description}</p>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={12} className="text-on-surface-variant shrink-0" />
                    <span className="text-on-surface-variant">Prazo:</span>
                    <span className="font-medium text-on-surface">{new Date(selected.deadline + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>Responsável:</span><span className="font-medium text-on-surface">{selected.responsible}</span>
                  </div>
                </div>

                {/* Advance step */}
                {selected.status !== "Concluído" && (
                  <button
                    onClick={() => advance(selected.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <ChevronRight size={14} />
                    Avançar para: {FLOW[FLOW.indexOf(selected.status) + 1]}
                  </button>
                )}
                {selected.status === "Concluído" && (
                  <div className="flex items-center gap-2 justify-center text-emerald-600 text-xs font-semibold py-2">
                    <CheckCircle2 size={14} /> Processo Concluído
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-primary" />
                    <p className="text-sm font-semibold text-on-surface">Análise por IA</p>
                  </div>
                  <button
                    onClick={() => runAI(selected)}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white text-sm font-semibold shadow-sm disabled:opacity-60"
                  >
                    {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                    {aiLoading ? "Analisando..." : "Analisar"}
                  </button>
                </div>
                {selected.aiAnalysis ? (
                  <div className="text-xs text-on-surface whitespace-pre-wrap leading-relaxed bg-surface-container-low rounded-xl p-3 max-h-64 overflow-y-auto">
                    {selected.aiAnalysis}
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant text-center py-4">Clique em "Analisar" para gerar um relatório com IA sobre este processo.</p>
                )}
              </div>
            </>
          ) : (
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 text-center text-on-surface-variant">
              <FileText size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Clique num processo para ver os detalhes e análise da IA.</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900/80 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-lg p-8 space-y-5 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-white">Novo Processo</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Nº do Processo</label>
                <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" placeholder="Ex: 0000000-00.0000..." value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Prioridade</label>
                <select className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as LegalProcess["priority"] })}>
                  {["Alta","Média","Baixa"].map(p => <option key={p} className="bg-zinc-800 text-white">{p}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Título do processo *</label>
              <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="Ex: Defesa Prévia - Paciente X" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Descrição / Contexto</label>
              <textarea className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner resize-none h-24" placeholder="Detalhes do caso..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Responsável</label>
                <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="Dr. Nome" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Prazo</label>
                <input type="date" className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all">Cancelar</button>
              <button onClick={saveProcess} className="flex-1 btn-gradient py-3 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)]">Criar Processo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
