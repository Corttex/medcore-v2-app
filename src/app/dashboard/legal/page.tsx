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

const INITIAL: LegalProcess[] = [
  { id: "1", number: "PROC-2026-001", title: "Revisão de Contrato de Prestação de Serviços", description: "Contrato com fornecedor de equipamentos médicos vence em maio. Necessita revisão de cláusulas de SLA e penalidades.", responsible: "Adm. Geral", deadline: "2026-05-01", status: "Análise Interna", priority: "Alta", documents: ["Contrato_v2.pdf"], aiAnalysis: "", createdAt: "2026-04-01" },
  { id: "2", number: "PROC-2026-002", title: "Notificação ANVISA — Vigilância Sanitária", description: "Resposta à notificação N° 4421 sobre conformidade de esterilização.", responsible: "Dra. Helena", deadline: "2026-04-20", status: "Enviado ao Jurídico", priority: "Alta", documents: ["Notificacao_ANVISA.pdf"], aiAnalysis: "", createdAt: "2026-04-05" },
  { id: "3", number: "PROC-2026-003", title: "Renovação de Alvará de Funcionamento", description: "Alvará vence em julho. Documentação em separação.", responsible: "Adm. Legal", deadline: "2026-06-15", status: "Recebido", priority: "Média", documents: [], aiAnalysis: "", createdAt: "2026-04-08" },
];

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
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Esteira Jurídica</span>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
            Processos & <span className="text-gradient">Jurídico</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {processes.filter(p => p.status !== "Concluído").length} ativos · {processes.filter(p => daysUntil(p.deadline) <= 7 && p.status !== "Concluído").length} urgentes
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black">
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
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{step}</p>
                  <p className="font-heading font-black text-2xl text-on-surface">{count}</p>
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
                    <span className="text-[10px] font-black text-on-surface-variant">{p.number}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[p.priority]}`}>{p.priority}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{p.title}</p>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{p.responsible}</p>
                </div>
                <div className={`text-right shrink-0 text-xs font-black rounded-xl px-3 py-1.5 ${isOverdue ? "bg-error/10 text-error" : isUrgent ? "bg-amber-100 text-amber-700" : "bg-surface-container text-on-surface-variant"}`}>
                  {isOverdue ? `${Math.abs(days)}d atrasado` : days === 0 ? "Hoje!" : `${days}d`}
                  <div className="text-[9px] font-normal">{new Date(p.deadline + "T00:00:00").toLocaleDateString("pt-BR")}</div>
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
                    <p className="text-[10px] font-black text-on-surface-variant">{selected.number}</p>
                    <h3 className="font-bold text-sm text-on-surface mt-0.5">{selected.title}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={13} /></button>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{selected.description}</p>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={12} className="text-on-surface-variant shrink-0" />
                    <span className="text-on-surface-variant">Prazo:</span>
                    <span className="font-bold text-on-surface">{new Date(selected.deadline + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>Responsável:</span><span className="font-bold text-on-surface">{selected.responsible}</span>
                  </div>
                </div>

                {/* Advance step */}
                {selected.status !== "Concluído" && (
                  <button
                    onClick={() => advance(selected.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black hover:bg-primary/20 transition-colors"
                  >
                    <ChevronRight size={14} />
                    Avançar para: {FLOW[FLOW.indexOf(selected.status) + 1]}
                  </button>
                )}
                {selected.status === "Concluído" && (
                  <div className="flex items-center gap-2 justify-center text-emerald-600 text-xs font-black py-2">
                    <CheckCircle2 size={14} /> Processo Concluído
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-primary" />
                    <p className="text-sm font-black text-on-surface">Análise por IA</p>
                  </div>
                  <button
                    onClick={() => runAI(selected)}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white text-[10px] font-black shadow-sm disabled:opacity-60"
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
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl w-full max-w-lg p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black text-on-surface">Novo Processo</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nº do Processo" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
              <select className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as LegalProcess["priority"] })}>
                {["Alta","Média","Baixa"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Título do processo *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none h-24" placeholder="Descrição / contexto..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Responsável" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} />
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Prazo</label>
                <input type="date" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold">Cancelar</button>
              <button onClick={saveProcess} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black">Criar Processo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
